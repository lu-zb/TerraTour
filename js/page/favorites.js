const favoritesContainer = document.querySelector("#favorites-list");
const favoritesCount = document.querySelector("#favorites-count");

function renderFavorites() {
    const favoriteIds = Destinations.getFavorites();
    const favoriteSpots = favoriteIds
        .map(id => Destinations.findSpot(id))
        .filter(Boolean);

    favoritesCount.textContent = favoriteSpots.length
        ? `已经收藏 ${favoriteSpots.length} 个景点。`
        : "你还没有收藏景点。";

    if (favoriteSpots.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="empty-state">
                <h3>还没有收藏景点</h3>
                <p>去探索一些让你心动的地方。</p>
                <a class="btn btn-primary" href="explore.html">开始探索</a>
            </div>
        `;
        return;
    }

    Destinations.renderCards(favoritesContainer, favoriteSpots);
}

window.addEventListener("favoriteschange", renderFavorites);
window.addEventListener("storage", renderFavorites);
renderFavorites();
