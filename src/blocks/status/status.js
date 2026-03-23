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
    const itemCenter = itemRect.left - trackRect.left + (itemRect.width / 2);
    const thumbOffset = itemCenter - (thumbWidth / 2);

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
      const itemCenter = itemRect.left + (itemRect.width / 2);
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

    setTestTitle("Тест");
    setGlobalStep(1);
  });

  submitButton.addEventListener("click", () => {
    const formData = Object.fromEntries(new FormData(formElement).entries());
    const selectedValue = selectedIndex !== null ? sliderInputs[selectedIndex]?.value ?? null : null;
    const selectedText = selectedIndex !== null
      ? sliderItems[selectedIndex]?.querySelector(".slider__text")?.textContent?.trim() || ""
      : null;

    console.log("status form", formData);
    console.log("status selected", {
      index: selectedIndex,
      value: selectedValue,
      text: selectedText,
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
        statusIndex: selectedIndex ?? 0,
      },
    }));
  });
}

initStatus();
