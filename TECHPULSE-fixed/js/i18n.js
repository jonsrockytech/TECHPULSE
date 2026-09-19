/* ==========================================================================
   TechPulse — i18n (i18n.js)
   Single translation dictionary shared by every page. Include this file
   BEFORE main.js / article.js. Elements are translated via [data-i18n]
   (text) and [data-i18n-ph] (placeholder). Call TPI18N.apply() again after
   injecting new markup that carries those attributes — a 'tp:langchange'
   event fires on every language switch so other scripts can react.
   ========================================================================== */
window.TPI18N = (function () {
  'use strict';

  const translations = {
    en: {
      nav_home: "Home", nav_about: "About", nav_contact: "Contact", nav_privacy: "Privacy", nav_terms: "Terms",
      hero_title: "Advanced Embedded Systems & Technical Guides",
      hero_desc: "Explore exclusive hardware tutorials and practical engineering projects.",
      search_ph: "Search articles...", loading: "Loading articles...",
      filter_all: "All", no_results: "No articles match your search.",
      widget_trending: "🔥 Trending", widget_newsletter: "📬 Newsletter",
      newsletter_desc: "Weekly digest of the best tech articles. No spam.",
      btn_subscribe: "Subscribe", widget_topics: "🏷 Topics",
      widget_bookmarks: "🔖 Saved Articles", no_bookmarks: "No saved articles yet.",
      read_time: "min read", views: "views", read_more: "Read More",
      newsletter_success: "✓ Thanks for subscribing!", newsletter_error: "✗ Something went wrong. Try again.",

      about_title: "About TechPulse",
      about_desc: "TechPulse is a dedicated engineering platform for embedded systems, microcontrollers, and hardware tutorials.",

      contact_title: "Contact Us",
      contact_intro: "Have questions, feedback, or editorial inquiries? Reach out via the form below or send us an email.",
      contact_name_ph: "Full Name",
      contact_email_ph: "Email",
      contact_msg_ph: "Message",
      btn_send: "Send Message",
      contact_success: "✓ Thanks! Your message has been sent.",
      contact_error: "✗ Something went wrong. Please email us directly instead.",
      contact_email_intro: "Or email us directly at",

      privacy_title: "Privacy Policy",
      privacy_desc: "At TechPulse, one of our main priorities is the privacy of our visitors. This policy describes the types of information collected and how we use it.",
      privacy_log_title: "Log Files",
      privacy_log_desc: "TechPulse follows a standard procedure of using log files. These files log visitors when they visit websites. Information collected includes IP addresses, browser type, ISP, date/time stamp, referring/exit pages, and clicks.",
      privacy_cookies_title: "Cookies",
      privacy_cookies_desc: "Like many websites, TechPulse uses cookies to store visitor preferences and page access history to optimize user experience.",
      privacy_storage_title: "Local Storage",
      privacy_storage_desc: "Our site uses your browser's localStorage to remember your theme, language, bookmarks, and locally viewed article stats. This never leaves your device and can be cleared from your browser settings.",
      privacy_third_title: "Third-Party Policies",
      privacy_third_desc: "TechPulse's Privacy Policy does not apply to other advertisers or websites. Consult the respective policies of third-party services.",
      privacy_consent_title: "Consent",
      privacy_consent_desc: "By using our website, you consent to our Privacy Policy and agree to its terms.",

      terms_title: "Terms of Service",
      terms_desc: "By accessing this website, you accept these terms and conditions in full. Do not continue to use TechPulse if you do not accept all of the terms stated on this page.",
      terms_ip_title: "Intellectual Property Rights",
      terms_ip_desc: "Unless otherwise stated, TechPulse owns the intellectual property rights for all material on this site. You may view or print pages for personal use subject to restrictions set in these terms.",
      terms_content_title: "User Content",
      terms_content_desc: "Any feedback you provide must be respectful, lawful, and free of spam or offensive material. Locally stored content never leaves your device.",
      terms_disclaimer_title: "Disclaimer",
      terms_disclaimer_desc: "The information on TechPulse is for educational and informational purposes only. We make no warranties about the completeness, reliability, or accuracy of this information.",
      terms_changes_title: "Changes",
      terms_changes_desc: "We may update these terms at any time. Continued use of the site constitutes acceptance of the new terms.",

      breadcrumb_articles: "Articles",
      article_loading: "Loading article...",
      not_found_title: "Article not found",
      not_found_desc: "The article you're looking for doesn't exist or has been removed.",
      back_home: "← Back to home",
      back_all: "← Back to all articles",
      share_label: "Share:",
      related_heading: "📚 Related Articles",
      footer_rights: "All rights reserved."
    },
    zh: {
      nav_home: "首页", nav_about: "关于", nav_contact: "联系", nav_privacy: "隐私", nav_terms: "条款",
      hero_title: "高级嵌入式系统与技术指南",
      hero_desc: "探索独家硬件教程和实用工程项目。",
      search_ph: "搜索文章...", loading: "正在加载文章...",
      filter_all: "全部", no_results: "没有符合条件的文章。",
      widget_trending: "🔥 热门文章", widget_newsletter: "📬 简报",
      newsletter_desc: "每周精选最佳技术文章，无垃圾邮件。",
      btn_subscribe: "订阅", widget_topics: "🏷 主题",
      widget_bookmarks: "🔖 已保存的文章", no_bookmarks: "暂无保存的文章。",
      read_time: "分钟阅读", views: "次阅读", read_more: "阅读更多",
      newsletter_success: "✓ 感谢订阅！", newsletter_error: "✗ 出现问题，请重试。",

      about_title: "关于 TechPulse",
      about_desc: "TechPulse 是一个专注于嵌入式系统、微控制器和硬件教程的工程平台。",

      contact_title: "联系我们",
      contact_intro: "有问题、反馈或编辑合作意向？请通过下方表单或电子邮件与我们联系。",
      contact_name_ph: "姓名",
      contact_email_ph: "电子邮箱",
      contact_msg_ph: "留言内容",
      btn_send: "发送消息",
      contact_success: "✓ 感谢！您的消息已发送。",
      contact_error: "✗ 出现问题，请直接给我们发邮件。",
      contact_email_intro: "或直接发送邮件至",

      privacy_title: "隐私政策",
      privacy_desc: "您的隐私对我们至关重要。本政策说明我们收集哪些信息以及如何使用这些信息。",
      privacy_log_title: "日志文件",
      privacy_log_desc: "TechPulse 遵循使用日志文件的标准做法。这些文件会记录访问者的信息，包括 IP 地址、浏览器类型、ISP、日期/时间戳、访问来源/退出页面和点击行为。",
      privacy_cookies_title: "Cookie",
      privacy_cookies_desc: "与许多网站一样，TechPulse 使用 Cookie 来存储访问者的偏好设置和访问历史，以优化用户体验。",
      privacy_storage_title: "本地存储",
      privacy_storage_desc: "本网站使用浏览器的 localStorage 来记住您的主题、语言、收藏文章以及本地浏览统计。这些数据不会离开您的设备，您可以随时在浏览器设置中清除。",
      privacy_third_title: "第三方政策",
      privacy_third_desc: "TechPulse 的隐私政策不适用于其他广告商或网站，请参阅第三方服务各自的政策。",
      privacy_consent_title: "同意",
      privacy_consent_desc: "使用本网站即表示您同意本隐私政策及其条款。",

      terms_title: "服务条款",
      terms_desc: "访问本网站即表示您完全接受这些条款和条件。如果您不接受本页所述的全部条款，请勿继续使用 TechPulse。",
      terms_ip_title: "知识产权",
      terms_ip_desc: "除非另有说明，TechPulse 拥有本网站所有内容的知识产权。您可以在这些条款所设限制范围内查看或打印页面供个人使用。",
      terms_content_title: "用户内容",
      terms_content_desc: "您提供的任何反馈都必须尊重他人、合法，且不含垃圾信息或冒犯性内容。本地存储的内容不会离开您的设备。",
      terms_disclaimer_title: "免责声明",
      terms_disclaimer_desc: "TechPulse 上的信息仅供教育和参考之用。我们不对这些信息的完整性、可靠性或准确性做出任何保证。",
      terms_changes_title: "条款变更",
      terms_changes_desc: "我们可能随时更新这些条款。继续使用本网站即表示您接受新条款。",

      breadcrumb_articles: "文章",
      article_loading: "正在加载文章...",
      not_found_title: "未找到文章",
      not_found_desc: "您要查找的文章不存在或已被删除。",
      back_home: "← 返回首页",
      back_all: "← 返回所有文章",
      share_label: "分享：",
      related_heading: "📚 相关文章",
      footer_rights: "保留所有权利。"
    },
    es: {
      nav_home: "Inicio", nav_about: "Acerca de", nav_contact: "Contacto", nav_privacy: "Privacidad", nav_terms: "Términos",
      hero_title: "Sistemas Embebidos Avanzados y Guías Técnicas",
      hero_desc: "Explore tutoriales de hardware exclusivos y proyectos prácticos de ingeniería.",
      search_ph: "Buscar artículos...", loading: "Cargando artículos...",
      filter_all: "Todos", no_results: "Ningún artículo coincide con tu búsqueda.",
      widget_trending: "🔥 Tendencias", widget_newsletter: "📬 Boletín",
      newsletter_desc: "Resumen semanal de los mejores artículos técnicos. Sin spam.",
      btn_subscribe: "Suscribirse", widget_topics: "🏷 Temas",
      widget_bookmarks: "🔖 Artículos Guardados", no_bookmarks: "No hay artículos guardados.",
      read_time: "min de lectura", views: "vistas", read_more: "Leer Más",
      newsletter_success: "✓ ¡Gracias por suscribirte!", newsletter_error: "✗ Algo salió mal. Inténtalo de nuevo.",

      about_title: "Acerca de TechPulse",
      about_desc: "TechPulse es una plataforma de ingeniería dedicada a sistemas embebidos, microcontroladores y tutoriales de hardware.",

      contact_title: "Contáctenos",
      contact_intro: "¿Tienes preguntas, comentarios o consultas editoriales? Escríbenos usando el formulario o por correo electrónico.",
      contact_name_ph: "Nombre completo",
      contact_email_ph: "Correo electrónico",
      contact_msg_ph: "Mensaje",
      btn_send: "Enviar mensaje",
      contact_success: "✓ ¡Gracias! Tu mensaje ha sido enviado.",
      contact_error: "✗ Algo salió mal. Por favor, escríbenos directamente por correo.",
      contact_email_intro: "O escríbenos directamente a",

      privacy_title: "Política de Privacidad",
      privacy_desc: "En TechPulse, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Esta política describe qué información recopilamos y cómo la usamos.",
      privacy_log_title: "Archivos de Registro",
      privacy_log_desc: "TechPulse sigue el procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes al acceder al sitio: direcciones IP, tipo de navegador, ISP, fecha/hora, páginas de referencia/salida y clics.",
      privacy_cookies_title: "Cookies",
      privacy_cookies_desc: "Como muchos sitios web, TechPulse usa cookies para almacenar las preferencias de los visitantes y el historial de acceso a las páginas, con el fin de mejorar la experiencia de usuario.",
      privacy_storage_title: "Almacenamiento Local",
      privacy_storage_desc: "Nuestro sitio usa el localStorage de tu navegador para recordar tu tema, idioma, artículos guardados y estadísticas de lectura locales. Esto nunca sale de tu dispositivo y puede borrarse desde la configuración del navegador.",
      privacy_third_title: "Políticas de Terceros",
      privacy_third_desc: "La Política de Privacidad de TechPulse no se aplica a otros anunciantes o sitios web. Consulta las políticas de cada servicio de terceros.",
      privacy_consent_title: "Consentimiento",
      privacy_consent_desc: "Al usar nuestro sitio web, aceptas nuestra Política de Privacidad y sus términos.",

      terms_title: "Términos de Servicio",
      terms_desc: "Al acceder a este sitio web, aceptas estos términos y condiciones en su totalidad. No continúes usando TechPulse si no aceptas todos los términos indicados en esta página.",
      terms_ip_title: "Derechos de Propiedad Intelectual",
      terms_ip_desc: "Salvo que se indique lo contrario, TechPulse posee los derechos de propiedad intelectual de todo el material de este sitio. Puedes ver o imprimir páginas para uso personal, sujeto a las restricciones de estos términos.",
      terms_content_title: "Contenido del Usuario",
      terms_content_desc: "Cualquier comentario que envíes debe ser respetuoso, lícito y estar libre de spam o material ofensivo. El contenido almacenado localmente nunca sale de tu dispositivo.",
      terms_disclaimer_title: "Descargo de Responsabilidad",
      terms_disclaimer_desc: "La información en TechPulse tiene fines educativos e informativos únicamente. No garantizamos la integridad, fiabilidad o exactitud de esta información.",
      terms_changes_title: "Cambios",
      terms_changes_desc: "Podemos actualizar estos términos en cualquier momento. El uso continuado del sitio implica la aceptación de los nuevos términos.",

      breadcrumb_articles: "Artículos",
      article_loading: "Cargando artículo...",
      not_found_title: "Artículo no encontrado",
      not_found_desc: "El artículo que buscas no existe o ha sido eliminado.",
      back_home: "← Volver al inicio",
      back_all: "← Volver a todos los artículos",
      share_label: "Compartir:",
      related_heading: "📚 Artículos Relacionados",
      footer_rights: "Todos los derechos reservados."
    },
    hi: {
      nav_home: "होम", nav_about: "हमारे बारे में", nav_contact: "संपर्क करें", nav_privacy: "गोपनीयता", nav_terms: "शर्तें",
      hero_title: "उन्नत एम्बेडेड सिस्टम और तकनीकी गाइड",
      hero_desc: "विशेष हार्डवेयर ट्यूटोरियल और व्यावहारिक इंजीनियरिंग परियोजनाओं का अन्वेषण करें।",
      search_ph: "लेख खोजें...", loading: "लेख लोड हो रहे हैं...",
      filter_all: "सभी", no_results: "आपकी खोज से मेल खाता कोई लेख नहीं मिला।",
      widget_trending: "🔥 ट्रेंडिंग", widget_newsletter: "📬 न्यूज़लेटर",
      newsletter_desc: "सर्वश्रेष्ठ तकनीकी लेखों का साप्ताहिक डाइजेस्ट। नो स्पैम।",
      btn_subscribe: "सदस्यता लें", widget_topics: "🏷 विषय",
      widget_bookmarks: "🔖 सहेजे गए लेख", no_bookmarks: "अभी तक कोई लेख सहेजा नहीं गया है।",
      read_time: "मिनट पढ़ने का समय", views: "बार देखा गया", read_more: "और पढ़ें",
      newsletter_success: "✓ सदस्यता के लिए धन्यवाद!", newsletter_error: "✗ कुछ गड़बड़ हुई। फिर से प्रयास करें।",

      about_title: "TechPulse के बारे में",
      about_desc: "TechPulse एम्बेडेड सिस्टम, माइक्रोकंट्रोलर और हार्डवेयर ट्यूटोरियल के लिए एक समर्पित इंजीनियरिंग प्लेटफॉर्म है।",

      contact_title: "संपर्क करें",
      contact_intro: "कोई प्रश्न, प्रतिक्रिया या संपादकीय पूछताछ है? नीचे दिए गए फ़ॉर्म के माध्यम से या ईमेल द्वारा हमसे संपर्क करें।",
      contact_name_ph: "पूरा नाम",
      contact_email_ph: "ईमेल",
      contact_msg_ph: "संदेश",
      btn_send: "संदेश भेजें",
      contact_success: "✓ धन्यवाद! आपका संदेश भेज दिया गया है।",
      contact_error: "✗ कुछ गड़बड़ हुई। कृपया हमें सीधे ईमेल करें।",
      contact_email_intro: "या हमें सीधे ईमेल करें",

      privacy_title: "गोपनीयता नीति",
      privacy_desc: "TechPulse में, हमारी प्रमुख प्राथमिकताओं में से एक हमारे आगंतुकों की गोपनीयता है। यह नीति बताती है कि हम किस प्रकार की जानकारी एकत्र करते हैं और उसका उपयोग कैसे करते हैं।",
      privacy_log_title: "लॉग फ़ाइलें",
      privacy_log_desc: "TechPulse लॉग फ़ाइलों का उपयोग करने की मानक प्रक्रिया का पालन करता है। इनमें IP पता, ब्राउज़र प्रकार, ISP, दिनांक/समय, संदर्भित/निकास पृष्ठ और क्लिक जैसी जानकारी शामिल होती है।",
      privacy_cookies_title: "कुकीज़",
      privacy_cookies_desc: "कई वेबसाइटों की तरह, TechPulse उपयोगकर्ता अनुभव को बेहतर बनाने के लिए आगंतुकों की प्राथमिकताएँ और पृष्ठ पहुँच इतिहास सहेजने हेतु कुकीज़ का उपयोग करता है।",
      privacy_storage_title: "लोकल स्टोरेज",
      privacy_storage_desc: "हमारी साइट आपकी थीम, भाषा, सहेजे गए लेख और स्थानीय रूप से देखे गए आँकड़ों को याद रखने के लिए आपके ब्राउज़र के localStorage का उपयोग करती है। यह डेटा आपकी डिवाइस से बाहर कभी नहीं जाता और ब्राउज़र सेटिंग्स से मिटाया जा सकता है।",
      privacy_third_title: "तृतीय-पक्ष नीतियाँ",
      privacy_third_desc: "TechPulse की गोपनीयता नीति अन्य विज्ञापनदाताओं या वेबसाइटों पर लागू नहीं होती। कृपया संबंधित तृतीय-पक्ष सेवाओं की नीतियाँ देखें।",
      privacy_consent_title: "सहमति",
      privacy_consent_desc: "हमारी वेबसाइट का उपयोग करके, आप हमारी गोपनीयता नीति और उसकी शर्तों से सहमत होते हैं।",

      terms_title: "सेवा की शर्तें",
      terms_desc: "इस वेबसाइट तक पहुँचकर, आप इन नियमों और शर्तों को पूर्ण रूप से स्वीकार करते हैं। यदि आप इस पृष्ठ पर बताई गई सभी शर्तों को स्वीकार नहीं करते हैं, तो कृपया TechPulse का उपयोग जारी न रखें।",
      terms_ip_title: "बौद्धिक संपदा अधिकार",
      terms_ip_desc: "जब तक अन्यथा न बताया जाए, इस साइट की सभी सामग्री के बौद्धिक संपदा अधिकार TechPulse के पास हैं। आप इन शर्तों में निर्धारित प्रतिबंधों के अधीन व्यक्तिगत उपयोग हेतु पृष्ठ देख या प्रिंट कर सकते हैं।",
      terms_content_title: "उपयोगकर्ता सामग्री",
      terms_content_desc: "आपके द्वारा दी गई कोई भी प्रतिक्रिया सम्मानजनक, कानूनी और स्पैम या आपत्तिजनक सामग्री से मुक्त होनी चाहिए। स्थानीय रूप से संग्रहीत सामग्री आपकी डिवाइस से बाहर कभी नहीं जाती।",
      terms_disclaimer_title: "अस्वीकरण",
      terms_disclaimer_desc: "TechPulse पर दी गई जानकारी केवल शैक्षिक और सूचनात्मक उद्देश्यों के लिए है। हम इस जानकारी की पूर्णता, विश्वसनीयता या सटीकता की कोई गारंटी नहीं देते।",
      terms_changes_title: "परिवर्तन",
      terms_changes_desc: "हम इन शर्तों को किसी भी समय अपडेट कर सकते हैं। साइट का निरंतर उपयोग नई शर्तों की स्वीकृति दर्शाता है।",

      breadcrumb_articles: "लेख",
      article_loading: "लेख लोड हो रहा है...",
      not_found_title: "लेख नहीं मिला",
      not_found_desc: "आप जिस लेख की तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।",
      back_home: "← होम पर वापस जाएं",
      back_all: "← सभी लेखों पर वापस जाएं",
      share_label: "साझा करें:",
      related_heading: "📚 संबंधित लेख",
      footer_rights: "सर्वाधिकार सुरक्षित।"
    },
    fr: {
      nav_home: "Accueil", nav_about: "À propos", nav_contact: "Contact", nav_privacy: "Confidentialité", nav_terms: "Conditions",
      hero_title: "Systèmes Embarqués Avancés et Guides Techniques",
      hero_desc: "Explorez des tutoriels matériels exclusifs et des projets d'ingénierie pratiques.",
      search_ph: "Rechercher des articles...", loading: "Chargement des articles...",
      filter_all: "Tous", no_results: "Aucun article ne correspond à votre recherche.",
      widget_trending: "🔥 Tendances", widget_newsletter: "📬 Infolettre",
      newsletter_desc: "Condensé hebdomadaire des meilleurs articles techniques. Sans spam.",
      btn_subscribe: "S'abonner", widget_topics: "🏷 Sujets",
      widget_bookmarks: "🔖 Articles Sauvegardés", no_bookmarks: "Aucun article sauvegardé.",
      read_time: "min de lecture", views: "vues", read_more: "Lire la suite",
      newsletter_success: "✓ Merci pour votre inscription !", newsletter_error: "✗ Une erreur est survenue. Réessayez.",

      about_title: "À propos de TechPulse",
      about_desc: "TechPulse est une plateforme d'ingénierie dédiée aux systèmes embarqués, microcontrôleurs et tutoriels matériels.",

      contact_title: "Contactez-nous",
      contact_intro: "Des questions, des retours ou une demande éditoriale ? Écrivez-nous via le formulaire ci-dessous ou par e-mail.",
      contact_name_ph: "Nom complet",
      contact_email_ph: "E-mail",
      contact_msg_ph: "Message",
      btn_send: "Envoyer le message",
      contact_success: "✓ Merci ! Votre message a bien été envoyé.",
      contact_error: "✗ Une erreur est survenue. Merci de nous écrire directement par e-mail.",
      contact_email_intro: "Ou écrivez-nous directement à",

      privacy_title: "Politique de Confidentialité",
      privacy_desc: "Chez TechPulse, la confidentialité de nos visiteurs est l'une de nos priorités. Cette politique décrit les types d'informations collectées et leur utilisation.",
      privacy_log_title: "Fichiers Journaux",
      privacy_log_desc: "TechPulse suit une procédure standard d'utilisation des fichiers journaux. Ces fichiers enregistrent les visiteurs : adresse IP, type de navigateur, FAI, date/heure, pages de provenance/sortie et clics.",
      privacy_cookies_title: "Cookies",
      privacy_cookies_desc: "Comme de nombreux sites, TechPulse utilise des cookies pour mémoriser les préférences des visiteurs et l'historique de navigation afin d'améliorer l'expérience utilisateur.",
      privacy_storage_title: "Stockage Local",
      privacy_storage_desc: "Notre site utilise le localStorage de votre navigateur pour mémoriser votre thème, votre langue, vos articles sauvegardés et vos statistiques de lecture locales. Ces données ne quittent jamais votre appareil et peuvent être effacées depuis les paramètres du navigateur.",
      privacy_third_title: "Politiques des Tiers",
      privacy_third_desc: "La politique de confidentialité de TechPulse ne s'applique pas aux autres annonceurs ou sites web. Consultez les politiques respectives des services tiers.",
      privacy_consent_title: "Consentement",
      privacy_consent_desc: "En utilisant notre site, vous consentez à notre politique de confidentialité et en acceptez les termes.",

      terms_title: "Conditions d'Utilisation",
      terms_desc: "En accédant à ce site, vous acceptez pleinement les présentes conditions. Si vous n'acceptez pas l'ensemble des conditions énoncées sur cette page, veuillez ne pas continuer à utiliser TechPulse.",
      terms_ip_title: "Propriété Intellectuelle",
      terms_ip_desc: "Sauf indication contraire, TechPulse détient les droits de propriété intellectuelle sur tout le contenu de ce site. Vous pouvez consulter ou imprimer des pages pour un usage personnel, dans les limites fixées par ces conditions.",
      terms_content_title: "Contenu des Utilisateurs",
      terms_content_desc: "Tout retour que vous fournissez doit être respectueux, licite et exempt de spam ou de contenu offensant. Le contenu stocké localement ne quitte jamais votre appareil.",
      terms_disclaimer_title: "Avertissement",
      terms_disclaimer_desc: "Les informations disponibles sur TechPulse sont fournies à titre éducatif et informatif uniquement. Nous ne garantissons ni leur exhaustivité, ni leur fiabilité, ni leur exactitude.",
      terms_changes_title: "Modifications",
      terms_changes_desc: "Nous pouvons mettre à jour ces conditions à tout moment. La poursuite de l'utilisation du site vaut acceptation des nouvelles conditions.",

      breadcrumb_articles: "Articles",
      article_loading: "Chargement de l'article...",
      not_found_title: "Article introuvable",
      not_found_desc: "L'article que vous recherchez n'existe pas ou a été supprimé.",
      back_home: "← Retour à l'accueil",
      back_all: "← Retour à tous les articles",
      share_label: "Partager :",
      related_heading: "📚 Articles Similaires",
      footer_rights: "Tous droits réservés."
    }
  };

  let currentLang = localStorage.getItem('tp_language') || 'en';

  function getLang() { return currentLang; }

  function t(key, lang) {
    const dict = translations[lang || currentLang] || translations.en;
    return dict[key] !== undefined ? dict[key] : (translations.en[key] || key);
  }

  function apply(lang) {
    if (lang) currentLang = lang;
    const dict = translations[currentLang] || translations.en;
    document.documentElement.setAttribute('lang', currentLang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerText = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) el.placeholder = dict[key];
    });

    document.dispatchEvent(new CustomEvent('tp:langchange', { detail: { lang: currentLang } }));
  }

  function init() {
    const selector = document.getElementById('languageSelector');
    apply(currentLang);
    if (selector) {
      selector.value = currentLang;
      selector.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('tp_language', currentLang);
        apply(currentLang);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return { getLang, t, apply, translations };
})();
