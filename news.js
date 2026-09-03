<!DOCTYPE html>
<html lang="tr">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Haber | GÜNORA</title>

  <meta
    name="description"
    id="metaDescription"
    content="GÜNORA haber"
  >

  <meta
    name="theme-color"
    content="#e30613"
  >

  <link
    rel="stylesheet"
    href="style.css"
  >

</head>

<body>

  <!-- OKUMA İLERLEME -->
  <div class="reading-progress">
    <span id="readingProgress"></span>
  </div>

  <!-- TOPBAR -->
  <div class="topbar">

    <div class="container topbar-inner">

      <div class="topbar-left">
        <span id="todayDate"></span>
      </div>

      <div class="topbar-right">

        <span class="live-dot"></span>

        <span>GÜNORA GÜNCEL</span>

        <span class="topbar-separator">
          •
        </span>

        <span id="currentTime">
          00:00
        </span>

      </div>

    </div>

  </div>

  <!-- HEADER -->
  <header class="site-header">

    <div class="container header-inner">

      <a
        href="index.html"
        class="logo"
      >

        <span class="logo-main">
          GÜNORA
        </span>

        <span class="logo-sub">
          Gündemin Yeni Sesi
        </span>

      </a>

      <nav class="main-nav">

        <a href="index.html">
          Ana Sayfa
        </a>

        <a href="gundem.html">
          Gündem
        </a>

        <a href="spor.html">
          Spor
        </a>

        <a href="ekonomi.html">
          Ekonomi
        </a>

        <a href="dunya.html">
          Dünya
        </a>

        <a href="teknoloji.html">
          Teknoloji
        </a>

      </nav>

      <div class="header-actions">

        <button
          class="icon-btn"
          id="themeToggle"
          type="button"
        >
          🌙
        </button>

        <a
          class="icon-btn"
          href="index.html"
          aria-label="Ana sayfa"
        >
          ←
        </a>

      </div>

    </div>

  </header>

  <!-- SON DAKİKA -->
  <section class="breaking-bar">

    <div class="container breaking-inner">

      <div class="breaking-label">

        <span class="breaking-pulse"></span>

        SON DAKİKA

      </div>

      <div
        class="breaking-content"
        id="breakingNews"
      >
        GÜNORA
      </div>

    </div>

  </section>

  <!-- ================= HABER ================= -->

  <main class="article-page">

    <div class="container">

      <div
        id="articleContainer"
        class="article-layout"
      >

       const newsData = [
  {
    id: 1,
    title: "Ağustos ayı enflasyonu açıklandı",
    summary: "TÜİK verilerine göre tüketici fiyatları ağustosta aylık yüzde 1,84 arttı. Yıllık enflasyon ise yüzde 31,51 olarak gerçekleşti.",
    category: "Ekonomi",
    date: "3 Eylül 2026",
    time: "10:00",
    source: "GÜNORA",
    image: "/images/news/enflasyon.jpg",
    featured: true
  },

  {
    id: 2,
    title: "Kira zam oranı belli oldu",
    summary: "Ağustos enflasyon verilerinin açıklanmasıyla eylül ayında kira sözleşmesini yenileyecek kiracıları ilgilendiren tavan zam oranı da netleşti.",
    category: "Ekonomi",
    date: "3 Eylül 2026",
    time: "10:20",
    source: "GÜNORA",
    image: "/images/news/kira.jpg",
    featured: false
  },

  {
    id: 3,
    title: "Şimşek'ten enflasyon mesajı",
    summary: "Hazine ve Maliye Bakanı Mehmet Şimşek, açıklanan ağustos enflasyon verilerinin ardından dezenflasyon sürecine ilişkin değerlendirmede bulundu.",
    category: "Ekonomi",
    date: "3 Eylül 2026",
    time: "11:15",
    source: "GÜNORA",
    image: "/images/news/simsek.jpg",
    featured: false
  },

  {
    id: 4,
    title: "Altın fiyatlarında hareketlilik sürüyor",
    summary: "Küresel piyasalarda altın fiyatlarının seyri yatırımcıların gündeminde. Ons altın ağustos ayını güçlü bir yükselişle tamamladı.",
    category: "Ekonomi",
    date: "3 Eylül 2026",
    time: "16:36",
    source: "GÜNORA",
    image: "/images/news/altin.jpg",
    featured: false
  },

  {
    id: 5,
    title: "Ağustos ayında ihracatta yeni rekor",
    summary: "Türkiye'nin ağustos ayı ihracatı geçen yılın aynı dönemine göre artış göstererek yeni bir aylık rekora ulaştı.",
    category: "Ekonomi",
    date: "3 Eylül 2026",
    time: "14:30",
    source: "GÜNORA",
    image: "/images/news/ihracat.jpg",
    featured: false
  },

  {
    id: 6,
    title: "Fenerbahçe-Beşiktaş derbisinin hakemi belli oldu",
    summary: "Süper Lig'in 4. haftasında oynanacak Fenerbahçe-Beşiktaş karşılaşmasını Halil Umut Meler yönetecek.",
    category: "Spor",
    date: "3 Eylül 2026",
    time: "15:45",
    source: "GÜNORA",
    image: "/images/news/fenerbahce-besiktas.jpg",
    featured: true
  },

  {
    id: 7,
    title: "Derbi için geri sayım başladı",
    summary: "Fenerbahçe ile Beşiktaş arasında oynanacak dev karşılaşma öncesinde iki takımda hazırlıklar devam ediyor.",
    category: "Spor",
    date: "3 Eylül 2026",
    time: "16:00",
    source: "GÜNORA",
    image: "/images/news/derbi.jpg",
    featured: false
  },

  {
    id: 8,
    title: "Beşiktaş derbi hazırlıklarını sürdürdü",
    summary: "Siyah-beyazlı ekip, Süper Lig'in 4. haftasında Fenerbahçe ile oynayacağı mücadele öncesi çalışmalarına devam etti.",
    category: "Spor",
    date: "3 Eylül 2026",
    time: "14:10",
    source: "GÜNORA",
    image: "/images/news/besiktas.jpg",
    featured: false
  },

  {
    id: 9,
    title: "Beşiktaş'ın yeni transferi İstanbul'a geliyor",
    summary: "Siyah-beyazlıların yeni savunma oyuncusu Ümit Akdağ'ın İstanbul'a geliş saati belli oldu.",
    category: "Spor",
    date: "3 Eylül 2026",
    time: "13:40",
    source: "GÜNORA",
    image: "/images/news/umit-akdag.jpg",
    featured: false
  },

  {
    id: 10,
    title: "Fenerbahçe'de UEFA soruşturması gündemde",
    summary: "Fenerbahçe, Lyon karşılaşmasının ardından yaşanan olaylarla ilgili UEFA'nın Matteo Guendouzi ve Mason Greenwood hakkında disiplin süreci başlattığını açıkladı.",
    category: "Spor",
    date: "3 Eylül 2026",
    time: "15:10",
    source: "GÜNORA",
    image: "/images/news/uefa.jpg",
    featured: false
  },

  {
    id: 11,
    title: "Galatasaray'da Başakşehir maçı hazırlıkları",
    summary: "Sarı-kırmızılı ekip, Süper Lig'in 4. haftasında oynayacağı Başakşehir karşılaşmasına hazırlanıyor.",
    category: "Spor",
    date: "3 Eylül 2026",
    time: "12:50",
    source: "GÜNORA",
    image: "/images/news/galatasaray.jpg",
    featured: false
  },

  {
    id: 12,
    title: "Filenin Sultanları Almanya karşısında",
    summary: "A Milli Kadın Voleybol Takımı, Avrupa Voleybol Şampiyonası çeyrek finalinde Almanya ile karşı karşıya geliyor.",
    category: "Spor",
    date: "3 Eylül 2026",
    time: "19:00",
    source: "GÜNORA",
    image: "/images/news/filenin-sultanlari.jpg",
    featured: true
  },

  {
    id: 13,
    title: "Süper Lig'de 4. hafta hakemleri açıklandı",
    summary: "Türkiye Futbol Federasyonu, Trendyol Süper Lig'in 4. haftasında görev yapacak hakemleri duyurdu.",
    category: "Spor",
    date: "3 Eylül 2026",
    time: "15:30",
    source: "GÜNORA",
    image: "/images/news/tff.jpg",
    featured: false
  },

  {
    id: 14,
    title: "Trabzonspor'da transfer hareketliliği",
    summary: "Karadeniz ekibinde transfer döneminin son günleri yaklaşırken kadro planlamasıyla ilgili çalışmalar devam ediyor.",
    category: "Spor",
    date: "3 Eylül 2026",
    time: "13:20",
    source: "GÜNORA",
    image: "/images/news/trabzonspor.jpg",
    featured: false
  },

  {
    id: 15,
    title: "MİT Başkanı Kalın'dan kritik görüşme",
    summary: "MİT Başkanı İbrahim Kalın, Yunanistan Ulusal İstihbarat Teşkilatı Başkanı Demiris ile görüştü.",
    category: "Gündem",
    date: "3 Eylül 2026",
    time: "16:55",
    source: "GÜNORA",
    image: "/images/news/mit.jpg",
    featured: true
  },

  {
    id: 16,
    title: "Gemi kazasında soruşturma sürüyor",
    summary: "Marmara Denizi'ndeki gemi kazasının ardından soruşturma kapsamında kayıtlar ve telsiz görüşmeleri incelemeye alındı.",
    category: "Gündem",
    date: "3 Eylül 2026",
    time: "16:28",
    source: "GÜNORA",
    image: "/images/news/gemi-kazasi.jpg",
    featured: true
  },

  {
    id: 17,
    title: "Gemi kazasında 6 şüpheli adliyeye sevk edildi",
    summary: "Alsu gemisinde görev yapan 9 şüpheliden 6'sı soruşturma kapsamında adliyeye sevk edildi.",
    category: "Gündem",
    date: "3 Eylül 2026",
    time: "16:48",
    source: "GÜNORA",
    image: "/images/news/alsu.jpg",
    featured: false
  },

  {
    id: 18,
    title: "Sarıyer'de yangın: 8 kişi kurtarıldı",
    summary: "İstanbul Sarıyer'de çıkan yangında çatıda mahsur kalan 8 kişi ekiplerin çalışmasıyla kurtarıldı.",
    category: "Gündem",
    date: "3 Eylül 2026",
    time: "16:20",
    source: "GÜNORA",
    image: "/images/news/sariyer-yangin.jpg",
    featured: false
  },

  {
    id: 19,
    title: "MSB'den Suriye açıklaması",
    summary: "Milli Savunma Bakanlığı, Suriye'ye yönelik desteğin devam edeceğini açıkladı.",
    category: "Gündem",
    date: "3 Eylül 2026",
    time: "12:00",
    source: "GÜNORA",
    image: "/images/news/msb.jpg",
    featured: false
  },

  {
    id: 20,
    title: "Gülistan Doku soruşturmasında yeni gelişme",
    summary: "Gülistan Doku soruşturması kapsamında tutuklu sayısının 32'ye yükseldiği bildirildi.",
    category: "Gündem",
    date: "3 Eylül 2026",
    time: "15:50",
    source: "GÜNORA",
    image: "/images/news/gulistan-doku.jpg",
    featured: false
  },

  {
    id: 21,
    title: "Putin'den Ukrayna açıklaması",
    summary: "Rusya Devlet Başkanı Vladimir Putin, Rusya ile Ukrayna arasında anlaşmaya varılması için şans bulunduğunu söyledi.",
    category: "Dünya",
    date: "3 Eylül 2026",
    time: "16:38",
    source: "GÜNORA",
    image: "/images/news/putin.jpg",
    featured: true
  },

  {
    id: 22,
    title: "Libya'da petrol deposuna İHA saldırısı",
    summary: "Libya'nın başkenti Trablus'ta bir petrol deposuna insansız hava aracı saldırısı düzenlendi.",
    category: "Dünya",
    date: "3 Eylül 2026",
    time: "16:15",
    source: "GÜNORA",
    image: "/images/news/libya.jpg",
    featured: false
  },

  {
    id: 23,
    title: "Almanya'da savunma şirketi önünde kundaklama girişimi",
    summary: "Almanya'da bir savunma sanayii şirketinin önünde kundaklama girişimi yaşandı.",
    category: "Dünya",
    date: "3 Eylül 2026",
    time: "16:26",
    source: "GÜNORA",
    image: "/images/news/almanya.jpg",
    featured: false
  },

  {
    id: 24,
    title: "İran'dan uluslararası başvuru",
    summary: "İran Kızılayı, Hürmüzgan'daki bir düğün evine yönelik saldırıyla ilgili konuyu Uluslararası Ceza Mahkemesi Savcılığına taşıdı.",
    category: "Dünya",
    date: "3 Eylül 2026",
    time: "16:10",
    source: "GÜNORA",
    image: "/images/news/iran.jpg",
    featured: false
  },

  {
    id: 25,
    title: "ABD ve Sri Lanka'dan ortak operasyon",
    summary: "ABD ve Sri Lanka makamlarının Pakistan merkezli olduğu belirtilen bir uyuşturucu şebekesine yönelik operasyon gerçekleştirdiği bildirildi.",
    category: "Dünya",
    date: "3 Eylül 2026",
    time: "14:45",
    source: "GÜNORA",
    image: "/images/news/abd-srilanka.jpg",
    featured: false
  },

  {
    id: 26,
    title: "Hafta sonu hava durumu belli oluyor",
    summary: "Türkiye genelinde hafta sonu sıcak hava etkisini sürdürürken bazı bölgelerde yerel sağanak yağış bekleniyor.",
    category: "Yaşam",
    date: "3 Eylül 2026",
    time: "16:53",
    source: "GÜNORA",
    image: "/images/news/hava-durumu.jpg",
    featured: true
  },

  {
    id: 27,
    title: "Kişisel verileri koruyamayan şirkete ceza",
    summary: "Kişisel verilerin korunmasına ilişkin yükümlülükleri yerine getirmeyen bir şirkete 1 milyon lira idari para cezası uygulandı.",
    category: "Teknoloji",
    date: "3 Eylül 2026",
    time: "11:11",
    source: "GÜNORA",
    image: "/images/news/kisisel-veri.jpg",
    featured: false
  },

  {
    id: 28,
    title: "Meyve suyu sektöründe yeni dönem",
    summary: "Meyve suyu ürünlerinde tatlandırıcı kullanımına ilişkin yeni düzenleme taslağı gündeme geldi.",
    category: "Yaşam",
    date: "3 Eylül 2026",
    time: "14:00",
    source: "GÜNORA",
    image: "/images/news/meyve-suyu.jpg",
    featured: false
  },

  {
    id: 29,
    title: "Eylül ayında gündem yoğun",
    summary: "Yeni ayla birlikte ekonomi, eğitim, spor ve siyasette vatandaşların yakından takip edeceği birçok gelişme gündemde.",
    category: "Gündem",
    date: "3 Eylül 2026",
    time: "09:30",
    source: "GÜNORA",
    image: "/images/news/eylul-gundemi.jpg",
    featured: false
  },

  {
    id: 30,
    title: "Türkiye'nin gündeminde yoğun gün",
    summary: "Türkiye'de bugün ekonomi, spor ve gündem başlıkları öne çıkarken yeni gelişmeler yakından takip ediliyor.",
    category: "Gündem",
    date: "3 Eylül 2026",
    time: "17:00",
    source: "GÜNORA",
    image: "/images/news/gunun-ozeti.jpg",
    featured: false
  }
];
      </div>

    </div>

  </main>

  <!-- FOOTER -->

  <footer class="site-footer">

    <div class="container">

      <div class="footer-main">

        <div class="footer-brand">

          <a
            href="index.html"
            class="footer-logo"
          >
            GÜNORA
          </a>

          <p>
            Gündemin Yeni Sesi.
            Türkiye ve dünyadan gelişmeleri
            hızlı, sade ve anlaşılır şekilde takip edin.
          </p>

        </div>

        <div class="footer-column">

          <h4>Kategoriler</h4>

          <a href="gundem.html">
            Gündem
          </a>

          <a href="spor.html">
            Spor
          </a>

          <a href="ekonomi.html">
            Ekonomi
          </a>

          <a href="dunya.html">
            Dünya
          </a>

          <a href="teknoloji.html">
            Teknoloji
          </a>

        </div>

        <div class="footer-column">

          <h4>GÜNORA</h4>

          <a href="hakkimizda.html">
            Hakkımızda
          </a>

          <a href="iletisim.html">
            İletişim
          </a>

          <a href="gizlilik.html">
            Gizlilik
          </a>

          <a href="kullanim-sartlari.html">
            Kullanım Şartları
          </a>

        </div>

      </div>

      <div class="footer-bottom">

        <span>
          ©
          <span id="footerYear"></span>
          GÜNORA
        </span>

        <span>
          Gündemin Yeni Sesi
        </span>

      </div>

    </div>

  </footer>

  <!-- NEWS DATA -->
  <script src="data/news.js"></script>

  <script>

    "use strict";

    const NEWS =
      Array.isArray(window.GUNORA_NEWS)
        ? window.GUNORA_NEWS
        : [];

    const params =
      new URLSearchParams(
        window.location.search
      );

    const slug =
      params.get("slug");

    const container =
      document.getElementById(
        "articleContainer"
      );

    const escapeHTML = (value) => {

      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    };

    const formatDate = (dateString) => {

      const date =
        new Date(dateString);

      if (Number.isNaN(date.getTime())) {
        return "";
      }

      return new Intl.DateTimeFormat(
        "tr-TR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
      ).format(date);

    };

    const getArticleUrl = (news) => {

      return "haber.html?slug=" +
        encodeURIComponent(
          news.slug || ""
        );

    };

    const getImage = (news) => {

      return news.image || "";

    };

    const currentArticle =
      NEWS.find(
        news =>
          news.slug === slug
      );

    /* ================= SAAT ================= */

    const updateClock = () => {

      const now =
        new Date();

      document.getElementById(
        "currentTime"
      ).textContent =
        now.toLocaleTimeString(
          "tr-TR",
          {
            hour: "2-digit",
            minute: "2-digit"
          }
        );

      document.getElementById(
        "todayDate"
      ).textContent =
        now.toLocaleDateString(
          "tr-TR",
          {
            day: "numeric",
            month: "long",
            year: "numeric"
          }
        );

    };

    updateClock();

    setInterval(
      updateClock,
      1000
    );

    document.getElementById(
      "footerYear"
    ).textContent =
      new Date().getFullYear();

    /* ================= HATA ================= */

    if (!currentArticle) {

      document.title =
        "Haber bulunamadı | GÜNORA";

      container.innerHTML = `

        <div class="article-main">

          <div class="article-breadcrumb">

            <a href="index.html">
              Ana Sayfa
            </a>

            <span>›</span>

            <span>Haber bulunamadı</span>

          </div>

          <h1 class="article-title">
            Haber bulunamadı
          </h1>

          <p class="article-summary">
            Aradığınız haber mevcut değil,
            kaldırılmış olabilir veya bağlantı
            hatalı olabilir.
          </p>

          <br>

          <a
            href="index.html"
            class="newsletter-btn"
          >
            Ana sayfaya dön →
          </a>

        </div>

      `;

    }

    /* ================= HABER ================= */

    if (currentArticle) {

      document.title =
        `${currentArticle.title} | GÜNORA`;

      document.getElementById(
        "metaDescription"
      ).setAttribute(
        "content",
        currentArticle.summary || ""
      );

      const image =
        getImage(currentArticle);

      const coverHTML = image

        ? `
          <img
            class="article-cover"
            src="${escapeHTML(image)}"
            alt="${escapeHTML(currentArticle.title)}"
          >
        `

        : `
          <div
            class="article-cover image-placeholder"
            style="height:420px;"
          >
            <span>GÜNORA</span>
          </div>
        `;

      container.innerHTML = `

        <article class="article-main">

          <div class="article-breadcrumb">

            <a href="index.html">
              Ana Sayfa
            </a>

            <span>›</span>

            <a
              href="${escapeHTML(
                currentArticle.category === "Gündem"
                  ? "gundem.html"
                  : currentArticle.category === "Spor"
                    ? "spor.html"
                    : currentArticle.category === "Ekonomi"
                      ? "ekonomi.html"
                      : currentArticle.category === "Dünya"
                        ? "dunya.html"
                        : "teknoloji.html"
              )}"
            >
              ${escapeHTML(
                currentArticle.category
              )}
            </a>

            <span>›</span>

            <span>Haber</span>

          </div>

          <div class="article-category">

            ${escapeHTML(
              currentArticle.category
            )}

          </div>

          <h1 class="article-title">

            ${escapeHTML(
              currentArticle.title
            )}

          </h1>

          <p class="article-summary">

            ${escapeHTML(
              currentArticle.summary
            )}

          </p>

          <div class="article-meta">

            <span>
              ${escapeHTML(
                currentArticle.author ||
                "GÜNORA"
              )}
            </span>

            <span>•</span>

            <span>
              ${escapeHTML(
                currentArticle.source ||
                "GÜNORA"
              )}
            </span>

            <span>•</span>

            <time>
              ${formatDate(
                currentArticle.created_at
              )}
            </time>

          </div>

          ${coverHTML}

          <div class="article-content">

            ${
              currentArticle.content ||
              "<p>Haber içeriği bulunamadı.</p>"
            }

          </div>

          <div class="article-share">

            <div class="article-share-title">
              Haberi paylaş
            </div>

            <div class="share-buttons">

              <button
                class="share-button"
                id="copyLink"
                type="button"
              >
                🔗 Linki Kopyala
              </button>

              <button
                class="share-button"
                id="nativeShare"
                type="button"
              >
                ↗ Paylaş
              </button>

            </div>

          </div>

        </article>

        <aside class="sidebar">

          <div class="sidebar-box">

            <div class="sidebar-title">

              <span class="red-line"></span>

              Son Haberler

            </div>

            <div class="popular-list">

              ${
                NEWS
                  .filter(
                    news =>
                      news.slug !==
                      currentArticle.slug
                  )
                  .slice(0, 6)
                  .map(news => {

                    return `

                      <a
                        href="${getArticleUrl(news)}"
                        class="popular-item"
                      >

                        <span
                          class="popular-number"
                        >
                          •
                        </span>

                        <span
                          class="popular-content"
                        >

                          <small>
                            ${escapeHTML(
                              news.category
                            )}
                          </small>

                          <strong>
                            ${escapeHTML(
                              news.title
                            )}
                          </strong>

                        </span>

                      </a>

                    `;

                  })
                  .join("")
              }

            </div>

          </div>

          <div class="sidebar-box newsletter-box">

            <span class="section-kicker">
              GÜNORA
            </span>

            <h3>
              Gündemi takip et
            </h3>

            <p>
              Türkiye ve dünyadan gelişmeleri
              GÜNORA ile takip edin.
            </p>

            <a
              href="index.html"
              class="newsletter-btn"
            >
              Ana sayfaya dön →
            </a>

          </div>

        </aside>

      `;

      /* ================= GÖRÜNTÜLENME ================= */

      const viewedKey =
        "gunora-viewed-" +
        currentArticle.id;

      if (!sessionStorage.getItem(viewedKey)) {

        currentArticle.views =
          Number(currentArticle.views || 0) + 1;

        sessionStorage.setItem(
          viewedKey,
          "1"
        );

      }

      /* ================= KOPYALA ================= */

      const copyButton =
        document.getElementById(
          "copyLink"
        );

      if (copyButton) {

        copyButton.addEventListener(
          "click",
          async () => {

            try {

              await navigator.clipboard.writeText(
                window.location.href
              );

              copyButton.textContent =
                "✓ Kopyalandı";

              setTimeout(
                () => {

                  copyButton.textContent =
                    "🔗 Linki Kopyala";

                },
                1800
              );

            } catch {

              alert(
                "Bağlantı kopyalanamadı."
              );

            }

          }
        );

      }

      /* ================= PAYLAŞ ================= */

      const shareButton =
        document.getElementById(
          "nativeShare"
        );

      if (shareButton) {

        shareButton.addEventListener(
          "click",
          async () => {

            if (
              navigator.share
            ) {

              try {

                await navigator.share({

                  title:
                    currentArticle.title,

                  text:
                    currentArticle.summary,

                  url:
                    window.location.href

                });

              } catch {

                // Kullanıcı paylaşımı iptal etti.

              }

            } else {

              try {

                await navigator.clipboard.writeText(
                  window.location.href
                );

                shareButton.textContent =
                  "✓ Link kopyalandı";

                setTimeout(
                  () => {

                    shareButton.textContent =
                      "↗ Paylaş";

                  },
                  1800
                );

              } catch {

                alert(
                  "Paylaşım desteklenmiyor."
                );

              }

            }

          }
        );

      }

    }

    /* ================= SON DAKİKA ================= */

    const breaking =
      NEWS.filter(
        news => news.breaking
      );

    const breakingElement =
      document.getElementById(
        "breakingNews"
      );

    if (breaking.length) {

      let index = 0;

      const renderBreaking = () => {

        const news =
          breaking[index];

        breakingElement.innerHTML = `

          <a href="${getArticleUrl(news)}">
            ${escapeHTML(news.title)}
          </a>

        `;

      };

      renderBreaking();

      setInterval(
        () => {

          index =
            (index + 1) %
            breaking.length;

          renderBreaking();

        },
        5000
      );

    }

    /* ================= TEMA ================= */

    const themeToggle =
      document.getElementById(
        "themeToggle"
      );

    if (
      localStorage.getItem(
        "gunora-theme"
      ) === "dark"
    ) {

      document.body.classList.add(
        "dark"
      );

      themeToggle.textContent =
        "☀️";

    }

    themeToggle.addEventListener(
      "click",
      () => {

        const dark =
          document.body.classList.toggle(
            "dark"
          );

        localStorage.setItem(
          "gunora-theme",
          dark
            ? "dark"
            : "light"
        );

        themeToggle.textContent =
          dark
            ? "☀️"
            : "🌙";

      }
    );

    /* ================= OKUMA ÇUBUĞU ================= */

    window.addEventListener(
      "scroll",
      () => {

        const height =
          document.documentElement
            .scrollHeight -
          window.innerHeight;

        const progress =
          height > 0
            ? (
                window.scrollY /
                height
              ) * 100
            : 0;

        document.getElementById(
          "readingProgress"
        ).style.width =
          `${progress}%`;

      },
      { passive: true }
    );

  </script>

</body>

</html>
