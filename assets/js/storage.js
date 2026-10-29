// ============================================================
// storage.js — Utilitas penyimpanan data menggunakan LocalStorage
// File ini menyediakan fungsi-fungsi untuk menyimpan dan mengambil data
// dari browser LocalStorage dengan penanganan error yang aman.
// ============================================================

/**
 * Namespace prefix untuk semua key MedCare
 * Mencegah konflik dengan data website lain yang tersimpan
 * di browser yang sama.
 */
const STORAGE_PREFIX = 'medcare_';

/**
 * Daftar key penyimpanan yang digunakan di seluruh aplikasi.
 * Gunakan konstanta ini agar nama key konsisten dan
 * menghindari kesalahan pengetikan (typo).
 */
const STORAGE_KEYS = {
    CART: 'medcare_cart',               // Keranjang belanja
    FAVORITES: 'medcare_favorites',     // Daftar produk favorit
    PREFERENCES: 'medcare_preferences', // Preferensi pengguna (tema, dll.)
    SYMPTOM_HISTORY: 'medcare_symptom_history' // Riwayat cek gejala
};


// ============================================================
// FUNGSI DASAR PENYIMPANAN
// ============================================================

/**
 * Mengecek apakah LocalStorage tersedia dan bisa digunakan.
 * Beberapa browser dalam mode privat atau dengan penyimpanan penuh
 * mungkin memblokir akses ke LocalStorage.
 *
 * @returns {boolean} — true jika LocalStorage dapat digunakan
 */
function isStorageAvailable() {
    try {
        // Coba tulis dan baca data uji ke LocalStorage
        const testKey = STORAGE_PREFIX + '__test__';
        localStorage.setItem(testKey, 'test');
        const result = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);

        // Pastikan data yang dibaca sama dengan yang ditulis
        return result === 'test';
    } catch (error) {
        // Jika terjadi error (misalnya akses ditolak), kembalikan false
        console.warn('LocalStorage tidak tersedia:', error.message);
        return false;
    }
}


/**
 * Mengambil data dari LocalStorage berdasarkan key.
 * Data yang tersimpan dalam format JSON akan otomatis di-parse.
 * Jika data tidak ditemukan atau rusak, kembalikan nilai default.
 *
 * @param {string} key — Nama key penyimpanan
 * @param {*} defaultValue — Nilai yang dikembalikan jika key tidak ada
 * @returns {*} — Data yang tersimpan, atau defaultValue
 */
function getItem(key, defaultValue = null) {
    // Periksa apakah LocalStorage tersedia
    if (!isStorageAvailable()) {
        console.warn('Tidak bisa mengambil data: LocalStorage tidak tersedia.');
        return defaultValue;
    }

    try {
        const rawData = localStorage.getItem(key);

        // Jika key tidak ditemukan, kembalikan nilai default
        if (rawData === null || rawData === undefined) {
            return defaultValue;
        }

        // Coba parse data JSON
        const parsedData = JSON.parse(rawData);
        return parsedData;
    } catch (error) {
        // Jika data rusak (bukan JSON valid), hapus dan kembalikan default
        console.warn(`Data untuk key "${key}" rusak, mengembalikan nilai default:`, error.message);
        try {
            localStorage.removeItem(key);
        } catch (removeError) {
            // Abaikan jika penghapusan juga gagal
        }
        return defaultValue;
    }
}


/**
 * Menyimpan data ke LocalStorage.
 * Data akan dikonversi ke format JSON sebelum disimpan.
 * Menangani error kuota penuh (QuotaExceededError).
 *
 * @param {string} key — Nama key penyimpanan
 * @param {*} value — Data yang akan disimpan (objek, array, string, dll.)
 * @returns {boolean} — true jika berhasil disimpan, false jika gagal
 */
function setItem(key, value) {
    // Periksa apakah LocalStorage tersedia
    if (!isStorageAvailable()) {
        console.warn('Tidak bisa menyimpan data: LocalStorage tidak tersedia.');
        return false;
    }

    try {
        // Konversi data ke format JSON dan simpan
        const jsonData = JSON.stringify(value);
        localStorage.setItem(key, jsonData);
        return true;
    } catch (error) {
        // Tangani error kuota penuh
        if (error.name === 'QuotaExceededError' ||
            error.code === 22 ||
            error.code === 1014) {
            console.error('Penyimpanan penuh! Tidak bisa menyimpan data baru.');
            console.error('Coba hapus beberapa data lama untuk mengosongkan ruang.');
        } else {
            console.error(`Gagal menyimpan data untuk key "${key}":`, error.message);
        }
        return false;
    }
}


/**
 * Menghapus satu item dari LocalStorage berdasarkan key.
 *
 * @param {string} key — Nama key yang akan dihapus
 * @returns {boolean} — true jika berhasil dihapus, false jika gagal
 */
function removeItem(key) {
    // Periksa apakah LocalStorage tersedia
    if (!isStorageAvailable()) {
        console.warn('Tidak bisa menghapus data: LocalStorage tidak tersedia.');
        return false;
    }

    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Gagal menghapus key "${key}":`, error.message);
        return false;
    }
}


/**
 * Menghapus SEMUA data MedCare dari LocalStorage.
 * Hanya menghapus key yang diawali dengan prefix "medcare_",
 * sehingga data website lain tetap aman.
 *
 * @returns {boolean} — true jika berhasil, false jika gagal
 */
function clearAll() {
    // Periksa apakah LocalStorage tersedia
    if (!isStorageAvailable()) {
        console.warn('Tidak bisa menghapus data: LocalStorage tidak tersedia.');
        return false;
    }

    try {
        // Kumpulkan semua key MedCare terlebih dahulu
        // (tidak bisa menghapus sambil iterasi karena index berubah)
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX)) {
                keysToRemove.push(key);
            }
        }

        // Hapus semua key MedCare yang ditemukan
        keysToRemove.forEach(function(key) {
            localStorage.removeItem(key);
        });

        console.info(`Berhasil menghapus ${keysToRemove.length} item data MedCare.`);
        return true;
    } catch (error) {
        console.error('Gagal menghapus semua data MedCare:', error.message);
        return false;
    }
}


// ============================================================
// FUNGSI KERANJANG BELANJA (CART)
// ============================================================

/**
 * Mengambil data keranjang belanja dari penyimpanan.
 * Keranjang berupa array objek, masing-masing berisi
 * informasi produk dan jumlah (quantity).
 *
 * @returns {Array} — Array item keranjang, atau array kosong jika belum ada
 */
function getCart() {
    const cart = getItem(STORAGE_KEYS.CART, []);

    // Pastikan hasilnya selalu berupa array
    if (!Array.isArray(cart)) {
        console.warn('Data keranjang rusak, mengembalikan keranjang kosong.');
        return [];
    }

    return cart;
}


/**
 * Menyimpan data keranjang belanja ke penyimpanan.
 *
 * @param {Array} cart — Array item keranjang yang akan disimpan
 * @returns {boolean} — true jika berhasil disimpan
 */
function setCart(cart) {
    // Validasi: pastikan parameter berupa array
    if (!Array.isArray(cart)) {
        console.error('setCart membutuhkan parameter array.');
        return false;
    }

    return setItem(STORAGE_KEYS.CART, cart);
}


/**
 * Menghitung total jumlah item di keranjang belanja.
 * Berguna untuk menampilkan badge angka pada ikon keranjang.
 *
 * @returns {number} — Total jumlah semua item di keranjang
 */
function getCartCount() {
    const cart = getCart();
    return cart.reduce(function(total, item) {
        return total + (item.quantity || 1);
    }, 0);
}


/**
 * Menambahkan produk ke keranjang atau menambah jumlahnya
 * jika sudah ada di keranjang.
 *
 * @param {Object} product — Objek produk yang akan ditambahkan
 * @param {number} quantity — Jumlah yang ditambahkan (default: 1)
 * @returns {boolean} — true jika berhasil
 */
function addToCart(product, quantity = 1) {
    if (!product || !product.id) {
        console.error('Produk tidak valid untuk ditambahkan ke keranjang.');
        return false;
    }

    const cart = getCart();

    // Cek apakah produk sudah ada di keranjang
    const existingIndex = cart.findIndex(function(item) {
        return item.id === product.id;
    });

    if (existingIndex >= 0) {
        // Produk sudah ada, tambah jumlahnya
        cart[existingIndex].quantity += quantity;
    } else {
        // Produk belum ada, tambahkan ke keranjang
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            isPrescription: product.isPrescription || false
        });
    }

    return setCart(cart);
}


/**
 * Menghapus produk dari keranjang berdasarkan ID produk.
 *
 * @param {string} productId — ID produk yang akan dihapus
 * @returns {boolean} — true jika berhasil
 */
function removeFromCart(productId) {
    const cart = getCart();
    const filteredCart = cart.filter(function(item) {
        return item.id !== productId;
    });

    return setCart(filteredCart);
}


/**
 * Mengubah jumlah produk tertentu di keranjang.
 * Jika jumlah menjadi 0 atau kurang, produk dihapus dari keranjang.
 *
 * @param {string} productId — ID produk yang jumlahnya diubah
 * @param {number} newQuantity — Jumlah baru
 * @returns {boolean} — true jika berhasil
 */
function updateCartQuantity(productId, newQuantity) {
    // Jika jumlah baru 0 atau kurang, hapus produk dari keranjang
    if (newQuantity <= 0) {
        return removeFromCart(productId);
    }

    const cart = getCart();

    const itemIndex = cart.findIndex(function(item) {
        return item.id === productId;
    });

    if (itemIndex >= 0) {
        cart[itemIndex].quantity = newQuantity;
        return setCart(cart);
    }

    console.warn(`Produk dengan ID "${productId}" tidak ditemukan di keranjang.`);
    return false;
}


// ============================================================
// FUNGSI PRODUK FAVORIT
// ============================================================

/**
 * Mengambil daftar ID produk favorit dari penyimpanan.
 *
 * @returns {Array} — Array berisi ID produk favorit, atau array kosong
 */
function getFavorites() {
    const favorites = getItem(STORAGE_KEYS.FAVORITES, []);

    // Pastikan hasilnya selalu berupa array
    if (!Array.isArray(favorites)) {
        console.warn('Data favorit rusak, mengembalikan daftar kosong.');
        return [];
    }

    return favorites;
}


/**
 * Menyimpan daftar produk favorit ke penyimpanan.
 *
 * @param {Array} favorites — Array berisi ID produk favorit
 * @returns {boolean} — true jika berhasil disimpan
 */
function setFavorites(favorites) {
    // Validasi: pastikan parameter berupa array
    if (!Array.isArray(favorites)) {
        console.error('setFavorites membutuhkan parameter array.');
        return false;
    }

    return setItem(STORAGE_KEYS.FAVORITES, favorites);
}


/**
 * Mengecek apakah suatu produk ada di daftar favorit.
 *
 * @param {string} productId — ID produk yang dicek
 * @returns {boolean} — true jika produk ada di favorit
 */
function isFavorite(productId) {
    const favorites = getFavorites();
    return favorites.includes(productId);
}


/**
 * Menambah atau menghapus produk dari daftar favorit (toggle).
 * Jika produk sudah di favorit, akan dihapus. Jika belum, ditambahkan.
 *
 * @param {string} productId — ID produk
 * @returns {boolean} — true jika produk sekarang di favorit, false jika dihapus
 */
function toggleFavorite(productId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(productId);

    if (index >= 0) {
        // Produk sudah di favorit, hapus
        favorites.splice(index, 1);
        setFavorites(favorites);
        return false; // Tidak lagi di favorit
    } else {
        // Produk belum di favorit, tambahkan
        favorites.push(productId);
        setFavorites(favorites);
        return true; // Sekarang di favorit
    }
}


// ============================================================
// FUNGSI PREFERENSI PENGGUNA
// ============================================================

/**
 * Mengambil preferensi pengguna dari penyimpanan.
 * Preferensi mencakup pengaturan seperti tema, notifikasi, dll.
 *
 * @returns {Object} — Objek preferensi pengguna
 */
function getPreferences() {
    // Preferensi default jika belum pernah disimpan
    const defaultPreferences = {
        theme: 'light',           // Tema tampilan: 'light' atau 'dark'
        notifications: true,      // Apakah notifikasi aktif
        language: 'id',           // Bahasa: 'id' (Indonesia)
        itemsPerPage: 12          // Jumlah produk per halaman
    };

    const prefs = getItem(STORAGE_KEYS.PREFERENCES, defaultPreferences);

    // Pastikan hasilnya selalu berupa objek
    if (typeof prefs !== 'object' || prefs === null || Array.isArray(prefs)) {
        console.warn('Data preferensi rusak, mengembalikan default.');
        return defaultPreferences;
    }

    // Gabungkan dengan default untuk mengisi properti yang hilang
    return Object.assign({}, defaultPreferences, prefs);
}


/**
 * Menyimpan preferensi pengguna ke penyimpanan.
 *
 * @param {Object} prefs — Objek preferensi yang akan disimpan
 * @returns {boolean} — true jika berhasil disimpan
 */
function setPreferences(prefs) {
    // Validasi: pastikan parameter berupa objek
    if (typeof prefs !== 'object' || prefs === null || Array.isArray(prefs)) {
        console.error('setPreferences membutuhkan parameter objek.');
        return false;
    }

    // Gabungkan dengan preferensi yang sudah ada
    const currentPrefs = getPreferences();
    const mergedPrefs = Object.assign({}, currentPrefs, prefs);

    return setItem(STORAGE_KEYS.PREFERENCES, mergedPrefs);
}


// ============================================================
// FUNGSI RIWAYAT CEK GEJALA
// ============================================================

/**
 * Mengambil riwayat pengecekan gejala dari penyimpanan.
 *
 * @returns {Array} — Array riwayat cek gejala
 */
function getSymptomHistory() {
    const history = getItem(STORAGE_KEYS.SYMPTOM_HISTORY, []);

    if (!Array.isArray(history)) {
        return [];
    }

    return history;
}


/**
 * Menambahkan entri baru ke riwayat cek gejala.
 *
 * @param {Object} entry — Objek berisi data gejala dan rekomendasi
 * @returns {boolean} — true jika berhasil disimpan
 */
function addSymptomHistory(entry) {
    const history = getSymptomHistory();

    // Tambahkan timestamp otomatis
    entry.timestamp = new Date().toISOString();

    // Tambahkan entri baru di awal array (yang terbaru di atas)
    history.unshift(entry);

    // Batasi riwayat maksimal 50 entri agar tidak terlalu besar
    const maxHistory = 50;
    if (history.length > maxHistory) {
        history.length = maxHistory;
    }

    return setItem(STORAGE_KEYS.SYMPTOM_HISTORY, history);
}


// ============================================================
// Ekspor semua fungsi ke scope global (window)
// agar bisa diakses dari file JavaScript lain.
// ============================================================

// Alias untuk kemudahan kompatibilitas antar file
function getFromStorage(key, defaultValue = null) {
    return getItem(key, defaultValue);
}

function saveToStorage(key, value) {
    return setItem(key, value);
}

window.getFromStorage = getFromStorage;
window.saveToStorage = saveToStorage;
window.isStorageAvailable = isStorageAvailable;
window.getItem = getItem;
window.setItem = setItem;
window.removeItem = removeItem;
window.clearAll = clearAll;

window.MedCareStorage = {
    // Konstanta
    STORAGE_KEYS: STORAGE_KEYS,

    // Fungsi dasar
    isStorageAvailable: isStorageAvailable,
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clearAll: clearAll,
    getFromStorage: getFromStorage,
    saveToStorage: saveToStorage,

    // Keranjang belanja
    getCart: getCart,
    setCart: setCart,
    getCartCount: getCartCount,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateCartQuantity: updateCartQuantity,

    // Favorit
    getFavorites: getFavorites,
    setFavorites: setFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,

    // Preferensi
    getPreferences: getPreferences,
    setPreferences: setPreferences,

    // Riwayat gejala
    getSymptomHistory: getSymptomHistory,
    addSymptomHistory: addSymptomHistory
};

// Log konfirmasi bahwa modul storage berhasil dimuat
console.info('✅ MedCare Storage module berhasil dimuat.');
