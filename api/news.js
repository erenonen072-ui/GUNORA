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
      try {
        const response = await fetch(feed.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; GUNORA/1.0)"
          }
        });

        if (!response.ok) {
          console.error(
            `${feed.name} RSS hatası:`,
            response.status
          );
          continue;
        }

        const xml = await response.text();

        const items =
          xml.match(
            /<item>[\s\S]*?<\/item>/gi
          ) || [];

        for (const item of items.slice(0, 10)) {
          const title =
            getXMLValue(item, "title");

          const link =
            getXMLValue(item, "link");

          const pubDate =
            getXMLValue(item, "pubDate");

          const source =
            getSource(item) || feed.name;

          /*
           * =================================================
           * GÖRSEL BUL
           * =================================================
           */

          let image =
            getImageFromMedia(item);

          /*
           * enclosure varsa onu da dene
           */

          if (!image) {
            image =
              getEnclosureImage(item);
          }

          /*
           * Google News bazı RSS kayıtlarında
           * görseli description/content içinde
           * gönderebilir.
           */

          if (!image) {
            image =
              getImageFromHTML(item);
          }

          /*
           * =================================================
           * HABER
           * =================================================
           */

          if (!title || !link) {
            continue;
          }

          const createdAt =
            pubDate &&
            !Number.isNaN(
              new Date(pubDate).getTime()
            )
              ? new Date(pubDate).toISOString()
              : new Date().toISOString();

          results.push({
            id:
              `${feed.name}-${results.length + 1}`,

            title:
              cleanHTML(title),

            summary:
              cleanHTML(title),

            content:
              cleanHTML(title),

            category:
              feed.name,

            date:
              formatDate(pubDate),

            time:
              formatTime(pubDate),

            created_at:
              createdAt,

            source:
              cleanHTML(source),

            author:
              cleanHTML(source),

            /*
             * ARTIK BOŞ DEĞİL
             */
            image:
              image || "",

            breaking:
              false,

            featured:
              false,

            views:
              0,

            externalUrl:
              link.trim()
          });
        }
      } catch (feedError) {
        console.error(
          `${feed.name} RSS okunamadı:`,
          feedError
        );
      }
    }

    /*
     * =====================================================
     * TEKRAR EDEN HABERLERİ TEMİZLE
     * =====================================================
     */

    const uniqueNews = [];

    const seen = new Set();

    for (const news of results) {
      const key =
        news.title
          .toLocaleLowerCase("tr-TR")
          .trim();

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);

      uniqueNews.push(news);
    }

    /*
     * =====================================================
     * YENİDEN ESKİYE SIRALA
     * =====================================================
     */

    uniqueNews.sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    );

    /*
     * =====================================================
     * MANŞETLER
     * =====================================================
     */

    uniqueNews.forEach(
      (news, index) => {
        news.featured =
          index < 5;

        news.breaking =
          index < 8;
      }
    );

    /*
     * =====================================================
     * CEVAP
     * =====================================================
     */

    res.status(200).json({
      success: true,
      count: uniqueNews.length,
      news: uniqueNews.slice(0, 50)
    });

  } catch (error) {
    console.error(
      "GÜNORA NEWS API ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      count: 0,
      news: [],
      error:
        "Haberler alınamadı."
    });
  }
}


/*
=========================================================
XML DEĞERİ AL
=========================================================
*/

function getXMLValue(
  xml,
  tag
) {
  const cdataRegex =
    new RegExp(
      `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`,
      "i"
    );

  const normalRegex =
    new RegExp(
      `<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`,
      "i"
    );

  const cdata =
    xml.match(cdataRegex);

  if (cdata?.[1]) {
    return cdata[1].trim();
  }

  const normal =
    xml.match(normalRegex);

  if (normal?.[1]) {
    return normal[1].trim();
  }

  return "";
}


/*
=========================================================
SOURCE
=========================================================
*/

function getSource(xml) {
  const match =
    xml.match(
      /<source[^>]*>([\s\S]*?)<\/source>/i
    );

  if (!match) {
    return "";
  }

  return cleanHTML(
    match[1]
  );
}


/*
=========================================================
MEDIA:CONTENT
=========================================================
*/

function getImageFromMedia(xml) {
  const patterns = [
    /<media:content[^>]+url=["']([^"']+)["']/i,

    /<media:thumbnail[^>]+url=["']([^"']+)["']/i,

    /<media:content[^>]+url=([^ >]+)/i,

    /<media:thumbnail[^>]+url=([^ >]+)/i
  ];

  for (const pattern of patterns) {
    const match =
      xml.match(pattern);

    if (match?.[1]) {
      return decodeHTML(
        match[1]
          .replace(/^["']|["']$/g, "")
      );
    }
  }

  return "";
}


/*
=========================================================
ENCLOSURE
=========================================================
*/

function getEnclosureImage(xml) {
  const match =
    xml.match(
      /<enclosure[^>]+type=["']image\/[^"']+["'][^>]+url=["']([^"']+)["']/i
    );

  if (match?.[1]) {
    return decodeHTML(
      match[1]
    );
  }

  const reverse =
    xml.match(
      /<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image\/[^"']+["']/i
    );

  if (reverse?.[1]) {
    return decodeHTML(
      reverse[1]
    );
  }

  return "";
}


/*
=========================================================
HTML İÇİNDEN GÖRSEL BUL
=========================================================
*/

function getImageFromHTML(xml) {
  const patterns = [

    /<img[^>]+src=["']([^"']+)["']/i,

    /<img[^>]+src=([^ >]+)/i,

    /<image[^>]*>\s*<url>([\s\S]*?)<\/url>/i,

    /https?:\/\/[^"' <]+\.(?:jpg|jpeg|png|webp)(?:\?[^"' <]*)?/i
  ];

  for (const pattern of patterns) {
    const match =
      xml.match(pattern);

    if (match?.[1]) {
      const image =
        decodeHTML(
          match[1]
            .replace(/^["']|["']$/g, "")
        );

      if (
        image.startsWith("http://") ||
        image.startsWith("https://")
      ) {
        return image;
      }
    }

    if (
      match &&
      match[0] &&
      pattern.source.includes(
        "https?:"
      )
    ) {
      const image =
        decodeHTML(match[0]);

      if (
        image.startsWith("http://") ||
        image.startsWith("https://")
      ) {
        return image;
      }
    }
  }

  return "";
}


/*
=========================================================
HTML TEMİZLE
=========================================================
*/

function cleanHTML(text) {
  return decodeHTML(
    String(text ?? "")
      .replace(
        /<!\[CDATA\[|\]\]>/g,
        ""
      )
      .replace(
        /<[^>]*>/g,
        ""
      )
      .trim()
  );
}


/*
=========================================================
HTML ENTITY ÇÖZ
=========================================================
*/

function decodeHTML(text) {
  return String(text ?? "")
    .replace(
      /&amp;/g,
      "&"
    )
    .replace(
      /&quot;/g,
      '"'
    )
    .replace(
      /&#39;/g,
      "'"
    )
    .replace(
      /&apos;/g,
      "'"
    )
    .replace(
      /&lt;/g,
      "<"
    )
    .replace(
      /&gt;/g,
      ">"
    )
    .replace(
      /&#(\d+);/g,
      (_, code) =>
        String.fromCharCode(
          Number(code)
        )
    )
    .replace(
      /&#x([0-9a-f]+);/gi,
      (_, code) =>
        String.fromCharCode(
          parseInt(code, 16)
        )
    );
}


/*
=========================================================
TARİH
=========================================================
*/

function formatDate(date) {
  if (!date) {
    return new Date()
      .toLocaleDateString(
        "tr-TR"
      );
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return new Date()
      .toLocaleDateString(
        "tr-TR"
      );
  }

  return parsed
    .toLocaleDateString(
      "tr-TR"
    );
}


/*
=========================================================
SAAT
=========================================================
*/

function formatTime(date) {
  if (!date) {
    return new Date()
      .toLocaleTimeString(
        "tr-TR",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return new Date()
      .toLocaleTimeString(
        "tr-TR",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );
  }

  return parsed
    .toLocaleTimeString(
      "tr-TR",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
}
