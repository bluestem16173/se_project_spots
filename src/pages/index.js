import "./index.css";
import { openModal, closeModal } from "../scripts/modal.js";
import { enableValidation } from "../scripts/validation.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
  }
];

const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible"
};

function initModals() {
  const editProfileModal = document.querySelector("#edit-profile-modal");
  const newPostModal = document.querySelector("#new-post-modal");
  const previewModal = document.querySelector("#preview-modal");

  const profileNameEl = document.querySelector(".profile__name");
  const profileDescriptionEl = document.querySelector(".profile__description");

  const editProfileBtn = document.querySelector(".profile__edit-btn");
  const addProfileBtn = document.querySelector(".profile__add-btn");

  const editProfileFormEl = editProfileModal?.querySelector(".modal__form");
  const editProfileCloseBtn = editProfileModal?.querySelector(".modal__close-btn");
  const editProfileNameInput = editProfileModal?.querySelector("#profile-name-input");
  const editProfileDescriptionInput = editProfileModal?.querySelector("#profile-description-input");

  const addCardFormEl = newPostModal?.querySelector(".modal__form");
  const addCaptionInput = newPostModal?.querySelector("#profile-caption-input");
  const addLinkInput = newPostModal?.querySelector("#card-image-input");
  const newPostCloseBtn = newPostModal?.querySelector(".modal__close-btn");

  const previewCloseBtn = previewModal?.querySelector(".modal__close-btn");
  const previewImgEl = previewModal?.querySelector(".modal__image");
  const previewCaptionEl = previewModal?.querySelector(".modal__caption");

  if (editProfileBtn && editProfileModal && editProfileFormEl && editProfileNameInput && editProfileDescriptionInput) {
    editProfileBtn.addEventListener("click", () => {
      editProfileNameInput.value = profileNameEl?.textContent?.trim() ?? "";
      editProfileDescriptionInput.value = profileDescriptionEl?.textContent?.trim() ?? "";
      openModal(editProfileModal);
    });

    editProfileCloseBtn?.addEventListener("click", () => closeModal(editProfileModal));

    editProfileFormEl.addEventListener("submit", (evt) => {
      evt.preventDefault();
      profileNameEl.textContent = editProfileNameInput.value.trim();
      profileDescriptionEl.textContent = editProfileDescriptionInput.value.trim();
      closeModal(editProfileModal);
    });
  }

  if (addProfileBtn && newPostModal && addCardFormEl && addCaptionInput && addLinkInput) {
    addProfileBtn.addEventListener("click", () => openModal(newPostModal));
    newPostCloseBtn?.addEventListener("click", () => closeModal(newPostModal));

    addCardFormEl.addEventListener("submit", (evt) => {
      evt.preventDefault();

      const name = addCaptionInput.value.trim();
      const link = addLinkInput.value.trim();
      if (!name || !link) return;

      const cardsList = document.querySelector(".cards__list");
      const cardTemplate = document.querySelector("#card-template");
      if (!cardsList || !cardTemplate) return;

      const cardEl = createCard({ name, link }, { cardTemplate, previewModal, previewImgEl, previewCaptionEl });
      cardsList.prepend(cardEl);

      addCardFormEl.reset();
      closeModal(newPostModal);
    });
  }

  if (previewModal && previewCloseBtn) {
    previewCloseBtn.addEventListener("click", () => closeModal(previewModal));
  }

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("mousedown", (evt) => {
      if (evt.target === modal) closeModal(modal);
    });
  });

  renderInitialCards({ previewModal, previewImgEl, previewCaptionEl });
}

function createCard({ name, link }, { cardTemplate, previewModal, previewImgEl, previewCaptionEl }) {
  if (!cardTemplate) return document.createDocumentFragment();

  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

  cardImageEl.src = link;
  cardImageEl.alt = name;
  cardTitleEl.textContent = name;

  cardLikeBtnEl?.addEventListener("click", (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    cardLikeBtnEl.classList.toggle("card__like-btn_liked");
  });

  cardDeleteBtnEl?.addEventListener("click", (evt) => {
    evt.preventDefault();
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (previewModal && previewImgEl && previewCaptionEl) {
      previewImgEl.src = link;
      previewImgEl.alt = name;
      previewCaptionEl.textContent = name;
      openModal(previewModal);
    }
  });

  return cardElement;
}

function renderInitialCards(previewCtx) {
  const cardsList = document.querySelector(".cards__list");
  const cardTemplate = document.querySelector("#card-template");

  if (!cardsList || !cardTemplate) return;

  const fragment = document.createDocumentFragment();
  initialCards.forEach((cardData) => {
    fragment.append(createCard(cardData, { cardTemplate, ...previewCtx }));
  });

  cardsList.append(fragment);
}

document.addEventListener("DOMContentLoaded", () => {
  initModals();
  enableValidation(validationConfig);
});