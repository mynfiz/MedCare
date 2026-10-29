// cart.js — Fungsi-fungsi keranjang belanja
// Mengelola penambahan, penghapusan, dan pembaruan item di keranjang
// Bergantung pada: storage.js dan products.js (harus dimuat terlebih dahulu)

// ============================================================
// KUNCI PENYIMPANAN
// ============================================================
var CART_STORAGE_KEY = 'medcare_cart';

// ============================================================
// getCartItems — Mengambil data keranjang dari penyimpanan lokal
// Mengembalikan array objek { productId, quantity }
// ============================================================
function getCartItems() {
    var cart = getFromStorage(CART_STORAGE_KEY);
    // Jika belum ada data keranjang, kembalikan array kosong
    if (!cart || !Array.isArray(cart)) {
        return [];
    }
    return cart;
}

// ============================================================
// saveCart — Menyimpan data keranjang ke penyimpanan lokal
// (fungsi internal, tidak perlu dipanggil langsung)
// ============================================================
function saveCart(cartItems) {
    saveToStorage(CART_STORAGE_KEY, cartItems);
}

// ============================================================
// addToCart — Menambahkan produk ke keranjang belanja
// productId: ID produk yang akan ditambahkan
// quantity: jumlah yang ditambahkan (default: 1)
// Mengembalikan true jika berhasil, false jika gagal
// ============================================================
function addToCart(productId, quantity) {
    // Default quantity = 1
    if (quantity === undefined || quantity === null) {
        quantity = 1;
    }

    // Cari data produk dari daftar produk
    var product = getProductById(productId);
    if (!product) {
        showToast('Produk tidak ditemukan.', 'error');
        return false;
    }

    // Cek apakah produk memerlukan resep dokter
    if (product.isPrescription || product.prescription) {
        showToast('Produk ini memerlukan resep dokter. Silakan konsultasi dengan dokter terlebih dahulu.', 'warning');
        return false;
    }

    // Cek apakah stok tersedia
    if (product.stock <= 0) {
        showToast('Maaf, stok produk "' + product.name + '" sedang habis.', 'error');
        return false;
    }

    // Ambil keranjang saat ini
    var cart = getCartItems();

    // Cari apakah produk sudah ada di keranjang
    var existingItem = null;
    var existingIndex = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            existingItem = cart[i];
            existingIndex = i;
            break;
        }
    }

    if (existingItem) {
        // Produk sudah ada di keranjang, tambahkan jumlahnya
        var newQty = existingItem.quantity + quantity;

        // Cek apakah jumlah baru melebihi stok
        if (newQty > product.stock) {
            showToast('Jumlah melebihi stok tersedia (' + product.stock + ' tersisa).', 'warning');
            return false;
        }

        cart[existingIndex].quantity = newQty;
    } else {
        // Produk belum ada di keranjang, tambahkan sebagai item baru
        if (quantity > product.stock) {
            showToast('Jumlah melebihi stok tersedia (' + product.stock + ' tersisa).', 'warning');
            return false;
        }

        cart.push({
            productId: productId,
            quantity: quantity
        });
    }

    // Simpan keranjang yang telah diperbarui
    saveCart(cart);

    // Perbarui badge keranjang di navigasi
    updateCartBadge();

    // Tampilkan notifikasi berhasil
    showToast('Berhasil menambahkan "' + product.name + '" ke keranjang!', 'success');
    return true;
}

// ============================================================
// removeFromCart — Menghapus produk dari keranjang secara keseluruhan
// productId: ID produk yang akan dihapus
// ============================================================
function removeFromCart(productId) {
    var cart = getCartItems();

    // Filter untuk menghapus item dengan productId tertentu
    var updatedCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId !== productId) {
            updatedCart.push(cart[i]);
        }
    }

    // Simpan keranjang yang diperbarui
    saveCart(updatedCart);

    // Perbarui badge keranjang
    updateCartBadge();

    showToast('Produk berhasil dihapus dari keranjang.', 'success');
}

// ============================================================
// updateCartQuantity — Memperbarui jumlah produk di keranjang
// productId: ID produk
// newQuantity: jumlah baru
// Jika jumlah baru = 0, produk akan dihapus dari keranjang
// ============================================================
function updateCartQuantity(productId, newQuantity) {
    // Jika jumlah baru 0 atau kurang, hapus item
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    // Cek batas stok
    var product = getProductById(productId);
    if (product && newQuantity > product.stock) {
        showToast('Jumlah melebihi stok tersedia (' + product.stock + ' tersisa).', 'warning');
        return;
    }

    var cart = getCartItems();

    // Cari dan perbarui jumlah item
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            cart[i].quantity = newQuantity;
            break;
        }
    }

    // Simpan perubahan
    saveCart(cart);

    // Perbarui badge keranjang
    updateCartBadge();
}

// ============================================================
// clearCart — Mengosongkan seluruh keranjang belanja
// Menampilkan konfirmasi sebelum menghapus
// ============================================================
function clearCart() {
    var cart = getCartItems();

    // Jika keranjang sudah kosong, beri tahu pengguna
    if (cart.length === 0) {
        showToast('Keranjang sudah kosong.', 'warning');
        return;
    }

    // Minta konfirmasi dari pengguna
    var konfirmasi = confirm('Apakah Anda yakin ingin mengosongkan keranjang belanja?');
    if (konfirmasi) {
        saveCart([]);
        updateCartBadge();
        showToast('Keranjang belanja telah dikosongkan.', 'success');
    }
}

// ============================================================
// getCartCount — Menghitung total jumlah item di keranjang
// Mengembalikan jumlah total (penjumlahan semua quantity)
// ============================================================
function getCartCount() {
    var cart = getCartItems();
    var totalCount = 0;

    for (var i = 0; i < cart.length; i++) {
        totalCount += cart[i].quantity;
    }

    return totalCount;
}

// ============================================================
// getCartTotal — Menghitung total harga seluruh item di keranjang
// Mengembalikan angka total harga
// ============================================================
function getCartTotal() {
    var cart = getCartItems();
    var totalPrice = 0;

    for (var i = 0; i < cart.length; i++) {
        var product = getProductById(cart[i].productId);
        if (product) {
            totalPrice += product.price * cart[i].quantity;
        }
    }

    return totalPrice;
}

// ============================================================
// getCartItemDetails — Mendapatkan detail lengkap item keranjang
// Mengembalikan array objek dengan informasi produk lengkap:
// { productId, quantity, name, price, image, category, stock, subtotal }
// ============================================================
function getCartItemDetails() {
    var cart = getCartItems();
    var detailedItems = [];

    for (var i = 0; i < cart.length; i++) {
        var product = getProductById(cart[i].productId);
        if (product) {
            detailedItems.push({
                productId: cart[i].productId,
                quantity: cart[i].quantity,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                stock: product.stock,
                subtotal: product.price * cart[i].quantity
            });
        }
    }

    return detailedItems;
}

// ============================================================
// updateCartBadge — Memperbarui badge jumlah item di navigasi
// Mencari elemen dengan id="cart-count" dan memperbarui teksnya
// ============================================================
function updateCartBadge() {
    var badge = document.getElementById('cart-count');
    if (badge) {
        var count = getCartCount();
        badge.textContent = count;

        // Sembunyikan badge jika keranjang kosong
        if (count > 0) {
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// ============================================================
// showToast — Menampilkan notifikasi toast
// message: teks pesan yang ditampilkan
// type: jenis notifikasi ('success', 'error', 'warning')
// Otomatis hilang setelah 3 detik
// ============================================================
function showToast(message, type) {
    // Tentukan warna berdasarkan tipe notifikasi
    var bgColor = '#20B8A5'; // default: hijau (success)
    var iconSVG = '';

    if (type === 'success') {
        bgColor = '#20B8A5'; // Teal / hijau
        iconSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
        bgColor = '#E74C3C'; // Merah
        iconSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else if (type === 'warning') {
        bgColor = '#F39C12'; // Oranye
        iconSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    }

    // Buat elemen toast
    var toast = document.createElement('div');
    toast.className = 'medcare-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    // Gaya CSS inline untuk toast
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:' + bgColor +
        ';color:#fff;padding:14px 22px;border-radius:10px;' +
        'font-size:14px;font-family:inherit;z-index:10000;display:flex;align-items:center;gap:10px;' +
        'box-shadow:0 6px 24px rgba(0,0,0,0.18);opacity:0;transform:translateY(20px);' +
        'transition:opacity 0.35s ease,transform 0.35s ease;max-width:380px;line-height:1.5;';

    toast.innerHTML = iconSVG + '<span>' + message + '</span>';

    // Tambahkan toast ke body
    document.body.appendChild(toast);

    // Animasi masuk (muncul)
    // Gunakan requestAnimationFrame agar transisi berjalan
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
    });

    // Geser toast yang sudah ada ke atas agar tidak bertumpuk
    var existingToasts = document.querySelectorAll('.medcare-toast');
    var offset = 0;
    for (var i = existingToasts.length - 2; i >= 0; i--) {
        offset += existingToasts[i].offsetHeight + 10;
        existingToasts[i].style.bottom = (24 + offset) + 'px';
    }

    // Otomatis hilang setelah 3 detik
    setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';

        // Hapus elemen setelah animasi selesai
        setTimeout(function () {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400);
    }, 3000);
}

// ============================================================
// Ekspor ke window untuk akses lintas modul
// ============================================================
window.MedCareCart = {
    getCartItems: getCartItems,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateCartQuantity: updateCartQuantity,
    clearCart: clearCart,
    getCartCount: getCartCount,
    getCartTotal: getCartTotal,
    getCartItemDetails: getCartItemDetails,
    updateCartBadge: updateCartBadge,
    showToast: showToast
};

// Global exports
window.getCartItems = getCartItems;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.getCartCount = getCartCount;
window.getCartTotal = getCartTotal;
window.getCartItemDetails = getCartItemDetails;
window.updateCartBadge = updateCartBadge;
window.showToast = showToast;
