function initScreenFlow() {
  const startElement = document.querySelector(".start");
  const testElement = document.querySelector(".test");
  const endElement = document.querySelector(".end");
  const resetPopupElement = document.querySelector('[data-popup="reset"]');
  const languagesPopupElement = document.querySelector('[data-popup="languages"]');
  const endSubmitButton = endElement?.querySelector(".end__submit");

  if (!startElement || !testElement) {
    return;
  }

  const openPopup = (popupElement) => {
    if (!popupElement) {
      return;
    }

    popupElement.classList.add("popup--open");
    popupElement.setAttribute("aria-hidden", "false");
  };

  const closePopup = (popupElement) => {
    if (!popupElement) {
      return;
    }

    popupElement.classList.remove("popup--open");
    popupElement.setAttribute("aria-hidden", "true");
  };

  startElement.addEventListener("click", () => {
    if (startElement.classList.contains("start--hidden")) {
      return;
    }

    startElement.classList.add("start--hidden");
    testElement.classList.remove("test--hidden");
    testElement.classList.add("test--active");
  });

  document.querySelectorAll(".navigation__item--home").forEach((homeButton) => {
    homeButton.addEventListener("click", () => {
      openPopup(resetPopupElement);
    });
  });

  document.querySelectorAll(".navigation__item--lang").forEach((languageButton) => {
    languageButton.addEventListener("click", () => {
      openPopup(languagesPopupElement);
    });
  });

  if (endSubmitButton) {
    endSubmitButton.addEventListener("click", () => {
      openPopup(resetPopupElement);
    });
  }

  document.querySelectorAll("[data-popup-close]").forEach((closeTrigger) => {
    closeTrigger.addEventListener("click", (event) => {
      const popupElement = closeTrigger.closest("[data-popup]");

      if (!popupElement) {
        return;
      }

      if (event.target === closeTrigger || closeTrigger.hasAttribute("data-popup-action") === false) {
        closePopup(popupElement);
      }
    });
  });

  document.querySelectorAll('[data-popup-action="reset-app"]').forEach((resetButton) => {
    resetButton.addEventListener("click", () => {
      window.location.reload();
    });
  });

  document.querySelectorAll("[data-language]").forEach((languageButton) => {
    languageButton.addEventListener("click", () => {
      const languageValue = languageButton.getAttribute("data-language");
      const languagePopup = languageButton.closest('[data-popup="languages"]');

      if (!languagePopup || !languageValue) {
        return;
      }

      languagePopup.querySelectorAll("[data-language]").forEach((item) => {
        item.classList.toggle(
          "popup-card__action--active",
          item.getAttribute("data-language") === languageValue,
        );
      });

      closePopup(languagePopup);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closePopup(resetPopupElement);
    closePopup(languagesPopupElement);
  });

  [resetPopupElement, languagesPopupElement].forEach((popupElement) => {
    popupElement?.querySelector(".popup__inner")?.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });
}

function initAnimatedTestTitle() {
  const testTitleElement = document.querySelector(".test__title");
  const testTitleTextElement = testTitleElement?.querySelector(".test__title-text");

  if (!testTitleElement || !testTitleTextElement) {
    return;
  }

  const state = {
    currentTitle: testTitleTextElement.textContent.trim(),
    timerId: null,
  };

  window.__setAnimatedTestTitle = (nextTitle) => {
    if (!testTitleTextElement || typeof nextTitle !== "string") {
      return;
    }

    if (state.currentTitle === nextTitle) {
      return;
    }

    if (state.timerId) {
      window.clearTimeout(state.timerId);
      state.timerId = null;
    }

    testTitleTextElement.classList.add("test__title-text--changing");

    state.timerId = window.setTimeout(() => {
      testTitleTextElement.textContent = nextTitle;
      state.currentTitle = nextTitle;
      testTitleTextElement.classList.remove("test__title-text--changing");
      state.timerId = null;
    }, 90);
  };
}

initAnimatedTestTitle();
initScreenFlow();
