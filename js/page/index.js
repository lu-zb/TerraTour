// 六个景点的数据
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

/**
 * 从景点数组中随机取出指定数量的景点。
 * 使用副本，避免改变原始数组。
 */
function getRandomSpots(spotList, count) {
    const shuffledSpots = [...spotList];

    for (let index = shuffledSpots.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));

        const temporarySpot = shuffledSpots[index];
        shuffledSpots[index] = shuffledSpots[randomIndex];
        shuffledSpots[randomIndex] = temporarySpot;
    }

    return shuffledSpots.slice(0, count);
}

/**
 * 根据一个景点对象创建一张景点卡片。
 */
function createSpotCard(spot) {
    const article = document.createElement("article");
    article.className = "card";
    article.dataset.spotId = spot.id;

    const imageLink = document.createElement("a");
    imageLink.className = "card-media";
    imageLink.href = spot.detailPage;

    const image = document.createElement("img");
    image.className = "card-image";
    image.src = spot.image;
    image.alt = spot.alt;
    image.loading = "lazy";

    imageLink.append(image);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const eyebrow = document.createElement("p");
    eyebrow.className = "card-eyebrow";
    eyebrow.textContent = `${spot.category} · ${spot.location}`;

    const title = document.createElement("h3");
    title.className = "card-title";

    const titleLink = document.createElement("a");
    titleLink.href = spot.detailPage;
    titleLink.textContent = spot.name;

    title.append(titleLink);

    const description = document.createElement("p");
    description.className = "card-description";
    description.textContent = spot.description;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const detailLink = document.createElement("a");
    detailLink.className = "btn btn-text";
    detailLink.href = spot.detailPage;
    detailLink.textContent = "查看详情";

    actions.append(detailLink);

    cardBody.append(
        eyebrow,
        title,
        description,
        actions
    );

    article.append(
        imageLink,
        cardBody
    );

    return article;
}

/**
 * 将景点数组动态渲染到页面。
 */
function renderSpots(spotList) {
    const spotsContainer = document.querySelector("#spots-list");

    if (!spotsContainer) {
        return;
    }

    const fragment = document.createDocumentFragment();

    spotList.forEach(function (spot) {
        const card = createSpotCard(spot);
        fragment.append(card);
    });

    spotsContainer.replaceChildren(fragment);
}

/**
 * 随机选择四个景点并渲染。
 */
function showRandomSpots() {
    const randomSpots = getRandomSpots(spots, 4);
    renderSpots(randomSpots);
}

/**
 * 初始化首页景点区域。
 */
function initializeSpotCards() {
    showRandomSpots();

    const refreshButton = document.querySelector("#refresh-spots");

    if (refreshButton) {
        refreshButton.addEventListener("click", showRandomSpots);
    }
}

document.addEventListener("DOMContentLoaded", initializeSpotCards);