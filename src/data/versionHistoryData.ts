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

export const APP_CURRENT_VERSION = '3.0';
export const APP_VERSION_LABEL = `v${APP_CURRENT_VERSION}`;
export const APP_FULL_VERSION_LABEL = `STIVIA Versi ${APP_CURRENT_VERSION}`;
export const APP_UPDATE_NAME = 'SISTEM AKUN SUPABASE & ARSITEKTUR VERSI TERPUSAT';
export const APP_TAGLINE = 'Belajar Lebih Visual, Mengajar Lebih Mudah';

export const STIVIA_VERSION_HISTORY: VersionItem[] = [
  {
    version: '3.0',
    updateName: 'SISTEM AKUN SUPABASE & ARSITEKTUR VERSI TERPUSAT',
    status: 'Rilis Terbaru',
    tagline: 'Belajar Lebih Visual, Mengajar Lebih Mudah',
    releaseDate: 'September 2026',
    description: 'Pembaruan akbar STIVIA 3.0 menghadirkan integrasi sistem autentikasi pendidik berbasis Supabase Auth (Login, Register, Session Management, Logout, Lupa Password), proteksi aplikasi terpusat, serta arsitektur Single Source of Truth untuk konsistensi nomor versi di seluruh aplikasi.',
    newFeatures: [
      'Sistem Login terintegrasi menggunakan email dan kata sandi dengan Supabase Auth.',
      'Sistem Daftar Akun Pendidik (Nama Lengkap, Email, Kata Sandi, dan Konfirmasi Kata Sandi) dengan penyimpanan metadata profil full_name otomatis ke database.',
      'Sistem pemulihan kata sandi (Lupa Password) via email resmi dengan validasi lengkap.',
      'Session Management terproteksi (Protected Application): akses aplikasi terkunci untuk pengguna belum login dan auto-resume saat refresh halaman.',
      'Sistem Keluar (Logout) aman via supabase.auth.signOut() pada navigasi Sidebar dan Pengaturan.',
      'Sistem Versi Terpusat (Single Source of Truth): nomor versi aktif dikonsolidasikan dari satu konstanta terpusat untuk Sidebar, Pengaturan, Prompt Studio, Kerangka Berpikir, dan seluruh antarmuka aplikasi.',
      'Integrasi identitas nama pendidik aktif secara real-time pada navigasi Sidebar dan Pengaturan Profil.'
    ],
    improvements: [
      'Peningkatan keamanan aplikasi dan isolasi data akun pendidik.',
      'Penyelarasan otomatis seluruh label versi aktif tanpa celah ketidaksinkronan antarhalaman.',
      'Pelestarian 100% fitur pembuatan infografis edukatif, 20 gaya visual, 5 kategori, dan arketipe tata letak.'
    ],
    bugFixes: [
      'Pencegahan ketidaksinkronan versi lama di halaman Pengaturan melalui Single Source of Truth.',
      'Penanganan kondisi error autentikasi dan koneksi jaringan dengan pesan berbahasa Indonesia yang jelas.'
    ]
  },
  {
    version: '2.2e',
    updateName: 'SISTEM AUTENTIKASI SUPABASE & AKUN PENDIDIK',
    status: 'Versi Sebelumnya',
    tagline: 'Belajar Lebih Visual, Mengajar Lebih Mudah',
    releaseDate: 'September 2026',
    description: 'Pembaruan keamanan dan integrasi akun pendidik STIVIA dengan penambahan sistem Login, Register, Lupa Password, Session Management terproteksi berbasis Supabase Auth, serta integrasi profil pendidik terpusat.',
    newFeatures: [
      'Menambahkan sistem Login terintegrasi menggunakan email dan kata sandi dengan Supabase Auth.',
      'Menambahkan halaman Daftar Akun Pendidik (Nama Lengkap, Email, Kata Sandi, dan Konfirmasi Kata Sandi) dengan validasi lengkap.',
      'Integrasi otomatis metadata profil nama pendidik ke relasi tabel public.profiles melalui trigger handle_new_user().',
      'Menambahkan fitur pemulihan kata sandi (Lupa Password) dengan pengiriman tautan reset ke email terdaftar.',
      'Sistem proteksi sesi aplikasi (Protected Application): akses langsung bagi user dengan sesi aktif dan pengalihan ke autentikasi bagi user baru.',
      'Penambahan fungsi Keluar (Logout) aman menggunakan supabase.auth.signOut() dengan pembersihan sesi seketika.',
      'Penerjemahan pesan error autentikasi lengkap ke Bahasa Indonesia yang ramah bagi guru.'
    ],
    improvements: [
      'Sinkronisasi profil pengguna aktif pada navigasi sidebar dan pengaturan akun.',
      'Manajemen persistensi sesi otomatis (persistSession dan autoRefreshToken) sehingga sesi tetap terjaga saat halaman disegarkan.',
      'Peningkatan proteksi data dan pemisahan akses tanpa mengubah alur pembuatan infografis yang sudah berjalan.'
    ],
    bugFixes: [
      'Penanganan kondisi error autentikasi dan konektivitas secara responsif.',
      'Pencegahan inkonsistensi sesi pengguna melalui listener supabase.auth.onAuthStateChange().'
    ]
  },
  {
    version: '2.2d',
    updateName: 'PENGEMBANGAN SISTEM DESAIN INFOGRAFIS',
    status: 'Versi Sebelumnya',
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
