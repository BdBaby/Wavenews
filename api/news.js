export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY;
  const category = req.query.category || "";

  const url = category
    ? `https://newsapi.org/v2/top-headlines?language=en&category=${category}&apiKey=${API_KEY}`
    : `https://newsapi.org/v2/top-headlines?language=en&pageSize=12&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
