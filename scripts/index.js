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

  editProfileBtn.addEventListener("click", () => {
    editProfileModal.classList.add("modal_is-opened");
  });

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
});

// quick sanity check
initialCards.forEach(({ name }) => console.log(name));
