/* ============================================
   TechPulse — Homepage Scripts
   ============================================ */
(function () {
    'use strict';

    /* ---------- Utilities ---------- */
    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    function formatDate(iso) {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch { return ''; }
    }

    /* ---------- Toast ---------- */
    let toastEl, toastTimer;
    function showToast(msg) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'toast';
            toastEl.setAttribute('role', 'status');
            toastEl.setAttribute('aria-live', 'polite');
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
    }
    window.showToast = showToast;

    /* ---------- Dark Mode ---------- */
    (function darkMode() {
        const root = document.documentElement;
        const btn = $('#darkModeToggle');
        if (!btn) return;
        const KEY = 'tp_theme';
        function apply(t) {
            root.classList.toggle('dark-theme', t === 'dark');
            btn.textContent = t === 'dark' ? '☀️' : '🌙';
            btn.setAttribute('aria-pressed', String(t === 'dark'));
            btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
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

    /* ---------- Scroll Top ---------- */
    (function scrollTop() {
        const btn = $('#scrollTopBtn');
        if (!btn) return;
        function onScroll() { btn.classList.toggle('visible', window.scrollY > 400); }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    })();

    /* ---------- Newsletter ---------- */
    $$('.newsletter-form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const msg = form.querySelector('.newsletter-msg');
            const email = form.querySelector('input[type="email"]');
            if (!email.value) return;
            // Store locally (demo) — integrate with Mailchimp/Buttondown later
            try {
                const subs = JSON.parse(localStorage.getItem('tp_subscribers')) || [];
                if (!subs.includes(email.value)) subs.push(email.value);
                localStorage.setItem('tp_subscribers', JSON.stringify(subs));
            } catch {}
            if (msg) msg.textContent = '✓ Thanks! You are subscribed.';
            form.reset();
            showToast('Subscribed successfully');
        });
    });

    /* ---------- Articles Rendering ----------
       Source of truth = data/articles.json (published, visible to EVERY visitor).
       localStorage ('tp_articles') is only used as a live preview while you are
       editing in admin.html on YOUR OWN browser, on the SAME device, BEFORE you
       export the ZIP. Every real visitor gets data/articles.json. */
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

        // Preview-only override: if this exact browser has unpublished admin
        // edits, show those instead so you can preview before exporting.
        try {
            const local = JSON.parse(localStorage.getItem('tp_articles'));
            if (Array.isArray(local) && local.length) return local;
        } catch {}

        return published;
    }

    function articleCard(a) {
        const url = `article.html?id=${encodeURIComponent(a.id)}`;
        return `
            <article class="article-card">
                <span class="card-category">${esc(a.category || 'Tech')}</span>
                <h3><a href="${url}">${esc(a.title)}</a></h3>
                <p>${esc(a.excerpt || '')}</p>
                <div class="card-meta">
                    <span>📅 ${formatDate(a.date) || '—'}</span>
                    <span>⏱ ${esc(a.readTime || '5 min')}</span>
                </div>
                <a href="${url}" class="read-more">Read More →</a>
            </article>`;
    }

    let allArticles = [];
    let activeCategory = 'All';
    let activeSearch = '';

    function renderFiltered() {
        const container = $('#articles-container');
        if (!container) return;

        let list = allArticles.slice();

        if (activeCategory !== 'All') {
            list = list.filter(a => (a.category || '') === activeCategory);
        }
        if (activeSearch) {
            const q = activeSearch.toLowerCase();
            list = list.filter(a =>
                (a.title || '').toLowerCase().includes(q) ||
                (a.excerpt || '').toLowerCase().includes(q) ||
                (a.content || '').toLowerCase().includes(q)
            );
        }

        if (!list.length) {
            container.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted)">
                    <p style="font-size:2.5rem;margin-bottom:10px">🔍</p>
                    <p style="font-size:1.05rem">No articles match your search.</p>
                </div>`;
            return;
        }
        container.innerHTML = list.map(articleCard).join('');
    }

    function renderFilters() {
        const bar = $('#filters');
        if (!bar) return;
        const cats = ['All', ...new Set(allArticles.map(a => a.category).filter(Boolean))];
        bar.innerHTML = cats.map(c => `
            <button class="filter-chip${c === activeCategory ? ' active' : ''}"
                    data-cat="${esc(c)}" type="button">${esc(c)}</button>
        `).join('');
        bar.querySelectorAll('.filter-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                activeCategory = btn.dataset.cat;
                renderFilters();
                renderFiltered();
            });
        });
    }

    function renderTrending() {
        const list = $('#trendingList');
        if (!list) return;
        if (!allArticles.length) {
            list.innerHTML = '<li style="color:var(--text-muted);font-size:0.9rem">No articles yet</li>';
            return;
        }
        list.innerHTML = allArticles.slice(0, 5).map((a, i) => `
            <li>
                <span class="popular-num">${i + 1}</span>
                <a href="article.html?id=${encodeURIComponent(a.id)}">${esc(a.title)}</a>
            </li>`).join('');
    }

    function renderTags() {
        const wrap = $('#tagList');
        if (!wrap) return;
        const tags = new Set();
        allArticles.forEach(a => {
            if (Array.isArray(a.tags)) a.tags.forEach(t => tags.add(t));
            if (a.category) tags.add(a.category);
        });
        const arr = Array.from(tags).slice(0, 12);
        wrap.innerHTML = arr.map(t =>
            `<button class="tag" type="button" data-tag="${esc(t)}">${esc(t)}</button>`
        ).join('');
        wrap.querySelectorAll('.tag').forEach(btn => {
            btn.addEventListener('click', () => {
                const q = $('#searchInput');
                if (q) { q.value = btn.dataset.tag; activeSearch = btn.dataset.tag; renderFiltered(); }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const container = $('#articles-container');
        if (container) container.innerHTML = '<p class="loading-state">Loading articles...</p>';

        allArticles = (await getArticles()).sort((a, b) => {
            return (b.date || '').localeCompare(a.date || '');
        });

        renderFilters();
        renderFiltered();
        renderTrending();
        renderTags();

        const searchInput = $('#searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', e => {
                activeSearch = e.target.value.trim();
                renderFiltered();
            });
        }
    });

    /* ---------- Service Worker ---------- */
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        });
    }
})();