 // Your NewsAPI key
const API_KEY = "a83cb6b1d4b54eeaa05693a887689e9c";
const API_URL = `https://newsapi.org/v2/top-headlines?language=en&pageSize=12&apiKey=${API_KEY}`;

const grid = document.getElementById("newsGrid");
const searchInput = document.getElementById("searchInput");
const darkToggle = document.getElementById("darkModeToggle");

let articles = [];

// Fetch news from API
async function fetchNews(url = API_URL) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    articles = data.articles;

    if (articles.length > 0) renderHero(articles[0]);
    renderNews(articles);
  } catch (err) {
    console.error("Error fetching news:", err);
  }
}

// Render hero story
function renderHero(article) {
  const hero = document.getElementById("hero");
  hero.innerHTML = `
    <div class="hero-main">
      <img src="${article.urlToImage || 'https://via.placeholder.com/600x400'}" alt="">
      <h2>${article.title}</h2>
      <p>${article.description || ''}</p>
      <button onclick="openArticle(0)">Read More</button>
    </div>
  `;
}

// Render news cards (skip the first hero article)
function renderNews(newsList) {
  grid.innerHTML = "";
  newsList.slice(1).forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <img src="${item.urlToImage || 'https://via.placeholder.com/600x400'}" alt="">
      <h3>${item.title}</h3>
      <p>${item.description || ''}</p>
      <button onclick="openArticle(${index + 1})">Read More</button>
    `;
    grid.appendChild(card);
  });
}

// Open article detail page
function openArticle(index) {
  localStorage.setItem("article", JSON.stringify(articles[index]));
  window.location.href = "article.html";
}

// Search functionality
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(value)
  );
  renderNews(filtered);
});

// Category filtering
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();
    const cat = link.dataset.category;
    const url = cat === "all"
      ? API_URL
      : `https://newsapi.org/v2/top-headlines?category=${cat}&language=en&apiKey=${API_KEY}`;
    fetchNews(url);
  });
});

// Dark mode toggle
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Initial fetch
fetchNews();
