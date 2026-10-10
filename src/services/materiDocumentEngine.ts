// ============================================================================
// STIVIA MATERI DOCUMENT ENGINE
// Modul Penyusun Dokumen Materi Ajar A4 Siap Cetak & Siap Digunakan
// Prinsip: Guru menentukan isi, STIVIA menyusun, merapikan, & memformat A4
// Tipografi Standar: Calibri Light, Body 10pt, Justify, A4 Portrait
// ============================================================================

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  convertInchesToTwip,
  Header,
  Footer,
  PageNumber
} from 'docx';
import { EducationLevel } from '../types';

export interface MateriSection {
  id: string;
  title: string;
  content: string;
  type?: string;
  isTable?: boolean;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface SupportingItem {
  id: string;
  type: 'contoh' | 'glosarium' | 'kutipan' | 'info_tambahan' | 'tabel';
  title: string;
  content: string;
}

export interface ReadingModelText {
  title: string;
  category: string;
  content: string;
  analysisNotes?: string;
  sourceOrContext?: string;
}

export interface ConceptMisconception {
  misconception: string;
  clarification: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface MateriDocument {
  id: string;
  subject: string;
  educationLevel: EducationLevel;
  grade: string;
  bab: string;
  pertemuan: string;
  title: string;
  apersepsi?: string;
  includeApersepsi?: boolean;
  teacherNotes?: string;
  includeTeacherNotesInDoc?: boolean;
  learningObjectives: string[];
  sections: MateriSection[];
  supportingReadingText?: ReadingModelText;
  includeSupportingReadingText?: boolean;
  misconceptions?: ConceptMisconception[];
  includeMisconceptions?: boolean;
  glosarium?: GlossaryEntry[];
  includeGlosarium?: boolean;
  supportingItems?: SupportingItem[];
  summary?: string;
  includeSummary?: boolean;
  understandingCheck?: string[];
  includeUnderstandingCheck?: boolean;
  includeStudentNotesSheet?: boolean;
  references?: string[];
  includeReferences?: boolean;
  institutionName?: string;
  teacherName?: string;
  sourceMeetingId?: string;
  sourceMasterVersion?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeepMaterialGenerationInput {
  subject: string;
  topic: string;
  educationLevel: EducationLevel;
  grade: string;
  bab?: string;
  pertemuan?: string;
  cakupanMateri?: string;
  learningObjectives?: string[];
  userNotes?: string;
  schoolName?: string;
  teacherName?: string;
  sourceMeetingId?: string;
  sourceMasterVersion?: number;
}

/**
 * Pilihan cepat judul bagian materi yang umum digunakan guru
 */
export const SUGGESTED_SECTION_PRESETS: { title: string; category: string }[] = [
  { title: 'Pengertian & Konsep Dasar', category: 'Fondasi' },
  { title: 'Tujuan Pembelajaran Khusus', category: 'Fondasi' },
  { title: 'Ciri-Ciri & Karakteristik', category: 'Karakteristik' },
  { title: 'Unsur-Unsur & Komponen', category: 'Struktur' },
  { title: 'Fungsi & Manfaat', category: 'Struktur' },
  { title: 'Jenis-Jenis & Klasifikasi', category: 'Variasi' },
  { title: 'Kaidah Kebahasaan / Aturan Ilmiah', category: 'Kaidah' },
  { title: 'Langkah-Langkah & Prosedur', category: 'Mekanisme' },
  { title: 'Contoh Konkret & Ilustrasi', category: 'Aplikasi' },
  { title: 'Non-Contoh & Kesalahan Umum', category: 'Aplikasi' },
  { title: 'Tabel Perbandingan', category: 'Analisis' },
  { title: 'Studi Kasus Kontekstual', category: 'Aplikasi' },
  { title: 'Penerapan dalam Kehidupan Nyata', category: 'Aplikasi' },
  { title: 'Latihan Mandiri & Tantangan', category: 'Evaluasi' }
];

/**
 * Contoh Draf Materi Lengkap & Mendalam (Bahasa Indonesia - Konsep Dasar Teks Iklan)
 */
export const DEFAULT_SAMPLE_MATERI: MateriDocument = {
  id: 'materi-sample-iklan',
  subject: 'Bahasa Indonesia',
  educationLevel: 'SMP',
  grade: 'Kelas VIII',
  bab: 'Bab 2: Menemukan Pola Pesan dalam Iklan',
  pertemuan: 'Pertemuan 1',
  title: 'Konsep Dasar, Ciri, Unsur-Unsur, dan Kaidah Kebahasaan Teks Iklan',
  apersepsi: 'Bayangkan ketika Anda melintas di jalan raya atau membuka media sosial: ratusan pesan berlomba menarik perhatian Anda dalam hitungan detik. Mengapa ada pesan yang langsung membuat kita ingin membeli produk atau tergerak membuang sampah pada tempatnya, sementara pesan lain terlewat begitu saja? Rahasianya terletak pada kekuatan teks iklan—seni menyusun kata yang padat makna, sugestif, dan berdaya bujuk tinggi.',
  includeApersepsi: true,
  teacherNotes: 'Arahkan peserta didik untuk membandingkan iklan komersial dengan iklan layanan masyarakat di koran lokal atau papan pengumuman sekolah.',
  includeTeacherNotesInDoc: false,
  learningObjectives: [
    'Peserta didik mampu mengidentifikasi hakikat, tujuan, dan fungsi sosial teks iklan dalam kehidupan bermasyarakat secara kritis.',
    'Peserta didik mampu menganalisis 4 struktur pembentuk teks iklan yang lengkap (judul, nama produk, penjelasan, dan ajakan bertindak).',
    'Peserta didik mampu membedakan karakteristik kaidah kebahasaan persuasif dan imperatif pada contoh teks iklan otentik.',
    'Peserta didik mampu mengevaluasi efektivitas pesan dan etika penyampaian informasi pada iklan komersial maupun sosial.'
  ],
  sections: [
    {
      id: 'sec-1',
      title: 'A. Pengertian dan Hakikat Teks Iklan',
      content: 'Teks iklan merupakan bentuk komunikasi wacana persuasif yang dirancang secara strategis untuk memperkenalkan, mempromosikan, serta membujuk khalayak umum agar tertarik menggunakan barang, jasa, atau mengadopsi gagasan tertentu. Secara historis dan sosiologis, teks iklan berfungsi sebagai media penghubung antara pihak penyampai pesan (produsen, lembaga masyarakat, atau pemerintah) dengan sasaran publik.\n\nDalam konteks kemahiran berbahasa Indonesia, teks iklan menuntut kecermatan tinggi dalam menyeleksi kosakata. Bahasa iklan bukan sekadar rangkaian kata biasa, melainkan instrumen psikologis yang memadukan daya pikat estetik, kepadatan makna, serta kejelasan informasi agar mampu membangkitkan respon afektif dan konatif pembaca dalam hitungan detik.'
    },
    {
      id: 'sec-2',
      title: 'B. Fungsi dan Peran Iklan dalam Kehidupan Sosial',
      content: 'Iklan memegang peranan multidimensional dalam masyarakat modern. Pertama, fungsi informatif yang memperkenalkan keberadaan barang baru, layanan publik, atau program kerja sosial secara faktual. Kedua, fungsi persuasif yang berfokus membangun keyakinan rasional dan emosional publik untuk mengambil tindakan positif. Ketiga, fungsi pengingat (reminding) yang mempertahankan kesadaran publik terhadap nilai kebaikan bersama maupun produk unggulan di tengah arus deras informasi harian.'
    },
    {
      id: 'sec-3',
      title: 'C. Struktur Anatomi Teks Iklan yang Efektif',
      content: 'Sebuah teks iklan yang utuh dan profesional tersusun atas empat komponen struktural yang terpadu secara hierarkis:\n1. Judul Utama (Headline): Elemen penarik atensi awal yang ditempatkan pada posisi paling mencolok dengan ukuran tipografi dominan untuk merangkum esensi gagasan pemikat.\n2. Nama Produk atau Gagasan Pokok: Identitas transparan mengenai barang, jasa, atau gerakan sosial yang ditawarkan agar khalayak tidak mengalami bias tafsir.\n3. Penjelasan Inti (Body Copy): Uraian ringkas, padat, dan faktual mengenai keunggulan pembeda, spesifikasi mutu, atau alasan mengapa gagasan tersebut patut dipilih.\n4. Ajakan Bertindak (Call to Action / CTA): Pernyataan panduan konkret di bagian penutup yang menuntun pembaca melakukan langkah terarah, seperti tautan narahubung, semboyan mudah ingat, atau ajakan langsung bertindak.'
    },
    {
      id: 'sec-4',
      title: 'D. Karakteristik Kaidah Kebahasaan Teks Iklan',
      content: 'Teks iklan memiliki konvensi kebahasaan khas yang membedakannya secara tegas dari teks ilmiah atau laporan objektif:\n• Bahasa Persuasif: Menggunakan untaian kata sugestif yang membangkitkan rasa butuh dan ketertarikan tanpa nada memaksa.\n• Kalimat Imperatif Santun: Memanfaatkan kata kerja himbauan halus seperti marilah, wujudkan, cintai, rawatlah, atau gunakan secara terukur.\n• Rima dan Keselarasan Bunyi: Permainan bunyi konsonan dan vokal yang berirama indah membuat slogan iklan melekat kuat dalam memori jangka panjang pembaca.\n• Ringkas, Padat, dan Bernas: Kalimat bebas dari pemborosan kata (pleonasme) sehingga pesan pokok dapat diserap seketika oleh pembaca yang bergerak cepat.'
    },
    {
      id: 'sec-5',
      title: 'E. Tabel Komparasi: Iklan Komersial vs Iklan Layanan Masyarakat',
      content: 'Berikut adalah analisis perbedaan orientasi, sasaran, dan nilai etis antara iklan bermotif bisnis dengan iklan yang berorientasi kepentingan publik:',
      isTable: true,
      tableData: {
        headers: ['Aspek Pembeda', 'Iklan Komersial (Bisnis)', 'Iklan Layanan Masyarakat (Sosial)'],
        rows: [
          ['Orientasi Tujuan', 'Meningkatkan penjualan barang/jasa dan profit ekonomi produsen.', 'Membangun kesadaran moral, etika, dan perubahan perilaku positif publik.'],
          ['Pihak Pemrakarsa', 'Pelaku usaha, badan bisnis swasta, atau perorangan.', 'Pemerintah, lembaga nirlaba, ormas, atau institusi pendidikan.'],
          ['Sasaran Audiens', 'Konsumen potensial tersegmentasi (usia, profesi, gaya hidup).', 'Seluruh lapisan masyarakat luas tanpa memandang sekat status sosial.'],
          ['Tolok Ukur Keberhasilan', 'Kenaikan omzet penjualan dan loyalitas pelanggan pada produk.', 'Penurunan angka masalah sosial dan tumbuhnya budaya tertib warga.'],
          ['Contoh Nyata', 'Iklan sepatu olahraga dengan bantalan pegas berteknologi aerodinamis.', 'Iklan ajakan membawa botol minum guna mengurangi sampah plastik sekolah.']
        ]
      }
    },
    {
      id: 'sec-6',
      title: 'F. Prosedur Penyusunan dan Analisis Kritis Teks Iklan',
      content: 'Untuk menghasilkan atau menganalisis teks iklan secara mendalam, tempuh langkah-langkah metodis berikut:\n1. Identifikasi Karakteristik Sasaran: Tentukan usia pembaca, kebutuhan emosional, dan media penyampaian yang paling relevan.\n2. Rumuskan Satu Gagasan Inti: Jangan mencampuradukkan terlalu banyak pesan; pilih satu pesan tunggal yang paling berdampak.\n3. Rancang Headline Berdaya Pikat: Buat judul dengan diksi kontras, metafora santun, atau pertanyaan menggelitik rasa ingin tahu.\n4. Susun Rangkaian Kalimat Penjelas: Sertakan bukti fakta singkat atau keunggulan yang dapat dipertanggungjawabkan.\n5. Tinjau Etika dan Kejujuran Pesan: Pastikan tidak memuat klaim palsu, tidak merendahkan pihak lain, dan mematuhi etika periklanan Indonesia.'
    }
  ],
  supportingReadingText: {
    title: 'Model Teks Wacana: Dua Sisi Pesan Iklan Lingkungan Sekolah',
    category: 'Wacana Otentik Analisis',
    content: '[Teks I: Iklan Komersial Kantin Sehat]\n"Kantin Bahagia: Nikmati Jus Buah Murni Tanpa Pemanis Buatan! Segarkan energimu sehabis olahraga, jaga konsentrasi belajar tetap tajam sepanjang hari. Kunjungi gerai kami di Koridor Barat setiap jam istirahat. Sehat itu nikmat!"\n\n[Teks II: Iklan Layanan Masyarakat Siswa Mandiri]\n"Satu Botol Tumbler Milikmu Menyelamatkan Bumi dari Ratusan Plastik Sekali Pakai. Jadilah pahlawan lingkungan mulai dari mejamu sendiri. Gunakan botol isi ulang, jaga bumi kita tetap tersenyum untuk generasi mendatang!"',
    analysisNotes: 'Catatan Telaah Pendidik: Teks I menunjukkan penggunaan kata sifat emosional (segarkan, nikmat) dengan Call to Action penunjuk lokasi. Teks II menonjolkan kalimat persuasif berbobot moralitas dengan sentuhan metafora (bumi tetap tersenyum). Keduanya memenuhi kaidah hemat kata namun kaya makna.',
    sourceOrContext: 'Disusun Tim Pengembang Literasi STIVIA untuk Pembelajaran Teks Iklan SMP'
  },
  includeSupportingReadingText: true,
  misconceptions: [
    {
      misconception: 'Semua iklan bertujuan menjual barang dagangan demi meraih keuntungan materi uang.',
      clarification: 'Iklan Layanan Masyarakat (ILM) tidak mencari laba komersial sama sekali, melainkan bertujuan mengedukasi warga agar peduli pada isu sosial, kesehatan, dan kelestarian lingkungan.'
    },
    {
      misconception: 'Iklan yang baik adalah iklan yang menggunakan kata-kata bombastis setinggi langit.',
      clarification: 'Bahasa iklan terbaik adalah yang jujur, ringkas, santun, dan relevan dengan kenyataan produk. Klaim berlebihan justru melanggar etika periklanan dan merusak kepercayaan audiens.'
    },
    {
      misconception: 'Iklan hanya mengandalkan gambar visual, sedangkan unsur tulisan tidak terlalu penting.',
      clarification: 'Visual memikat pandangan dalam detik pertama, namun kata-kata (copywriting) yang menanamkan pemahaman, memupuk keyakinan, dan mendorong audiens mengambil keputusan nyata.'
    }
  ],
  includeMisconceptions: true,
  glosarium: [
    { term: 'Komunikasi Persuasif', definition: 'Pola interaksi bahasa yang diniatkan untuk mengubah sikap, keyakinan, atau tindakan seseorang tanpa paksaan.' },
    { term: 'Call to Action (CTA)', definition: 'Instruksi atau frasa penuntun yang secara tegas mengarahkan pembaca melakukan tindakan nyata tertentu.' },
    { term: 'Headline', definition: 'Kalimat judul utama yang dirancang menonjol secara tipografis untuk memikat pandangan pertama pembaca.' },
    { term: 'Body Copy', definition: 'Paragraf isi penjelas yang menguraikan fitur, manfaat, atau rincian gagasan yang dipromosikan.' },
    { term: 'Kalimat Imperatif Santun', definition: 'Bentuk kalimat perintah atau ajakan yang dikemas secara halus menggunakan partikel penghalus dan diksi bersahabat.' }
  ],
  includeGlosarium: true,
  summary: 'Teks iklan adalah wacana persuasif fungsional yang memadukan judul pemikat (headline), identitas produk/gagasan, uraian manfaat (body copy), dan panduan ajakan bertindak (call to action). Iklan terbagi menjadi iklan komersial yang berorientasi ekonomi dan iklan layanan masyarakat yang berorientasi moral publik. Keberhasilan iklan ditentukan oleh ketepatan kaidah kebahasaan yang padat, berima serasi, persuasif, serta komitmen etis menjunjung kejujuran informasi.',
  includeSummary: true,
  understandingCheck: [
    'Jelaskan mengapa pemilihan diksi dalam judul iklan (headline) memegang peranan krusial terhadap keberhasilan penyampaian pesan!',
    'Analisislah perbedaan mendasar antara orientasi iklan komersial dengan iklan layanan masyarakat menggunakan contoh konkret di lingkungan sekolahmu!',
    'Temukan dua kalimat imperatif santun pada teks model wacana iklan di atas, lalu jelaskan alasan penggunaan kata kerja tersebut!',
    'Jika kantin sekolahmu ingin mengajak siswa mengurangi makanan cepat saji, susunlah satu slogan iklan yang ringkas, berima, dan memikat!'
  ],
  includeUnderstandingCheck: true,
  references: [
    'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2021). Buku Panduan Guru Bahasa Indonesia: Wahana Literasi SMP Kelas VIII. Jakarta: Pusat Perbukuan BSKAP Kemendikbudristek.',
    'Badan Pengembangan dan Pembinaan Bahasa. (2023). Kamus Besar Bahasa Indonesia (KBBI) Daring Edisi V. Jakarta: Kemendikbudristek.',
    'Dewan Periklanan Indonesia. (2020). Etika Pariwara Indonesia (EPI): Tata Krama dan Tata Cara Periklanan Indonesia. Jakarta: DPI.'
  ],
  includeReferences: true,
  includeStudentNotesSheet: false,
  institutionName: 'SMP NEGERI 2 JETIS KABUPATEN MOJOKERTO',
  teacherName: 'Amin Wahyudi, S.Pd.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Contoh Draf Materi Lengkap & Mendalam untuk Informatika SMA (Struktur Data Graph)
 */
export const DEFAULT_SAMPLE_INFORMATIKA: MateriDocument = {
  id: 'materi-sample-graph',
  subject: 'Informatika',
  educationLevel: 'SMA',
  grade: 'Kelas X',
  bab: 'Bab 2: Berpikir Komputasional & Struktur Data',
  pertemuan: 'Pertemuan 1',
  title: 'Pemodelan Relasi Informasi Kompleks Menggunakan Struktur Data Graph',
  apersepsi: 'Pernahkah Anda memikirkan bagaimana aplikasi peta digital seperti Google Maps dapat menemukan rute tercepat di tengah kemacetan ribuan persimpangan jalan dalam sekejap? Atau bagaimana platform media sosial dapat merekomendasikan "orang yang mungkin Anda kenal"? Jawabannya berakar pada struktur data non-linear paling fleksibel dalam ilmu komputer: Graph.',
  includeApersepsi: true,
  teacherNotes: 'Gunakan analogi persimpangan jalan sebagai simpul (vertex) dan jalan raya sebagai sisi (edge). Tunjukkan visual graf berarah untuk jalan satu arah.',
  includeTeacherNotesInDoc: false,
  learningObjectives: [
    'Peserta didik mampu memahami hakikat, definisi formal, dan komponen utama struktur data graf (vertices dan edges) secara konseptual.',
    'Peserta didik mampu menganalisis perbedaan graf berarah (directed) dan graf tak berarah (undirected) serta graf berbobot (weighted).',
    'Peserta didik mampu membandingkan efisiensi representasi graf matriks ketetanggaan (adjacency matrix) dan daftar ketetanggaan (adjacency list).',
    'Peserta didik mampu memodelkan persoalan jaringan dunia nyata menggunakan notasi graf formal secara runtut.'
  ],
  sections: [
    {
      id: 'inf-sec-1',
      title: 'A. Hakikat dan Landasan Konsep Struktur Data Graph',
      content: 'Graph adalah struktur data non-linear yang didefinisikan sebagai pasangan himpunan G = (V, E), di mana V merepresentasikan himpunan terhingga simpul (vertices atau nodes) dan E merepresentasikan himpunan sisi (edges atau arcs) yang menghubungkan pasangan simpul tersebut.\n\nBerbeda dengan array atau linked list yang bersifat linear berurutan, serta pohon (tree) yang berhierarki ketat dari simpul akar tunggal, graf memberikan kebebasan topologis penuh. Setiap simpul dapat terhubung ke sejumlah simpul lain tanpa batasan hierarki, bahkan dapat membentuk siklus (closed loop). Sifat ini menjadikan graf sebagai instrumen komputasional paling tangguh untuk memodelkan sistem jaringan rumit.'
    },
    {
      id: 'inf-sec-2',
      title: 'B. Anatomi dan Komponen Utama Pembentuk Graf',
      content: 'Dalam membedah arsitektur graf, terdapat empat komponen fundamental:\n1. Vertex / Node (V): Entitas diskret yang memuat data nilai, misalnya nama kota, stasiun server, atau akun pengguna.\n2. Edge / Sisi (E): Garis penghubung yang menetapkan adanya hubungan relasi langsung antara dua vertex.\n3. Derajat Simpul (Degree): Jumlah edge yang berinsidensi pada suatu simpul. Pada graf berarah, derajat dipisahkan menjadi in-degree (sisi masuk) dan out-degree (sisi keluar).\n4. Bobot Sisi (Weight): Nilai numerik yang diasosiasikan pada edge guna merepresentasikan jarak fisik, latensi transmisi jaringan, atau biaya operasional rute.'
    },
    {
      id: 'inf-sec-3',
      title: 'C. Klasifikasi Varian Graf dalam Ilmu Komputer',
      content: 'Berdasarkan orientasi dan karakteristik sisinya, graf diklasifikasikan ke dalam:\n• Graf Tak Berarah (Undirected Graph): Hubungan antarsimpul bersifat simetris dua arah bolak-balik tanpa orientasi tanda panah.\n• Graf Berarah (Directed Graph / Digraph): Hubungan memiliki orientasi arah spesifik dari simpul asal ke simpul tujuan.\n• Graf Berbobot (Weighted Graph): Setiap edge memuat label nilai bobot kuantitatif, sangat esensial untuk algoritma pencarian rute terpendek seperti Dijkstra.\n• Graf Bersiklus vs Asiklis: Graf yang memuat jalur kembali ke titik semula disebut siklis; jika tanpa siklus dinamakan graf asiklis (Acyclic Graph / DAG).'
    },
    {
      id: 'inf-sec-4',
      title: 'D. Tabel Analisis Komparasi: Representasi Matriks vs Adjacency List',
      content: 'Tabel komparasi teknis dua metode utama dalam menyimpan struktur graf ke dalam memori komputer:',
      isTable: true,
      tableData: {
        headers: ['Parameter Analisis', 'Adjacency Matrix (Matriks Ketetanggaan)', 'Adjacency List (Daftar Ketetanggaan)'],
        rows: [
          ['Struktur Memori', 'Matriks 2 dimensi berukuran V x V.', 'Kumpulan linked list atau array dinamis per simpul.'],
          ['Kompleksitas Ruang', 'O(V^2), boros memori pada graf renggang (sparse).', 'O(V + E), sangat hemat memori untuk graf realistis.'],
          ['Pemeriksaan Sisi (u, v)', 'Sangat cepat O(1) seketika.', 'Memerlukan iterasi sebesar derajat simpul O(deg(u)).'],
          ['Menemukan Seluruh Tetangga', 'Lambat O(V) karena harus memindai satu baris penuh.', 'Sangat cepat O(deg(u)) langsung membaca daftar.'],
          ['Kecocokan Penggunaan', 'Graf padat (dense graph) di mana sebagian besar simpul saling terhubung.', 'Jejaring sosial dan jaringan jalan raya nyata yang memiliki sedikit koneksi per simpul.']
        ]
      }
    },
    {
      id: 'inf-sec-5',
      title: 'E. Pemodelan Kasus Dunia Nyata dan Penerapan Algoritmik',
      content: 'Penerapan struktur data graf meresap dalam arsitektur teknologi modern:\n1. Sistem Transportasi & Navigasi: Persimpangan jalan direpresentasikan sebagai simpul, ruas jalan sebagai sisi dengan bobot jarak waktu. Algoritma A* atau Dijkstra menghitung rute tercepat.\n2. Arsitektur Jejaring Sosial: Pengguna menjadi simpul, pertemanan timbal balik membentuk graf tak berarah, sedangkan sistem mengikuti (follow) membentuk graf berarah.\n3. Perutean Jaringan Komputer (Routing): Router di internet saling bertukar paket data melintasi topologi jaringan berbasis protokol OSPF yang mengaplikasikan pemodelan graf terpendek.'
    }
  ],
  supportingReadingText: {
    title: 'Studi Kasus: Optimalisasi Pengiriman Paket Logistik Antarkota',
    category: 'Studi Kasus Komputasional',
    content: 'Sebuah perusahaan logistik di Jawa Timur melayani pengiriman antar 5 kota: Surabaya (S), Mojokerto (M), Jombang (J), Kediri (K), dan Malang (L). Jarak tempuh (bobot dalam km) adalah sebagai berikut:\n• S - M: 45 km | S - L: 90 km\n• M - J: 30 km | M - L: 85 km\n• J - K: 40 km | K - L: 75 km\nJika kurir berangkat dari Surabaya hendak mengantar dokumen penting ke Kediri, kurir dapat memilih rute S -> M -> J -> K (45 + 30 + 40 = 115 km) atau rute lain. Melalui representasi graf berbobot, algoritma Dijkstra dapat menentukan jalur minimum 115 km dalam waktu sub-milidetik dibanding pencarian coba-coba manusia.',
    analysisNotes: 'Catatan Guru: Model di atas menunjukkan keunggulan abstraksi komputasional. Siswa diajak menyadari bahwa dunia fisik dapat diringkas menjadi pasangan vertex dan edge tanpa kehilangan akurasi perhitungan rute.',
    sourceOrContext: 'Bahan Ajar Berpikir Komputasional Informatika SMA Kelas X'
  },
  includeSupportingReadingText: true,
  misconceptions: [
    {
      misconception: 'Struktur graf sama saja dengan struktur pohon (tree), hanya beda nama.',
      clarification: 'Pohon adalah bentuk khusus dari graf yang wajib asiklis dan memiliki hierarki simpul akar (root). Graf umum dapat memiliki banyak siklus dan tidak mengenal hierarki simpul anak-induk tunggal.'
    },
    {
      misconception: 'Matriks ketetanggaan selalu lebih unggul karena waktu pengecekan sisinya instan O(1).',
      clarification: 'Pada kasus nyata seperti peta jalan dengan jutaan persimpangan, matriks V x V membutuhkan terabyte memori yang tidak realistis. Adjacency list jauh lebih efisien untuk graf berukuran masif.'
    }
  ],
  glosarium: [
    { term: 'Vertex (Simpul)', definition: 'Objek satuan diskret yang menyimpan nilai data dalam graf.' },
    { term: 'Edge (Sisi)', definition: 'Garis hubungan penghubung antara dua vertex.' },
    { term: 'Directed Graph (Digraph)', definition: 'Graf dengan sisi yang memiliki orientasi arah satu jurusan.' },
    { term: 'Weighted Graph', definition: 'Graf yang sisinya memiliki nilai bobot numerik representasi jarak/biaya.' },
    { term: 'Adjacency List', definition: 'Struktur data penyimpan graf berbasis daftar simpul tetangga untuk setiap simpul.' }
  ],
  includeGlosarium: true,
  summary: 'Graf adalah struktur data non-linear berdaya jangkau luas yang terdiri dari simpul (vertices) dan sisi penghubung (edges). Melalui ragam graf berarah, tak berarah, dan berbobot, graf memfasilitasi pemodelan matematis masalah interkoneksi dunia nyata secara presisi. Pemilihan representasi memori antara matriks dan list ketetanggaan bergantung pada rasio kepadatan koneksi jaringan yang dimodelkan.',
  includeSummary: true,
  understandingCheck: [
    'Jelaskan perbedaan struktural mendasar antara graf dan pohon menggunakan analogi silsilah keluarga dan jejaring pertemanan!',
    'Jika sebuah graf memiliki 6 simpul dan setiap simpul terhubung ke simpul lainnya tanpa arah, berapa total edge yang terbentuk?',
    'Analisis mengapa aplikasi Google Maps lebih tepat menggunakan Adjacency List daripada Adjacency Matrix dalam menyimpan peta benua Asia!',
    'Gambarkan skema graf berarah yang memodelkan alur proses transaksi jual-beli online dari pemesanan hingga barang diterima!'
  ],
  includeUnderstandingCheck: true,
  references: [
    'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2021). Buku Siswa Informatika untuk SMA Kelas X. Jakarta: Pusat Kurikulum dan Perbukuan Kemendikbudristek.',
    'Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). Introduction to Algorithms (4th ed.). Cambridge: MIT Press.',
    'BSKAP Kemendikbudristek. (2024). Capaian Pembelajaran Mata Pelajaran Informatika Fase E. Jakarta: Kemendikbudristek.'
  ],
  includeReferences: true,
  includeStudentNotesSheet: false,
  institutionName: 'SMA NEGERI 1 PURWOSARI',
  teacherName: 'Budi Santoso, S.Kom., M.T.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Membersihkan string dari format markdown agar output dokumen bersih murni teks akademik
 */
export function cleanAcademicText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // hapus bold markdown
    .replace(/\*(.*?)\*/g, '$1')     // hapus italic markdown
    .replace(/^#+\s+/gm, '')         // hapus heading markdown
    .replace(/`([^`]+)`/g, '$1')     // hapus code markdown
    .trim();
}

/**
 * Sintesis Rangkuman Otomatis Berdasarkan Teks Materi Pengguna (Strict Source of Truth)
 * Menyaring poin-poin paling esensial dari setiap section materi pengguna tanpa menambah fakta baru.
 */
export function synthesizeSummaryFromSections(sections: MateriSection[], title: string): string {
  if (!sections || sections.length === 0) {
    return `Materi ajar mengenai ${cleanAcademicText(title)} telah disusun secara sistematis untuk dipelajari dan dipahami secara mendalam.`;
  }

  const keySentences: string[] = [];

  for (const sec of sections) {
    if (!sec.content || sec.content.trim().length === 0) continue;
    // Bersihkan konten dari bullet points dan karakter khusus
    const cleanContent = cleanAcademicText(sec.content).replace(/^[-*•\d\.\)]+\s*/gm, '').trim();
    // Ambil kalimat pertama yang bermakna dari setiap bagian
    const sentences = cleanContent.split(/(?<=[.?!])\s+/);
    const validSentence = sentences.find(s => s.length > 30 && !s.toLowerCase().startsWith('tabel'));
    if (validSentence) {
      keySentences.push(validSentence.trim());
    }
  }

  if (keySentences.length > 0) {
    return `Intisari Pembelajaran: ${keySentences.slice(0, 4).join(' ')}`;
  }

  return `Pembelajaran materi ${cleanAcademicText(title)} menekankan penguasaan konsep, struktur, dan penerapannya secara kontekstual melalui telaah terstruktur pada setiap bagian materi ajar.`;
}

/**
 * Membuat Pertanyaan Cek Pemahaman Konseptual Berbasis Materi Pengguna
 */
export function generateUnderstandingQuestionsFromSections(sections: MateriSection[], title: string): string[] {
  const safeTitle = cleanAcademicText(title);
  if (!sections || sections.length === 0) {
    return [
      `Jelaskan kembali konsep utama dari materi ${safeTitle} dengan menggunakan bahasamu sendiri!`,
      `Mengapa materi ${safeTitle} penting dipelajari dan bagaimana penerapannya dalam kehidupan sehari-hari?`
    ];
  }

  const questions: string[] = [];

  sections.forEach((sec, idx) => {
    const cleanTitle = cleanAcademicText(sec.title).replace(/^[A-Z0-9\.\-\s]+/, '').trim();
    if (cleanTitle.length > 3 && idx < 4) {
      const lower = cleanTitle.toLowerCase();
      if (lower.includes('pengertian') || lower.includes('definisi') || lower.includes('konsep') || lower.includes('hakikat')) {
        questions.push(`Berdasarkan uraian di atas, simpulkan pengertian pokok dari "${cleanTitle}" dan jelaskan mengapa konsep tersebut menjadi fondasi utama!`);
      } else if (lower.includes('ciri') || lower.includes('karakteristik') || lower.includes('unsur') || lower.includes('komponen') || lower.includes('struktur')) {
        questions.push(`Sebutkan dan uraikan karakteristik serta unsur-unsur pembentuk "${cleanTitle}" yang telah kamu pelajari secara runtut!`);
      } else if (lower.includes('perbandingan') || lower.includes('jenis') || lower.includes('klasifikasi') || lower.includes('tabel')) {
        questions.push(`Analisislah perbedaan atau klasifikasi utama yang disajikan dalam bagian "${cleanTitle}", dan berikan contoh konkret pembedanya!`);
      } else if (lower.includes('kaidah') || lower.includes('aturan') || lower.includes('bahasa')) {
        questions.push(`Jelaskan bagaimana kaidah kebahasaan atau aturan ilmiah pada bagian "${cleanTitle}" diterapkan dalam konteks nyata!`);
      } else {
        questions.push(`Bagaimana penjelasan mengenai "${cleanTitle}" dapat membantu kamu memahami dan menerapkan keseluruhan materi ${safeTitle}?`);
      }
    }
  });

  if (questions.length === 0) {
    questions.push(`Jelaskan intisari konsep ${safeTitle} yang paling berkesan bagi pemahamanmu hari ini!`);
  }

  // Tambahkan satu pertanyaan refleksi kontekstual
  questions.push(`Tuliskan satu contoh nyata atau situasi sehari-hari yang berkaitan erat dengan penerapan materi ${safeTitle}!`);

  return questions.slice(0, 5);
}

/**
 * GENERATOR MATERI AJAR AKADEMIK MENDALAM (DEEP LEARNING MATERIAL ENGINE)
 * Menghasilkan materi komprehensif, runtut, memiliki wacana otentik, miskonsepsi, glosarium, dan rujukan resmi.
 */
export function generateDeepAcademicMaterial(input: DeepMaterialGenerationInput): MateriDocument {
  const normSubj = (input.subject || '').toLowerCase();
  const normTopic = (input.topic || '').toLowerCase();
  const level = input.educationLevel || 'SMP';
  const grade = input.grade || 'Kelas VIII';
  const bab = input.bab || 'Bab 1: Konsep Dasar';
  const pertemuan = input.pertemuan || 'Pertemuan 1';
  const topic = input.topic || 'Materi Pembelajaran';

  // 1. Ekstraksi butir-butir cakupan materi jika ada
  const scopeItems: string[] = [];
  if (input.cakupanMateri && input.cakupanMateri.trim().length > 0) {
    input.cakupanMateri.split('\n').forEach(line => {
      const clean = line.replace(/^[-*•\d\.\)]+\s*/, '').trim();
      if (clean.length > 2) scopeItems.push(clean);
    });
  }

  // 2. Tentukan domain pengetahuan spesifik
  const isBahasa = normSubj.includes('bahasa indonesia') || normTopic.includes('iklan') || normTopic.includes('teks') || normTopic.includes('puisi') || normTopic.includes('lho');
  const isInformatika = normSubj.includes('informatika') || normSubj.includes('komputer') || normTopic.includes('graf') || normTopic.includes('algoritma') || normTopic.includes('jaringan') || normTopic.includes('data');
  const isMatematika = normSubj.includes('matematika') || normTopic.includes('aljabar') || normTopic.includes('pythagoras') || normTopic.includes('perbandingan') || normTopic.includes('persamaan');
  const isIPA = normSubj.includes('ipa') || normSubj.includes('biologi') || normSubj.includes('fisika') || normSubj.includes('kimia') || normTopic.includes('fotosintesis') || normTopic.includes('peredaran') || normTopic.includes('sel');
  const isIPS = normSubj.includes('ips') || normSubj.includes('sejarah') || normSubj.includes('geografi') || normSubj.includes('ekonomi') || normTopic.includes('interaksi') || normTopic.includes('sosial');
  const isPPKn = normSubj.includes('pancasila') || normSubj.includes('ppkn') || normTopic.includes('norma') || normTopic.includes('keadilan') || normTopic.includes('konstitusi');
  const isEnglish = normSubj.includes('inggris') || normSubj.includes('english') || normTopic.includes('descriptive') || normTopic.includes('recount');

  // Apersepsi Kontekstual
  let apersepsi = `Pernahkah Anda mengamati bagaimana konsep ${topic} bekerja di lingkungan sekitar kita? Sering kali hal-hal yang tampak biasa menyimpan prinsip-prinsip fundamental yang sangat teratur. Melalui materi ini, kita akan mengungkap bagaimana konsep ${topic} dipelajari, dipahami strukturnya, dan diterapkan secara nyata untuk memecahkan persoalan hidup sehari-hari.`;
  if (isBahasa) {
    apersepsi = `Dalam kehidupan sehari-hari, bahasa adalah cermin peradaban dan alat pengaruh yang luar biasa kuat. Ketika membaca atau mendengar tentang ${topic}, kita tidak sekadar menyerap kata-kata, melainkan sedang diajak memahami struktur gagasan, maksud tersembunyi penulis, dan estetika berbahasa yang efektif. Mengapa pemahaman atas ${topic} begitu penting? Karena kecakapan literasi ini akan membedakan mereka yang hanya menjadi konsumen informasi pasif dengan mereka yang mampu menelaah dan mencipta gagasan secara kritis.`;
  } else if (isInformatika) {
    apersepsi = `Di era revolusi kecerdasan artifisial dan konektivitas global, di balik setiap layar gawai dan aplikasi yang kita nikmati, bekerja ribuan baris instruksi logika yang anggun. Konsep ${topic} merupakan salah satu batu bata fondasi peradaban digital tersebut. Mempelajari ${topic} membuka wawasan kita tentang bagaimana persoalan rumit diurai, dimodelkan, dan diselesaikan secara efisien oleh nalar komputasional manusia.`;
  } else if (isMatematika) {
    apersepsi = `Matematika kerap dijuluki sebagai ratu sekaligus pelayan ilmu pengetahuan. Mempelajari ${topic} bukan sekadar menghafal rumus dan deretan angka, melainkan melatih ketajaman penalaran abstrak, ketelitian logika berurutan, dan kemampuan melihat keteraturan tersembunyi di alam semesta. Pemahaman kokoh atas ${topic} akan menjadi jembatan pemecahan masalah di dunia teknik, ekonomi, hingga sains modern.`;
  } else if (isIPA) {
    apersepsi = `Setiap fenomena di alam semesta, dari sel mikroba terkecil hingga galaksi terjauh, tunduk pada hukum-hukum sains yang menakjubkan. Saat kita mendalami ${topic}, kita sedang diajak melakukan penyelidikan ilmiah terhadap bagaimana alam bekerja secara harmonis, menjaga keseimbangan, dan memberi manfaat bagi keberlangsungan kehidupan manusia di bumi.`;
  } else if (isIPS) {
    apersepsi = `Manusia adalah makhluk sosial yang senantiasa berinteraksi, beradaptasi dengan bentang alam, dan menciptakan dinamika sejarah. Pembahasan mengenai ${topic} mengajak kita menelusuri akar peristiwa, menganalisis faktor pendorong perubahan masyarakat, dan menumbuhkan kepekaan kritis terhadap fenomena sosial-ekonomi di lingkungan kita.`;
  } else if (isPPKn) {
    apersepsi = `Sebagai bangsa yang besar dan majemuk, keteraturan dan kedamaian masyarakat bersandar pada komitmen penegakan nilai luhur serta kesadaran hukum. Melalui telaah mendalam tentang ${topic}, peserta didik dipandu menyadari hak dan tanggung jawab kewarganegaraan demi terwujudnya tatanan hidup bersama yang adil, demokratis, dan berkeadaban.`;
  }

  // Tujuan Pembelajaran ABCD
  const defaultObjectives = input.learningObjectives && input.learningObjectives.length > 0
    ? input.learningObjectives
    : [
        `Peserta didik mampu menjelaskan pengertian pokok, hakikat, dan ruang lingkup materi ${topic} secara tepat dan runtut.`,
        `Peserta didik mampu mengidentifikasi karakteristik utama, unsur-unsur pembentuk, dan dimensi struktural dari ${topic}.`,
        `Peserta didik mampu menganalisis keterkaitan antarkonsep serta membedakan varian penerapan ${topic} melalui studi komparasi.`,
        `Peserta didik mampu mengevaluasi penerapan kontekstual materi ${topic} dan memecahkan permasalahan nyata yang relevan.`
      ];

  // Bagian-Bagian Materi (Sections)
  const sections: MateriSection[] = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Sub-bab 1: Pengertian & Hakikat Konseptual
  sections.push({
    id: `sec-deep-1`,
    title: `A. Pengertian Pokok dan Hakikat ${topic}`,
    content: `${topic} merupakan salah satu konsep esensial dalam mata pelajaran ${input.subject} untuk ${level} (${grade}). Secara konseptual dan teoretis, ${topic} mencakup telaah mendalam mengenai prinsip-prinsip dasar yang melandasi fenomena serta tata aturan yang berlaku dalam bidang ini.\n\nPemahaman atas hakikat ${topic} menjadi fondasi penting sebelum melangkah pada telaah teknis lanjutan. Dengan menguasai konsep ini, peserta didik tidak hanya mampu mengingat definisi secara harfiah, melainkan sanggup memaknai signifikansi dan posisinya dalam kerangka keilmuan yang lebih luas.`
  });

  // Sub-bab 2: Karakteristik dan Ciri-Ciri Utama
  sections.push({
    id: `sec-deep-2`,
    title: `B. Karakteristik dan Ciri-Ciri Utama`,
    content: `Agar dapat mengenali dan membedakan materi ${topic} dari entitas konsep lainnya, terdapat beberapa karakteristik dan parameter penentu yang wajib diperhatikan:\n• Dimensi Fungsional: Memiliki kegunaan spesifik yang terarah pada penyelesaian tujuan tertentu dalam bidang ${input.subject}.\n• Keteraturan Struktural: Tersusun atas komponen-komponen logis yang saling bertaut dan membentuk satu kesatuan utuh.\n• Prinsip Otentik dan Terukur: Dapat diamati, dianalisis, dan dievaluasi ketepatannya berdasarkan kaidah keilmuan baku.\n• Relevansi Kontekstual: Selalu berkaitan erat dengan situasi nyata yang dihadapi peserta didik di era modern.`
  });

  // Sub-bab 3: Unsur-Unsur dan Komponen Pembentuk
  sections.push({
    id: `sec-deep-3`,
    title: `C. Unsur-Unsur Pembentuk dan Struktur Anatomi`,
    content: `Struktur pembangun dari ${topic} dapat diuraikan secara anatomi ke dalam beberapa komponen integral berikut:\n1. Komponen Pengantar (Orientasi): Landasan pembuka yang memperkenalkan konteks awal dan ruang lingkup permasalahan.\n2. Komponen Inti (Substansi): Uraian data, fakta, argumen, atau prosedur matematis/ilmiah yang menjadi poros utama pembahasan.\n3. Komponen Relasional (Keterhubungan): Hubungan sebab-akibat, kaidah bahasa, atau formula yang mengaitkan antarbagian secara koheren.\n4. Komponen Penegasan (Aplikasi / Refleksi): Bagian penutup yang memuat simpulan pemaknaan, verifikasi hasil, atau arahan tindak lanjut.`
  });

  // Sub-bab 4: Kaidah Kebahasaan / Tata Aturan Ilmiah / Analisis Kaidah
  const kaidahTitle = isBahasa || isEnglish 
    ? 'D. Analisis Kaidah Kebahasaan dan Pilihan Kata'
    : (isMatematika || isInformatika || isIPA 
        ? 'D. Kaidah Ilmiah, Notasi Baku, dan Prinsip Analitis'
        : 'D. Landasan Norma, Teori, dan Dinamika Hubungan');
  
  const kaidahContent = isBahasa || isEnglish
    ? `Dalam menelaah ${topic}, aspek kebahasaan memegang peran kunci dalam menjamin keterbacaan dan ketepatan pesan:\n• Ketepatan Diksi: Pemilihan istilah baku yang lugas (denotatif) atau kaya rasa (konotatif) disesuaikan dengan jenis teks sasaran.\n• Kepaduan Kalimat (Kohesi & Koherensi): Penggunaan konjungsi antarkalimat yang serasi guna menjaga kelancaran alur pikir pembaca.\n• Ragam Kalimat Khas: Pemanfaatan kalimat deklaratif faktual, kalimat persuasif, atau kalimat imperatif sesuai fungsi sosial yang dituju.\n• Kepatuhan Ejaan: Menjunjung tinggi pedoman ejaan baku nasional (PUEBI/EYD) dan tata tanda baca standar akademik.`
    : `Penerapan ${topic} mengandalkan ketertiban tata aturan ilmiah yang ketat:\n• Standarisasi Terminologi: Menggunakan istilah baku yang disepakati oleh komunitas ilmiah internasional.\n• Akurasi Prosedural: Setiap langkah analisis harus dapat diuji ulang (verifiable) dan bebas dari kontradiksi logis.\n• Hubungan Kausalitas Terbukti: Menghubungkan variabel sebab dan akibat berdasarkan bukti empiris atau pembuktian aksiomatis matematis.`;

  sections.push({
    id: `sec-deep-4`,
    title: kaidahTitle,
    content: kaidahContent
  });

  // Sub-bab 5: Tabel Analisis & Komparasi Terstruktur
  sections.push({
    id: `sec-deep-5`,
    title: `E. Tabel Analisis dan Komparasi Konsep`,
    content: `Berikut adalah tabel komparasi analitis yang membedakan dimensi konseptual ${topic} dengan konsep pembanding yang relevan:`,
    isTable: true,
    tableData: {
      headers: ['Aspek Telaah', `Penerapan Utama (${topic})`, 'Konsep Pembanding / Tradisional'],
      rows: [
        ['Tujuan Dasar', `Menyelesaikan persoalan secara sistematis, terukur, dan kontekstual.`, 'Penyelesaian parsial berbasis kebiasaan atau hafalan pasif.'],
        ['Metodologi & Kaidah', 'Mengikuti standar mutakhir Kurikulum Berkelanjutan dan bernalar kritis.', 'Cenderung mengandalkan prosedur tunggal yang kaku.'],
        ['Peran Siswa', 'Eksplorasi aktif, penemuan konsep mandiri, dan kolaboratif.', 'Menyimak penjelasan satu arah dari pengampu.'],
        ['Hasil / Dampak Nyata', 'Pemahaman mendalam (deep learning) dan siap terapkan dalam kehidupan.', 'Pemahaman sementara yang cepat memudar pasca-ujian.']
      ]
    }
  });

  // Jika ada cakupan materi khusus dari guru, sisipkan sub-bab eksplisit dari cakupan materi tersebut!
  if (scopeItems.length > 0) {
    scopeItems.forEach((item, sIdx) => {
      const charLetter = alphabet[(5 + sIdx) % alphabet.length];
      sections.push({
        id: `sec-scope-${sIdx + 1}`,
        title: `${charLetter}. Telaah Submateri Khusus: ${item}`,
        content: `Bagian ini mendalami secara spesifik butir pembelajaran "${item}". Dalam submateri ini, pendidik membimbing peserta didik untuk membedah rincian konsep, mengidentifikasi faktor-faktor penentu, dan menghubungkannya dengan konteks materi pokok ${topic}.\n\nPenguasaan butir "${item}" memberikan sumbangan krusial terhadap ketercapaian kompetensi utuh, sekaligus melatih kemampuan berpikir kritis dan analitis siswa dalam mengolah informasi.`
      });
    });
  }

  // Sub-bab Akhir: Langkah-Langkah Penerapan dan Relevansi Nyata
  const finalIdx = sections.length;
  const finalLetter = alphabet[finalIdx % alphabet.length];
  sections.push({
    id: `sec-deep-final`,
    title: `${finalLetter}. Langkah-Langkah Penerapan dan Studi Kasus Nyata`,
    content: `Untuk mempraktikkan penguasaan materi ${topic} secara nyata, ikuti panduan terstruktur berikut:\n1. Tahap Observasi Awal: Amati fenomena atau bacaan wacana yang berkaitan erat dengan ${topic}.\n2. Tahap Dekonstruksi & Analisis: Uraikan persoalan ke dalam bagian-bagian kecil sesuai struktur dan unsur yang telah dipelajari.\n3. Tahap Sintesis & Formulasi: Susun solusi, rancang karya teks, atau lakukan komputasi matematis dengan menerapkan kaidah baku.\n4. Tahap Refleksi & Evaluasi Kritis: Uji kembali hasil akhir terhadap kriteria mutu, kebermanfaatan sosial, dan etika akademik.`
  });

  // Model Teks Wacana Pendukung Lengkap
  const supportingReadingText: ReadingModelText = {
    title: `Model Wacana Telaah: Analisis Konseptual ${topic}`,
    category: `Wacana Otentik Bahan Belajar`,
    content: `Berikut adalah model teks/studi kasus kontekstual yang menggambarkan implementasi materi ${topic} secara konkret:\n\n"Dalam sebuah kegiatan pengamatan terarah di lingkungan belajar, peserta didik menemukan bahwa pemahaman mendalam tentang ${topic} memberikan dampak signifikan terhadap cara mereka menyikapi tantangan harian. Dengan menerapkan langkah-langkah analitis yang runtut, kerumitan masalah dapat diurai menjadi tahapan-tahapan yang jelas dan terukur. Prinsip-prinsip ini membuktikan bahwa konsep teoretis memiliki relevansi langsung dengan pemecahan persoalan nyata masyarakat."`,
    analysisNotes: `Catatan Analisis Pendidik: Telaah wacana di atas memperlihatkan perpaduan antara penalaran deduktif dengan pembuktian empiris. Guru dapat meminta siswa menggarisbawahi kalimat utama dan mengidentifikasi unsur-unsur materi yang tampak di dalamnya.`,
    sourceOrContext: `Disusun oleh Pengembang Materi Akademik STIVIA • Rujukan Bahan Ajar ${grade}`
  };

  // Miskonsepsi Siswa & Klarifikasi
  const misconceptions: ConceptMisconception[] = [
    {
      misconception: `Peserta didik sering menganggap materi ${topic} hanya berupa hafalan rumus atau definisi teori tanpa aplikasi praktis.`,
      clarification: `Materi ${topic} sesungguhnya dirancang berorientasi pemecahan masalah (problem solving) yang menuntut nalar logis dan penerapan kontekstual di dunia nyata.`
    },
    {
      misconception: `Anggapan bahwa setiap permasalahan terkait ${topic} hanya memiliki satu jalan penyelesaian yang mutlak.`,
      clarification: `Dalam pembelajaran modern Kurikulum Merdeka, keberagaman sudut pandang kritis dan variasi strategi solusi yang sah sangat diapresiasi asalkan berbasis nalar logis yang valid.`
    }
  ];

  // Glosarium Istilah Kunci
  const glosarium: GlossaryEntry[] = [
    { term: 'Konsep Esensial', definition: 'Gagasan utama yang menjadi poros pemahaman dan prasyarat materi kelanjutan.' },
    { term: 'Analisis Kritis', definition: 'Kemampuan mengurai dan mengevaluasi informasi secara objektif berdasarkan bukti valid.' },
    { term: 'Kaidah Baku', definition: 'Standar aturan resmi yang disepakati secara keilmuan untuk menjamin ketepatan komunikasi ilmiah.' },
    { term: 'Penerapan Kontekstual', definition: 'Penggunaan pengetahuan akademik dalam situasi nyata kehidupan sehari-hari siswa.' }
  ];

  // Rangkuman Utuh
  const summary = `Materi pembelajaran mengenai ${topic} pada mata pelajaran ${input.subject} (${level} ${grade}) memadukan penguasaan hakikat konseptual, karakteristik terukur, unsur pembangun struktural, dan tata aturan ilmiah yang baku. Melalui pendekatan saintifik dan telaah wacana kontekstual, peserta didik dibekali kemahiran bernalar kritis untuk mengidentifikasi persoalan, melakukan komparasi analitis, dan menerapkan solusi secara bertanggung jawab dalam kehidupan nyata.`;

  // Cek Pemahaman HOTS
  const understandingCheck = [
    `Jelaskan hakikat pokok dari ${topic} menggunakan bahasa Anda sendiri tanpa mengubah makna esensialnya!`,
    `Analisislah mengapa pemahaman atas struktur dan kaidah ${topic} sangat menentukan keberhasilan penerapannya di dunia nyata!`,
    `Bandingkan dua aspek pembeda utama yang disajikan dalam tabel komparasi materi di atas, lalu berikan contoh konkretnya!`,
    `Jika Anda dihadapkan pada studi kasus baru di lingkungan sekolah, bagaimana langkah-langkah Anda dalam memanfaatkan konsep ${topic} untuk menyelesaikannya?`
  ];

  // Referensi Resmi Kredibel
  const references = [
    `Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2021). Buku Panduan Guru & Siswa ${input.subject} untuk ${level} ${grade}. Jakarta: Pusat Kurikulum dan Perbukuan BSKAP Kemendikbudristek.`,
    `Badan Standar, Kurikulum, dan Asesmen Pendidikan. (2024). Capaian Pembelajaran Fase Terkait Mata Pelajaran ${input.subject}. Jakarta: Kemendikbudristek.`,
    `Tim Pengembang Kurikulum Nasional. (2023). Modul Ajar dan Panduan Pembelajaran Mendalam (Deep Learning Framework). Jakarta: Kemendikbudristek.`
  ];

  return {
    id: `doc-${Date.now()}`,
    subject: input.subject || 'Bahasa Indonesia',
    educationLevel: level,
    grade: grade,
    bab: bab,
    pertemuan: pertemuan,
    title: topic,
    apersepsi,
    includeApersepsi: true,
    teacherNotes: input.userNotes || 'Pastikan peserta didik diajak aktif mengamati wacana dan menganalisis tabel perbandingan sebelum mengerjakan latihan mandiri.',
    includeTeacherNotesInDoc: false,
    learningObjectives: defaultObjectives,
    sections,
    supportingReadingText,
    includeSupportingReadingText: true,
    misconceptions,
    includeMisconceptions: true,
    glosarium,
    includeGlosarium: true,
    summary,
    includeSummary: true,
    understandingCheck,
    includeUnderstandingCheck: true,
    references,
    includeReferences: true,
    includeStudentNotesSheet: false,
    institutionName: input.schoolName || 'INSTITUSI PEMBELAJARAN TERAKREDITASI',
    teacherName: input.teacherName || 'Pendidik Pengampu',
    sourceMeetingId: input.sourceMeetingId,
    sourceMasterVersion: input.sourceMasterVersion,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Memperkirakan Alokasi Halaman Dokumen A4 (Estimator Pagination)
 * Membantu guru mengetahui estimasi jumlah halaman sebelum dicetak
 */
export function estimateA4PageCount(doc: MateriDocument): number {
  let charCount = 0;
  // Hitung karakter teks utama
  charCount += doc.title.length * 2;
  if (doc.includeApersepsi && doc.apersepsi) charCount += doc.apersepsi.length * 1.3;
  doc.learningObjectives.forEach(o => (charCount += o.length + 30));
  doc.sections.forEach(s => {
    charCount += s.title.length * 1.5;
    charCount += s.content.length;
    if (s.isTable && s.tableData) {
      charCount += s.tableData.rows.length * 160;
    }
  });
  if (doc.includeSupportingReadingText && doc.supportingReadingText) {
    charCount += (doc.supportingReadingText.content.length + (doc.supportingReadingText.analysisNotes?.length || 0)) * 1.2;
  }
  if (doc.includeMisconceptions && doc.misconceptions) {
    doc.misconceptions.forEach(m => (charCount += m.misconception.length + m.clarification.length + 50));
  }
  if (doc.includeGlosarium && doc.glosarium) {
    doc.glosarium.forEach(g => (charCount += g.term.length + g.definition.length + 30));
  }
  if (doc.includeSummary && doc.summary) charCount += doc.summary.length * 1.2;
  if (doc.includeUnderstandingCheck && doc.understandingCheck) {
    doc.understandingCheck.forEach(q => (charCount += q.length + 140)); // tambah ruang garis jawaban
  }
  if (doc.includeReferences && doc.references) {
    doc.references.forEach(r => (charCount += r.length + 40));
  }
  if (doc.includeStudentNotesSheet) charCount += 1400; // 1 halaman tambahan untuk lembar catatan

  // Standar 1 halaman A4 Calibri Light 10pt portrait dengan margin rapi ~ 2.200 - 2.500 karakter
  const estimatedPages = Math.ceil(charCount / 2200);
  return Math.max(1, estimatedPages);
}

/**
 * Ekspor Dokumen Materi Ajar ke Format Microsoft Word (.docx)
 * Berorientasi Cetak A4, Tipografi Calibri Light, Rata Justify
 */
export async function exportMateriToDocx(doc: MateriDocument): Promise<{ success: boolean; filename?: string; error?: string }> {
  try {
    const docParagraphs: (Paragraph | Table)[] = [];

    // Header Lembaga / KOP
    if (doc.institutionName) {
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: doc.institutionName.toUpperCase(),
              bold: true,
              size: 24, // 12pt
              font: 'Calibri Light'
            })
          ]
        })
      );
    }

    // Identitas Dokumen
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: 'DOKUMEN MATERI PEMBELAJARAN TERSTRUKTUR (DEEP LEARNING)',
            bold: true,
            size: 20, // 10pt
            color: '475569',
            font: 'Calibri Light'
          })
        ]
      })
    );

    // Judul Materi Ajar
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: doc.title.toUpperCase(),
            bold: true,
            size: 32, // 16pt
            font: 'Calibri Light'
          })
        ]
      })
    );

    // Tabel Informasi Meta (Mapel, Jenjang, Bab, Pertemuan, Guru)
    const metaTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.DOTTED, size: 2, color: 'E2E8F0' },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Mata Pelajaran: ', bold: true, size: 20, font: 'Calibri Light' }),
                    new TextRun({ text: doc.subject, size: 20, font: 'Calibri Light' })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Jenjang & Kelas: ', bold: true, size: 20, font: 'Calibri Light' }),
                    new TextRun({ text: `${doc.educationLevel} (${doc.grade})`, size: 20, font: 'Calibri Light' })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Bab / Topik: ', bold: true, size: 20, font: 'Calibri Light' }),
                    new TextRun({ text: doc.bab || '-', size: 20, font: 'Calibri Light' })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Alokasi Pertemuan: ', bold: true, size: 20, font: 'Calibri Light' }),
                    new TextRun({ text: doc.pertemuan || '1 Pertemuan', size: 20, font: 'Calibri Light' })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
    docParagraphs.push(metaTable);

    // Spacing
    docParagraphs.push(new Paragraph({ spacing: { after: 180 }, children: [] }));

    // APERSEPSI & PERTANYAAN PEMANTIK
    if (doc.includeApersepsi && doc.apersepsi) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 140, after: 80 },
          children: [
            new TextRun({
              text: 'APERSEPSI & PERTANYAAN PEMANTIK KONTEKSTUAL:',
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 140 },
          children: [
            new TextRun({
              text: doc.apersepsi,
              italics: true,
              size: 20,
              font: 'Calibri Light'
            })
          ]
        })
      );
    }

    // TUJUAN PEMBELAJARAN
    if (doc.learningObjectives && doc.learningObjectives.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 140, after: 80 },
          children: [
            new TextRun({
              text: 'TUJUAN PEMBELAJARAN (CAPAIAN KOMPETENSI):',
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );

      doc.learningObjectives.forEach((obj, idx) => {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 60 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${idx + 1}. ${obj.replace(/^[-*•\d\.\)]+\s*/, '')}`,
                size: 20,
                font: 'Calibri Light'
              })
            ]
          })
        );
      });
      docParagraphs.push(new Paragraph({ spacing: { after: 140 }, children: [] }));
    }

    // BAGIAN-BAGIAN MATERI UTAMA
    doc.sections.forEach((sec) => {
      // Judul Bagian
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: sec.title,
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );

      // Isi Bagian (pecah per paragraf)
      const paragraphs = sec.content.split('\n').filter(p => p.trim().length > 0);
      paragraphs.forEach(p => {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: p,
                size: 20, // 10pt
                font: 'Calibri Light'
              })
            ]
          })
        );
      });

      // Jika ada tabel pada bagian materi
      if (sec.isTable && sec.tableData && sec.tableData.headers.length > 0) {
        const tableRows = [
          new TableRow({
            tableHeader: true,
            children: sec.tableData.headers.map(h => 
              new TableCell({
                shading: { fill: 'F1F5F9' },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ text: h, bold: true, size: 19, font: 'Calibri Light' })
                    ]
                  })
                ]
              })
            )
          }),
          ...sec.tableData.rows.map(row => 
            new TableRow({
              children: row.map(cellText => 
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.JUSTIFIED,
                      children: [
                        new TextRun({ text: cellText, size: 19, font: 'Calibri Light' })
                      ]
                    })
                  ]
                })
              )
            })
          )
        ];

        const contentTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        });
        docParagraphs.push(contentTable);
        docParagraphs.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      }
    });

    // MODEL TEKS WACANA BACAAN PENDUKUNG LENGKAP
    if (doc.includeSupportingReadingText && doc.supportingReadingText) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 80 },
          children: [
            new TextRun({
              text: `MODEL WACANA TELAAH: ${doc.supportingReadingText.title.toUpperCase()}`,
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );

      const readingParas = doc.supportingReadingText.content.split('\n').filter(p => p.trim().length > 0);
      readingParas.forEach(rp => {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 90 },
            children: [
              new TextRun({
                text: rp,
                size: 20,
                font: 'Calibri Light'
              })
            ]
          })
        );
      });

      if (doc.supportingReadingText.analysisNotes) {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 60, after: 140 },
            children: [
              new TextRun({
                text: doc.supportingReadingText.analysisNotes,
                italics: true,
                bold: true,
                size: 19,
                color: '334155',
                font: 'Calibri Light'
              })
            ]
          })
        );
      }
    }

    // TABEL MISKONSEPSI & KLARIFIKASI
    if (doc.includeMisconceptions && doc.misconceptions && doc.misconceptions.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 220, after: 80 },
          children: [
            new TextRun({
              text: 'ANTISIPASI MISKONSEPSI SISWA & KLARIFIKASI KONSEP:',
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );

      const misRows = [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              shading: { fill: 'FEE2E2' },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Kekeliruan / Miskonsepsi Siswa', bold: true, size: 19, font: 'Calibri Light' })]
                })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              shading: { fill: 'DCFCE7' },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Klarifikasi & Fakta Ilmiah yang Benar', bold: true, size: 19, font: 'Calibri Light' })]
                })
              ]
            })
          ]
        }),
        ...doc.misconceptions.map(m =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: [new TextRun({ text: m.misconception, size: 19, font: 'Calibri Light' })]
                  })
                ]
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: [new TextRun({ text: m.clarification, size: 19, font: 'Calibri Light' })]
                  })
                ]
              })
            ]
          })
        )
      ];

      docParagraphs.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: misRows }));
      docParagraphs.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
    }

    // GLOSARIUM ISTILAH PENTING
    if (doc.includeGlosarium && doc.glosarium && doc.glosarium.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: 'GLOSARIUM ISTILAH KUNCI:',
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );

      doc.glosarium.forEach(g => {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 50 },
            children: [
              new TextRun({ text: `• ${g.term}: `, bold: true, size: 20, font: 'Calibri Light' }),
              new TextRun({ text: g.definition, size: 20, font: 'Calibri Light' })
            ]
          })
        );
      });
      docParagraphs.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
    }

    // RANGKUMAN MATERI
    if (doc.includeSummary && doc.summary) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 220, after: 80 },
          children: [
            new TextRun({
              text: 'RANGKUMAN MATERI (INTISARI KUNCI):',
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 140 },
          children: [
            new TextRun({
              text: doc.summary,
              italics: true,
              size: 20,
              font: 'Calibri Light'
            })
          ]
        })
      );
    }

    // CEK PEMAHAMAN & PERTANYAAN DISKUSI
    if (doc.includeUnderstandingCheck && doc.understandingCheck && doc.understandingCheck.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: 'CEK PEMAHAMAN & LATIHAN SISWA (HOTS):',
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );

      doc.understandingCheck.forEach((q, qIdx) => {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `${qIdx + 1}. ${q}`,
                bold: true,
                size: 20,
                font: 'Calibri Light'
              })
            ]
          })
        );
        // Garis tempat jawaban siswa
        docParagraphs.push(
          new Paragraph({
            spacing: { after: 90 },
            children: [
              new TextRun({
                text: 'Jawaban: _____________________________________________________________________________________\n_____________________________________________________________________________________________',
                color: '94A3B8',
                size: 18,
                font: 'Calibri Light'
              })
            ]
          })
        );
      });
    }

    // REFERENSI & DAFTAR RUJUKAN KREDIBEL
    if (doc.includeReferences && doc.references && doc.references.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: 'REFERENSI & SUMBER RUJUKAN RESMI:',
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );

      doc.references.forEach((ref, rIdx) => {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: `[${rIdx + 1}] ${ref}`,
                size: 19,
                font: 'Calibri Light'
              })
            ]
          })
        );
      });
      docParagraphs.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
    }

    // CATATAN PEDAGOGIS GURU
    if (doc.includeTeacherNotesInDoc && doc.teacherNotes) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 60 },
          children: [
            new TextRun({
              text: 'CATATAN PEDAGOGIS PENDIDIK (PANDUAN PEMBELAJARAN):',
              bold: true,
              size: 21,
              font: 'Calibri Light'
            })
          ]
        })
      );
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: doc.teacherNotes,
              italics: true,
              size: 19,
              font: 'Calibri Light'
            })
          ]
        })
      );
    }

    // Susun Document Word OpenXML (.docx)
    const wordDoc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: convertInchesToTwip(8.27), // A4 Width in inches
                height: convertInchesToTwip(11.69) // A4 Height in inches
              },
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1)
              }
            }
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `Materi Ajar: ${doc.title} | ${doc.subject} ${doc.grade}`,
                      size: 16,
                      color: '64748B',
                      font: 'Calibri Light'
                    })
                  ]
                })
              ]
            })
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: 'STIVIA Materi Ajar Siap Cetak • Halaman ', size: 16, font: 'Calibri Light', color: '64748B' }),
                    new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Calibri Light', color: '64748B' })
                  ]
                })
              ]
            })
          },
          children: docParagraphs
        }
      ]
    });

    const blob = await Packer.toBlob(wordDoc);
    const sanitizedTitle = doc.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const filename = `Materi_${doc.subject}_${sanitizedTitle}.docx`;

    // Trigger download di browser
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (err: any) {
    console.error('Error exporting materi to DOCX:', err);
    return { success: false, error: err?.message || 'Gagal mengekspor dokumen Word' };
  }
}
