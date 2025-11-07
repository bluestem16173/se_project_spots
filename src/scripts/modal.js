// src/scripts/modal.js
export const openModal = (modalEl) => {
  if (!modalEl) return;
  modalEl.classList.add("modal_opened");
  document.addEventListener("keydown", onEsc);
};

export const closeModal = (modalEl) => {
  if (!modalEl) return;
  modalEl.classList.remove("modal_opened");
  document.removeEventListener("keydown", onEsc);
};

const onEsc = (e) => {
  if (e.key === "Escape") {
    const opened = document.querySelector(".modal.modal_opened");
    if (opened) closeModal(opened);
  }
};
