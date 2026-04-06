const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const { config, ensureRuntimeDirs } = require("./config");
const { parseExcelReport } = require("./excel-parser");
const {
  addGlobalWinners,
  loadGlobalState,
  removeGlobalWinnerKeys,
  resetGlobalState,
  saveGlobalState,
} = require("./global-store");
const { logger, requestLogger } = require("./logger");
const { pickWinners, sortDrawResults } = require("./randomizer");
const {
  applyFilters,
  buildWinnerHistoryEntry,
  buildSessionSummary,
  createPreview,
  createSession,
  getActiveRecords,
  getSafeDeduplicationColumn,
  getWinnerHistory,
  loadSession,
  saveSession,
  serializeRecord,
} = require("./session-store");

ensureRuntimeDirs();

const app = express();

function stripPreviewPrefix(url) {
  const [pathname, search = ""] = String(url || "").split("?");
  const normalizedPathname = pathname.replace(
    /^\/plesk-site-preview\/[^/]+\/https?\/[^/]+(?=\/|$)/,
    ""
  );

  if (normalizedPathname === pathname) {
    return url;
  }

  const nextPathname = normalizedPathname || "/";

  return search ? `${nextPathname}?${search}` : nextPathname;
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, callback) => {
      callback(null, config.uploadsDir);
    },
    filename: (_, file, callback) => {
      const normalizedName = normalizeOriginalFileName(file.originalname);
      const safeBaseName = path.basename(normalizedName).replace(/[^a-zA-Z0-9._-а-яА-ЯёЁ]/g, "_");
      callback(null, `${Date.now()}-${safeBaseName}`);
    },
  }),
  limits: {
    fileSize: config.maxUploadSizeBytes,
  },
  fileFilter: (_, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isAllowed = [".xlsx", ".xls"].includes(extension);

    if (!isAllowed) {
      callback(new Error("Можно загружать только Excel-файлы .xlsx или .xls"));
      return;
    }

    callback(null, true);
  },
});

app.use(express.json({ limit: "1mb" }));
app.use((request, _, next) => {
  request.url = stripPreviewPrefix(request.url);
  next();
});
app.use(requestLogger);

function createHttpError(statusCode, message, details = undefined) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

function normalizeOriginalFileName(fileName) {
  if (!/[ÐÑ]/.test(fileName)) {
    return fileName;
  }

  return Buffer.from(fileName, "latin1").toString("utf8");
}

function parseBoolean(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function parseWinnersCount(value) {
  const parsed = Number.parseInt(String(value ?? "1"), 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    throw createHttpError(400, "Количество победителей должно быть больше нуля");
  }

  return parsed;
}

function getSessionOrThrow(sessionId) {
  const session = loadSession(sessionId);

  if (!session) {
    throw createHttpError(404, "Сессия не найдена. Загрузите файл заново.");
  }

  return session;
}

app.get("/api/health", (_, response) => {
  response.json({
    ok: true,
    startedAt: new Date().toISOString(),
  });
});

app.post("/api/import", upload.single("reportFile"), (request, response, next) => {
  try {
    if (!request.file) {
      throw createHttpError(400, "Файл не был загружен");
    }

    const originalName = normalizeOriginalFileName(request.file.originalname);
    const parsedReport = parseExcelReport(request.file.path);
    const session = createSession({
      originalName,
      savedFileName: request.file.filename,
      fileSize: request.file.size,
      parsedReport,
    });
    const globalState = loadGlobalState();

    logger.info("Excel import completed", {
      sessionId: session.id,
      fileName: originalName,
      rows: session.records.length,
    });

    response.json({
      ok: true,
      session: buildSessionSummary(session, globalState),
      preview: createPreview(
        session,
        {
          displayColumn: session.defaults.displayColumn,
          filters: {},
        },
        globalState
      ),
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/sessions/:sessionId", (request, response, next) => {
  try {
    const session = getSessionOrThrow(request.params.sessionId);
    const globalState = loadGlobalState();

    response.json({
      ok: true,
      session: buildSessionSummary(session, globalState),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/sessions/:sessionId/settings", (request, response, next) => {
  try {
    const session = getSessionOrThrow(request.params.sessionId);
    const globalState = loadGlobalState();
    const displayColumn = String(request.body.displayColumn || "").trim();

    if (!displayColumn || !session.columns.includes(displayColumn)) {
      throw createHttpError(400, "Выберите корректное поле из Excel для розыгрыша");
    }

    const nextSession = saveSession({
      ...session,
      defaults: {
        ...session.defaults,
        displayColumn,
      },
    });

    logger.info("Session settings updated", {
      sessionId: session.id,
      displayColumn,
    });

    response.json({
      ok: true,
      session: buildSessionSummary(nextSession, globalState),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/sessions/:sessionId/preview", (request, response, next) => {
  try {
    const session = getSessionOrThrow(request.params.sessionId);
    const globalState = loadGlobalState();
    const preview = createPreview(
      session,
      {
        displayColumn: request.body.displayColumn,
        filters: request.body.filters,
        limit: request.body.limit,
      },
      globalState
    );

    logger.debug("Preview generated", {
      sessionId: session.id,
      displayColumn: preview.displayColumn,
      eligibleCount: preview.eligibleCount,
    });

    response.json({
      ok: true,
      preview,
      session: buildSessionSummary(session, globalState),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/sessions/:sessionId/draw", (request, response, next) => {
  try {
    const session = getSessionOrThrow(request.params.sessionId);
    const globalState = loadGlobalState();
    const displayColumn = session.columns.includes(request.body.displayColumn)
      ? request.body.displayColumn
      : session.defaults.displayColumn;
    const dedupeColumn = getSafeDeduplicationColumn(session);
    const filters = request.body.filters || {};
    const winnersCount = parseWinnersCount(request.body.winnersCount);
    const sortResults = ["no", "asc", "desc"].includes(request.body.sortResults)
      ? request.body.sortResults
      : "no";
    const removeWinners =
      request.body.removeWinners === "yes" || parseBoolean(request.body.removeWinners);
    const activeRecords = getActiveRecords(session, globalState);
    const eligibleRecords = applyFilters(activeRecords, filters);

    if (eligibleRecords.length === 0) {
      throw createHttpError(400, "По текущим фильтрам нет записей для розыгрыша");
    }

    if (winnersCount > eligibleRecords.length) {
      throw createHttpError(
        400,
        `Нельзя выбрать ${winnersCount} победителей: доступно только ${eligibleRecords.length} записей`
      );
    }

    const winners = sortDrawResults(
      pickWinners(eligibleRecords, winnersCount),
      displayColumn,
      sortResults
    );
    const serializedWinners = winners.map((record) =>
      serializeRecord(record, displayColumn, dedupeColumn)
    );
    const draw = {
      id: `draw-${Date.now()}`,
      createdAt: new Date().toISOString(),
      displayColumn,
      dedupeColumn,
      filters,
      winnersCount,
      sortResults,
      removeWinners,
      appliedRemoval: false,
      globalContributionKeys: [],
      activeCountBeforeDraw: activeRecords.length,
      eligibleCountAtDraw: eligibleRecords.length,
      winners: serializedWinners,
    };
    const winnerHistoryEntries = draw.winners.map((winner, index) =>
      buildWinnerHistoryEntry(winner, draw, index + 1)
    );
    let nextGlobalState = globalState;

    if (removeWinners) {
      const { nextState, addedKeys } = addGlobalWinners(globalState, draw.winners, {
        sessionId: session.id,
        drawId: draw.id,
        createdAt: draw.createdAt,
        dedupeColumn,
        displayColumn,
      });

      draw.appliedRemoval = addedKeys.length > 0;
      draw.globalContributionKeys = addedKeys;
      nextGlobalState = saveGlobalState(nextState);
    }

    const nextSession = saveSession({
      ...session,
      draws: [...(session.draws || []), draw],
      winnerHistory: [...getWinnerHistory(session), ...winnerHistoryEntries],
      excludedRecordIds: [],
    });

    logger.info("Draw completed", {
      sessionId: session.id,
      drawId: draw.id,
      winnersCount,
      removeWinners,
      dedupeColumn,
      globalAddedCount: draw.globalContributionKeys.length,
      eligibleCount: eligibleRecords.length,
    });

    response.json({
      ok: true,
      draw,
      session: buildSessionSummary(nextSession, nextGlobalState),
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/sessions/:sessionId/draws/:drawId", (request, response, next) => {
  try {
    const session = getSessionOrThrow(request.params.sessionId);
    const globalState = loadGlobalState();
    const draw = session.draws.find((item) => item.id === request.params.drawId);

    if (!draw) {
      throw createHttpError(404, "Результат розыгрыша не найден");
    }

    response.json({
      ok: true,
      draw,
      session: buildSessionSummary(session, globalState),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/sessions/:sessionId/exclude-draw", (request, response, next) => {
  try {
    const session = getSessionOrThrow(request.params.sessionId);
    const draw = session.draws.find((item) => item.id === request.body.drawId);

    if (!draw) {
      throw createHttpError(404, "Розыгрыш для исключения не найден");
    }

    if (draw.appliedRemoval) {
      const globalState = loadGlobalState();

      response.json({
        ok: true,
        session: buildSessionSummary(session, globalState),
        draw,
      });
      return;
    }

    const globalState = loadGlobalState();
    const dedupeColumn = getSafeDeduplicationColumn(session);
    const { nextState, addedKeys } = addGlobalWinners(globalState, draw.winners, {
      sessionId: session.id,
      drawId: draw.id,
      createdAt: draw.createdAt,
      dedupeColumn,
      displayColumn: draw.displayColumn,
    });
    const nextDraw = {
      ...draw,
      appliedRemoval: addedKeys.length > 0,
      removeWinners: true,
      globalContributionKeys: addedKeys,
    };
    const nextGlobalState = saveGlobalState(nextState);
    const nextSession = saveSession({
      ...session,
      draws: session.draws.map((item) => (item.id === draw.id ? nextDraw : item)),
      excludedRecordIds: [],
      winnerHistory: getWinnerHistory(session),
    });

    logger.info("Draw winners excluded globally", {
      sessionId: session.id,
      drawId: draw.id,
      excludedCount: addedKeys.length,
    });

    response.json({
      ok: true,
      session: buildSessionSummary(nextSession, nextGlobalState),
      draw: nextDraw,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/sessions/:sessionId/undo-last-draw", (request, response, next) => {
  try {
    const session = getSessionOrThrow(request.params.sessionId);
    const lastDraw = Array.isArray(session.draws) ? session.draws.at(-1) : null;

    if (!lastDraw) {
      throw createHttpError(400, "Для текущего файла пока нет розыгрыша, который можно отменить");
    }

    const globalState = loadGlobalState();
    const candidateKeys =
      Array.isArray(lastDraw.globalContributionKeys) && lastDraw.globalContributionKeys.length > 0
        ? lastDraw.globalContributionKeys
        : lastDraw.winners.map((winner) => winner.dedupeValue).filter(Boolean);
    const { nextState, removedKeys } = removeGlobalWinnerKeys(
      globalState,
      candidateKeys,
      lastDraw.id
    );
    const nextGlobalState = saveGlobalState(nextState);
    const nextSession = saveSession({
      ...session,
      draws: session.draws.slice(0, -1),
      winnerHistory: getWinnerHistory(session).filter((entry) => entry.drawId !== lastDraw.id),
      excludedRecordIds: [],
    });

    logger.info("Last draw undone", {
      sessionId: session.id,
      drawId: lastDraw.id,
      removedGlobalKeys: removedKeys.length,
    });

    response.json({
      ok: true,
      undoneDraw: lastDraw,
      session: buildSessionSummary(nextSession, nextGlobalState),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/sessions/:sessionId/reset-exclusions", (request, response, next) => {
  try {
    const session = getSessionOrThrow(request.params.sessionId);
    const nextGlobalState = resetGlobalState();
    const nextSession = saveSession({
      ...session,
      excludedRecordIds: [],
      winnerHistory: [],
      draws: [],
    });

    logger.info("Session exclusions reset", {
      sessionId: session.id,
      globalWinnerKeysCleared: true,
    });

    response.json({
      ok: true,
      session: buildSessionSummary(nextSession, nextGlobalState),
    });
  } catch (error) {
    next(error);
  }
});

app.get(["/", "/random", "/random.html"], (_, response) => {
  response.sendFile(path.join(config.distDir, "random.html"));
});

app.get(["/results", "/results.html"], (_, response) => {
  response.sendFile(path.join(config.distDir, "results.html"));
});

app.use(express.static(config.distDir));

app.use((request, response, next) => {
  if (request.path.startsWith("/api/")) {
    next(createHttpError(404, "Маршрут API не найден"));
    return;
  }

  response.sendFile(path.join(config.distDir, "index.html"));
});

app.use((error, request, response, _) => {
  const statusCode = error.statusCode || 500;

  logger.error("Unhandled request error", {
    method: request.method,
    path: request.originalUrl,
    statusCode,
    message: error.message,
    details: error.details,
  });

  response.status(statusCode).json({
    ok: false,
    error: error.message || "Внутренняя ошибка сервера",
    details: error.details,
  });
});

if (!fs.existsSync(config.distDir)) {
  logger.warn("dist directory is missing. Run `npm run build` before `npm start`.", {
    distDir: config.distDir,
  });
}

app.listen(config.port, config.host, () => {
  logger.info("Runtime server started", {
    host: config.host,
    port: config.port,
    distDir: config.distDir,
  });
});
