import "./index.css";
import { openModal, closeModal } from "../scripts/modal.js";
import { enableValidation } from "../scripts/validation.js";
import fallbackAvatar from "../images/avatar.jpg";
import Api from "../scripts/utils/api.js";

const fallbackCards = [
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

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ed8550cb-1a0e-449d-8c60-12bcd205e4b0",
    "Content-Type": "application/json"
  }
});

let currentUserId = null;

const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorSuffix: "-error",
  errorVisibleClass: "modal__error_visible"
};

const select = (selector) => document.querySelector(selector);

function syncProfile(user, elements) {
  const { profileNameEl, profileDescriptionEl, profileAvatarEl } = elements;
  const name = user?.name ?? "Bessie Coleman";
  const about = user?.about ?? "Civil Aviator";
  const avatar = user?.avatar || fallbackAvatar;

  if (profileNameEl) profileNameEl.textContent = name;
  if (profileDescriptionEl) profileDescriptionEl.textContent = about;
  if (profileAvatarEl) profileAvatarEl.src = avatar;
}

function updateLikeView(cardElement, likes = [], isLiked = false) {
  const likeBtn = cardElement.querySelector(".card__like-btn");
  const likeCountEl = cardElement.querySelector(".card__like-count");

  if (likeBtn) {
    likeBtn.classList.toggle("card__like-btn_liked", Boolean(isLiked));
  }

  if (likeCountEl) {
    const total = Array.isArray(likes) ? likes.length : Number(likes) || 0;
    likeCountEl.textContent = total;
    console.log("Updating like count:", { total, likes, isLiked });
  }
}

function createCard(cardData, elements) {
  const { cardTemplate, previewModal, previewImgEl, previewCaptionEl } = elements;
  if (!cardTemplate) return document.createDocumentFragment();

  const template = cardTemplate.content.querySelector(".card");
  if (!template) return document.createDocumentFragment();

  const cardElement = template.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

  const {
    _id,
    name,
    link,
    likes,
    owner,
    isLiked
  } = cardData;
  
  // Handle cases where likes might be undefined, null, or an array
  const cardLikes = Array.isArray(likes) ? likes : (likes ? [likes] : []);

  if (_id) {
    cardElement.dataset.cardId = _id;
  }

  if (cardImageEl) {
    cardImageEl.src = link;
    cardImageEl.alt = name;
  }
  if (cardTitleEl) cardTitleEl.textContent = name;

  let currentLikes = cardLikes;
  console.log("Creating card with likes:", { likes, cardLikes, currentLikes, isLiked, currentUserId });
  let currentIsLiked =
    typeof isLiked === "boolean"
      ? isLiked
      : currentLikes.some((like) => {
          // Handle both object format ({_id: "..."}) and string format ("...")
          const likeId = typeof like === 'string' ? like : (like?._id ?? null);
          return likeId && String(likeId) === String(currentUserId);
        });
  console.log("Determined isLiked:", currentIsLiked);

  updateLikeView(cardElement, currentLikes, currentIsLiked);

  if (cardLikeBtnEl) {
    cardLikeBtnEl.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      const shouldLike = !currentIsLiked;

      if (!_id) {
        currentIsLiked = shouldLike;
        currentLikes = shouldLike
          ? [...currentLikes, { _id: currentUserId }]
          : currentLikes.filter((like) => like && like._id !== currentUserId);
        updateLikeView(cardElement, currentLikes, currentIsLiked);
        return;
      }

      cardLikeBtnEl.disabled = true;
      api
        .changeLikeStatus(_id, shouldLike)
        .then((updatedCard) => {
          console.log("API returned updated card:", updatedCard);
          console.log("Updated card likes:", updatedCard.likes);
          console.log("Updated card isLiked:", updatedCard.isLiked);
          currentLikes = updatedCard.likes ?? [];
          currentIsLiked =
            typeof updatedCard.isLiked === "boolean"
              ? updatedCard.isLiked
              : currentLikes.some((like) => {
                  // Handle both object format ({_id: "..."}) and string format ("...")
                  const likeId = typeof like === 'string' ? like : (like?._id ?? null);
                  return likeId && String(likeId) === String(currentUserId);
                });
          updateLikeView(cardElement, currentLikes, currentIsLiked);
        })
        .catch((err) => {
          console.error(`Failed to toggle like for card ${_id}:`, err);
        })
        .finally(() => {
          cardLikeBtnEl.disabled = false;
        });
    });
  }

  if (cardDeleteBtnEl) {
    const hasServerId = Boolean(_id);
    // Handle different owner formats: owner._id, owner, or owner as string
    const ownerId = owner?._id ?? owner ?? null;
    const isOwner = hasServerId && ownerId && String(ownerId) === String(currentUserId);
    const shouldShowDelete = !hasServerId || isOwner;

    // Always add the click handler
    cardDeleteBtnEl.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      // Recalculate ownerId - handle both string and object formats
      const ownerId = typeof owner === 'string' ? owner : (owner?._id ?? null);
      const isOwnerCheck = hasServerId && ownerId && String(ownerId) === String(currentUserId);

      if (!hasServerId) {
        cardElement.remove();
        return;
      }

      if (!isOwnerCheck) {
        return; // Don't delete if not owner
      }
      cardDeleteBtnEl.disabled = true;
      api
        .deleteCard(_id)
        .then(() => {
          cardElement.remove();
        })
        .catch((err) => {
          console.error(`Unable to delete card ${_id}:`, err);
          cardDeleteBtnEl.disabled = false;
        });
    });

    if (shouldShowDelete) {
      cardDeleteBtnEl.classList.remove("card__delete-btn_hidden");
    } else {
      cardDeleteBtnEl.classList.add("card__delete-btn_hidden");
    }
  }

  if (cardImageEl) {
    cardImageEl.addEventListener("click", (evt) => {
      evt.preventDefault();
      if (previewModal && previewImgEl && previewCaptionEl) {
        previewImgEl.src = link;
        previewImgEl.alt = name;
        previewCaptionEl.textContent = name;
        openModal(previewModal);
      }
    });
  }

  return cardElement;
}

function renderCards(cards = [], elements) {
  const { cardsList, cardTemplate, previewModal,previewImgEl,previewCaptionEl} = elements;
  console.log("cardsList present?", !!cardsList, "cardTemplate present?", !!cardTemplate);

  if (!Array.isArray(cards)) {
    console.log("renderCards received non-array; using fallbackCards");
  }

  const normalizedCards = Array.isArray(cards)
    ? cards
    : Array.isArray(cards?.data)
      ? cards.data
      : [];

  // Always include fallback cards, merge with API cards if they exist
  const source = normalizedCards.length > 0 
    ? [...normalizedCards, ...fallbackCards]
    : fallbackCards;
  console.log(`Rendering ${source.length} cards (${normalizedCards.length} from API, ${fallbackCards.length} fallback)`);

  cardsList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  source.forEach((card) => {
    const cardEl = createCard(card, {
      cardTemplate,
      previewModal,
      previewImgEl,
      previewCaptionEl
    });
    fragment.append(cardEl);
  });
  cardsList.append(fragment);
}

function initModals(elements) {
  const {
    profileNameEl,
    profileDescriptionEl,
    profileAvatarEl,
    profileAvatarBtn,
    editProfileModal,
    editProfileForm,
    editProfileBtn,
    editProfileCloseBtn,
    newPostModal,
    newPostForm,
    addProfileBtn,
    newPostCloseBtn,
    cardsList,
    cardTemplate,
    previewModal,
    previewCloseBtn,
    previewImgEl,
    previewCaptionEl,
    editAvatarModal,
    editAvatarForm,
    editAvatarInput,
    editAvatarCloseBtn
  } = elements;

  if (editProfileBtn && editProfileModal && editProfileForm && profileNameEl && profileDescriptionEl) {
    editProfileBtn.addEventListener("click", () => {
      const nameField = editProfileForm.querySelector("#profile-name-input");
      const aboutField = editProfileForm.querySelector("#profile-description-input");
      if (nameField) nameField.value = profileNameEl.textContent.trim();
      if (aboutField) aboutField.value = profileDescriptionEl.textContent.trim();
      openModal(editProfileModal);
    });

    editProfileCloseBtn?.addEventListener("click", () => closeModal(editProfileModal));

    editProfileForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const submitBtn = editProfileForm.querySelector(".modal__submit-btn");
      const nameField = editProfileForm.querySelector("#profile-name-input");
      const aboutField = editProfileForm.querySelector("#profile-description-input");

      const name = nameField?.value.trim() ?? "";
      const about = aboutField?.value.trim() ?? "";

      if (!name || !about) return;

      const originalText = submitBtn?.textContent ?? "Save";
      submitBtn?.setAttribute("disabled", "true");
      if (submitBtn) submitBtn.textContent = "Saving...";

      api
        .editUserInfo({ name, about })
        .then((updated) => {
          if (profileNameEl) profileNameEl.textContent = updated.name;
          if (profileDescriptionEl) profileDescriptionEl.textContent = updated.about;
          closeModal(editProfileModal);
        })
        .catch((err) => {
          console.error("Failed to update profile:", err);
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.removeAttribute("disabled");
          }
        });
    });
  }

  if (addProfileBtn && newPostModal && newPostForm && cardsList && cardTemplate) {
    addProfileBtn.addEventListener("click", () => {
      newPostForm.reset();
      openModal(newPostModal);
    });

    newPostCloseBtn?.addEventListener("click", () => closeModal(newPostModal));

    newPostForm.addEventListener("submit", (evt) => {
      evt.preventDefault();

      const nameField = newPostForm.querySelector("#profile-caption-input");
      const linkField = newPostForm.querySelector("#card-image-input");

      const name = nameField?.value.trim() ?? "";
      const link = linkField?.value.trim() ?? "";
      if (!name || !link) return;

      const submitBtn = newPostForm.querySelector(".modal__submit-btn");
      const originalText = submitBtn?.textContent ?? "Save";
      submitBtn?.setAttribute("disabled", "true");
      if (submitBtn) submitBtn.textContent = "Saving...";

      api
        .createCard({ name, link })
        .then((newCard) => {
          const cardEl = createCard(newCard, {
            ...elements,
            cardTemplate,
            previewModal,
            previewImgEl,
            previewCaptionEl
          });
          cardsList.prepend(cardEl);
          newPostForm.reset();
          closeModal(newPostModal);
        })
        .catch((err) => {
          console.error("Failed to create card:", err);
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.removeAttribute("disabled");
          }
        });
    });
  }

  if (profileAvatarBtn && editAvatarModal && editAvatarForm && editAvatarInput && profileAvatarEl) {
    profileAvatarBtn.addEventListener("click", () => {
      editAvatarForm.reset();
      openModal(editAvatarModal);
    });

    editAvatarCloseBtn?.addEventListener("click", () => closeModal(editAvatarModal));

    editAvatarForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const avatar = editAvatarInput.value.trim();
      if (!avatar) return;

      const submitBtn = editAvatarForm.querySelector(".modal__submit-btn");
      const originalText = submitBtn?.textContent ?? "Save";
      submitBtn?.setAttribute("disabled", "true");
      if (submitBtn) submitBtn.textContent = "Saving...";

      api
        .setAvatar(avatar)
        .then((updatedUser) => {
          if (profileAvatarEl) profileAvatarEl.src = updatedUser.avatar;
          closeModal(editAvatarModal);
        })
        .catch((err) => {
          console.error("Failed to update avatar:", err);
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.removeAttribute("disabled");
          }
        });
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
}

function bootstrapApp(elements) {
  api
    .getAppInfo()
    .then(([user, cards]) => {
      console.log("user:", user && { _id: user._id, name: user.name });
      console.log("cards:", cards);
      console.log("cards type:", typeof cards);
      console.log("cards is array?", Array.isArray(cards));
      console.log("cards count:", Array.isArray(cards) ? cards.length : "not array");
      console.log("Full cards response:", cards);
      console.log("First card data:", cards && cards[0] ? cards[0] : "no cards");
      console.log("First card full structure:", cards && cards[0] ? JSON.stringify(cards[0], null, 2) : "no cards");
      console.log("First card likes:", cards && cards[0] ? cards[0].likes : "no cards");
      console.log("First card likes type:", cards && cards[0] ? typeof cards[0].likes : "no cards");
      currentUserId = user?._id ?? null;
      currentUserId = user?._id ?? null;
      syncProfile(user, elements);
      renderCards(cards, elements);
    })
    .catch((err) => {
      console.error("Failed to load initial data:", err);
      console.log("Falling back to default cards");
      currentUserId = null;
      syncProfile(null, elements);
      renderCards([], elements);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    profileNameEl: select(".profile__name"),
    profileDescriptionEl: select(".profile__description"),
    profileAvatarEl: select(".profile__avatar"),
    profileAvatarBtn: select(".profile__avatar-edit-btn"),
    editProfileModal: select("#edit-profile-modal"),
    editProfileForm: select("#edit-profile-modal .modal__form"),
    editProfileBtn: select(".profile__edit-btn"),
    editProfileCloseBtn: select("#edit-profile-modal .modal__close-btn"),
    newPostModal: select("#new-post-modal"),
    newPostForm: select("#new-post-modal .modal__form"),
    addProfileBtn: select(".profile__add-btn"),
    newPostCloseBtn: select("#new-post-modal .modal__close-btn"),
    cardsList: select(".cards__list"),
    cardTemplate: select("#card-template"),
    previewModal: select("#preview-modal"),
    previewCloseBtn: select("#preview-modal .modal__close-btn"),
    previewImgEl: select("#preview-modal .modal__image"),
    previewCaptionEl: select("#preview-modal .modal__caption"),
    editAvatarModal: select("#edit-avatar-modal"),
    editAvatarForm: select("#edit-avatar-modal .modal__form"),
    editAvatarInput: select("#avatar-link-input"),
    editAvatarCloseBtn: select("#edit-avatar-modal .modal__close-btn")
  };

  syncProfile(null, elements);
  initModals(elements);
  enableValidation(validationConfig);
  bootstrapApp(elements);
});
