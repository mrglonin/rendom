function initEnd() {
  const endElement = document.querySelector(".end");
  const testElement = document.querySelector(".test");
  const resultsElement = document.querySelector(".results");
  const testTitleElement = document.querySelector(".test__title");
  const backButton = endElement?.querySelector(".end__back");

  if (!endElement || !testElement || !resultsElement || !backButton) {
    return;
  }

  const stepItems = Array.from(document.querySelectorAll(".steps__item"));

  const setGlobalStep = (stepIndex) => {
    stepItems.forEach((item, index) => {
      item.classList.toggle("steps__item--active", index === stepIndex);
    });
  };

  const setTestTitle = (title) => {
    if (testTitleElement) {
      window.__setAnimatedTestTitle?.(title);
    }
  };

  backButton.addEventListener("click", () => {
    endElement.classList.add("end--hidden");
    endElement.classList.remove("end--active");

    testElement.classList.remove("test--hidden");
    testElement.classList.add("test--active");

    resultsElement.classList.remove("results--hidden");
    resultsElement.classList.add("results--active");

    setTestTitle("Вы и ИИ");
    setGlobalStep(3);
  });
}

initEnd();
