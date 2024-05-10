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