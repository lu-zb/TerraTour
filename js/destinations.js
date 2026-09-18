(function () {
    const FAVORITES_KEY = "terra-tour:favorites";

    const spots = [
        {
            id: "zhangjiajie",
            name: "张家界",
            category: "自然峰林",
            location: "湖南",
            image: "assets/images/zhangjiajie.jpg",
            alt: "张家界层叠的石英砂岩峰林",
            description: "穿行在云雾与峰林之间，感受山谷与高处不同的风景。",
            detailPage: "zhangjiajie.html"
        },
        {
            id: "westlake",
            name: "杭州西湖",
            category: "湖泊人文",
            location: "浙江",
            image: "assets/images/westlake.jpg",
            alt: "杭州西湖湖面与远处群山",
            description: "沿湖慢慢行走，在堤岸、园林与远山之间感受四季变化。",
            detailPage: "westlake.html"
        },
        {
            id: "huangshan",
            name: "黄山",
            category: "自然山岳",
            location: "安徽",
            image: "assets/images/huangshan.jpg",
            alt: "黄山山峰、松树与云海",
            description: "沿山路寻找奇松、怪石与云海，等待清晨第一束光。",
            detailPage: "huangshan.html"
        },
        {
            id: "jiuzhaigou",
            name: "九寨沟",
            category: "湖泊森林",
            location: "四川",
            image: "assets/images/jiuzhaigou.jpg",
            alt: "九寨沟清澈的湖泊与森林",
            description: "湖泊、瀑布与森林相互连接，水面倒映着山谷的颜色。",
            detailPage: "jiuzhaigou.html"
        },
        {
            id: "forbidden-city",
            name: "北京故宫",
            category: "历史建筑",
            location: "北京",
            image: "assets/images/forbidden-city.jpg",
            alt: "北京故宫红墙与传统宫殿建筑",
            description: "沿中轴线穿过宫殿与庭院，观察红墙、屋脊和建筑细节。",
            detailPage: "forbidden-city.html"
        },
        {
            id: "guilin",
            name: "桂林山水",
            category: "自然山水",
            location: "广西",
            image: "assets/images/guilin.jpg",
            alt: "桂林漓江两岸的喀斯特山峰",
            description: "江水穿过连绵山峰，在漓江与阳朔之间寻找山水画卷。",
            detailPage: "guilin.html"
        }
    ];

    function getFavorites() {
        try {
            const value = JSON.parse(localStorage.getItem(FAVORITES_KEY));
            if (!Array.isArray(value)) return [];
            return [...new Set(value)].filter(id => spots.some(spot => spot.id === id));
        } catch {
            return [];
        }
    }

    function setFavorites(ids) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    }

    function findSpot(id) {
        return spots.find(spot => spot.id === id);
    }

    function favoriteIcon() {
        return '<svg class="favorite-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
    }

    function syncFavoriteButtons() {
        const favorites = getFavorites();

        document.querySelectorAll("[data-favorite]").forEach(button => {
            const spot = findSpot(button.dataset.favorite);
            if (!spot) return;

            const selected = favorites.includes(spot.id);
            button.classList.toggle("is-favorite", selected);
            button.setAttribute("aria-pressed", String(selected));
            button.innerHTML = favoriteIcon() + (selected ? "已收藏" : "收藏");
        });
    }

    function toggleFavorite(id) {
        const spot = findSpot(id);
        if (!spot) return;

        const favorites = getFavorites();
        const selected = favorites.includes(id);

        if (selected && !confirm(`确定取消收藏“${spot.name}”吗？`)) return;

        const nextFavorites = selected
            ? favorites.filter(favoriteId => favoriteId !== id)
            : [...favorites, id];

        setFavorites(nextFavorites);
        syncFavoriteButtons();

        window.dispatchEvent(new CustomEvent("favoriteschange", {
            detail: { id, selected: !selected }
        }));
    }

    function createCard(spot) {
        const article = document.createElement("article");
        article.className = "card destination-card";
        article.dataset.spotId = spot.id;

        const media = document.createElement("a");
        media.className = "card-media";
        media.href = spot.detailPage;

        const image = document.createElement("img");
        image.className = "card-image";
        image.src = spot.image;
        image.alt = spot.alt;
        image.loading = "lazy";
        media.append(image);

        const body = document.createElement("div");
        body.className = "card-body";
        body.innerHTML = `
            <p class="card-eyebrow">${spot.category} · ${spot.location}</p>
            <h3 class="card-title"><a href="${spot.detailPage}">${spot.name}</a></h3>
            <p class="card-description">${spot.description}</p>
        `;

        const actions = document.createElement("div");
        actions.className = "card-actions";

        const favoriteButton = document.createElement("button");
        favoriteButton.className = "btn btn-favorite";
        favoriteButton.type = "button";
        favoriteButton.dataset.favorite = spot.id;

        const detailLink = document.createElement("a");
        detailLink.className = "btn btn-text";
        detailLink.href = spot.detailPage;
        detailLink.textContent = "查看详情";

        actions.append(favoriteButton, detailLink);
        body.append(actions);
        article.append(media, body);

        return article;
    }

    function renderCards(container, spotList) {
        container.replaceChildren(...spotList.map(createCard));
        syncFavoriteButtons();
    }

    document.addEventListener("click", event => {
        const button = event.target.closest("[data-favorite]");
        if (button) toggleFavorite(button.dataset.favorite);
    });

    window.addEventListener("storage", syncFavoriteButtons);

    window.Destinations = {
        spots,
        findSpot,
        getFavorites,
        renderCards,
        syncFavoriteButtons
    };

    syncFavoriteButtons();
})();
