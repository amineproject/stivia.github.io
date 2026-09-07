import { TypographyProfile, StyleProfile } from '../types';
import { getTypographyProfile } from './typographyProfiles';
import { STYLE_PROFILES_V22D, getStyleProfile } from './styleProfilesData';

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
  typographyProfile?: TypographyProfile;
  styleProfile?: StyleProfile;
}

export interface InfographicStyleCategory {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  characteristicsSummary: string[];
  iconName: string;
  accent: string;
  styles: InfographicStyleItem[];
}

/**
 * SISTEM 5 KATEGORI GAYA UTAMA STIVIA VERSI 2.2d
 * Mengelompokkan seluruh 20 gaya infografis ke dalam 5 pilar estetika pembelajaran resmi.
 */
export const INFOGRAPHIC_STYLE_CATEGORIES: InfographicStyleCategory[] = [
  // =========================================================================
  // 1. MODERN & DIGITAL
  // =========================================================================
  {
    id: 'modern_digital',
    name: 'MODERN & DIGITAL',
    shortName: 'DIGITAL',
    tagline: 'Futuristik, Teknologi, Inovasi & Antarmuka Canggih',
    description: 'Gaya modern dengan nuansa teknologi, digital, inovasi, dan masa depan. Sangat ideal untuk sains modern, komputasi, dan materi canggih.',
    characteristicsSummary: [
      'Modern, digital, dinamis, dan inovatif',
      'Aksen garis geometris presisi dan pendaran cahaya halus',
      'Panel informasi semi-transparan berbobot kontemporer',
      'Palet cyan elektrik, biru kobalt, dan spektrum aurora',
      'Cocok untuk informatika, fisika modern, dan teknologi'
    ],
    iconName: 'Cpu',
    accent: 'indigo',
    styles: [
      {
        id: 'futuristic',
        name: 'Futuristic',
        category: 'MODERN & DIGITAL',
        categoryId: 'modern_digital',
        description: 'Tampilan modern dan futuristik yang cocok untuk materi teknologi, inovasi, dan sains canggih.',
        shortDescription: 'Estetika teknologi tinggi dengan aksen garis neon presisi dan antarmuka masa depan.',
        visualCharacteristics: [
          'Garis aksen geometris bercahaya neon halus',
          'Panel informasi cyber HUD dengan sudut chamfered',
          'Font Orbitron + Exo 2 berkarakter teknologi tinggi',
          'Palet biru cyan, kobalt, dan ungu kosmis'
        ],
        suitableFor: [
          'Informatika & Robotika',
          'Kecerdasan Buatan (AI) & Koding',
          'Fisika Kuantum & Astronomi',
          'Inovasi Teknologi Terbarukan'
        ],
        characterExample: 'Modern, canggih, teratur, memancarkan atmosfer laboratorium masa depan.',
        characteristics: 'Tampilan modern dan futuristik yang cocok untuk materi teknologi, inovasi, dan sains canggih.',
        promptInstruction: 'Gunakan gaya Futuristic dengan estetika antarmuka teknologi tinggi, aksen garis neon cyan halus, panel modular berbingkai presisi, font Orbitron untuk judul dan Exo 2 untuk teks isi, serta tata letak HUD yang tertib.',
        accentColor: 'blue',
        tags: ['Teknologi', 'Cyber HUD', 'Futuristik'],
        styleProfile: STYLE_PROFILES_V22D.futuristic,
      },
      {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        category: 'MODERN & DIGITAL',
        categoryId: 'modern_digital',
        description: 'Estetika futuristik berani dengan nuansa neon, glitch digital, dan atmosfer perkotaan teknologi tinggi.',
        shortDescription: 'Warna neon kontras tajam, aksen kode terminal, dan panel modular berenergi tinggi.',
        visualCharacteristics: [
          'Kontras tajam dengan aksen neon kuning elektrik dan pink fuchsia',
          'Stempel peringatan industri dan kode digital modular',
          'Font Orbitron + Rajdhani berenergi dinamis',
          'Panel data bertingkat ala antarmuka konsol canggih'
        ],
        suitableFor: [
          'Keamanan Siber & Jaringan Komputer',
          'Pemrograman Lanjut & Sistem Operasi',
          'Dampak Sosial Teknologi Informasi',
          'Kriptografi & Blockchain'
        ],
        characterExample: 'Tajam, berani, dinamis, memikat perhatian dengan estetika neon digital.',
        characteristics: 'Estetika futuristik berani dengan nuansa neon, glitch digital, dan atmosfer perkotaan teknologi tinggi.',
        promptInstruction: 'Gunakan gaya Cyberpunk dengan palet gelap beraksen neon cyan dan fuchsia tajam, stempel kode modular, font Orbitron dan Rajdhani, serta bingkai data industrial berkarakter kuat.',
        accentColor: 'cyan',
        tags: ['Neon Tajam', 'Siber', 'Energetik'],
        styleProfile: STYLE_PROFILES_V22D.cyberpunk,
      },
      {
        id: 'glassmorphism',
        name: 'Glassmorphism',
        category: 'MODERN & DIGITAL',
        categoryId: 'modern_digital',
        description: 'Desain modern elegan dengan kartu transparan bertekstur kaca halus dan pencahayaan lembut.',
        shortDescription: 'Panel kaca frosted transparan modern dengan garis tepi bercahaya lembut.',
        visualCharacteristics: [
          'Permukaan transparan bertekstur kaca kabut (frosted blur)',
          'Garis tepi tipis memantulkan cahaya putih lembut',
          'Font Outfit + Inter yang modern dan jernih',
          'Latar belakang gradasi aurora lembut di balik kartu data'
        ],
        suitableFor: [
          'Konsep Multi-Lapisan Teori Sains',
          'Struktur Sel & Ekosistem Biologi',
          'Informatika & Konsep Cloud Computing',
          'Komunikasi Digital & Media Sosial'
        ],
        characterExample: 'Modern, elegan, jernih, mewah tanpa melelahkan mata.',
        characteristics: 'Desain modern elegan dengan kartu transparan bertekstur kaca halus dan pencahayaan lembut.',
        promptInstruction: 'Gunakan gaya Glassmorphism dengan panel kaca semi-transparan bertekstur frosted blur halus, batas tepi putih tipis yang memantulkan cahaya lembut, font Outfit + Inter, dan kedalaman multi-lapisan yang rapi.',
        accentColor: 'indigo',
        tags: ['Frosted Glass', 'Elegan', 'Modern'],
        styleProfile: STYLE_PROFILES_V22D.glassmorphism,
      },
      {
        id: 'aurora',
        name: 'Aurora',
        category: 'MODERN & DIGITAL',
        categoryId: 'modern_digital',
        description: 'Pendaran cahaya gradasi spektakuler dari hijau toska, ungu lembayung, dan biru langit yang menenangkan.',
        shortDescription: 'Gradasi cahaya alami aurora yang lembut, harmonis, dan ramah konsentrasi.',
        visualCharacteristics: [
          'Pendaran warna gradasi aurora lembut yang menyatu harmonis',
          'Tipografi Sora + Manrope yang modern dan bernafas lega',
          'Kartu materi dengan tepi aksen gradasi yang memikat',
          'Suasana damai, futuristik, dan menenangkan konsentrasi'
        ],
        suitableFor: [
          'Geografi & Fenomena Atmosfer Bumi',
          'Biologi Molekuler & Genetika',
          'Psikologi & Perkembangan Karakter',
          'Astronomi & Tata Surya'
        ],
        characterExample: 'Tenang, bercahaya, futuristik halus, menyejukkan pandangan belajar.',
        characteristics: 'Pendaran cahaya gradasi spektakuler dari hijau toska, ungu lembayung, dan biru langit yang menenangkan.',
        promptInstruction: 'Gunakan gaya Aurora dengan perpaduan gradasi cahaya lembut teal, indigo, dan lembayung, tipografi Sora + Manrope, kartu materi bertepi halus, serta pencahayaan atmosfer yang harmonis.',
        accentColor: 'teal',
        tags: ['Gradasi Cahaya', 'Aurora', 'Harmonis'],
        styleProfile: STYLE_PROFILES_V22D.aurora,
      },
      {
        id: 'y2k',
        name: 'Y2K',
        category: 'MODERN & DIGITAL',
        categoryId: 'modern_digital',
        description: 'Estetika pergantian milenium era tahun 2000-an dengan elemen retro digital, kawat chrome, dan keceriaan tekno.',
        shortDescription: 'Estetika retro-digital milenium dengan bintang 4 titik dan warna cyber pop ceria.',
        visualCharacteristics: [
          'Bintang 4 titik (sparkles) kromatik khas era milenium',
          'Bentuk kapsul pil dan sudut melengkung tebal',
          'Font Space Grotesk + DM Sans yang berkarakter retro-futuristik',
          'Warna ceria perak krom, biru langit, dan oranye menyala'
        ],
        suitableFor: [
          'Sejarah Perkembangan Internet & Komputer',
          'Media Massa & Budaya Populer Abad 21',
          'Pengantar Desain Grafis & Multimedia',
          'Komunikasi Antargenerasi'
        ],
        characterExample: 'Ceria, berjiwa muda, unik, memadukan nostalgia milenium dengan estetika modern.',
        characteristics: 'Estetika pergantian milenium era tahun 2000-an dengan elemen retro digital, kawat chrome, dan keceriaan tekno.',
        promptInstruction: 'Gunakan gaya Y2K dengan ornamen bintang 4 titik perak kromatik, bentuk kapsul bulat retro, font Space Grotesk dan DM Sans, warna biru cyber pop dan oranye, serta tata letak modular yang segar.',
        accentColor: 'blue',
        tags: ['Retro Digital', 'Milenium', 'Kreatif'],
        styleProfile: STYLE_PROFILES_V22D.y2k,
      },
    ],
  },

  // =========================================================================
  // 2. SEDERHANA & PROFESIONAL
  // =========================================================================
  {
    id: 'sederhana_profesional',
    name: 'SEDERHANA & PROFESIONAL',
    shortName: 'PROFESIONAL',
    tagline: 'Bersih, Terstruktur, Informatif & Presisi Tinggi',
    description: 'Gaya yang bersih, terstruktur, mudah dibaca, dan berorientasi pada penyampaian informasi yang akurat dan jelas.',
    characteristicsSummary: [
      'Bersih, terstruktur, informatif, profesional, dan efektif',
      'Ruang bernafas (whitespace) yang lega dan nyaman di mata',
      'Hierarki tipografi rasional tanpa ornamen yang mengganggu',
      'Palet warna netral bersahaja dengan aksen fungsional',
      'Sangat ideal untuk matematika, sains murni, hukum, dan ekonomi'
    ],
    iconName: 'Briefcase',
    accent: 'slate',
    styles: [
      {
        id: 'minimalism',
        name: 'Minimalism',
        category: 'SEDERHANA & PROFESIONAL',
        categoryId: 'sederhana_profesional',
        description: 'Sederhana, bersih, fokus pada informasi esensial, tanpa elemen dekorasi yang mengganggu.',
        shortDescription: 'Tampilan sangat bersih dan fokus pada teks inti dengan keterbacaan mutlak.',
        visualCharacteristics: [
          'Banyak ruang kosong (whitespace) yang lega dan tenang',
          'Tipografi sans-serif Montserrat + Inter yang sangat teratur',
          'Palet warna monokromatik abu-abu netral dengan aksen tunggal',
          'Garis pembatas halus dan kartu flat bersih'
        ],
        suitableFor: [
          'Konsep Dasar & Definisi Ilmiah',
          'Matematika, Rumus & Aljabar',
          'Pedoman Resmi, Regulasi & Etika',
          'Fisika Murni & Teori Dasar'
        ],
        characterExample: 'Minimalis, tenang, elegan, fokus langsung pada pesan pembelajaran.',
        characteristics: 'Sederhana, bersih, fokus pada informasi esensial, tanpa elemen dekorasi yang mengganggu.',
        promptInstruction: 'Gunakan gaya visual Minimalism dengan tata letak sangat bersih, ruang bernapas (whitespace) melimpah, tipografi Montserrat untuk judul dan Inter untuk teks isi, palet monokromatik abu-abu elegan, dan kartu flat tanpa bayangan berlebih.',
        accentColor: 'slate',
        tags: ['Bersih', 'Ruang Lega', 'Fokus Inti'],
        styleProfile: STYLE_PROFILES_V22D.minimalism,
      },
      {
        id: 'swiss_design',
        name: 'Swiss Design',
        category: 'SEDERHANA & PROFESIONAL',
        categoryId: 'sederhana_profesional',
        description: 'Sistem grid matematis yang ketat, tipografi neo-grotesque tegas, dan kejelasan komunikasi mutlak.',
        shortDescription: 'Desain presisi berbasis grid matematis dan tipografi internasional yang tegas.',
        visualCharacteristics: [
          'Struktur grid kolom yang sangat rapi dan presisi matematis',
          'Tipografi Inter berbobot tegas dengan hierarki objektif',
          'Kontras warna kuat antara teks dan latar belakang',
          'Penyajian fakta, data angka, dan komparasi yang disiplin'
        ],
        suitableFor: [
          'Data Statistik & Perbandingan Angka',
          'Studi Kasus & Analisis Terstruktur',
          'Struktur Organisasi & Klasifikasi Taksonomi',
          'Materi Sains, Fisika & Rekayasa Teknik'
        ],
        characterExample: 'Rasional, tegas, modern, teratur secara matematis.',
        characteristics: 'Sistem grid matematis yang ketat, tipografi neo-grotesque tegas, dan kejelasan komunikasi mutlak.',
        promptInstruction: 'Gunakan gaya Swiss Design dengan sistem grid asimetris presisi tinggi, tipografi Inter berbobot tegas hitam-putih dengan aksen merah internasional, garis pembatas 2px solid, serta penataan data yang sangat rasional.',
        accentColor: 'red',
        tags: ['Grid Ketat', 'Tipografi Kuat', 'Presisi'],
        styleProfile: STYLE_PROFILES_V22D.swiss_design,
      },
      {
        id: 'editorial',
        name: 'Editorial',
        category: 'SEDERHANA & PROFESIONAL',
        categoryId: 'sederhana_profesional',
        description: 'Format publikasi berwibawa layaknya majalah sains atau publikasi ilmiah profesional.',
        shortDescription: 'Format publikasi bergengsi dengan tipografi serif elegan dan kutipan sorotan.',
        visualCharacteristics: [
          'Judul berkarakter serif anggun Playfair Display dipadu teks isi Lora',
          'Blok kutipan penting (pull quotes) yang menonjol',
          'Kolom informasi tertata rapi ala jurnal ilmiah prestisius',
          'Garis pemisah elegan dengan nuansa akademis terpercaya'
        ],
        suitableFor: [
          'Bahasa & Sastra Indonesia / Inggris',
          'Biografi Tokoh Dunia & Nasional',
          'Kajian Teori Filosofis & Sosial',
          'Artikel Ilmiah Populer & Opini Berbobot'
        ],
        characterExample: 'Akademis, berwibawa, elegan, mencerminkan literatur terpercaya.',
        characteristics: 'Format publikasi berwibawa layaknya majalah sains atau publikasi ilmiah profesional.',
        promptInstruction: 'Gunakan gaya Editorial dengan format jurnal prestisius, tipografi Playfair Display pada judul dan Lora pada teks isi, blok kutipan penting (pull quotes) beraksen garis halus, dan latar warna krem hangat layaknya kertas buku berkualitas.',
        accentColor: 'stone',
        tags: ['Jurnal Ilmiah', 'Serif Elegan', 'Berwibawa'],
        styleProfile: STYLE_PROFILES_V22D.editorial,
      },
      {
        id: 'vector_art',
        name: 'Vector Art',
        category: 'SEDERHANA & PROFESIONAL',
        categoryId: 'sederhana_profesional',
        description: 'Ilustrasi vektor garis halus berkualitas tinggi, modern, rapi, dan menjelaskan objek materi secara presisi.',
        shortDescription: 'Ilustrasi vektor terstandar yang jelas, proporsional, dan sangat edukatif.',
        visualCharacteristics: [
          'Garis tepi objek tajam, bersih, dan proporsional',
          'Visualisasi objek nyata (organ, mesin, tumbuhan) yang akurat',
          'Font Poppins + Nunito Sans yang ramah dan jernih',
          'Perpaduan seimbang antara teks penjelas dan visual tematik'
        ],
        suitableFor: [
          'Biologi (Anatomi Tubuh, Sel, Sistem Organ)',
          'Siklus Alam & Ekosistem Lingkungan',
          'Mekanika Sederhana & Alat Fisika',
          'Geografi Fenomena Alam & Vulkanologi'
        ],
        characterExample: 'Rapi, proporsional, ramah siswa, menjelaskan konsep visual secara tuntas.',
        characteristics: 'Ilustrasi vektor garis halus berkualitas tinggi, modern, rapi, dan menjelaskan objek materi secara presisi.',
        promptInstruction: 'Gunakan gaya Vector Art dengan ilustrasi vektor datar 2D yang rapi, garis tepi tegas dan proporsional, font Poppins untuk judul dan Nunito Sans untuk isi, serta penunjuk arah alur proses materi yang jelas.',
        accentColor: 'emerald',
        tags: ['Vektor Rapi', 'Ilustratif Jelas', 'Edukatif'],
        styleProfile: STYLE_PROFILES_V22D.vector_art,
      },
    ],
  },

  // =========================================================================
  // 3. KREATIF & EKSPRESIF
  // =========================================================================
  {
    id: 'kreatif_ekspresif',
    name: 'KREATIF & EKSPRESIF',
    shortName: 'EKSPRESIF',
    tagline: 'Berani, Dinamis, Artistik & Menarik Perhatian Seketika',
    description: 'Gaya dengan karakter visual yang kuat, berani, kreatif, dinamis, dan ekspresif. Sangat ampuh menarik minat siswa pada tema-tema kontekstual.',
    characteristicsSummary: [
      'Berani, kreatif, ekspresif, dinamis, dan menarik perhatian',
      'Tipografi bertenaga dengan kontras bobot yang memikat',
      'Warna primer cerah dan tabrakan palet visual yang hidup',
      'Struktur bento modular dan panel komik interaktif',
      'Sangat cocok untuk seni, bahasa, olahraga, dan isu sosial'
    ],
    iconName: 'Sparkles',
    accent: 'rose',
    styles: [
      {
        id: 'maximalism',
        name: 'Maximalism',
        category: 'KREATIF & EKSPRESIF',
        categoryId: 'kreatif_ekspresif',
        description: 'Gaya berani, padat, penuh energi visual, warna kontras tinggi, dan memicu antusiasme belajar peserta didik.',
        shortDescription: 'Tipografi super tebal berani dengan palet dinamis yang menghidupkan suasana kelas.',
        visualCharacteristics: [
          'Tipografi tebal bertenaga Archivo Black + Poppins',
          'Tabrakan warna dinamis (kuning, ungu, jingga, hitam)',
          'Komposisi kaya elemen stiker dan kartu sorotan mencolok',
          'Penyampaian poin dengan daya pikat tinggi'
        ],
        suitableFor: [
          'Kampanye Kesadaran Sosial & Lingkungan',
          'Isu Seni Kreatif & Desain Budaya',
          'Debat Kritis & Perbandingan Pandangan',
          'Motivasi Belajar & Pengembangan Diri'
        ],
        characterExample: 'Penuh energi, ekspresif, tidak konvensional, membangkitkan rasa ingin tahu.',
        characteristics: 'Gaya berani, padat, penuh energi visual, warna kontras tinggi, dan memicu antusiasme belajar peserta didik.',
        promptInstruction: 'Gunakan gaya Maximalism dengan tipografi ekstra tebal Archivo Black dipadu Poppins, tabrakan palet warna hidup (ungu, kuning, oranye), kartu sorotan asimetris, dan stiker penanda poin penting yang energetik.',
        accentColor: 'violet',
        tags: ['Penuh Energi', 'Tebal Berani', 'Ekspresif'],
        styleProfile: STYLE_PROFILES_V22D.maximalism,
      },
      {
        id: 'pop_art',
        name: 'Pop Art',
        category: 'KREATIF & EKSPRESIF',
        categoryId: 'kreatif_ekspresif',
        description: 'Estetika komik ceria dengan pola halftone ben-day dots, balon dialog, dan warna primer cerah yang disukai siswa.',
        shortDescription: 'Gaya buku komik ceria dengan pola bintik halftone dan bingkai panel hitam tegas.',
        visualCharacteristics: [
          'Judul komik komikal Bangers berpadu teks isi Poppins yang nyaman',
          'Pola bintik halftone (Ben-Day dots) khas komik klasik',
          'Garis tepi hitam tebal ala buku cerita bergambar',
          'Warna primer ceria: kuning komik, biru cerah, dan merah cabai'
        ],
        suitableFor: [
          'Materi Menyenangkan Tingkat SMP & SMA',
          'Sastra & Cerita Rakyat Nusantara',
          'Pendidikan Karakter & Nilai Moral',
          'Kuis & Tantangan Pembelajaran'
        ],
        characterExample: 'Humoris, ceria, dramatis layaknya panel komik petualangan superhero.',
        characteristics: 'Estetika komik ceria dengan pola halftone ben-day dots, balon dialog, dan warna primer cerah yang disukai siswa.',
        promptInstruction: 'Gunakan gaya Pop Art bernuansa buku komik klasik, judul font komik Bangers, teks isi Poppins, garis batas hitam tegas 2px dengan bayangan solid (hard shadow), pola raster titik Ben-Day dots, dan balon dialog penjelas.',
        accentColor: 'rose',
        tags: ['Komik Pop', 'Halftone Dots', 'Ceria'],
        styleProfile: STYLE_PROFILES_V22D.pop_art,
      },
      {
        id: 'collage_art',
        name: 'Collage Art',
        category: 'KREATIF & EKSPRESIF',
        categoryId: 'kreatif_ekspresif',
        description: 'Kombinasi artistik potongan gambar tematik, tekstur kertas robek, dan tipografi kreatif multi-lapisan.',
        shortDescription: 'Gaya guntingan kertas artistik layaknya papan ide kreatif dan scrapbook seni.',
        visualCharacteristics: [
          'Efek tepi guntingan kertas dan layer bertumpuk',
          'Tipografi tajam Bebas Neue berpadu DM Sans yang fleksibel',
          'Tekstur kertas daur ulang dan aksen selotip washi transparan',
          'Kesan organik, humanis, dan eksploratif'
        ],
        suitableFor: [
          'Seni Rupa & Teori Budaya Nusantara',
          'Antropologi & Sosiologi Masyarakat',
          'Sejarah Gerakan Sosial & Tokoh Perubahan',
          'Pendidikan Lingkungan & Daur Ulang'
        ],
        characterExample: 'Artistik, bercerita, taktil, memancarkan sentuhan kreativitas tangan manusia.',
        characteristics: 'Kombinasi artistik potongan gambar tematik, tekstur kertas robek, dan tipografi kreatif multi-lapisan.',
        promptInstruction: 'Gunakan gaya Collage Art dengan efek guntingan kertas artistik, selotip washi transparan di sudut kartu, tipografi Bebas Neue dan DM Sans, serta penataan modul layaknya papan scrapbook edukatif.',
        accentColor: 'purple',
        tags: ['Guntingan Kertas', 'Scrapbook', 'Artistik'],
        styleProfile: STYLE_PROFILES_V22D.collage_art,
      },
      {
        id: 'graffiti',
        name: 'Graffiti',
        category: 'KREATIF & EKSPRESIF',
        categoryId: 'kreatif_ekspresif',
        description: 'Sentuhan urban street-art dengan aksen spidol marker tebal, percikan cat dinamis, dan karakter yang berjiwa bebas.',
        shortDescription: 'Estetika urban modern dengan spidol marker tebal penegas kata kunci materi.',
        visualCharacteristics: [
          'Judul ekspresif Permanent Marker dengan isi materi Roboto yang sangat jernih',
          'Aksen percikan cat semprot (spray stencil) yang terkontrol',
          'Garis bawah marker melengkung penegas kata kunci',
          'Suasana muda, energik, dan menolak kebosanan'
        ],
        suitableFor: [
          'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
          'Seni Musik Modern & Tari Kontemporer',
          'Bahasa & Komunikasi Massa Remaja',
          'Kewirausahaan Kreatif Generasi Muda'
        ],
        characterExample: 'Urban, energik, berani, berjiwa muda, sangat efektif untuk topik dinamis.',
        characteristics: 'Sentuhan urban street-art dengan aksen spidol marker tebal, percikan cat dinamis, dan karakter yang berjiwa bebas.',
        promptInstruction: 'Gunakan gaya Graffiti street-art dengan font judul Permanent Marker, teks materi Roboto yang bersih dan mudah dibaca, garis bawah marker penegas kata kunci, aksen stensil cat terkontrol, dan kontras urban yang kuat.',
        accentColor: 'amber',
        tags: ['Urban Marker', 'Street Art', 'Jiwa Muda'],
        styleProfile: STYLE_PROFILES_V22D.graffiti,
      },
      {
        id: 'surrealism',
        name: 'Surrealism',
        category: 'KREATIF & EKSPRESIF',
        categoryId: 'kreatif_ekspresif',
        description: 'Estetika artistik eksperimental dengan perpaduan metafora visual tak terduga, puitis, dan membangkitkan imajinasi.',
        shortDescription: 'Puitis dan penuh metafora visual mendalam yang merangsang pemikiran kritis siswa.',
        visualCharacteristics: [
          'Tipografi anggun Cormorant Garamond + Lora yang memikat',
          'Metafora visual puitis yang menyederhanakan gagasan abstrak',
          'Warna safir misterius, emas temaram, dan biru malam',
          'Suasana reflektif, filosofis, dan merangsang pemikiran'
        ],
        suitableFor: [
          'Filsafat, Logika & Etika Berpikir',
          'Karya Sastra Agung & Analisis Puisi',
          'Evolusi Gagasan Sains & Teori Relativitas',
          'Psikologi & Pemahaman Emosi Manusia'
        ],
        characterExample: 'Mendalam, kontemplatif, metaforis, membuka ruang perenungan intelektual.',
        characteristics: 'Estetika artistik eksperimental dengan perpaduan metafora visual tak terduga, puitis, dan membangkitkan imajinasi.',
        promptInstruction: 'Gunakan gaya Surrealism dengan estetika puitis galeri seni, font anggun Cormorant Garamond dan Lora, metafora visual bermakna mendalam, palet safir dan emas temaram, serta tata letak kontemplatif yang luas.',
        accentColor: 'indigo',
        tags: ['Puitis', 'Metafora Mendalam', 'Filosofis'],
        styleProfile: STYLE_PROFILES_V22D.surrealism,
      },
    ],
  },

  // =========================================================================
  // 4. ARTISTIK & TEMATIK
  // =========================================================================
  {
    id: 'artistik_tematik',
    name: 'ARTISTIK & TEMATIK',
    shortName: 'TEMATIK',
    tagline: 'Artistik, Personal, Tematik, Kreatif & Organik Alami',
    description: 'Gaya yang memiliki karakter artistik, personal, kreatif, dan suasana visual yang khas. Menonjolkan kehangatan ekspresi personal dan catatan pembelajaran.',
    characteristicsSummary: [
      'Artistik, personal, tematik, kreatif, dan ekspresif',
      'Sentuhan manual seperti tulisan tangan, sketsa pensil, dan arsiran buku kuno',
      'Palet warna bumi (earth tones), perkamen klasik, dan kertas sketsa',
      'Suasana akrab, hangat, dan membimbing siswa layaknya catatan guru teladan',
      'Sangat cocok untuk sejarah, geografi, biologi lapangan, dan rangkuman belajar'
    ],
    iconName: 'Feather',
    accent: 'amber',
    styles: [
      {
        id: 'victorian',
        name: 'Victorian',
        category: 'ARTISTIK & TEMATIK',
        categoryId: 'artistik_tematik',
        description: 'Estetika klasik historis dengan ornamen bingkai megah, tipografi berwibawa, dan suasana arsip akademik bersejarah.',
        shortDescription: 'Keagungan arsip sejarah dengan ornamen ukiran sudut dan tipografi monumental.',
        visualCharacteristics: [
          'Tipografi monumental Cinzel dipadu Crimson Text yang elok',
          'Ornamen sudut bingkai klasik berukir halus',
          'Warna merah marun, emas tua (antique gold), dan perkamen hangat',
          'Mencerminkan keagungan literatur dan sejarah masa lampau'
        ],
        suitableFor: [
          'Sejarah Nasional Indonesia & Dunia',
          'Peristiwa Perjuangan Kemerdekaan',
          'Arkeologi & Peradaban Klasik Dunia',
          'Sejarah Perkembangan Bahasa & Sastra'
        ],
        characterExample: 'Khidmat, bersejarah, berwibawa, membangkitkan penghormatan pada peradaban.',
        characteristics: 'Estetika klasik historis dengan ornamen bingkai megah, tipografi berwibawa, dan suasana arsip akademik bersejarah.',
        promptInstruction: 'Gunakan gaya Victorian dengan ornamen sudut bingkai ukiran klasik, font monumental Cinzel untuk judul dan Crimson Text untuk teks isi, palet marun kerajaan dan emas antik, serta latar perkamen bersejarah yang berwibawa.',
        accentColor: 'rose',
        tags: ['Arsip Sejarah', 'Klasik Monumental', 'Berwibawa'],
        styleProfile: STYLE_PROFILES_V22D.victorian,
      },
      {
        id: 'bohemian',
        name: 'Bohemian',
        category: 'ARTISTIK & TEMATIK',
        categoryId: 'artistik_tematik',
        description: 'Gaya visual hangat, membumi, artistik, dan bernuansa alam organik dengan palet warna tanah yang menenangkan.',
        shortDescription: 'Estetika organik membumi dengan lengkungan gerbang busur (arch) dan warna alam.',
        visualCharacteristics: [
          'Tipografi elegan DM Serif Display berpadu Nunito yang bersahabat',
          'Palet warna terakota, sage green, oker emas, dan pasir pantai',
          'Bentuk lengkung kurva busur (arch) dan daun tumbuhan kering',
          'Atmosfer rileks, penuh harmoni, dan menghargai alam'
        ],
        suitableFor: [
          'Pertanian, Perkebunan & Kehutanan',
          'Ekologi Lingkungan Hidup & Konservasi',
          'Seni Tradisional & Kerajinan Nusantara',
          'Geografi Bentang Lahan & Keanekaragaman Hayati'
        ],
        characterExample: 'Hangat, teduh, bersahabat dengan alam, menumbuhkan cinta lingkungan.',
        characteristics: 'Gaya visual hangat, membumi, artistik, dan bernuansa alam organik dengan palet warna tanah yang menenangkan.',
        promptInstruction: 'Gunakan gaya Bohemian dengan bentuk kartu melengkung (arch), palet warna tanah alami (terakota, sage green, oker), font DM Serif Display dan Nunito, siluet botani halus, serta suasana hangat yang menenangkan.',
        accentColor: 'orange',
        tags: ['Warna Tanah', 'Organik Alami', 'Teduh'],
        styleProfile: STYLE_PROFILES_V22D.bohemian,
      },
      {
        id: 'handwritten',
        name: 'Handwritten',
        category: 'ARTISTIK & TEMATIK',
        categoryId: 'artistik_tematik',
        description: 'Sentuhan tulisan tangan, garis penunjuk kasual, dan suasana akrab layaknya catatan belajar siswa teladan.',
        shortDescription: 'Suasana buku catatan belajar siswa teladan dengan stabilo dan memo tempel.',
        visualCharacteristics: [
          'Tipografi judul tulisan tangan ekspresif Caveat dipadu Nunito yang jelas',
          'Garis bawah melengkung dan lingkaran penanda kata kunci',
          'Kartu bergaya memo tempel (sticky note) untuk poin krusial',
          'Suasana belajar personal, ramah, dan memotivasi'
        ],
        suitableFor: [
          'Tips Belajar & Cara Menghafal Efektif',
          'Ringkasan Rumus & Catatan Cepat Ujian',
          'Rangkuman Inti Pembelajaran Harian',
          'Panduan Belajar Mandiri di Rumah'
        ],
        characterExample: 'Akrab, bersahabat, komunikatif layaknya catatan guru pembimbing yang peduli.',
        characteristics: 'Sentuhan tulisan tangan, garis penunjuk kasual, dan suasana akrab layaknya catatan belajar siswa teladan.',
        promptInstruction: 'Gunakan gaya Handwritten bernuansa buku catatan belajar, font judul tulisan tangan Caveat dipadu teks materi Nunito yang jelas, kartu memo tempel (sticky note) kuning untuk poin kunci, dan coretan stabilo penegas rumus.',
        accentColor: 'blue',
        tags: ['Buku Catatan', 'Tulisan Tangan', 'Ramah Siswa'],
        styleProfile: STYLE_PROFILES_V22D.handwritten,
      },
      {
        id: 'hand_drawing',
        name: 'Hand Drawing',
        category: 'ARTISTIK & TEMATIK',
        categoryId: 'artistik_tematik',
        description: 'Gaya ilustratif dan organik, seperti gambar dan catatan sketsa yang dibuat secara manual dengan tangan.',
        shortDescription: 'Sketsa gambar tangan organik yang hidup, menyenangkan, dan membebaskan imajinasi.',
        visualCharacteristics: [
          'Tipografi judul berkarakter sketsa Kalam berpadu isi Nunito yang mudah dicerna',
          'Garis kontur sketsa tangan yang luwes dan hidup',
          'Ikon dan diagram berbentuk doodle tangan kontekstual',
          'Kesan alami, menyenangkan, dan membebaskan imajinasi siswa'
        ],
        suitableFor: [
          'Eksperimen Praktikum Sains & Lembar Kerja Siswa',
          'Peta Konsep & Siklus Alam Bertahap',
          'Diagram Alur Langkah Demi Langkah',
          'Rangkuman Belajar Interaktif Sekolah'
        ],
        characterExample: 'Ilustratif, organik, bersahaja, memadukan coretan sketsa dengan materi yang runtut.',
        characteristics: 'Gaya ilustratif dan organik, seperti gambar dan catatan sketsa yang dibuat secara manual dengan tangan.',
        promptInstruction: 'Gunakan gaya Hand Drawing dengan kontur sketsa tangan luwes, font judul Kalam dan teks isi Nunito, panah sketsa organik penunjuk alur, diagram bergaya coretan pensil warna, dan latar kertas gambar bersih bertekstur halus.',
        accentColor: 'cyan',
        tags: ['Sketsa Tangan', 'Ilustratif Organik', 'Doodle Edukatif'],
        styleProfile: STYLE_PROFILES_V22D.hand_drawing,
      },
    ],
  },

  // =========================================================================
  // 5. ILUSTRATIF & EDUKATIF
  // =========================================================================
  {
    id: 'ilustratif_edukatif',
    name: 'ILUSTRATIF & EDUKATIF',
    shortName: 'EDUKATIF',
    tagline: 'Visual, Ramah, Memikat & Sangat Mudah Dipahami Siswa',
    description: 'Gaya yang mengutamakan ilustrasi dan visualisasi interaktif untuk membantu penyampaian materi pembelajaran secara ramah dan menyenangkan.',
    characteristicsSummary: [
      'Visual, ilustratif, edukatif, menarik, dan mudah dipahami',
      'Bentuk visual fisik seperti tanah liat 3D dan piksel retro interaktif',
      'Meningkatkan keterlibatan aktif siswa dalam memahami materi abstrak',
      'Karakter ceria, bersahabat, dan tidak memicu kejenuhan belajar',
      'Sangat cocok untuk sekolah dasar, IPA interaktif, dan koding dasar'
    ],
    iconName: 'BookOpen',
    accent: 'emerald',
    styles: [
      {
        id: 'clay_style',
        name: 'Clay Style',
        category: 'ILUSTRATIF & EDUKATIF',
        categoryId: 'ilustratif_edukatif',
        description: 'Visual 3D lembut bergaya tanah liat plastisin yang ramah, hangat, dan sangat disukai peserta didik.',
        shortDescription: 'Bentuk 3D plastisin membulat empuk yang membuat materi terasa nyata dan ramah.',
        visualCharacteristics: [
          'Bentuk membulat 3D plastisin yang ramah dan bersahabat',
          'Pencahayaan lembut dan bayangan halus bertekstur empuk',
          'Tipografi Fredoka + Nunito yang membulat dan mudah dibaca',
          'Materi terasa seperti model fisik nyata yang menyenangkan'
        ],
        suitableFor: [
          'Materi IPA Sekolah Dasar & Menengah Pertama',
          'Struktur Lapisan Bumi & Gunung Berapi',
          'Siklus Hidup Hewan & Tumbuhan',
          'Pendidikan Kesehatan & Gizi Seimbang'
        ],
        characterExample: 'Empuk, ramah, menyenangkan, mengubah materi rumit menjadi model fisik yang disukai anak.',
        characteristics: 'Visual 3D lembut bergaya tanah liat plastisin yang ramah, hangat, dan sangat disukai peserta didik.',
        promptInstruction: 'Gunakan gaya Clay Style dengan model 3D membulat empuk berbahan plastisin tanah liat warna-warni, pencahayaan studio hangat, font Fredoka untuk judul dan Nunito untuk teks isi, kartu bertepi membulat besar (rounded-3xl), dan suasana belajar yang sangat bersahabat.',
        accentColor: 'orange',
        tags: ['Clay 3D', 'Plastisin Ramah', 'Edukatif'],
        styleProfile: STYLE_PROFILES_V22D.clay_style,
      },
      {
        id: 'pixel_style',
        name: 'Pixel Style',
        category: 'ILUSTRATIF & EDUKATIF',
        categoryId: 'ilustratif_edukatif',
        description: 'Seni piksel retro 8-bit/16-bit yang terstruktur, kreatif, dan membangkitkan suasana game edukasi interaktif.',
        shortDescription: 'Petualangan game arkade 8-bit retro yang memicu antusiasme belajar lewat gamifikasi.',
        visualCharacteristics: [
          'Judul retro arkade Press Start 2P berpadu teks isi VT323 yang jernih',
          'Grid piksel berkarakter game retro klasik',
          'Batas kartu bergaya kotak modular yang rapi',
          'Meningkatkan antusiasme siswa lewat gamifikasi belajar'
        ],
        suitableFor: [
          'Logika Komputasi & Pemrograman Dasar',
          'Matematika Geometri & Sistem Koordinat',
          'Kuis Interaktif & Tantangan Belajar Berjenjang',
          'Sejarah Perkembangan Game & Komputer'
        ],
        characterExample: 'Nostalgik, seru, interaktif layaknya misi petualangan game edukasi.',
        characteristics: 'Seni piksel retro 8-bit/16-bit yang terstruktur, kreatif, dan membangkitkan suasana game edukasi interaktif.',
        promptInstruction: 'Gunakan gaya Pixel Style dengan estetika game arkade retro 8-bit, font judul Press Start 2P dan teks isi VT323, bingkai kartu balok piksel tegas dengan bayangan berundak, ikon sprite game, dan nuansa gamifikasi petualangan materi belajar.',
        accentColor: 'purple',
        tags: ['Piksel 8-Bit', 'Gamifikasi', 'Arkade Retro'],
        styleProfile: STYLE_PROFILES_V22D.pixel_style,
      },
    ],
  },
];

// Flat list of all available styles with typographyProfile and styleProfile populated
export const ALL_INFOGRAPHIC_STYLES: InfographicStyleItem[] = INFOGRAPHIC_STYLE_CATEGORIES.flatMap(
  (c) =>
    c.styles.map((s) => ({
      ...s,
      typographyProfile: s.typographyProfile || getTypographyProfile(s.id || s.name),
      styleProfile: s.styleProfile || getStyleProfile(s.id || s.name),
    }))
);

/**
 * Find style by name or ID (robust fuzzy resolution for all 20 STIVIA 2.2d styles + backward compatibility aliases)
 */
export function findStyleByNameOrId(nameOrId?: string): InfographicStyleItem | undefined {
  if (!nameOrId) return undefined;
  const target = nameOrId.toLowerCase().trim();

  // 1. Exact match by ID or Name
  const exact = ALL_INFOGRAPHIC_STYLES.find(
    (s) => s.id.toLowerCase() === target || s.name.toLowerCase() === target
  );
  if (exact) return exact;

  // 2. STIVIA 2.2d specific matching
  if (target.includes('drawing') || target.includes('hand drawing') || target.includes('sketsa')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'hand_drawing');
  }
  if (target.includes('minimal')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'minimalism');
  }
  if (target.includes('maxi') || target.includes('maksimal')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'maximalism');
  }
  if (target.includes('futur')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'futuristic');
  }
  if (target.includes('vector') || target.includes('vektor')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'vector_art');
  }
  if (target.includes('collage') || target.includes('kolase')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'collage_art');
  }
  if (target.includes('cyber')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'cyberpunk');
  }
  if (target.includes('pop')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'pop_art');
  }
  if (target.includes('glass')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'glassmorphism');
  }
  if (target.includes('clay')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'clay_style');
  }
  if (target.includes('pixel')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'pixel_style');
  }
  if (target.includes('editorial')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'editorial');
  }
  if (target.includes('y2k')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'y2k');
  }
  if (target.includes('swiss')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'swiss_design');
  }
  if (target.includes('surreal') || target.includes('surealis')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'surrealism');
  }
  if (target.includes('bohemian') || target.includes('boho')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'bohemian');
  }
  if (target.includes('victorian') || target.includes('viktorian')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'victorian');
  }
  if (target.includes('graffiti') || target.includes('street')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'graffiti');
  }
  if (target.includes('aurora')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'aurora');
  }
  if (target.includes('handwritten') || target.includes('tangan')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'handwritten');
  }

  // 3. Backward compatibility aliases for previous style names
  if (target.includes('vintage') || target.includes('historical') || target.includes('sejarah')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'victorian');
  }
  if (target.includes('doodle')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'hand_drawing');
  }
  if (target.includes('cartoon')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'clay_style');
  }
  if (target.includes('retro')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'y2k');
  }
  if (target.includes('modern edukatif') || target.includes('modern education')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'vector_art');
  }
  if (target.includes('digital interface')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'futuristic');
  }
  if (target.includes('data visualization')) {
    return ALL_INFOGRAPHIC_STYLES.find((s) => s.id === 'swiss_design');
  }

  // 4. Fallback partial search
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
      findStyleByNameOrId('victorian')!,
      findStyleByNameOrId('editorial')!,
      findStyleByNameOrId('handwritten')!,
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
      findStyleByNameOrId('futuristic')!,
      findStyleByNameOrId('cyberpunk')!,
      findStyleByNameOrId('glassmorphism')!,
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
      findStyleByNameOrId('vector_art')!,
      findStyleByNameOrId('clay_style')!,
      findStyleByNameOrId('bohemian')!,
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
      findStyleByNameOrId('swiss_design')!,
      findStyleByNameOrId('minimalism')!,
      findStyleByNameOrId('pixel_style')!,
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
      findStyleByNameOrId('clay_style')!,
      findStyleByNameOrId('hand_drawing')!,
      findStyleByNameOrId('pop_art')!,
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
      findStyleByNameOrId('collage_art')!,
      findStyleByNameOrId('pop_art')!,
      findStyleByNameOrId('hand_drawing')!,
    ].filter(Boolean);
  }

  // Default Academic recommendations
  return [
    findStyleByNameOrId('vector_art')!,
    findStyleByNameOrId('minimalism')!,
    findStyleByNameOrId('futuristic')!,
  ].filter(Boolean);
}
