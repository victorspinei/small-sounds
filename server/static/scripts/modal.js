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