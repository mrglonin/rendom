const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const { config } = require("./config");
const { getGlobalWinnerCount, getGlobalWinnerKeySet } = require("./global-store");
const { createScopedLogger } = require("./logger");

const storeLogger = createScopedLogger("session-store");

const FILTER_PRIORITY = [
  "Событие",
  "Дата сеанса",
  "Тип билета",
  "Тип продажи",
  "Промо-код",
  "Цена",
  "Место",
  "Зал",
  "Сектор",
  "Дисконт",
  "Проверка",
  "Владелец",
];

const META_COLUMNS = ["Тип билета", "Цена", "Промо-код", "Дата сеанса"];
const DEFAULT_DEDUPLICATION_COLUMN_CANDIDATES = [
  "Код билета",
  "ID билета",
  "ID продажи",
  "Промо-код",
  "Владелец",
];

function normalizeFilterValue(value) {
  return String(value ?? "").trim();
}

function pickDefaultDeduplicationColumn(columns) {
  for (const candidate of DEFAULT_DEDUPLICATION_COLUMN_CANDIDATES) {
    if (columns.includes(candidate)) {
      return candidate;
    }
  }

  return columns[0] || "";
}

function buildWinnerHistoryEntry(winner, draw, index) {
  return {
    id: winner.historyEntryId || `${draw.id}:${index}`,
    drawId: draw.id,
    createdAt: draw.createdAt,
    recordId: winner.recordId,
    displayValue: winner.displayValue,
    dedupeValue: winner.dedupeValue || "",
    meta: Array.isArray(winner.meta) ? winner.meta : [],
  };
}

function getSessionPath(sessionId) {
  return path.join(config.sessionsDir, `${sessionId}.json`);
}

function buildFilterDefinitions(records, columns) {
  return FILTER_PRIORITY.filter((columnName) => columns.includes(columnName))
    .map((columnName) => {
      const counter = new Map();

      records.forEach((record) => {
        const value = normalizeFilterValue(record[columnName]);

        if (!value) {
          return;
        }

        counter.set(value, (counter.get(value) || 0) + 1);
      });

      if (counter.size < 2 || counter.size > 100) {
        return null;
      }

      const options = Array.from(counter.entries())
        .sort((left, right) =>
          left[0].localeCompare(right[0], "ru", {
            numeric: true,
            sensitivity: "base",
          })
        )
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }));

      return {
        column: columnName,
        label: columnName,
        options,
      };
    })
    .filter(Boolean);
}

function buildRecordMeta(record) {
  return META_COLUMNS.map((columnName) => String(record[columnName] || "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

function getSafeDisplayColumn(session) {
  const columns = Array.isArray(session?.columns) ? session.columns : [];
  const displayColumn = String(session?.defaults?.displayColumn || "").trim();

  if (displayColumn && columns.includes(displayColumn)) {
    return displayColumn;
  }

  return columns[0] || "";
}

function getSafeDeduplicationColumn(session) {
  const columns = Array.isArray(session?.columns) ? session.columns : [];
  const dedupeColumn = String(session?.defaults?.dedupeColumn || "").trim();

  if (dedupeColumn && columns.includes(dedupeColumn)) {
    return dedupeColumn;
  }

  return pickDefaultDeduplicationColumn(columns);
}

function getRecordDeduplicationValue(record, dedupeColumn, displayColumn = "") {
  const candidateColumns = [
    dedupeColumn,
    "Код билета",
    "ID билета",
    "ID продажи",
    "Промо-код",
    displayColumn,
  ].filter(Boolean);

  for (const columnName of candidateColumns) {
    const value = normalizeFilterValue(record?.[columnName]);

    if (value) {
      return value;
    }
  }

  return normalizeFilterValue(record?.__recordId || record?.__rowNumber || "");
}

function serializeRecord(record, displayColumn, dedupeColumn) {
  const safeDisplayValue = String(
    record?.[displayColumn] || record?.["Код билета"] || record?.["ID билета"] || ""
  ).trim();

  return {
    recordId: record.__recordId,
    rowNumber: record.__rowNumber,
    displayValue: safeDisplayValue,
    dedupeValue: getRecordDeduplicationValue(record, dedupeColumn, displayColumn),
    meta: buildRecordMeta(record),
  };
}

function getRecordMap(session) {
  return new Map(
    (Array.isArray(session?.records) ? session.records : []).map((record) => [
      record.__recordId,
      record,
    ])
  );
}

function hydrateDraw(draw, recordMap, session) {
  const displayColumn =
    Array.isArray(session?.columns) && session.columns.includes(draw?.displayColumn)
      ? draw.displayColumn
      : getSafeDisplayColumn(session);
  const dedupeColumn = getSafeDeduplicationColumn(session);
  const winners = Array.isArray(draw?.winners) ? draw.winners : [];

  return {
    ...draw,
    displayColumn,
    filters: draw?.filters || {},
    globalContributionKeys: Array.isArray(draw?.globalContributionKeys)
      ? draw.globalContributionKeys
      : [],
    winners: winners.map((winner, index) => {
      const record = recordMap.get(winner.recordId);
      const serializedRecord = record
        ? serializeRecord(record, displayColumn, dedupeColumn)
        : {
            recordId: winner.recordId,
            rowNumber: winner.rowNumber,
            displayValue: String(winner.displayValue || "").trim(),
            dedupeValue: String(winner.dedupeValue || "").trim(),
            meta: Array.isArray(winner.meta) ? winner.meta : [],
          };

      return {
        ...serializedRecord,
        ...winner,
        displayValue: String(winner.displayValue || serializedRecord.displayValue || "").trim(),
        dedupeValue: String(winner.dedupeValue || serializedRecord.dedupeValue || "").trim(),
        meta: Array.isArray(winner.meta) ? winner.meta : serializedRecord.meta,
        historyEntryId: winner.historyEntryId || `${draw.id}:${index + 1}`,
      };
    }),
  };
}

function getWinnerHistory(session) {
  const draws = Array.isArray(session?.draws) ? session.draws : [];

  if (Array.isArray(session?.winnerHistory) && session.winnerHistory.length > 0) {
    return session.winnerHistory.map((entry) => ({
      id: entry.id,
      drawId: entry.drawId,
      createdAt: entry.createdAt,
      recordId: entry.recordId,
      displayValue: entry.displayValue,
      dedupeValue: entry.dedupeValue || "",
      meta: Array.isArray(entry.meta) ? entry.meta : [],
    }));
  }

  return draws.flatMap((draw) =>
    (Array.isArray(draw.winners) ? draw.winners : []).map((winner, index) =>
      buildWinnerHistoryEntry(winner, draw, index + 1)
    )
  );
}

function hydrateSession(session) {
  const safeDisplayColumn = getSafeDisplayColumn(session);
  const safeDeduplicationColumn = getSafeDeduplicationColumn(session);
  const recordMap = getRecordMap(session);
  const draws = (Array.isArray(session?.draws) ? session.draws : []).map((draw) =>
    hydrateDraw(draw, recordMap, {
      ...session,
      defaults: {
        ...session?.defaults,
        displayColumn: safeDisplayColumn,
        dedupeColumn: safeDeduplicationColumn,
      },
    })
  );
  const winnerHistory = getWinnerHistory({
    ...session,
    draws,
  });

  return {
    ...session,
    version: config.sessionVersion,
    defaults: {
      ...session?.defaults,
      displayColumn: safeDisplayColumn,
      dedupeColumn: safeDeduplicationColumn,
    },
    records: Array.isArray(session?.records) ? session.records : [],
    filters: Array.isArray(session?.filters) ? session.filters : [],
    draws,
    winnerHistory,
    excludedRecordIds: Array.isArray(session?.excludedRecordIds) ? session.excludedRecordIds : [],
  };
}

function saveSession(session) {
  const nextSession = {
    ...hydrateSession(session),
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(getSessionPath(nextSession.id), JSON.stringify(nextSession, null, 2), "utf8");
  return nextSession;
}

function loadSession(sessionId) {
  const sessionPath = getSessionPath(sessionId);

  if (!fs.existsSync(sessionPath)) {
    return null;
  }

  return hydrateSession(JSON.parse(fs.readFileSync(sessionPath, "utf8")));
}

function deleteSession(sessionId) {
  const sessionPath = getSessionPath(sessionId);

  if (!fs.existsSync(sessionPath)) {
    return false;
  }

  fs.unlinkSync(sessionPath);
  return true;
}

function createSession({ originalName, savedFileName, fileSize, parsedReport }) {
  const now = new Date().toISOString();
  const session = {
    version: config.sessionVersion,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    source: {
      originalName,
      savedFileName,
      fileSize,
      sheetName: parsedReport.sheetName,
      headerRowNumber: parsedReport.headerRowNumber,
      metadataLines: parsedReport.metadataLines,
    },
    columns: parsedReport.columns,
    defaults: {
      displayColumn: parsedReport.defaultDisplayColumn,
      dedupeColumn: parsedReport.defaultDeduplicationColumn,
    },
    filters: buildFilterDefinitions(parsedReport.records, parsedReport.columns),
    records: parsedReport.records,
    excludedRecordIds: [],
    draws: [],
    winnerHistory: [],
  };

  storeLogger.info("Session created", {
    sessionId: session.id,
    fileName: originalName,
    rows: session.records.length,
    dedupeColumn: session.defaults.dedupeColumn,
  });

  return saveSession(session);
}

function getExcludedRecordIds(session, globalState) {
  const globalWinnerKeys = getGlobalWinnerKeySet(globalState);
  const dedupeColumn = getSafeDeduplicationColumn(session);
  const displayColumn = getSafeDisplayColumn(session);

  return (Array.isArray(session?.records) ? session.records : [])
    .filter((record) =>
      globalWinnerKeys.has(getRecordDeduplicationValue(record, dedupeColumn, displayColumn))
    )
    .map((record) => record.__recordId);
}

function getActiveRecords(session, globalState) {
  const blockedRecordIds = new Set(getExcludedRecordIds(session, globalState));

  return (Array.isArray(session?.records) ? session.records : []).filter(
    (record) => !blockedRecordIds.has(record.__recordId)
  );
}

function applyFilters(records, filters = {}) {
  const normalizedFilters = Object.entries(filters).reduce((accumulator, [columnName, value]) => {
    const normalizedValue = normalizeFilterValue(value);

    if (!normalizedValue) {
      return accumulator;
    }

    accumulator[columnName] = normalizedValue;
    return accumulator;
  }, {});

  return records.filter((record) =>
    Object.entries(normalizedFilters).every(
      ([columnName, value]) => normalizeFilterValue(record[columnName]) === value
    )
  );
}

function createPreview(
  session,
  { displayColumn, filters, limit = config.previewLimit },
  globalState
) {
  const safeDisplayColumn =
    Array.isArray(session?.columns) && session.columns.includes(displayColumn)
      ? displayColumn
      : getSafeDisplayColumn(session);
  const activeRecords = getActiveRecords(session, globalState);
  const eligibleRecords = applyFilters(activeRecords, filters);

  return {
    displayColumn: safeDisplayColumn,
    activeCount: activeRecords.length,
    eligibleCount: eligibleRecords.length,
    filters: filters || {},
    preview: eligibleRecords
      .slice(0, limit)
      .map((record) =>
        serializeRecord(record, safeDisplayColumn, getSafeDeduplicationColumn(session))
      ),
  };
}

function buildSessionSummary(session, globalState) {
  const winnerHistory = getWinnerHistory(session);
  const excludedRecordIds = getExcludedRecordIds(session, globalState);
  const draws = Array.isArray(session?.draws) ? session.draws : [];

  return {
    id: session.id,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    source: session.source,
    columns: session.columns,
    defaults: session.defaults,
    filters: session.filters,
    counts: {
      totalRecords: session.records.length,
      excludedRecords: excludedRecordIds.length,
      activeRecords: Math.max(session.records.length - excludedRecordIds.length, 0),
      draws: draws.length,
      winnerHistory: winnerHistory.length,
      globalWinnerKeys: getGlobalWinnerCount(globalState),
    },
    lastDraw: draws.at(-1) || null,
    winnerHistory,
  };
}

module.exports = {
  applyFilters,
  buildSessionSummary,
  buildWinnerHistoryEntry,
  createPreview,
  createSession,
  getActiveRecords,
  getExcludedRecordIds,
  getSafeDeduplicationColumn,
  getWinnerHistory,
  deleteSession,
  loadSession,
  saveSession,
  serializeRecord,
};
