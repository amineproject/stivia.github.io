export interface VersionItem {
  version: string;
  updateName: string;
  status: 'Rilis Terbaru' | 'Versi Sebelumnya';
  tagline?: string;
  releaseDate: string;
  description: string;
  newFeatures: string[];
  improvements: string[];
  bugFixes: string[];
}

export const APP_CURRENT_VERSION = '2.2d';
export const APP_UPDATE_NAME = 'PENGEMBANGAN SISTEM DESAIN INFOGRAFIS';
export const APP_TAGLINE = 'Belajar Lebih Visual, Mengajar Lebih Mudah';

export const STIVIA_VERSION_HISTORY: VersionItem[] = [
  {
    version: '2.2d',
    updateName: 'PENGEMBANGAN SISTEM DESAIN INFOGRAFIS',
    status: 'Rilis Terbaru',
    tagline: 'Belajar Lebih Visual, Mengajar Lebih Mudah',
    releaseDate: 'September 2026',
    description: 'Pembaruan sistem visual, tipografi, dan kendali kurikulum STIVIA dengan penambahan field Pertemuan, penguatan batas cakupan materi, pencegahan pengulangan materi antarpertemuan, 5 kategori gaya infografis, tipografi otomatis, dan arsitektur Style Profile terpusat.',
    newFeatures: [
      'Menambahkan input "Pertemuan" (misalnya Pertemuan 1, Pertemuan 2, dst.) pada Informasi Pembelajaran dengan rekomendasi cepat dan fleksibilitas kustom.',
      'Menerapkan Analisis Batas Cakupan Materi 7 Tahap (Mata Pelajaran, Kelas, Materi Utama, Pertemuan, Cakupan Materi, Materi Boleh Dibahas, dan Materi Tidak Perlu Diulang).',
      'Menerapkan prinsip "Cakupan Materi = Batas Wajib Pembahasan": Materi Utama berfungsi sebagai konteks umum, sementara Cakupan Materi menjadi batas utama pembahasan.',
      'Sistem pencegahan pengulangan materi antarpertemuan cerdas: Mencegah materi pertemuan lanjutan mengulang definisi awal dan penjelasan dasar dari pertemuan sebelumnya.',
      'Menambahkan 5 kategori utama gaya infografis: Modern & Digital, Sederhana & Profesional, Kreatif & Ekspresif, Artistik & Tematik, serta Ilustratif & Edukatif.',
      'Mengembangkan sistem pemilihan gaya infografis terpadu langsung di alur Buat Infografis tanpa menu terpisah.',
      'Menambahkan gaya baru Hand Drawing (font Kalam + Nunito) dengan estetika sketsa organik seperti catatan gambar manual.',
      'Menambahkan sistem Style Profile terpusat yang mencakup profil warna, tipografi, layout, elemen visual, ilustrasi, ornamen, dan tekstur background.',
      'Menambahkan sistem tipografi otomatis: font judul dan font isi langsung menyesuaikan karakter gaya yang dipilih secara presisi.',
      'Menampilkan kartu informasi singkat gaya yang komunikatif (karakteristik, kesesuaian materi, dan pasangan font).',
      'Menambahkan opsi penyesuaian font (Mode Otomatis sebagai default dan Mode Kustom untuk mengganti font judul dan font isi).'
    ],
    improvements: [
      'Memperkuat integritas materi kurikulum berkesinambungan agar setiap pertemuan dalam satu tema pembelajaran memiliki fokus yang unik dan progresif.',
      'Penyelarasan Prompt Studio dan Kerangka Berpikir STIVIA dengan aturan batas pertemuan dan cakupan materi.',
      'Meningkatkan kontras dan perbedaan visual antar gaya sehingga setiap desain memiliki identitas estetika yang unik.',
      'Memperkuat hubungan harmonis antara gaya visual dan tipografi kurasi tinggi (Google Fonts web-ready).',
      'Mengembangkan struktur tata letak infografis adaptif (Hero Visual, Modular Grid, Central Concept, Timeline, Process Flow, Comparison, dan Editorial).',
      'Meningkatkan sinkronisasi antara gaya visual terpilih dengan generator prompt infografis.'
    ],
    bugFixes: [
      'Memperkuat sistem pergantian gaya visual secara instan dan reaktif.',
      'Mencegah konfigurasi gaya sebelumnya terbawa ketika pengguna memilih gaya baru melalui deep-cloning terisolasi.',
      'Memperbarui state dan konfigurasi visual secara konsisten pada tahap rancangan, pratinjau kanvas, dan ekspor grafis.'
    ]
  },
  {
    version: '2.2c',
    updateName: 'OPTIMASI SISTEM INFOGRAFIS & EKSPOR HIGH-DPI',
    status: 'Versi Sebelumnya',
    tagline: 'Belajar Lebih Visual, Mengajar Lebih Mudah',
    releaseDate: 'Agustus 2026',
    description: 'Penyempurnaan mesin rendering kanvas infografis, ekspor resolusi tinggi (PNG & JPG High-DPI), perbaikan fungsi cetak, dan peningkatan stabilitas sistem.',
    newFeatures: [
      'Mesin ekspor grafis High-DPI untuk format PNG jernih dan JPG tajam beresolusi tinggi.',
      'Dukungan unduh langsung (PNG, JPG, Word DOCX, PDF) dari modal Tampilan Penuh (Fullscreen).',
      'Sistem tipografi 3-Tier terintegrasi (Heading, Subheading, dan Body) pada seluruh gaya visual.'
    ],
    improvements: [
      'Peningkatan stabilitas rendering kanvas infografis dan perbaikan proses cetak dokumen.',
      'Penyelarasan arketipe layout dinamis saat gaya visual diganti pada kanvas aktif.',
      'Penyegaran dialog pengaturan pendidik dan preferensi materi.'
    ],
    bugFixes: [
      'Mengatasi masalah inkonsistensi token warna saat penggantian gaya cepat.',
      'Perbaikan margin halaman pada mode cetak PDF agar sesuai standar rasio A4.',
      'Pencegahan re-render berulang pada komponen kanvas infografis.'
    ]
  },
  {
    version: '2.2b',
    updateName: 'PENINGKATAN CANONICAL DRAFT & CONTENT VALIDATION',
    status: 'Versi Sebelumnya',
    releaseDate: 'Juli 2026',
    description: 'Integrasi modul Content Engine pipeline dan Single Source of Truth snapshot untuk menjamin akurasi materi ajar.',
    newFeatures: [
      'Pemeriksaan cakupan materi wajib (100% Coverage Check) berbasis kurikulum.',
      'Deteksi anomali materi dan isolasi istilah lintas mata pelajaran.',
      'Sistem penomoran hierarki blok A, B, C dan ringkasan kunci terstruktur.'
    ],
    improvements: [
      'Peningkatan kecepatan analisis materi Kurikulum Merdeka.',
      'Optimalisasi penyimpanan draft lokal di browser.'
    ],
    bugFixes: [
      'Perbaikan sinkronisasi data materi pada saat penyuntingan langsung di lembar kerja.'
    ]
  },
  {
    version: '2.2a',
    updateName: 'FONDASI MULTI-GAYA VISUAL STIVIA',
    status: 'Versi Sebelumnya',
    releaseDate: 'Juni 2026',
    description: 'Peluncuran awal sistem multi-gaya visual dengan dukungan berbagai format orientasi kanvas (Portrait, Square, Landscape).',
    newFeatures: [
      'Peluncuran 20 gaya visual pendidikan pertama.',
      'Format kanvas Portrait A4, Square 1:1, dan Landscape 16:9.',
      'Tingkat kepadatan visual (Sederhana, Seimbang, Visual Dominan).'
    ],
    improvements: [
      'Desain antarmuka modern dengan Tailwind CSS responsif.',
      'Kompatibilitas tampilan untuk desktop dan perangkat tablet.'
    ],
    bugFixes: [
      'Inisialisasi sistem font Google Fonts pada browser pengguna.'
    ]
  }
];
