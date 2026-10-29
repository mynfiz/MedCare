// ============================================================
// products.js — Data produk dan fungsi pencarian/filter
// File ini berisi database produk demo dan fungsi-fungsi untuk
// mencari, memfilter, dan menampilkan produk.
// ============================================================


// ============================================================
// DAFTAR KATEGORI PRODUK
// Setiap kategori memiliki ID unik, nama tampilan, dan ikon emoji.
// ============================================================
const PRODUCT_CATEGORIES = [
    {
        id: 'batuk-pilek',
        name: 'Obat Batuk dan Pilek',
        icon: '🤧'
    },
    {
        id: 'vitamin',
        name: 'Vitamin dan Suplemen',
        icon: '💊'
    },
    {
        id: 'perawatan',
        name: 'Perawatan Kesehatan',
        icon: '🩹'
    },
    {
        id: 'perlengkapan',
        name: 'Perlengkapan Medis',
        icon: '🩺'
    }
];


// ============================================================
// DATABASE PRODUK
// Berisi minimal 18 produk lengkap dengan detail informasi.
// Data ini akan digunakan di seluruh halaman website MedCare.
// ============================================================
const PRODUCTS = [
    // --------------------------------------------------------
    // KATEGORI: Obat Batuk dan Pilek
    // --------------------------------------------------------
    {
        id: 'prod-001',
        name: 'Paracetamol 500mg',
        category: 'batuk-pilek',
        categoryName: 'Obat Batuk dan Pilek',
        price: 8500,
        description: 'Obat pereda nyeri dan penurun demam yang efektif. Cocok untuk meredakan sakit kepala, nyeri otot, dan demam ringan hingga sedang.',
        image: '💊',
        stock: 45,
        isPrescription: false,
        usage: 'Dewasa: 1-2 tablet, 3-4 kali sehari. Anak 6-12 tahun: ½-1 tablet, 3-4 kali sehari setelah makan.',
        warnings: 'Jangan melebihi dosis 8 tablet per hari. Tidak untuk penderita gangguan hati berat. Konsultasikan dengan dokter jika demam berlanjut lebih dari 3 hari.'
    },
    {
        id: 'prod-002',
        name: 'Ambroxol Sirup',
        category: 'batuk-pilek',
        categoryName: 'Obat Batuk dan Pilek',
        price: 25000,
        description: 'Sirup pengencer dahak untuk membantu meredakan batuk berdahak. Bekerja dengan mengencerkan lendir sehingga lebih mudah dikeluarkan.',
        image: '🫁',
        stock: 30,
        isPrescription: false,
        usage: 'Dewasa: 10 ml, 3 kali sehari. Anak 5-12 tahun: 5 ml, 2-3 kali sehari setelah makan.',
        warnings: 'Kocok dahulu sebelum diminum. Tidak dianjurkan untuk anak di bawah 2 tahun tanpa resep dokter.'
    },
    {
        id: 'prod-004',
        name: 'OBH Combi Batuk',
        category: 'batuk-pilek',
        categoryName: 'Obat Batuk dan Pilek',
        price: 18000,
        description: 'Obat batuk hitam yang efektif untuk meredakan batuk dan melegakan tenggorokan. Formulasi herbal yang sudah terpercaya turun-temurun.',
        image: '🍯',
        stock: 35,
        isPrescription: false,
        usage: 'Dewasa: 15 ml, 3 kali sehari. Anak 6-12 tahun: 7.5 ml, 3 kali sehari.',
        warnings: 'Dapat menyebabkan kantuk. Hindari mengemudi setelah minum obat ini.'
    },
    {
        id: 'prod-008',
        name: 'Antangin Herbal',
        category: 'batuk-pilek',
        categoryName: 'Obat Batuk dan Pilek',
        price: 5000,
        description: 'Jamu herbal untuk meredakan gejala masuk angin seperti perut kembung, mual, dan pegal-pegal. Terbuat dari bahan alami pilihan.',
        image: '🌿',
        stock: 50,
        isPrescription: false,
        usage: 'Dewasa: 1 sachet, 2-3 kali sehari. Bisa diminum langsung atau dicampur air hangat.',
        warnings: 'Tidak dianjurkan untuk ibu hamil dan menyusui. Hentikan penggunaan jika terjadi reaksi alergi.'
    },
    {
        id: 'prod-012',
        name: 'Vicks VapoRub',
        category: 'batuk-pilek',
        categoryName: 'Obat Batuk dan Pilek',
        price: 22000,
        description: 'Balsem pereda batuk dan hidung tersumbat. Mengandung campuran mentol, kamper, dan minyak kayu putih untuk memberikan rasa lega.',
        image: '💨',
        stock: 25,
        isPrescription: false,
        usage: 'Oleskan pada dada, leher, dan punggung. Bisa juga dihirup uapnya dengan menambahkan ke air panas.',
        warnings: 'Hanya untuk pemakaian luar. Hindari kontak dengan mata dan luka terbuka. Tidak untuk anak di bawah 2 tahun.'
    },
    {
        id: 'prod-017',
        name: 'Strepsils Pelega Tenggorokan',
        category: 'batuk-pilek',
        categoryName: 'Obat Batuk dan Pilek',
        price: 12000,
        description: 'Tablet hisap untuk meredakan sakit tenggorokan dan iritasi ringan. Memberikan efek melegakan yang cepat dan tahan lama.',
        image: '🍬',
        stock: 40,
        isPrescription: false,
        usage: 'Hisap 1 tablet setiap 2-3 jam sesuai kebutuhan. Maksimal 12 tablet per hari.',
        warnings: 'Tidak direkomendasikan untuk anak di bawah 6 tahun. Jangan dikunyah, hisap perlahan.'
    },

    // --------------------------------------------------------
    // KATEGORI: Vitamin dan Suplemen
    // --------------------------------------------------------
    {
        id: 'prod-003',
        name: 'Vitamin C 1000mg',
        category: 'vitamin',
        categoryName: 'Vitamin dan Suplemen',
        price: 45000,
        description: 'Suplemen vitamin C dosis tinggi untuk menjaga daya tahan tubuh. Membantu melindungi sel-sel tubuh dari radikal bebas.',
        image: '🍊',
        stock: 20,
        isPrescription: false,
        usage: 'Dewasa: 1 tablet effervescent per hari, larutkan dalam segelas air. Minum setelah makan.',
        warnings: 'Tidak melebihi dosis yang dianjurkan. Konsultasikan dengan dokter jika sedang mengonsumsi obat lain.'
    },
    {
        id: 'prod-011',
        name: 'Vitamin D3 1000 IU',
        category: 'vitamin',
        categoryName: 'Vitamin dan Suplemen',
        price: 55000,
        description: 'Suplemen vitamin D3 untuk menjaga kesehatan tulang dan gigi. Membantu penyerapan kalsium dan mendukung sistem imun tubuh.',
        image: '☀️',
        stock: 18,
        isPrescription: false,
        usage: 'Dewasa: 1 tablet per hari, diminum bersama makanan yang mengandung lemak untuk penyerapan optimal.',
        warnings: 'Jangan mengonsumsi lebih dari 4000 IU per hari tanpa saran dokter. Simpan di tempat kering dan sejuk.'
    },
    {
        id: 'prod-015',
        name: 'Multivitamin Lengkap',
        category: 'vitamin',
        categoryName: 'Vitamin dan Suplemen',
        price: 75000,
        description: 'Multivitamin harian yang mengandung vitamin A, B kompleks, C, D, E, dan mineral penting. Mendukung kesehatan tubuh secara menyeluruh.',
        image: '💎',
        stock: 15,
        isPrescription: false,
        usage: 'Dewasa: 1 kaplet per hari setelah makan pagi. Telan dengan air putih.',
        warnings: 'Tidak untuk anak di bawah 12 tahun. Hentikan pemakaian jika terjadi reaksi alergi. Simpan di tempat kering.'
    },
    {
        id: 'prod-018',
        name: 'Madu Herbal TJ',
        category: 'vitamin',
        categoryName: 'Vitamin dan Suplemen',
        price: 35000,
        description: 'Madu murni dengan campuran herbal alami untuk meningkatkan stamina dan daya tahan tubuh. Kaya akan antioksidan dan nutrisi alami.',
        image: '🍯',
        stock: 22,
        isPrescription: false,
        usage: 'Dewasa: 1-2 sendok makan per hari. Bisa dicampur dengan air hangat atau diminum langsung.',
        warnings: 'Tidak untuk bayi di bawah 1 tahun. Penderita diabetes konsultasikan dengan dokter sebelum mengonsumsi.'
    },

    // --------------------------------------------------------
    // KATEGORI: Perawatan Kesehatan
    // --------------------------------------------------------
    {
        id: 'prod-005',
        name: 'Minyak Kayu Putih',
        category: 'perawatan',
        categoryName: 'Perawatan Kesehatan',
        price: 15000,
        description: 'Minyak angin kayu putih untuk menghangatkan badan dan meredakan perut kembung. Aroma khas yang menyegarkan dan melegakan.',
        image: '🌡️',
        stock: 40,
        isPrescription: false,
        usage: 'Oleskan secukupnya pada bagian perut, dada, atau punggung. Bisa juga diteteskan ke air hangat untuk dihirup.',
        warnings: 'Hanya untuk pemakaian luar. Hindari kontak dengan mata dan kulit yang luka.'
    },
    {
        id: 'prod-009',
        name: 'Betadine Antiseptik',
        category: 'perawatan',
        categoryName: 'Perawatan Kesehatan',
        price: 28000,
        description: 'Larutan antiseptik untuk membersihkan dan mencegah infeksi pada luka kecil. Efektif membunuh kuman dan bakteri penyebab infeksi.',
        image: '🧴',
        stock: 25,
        isPrescription: false,
        usage: 'Bersihkan luka terlebih dahulu. Oleskan Betadine secukupnya pada area luka, biarkan mengering. Ulangi 2-3 kali sehari.',
        warnings: 'Hanya untuk pemakaian luar. Jangan digunakan pada luka bakar yang luas. Hindari kontak dengan mata.'
    },
    {
        id: 'prod-010',
        name: 'Hansaplast Plester',
        category: 'perawatan',
        categoryName: 'Perawatan Kesehatan',
        price: 12000,
        description: 'Plester luka steril dengan bantalan anti lengket untuk melindungi luka kecil. Tahan air dan nyaman dipakai sepanjang hari.',
        image: '🩹',
        stock: 0,
        isPrescription: false,
        usage: 'Bersihkan luka, keringkan area sekitarnya. Tempelkan plester menutupi seluruh luka. Ganti setiap hari atau saat basah/kotor.',
        warnings: 'Hanya untuk luka kecil dan gores ringan. Untuk luka yang dalam atau berdarah hebat, segera ke fasilitas kesehatan.'
    },
    {
        id: 'prod-016',
        name: 'Hand Sanitizer 500ml',
        category: 'perawatan',
        categoryName: 'Perawatan Kesehatan',
        price: 32000,
        description: 'Gel pembersih tangan dengan kandungan alkohol 70% yang efektif membunuh kuman. Dilengkapi pelembab untuk menjaga kelembutan tangan.',
        image: '🧼',
        stock: 30,
        isPrescription: false,
        usage: 'Tuang secukupnya ke telapak tangan. Gosok kedua tangan hingga seluruh permukaan terkena, biarkan mengering tanpa dibilas.',
        warnings: 'Hanya untuk pemakaian luar. Jauhkan dari api dan sumber panas. Hindari kontak dengan mata.'
    },

    // --------------------------------------------------------
    // KATEGORI: Perlengkapan Medis
    // --------------------------------------------------------
    {
        id: 'prod-006',
        name: 'Masker Medis 3 Ply',
        category: 'perlengkapan',
        categoryName: 'Perlengkapan Medis',
        price: 25000,
        description: 'Masker bedah 3 lapis isi 50 lembar. Efektif menyaring partikel dan melindungi dari droplet. Cocok untuk penggunaan sehari-hari.',
        image: '😷',
        stock: 50,
        isPrescription: false,
        usage: 'Gunakan satu masker untuk sekali pakai (maksimal 4-8 jam). Pastikan sisi berwarna menghadap ke luar.',
        warnings: 'Sekali pakai, jangan dicuci atau digunakan ulang. Buang di tempat sampah tertutup setelah digunakan.'
    },
    {
        id: 'prod-007',
        name: 'Termometer Digital',
        category: 'perlengkapan',
        categoryName: 'Perlengkapan Medis',
        price: 45000,
        description: 'Termometer digital dengan akurasi tinggi untuk mengukur suhu tubuh. Hasil pengukuran tampil dalam 60 detik dengan layar LCD.',
        image: '🌡️',
        stock: 12,
        isPrescription: false,
        usage: 'Nyalakan, letakkan ujung sensor di ketiak atau mulut. Tunggu bunyi bip, baca hasil di layar. Bersihkan setelah pakai.',
        warnings: 'Jangan digunakan untuk mengukur suhu air atau makanan. Simpan di tempat kering. Ganti baterai jika layar redup.'
    },

    // --------------------------------------------------------
    // PRODUK DENGAN RESEP DOKTER
    // --------------------------------------------------------
    {
        id: 'prod-013',
        name: 'Dexamethasone 0.5mg',
        category: 'batuk-pilek',
        categoryName: 'Obat Batuk dan Pilek',
        price: 5500,
        description: 'Obat antiinflamasi kortikosteroid untuk mengatasi peradangan dan reaksi alergi berat. Memerlukan resep dan pengawasan dokter.',
        image: '💉',
        stock: 15,
        isPrescription: true,
        usage: 'Sesuai petunjuk dokter. Biasanya 0.5-9 mg per hari dibagi dalam beberapa dosis.',
        warnings: '⚠️ OBAT RESEP — Harus dengan resep dokter. Jangan menghentikan penggunaan secara tiba-tiba. Dapat menyebabkan efek samping serius jika disalahgunakan.'
    },
    {
        id: 'prod-014',
        name: 'Amoxicillin 500mg',
        category: 'batuk-pilek',
        categoryName: 'Obat Batuk dan Pilek',
        price: 12000,
        description: 'Antibiotik golongan penisilin untuk mengobati infeksi bakteri. Harus diminum sesuai resep dokter hingga habis.',
        image: '💊',
        stock: 0,
        isPrescription: true,
        usage: 'Sesuai resep dokter. Umumnya 500 mg setiap 8 jam selama 5-7 hari. Habiskan seluruh dosis meski sudah merasa baik.',
        warnings: '⚠️ OBAT RESEP — Harus dengan resep dokter. Jangan digunakan jika alergi penisilin. Hentikan dan hubungi dokter jika terjadi ruam atau reaksi alergi.'
    }
];


// ============================================================
// FUNGSI-FUNGSI UTILITAS PRODUK
// ============================================================

/**
 * Mengambil semua produk dari database.
 * Mengembalikan salinan array agar data asli tidak berubah.
 *
 * @returns {Array} — Array berisi semua objek produk
 */
function getAllProducts() {
    // Kembalikan salinan (copy) agar data asli tetap aman
    return PRODUCTS.slice();
}


/**
 * Mencari satu produk berdasarkan ID-nya.
 *
 * @param {string} id — ID produk yang dicari (contoh: "prod-001")
 * @returns {Object|null} — Objek produk jika ditemukan, null jika tidak
 */
function getProductById(id) {
    if (!id) {
        console.warn('ID produk tidak boleh kosong.');
        return null;
    }

    const product = PRODUCTS.find(function(p) {
        return p.id === id;
    });

    // Kembalikan salinan objek agar data asli tidak termodifikasi
    return product ? Object.assign({}, product) : null;
}


/**
 * Memfilter produk berdasarkan kategori.
 *
 * @param {string} categoryId — ID kategori (contoh: "batuk-pilek", "vitamin")
 * @returns {Array} — Array produk yang sesuai dengan kategori
 */
function getProductsByCategory(categoryId) {
    if (!categoryId) {
        // Jika tidak ada filter kategori, kembalikan semua produk
        return getAllProducts();
    }

    return PRODUCTS.filter(function(product) {
        return product.category === categoryId;
    });
}


/**
 * Mencari produk berdasarkan kata kunci pada nama produk.
 * Pencarian tidak case-sensitive dan mendukung pencocokan parsial.
 *
 * @param {string} query — Kata kunci pencarian
 * @returns {Array} — Array produk yang cocok dengan pencarian
 */
function searchProducts(query) {
    // Jika query kosong, kembalikan semua produk
    if (!query || query.trim() === '') {
        return getAllProducts();
    }

    // Ubah ke huruf kecil untuk pencarian yang tidak case-sensitive
    const lowerQuery = query.toLowerCase().trim();

    return PRODUCTS.filter(function(product) {
        // Cari kecocokan di nama produk, deskripsi, dan nama kategori
        const nameMatch = product.name.toLowerCase().includes(lowerQuery);
        const descMatch = product.description.toLowerCase().includes(lowerQuery);
        const categoryMatch = product.categoryName.toLowerCase().includes(lowerQuery);

        return nameMatch || descMatch || categoryMatch;
    });
}


/**
 * Memfilter produk berdasarkan kombinasi kategori dan kata kunci.
 * Kedua parameter bersifat opsional — jika tidak diisi, semua produk ditampilkan.
 *
 * @param {string} categoryId — ID kategori (opsional, kosongkan untuk semua)
 * @param {string} query — Kata kunci pencarian (opsional)
 * @returns {Array} — Array produk yang sesuai filter
 */
function filterProducts(categoryId, query) {
    let results = getAllProducts();

    // Filter berdasarkan kategori jika ada
    if (categoryId && categoryId.trim() !== '') {
        results = results.filter(function(product) {
            return product.category === categoryId;
        });
    }

    // Filter berdasarkan kata kunci jika ada
    if (query && query.trim() !== '') {
        const lowerQuery = query.toLowerCase().trim();

        results = results.filter(function(product) {
            const nameMatch = product.name.toLowerCase().includes(lowerQuery);
            const descMatch = product.description.toLowerCase().includes(lowerQuery);
            return nameMatch || descMatch;
        });
    }

    return results;
}


/**
 * Memformat angka harga menjadi format Rupiah Indonesia.
 * Contoh: 25000 → "Rp 25.000"
 *
 * @param {number} number — Angka harga yang akan diformat
 * @returns {string} — Harga dalam format Rupiah
 */
function formatPrice(number) {
    // Pastikan input berupa angka
    if (typeof number !== 'number' || isNaN(number)) {
        return 'Rp 0';
    }

    // Gunakan toLocaleString dengan locale Indonesia
    // Ini otomatis menambahkan titik sebagai pemisah ribuan
    return 'Rp ' + number.toLocaleString('id-ID');
}


/**
 * Mengambil daftar semua kategori produk yang tersedia.
 * Setiap kategori berisi ID, nama, dan ikon emoji.
 *
 * @returns {Array} — Array objek kategori {id, name, icon}
 */
function getCategories() {
    // Kembalikan salinan array kategori
    return PRODUCT_CATEGORIES.slice();
}


/**
 * Menghitung jumlah produk dalam setiap kategori.
 * Berguna untuk menampilkan badge jumlah di menu kategori.
 *
 * @returns {Object} — Objek dengan key = categoryId, value = jumlah produk
 */
function getCategoryCounts() {
    const counts = {};

    // Inisialisasi semua kategori dengan 0
    PRODUCT_CATEGORIES.forEach(function(cat) {
        counts[cat.id] = 0;
    });

    // Hitung jumlah produk di setiap kategori
    PRODUCTS.forEach(function(product) {
        if (counts[product.category] !== undefined) {
            counts[product.category]++;
        }
    });

    return counts;
}


/**
 * Mengambil produk-produk unggulan / populer untuk ditampilkan
 * di halaman utama. Mengembalikan 6 produk pertama yang bukan
 * obat resep dan tersedia stoknya.
 *
 * @param {number} limit — Jumlah produk yang dikembalikan (default: 6)
 * @returns {Array} — Array produk unggulan
 */
function getFeaturedProducts(limit = 6) {
    return PRODUCTS
        .filter(function(product) {
            // Hanya produk non-resep yang stoknya tersedia
            return !product.isPrescription && product.stock > 0;
        })
        .slice(0, limit);
}


/**
 * Mengecek apakah stok produk tersedia.
 *
 * @param {string} productId — ID produk
 * @returns {boolean} — true jika stok > 0
 */
function isInStock(productId) {
    const product = getProductById(productId);
    return product ? product.stock > 0 : false;
}


/**
 * Mengurutkan produk berdasarkan kriteria tertentu.
 *
 * @param {Array} products — Array produk yang akan diurutkan
 * @param {string} sortBy — Kriteria pengurutan: 'price-asc', 'price-desc', 'name-asc', 'name-desc'
 * @returns {Array} — Array produk yang sudah diurutkan
 */
function sortProducts(products, sortBy) {
    // Buat salinan agar array asli tidak berubah
    const sorted = products.slice();

    switch (sortBy) {
        case 'price-asc':
            // Urutkan berdasarkan harga terendah
            sorted.sort(function(a, b) {
                return a.price - b.price;
            });
            break;
        case 'price-desc':
            // Urutkan berdasarkan harga tertinggi
            sorted.sort(function(a, b) {
                return b.price - a.price;
            });
            break;
        case 'name-asc':
            // Urutkan berdasarkan nama A-Z
            sorted.sort(function(a, b) {
                return a.name.localeCompare(b.name, 'id');
            });
            break;
        case 'name-desc':
            // Urutkan berdasarkan nama Z-A
            sorted.sort(function(a, b) {
                return b.name.localeCompare(a.name, 'id');
            });
            break;
        default:
            // Tidak ada pengurutan, kembalikan apa adanya
            break;
    }

    return sorted;
}


// ============================================================
// Ekspor semua fungsi dan data ke scope global (window)
// agar bisa diakses dari file JavaScript lain.
// ============================================================
window.MedCareProducts = {
    // Data
    PRODUCTS: PRODUCTS,
    CATEGORIES: PRODUCT_CATEGORIES,

    // Fungsi pengambilan data
    getAllProducts: getAllProducts,
    getProductById: getProductById,
    getProductsByCategory: getProductsByCategory,
    getCategories: getCategories,
    getCategoryCounts: getCategoryCounts,
    getFeaturedProducts: getFeaturedProducts,

    // Fungsi pencarian dan filter
    searchProducts: searchProducts,
    filterProducts: filterProducts,
    sortProducts: sortProducts,

    // Fungsi utilitas
    formatPrice: formatPrice,
    isInStock: isInStock
};

// Global exports
window.getAllProducts = getAllProducts;
window.getProductById = getProductById;
window.getProductsByCategory = getProductsByCategory;
window.getCategories = getCategories;
window.getCategoryCounts = getCategoryCounts;
window.getFeaturedProducts = getFeaturedProducts;
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
window.formatPrice = formatPrice;
window.isInStock = isInStock;

// Log konfirmasi bahwa modul produk berhasil dimuat
console.info('✅ MedCare Products module berhasil dimuat. Total produk:', PRODUCTS.length);
