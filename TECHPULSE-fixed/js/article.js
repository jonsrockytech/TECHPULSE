/* ============================================
   TechPulse — Single Article
   ============================================ */
(function () {
    'use strict';

    const $ = (s, c = document) => c.querySelector(s);
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    function formatDate(iso) {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch { return ''; }
    }

    function calcReadTime(text) {
        const words = String(text || '').trim().split(/\s+/).length;
        return Math.max(1, Math.round(words / 200)) + ' min read';
    }

    function getParam(name) {
        return new URLSearchParams(location.search).get(name);
    }

    /* Same rule as main.js: data/articles.json is the published source that every
       visitor sees. localStorage only overrides it as a local admin preview. */
    async function getArticles() {
        let published = [];
        try {
            const res = await fetch('data/articles.json', { cache: 'no-store' });
            if (res.ok) {
                const json = await res.json();
                if (Array.isArray(json)) published = json;
            }
        } catch (err) {
            console.warn('Could not load data/articles.json', err);
        }

        try {
            const local = JSON.parse(localStorage.getItem('tp_articles'));
            if (Array.isArray(local) && local.length) return local;
        } catch {}

        return published;
    }

    function renderNotFound() {
        $('#articleContainer').innerHTML = `
            <div class="not-found">
                <div class="not-found-icon">🔍</div>
                <h1>Article not found</h1>
                <p>The article you're looking for doesn't exist or has been removed.</p>
                <a href="index.html" class="btn-primary">← Back to home</a>
            </div>`;
        document.title = 'Article not found | TechPulse';
    }

    function renderArticle(article, allArticles) {
        document.title = `${article.title} | TechPulse`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', article.excerpt || '');

        // OG
        setMeta('og:title', article.title);
        setMeta('og:description', article.excerpt || '');
        setMeta('og:type', 'article');

        // Breadcrumb
        const crumb = $('#breadcrumbTitle');
        if (crumb) crumb.textContent = article.title.length > 40
            ? article.title.slice(0, 40) + '…'
            : article.title;

        const readTime = calcReadTime(article.content);

        // Related
        const related = allArticles
            .filter(a => a.id !== article.id && a.category === article.category)
            .concat(allArticles.filter(a => a.id !== article.id && a.category !== article.category))
            .slice(0, 3);

        const relatedHTML = related.length ? `
            <section class="related-section">
                <h2 class="section-heading">📚 Related Articles</h2>
                <div class="articles-grid">
                    ${related.map(r => `
                        <article class="article-card">
                            <span class="card-category">${esc(r.category || 'Tech')}</span>
                            <h3><a href="article.html?id=${encodeURIComponent(r.id)}">${esc(r.title)}</a></h3>
                            <p>${esc(r.excerpt)}</p>
                            <a href="article.html?id=${encodeURIComponent(r.id)}" class="read-more">Read More →</a>
                        </article>
                    `).join('')}
                </div>
            </section>` : '';

        // Body
        const contentHTML = String(article.content || '')
            .split(/\n\n+/)
            .map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
            .join('');

        const imgHTML = article.image
            ? `<img src="${esc(article.image)}" alt="${esc(article.title)}" class="article-hero-img" loading="eager">`
            : '';

        $('#articleContainer').innerHTML = `
            <article class="single-article">
                <header class="article-header">
                    <span class="article-category">${esc(article.category || 'Tech')}</span>
                    <h1>${esc(article.title)}</h1>
                    <div class="article-meta">
                        <span>👤 ${esc(article.author || 'TechPulse Team')}</span>
                        <span>📅 ${formatDate(article.date) || formatDate(new Date().toISOString())}</span>
                        <span>⏱ ${readTime}</span>
                    </div>
                </header>

                ${imgHTML}

                <div class="article-excerpt"><p>${esc(article.excerpt)}</p></div>

                <div class="article-content">${contentHTML}</div>

                <div class="share-buttons">
                    <span class="share-label">Share:</span>
                    <button class="share-btn" data-share="twitter" type="button">𝕏 Twitter</button>
                    <button class="share-btn" data-share="facebook" type="button">Facebook</button>
                    <button class="share-btn" data-share="linkedin" type="button">LinkedIn</button>
                    <button class="share-btn" data-share="whatsapp" type="button">WhatsApp</button>
                    <button class="share-btn" data-share="copy" type="button">🔗 Copy Link</button>
                </div>

                <div class="back-row">
                    <a href="index.html" class="btn-secondary">← Back to all articles</a>
                </div>
            </article>
            ${relatedHTML}
        `;

        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.share;
                const url = encodeURIComponent(location.href);
                const title = encodeURIComponent(article.title);

                if (type === 'copy') {
                    navigator.clipboard?.writeText(location.href).then(() => {
                        btn.textContent = '✓ Copied!';
                        setTimeout(() => btn.textContent = '🔗 Copy Link', 1800);
                    });
                    return;
                }
                const map = {
                    twitter:  `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                    whatsapp: `https://wa.me/?text=${title}%20${url}`
                };
                if (map[type]) window.open(map[type], '_blank', 'noopener,noreferrer,width=600,height=500');
            });
        });
    }

    function setMeta(property, content) {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute('property', property);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content || '');
    }

    /* JSON-LD structured data so Google can show this as a rich "Article" result */
    function injectStructuredData(article) {
        const old = document.getElementById('article-jsonld');
        if (old) old.remove();

        const data = {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: article.title,
            description: article.excerpt || '',
            datePublished: article.date || '',
            author: { '@type': 'Person', name: article.author || 'TechPulse Team' },
            image: article.image ? [new URL(article.image, location.href).href] : undefined,
            mainEntityOfPage: location.href
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'article-jsonld';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    /* ---------- Reading Progress + Scroll Top ---------- */
    (function readingProgress() {
        const bar = $('#readingProgress');
        const top = $('#scrollTopBtn');
        function onScroll() {
            if (bar) {
                const h = document.documentElement;
                const p = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
                bar.style.width = Math.min(100, p) + '%';
            }
            if (top) top.classList.toggle('visible', window.scrollY > 400);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        if (top) top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    })();

    /* ---------- Dark mode (reuse pattern) ---------- */
    (function darkMode() {
        const root = document.documentElement;
        const btn = $('#darkModeToggle');
        if (!btn) return;
        const KEY = 'tp_theme';
        function apply(t) {
            root.classList.toggle('dark-theme', t === 'dark');
            btn.textContent = t === 'dark' ? '☀️' : '🌙';
        }
        const saved = localStorage.getItem(KEY);
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        apply(saved || (systemDark ? 'dark' : 'light'));
        btn.addEventListener('click', () => {
            const next = root.classList.contains('dark-theme') ? 'light' : 'dark';
            localStorage.setItem(KEY, next);
            apply(next);
        });
    })();

    document.addEventListener('DOMContentLoaded', async () => {
        const id = getParam('id') || getParam('slug');
        if (!id) { renderNotFound(); return; }

        const articles = await getArticles();
        const article = articles.find(a => a.id === id);
        if (!article) { renderNotFound(); return; }
        renderArticle(article, articles);
        injectStructuredData(article);
    });
})();