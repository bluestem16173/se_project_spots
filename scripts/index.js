document.addEventListener("DOMContentLoaded", () => {
  const editProfileBtn = document.querySelector(".profile__edit-btn");
  const editProfileModal = document.querySelector("#edit-profile-modal");
  if (!editProfileBtn || !editProfileModal) return;

  const closeBtn = editProfileModal.querySelector(".modal__close-btn");

  editProfileBtn.addEventListener("click", () => {
    editProfileModal.classList.add("modal_is-opened");
  });

  closeBtn?.addEventListener("click", () => {
    editProfileModal.classList.remove("modal_is-opened");
  });

  const addProfileBtn = document.querySelector(".profile__add-btn");
  const newPostModal = document.querySelector("#new-post-modal");
  const newPostCloseBtn = newPostModal?.querySelector(".modal__close-btn");

  if (addProfileBtn && newPostModal) {
    addProfileBtn.addEventListener("click", () => {
      newPostModal.classList.add("modal_is-opened");
    });
  }

  newPostCloseBtn?.addEventListener("click", () => {
    newPostModal.classList.remove("modal_is-opened");
  });
});
