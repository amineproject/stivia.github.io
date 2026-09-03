export interface InfographicStyleItem {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  description: string;
  shortDescription?: string;
  visualCharacteristics: string[];
  suitableFor: string[];
  characterExample: string;
  characteristics: string; // legacy compatibility
  promptInstruction: string;
  accentColor: string;
  tags: string[];
}

export interface InfographicStyleCategory {
  id: string;
  name: string;
  tagline: string;
  description: string;
  characteristicsSummary: string[];
  iconName: string;
  accent: string;
  styles: InfographicStyleItem[];
}

/**
 * SISTEM 5 KATEGORI GAYA UTAMA STIVIA VERSI 2.2
 * Mengelompokkan seluruh gaya infografis ke dalam 5 pilar estetika pembelajaran.
 */
export const INFOGRAPHIC_STYLE_CATEGORIES: InfographicStyleCategory[] = [
  // =========================================================================
  // 1. EDUKATIF & TERSTRUKTUR
  // =========================================================================
  {
    id: 'edukatif_terstruktur',
    name: 'EDUKATIF & TERSTRUKTUR',
    tagline: 'Bersih, Terstruktur, Akademik & Mudah Dibaca',
    description: 'Menonjolkan hierarki informasi yang jelas, tata letak yang teratur, dan keterbacaan tingkat tinggi. Sangat cocok untuk materi akademik dan teori formal.',
    characteristicsSummary: [
      'Bersih dan rapi tanpa elemen berlebih',
      'Terstruktur dengan pembagian seksi yang jelas',
      'Keterbacaan teks dan angka sangat tinggi',
      'Hierarki informasi logis dari konsep inti ke rincian',
      'Ideal untuk materi akademik formal'
    ],
    iconName: 'GraduationCap',
    accent: 'indigo',
    styles: [
      {
        id: 'minimalism',
        name: 'Minimalism',
        category: 'EDUKATIF & TERSTRUKTUR',
        categoryId: 'edukatif_terstruktur',
        description: 'Sederhana, bersih, fokus pada informasi esensial, tanpa elemen dekorasi yang mengganggu.',
        shortDescription: 'Tampilan sangat bersih dan fokus pada teks inti tanpa ornamen berlebih.',
        visualCharacteristics: [
          'Banyak ruang kosong (whitespace) yang lega',
          'Tipografi sans-serif tegas dan mudah dibaca',
          'Palet warna monokromatik netral dengan aksen tunggal',
          'Tata letak rapi dengan pembatas halus'
        ],
        suitableFor: [
          'Konsep Dasar & Definisi',
          'Matematika & Rumus',
          'Teori Akademik Formal',
          'Prinsip Ilmiah Murni'
        ],
        characterExample: 'Minimalis, tenang, elegan, fokus langsung pada pesan pembelajaran.',
        characteristics: 'Sederhana, bersih, fokus pada informasi esensial, tanpa elemen dekorasi yang mengganggu.',
        promptInstruction: 'Gunakan gaya visual Minimalism dengan tata letak bersih, luasnya ruang bernapas (whitespace), tipografi sans-serif berbobot terukur, palet warna netral bersahaja, dan kartu informasi yang rapi tanpa bayangan atau ornamen berlebihan.',
        accentColor: 'slate',
        tags: ['Bersih', 'Ruang Lega', 'Fokus Inti'],
      },
      {
        id: 'swiss_design',
        name: 'Swiss Design',
        category: 'EDUKATIF & TERSTRUKTUR',
        categoryId: 'edukatif_terstruktur',
        description: 'Sistem grid matematis yang ketat, tipografi sans-serif kuat, dan kejelasan komunikasi mutlak.',
        shortDescription: 'Desain presisi berbasis grid matematis dan tipografi internasional yang tegas.',
        visualCharacteristics: [
          'Struktur grid kolom yang sangat rapi dan presisi',
          'Tipografi neo-grotesque tegas berbobot tinggi',
          'Kontras warna kuat antara teks dan latar belakang',
          'Penyajian fakta dan data yang sangat objektif'
        ],
        suitableFor: [
          'Studi Kasus & Analisis',
          'Data Statistik & Perbandingan',
          'Struktur Organisasi & Klasifikasi',
          'Materi Sains & Teknik'
        ],
        characterExample: 'Rasional, tegas, modern, teratur secara matematis.',
        characteristics: 'Sistem grid matematis yang ketat, tipografi sans-serif kuat, dan kejelasan komunikasi mutlak.',
        promptInstruction: 'Gunakan gaya visual Swiss Design (International Typographic Style) dengan struktur grid asimetris yang presisi, tipografi tebal kontemporer, kontras tinggi, penataan hierarki informasi yang sangat tegas, serta keterbacaan objektif.',
        accentColor: 'red',
        tags: ['Grid Ketat', 'Tipografi Kuat', 'Presisi'],
      },
      {
        id: 'editorial',
        name: 'Editorial',
        category: 'EDUKATIF & TERSTRUKTUR',
        categoryId: 'edukatif_terstruktur',
        description: 'Tata letak berkelas layaknya majalah sains atau publikasi ilmiah profesional.',
        shortDescription: 'Format publikasi bergengsi dengan tipografi serif elegan dan kutipan sorotan.',
        visualCharacteristics: [
          'Judul berkarakter serif anggun dipadu teks isi yang bersih',
          'Blok kutipan penting (pull quotes) yang menonjol',
          'Kolom informasi tertata rapi ala majalah ilmiah',
          'Garis pemisah elegan dengan nuansa akademis terpercaya'
        ],
        suitableFor: [
          'Sastra & Bahasa',
          'Artikel Ilmiah Populer',
          'Biografi Tokoh & Esai',
          'Kajian Teori & Wawasan Sejarah'
        ],
        characterExample: 'Akademis, berwibawa, elegan, mencerminkan literatur terpercaya.',
        characteristics: 'Tata letak berkelas layaknya majalah sains atau publikasi ilmiah profesional.',
        promptInstruction: 'Gunakan gaya visual Editorial dengan format tata letak jurnal/majalah sains bergengsi, tipografi tajam berwibawa, blok teks berkolom seimbang, kartu sorotan kutipan elegan, dan garis aksen klasik.',
        accentColor: 'stone',
        tags: ['Majalah Edukatif', 'Serif Elegan', 'Berwibawa'],
      },
      {
        id: 'glassmorphism',
        name: 'Glassmorphism',
        category: 'EDUKATIF & TERSTRUKTUR',
        categoryId: 'edukatif_terstruktur',
        description: 'Kartu transparan bertekstur kaca halus (frosted glass) dengan efek blur modern.',
        shortDescription: 'Tampilan kaca transparan modern berlapis dengan batas tepi bercahaya lembut.',
        visualCharacteristics: [
          'Permukaan transparan bertekstur kaca kabut (frosted blur)',
          'Garis tepi tipis semi-transparan yang memantulkan cahaya',
          'Kedalaman visual berlapis (multi-layer z-depth)',
          'Latar belakang gradien lembut di balik kartu data'
        ],
        suitableFor: [
          'Konsep Multi-Dimensi',
          'Lapisan Sistem & Teori Bertingkat',
          'Informatika & Konsep Digital',
          'Presentasi Modern & Premium'
        ],
        characterExample: 'Modern, futuristik halus, mewah, elegan tanpa melelahkan mata.',
        characteristics: 'Kartu transparan bertekstur kaca halus (frosted glass) dengan efek blur modern.',
        promptInstruction: 'Gunakan gaya visual Glassmorphism dengan kartu-kartu berpanel kaca transparan (backdrop-blur), garis batas tipis bercahaya lembut, bayangan halus bertingkat, dan latar gradasi modern yang menjaga keterbacaan teks tetap tajam.',
        accentColor: 'sky',
        tags: ['Kaca Transparan', 'Frosted Blur', 'Modern Halus'],
      },
      {
        id: 'modern_edukatif',
        name: 'Modern Edukatif',
        category: 'EDUKATIF & TERSTRUKTUR',
        categoryId: 'edukatif_terstruktur',
        description: 'Gaya standar STIVIA yang menggabungkan keterbacaan prima dan sentuhan modern ramah siswa.',
        shortDescription: 'Standar resmi STIVIA: seimbang antara teks, ikon visual, dan warna ramah siswa.',
        visualCharacteristics: [
          'Sudut kartu melengkung lembut (rounded) yang bersahabat',
          'Palet biru navy dan teal yang menenangkan dan fokus',
          'Ikon edukatif terstruktur di setiap poin bahasan',
          'Hierarki kartu bertingkat: Utama, Sekunder, dan Ringkas'
        ],
        suitableFor: [
          'Semua Mata Pelajaran Kurikulum Merdeka',
          'IPA, IPS, Bahasa, dan Matematika',
          'Materi Pembelajaran Harian',
          'Modul Ajar & Ringkasan Bab'
        ],
        characterExample: 'Harmonis, profesional, ramah peserta didik, mudah dipahami seketika.',
        characteristics: 'Gaya standar STIVIA yang menggabungkan keterbacaan prima dan sentuhan modern ramah siswa.',
        promptInstruction: 'Gunakan gaya visual Modern Edukatif dengan tata letak terstruktur, palet warna navy-indigo dan teal seimbang, sudut kartu melengkung proporsional, ikon topik yang jelas, serta hierarki visual yang membimbing fokus belajar peserta didik.',
        accentColor: 'indigo',
        tags: ['Standar STIVIA', 'Seimbang', 'Ramah Siswa'],
      },
      {
        id: 'academic_clean',
        name: 'Academic Clean',
        category: 'EDUKATIF & TERSTRUKTUR',
        categoryId: 'edukatif_terstruktur',
        description: 'Formal, sistematis, presisi tinggi, dan sangat cocok untuk materi akademik formal.',
        shortDescription: 'Tampilan formal dan rapi untuk kurikulum akademik dan ujian sekolah.',
        visualCharacteristics: [
          'Penomoran sistematis bertingkat (A, B, C / 1, 2, 3)',
          'Palet warna formal biru tua, abu-abu, dan putih bersih',
          'Tabel dan bagan terkoordinasi dengan presisi',
          'Fokus mutlak pada terminologi dan definisi resmi'
        ],
        suitableFor: [
          'Fisika, Kimia, & Biologi SMA',
          'Sosiologi & Ekonomi',
          'PPKn & Tata Negara',
          'Persiapan Ujian & Asesmen'
        ],
        characterExample: 'Formal, disiplin, berbobot ilmiah tinggi, mudah dipelajari.',
        characteristics: 'Formal, sistematis, presisi tinggi, dan sangat cocok untuk materi akademik formal.',
        promptInstruction: 'Gunakan gaya visual Academic Clean dengan pendekatan formal, penomoran terstruktur, pembagian materi yang sistematis, tipografi akademis yang presisi, dan skema warna institusional terpercaya.',
        accentColor: 'blue',
        tags: ['Formal', 'Sistematis', 'Akademis'],
      },
      {
        id: 'flat_design',
        name: 'Flat Design',
        category: 'EDUKATIF & TERSTRUKTUR',
        categoryId: 'edukatif_terstruktur',
        description: 'Ilustrasi 2D datar tanpa gradien berlebih, ikon informatif, dan warna tegas harmonis.',
        shortDescription: 'Bentuk dua dimensi datar dengan warna solid yang lugas dan mudah dicerna.',
        visualCharacteristics: [
          'Elemen grafis 2 dimensi bersih tanpa efek 3D tebal',
          'Warna-warna solid dengan kontras yang nyaman',
          'Ikon flat informatif yang langsung dikenali',
          'Struktur kartu rapi dengan jarak antar-elemen konsisten'
        ],
        suitableFor: [
          'Pengenalan Konsep & Istilah',
          'Petunjuk Langkah Demi Langkah',
          'Materi SMP & SMA',
          'Infografis Edukasi Publik'
        ],
        characterExample: 'Lugas, cerah, modern, tidak membingungkan mata.',
        characteristics: 'Ilustrasi 2D datar tanpa gradien berlebih, ikon informatif, dan warna tegas harmonis.',
        promptInstruction: 'Gunakan gaya visual Flat Design dengan ilustrasi 2 dimensi bersih, palet warna solid yang harmonis, ikon flat edukatif yang sederhana namun ekspresif, dan tata letak modular yang mudah dipindai.',
        accentColor: 'teal',
        tags: ['2D Datar', 'Solid', 'Lugas'],
      },
      {
        id: 'data_visualization',
        name: 'Data Visualization',
        category: 'EDUKATIF & TERSTRUKTUR',
        categoryId: 'edukatif_terstruktur',
        description: 'Fokus pada angka, grafik informatif, diagram proporsi, dan visualisasi statistik.',
        shortDescription: 'Dirancang khusus untuk materi berbasis angka, tren grafik, dan komparasi data.',
        visualCharacteristics: [
          'Grafik batang, donat, dan garis yang terintegrasi',
          'Tipografi angka besar untuk sorotan metrik kunci',
          'Keterangan legenda data yang teratur',
          'Warna fungsional pembeda kategori data'
        ],
        suitableFor: [
          'Statistika Matematika',
          'Data Geografi & Kependudukan',
          'Ekonomi & Inflasi / Anggaran',
          'Hasil Riset Sains & Percobaan'
        ],
        characterExample: 'Faktual, presisi, analitis, menyederhanakan data kompleks.',
        characteristics: 'Fokus pada angka, grafik informatif, diagram proporsi, dan visualisasi statistik.',
        promptInstruction: 'Gunakan gaya visual Data Visualization dengan diagram batang/lingkaran informatif, penekanan angka statistik kunci berukuran besar, label keterangan yang jelas, serta tata letak analitis yang membuat angka mudah dipahami.',
        accentColor: 'emerald',
        tags: ['Grafik', 'Data Angka', 'Analitis'],
      }
    ]
  },

  // =========================================================================
  // 2. ILUSTRATIF & VISUAL
  // =========================================================================
  {
    id: 'ilustratif_visual',
    name: 'ILUSTRATIF & VISUAL',
    tagline: 'Visual Konseptual, Ilustrasi Berkarakter & Menjelaskan Proses',
    description: 'Menggunakan kekuatan visual dan ilustrasi untuk memvisualisasikan konsep abstrak, objek nyata, atau proses siklus secara hidup dan menyenangkan.',
    characteristicsSummary: [
      'Didominasi visual dan ilustrasi tematik yang bermakna',
      'Membantu menjelaskan konsep abstrak menjadi konkret',
      'Sangat cocok untuk materi dengan objek biologis, proses fisis, atau visualisasi alam',
      'Meningkatkan daya ingat visual peserta didik'
    ],
    iconName: 'Palette',
    accent: 'emerald',
    styles: [
      {
        id: 'vector_art',
        name: 'Vector Art',
        category: 'ILUSTRATIF & VISUAL',
        categoryId: 'ilustratif_visual',
        description: 'Ilustrasi vektor garis halus berkualitas tinggi, modern, detail proporsional, dan sangat rapi.',
        shortDescription: 'Grafis vektor bersih dengan kontur tajam dan objek ilustratif yang menjelaskan materi.',
        visualCharacteristics: [
          'Ilustrasi vektor bersih dengan garis tepi tegas dan halus',
          'Visualisasi objek nyata (tumbuhan, organ, mesin, dll) yang akurat',
          'Gradasi halus atau pewarnaan flat modern',
          'Perpaduan seimbang antara teks penjelas dan gambar tematik'
        ],
        suitableFor: [
          'Biologi (Fotosintesis, Sel, Organ Tubuh)',
          'Fisika & Geografi (Siklus Air, Tata Surya)',
          'Teknik & Alat Mekanik',
          'Proses Kimiawi & Lingkungan Hidup'
        ],
        characterExample: 'Visual tajam, edukatif, representatif, estetik dan profesional.',
        characteristics: 'Ilustrasi vektor garis halus berkualitas tinggi, modern, detail proporsional, dan sangat rapi.',
        promptInstruction: 'Gunakan gaya visual Vector Art dengan ilustrasi vektor berkualitas tinggi yang merepresentasikan objek materi secara akurat, garis tegas yang bersih, palet warna seimbang, dan penataan diagram proses yang mengalir secara alami.',
        accentColor: 'emerald',
        tags: ['Vektor Rapi', 'Objek Akurat', 'Edukatif'],
      },
      {
        id: 'clay_style',
        name: 'Clay Style',
        category: 'ILUSTRATIF & VISUAL',
        categoryId: 'ilustratif_visual',
        description: 'Ilustrasi 3D lembut bergaya tanah liat plastisin yang hangat, ramah, dan menyenangkan.',
        shortDescription: 'Visual 3D menyerupai plastisin tanah liat dengan tekstur lembut dan pencahayaan hangat.',
        visualCharacteristics: [
          'Efek visual 3 dimensi plastisin dengan lekukan membulat alami',
          'Pencahayaan lembut (soft lighting) dan bayangan halus',
          'Palet warna hangat, ramah, dan tidak menyilaukan',
          'Objek-objek materi tampak seperti model fisik nyata'
        ],
        suitableFor: [
          'Materi IPA Sekolah Dasar & Menengah',
          'Siklus Kehidupan Hewan & Tumbuhan',
          'Struktur Bumi & Gunung Berapi',
          'Konsep Belajar Interaktif & Kreatif'
        ],
        characterExample: 'Hangat, bersahabat, menyenangkan, membangkitkan rasa ingin tahu.',
        characteristics: 'Ilustrasi 3D lembut bergaya tanah liat plastisin yang hangat, ramah, dan menyenangkan.',
        promptInstruction: 'Gunakan gaya visual Clay Style dengan ilustrasi 3D berefek tanah liat lembut (claymorphic/plasticine), sudut-sudut membulat organik, pencahayaan hangat bersahabat, dan elemen visual yang terasa seperti miniatur nyata.',
        accentColor: 'orange',
        tags: ['3D Clay', 'Lembut', 'Hangat'],
      },
      {
        id: 'pixel_style',
        name: 'Pixel Style',
        category: 'ILUSTRATIF & VISUAL',
        categoryId: 'ilustratif_visual',
        description: 'Seni piksel retro 8-bit/16-bit yang terstruktur, kreatif, dan membangkitkan suasana game edukatif.',
        shortDescription: 'Estetika pixel art retro yang menarik perhatian siswa melalui visual game klasik.',
        visualCharacteristics: [
          'Grid piksel berkarakter retro 8-bit atau 16-bit',
          'Batas tepi bergaya kotak modular (isometric/orthographic)',
          'Palet warna bernuansa arcade klasik yang cerah dan kontras',
          'Ikon dan ornamen berbentuk balok piksel edukatif'
        ],
        suitableFor: [
          'Logika Komputasi & Pemrograman Dasar',
          'Matematika Geometri & Koordinat',
          'Materi Gamifikasi Pembelajaran',
          'Konsep Digital Dasar untuk Siswa'
        ],
        characterExample: 'Nostalgik, interaktif, seru seperti game edukasi, kreatif.',
        characteristics: 'Seni piksel retro 8-bit/16-bit yang terstruktur, kreatif, dan membangkitkan suasana game edukatif.',
        promptInstruction: 'Gunakan gaya visual Pixel Style dengan ilustrasi seni piksel 8-bit/16-bit yang rapi, kontur kotak-kotak berpiksel tajam, palet warna arcade edukatif, dan tata letak modular yang terinspirasi dari antarmuka game edukasi interaktif.',
        accentColor: 'violet',
        tags: ['Pixel 8-bit', 'Gamifikasi', 'Kreatif'],
      },
      {
        id: 'collage_art',
        name: 'Collage Art',
        category: 'ILUSTRATIF & VISUAL',
        categoryId: 'ilustratif_visual',
        description: 'Perpaduan kolase artistik dari potongan visual, tekstur kertas, foto tematik, dan ilustrasi.',
        shortDescription: 'Kombinasi artistik potongan gambar, tekstur kertas robek, dan tipografi kreatif.',
        visualCharacteristics: [
          'Tekstur kertas, tepi sobekan, dan elemen layer bertumpuk',
          'Gabungan foto objek nyata dan ilustrasi grafis',
          'Tipografi dinamis dengan aksen stempel atau label',
          'Komposisi eksploratif yang kaya cerita'
        ],
        suitableFor: [
          'Seni Rupa & Keterampilan',
          'Sastra, Puisi, & Teater',
          'Studi Budaya & Antropologi',
          'Isu Lingkungan & Gerakan Sosial'
        ],
        characterExample: 'Eksploratif, ekspresif, bertekstur, sarat makna kultural.',
        characteristics: 'Perpaduan kolase artistik dari potongan visual, tekstur kertas, foto tematik, dan ilustrasi.',
        promptInstruction: 'Gunakan gaya visual Collage Art dengan gabungan potongan gambar tematik, tekstur kertas atau guntingan kreatif, aksen visual bertumpuk, dan tipografi artistik yang menyatu dalam kesatuan pesan edukatif.',
        accentColor: 'rose',
        tags: ['Kolase Kertas', 'Artistik', 'Tekstur'],
      },
      {
        id: 'handwritten',
        name: 'Handwritten',
        category: 'ILUSTRATIF & VISUAL',
        categoryId: 'ilustratif_visual',
        description: 'Sentuhan tulisan tangan, catatan beranotasi, garis sketsa, dan suasana buku catatan belajar.',
        shortDescription: 'Gaya jurnal belajar pribadi dengan aksen tulisan tangan dan sketsa panah penjelas.',
        visualCharacteristics: [
          'Tipografi aksen bergaya tulisan tangan (handwritten script)',
          'Garis penunjuk, lingkaran sorotan, dan panah sketsa tangan',
          'Latar kertas catatan bergaris halus atau kotak-kotak (grid notebook)',
          'Stiker catatan kecil (sticky notes) untuk poin penting'
        ],
        suitableFor: [
          'Tips Belajar & Strategi Menghafal',
          'Eksperimen Laboratorium & Jurnal Praktikum',
          'Tata Bahasa & Catatan Kosakata',
          'Rangkuman Mandiri Siswa'
        ],
        characterExample: 'Personal, akrab, mudah didekati, seperti catatan siswa teladan.',
        characteristics: 'Sentuhan tulisan tangan, catatan beranotasi, garis sketsa, dan suasana buku catatan belajar.',
        promptInstruction: 'Gunakan gaya visual Handwritten dengan aksen tipografi tulisan tangan yang rapi, garis sketsa organik, panah penunjuk kasual, kartu bergaya sticky note, dan latar kertas bergaris tipis layaknya jurnal belajar premium.',
        accentColor: 'amber',
        tags: ['Tulisan Tangan', 'Jurnal Belajar', 'Sketsa'],
      },
      {
        id: 'doodle_education',
        name: 'Doodle Education',
        category: 'ILUSTRATIF & VISUAL',
        categoryId: 'ilustratif_visual',
        description: 'Coretan edukatif kreatif yang menyederhanakan materi dengan cara yang bersahabat dan santai.',
        shortDescription: 'Ilustrasi doodle coretan spidol yang santai, komunikatif, dan disukai siswa.',
        visualCharacteristics: [
          'Ikon coretan tangan (doodle) hitam-putih atau berwarna pastel',
          'Panah lengkung dan garis putus-putus penunjuk alur',
          'Karakter kecil lucu yang memandu materi',
          'Komposisi bebas namun tetap terorganisir'
        ],
        suitableFor: [
          'Materi Pengantar yang Santai',
          'Pembelajaran IPA & IPS Terpadu',
          'Pendidikan Lingkungan Hidup',
          'Ice Breaking & Pemantik Diskusi'
        ],
        characterExample: 'Ceria, santai, kreatif, meruntuhkan kebosanan membaca materi panjang.',
        characteristics: 'Coretan edukatif kreatif yang menyederhanakan materi dengan cara yang bersahabat dan santai.',
        promptInstruction: 'Gunakan gaya visual Doodle Education dengan ilustrasi coretan edukatif tangan yang kreatif, ikon doodle kontekstual, panah dan garis penunjuk kasual, serta atmosfer belajar yang bersahabat.',
        accentColor: 'purple',
        tags: ['Doodle', 'Coretan Kreatif', 'Santai'],
      },
      {
        id: 'cartoon_education',
        name: 'Cartoon Education',
        category: 'ILUSTRATIF & VISUAL',
        categoryId: 'ilustratif_visual',
        description: 'Karakter kartun edukatif yang ekspresif mendampingi penjelasan setiap bagian materi.',
        shortDescription: 'Maskot kartun ceria yang mendampingi siswa memahami konsep demi konsep.',
        visualCharacteristics: [
          'Maskot atau karakter ilustrasi dengan ekspresi ramah',
          'Balon petunjuk untuk tips atau rumus penting',
          'Warna cerah ceria dengan kontras hangat',
          'Bentuk-bentuk organik membulat yang aman dan ramah anak'
        ],
        suitableFor: [
          'Siswa SD & SMP',
          'Pendidikan Karakter & Budi Pekerti',
          'Kesehatan & Kebersihan Diri',
          'Pengenalan Sains Awal'
        ],
        characterExample: 'Ekspresif, menyenangkan, penuh semangat, memotivasi siswa.',
        characteristics: 'Karakter kartun edukatif yang ekspresif mendampingi penjelasan setiap bagian materi.',
        promptInstruction: 'Gunakan gaya visual Cartoon Education dengan karakter maskot ramah penjelas materi, warna ceria hangat, balon dialog informatif, dan bentuk kartu yang dinamis serta menarik bagi anak-anak.',
        accentColor: 'yellow',
        tags: ['Maskot Kartun', 'Ceria', 'Ramah Anak'],
      }
    ]
  },

  // =========================================================================
  // 3. TEKNOLOGI & DIGITAL
  // =========================================================================
  {
    id: 'teknologi_digital',
    name: 'TEKNOLOGI & DIGITAL',
    tagline: 'Modern, Digital, Futuristik, Siber & Inovatif',
    description: 'Menghadirkan atmosfer teknologi mutakhir, kecerdasan buatan, visual data digital, dan estetika masa depan yang menginspirasi.',
    characteristicsSummary: [
      'Nuansa modern dan digital berkontras tinggi',
      'Elemen teknologi: node, sirkuit, kisi siber, dan kilau cahaya',
      'Tipografi futuristik dan monospaced yang presisi',
      'Cocok untuk materi informatika, robotika, coding, AI, dan inovasi sains'
    ],
    iconName: 'Cpu',
    accent: 'cyan',
    styles: [
      {
        id: 'futuristic',
        name: 'Futuristic',
        category: 'TEKNOLOGI & DIGITAL',
        categoryId: 'teknologi_digital',
        description: 'Tampilan modern yang menggambarkan kemajuan teknologi, sains masa depan, dan inovasi canggih.',
        shortDescription: 'Estetika masa depan dengan elemen digital, komposisi dinamis, dan visual teknologi.',
        visualCharacteristics: [
          'Elemen digital modern dan kisi geometris (grid mesh)',
          'Glow halus bernuansa cyan neon dan deep dark blue',
          'Komposisi dinamis dengan sudut miring beraksen teknologi',
          'Visualisasi diagram sirkuit data dan arsitektur sistem'
        ],
        suitableFor: [
          'Artificial Intelligence (Kecerdasan Buatan)',
          'Robotika & Otomasi Industri',
          'Coding & Algoritma Pemrograman',
          'Eksplorasi Antariksa & Sains Modern'
        ],
        characterExample: 'Canggih, mutakhir, dinamis, berorientasi masa depan.',
        characteristics: 'Tampilan modern yang menggambarkan kemajuan teknologi, sains masa depan, dan inovasi canggih.',
        promptInstruction: 'Gunakan gaya visual Futuristic dengan elemen digital mutakhir, latar belakang teknologi gelap beraksen cahaya neon cyan/biru elektrik, kisi geometris presisi, tipografi modern berkarakter kuat, dan diagram alur berorientasi teknologi masa depan.',
        accentColor: 'cyan',
        tags: ['Futuristik', 'AI & Robotika', 'Canggih'],
      },
      {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        category: 'TEKNOLOGI & DIGITAL',
        categoryId: 'teknologi_digital',
        description: 'Suasana high-tech perkotaan digital dengan kontras warna neon cyan dan magenta yang berani.',
        shortDescription: 'Kontras ekstrem neon digital (cyan-magenta) dengan atmosfer siber berenergi tinggi.',
        visualCharacteristics: [
          'Palet kontras gelap bertenaga neon cyan dan fuchsia-magenta',
          'Garis grid digital siber dan bingkai teknis asimetris',
          'Aksen glitch halus dan barcode/tag data fungsional',
          'Tipografi tajam berkarakter siber industrial'
        ],
        suitableFor: [
          'Keamanan Siber (Cybersecurity) & Kriptografi',
          'Jaringan Komputer & Internet of Things (IoT)',
          'Sistem Operasi & Arsitektur Komputer',
          'Etika Digital & Dunia Maya'
        ],
        characterExample: 'Berani, intens, high-tech, sarat energi siber.',
        characteristics: 'Suasana high-tech perkotaan digital dengan kontras warna neon cyan dan magenta yang berani.',
        promptInstruction: 'Gunakan gaya visual Cyberpunk dengan palet kontras tinggi neon cyan dan neon magenta di atas latar gelap, bingkai kartu siber dengan sudut terpotong (chamfered), grid digital futuristik, dan tipografi bertema komputasi mutakhir.',
        accentColor: 'fuchsia',
        tags: ['Neon Siber', 'High-Tech', 'Intens'],
      },
      {
        id: 'y2k',
        name: 'Y2K',
        category: 'TEKNOLOGI & DIGITAL',
        categoryId: 'teknologi_digital',
        description: 'Estetika digital era milenium awal (2000-an) dengan elemen krom, kilau perak, dan grafis tekno retro.',
        shortDescription: 'Gaya retro-futuristik era awal internet dengan kilau perak, gelembung cair, dan warna pastel futuristik.',
        visualCharacteristics: [
          'Tekstur metalik kromatik dan pantulan cahaya perak',
          'Bentuk gelembung bulat futuristik (blobitecture)',
          'Gradasi warna perak, lilac, baby blue, dan aksen neon lembut',
          'Ikon tekno era 2000-an seperti bintang empat sudut dan kaset digital'
        ],
        suitableFor: [
          'Sejarah Perkembangan Internet & Komputer',
          'Multimedia & Desain Antarmuka Digital',
          'Tren Budaya Populer & Teknologi Informasi',
          'Konsep Web & Komunikasi Maya'
        ],
        characterExample: 'Retro-futuristik, berkilau, unik, bernostalgia dengan era awal internet.',
        characteristics: 'Estetika digital era milenium awal (2000-an) dengan elemen krom, kilau perak, dan grafis tekno retro.',
        promptInstruction: 'Gunakan gaya visual Y2K dengan estetika retro-futurisme era awal tahun 2000-an, aksen krom metalik mengilap, bentuk kontainer membulat aerodinamis, palet warna perak-lilac-cyan, dan ornamen tekno-digital klasik.',
        accentColor: 'purple',
        tags: ['Y2K Chrome', 'Milenium 2000', 'Tekno-Retro'],
      },
      {
        id: 'aurora',
        name: 'Aurora',
        category: 'TEKNOLOGI & DIGITAL',
        categoryId: 'teknologi_digital',
        description: 'Pancaran warna cahaya kutub yang halus dan dinamis, dipadu dengan estetika antarmuka modern.',
        shortDescription: 'Gradasi cahaya aurora halus yang menenangkan, berkelas, dan futuristik.',
        visualCharacteristics: [
          'Gradasi warna cahaya kutub yang mengalir lembut (teal, hijau giok, ungu)',
          'Pencahayaan atmosferik bercahaya lembut (ambient glow)',
          'Batas tepi kartu halus tanpa garis kasar',
          'Tipografi kontemporer yang elegan dan sangat nyaman dibaca'
        ],
        suitableFor: [
          'Sains Atmosfer & Fenomena Alam Modern',
          'Energi Terbarukan & Teknologi Hijau',
          'Komputasi Awan (Cloud Computing)',
          'Kesehatan Mental & Pembelajaran Menenangkan'
        ],
        characterExample: 'Menenangkan, anggun, inovatif, memanjakan mata.',
        characteristics: 'Pancaran warna cahaya kutub yang halus dan dinamis, dipadu dengan estetika antarmuka modern.',
        promptInstruction: 'Gunakan gaya visual Aurora dengan perpaduan gradasi cahaya kutub dinamis yang mengalir lembut, pencahayaan ambient yang hangat dan sejuk, kartu data semi-transparan yang bersih, serta keterbacaan tipografi yang sangat nyaman.',
        accentColor: 'teal',
        tags: ['Gradasi Aurora', 'Glow Halus', 'Menenangkan'],
      },
      {
        id: 'digital_interface',
        name: 'Digital Interface',
        category: 'TEKNOLOGI & DIGITAL',
        categoryId: 'teknologi_digital',
        description: 'Terinspirasi oleh panel kendali dashboard modern, indikator status, dan metrik sistem presisi.',
        shortDescription: 'Tata letak dashboard panel kendali digital dengan modul data berstruktur rapi.',
        visualCharacteristics: [
          'Modul kartu bergaya widget dashboard UI interaktif',
          'Indikator status, bar kemajuan, dan chip tag teknis',
          'Tipografi kode monospaced untuk istilah khusus',
          'Grid modular yang memudahkan komparasi parameter'
        ],
        suitableFor: [
          'Dasar-dasar Jaringan & Server',
          'Manajemen Basis Data (Database SQL)',
          'Analisis Sistem & Rekayasa Perangkat Lunak',
          'Pengukuran Fisika & Parameter Laboratorium'
        ],
        characterExample: 'Presisi, modular, berorientasi operasional, mudah diinspeksi.',
        characteristics: 'Terinspirasi oleh panel kendali dashboard modern, indikator status, dan metrik sistem presisi.',
        promptInstruction: 'Gunakan gaya visual Digital Interface dengan tampilan menyerupai panel dashboard kontrol digital, kartu-kartu widget modular terstruktur, label status berkode warna, tipografi monospaced untuk poin kunci, dan hierarki operasional yang presisi.',
        accentColor: 'blue',
        tags: ['Dashboard UI', 'Widget Modular', 'Presisi Data'],
      }
    ]
  },

  // =========================================================================
  // 4. EKSPRESIF & ENERGETIK
  // =========================================================================
  {
    id: 'ekspresif_energetik',
    name: 'EKSPRESIF & ENERGETIK',
    tagline: 'Berani, Enerjik, Kreatif & Menarik Perhatian Seketika',
    description: 'Mengedepankan kekuatan ekspresi visual, warna berani, dan dinamika tinggi untuk menarik antusiasme dan fokus penuh peserta didik.',
    characteristicsSummary: [
      'Berani dan dinamis dengan komposisi yang tidak monoton',
      'Enerjik dan penuh semangat belajar',
      'Sangat efektif merebut perhatian siswa pada materi yang menuntut motivasi tinggi',
      'Kreatif dengan kombinasi bentuk dan tipografi yang mencolok'
    ],
    iconName: 'Sparkles',
    accent: 'amber',
    styles: [
      {
        id: 'maximalism',
        name: 'Maximalism',
        category: 'EKSPRESIF & ENERGETIK',
        categoryId: 'ekspresif_energetik',
        description: 'Kaya akan detail, warna berani, ornamen berlapis, dan padat informasi visual yang memukau.',
        shortDescription: 'Visual penuh energi dengan palet warna kaya, ornamen beragam, dan kehadiran visual yang kuat.',
        visualCharacteristics: [
          'Pemanfaatan ruang yang padat dengan dekorasi tematik bermakna',
          'Kombinasi pola berani (pola garis, bintang, kisi, tekstur)',
          'Tipografi berlapis dengan bayangan tegas dan kontras kaya',
          'Banyak detail visual pendukung yang saling melengkapi'
        ],
        suitableFor: [
          'Keragaman Budaya Nusantara & Geografi Dunia',
          'Biodiversitas & Keanekaragaman Hayati Hutan Hujan',
          'Sejarah Seni Rupa & Gerakan Kreatif',
          'Pekan Pameran Karya Pembelajaran'
        ],
        characterExample: 'Meriah, berlimpah, percaya diri, kaya nuansa visual.',
        characteristics: 'Kaya akan detail, warna berani, ornamen berlapis, dan padat informasi visual yang memukau.',
        promptInstruction: 'Gunakan gaya visual Maximalism dengan kekayaan visual yang berani, perpaduan pola grafis yang dinamis, palet warna kaya berlapis, tipografi bermata tegas dengan bayangan kuat, dan ornamen pelengkap yang memperkaya makna materi tanpa mengaburkan teks.',
        accentColor: 'amber',
        tags: ['Kaya Detail', 'Warna Berani', 'Ekspresif'],
      },
      {
        id: 'pop_art',
        name: 'Pop Art',
        category: 'EKSPRESIF & ENERGETIK',
        categoryId: 'ekspresif_energetik',
        description: 'Warna-warna primer kontras tinggi, pola halftone titik-titik, dan gaya komik komersial yang berani.',
        shortDescription: 'Gaya seni pop legendaris dengan warna primer cerah, pola bintik halftone, dan garis tegas.',
        visualCharacteristics: [
          'Warna primer cerah mencolok (kuning terang, merah bendera, biru elektrik)',
          'Pola titik-titik halftone bergaya cetak komik klasik',
          'Garis tepi hitam tebal yang membingkai setiap elemen visual',
          'Balon kata dan efek suara onomatopoeia untuk sorotan ide'
        ],
        suitableFor: [
          'Media Komunikasi & Iklan Kreatif',
          'Sosiologi Konsumsi & Budaya Massa',
          'Kewirausahaan & Strategi Pemasaran',
          'Penyuluhan & Kampanye Sosial Siswa'
        ],
        characterExample: 'Ikonik, berenergi tinggi, langsung mencuri pandangan, penuh aksi.',
        characteristics: 'Warna-warna primer kontras tinggi, pola halftone titik-titik, dan gaya komik komersial yang berani.',
        promptInstruction: 'Gunakan gaya visual Pop Art dengan warna primer ekspresif kontras tinggi, pola titik halftone retro, garis kontur hitam tegas, balon penjelas komik, dan tipografi display yang menonjolkan fakta penting secara memikat.',
        accentColor: 'yellow',
        tags: ['Halftone Dots', 'Warna Kontras', 'Populer'],
      },
      {
        id: 'graffiti',
        name: 'Graffiti',
        category: 'EKSPRESIF & ENERGETIK',
        categoryId: 'ekspresif_energetik',
        description: 'Seni jalanan perkotaan (street art) yang dinamis dengan semprotan warna, garis bebas, dan tipografi urban.',
        shortDescription: 'Energi seni mural jalanan dengan percikan cat dinamis dan tipografi ekspresif.',
        visualCharacteristics: [
          'Efek semprotan cat (spray paint stencil & splatters)',
          'Garis bebas dinamis dan bentuk huruf bertumpuk berkarakter',
          'Tekstur dinding perkotaan atau bata halus sebagai latar',
          'Warna kontras berjiwa muda yang menggetarkan semangat'
        ],
        suitableFor: [
          'Pendidikan Seni Urban & Mural',
          'Kepemudaan, Olahraga & Gerakan Aktif',
          'Isu Sosial Kontemporer & Suara Komunitas',
          'Proyek Kreatif Kolaborasi Siswa'
        ],
        characterExample: 'Bebas, berjiwa muda, autentik, penuh daya dobrak kreativitas.',
        characteristics: 'Seni jalanan perkotaan (street art) yang dinamis dengan semprotan warna, garis bebas, dan tipografi urban.',
        promptInstruction: 'Gunakan gaya visual Graffiti dengan aksen seni mural jalanan kontemporer, efek semprotan warna dinamis, tipografi ekspresif bergaya street-art yang tetap terbaca jelas, dan kartu konten dengan aksen stensil modern.',
        accentColor: 'lime',
        tags: ['Street Art', 'Mural Urban', 'Jiwa Muda'],
      },
      {
        id: 'comic_style',
        name: 'Comic Style',
        category: 'EKSPRESIF & ENERGETIK',
        categoryId: 'ekspresif_energetik',
        description: 'Panel sekuensial bergaya komik cerita bergambar dengan alur aksi yang menarik minat baca.',
        shortDescription: 'Struktur panel komik edukatif dengan narasi bergambar yang mengalir seru.',
        visualCharacteristics: [
          'Pembagian panel bergaris tepi hitam yang sekuensial',
          'Balon dialog dan kotak narasi (caption boxes)',
          'Garis aksi (action lines) yang mengarahkan pandangan pembaca',
          'Penyajian materi seperti petualangan cerita bergambar'
        ],
        suitableFor: [
          'Kronologi Peristiwa & Sejarah',
          'Studi Kasus Moral & Etika',
          'Panduan Prosedur Keselamatan Kerja',
          'Eksperimen Petualangan Ilmiah Siswa'
        ],
        characterExample: 'Seru, memikat rasa penasaran, runut alurnya, sangat menghibur.',
        characteristics: 'Panel sekuensial bergaya komik cerita bergambar dengan alur aksi yang menarik minat baca.',
        promptInstruction: 'Gunakan gaya visual Comic Style dengan pembagian panel bergaya komik edukasi, balon dialog informatif, garis tepi tebal khas komik, teks penjelas sekuensial, dan ilustrasi berurutan yang membawa siswa bertualang memahami materi.',
        accentColor: 'red',
        tags: ['Panel Komik', 'Balon Kata', 'Petualangan'],
      }
    ]
  },

  // =========================================================================
  // 5. TEMATIK, HISTORIS & ARTISTIK
  // =========================================================================
  {
    id: 'tematik_historis_artistik',
    name: 'TEMATIK, HISTORIS & ARTISTIK',
    tagline: 'Suasana Autentik, Sejarah, Budaya, Seni & Narasi Klasik',
    description: 'Menghidupkan kembali suasana masa lalu, kekayaan budaya, tradisi peradaban, dan nilai artistik tinggi untuk memperdalam penghayatan materi.',
    characteristicsSummary: [
      'Memiliki atmosfer tematik yang kuat dan autentik',
      'Artistik dengan sentuhan ornamen budaya dan estetika klasik',
      'Sangat cocok untuk materi sejarah perjuangan, kebudayaan, geografi kawasan, dan sastra klasik',
      'Menanamkan penghayatan historis dan apresiasi seni yang mendalam'
    ],
    iconName: 'Landmark',
    accent: 'stone',
    styles: [
      {
        id: 'retro',
        name: 'Retro',
        category: 'TEMATIK, HISTORIS & ARTISTIK',
        categoryId: 'tematik_historis_artistik',
        description: 'Terinspirasi dari poster sains dan ensiklopedia pertengahan abad (mid-century) bernuansa nostalgia hangat.',
        shortDescription: 'Estetika ensiklopedia sains klasik era 1950-70an dengan palet warna hangat dan arsir halus.',
        visualCharacteristics: [
          'Tekstur kertas cetak kuno dengan sentuhan bintik tinta halus',
          'Palet warna hangat nostalgia (mustard, olive green, warm rust, cream)',
          'Gaya ilustrasi berarsir halus khas ensiklopedia ilmu pengetahuan',
          'Tipografi display bergaya mid-century modern'
        ],
        suitableFor: [
          'Sejarah Penemuan Sains & Ilmuwan Besar',
          'Revolusi Industri & Mesin Uap',
          'Ekspedisi Geografis & Peta Navigasi',
          'Biologi Taksonomi Klasik'
        ],
        characterExample: 'Nostalgik, terpercaya, bernilai dokumenter, penuh wibawa sejarah.',
        characteristics: 'Terinspirasi dari poster sains dan ensiklopedia pertengahan abad (mid-century) bernuansa nostalgia hangat.',
        promptInstruction: 'Gunakan gaya visual Retro dengan nuansa ensiklopedia sains mid-century, tekstur kertas cetak hangat, palet warna nostalgia (krem, terakota, sage green), ilustrasi berarsir presisi, dan tipografi penjelas yang klasik berwibawa.',
        accentColor: 'amber',
        tags: ['Mid-Century', 'Ensiklopedia', 'Nostalgia Hangat'],
      },
      {
        id: 'surrealism',
        name: 'Surrealism',
        category: 'TEMATIK, HISTORIS & ARTISTIK',
        categoryId: 'tematik_historis_artistik',
        description: 'Estetika surealisme artistik yang memadukan dunia mimpi, metafora visual mendalam, dan imajinasi filosofis.',
        shortDescription: 'Karya seni surealis penuh metafora filosofis untuk memancing pemikiran kritis dan reflektif.',
        visualCharacteristics: [
          'Metafora visual imajinatif (contoh: otak sebagai semesta ide, jam melengkung, pintu di langit)',
          'Pencahayaan dramatis dengan bayangan panjang puitis',
          'Perpaduan elemen tak terduga yang memicu perenungan konsep',
          'Komposisi ruang artistik yang memicu pemikiran tingkat tinggi (HOTS)'
        ],
        suitableFor: [
          'Filsafat & Teori Berpikir Kritis',
          'Psikologi & Kesadaran Manusia',
          'Apresiasi Puisi & Sastra Eksistensial',
          'Etika Moral & Makna Kehidupan'
        ],
        characterExample: 'Filosofis, imajinatif, puitis, menggugah pemikiran mendalam.',
        characteristics: 'Estetika surealisme artistik yang memadukan dunia mimpi, metafora visual mendalam, dan imajinasi filosofis.',
        promptInstruction: 'Gunakan gaya visual Surrealism dengan metafora konseptual artistik yang menggabungkan elemen imajinatif bermakna, pencahayaan puitis berkarakter, tata letak ruang bernapas yang filosofis, dan penyampaian pesan esensial yang menggugah nalar kritis.',
        accentColor: 'indigo',
        tags: ['Surealis', 'Metafora Filosofis', 'Imajinatif'],
      },
      {
        id: 'bohemian',
        name: 'Bohemian',
        category: 'TEMATIK, HISTORIS & ARTISTIK',
        categoryId: 'tematik_historis_artistik',
        description: 'Estetika organik bernuansa bumi (earth tones) dengan motif dedaunan botani dan komposisi artistik alami.',
        shortDescription: 'Nuansa bumi alami dengan motif botani dedaunan yang hangat, bersahaja, dan menenangkan.',
        visualCharacteristics: [
          'Palet warna alami tanah bumi (terracotta, sage green, warm sand, oker)',
          'Siluet botani dedaunan, ranting, dan lengkungan matahari alami',
          'Tekstur kertas serat linen alami',
          'Tata letak bebas mengalir yang harmonis dengan alam'
        ],
        suitableFor: [
          'Pelestarian Alam & Ekologi Lingkungan',
          'Keanekaragaman Hayati Tumbuhan & Botani',
          'Kearifan Lokal & Budaya Tradisional',
          'Pemberdayaan Masyarakat Pedesaan'
        ],
        characterExample: 'Organik, bersahaja, damai, selaras dengan denyut alam.',
        characteristics: 'Estetika organik bernuansa bumi (earth tones) dengan motif dedaunan botani dan komposisi artistik alami.',
        promptInstruction: 'Gunakan gaya visual Bohemian dengan bentuk-bentuk organik bebas, palet warna bumi alami (terakota, sage, krem hangat), ornamen botani dedaunan yang lembut, dan suasana visual yang tenang serta selaras dengan lingkungan hidup.',
        accentColor: 'orange',
        tags: ['Bumi Alami', 'Botani Dedaunan', 'Organik'],
      },
      {
        id: 'victorian',
        name: 'Victorian',
        category: 'TEMATIK, HISTORIS & ARTISTIK',
        categoryId: 'tematik_historis_artistik',
        description: 'Kemegahan ornamen klasik era Victoria dengan bingkai ukiran rumit, detail anggun, dan simetri formal.',
        shortDescription: 'Kemewahan ornamen klasik dengan ukiran bingkai ukir berwibawa dan tipografi berhias.',
        visualCharacteristics: [
          'Bingkai ukiran filigree berornamen klasik yang anggun',
          'Garis batas dekoratif ganda beraksen emas tua atau tembaga',
          'Tipografi display berhias (ornamental letterforms) yang megah',
          'Komposisi seimbang simetris yang memancarkan keagungan era klasik'
        ],
        suitableFor: [
          'Sejarah Kerajaan Dunia & Monarki',
          'Revolusi Ilmiah Era Renaisans & Victoria',
          'Kesusastraan Klasik & Drama Teater Besar',
          'Hukum, Konstitusi, & Piagam Bersejarah'
        ],
        characterExample: 'Megah, formal, bernilai warisan peradaban, sarat nilai estetika tinggi.',
        characteristics: 'Kemegahan ornamen klasik era Victoria dengan bingkai ukiran rumit, detail anggun, dan simetri formal.',
        promptInstruction: 'Gunakan gaya visual Victorian dengan bingkai ukiran dekoratif klasik bernilai seni tinggi, detail ornamen elegan, tipografi berwibawa khas dokumen bersejarah, tata letak simetris megah, dan palet warna aristokratik yang berwibawa.',
        accentColor: 'stone',
        tags: ['Ornamen Ukir', 'Era Victoria', 'Megah'],
      },
      {
        id: 'vintage',
        name: 'Vintage',
        category: 'TEMATIK, HISTORIS & ARTISTIK',
        categoryId: 'tematik_historis_artistik',
        description: 'Nuansa arsip masa lampau dengan tekstur kertas perkamen sepia dan ornamen bersejarah autentik.',
        shortDescription: 'Pesona dokumen arsip kuno dengan kertas sepia hangat dan atmosfer sejarah autentik.',
        visualCharacteristics: [
          'Latar belakang tekstur kertas kuno perkamen sepia kekuningan',
          'Garis-garis batas halus bernuansa arsip museum',
          'Ilustrasi sketsa berarsir tinta klasik',
          'Stempel tanggal dan penanda arsip bersejarah'
        ],
        suitableFor: [
          'Detik-Detik Proklamasi Kemerdekaan Indonesia',
          'Perang Kemerdekaan & Tokoh Pahlawan Nasional',
          'Peradaban Kuno & Arkeologi',
          'Perkembangan Bahasa & Naskah Kuno'
        ],
        characterExample: 'Autentik, bersejarah, khidmat, membangkitkan rasa hormat pada masa lalu.',
        characteristics: 'Nuansa arsip masa lampau dengan tekstur kertas perkamen sepia dan ornamen bersejarah autentik.',
        promptInstruction: 'Gunakan gaya visual Vintage dengan tekstur perkamen arsip bersejarah bernuansa sepia hangat, ornamen garis klasik, sketsa arsir tinta autentik, dan tipografi bertema retro yang membangkitkan suasana khidmat sejarah.',
        accentColor: 'amber',
        tags: ['Arsip Sepia', 'Dokumen Kuno', 'Sejarah Autentik'],
      },
      {
        id: 'historical',
        name: 'Historical',
        category: 'TEMATIK, HISTORIS & ARTISTIK',
        categoryId: 'tematik_historis_artistik',
        description: 'Fokus pada alur waktu kronologis dan narasi peristiwa besar perjalanan peradaban manusia.',
        shortDescription: 'Gaya visual khusus narasi sejarah dengan garis waktu runtut dan dokumen penjelas.',
        visualCharacteristics: [
          'Garis waktu (timeline) vertikal tegas dengan penanda tonggak peristiwa',
          'Pemberian tanggal, lokasi, dan tokoh kunci yang menonjol',
          'Peta kuno atau dokumen arsip pendukung yang relevan',
          'Palet warna netral bersahaja yang menjaga fokus pada kebenaran fakta'
        ],
        suitableFor: [
          'Kronologi Sejarah Kemerdekaan Indonesia',
          'Perang Dunia I & II',
          'Perjalanan Tokoh Bangsa',
          'Garis Waktu Perkembangan Teori Sains'
        ],
        characterExample: 'Kronologis, objektif, mendalam, menghidupkan alur cerita sejarah.',
        characteristics: 'Fokus pada alur waktu kronologis dan narasi peristiwa besar perjalanan peradaban manusia.',
        promptInstruction: 'Gunakan gaya Historical dengan nuansa sejarah yang relevan, garis alur waktu vertikal dengan penanda tahun yang jelas, kartu peristiwa berurutan kronologis, dan elemen visual yang mendukung periode peristiwa yang dibahas.',
        accentColor: 'stone',
        tags: ['Garis Waktu', 'Kronologi Sejarah', 'Faktual'],
      },
      {
        id: 'storytelling',
        name: 'Storytelling',
        category: 'TEMATIK, HISTORIS & ARTISTIK',
        categoryId: 'tematik_historis_artistik',
        description: 'Menyampaikan materi melalui alur narasi yang mengalir memikat dari pengantar hingga kesimpulan.',
        shortDescription: 'Alur kisah naratif yang membimbing pembaca menjelajahi materi langkah demi langkah.',
        visualCharacteristics: [
          'Jalur visual penuntun yang menghubungkan babak demi babak materi',
          'Pemberian judul babak cerita yang menggugah imajinasi',
          'Ilustrasi pembuka, klimaks materi, dan resolusi kesimpulan',
          'Tipografi naratif yang nyaman dibaca berkesinambungan'
        ],
        suitableFor: [
          'Cerita Rakyat & Dongeng Nusantara',
          'Perjalanan Tokoh Penemu & Penjelajah',
          'Alur Kisah Kehidupan Tokoh Inspiratif',
          'Proses Metamorfosis & Perjalanan Ekologis'
        ],
        characterExample: 'Mengalir, memikat, bersambung, menumbuhkan empati pembaca.',
        characteristics: 'Menyampaikan materi melalui alur narasi yang mengalir memikat dari pengantar hingga kesimpulan.',
        promptInstruction: 'Gunakan gaya visual Storytelling dengan alur narasi visual bersambung dari pengantar, konflik/tantangan materi, pemecahan masalah, hingga rangkuman penutup, dengan ilustrasi tematik dan penunjuk transisi yang memikat rasa ingin tahu siswa.',
        accentColor: 'amber',
        tags: ['Alur Narasi', 'Babak Cerita', 'Mengalir'],
      }
    ]
  }
];

// Flat list of all available styles
export const ALL_INFOGRAPHIC_STYLES: InfographicStyleItem[] = INFOGRAPHIC_STYLE_CATEGORIES.flatMap(
  (c) => c.styles
);

/**
 * Find style by name or ID (robust fuzzy resolution)
 */
export function findStyleByNameOrId(nameOrId?: string): InfographicStyleItem | undefined {
  if (!nameOrId) return undefined;
  const target = nameOrId.toLowerCase().trim();

  // 1. Exact match by ID or Name
  const exact = ALL_INFOGRAPHIC_STYLES.find(
    (s) => s.id.toLowerCase() === target || s.name.toLowerCase() === target
  );
  if (exact) return exact;

  // 2. Alias resolution
  if (target.includes('minimalis') || target === 'minimalism') {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'minimalism');
  }
  if (target.includes('swiss')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'swiss_design');
  }
  if (target.includes('editorial')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'editorial');
  }
  if (target.includes('glassmorphism')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'glassmorphism');
  }
  if (target.includes('modern edukatif') || target.includes('modern education')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'modern_edukatif');
  }
  if (target.includes('vector art') || (target.includes('vektor') && !target.includes('education'))) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'vector_art');
  }
  if (target.includes('clay')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'clay_style');
  }
  if (target.includes('pixel')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'pixel_style');
  }
  if (target.includes('collage') || target.includes('kolase')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'collage_art');
  }
  if (target.includes('handwritten') || target.includes('tulisan tangan')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'handwritten');
  }
  if (target.includes('futuristic') || target.includes('futuristik')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'futuristic');
  }
  if (target.includes('cyberpunk')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'cyberpunk');
  }
  if (target.includes('y2k')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'y2k');
  }
  if (target.includes('aurora')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'aurora');
  }
  if (target.includes('pop art')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'pop_art');
  }
  if (target.includes('maximalism') || target.includes('maksimalis')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'maximalism');
  }
  if (target.includes('graffiti') || target.includes('grafiti')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'graffiti');
  }
  if (target.includes('retro')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'retro');
  }
  if (target.includes('surrealism') || target.includes('surealis')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'surrealism');
  }
  if (target.includes('bohemian')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'bohemian');
  }
  if (target.includes('victorian')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'victorian');
  }
  if (target.includes('vintage')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'vintage');
  }
  if (target.includes('sejarah') || target.includes('historical') || target.includes('timeline')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'historical');
  }

  // 3. Fallback partial search
  return ALL_INFOGRAPHIC_STYLES.find((s) => target.includes(s.name.toLowerCase()));
}

/**
 * Generate AI Style Recommendations (max 3) based on learning context
 */
export interface StyleContextInput {
  educationLevel?: string;
  grade?: string;
  subject?: string;
  theme?: string;
  topic?: string;
  scope?: string;
}

export function getAIStyleRecommendations(ctx: StyleContextInput): InfographicStyleItem[] {
  const combinedText = [
    ctx.subject || '',
    ctx.theme || '',
    ctx.topic || '',
    ctx.scope || '',
    ctx.educationLevel || '',
    ctx.grade || '',
  ]
    .join(' ')
    .toLowerCase();

  // 1. History, culture, independence, social studies
  if (
    combinedText.includes('sejarah') ||
    combinedText.includes('kemerdekaan') ||
    combinedText.includes('pahlawan') ||
    combinedText.includes('budaya') ||
    combinedText.includes('peristiwa') ||
    combinedText.includes('sastra') ||
    combinedText.includes('kerajaan') ||
    combinedText.includes('proklamasi') ||
    combinedText.includes('peradaban')
  ) {
    return [
      findStyleByNameOrId('Historical')!,
      findStyleByNameOrId('Vintage')!,
      findStyleByNameOrId('Retro')!,
    ].filter(Boolean);
  }

  // 2. Informatics, AI, Tech, Computer, Coding, Robotics, Cyber, High-Tech Science
  if (
    combinedText.includes('informatika') ||
    combinedText.includes('artificial intelligence') ||
    combinedText.includes('ai') ||
    combinedText.includes('teknologi') ||
    combinedText.includes('komputer') ||
    combinedText.includes('coding') ||
    combinedText.includes('jaringan') ||
    combinedText.includes('digital') ||
    combinedText.includes('robot') ||
    combinedText.includes('cyber') ||
    combinedText.includes('database') ||
    combinedText.includes('internet')
  ) {
    return [
      findStyleByNameOrId('Futuristic')!,
      findStyleByNameOrId('Digital Interface')!,
      findStyleByNameOrId('Glassmorphism')!,
    ].filter(Boolean);
  }

  // 3. Biology, Natural Sciences, Environment, Geography, Photosynthesis, Ecosystem
  if (
    combinedText.includes('biologi') ||
    combinedText.includes('ipa') ||
    combinedText.includes('lingkungan') ||
    combinedText.includes('alam') ||
    combinedText.includes('ekosistem') ||
    combinedText.includes('fotosintesis') ||
    combinedText.includes('geografi') ||
    combinedText.includes('tumbuhan') ||
    combinedText.includes('hewan')
  ) {
    return [
      findStyleByNameOrId('Vector Art')!,
      findStyleByNameOrId('Clay Style')!,
      findStyleByNameOrId('Modern Edukatif')!,
    ].filter(Boolean);
  }

  // 4. Mathematics, Statistics, Data Analysis, Finance, Economy
  if (
    combinedText.includes('matematika') ||
    combinedText.includes('statistik') ||
    combinedText.includes('data') ||
    combinedText.includes('ekonomi') ||
    combinedText.includes('grafik') ||
    combinedText.includes('keuangan') ||
    combinedText.includes('akuntansi') ||
    combinedText.includes('aljabar')
  ) {
    return [
      findStyleByNameOrId('Data Visualization')!,
      findStyleByNameOrId('Swiss Design')!,
      findStyleByNameOrId('Minimalism')!,
    ].filter(Boolean);
  }

  // 5. Primary School (SD), Early childhood, Playful / Creative learning
  if (
    combinedText.includes('sd') ||
    combinedText.includes('anak') ||
    combinedText.includes('kelas 1') ||
    combinedText.includes('kelas 2') ||
    combinedText.includes('kelas 3') ||
    combinedText.includes('kelas 4') ||
    combinedText.includes('dongeng') ||
    combinedText.includes('kartun') ||
    combinedText.includes('cerita')
  ) {
    return [
      findStyleByNameOrId('Cartoon Education')!,
      findStyleByNameOrId('Clay Style')!,
      findStyleByNameOrId('Doodle Education')!,
    ].filter(Boolean);
  }

  // 6. Language, Art, Creative Expression, Social
  if (
    combinedText.includes('seni') ||
    combinedText.includes('kreatif') ||
    combinedText.includes('bahasa') ||
    combinedText.includes('puisi') ||
    combinedText.includes('drama') ||
    combinedText.includes('musik')
  ) {
    return [
      findStyleByNameOrId('Collage Art')!,
      findStyleByNameOrId('Pop Art')!,
      findStyleByNameOrId('Handwritten')!,
    ].filter(Boolean);
  }

  // Default Academic recommendations
  return [
    findStyleByNameOrId('Modern Edukatif')!,
    findStyleByNameOrId('Minimalism')!,
    findStyleByNameOrId('Vector Art')!,
  ].filter(Boolean);
}
