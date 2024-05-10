function followUser(username) {
    const data = { username: username }
    fetch('/follow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            // console.log('User followed successfully.');
            document.getElementById('followButton').innerText = 'Unfollow';
            document.getElementById('followButton').onclick = function() { 
                unFollowUser(username); 
            };
        } else {
            console.error('Failed to follow user.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function unFollowUser(username) {
    const data = { username: username }
    fetch('/unFollow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            // console.log('User unfollowed successfully.');
            document.getElementById('followButton').innerText = 'Follow';
            document.getElementById('followButton').onclick = function() {
                followUser(username); 
            };
        } else {
            console.error('Failed to unfollow user.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}