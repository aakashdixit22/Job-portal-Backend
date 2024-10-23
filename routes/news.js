// news.js (route file)
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Use the API key from the environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;

router.get('/news', async (req, res) => {
  const { query, category } = req.query;
  let url = "";

  if (query) {
    url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`;
  } else if (category) {
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${NEWS_API_KEY}`;
  }

  try {
    const response = await axios.get(url);
    

    res.json(response.data.articles); // Send the articles to the frontend
    
  } catch (error) {
    console.error("Error fetching the news data:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
