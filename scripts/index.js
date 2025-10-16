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
  const closeBtn = editProfileModal?.querySelector(".modal__close-btn");
  const profileNameEl = document.querySelector(".profile__name");
  const profileDescriptionEl = document.querySelector(".profile__description");
  const editProfileFormEl = editProfileModal?.querySelector(".modal__form");
  const editProfileNameInput = editProfileModal?.querySelector("#profile-name-input");
  const editProfileDescriptionInput = editProfileModal?.querySelector("#profile-description-input");

  if (editProfileBtn && editProfileModal && editProfileFormEl && editProfileNameInput && editProfileDescriptionInput) { // CHANGED: guard the section instead of returning
    editProfileBtn.addEventListener("click", () => {
      //editProfileModal.classList.add("modal_is-opened");
      openModal(editProfileModal);

      editProfileNameInput.value = profileNameEl.textContent;
      editProfileDescriptionInput.value = profileDescriptionEl.textContent;
    });

    closeBtn?.addEventListener("click", () => {
      //editProfileModal.classList.remove("modal_is-opened");
      closeModal(editProfileModal);
    });

    function handleProfileFormElSubmit(evt) {
      evt.preventDefault();
      profileNameEl.textContent = editProfileNameInput.value.trim();
      profileDescriptionEl.textContent = editProfileDescriptionInput.value.trim();
      //editProfileModal.classList.remove("modal_is-opened");
      closeModal(editProfileModal);
    }
    editProfileFormEl.addEventListener("submit", handleProfileFormElSubmit);
  }

  // --- modal helpers (unchanged) ---
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("modal_is-opened");
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("modal_is-opened");
  }
  // --- end helpers ---

  // ----- New post modal wiring -----
  const addProfileBtn = document.querySelector(".profile__add-btn");
  const newPostModal = document.querySelector("#new-post-modal");
  // if (!newPostModal) return; // CHANGED: don’t exit the whole handler

  const newPostCloseBtn = newPostModal?.querySelector(".modal__close-btn");
  const addCardFormEl = newPostModal?.querySelector(".modal__form");
  const addCaptionInput = newPostModal?.querySelector("#profile-caption-input");
  const addLinkInput = newPostModal?.querySelector("#card-image-input");
  const cardsContainer = document.querySelector(".cards"); // ✅ make sure this exists in HTML

  function createCard({ name, link }) {
    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <img class="card__image" src="${link}" alt="${name}">
      <h3 class="card__title">${name}</h3>
    `;
    return li;
  }

  if (addProfileBtn && newPostModal && addCardFormEl && addCaptionInput && addLinkInput && cardsContainer) { // CHANGED: guard this section instead of returning
    addProfileBtn?.addEventListener("click", () => {
      newPostModal.classList.add("modal_is-opened");
    });

    newPostCloseBtn?.addEventListener("click", () => {
      newPostModal.classList.remove("modal_is-opened");
    });

    function handleAddCardFormElSubmit(evt) {
      evt.preventDefault();

      const link = addLinkInput.value.trim();
      const name = addCaptionInput.value.trim();
      if (!name || !link) return;

      const cardEl = createCard({ name, link });
      cardsContainer.prepend(cardEl);

      evt.target.reset();
      newPostModal.classList.remove("modal_is-opened");
    }
    addCardFormEl.addEventListener("submit", handleAddCardFormElSubmit);
  }
}); // closes DOMContentLoaded

// Debug log unchanged
initialCards.forEach(({ name }) => console.log(name));
