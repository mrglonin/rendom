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
    assessmentElement.querySelectorAll(".assessment-choice__option-input"),
  );
  const assessmentOptions = Array.from(
    assessmentElement.querySelectorAll(".assessment-choice__option"),
  );
  const assessmentLegendItems = Array.from(
    assessmentElement.querySelectorAll(".assessment-choice__legend-item"),
  );
  const assessmentTouch = assessmentElement.querySelector(".assessment-choice__touch");
  const assessmentAxisLabels = Array.from(
    assessmentElement.querySelectorAll(
      ".assessment-choice__chart .assessment-choice__axis-label",
    ),
  );
  const assessmentTimelineAxisLabels = Array.from(
    assessmentElement.querySelectorAll(
      ".assessment-choice__timeline--bottom .assessment-choice__axis-label",
    ),
  );
  const assessmentTimelinePoints = Array.from(
    assessmentElement.querySelectorAll(".assessment-choice__timeline-point"),
  );
  const assessmentResults = Array.from(
    assessmentElement.querySelectorAll(".assessment-results__card"),
  );
  const representativeItems = Array.from(
    assessmentElement.querySelectorAll(".representatives__item"),
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
      resultIndex: 0,
    },
    1: {
      legendIndex: 1,
      chartAxisIndex: 2,
      timelineAxisIndex: 1,
      timelinePointIndex: 1,
      resultIndex: 1,
    },
    2: {
      legendIndex: 2,
      chartAxisIndex: 3,
      timelineAxisIndex: 1,
      timelinePointIndex: 1,
      resultIndex: 2,
    },
    3: {
      legendIndex: 0,
      chartAxisIndex: 0,
      timelineAxisIndex: 2,
      timelinePointIndex: 2,
      resultIndex: 3,
    },
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
      optionIndex,
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
      "assessment-choice__axis-label--active",
    );
    assessmentTimelinePoints[config.timelinePointIndex]?.classList.add(
      "assessment-choice__timeline-point--active",
    );
    assessmentResults[config.resultIndex]?.classList.add("assessment-results__card--active");

    if (hideTouch && assessmentTouch) {
      assessmentTouch.classList.add("assessment-choice__touch--hidden");
    }

    selectedAssessmentState = getSelectedAssessmentState();
    appState.assessmentIndex = optionIndex;
    appState.assessmentValue = selectedAssessmentState?.value ?? null;
  };

  const initialActiveOption = assessmentOptions.find((option) =>
    option.classList.contains("assessment-choice__option--active"),
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

      const isActive = hintElement.classList.contains("representative-hint--active")
        || hintElement.classList.contains("hint--active");

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

    setTestTitle("Правовой статус ИИ");
    setGlobalStep(2);
  });
}

initAssessment();
