const modalOpenBtn = document.getElementById('modal-open-btn');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalBackground = document.querySelector(".modal-background");
const modalBody = document.querySelector(".modal-body");

modalCloseBtn.addEventListener('click', (e) => {
    modalBackground.style.display = "none";
    modalBody.style.display = "none";
});

modalOpenBtn.addEventListener('click', (e) => {
    modalBackground.style.display = "flex";
    modalBody.style.display = "block";
});

const popupOpenBtn = document.getElementById('image-popup-open-btn');
const popupCloseBtn = document.getElementById('popup-close-btn');
const popupBackground = document.querySelector(".popup-background");
const popupBody = document.querySelector(".popup-body");

popupCloseBtn.addEventListener('click', (e) => {
    popupBackground.style.display = "none";
    popupBody.style.display = "none";
});

popupOpenBtn.addEventListener('click', (e) => {
    popupBackground.style.display = "flex";
    popupBody.style.display = "block";
});