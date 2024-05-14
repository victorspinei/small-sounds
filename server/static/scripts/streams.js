const audioElements = document.querySelectorAll('audio');

audioElements.forEach(audio => {
    audio.addEventListener('ended', function() {
        //const postId = /* Get the post ID associated with this audio element */;
        //recordSongView(postId);
        const postId = audio.previousElementSibling.querySelector('.post_id').innerText;
        const streamsElement = audio.previousElementSibling.querySelector('.streams-count');
        recordSongView(postId, streamsElement);
    });
});


function recordSongView(songId, streamsElement) {
    const data = { songId: songId };
    fetch('/recordSongView', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            // update UI
            streamsElement.innerText = parseInt(streamsElement.innerText) + 1;
            //console.log("Success");
        } else {
            console.log(response);
            //console.error('Failed to add view.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}