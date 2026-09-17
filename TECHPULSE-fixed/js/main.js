/* =========================================================
   TECHPULSE - MAIN.JS
   ========================================================= */

(() => {
    "use strict";

    /* ---------------------------------------------------------
       GLOBAL DATA
       --------------------------------------------------------- */

    let articles = [];
    let filteredArticles = [];

    /* ---------------------------------------------------------
       DOM READY
       --------------------------------------------------------- */

    document.addEventListener("DOMContentLoaded", async () => {
        initTheme();
        initMobileMenu();
        initSearch();
        initNewsletter();
        initContactForm();

        await loadArticles();
        renderPage();
    });

    /* ---------------------------------------------------------
       LOAD ARTICLES
       --------------------------------------------------------- */

    async function loadArticles() {
        const loadingElements = document.querySelectorAll(
            ".loading, [data-loading]"
        );

        loadingElements.forEach((el) => {
            el.textContent = "Loading...";
        });

        try {
            const response = await fetch("./data/articles.json", {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("articles.json must contain an array");
            }

            articles = data;

            console.log(
                `TechPulse: ${articles.length} article(s) loaded successfully.`
            );

        } catch (error) {
            console.error("TechPulse: unable to load articles:", error);

            articles = [];

            showLoadingError();
        }

        /* -----------------------------------------------------
           LOCAL STORAGE ARTICLES
           ----------------------------------------------------- */

        try {
            const localArticles = JSON.parse(
                localStorage.getItem("tp_articles")
            );

            if (
                Array.isArray(localArticles) &&
                localArticles.length > 0
            ) {
                articles = localArticles;
                console.log(
                    `TechPulse: ${articles.length} local article(s) loaded.`
                );
            }
        } catch (error) {
            console.warn(
                "TechPulse: invalid localStorage articles.",
                error
            );
        }

        filteredArticles = [...articles];
    }

    /* ---------------------------------------------------------
       RENDER PAGE
       --------------------------------------------------------- */

    function renderPage() {
        renderTrending();
        renderArticles();
        renderLatest();
        renderCategories();
    }

    /* ---------------------------------------------------------
       TRENDING
       --------------------------------------------------------- */

    function renderTrending() {
        const containers = document.querySelectorAll(
            "#trending, .trending-grid, [data-trending]"
        );

        if (!containers.length) {
            return;
        }

        containers.forEach((container) => {
            container.innerHTML = "";

            if (!articles.length) {
                container.innerHTML = `
                    <div class="empty-state">
                        <p>No articles available.</p>
                    </div>
                `;
                return;
            }

            const trending = [...articles]
                .sort((a, b) => {
                    const viewsA = Number(a.views || a.reads || 0);
                    const viewsB = Number(b.views || b.reads || 0);

                    return viewsB - viewsA;
                })
                .slice(0, 6);

            trending.forEach((article) => {
                container.appendChild(createArticleCard(article));
            });
        });
    }

    /* ---------------------------------------------------------
       ARTICLES
       --------------------------------------------------------- */

    function renderArticles(list = filteredArticles) {
        const containers = document.querySelectorAll(
            "#articles, .articles-grid, [data-articles]"
        );

        containers.forEach((container) => {
            container.innerHTML = "";

            if (!list.length) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>No articles found</h3>
                        <p>Try another search or category.</p>
                    </div>
                `;
                return;
            }

            list.forEach((article) => {
                container.appendChild(createArticleCard(article));
            });
        });
    }

    /* ---------------------------------------------------------
       LATEST ARTICLES
       --------------------------------------------------------- */

    function renderLatest() {
        const containers = document.querySelectorAll(
            "#latest, .latest-grid, [data-latest]"
        );

        containers.forEach((container) => {
            container.innerHTML = "";

            const latest = [...articles]
                .sort((a, b) => {
                    const dateA = new Date(
                        a.date || a.publishedAt || 0
                    );

                    const dateB = new Date(
                        b.date || b.publishedAt || 0
                    );

                    return dateB - dateA;
                })
                .slice(0, 6);

            latest.forEach((article) => {
                container.appendChild(createArticleCard(article));
            });
        });
    }

    /* ---------------------------------------------------------
       ARTICLE CARD
       --------------------------------------------------------- */

    function createArticleCard(article) {
        const card = document.createElement("article");

        card.className = "article-card";

        const title =
            article.title ||
            article.name ||
            "Untitled article";

        const excerpt =
            article.excerpt ||
            article.description ||
            article.summary ||
            "";

        const category =
            article.category ||
            article.categories ||
            "Technology";

        const image =
            article.image ||
            article.cover ||
            article.thumbnail ||
            "assets/og-default.png";

        const date =
            article.date ||
            article.publishedAt ||
            "";

        const slug =
            article.slug ||
            article.id ||
            "";

        const url =
            article.url ||
            `article.html${slug ? "?slug=" + encodeURIComponent(slug) : ""}`;

        card.innerHTML = `
            <a
                href="${escapeHTML(url)}"
                class="article-card-link"
                aria-label="${escapeHTML(title)}"
            >
                <div class="article-image-wrapper">
                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(title)}"
                        class="article-image"
                        loading="lazy"
                        onerror="this.src='assets/og-default.png'"
                    >
                </div>

                <div class="article-card-content">

                    <span class="article-category">
                        ${escapeHTML(category)}
                    </span>

                    <h3 class="article-title">
                        ${escapeHTML(title)}
                    </h3>

                    ${
                        excerpt
                            ? `
                            <p class="article-excerpt">
                                ${escapeHTML(excerpt)}
                            </p>
                            `
                            : ""
                    }

                    ${
                        date
                            ? `
                            <time class="article-date">
                                ${formatDate(date)}
                            </time>
                            `
                            : ""
                    }

                </div>
            </a>
        `;

        return card;
    }

    /* ---------------------------------------------------------
       CATEGORIES
       --------------------------------------------------------- */

    function renderCategories() {
        const containers = document.querySelectorAll(
            "#categories, .categories, [data-categories]"
        );

        if (!containers.length) {
            return;
        }

        const categories = [
            ...new Set(
                articles
                    .map((article) => article.category)
                    .filter(Boolean)
            )
        ];

        containers.forEach((container) => {
            container.innerHTML = "";

            categories.forEach((category) => {
                const button = document.createElement("button");

                button.className = "category-button";
                button.textContent = category;

                button.addEventListener("click", () => {
                    filterByCategory(category);
                });

                container.appendChild(button);
            });
        });
    }

    /* ---------------------------------------------------------
       CATEGORY FILTER
       --------------------------------------------------------- */

    function filterByCategory(category) {
        filteredArticles = articles.filter(
            (article) =>
                String(article.category || "").toLowerCase() ===
                String(category).toLowerCase()
        );

        renderArticles(filteredArticles);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    /* ---------------------------------------------------------
       SEARCH
       --------------------------------------------------------- */

    function initSearch() {
        const searchInputs = document.querySelectorAll(
            "#search, .search-input, [data-search]"
        );

        searchInputs.forEach((input) => {
            input.addEventListener("input", () => {
                const query = input.value
                    .trim()
                    .toLowerCase();

                if (!query) {
                    filteredArticles = [...articles];
                    renderArticles();
                    return;
                }

                filteredArticles = articles.filter((article) => {
                    const searchableText = [
                        article.title,
                        article.excerpt,
                        article.description,
                        article.category,
                        article.content,
                        article.author
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    return searchableText.includes(query);
                });

                renderArticles(filteredArticles);
            });
        });
    }

    /* ---------------------------------------------------------
       MOBILE MENU
       --------------------------------------------------------- */

    function initMobileMenu() {
        const buttons = document.querySelectorAll(
            ".menu-toggle, #menu-toggle, [data-menu-toggle]"
        );

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                document.body.classList.toggle("menu-open");

                const menu = document.querySelector(
                    ".mobile-menu, .nav-menu, nav"
                );

                if (menu) {
                    menu.classList.toggle("open");
                }
            });
        });
    }

    /* ---------------------------------------------------------
       DARK MODE
       --------------------------------------------------------- */

    function initTheme() {
        const themeButtons = document.querySelectorAll(
            "#theme-toggle, .theme-toggle, [data-theme-toggle]"
        );

        const savedTheme = localStorage.getItem("tp_theme");

        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            document.body.classList.add("dark");
        }

        themeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const dark =
                    document.documentElement.classList.toggle("dark");

                document.body.classList.toggle("dark", dark);

                localStorage.setItem(
                    "tp_theme",
                    dark ? "dark" : "light"
                );
            });
        });
    }

    /* ---------------------------------------------------------
       NEWSLETTER
       --------------------------------------------------------- */

    function initNewsletter() {
        const forms = document.querySelectorAll(
            "#newsletter-form, .newsletter-form, [data-newsletter]"
        );

        forms.forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();

                const emailInput = form.querySelector(
                    'input[type="email"]'
                );

                if (!emailInput) {
                    return;
                }

                const email = emailInput.value.trim();

                if (!email || !isValidEmail(email)) {
                    showMessage(
                        form,
                        "Please enter a valid email address.",
                        "error"
                    );
                    return;
                }

                let subscribers = [];

                try {
                    subscribers = JSON.parse(
                        localStorage.getItem(
                            "tp_subscribers"
                        )
                    ) || [];
                } catch {
                    subscribers = [];
                }

                if (!subscribers.includes(email)) {
                    subscribers.push(email);

                    localStorage.setItem(
                        "tp_subscribers",
                        JSON.stringify(subscribers)
                    );
                }

                emailInput.value = "";

                showMessage(
                    form,
                    "Thank you! You are subscribed.",
                    "success"
                );
            });
        });
    }

    /* ---------------------------------------------------------
       CONTACT FORM
       --------------------------------------------------------- */

    function initContactForm() {
        const forms = document.querySelectorAll(
            "#contact-form, .contact-form"
        );

        forms.forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();

                showMessage(
                    form,
                    "Your message has been received.",
                    "success"
                );

                form.reset();
            });
        });
    }

    /* ---------------------------------------------------------
       ERROR
       --------------------------------------------------------- */

    function showLoadingError() {
        const containers = document.querySelectorAll(
            "#trending, .trending-grid, [data-trending]"
        );

        containers.forEach((container) => {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Unable to load articles</h3>
                    <p>
                        Please refresh the page and try again.
                    </p>
                </div>
            `;
        });
    }

    /* ---------------------------------------------------------
       MESSAGE
       --------------------------------------------------------- */

    function showMessage(form, message, type) {
        let messageElement =
            form.querySelector(".form-message");

        if (!messageElement) {
            messageElement = document.createElement("div");
            messageElement.className = "form-message";

            form.appendChild(messageElement);
        }

        messageElement.textContent = message;
        messageElement.className =
            `form-message ${type}`;
    }

    /* ---------------------------------------------------------
       DATE FORMAT
       --------------------------------------------------------- */

    function formatDate(date) {
        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return String(date);
        }

        return parsedDate.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );
    }

    /* ---------------------------------------------------------
       EMAIL VALIDATION
       --------------------------------------------------------- */

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* ---------------------------------------------------------
       HTML ESCAPE
       --------------------------------------------------------- */

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

})();
