// ============================================================
// symptom-checker.js — Sistem Deteksi Gejala Pernapasan MedCare
// Kuesioner skrining edukasi gejala pernapasan berbasis aturan (rule-based).
//
// PERINGATAN MEDIS:
// Fitur ini adalah prototipe edukatif, BUKAN alat diagnosis medis resmi.
// Tidak menggantikan konsultasi langsung dengan dokter profesional.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('symptom-checker-container')) {
        initSymptomChecker();
    }
});

// ============================================================
// STRUKTUR DATA KUESIONER
// ============================================================

const QUESTIONNAIRE_STEPS = [
    {
        id: 'main_symptoms',
        stepNumber: 1,
        title: 'Gejala Utama',
        subtitle: 'Pilih semua gejala saluran pernapasan atas yang sedang Anda alami saat ini:',
        type: 'checkbox',
        required: true,
        options: [
            { id: 'batuk', label: 'Batuk', desc: 'Batuk kering maupun batuk berdahak', icon: '🗣️' },
            { id: 'pilek', label: 'Pilek / Hidung Berair', desc: 'Keluar cairan bening atau encer dari hidung', icon: '🤧' },
            { id: 'hidung_tersumbat', label: 'Hidung Tersumbat', desc: 'Kesulitan bernapas lega melalui hidung', icon: '👃' },
            { id: 'bersin', label: 'Bersin-bersin Sering', desc: 'Terutama saat terpapar debu atau udara dingin', icon: '💨' },
            { id: 'sakit_tenggorokan', label: 'Sakit / Nyeri Tenggorokan', desc: 'Rasa perih, kering, atau nyeri saat menelan', icon: '🧣' },
            { id: 'demam', label: 'Demam / Meriang', desc: 'Suhu tubuh terasa panas atau menggigil', icon: '🌡️' }
        ]
    },
    {
        id: 'respiratory_symptoms',
        stepNumber: 2,
        title: 'Gejala Pernapasan Lanjut',
        subtitle: 'Apakah Anda juga merasakan keluhan berikut di dada atau saluran pernapasan?',
        type: 'checkbox',
        required: false,
        options: [
            { id: 'sesak_napas', label: 'Sesak Napas / Napas Berat', desc: 'Merasa kekurangan udara atau napas terasa pendek', icon: '🫁' },
            { id: 'mengi', label: 'Napas Berbunyi (Mengi / Wheezing)', desc: 'Terdengar suara seperti siulan saat mengembuskan napas', icon: '🔊' },
            { id: 'nyeri_dada', label: 'Nyeri atau Rasa Tertekan di Dada', desc: 'Rasa tidak nyaman di area rongga dada saat bernapas', icon: '⚡' },
            { id: 'dahak_berwarna', label: 'Batuk Berdahak Kuning / Hijau', desc: 'Dahak kental berwarna keruh, kekuningan, atau kehijauan', icon: '🧪' }
        ]
    },
    {
        id: 'fever_level',
        stepNumber: 3,
        title: 'Karakteristik Demam',
        subtitle: 'Bagaimana intensitas suhu tubuh Anda saat ini?',
        type: 'radio',
        required: true,
        options: [
            { id: 'fever_none', label: 'Tidak Mengalami Demam', desc: 'Suhu tubuh terasa normal (kurang dari 37.5°C)', icon: '🟢' },
            { id: 'fever_mild', label: 'Demam Ringan (37.5°C – 38.0°C)', desc: 'Tubuh terasa hangat atau agak meriang', icon: '🟡' },
            { id: 'fever_moderate', label: 'Demam Sedang (38.1°C – 39.0°C)', desc: 'Suhu cukup panas disertai lemas atau menggigil', icon: '🟠' },
            { id: 'fever_high', label: 'Demam Tinggi (Lebih dari 39.0°C)', desc: 'Suhu sangat tinggi dan tidak kunjung turun', icon: '🔴' }
        ]
    },
    {
        id: 'duration',
        stepNumber: 4,
        title: 'Durasi Gejala',
        subtitle: 'Sudah berapa lama gejala tersebut Anda rasakan?',
        type: 'radio',
        required: true,
        options: [
            { id: 'dur_1_2', label: 'Baru Mulai (1 – 2 Hari)', desc: 'Gejala baru saja muncul secara mendadak', icon: '⏱️' },
            { id: 'dur_3_5', label: 'Beberapa Hari (3 – 5 Hari)', desc: 'Gejala sudah berlangsung beberapa hari', icon: '📅' },
            { id: 'dur_6_7', label: 'Sekitar 1 Minggu (6 – 7 Hari)', desc: 'Gejala mendekati durasi satu pekan', icon: '🗓️' },
            { id: 'dur_gt7', label: 'Lebih dari 1 Minggu (> 7 Hari)', desc: 'Gejala berkepanjangan dan belum kunjung mereda', icon: '⏳' }
        ]
    },
    {
        id: 'progression',
        stepNumber: 5,
        title: 'Perkembangan Gejala',
        subtitle: 'Bagaimana kondisi gejala Anda dibandingkan saat awal mula muncul?',
        type: 'radio',
        required: true,
        options: [
            { id: 'prog_better', label: 'Mulai Membaik', desc: 'Keluhan terasa semakin berkurang dibanding sebelumnya', icon: '📈' },
            { id: 'prog_same', label: 'Relatif Sama / Stabil', desc: 'Kondisi belum banyak perubahan sejak awal', icon: '📊' },
            { id: 'prog_worse', label: 'Semakin Memburuk', desc: 'Keluhan terasa bertambah parah atau bertambah banyak', icon: '📉' },
            { id: 'prog_severe', label: 'Memburuk Secara Cepat / Drastis', desc: 'Kondisi menurun tajam dalam waktu singkat', icon: '⚠️' }
        ]
    },
    {
        id: 'emergency_symptoms',
        stepNumber: 6,
        title: 'Pemeriksaan Tanda Bahaya Darurat (Red Flags)',
        subtitle: 'Perhatikan kondisi di bawah ini dengan sangat teliti untuk keselamatan Anda:',
        type: 'checkbox',
        required: true,
        options: [
            { id: 'emg_severe_breath', label: 'Kesulitan bernapas yang sangat parah (terengah-engah, tidak bisa bicara lancar)', desc: 'Gejala darurat medis yang memerlukan tindakan segera', icon: '🚨' },
            { id: 'emg_blue_lips', label: 'Bibir, kuku, atau wajah tampak kebiruan atau keabu-abuan (sianosis)', desc: 'Tanda kekurangan oksigen dalam darah', icon: '🚨' },
            { id: 'emg_confusion', label: 'Penurunan kesadaran, kebingungan berat, atau sangat sulit dibangunkan', desc: 'Tanda gangguan sirkulasi oksigen ke otak', icon: '🚨' },
            { id: 'emg_chest_pain', label: 'Nyeri dada hebat yang menetap atau terasa seperti tertindih beban berat', desc: 'Tanda darurat yang mungkin melibatkan organ vital', icon: '🚨' },
            { id: 'emg_none', label: 'SAYA TIDAK MENGALAMI tanda bahaya darurat di atas', desc: 'Kondisi pernapasan tidak menunjukkan tanda kegawatdaruratan tersebut', icon: '✅' }
        ]
    },
    {
        id: 'review_step',
        stepNumber: 7,
        title: 'Tinjau & Konfirmasi Gejala',
        subtitle: 'Periksa kembali daftar pilihan Anda sebelum sistem menganalisis pola informasi edukatif:',
        type: 'review',
        required: false,
        options: []
    }
];


// ============================================================
// STATE KUESIONER
// ============================================================

let currentStepIndex = 0;
let userAnswers = {
    main_symptoms: [],
    respiratory_symptoms: [],
    fever_level: '',
    duration: '',
    progression: '',
    emergency_symptoms: []
};


// ============================================================
// INISIALISASI WIZARD
// ============================================================

function initSymptomChecker() {
    currentStepIndex = 0;
    userAnswers = {
        main_symptoms: [],
        respiratory_symptoms: [],
        fever_level: '',
        duration: '',
        progression: '',
        emergency_symptoms: []
    };

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', handlePrevStep);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextStep);
    }

    renderCurrentStep();
}


// ============================================================
// RENDER LANGKAH KUESIONER
// ============================================================

function renderCurrentStep() {
    const step = QUESTIONNAIRE_STEPS[currentStepIndex];
    const totalSteps = QUESTIONNAIRE_STEPS.length;
    const stepContent = document.getElementById('step-content');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const resultContainer = document.getElementById('result-container');
    const wizardContainer = document.getElementById('symptom-checker-container');

    if (!stepContent) return;

    // Pastikan kontainer kuesioner aktif dan hasil tersembunyi
    if (resultContainer) resultContainer.classList.add('hidden');
    if (wizardContainer) wizardContainer.classList.remove('hidden');

    // Update Progress Bar
    const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);
    if (progressBar) {
        progressBar.style.width = progressPercent + '%';
        progressBar.setAttribute('aria-valuenow', progressPercent);
    }
    if (progressText) {
        progressText.textContent = `Langkah ${currentStepIndex + 1} dari ${totalSteps}`;
    }

    // Update Tombol Navigasi
    if (prevBtn) {
        prevBtn.disabled = currentStepIndex === 0;
    }
    if (nextBtn) {
        if (currentStepIndex === totalSteps - 1) {
            nextBtn.textContent = 'Analisis Gejala Sekarang →';
            nextBtn.classList.remove('btn-primary');
            nextBtn.classList.add('btn-secondary');
        } else {
            nextBtn.textContent = 'Selanjutnya →';
            nextBtn.classList.remove('btn-secondary');
            nextBtn.classList.add('btn-primary');
        }
    }

    // Render Konten Langkah
    if (step.type === 'review') {
        renderReviewStep(stepContent);
        return;
    }

    let optionsHtml = '';
    const currentValues = userAnswers[step.id] || [];

    step.options.forEach(function (opt) {
        let isChecked = false;
        if (step.type === 'checkbox') {
            isChecked = currentValues.includes(opt.id);
        } else {
            isChecked = currentValues === opt.id;
        }

        const inputType = step.type;
        const inputName = step.id;

        optionsHtml += `
            <label class="symptom-card-option ${isChecked ? 'selected' : ''}" for="opt-${opt.id}">
                <div class="option-indicator">
                    <input type="${inputType}" id="opt-${opt.id}" name="${inputName}" value="${opt.id}" ${isChecked ? 'checked' : ''}>
                </div>
                <div class="option-icon" aria-hidden="true">${opt.icon || '🩺'}</div>
                <div class="option-info">
                    <span class="option-title">${opt.label}</span>
                    <span class="option-desc">${opt.desc}</span>
                </div>
            </label>
        `;
    });

    stepContent.innerHTML = `
        <div class="step-header">
            <h2 class="step-title">${step.title}</h2>
            <p class="step-subtitle">${step.subtitle}</p>
        </div>
        <div class="symptom-options-grid ${step.type === 'radio' ? 'radio-options' : 'checkbox-options'}">
            ${optionsHtml}
        </div>
        <div id="step-validation-error" class="validation-message hidden" role="alert"></div>
    `;

    // Pasang listener klik pada kartu opsi
    attachOptionListeners(step);
}


function attachOptionListeners(step) {
    const stepContent = document.getElementById('step-content');
    const inputs = stepContent.querySelectorAll('input[name="' + step.id + '"]');

    inputs.forEach(function (input) {
        input.addEventListener('change', function () {
            // Logika khusus untuk opsi darurat (emg_none saling eksklusif dengan lainnya)
            if (step.id === 'emergency_symptoms') {
                if (input.value === 'emg_none' && input.checked) {
                    inputs.forEach(other => {
                        if (other.value !== 'emg_none') other.checked = false;
                    });
                } else if (input.value !== 'emg_none' && input.checked) {
                    const noneInput = stepContent.querySelector('input[value="emg_none"]');
                    if (noneInput) noneInput.checked = false;
                }
            }

            // Perbarui class "selected" pada label pembungkus
            inputs.forEach(inp => {
                const parentLabel = inp.closest('.symptom-card-option');
                if (parentLabel) {
                    if (inp.checked) {
                        parentLabel.classList.add('selected');
                    } else {
                        parentLabel.classList.remove('selected');
                    }
                }
            });

            // Sembunyikan pesan error jika pengguna telah memilih
            const errorBox = document.getElementById('step-validation-error');
            if (errorBox) errorBox.classList.add('hidden');
        });
    });
}


// ============================================================
// RENDER LANGKAH PENINJAUAN (REVIEW)
// ============================================================

function renderReviewStep(container) {
    // Kumpulkan ringkasan teks dari pilihan pengguna
    const mainList = getSelectedLabels('main_symptoms');
    const respList = getSelectedLabels('respiratory_symptoms');
    const feverLabel = getSelectedSingleLabel('fever_level');
    const durationLabel = getSelectedSingleLabel('duration');
    const progLabel = getSelectedSingleLabel('progression');
    const emgList = getSelectedLabels('emergency_symptoms');

    const hasEmergency = userAnswers.emergency_symptoms.some(id => id !== 'emg_none');

    container.innerHTML = `
        <div class="step-header">
            <h2 class="step-title">Tinjau Jawaban Anda</h2>
            <p class="step-subtitle">Periksa ringkasan jawaban Anda di bawah ini sebelum memproses hasil edukasi:</p>
        </div>

        <div class="review-summary-box">
            <div class="review-item">
                <span class="review-label">Gejala Utama:</span>
                <span class="review-value">${mainList.length ? mainList.join(', ') : '<em>Tidak ada dipilih</em>'}</span>
            </div>

            <div class="review-item">
                <span class="review-label">Gejala Pernapasan Lanjut:</span>
                <span class="review-value">${respList.length ? respList.join(', ') : '<em>Tidak ada keluhan lanjut</em>'}</span>
            </div>

            <div class="review-item">
                <span class="review-label">Kondisi Demam:</span>
                <span class="review-value">${feverLabel || 'Belum dipilih'}</span>
            </div>

            <div class="review-item">
                <span class="review-label">Durasi Gejala:</span>
                <span class="review-value">${durationLabel || 'Belum dipilih'}</span>
            </div>

            <div class="review-item">
                <span class="review-label">Perkembangan Gejala:</span>
                <span class="review-value">${progLabel || 'Belum dipilih'}</span>
            </div>

            <div class="review-item ${hasEmergency ? 'review-emergency-alert' : ''}">
                <span class="review-label">Tanda Bahaya Darurat:</span>
                <span class="review-value">${hasEmergency ? '⚠️ TERDAPAT TANDA DARURAT TERPILIH' : '✅ Tidak ada tanda bahaya darurat'}</span>
            </div>
        </div>

        <div class="review-disclaimer-notice">
            <p><strong>Pernyataan Kesadaran:</strong> Dengan melanjutkan, Anda memahami bahwa skrining ini merupakan sistem simulasi edukatif dan sama sekali tidak dapat disamakan dengan diagnosis medis dari dokter.</p>
        </div>

        <div id="step-validation-error" class="validation-message hidden" role="alert"></div>
    `;
}

function getSelectedLabels(stepId) {
    const step = QUESTIONNAIRE_STEPS.find(s => s.id === stepId);
    if (!step) return [];
    const values = userAnswers[stepId] || [];
    return step.options.filter(o => values.includes(o.id)).map(o => o.label);
}

function getSelectedSingleLabel(stepId) {
    const step = QUESTIONNAIRE_STEPS.find(s => s.id === stepId);
    if (!step) return '';
    const val = userAnswers[stepId];
    const found = step.options.find(o => o.id === val);
    return found ? found.label : '';
}


// ============================================================
// VALIDASI & NAVIGASI WIZARD
// ============================================================

function saveCurrentStepAnswers() {
    const step = QUESTIONNAIRE_STEPS[currentStepIndex];
    if (step.type === 'review') return true;

    const stepContent = document.getElementById('step-content');
    const checkedInputs = stepContent.querySelectorAll('input[name="' + step.id + '"]:checked');

    if (step.type === 'checkbox') {
        userAnswers[step.id] = Array.from(checkedInputs).map(inp => inp.value);
    } else {
        userAnswers[step.id] = checkedInputs.length ? checkedInputs[0].value : '';
    }

    return true;
}

function validateCurrentStep() {
    const step = QUESTIONNAIRE_STEPS[currentStepIndex];
    if (step.type === 'review') return true;

    saveCurrentStepAnswers();
    const val = userAnswers[step.id];
    const errorBox = document.getElementById('step-validation-error');

    // Cek kebutuhan wajib
    if (step.required) {
        let isInvalid = false;
        if (step.type === 'checkbox' && (!val || val.length === 0)) {
            isInvalid = true;
        } else if (step.type === 'radio' && (!val || val === '')) {
            isInvalid = true;
        }

        if (isInvalid) {
            if (errorBox) {
                errorBox.textContent = 'Silakan pilih setidaknya salah satu opsi di atas sebelum melanjutkan.';
                errorBox.classList.remove('hidden');
                errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            return false;
        }
    }

    if (errorBox) errorBox.classList.add('hidden');
    return true;
}

function handleNextStep() {
    if (!validateCurrentStep()) return;

    if (currentStepIndex === QUESTIONNAIRE_STEPS.length - 1) {
        // Langkah terakhir: jalankan mesin analisis
        processScreeningResults();
    } else {
        currentStepIndex++;
        renderCurrentStep();
        window.scrollTo({ top: 150, behavior: 'smooth' });
    }
}

function handlePrevStep() {
    saveCurrentStepAnswers();
    if (currentStepIndex > 0) {
        currentStepIndex--;
        renderCurrentStep();
        window.scrollTo({ top: 150, behavior: 'smooth' });
    }
}


// ============================================================
// MESIN ATURAN ANALISIS GEJALA (RULE-BASED ENGINE)
// ============================================================

/**
 * Menganalisis pola gejala berdasarkan aturan klinis edukatif
 * @param {Object} data - Jawaban pengguna
 * @returns {Object} Hasil evaluasi edukatif
 */
function analyzeSymptoms(data) {
    const main = data.main_symptoms || [];
    const resp = data.respiratory_symptoms || [];
    const fever = data.fever_level;
    const dur = data.duration;
    const prog = data.progression;
    const emg = data.emergency_symptoms || [];

    // ========================================================
    // 1. PRIORITAS UTAMA MUTLAK: TANDA BAHAYA DARURAT (RED FLAGS)
    // ========================================================
    const hasEmergency = emg.some(id => id !== 'emg_none');
    if (hasEmergency) {
        return {
            level: 'emergency',
            badge: 'Tindakan Darurat Medis Segera',
            title: 'PERINGATAN: Tanda Bahaya Darurat Terdeteksi',
            summary: 'Berdasarkan pilihan yang Anda berikan, Anda atau orang yang Anda periksa mengalami gejala darurat yang memerlukan penanganan medis segera tanpa penundaan.',
            emergencyDetails: [
                'Gejala seperti sesak napas parah, bibir membiru (sianosis), nyeri dada hebat, atau penurunan kesadaran adalah tanda kegawatdaruratan medis.',
                'Jangan menunggu kuesioner ini atau menunda mencari bantuan.'
            ],
            recommendations: [
                'Segera hubungi ambulans darurat (119) atau minta seseorang mengantar Anda ke Instalasi Gawat Darurat (IGD) rumah sakit terdekat.',
                'Posisikan penderita dalam keadaan duduk tegak atau setengah duduk untuk memudahkan ventilasi udara.',
                'Longgarkan pakaian yang ketat di area leher dan dada.',
                'JANGAN memberikan makanan atau minuman jika kesadaran penderita menurun.'
            ],
            colorTheme: 'danger'
        };
    }

    // ========================================================
    // 2. KONDISI PERINGATAN TINGGI (PERSISTENSI & PEMBURUKAN CEPAT)
    // ========================================================
    if (prog === 'prog_severe' || (dur === 'dur_gt7' && prog === 'prog_worse')) {
        return {
            level: 'warning',
            badge: 'Perlu Konsultasi Dokter Segera',
            title: 'Pola Gejala Mengarah pada Pemburukan / Berkepanjangan',
            summary: 'Gejala yang Anda rasakan menunjukkan pola pemburukan cepat atau telah berlangsung lebih dari 7 hari tanpa tanda perbaikan.',
            possibleTopics: [
                'Infeksi Saluran Pernapasan Berkepanjangan',
                'Potensi Komplikasi Bakterial Sekunder',
                'Reaktivitas Saluran Napas Akut'
            ],
            explanation: 'Infeksi virus umum biasanya mulai mereda setelah 5–7 hari. Jika gejala justru makin berat atau tidak kunjung membaik setelah sepekan, diperlukan pemeriksaan fisik langsung oleh dokter (seperti auskultasi paru dengan stetoskop atau tes penunjang) untuk memastikan tidak terjadi komplikasi seperti pneumonia atau sinusitis sekunder.',
            recommendations: [
                'Jadwalkan kunjungan ke dokter umum atau fasilitas kesehatan terdekat dalam 24 jam.',
                'Catat riwayat suhu tubuh dan gejala harian Anda untuk diceritakan ke dokter.',
                'Hindari membeli antibiotik sendiri tanpa resep, karena penggunaan sembarangan dapat menyebabkan resistensi obat.',
                'Perbanyak istirahat total dan konsumsi cairan hangat yang cukup.'
            ],
            colorTheme: 'warning'
        };
    }

    // ========================================================
    // 3. POLA GEJALA MIRIP ASMA / BRONKOSPASME
    // ========================================================
    if (resp.includes('mengi') || (resp.includes('sesak_napas') && !main.includes('demam'))) {
        return {
            level: 'moderate',
            badge: 'Informasi Edukasi: Gejala Saluran Napas Bawah',
            title: 'Pola Gejala Menyerupai Reaktivitas Saluran Napas / Mengi',
            summary: 'Adanya suara napas berbunyi (mengi/wheezing) atau napas terasa berat umumnya berkaitan dengan penyempitan sementara pada saluran bronkus.',
            possibleTopics: [
                'Bronkospasme / Reaktivitas Saluran Napas',
                'Gejala Terkait Asma Bronkial',
                'Bronkitis dengan Penyempitan Saluran Udara'
            ],
            explanation: 'Mengi terjadi saat udara melewati saluran pernapasan yang menyempit akibat peradangan, penumpukan lendir, atau spasme otot polos saluran napas. Kondisi ini sering dipicu oleh alergi, udara dingin, asap, atau infeksi saluran napas.',
            recommendations: [
                'Konsultasikan dengan dokter spesialis paru atau dokter umum untuk evaluasi fungsi pernapasan.',
                'Hindari pemicu seperti asap rokok, debu, bulu hewan, atau perubahan suhu mendadak.',
                'Jika sebelumnya telah memiliki obat semprot (inhaler) yang diresepkan dokter, gunakan sesuai rencana penanganan dokter Anda.',
                'Segera ke IGD jika napas semakin sesak hingga tidak bisa berbicara lancar.'
            ],
            colorTheme: 'warning'
        };
    }

    // ========================================================
    // 4. POLA BRONKITIS (BATUK BERDAHAK PEKAT / NYERI DADA)
    // ========================================================
    if (resp.includes('dahak_berwarna') || (main.includes('batuk') && resp.includes('nyeri_dada'))) {
        return {
            level: 'moderate',
            badge: 'Informasi Edukasi: Gejala Bronkitis / Radang Saluran Napas',
            title: 'Pola Gejala Mengarah pada Peradangan Bronkus (Bronkitis)',
            summary: 'Kombinasi batuk dengan produksi dahak kental/berwarna serta rasa tidak nyaman di dada saat batuk sering diasosiasikan dengan iritasi atau peradangan dinding bronkus.',
            possibleTopics: [
                'Bronkitis Akut (Sebagian besar berawal dari infeksi virus)',
                'Trakeobronkitis',
                'Iritasi Saluran Napas Bawah'
            ],
            explanation: 'Dahak berwarna kuning atau kehijauan mencerminkan respons sel darah putih tubuh melawan peradangan, tidak selalu berarti memerlukan antibiotik. Evaluasi dokter penting untuk membedakan bronkitis virus dari infeksi bakteri.',
            recommendations: [
                'Periksakan diri ke dokter terutama jika batuk berdahak disertai demam atau tidak mereda setelah 7 hari.',
                'Minum air putih hangat dalam jumlah banyak untuk membantu mengencerkan dahak sehingga lebih mudah dikeluarkan.',
                'Hindari paparan asap rokok dan polusi udara yang memperparah iritasi bronkus.',
                'Gunakan uap air hangat atau pelembap udara (humidifier) untuk melegakan saluran napas.'
            ],
            colorTheme: 'warning'
        };
    }

    // ========================================================
    // 5. POLA INFLUENZA (FLU SISTEMIK DENGAN DEMAM SEDANG/TINGGI)
    // ========================================================
    if ((fever === 'fever_moderate' || fever === 'fever_high') && main.includes('batuk') && (main.includes('sakit_tenggorokan') || dur === 'dur_1_2' || dur === 'dur_3_5')) {
        return {
            level: 'moderate',
            badge: 'Informasi Edukasi: Gejala Serupa Influenza (Flu)',
            title: 'Pola Gejala Mengarah pada Infeksi Virus Influenza',
            summary: 'Kombinasi demam yang cukup tinggi, batuk, nyeri tenggorokan, dan rasa lemas mendadak adalah karakteristik khas infeksi virus influenza.',
            possibleTopics: [
                'Influenza (Flu)',
                'Infeksi Virus Pernapasan Akut'
            ],
            explanation: 'Influenza berbeda dari pilek biasa karena serangannya biasanya lebih mendadak dan memicu gejala seluruh tubuh (sistemik) seperti demam tinggi, nyeri otot, dan kelelahan berat. Pada orang sehat, flu umumnya sembuh dengan sendirinya dalam 7–10 hari melalui pertahanan alami tubuh.',
            recommendations: [
                'Istirahat total (bed rest) untuk memberikan energi bagi sistem imun tubuh.',
                'Penuhi kebutuhan hidrasi harian dengan air mineral, jus buah segar, atau kuah sup hangat.',
                'Obat penurun panas yang dijual bebas seperti parasetamol dapat membantu meredakan demam dan nyeri tubuh sesuai petunjuk kemasan.',
                'Gunakan masker saat berada di dekat anggota keluarga lain untuk mencegah penularan.',
                'Kunjungi dokter jika demam tidak kunjung turun setelah 3 hari penggunaan pereda demam.'
            ],
            colorTheme: 'info'
        };
    }

    // ========================================================
    // 6. POLA RINITIS ALERGI (BERSIN, HILANG TANPA DEMAM)
    // ========================================================
    if (main.includes('bersin') && (main.includes('pilek') || main.includes('hidung_tersumbat')) && (fever === 'fever_none' || !fever)) {
        return {
            level: 'mild',
            badge: 'Informasi Edukasi: Gejala Rinitis Alergi',
            title: 'Pola Gejala Mengarah pada Rinitis Alergi / Reaksi Alergen',
            summary: 'Gejala bersin-bersin berulang, hidung meler berair bening, atau hidung tersumbat tanpa disertai demam umumnya dipicu oleh reaksi hipersensitivitas terhadap alergen.',
            possibleTopics: [
                'Rinitis Alergi (Allergic Rhinitis)',
                'Rinitis Vasomotor (Reaksi terhadap suhu/kelembapan)'
            ],
            explanation: 'Reaksi alergi terjadi saat sistem kekebalan tubuh bereaksi berlebihan terhadap zat yang biasanya tidak berbahaya, seperti debu tungau, serbuk sari, bulu hewan peliharaan, atau udara dingin subuh.',
            recommendations: [
                'Identifikasi dan hindari zat atau kondisi pemicu (bersihkan kamar tidur secara rutin dari debu).',
                'Gunakan masker saat membersihkan ruangan atau saat berada di luar ruangan berdebu.',
                'Bilas rongga hidung dengan larutan saline (cairan garam fisiologis) untuk membersihkan alergen dari mukosa hidung.',
                'Konsultasikan dengan dokter untuk evaluasi tes alergi atau rekomendasi antihistamin jika keluhan mengganggu aktivitas sehari-hari.'
            ],
            colorTheme: 'success'
        };
    }

    // ========================================================
    // 7. POLA FLU BIASA (COMMON COLD / SALESMA)
    // ========================================================
    return {
        level: 'mild',
        badge: 'Informasi Edukasi: Gejala Salesma / Flu Ringan',
        title: 'Pola Gejala Menyerupai Flu Biasa (Common Cold)',
        summary: 'Kombinasi gejala pilek, hidung tersumbat, bersin, dan sakit tenggorokan ringan tanpa tanda bahaya merupakan pola umum infeksi saluran napas atas ringan yang disebabkan oleh virus salesma.',
        possibleTopics: [
            'Common Cold (Salesma)',
            'Nasofaringitis Akut Ringan'
        ],
        explanation: 'Flu biasa adalah infeksi virus saluran pernapasan atas yang sangat umum terjadi. Mayoritas kasus bersifat sembuh sendiri (self-limiting) seiring waktu berkat respons imunitas tubuh yang prima.',
        recommendations: [
            'Perbanyak istirahat dan tidur yang cukup agar tubuh dapat memulihkan diri.',
            'Minum air putih hangat dalam jumlah cukup untuk menjaga kelembapan selaput lendir tenggorokan.',
            'Konsumsi makanan bergizi kaya vitamin C dan mikronutrien dari buah dan sayur.',
            'Kumur air garam hangat untuk meredakan rasa perih di tenggorokan.',
            'Periksakan ke dokter jika keluhan memburuk atau tidak mereda setelah 7–10 hari.'
        ],
        colorTheme: 'success'
    };
}


// ============================================================
// MENAMPILKAN HASIL SKRINING
// ============================================================

function processScreeningResults() {
    const wizardContainer = document.getElementById('symptom-checker-container');
    const resultContainer = document.getElementById('result-container');

    if (!resultContainer) return;

    // Jalankan analisis
    const analysis = analyzeSymptoms(userAnswers);

    // Simpan ke storage jika tersedia (opsional & aman)
    if (window.MedCareStorage && typeof window.MedCareStorage.addSymptomHistory === 'function') {
        try {
            window.MedCareStorage.addSymptomHistory({
                timestamp: new Date().toISOString(),
                level: analysis.level,
                title: analysis.title
            });
        } catch (e) {
            console.warn('Riwayat tidak dapat disimpan:', e.message);
        }
    }

    if (wizardContainer) wizardContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    let resultHtml = '';

    if (analysis.level === 'emergency') {
        // TAMPILAN DARURAT (RED ALERT) — SANGAT MENONJOL
        resultHtml = `
            <div class="result-emergency-box">
                <div class="emergency-header">
                    <span class="emergency-icon-pulse" aria-hidden="true">🚨</span>
                    <div>
                        <span class="result-badge badge-emergency">${analysis.badge}</span>
                        <h2 class="emergency-title">${analysis.title}</h2>
                    </div>
                </div>

                <div class="emergency-alert-body">
                    <p class="emergency-summary"><strong>${analysis.summary}</strong></p>

                    <div class="emergency-action-card">
                        <h3>Langkah Tindakan Darurat Segera:</h3>
                        <ul>
                            ${analysis.recommendations.map(rec => `<li><strong>${rec}</strong></li>`).join('')}
                        </ul>
                    </div>

                    <div class="emergency-contacts">
                        <p><strong>Nomor Telepon Darurat Medis Indonesia:</strong></p>
                        <a href="tel:119" class="btn btn-emergency-call">📞 Hubungi 119 (Gawat Darurat)</a>
                    </div>
                </div>

                <div class="result-disclaimer-critical">
                    ⚠️ <strong>PERINGATAN KESELAMATAN:</strong> Website ini tidak memproses panggilan darurat otomatis. Segera cari pertolongan medis langsung atau hubungi orang terdekat.
                </div>

                <div class="result-actions">
                    <button class="btn btn-outline" onclick="restartQuestionnaire()">🔄 Ulangi Skrining</button>
                    <a href="index.html" class="btn btn-secondary">Kembali ke Beranda</a>
                </div>
            </div>
        `;
    } else {
        // TAMPILAN EDUKASI STANDAR (HIJAU / KUNING / ORANYE)
        let themeClass = 'result-mild';
        let badgeClass = 'badge-mild';
        if (analysis.level === 'warning') {
            themeClass = 'result-warning';
            badgeClass = 'badge-warning';
        } else if (analysis.level === 'moderate') {
            themeClass = 'result-moderate';
            badgeClass = 'badge-moderate';
        }

        let topicsList = '';
        if (analysis.possibleTopics && analysis.possibleTopics.length) {
            topicsList = `
                <div class="result-topics-section">
                    <h3>Topik Edukasi yang Relevan:</h3>
                    <div class="topic-tags">
                        ${analysis.possibleTopics.map(t => `<span class="topic-tag">${t}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        resultHtml = `
            <div class="result-card ${themeClass}">
                <div class="result-card-header">
                    <span class="result-badge ${badgeClass}">${analysis.badge}</span>
                    <h2 class="result-title">${analysis.title}</h2>
                    <p class="result-summary">${analysis.summary}</p>
                </div>

                ${topicsList}

                <div class="result-card-content">
                    <h3>Penjelasan Edukatif:</h3>
                    <p class="result-explanation">${analysis.explanation || ''}</p>

                    <h3>Saran Perawatan Mandiri &amp; Tindakan yang Disarankan:</h3>
                    <ul class="result-recommendations">
                        ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>

                <!-- Banner Disclaimer Medis Wajib -->
                <div class="result-medical-disclaimer">
                    <div class="disclaimer-badge">PENTING</div>
                    <p>
                        <strong>Penafian Medis:</strong> Hasil skrining di atas dihitung melalui simulasi algoritma edukatif dan <strong>BUKAN</strong> merupakan diagnosis medis resmi. Berbagai kondisi medis yang berbeda dapat menunjukkan pola gejala yang serupa. Jangan menggunakan informasi ini untuk memulai terapi obat keras secara mandiri. Bila keluhan berlanjut, memburuk, atau Anda merasa cemas, segera konsultasikan langsung dengan dokter atau tenaga medis profesional.
                    </p>
                </div>

                <!-- Tautan Terkait & Tombol Navigasi -->
                <div class="result-footer-nav">
                    <button class="btn btn-primary" onclick="restartQuestionnaire()">🔄 Mulai Ulang Skrining</button>
                    <a href="health-information.html" class="btn btn-outline">Baca Informasi Kesehatan</a>
                    <a href="products.html" class="btn btn-secondary">Katalog Produk</a>
                </div>
            </div>
        `;
    }

    resultContainer.innerHTML = resultHtml;
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ============================================================
// MULAI ULANG KUESIONER (RESTART)
// ============================================================

function restartQuestionnaire() {
    currentStepIndex = 0;
    userAnswers = {
        main_symptoms: [],
        respiratory_symptoms: [],
        fever_level: '',
        duration: '',
        progression: '',
        emergency_symptoms: []
    };

    const resultContainer = document.getElementById('result-container');
    const wizardContainer = document.getElementById('symptom-checker-container');

    if (resultContainer) {
        resultContainer.innerHTML = '';
        resultContainer.classList.add('hidden');
    }

    if (wizardContainer) {
        wizardContainer.classList.remove('hidden');
    }

    renderCurrentStep();
    window.scrollTo({ top: 150, behavior: 'smooth' });
}

window.restartQuestionnaire = restartQuestionnaire;
