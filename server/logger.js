const fs = require("fs");
const path = require("path");

const { config } = require("./config");

const logFilePath = path.join(config.logsDir, "app.log");

function serializeMeta(meta) {
  if (!meta || Object.keys(meta).length === 0) {
    return "";
  }

  try {
    return ` ${JSON.stringify(meta)}`;
  } catch (error) {
    return ` {"metaSerializationError":"${error.message}"}`;
  }
}

function write(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const line = `${timestamp} [${level.toUpperCase()}] ${message}${serializeMeta(meta)}`;
  const outputMethod = level === "error" ? console.error : console.log;

  outputMethod(line);
  fs.appendFileSync(logFilePath, `${line}\n`, "utf8");
}

function createScopedLogger(scope) {
  return {
    debug(message, meta) {
      write("debug", `[${scope}] ${message}`, meta);
    },
    info(message, meta) {
      write("info", `[${scope}] ${message}`, meta);
    },
    warn(message, meta) {
      write("warn", `[${scope}] ${message}`, meta);
    },
    error(message, meta) {
      write("error", `[${scope}] ${message}`, meta);
    },
  };
}

const logger = createScopedLogger("app");

function requestLogger(request, response, next) {
  const startedAt = Date.now();

  response.on("finish", () => {
    logger.info("HTTP request completed", {
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
}

module.exports = {
  logger,
  createScopedLogger,
  requestLogger,
};
