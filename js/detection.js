
function periksaGejala() {

    // Mengambil semua gejala yang dicentang
    const gejala = document.querySelectorAll(
        'input[name="gejala"]:checked'
    );

    const hasil = document.getElementById("hasilPemeriksaan");

    // Memeriksa apakah pengguna memilih gejala
    if (gejala.length === 0) {
        hasil.style.display = "block";
        hasil.innerHTML = `
            <h3>Belum Ada Gejala</h3>
            <p>Silakan pilih minimal satu gejala terlebih dahulu.</p>
        `;
        return;
    }

    // Mengambil nilai gejala yang dipilih
    let daftarGejala = [];

    gejala.forEach(function(item) {
        daftarGejala.push(item.value);
    });

    // Menampilkan hasil berdasarkan gejala
    hasil.style.display = "block";

    if (
        daftarGejala.includes("sesak") ||
        daftarGejala.includes("dada")
    ) {

        hasil.innerHTML = `
            <h3>Perlu Perhatian Medis</h3>
            <p>
                Gejala yang kamu pilih dapat memerlukan pemeriksaan
                langsung oleh tenaga medis. Segera cari pertolongan medis,
                terutama jika sesak napas atau nyeri dada terasa berat.
            </p>
        `;

    } else {

        hasil.innerHTML = `
            <h3>Hasil Pemeriksaan Awal</h3>
            <p>
                Kamu memilih ${daftarGejala.length} gejala.
                Gejala tersebut dapat berkaitan dengan beberapa
                gangguan pernapasan, seperti flu atau ISPA.
            </p>
            <p>
                Hasil ini bukan diagnosis. Konsultasikan dengan
                tenaga kesehatan untuk mengetahui penyebabnya.
            </p>
        `;

    }

}
