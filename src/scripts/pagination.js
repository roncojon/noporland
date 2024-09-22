let continuationToken = null;  // For tracking pagination
const itemsByPage = 4;
let hasMoreVideos = true;
const videoListElement = document.getElementById('video-list');
const loadMoreButton = document.getElementById('load-more-btn');

// Function to fetch more videos
async function fetchVideos(pageSize, token) {
    const url = `https://0wy4drz3l6.execute-api.us-west-1.amazonaws.com/prod/%7Bvideos%7D?elementsPerPage=${pageSize}${
        token ? `&continuationToken=${encodeURIComponent(token)}` : ''
    }`;

    try {
        loadMoreButton.disabled = true;
        loadMoreButton.innerText = 'Loading...';

        const response = await fetch(url);
        const data = await response.json();

        if (data?.videoFiles) {
            data.videoFiles.forEach((item) => {
                const videoKey = item.videoKey.slice(11);  // Remove 'MainVideos/' prefix

                // Create and append new card elements
                const card = document.createElement('li');
                card.innerHTML = `
                    <a href="${item.videoUrl}">
                        <div class="card-thumbnail">
                            <img src="${item.thumbnailUrl}" alt="${videoKey}" />
                        </div>
                        <div class="card-content">
                            <h3>${videoKey}</h3>
                            <p>Watch the video</p>
                        </div>
                    </a>
                `;
                videoListElement.appendChild(card);
            });
        }

        // Update continuation token and check if more videos are available
        continuationToken = data.nextContinuationToken;
        hasMoreVideos = !!data.nextContinuationToken;
        loadMoreButton.disabled = !hasMoreVideos;
        loadMoreButton.innerText = hasMoreVideos ? 'Load More' : 'No More Videos';
    } catch (error) {
        console.error('Error fetching videos:', error);
        loadMoreButton.disabled = false;
        loadMoreButton.innerText = 'Load More';
    }
}

// Initial call to enable the button if there are more videos
if (hasMoreVideos) {
    loadMoreButton.disabled = false;
    loadMoreButton.innerText = 'Load More';
}

// Add event listener for the "Load More" button
loadMoreButton.addEventListener('click', () => {
    if (hasMoreVideos) {
        fetchVideos(itemsByPage, continuationToken);
    }
});
