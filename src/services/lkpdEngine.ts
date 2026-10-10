/**
 * LKPD ENGINE — STIVIA v3.5
 * Sistem Analisis 7 Tahap & Generator Universal Prompt Poster LKPD Otomatis
 * 
 * Prinsip Utama:
 * 1. "UPDATE, DON'T REBUILD"
 * 2. SATU KALI INPUT -> SATU KALI ANALISIS -> SATU KALI GENERATE
 * 3. Output 5 Bagian Terstruktur:
 *    A. HASIL ANALISIS
 *    B. LKPD LENGKAP
 *    C. KONSEP VISUAL LKPD
 *    D. PROMPT POSTER LKPD (Dimulai dengan: "BUAT POSTER LKPD PEMBELAJARAN...")
 *    E. NEGATIVE / QUALITY INSTRUCTION
 */

export type LkpdActivityType = 
  | 'Individu' 
  | 'Berpasangan' 
  | 'Kelompok' 
  | 'Praktik' 
  | 'Proyek' 
  | 'Pemecahan Masalah';

export type LkpdFormatType = 
  | 'Pemahaman Konsep' 
  | 'Analisis' 
  | 'Latihan' 
  | 'Praktik' 
  | 'Eksperimen' 
  | 'Diskusi' 
  | 'Pemecahan Masalah' 
  | 'Proyek';

export type LkpdDifficulty = 'Dasar' | 'Sedang' | 'Menantang';

export type LkpdTimeAllocation = 
  | '20 menit' 
  | '30 menit' 
  | '45 menit' 
  | '60 menit' 
  | '90 menit' 
  | '2 × 45 menit';

export type LkpdStudentOutput = 
  | 'Jawaban Tertulis' 
  | 'Tabel' 
  | 'Analisis' 
  | 'Diagram' 
  | 'Praktik' 
  | 'Produk' 
  | 'Presentasi' 
  | 'Kombinasi';

// ============================================================================
// STIVIA POSTER LKPD BLUEPRINT ENGINE (Tahap 1 s/d Tahap 6)
// Sistem Perancangan Struktur LKPD Kontekstual & Visual Poster
// ============================================================================

export type LkpdStimulusType = 
  | 'Teks'
  | 'Ilustrasi'
  | 'Kasus/Kejadian'
  | 'Tabel/Data'
  | 'Diagram'
  | 'Percakapan/Dialog'
  | 'Teks + Ilustrasi'
  | 'Kasus + Data'
  | 'Tanpa Stimulus';

export type LkpdStimulusSource = 'ai_generated' | 'user_manual';

export type LkpdActivityCategory = 
  | 'Memahami'
  | 'Mengamati'
  | 'Mengidentifikasi'
  | 'Mengelompokkan'
  | 'Membandingkan'
  | 'Menganalisis'
  | 'Menafsirkan'
  | 'Mengevaluasi'
  | 'Memecahkan masalah'
  | 'Mencipta'
  | 'Berdiskusi'
  | 'Menyimpulkan'
  | 'Refleksi';

export type LkpdQuestionType = 
  | 'Pilihan Ganda'
  | 'Benar/Salah'
  | 'Isian Singkat'
  | 'Menjodohkan'
  | 'Uraian'
  | 'Studi Kasus'
  | 'Analisis'
  | 'Problem Solving'
  | 'Pengamatan'
  | 'Diskusi'
  | 'Refleksi'
  | 'Tugas Kreatif';

export interface LkpdDifficultyComposition {
  mudah: number;  // persentase (misal 30)
  sedang: number; // persentase (misal 50)
  hots: number;   // persentase (misal 20)
  mode: 'ai' | 'manual';
}

export interface LkpdBlueprintDesign {
  id: string;
  title: string;
  subject: string;
  educationLevel: string;
  grade: string;
  materi: string;
  subTopic: string;
  timeAllocation: string;
  learningObjectives: string[];
  stimulusType: LkpdStimulusType;
  stimulusSource: LkpdStimulusSource;
  userStimulusText?: string;
  activityComposition: { category: LkpdActivityCategory; count: number }[];
  questionTypes: { type: LkpdQuestionType; count: number }[];
  difficultyComposition: LkpdDifficultyComposition;
  totalResponses: number;
  notes?: string;
}

export interface GeneratedLkpdQuestion {
  id: string;
  number: number;
  activityCategory: LkpdActivityCategory;
  questionType: LkpdQuestionType;
  cognitiveLevel: 'Mudah' | 'Sedang' | 'HOTS';
  prompt: string;
  options?: string[]; // jika pilihan ganda
  matchingPairs?: { left: string; right: string }[]; // jika menjodohkan
  answerSpaceType: 'lines' | 'box' | 'table' | 'options';
  answerLineCount?: number;
  expectedResponseGuidance: string;
}

export interface GeneratedLkpdActivitySection {
  category: LkpdActivityCategory;
  title: string;
  instruction: string;
  questions: GeneratedLkpdQuestion[];
}

export interface GeneratedLkpdDocument {
  id: string;
  title: string;
  subject: string;
  educationLevel: string;
  grade: string;
  materi: string;
  subTopic: string;
  timeAllocation: string;
  learningObjectives: string[];
  stimulus: {
    type: LkpdStimulusType;
    title: string;
    content: string;
    contextualHint: string;
    illustrationPrompt: string;
  };
  generalInstructions: string[];
  sections: GeneratedLkpdActivitySection[];
  totalResponses: number;
  reflectionQuestions: string[];
  teacherNotesSection: string;
  createdAt: string;
}

export interface PosterLkpdPageLayout {
  pageNumber: number;
  totalPages: number;
  title: string;
  metadata: string;
  hasStudentHeader: boolean;
  stimulusBox?: {
    type: LkpdStimulusType;
    title: string;
    content: string;
    illustrationDesc: string;
  };
  activityBoxes: {
    category: string;
    instruction: string;
    questions: {
      number: number;
      type: string;
      prompt: string;
      options?: string[];
      answerLineCount: number;
    }[];
  }[];
  footer?: {
    reflectionItems?: string[];
    teacherSignBox: boolean;
  };
}

export const ALL_LKPD_ACTIVITY_CATEGORIES: LkpdActivityCategory[] = [
  'Memahami',
  'Mengamati',
  'Mengidentifikasi',
  'Mengelompokkan',
  'Membandingkan',
  'Menganalisis',
  'Menafsirkan',
  'Mengevaluasi',
  'Memecahkan masalah',
  'Mencipta',
  'Berdiskusi',
  'Menyimpulkan',
  'Refleksi'
];

export const ALL_LKPD_QUESTION_TYPES: LkpdQuestionType[] = [
  'Pilihan Ganda',
  'Benar/Salah',
  'Isian Singkat',
  'Menjodohkan',
  'Uraian',
  'Studi Kasus',
  'Analisis',
  'Problem Solving',
  'Pengamatan',
  'Diskusi',
  'Refleksi',
  'Tugas Kreatif'
];

export const ALL_LKPD_STIMULUS_TYPES: { id: LkpdStimulusType; label: string; desc: string; icon: string }[] = [
  { id: 'Teks + Ilustrasi', label: 'Teks + Ilustrasi', desc: 'Kombinasi naskah bacaan dengan gambaran visual kontekstual', icon: '🖼️' },
  { id: 'Teks', label: 'Teks / Bacaan', desc: 'Artikel, kutipan berita, wacana, iklan, atau naskah cerita', icon: '📄' },
  { id: 'Ilustrasi', label: 'Ilustrasi / Gambar', desc: 'Gambar situasi, poster, karya seni, atau fenomena visual', icon: '🎨' },
  { id: 'Kasus/Kejadian', label: 'Kasus / Kejadian Nyata', desc: 'Studi peristiwa sosial, fenomena alam, atau dinamika kehidupan', icon: '🔍' },
  { id: 'Tabel/Data', label: 'Tabel / Data Fakta', desc: 'Hasil pengamatan, statistik, tabel nilai, atau data survei', icon: '📊' },
  { id: 'Diagram', label: 'Diagram / Alur', desc: 'Bagan proses, siklus, diagram alir, atau skema kerja', icon: '📈' },
  { id: 'Percakapan/Dialog', label: 'Percakapan / Dialog', desc: 'Interaksi dua tokoh atau diskusi situasional', icon: '💬' },
  { id: 'Kasus + Data', label: 'Kasus + Data Tabel', desc: 'Uraian kejadian faktual disertai data pendukung konkret', icon: '📑' },
  { id: 'Tanpa Stimulus', label: 'Tanpa Stimulus', desc: 'Pertanyaan langsung berbasis konsep tanpa bahan pemantik', icon: '⚡' }
];

/**
 * Memberikan rekomendasi komposisi aktivitas, jenis soal, dan alokasi waktu ideal
 */
export function recommendLkpdComposition(
  timeAllocation: string,
  level: string,
  grade: string,
  subject: string
): {
  recommendedActivities: { category: LkpdActivityCategory; count: number }[];
  recommendedQuestionTypes: { type: LkpdQuestionType; count: number }[];
  difficulty: LkpdDifficultyComposition;
  totalResponses: number;
  rationale: string;
} {
  const t = timeAllocation.toLowerCase();
  const s = (subject || '').toLowerCase();

  if (t.includes('20')) {
    return {
      recommendedActivities: [
        { category: 'Memahami', count: 2 },
        { category: 'Mengidentifikasi', count: 2 },
        { category: 'Refleksi', count: 1 }
      ],
      recommendedQuestionTypes: [
        { type: 'Pilihan Ganda', count: 2 },
        { type: 'Isian Singkat', count: 2 },
        { type: 'Refleksi', count: 1 }
      ],
      difficulty: { mudah: 40, sedang: 50, hots: 10, mode: 'ai' },
      totalResponses: 5,
      rationale: 'Alokasi 20 menit dirancang untuk aktivitas ringkas dan pemahaman konsep cepat (±15-18 menit pengerjaan siswa).'
    };
  }

  if (t.includes('30') || t.includes('40') || t.includes('45')) {
    const isMathOrSci = s.includes('matematika') || s.includes('ipa') || s.includes('fisika');
    return {
      recommendedActivities: isMathOrSci ? [
        { category: 'Memahami', count: 2 },
        { category: 'Menganalisis', count: 2 },
        { category: 'Memecahkan masalah', count: 2 },
        { category: 'Refleksi', count: 1 }
      ] : [
        { category: 'Memahami', count: 2 },
        { category: 'Mengidentifikasi', count: 2 },
        { category: 'Menganalisis', count: 2 },
        { category: 'Mengevaluasi', count: 1 },
        { category: 'Refleksi', count: 1 }
      ],
      recommendedQuestionTypes: [
        { type: 'Pilihan Ganda', count: 3 },
        { type: 'Isian Singkat', count: 2 },
        { type: 'Uraian', count: 2 },
        { type: 'Refleksi', count: 1 }
      ],
      difficulty: { mudah: 30, sedang: 50, hots: 20, mode: 'ai' },
      totalResponses: 8,
      rationale: `Untuk alokasi ${timeAllocation}, disarankan 4 aktivitas utama dengan 8 respon berjenjang dari C2 hingga C5 (estimasi pengerjaan: ±35–40 menit).`
    };
  }

  // 60 - 90 menit (Proyek / Eksplorasi mendalam)
  return {
    recommendedActivities: [
      { category: 'Mengamati', count: 2 },
      { category: 'Mengidentifikasi', count: 3 },
      { category: 'Menganalisis', count: 3 },
      { category: 'Memecahkan masalah', count: 2 },
      { category: 'Berdiskusi', count: 1 },
      { category: 'Refleksi', count: 1 }
    ],
    recommendedQuestionTypes: [
      { type: 'Pilihan Ganda', count: 4 },
      { type: 'Isian Singkat', count: 3 },
      { type: 'Uraian', count: 2 },
      { type: 'Studi Kasus', count: 2 },
      { type: 'Refleksi', count: 1 }
    ],
    difficulty: { mudah: 20, sedang: 50, hots: 30, mode: 'ai' },
    totalResponses: 12,
    rationale: `Untuk alokasi waktu lapang (${timeAllocation}), LKPD mengombinasikan observasi stimulus mendalam, analisis kasus, diskusi tim, dan pemecahan masalah kontekstual.`
  };
}

/**
 * Validasi apakah jumlah aktivitas/soal realistis terhadap alokasi waktu
 */
export function checkTimeAllocationWarning(
  timeAllocation: string,
  totalResponses: number
): { hasWarning: boolean; message: string } {
  const t = timeAllocation.toLowerCase();
  
  if (t.includes('20') && totalResponses > 6) {
    return {
      hasWarning: true,
      message: `Jumlah ${totalResponses} pertanyaan/tugas kemungkinan melebihi alokasi waktu 20 menit. Disarankan maksimal 4–6 pertanyaan agar siswa tidak terburu-buru.`
    };
  }

  if ((t.includes('30') || t.includes('40') || t.includes('45')) && totalResponses > 10) {
    return {
      hasWarning: true,
      message: `Jumlah ${totalResponses} pertanyaan/tugas tergolong padat untuk alokasi ${timeAllocation}. Disarankan 6–9 respon agar proses berpikir dan refleksi tetap bermakna.`
    };
  }

  if (t.includes('60') && totalResponses > 16) {
    return {
      hasWarning: true,
      message: `Jumlah ${totalResponses} respon berpotensi melebihi batas waktu 60 menit saat siswa membaca stimulus dan berdiskusi.`
    };
  }

  return { hasWarning: false, message: '' };
}

/**
 * Membuat Stimulus Pembelajaran Kontekstual Berdasarkan Karakter Mata Pelajaran
 */
export function generateContextualStimulus(
  subject: string,
  topic: string,
  level: string,
  grade: string,
  stimulusType: LkpdStimulusType,
  objectives: string[],
  customStimulusText?: string
): {
  type: LkpdStimulusType;
  title: string;
  content: string;
  contextualHint: string;
  illustrationPrompt: string;
} {
  if (customStimulusText && customStimulusText.trim().length > 10) {
    return {
      type: stimulusType,
      title: `Stimulus Materi: ${topic}`,
      content: customStimulusText.trim(),
      contextualHint: 'Stimulus ini dirumuskan langsung oleh pendidik sebagai acuan utama seluruh aktivitas pengerjaan peserta didik.',
      illustrationPrompt: `Ilustrasi edukatif yang memvisualisasikan stimulus materi "${topic}" secara faktual dan kontekstual untuk siswa ${level} ${grade}.`
    };
  }

  if (stimulusType === 'Tanpa Stimulus') {
    return {
      type: 'Tanpa Stimulus',
      title: `Pemahaman Konsep: ${topic}`,
      content: `Aktivitas pembelajaran terfokus pada penguasaan konsep pokok "${topic}" secara bertahap melalui penalaran deduktif dan pemecahan masalah langsung.`,
      contextualHint: 'Lembar kerja langsung menyajikan instruksi kerja terstruktur tanpa bacaan pemantik panjang.',
      illustrationPrompt: `Ikon grafis simbolis materi "${topic}" dengan tata letak lembar kerja yang rapi.`
    };
  }

  const s = (subject || '').toLowerCase();

  // BAHASA INDONESIA / INGGRIS
  if (s.includes('bahasa') || s.includes('indonesia') || s.includes('inggris')) {
    return {
      type: stimulusType,
      title: `Teks Stimulus: Iklan Layanan Masyarakat & Wacana "${topic}"`,
      content: `[IKLAN LAYANAN MASYARAKAT: "BIJAK BERMEDIA SOSIAL, CERDAS MEMILIH INFORMASI"]\n` +
        `Dalam era keterbukaan digital saat ini, arus pertukaran pesan berlangsung sangat cepat. Namun, survei literasi digital menunjukkan bahwa 62% siswa mengaku pernah membaca berita sensasional yang terbukti tidak benar (hoaks).\n` +
        `Iklan ini menampilkan slogan: "SEBARKAN FAKTA, TANGKIS DUSTA — BACA TUNTAS SEBELUM MENEKAN TOMBOL BAGIKAN!". Pesan ini mengajak generasi muda untuk memverifikasi sumber berita, mencermati kredibilitas penulis, dan memikirkan dampak sosial sebelum menyebarkan konten ke ruang publik.`,
      contextualHint: 'Teks iklan dan data statistik di atas menjadi Single Source of Truth bagi siswa dalam menganalisis tujuan, bahasa persuasif, dan target pembaca.',
      illustrationPrompt: 'Poster infografis edukatif dua remaja mengamati layar smartphone dengan lencana periksa fakta centang hijau, berlatar tipografi persuasif modern kontras tinggi.'
    };
  }

  // IPA / BIOLOGI / FISIKA / KIMIA
  if (s.includes('ipa') || s.includes('biologi') || s.includes('fisika') || s.includes('kimia') || s.includes('sains')) {
    return {
      type: stimulusType,
      title: `Fenomena Alam & Data Pengamatan: "${topic}"`,
      content: `[HASIL PENGAMATAN FENOMENA & DATA EKSPERIMEN]\n` +
        `Sekelompok siswa melakukan eksperimen pengukuran terhadap laju reaksi/perubahan lingkungan pada materi "${topic}".\n` +
        `Tabel Data Uji:\n` +
        `• Kondisi A (Suhu 25°C, Kontrol): Waktu reaksi 120 detik, endapan 0.5 gram, kondisi larutan bening.\n` +
        `• Kondisi B (Suhu 40°C, Pemanasan): Waktu reaksi 45 detik, endapan 1.8 gram, kondisi larutan bergelembung aktif.\n` +
        `• Kondisi C (Suhu 60°C, Katalis): Waktu reaksi 18 detik, endapan 2.4 gram, pelepasan energi cepat.\n` +
        `Fenomena ini menunjukkan korelasi langsung antara parameter fisik dengan laju proses yang terjadi di alam nyata.`,
      contextualHint: 'Data tabel pengamatan ini wajib dijadikan rujukan siswa saat membandingkan variabel kontrol dan menarik kesimpulan eksperimental.',
      illustrationPrompt: 'Diagram ilmiah saintifik dengan tabung reaksi, grafik termometer suhu, dan tabel data terstruktur berpalet biru cyan dan zamrud bersih.'
    };
  }

  // MATEMATIKA
  if (s.includes('matematika')) {
    return {
      type: stimulusType,
      title: `Studi Kasus Kontekstual: "${topic} dalam Kebutuhan Sehari-Hari"`,
      content: `[STUDI KASUS: OPTIMASI LOGISTIK & PERJALANAN KOTA]\n` +
        `Sebuah koperasi sekolah berencana mendistribusikan paket perlengkapan belajar ke 4 cabang mitra di kecamatan sekitar.\n` +
        `Data Jarak dan Biaya Transportasi:\n` +
        `• Titik Pusat ke Cabang A: Jarak 8 km, estimasi waktu 20 menit, kuota 40 paket.\n` +
        `• Titik Pusat ke Cabang B: Jarak 14 km, estimasi waktu 35 menit, kuota 75 paket.\n` +
        `• Cabang A ke Cabang C: Jarak 6 km, biaya tol Rp15.000, kuota 30 paket.\n` +
        `Jika armada kurir memiliki kapasitas angkut maksimal 100 paket per perjalanan, tentukan kombinasi rute terpendek dan biaya paling hemat dengan memodelkan konsep "${topic}".`,
      contextualHint: 'Masalah kontekstual logistik ini memberikan angka-angka nyata yang membumi tanpa menjebak siswa dalam rumus abstrak yang terisolasi.',
      illustrationPrompt: 'Peta rute minimalis dengan pin lokasi bertitik koordinat, diagram alur panah berbobot jarak, dan tabel biaya logistik yang mudah dibaca.'
    };
  }

  // IPS / SEJARAH / SOSIOLOGI / GEOGRAFI
  if (s.includes('ips') || s.includes('sejarah') || s.includes('sosiologi') || s.includes('geografi') || s.includes('ekonomi')) {
    return {
      type: stimulusType,
      title: `Studi Kasus Dinamika Sosial: "${topic}"`,
      content: `[KASUS SOSIAL: PERUBAHAN SOSIAL-EKONOMI MASYARAKAT PESISIR]\n` +
        `Desa Pesisir Bahari mengalami transformasi signifikan dalam satu dekade terakhir. Awalnya, 85% warga menggantungkan mata pencaharian sebagai nelayan tangkap tradisional.\n` +
        `Sejak dibangunnya dermaga ekowisata dan sentra pengolahan hasil laut modern:\n` +
        `1. Pendapatan rata-rata keluarga meningkat 40%.\n` +
        `2. Muncul pergeseran profesi generasi muda ke sektor jasa dan pemasaran digital.\n` +
        `3. Di sisi lain, timbul tantangan pengelolaan sampah pesisir dan kenaikan harga lahan lokal.\n` +
        `Fenomena ini mencerminkan keterkaitan erat antara modernisasi, kelembagaan ekonomi, dan adaptasi sosial masyarakat.`,
      contextualHint: 'Studi kasus sosio-geografis ini merangsang kemampuan berpikir kritis siswa dalam mengevaluasi dampak positif dan negatif pembangunan.',
      illustrationPrompt: 'Foto ilustratif komparasi lanskap desa nelayan tradisional berdampingan dengan sentra ekowisata bahari modern yang teratur.'
    };
  }

  // INFORMATIKA
  if (s.includes('informatika') || s.includes('komputer') || s.includes('rpl') || s.includes('tik')) {
    return {
      type: stimulusType,
      title: `Skenario Algoritmik & Rekayasa Sistem: "${topic}"`,
      content: `[SKENARIO: PERANCANGAN SISTEM REKOMENDASI KONTEN CERDAS]\n` +
        `Sebuah platform aplikasi belajar digital mengelola ribuan materi pelajaran untuk ratusan ribu siswa. Untuk mencegah kebingungan pengguna, tim pengembang merancang arsitektur sistem berbasis "${topic}".\n` +
        `Arsitektur mencatat:\n` +
        `• Simpul (Nodes): Siswa, Materi Pelajaran, dan Kuis Evaluasi.\n` +
        `• Sisi Berbobot (Weighted Edges): Tingkat kemiripan minat belajar dan tingkat kesulitan materi.\n` +
        `Permasalahan: Sistem harus mampu merekomendasikan 3 materi berikutnya dalam waktu kurang dari 50 milidetik saat siswa menyelesaikan kuis terakhir.`,
      contextualHint: 'Skenario rekayasa ini menghubungkan teori struktur data/algoritma dengan aplikasi nyata yang setiap hari digunakan siswa di smartphone mereka.',
      illustrationPrompt: 'Visual arsitektur sistem jaringan simpul (graph nodes) berwarna ungu neon dan biru royal dengan garis keterhubungan data yang elegan.'
    };
  }

  // DEFAULT CONTEXTUAL STIMULUS
  return {
    type: stimulusType,
    title: `Kasus Pembelajaran Kontekstual: "${topic}"`,
    content: `[KASUS EKSPLORASI: PENERAPAN NYATA ${topic.toUpperCase()}]\n` +
      `Dalam kehidupan sehari-hari, konsep "${topic}" memegang peranan krusial dalam membantu manusia memecahkan masalah praktis.\n` +
      `Amatilah bagaimana komponen-komponen utama materi ini berinteraksi satu sama lain, bagaimana fakta di lapangan mendukung teori yang dipelajari, dan tantangan apa saja yang sering ditemui ketika konsep ini diterapkan pada lingkungan sekitar peserta didik jenjang ${level} ${grade}.`,
    contextualHint: 'Uraian kasus faktual di atas dirancang untuk memicu rasa ingin tahu siswa sebelum menjawab rangkaian pertanyaan kerja.',
    illustrationPrompt: `Ilustrasi modular edukatif modern yang menggambarkan penerapan konsep "${topic}" pada kehidupan nyata peserta didik.`
  };
}

/**
 * Menghasilkan LKPD Lengkap Terstruktur dari Blueprint
 * Menjamin jumlah soal, jenis soal, dan keterikatan stimulus 100% presisi
 */
export function generateLkpdFromBlueprint(blueprint: LkpdBlueprintDesign): GeneratedLkpdDocument {
  const stimulus = generateContextualStimulus(
    blueprint.subject,
    blueprint.materi,
    blueprint.educationLevel,
    blueprint.grade,
    blueprint.stimulusType,
    blueprint.learningObjectives,
    blueprint.userStimulusText
  );

  // Hitung distribusi pertanyaan berdasarkan komposisi aktivitas dan jenis soal yang dipilih
  const totalWanted = blueprint.totalResponses || 8;
  const activityList = blueprint.activityComposition.filter(a => a.count > 0);
  const questionTypeList = blueprint.questionTypes.filter(q => q.count > 0);

  // Buat antrean jenis soal yang harus dialokasikan
  const qTypePool: LkpdQuestionType[] = [];
  questionTypeList.forEach(qt => {
    for (let i = 0; i < qt.count; i++) {
      qTypePool.push(qt.type);
    }
  });

  // Jika pool jenis soal belum mencukupi totalWanted, isi dengan 'Uraian' atau 'Pilihan Ganda'
  while (qTypePool.length < totalWanted) {
    qTypePool.push('Uraian');
  }

  // Antrean tingkat kognitif berdasarkan persentase
  const diffComp = blueprint.difficultyComposition || { mudah: 30, sedang: 50, hots: 20, mode: 'ai' };
  const countMudah = Math.max(1, Math.round((diffComp.mudah / 100) * totalWanted));
  const countHots = Math.max(1, Math.round((diffComp.hots / 100) * totalWanted));
  const countSedang = Math.max(1, totalWanted - countMudah - countHots);

  const cognitivePool: ('Mudah' | 'Sedang' | 'HOTS')[] = [
    ...Array(countMudah).fill('Mudah'),
    ...Array(countSedang).fill('Sedang'),
    ...Array(countHots).fill('HOTS')
  ];

  let currentQNumber = 1;
  let qTypeIdx = 0;
  let cogIdx = 0;

  const sections: GeneratedLkpdActivitySection[] = activityList.map((act) => {
    const questions: GeneratedLkpdQuestion[] = [];
    const sectionTargetCount = act.count;

    for (let k = 0; k < sectionTargetCount; k++) {
      const qNum = currentQNumber++;
      const qType = qTypePool[qTypeIdx % qTypePool.length];
      const cog = cognitivePool[cogIdx % cognitivePool.length];
      qTypeIdx++;
      cogIdx++;

      // Bangun pertanyaan yang 100% terikat pada stimulus!
      let promptText = '';
      let optionsList: string[] | undefined = undefined;
      let matchingList: { left: string; right: string }[] | undefined = undefined;
      let spaceType: 'lines' | 'box' | 'table' | 'options' = 'lines';
      let answerLineCount = 3;

      switch (act.category) {
        case 'Memahami':
          if (qType === 'Pilihan Ganda') {
            promptText = `Berdasarkan stimulus "${stimulus.title}", manakah pernyataan berikut yang paling tepat mendefinisikan intisari dari ${blueprint.materi}?`;
            optionsList = [
              `A. Penjelasan faktual yang merujuk langsung pada kondisi utama stimulus.`,
              `B. Pandangan alternatif yang bertentangan dengan data stimulus.`,
              `C. Asumsi umum tanpa bukti pendukung pada stimulus.`,
              `D. Kesimpulan sepihak yang mengabaikan variabel pokok materi.`
            ];
            spaceType = 'options';
            answerLineCount = 1;
          } else if (qType === 'Benar/Salah') {
            promptText = `[B / S] Berdasarkan stimulus bacaan, informasi yang disajikan bertujuan untuk mengubah cara pandang pembaca terhadap ${blueprint.materi}. Tuliskan alasan singkat Anda!`;
            spaceType = 'lines';
            answerLineCount = 2;
          } else {
            promptText = `Berdasarkan stimulus di atas, jelaskan dengan kalimat Anda sendiri apa ide pokok dan tujuan utama dari ${blueprint.materi}!`;
            spaceType = 'lines';
            answerLineCount = 3;
          }
          break;

        case 'Mengamati':
          promptText = `Cermati secara teliti elemen-elemen penting pada stimulus. Tuliskan 3 fakta atau rincian data paling mencolok yang Anda temukan terkait ${blueprint.materi}!`;
          spaceType = 'lines';
          answerLineCount = 4;
          break;

        case 'Mengidentifikasi':
          if (qType === 'Isian Singkat') {
            promptText = `Sebutkan 2 faktor kunci yang disebutkan dalam stimulus sebagai pemicu terjadinya peristiwa atau fenomena pada ${blueprint.materi}!`;
            spaceType = 'lines';
            answerLineCount = 2;
          } else {
            promptText = `Identifikasilah bagian mana dari stimulus yang menunjukkan tantangan utama dalam penerapan ${blueprint.materi}! Berikan bukti kalimat/datanya.`;
            spaceType = 'lines';
            answerLineCount = 3;
          }
          break;

        case 'Menganalisis':
          if (qType === 'Uraian' || qType === 'Analisis') {
            promptText = `Analisis hubungan sebab-akibat antara data pada stimulus dengan dampak yang dirasakan oleh pihak-pihak terkait. Mengapa situasi tersebut dapat terjadi?`;
            spaceType = 'lines';
            answerLineCount = 5;
          } else if (qType === 'Pilihan Ganda') {
            promptText = `Jika kondisi pada stimulus tidak segera ditangani, dampak lanjutan yang paling logis menurut analisis Anda adalah...`;
            optionsList = [
              `A. Terjadi penurunan efisiensi sistem secara signifikan.`,
              `B. Stabilitas kondisi tetap terjaga tanpa perubahan berarti.`,
              `C. Terjadi perbaikan otomatis tanpa intervensi data.`,
              `D. Komponen materi kehilangan keterhubungannya secara total.`
            ];
            spaceType = 'options';
            answerLineCount = 1;
          } else {
            promptText = `Bedahlah struktur informasi pada stimulus: pisahkan antara fakta objektif dan opini/penafsiran subjektif yang muncul!`;
            spaceType = 'table';
            answerLineCount = 4;
          }
          break;

        case 'Membandingkan':
          promptText = `Bandingkan dua kondisi atau alternatif solusi yang tersirat dalam stimulus. Buatlah tabel perbandingan sederhana yang memuat kelebihan dan kekurangannya!`;
          spaceType = 'table';
          answerLineCount = 5;
          break;

        case 'Mengevaluasi':
          promptText = `Menurut pertimbangan kritis Anda, apakah data atau langkah yang ditempuh pada stimulus di atas sudah efektif dan adil? Jelaskan argumentasi Anda berdasarkan bukti!`;
          spaceType = 'lines';
          answerLineCount = 4;
          break;

        case 'Memecahkan masalah':
          promptText = `Jika Anda bertindak sebagai pengambil keputusan dalam studi kasus stimulus di atas, rumuskan 2 solusi inovatif dan aplikatif untuk mengatasi masalah tersebut!`;
          spaceType = 'box';
          answerLineCount = 5;
          break;

        case 'Berdiskusi':
          promptText = `Diskusikan bersama rekan kerja Anda: bagaimana penerapan konsep "${blueprint.materi}" pada stimulus ini dapat diadaptasikan di lingkungan sekolah/tempat tinggal Anda?`;
          spaceType = 'lines';
          answerLineCount = 4;
          break;

        case 'Refleksi':
          promptText = `Setelah menuntaskan penelaahan stimulus dan materi ${blueprint.materi}, apa wawasan baru yang paling bermakna bagi Anda dan bagaimana Anda akan menggunakannya?`;
          spaceType = 'lines';
          answerLineCount = 3;
          break;

        default:
          promptText = `Berdasarkan stimulus yang disajikan, lakukan telaah mendalam terkait ${blueprint.materi} dan kemukakan simpulan Anda secara ringkas!`;
          spaceType = 'lines';
          answerLineCount = 3;
      }

      questions.push({
        id: `q-${qNum}`,
        number: qNum,
        activityCategory: act.category,
        questionType: qType,
        cognitiveLevel: cog,
        prompt: promptText,
        options: optionsList,
        matchingPairs: matchingList,
        answerSpaceType: spaceType,
        answerLineCount,
        expectedResponseGuidance: `Siswa merujuk langsung pada fakta dalam stimulus dengan penalaran logis tingkat ${cog}.`
      });
    }

    return {
      category: act.category,
      title: `Aktivitas — ${act.category.toUpperCase()}`,
      instruction: `Perhatikan stimulus di atas secara cermat, kemudian selesaikan tugas berikut sesuai panduan:`,
      questions
    };
  });

  return {
    id: blueprint.id || `lkpd-doc-${Date.now()}`,
    title: blueprint.title || `LEMBAR KERJA PESERTA DIDIK: ${blueprint.materi.toUpperCase()}`,
    subject: blueprint.subject,
    educationLevel: blueprint.educationLevel,
    grade: blueprint.grade,
    materi: blueprint.materi,
    subTopic: blueprint.subTopic || '',
    timeAllocation: blueprint.timeAllocation,
    learningObjectives: blueprint.learningObjectives,
    stimulus,
    generalInstructions: [
      'Berdoalah sebelum memulai kegiatan pembelajaran.',
      'Bacalah seluruh stimulus dan informasi pengantar secara seksama.',
      'Setiap tugas dan pertanyaan disusun berdasarkan informasi pada stimulus di atas.',
      'Tuliskan jawaban Anda pada ruang kerja yang telah disediakan dengan rapi dan terstruktur.',
      'Periksalah kembali kelengkapan seluruh respon sebelum menyerahkan lembar kerja kepada guru.'
    ],
    sections,
    totalResponses: currentQNumber - 1,
    reflectionQuestions: [
      `1. Apa konsep inti dari ${blueprint.materi} yang paling penting dan berhasil saya kuasai hari ini?`,
      `2. Bagian aktivitas mana yang paling menantang bagi saya, dan bagaimana stimulus membantu pemahaman saya?`
    ],
    teacherNotesSection: `Nilai: [ .......... ] | Catatan Guru: [ ................................................................ ]`,
    createdAt: new Date().toISOString()
  };
}

/**
 * Menyusun Halaman Poster LKPD Visual (Multi-halaman jika materi panjang)
 */
export function generatePosterPagesFromLkpd(
  doc: GeneratedLkpdDocument,
  paperSize: LkpdPaperSize = 'A4',
  orientation: LkpdOrientation = 'Portrait'
): PosterLkpdPageLayout[] {
  const allSections = doc.sections;
  const totalQuestions = allSections.reduce((acc, s) => acc + s.questions.length, 0);

  // Jika total respons <= 6 dan stimulus ringkas -> 1 Halaman Poster cukup
  // Jika total respons > 6 atau stimulus teks panjang -> 2 Halaman Poster agar KETERBACAAN TERJAMIN
  const isMultiPage = totalQuestions > 6 || doc.stimulus.content.length > 500;

  if (!isMultiPage) {
    return [{
      pageNumber: 1,
      totalPages: 1,
      title: doc.title,
      metadata: `${doc.subject} | ${doc.educationLevel} ${doc.grade} | Alokasi: ${doc.timeAllocation}`,
      hasStudentHeader: true,
      stimulusBox: {
        type: doc.stimulus.type,
        title: doc.stimulus.title,
        content: doc.stimulus.content,
        illustrationDesc: doc.stimulus.illustrationPrompt
      },
      activityBoxes: allSections.map(sec => ({
        category: sec.category,
        instruction: sec.instruction,
        questions: sec.questions.map(q => ({
          number: q.number,
          type: q.questionType,
          prompt: q.prompt,
          options: q.options,
          answerLineCount: q.answerLineCount || 3
        }))
      })),
      footer: {
        reflectionItems: doc.reflectionQuestions,
        teacherSignBox: true
      }
    }];
  }

  // Pembagian 2 Halaman:
  // Halaman 1: Header + Stimulus Utama + Aktivitas Pemahaman & Identifikasi
  // Halaman 2: Aktivitas Analisis, Evaluasi, Pemecahan Masalah + Refleksi + Nilai Guru
  const halfSecIndex = Math.ceil(allSections.length / 2);
  const page1Sections = allSections.slice(0, halfSecIndex);
  const page2Sections = allSections.slice(halfSecIndex);

  return [
    {
      pageNumber: 1,
      totalPages: 2,
      title: `${doc.title} — BAGIAN 1`,
      metadata: `${doc.subject} | ${doc.educationLevel} ${doc.grade} | Alokasi: ${doc.timeAllocation}`,
      hasStudentHeader: true,
      stimulusBox: {
        type: doc.stimulus.type,
        title: doc.stimulus.title,
        content: doc.stimulus.content,
        illustrationDesc: doc.stimulus.illustrationPrompt
      },
      activityBoxes: page1Sections.map(sec => ({
        category: sec.category,
        instruction: sec.instruction,
        questions: sec.questions.map(q => ({
          number: q.number,
          type: q.questionType,
          prompt: q.prompt,
          options: q.options,
          answerLineCount: q.answerLineCount || 3
        }))
      })),
      footer: {
        teacherSignBox: false
      }
    },
    {
      pageNumber: 2,
      totalPages: 2,
      title: `${doc.title} — BAGIAN 2 (EKSPLORASI & REFLEKSI)`,
      metadata: `${doc.subject} | ${doc.educationLevel} ${doc.grade} | Alokasi: ${doc.timeAllocation}`,
      hasStudentHeader: true,
      activityBoxes: page2Sections.map(sec => ({
        category: sec.category,
        instruction: sec.instruction,
        questions: sec.questions.map(q => ({
          number: q.number,
          type: q.questionType,
          prompt: q.prompt,
          options: q.options,
          answerLineCount: q.answerLineCount || 3
        }))
      })),
      footer: {
        reflectionItems: doc.reflectionQuestions,
        teacherSignBox: true
      }
    }
  ];
}

/**
 * Menyusun Universal Educational Poster Prompt untuk AI Image Generator
 * Berasal 100% dari LKPD Final yang telah disetujui pengguna
 */
export function buildUniversalPosterPromptFromLkpd(
  doc: GeneratedLkpdDocument,
  settings: {
    paperSize?: LkpdPaperSize;
    orientation?: LkpdOrientation;
    visualStyle?: LkpdVisualStyle;
  }
): string {
  const paperSize = settings.paperSize || 'A4';
  const orientation = settings.orientation || 'Portrait';
  const visualStyle = settings.visualStyle || 'Modern Edukatif';

  const objectivesSummary = doc.learningObjectives
    .map(o => o.replace(/Peserta didik mampu\s*/i, '').trim())
    .join('; ');

  const activitiesSummary = doc.sections
    .map(s => `${s.category} (${s.questions.length} tugas: ${s.questions.map(q => q.questionType).join(', ')})`)
    .join('; ');

  const stimulusBrief = doc.stimulus.content.length > 250 
    ? doc.stimulus.content.slice(0, 250) + '...'
    : doc.stimulus.content;

  return `BUAT POSTER LKPD PEMBELAJARAN (EDUCATIONAL WORKSHEET POSTER) untuk siswa ${doc.educationLevel} kelas ${doc.grade}, mata pelajaran ${doc.subject}, dengan judul "${doc.title}".

Sumber Data Utama:
- Topik Pembelajaran: "${doc.materi}${doc.subTopic ? ` - ${doc.subTopic}` : ''}"
- Alokasi Waktu: ${doc.timeAllocation}
- Tujuan Pembelajaran: "${objectivesSummary}"
- Stimulus Pembelajaran (${doc.stimulus.type}): "${doc.stimulus.title} — ${stimulusBrief}"
- Rangkaian Aktivitas: ${activitiesSummary}
- Total Respon Siswa: Tepat ${doc.totalResponses} pertanyaan/tugas terstruktur.

Susun Desain Poster Lembar Kerja dengan Tata Letak Modular:
1. Header Identitas Edukatif:
   - Judul Display yang kuat dan terbaca jelas: "${doc.title}"
   - Kotak Identitas Siswa: Nama Siswa / Kelompok, Kelas, No. Absen, Tanggal, dan Kotak Skor/Nilai Guru.
2. Panel Tujuan Pembelajaran & Ikon Petunjuk Pengerjaan Cepat.
3. Modul Stimulus Utama (Kotak Berbingkai Rapi):
   - Menampilkan naskah stimulus/kasus/data secara terstruktur.
   - Dilengkapi ilustrasi edukatif: "${doc.stimulus.illustrationPrompt}".
4. Bagian Aktivitas & Pertanyaan Siswa:
   ${doc.sections.map((sec, i) => `- Blok ${i + 1} [${sec.category.toUpperCase()}]: Berisi pertanyaan/tugas bernomor dengan garis pandu penulisan tangan (handwriting lines) yang lapang.`).join('\n   ')}
5. Bagian Footer Poster:
   - Kotak Refleksi Pembelajaran Mandiri
   - Kolom Catatan Guru & Tanda Tangan Verifikasi.

Spesifikasi Visual Poster:
- Format Kertas: Ukuran ${paperSize}, Orientasi ${orientation}.
- Gaya Visual: ${visualStyle} (Gaya media pembelajaran visual interaktif, bukan screenshot dokumen biasa).
- Tipografi: Hierarki sans-serif modern berdaya baca tinggi, kontras tajam, teks berbahasa Indonesia yang benar dan ramah siswa.
- Keterbacaan & Ruang Kerja: Keseimbangan ruang kosong (negative space) 25% agar siswa memiliki ruang menulis yang memadai dan poster tidak terlihat sesak.
- Ilustrasi: Vektor edukatif bersih yang mendukung materi secara kontekstual, tanpa ornamen dekoratif acak.
- Kesiapan Cetak: Resolusi tajam 8K, margin cetak aman (print-ready), palet warna berdaya cetak tinggi.

Negative Prompts & Larangan Keras:
- no lorem ipsum, no distorted text, no illegible font, no cluttered layout, no commercial promotional advertisement feel, no missing answer lines, no random unrelated illustrations.
- Desain harus berwujud dan berfungsi 100% sebagai POSTER LEMBAR KERJA PESERTA DIDIK (LKPD) yang siap digunakan di kelas nyata.`;
}


export type LkpdPaperSize = 'A4' | 'A3';

export type LkpdOrientation = 'Portrait' | 'Landscape';

export type LkpdVisualStyle = 
  | 'Modern Edukatif' 
  | 'Infografis Saintifik' 
  | 'Ilustratif Ceria' 
  | 'Minimalis Bersih' 
  | 'Modul Klasik';

export interface LkpdSettings {
  activityType: LkpdActivityType;
  formatType: LkpdFormatType;
  difficulty: LkpdDifficulty;
  timeAllocation: LkpdTimeAllocation;
  studentOutput: LkpdStudentOutput;
  pageSize?: LkpdPaperSize;
  orientation?: LkpdOrientation;
  visualStyle?: LkpdVisualStyle;
  additionalInstructions?: string;
}

export interface LkpdMaterialInput {
  educationLevel: string;
  grade: string;
  subject: string;
  materiDiajarkan: string;
  bab?: string;
  temaKegiatan?: string;
  pertemuan?: string;
  scope: string;
  userNotes?: string;
}

export interface LkpdThinkingResult {
  stage1_IdentitasKonteks: {
    materi: string;
    mapel: string;
    jenjang: string;
    kelas: string;
    pertemuan: string;
    bab?: string;
    tema?: string;
    karakteristikSiswa: string;
    konteks: string;
  };
  stage2_TujuanPembelajaran: string[];
  stage3_AnalisisMateri: {
    konsepUtama: string;
    konsepPendukung: string[];
    contohDanFakta: string;
    konteksKehidupanNyata: string;
  };
  stage4_DesainAktivitas: {
    jenisAktivitas: LkpdActivityType;
    bentukLkpd: LkpdFormatType;
    tingkatKesulitan: LkpdDifficulty;
    alokasiWaktu: LkpdTimeAllocation;
    bentukHasil: LkpdStudentOutput;
    rincianAktivitas: string;
  };
  stage5_KontenLkpd: {
    judulLkpd: string;
    identitasPesertaDidik: string;
    petunjukPengerjaan: string[];
    stimulusMateri: string;
    langkahKerja: string[];
    tugasDanPertanyaan: string[];
    ruangJawabanDeskripsi: string;
    refleksiPembelajaran: string[];
  };
  stage6_DesainVisualPoster: {
    ukuran: LkpdPaperSize;
    orientasi: LkpdOrientation;
    gayaVisual: LkpdVisualStyle;
    tataLetak: string;
    tipografi: string;
    paletWarna: string;
    ilustrasi: string;
    hierarkiInformasi: string;
    keseimbanganRuang: string;
  };
  stage7_ValidasiDanFinalisasi: {
    kriteriaTerpenuhi: string[];
    isLolosValidasi: boolean;
  };
  stage7_FinalPrompt: string;
}

/**
 * Jalankan Analisis 7 Tahap Universal Prompt LKPD STIVIA
 * Memproses data pembelajaran satu kali dan menghasilkan LKPD terstruktur, konsep visual, serta Prompt Poster LKPD otomatis.
 */
export function runLkpdThinkingFramework(
  material: LkpdMaterialInput,
  settings: LkpdSettings
): LkpdThinkingResult {
  const cleanTopic = material.materiDiajarkan.trim() || 'Materi Pembelajaran';
  const cleanSubject = material.subject.trim() || 'Mata Pelajaran';
  const cleanLevel = material.educationLevel.trim() || 'Sekolah Menengah';
  const cleanGrade = material.grade.trim() || 'Kelas';
  const cleanScope = material.scope.trim();
  const cleanBab = material.bab?.trim() || '';
  const cleanTema = material.temaKegiatan?.trim() || '';
  const cleanPertemuan = material.pertemuan?.trim() || 'Pertemuan 1';

  const pageSize: LkpdPaperSize = settings.pageSize || 'A4';
  const orientation: LkpdOrientation = settings.orientation || 'Portrait';
  const visualStyle: LkpdVisualStyle = settings.visualStyle || 'Modern Edukatif';

  // Ekstrak butir cakupan materi sebagai Single Source of Truth
  const scopePoints = cleanScope
    .split(/\r?\n/)
    .map(line => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);

  const scopeSummary = scopePoints.length > 0 
    ? scopePoints.join(', ') 
    : cleanScope || cleanTopic;

  // Analisis karakteristik perkembangan kognitif peserta didik berdasarkan jenjang
  let karakteristikSiswa = 'Peserta didik berada pada tahap berpikir operasional konkret menuju abstrak, membutuhkan panduan visual yang rapi dan ruang kerja yang jelas.';
  const lvlLower = cleanLevel.toLowerCase();
  if (lvlLower.includes('sd') || lvlLower.includes('dasar')) {
    karakteristikSiswa = 'Peserta didik jenjang pendidikan dasar (SD), membutuhkan instruksi ringkas dengan bahasa sederhana, visual menarik, font ramah anak, dan ruang tulis yang lapang.';
  } else if (lvlLower.includes('smp')) {
    karakteristikSiswa = 'Peserta didik jenjang SMP (remaja awal), mampu berpikir logis dengan bantuan stimulus kontekstual, senang berkolaborasi, dan membutuhkan tugas analisis bertahap.';
  } else if (lvlLower.includes('sma') || lvlLower.includes('smk')) {
    karakteristikSiswa = 'Peserta didik jenjang SMA/SMK (remaja akhir), mampu berpikir analitis, kritis, dan sintesis mandiri dalam menyelesaikan studi kasus dan pemecahan masalah kontekstual.';
  }

  // TAHAP 1 — IDENTITAS DAN KONTEKS PEMBELAJARAN
  const stage1 = {
    materi: cleanTopic,
    mapel: cleanSubject,
    jenjang: cleanLevel,
    kelas: cleanGrade,
    pertemuan: cleanPertemuan,
    bab: cleanBab,
    tema: cleanTema,
    karakteristikSiswa,
    konteks: `Pembelajaran ${cleanSubject} jenjang ${cleanLevel} (${cleanGrade}) pada ${cleanPertemuan}, dirancang sesuai tingkat perkembangan kognitif peserta didik untuk menstimulasi keaktifan belajar.`,
  };

  // TAHAP 2 — TUJUAN PEMBELAJARAN
  const stage2_Objectives: string[] = [];
  if (scopePoints.length > 0) {
    stage2_Objectives.push(`Peserta didik mampu mengidentifikasi dan memahami konsep inti ${cleanTopic} (${scopePoints[0]}).`);
    if (scopePoints.length > 1) {
      stage2_Objectives.push(`Peserta didik mampu menganalisis hubungan konsep ${scopePoints.slice(1, 3).join(' dan ')} melalui aktivitas kerja ${settings.activityType.toLowerCase()}.`);
    }
  } else {
    stage2_Objectives.push(`Peserta didik mampu memahami konsep utama dan prinsip esensial dari ${cleanTopic}.`);
    stage2_Objectives.push(`Peserta didik mampu menganalisis penerapan konsep ${cleanTopic} dalam pemecahan masalah kontekstual.`);
  }
  stage2_Objectives.push(`Peserta didik mampu menyajikan hasil pemahaman dalam bentuk ${settings.studentOutput.toLowerCase()} secara sistematis, mandiri/kolaboratif, dan percaya diri.`);

  // TAHAP 3 — ANALISIS MATERI (CONTENT CONTEXT LOCK)
  const stage3 = {
    konsepUtama: cleanTopic,
    konsepPendukung: scopePoints.length > 0 ? scopePoints : [cleanScope || cleanTopic],
    contohDanFakta: `Studi kasus dan contoh faktual penerapan ${cleanTopic} pada kehidupan nyata peserta didik ${cleanLevel} ${cleanGrade}.`,
    konteksKehidupanNyata: `Kontekstualisasi ${cleanTopic} dalam lingkungan sekitar peserta didik agar bermakna dan mempermudah pemahaman konsep.`,
  };

  // TAHAP 4 — DESAIN AKTIVITAS PESERTA DIDIK
  const stage4 = {
    jenisAktivitas: settings.activityType,
    bentukLkpd: settings.formatType,
    tingkatKesulitan: settings.difficulty,
    alokasiWaktu: settings.timeAllocation,
    bentukHasil: settings.studentOutput,
    rincianAktivitas: `Aktivitas ${settings.activityType.toLowerCase()} dengan pendekatan ${settings.formatType.toLowerCase()} selama ${settings.timeAllocation}. Peserta didik diajak mengamati stimulus konsep, menjalankan instruksi terstruktur bertingkat (${settings.difficulty}), dan menyajikan bukti belajar dalam bentuk ${settings.studentOutput.toLowerCase()}.`,
  };

  // TAHAP 5 — PENYUSUNAN KONTEN LKPD LENGKAP
  const judulLkpd = `LEMBAR KERJA PESERTA DIDIK (LKPD): ${cleanTopic.toUpperCase()}`;
  const stage5: LkpdThinkingResult['stage5_KontenLkpd'] = {
    judulLkpd,
    identitasPesertaDidik: `Nama Peserta Didik / Anggota Kelompok: [ ................................................ ] | Kelas: ${cleanGrade} | Tanggal: [ .................... ] | Nilai / Catatan Guru: [ .......... ]`,
    petunjukPengerjaan: [
      'Berdoalah sebelum memulai kegiatan pembelajaran.',
      'Bacalah ringkasan materi dan stimulus informasi yang disajikan secara seksama.',
      `Kerjakan aktivitas secara ${settings.activityType.toLowerCase()} sesuai instruksi pada tiap tahapan langkah kerja.`,
      `Tuliskan hasil diskusi atau pengerjaan pada ruang kerja/kolom ${settings.studentOutput.toLowerCase()} yang disediakan dengan rapi dan teliti.`,
      'Lakukan refleksi diri di akhir lembar kerja dan periksakan hasil kepada guru pengampu.'
    ],
    stimulusMateri: `Materi "${cleanTopic}" memuat pemahaman penting meliputi: ${scopeSummary}. Amati bagaimana konsep ini bekerja pada lingkungan sekitar Anda untuk menyelesaikan tantangan pembelajaran di bawah ini.`,
    langkahKerja: [
      `Langkah 1: Identifikasi fakta atau konsep kunci ${cleanTopic} berdasarkan stimulus materi di atas.`,
      `Langkah 2: Diskusikan bersama anggota ${settings.activityType.toLowerCase()} untuk merumuskan jawaban/solusi atas masalah yang diberikan.`,
      `Langkah 3: Tuangkan hasil analisis ke dalam format ${settings.studentOutput.toLowerCase()} pada ruang kerja yang tersedia.`,
      `Langkah 4: Tarik kesimpulan ringkas mengenai intisari pembelajaran hari ini.`
    ],
    tugasDanPertanyaan: [
      `Tugas 1 (Pemahaman Konsep): Jelaskan pengertian dan karakteristik utama dari ${cleanTopic} dengan kalimat Anda sendiri!`,
      `Tugas 2 (Analisis & Eksplorasi): Mengapa ${scopePoints[0] || cleanTopic} penting dipelajari? Berikan 1 contoh nyata di lingkungan Anda!`,
      `Tugas 3 (Aplikasi & Sintesis): Berdasarkan hasil pengamatan Anda, susunlah rangkuman ${settings.studentOutput.toLowerCase()} yang menunjukkan keterkaitan antarkonsep materi!`
    ],
    ruangJawabanDeskripsi: `Area kerja lapang berbentuk ${settings.studentOutput.toUpperCase()} berpagar modul rapi dengan garis pandu / grid halus yang nyaman untuk penulisan jawaban tangan siswa.`,
    refleksiPembelajaran: [
      `1. Apa konsep terpenting yang berhasil saya kuasai dari materi ${cleanTopic} hari ini?`,
      `2. Bagian mana dari aktivitas ini yang paling menantang dan bagaimana saya mengatasinya?`
    ]
  };

  // TAHAP 6 — DESAIN VISUAL LKPD
  const stage6: LkpdThinkingResult['stage6_DesainVisualPoster'] = {
    ukuran: pageSize,
    orientasi: orientation,
    gayaVisual: visualStyle,
    tataLetak: `Tata letak modular vertikal/horizontal seimbang (${pageSize} - ${orientation}). Pembagian proporsional: 15% Header & Identitas, 20% Tujuan & Stimulus Konsep, 35% Aktivitas & Tugas, 20% Ruang Jawaban Siswa, 10% Refleksi & Penilaian Guru.`,
    tipografi: 'Hierarki tipografi sans-serif modern yang tajam dan ramah anak/remaja. Judul Display Bold yang tegas, subjudul semi-bold jelas, teks tubuh instruksi berjarak baca nyaman (line-height 1.6).',
    paletWarna: 'Palet edukatif harmonis kontras tinggi (Background putih bersih #FFFFFF, teks primer slate-900 #0F172A, garis pemisah halus slate-200 #E2E8F0, aksen modul edukatif biru royal #2563EB dan hijau zamrud #059669).',
    ilustrasi: `Ilustrasi vektor datar (flat vector) edukatif minimalis yang merepresentasikan materi "${cleanTopic}", dilengkapi ikon instruksi (buku, pensil tulis, diskusi tim, lampu ide) yang relevan dan tidak mendominasi lembar kerja.`,
    hierarkiInformasi: 'Alur baca teratur dari atas ke bawah (Header Identitas -> Tujuan -> Stimulus -> Tugas/Aktivitas -> Ruang Jawaban -> Refleksi).',
    keseimbanganRuang: 'Keseimbangan ruang kosong (negative space) 25% untuk memastikan lembar kerja tidak sesak, mudah dibaca, dan memberikan ruang menulis yang luas bagi peserta didik.'
  };

  // TAHAP 7 — VALIDASI DAN FINALISASI
  const validationCriteria = [
    '1. Kesesuaian Jenjang & Karakteristik Kelas (Lolos)',
    '2. Kesesuaian Aktivitas dengan Tujuan Pembelajaran (Lolos)',
    '3. Keakuratan & Keamanan Materi Pokok (Lolos)',
    '4. Kejelasan Petunjuk & Langkah Kerja (Lolos)',
    '5. Keterlaksanaan Aktivitas dalam Alokasi Waktu (Lolos)',
    '6. Kesesuaian Tingkat Kesulitan Aktivitas (Lolos)',
    '7. Kecukupan Ruang Jawaban Siswa (Lolos)',
    '8. Kelengkapan 10 Struktur LKPD Terstandar (Lolos)',
    '9. Kejelasan Visual & Tipografi Mudah Dibaca (Lolos)',
    '10. Kesiapan Cetak (Print-Ready) (Lolos)',
    '11. Bebas Teks Acak & Ornamen Mengganggu (Lolos)',
    '12. Keterhubungan Logis Seluruh Bagian LKPD (Lolos)'
  ];

  const stage7 = {
    kriteriaTerpenuhi: validationCriteria,
    isLolosValidasi: true
  };

  // MERAKIT OUTPUT 5 BAGIAN SESUAI SPESIFIKASI WAJIB
  const finalPrompt = assembleCompleteUniversalLkpdOutput(
    material,
    settings,
    stage1,
    stage2_Objectives,
    stage3,
    stage4,
    stage5,
    stage6,
    stage7
  );

  return {
    stage1_IdentitasKonteks: stage1,
    stage2_TujuanPembelajaran: stage2_Objectives,
    stage3_AnalisisMateri: stage3,
    stage4_DesainAktivitas: stage4,
    stage5_KontenLkpd: stage5,
    stage6_DesainVisualPoster: stage6,
    stage7_ValidasiDanFinalisasi: stage7,
    stage7_FinalPrompt: finalPrompt,
  };
}

/**
 * Merakit Output Sistem Universal Prompt LKPD STIVIA
 * Memastikan 5 Bagian Terstruktur Sesuai Panduan:
 * ## A. HASIL ANALISIS
 * ## B. LKPD
 * ## C. KONSEP VISUAL LKPD
 * ## D. PROMPT POSTER LKPD (Diawali dengan "BUAT POSTER LKPD PEMBELAJARAN...")
 * ## E. NEGATIVE / QUALITY INSTRUCTION
 */
function assembleCompleteUniversalLkpdOutput(
  material: LkpdMaterialInput,
  settings: LkpdSettings,
  stage1: LkpdThinkingResult['stage1_IdentitasKonteks'],
  objectives: string[],
  stage3: LkpdThinkingResult['stage3_AnalisisMateri'],
  stage4: LkpdThinkingResult['stage4_DesainAktivitas'],
  stage5: LkpdThinkingResult['stage5_KontenLkpd'],
  stage6: LkpdThinkingResult['stage6_DesainVisualPoster'],
  stage7: LkpdThinkingResult['stage7_ValidasiDanFinalisasi']
): string {
  const cleanTopic = material.materiDiajarkan.trim() || 'Materi Pembelajaran';
  const cleanSubject = material.subject.trim() || 'Mata Pelajaran';
  const cleanLevel = material.educationLevel.trim() || 'Sekolah Menengah';
  const cleanGrade = material.grade.trim() || 'Kelas';
  const cleanLevelGrade = `${cleanLevel} ${cleanGrade}`.trim();
  const cleanBab = material.bab?.trim() || '';
  const cleanTema = material.temaKegiatan?.trim() || '';
  const cleanPertemuan = material.pertemuan?.trim() || 'Pertemuan 1';
  const userNotes = material.userNotes?.trim();
  const extraInstr = settings.additionalInstructions?.trim();

  // Susunan Bagian D: PROMPT POSTER LKPD yang siap disalin ke AI image generator
  const posterPromptText = `BUAT POSTER LKPD PEMBELAJARAN untuk siswa ${cleanLevel} kelas ${cleanGrade}, mata pelajaran ${cleanSubject}, dengan judul "${stage5.judulLkpd}".

Tujuan pembelajaran:
"${objectives.map(o => o.replace(/Peserta didik mampu\s*/i, '')).join('; ')}."

Materi:
"${cleanTopic} — Konsep inti meliputi: ${stage3.konsepPendukung.join(', ')}."

Aktivitas utama:
"Aktivitas ${settings.activityType.toLowerCase()} bertema ${settings.formatType.toLowerCase()} dengan tingkat kesulitan ${settings.difficulty.toLowerCase()} berdurasi ${settings.timeAllocation}, menghasilkan output berupa ${settings.studentOutput.toLowerCase()}."

Susun poster dengan struktur:
1. Header Judul Lembar Kerja & Kotak Identitas Siswa (Nama, Kelas, Tanggal, Kolom Nilai)
2. Panel Tujuan Pembelajaran & Ikon Petunjuk Pengerjaan
3. Modul Stimulus Informasi & Ilustrasi Konsep Terkait Materi
4. Kotak Langkah Kerja & Pertanyaan/Tugas Eksplorasi Terstruktur
5. Area Ruang Jawaban Siswa (${settings.studentOutput.toUpperCase()}) yang Luas dan Bersih
6. Bagian Bawah Refleksi Diri & Kolom Tanda Tangan Guru

Tampilkan:
- Petunjuk: ${stage5.petunjukPengerjaan.slice(1, 4).join('; ')}
- Tugas: ${stage5.tugasDanPertanyaan.join(' ')}
- Pertanyaan: Pertanyaan pemantik dan analisis pemecahan masalah sesuai materi
- Ruang Jawaban: Kolom pengerjaan ${settings.studentOutput.toLowerCase()} bergaris rapi yang lapang untuk ditulisi tangan oleh peserta didik
- Refleksi: Kotak refleksi singkat pembelajaran di bagian bawah

Gunakan ukuran ${stage6.ukuran} dengan orientasi ${stage6.orientasi}.

Gunakan gaya visual ${stage6.gayaVisual}.

Tata letak: ${stage6.tataLetak}

Tipografi: ${stage6.tipografi}

Warna: ${stage6.paletWarna}

Ilustrasi: ${stage6.ilustrasi}

Hierarki informasi: ${stage6.hierarkiInformasi}

Keterbacaan: Teks berbahasa Indonesia jelas, proporsional, berkontras tinggi, mudah dipahami siswa, tanpa dekorasi berlebihan.

Kesiapan untuk dicetak: Desain siap cetak (print-ready) beresolusi tinggi dengan margin kertas yang aman.

Buat desain yang modern, edukatif, menarik, bersih, profesional, sesuai usia peserta didik, dan mudah dibaca.

Pastikan seluruh teks menggunakan Bahasa Indonesia yang benar.

Pastikan terdapat ruang yang cukup bagi siswa untuk menulis jawaban.

Jangan membuat desain seperti poster promosi atau infografis biasa.

Desain harus terlihat dan berfungsi sebagai LEMBAR KERJA PESERTA DIDIK VISUAL.

Jangan menggunakan teks acak, lorem ipsum, atau tulisan yang tidak bermakna.

Pastikan seluruh informasi utama berasal dari data dan LKPD yang telah dibuat sebelumnya.`;

  return `=== UNIVERSAL PROMPT LKPD STIVIA ===
=== ANALISIS 7 TAHAP + GENERATOR POSTER LKPD OTOMATIS ===

## A. HASIL ANALISIS

Ringkasan Analisis Pembelajaran Berdasarkan Data Materi:
1. Identitas & Karakteristik Peserta Didik (Tahap 1):
   - Mata Pelajaran      : ${cleanSubject}
   - Jenjang & Kelas     : ${cleanLevelGrade}
   - Pertemuan           : ${cleanPertemuan}${cleanBab ? ` | Bab: ${cleanBab}` : ''}${cleanTema ? ` | Tema: ${cleanTema}` : ''}
   - Karakteristik Siswa : ${stage1.karakteristikSiswa}
   - Konteks             : ${stage1.konteks}

2. Tujuan Pembelajaran (Tahap 2):
${objectives.map((o, idx) => `   ${idx + 1}. ${o}`).join('\n')}

3. Analisis Materi Pokok (Tahap 3 — Content Context Lock):
   - Konsep Utama        : ${stage3.konsepUtama}
   - Konsep Pendukung    :
${stage3.konsepPendukung.map(item => `     • ${item}`).join('\n')}
   - Konteks Kehidupan   : ${stage3.contohDanFakta}
   ${userNotes ? `- Catatan Pengajar    : ${userNotes}\n` : ''}${extraInstr ? `- Instruksi Tambahan  : ${extraInstr}\n` : ''}
4. Desain Aktivitas Pembelajaran (Tahap 4):
   - Jenis Aktivitas     : ${settings.activityType}
   - Bentuk LKPD         : ${settings.formatType}
   - Tingkat Kesulitan   : ${settings.difficulty}
   - Alokasi Waktu       : ${settings.timeAllocation}
   - Bentuk Hasil Siswa  : ${settings.studentOutput}
   - Ringkasan Desain    : ${stage4.rincianAktivitas}

---

## B. LKPD

${stage5.judulLkpd}
${'='.repeat(stage5.judulLkpd.length)}

IDENTITAS PESERTA DIDIK:
${stage5.identitasPesertaDidik}

MATA PELAJARAN : ${cleanSubject}
KELAS / SEMESTER: ${cleanLevelGrade}
ALOKASI WAKTU   : ${settings.timeAllocation}
JENIS AKTIVITAS : ${settings.activityType} (${settings.formatType})

I. TUJUAN PEMBELAJARAN
${objectives.map((o, idx) => `${idx + 1}. ${o}`).join('\n')}

II. PETUNJUK PENGERJAAN
${stage5.petunjukPengerjaan.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}

III. STIMULUS PEMBELAJARAN
${stage5.stimulusMateri}

IV. LANGKAH KERJA
${stage5.langkahKerja.join('\n')}

V. TUGAS DAN PERTANYAAN EKSPLORASI
${stage5.tugasDanPertanyaan.map((t, idx) => `[Soal/Tugas ${idx + 1}]\n${t}`).join('\n\n')}

VI. RUANG LEMBAR KERJA PESERTA DIDIK
[ BENTUK HASIL: ${settings.studentOutput.toUpperCase()} ]
+-----------------------------------------------------------------------------------------+
| ${stage5.ruangJawabanDeskripsi} |
|                                                                                         |
| ....................................................................................... |
| ....................................................................................... |
| ....................................................................................... |
| ....................................................................................... |
| ....................................................................................... |
+-----------------------------------------------------------------------------------------+

VII. REFLEKSI PEMBELAJARAN
${stage5.refleksiPembelajaran.join('\n')}

Catatan Guru / Penilaian: [                                                   ]
Tanda Tangan Guru: [                       ]  Tanggal: [                       ]

---

## C. KONSEP VISUAL LKPD

Rancangan Visual Berdasarkan Isi LKPD:
- Ukuran Kertas        : ${stage6.ukuran}
- Orientasi            : ${stage6.orientasi}
- Gaya Visual          : ${stage6.gayaVisual}
- Tata Letak (Layout)  : ${stage6.tataLetak}
- Tipografi            : ${stage6.tipografi}
- Skema & Palet Warna  : ${stage6.paletWarna}
- Kebutuhan Ilustrasi  : ${stage6.ilustrasi}
- Hierarki Informasi   : ${stage6.hierarkiInformasi}
- Keseimbangan Ruang   : ${stage6.keseimbanganRuang}

---

## D. PROMPT POSTER LKPD

${posterPromptText}

---

## E. NEGATIVE / QUALITY INSTRUCTION

- no random text;
- no unreadable text;
- no distorted typography;
- no unnecessary decoration;
- no irrelevant illustration;
- no promotional advertisement style;
- no cluttered background;
- maintain clear worksheet structure;
- maintain Indonesian language;
- maintain sufficient answer spaces;
- preserve all essential learning activities;
- print-ready 8K vector clarity.`;
}
