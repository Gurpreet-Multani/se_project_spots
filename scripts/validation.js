// Declaring a configuration object that contains the
// necessary classes and selectors.
const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

//declared function:showInputError() method
const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgID = inputEl.id + "-error";
  const errorMsgEl = formEl.querySelector("#" + errorMsgID);
  if (errorMsgEl) {
    errorMsgEl.textContent = errorMsg;
  }
  inputEl.classList.add("modal__input_type_error");
};

//declared function:hideInputError() method
const hideInputError = (formEl, inputEl) => {
  const errorMsgID = inputEl.id + "-error";
  const errorMsgEl = formEl.querySelector("#" + errorMsgID);
  if (errorMsgEl) {
    errorMsgEl.textContent = "";
  }
  inputEl.classList.remove("modal__input_type_error");
};

// **MISSING FUNCTION ADDED HERE**
// declared function:hasInvalidInput() method
const hasInvalidInput = (inputList) => {
  return inputList.some((input) => !input.validity.valid);
};

// A helper function to enable the button with both JS property and CSS class
const enableButton = (buttonEl) => {
  buttonEl.disabled = false;
  buttonEl.classList.remove("modal__submit-btn_disabled");
};

// declared function:toggleButtonState() method
const toggleButtonState = (inputList, buttonEl) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl);
  } else {
    // Corrected: Now it calls the function to enable the button and remove the class
    enableButton(buttonEl);
  }
};

//declared function disable button
const disableButton = (buttonEl) => {
  //code
  buttonEl.disabled = true;
  //add class to buttonel to make it grey
  //do the css
  buttonEl.classList.add("modal__submit-btn_disabled");
};

// declared function:setEventListeners() method
const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config); // Initial state check

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

// declared function:checkInputValidity() method
const checkInputValidity = (formEl, inputEl) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};

// declared function:enableValidation() method
const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
