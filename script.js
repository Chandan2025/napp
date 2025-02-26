const API_KEY = "0809efd3f22442d18ea57cfcf7fc03cf";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        if (!data.articles || data.articles.length === 0) throw new Error("No articles found");
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerText = article.title;
    newsDesc.innerText = article.description || "No description available";

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerText = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = document.getElementById(id);
    curSelectedNav.classList.add("active");
}

document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-text").value;
    if (query) fetchNews(query);
});
