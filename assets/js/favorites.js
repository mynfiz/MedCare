// favorites.js — Fungsi-fungsi produk favorit
// Mengelola daftar produk favorit pengguna
// Bergantung pada: storage.js (harus dimuat terlebih dahulu)

// ============================================================
// KUNCI PENYIMPANAN
// ============================================================
var FAVORITES_STORAGE_KEY = 'medcare_favorites';

// ============================================================
// getFavorites — Mengambil daftar produk favorit dari penyimpanan
// Mengembalikan array berisi ID produk yang difavoritkan
// ============================================================
function getFavorites() {
    var favorites = getFromStorage(FAVORITES_STORAGE_KEY);
    // Jika belum ada data favorit, kembalikan array kosong
    if (!favorites || !Array.isArray(favorites)) {
        return [];
    }
    return favorites;
}

// ============================================================
// saveFavorites — Menyimpan daftar favorit ke penyimpanan lokal
// (fungsi internal)
// ============================================================
function saveFavorites(favorites) {
    saveToStorage(FAVORITES_STORAGE_KEY, favorites);
}

// ============================================================
// isFavorite — Mengecek apakah produk ada di daftar favorit
// productId: ID produk yang akan dicek
// Mengembalikan true jika produk ada di favorit, false jika tidak
// ============================================================
function isFavorite(productId) {
    var favorites = getFavorites();

    for (var i = 0; i < favorites.length; i++) {
        if (favorites[i] === productId) {
            return true;
        }
    }

    return false;
}

// ============================================================
// toggleFavorite — Menambah atau menghapus produk dari favorit
// productId: ID produk yang akan di-toggle
// Mengembalikan true jika ditambahkan, false jika dihapus
// ============================================================
function toggleFavorite(productId) {
    var favorites = getFavorites();

    // Cek apakah produk sudah ada di favorit
    var index = -1;
    for (var i = 0; i < favorites.length; i++) {
        if (favorites[i] === productId) {
            index = i;
            break;
        }
    }

    if (index !== -1) {
        // Produk sudah ada di favorit — hapus
        favorites.splice(index, 1);
        saveFavorites(favorites);
        showToast('Produk dihapus dari favorit.', 'success');
        return false;
    } else {
        // Produk belum ada — tambahkan
        favorites.push(productId);
        saveFavorites(favorites);
        showToast('Produk ditambahkan ke favorit!', 'success');
        return true;
    }
}

// ============================================================
// renderFavoriteButton — Menghasilkan HTML tombol favorit (hati)
// productId: ID produk untuk tombol ini
// Mengembalikan string HTML untuk tombol hati dengan status yang benar
// Hati merah terisi = favorit, hati outline = belum favorit
// ============================================================
function renderFavoriteButton(productId) {
    var favorited = isFavorite(productId);

    // SVG ikon hati — terisi jika favorit, outline jika belum
    var heartSVG = '';
    if (favorited) {
        // Hati terisi (merah) — produk sudah difavoritkan
        heartSVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#E74C3C" stroke="#E74C3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>' +
            '</svg>';
    } else {
        // Hati outline — produk belum difavoritkan
        heartSVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>' +
            '</svg>';
    }

    // Tombol dengan atribut data untuk identifikasi produk
    return '<button type="button" class="favorite-btn" data-product-id="' + productId + '" ' +
        'aria-label="' + (favorited ? 'Hapus dari favorit' : 'Tambahkan ke favorit') + '" ' +
        'title="' + (favorited ? 'Hapus dari favorit' : 'Tambahkan ke favorit') + '" ' +
        'style="background:none;border:none;cursor:pointer;padding:6px;display:inline-flex;' +
        'align-items:center;justify-content:center;border-radius:50%;transition:transform 0.2s ease;">' +
        heartSVG +
        '</button>';
}

// ============================================================
// initFavoriteButtons — Menginisialisasi event handler tombol favorit
// Menggunakan event delegation pada dokumen untuk menangani klik
// pada semua tombol .favorite-btn (termasuk yang ditambahkan dinamis)
// ============================================================
function initFavoriteButtons() {
    // Gunakan event delegation agar tombol dinamis juga terdeteksi
    document.addEventListener('click', function (event) {
        // Cari tombol favorit terdekat dari elemen yang diklik
        var btn = event.target.closest('.favorite-btn');
        if (!btn) return;

        // Ambil ID produk dari atribut data
        var productId = btn.getAttribute('data-product-id');
        if (!productId) return;

        // Konversi ke angka jika diperlukan
        var id = isNaN(Number(productId)) ? productId : Number(productId);

        // Toggle status favorit
        var isNowFavorite = toggleFavorite(id);

        // Perbarui tampilan tombol
        updateFavoriteButtonUI(btn, isNowFavorite);

        // Tambahkan efek animasi kecil saat diklik
        btn.style.transform = 'scale(1.3)';
        setTimeout(function () {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
}

// ============================================================
// updateFavoriteButtonUI — Memperbarui tampilan tombol favorit
// btn: elemen tombol yang akan diperbarui
// isFav: status favorit baru (true/false)
// ============================================================
function updateFavoriteButtonUI(btn, isFav) {
    if (isFav) {
        // Ubah ke hati terisi (merah)
        btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#E74C3C" stroke="#E74C3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>' +
            '</svg>';
        btn.setAttribute('aria-label', 'Hapus dari favorit');
        btn.setAttribute('title', 'Hapus dari favorit');
    } else {
        // Ubah ke hati outline
        btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>' +
            '</svg>';
        btn.setAttribute('aria-label', 'Tambahkan ke favorit');
        btn.setAttribute('title', 'Tambahkan ke favorit');
    }
}

// ============================================================
// Ekspor ke window untuk akses lintas modul
// ============================================================
window.MedCareFavorites = {
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,
    renderFavoriteButton: renderFavoriteButton,
    initFavoriteButtons: initFavoriteButtons,
    updateFavoriteButtonUI: updateFavoriteButtonUI
};

window.getFavorites = getFavorites;
window.isFavorite = isFavorite;
window.toggleFavorite = toggleFavorite;
window.renderFavoriteButton = renderFavoriteButton;
window.initFavoriteButtons = initFavoriteButtons;
