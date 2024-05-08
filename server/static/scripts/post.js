const descriptions = document.querySelectorAll('.post-description');
descriptions.forEach((v, k) => {
    let text = v.innerText;
    const chars = 100;
    if (text.length > chars) {
        text = text.slice(0, chars - 5) + "...";
    }
    v.innerText = text;
});

const titles = document.querySelectorAll('.post-title');
titles.forEach((v, k) => {
    let text = v.innerText;
    const chars = 30;
    if (text.length > chars) {
        text = text.slice(0, chars - 5) + "...";
    }
    v.innerText = text;
});