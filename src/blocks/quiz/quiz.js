function initQuiz() {
  const quizElement = document.querySelector(".quiz");
  const assessmentElement = document.querySelector(".assessment");
  const testTitleElement = document.querySelector(".test__title");

  if (!quizElement || !assessmentElement) {
    return;
  }

  const questionCards = Array.from(
    quizElement.querySelectorAll(".question-cards__item"),
  );
  const answerGroups = Array.from(
    quizElement.querySelectorAll(".answer-groups__item"),
  );
  const form = quizElement.querySelector(".answer-groups__form");
  const backButton = quizElement.querySelector(".answer-groups__back");
  const submitButton = quizElement.querySelector(".answer-groups__submit");
  const stepItems = Array.from(document.querySelectorAll(".steps__item"));

  if (!form || !backButton || !submitButton || !questionCards.length || !answerGroups.length) {
    return;
  }

  let currentStep = questionCards.findIndex((card) =>
    card.classList.contains("question-card--active"),
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
    const answerIndex =
      answerItem && answerItem.parentElement
        ? Array.from(answerItem.parentElement.children).indexOf(answerItem) + 1
        : null;

    return {
      step: groupIndex,
      value: checkedInput.value,
      inputId: checkedInput.id,
      answerIndex,
      text: answerLabel?.textContent?.trim() || "",
    };
  };

  const getAnswersState = () =>
    answerGroups.map((groupElement, index) => {
      const selection = getGroupSelectionData(groupElement);

      return {
        step: index + 1,
        answered: Boolean(selection),
        value: selection?.value ?? null,
        inputId: selection?.inputId ?? null,
        answerIndex: selection?.answerIndex ?? null,
        text: selection?.text ?? null,
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
      setTestTitle("Тест");
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
  setTestTitle("Тест");
  setGlobalStep(0);
}

initQuiz();
