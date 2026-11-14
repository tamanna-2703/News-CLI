import Parser from 'rss-parser';

const FEEDS = {
  "sports": { label: 'Sports', url: 'https://feeds.bbci.co.uk/sport/rss.xml' },
  "business": { label: 'BUSINESS', url: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
  "tech": { label: 'TECH', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml' }
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

export async function getNews(category, limit = 5) {
  const articles = await fetchNewsOnline(category);
  return { mode: 'online', articles: articles.slice(0, limit) };
}