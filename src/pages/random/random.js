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
      const direction = buttonElement.classList.contains("random__quantity-stepper-button--increase")
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

export function initRandomControls() {
  const randomSectionElement = document.querySelector(".random");

  if (!randomSectionElement) {
    return;
  }

  randomSectionElement.querySelectorAll(".random__quantity-field--counter").forEach((counterElement) => {
    initCounter(counterElement);
  });

}
