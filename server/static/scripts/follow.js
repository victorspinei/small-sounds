function followUser(e, username) {
    const data = { username: username };
    fetch('/follow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            // Update button text and event listener
            const button = e.target;
            button.innerText = 'Unfollow';
            button.removeEventListener('click', followUser);
            button.addEventListener('click', (event) => unFollowUser(event, username));
        } else {
            console.error('Failed to follow user.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function unFollowUser(e, username) {
    const data = { username: username };
    fetch('/unFollow', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            // Update button text and event listener
            const button = e.target;
            button.innerText = 'Follow';
            button.removeEventListener('click', unFollowUser);
            button.addEventListener('click', (event) => followUser(event, username));
        } else {
            console.error('Failed to unfollow user.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
