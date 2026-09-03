export default async function handler(req, res) {
  try {
    const feeds = [
      {
        name: "Gündem",
        url: "https://news.google.com/rss/search?q=Türkiye%20gündem&hl=tr&gl=TR&ceid=TR:tr"
      },
      {
        name: "Spor",
        url: "https://news.google.com/rss/search?q=Türkiye%20spor&hl=tr&gl=TR&ceid=TR:tr"
      },
      {
        name: "Ekonomi",
        url: "https://news.google.com/rss/search?q=Türkiye%20ekonomi&hl=tr&gl=TR&ceid=TR:tr"
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
        console.log("GÜNORA RSS:", feed.name);

        const response = await fetch(feed.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            "Accept":
              "application/rss+xml, application/xml, text/xml, */*"
          }
        });

        if (!response.ok) {
          console.error(
            `${feed.name} RSS HTTP:`,
            response.status
          );
          continue;
        }

        const xml = await response.text();

        console.log(
          `${feed.name}: RSS uzunluğu`,
          xml.length
        );

        const items =
          xml.match(/<item[\s\S]*?<\/item>/gi) || [];

        console.log(
          `${feed.name}: ${items.length} haber bulundu`
        );

        for (const item of items.slice(0, 10)) {
          const title = cleanHTML(
            getXMLValue(item, "title")
          );

          const link = cleanHTML(
            getXMLValue(item, "link")
          );

          const pubDate =
            getXMLValue(item, "pubDate");

          const source =
            getSource(item) || feed.name;

          if (!title || !link) {
            continue;
          }

          /*
           * ==========================================
           * GÖRSEL 1
           * RSS MEDIA
           * ==========================================
           */

          let image =
            getImageFromMedia(item);

          /*
           * ==========================================
           * GÖRSEL 2
           * ENCLOSURE
           * ==========================================
           */

          if (!image) {
            image =
              getEnclosureImage(item);
          }

          /*
           * ==========================================
           * GÖRSEL 3
           * RSS HTML
           * ==========================================
           */

          if (!image) {
            image =
              getImageFromHTML(item);
          }

          /*
           * ==========================================
           * TARİH
           * ==========================================
           */

          const parsedDate =
            pubDate &&
            !Number.isNaN(
              new Date(pubDate).getTime()
            )
              ? new Date(pubDate)
              : new Date();

          /*
           * ==========================================
           * HABERİ EKLE
           * ==========================================
           */

          results.push({
            id:
              `${slugify(feed.name)}-${Date.now()}-${results.length}`,

            title,

            summary:
              title,

            content:
              title,

            category:
              feed.name,

            date:
              formatDate(parsedDate),

            time:
              formatTime(parsedDate),

            created_at:
              parsedDate.toISOString(),

            source:
              cleanHTML(source),

            author:
              cleanHTML(source),

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
     * ==========================================
     * TEKRAR EDEN HABERLERİ TEMİZLE
     * ==========================================
     */

    const uniqueNews = [];
    const seen = new Set();

    for (const news of results) {
      const key = normalizeTitle(
        news.title
      );

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      uniqueNews.push(news);
    }

    /*
     * ==========================================
     * YENİDEN ESKİYE SIRALA
     * ==========================================
     */

    uniqueNews.sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    );

    /*
     * ==========================================
     * MANŞET + SON DAKİKA
     * ==========================================
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
     * ==========================================
     * CEVAP
     * ==========================================
     */

    console.log(
      "GÜNORA toplam haber:",
      uniqueNews.length
    );

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

function getXMLValue(xml, tag) {
  const cdataRegex =
    new RegExp(
      `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
      "i"
    );

  const normalRegex =
    new RegExp(
      `<${tag}[^>]*>([\\s\\S]*?)</${tag}>`,
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
MEDIA CONTENT / THUMBNAIL
=========================================================
*/

function getImageFromMedia(xml) {
  const patterns = [
    /<media:content[^>]+url=["']([^"']+)["']/i,
    /<media:thumbnail[^>]+url=["']([^"']+)["']/i,
    /<media:content[^>]+url=([^\s>]+)/i,
    /<media:thumbnail[^>]+url=([^\s>]+)/i
  ];

  for (const pattern of patterns) {
    const match =
      xml.match(pattern);

    if (match?.[1]) {
      const image =
        decodeHTML(
          match[1]
            .replace(
              /^["']|["']$/g,
              ""
            )
        );

      if (isValidImageUrl(image)) {
        return image;
      }
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
  const patterns = [
    /<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\/[^"']+["']/i,
    /<enclosure[^>]+type=["']image\/[^"']+["'][^>]*url=["']([^"']+)["']/i
  ];

  for (const pattern of patterns) {
    const match =
      xml.match(pattern);

    if (match?.[1]) {
      const image =
        decodeHTML(match[1]);

      if (isValidImageUrl(image)) {
        return image;
      }
    }
  }

  return "";
}


/*
=========================================================
HTML İÇİNDEN GÖRSEL
=========================================================
*/

function getImageFromHTML(xml) {
  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/i,

    /<img[^>]+data-src=["']([^"']+)["']/i,

    /<img[^>]+data-lazy-src=["']([^"']+)["']/i,

    /<image[^>]*>[\s\S]*?<url>([\s\S]*?)<\/url>/i,

    /(https?:\/\/[^"' <]+\.(?:jpg|jpeg|png|webp)(?:\?[^"' <]*)?)/i
  ];

  for (const pattern of patterns) {
    const match =
      xml.match(pattern);

    if (!match?.[1]) {
      continue;
    }

    const image =
      decodeHTML(
        match[1]
          .trim()
          .replace(
            /^["']|["']$/g,
            ""
          )
      );

    if (isValidImageUrl(image)) {
      return image;
    }
  }

  return "";
}


/*
=========================================================
GÖRSEL URL KONTROLÜ
=========================================================
*/

function isValidImageUrl(url) {
  if (!url) {
    return false;
  }

  return (
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
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
      .replace(
        /\s+/g,
        " "
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
BAŞLIK NORMALİZE
=========================================================
*/

function normalizeTitle(title) {
  return String(title ?? "")
    .toLocaleLowerCase("tr-TR")
    .replace(
      /[^a-z0-9ğüşöçıİĞÜŞÖÇ\s]/gi,
      ""
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}


/*
=========================================================
SLUG
=========================================================
*/

function slugify(text) {
  return String(text ?? "")
    .toLocaleLowerCase("tr-TR")
    .replace(
      /ğ/g,
      "g"
    )
    .replace(
      /ü/g,
      "u"
    )
    .replace(
      /ş/g,
      "s"
    )
    .replace(
      /ı/g,
      "i"
    )
    .replace(
      /ö/g,
      "o"
    )
    .replace(
      /ç/g,
      "c"
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}


/*
=========================================================
TARİH
=========================================================
*/

function formatDate(date) {
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
