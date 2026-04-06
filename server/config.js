const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const storageDir = path.join(rootDir, "storage");
const uploadsDir = path.join(storageDir, "uploads");
const sessionsDir = path.join(storageDir, "sessions");
const logsDir = path.join(rootDir, "logs");

const config = {
  rootDir,
  distDir,
  storageDir,
  uploadsDir,
  sessionsDir,
  logsDir,
  host: process.env.HOST || "0.0.0.0",
  port: Number.parseInt(process.env.PORT || "3000", 10),
  maxUploadSizeBytes: Number.parseInt(process.env.MAX_UPLOAD_SIZE_MB || "25", 10) * 1024 * 1024,
  previewLimit: Number.parseInt(process.env.PREVIEW_LIMIT || "120", 10),
  sessionVersion: 1,
};

function ensureRuntimeDirs() {
  [storageDir, uploadsDir, sessionsDir, logsDir].forEach((targetDir) => {
    fs.mkdirSync(targetDir, { recursive: true });
  });
}

module.exports = {
  config,
  ensureRuntimeDirs,
};
