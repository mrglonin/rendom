const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const { config } = require("./config");
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

const META_COLUMNS = [
  "Тип билета",
  "Цена",
  "Промо-код",
  "Дата сеанса",
];

function normalizeFilterValue(value) {
  return String(value ?? "").trim();
}

function getSessionPath(sessionId) {
  return path.join(config.sessionsDir, `${sessionId}.json`);
}

function saveSession(session) {
  const nextSession = {
    ...session,
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

  return JSON.parse(fs.readFileSync(sessionPath, "utf8"));
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
          }),
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

function serializeRecord(record, displayColumn) {
  return {
    recordId: record.__recordId,
    rowNumber: record.__rowNumber,
    displayValue: String(record[displayColumn] || record["Код билета"] || record["ID билета"] || ""),
    meta: buildRecordMeta(record),
  };
}

function buildSessionSummary(session) {
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
      excludedRecords: session.excludedRecordIds.length,
      activeRecords: Math.max(session.records.length - session.excludedRecordIds.length, 0),
      draws: session.draws.length,
    },
    lastDraw: session.draws.at(-1) || null,
  };
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
    },
    filters: buildFilterDefinitions(parsedReport.records, parsedReport.columns),
    records: parsedReport.records,
    excludedRecordIds: [],
    draws: [],
  };

  storeLogger.info("Session created", {
    sessionId: session.id,
    fileName: originalName,
    rows: session.records.length,
  });

  return saveSession(session);
}

function getActiveRecords(session) {
  const excludedIds = new Set(session.excludedRecordIds);
  return session.records.filter((record) => !excludedIds.has(record.__recordId));
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
    Object.entries(normalizedFilters).every(([columnName, value]) => normalizeFilterValue(record[columnName]) === value),
  );
}

function createPreview(session, { displayColumn, filters, limit = config.previewLimit }) {
  const safeDisplayColumn = session.columns.includes(displayColumn)
    ? displayColumn
    : session.defaults.displayColumn;
  const activeRecords = getActiveRecords(session);
  const eligibleRecords = applyFilters(activeRecords, filters);

  return {
    displayColumn: safeDisplayColumn,
    activeCount: activeRecords.length,
    eligibleCount: eligibleRecords.length,
    filters: filters || {},
    preview: eligibleRecords.slice(0, limit).map((record) => serializeRecord(record, safeDisplayColumn)),
  };
}

function excludeWinnerIds(session, winnerIds) {
  const excludedIds = new Set(session.excludedRecordIds);

  winnerIds.forEach((winnerId) => {
    excludedIds.add(winnerId);
  });

  return {
    ...session,
    excludedRecordIds: Array.from(excludedIds),
  };
}

module.exports = {
  applyFilters,
  buildSessionSummary,
  createPreview,
  createSession,
  excludeWinnerIds,
  getActiveRecords,
  loadSession,
  saveSession,
  serializeRecord,
};
