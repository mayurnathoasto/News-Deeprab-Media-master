import { Feed } from "feed";
import axios from "axios";

export async function generateRssFeed(allPosts) {
  // Safe helper for callers; dynamic RSS feed is served by the HTTP API handler below
  return null;
}

export default async function handler(req, res) {
  // If invoked programmatically without Next.js response object (e.g. from [langCode]/index.js)
  if (!res || typeof res.status !== 'function') {
    return null;
  }

  try {
    const siteURL = (process.env.NEXT_PUBLIC_WEB_URL || "https://deeprab.com").replace(/\/$/, "");
    const date = new Date();

    const feed = new Feed({
      title: process.env.NEXT_PUBLIC_TITLE || "Deeprab Media RSS Feed",
      description: process.env.NEXT_PUBLIC_DESCRIPTION || "Latest news and updates from Deeprab Media",
      id: siteURL,
      link: siteURL,
      language: req.query?.lang || "en",
      image: `${siteURL}/storage/logos/iq-news-main.png`,
      favicon: `${siteURL}/favicon.ico`,
      copyright: `All rights reserved ${date.getFullYear()}, Deeprab Media`,
      updated: date,
      feedLinks: {
        rss2: `${siteURL}/api/rss?format=xml`,
        json: `${siteURL}/api/rss?format=json`,
      },
      author: {
        name: "Deeprab Media",
        email: "info@deeprab.com",
        link: siteURL,
      },
    });

    // Attempt to fetch articles from backend API
    try {
      const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${process.env.NEXT_PUBLIC_END_POINT || 'api'}/get_feed_items`;
      const response = await axios.post(
        apiEndpoint,
        {
          per_page: 25,
          language_code: req.query?.lang || 'en',
        },
        {
          timeout: 5000,
        }
      );

      const feedData = response?.data?.data?.data || response?.data?.data || [];
      if (Array.isArray(feedData) && feedData.length > 0) {
        feedData.forEach((item) => {
          const itemUrl = item.link || (item.slug ? `${siteURL}/en/news/${item.slug}` : siteURL);
          feed.addItem({
            title: item.title || item.feed_name || 'News Update',
            id: itemUrl,
            link: itemUrl,
            description: item.description || item.summary || '',
            content: item.description || item.summary || '',
            author: [
              {
                name: item.source?.feed_name || item.author || "Deeprab Newsroom",
                link: siteURL,
              },
            ],
            date: item.published_at ? new Date(item.published_at) : (item.date ? new Date(item.date) : new Date()),
            image: item.image || item.thumbnail || undefined,
            category: item.source?.category?.category_name ? [{ name: item.source.category.category_name }] : undefined,
          });
        });
      }
    } catch (apiError) {
      console.warn("Backend API not reachable for RSS items, serving empty feed template", apiError?.message);
    }

    const format = req.query?.format || (req.headers?.accept?.includes('application/json') ? 'json' : 'xml');

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).send(feed.json1());
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    return res.status(200).send(feed.rss2());
  } catch (error) {
    console.error("RSS generation error:", error);
    return res.status(500).json({ error: "Failed to generate RSS feed" });
  }
}