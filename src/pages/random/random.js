import { api } from "../../js/lib/api.js";
import { mountDynamicSelect } from "../../js/lib/dynamic-select.js";
import { createLogger } from "../../js/lib/logger.js";
import { buildAppUrl } from "../../js/lib/paths.js";

const randomLogger = createLogger("random-page");
const SESSION_STORAGE_KEY = "freedom-generator:last-session-id";
const DRAW_STORAGE_KEY = "freedom-generator:last-draw-id";
const DRAW_SETTINGS_STORAGE_KEY = "freedom-generator:last-draw-settings";
const DRAW_SETTINGS_VERSION = 2;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDisplayValue(value) {
  const text = String(value ?? "").trim();

  if (/^\d{8,}$/.test(text)) {
    return text.match(/.{1,4}/g)?.join(" ") || text;
  }

  return text;
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

function getWinnerWord(value) {
  const normalized = Math.abs(value) % 100;
  const tail = normalized % 10;

  if (normalized > 10 && normalized < 20) {
    return "победителей";
  }

  if (tail > 1 && tail < 5) {
    return "победителя";
  }

  if (tail === 1) {
    return "победитель";
  }

  return "победителей";
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
    }),
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
        "random__quantity-stepper-button--increase",
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

function renderHistoryCounter(targetElement, count) {
  const safeCount = Math.max(0, Number(count) || 0);

  mountDynamicSelect(targetElement, {
    name: "winnersCounter",
    value: String(safeCount),
    options: [
      {
        value: String(safeCount),
        label: `${safeCount} ${getWinnerWord(safeCount)}`,
      },
    ],
    classes: "random__select",
  });
}

function renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, config) {
  listWrapperElement.classList.add("random__list--empty");
  listElement.innerHTML = `
    <li class="random__list-item random__list-item--empty">
      <div class="random__list-item-text">
        ${escapeHtml(config.label)}
      </div>
    </li>
  `;
  hintElement.textContent = config.hint;
  submitButtonElement.disabled = config.submitDisabled;
}

function buildSessionHint(session) {
  const totalCount = session?.counts?.totalRecords ?? 0;
  const activeCount = session?.counts?.activeRecords ?? 0;
  const excludedCount = session?.counts?.excludedRecords ?? 0;
  const displayColumn = String(session?.defaults?.displayColumn || "").trim();
  const parts = [];

  if (session?.source?.originalName) {
    parts.push(`Файл: ${session.source.originalName}.`);
  }

  if (totalCount > 0) {
    parts.push(`Загружено ${totalCount} ${getRecordWord(totalCount)}.`);
  }

  if (displayColumn) {
    parts.push(`Поле розыгрыша: ${displayColumn}.`);
  }

  if (activeCount > 0) {
    parts.push(`Сейчас в пуле ${activeCount} ${getRecordWord(activeCount)}.`);
  } else if (totalCount > 0) {
    parts.push("В текущем файле больше не осталось участников для нового розыгрыша.");
  }

  if (excludedCount > 0) {
    parts.push(`Уже исключено ${excludedCount} ${getRecordWord(excludedCount)}.`);
  }

  return parts.join(" ");
}

function renderWinnerHistory(
  listWrapperElement,
  listElement,
  hintElement,
  submitButtonElement,
  session,
) {
  const winnerHistory = Array.isArray(session?.winnerHistory) ? [...session.winnerHistory].reverse() : [];

  if (winnerHistory.length === 0) {
    renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, {
      label: "Победители появятся после первого розыгрыша",
      hint: buildSessionHint(session),
      submitDisabled: (session?.counts?.activeRecords ?? 0) === 0,
    });
    return;
  }

  listWrapperElement.classList.remove("random__list--empty");
  listElement.innerHTML = winnerHistory
    .map(
      (entry) => `
        <li class="random__list-item" data-history-entry-id="${escapeHtml(entry.id)}">
          <div class="random__list-item-digit"></div>
          <div class="random__list-item-text">${escapeHtml(formatDisplayValue(entry.displayValue))}</div>
        </li>
      `,
    )
    .join("");
  hintElement.textContent = buildSessionHint(session);
  submitButtonElement.disabled = (session?.counts?.activeRecords ?? 0) === 0;
}

function highlightWinnerHistory(listElement, historyEntryIds) {
  const targetIds = new Set(historyEntryIds);

  listElement.querySelectorAll(".random__list-item").forEach((itemElement) => {
    const isWinner = targetIds.has(itemElement.dataset.historyEntryId);

    itemElement.classList.toggle("random__list-item--winner", isWinner);
  });
}

export function initRandomControls() {
  const randomSectionElement = document.querySelector(".random");

  if (!randomSectionElement) {
    return;
  }

  const state = {
    session: null,
    lastDraw: null,
    isSidebarOpen: false,
    isImporting: false,
    isFieldModalOpen: false,
    isSavingDisplayColumn: false,
    pendingDisplayColumn: "",
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
  const winnersCountInputElement = randomSectionElement.querySelector(".random__quantity-input");
  const importTriggerButtonElement = randomSectionElement.querySelector("[data-import-trigger]");
  const displayColumnButtonElement = randomSectionElement.querySelector("[data-display-column-button]");
  const displayColumnDescriptionElement = randomSectionElement.querySelector(
    "[data-display-column-description]",
  );
  const resetExclusionsButtonElement = randomSectionElement.querySelector(
    "[data-reset-exclusions-button]",
  );
  const resetExclusionsDescriptionElement = randomSectionElement.querySelector(
    "[data-reset-exclusions-description]",
  );
  const displayColumnModalElement = randomSectionElement.querySelector("[data-display-column-modal]");
  const displayColumnSelectMountElement = randomSectionElement.querySelector(
    "[data-display-column-select]",
  );
  const displayColumnModalDescriptionElement = randomSectionElement.querySelector(
    "[data-display-column-modal-description]",
  );
  const displayColumnModalFileElement = randomSectionElement.querySelector(
    "[data-display-column-modal-file]",
  );
  const displayColumnSaveButtonElement = randomSectionElement.querySelector(
    "[data-display-column-save]",
  );
  const displayColumnCancelButtonElement = randomSectionElement.querySelector(
    "[data-display-column-cancel]",
  );

  randomSectionElement
    .querySelectorAll(".random__quantity-field--counter")
    .forEach((counterElement) => {
      initCounter(counterElement);
    });

  function getDisplayColumnLabel() {
    return String(state.session?.defaults?.displayColumn || "").trim();
  }

  function syncDrawAvailability() {
    const hasActiveRecords = (state.session?.counts?.activeRecords ?? 0) > 0;

    submitButtonElement.disabled =
      !hasActiveRecords || state.isImporting || state.isSavingDisplayColumn || state.isFieldModalOpen;
  }

  function setFieldModalOpen(isOpen) {
    if (!displayColumnModalElement) {
      return;
    }

    state.isFieldModalOpen = isOpen;
    displayColumnModalElement.classList.toggle("random__modal--open", isOpen);
    displayColumnModalElement.setAttribute("aria-hidden", String(!isOpen));
    syncDrawAvailability();
  }

  function syncDisplayColumnControls() {
    if (!displayColumnButtonElement || !displayColumnDescriptionElement) {
      return;
    }

    if (!state.session) {
      displayColumnButtonElement.disabled = true;
      displayColumnButtonElement.textContent = "Выбрать поле";
      displayColumnDescriptionElement.textContent =
        "Сначала загрузите файл, затем можно выбрать колонку из Excel.";
      return;
    }

    const displayColumn = getDisplayColumnLabel();

    displayColumnButtonElement.disabled = false;
    displayColumnButtonElement.textContent = displayColumn ? "Изменить поле" : "Выбрать поле";
    displayColumnDescriptionElement.textContent = displayColumn
      ? `Сейчас розыгрыш идёт по полю «${displayColumn}».`
      : "Поле ещё не выбрано. Укажите колонку из Excel.";
  }

  function openDisplayColumnModal() {
    if (!state.session || !displayColumnModalElement || !displayColumnSelectMountElement) {
      return;
    }

    const selectedValue = getDisplayColumnLabel() || state.session.columns[0] || "";
    const hiddenInputElement = mountDynamicSelect(displayColumnSelectMountElement, {
      name: "displayColumn",
      value: selectedValue,
      options: state.session.columns.map((column) => ({
        value: column,
        label: column,
      })),
      classes: "random__sidebar-select random__select random__modal-select",
    });

    state.pendingDisplayColumn = hiddenInputElement?.value || selectedValue;

    hiddenInputElement?.addEventListener("change", (event) => {
      state.pendingDisplayColumn = event.target.value;
    });

    if (displayColumnModalDescriptionElement) {
      displayColumnModalDescriptionElement.textContent =
        "Выберите колонку из Excel, по которой будут отображаться победители.";
    }

    if (displayColumnModalFileElement) {
      displayColumnModalFileElement.textContent = state.session.source?.originalName
        ? `Файл: ${state.session.source.originalName}`
        : "";
    }

    displayColumnSaveButtonElement.disabled = false;
    displayColumnCancelButtonElement.disabled = false;
    setFieldModalOpen(true);
  }

  function closeDisplayColumnModal() {
    setFieldModalOpen(false);
  }

  function applySavedSidebarSettings(savedSettings) {
    if (!savedSettings) {
      return;
    }

    if (savedSettings.winnersCount && winnersCountInputElement) {
      winnersCountInputElement.value = String(savedSettings.winnersCount);
      winnersCountInputElement.dispatchEvent(new Event("input", { bubbles: true }));
    }

    applySelectValue(
      formElement.querySelector('input[name="removeWinners"]')?.closest(".select"),
      savedSettings.removeWinners || "yes",
    );
    applySelectValue(
      formElement.querySelector('input[name="sortResults"]')?.closest(".select"),
      savedSettings.sortResults || "no",
    );
  }

  function syncSidebarActions() {
    syncDisplayColumnControls();

    if (!resetExclusionsButtonElement || !resetExclusionsDescriptionElement) {
      return;
    }

    const excludedCount = state.session?.counts?.excludedRecords ?? 0;
    const winnerHistoryCount =
      state.session?.counts?.winnerHistory ?? state.session?.winnerHistory?.length ?? 0;

    resetExclusionsButtonElement.textContent =
      excludedCount > 0 || winnerHistoryCount > 0
        ? `Очистить все (${Math.max(excludedCount, winnerHistoryCount)})`
        : "Очистить все";

    if (!state.session) {
      resetExclusionsButtonElement.disabled = true;
      resetExclusionsDescriptionElement.textContent =
        "Сначала загрузите файл. После этого здесь можно очистить историю победителей и исключения.";
      return;
    }

    if (excludedCount === 0 && winnerHistoryCount === 0) {
      resetExclusionsButtonElement.disabled = true;
      resetExclusionsDescriptionElement.textContent =
        "Для текущего файла пока нечего очищать.";
      return;
    }

    const details = [];

    if (winnerHistoryCount > 0) {
      details.push(`очистит историю из ${winnerHistoryCount} ${getWinnerWord(winnerHistoryCount)}`);
    }

    if (excludedCount > 0) {
      details.push(`вернёт в пул ${excludedCount} ${getRecordWord(excludedCount)}`);
    }

    resetExclusionsButtonElement.disabled = false;
    resetExclusionsDescriptionElement.textContent = `Кнопка ${details.join(" и ")}.`;
  }

  function renderCurrentState() {
    const winnerHistoryCount =
      state.session?.counts?.winnerHistory ?? state.session?.winnerHistory?.length ?? 0;

    renderHistoryCounter(recordsSelectMountElement, winnerHistoryCount);

    if (!state.session) {
      renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, {
        label: "Загрузите файл",
        hint: "Нажмите на иконку справа, чтобы выбрать и загрузить Excel-файл.",
        submitDisabled: true,
      });
      syncSidebarActions();
      syncDrawAvailability();
      return;
    }

    renderWinnerHistory(
      listWrapperElement,
      listElement,
      hintElement,
      submitButtonElement,
      state.session,
    );
    syncSidebarActions();
    syncDrawAvailability();
  }

  function setImportingState(isImporting) {
    state.isImporting = isImporting;

    if (!importTriggerButtonElement) {
      return;
    }

    importTriggerButtonElement.disabled = isImporting;
    importTriggerButtonElement.setAttribute("aria-busy", String(isImporting));
    syncDrawAvailability();
  }

  async function hydrateSession(sessionId) {
    try {
      setStatus(statusElement, "Загружаем текущую сессию…");
      const response = await api.getSession(sessionId);

      state.session = response.session;
      state.lastDraw = response.session.lastDraw || null;
      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);

      applySavedSidebarSettings(readSavedSettings());
      renderCurrentState();
      setStatus(statusElement, "");
    } catch (error) {
      randomLogger.warn("Stored session restore failed", error);
      setStatus(
        statusElement,
        "Не удалось восстановить прошлую сессию. Загрузите файл заново.",
        "error",
      );
      state.session = null;
      state.lastDraw = null;
      renderCurrentState();
    }
  }

  function openFilePicker() {
    if (state.isImporting) {
      return;
    }

    fileInputElement?.click();
  }

  async function importFile(file) {
    if (!file || state.isImporting) {
      return;
    }

    const previousSession = state.session;
    const previousDraw = state.lastDraw;

    closeDisplayColumnModal();

    setImportingState(true);
    setStatus(statusElement, "Импортируем Excel-файл и собираем пул участников…");
    renderPlaceholder(listWrapperElement, listElement, hintElement, submitButtonElement, {
      label: file.name,
      hint: "Файл выбран. Ждём завершения загрузки и инвентаризации списка.",
      submitDisabled: true,
    });

    try {
      const response = await api.importReport(file);

      state.session = response.session;
      state.lastDraw = null;
      state.pendingDisplayColumn = response.session.defaults.displayColumn;

      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);
      window.localStorage.removeItem(DRAW_STORAGE_KEY);
      renderCurrentState();
      setStatus(
        statusElement,
        "Файл загружен. Выберите поле для розыгрыша и сохраните настройку.",
        "info",
      );
      openDisplayColumnModal();
    } catch (error) {
      randomLogger.error("Import failed", error);
      state.session = previousSession;
      state.lastDraw = previousDraw;
      renderCurrentState();
      setStatus(statusElement, error.message, "error");
    } finally {
      setImportingState(false);

      if (fileInputElement) {
        fileInputElement.value = "";
      }
    }
  }

  async function handleDraw(event) {
    event.preventDefault();

    if (!state.session) {
      setStatus(statusElement, "Сначала загрузите Excel-файл.", "error");
      return;
    }

    if (state.isFieldModalOpen) {
      setStatus(statusElement, "Сначала выберите поле для розыгрыша и сохраните настройку.", "error");
      return;
    }

    const payload = {
      displayColumn: getDisplayColumnLabel(),
      winnersCount: winnersCountInputElement?.value || "1",
      removeWinners: formElement.querySelector('input[name="removeWinners"]')?.value || "no",
      sortResults: formElement.querySelector('input[name="sortResults"]')?.value || "no",
    };

    setStatus(statusElement, "Запускаем розыгрыш…");
    submitButtonElement.disabled = true;

    try {
      const response = await api.draw(state.session.id, payload);
      const latestHistory = Array.isArray(response.session.winnerHistory)
        ? response.session.winnerHistory
        : [];
      const latestEntryIds = latestHistory
        .slice(-response.draw.winners.length)
        .map((entry) => entry.id);

      state.session = response.session;
      state.lastDraw = response.draw;

      renderCurrentState();
      highlightWinnerHistory(listElement, latestEntryIds);
      saveDrawSettings({
        ...payload,
      });
      window.localStorage.setItem(SESSION_STORAGE_KEY, response.session.id);
      window.localStorage.setItem(DRAW_STORAGE_KEY, response.draw.id);
      syncSidebarActions();
      setStatus(statusElement, "Победители определены. Переходим к экрану результатов…", "success");

      window.setTimeout(() => {
        window.location.href = buildAppUrl("results.html");
      }, 250);
    } catch (error) {
      randomLogger.error("Draw failed", error);
      setStatus(statusElement, error.message, "error");
      syncDrawAvailability();
    }
  }

  fileInputElement?.addEventListener("change", () => {
    const selectedFile = fileInputElement.files?.[0] || null;

    if (!selectedFile) {
      return;
    }

    importFile(selectedFile);
  });

  importTriggerButtonElement?.addEventListener("click", () => {
    openFilePicker();
  });

  displayColumnButtonElement?.addEventListener("click", () => {
    openDisplayColumnModal();
  });

  displayColumnCancelButtonElement?.addEventListener("click", () => {
    closeDisplayColumnModal();

    if (state.session) {
      setStatus(
        statusElement,
        `Используется поле «${getDisplayColumnLabel()}». При необходимости его можно изменить снова.`,
        "info",
      );
    }
  });

  displayColumnSaveButtonElement?.addEventListener("click", async () => {
    if (!state.session || !state.pendingDisplayColumn || state.isSavingDisplayColumn) {
      return;
    }

    state.isSavingDisplayColumn = true;
    displayColumnSaveButtonElement.disabled = true;
    displayColumnCancelButtonElement.disabled = true;
    syncDrawAvailability();
    setStatus(statusElement, "Сохраняем поле для розыгрыша…");

    try {
      const response = await api.updateSessionSettings(state.session.id, {
        displayColumn: state.pendingDisplayColumn,
      });

      state.session = response.session;
      closeDisplayColumnModal();
      renderCurrentState();
      setStatus(
        statusElement,
        `Поле «${getDisplayColumnLabel()}» сохранено. Можно запускать розыгрыш.`,
        "success",
      );
    } catch (error) {
      randomLogger.error("Failed to update display column", error);
      setStatus(statusElement, error.message, "error");
    } finally {
      state.isSavingDisplayColumn = false;
      displayColumnSaveButtonElement.disabled = false;
      displayColumnCancelButtonElement.disabled = false;
      syncDrawAvailability();
    }
  });

  randomSectionElement.querySelector("[data-settings-toggle]")?.addEventListener("click", () => {
    state.isSidebarOpen = !state.isSidebarOpen;
    toggleSidebar(sidebarElement, state.isSidebarOpen);
  });

  resetExclusionsButtonElement?.addEventListener("click", async () => {
    if (!state.session) {
      return;
    }

    setStatus(statusElement, "Очищаем историю победителей и возвращаем участников в пул…");
    resetExclusionsButtonElement.disabled = true;

    try {
      const response = await api.resetExclusions(state.session.id);
      state.session = response.session;
      state.lastDraw = null;
      renderCurrentState();
      setStatus(
        statusElement,
        "История победителей очищена. Все участники снова доступны для розыгрыша.",
        "success",
      );
    } catch (error) {
      randomLogger.error("Reset exclusions failed", error);
      renderCurrentState();
      setStatus(statusElement, error.message, "error");
    }
  });

  formElement?.addEventListener("submit", handleDraw);

  const queryParams = new URLSearchParams(window.location.search);
  const shouldOpenSettings = queryParams.get("openSettings") === "1";
  const storedSessionId =
    queryParams.get("sessionId") || window.localStorage.getItem(SESSION_STORAGE_KEY) || "";

  applySavedSidebarSettings(readSavedSettings());
  renderCurrentState();

  if (shouldOpenSettings) {
    state.isSidebarOpen = true;
    toggleSidebar(sidebarElement, true);
  }

  if (storedSessionId) {
    hydrateSession(storedSessionId);
  }
}
