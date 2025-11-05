/**********************
 *  CONFIG (cfg)
 **********************/
const cfg = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorSuffix: "-error",
  errorVisibleClass: "modal__error_visible"
};

/**********************
 *  VALIDATION
 **********************/
function enableValidation(cfg) {
  const forms = [...document.querySelectorAll(cfg.formSelector)];
  forms.forEach((form) => {
    form.setAttribute("novalidate", "");              // keep native bubbles off
    form.addEventListener("submit", (e) => e.preventDefault());
    setEventListeners(form, cfg);
  });
}

function setEventListeners(form, cfg) {
  const inputs = [...form.querySelectorAll(cfg.inputSelector)];
  const submitBtn = form.querySelector(cfg.submitButtonSelector);
  toggleButtonState(inputs, submitBtn, cfg);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, cfg);
      toggleButtonState(inputs, submitBtn, cfg);
    });
    // prevent native bubble on individual fields just in case
    input.addEventListener("invalid", (e) => e.preventDefault());
  });
}

function hasInvalidInput(inputs) {
  return inputs.some((i) => !i.validity.valid);
}

function toggleButtonState(inputs, button, cfg) {
  if (!button) return;
  const shouldDisable = hasInvalidInput(inputs);
  button.disabled = shouldDisable;
  button.classList.toggle(cfg.inactiveButtonClass, shouldDisable);
}

function getErrorSpan(form, input, cfg) {
  return form.querySelector(`#${CSS.escape(input.id)}${cfg.errorSuffix}`);
}

function showInputError(form, input, cfg) {
  const errorSpan = getErrorSpan(form, input, cfg);
  if (!errorSpan) return;
  errorSpan.textContent = input.validationMessage;
  errorSpan.classList.add(cfg.errorVisibleClass);
  input.classList.add(cfg.inputErrorClass);
}

function hideInputError(form, input, cfg) {
  const errorSpan = getErrorSpan(form, input, cfg);
  if (!errorSpan) return;
  errorSpan.textContent = "";
  errorSpan.classList.remove(cfg.errorVisibleClass);
  input.classList.remove(cfg.inputErrorClass);
}

function checkInputValidity(form, input, cfg) {
  if (!input.validity.valid) showInputError(form, input, cfg);
  else hideInputError(form, input, cfg);
}

function resetValidation(form, cfg, { resetFields = false } = {}) {
  const inputs = [...form.querySelectorAll(cfg.inputSelector)];
  const submitBtn = form.querySelector(cfg.submitButtonSelector);
  if (resetFields) form.reset();
  inputs.forEach((i) => hideInputError(form, i, cfg));
  toggleButtonState(inputs, submitBtn, cfg);
}

/**********************
 *  MODAL + ESC (single source of truth)
 **********************/
const OPEN_CLASS = "modal_is-opened";
let activeModal = null;
let escAttached = false;

function onEscKeydown(evt) {
  if (evt.key === "Escape" && activeModal) closeModal(activeModal);
}

function openModal(modal) {
  if (!modal) return;
  if (activeModal && activeModal !== modal) closeModal(activeModal);
  activeModal = modal;
  modal.classList.add(OPEN_CLASS);

  if (!escAttached) {
    document.addEventListener("keydown", onEscKeydown);
    escAttached = true;
  }
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove(OPEN_CLASS);
  if (activeModal === modal) activeModal = null;

  if (!activeModal && escAttached) {
    document.removeEventListener("keydown", onEscKeydown);
    escAttached = false;
  }
}

// expose for other files
window.openModal = openModal;
window.closeModal = closeModal;

/**********************
 *  BOOTSTRAP
 **********************/
enableValidation(cfg);
