const searchForm = document.querySelector("#destination-search");
const searchInput = document.querySelector("#search-input");
const searchStatus = document.querySelector("#search-status");
const resultsTitle = document.querySelector("#results-title");
const resultsContainer = document.querySelector("#search-results");

function searchSpots() {
    const keyword = searchInput.value.trim().toLowerCase();
    TerraNavigation.saveView({ search: searchInput.value });

    const results = Destinations.spots.filter(spot => {
        const searchableText = [
            spot.name,
            spot.category,
            spot.location,
            spot.description
        ].join(" ").toLowerCase();

        return searchableText.includes(keyword);
    });

    resultsTitle.textContent = keyword ? "搜索结果" : "全部景点";
    searchStatus.textContent = keyword
        ? `找到 ${results.length} 个目的地`
        : `共 ${results.length} 个目的地`;

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <h3>没有找到相关景点</h3>
                <p>换一个景点名称、地区或旅行类型试试。</p>
                <button class="btn btn-primary" id="clear-search" type="button">清空搜索</button>
            </div>
        `;

        document.querySelector("#clear-search").addEventListener("click", () => {
            searchInput.value = "";
            searchSpots();
            searchInput.focus();
        });
        return;
    }

    Destinations.renderCards(resultsContainer, results);
}

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    searchSpots();
});

searchInput.addEventListener("input", searchSpots);
searchInput.value = TerraNavigation.getView().search || "";
searchSpots();

if (location.hash === "#destination-search") {
    searchInput.focus();
}
