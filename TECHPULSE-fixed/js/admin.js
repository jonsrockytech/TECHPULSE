/* ============================================
   TechPulse — Admin Controller (Supabase Integrated)
   ============================================ */
(function () {
    'use strict';

    const $  = (s, c = document) => c.querySelector(s);     const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
    
    // إعدادات اتصال Supabase
    const SUPABASE_URL = 'https://ijgvrjkpiofamwcmkmgi.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_5NcPMPDtyNXRg-oduydRUA_JM6IeV9k';
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let articlesCache = [];

    async function loadArticles() {
        const { data, error } = await supabaseClient
            .from('articles')
            .select('*')
            .order('id', { ascending: false });
            
        if (error) {
            console.error('Error loading articles:', error);
            toast('❌ Failed to load articles from database');
            articlesCache = [];
        } else {
            articlesCache = data || [];
        }
        return articlesCache;
    }

    function getArticles() { return articlesCache; }

    async function saveArticlesToDb(list) {
        articlesCache = list;
    }

    function toast(msg) { window.showToast && window.showToast(msg); }

    /* ---------- Dark mode ---------- */
    if (window.TPCommon && window.TPCommon.initDarkMode) {
        window.TPCommon.initDarkMode();
    }

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
    let currentGalleryImages = [];

    /* ---------- Featured image upload ---------- */
    if (imagePreview && imageInput) {
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
    }
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
        if (!galleryStrip) return;
        galleryStrip.innerHTML = currentGalleryImages.map((src, i) => `
            <div class="gallery-thumb" data-idx="${i}">
                <img src="${src}" alt="Gallery image ${i + 1}">
                <button type="button" class="remove-thumb" data-remove-gallery="${i}" aria-label="Remove">×</button>
            </div>
        `).join('');
    }
    if (addGalleryBtn && galleryFileInput) {
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
    }
    if (galleryStrip) {
        galleryStrip.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-remove-gallery]');
            if (!btn) return;
            currentGalleryImages.splice(Number(btn.dataset.removeGallery), 1);
            renderGalleryStrip();
        });
    }

    /* ---------- Auto-slug ---------- */
    let slugEdited = false;
    if (slugInput && titleInput) {
        slugInput.addEventListener('input', () => { slugEdited = true; });
        titleInput.addEventListener('input', () => {
            if (!slugEdited && window.TPCommon && window.TPCommon.slugify) {
                slugInput.value = window.TPCommon.slugify(titleInput.value);
            }
        });
    }

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
            const escText = (t) => window.TPCommon && window.TPCommon.esc ? window.TPCommon.esc(t) : t;
            return `
            <div class="admin-article-item">
                <div>
                    <h4>${escText(art.title)}</h4>
                    <p>${escText(art.excerpt)}</p>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">
                        ${escText(art.category || '—')} · ${escText(art.date || '')} · ${art.featured ? '★ Featured' : ''}
                    </p>
                </div>
                <div class="item-btns">
                    <button type="button" data-edit="${art.id}" class="btn-edit">Edit</button>
                    <button type="button" data-delete="${art.id}" class="btn-delete">Delete</button>
                </div>
            </div>
        `; }).join('');
    }

    /* ---------- Form submit ---------- */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = articleIdInput.value ? Number(articleIdInput.value) : undefined;
        const title = titleInput.value.trim();
        const excerpt = excerptInput.value.trim();
        const content = contentInput.value.trim();
        const category = categoryInput.value;
        const author = authorInput.value.trim() || 'TechPulse Team';
        const date = dateInput.value || new Date().toISOString().slice(0, 10);
        const readTime = readTimeInput.value.trim() || calcReadTime(content);
        const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
        const featured = featuredInput.checked;
        const slug = slugInput.value.trim() || (window.TPCommon && window.TPCommon.slugify ? window.TPCommon.slugify(title) : '');

        if (!title || !excerpt || !content || !category) {
            toast('Please fill all required fields');
            return;
        }

        const data = {
            title, excerpt, content, category, author, date, readTime, tags,
            featured,
            image: currentImageData || '',
            images: currentGalleryImages.slice(),
            likes: 0,
            slug
        };

        try {
            if (id) {
                // تحديث مقال موجود
                const { error } = await supabaseClient
                    .from('articles')
                    .update(data)
                    .eq('id', id);
                if (error) throw error;
                toast('✓ Article updated in database');
            } else {
                // إضافة مقال جديد
                const { error } = await supabaseClient
                    .from('articles')
                    .insert([data]);
                if (error) throw error;
                toast('✓ Article created in database');
            }

            resetForm();
            await loadArticles();
            renderAdminList();
        } catch (err) {
            console.error('Error saving article:', err);
            toast('❌ Error saving to database: ' + err.message);
        }
    });

    function calcReadTime(text) {
        const w = String(text || '').trim().split(/\s+/).length;
        return Math.max(1, Math.round(w / 200)) + ' min';
    }

    /* ---------- Edit / Delete ---------- */
    listContainer.addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-edit]');
        const delBtn = e.target.closest('[data-delete]');
        if (editBtn) editArticle(editBtn.dataset.edit);
        if (delBtn) deleteArticle(delBtn.dataset.delete);
    });

    function editArticle(id) {
        const art = getArticles().find(a => String(a.id) === String(id));
        if (!art) return;
        articleIdInput.value = art.id;

        titleInput.value = art.title || '';
        excerptInput.value = art.excerpt || '';
        contentInput.value = art.content || '';

        slugInput.value = art.slug || '';
        slugEdited = true;
        categoryInput.value = art.category || '';
        authorInput.value = art.author || '';
        dateInput.value = art.date || '';
        readTimeInput.value = art.readTime || '';
        tagsInput.value = Array.isArray(art.tags) ? art.tags.join(', ') : (art.tags || '');
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

    async function deleteArticle(id) {
        if (!confirm('Are you sure you want to delete this article?')) return;
        try {
            const { error } = await supabaseClient
                .from('articles')
                .delete()
                .eq('id', id);
            if (error) throw error;

            await loadArticles();
            renderAdminList();
            toast('🗑 Article deleted from database');
        } catch (err) {
            console.error('Error deleting article:', err);
            toast('❌ Error deleting article');
        }
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

    if (resetBtn) resetBtn.addEventListener('click', resetForm);

    /* ---------- Init ---------- */
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
    loadArticles().then(renderAdminList);

    /* ---------- Public API for AI Generator ---------- */
    window.TPAdmin = {
        setFeaturedImage: function (dataUrl) {
            currentImageData = dataUrl || '';
            if (currentImageData) {
                imagePreview.innerHTML = `<img src="${currentImageData}" alt="Preview">`;
                if (removeImageBtn) removeImageBtn.style.display = 'inline-block';
            } else {
                imagePreview.innerHTML = '<span class="image-hint">Click to upload an image (max 2 MB)</span>';
                if (removeImageBtn) removeImageBtn.style.display = 'none';
            }
        },
        setGalleryImages: function (dataUrls) {
            currentGalleryImages = Array.isArray(dataUrls) ? dataUrls.slice() : [];
            renderGalleryStrip();
        },
        getFeaturedImage: function () { return currentImageData; },
        getGalleryImages: function () { return currentGalleryImages.slice(); }
    };
})();
