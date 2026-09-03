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
        const response = await fetch(feed.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
            "Accept":
              "application/rss+xml, application/xml, text/xml, */*"
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
          xml.match(/<item[\s\S]*?<\/item>/gi) || [];

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
           * 1. RSS İÇİNDEN GÖRSEL BUL
           * ==========================================
           */

          let image =
            getImageFromMedia(item);

          if (!image) {
            image =
              getEnclosureImage(item);
          }

          if (!image) {
            image =
              getImageFromHTML(item);
          }

          /*
           * ==========================================
           * 2. GOOGLE NEWS SAYFASINDAN GÖRSEL BUL
           * ==========================================
           *
           * Google News linki çoğu zaman doğrudan
           * kaynak site değildir.
           *
           * Önce Google News bağlantısını açıp
           * gerçek kaynak URL'yi bulmaya çalışıyoruz.
           */

          let sourceUrl = link;

          try {
            const resolvedUrl =
              await resolveGoogleNewsUrl(link);

            if (resolvedUrl) {
              sourceUrl = resolvedUrl;
            }
          } catch (error) {
            console.log(
              "Kaynak URL çözülemedi:",
              title
            );
          }

          /*
           * ==========================================
           * 3. KAYNAK SAYFADAN OG:IMAGE BUL
           * ==========================================
           */

          if (!image && sourceUrl) {
            try {
              image =
                await getImageFromArticle(
                  sourceUrl
                );
            } catch (error) {
              console.log(
                "Kaynak görsel alınamadı:",
                source
              );
            }
          }

          /*
           * ==========================================
           * 4. HABER
           * ==========================================
           */

          const parsedDate =
            pubDate &&
            !Number.isNaN(
              new Date(pubDate).getTime()
            )
              ? new Date(pubDate)
              : new Date();

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

            /*
             * Haber artık doğrudan kaynak siteye gider.
             */
            externalUrl:
              sourceUrl || link
          });
        }
      } catch (feedError) {
        console.error(
          `${feed.name} okunamadı:`,
          feedError
        );
      }
    }

    /*
     * ==========================================
     * TEKRARLARI TEMİZLE
     * ==========================================
     */

    const uniqueNews = [];
    const seen = new Set();

    for (const news of results) {
      const key =
        normalizeTitle(news.title);

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      uniqueNews.push(news);
    }

    /*
     * ==========================================
     * YENİDEN ESKİYE
     * ==========================================
     */

    uniqueNews.sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    );

    /*
     * ==========================================
     * MANŞET / SON DAKİKA
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

    console.log(
      "GÜNORA toplam:",
      uniqueNews.length
    );

    console.log(
      "GÜNORA görselli haber:",
      uniqueNews.filter(
        news => news.image
      ).length
    );

    /*
     * ==========================================
     * JSON
     * ==========================================
     */

    res.status(200).json({
      success: true,
      count: uniqueNews.length,
      news:
        uniqueNews.slice(0, 50)
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
GOOGLE NEWS URL ÇÖZ
=========================================================
*/

async function resolveGoogleNewsUrl(url) {
  if (!url) {
    return "";
  }

  /*
   * Google News değilse direkt kullan.
   */

  if (
    !url.includes("news.google.com")
  ) {
    return url;
  }

  try {
    const response =
      await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36"
        }
      });

    /*
     * Redirect sonrası URL
     */

    if (
      response.url &&
      !response.url.includes(
        "news.google.com"
      )
    ) {
      return response.url;
    }

    /*
     * HTML içinden canonical bul.
     */

    const html =
      await response.text();

    const canonical =
      html.match(
        /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
      );

    if (canonical?.[1]) {
      return decodeHTML(
        canonical[1]
      );
    }

    /*
     * og:url
     */

    const ogUrl =
      html.match(
        /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i
      );

    if (ogUrl?.[1]) {
      return decodeHTML(
        ogUrl[1]
      );
    }

  } catch (error) {
    console.log(
      "Google News çözme hatası:",
      error.message
    );
  }

  return url;
}


/*
=========================================================
HABER SAYFASINDAN GÖRSEL
=========================================================
*/

async function getImageFromArticle(url) {
  if (!url) {
    return "";
  }

  try {
    const response =
      await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language":
            "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
        }
      });

    if (!response.ok) {
      return "";
    }

    const html =
      await response.text();

    /*
     * OG IMAGE
     */

    const ogImages = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,

      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,

      /<meta[^>]+property=["']og:image:url["'][^>]+content=["']([^"']+)["']/i,

      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,

      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,

      /<meta[^>]+name=["']twitter:image:src["'][^>]+content=["']([^"']+)["']/i
    ];

    for (const pattern of ogImages) {
      const match =
        html.match(pattern);

      if (match?.[1]) {
        const image =
          makeAbsoluteUrl(
            match[1],
            response.url || url
          );

        if (
          isValidImageUrl(image)
        ) {
          return image;
        }
      }
    }

    /*
     * LD+JSON İÇİNDEN IMAGE
     */

    const jsonBlocks =
      html.match(
        /<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi
      ) || [];

    for (const block of jsonBlocks) {
      const jsonText =
        block
          .replace(
            /<script[^>]*>/i,
            ""
          )
          .replace(
            /<\/script>$/i,
            ""
          )
          .trim();

      try {
        const data =
          JSON.parse(jsonText);

        const image =
          findImageInJSON(
            data
          );

        if (image) {
          const absolute =
            makeAbsoluteUrl(
              image,
              response.url || url
            );

          if (
            isValidImageUrl(
              absolute
            )
          ) {
            return absolute;
          }
        }
      } catch {
        /*
         * Geçersiz JSON ise devam.
         */
      }
    }

    /*
     * NORMAL IMG
     */

    const imgPatterns = [
      /<img[^>]+src=["']([^"']+)["']/gi,

      /<img[^>]+data-src=["']([^"']+)["']/gi,

      /<img[^>]+data-lazy-src=["']([^"']+)["']/gi
    ];

    for (const pattern of imgPatterns) {
      const matches =
        [...html.matchAll(pattern)];

      for (const match of matches) {
        if (!match?.[1]) {
          continue;
        }

        const image =
          makeAbsoluteUrl(
            match[1],
            response.url || url
          );

        if (
          isValidImageUrl(image) &&
          isProbablyNewsImage(image)
        ) {
          return image;
        }
      }
    }

  } catch (error) {
    console.log(
      "Makale görsel hatası:",
      error.message
    );
  }

  return "";
}


/*
=========================================================
JSON İÇİNDEN IMAGE BUL
=========================================================
*/

function findImageInJSON(data) {
  if (!data) {
    return "";
  }

  if (typeof data === "string") {
    return "";
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const result =
        findImageInJSON(item);

      if (result) {
        return result;
      }
    }

    return "";
  }

  if (
    typeof data === "object"
  ) {
    if (
      typeof data.image ===
      "string"
    ) {
      return data.image;
    }

    if (
      Array.isArray(data.image) &&
      data.image.length
    ) {
      return data.image[0];
    }

    if (
      data.image &&
      typeof data.image ===
      "object"
    ) {
      if (
        typeof data.image.url ===
        "string"
      ) {
        return data.image.url;
      }
    }

    for (const key of Object.keys(data)) {
      const result =
        findImageInJSON(
          data[key]
        );

      if (result) {
        return result;
      }
    }
  }

  return "";
}


/*
=========================================================
RSS XML DEĞERİ
=========================================================
*/

function getXMLValue(
  xml,
  tag
) {
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
MEDIA
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

      if (
        isValidImageUrl(image)
      ) {
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
        decodeHTML(
          match[1]
        );

      if (
        isValidImageUrl(image)
      ) {
        return image;
      }
    }
  }

  return "";
}


/*
=========================================================
RSS HTML IMAGE
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
        match[1].trim()
      );

    if (
      isValidImageUrl(image)
    ) {
      return image;
    }
  }

  return "";
}


/*
=========================================================
ABSOLUTE URL
=========================================================
*/

function makeAbsoluteUrl(
  image,
  baseUrl
) {
  if (!image) {
    return "";
  }

  image =
    decodeHTML(
      image.trim()
    );

  if (
    image.startsWith("//")
  ) {
    return "https:" + image;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  try {
    return new URL(
      image,
      baseUrl
    ).href;
  } catch {
    return "";
  }
}


/*
=========================================================
IMAGE URL
=========================================================
*/

function isValidImageUrl(url) {
  return (
    typeof url === "string" &&
    (
      url.startsWith("http://") ||
      url.startsWith("https://")
    )
  );
}


/*
=========================================================
MUHTEMEL HABER GÖRSELİ
=========================================================
*/

function isProbablyNewsImage(url) {
  const lower =
    url.toLowerCase();

  const badWords = [
    "logo",
    "icon",
    "avatar",
    "favicon",
    "sprite",
    "placeholder",
    "advert",
    "banner"
  ];

  return !badWords.some(
    word =>
      lower.includes(word)
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
HTML ENTITY
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
    .toLocaleLowerCase(
      "tr-TR"
    )
    .replace(
      /[^\p{L}\p{N}\s]/gu,
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
    .toLocaleLowerCase(
      "tr-TR"
    )
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
