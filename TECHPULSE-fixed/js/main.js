/* ==========================================================================
   TechPulse Global Engine
   - Automatic Multi-page Translation Sync
   - Dynamic News Ticker (data/news.json)
   - Views Counter, Reading Time & Code Copy Button
   - Local Smart Bookmarks System
   ========================================================================== */

// 1. القاموس الموحد لجميع صفحات الموقع
const translations = {
  en: {
    nav_home: "Home", nav_about: "About", nav_contact: "Contact", nav_privacy: "Privacy", nav_terms: "Terms",
    hero_title: "Advanced Embedded Systems & Technical Guides",
    hero_desc: "Explore exclusive hardware tutorials and practical engineering projects.",
    search_ph: "Search articles...", loading: "Loading articles...",
    widget_trending: "🔥 Trending", widget_newsletter: "📬 Newsletter",
    newsletter_desc: "Weekly digest of the best tech articles. No spam.",
    btn_subscribe: "Subscribe", widget_topics: "🏷 Topics",
    widget_bookmarks: "🔖 Saved Articles", no_bookmarks: "No saved articles yet.",
    read_time: "min read", views: "views",
    
    // About
    about_title: "About TechPulse",
    about_desc: "TechPulse is a dedicated engineering platform for embedded systems, microcontrollers, and hardware tutorials.",
    
    // Contact
    contact_title: "Contact Us",
    contact_name_ph: "Your Name",
    contact_msg_ph: "Your Message",
    btn_send: "Send Message",

    // Privacy
    privacy_title: "Privacy Policy",
    privacy_desc: "Your privacy is important to us. TechPulse does not collect personal data without your consent.",

    // Terms
    terms_title: "Terms of Service",
    terms_desc: "By accessing TechPulse, you agree to comply with our technical content usage guidelines."
  },
  zh: {
    nav_home: "首页", nav_about: "关于", nav_contact: "联系", nav_privacy: "隐私", nav_terms: "条款",
    hero_title: "高级嵌入式系统与技术指南",
    hero_desc: "探索独家硬件教程和实用工程项目。",
    search_ph: "搜索文章...", loading: "正在加载文章...",
    widget_trending: "🔥 热门文章", widget_newsletter: "📬 简报",
    newsletter_desc: "每周精选最佳技术文章，无垃圾邮件。",
    btn_subscribe: "订阅", widget_topics: "🏷 主题",
    widget_bookmarks: "🔖 已保存的文章", no_bookmarks: "暂无保存的文章。",
    read_time: "分钟阅读", views: "次阅读",
    about_title: "关于 TechPulse",
    about_desc: "TechPulse 是一个专注于嵌入式系统、微控制器和硬件教程的工程平台。",
    contact_title: "联系我们",
    contact_name_ph: "您的姓名",
    contact_msg_ph: "您的留言",
    btn_send: "发送消息",
    privacy_title: "隐私政策",
    privacy_desc: "您的隐私对我们很重要。TechPulse 未经您的同意不会收集个人数据。",
    terms_title: "服务条款",
    terms_desc: "访问 TechPulse 即表示您同意遵守我们的技术内容使用指南。"
  },
  es: {
    nav_home: "Inicio", nav_about: "Acerca de", nav_contact: "Contacto", nav_privacy: "Privacidad", nav_terms: "Términos",
    hero_title: "Sistemas Embebidos Avanzados y Guías Técnicas",
    hero_desc: "Explore tutoriales de hardware exclusivos y proyectos prácticos de ingeniería.",
    search_ph: "Buscar artículos...", loading: "Cargando artículos...",
    widget_trending: "🔥 Tendencias", widget_newsletter: "📬 Boletín",
    newsletter_desc: "Resumen semanal de los mejores artículos técnicos. Sin spam.",
    btn_subscribe: "Suscribirse", widget_topics: "🏷 Temas",
    widget_bookmarks: "🔖 Artículos Guardados", no_bookmarks: "No hay artículos guardados.",
    read_time: "min de lectura", views: "vistas",
    about_title: "Acerca de TechPulse",
    about_desc: "TechPulse es una plataforma de ingeniería dedicada a sistemas embebidos, microcontroladores y tutoriales de hardware.",
    contact_title: "Contáctenos",
    contact_name_ph: "Su nombre",
    contact_msg_ph: "Su mensaje",
    btn_send: "Enviar mensaje",
    privacy_title: "Política de Privacidad",
    privacy_desc: "Su privacidad es importante para nosotros. TechPulse no recopila datos personales sin su consentimiento.",
    terms_title: "Términos de Servicio",
    terms_desc: "Al acceder a TechPulse, acepta cumplir con nuestras pautas de uso de contenido técnico."
  },
  hi: {
    nav_home: "होम", nav_about: "हमारे बारे में", nav_contact: "संपर्क करें", nav_privacy: "गोपनीयता", nav_terms: "शर्तें",
    hero_title: "उन्नत एम्बेडेड सिस्टम और तकनीकी गाइड",
    hero_desc: "विशेष हार्डवेयर ट्यूटोरियल और व्यावहारिक इंजीनियरिंग परियोजनाओं का अन्वेषण करें।",
    search_ph: "लेख खोजें...", loading: "लेख लोड हो रहे हैं...",
    widget_trending: "🔥 ट्रेंडिंग", widget_newsletter: "📬 न्यूज़लेटर",
    newsletter_desc: "सर्वश्रेष्ठ तकनीकी लेखों का साप्ताहिक डाइजेस्ट। नो स्पैम।",
    btn_subscribe: "सदस्यता लें", widget_topics: "🏷 विषय",
    widget_bookmarks: "🔖 सहेजे गए लेख", no_bookmarks: "अभी तक कोई लेख सहेजा नहीं गया है।",
    read_time: "मिनट पढ़ने का समय", views: "बार देखा गया",
    about_title: "TechPulse के बारे में",
    about_desc: "TechPulse एम्बेडेड सिस्टम, माइक्रोकंट्रोलर और हार्डवेयर ट्यूटोरियल के लिए एक समर्पित इंजीनियरिंग प्लेटफॉर्म है।",
    contact_title: "संपर्क करें",
    contact_name_ph: "आपका नाम",
    contact_msg_ph: "आपका संदेश",
    btn_send: "संदेश भेजें",
    privacy_title: "गोपनीयता नीति",
    privacy_desc: "आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। TechPulse आपकी सहमति के बिना व्यक्तिगत डेटा एकत्र नहीं करता है।",
    terms_title: "सेवा की शर्तें",
    terms_desc: "TechPulse का उपयोग करके, आप हमारे तकनीकी सामग्री उपयोग दिशानिर्देशों का पालन करने के लिए सहमत होते हैं।"
  },
  fr: {
    nav_home: "Accueil", nav_about: "À propos", nav_contact: "Contact", nav_privacy: "Confidentialité", nav_terms: "Conditions",
    hero_title: "Systèmes Embarqués Avancés et Guides Techniques",
    hero_desc: "Explorez des tutoriels matériels exclusifs et des projets d'ingénierie pratiques.",
    search_ph: "Rechercher des articles...", loading: "Chargement des articles...",
    widget_trending: "🔥 Tendances", widget_newsletter: "📬 Infolettre",
    newsletter_desc: "Condensé hebdomadaire des meilleurs articles techniques. Sans spam.",
    btn_subscribe: "S'abonner", widget_topics: "🏷 Sujets",
    widget_bookmarks: "🔖 Articles Sauvegardés", no_bookmarks: "Aucun article sauvegardé.",
    read_time: "min de lecture", views: "vues",
    about_title: "À propos de TechPulse",
    about_desc: "TechPulse est une plateforme d'ingénierie dédiée aux systèmes embarqués, microcontrôleurs et tutoriels matériels.",
    contact_title: "Contactez-nous",
    contact_name_ph: "Votre nom",
    contact_msg_ph: "Votre message",
    btn_send: "Envoyer le message",
    privacy_title: "Politique de Confidentialité",
    privacy_desc: "Votre confidentialité est importante pour nous. TechPulse ne collecte pas de données personnelles sans votre consentement.",
    terms_title: "Conditions d'Utilisation",
    terms_desc: "En accédant à TechPulse, vous acceptez de vous conformer à nos directives d'utilisation du contenu technique."
  }
};

let currentLang = localStorage.getItem("tp_language") || "en";
let cachedNewsData = [];

// 2. التنفيذ الفوري عند فتح أي صفحة
document.addEventListener("DOMContentLoaded", () => {
  initLanguageSystem();
  fetchDynamicNewsTicker();
  initScrollProgress();
  enableCodeCopying();
  initViewsAndReadTime();
  initBookmarkSystem();
  initDarkModeToggle();
});

// 3. نظام الترجمة الشامل لجميع الصفحات
function initLanguageSystem() {
  const selector = document.getElementById("languageSelector");
  
  // تطبيق الترجمة المحفوظة على عناصر الصفحة فوراً
  applyLanguageToAll(currentLang);

  if (selector) {
    selector.value = currentLang;
    selector.addEventListener("change", (e) => {
      currentLang = e.target.value;
      localStorage.setItem("tp_language", currentLang);
      applyLanguageToAll(currentLang);
    });
  }
}

function applyLanguageToAll(lang) {
  const dict = translations[lang] || translations["en"];
  
  // ترجمة النصوص العامة
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerText = dict[key];
  });

  // ترجمة حقول الإدخال Placeholders
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if (dict[key]) el.placeholder = dict[key];
  });

  renderNewsTicker();
  renderBookmarksList();
}

// 4. جلب الأخبار وتطبيق الترجمة
async function fetchDynamicNewsTicker() {
  const track = document.getElementById("tickerTrack");
  if (!track) return;

  try {
    if (cachedNewsData.length === 0) {
      const response = await fetch("data/news.json");
      if (!response.ok) throw new Error("Failed to load news.json");
      cachedNewsData = await response.json();
    }
    renderNewsTicker();
  } catch (err) {
    console.error("News Ticker Fetch Error:", err);
  }
}

function renderNewsTicker() {
  const track = document.getElementById("tickerTrack");
  if (!track || cachedNewsData.length === 0) return;

  track.innerHTML = "";
  [...cachedNewsData, ...cachedNewsData].forEach(item => {
    const titleText = (item.title && item.title[currentLang]) ? item.title[currentLang] : (item.title["en"] || item.title);
    const span = document.createElement("span");
    span.className = "ticker-item";
    span.innerHTML = `<a href="${item.url}">${titleText}</a>`;
    track.appendChild(span);
  });
}

// 5. باقي الخدمات الفرعية (Bookmarks, Views, Dark mode)
function initBookmarkSystem() {
  const articles = document.querySelectorAll(".article-card, article");

  articles.forEach((art, index) => {
    const titleEl = art.querySelector("h2") || art.querySelector("h3");
    if (!titleEl) return;

    const artTitle = titleEl.innerText;
    const artId = art.dataset.id || `art_bm_${index}`;

    if (!titleEl.querySelector('.bookmark-btn')) {
      const btn = document.createElement("button");
      btn.className = "bookmark-btn";
      btn.innerText = isBookmarked(artId) ? "📌" : "🔖";
      titleEl.appendChild(btn);

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleBookmark(artId, artTitle);
        btn.innerText = isBookmarked(artId) ? "📌" : "🔖";
        renderBookmarksList();
      });
    }
  });

  renderBookmarksList();
}

function isBookmarked(id) {
  const bookmarks = JSON.parse(localStorage.getItem("tp_bookmarks") || "[]");
  return bookmarks.some(b => b.id === id);
}

function toggleBookmark(id, title) {
  let bookmarks = JSON.parse(localStorage.getItem("tp_bookmarks") || "[]");
  if (isBookmarked(id)) {
    bookmarks = bookmarks.filter(b => b.id !== id);
  } else {
    bookmarks.push({ id, title });
  }
  localStorage.setItem("tp_bookmarks", JSON.stringify(bookmarks));
}

function renderBookmarksList() {
  const container = document.getElementById("bookmarksList");
  if (!container) return;

  const bookmarks = JSON.parse(localStorage.getItem("tp_bookmarks") || "[]");
  const dict = translations[currentLang] || translations["en"];

  if (bookmarks.length === 0) {
    container.innerHTML = `<li>${dict.no_bookmarks}</li>`;
    return;
  }

  container.innerHTML = bookmarks.map(b => `<li style="margin-bottom:6px;">📌 <a href="#" style="color:var(--text-color,#33b3ae);text-decoration:none;">${b.title}</a></li>`).join("");
}

function initScrollProgress() {
  const bar = document.getElementById("readingProgressBar");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    bar.style.width = scrolled + "%";
  });
}

function initViewsAndReadTime() {
  const articles = document.querySelectorAll(".article-card, article");
  if (!articles.length) return;

  articles.forEach((article, index) => {
    if (article.querySelector('.article-stats')) return;

    const artId = article.dataset.id || `art_${index}`;
    let views = localStorage.getItem(`views_${artId}`) || Math.floor(Math.random() * 500) + 120;
    views = parseInt(views) + 1;
    localStorage.setItem(`views_${artId}`, views);

    const text = article.innerText || "";
    const words = text.trim().split(/\s+/).length;
    const readMin = Math.max(1, Math.ceil(words / 200));

    const metaBox = article.querySelector(".article-meta") || article;
    const statsSpan = document.createElement("div");
    statsSpan.className = "article-stats";
    statsSpan.style.cssText = "font-size:0.8rem; color:var(--text-muted, #94a3b8); margin-top:6px; display:flex; gap:12px;";
    
    const langDict = translations[currentLang] || translations['en'];
    statsSpan.innerHTML = `
      <span>👁️ ${views} ${langDict.views}</span>
      <span>⏱️ ${readMin} ${langDict.read_time}</span>
    `;
    metaBox.appendChild(statsSpan);
  });
}

function enableCodeCopying() {
  document.querySelectorAll("pre").forEach(block => {
    if (block.querySelector('.copy-code-btn')) return;

    const btn = document.createElement("button");
    btn.className = "copy-code-btn";
    btn.innerText = "Copy";
    
    block.appendChild(btn);

    btn.addEventListener("click", () => {
      const code = block.querySelector("code") ? block.querySelector("code").innerText : block.innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.innerText = "Copied!";
        setTimeout(() => btn.innerText = "Copy", 2000);
      });
    });
  });
}

function initDarkModeToggle() {
  const toggleBtn = document.getElementById("darkModeToggle");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    toggleBtn.setAttribute("aria-pressed", isDark);
    toggleBtn.innerText = isDark ? "☀️" : "🌙";
  });
}
