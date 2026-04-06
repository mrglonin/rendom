export function initResultsPage() {
  const resultsSectionElement = document.querySelector(".results");

  if (!resultsSectionElement) {
    return;
  }

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

    if (targetElement.classList.contains("results__type--list")) {
      resultsSectionElement.classList.add("results--view-list");
    }
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

  const defaultTypeElement =
    resultsSectionElement.querySelector(".results__type--active") || typeElements[0];

  applyType(defaultTypeElement);
}
