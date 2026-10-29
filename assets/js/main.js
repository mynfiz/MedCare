// ============================================================
// main.js — Inisialisasi utama aplikasi MedCare
// Mengatur navigasi, rendering katalog, detail produk,
// keranjang belanja, form kontak, dan interaktivitas halaman.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    // 1. Inisialisasi navigasi umum & badge
    initNavigation();
    initActiveNavLink();
    initScrollEffects();

    // 2. Inisialisasi badge keranjang & tombol favorit
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
    if (typeof initFavoriteButtons === 'function') {
        initFavoriteButtons();
    }

    // 3. Inisialisasi spesifik per halaman berdasarkan elemen DOM
    if (document.getElementById('featured-products')) {
        initFeaturedProducts();
    }

    if (document.getElementById('product-grid') && document.getElementById('search-input')) {
        initProductsCatalog();
    }

    if (document.getElementById('product-detail')) {
        initProductDetailPage();
    }

    if (document.getElementById('cart-content')) {
        initCartPage();
    }

    if (document.getElementById('contact-form')) {
        initContactForm();
    }
});


// ============================================================
// NAVIGASI & HEADER
// ============================================================

/**
 * Mengatur toggle menu hamburger pada tampilan layar kecil/mobile
 */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    // Tutup menu saat pengguna mengklik tautan di dalamnya
    const links = navLinks.querySelectorAll('a');
    links.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Tutup menu jika pengguna mengklik di luar menu
    document.addEventListener('click', function (event) {
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target) && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Menandai tautan navigasi aktif berdasarkan nama file halaman saat ini
 */
function initActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    // Dapatkan nama file saat ini, default ke index.html
    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === '') {
        currentPath = 'index.html';
    }

    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else if (currentPath === 'product-detail.html' && href === 'products.html') {
            // Jika berada di detail produk, menu Katalog Obat tetap aktif
            link.classList.add('active');
        } else {
            // Hanya hapus jika tidak sengaja terpasang hardcoded
            if (href !== currentPath) {
                link.classList.remove('active');
            }
        }
    });
}

/**
 * Memberikan efek bayangan (shadow) pada navbar ketika halaman digulir
 */
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}


// ============================================================
// TEMPLATE KARTU PRODUK (PRODUCT CARD)
// ============================================================

/**
 * Menghasilkan string HTML untuk kartu produk standar
 * @param {Object} product - Data objek produk
 * @returns {string} HTML string
 */
function renderProductCard(product) {
    if (!product) return '';

    const priceText = typeof formatPrice === 'function' ? formatPrice(product.price) : 'Rp ' + Number(product.price).toLocaleString('id-ID');
    const isOutOfStock = product.stock <= 0;
    const isRx = Boolean(product.isPrescription || product.prescription);

    // Badge status stok
    let stockBadge = '<span class="badge badge-stock in-stock">Tersedia (' + product.stock + ')</span>';
    if (isOutOfStock) {
        stockBadge = '<span class="badge badge-stock out-of-stock">Stok Habis</span>';
    }

    // Badge kategori
    const catBadge = '<span class="badge badge-category">' + (product.categoryName || product.category) + '</span>';

    // Badge resep dokter jika perlu
    let rxBadge = '';
    if (isRx) {
        rxBadge = '<span class="badge badge-rx" title="Memerlukan Resep Dokter">Resep Dokter</span>';
    }

    // Tombol Favorit
    let favBtnHtml = '';
    if (typeof renderFavoriteButton === 'function') {
        favBtnHtml = renderFavoriteButton(product.id);
    }

    // Tombol Tambah ke Keranjang
    let cartBtn = '';
    if (isOutOfStock) {
        cartBtn = '<button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: not-allowed;">Habis</button>';
    } else if (isRx) {
        cartBtn = '<button class="btn btn-outline btn-sm" onclick="showToast(\'Produk resep dokter harus dengan persetujuan medis.\', \'warning\')">Perlu Resep</button>';
    } else {
        cartBtn = '<button class="btn btn-primary btn-sm btn-add-cart" data-id="' + product.id + '">+ Keranjang</button>';
    }

    return `
        <article class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-card-top">
                <div class="product-badges">
                    ${catBadge}
                    ${rxBadge}
                </div>
                <div class="product-fav-container">
                    ${favBtnHtml}
                </div>
            </div>

            <a href="product-detail.html?id=${product.id}" class="product-image-link" aria-label="Lihat detail ${product.name}">
                <div class="product-image-wrapper">
                    <span class="product-emoji" aria-hidden="true">${product.image || '💊'}</span>
                </div>
            </a>

            <div class="product-card-body">
                <div class="product-stock-status">
                    ${stockBadge}
                </div>
                <h3 class="product-title">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <p class="product-desc">${product.description || ''}</p>
                <div class="product-card-footer">
                    <div class="product-price">${priceText}</div>
                    <div class="product-actions">
                        ${cartBtn}
                    </div>
                </div>
            </div>
        </article>
    `;
}


// ============================================================
// BERANDA — PRODUK UNGGULAN
// ============================================================

function initFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    let featured = [];
    if (typeof getFeaturedProducts === 'function') {
        featured = getFeaturedProducts(4);
    } else if (typeof getAllProducts === 'function') {
        featured = getAllProducts().slice(0, 4);
    }

    if (!featured.length) {
        container.innerHTML = '<p class="text-muted">Tidak ada produk unggulan saat ini.</p>';
        return;
    }

    container.innerHTML = featured.map(renderProductCard).join('');

    // Listener tombol tambah ke keranjang
    attachAddToCartListeners(container);
}


// ============================================================
// KATALOG OBAT (products.html)
// ============================================================

function initProductsCatalog() {
    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!grid) return;

    // Normalisasi parameter URL kueri kategori (misal dari tautan beranda)
    const urlParams = new URLSearchParams(window.location.search);
    let selectedCategory = urlParams.get('category') || 'all';

    // Pemetaan alias dari link beranda agar cocok dengan ID kategori database
    const categoryAliasMap = {
        'vitamin-suplemen': 'vitamin',
        'perawatan-kesehatan': 'perawatan',
        'perlengkapan-medis': 'perlengkapan',
        'batuk-pilek': 'batuk-pilek'
    };
    if (categoryAliasMap[selectedCategory]) {
        selectedCategory = categoryAliasMap[selectedCategory];
    }

    // Sinkronkan tombol filter aktif
    filterButtons.forEach(function (btn) {
        const cat = btn.getAttribute('data-category');
        if (cat === selectedCategory) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Fungsi render katalog berdasarkan kueri & filter
    function applyFilterAndRender() {
        const searchQuery = searchInput ? searchInput.value.trim() : '';
        let products = [];

        if (typeof filterProducts === 'function') {
            products = filterProducts(selectedCategory, searchQuery);
        } else if (typeof getAllProducts === 'function') {
            products = getAllProducts().filter(function (p) {
                const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
                const matchQuery = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
                return matchCat && matchQuery;
            });
        }

        if (products.length === 0) {
            grid.innerHTML = '';
            grid.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
        } else {
            if (emptyState) emptyState.classList.add('hidden');
            grid.classList.remove('hidden');
            grid.innerHTML = products.map(renderProductCard).join('');
            attachAddToCartListeners(grid);
        }
    }

    // Event listener untuk tombol filter kategori
    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.getAttribute('data-category') || 'all';

            // Perbarui URL tanpa reload agar mudah dibagikan
            const newUrl = new URL(window.location.href);
            if (selectedCategory === 'all') {
                newUrl.searchParams.delete('category');
            } else {
                newUrl.searchParams.set('category', selectedCategory);
            }
            window.history.replaceState({}, '', newUrl);

            applyFilterAndRender();
        });
    });

    // Event listener untuk pencarian real-time (input)
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            applyFilterAndRender();
        });
    }

    // Tampilkan data awal
    applyFilterAndRender();
}


// ============================================================
// DETAIL PRODUK (product-detail.html)
// ============================================================

function initProductDetailPage() {
    const detailContainer = document.getElementById('product-detail');
    const notFoundContainer = document.getElementById('product-not-found');

    if (!detailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        showProductNotFound();
        return;
    }

    let product = null;
    if (typeof getProductById === 'function') {
        product = getProductById(productId);
    }

    if (!product) {
        showProductNotFound();
        return;
    }

    // Perbarui judul halaman
    document.title = product.name + ' — Detail Produk MedCare';

    const priceText = typeof formatPrice === 'function' ? formatPrice(product.price) : 'Rp ' + Number(product.price).toLocaleString('id-ID');
    const isOutOfStock = product.stock <= 0;
    const isRx = Boolean(product.isPrescription || product.prescription);

    let stockBadge = '<span class="badge badge-stock in-stock">Stok Tersedia (' + product.stock + ' unit)</span>';
    if (isOutOfStock) {
        stockBadge = '<span class="badge badge-stock out-of-stock">Stok Habis</span>';
    }

    let rxNotice = '';
    if (isRx) {
        rxNotice = `
            <div class="prescription-warning-box">
                <div class="warning-icon">⚠️</div>
                <div class="warning-text">
                    <strong>Obat Keras / Perlu Resep Dokter</strong>
                    <p>Obat ini tergolong obat dengan pengawasan. Untuk keamanan pasien, pembelian memerlukan resep dokter yang valid dan tidak dapat dibeli sembarangan.</p>
                </div>
            </div>
        `;
    }

    let favBtnHtml = '';
    if (typeof renderFavoriteButton === 'function') {
        favBtnHtml = renderFavoriteButton(product.id);
    }

    detailContainer.innerHTML = `
        <div class="product-detail-layout">
            <!-- Kolom Gambar -->
            <div class="product-detail-image-box">
                <span class="detail-product-emoji" aria-hidden="true">${product.image || '💊'}</span>
                <div class="detail-fav-btn">
                    ${favBtnHtml}
                </div>
            </div>

            <!-- Kolom Informasi -->
            <div class="product-detail-info">
                <div class="product-badges mb-2">
                    <span class="badge badge-category">${product.categoryName || product.category}</span>
                    ${isRx ? '<span class="badge badge-rx">Resep Dokter</span>' : ''}
                </div>

                <h1 class="product-detail-title">${product.name}</h1>
                <div class="product-detail-price">${priceText}</div>

                <div class="product-detail-stock mb-3">
                    ${stockBadge}
                </div>

                ${rxNotice}

                <div class="detail-section">
                    <h3>Deskripsi Produk</h3>
                    <p>${product.description || 'Tidak ada deskripsi tersedia.'}</p>
                </div>

                <div class="detail-section">
                    <h3>Aturan Pakai & Dosis</h3>
                    <p>${product.usage || 'Gunakan sesuai petunjuk dokter atau informasi pada kemasan.'}</p>
                </div>

                <div class="detail-section">
                    <h3>Peringatan & Perhatian</h3>
                    <p>${product.warnings || 'Simpan di tempat kering dan sejuk, jauhkan dari jangkauan anak-anak.'}</p>
                </div>

                <!-- Kontrol Jumlah & Tambah ke Keranjang -->
                <div class="detail-actions-box">
                    <div class="quantity-selector">
                        <label for="detail-quantity">Jumlah:</label>
                        <div class="quantity-controls">
                            <button type="button" class="qty-btn" id="qty-minus" aria-label="Kurangi jumlah" ${isOutOfStock ? 'disabled' : ''}>-</button>
                            <input type="number" id="detail-quantity" value="1" min="1" max="${product.stock || 1}" readonly>
                            <button type="button" class="qty-btn" id="qty-plus" aria-label="Tambah jumlah" ${isOutOfStock ? 'disabled' : ''}>+</button>
                        </div>
                    </div>

                    <div class="action-buttons-group">
                        ${isOutOfStock ? `
                            <button class="btn btn-secondary btn-lg" disabled style="opacity: 0.6; cursor: not-allowed;">
                                Stok Habis
                            </button>
                        ` : isRx ? `
                            <button class="btn btn-outline btn-lg" onclick="showToast('Obat resep dokter memerlukan konsultasi medis terlebih dahulu.', 'warning')">
                                Konsultasi Dokter (Demo)
                            </button>
                        ` : `
                            <button class="btn btn-primary btn-lg" id="btn-add-detail-cart">
                                🛒 Tambah ke Keranjang
                            </button>
                        `}
                    </div>
                </div>

                <!-- Catatan Demo -->
                <p class="demo-disclaimer-note">
                    ℹ️ MedCare adalah prototipe proyek akademik. Data dan transaksi bersifat simulasi semata.
                </p>
            </div>
        </div>
    `;

    // Interaktivitas kontrol jumlah
    const qtyInput = document.getElementById('detail-quantity');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const btnAddToCart = document.getElementById('btn-add-detail-cart');

    if (qtyMinus && qtyPlus && qtyInput) {
        qtyMinus.addEventListener('click', function () {
            let current = parseInt(qtyInput.value) || 1;
            if (current > 1) {
                qtyInput.value = current - 1;
            }
        });

        qtyPlus.addEventListener('click', function () {
            let current = parseInt(qtyInput.value) || 1;
            if (current < product.stock) {
                qtyInput.value = current + 1;
            } else {
                if (typeof showToast === 'function') {
                    showToast('Jumlah mencapai batas stok maksimum yang tersedia (' + product.stock + ').', 'warning');
                }
            }
        });
    }

    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', function () {
            const qty = parseInt(qtyInput.value) || 1;
            if (typeof addToCart === 'function') {
                addToCart(product.id, qty);
            }
        });
    }

    function showProductNotFound() {
        if (detailContainer) detailContainer.classList.add('hidden');
        if (notFoundContainer) notFoundContainer.classList.remove('hidden');
    }
}


// ============================================================
// KERANJANG BELANJA (cart.html)
// ============================================================

function initCartPage() {
    renderCartView();

    // Listener untuk tombol kosongkan keranjang
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            if (typeof clearCart === 'function') {
                clearCart();
                renderCartView();
            }
        });
    }
}

/**
 * Me-render tampilan keranjang belanja secara dinamis
 */
function renderCartView() {
    const cartContent = document.getElementById('cart-content');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');
    const totalPriceEl = document.getElementById('cart-total-price');

    if (!cartContent) return;

    let items = [];
    if (typeof getCartItemDetails === 'function') {
        items = getCartItemDetails();
    }

    if (items.length === 0) {
        cartContent.innerHTML = '';
        if (cartSummary) cartSummary.classList.add('hidden');
        if (emptyCart) emptyCart.classList.remove('hidden');
        return;
    }

    if (emptyCart) emptyCart.classList.add('hidden');
    if (cartSummary) cartSummary.classList.remove('hidden');

    let total = 0;
    let html = '<div class="cart-items-list">';

    items.forEach(function (item) {
        const itemPrice = typeof formatPrice === 'function' ? formatPrice(item.price) : 'Rp ' + Number(item.price).toLocaleString('id-ID');
        const itemSubtotal = typeof formatPrice === 'function' ? formatPrice(item.subtotal) : 'Rp ' + Number(item.subtotal).toLocaleString('id-ID');
        total += item.subtotal;

        html += `
            <div class="cart-item-row" data-id="${item.productId}">
                <div class="cart-item-image">
                    <span>${item.image || '💊'}</span>
                </div>
                <div class="cart-item-info">
                    <h3 class="cart-item-title">
                        <a href="product-detail.html?id=${item.productId}">${item.name}</a>
                    </h3>
                    <p class="cart-item-price">${itemPrice} / unit</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="cart-qty-btn cart-qty-minus" data-id="${item.productId}" aria-label="Kurangi">-</button>
                    <span class="cart-qty-val">${item.quantity}</span>
                    <button class="cart-qty-btn cart-qty-plus" data-id="${item.productId}" aria-label="Tambah">+</button>
                </div>
                <div class="cart-item-subtotal">
                    <span class="subtotal-label">Subtotal:</span>
                    <span class="subtotal-val">${itemSubtotal}</span>
                </div>
                <div class="cart-item-remove">
                    <button class="cart-remove-btn" data-id="${item.productId}" title="Hapus dari keranjang" aria-label="Hapus item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    cartContent.innerHTML = html;

    if (totalPriceEl) {
        totalPriceEl.textContent = typeof formatPrice === 'function' ? formatPrice(total) : 'Rp ' + Number(total).toLocaleString('id-ID');
    }

    // Attach event listeners untuk aksi tombol di baris keranjang
    attachCartRowListeners(cartContent);
}

function attachCartRowListeners(container) {
    // Tombol Kurang (-)
    const minusBtns = container.querySelectorAll('.cart-qty-minus');
    minusBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const id = btn.getAttribute('data-id');
            const items = getCartItems();
            const found = items.find(i => i.productId === id);
            if (found && typeof updateCartQuantity === 'function') {
                updateCartQuantity(id, found.quantity - 1);
                renderCartView();
            }
        });
    });

    // Tombol Tambah (+)
    const plusBtns = container.querySelectorAll('.cart-qty-plus');
    plusBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const id = btn.getAttribute('data-id');
            const items = getCartItems();
            const found = items.find(i => i.productId === id);
            if (found && typeof updateCartQuantity === 'function') {
                updateCartQuantity(id, found.quantity + 1);
                renderCartView();
            }
        });
    });

    // Tombol Hapus (trash)
    const removeBtns = container.querySelectorAll('.cart-remove-btn');
    removeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const id = btn.getAttribute('data-id');
            if (typeof removeFromCart === 'function') {
                removeFromCart(id);
                renderCartView();
            }
        });
    });
}


// ============================================================
// HELPER EVENT LISTENER TAMBAH KE KERANJANG
// ============================================================

function attachAddToCartListeners(container) {
    if (!container) return;
    const buttons = container.querySelectorAll('.btn-add-cart');
    buttons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            if (id && typeof addToCart === 'function') {
                addToCart(id, 1);
            }
        });
    });
}


// ============================================================
// FORM KONTAK (contact.html)
// ============================================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedbackBox = document.getElementById('form-feedback');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');

        // Validasi sederhana
        let errors = [];

        if (!nameInput || !nameInput.value.trim()) {
            errors.push('Nama lengkap wajib diisi.');
        }

        if (!emailInput || !emailInput.value.trim()) {
            errors.push('Alamat email wajib diisi.');
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                errors.push('Format alamat email tidak valid.');
            }
        }

        if (!subjectInput || !subjectInput.value.trim()) {
            errors.push('Subjek pesan wajib dipilih atau diisi.');
        }

        if (!messageInput || !messageInput.value.trim()) {
            errors.push('Isi pesan tidak boleh kosong.');
        } else if (messageInput.value.trim().length < 10) {
            errors.push('Pesan minimal berisi 10 karakter.');
        }

        if (errors.length > 0) {
            if (feedbackBox) {
                feedbackBox.className = 'form-feedback error';
                feedbackBox.innerHTML = `<strong>Harap periksa kembali:</strong><ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
                feedbackBox.classList.remove('hidden');
                feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else if (typeof showToast === 'function') {
                showToast(errors[0], 'error');
            }
            return;
        }

        // Tampilkan pesan simulasi (karena tanpa backend)
        const senderName = nameInput.value.trim();
        form.reset();

        if (feedbackBox) {
            feedbackBox.className = 'form-feedback success';
            feedbackBox.innerHTML = `
                <div class="feedback-icon">✅</div>
                <div>
                    <strong>Terima kasih, ${senderName}!</strong>
                    <p>Simulasi pengiriman pesan berhasil. <em>Catatan: Karena ini adalah website prototipe akademik tanpa server backend, pesan Anda tidak benar-benar dikirimkan melalui jaringan internet.</em></p>
                </div>
            `;
            feedbackBox.classList.remove('hidden');
            feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (typeof showToast === 'function') {
            showToast('Simulasi pengiriman berhasil (Mode demo akademik).', 'success');
        }
    });
}
