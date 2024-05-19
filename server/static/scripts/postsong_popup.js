const popupOpenBtn = document.getElementById('popup-open-btn-post');
const popupCloseBtn = document.getElementById('popup-close-btn-post');
const popupBackground = document.querySelector(".popup-background-post");
const popupBody = document.querySelector(".popup-body-post");

popupCloseBtn.addEventListener('click', (e) => {
    popupBackground.style.display = "none";
    popupBody.style.display = "none";
});

popupOpenBtn.addEventListener('click', (e) => {
    popupBackground.style.display = "flex";
    popupBody.style.display = "block";
});