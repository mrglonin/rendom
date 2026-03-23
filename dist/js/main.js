// src/js/app.js
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
          item.getAttribute("data-language") === languageValue
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
    timerId: null
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

// src/blocks/quiz/quiz.js
function initQuiz() {
  const quizElement = document.querySelector(".quiz");
  const assessmentElement = document.querySelector(".assessment");
  const testTitleElement = document.querySelector(".test__title");
  if (!quizElement || !assessmentElement) {
    return;
  }
  const questionCards = Array.from(
    quizElement.querySelectorAll(".question-cards__item")
  );
  const answerGroups = Array.from(
    quizElement.querySelectorAll(".answer-groups__item")
  );
  const form = quizElement.querySelector(".answer-groups__form");
  const backButton = quizElement.querySelector(".answer-groups__back");
  const submitButton = quizElement.querySelector(".answer-groups__submit");
  const stepItems = Array.from(document.querySelectorAll(".steps__item"));
  if (!form || !backButton || !submitButton || !questionCards.length || !answerGroups.length) {
    return;
  }
  let currentStep = questionCards.findIndex(
    (card) => card.classList.contains("question-card--active")
  );
  if (currentStep === -1) {
    currentStep = 0;
    questionCards[0].classList.add("question-card--active");
  }
  if (!answerGroups[currentStep].classList.contains("answer-groups__item--active")) {
    answerGroups.forEach((group, index) => {
      group.classList.toggle("answer-groups__item--active", index === currentStep);
    });
  }
  const syncSubmitState = () => {
    const currentGroup = answerGroups[currentStep];
    if (!currentGroup) {
      submitButton.disabled = true;
      return;
    }
    const checkedInput = currentGroup.querySelector(".answer-group__input:checked");
    submitButton.disabled = !checkedInput;
  };
  const syncBackState = () => {
    backButton.disabled = currentStep === 0;
  };
  const setGlobalStep = (stepIndex) => {
    if (!stepItems.length) {
      return;
    }
    stepItems.forEach((item, index) => {
      item.classList.toggle("steps__item--active", index === stepIndex);
    });
  };
  const setTestTitle = (title) => {
    if (!testTitleElement) {
      return;
    }
    window.__setAnimatedTestTitle?.(title);
  };
  const getGroupSelectionData = (groupElement) => {
    if (!groupElement) {
      return null;
    }
    const checkedInput = groupElement.querySelector(".answer-group__input:checked");
    if (!checkedInput) {
      return null;
    }
    const answerItem = checkedInput.closest(".answer-group__item");
    const answerLabel = answerItem?.querySelector(".answer-group__label");
    const groupIndex = answerGroups.indexOf(groupElement) + 1;
    const answerIndex = answerItem && answerItem.parentElement ? Array.from(answerItem.parentElement.children).indexOf(answerItem) + 1 : null;
    return {
      step: groupIndex,
      value: checkedInput.value,
      inputId: checkedInput.id,
      answerIndex,
      text: answerLabel?.textContent?.trim() || ""
    };
  };
  const getAnswersState = () => answerGroups.map((groupElement, index) => {
    const selection = getGroupSelectionData(groupElement);
    return {
      step: index + 1,
      answered: Boolean(selection),
      value: selection?.value ?? null,
      inputId: selection?.inputId ?? null,
      answerIndex: selection?.answerIndex ?? null,
      text: selection?.text ?? null
    };
  });
  const clearActiveAnswers = (groupElement) => {
    const answerItems = groupElement.querySelectorAll(".answer-group__item");
    answerItems.forEach((item) => {
      item.classList.remove("answer-group__item--active");
    });
  };
  const clearGroupSelection = (groupElement) => {
    if (!groupElement) {
      return;
    }
    const checkedInput = groupElement.querySelector(".answer-group__input:checked");
    if (checkedInput) {
      checkedInput.checked = false;
    }
    clearActiveAnswers(groupElement);
  };
  const setActiveAnswer = (groupElement, selectedInput) => {
    const answerItems = groupElement.querySelectorAll(".answer-group__item");
    answerItems.forEach((item) => {
      const input = item.querySelector(".answer-group__input");
      item.classList.toggle("answer-group__item--active", input === selectedInput);
    });
  };
  const goToStep = (nextStep) => {
    const currentCard = questionCards[currentStep];
    const currentGroup = answerGroups[currentStep];
    const nextCard = questionCards[nextStep];
    const nextGroup = answerGroups[nextStep];
    if (!nextCard || !nextGroup) {
      return;
    }
    currentCard.classList.remove("question-card--active");
    currentGroup.classList.remove("answer-groups__item--active");
    clearActiveAnswers(currentGroup);
    nextCard.classList.add("question-card--active");
    nextGroup.classList.add("answer-groups__item--active");
    currentStep = nextStep;
    syncBackState();
    syncSubmitState();
  };
  form.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    if (!target.classList.contains("answer-group__input")) {
      return;
    }
    const currentGroup = answerGroups[currentStep];
    if (!currentGroup || !currentGroup.contains(target)) {
      return;
    }
    setActiveAnswer(currentGroup, target);
    syncSubmitState();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const isLastStep = currentStep === questionCards.length - 1;
    if (submitButton.disabled) {
      return;
    }
    const selectionData = getGroupSelectionData(answerGroups[currentStep]);
    console.log("forward", selectionData);
    console.log("answers", getAnswersState());
    if (isLastStep) {
      quizElement.classList.add("quiz--hidden");
      assessmentElement.classList.remove("assessment--hidden");
      assessmentElement.classList.add("assessment--active");
      setTestTitle("\u0422\u0435\u0441\u0442");
      setGlobalStep(1);
      console.log("done");
      return;
    }
    goToStep(currentStep + 1);
  });
  backButton.addEventListener("click", () => {
    if (currentStep === 0) {
      return;
    }
    const previousStep = currentStep - 1;
    const previousGroup = answerGroups[previousStep];
    const previousSelectionData = getGroupSelectionData(previousGroup);
    console.log("back", previousSelectionData);
    questionCards[currentStep].classList.remove("question-card--active");
    answerGroups[currentStep].classList.remove("answer-groups__item--active");
    clearActiveAnswers(answerGroups[currentStep]);
    clearGroupSelection(previousGroup);
    questionCards[previousStep].classList.add("question-card--active");
    previousGroup.classList.add("answer-groups__item--active");
    currentStep = previousStep;
    syncBackState();
    syncSubmitState();
    console.log("answers", getAnswersState());
  });
  syncBackState();
  syncSubmitState();
  setTestTitle("\u0422\u0435\u0441\u0442");
  setGlobalStep(0);
}
initQuiz();

// src/blocks/assessment/assessment.js
function initAssessment() {
  const assessmentElement = document.querySelector(".assessment");
  const statusElement = document.querySelector(".status");
  const testTitleElement = document.querySelector(".test__title");
  if (!assessmentElement) {
    return;
  }
  const formElement = assessmentElement.querySelector(".assessment-choice__form");
  const submitButton = assessmentElement.querySelector(".assessment__submit");
  const assessmentInputs = Array.from(
    assessmentElement.querySelectorAll(".assessment-choice__option-input")
  );
  const assessmentOptions = Array.from(
    assessmentElement.querySelectorAll(".assessment-choice__option")
  );
  const assessmentLegendItems = Array.from(
    assessmentElement.querySelectorAll(".assessment-choice__legend-item")
  );
  const assessmentTouch = assessmentElement.querySelector(".assessment-choice__touch");
  const assessmentAxisLabels = Array.from(
    assessmentElement.querySelectorAll(
      ".assessment-choice__chart .assessment-choice__axis-label"
    )
  );
  const assessmentTimelineAxisLabels = Array.from(
    assessmentElement.querySelectorAll(
      ".assessment-choice__timeline--bottom .assessment-choice__axis-label"
    )
  );
  const assessmentTimelinePoints = Array.from(
    assessmentElement.querySelectorAll(".assessment-choice__timeline-point")
  );
  const assessmentResults = Array.from(
    assessmentElement.querySelectorAll(".assessment-results__card")
  );
  const representativeItems = Array.from(
    assessmentElement.querySelectorAll(".representatives__item")
  );
  const stepItems = Array.from(document.querySelectorAll(".steps__item"));
  if (!formElement || !submitButton || !assessmentInputs.length) {
    return;
  }
  const appState = window.__aiAppState || (window.__aiAppState = {});
  let selectedAssessmentState = null;
  const setGlobalStep = (stepIndex) => {
    if (!stepItems.length) {
      return;
    }
    stepItems.forEach((item, index) => {
      item.classList.toggle("steps__item--active", index === stepIndex);
    });
  };
  const setTestTitle = (title) => {
    if (!testTitleElement) {
      return;
    }
    window.__setAnimatedTestTitle?.(title);
  };
  const activationMap = {
    0: {
      legendIndex: 0,
      chartAxisIndex: 1,
      timelineAxisIndex: 1,
      timelinePointIndex: 1,
      resultIndex: 0
    },
    1: {
      legendIndex: 1,
      chartAxisIndex: 2,
      timelineAxisIndex: 1,
      timelinePointIndex: 1,
      resultIndex: 1
    },
    2: {
      legendIndex: 2,
      chartAxisIndex: 3,
      timelineAxisIndex: 1,
      timelinePointIndex: 1,
      resultIndex: 2
    },
    3: {
      legendIndex: 0,
      chartAxisIndex: 0,
      timelineAxisIndex: 2,
      timelinePointIndex: 2,
      resultIndex: 3
    }
  };
  const getSelectedAssessmentState = () => {
    const checkedInput = assessmentElement.querySelector(".assessment-choice__option-input:checked");
    if (!checkedInput) {
      return null;
    }
    const optionElement = checkedInput.closest(".assessment-choice__option");
    const optionIndex = optionElement ? assessmentOptions.indexOf(optionElement) : -1;
    return {
      name: checkedInput.name,
      value: checkedInput.value,
      inputId: checkedInput.id,
      optionIndex
    };
  };
  const clearAssessmentState = () => {
    assessmentOptions.forEach((option) => {
      option.classList.remove("assessment-choice__option--active");
    });
    assessmentLegendItems.forEach((item) => {
      item.classList.remove("assessment-choice__legend-item--active");
    });
    assessmentAxisLabels.forEach((label) => {
      label.classList.remove("assessment-choice__axis-label--active");
    });
    assessmentTimelineAxisLabels.forEach((label) => {
      label.classList.remove("assessment-choice__axis-label--active");
    });
    assessmentTimelinePoints.forEach((point) => {
      point.classList.remove("assessment-choice__timeline-point--active");
    });
    assessmentResults.forEach((result) => {
      result.classList.remove("assessment-results__card--active");
    });
  };
  const clearRepresentativeHints = () => {
    representativeItems.forEach((item) => {
      const hintElement = item.querySelector(".representative-hint");
      const cardElement = item.querySelector(".representative-card");
      if (hintElement) {
        hintElement.classList.remove("representative-hint--active", "hint--active");
      }
      if (cardElement) {
        cardElement.classList.remove("representative-card--active");
      }
    });
  };
  const activateAssessmentByIndex = (optionIndex, { hideTouch = false } = {}) => {
    const config = activationMap[optionIndex];
    if (!config) {
      return;
    }
    clearAssessmentState();
    assessmentOptions[optionIndex]?.classList.add("assessment-choice__option--active");
    assessmentLegendItems[config.legendIndex]?.classList.add("assessment-choice__legend-item--active");
    assessmentAxisLabels[config.chartAxisIndex]?.classList.add("assessment-choice__axis-label--active");
    assessmentTimelineAxisLabels[config.timelineAxisIndex]?.classList.add(
      "assessment-choice__axis-label--active"
    );
    assessmentTimelinePoints[config.timelinePointIndex]?.classList.add(
      "assessment-choice__timeline-point--active"
    );
    assessmentResults[config.resultIndex]?.classList.add("assessment-results__card--active");
    if (hideTouch && assessmentTouch) {
      assessmentTouch.classList.add("assessment-choice__touch--hidden");
    }
    selectedAssessmentState = getSelectedAssessmentState();
    appState.assessmentIndex = optionIndex;
    appState.assessmentValue = selectedAssessmentState?.value ?? null;
  };
  const initialActiveOption = assessmentOptions.find(
    (option) => option.classList.contains("assessment-choice__option--active")
  );
  if (initialActiveOption) {
    const initialInput = initialActiveOption.querySelector(".assessment-choice__option-input");
    if (initialInput && !assessmentElement.querySelector(".assessment-choice__option-input:checked")) {
      initialInput.checked = true;
      activateAssessmentByIndex(assessmentOptions.indexOf(initialActiveOption));
    }
  }
  assessmentInputs.forEach((inputElement, optionIndex) => {
    inputElement.addEventListener("change", () => {
      activateAssessmentByIndex(optionIndex, { hideTouch: true });
    });
  });
  representativeItems.forEach((itemElement) => {
    itemElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const hintElement = itemElement.querySelector(".representative-hint");
      if (!hintElement) {
        return;
      }
      const isActive = hintElement.classList.contains("representative-hint--active") || hintElement.classList.contains("hint--active");
      clearRepresentativeHints();
      if (!isActive) {
        hintElement.classList.add("representative-hint--active", "hint--active");
        itemElement.querySelector(".representative-card")?.classList.add("representative-card--active");
      }
    });
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (target.closest(".representatives__item")) {
      return;
    }
    clearRepresentativeHints();
  });
  submitButton.addEventListener("click", () => {
    const formData = Object.fromEntries(new FormData(formElement).entries());
    console.log("assessment form", formData);
    console.log("assessment selected", selectedAssessmentState);
    appState.assessmentIndex = selectedAssessmentState?.optionIndex ?? 0;
    appState.assessmentValue = selectedAssessmentState?.value ?? null;
    if (!statusElement) {
      return;
    }
    assessmentElement.classList.add("assessment--hidden");
    assessmentElement.classList.remove("assessment--active");
    statusElement.classList.remove("status--hidden");
    statusElement.classList.add("status--active");
    setTestTitle("\u041F\u0440\u0430\u0432\u043E\u0432\u043E\u0439 \u0441\u0442\u0430\u0442\u0443\u0441 \u0418\u0418");
    setGlobalStep(2);
  });
}
initAssessment();

// src/blocks/status/status.js
function initStatus() {
  const statusElement = document.querySelector(".status");
  const assessmentElement = document.querySelector(".assessment");
  const resultsElement = document.querySelector(".results");
  const testTitleElement = document.querySelector(".test__title");
  if (!statusElement) {
    return;
  }
  const statusItems = Array.from(statusElement.querySelectorAll(".status__item"));
  const formElement = statusElement.querySelector(".status__selection");
  const sliderItems = Array.from(statusElement.querySelectorAll(".slider__item"));
  const sliderInputs = Array.from(statusElement.querySelectorAll(".slider__input"));
  const sliderTrack = statusElement.querySelector(".slider__track");
  const sliderThumb = statusElement.querySelector(".slider__thumb");
  const statusTouch = statusElement.querySelector(".status__touch");
  const backButton = statusElement.querySelector(".status__back");
  const submitButton = statusElement.querySelector(".status__submit");
  const stepItems = Array.from(document.querySelectorAll(".steps__item"));
  if (!statusItems.length || !sliderItems.length || !sliderInputs.length || !formElement || !backButton || !submitButton) {
    return;
  }
  const appState = window.__aiAppState || (window.__aiAppState = {});
  let selectedIndex = null;
  let isDragging = false;
  const setGlobalStep = (stepIndex) => {
    if (!stepItems.length) {
      return;
    }
    stepItems.forEach((item, index) => {
      item.classList.toggle("steps__item--active", index === stepIndex);
    });
  };
  const setTestTitle = (title) => {
    if (!testTitleElement) {
      return;
    }
    window.__setAnimatedTestTitle?.(title);
  };
  const hideTouch = () => {
    if (statusTouch) {
      statusTouch.classList.add("status__touch--hidden");
    }
  };
  const syncThumbPosition = (index) => {
    if (!sliderTrack || !sliderThumb || !sliderItems[index]) {
      return;
    }
    const trackRect = sliderTrack.getBoundingClientRect();
    const itemRect = sliderItems[index].getBoundingClientRect();
    const thumbWidth = sliderThumb.offsetWidth;
    const itemCenter = itemRect.left - trackRect.left + itemRect.width / 2;
    const thumbOffset = itemCenter - thumbWidth / 2;
    sliderThumb.style.transform = `translate(${thumbOffset}px, -50%)`;
  };
  const getNearestIndexFromClientX = (clientX) => {
    if (!sliderTrack || !sliderItems.length) {
      return 0;
    }
    const trackRect = sliderTrack.getBoundingClientRect();
    const clampedX = Math.min(Math.max(clientX, trackRect.left), trackRect.right);
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    sliderItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(clampedX - itemCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  };
  const setStatusByIndex = (index) => {
    statusItems.forEach((item, itemIndex) => {
      item.classList.toggle("status__item--active", itemIndex === index);
    });
    sliderItems.forEach((item, itemIndex) => {
      item.classList.toggle("slider__item--active", itemIndex === index);
    });
    sliderInputs.forEach((input, inputIndex) => {
      input.checked = inputIndex === index;
    });
    syncThumbPosition(index);
  };
  const initialActiveIndex = sliderInputs.findIndex((input) => input.checked);
  if (initialActiveIndex >= 0) {
    selectedIndex = initialActiveIndex;
    setStatusByIndex(initialActiveIndex);
  } else {
    selectedIndex = 0;
    setStatusByIndex(0);
  }
  backButton.disabled = false;
  submitButton.disabled = false;
  sliderItems.forEach((itemElement, itemIndex) => {
    itemElement.addEventListener("click", () => {
      hideTouch();
      selectedIndex = itemIndex;
      setStatusByIndex(itemIndex);
      submitButton.disabled = false;
      backButton.disabled = false;
    });
  });
  const handleDragMove = (clientX) => {
    const nextIndex = getNearestIndexFromClientX(clientX);
    if (nextIndex !== selectedIndex) {
      selectedIndex = nextIndex;
      setStatusByIndex(nextIndex);
    } else {
      syncThumbPosition(nextIndex);
    }
    submitButton.disabled = false;
    backButton.disabled = false;
  };
  const stopDragging = () => {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    statusElement.classList.remove("status--dragging");
  };
  if (sliderTrack) {
    sliderTrack.addEventListener("pointerdown", (event) => {
      hideTouch();
      isDragging = true;
      statusElement.classList.add("status--dragging");
      handleDragMove(event.clientX);
    });
  }
  if (sliderThumb) {
    sliderThumb.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      hideTouch();
      isDragging = true;
      statusElement.classList.add("status--dragging");
      handleDragMove(event.clientX);
    });
  }
  window.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }
    handleDragMove(event.clientX);
  });
  window.addEventListener("pointerup", stopDragging);
  window.addEventListener("pointercancel", stopDragging);
  window.addEventListener("resize", () => {
    if (selectedIndex === null) {
      return;
    }
    syncThumbPosition(selectedIndex);
  });
  backButton.addEventListener("click", () => {
    if (!assessmentElement) {
      return;
    }
    statusElement.classList.add("status--hidden");
    statusElement.classList.remove("status--active");
    assessmentElement.classList.remove("assessment--hidden");
    assessmentElement.classList.add("assessment--active");
    setTestTitle("\u0422\u0435\u0441\u0442");
    setGlobalStep(1);
  });
  submitButton.addEventListener("click", () => {
    const formData = Object.fromEntries(new FormData(formElement).entries());
    const selectedValue = selectedIndex !== null ? sliderInputs[selectedIndex]?.value ?? null : null;
    const selectedText = selectedIndex !== null ? sliderItems[selectedIndex]?.querySelector(".slider__text")?.textContent?.trim() || "" : null;
    console.log("status form", formData);
    console.log("status selected", {
      index: selectedIndex,
      value: selectedValue,
      text: selectedText
    });
    appState.statusIndex = selectedIndex ?? 0;
    appState.statusValue = selectedValue;
    appState.statusText = selectedText;
    if (!resultsElement) {
      return;
    }
    document.dispatchEvent(new CustomEvent("results:open", {
      detail: {
        assessmentIndex: appState.assessmentIndex ?? 0,
        statusIndex: selectedIndex ?? 0
      }
    }));
  });
}
initStatus();

// src/blocks/results/results.js
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
        Number(card.dataset.cardIndex) === cardIndex
      );
    });
  };
  const openResults = ({ assessmentIndex = 0, statusIndex = 0 } = {}) => {
    const cardIndex = assessmentIndex * 5 + statusIndex + 1;
    appState.resultsCardIndex = cardIndex;
    setActiveCard(cardIndex);
    if (statusElement) {
      statusElement.classList.add("status--hidden");
      statusElement.classList.remove("status--active");
    }
    resultsElement.classList.remove("results--hidden");
    resultsElement.classList.add("results--active");
    setTestTitle("\u0412\u044B \u0438 \u0418\u0418");
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
    setTestTitle("\u041F\u0440\u0430\u0432\u043E\u0432\u043E\u0439 \u0441\u0442\u0430\u0442\u0443\u0441 \u0418\u0418");
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

// src/blocks/end/end.js
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
    setTestTitle("\u0412\u044B \u0438 \u0418\u0418");
    setGlobalStep(3);
  });
}
initEnd();
