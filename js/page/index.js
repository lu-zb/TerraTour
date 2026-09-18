function getRandomSpots(spotList, count) {
    const shuffledSpots = [...spotList];

    for (let index = shuffledSpots.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledSpots[index], shuffledSpots[randomIndex]] =
            [shuffledSpots[randomIndex], shuffledSpots[index]];
    }

    return shuffledSpots.slice(0, count);
}

function showRandomSpots() {
    const container = document.querySelector("#spots-list");
    const randomSpots = getRandomSpots(Destinations.spots, 4);
    Destinations.renderCards(container, randomSpots);
}

function initializeSpotCards() {
    showRandomSpots();
    document.querySelector("#refresh-spots")
        .addEventListener("click", showRandomSpots);
}

document.addEventListener("DOMContentLoaded", initializeSpotCards);
