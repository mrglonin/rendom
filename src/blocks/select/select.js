const initializedSelects = new WeakSet();
const openSelects = new Set();

let areDocumentHandlersBound = false;

function closeSelect(selectElement, restoreFocus = false) {
  const triggerElement = selectElement.querySelector(".select__trigger");

  selectElement.classList.remove("select--open");
  openSelects.delete(selectElement);

  if (triggerElement) {
    triggerElement.setAttribute("aria-expanded", "false");

    if (restoreFocus) {
      triggerElement.focus();
    }
  }
}

function closeAllSelects() {
  Array.from(openSelects).forEach((selectElement) => {
    closeSelect(selectElement);
  });
}

function bindDocumentHandlers() {
  if (areDocumentHandlersBound) {
    return;
  }

  document.addEventListener("click", (event) => {
    Array.from(openSelects).forEach((selectElement) => {
      if (selectElement.contains(event.target)) {
        return;
      }

      closeSelect(selectElement);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeAllSelects();
  });

  areDocumentHandlersBound = true;
}

function initSelect(selectElement) {
  if (initializedSelects.has(selectElement)) {
    return;
  }

  const triggerElement = selectElement.querySelector(".select__trigger");
  const valueElement = selectElement.querySelector(".select__value");
  const hiddenInputElement = selectElement.querySelector(".select__input");
  const optionElements = selectElement.querySelectorAll(".select__option");

  if (!triggerElement || !valueElement || !hiddenInputElement || optionElements.length === 0) {
    return;
  }

  const open = () => {
    Array.from(openSelects).forEach((openedElement) => {
      if (openedElement !== selectElement) {
        closeSelect(openedElement);
      }
    });

    selectElement.classList.add("select--open");
    openSelects.add(selectElement);
    triggerElement.setAttribute("aria-expanded", "true");
  };

  const moveFocus = (step) => {
    const optionsList = Array.from(optionElements);
    const activeIndex = optionsList.findIndex((item) => item === document.activeElement);
    const selectedIndex = optionsList.findIndex((item) => item.classList.contains("is-selected"));
    const currentIndex = activeIndex >= 0 ? activeIndex : Math.max(selectedIndex, 0);
    const nextIndex = (currentIndex + step + optionsList.length) % optionsList.length;

    optionsList[nextIndex].focus();
  };

  const applySelection = (optionElement, closeAfterSelect = true, emitChange = true) => {
    optionElements.forEach((item) => {
      item.classList.remove("is-selected");
      item.setAttribute("aria-selected", "false");
    });

    optionElement.classList.add("is-selected");
    optionElement.setAttribute("aria-selected", "true");
    valueElement.textContent = optionElement.textContent.trim();
    selectElement.dataset.value = optionElement.getAttribute("data-value") || "";
    hiddenInputElement.value = selectElement.dataset.value;

    if (emitChange) {
      hiddenInputElement.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (closeAfterSelect) {
      closeSelect(selectElement, true);
    }
  };

  triggerElement.addEventListener("click", () => {
    if (selectElement.classList.contains("select--open")) {
      closeSelect(selectElement);
      return;
    }

    open();
  });

  triggerElement.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open();

      const selectedOption = selectElement.querySelector(".select__option.is-selected");

      if (selectedOption) {
        selectedOption.focus();
      }
    }
  });

  optionElements.forEach((optionElement) => {
    optionElement.addEventListener("click", () => {
      applySelection(optionElement);
    });

    optionElement.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveFocus(1);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveFocus(-1);
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        applySelection(optionElement);
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeSelect(selectElement, true);
      }
    });
  });

  const selectedOption = selectElement.querySelector(".select__option.is-selected");

  if (selectedOption) {
    applySelection(selectedOption, false, false);
  } else {
    applySelection(optionElements[0], false, false);
  }

  initializedSelects.add(selectElement);
}

export function initSelects(root = document) {
  bindDocumentHandlers();

  root.querySelectorAll(".js-select").forEach((selectElement) => {
    initSelect(selectElement);
  });
}
