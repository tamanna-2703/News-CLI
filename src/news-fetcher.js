import Parser from 'rss-parser';
import { loadNews, saveNews } from './cache.js';

const FEEDS = {
  "sports": { label: 'Sports', url: 'https://feeds.bbci.co.uk/sport/rss.xml' },
  "business": { label: 'BUSINESS', url: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
  "tech": { label: 'TECH', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml' },
  "world": { label: 'WORLD', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  "science": { label: 'SCIENCE', url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml' },
  "entertainment": { label: 'ENTERTAINMENT', url: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml' },
  "ai": { label: 'ARTIFICIAL INTELLIGENCE', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' }
};

const parser = new Parser({ timeout: 8000 });

function shortNews(text = '') {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  return cleanText.length > 160 ? cleanText.slice(0, 157) + "..." : cleanText;
}

async function fetchNewsOnline(category) {
  const feed = await parser.parseURL(FEEDS[category].url);
  return feed.items.map(item => {
    return {
      title: item.title,
      summary: shortNews(item.content || item.contentSnippet || ''),
      date: item.isoDate || item.pubDate || '',
      link: item.link
    };
  });
}

export async function getNews(category, limit = 5, status = 'online') {
    if(status == 'online'){
  const articles = await fetchNewsOnline(category);
  await saveNews(category, articles); //stores in harddrive
  return { mode: 'online', articles: articles.slice(0, limit) };
    }
    else{
        const saved = await loadNews(category);
        if(!saved){
            return {mode:'empty', articles : []};
        }
        return {mode:'offline', articles : (saved.articles || saved).splice(0, limit)};
    }
}