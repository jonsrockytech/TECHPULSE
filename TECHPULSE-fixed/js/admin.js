/* ============================================
   TechPulse — Admin Controller
   Requires js/common.js to be loaded first (article loading, esc, slugify).
   ============================================ */
(function () {
    'use strict';

    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
    const STORAGE_KEY = 'tp_articles';
    const C = window.TPCommon;
    const esc = C.esc;
    const slugify = C.slugify;

    /* ---------- Storage ----------
       The published data/articles.json (bundled with the site) is always
       the baseline. Anything saved here is layered on top in this browser's
       localStorage until you hit "Export ZIP" and redeploy — this lets you
       proof changes before they go live. If data/meta.json's version moves
       on, a stale local draft from an older deployment is dropped
       automatically instead of silently hiding new published articles. */
    let articlesCache = [];

    async function loadArticles() {
        articlesCache = await C.getArticles(true);
        return articlesCache;
    }

    function getArticles() { return articlesCache; }

    function saveArticles(list) {
        articlesCache = list;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        C.getArticlesVersion().then(v => { if (v) localStorage.setItem('tp_articles_version', v); });
    }

    function toast(msg) { window.showToast && window.showToast(msg); }

    /* ---------- Dark mode ---------- */
    C.initDarkMode();

    /* ---------- Element refs ---------- */
    const form = $('#article-form');
    const articleIdInput = $('#article-id');
    const titleInput = $('#title');
    const slugInput = $('#slug');
    const excerptInput = $('#excerpt');
    const contentInput = $('#content');
    const categoryInput = $('#category');
    const authorInput = $('#author');
    const dateInput = $('#date');
    const readTimeInput = $('#readTime');
    const tagsInput = $('#tags');
    const featuredInput = $('#featured');
    const imageInput = $('#image-file');
    const imagePreview = $('#image-preview');
    const removeImageBtn = $('#remove-image');
    const formTitle = $('#form-title');
    const resetBtn = $('#reset-btn');
    const listContainer = $('#admin-articles-list');
    const galleryStrip = $('#gallery-strip');
    const galleryFileInput = $('#gallery-file');
    const addGalleryBtn = $('#add-gallery-btn');

    let currentImageData = '';
    let currentGalleryImages = []; // array of data URLs / paths

    /* ---------- Featured image upload ---------- */
    imagePreview.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast('Image too large (max 2 MB)');
            imageInput.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            currentImageData = ev.target.result;
            imagePreview.innerHTML = `<img src="${currentImageData}" alt="Preview">`;
            if (removeImageBtn) removeImageBtn.style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    });
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageData = '';
            imageInput.value = '';
            imagePreview.innerHTML = '<span class="image-hint">Click to upload an image (max 2 MB)</span>';
            removeImageBtn.style.display = 'none';
        });
    }

    /* ---------- Gallery images (multiple) ---------- */
    function renderGalleryStrip() {
        galleryStrip.innerHTML = currentGalleryImages.map((src, i) => `
            <div class="gallery-thumb" data-idx="${i}">
                <img src="${esc(src)}" alt="Gallery image ${i + 1}">
                <button type="button" class="remove-thumb" data-remove-gallery="${i}" aria-label="Remove">×</button>
            </div>
        `).join('');
    }
    addGalleryBtn.addEventListener('click', () => galleryFileInput.click());
    galleryFileInput.addEventListener('change', () => {
        const files = Array.from(galleryFileInput.files || []);
        let remaining = files.length;
        if (!remaining) return;
        files.forEach(file => {
            if (file.size > 2 * 1024 * 1024) {
                toast(`Skipped "${file.name}" (max 2 MB)`);
                if (--remaining === 0) galleryFileInput.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                currentGalleryImages.push(ev.target.result);
                renderGalleryStrip();
                if (--remaining === 0) galleryFileInput.value = '';
            };
            reader.readAsDataURL(file);
        });
    });
    galleryStrip.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-remove-gallery]');
        if (!btn) return;
        currentGalleryImages.splice(Number(btn.dataset.removeGallery), 1);
        renderGalleryStrip();
    });

    /* ---------- Auto-slug ---------- */
    let slugEdited = false;
    slugInput.addEventListener('input', () => { slugEdited = true; });
    titleInput.addEventListener('input', () => {
        if (!slugEdited) slugInput.value = slugify(titleInput.value);
    });

    /* ---------- Render list ---------- */
    function renderAdminList() {
        const articles = [...getArticles()].sort((a, b) =>
            (b.date || '').localeCompare(a.date || '')
        );

        const stats = $('#adminStats');
        if (stats) {
            const cats = new Set(articles.map(a => a.category).filter(Boolean)).size;
            const featured = articles.filter(a => a.featured).length;
            stats.innerHTML = `
                <div class="stat"><div class="stat-label">Total</div><div class="stat-value">${articles.length}</div></div>
                <div class="stat"><div class="stat-label">Categories</div><div class="stat-value">${cats}</div></div>
                <div class="stat"><div class="stat-label">Featured</div><div class="stat-value">${featured}</div></div>
            `;
        }

        if (!articles.length) {
            listContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">No articles yet.</p>';
            return;
        }

        listContainer.innerHTML = articles.map(art => {
            const title = C.pickLocalized(art.title, 'en');
            const excerpt = C.pickLocalized(art.excerpt, 'en');
            return `
            <div class="admin-article-item">
                <div>
                    <h4>${esc(title)}</h4>
                    <p>${esc(excerpt)}</p>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">
                        ${esc(art.category || '—')} · ${esc(art.date || '')} · ${art.featured ? '★ Featured' : ''}
                        ${Array.isArray(art.images) && art.images.length ? ` · 🖼 ${art.images.length} gallery image(s)` : ''}
                    </p>
                </div>
                <div class="item-btns">
                    <button type="button" data-edit="${esc(art.id)}" class="btn-edit">Edit</button>
                    <button type="button" data-delete="${esc(art.id)}" class="btn-delete">Delete</button>
                </div>
            </div>
        `; }).join('');
    }

    /* ---------- Form submit ---------- */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const articles = getArticles();
        const id = articleIdInput.value || Date.now().toString();
        const title = titleInput.value.trim();
        const excerpt = excerptInput.value.trim();
        const content = contentInput.value.trim();
        const category = categoryInput.value;
        const author = authorInput.value.trim() || 'TechPulse Team';
        const date = dateInput.value || new Date().toISOString().slice(0, 10);
        const readTime = readTimeInput.value.trim() || calcReadTime(content);
        const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
        const featured = featuredInput.checked;

        if (!title || !excerpt || !content || !category) {
            toast('Please fill all required fields');
            return;
        }

        const data = {
            id, title, excerpt, content, category, author, date, readTime, tags,
            featured,
            image: currentImageData || '',
            images: currentGalleryImages.slice(),
            likes: 0,
            slug: slugInput.value.trim() || slugify(title)
        };

        const idx = articles.findIndex(a => a.id === id);
        if (idx > -1) {
            data.likes = articles[idx].likes || 0;
            articles[idx] = data;
            toast('✓ Article updated');
        } else {
            articles.push(data);
            toast('✓ Article created');
        }
        saveArticles(articles);
        resetForm();
        renderAdminList();
    });

    function calcReadTime(text) {
        const w = String(text || '').trim().split(/\s+/).length;
        return Math.max(1, Math.round(w / 200)) + ' min';
    }

    /* ---------- Edit / Delete (event delegation) ---------- */
    listContainer.addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-edit]');
        const delBtn = e.target.closest('[data-delete]');
        if (editBtn) editArticle(editBtn.dataset.edit);
        if (delBtn) deleteArticle(delBtn.dataset.delete);
    });

    function editArticle(id) {
        const art = getArticles().find(a => a.id === id);
        if (!art) return;
        articleIdInput.value = art.id;

        // art.title/excerpt/content may still be {en:"..."} objects left over
        // from an earlier multi-language version — pickLocalized reads either.
        titleInput.value = C.pickLocalized(art.title, 'en');
        excerptInput.value = C.pickLocalized(art.excerpt, 'en');
        contentInput.value = C.pickLocalized(art.content, 'en');

        slugInput.value = art.slug || '';
        slugEdited = true;
        categoryInput.value = art.category || '';
        authorInput.value = art.author || '';
        dateInput.value = art.date || '';
        readTimeInput.value = art.readTime || '';
        tagsInput.value = (art.tags || []).join(', ');
        featuredInput.checked = !!art.featured;

        currentImageData = art.image || '';
        if (currentImageData) {
            imagePreview.innerHTML = `<img src="${currentImageData}" alt="Preview">`;
            removeImageBtn.style.display = 'inline-block';
        } else {
            imagePreview.innerHTML = '<span class="image-hint">Click to upload an image (max 2 MB)</span>';
            removeImageBtn.style.display = 'none';
        }

        currentGalleryImages = Array.isArray(art.images) ? art.images.slice() : [];
        renderGalleryStrip();

        formTitle.textContent = 'Edit Article';
        resetBtn.style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteArticle(id) {
        if (!confirm('Are you sure you want to delete this article?')) return;
        const articles = getArticles().filter(a => a.id !== id);
        saveArticles(articles);
        renderAdminList();
        toast('🗑 Article deleted');
    }

    function resetForm() {
        form.reset();
        articleIdInput.value = '';
        slugEdited = false;
        currentImageData = '';
        imagePreview.innerHTML = '<span class="image-hint">Click to upload an image (max 2 MB)</span>';
        removeImageBtn.style.display = 'none';
        currentGalleryImages = [];
        renderGalleryStrip();
        formTitle.textContent = 'Add New Article';
        resetBtn.style.display = 'none';
        dateInput.value = new Date().toISOString().slice(0, 10);
    }

    resetBtn.addEventListener('click', resetForm);

    /* ---------- Export ZIP ---------- */
    const exportBtn = $('#export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            const articles = getArticles();
            if (!articles.length) { toast('No articles to export'); return; }
            if (typeof JSZip === 'undefined') {
                toast('JSZip not loaded');
                return;
            }

            const zip = new JSZip();
            const imagesFolder = zip.folder('assets/images');
            const clean = [];

            const embedIfDataUrl = (src, baseName, index) => {
                if (src && src.startsWith('data:')) {
                    const m = src.match(/^data:(.+?);base64,(.+)$/);
                    if (m) {
                        const ext = (m[1].split('/')[1] || 'jpg').replace('jpeg', 'jpg');
                        const filename = `${baseName}${index != null ? '-' + index : ''}.${ext}`;
                        imagesFolder.file(filename, m[2], { base64: true });
                        return `assets/images/${filename}`;
                    }
                }
                return src;
            };

            for (const a of articles) {
                const copy = { ...a };
                const base = copy.slug || copy.id;
                copy.image = embedIfDataUrl(copy.image, base, null);
                if (Array.isArray(copy.images)) {
                    copy.images = copy.images.map((src, i) => embedIfDataUrl(src, base, i + 1));
                }
                clean.push(copy);
            }

            zip.file('data/articles.json', JSON.stringify(clean, null, 2));

            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `techpulse-export-${new Date().toISOString().slice(0, 10)}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast('📦 ZIP exported — replace data/articles.json (and assets/images/) on your live site with the contents of this ZIP to publish. Remember to bump the version in data/meta.json too.');
        });
    }

    /* ---------- Import JSON ---------- */
    const importBtn = $('#import-btn');
    const importInput = $('#import-input');
    if (importBtn && importInput) {
        importBtn.addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const imported = JSON.parse(ev.target.result);
                    if (!Array.isArray(imported)) throw new Error('Not array');
                    if (!confirm(`Import ${imported.length} articles? This will REPLACE your current list.`)) return;
                    saveArticles(imported);
                    renderAdminList();
                    toast(`✓ Imported ${imported.length} articles`);
                } catch (err) {
                    toast('Invalid JSON');
                    console.error(err);
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });
    }

    /* ---------- Init ---------- */
    dateInput.value = new Date().toISOString().slice(0, 10);
    loadArticles().then(renderAdminList);
})();
