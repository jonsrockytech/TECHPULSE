/* ==========================================================================
   TechPulse — Shared Utilities (common.js)
   Loaded on every page BEFORE i18n.js / main.js / article.js.
   Centralizes logic that used to be duplicated (or missing) across pages:
   escaping, dates, article loading, views, likes, bookmarks, admin gate.
   ========================================================================== */
window.TPCommon = (function () {
  'use strict';

  const LOCALE_MAP = { en: 'en-US', zh: 'zh-CN', es: 'es-ES', hi: 'hi-IN', fr: 'fr-FR', ar: 'ar-DZ' };

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function slugify(str) {
    return String(str).toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function formatDate(iso, lang) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(LOCALE_MAP[lang] || 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return ''; }
  }

  function calcReadMinutes(text) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }

  /* ---------- Multi-language article fields ----------
     title/excerpt/content may be either a plain string (legacy / not yet
     translated) or an object like {en:"...", ar:"..."}. pickLocalized()
     resolves either shape to a single string for the active language,
     falling back to English, then to whatever language IS available. */
  function pickLocalized(field, lang) {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
      if (field[lang]) return field[lang];
      if (field.en) return field.en;
      const first = Object.values(field).find(Boolean);
      return first || '';
    }
    return String(field);
  }

  function localizeArticle(article, lang) {
    return Object.assign({}, article, {
      title: pickLocalized(article.title, lang),
      excerpt: pickLocalized(article.excerpt, lang),
      content: pickLocalized(article.content, lang)
    });
  }

  /* ---------- Article data ----------
     data/articles.json is the published source every visitor sees.
     A local admin preview (saved by admin.html into localStorage) overrides
     it in the browser that made the edit, so the author can proof changes
     before exporting/publishing the ZIP. */
  let cache = null;
  async function getArticles(force) {
    if (cache && !force) return cache;
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
      if (Array.isArray(local) && local.length) { cache = local; return local; }
    } catch { /* ignore malformed local override */ }
    cache = published;
    return published;
  }

  /* ---------- View counts ----------
     Static site, no backend: counts live in the visitor's own browser
     (same rule already stated in the Privacy Policy for locally stored data).
     A real count, starting at 0 — no randomly-seeded fake numbers — and
     de-duplicated per browser tab session so refreshing doesn't inflate it. */
  function getViews(id) {
    return parseInt(localStorage.getItem('tp_views_' + id) || '0', 10);
  }
  function registerView(id) {
    const seenKey = 'tp_seen_' + id;
    if (sessionStorage.getItem(seenKey)) return getViews(id);
    sessionStorage.setItem(seenKey, '1');
    const v = getViews(id) + 1;
    localStorage.setItem('tp_views_' + id, String(v));
    return v;
  }

  /* ---------- Likes (reader interaction) ---------- */
  function readLikeMap() {
    try { return JSON.parse(localStorage.getItem('tp_likes') || '{}'); } catch { return {}; }
  }
  function readLikedIds() {
    try { return JSON.parse(localStorage.getItem('tp_liked') || '[]'); } catch { return []; }
  }
  function getLikeCount(id) { return readLikeMap()[id] || 0; }
  function hasLiked(id) { return readLikedIds().includes(id); }
  function toggleLike(id) {
    const map = readLikeMap();
    let liked = readLikedIds();
    const already = liked.includes(id);
    if (already) {
      liked = liked.filter(x => x !== id);
      map[id] = Math.max(0, (map[id] || 0) - 1);
    } else {
      liked.push(id);
      map[id] = (map[id] || 0) + 1;
    }
    localStorage.setItem('tp_likes', JSON.stringify(map));
    localStorage.setItem('tp_liked', JSON.stringify(liked));
    return { liked: !already, count: map[id] };
  }

  /* ---------- Bookmarks ---------- */
  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem('tp_bookmarks') || '[]'); } catch { return []; }
  }
  function isBookmarked(id) { return getBookmarks().some(b => b.id === id); }
  function toggleBookmark(id, title) {
    let bookmarks = getBookmarks();
    if (isBookmarked(id)) {
      bookmarks = bookmarks.filter(b => b.id !== id);
    } else {
      bookmarks.push({ id, title });
    }
    localStorage.setItem('tp_bookmarks', JSON.stringify(bookmarks));
    return bookmarks;
  }

  /* ---------- Toast (shared with admin.js) ---------- */
  let toastEl, toastTimer;
  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }
  if (!window.showToast) window.showToast = showToast;

  /* ---------- Dark mode (shared across every page) ----------
     Applied to <html>, matching the CSS (`html.dark-theme { ... }`),
     persisted, and defaults to the OS preference on first visit. */
  function initDarkMode() {
    const root = document.documentElement;
    const btn = document.getElementById('darkModeToggle');
    const KEY = 'tp_theme';
    function apply(t) {
      root.classList.toggle('dark-theme', t === 'dark');
      if (btn) {
        btn.textContent = t === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      }
    }
    const saved = localStorage.getItem(KEY);
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(saved || (systemDark ? 'dark' : 'light'));
    if (btn) {
      btn.addEventListener('click', () => {
        const next = root.classList.contains('dark-theme') ? 'light' : 'dark';
        localStorage.setItem(KEY, next);
        apply(next);
      });
    }
  }

  /* ---------- Admin access gate ----------
     The "Admin" link is hidden from every visitor by default on every page.
     Ctrl+Shift+A reveals a PIN prompt; on success the link is shown for the
     rest of the browser session and the visitor is sent to admin.html,
     which enforces its own, separate SHA-256 password check regardless of
     how it was reached. This PIN only avoids advertising the panel in the
     nav — it is not a replacement for that real password gate. */
  const ADMIN_PIN = '123456';
  function ensureAdminModal() {
    if (document.getElementById('adminModal')) return;
    const wrap = document.createElement('div');
    wrap.className = 'admin-modal-overlay';
    wrap.id = 'adminModal';
    wrap.innerHTML = `
      <div class="admin-modal-card">
        <h3>Admin Access</h3>
        <input type="password" id="adminPassInput" placeholder="Enter Security PIN..." autocomplete="off">
        <button type="button" id="adminPassSubmit">Login</button>
      </div>`;
    document.body.appendChild(wrap);
  }
  function initAdminGate() {
    const adminBtn = document.getElementById('adminBtn');
    ensureAdminModal();
    const modal = document.getElementById('adminModal');
    const input = document.getElementById('adminPassInput');

    if (adminBtn && sessionStorage.getItem('tp_admin_authenticated') === 'true') {
      adminBtn.style.display = 'inline-block';
    }

    function verify() {
      if (input.value.trim() === ADMIN_PIN) {
        sessionStorage.setItem('tp_admin_authenticated', 'true');
        if (adminBtn) adminBtn.style.display = 'inline-block';
        modal.classList.remove('active');
        input.value = '';
        window.location.href = 'admin.html';
      } else {
        alert('Incorrect PIN!');
        input.value = '';
      }
    }

    document.getElementById('adminPassSubmit').addEventListener('click', verify);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify(); });

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        modal.classList.add('active');
        input.focus();
      }
      if (e.key === 'Escape') modal.classList.remove('active');
    });
  }

  /* ---------- News ticker (index/about/contact/article/privacy/terms) ----------
     Pulls from js/live-news.js (real Hacker News tech feed, hourly refresh,
     curated fallback) when available, otherwise falls back to a single
     load of data/news.json so the ticker never breaks. */
  let tickerData = [];
  function initTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    function render() {
      if (!tickerData.length) return;
      const lang = window.TPI18N ? window.TPI18N.getLang() : 'en';
      track.innerHTML = '';
      [...tickerData, ...tickerData].forEach(item => {
        const titleText = (item.title && item.title[lang]) ? item.title[lang] : (item.title.en || item.title);
        const href = item.url && item.url !== '#' ? item.url : '#';
        const span = document.createElement('span');
        span.className = 'ticker-item';
        span.innerHTML = `<a href="${esc(href)}"${href !== '#' ? ' target="_blank" rel="noopener"' : ''}>${esc(titleText)}</a>`;
        track.appendChild(span);
      });
    }
    document.addEventListener('tp:langchange', render);

    if (window.TPLiveNews) {
      window.TPLiveNews.startAutoRefresh(feed => { tickerData = feed; render(); });
    } else {
      fetch('data/news.json').then(r => r.json()).then(json => { tickerData = json; render(); }).catch(() => {});
    }
  }

  /* ---------- Comments & Forum threads (Disqus) ----------
     A static site (no server/database) cannot host comments that every
     visitor can see — only a real hosted service can. Disqus is free and
     needs no backend: create a site at https://disqus.com/admin/create/
     (about 2 minutes) and paste the "shortname" it gives you below. Until
     then, a friendly placeholder is shown instead of a broken widget. */
  const DISQUS_SHORTNAME = ''; // <-- paste your Disqus shortname here (see comments above)

  function disqusUnavailableHTML() {
    const msg = window.TPI18N ? window.TPI18N.t('comments_unavailable') : "Comments aren't set up on this preview yet.";
    return `<p class="comments-unavailable">💬 ${esc(msg)}</p>`;
  }

  function loadDisqusThread(container, { identifier, url, title }) {
    if (!DISQUS_SHORTNAME) {
      container.innerHTML = disqusUnavailableHTML();
      return;
    }
    container.innerHTML = '';
    const threadDiv = document.createElement('div');
    threadDiv.id = 'disqus_thread';
    container.appendChild(threadDiv);

    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier;
          this.page.url = url;
          this.page.title = title;
        }
      });
      return;
    }

    window.disqus_config = function () {
      this.page.identifier = identifier;
      this.page.url = url;
      this.page.title = title;
    };
    const script = document.createElement('script');
    script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', String(+new Date()));
    (document.head || document.body).appendChild(script);
  }

  function hasComments() { return !!DISQUS_SHORTNAME; }

  /* ---------- Category labels (Technology / Petroleum / Gas / Programming) ----------
     The raw `category` field on an article stays a fixed English key so
     filtering/matching never breaks across languages; only the on-screen
     label is translated. */
  const CATEGORY_LABELS = {
    Technology:  { en: 'Technology',  zh: '科技',   es: 'Tecnología',   hi: 'तकनीक',        fr: 'Technologie',   ar: 'التكنولوجيا' },
    Petroleum:   { en: 'Petroleum',   zh: '石油',   es: 'Petróleo',     hi: 'पेट्रोलियम',    fr: 'Pétrole',       ar: 'البترول' },
    Gas:         { en: 'Natural Gas', zh: '天然气', es: 'Gas Natural',  hi: 'प्राकृतिक गैस', fr: 'Gaz Naturel',   ar: 'الغاز الطبيعي' },
    Programming: { en: 'Programming', zh: '编程',   es: 'Programación', hi: 'प्रोग्रामिंग',  fr: 'Programmation', ar: 'البرمجة' }
  };
  function translateCategory(category, lang) {
    const entry = CATEGORY_LABELS[category];
    if (!entry) return category || '';
    return entry[lang] || entry.en;
  }

  return {
    esc, slugify, formatDate, calcReadMinutes,
    pickLocalized, localizeArticle, translateCategory,
    getArticles,
    getViews, registerView,
    getLikeCount, hasLiked, toggleLike,
    getBookmarks, isBookmarked, toggleBookmark,
    showToast, initDarkMode, initAdminGate, initTicker,
    loadDisqusThread, hasComments
  };
})();
