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

        <!-- HABER BURAYA GELECEK -->

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
