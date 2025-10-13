const initialCards = [
  { name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg" },
  { name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg" },
  { name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg" },
  { name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg" },
  { name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg" },
  { name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg" },
];

document.addEventListener("DOMContentLoaded", () => {
  const editProfileBtn = document.querySelector(".profile__edit-btn");
  const editProfileModal = document.querySelector("#edit-profile-modal");
  if (!editProfileBtn || !editProfileModal) return;

  const closeBtn = editProfileModal.querySelector(".modal__close-btn");
  const profileNameEl  = document.querySelector(".profile__name");      // e.g. <h1 class="profile__name">
  const profileDescriptionEl   = document.querySelector(".profile__description");       // e.g. <span class="profile__age">
  const editProfileFormEl      = editProfileModal.querySelector(".modal__form");// your edit form inside the modal
  const editProfileNameInput = editProfileModal.querySelector("#profile-name-input"); // <input id="profile-name-input">
  const editProfileDescriptionInput  = editProfileModal.querySelector("#profile-description-input"); 
 
  editProfileBtn.addEventListener("click", () => {
    editProfileModal.classList.add("modal_is-opened");
     
      editProfileNameInput.value = profileNameEl.textContent;
      editProfileDescriptionInput.value = profileDescriptionEl.textContent;
    }


  );

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      editProfileModal.classList.remove("modal_is-opened");
    });
  }

  const addProfileBtn = document.querySelector(".profile__add-btn");
  const newPostModal = document.querySelector("#new-post-modal");
  const newPostCloseBtn = newPostModal
    ? newPostModal.querySelector(".modal__close-btn")
    : null;
  const addCardFormEl = newPostModal.querySelector(".modal__form");
  const addCaptionInput = newPostModal.querySelector("#profile-caption-input")
  const addLinkInput = newPostModal.querySelector("#card-image-input")

  if (addProfileBtn && newPostModal) {
    addProfileBtn.addEventListener("click", () => {
      newPostModal.classList.add("modal_is-opened");
    });
  }

  if (newPostCloseBtn) {
    newPostCloseBtn.addEventListener("click", () => {
      newPostModal.classList.remove("modal_is-opened");
    });
  }
   function handleProfileFormElSubmit(evt) {
  // Prevent default browser behavior.
    evt.preventDefault(); 
     profileNameEl.textContent =  editProfileNameInput.value;
      profileDescriptionEl.textContent = editProfileDescriptionInput.value;
     editProfileModal.classList.remove("modal_is-opened");
    }
    editProfileFormEl.addEventListener("submit", handleProfileFormElSubmit)

    function handleAddCardFormElSubmit(evt) {
  // Prevent default browser behavior.
    evt.preventDefault(); 
    const link = addLinkInput.value.trim();      // 2) Read the image URL.
    const name = addcaptionInput.value.trim(); 
    console.log("New Post data:", { link, name });
     editProfileModal.classList.remove("modal_is-opened");}

     addCardFormEl.addEventListener('submit', handleAddCardFormElSubmit);
 
});

// quick sanity check
initialCards.forEach(({name}) => console.log(name));