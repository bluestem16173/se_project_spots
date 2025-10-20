const initialCards = [
  { name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg" },
  { name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg" },
  { name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg" },
  { name: "A very long bridge, over the forest and through the trees", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg" },
  { name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg" },
  { name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg" },
];

document.addEventListener("DOMContentLoaded", () => {
  // ----- Profile modal wiring -----
  const editProfileBtn = document.querySelector(".profile__edit-btn");
  const editProfileModal = document.querySelector("#edit-profile-modal");

  let closeBtn, editProfileFormEl, editProfileNameInput, editProfileDescriptionInput;
  if (editProfileModal) {
    closeBtn = editProfileModal.querySelector(".modal__close-btn");
    editProfileFormEl = editProfileModal.querySelector(".modal__form");
    editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
    editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");
  }

  const profileNameEl = document.querySelector(".profile__name");
  const profileDescriptionEl = document.querySelector(".profile__description");

  if (editProfileBtn && editProfileModal && editProfileFormEl && editProfileNameInput && editProfileDescriptionInput) {
    editProfileBtn.addEventListener("click", () => {
      openModal(editProfileModal);
      editProfileNameInput.value = profileNameEl ? profileNameEl.textContent : "";
      editProfileDescriptionInput.value = profileDescriptionEl ? profileDescriptionEl.textContent : "";
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        closeModal(editProfileModal);
      });
    }

    function handleProfileFormElSubmit(evt) {
      evt.preventDefault();
      if (profileNameEl) profileNameEl.textContent = editProfileNameInput.value.trim();
      if (profileDescriptionEl) profileDescriptionEl.textContent = editProfileDescriptionInput.value.trim();
      closeModal(editProfileModal);
    }
    editProfileFormEl.addEventListener("submit", handleProfileFormElSubmit);
  }

  // --- modal helpers ---
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("modal_is-opened");
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("modal_is-opened");
  }

  // ----- New post modal wiring -----
  const addProfileBtn = document.querySelector(".profile__add-btn");
  const newPostModal = document.querySelector("#new-post-modal");

  let newPostCloseBtn, addCardFormEl, addCaptionInput, addLinkInput;
  if (newPostModal) {
    newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
    addCardFormEl = newPostModal.querySelector(".modal__form");
    addCaptionInput = newPostModal.querySelector("#profile-caption-input");
    addLinkInput = newPostModal.querySelector("#card-image-input");
  }

  // ----- Cards wiring -----
  const cardsList = document.querySelector(".cards__list");
  const cardTemplate = document.getElementById("card-template");

  function getCardElement({ name, link }) {
    const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
    const cardImageEl = cardElement.querySelector(".card__image");
    const cardTitleEl = cardElement.querySelector(".card__title");

    cardImageEl.src = link;
    cardImageEl.alt = name;
    cardTitleEl.textContent = name;

    return cardElement;
  }

  // Initial render
  initialCards.forEach((item, i) => {
    console.log(`[render] #${i}:`, item.name, item.link);
    cardsList.append(getCardElement(item));
  });

  // Add new card from modal
  if (addProfileBtn && newPostModal && addCardFormEl && addCaptionInput && addLinkInput && cardsList) {
    addProfileBtn.addEventListener("click", () => {
      newPostModal.classList.add("modal_is-opened");
    });

    if (newPostCloseBtn) {
      newPostCloseBtn.addEventListener("click", () => {
        newPostModal.classList.remove("modal_is-opened");
      });
    }

    function handleAddCardFormElSubmit(evt) {
      evt.preventDefault();

      const link = addLinkInput.value.trim();
      const name = addCaptionInput.value.trim();
      if (!name || !link) return;

      const cardEl = getCardElement({ name, link });
      cardsList.prepend(cardEl);

      evt.target.reset();
      newPostModal.classList.remove("modal_is-opened");
    }
    addCardFormEl.addEventListener("submit", handleAddCardFormElSubmit);
  }
});
