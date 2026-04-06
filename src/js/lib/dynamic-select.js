import { initSelects } from "../../blocks/select/select.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildOptionsMarkup(options, selectedValue) {
  return options
    .map((option) => {
      const isSelected = option.value === selectedValue;

      return `
        <li>
          <button class="select__option${isSelected ? " is-selected" : ""}" type="button"
            data-value="${escapeHtml(option.value)}" role="option" aria-selected="${isSelected ? "true" : "false"}">
            ${escapeHtml(option.label)}
          </button>
        </li>
      `;
    })
    .join("");
}

export function mountDynamicSelect(targetElement, { name, value, options, classes = "" }) {
  const safeOptions = options.length > 0 ? options : [{ value: "", label: "Нет доступных значений" }];
  const selectedValue = safeOptions.some((option) => option.value === value) ? value : safeOptions[0].value;
  const selectedOption = safeOptions.find((option) => option.value === selectedValue) || safeOptions[0];

  targetElement.innerHTML = `
    <div class="select js-select${classes ? ` ${classes}` : ""}">
      <input class="select__input" type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(selectedValue)}">
      <button class="select__trigger" type="button" aria-expanded="false" aria-haspopup="listbox">
        <span class="select__value">${escapeHtml(selectedOption.label)}</span>
        <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 9.5L15.5 21.5L28.5 9.5" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
      <ul class="select__dropdown" role="listbox">
        ${buildOptionsMarkup(safeOptions, selectedValue)}
      </ul>
    </div>
  `;

  initSelects(targetElement);

  return targetElement.querySelector(".select__input");
}
