const XLSX = require("xlsx");

const HEADER_HINTS = new Set([
  "ID билета",
  "Событие",
  "Место",
  "Сеанс",
  "Дата сеанса",
  "Зал",
  "Сектор",
  "Ряд",
  "Номер",
  "Цена",
  "Тип билета",
  "Дисконт",
  "ID продажи",
  "Дата резерва",
  "Дата продажи",
  "Тип продажи",
  "Проверка",
  "Распространитель",
  "Код билета",
  "Владелец",
  "Промо-код",
]);

const DEFAULT_DISPLAY_COLUMN_CANDIDATES = [
  "Код билета",
  "ID билета",
  "ID продажи",
  "Промо-код",
];

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeHeaders(rawHeaders) {
  const counters = new Map();

  return rawHeaders.map((header) => {
    const normalizedHeader = normalizeText(header);

    if (!normalizedHeader) {
      return "";
    }

    const nextCount = (counters.get(normalizedHeader) || 0) + 1;
    counters.set(normalizedHeader, nextCount);

    if (nextCount === 1) {
      return normalizedHeader;
    }

    return `${normalizedHeader} (${nextCount})`;
  });
}

function scoreHeaderRow(row) {
  const normalizedCells = row.map((cell) => normalizeText(cell)).filter(Boolean);
  const nonEmptyCount = normalizedCells.length;
  const headerMatchCount = normalizedCells.filter((cell) => HEADER_HINTS.has(cell)).length;

  return {
    score: headerMatchCount * 20 + nonEmptyCount,
    headerMatchCount,
    nonEmptyCount,
  };
}

function detectHeaderRow(rows) {
  let bestCandidate = null;

  rows.slice(0, 30).forEach((row, index) => {
    const candidate = scoreHeaderRow(row);

    if (candidate.nonEmptyCount < 5) {
      return;
    }

    if (!bestCandidate || candidate.score > bestCandidate.score) {
      bestCandidate = {
        ...candidate,
        index,
      };
    }
  });

  if (!bestCandidate || bestCandidate.headerMatchCount === 0) {
    return -1;
  }

  return bestCandidate.index;
}

function pickDefaultDisplayColumn(columns) {
  for (const candidate of DEFAULT_DISPLAY_COLUMN_CANDIDATES) {
    if (columns.includes(candidate)) {
      return candidate;
    }
  }

  return columns[0] || "";
}

function parseExcelReport(filePath) {
  const workbook = XLSX.readFile(filePath, {
    cellDates: false,
    raw: false,
  });

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("В файле не найдено ни одного листа");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: true,
    raw: false,
  });

  const headerRowIndex = detectHeaderRow(rows);

  if (headerRowIndex === -1) {
    throw new Error("Не удалось определить строку заголовков в Excel-файле");
  }

  const columns = dedupeHeaders(rows[headerRowIndex]);
  const visibleColumns = columns.filter(Boolean);
  const records = [];

  for (let index = headerRowIndex + 1; index < rows.length; index += 1) {
    const row = rows[index];
    const record = {
      __recordId: `row-${index + 1}`,
      __rowNumber: index + 1,
    };

    let hasMeaningfulValue = false;

    columns.forEach((columnName, columnIndex) => {
      if (!columnName) {
        return;
      }

      const value = normalizeText(row[columnIndex]);
      record[columnName] = value;

      if (value) {
        hasMeaningfulValue = true;
      }
    });

    if (hasMeaningfulValue) {
      records.push(record);
    }
  }

  if (records.length === 0) {
    throw new Error("В файле нет строк для розыгрыша после строки заголовков");
  }

  return {
    sheetName,
    headerRowNumber: headerRowIndex + 1,
    metadataLines: rows.slice(0, headerRowIndex).map((row) => row.map((value) => normalizeText(value)).join(" ").trim()),
    columns: visibleColumns,
    defaultDisplayColumn: pickDefaultDisplayColumn(visibleColumns),
    records,
  };
}

module.exports = {
  parseExcelReport,
};
