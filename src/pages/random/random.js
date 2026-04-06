import { api } from "../../js/lib/api.js";
import { mountDynamicSelect } from "../../js/lib/dynamic-select.js";
import { createLogger } from "../../js/lib/logger.js";
import { buildAppUrl } from "../../js/lib/paths.js";

const randomLogger = createLogger("random-page");
const SESSION_STORAGE_KEY = "freedom-generator:last-session-id";
const DRAW_STORAGE_KEY = "freedom-generator:last-draw-id";
const DRAW_SETTINGS_STORAGE_KEY = "freedom-generator:last-draw-settings";
const DRAW_SETTINGS_VERSION = 2;
const PREVIEW_BATCH_SIZE = 120;
const PREVIEW_LOAD_AHEAD_PX = 80;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getRecordWord(value) {
  const normalized = Math.abs(value) % 100;
  const tail = normalized % 10;

  if (normalized > 10 && normalized < 20) {
    return "записей";
  }

  if (tail > 1 && tail < 5) {
    return "записи";
  }

  if (tail === 1) {
    return "запись";
  }

  return "записей";
}

function readSavedSettings() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DRAW_SETTINGS_STORAGE_KEY) || "null");

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    if (!parsed.version || parsed.version < DRAW_SETTINGS_VERSION) {
      return {
        ...parsed,
        version: DRAW_SETTINGS_VERSION,
        removeWinners: "yes",
      };
    }

    return parsed;
  } catch (error) {
    randomLogger.warn("Failed to parse saved draw settings", error);
    return null;
  }
}

function saveDrawSettings(settings) {
  window.localStorage.setItem(
    DRAW_SETTINGS_STORAGE_KEY,
    JSON.stringify({
      ...settings,
      version: DRAW_SETTINGS_VERSION,
    })
  );
}

function applySelectValue(selectElement, value) {
  if (!selectElement) {
    return;
  }

  const hiddenInputElement = selectElement.querySelector(".select__input");
  const valueElement = selectElement.querySelector(".select__value");
  const optionElements = Array.from(selectElement.querySelectorAll(".select__option"));

  if (!hiddenInputElement || !valueElement || optionElements.length === 0) {
    return;
  }

  const targetOption =
    optionElements.find((optionElement) => optionElement.getAttribute("data-value") === value) ||
    optionElements[0];

  optionElements.forEach((optionElement) => {
    const isSelected = optionElement === targetOption;
    optionElement.classList.toggle("is-selected", isSelected);
    optionElement.setAttribute("aria-selected", String(isSelected));
  });

  hiddenInputElement.value = targetOption.getAttribute("data-value") || "";
  selectElement.dataset.value = hiddenInputElement.value;
  valueElement.textContent = targetOption.textContent.trim();
}

function initCounter(counterElement) {
  const inputElement = counterElement.querySelector(".random__quantity-input");
  const unitElement = counterElement
    .closest(".random__quantity-controls")
    ?.querySelector(".random__quantity-unit");

  if (!inputElement || !unitElement) {
    return;
  }

  const minValue = Number.parseInt(inputElement.getAttribute("min") || "1", 10);

  const normalizeValue = () => {
    const parsed = Number.parseInt(inputElement.value, 10);
    const safeValue = Number.isNaN(parsed) ? minValue : Math.max(minValue, parsed);

    inputElement.value = String(safeValue);
    unitElement.textContent = getRecordWord(safeValue);
  };

  counterElement.querySelectorAll(".random__quantity-stepper-button").forEach((buttonElement) => {
    buttonElement.addEventListener("click", () => {
      const direction = buttonElement.classList.contains(
        "random__quantity-stepper-button--increase"
      )
        ? "increase"
        : "decrease";
      const currentValue = Number.parseInt(inputElement.value, 10) || minValue;
      const nextValue = direction === "increase" ? currentValue + 1 : currentValue - 1;

      inputElement.value = String(Math.max(minValue, nextValue));
      normalizeValue();
      inputElement.focus();
    });
  });

  inputElement.addEventListener("input", normalizeValue);
  inputElement.addEventListener("blur", normalizeValue);
  normalizeValue();
}

function setStatus(statusElement, message, kind = "info") {
  statusElement.textContent = message;

  if (!message) {
    delete statusElement.dataset.kind;
    return;
  }

  statusElement.dataset.kind = kind;
}

function toggleSidebar(sidebarElement, isOpen) {
  sidebarElement.classList.toggle("random__sidebar--open", isOpen);
  sidebarElement.setAttribute("aria-hidden", String(!isOpen));
}

function setListInteractivity(listWrapperElement, isInteractive) {
  listWrapperElement.classList.toggle("random__list--interactive", isInteractive);
  listWrapperElement.setAttribute("role", isInteractive ? "button" : "region");
  listWrapperElement.setAttribute("tabindex", isInteractive ? "0" : "-1");
  listWrapperElement.setAttribute(
    "aria-label",
    isInteractive ? "Загрузить файл" : "Список доступных записей для розыгрыша"
  );
}

function renderRecordsCounter(targetElement, visibleCount, totalCount = visibleCount) {
  const safeVisibleCount = Math.max(0, Number(visibleCount) || 0);
  const safeTotalCount = Math.max(safeVisibleCount, Number(totalCount) || 0);
  const label =
    safeVisibleCount < safeTotalCount
      ? `${safeVisibleCount} из ${safeTotalCount} ${getRecordWord(safeTotalCount)}`
      : `${safeTotalCount} ${getRecordWord(safeTotalCount)}`;

  mountDynamicSelect(targetElement, {
    name: "recordsCounter",
    value: String(safeTotalCount),
    options: [
      {
        value: String(safeTotalCount),
        label,
      },
    ],
    classes: "random__select",
  });
}

function renderPlaceholder(
  listWrapperElement,
  listElement,
  hintElement,
  submitButtonElement,
  config
) {
  listWrapperElement.classList.add("random__list--empty");
  setListInteractivity(listWrapperElement, config.isInteractive);
  listElement.innerHTML = `
    <li class="random__list-item random__list-item--empty">
      <div class="random__list-item-text">
        ${escapeHtml(config.label)}
      </div>
    </li>
  `;
  hintElement.textContent = config.hint;
  submitButtonElement.disabled = true;
}

function renderPreview(listWrapperElement, listElement, hintElement, submitButtonElement, preview) {
  if (!preview || preview.preview.length === 0) {
    renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, {
      label: "Нет доступных записей",
      hint: "В этом файле больше не осталось участников для розыгрыша.",
      isInteractive: false,
    });
    return;
  }

  listWrapperElement.classList.remove("random__list--empty");
  setListInteractivity(listWrapperElement, false);
  listElement.innerHTML = preview.preview
    .map(
      (item) => `
        <li class="random__list-item" data-record-id="${escapeHtml(item.recordId)}">
          <div class="random__list-item-digit"></div>
          <div class="random__list-item-text">${escapeHtml(item.displayValue)}</div>
        </li>
      `
    )
    .join("");
  hintElement.textContent =
    preview.preview.length < preview.eligibleCount
      ? `Показано ${preview.preview.length} из ${preview.eligibleCount} ${getRecordWord(
          preview.eligibleCount
        )}. Прокрутите список ниже, чтобы подгрузить остальные.`
      : `Показано ${preview.preview.length} из ${preview.eligibleCount} ${getRecordWord(
          preview.eligibleCount
        )}.`;
  submitButtonElement.disabled = preview.eligibleCount === 0;
}

function highlightWinners(listElement, winners, shouldAutoScroll) {
  const winnerIds = new Set(winners.map((winner) => winner.recordId));
  const firstWinnerId = winners[0]?.recordId;

  listElement.querySelectorAll(".random__list-item").forEach((itemElement) => {
    itemElement.classList.toggle(
      "random__list-item--winner",
      winnerIds.has(itemElement.dataset.recordId)
    );
  });

  const winnerElement = firstWinnerId
    ? listElement.querySelector(`[data-record-id="${firstWinnerId}"]`)
    : null;

  if (winnerElement && shouldAutoScroll) {
    winnerElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

export function initRandomControls() {
  const randomSectionElement = document.querySelector(".random");

  if (!randomSectionElement) {
    return;
  }

  const state = {
    session: null,
    preview: null,
    lastDraw: null,
    pendingFile: null,
    isSidebarOpen: false,
    previewLimit: PREVIEW_BATCH_SIZE,
    isLoadingMorePreview: false,
  };

  const formElement = randomSectionElement.querySelector(".random__form");
  const fileInputElement = randomSectionElement.querySelector("[data-file-input]");
  const listWrapperElement = randomSectionElement.querySelector("[data-upload-zone]");
  const listElement = randomSectionElement.querySelector("[data-records-list]");
  const hintElement = randomSectionElement.querySelector("[data-list-hint]");
  const statusElement = randomSectionElement.querySelector("[data-status]");
  const submitButtonElement = randomSectionElement.querySelector("[data-draw-submit]");
  const sidebarElement = randomSectionElement.querySelector("[data-settings-sidebar]");
  const recordsSelectMountElement = randomSectionElement.querySelector("[data-records-select]");
  const autoScrollElement = randomSectionElement.querySelector('input[name="autoScroll"]');
  const winnersCountInputElement = randomSectionElement.querySelector(".random__quantity-input");
  const listScrollElement = randomSectionElement.querySelector(".random__list-scroll");
  const resetExclusionsButtonElement = randomSectionElement.querySelector(
    "[data-reset-exclusions-button]"
  );
  const resetExclusionsDescriptionElement = randomSectionElement.querySelector(
    "[data-reset-exclusions-description]"
  );

  randomSectionElement
    .querySelectorAll(".random__quantity-field--counter")
    .forEach((counterElement) => {
      initCounter(counterElement);
    });

  function applySavedSidebarSettings(savedSettings) {
    if (!savedSettings) {
      return;
    }

    if (savedSettings.winnersCount && winnersCountInputElement) {
      winnersCountInputElement.value = String(savedSettings.winnersCount);
      winnersCountInputElement.dispatchEvent(new Event("input", { bubbles: true }));
    }

    if (typeof savedSettings.autoScroll === "boolean" && autoScrollElement) {
      autoScrollElement.checked = savedSettings.autoScroll;
    }

    applySelectValue(
      formElement.querySelector('input[name="removeWinners"]')?.closest(".select"),
      savedSettings.removeWinners || "yes"
    );
    applySelectValue(
      formElement.querySelector('input[name="sortResults"]')?.closest(".select"),
      savedSettings.sortResults || "no"
    );
  }

  function syncRecordsCounter() {
    if (state.pendingFile) {
      renderRecordsCounter(recordsSelectMountElement, 0, 0);
      return;
    }

    const visibleCount = state.preview?.preview?.length ?? state.session?.counts?.activeRecords ?? 0;
    const totalCount = state.preview?.eligibleCount ?? state.session?.counts?.activeRecords ?? visibleCount;
    renderRecordsCounter(recordsSelectMountElement, visibleCount, totalCount);
  }

  function syncSidebarActions() {
    if (!resetExclusionsButtonElement || !resetExclusionsDescriptionElement) {
      return;
    }

    const excludedCount = state.session?.counts?.excludedRecords ?? 0;

    resetExclusionsButtonElement.textContent =
      excludedCount > 0 ? `Очистить все (${excludedCount})` : "Очистить все";

    if (state.pendingFile) {
      resetExclusionsButtonElement.disabled = true;
      resetExclusionsDescriptionElement.textContent =
        "Сначала загрузите выбранный файл, затем можно очищать исключения.";
      return;
    }

    if (!state.session) {
      resetExclusionsButtonElement.disabled = true;
      resetExclusionsDescriptionElement.textContent =
        "Кнопка станет доступна после загрузки файла.";
      return;
    }

    if (excludedCount === 0) {
      resetExclusionsButtonElement.disabled = true;
      resetExclusionsDescriptionElement.textContent =
        "Для текущего файла сейчас нет исключённых записей.";
      return;
    }

    resetExclusionsButtonElement.disabled = false;
    resetExclusionsDescriptionElement.textContent = `Для текущего файла исключено ${excludedCount} ${getRecordWord(
      excludedCount
    )}.`;
  }

  function syncInitialState() {
    state.previewLimit = PREVIEW_BATCH_SIZE;
    renderRecordsCounter(recordsSelectMountElement, 0, 0);
    renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, {
      label: "Загрузите файл",
      hint: "Нажмите на область списка, чтобы выбрать Excel-файл.",
      isInteractive: true,
    });
    syncSidebarActions();
  }

  function handlePendingFile(file) {
    state.pendingFile = file;
    state.previewLimit = PREVIEW_BATCH_SIZE;
    syncRecordsCounter();
    renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, {
      label: file.name,
      hint: "Файл выбран. Нажмите на иконку подтверждения справа, чтобы загрузить список.",
      isInteractive: true,
    });
    setStatus(statusElement, "Файл выбран и ожидает загрузки.", "success");
    syncSidebarActions();
  }

  async function refreshPreview(options = {}) {
    if (!state.session) {
      return;
    }

    const {
      limit = state.previewLimit,
      silent = false,
      statusMessage = "Обновляем список участников…",
    } = options;

    state.previewLimit = Math.max(PREVIEW_BATCH_SIZE, limit);

    if (!silent) {
      setStatus(statusElement, statusMessage);
    }

    try {
      const response = await api.getPreview(state.session.id, {
        limit: state.previewLimit,
      });
      state.session = response.session;
      state.preview = response.preview;
      state.pendingFile = null;
      renderPreview(
        listWrapperElement,
        listElement,
        hintElement,
        submitButtonElement,
        state.preview
      );
      syncRecordsCounter();
      syncSidebarActions();
      if (!silent) {
        setStatus(statusElement, "Список готов к розыгрышу.", "success");
      }
    } catch (error) {
      randomLogger.error("Preview refresh failed", error);
      setStatus(statusElement, error.message, "error");
      syncSidebarActions();
    }
  }

  async function hydrateSession(sessionId) {
    try {
      const response = await api.getSession(sessionId);
      state.session = response.session;
      state.pendingFile = null;
      state.previewLimit = PREVIEW_BATCH_SIZE;
      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);
      applySavedSidebarSettings(readSavedSettings());
      syncSidebarActions();
      await refreshPreview();
    } catch (error) {
      randomLogger.warn("Stored session restore failed", error);
      setStatus(
        statusElement,
        "Не удалось восстановить прошлую сессию. Загрузите файл заново.",
        "error"
      );
      syncInitialState();
    }
  }

  function openFilePicker() {
    fileInputElement?.click();
  }

  async function importPendingFile() {
    if (!state.pendingFile) {
      if (state.session) {
        setStatus(
          statusElement,
          "Выберите новый файл, затем подтвердите загрузку этой иконкой.",
          "info"
        );
      } else {
        setStatus(statusElement, "Сначала выберите Excel-файл в области списка.", "info");
      }
      openFilePicker();
      return;
    }

    setStatus(statusElement, "Импортируем Excel-файл и собираем список участников…");

    try {
      const response = await api.importReport(state.pendingFile);
      state.session = response.session;
      state.preview = response.preview;
      state.lastDraw = null;
      state.pendingFile = null;
      state.previewLimit = Math.max(PREVIEW_BATCH_SIZE, response.preview.preview.length);

      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);
      window.localStorage.removeItem(DRAW_STORAGE_KEY);
      renderPreview(
        listWrapperElement,
        listElement,
        hintElement,
        submitButtonElement,
        response.preview
      );
      syncRecordsCounter();
      syncSidebarActions();
      setStatus(statusElement, "Файл загружен. Можно запускать розыгрыш.", "success");
    } catch (error) {
      randomLogger.error("Import failed", error);
      state.pendingFile = null;
      setStatus(statusElement, error.message, "error");

      if (state.session && state.preview) {
        renderPreview(
          listWrapperElement,
          listElement,
          hintElement,
          submitButtonElement,
          state.preview
        );
        syncRecordsCounter();
        syncSidebarActions();
      } else {
        syncInitialState();
      }
    }
  }

  async function handleDraw(event) {
    event.preventDefault();

    if (state.pendingFile) {
      setStatus(
        statusElement,
        "Сначала подтвердите загрузку выбранного файла иконкой справа.",
        "error"
      );
      return;
    }

    if (!state.session) {
      setStatus(statusElement, "Сначала загрузите Excel-файл.", "error");
      return;
    }

    const payload = {
      winnersCount: winnersCountInputElement?.value || "1",
      removeWinners: formElement.querySelector('input[name="removeWinners"]')?.value || "no",
      sortResults: formElement.querySelector('input[name="sortResults"]')?.value || "no",
    };

    setStatus(statusElement, "Запускаем розыгрыш…");
    submitButtonElement.disabled = true;

    try {
      const response = await api.draw(state.session.id, payload);

      state.session = response.session;
      state.lastDraw = response.draw;

      highlightWinners(listElement, response.draw.winners, autoScrollElement?.checked);
      saveDrawSettings({
        ...payload,
        autoScroll: Boolean(autoScrollElement?.checked),
      });
      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);
      window.localStorage.setItem(DRAW_STORAGE_KEY, response.draw.id);
      syncSidebarActions();
      setStatus(statusElement, "Победители определены. Переходим к экрану результатов…", "success");

      const delay = autoScrollElement?.checked ? 1000 : 250;

      window.setTimeout(() => {
        window.location.href = buildAppUrl("results.html");
      }, delay);
    } catch (error) {
      randomLogger.error("Draw failed", error);
      setStatus(statusElement, error.message, "error");
      submitButtonElement.disabled = false;
    }
  }

  listWrapperElement?.addEventListener("click", (event) => {
    if (
      event.target.closest(".random__list-scroll") &&
      !listWrapperElement.classList.contains("random__list--interactive")
    ) {
      return;
    }

    if (!listWrapperElement.classList.contains("random__list--interactive")) {
      return;
    }

    openFilePicker();
  });

  listWrapperElement?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    if (!listWrapperElement.classList.contains("random__list--interactive")) {
      return;
    }

    event.preventDefault();
    openFilePicker();
  });

  listScrollElement?.addEventListener("scroll", () => {
    if (!state.session || !state.preview || state.isLoadingMorePreview) {
      return;
    }

    if (state.preview.preview.length >= state.preview.eligibleCount) {
      return;
    }

    const distanceToBottom =
      listScrollElement.scrollHeight - listScrollElement.scrollTop - listScrollElement.clientHeight;

    if (distanceToBottom > PREVIEW_LOAD_AHEAD_PX) {
      return;
    }

    state.isLoadingMorePreview = true;

    refreshPreview({
      limit: state.preview.preview.length + PREVIEW_BATCH_SIZE,
      silent: true,
    }).finally(() => {
      state.isLoadingMorePreview = false;
    });
  });

  fileInputElement?.addEventListener("change", () => {
    const selectedFile = fileInputElement.files?.[0] || null;

    if (!selectedFile) {
      return;
    }

    handlePendingFile(selectedFile);
  });

  randomSectionElement.querySelector("[data-import-trigger]")?.addEventListener("click", () => {
    importPendingFile();
  });

  randomSectionElement.querySelector("[data-settings-toggle]")?.addEventListener("click", () => {
    state.isSidebarOpen = !state.isSidebarOpen;
    toggleSidebar(sidebarElement, state.isSidebarOpen);
  });

  resetExclusionsButtonElement?.addEventListener("click", async () => {
    if (!state.session || state.pendingFile) {
      return;
    }

    setStatus(statusElement, "Возвращаем всех участников в текущий список…");
    resetExclusionsButtonElement.disabled = true;

    try {
      const response = await api.resetExclusions(state.session.id);
      state.session = response.session;
      state.lastDraw = null;
      syncSidebarActions();
      await refreshPreview();
      setStatus(statusElement, "Исключения очищены. Все участники снова в пуле.", "success");
    } catch (error) {
      randomLogger.error("Reset exclusions failed", error);
      syncSidebarActions();
      setStatus(statusElement, error.message, "error");
    }
  });

  formElement?.addEventListener("submit", handleDraw);

  const queryParams = new URLSearchParams(window.location.search);
  const shouldOpenSettings = queryParams.get("openSettings") === "1";
  const storedSessionId =
    queryParams.get("sessionId") || window.localStorage.getItem(SESSION_STORAGE_KEY) || "";

  applySavedSidebarSettings(readSavedSettings());
  syncInitialState();

  if (shouldOpenSettings) {
    state.isSidebarOpen = true;
    toggleSidebar(sidebarElement, true);
  }

  if (storedSessionId) {
    hydrateSession(storedSessionId);
  }
}
