import { createLogger } from "./logger.js";
import { buildAppUrl } from "./paths.js";

const apiLogger = createLogger("api");

async function readPayload(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function request(url, options = {}) {
  apiLogger.debug("Request started", {
    url,
    method: options.method || "GET",
  });

  const response = await fetch(url, options);
  const payload = await readPayload(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "error" in payload
        ? payload.error
        : `HTTP ${response.status}`;
    apiLogger.error("Request failed", {
      url,
      status: response.status,
      payload,
    });
    throw new Error(message);
  }

  apiLogger.debug("Request finished", {
    url,
    status: response.status,
  });

  return payload;
}

export const api = {
  importReport(file) {
    const formData = new FormData();
    formData.append("reportFile", file);

    return request(buildAppUrl("api/import"), {
      method: "POST",
      body: formData,
    });
  },
  getSession(sessionId) {
    return request(buildAppUrl(`api/sessions/${sessionId}`));
  },
  updateSessionSettings(sessionId, payload) {
    return request(buildAppUrl(`api/sessions/${sessionId}/settings`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },
  getPreview(sessionId, payload) {
    return request(buildAppUrl(`api/sessions/${sessionId}/preview`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },
  draw(sessionId, payload) {
    return request(buildAppUrl(`api/sessions/${sessionId}/draw`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },
  getDraw(sessionId, drawId) {
    return request(buildAppUrl(`api/sessions/${sessionId}/draws/${drawId}`));
  },
  excludeDraw(sessionId, drawId) {
    return request(buildAppUrl(`api/sessions/${sessionId}/exclude-draw`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ drawId }),
    });
  },
  resetExclusions(sessionId) {
    return request(buildAppUrl(`api/sessions/${sessionId}/reset-exclusions`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  },
  undoLastDraw(sessionId) {
    return request(buildAppUrl(`api/sessions/${sessionId}/undo-last-draw`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  },
};
