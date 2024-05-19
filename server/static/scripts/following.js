const descriptionElements = document.querySelectorAll('.following-markdown');
descriptionElements.forEach((v, k) => {
    let text = v.innerText;
    const chars = 100;
    if (text.length > chars) {
        text = text.slice(0, chars - 5) + "...";
    }
    v.innerText = text;
});

const buttons = document.querySelectorAll('.unfollow-button');

buttons.forEach((btn) => {
    const username = btn.getAttribute('data-username');

    btn.addEventListener('click', (e) => {
        if (btn.innerText === 'Unfollow') {
            unFollowUser(e, username);
        } else {
            followUser(e, username);
        }
    });
});