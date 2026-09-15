/* ============================================
   TechPulse — Admin Controller
   ============================================ */
(function () {
    'use strict';

    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
    const STORAGE_KEY = 'tp_articles';
    const CATEGORIES = ['Embedded','Web','AI','Linux','Rust','IoT','Security','DevOps','Hardware','Tutorials'];

    /* ---------- Storage ---------- */
    function getArticles() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch {}
        return [
            {
                id: '1',
                title: 'ESP32 & ESP8266 Microcontroller Programming',
                excerpt: 'Comprehensive guide to sensor interfacing, telemetry, and Over-The-Air (OTA) firmware updates.',
                content: 'Detailed setup using C++ and MicroPython for real-time sensor processing.\n\nThis article walks through the entire workflow of programming ESP32 microcontrollers — from initial setup to advanced sensor integration and remote OTA updates.',
                category: 'Embedded',
                author: 'TechPulse Team',
                date: new Date().toISOString().slice(0, 10),
                readTime: '8 min',
                tags: ['esp32', 'iot', 'firmware'],
                image: '',
                likes: 0,
                featured: false
            }
        ];
    }

    function saveArticles(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    /* ---------- Helpers ---------- */
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));

    function slugify(str) {
        return String(str).toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function toast(msg) { window.showToast && window.showToast(msg); }

    /* ---------- Toast ---------- */
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
    window.showToast = showToast;

    /* ---------- Dark mode ---------- */
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
        apply(saved || 'light');
        btn.addEventListener('click', () => {
            const next = root.classList.contains('dark-theme') ? 'light' : 'dark';
            localStorage.setItem(KEY, next);
            apply(next);
        });
    })();

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

    let currentImageData = '';

    /* ---------- Image upload ---------- */
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

    /* ---------- Auto-slug ---------- */
    let slugEdited = false;
    slugInput.addEventListener('input', () => { slugEdited = true; });
    titleInput.addEventListener('input', () => {
        if (!slugEdited) slugInput.value = slugify(titleInput.value);
    });

    /* ---------- Render list ---------- */
    function renderAdminList() {
        const articles = getArticles().sort((a, b) =>
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

        listContainer.innerHTML = articles.map(art => `
            <div class="admin-article-item">
                <div>
                    <h4>${esc(art.title)}</h4>
                    <p>${esc(art.excerpt)}</p>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">
                        ${esc(art.category || '—')} · ${esc(art.date || '')} · ${art.featured ? '★ Featured' : ''}
                    </p>
                </div>
                <div class="item-btns">
                    <button type="button" data-edit="${esc(art.id)}" class="btn-edit">Edit</button>
                    <button type="button" data-delete="${esc(art.id)}" class="btn-delete">Delete</button>
                </div>
            </div>
        `).join('');
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
        titleInput.value = art.title || '';
        slugInput.value = art.slug || '';
        slugEdited = true;
        excerptInput.value = art.excerpt || '';
        contentInput.value = art.content || '';
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

            for (const a of articles) {
                const copy = { ...a };
                if (copy.image && copy.image.startsWith('data:')) {
                    const m = copy.image.match(/^data:(.+?);base64,(.+)$/);
                    if (m) {
                        const ext = (m[1].split('/')[1] || 'jpg').replace('jpeg', 'jpg');
                        const filename = `${copy.slug || copy.id}.${ext}`;
                        imagesFolder.file(filename, m[2], { base64: true });
                        copy.image = `assets/images/${filename}`;
                    }
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
            toast('📦 ZIP exported');
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
    renderAdminList();
})();