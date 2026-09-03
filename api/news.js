export default async function handler(req, res) {
  try {
    const feeds = [
      {
        name: "Gündem",
        url: "https://news.google.com/rss/search?q=Türkiye+gündem&hl=tr&gl=TR&ceid=TR:tr"
      },
      {
        name: "Spor",
        url: "https://news.google.com/rss/search?q=Türkiye+spor&hl=tr&gl=TR&ceid=TR:tr"
      },
      {
        name: "Ekonomi",
        url: "https://news.google.com/rss/search?q=Türkiye+ekonomi&hl=tr&gl=TR&ceid=TR:tr"
      },
      {
        name: "Dünya",
        url: "https://news.google.com/rss/search?q=dünya&hl=tr&gl=TR&ceid=TR:tr"
      },
      {
        name: "Teknoloji",
        url: "https://news.google.com/rss/search?q=teknoloji&hl=tr&gl=TR&ceid=TR:tr"
      }
    ];

    const results = [];

    for (const feed of feeds) {
      const response = await fetch(feed.url);

      if (!response.ok) {
        continue;
      }

      const xml = await response.text();

      const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

      for (const item of items.slice(0, 10)) {
        const title =
          item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
          item.match(/<title>(.*?)<\/title>/)?.[1] ||
          "";

        const link =
          item.match(/<link>(.*?)<\/link>/)?.[1] || "";

        const pubDate =
          item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";

        const source =
          item.match(
            /<source[^>]*>(.*?)<\/source>/
          )?.[1] || feed.name;

        if (!title || !link) {
          continue;
        }

        results.push({
          id: `${feed.name}-${results.length + 1}`,
          title: cleanHTML(title),
          summary: cleanHTML(title),
          content: cleanHTML(title),
          category: feed.name,
          date: formatDate(pubDate),
          time: formatTime(pubDate),
          created_at: pubDate
            ? new Date(pubDate).toISOString()
            : new Date().toISOString(),
          source: cleanHTML(source),
          author: feed.name,
          image: "",
          breaking: false,
          featured: false,
          views: 0,
          externalUrl: link
        });
      }
    }

    results.sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    );

    res.status(200).json({
      success: true,
      count: results.length,
      news: results.slice(0, 50)
    });

  } catch (error) {
    console.error("NEWS API ERROR:", error);

    res.status(500).json({
      success: false,
      count: 0,
      news: [],
      error: "Haberler alınamadı."
    });
  }
}


function cleanHTML(text) {
  return String(text)
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}


function formatDate(date) {
  if (!date) {
    return new Date().toLocaleDateString("tr-TR");
  }

  return new Date(date).toLocaleDateString(
    "tr-TR"
  );
}


function formatTime(date) {
  if (!date) {
    return new Date().toLocaleTimeString(
      "tr-TR",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  }

  return new Date(date).toLocaleTimeString(
    "tr-TR",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}
