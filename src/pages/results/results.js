import { api } from "../../js/lib/api.js";
import { mountDynamicSelect } from "../../js/lib/dynamic-select.js";
import { createLogger } from "../../js/lib/logger.js";
import { buildAppPath, buildAppUrl } from "../../js/lib/paths.js";

const resultsLogger = createLogger("results-page");
const SESSION_STORAGE_KEY = "freedom-generator:last-session-id";
const DRAW_STORAGE_KEY = "freedom-generator:last-draw-id";
const REPEAT_MIN_DURATION_MS = 1600;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatResultTimestamp(value) {
  if (!value) {
    return "без даты";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  const seconds = String(parsed.getSeconds()).padStart(2, "0");

  return `${day}.${month}.${year} в ${hours}:${minutes}:${seconds}`;
}

function setStatus(statusElement, message, kind = "info") {
  statusElement.textContent = message;

  if (!message) {
    delete statusElement.dataset.kind;
    return;
  }

  statusElement.dataset.kind = kind;
}

function buildDisplayMarkup(value) {
  const text = String(value ?? "").trim();

  if (/^\d{8,}$/.test(text)) {
    return {
      className: " results__text--ticket",
      markup: text
        .match(/.{1,4}/g)
        .map((group) => `<span class="results__value-group">${escapeHtml(group)}</span>`)
        .join(""),
    };
  }

  return {
    className: "",
    markup: escapeHtml(text),
  };
}

function renderResults(listElement, draw) {
  if (!draw || draw.winners.length === 0) {
    listElement.innerHTML = `
      <li class="results__item results__item--empty">
        <div class="results__text">
          У этого розыгрыша нет победителей.
        </div>
      </li>
    `;
    return;
  }

  listElement.innerHTML = draw.winners
    .map((winner) => {
      const display = buildDisplayMarkup(winner.displayValue);

      return `
        <li class="results__item">
          <div class="results__digit"></div>
          <div class="results__text${display.className}">${display.markup}</div>
        </li>
      `;
    })
    .join("");
}

function renderSkeletonResults(listElement, count = 1) {
  const safeCount = Math.max(1, Number.parseInt(String(count), 10) || 1);

  listElement.innerHTML = Array.from({ length: safeCount }, (_, index) => {
    const lineWidth = 52 + ((index % 4) * 10 + 8);

    return `
      <li class="results__item results__item--skeleton" aria-hidden="true">
        <div class="results__digit"></div>
        <div class="results__text">
          <span class="results__skeleton-line" style="width:${lineWidth}%"></span>
        </div>
      </li>
    `;
  }).join("");
}

function buildRepeatPayload(draw) {
  if (!draw) {
    return null;
  }

  return {
    displayColumn: draw.displayColumn,
    filters: draw.filters || {},
    winnersCount: draw.winnersCount || 1,
    removeWinners: draw.removeWinners ? "yes" : "no",
    sortResults: draw.sortResults || "no",
  };
}

function initViewToggle(resultsSectionElement) {
  const typeElements = Array.from(resultsSectionElement.querySelectorAll(".results__type"));

  if (typeElements.length === 0) {
    return;
  }

  const applyType = (targetElement) => {
    typeElements.forEach((typeElement) => {
      const isActive = typeElement === targetElement;

      typeElement.classList.toggle("results__type--active", isActive);
      typeElement.setAttribute("aria-pressed", String(isActive));
    });

    resultsSectionElement.classList.remove("results--view-blocks", "results--view-list");

    if (targetElement.classList.contains("results__type--blocks")) {
      resultsSectionElement.classList.add("results--view-blocks");
      return;
    }

    resultsSectionElement.classList.add("results--view-list");
  };

  typeElements.forEach((typeElement) => {
    typeElement.addEventListener("click", () => {
      applyType(typeElement);
    });

    typeElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        applyType(typeElement);
      }
    });
  });

  applyType(resultsSectionElement.querySelector(".results__type--active") || typeElements[0]);
}

function buildActionSelectConfig(draw) {
  if (!draw) {
    return {
      value: "disabled",
      options: [{ value: "disabled", label: "Действия недоступны" }],
    };
  }

  if (draw.appliedRemoval) {
    return {
      value: "removed",
      options: [
        { value: "removed", label: "Победители уже убраны из общего списка" },
        { value: "reset-exclusions", label: "Очистить все и вернуть всех в пул" },
      ],
    };
  }

  return {
    value: "exclude-draw",
    options: [
      { value: "exclude-draw", label: "Убрать из общего списка текущих победителей" },
      { value: "reset-exclusions", label: "Очистить все и вернуть всех в пул" },
    ],
  };
}

export function initResultsPage() {
  const resultsSectionElement = document.querySelector(".results");

  if (!resultsSectionElement) {
    return;
  }

  initViewToggle(resultsSectionElement);

  const listElement = resultsSectionElement.querySelector("[data-results-list]");
  const subtextElement = resultsSectionElement.querySelector("[data-results-subtext]");
  const statusElement = resultsSectionElement.querySelector("[data-results-status]");
  const actionSelectMountElement = resultsSectionElement.querySelector(
    "[data-results-action-select]"
  );
  const backButtonElement = resultsSectionElement.querySelector("[data-back-button]");
  const repeatButtonElement = resultsSectionElement.querySelector("[data-repeat-button]");

  const queryParams = new URLSearchParams(window.location.search);
  let sessionId =
    queryParams.get("sessionId") || window.localStorage.getItem(SESSION_STORAGE_KEY) || "";
  let drawId = queryParams.get("drawId") || window.localStorage.getItem(DRAW_STORAGE_KEY) || "";

  if (queryParams.get("sessionId") || queryParams.get("drawId")) {
    if (sessionId) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }

    if (drawId) {
      window.localStorage.setItem(DRAW_STORAGE_KEY, drawId);
    }

    window.history.replaceState({}, "", buildAppPath("results.html"));
  }

  const state = {
    session: null,
    draw: null,
    isActionPending: false,
    isRepeatPending: false,
  };

  function renderActionSelect() {
    const config = buildActionSelectConfig(state.draw);

    mountDynamicSelect(actionSelectMountElement, {
      name: "resultsAction",
      value: config.value,
      options: config.options,
      classes: "select--up results__select",
    });

    actionSelectMountElement
      .querySelector(".select__input")
      ?.addEventListener("change", async (event) => {
        if (state.isActionPending) {
          return;
        }

        if (event.target.value === "disabled" || event.target.value === "removed") {
          return;
        }

        if (!state.session) {
          return;
        }

        if (event.target.value === "exclude-draw") {
          if (!state.draw) {
            return;
          }

          state.isActionPending = true;
          setStatus(statusElement, "Убираем текущих победителей из списка…");

          try {
            const response = await api.excludeDraw(state.session.id, state.draw.id);
            state.session = response.session;
            state.draw = response.draw;
            renderActionSelect();
            setStatus(
              statusElement,
              "Победители исключены из общего списка. Можно возвращаться к настройкам.",
              "success"
            );
          } catch (error) {
            resultsLogger.error("Failed to exclude winners", error);
            setStatus(statusElement, error.message, "error");
          } finally {
            state.isActionPending = false;
          }

          return;
        }

        if (event.target.value === "reset-exclusions") {
          state.isActionPending = true;
          setStatus(statusElement, "Сбрасываем все исключения…");

          try {
            const response = await api.resetExclusions(state.session.id);
            state.session = response.session;
            window.localStorage.removeItem(DRAW_STORAGE_KEY);
            drawId = "";

            if (state.draw) {
              state.draw = {
                ...state.draw,
                appliedRemoval: false,
                removeWinners: false,
                globalContributionKeys: [],
              };
            }

            renderActionSelect();
            setStatus(
              statusElement,
              "История файла и общий blacklist очищены. Все участники снова возвращены в пул.",
              "success"
            );
          } catch (error) {
            resultsLogger.error("Failed to reset exclusions", error);
            setStatus(statusElement, error.message, "error");
          } finally {
            state.isActionPending = false;
          }
        }
      });
  }

  async function loadDraw() {
    if (!sessionId || !drawId) {
      setStatus(statusElement, "Сначала выполните розыгрыш на странице настроек.", "error");
      return;
    }

    setStatus(statusElement, "Загружаем результаты розыгрыша…");

    try {
      const response = await api.getDraw(sessionId, drawId);
      state.session = response.session;
      state.draw = response.draw;

      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);
      window.localStorage.setItem(DRAW_STORAGE_KEY, response.draw.id);
      renderResults(listElement, response.draw);
      renderActionSelect();
      subtextElement.textContent = formatResultTimestamp(response.draw.createdAt);
      setStatus(statusElement, "");
    } catch (error) {
      resultsLogger.error("Failed to load draw", error);
      setStatus(statusElement, error.message, "error");
    }
  }

  backButtonElement?.addEventListener("click", () => {
    if (!sessionId) {
      window.location.href = buildAppUrl("random.html");
      return;
    }

    window.location.href = buildAppUrl("random.html?openSettings=1");
  });

  repeatButtonElement?.addEventListener("click", async () => {
    if (!state.session || !state.draw || state.isRepeatPending) {
      return;
    }

    const previousDraw = state.draw;
    const payload = buildRepeatPayload(state.draw);

    if (!payload) {
      return;
    }

    state.isRepeatPending = true;
    repeatButtonElement.disabled = true;
    repeatButtonElement.textContent = "Разыгрываем...";
    resultsSectionElement.classList.add("results--refreshing");
    renderSkeletonResults(
      listElement,
      previousDraw.winnersCount || previousDraw.winners.length || 1
    );
    setStatus(statusElement, "Проводим следующий розыгрыш...");

    try {
      const [response] = await Promise.all([
        api.draw(state.session.id, payload),
        wait(REPEAT_MIN_DURATION_MS),
      ]);

      state.session = response.session;
      state.draw = response.draw;
      sessionId = response.session.id;
      drawId = response.draw.id;

      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);
      window.localStorage.setItem(DRAW_STORAGE_KEY, response.draw.id);
      window.history.replaceState({}, "", buildAppPath("results.html"));

      renderResults(listElement, response.draw);
      renderActionSelect();
      subtextElement.textContent = formatResultTimestamp(response.draw.createdAt);
      setStatus(statusElement, "Новые победители определены.", "success");
    } catch (error) {
      resultsLogger.error("Failed to repeat draw", error);
      renderResults(listElement, previousDraw);
      setStatus(statusElement, error.message, "error");
    } finally {
      state.isRepeatPending = false;
      repeatButtonElement.disabled = false;
      repeatButtonElement.textContent = "Разыграть ещё";
      resultsSectionElement.classList.remove("results--refreshing");
    }
  });

  renderActionSelect();
  loadDraw();
}
