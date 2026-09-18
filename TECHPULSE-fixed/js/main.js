/* ==========================================================================
   TechPulse Global Engine
   ========================================================================== */

// 1. Translations Dictionary (English, Chinese, Spanish, Hindi, French)
const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_contact: "Contact",
    nav_privacy: "Privacy",
    nav_terms: "Terms",
    hero_title: "Advanced Embedded Systems & Technical Guides",
    hero_desc: "Explore exclusive hardware tutorials and practical engineering projects.",
    search_ph: "Search articles...",
    loading: "Loading articles...",
    widget_trending: "🔥 Trending",
    widget_newsletter: "📬 Newsletter",
    newsletter_desc: "Weekly digest of the best tech articles. No spam.",
    btn_subscribe: "Subscribe",
    widget_topics: "🏷 Topics",
    read_time: "min read",
    views: "views"
  },
  zh: {
    nav_home: "首页",
    nav_about: "关于",
    nav_contact: "联系",
    nav_privacy: "隐私",
    nav_terms: "条款",
    hero_title: "高级嵌入式系统与技术指南",
    hero_desc: "探索独家硬件教程和实用工程项目。",
    search_ph: "搜索文章...",
    loading: "正在加载文章...",
    widget_trending: "🔥 热门文章",
    widget_newsletter: "📬 简报",
    newsletter_desc: "每周精选最佳技术文章，无垃圾邮件。",
    btn_subscribe: "订阅",
    widget_topics: "🏷 主题",
    read_time: "分钟阅读",
    views: "次阅读"
  },
  es: {
    nav_home: "Inicio",
    nav_about: "Acerca de",
    nav_contact: "Contacto",
    nav_privacy: "Privacidad",
    nav_terms: "Términos",
    hero_title: "Sistemas Embebidos Avanzados y Guías Técnicas",
    hero_desc: "Explore tutoriales de hardware exclusivos y proyectos prácticos de ingeniería.",
    search_ph: "Buscar artículos...",
    loading: "Cargando artículos...",
    widget_trending: "🔥 Tendencias",
    widget_newsletter: "📬 Boletín",
    newsletter_desc: "Resumen semanal de los mejores artículos técnicos. Sin spam.",
    btn_subscribe: "Suscribirse",
    widget_topics: "🏷 Temas",
    read_time: "min de lectura",
    views: "vistas"
  },
  hi: {
    nav_home: "होम",
    nav_about: "हमारे बारे में",
    nav_contact: "संपर्क करें",
    nav_privacy: "गोपनीयता",
    nav_terms: "शर्तें",
    hero_title: "उन्नत एम्बेडेड सिस्टम और तकनीकी गाइड",
    hero_desc: "विशेष हार्डवेयर ट्यूटोरियल और व्यावहारिक इंजीनियरिंग परियोजनाओं का अन्वेषण करें।",
    search_ph: "लेख खोजें...",
    loading: "लेख लोड हो रहे हैं...",
    widget_trending: "🔥 ट्रेंडिंग",
    widget_newsletter: "📬 न्यूज़लेटर",
    newsletter_desc: "सर्वश्रेष्ठ तकनीकी लेखों का साप्ताहिक डाइजेस्ट। नो स्पैम।",
    btn_subscribe: "सदस्यता लें",
    widget_topics: "🏷 विषय",
    read_time: "मिनट पढ़ने का समय",
    views: "बार देखा गया"
  },
  fr: {
    nav_home: "Accueil",
    nav_about: "À propos",
    nav_contact: "Contact",
    nav_privacy: "Confidentialité",
    nav_terms: "Conditions",
    hero_title: "Systèmes Embarqués Avancés et Guides Techniques",
    hero_desc: "Explorez des tutoriels matériels exclusifs et des projets d'ingénierie pratiques.",
    search_ph: "Rechercher des articles...",
    loading: "Chargement des articles...",
    widget_trending: "🔥 Tendances",
    widget_newsletter: "📬 Infolettre",
    newsletter_desc: "Condensé hebdomadaire des meilleurs articles techniques. Sans spam.",
    btn_subscribe: "S'abonner",
    widget_topics: "🏷 Sujets",
    read_time: "min de lecture",
    views: "vues"
  }
};

// Default Language Initialization
let currentLang = localStorage.getItem("tp_language") || "en";

document.addEventListener("DOMContentLoaded", () => {
  initLanguageSwitcher();
  initNewsTicker();
  initScrollProgress();
  enableCodeCopying();
  initViewsAndReadTime();
  initDarkModeToggle();
});

// 2. Language Switcher Logic
function initLanguageSwitcher() {
  const selector = document.getElementById("languageSelector");
  if (selector) {
    selector.value = currentLang;
    applyLanguage(currentLang);

    selector.addEventListener("change", (e) => {
      currentLang = e.target.value;
      localStorage.setItem("tp_language", currentLang);
      applyLanguage(currentLang);
    });
  }
}

function applyLanguage(lang) {
  const dict = translations[lang] || translations["en"];
  
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerText = dict[key];
  });

  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if (dict[key]) el.placeholder = dict[key];
  });
}

// 3. Dynamic News Ticker Engine
function initNewsTicker() {
  const newsItems = [
    { text: "New RISC-V chips target edge AI workloads", url: "#" },
    { text: "WebGPU lands in all major browsers", url: "#" },
    { text: "Rust 2.0 roadmap officially published", url: "#" },
    { text: "Linux 6.12 brings real-time preemption", url: "#" },
    { text: "ESP32-C6 adds Wi-Fi 6 & 802.15.4 support", url: "#" }
  ];

  const track = document.getElementById("tickerTrack");
  if (!track) return;

  track.innerHTML = "";
  // Repeat array twice for smooth CSS infinite scrolling
  [...newsItems, ...newsItems].forEach(item => {
    const span = document.createElement("span");
    span.className = "ticker-item";
    span.innerHTML = `<a href="${item.url}">${item.text}</a>`;
    track.appendChild(span);
  });
}

// 4. Scroll Reading Progress Bar
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

// 5. Article Views & Reading Time Counter
function initViewsAndReadTime() {
  const articles = document.querySelectorAll(".article-card, article");
  
  articles.forEach((article, index) => {
    const artId = article.dataset.id || `art_${index}`;
    
    // View Counter Logic
    let views = localStorage.getItem(`views_${artId}`) || Math.floor(Math.random() * 500) + 120;
    views = parseInt(views) + 1;
    localStorage.setItem(`views_${artId}`, views);

    // Reading Time Calculation (Average 200 WPM)
    const text = article.innerText || "";
    const words = text.trim().split(/\s+/).length;
    const readMin = Math.max(1, Math.ceil(words / 200));

    // Append Metadata to Card/Article
    const metaBox = article.querySelector(".article-meta") || article;
    const statsSpan = document.createElement("div");
    statsSpan.className = "article-stats";
    statsSpan.style.cssText = "font-size:0.8rem; color:var(--text-muted, #94a3b8); margin-top:6px; display:flex; gap:12px;";
    
    const langDict = translations[currentLang];
    statsSpan.innerHTML = `
      <span>👁️ ${views} ${langDict.views}</span>
      <span>⏱️ ${readMin} ${langDict.read_time}</span>
    `;
    metaBox.appendChild(statsSpan);
  });
}

// 6. Copy Code Button Snippet
function enableCodeCopying() {
  document.querySelectorAll("pre").forEach(block => {
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

// 7. Dark Mode Toggle Helper
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
