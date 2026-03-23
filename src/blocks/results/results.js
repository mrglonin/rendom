function initResults() {
  const resultsElement = document.querySelector(".results");
  const statusElement = document.querySelector(".status");
  const testElement = document.querySelector(".test");
  const endElement = document.querySelector(".end");
  const testTitleElement = document.querySelector(".test__title");
  const backButton = resultsElement?.querySelector(".results__back");
  const submitButton = resultsElement?.querySelector(".results__submit");
  const resultCards = Array.from(resultsElement?.querySelectorAll(".results__card") || []);
  const stepItems = Array.from(document.querySelectorAll(".steps__item"));

  if (!resultsElement || !backButton || !submitButton || !resultCards.length) {
    return;
  }

  const appState = window.__aiAppState || (window.__aiAppState = {});

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

  const setActiveCard = (cardIndex) => {
    resultCards.forEach((card) => {
      card.classList.toggle(
        "results__card--active",
        Number(card.dataset.cardIndex) === cardIndex,
      );
    });
  };

  const openResults = ({ assessmentIndex = 0, statusIndex = 0 } = {}) => {
    const cardIndex = (assessmentIndex * 5) + statusIndex + 1;

    appState.resultsCardIndex = cardIndex;
    setActiveCard(cardIndex);

    if (statusElement) {
      statusElement.classList.add("status--hidden");
      statusElement.classList.remove("status--active");
    }

    resultsElement.classList.remove("results--hidden");
    resultsElement.classList.add("results--active");

    setTestTitle("Вы и ИИ");
    setGlobalStep(3);
  };

  document.addEventListener("results:open", (event) => {
    openResults(event.detail || {});
  });

  backButton.addEventListener("click", () => {
    if (statusElement) {
      statusElement.classList.remove("status--hidden");
      statusElement.classList.add("status--active");
    }

    resultsElement.classList.add("results--hidden");
    resultsElement.classList.remove("results--active");

    setTestTitle("Правовой статус ИИ");
    setGlobalStep(2);
  });

  submitButton.addEventListener("click", () => {
    if (testElement) {
      testElement.classList.add("test--hidden");
      testElement.classList.remove("test--active");
    }

    if (endElement) {
      endElement.classList.remove("end--hidden");
      endElement.classList.add("end--active");
    }
  });
}

initResults();
