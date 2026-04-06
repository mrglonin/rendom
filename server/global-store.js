const fs = require("fs");

const { config } = require("./config");
const { createScopedLogger } = require("./logger");

const globalStoreLogger = createScopedLogger("global-store");

function createEmptyGlobalState() {
  return {
    version: 1,
    winnersByKey: {},
  };
}

function normalizeGlobalState(rawState) {
  if (!rawState || typeof rawState !== "object") {
    return createEmptyGlobalState();
  }

  const winnersByKey =
    rawState.winnersByKey && typeof rawState.winnersByKey === "object" ? rawState.winnersByKey : {};

  return {
    version: 1,
    winnersByKey,
  };
}

function loadGlobalState() {
  if (!fs.existsSync(config.globalStatePath)) {
    return createEmptyGlobalState();
  }

  try {
    const rawState = JSON.parse(fs.readFileSync(config.globalStatePath, "utf8"));
    return normalizeGlobalState(rawState);
  } catch (error) {
    globalStoreLogger.error("Failed to load global state", {
      error: error.message,
    });

    return createEmptyGlobalState();
  }
}

function saveGlobalState(globalState) {
  const nextState = normalizeGlobalState(globalState);

  fs.writeFileSync(config.globalStatePath, JSON.stringify(nextState, null, 2), "utf8");
  return nextState;
}

function resetGlobalState() {
  return saveGlobalState(createEmptyGlobalState());
}

function getGlobalWinnerCount(globalState) {
  return Object.keys(normalizeGlobalState(globalState).winnersByKey).length;
}

function getGlobalWinnerKeySet(globalState) {
  return new Set(Object.keys(normalizeGlobalState(globalState).winnersByKey));
}

function addGlobalWinners(globalState, winners, meta = {}) {
  const nextState = normalizeGlobalState(globalState);
  const winnersByKey = {
    ...nextState.winnersByKey,
  };
  const addedKeys = [];

  winners.forEach((winner) => {
    const dedupeValue = String(winner?.dedupeValue || "").trim();

    if (!dedupeValue || winnersByKey[dedupeValue]) {
      return;
    }

    winnersByKey[dedupeValue] = {
      key: dedupeValue,
      dedupeValue,
      displayValue: String(winner?.displayValue || "").trim(),
      dedupeColumn: String(meta.dedupeColumn || "").trim(),
      displayColumn: String(meta.displayColumn || "").trim(),
      sourceSessionId: String(meta.sessionId || "").trim(),
      sourceDrawId: String(meta.drawId || "").trim(),
      createdAt: String(meta.createdAt || new Date().toISOString()),
    };
    addedKeys.push(dedupeValue);
  });

  return {
    nextState: {
      ...nextState,
      winnersByKey,
    },
    addedKeys,
  };
}

function removeGlobalWinnerKeys(globalState, keys, sourceDrawId = "") {
  const nextState = normalizeGlobalState(globalState);
  const winnersByKey = {
    ...nextState.winnersByKey,
  };
  const removedKeys = [];

  keys.forEach((key) => {
    const normalizedKey = String(key || "").trim();
    const currentWinner = winnersByKey[normalizedKey];

    if (!normalizedKey || !currentWinner) {
      return;
    }

    if (sourceDrawId && currentWinner.sourceDrawId && currentWinner.sourceDrawId !== sourceDrawId) {
      return;
    }

    delete winnersByKey[normalizedKey];
    removedKeys.push(normalizedKey);
  });

  return {
    nextState: {
      ...nextState,
      winnersByKey,
    },
    removedKeys,
  };
}

module.exports = {
  addGlobalWinners,
  getGlobalWinnerCount,
  getGlobalWinnerKeySet,
  loadGlobalState,
  removeGlobalWinnerKeys,
  resetGlobalState,
  saveGlobalState,
};
