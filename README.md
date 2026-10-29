# MedCare — Online Pharmacy & Respiratory Symptom Checker

> **Tagline:** *"Teman Sehat Anda, Setiap Hari"*  
> **Kategori:** Proyek Akademik Front-End Web Development (UTS Pemrograman Web)  
> **Teknologi:** HTML5, CSS3, Vanilla JavaScript, Browser LocalStorage  

---

## 1. Deskripsi Proyek

**MedCare** adalah aplikasi web apotek online modern dan edukatif yang dilengkapi dengan fitur skrining mandiri gejala pernapasan (*Respiratory Symptom Checker*). Proyek ini dirancang sebagai pemenuhan tugas akademik mahasiswa untuk mempraktikkan keterampilan pemrograman web sisi klien (*client-side web engineering*) dengan standar UI/UX modern, aksesibel, dan bersih.

Website ini **100% berjalan tanpa server backend** (serverless) dan tanpa basis data terpusat, sehingga dapat langsung dijalankan pada browser lokal maupun dideploy secara gratis ke layanan statis seperti **GitHub Pages**.

---

## 2. Fitur Utama

### 🛒 A. Katalog Obat & Produk Kesehatan
- **Daftar Produk Lengkap:** Memuat minimal 18 produk demo realistis dengan foto/ikon emoji, kategori, harga dalam format Rupiah (`Rp XX.XXX`), dan deskripsi manfaat.
- **Pencarian Real-Time:** Mencari produk secara instan berdasarkan nama tanpa reload halaman.
- **Filter Kategori Dinamis:** Filter cepat untuk:
  - *Obat Batuk dan Pilek*
  - *Vitamin dan Suplemen*
  - *Perawatan Kesehatan*
  - *Perlengkapan Medis*
- **Detail Produk Responsif:** Navigasi berbasis parameter kueri URL (`product-detail.html?id=prod-001`), menampilkan aturan pakai, peringatan obat, dan status stok.
- **Dukungan Resep Dokter (Rx):** Indikator visual jelas bagi obat yang memerlukan resep dokter dengan proteksi untuk tidak dapat dibeli sembarangan.

### 🛍️ B. Keranjang Belanja Persisten (Shopping Cart)
- Penambahan produk ke keranjang belanja dari katalog maupun halaman detail.
- Tambah atau kurangi kuantitas item dengan pengecekan batas stok maksimum.
- Hapus item perorangan atau kosongkan seluruh keranjang melalui dialog konfirmasi.
- Perhitungan subtotal per item dan total belanja otomatis secara *real-time*.
- Badge jumlah item di *navigation bar* yang selalu sinkron di seluruh halaman.
- Persistensi data keranjang menggunakan `LocalStorage` (tetap tersimpan saat halaman di-refresh atau browser ditutup).

### ❤️ C. Daftar Favorit (Wishlist)
- Tombol ikon hati (heart) interaktif pada setiap kartu produk dan halaman detail.
- Animasi visual saat produk ditambahkan atau dihapus dari favorit.
- Data favorit tersimpan rapi di browser pengguna secara persisten.

### 🫁 D. Deteksi Gejala Pernapasan (Respiratory Symptom Checker)
- **Kuesioner Interaktif 7 Langkah (Wizard):**
  1. *Gejala Utama Saluran Napas Atas* (batuk, pilek, hidung tersumbat, bersin, sakit tenggorokan, demam)
  2. *Gejala Pernapasan Lanjut* (sesak napas, mengi/wheezing, nyeri dada, dahak pekat berwarna)
  3. *Karakteristik Demam* (ringan, sedang, tinggi, atau tanpa demam)
  4. *Durasi Gejala* (1–2 hari, 3–5 hari, 6–7 hari, >7 hari)
  5. *Perkembangan Gejala* (membaik, stabil, memburuk, pemburukan drastis)
  6. *Pemeriksaan Tanda Bahaya Darurat (Red Flags)*
  7. *Tinjau & Konfirmasi Jawaban*
- **Prioritas Keselamatan Gawat Darurat Mutlak:**
  - Jika pengguna mencentang tanda bahaya (seperti sesak napas parah, bibir membiru, kebingungan berat, nyeri dada hebat), sistem **langsung memprioritaskan peringatan darurat merah terang**, menyarankan segera menghubungi ambulans **119** atau menuju IGD terdekat.
- **Mesin Analisis Berbasis Aturan (Rule-Based Engine):**
  - Menginterpretasikan pola gejala untuk menghasilkan topik edukasi yang relevan (*Flu Biasa / Common Cold*, *Influenza*, *Rinitis Alergi*, *Bronkitis*, *Reaktivitas Bronkus/Asma*, atau *Perlu Evaluasi Dokter Segera*).
  - Menyertakan saran perawatan mandiri umum (hidrasi hangat, istirahat cukup, menjaga sirkulasi udara).
  - Tombol **Mulai Ulang Skrining** untuk mereset kuesioner dari awal.

### 📚 E. Informasi Kesehatan Terpercaya
- Artikel edukatif seputar perbedaan flu dan alergi, tips memelihara kesehatan paru-paru, dan panduan kapan harus ke dokter.

### 🏢 F. Halaman Profil & Kontak
- **Tentang Kami (About):** Menjelaskan latar belakang proyek akademik, tujuan, dan batasan simulasi.
- **Hubungi Kami (Contact):** Formulir kontak interaktif dengan validasi sisi klien (nama, format email, subjek, panjang pesan) dan pesan konfirmasi mode demo.

---

## 3. Struktur Direktori Proyek

```
medcare/
├── index.html                 # Halaman Beranda (Landing Page)
├── products.html              # Halaman Katalog Obat & Pencarian
├── product-detail.html        # Halaman Rincian Informasi Produk
├── cart.html                  # Halaman Keranjang Belanja
├── symptom-checker.html       # Halaman Kuesioner Deteksi Gejala
├── health-information.html    # Halaman Artikel & Edukasi Kesehatan
├── about.html                 # Halaman Profil & Visi Misi Proyek
├── contact.html               # Halaman Kontak Demo & Formulir
├── README.md                  # Dokumentasi Proyek Lengkap
└── assets/
    ├── css/
    │   └── style.css          # Stylesheet Utama (Desain Responsif & Tema)
    ├── js/
    │   ├── storage.js         # Modul Utilitas LocalStorage yang Aman
    │   ├── products.js        # Database Produk & Logika Pencarian/Filter
    │   ├── cart.js            # Logika Keranjang Belanja & Notifikasi Toast
    │   ├── favorites.js       # Logika Pengelolaan Produk Favorit
    │   ├── symptom-checker.js # Mesin Aturan & Wizard Deteksi Gejala
    │   └── main.js            # Inisialisasi DOM, Navigasi Mobile, & Event
    └── images/                # Aset Gambar/Ikon Pendukung
```

---

## 4. Cara Menjalankan Proyek Secara Lokal

Karena proyek ini murni dibangun menggunakan HTML, CSS, dan Vanilla JavaScript tanpa kompilasi build tools (seperti Webpack atau Vite), Anda dapat menjalankannya dengan sangat mudah:

### Cara 1: Buka Langsung di Peramban (Paling Mudah)
1. Buka File Explorer pada komputer Anda.
2. Masuk ke folder direktori `medcare/`.
3. Klik dua kali pada file `index.html` (atau klik kanan > *Open with* > Google Chrome / Microsoft Edge / Mozilla Firefox).
4. Website MedCare siap digunakan!

### Cara 2: Menggunakan Live Server (VS Code)
1. Buka folder `medcare/` menggunakan Visual Studio Code.
2. Pasang ekstensi **Live Server** (oleh Ritwick Dey) jika belum terpasang.
3. Klik kanan pada file `index.html` lalu pilih **Open with Live Server**.
4. Website akan terbuka di alamat lokal seperti `http://127.0.0.1:5500/index.html`.

---

## 5. Cara Kerja Browser LocalStorage

Aplikasi MedCare menggunakan API bawaan peramban web yaitu `window.localStorage` untuk menyimpan data tanpa memerlukan database eksternal:

1. **Serialisasi Data:** Data keranjang belanja dan favorit disimpan dalam bentuk string JSON menggunakan `JSON.stringify()`.
2. **Deserialisasi Data:** Saat halaman dimuat, data diambil kembali menggunakan `localStorage.getItem()` dan diubah menjadi objek JavaScript melalui `JSON.parse()`.
3. **Prefix Namespace:** Semua kunci penyimpanan menggunakan awalan `medcare_` (misalnya `medcare_cart`, `medcare_favorites`) untuk menghindari bentrokan nama dengan data dari website lain pada origin yang sama.
4. **Penanganan Error (Error Handling):** Modul `storage.js` dilengkapi blok `try...catch` untuk mengantisipasi mode penjelajahan privat (Incognito), kuota memori browser penuh (*QuotaExceededError*), atau data JSON yang rusak (*corrupted data*).

### Batasan Penting LocalStorage:
- **Terikat pada Browser & Origin:** Data yang tersimpan di Google Chrome pada Laptop A tidak akan tersinkronisasi ke browser Firefox atau perangkat lain (HP/tablet).
- **Dapat Dihapus Pengguna:** Jika pengguna membersihkan cache/history browser (*Clear Browsing Data*), seluruh data keranjang dan favorit akan terhapus.
- **Kapasitas Terbatas:** Kuota penyimpanan LocalStorage biasanya dibatasi sekitar 5MB per origin.
- **Bukan Penyimpanan Rahasia:** Jangan pernah menyimpan kata sandi, informasi kartu kredit, atau data medis pribadi rahasia di LocalStorage.

---

## 6. Standar Keselamatan Medis (Symptom Checker)

Fitur Deteksi Gejala Pernapasan pada MedCare menerapkan prinsip etika dan keselamatan medis digital yang ketat:
1. **Bukan Diagnosis Medis:** Sistem secara tegas menyatakan bahwa hasil kuesioner merupakan materi edukasi dan **BUKAN diagnosis klinis dokter**.
2. **Tidak Mengarang Probabilitas:** Sistem tidak memanipulasi angka persentase palsu (seperti *"Anda 87% terkena bronkitis"*).
3. **Pemberian Peringatan Darurat:** Apabila terdeteksi tanda bahaya (*Red Flags*), sistem secara otomatis mengesampingkan hasil edukasi biasa dan memunculkan peringatan darurat dengan nomor kontak ambulans (119).
4. **Tanpa Peresepan Sembarangan:** Sistem tidak menganjurkan penggunaan antibiotik atau obat keras tanpa pemeriksaan dokter.
5. **Tidak Memaksa Pembelian Obat:** Sistem tidak mengarahkan pengguna secara otomatis untuk membeli obat-obatan tertentu dari katalog berdasarkan keluhan yang dimasukkan.

---

## 7. Panduan Publikasi ke GitHub Pages

MedCare dirancang sepenuhnya menggunakan **jalur relatif (relative paths)**, sehingga sangat kompatibel untuk dihosting di GitHub Pages:

1. **Inisialisasi Git & Unggah ke Repositori:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MedCare website prototype"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPOSITORI.git
   git push -u origin main
   ```
2. **Aktifkan GitHub Pages:**
   - Buka repositori Anda di GitHub.
   - Masuk ke tab **Settings** > menu **Pages** di bilah kiri.
   - Pada bagian **Build and deployment** > **Source**, pilih `Deploy from a branch`.
   - Pilih branch `main` dan folder `/ (root)` (atau `/medcare` jika struktur diletakkan dalam subfolder).
   - Klik tombol **Save**.
3. **Akses Website:**
   - Setelah beberapa saat, website akan aktif di alamat:  
     `https://USERNAME.github.io/NAMA-REPOSITORI/`

---

## 8. Batasan Prototipe (Known Limitations)

Sebagai proyek akademik tingkat sarjana (*Undergraduate Academic Project*), prototipe ini memiliki beberapa batasan:
- **Transaksi Fiktif:** Tombol proses pesanan / checkout hanya menampilkan simulasi notifikasi toast dan tidak terhubung ke payment gateway perbankan.
- **Pesan Formulir Kontak Simulasi:** Formulir kontak melakukan validasi data lengkap di peramban, tetapi tidak mengirimkan email nyata karena tidak ada server backend (Node.js/PHP/SMTP).
- **Basis Data Demo Lokal:** Produk obat disimpan dalam berkas array JavaScript statis (`products.js`) di sisi klien.

---

## 9. Hak Cipta & Lisensi

Proyek ini dibuat untuk tujuan edukasi dan pembelajaran akademik. Bebas digunakan, dipelajari, dan dikembangkan untuk keperluan akademik non-komersial.

*MedCare — Teman Sehat Anda, Setiap Hari.*
