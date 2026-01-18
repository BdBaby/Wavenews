 // Your NewsAPI key
const API_URL = "/api/news";

const grid = document.getElementById("newsGrid");
const searchInput = document.getElementById("searchInput");
const darkToggle = document.getElementById("darkModeToggle");

let articles = [];

// Fetch news from API
async function fetchNews(url = API_URL) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      console.error("No articles returned", data);
      return;
    }

    articles = data.articles;
    renderHero(articles[0]);
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
  ? "/api/news"
  : `/api/news?category=${cat}`;


    fetchNews(url);
  });
});

// Dark mode toggle
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Initial fetch
fetchNews();
