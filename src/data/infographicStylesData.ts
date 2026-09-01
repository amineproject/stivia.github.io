export interface InfographicStyleItem {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  description: string;
  characteristics: string;
  promptInstruction: string;
  accentColor: string;
  tags: string[];
}

export interface InfographicStyleCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  accent: string;
  styles: InfographicStyleItem[];
}

export const INFOGRAPHIC_STYLE_CATEGORIES: InfographicStyleCategory[] = [
  {
    id: 'edukatif_akademik',
    name: 'EDUKATIF & AKADEMIK',
    description: 'Gaya visual yang cocok untuk materi pembelajaran formal, konsep dasar, teori, dan materi akademik.',
    iconName: 'GraduationCap',
    accent: 'indigo',
    styles: [
      {
        id: 'minimalis_edukatif',
        name: 'Minimalis Edukatif',
        category: 'EDUKATIF & AKADEMIK',
        categoryId: 'edukatif_akademik',
        description: 'Sederhana, bersih, fokus pada informasi, mudah dibaca, dan profesional.',
        characteristics: 'Sederhana, bersih, fokus pada informasi, mudah dibaca, dan profesional.',
        promptInstruction: 'Gunakan gaya Minimalis Edukatif dengan tata letak bersih, sederhana, profesional, fokus pada keterbacaan informasi, elemen visual seperlunya, dan komposisi yang terstruktur.',
        accentColor: 'slate',
        tags: ['Formal', 'Bersih', 'Terstruktur'],
      },
      {
        id: 'modern_education',
        name: 'Modern Education',
        category: 'EDUKATIF & AKADEMIK',
        categoryId: 'edukatif_akademik',
        description: 'Modern, rapi, profesional, dan memiliki komposisi visual edukatif.',
        characteristics: 'Modern, rapi, profesional, dan memiliki komposisi visual edukatif.',
        promptInstruction: 'Gunakan gaya visual Modern Education dengan tata letak modern, rapi, profesional, hierarki tipografi kontemporer, dan komposisi visual edukatif yang seimbang.',
        accentColor: 'indigo',
        tags: ['Modern', 'Rapi', 'Edukatif'],
      },
      {
        id: 'academic_clean',
        name: 'Academic Clean',
        category: 'EDUKATIF & AKADEMIK',
        categoryId: 'edukatif_akademik',
        description: 'Formal, terstruktur, jelas, dan cocok untuk materi akademik.',
        characteristics: 'Formal, terstruktur, jelas, dan cocok untuk materi akademik.',
        promptInstruction: 'Gunakan gaya visual Academic Clean dengan pendekatan formal, terstruktur, jelas, pembagian materi yang sistematis, dan tipografi akademis yang presisi.',
        accentColor: 'blue',
        tags: ['Akademik', 'Formal', 'Presisi'],
      },
      {
        id: 'flat_design',
        name: 'Flat Design',
        category: 'EDUKATIF & AKADEMIK',
        categoryId: 'edukatif_akademik',
        description: 'Ilustrasi sederhana, bentuk datar, ikon informatif, dan warna harmonis.',
        characteristics: 'Ilustrasi sederhana, bentuk datar, ikon informatif, dan warna harmonis.',
        promptInstruction: 'Gunakan gaya visual Flat Design dengan ilustrasi sederhana berbentuk datar tanpa gradien berlebih, ikon-ikon informatif yang jelas, serta palet warna yang harmonis.',
        accentColor: 'teal',
        tags: ['Datar', 'Ikonik', 'Harmonis'],
      },
      {
        id: 'vector_education',
        name: 'Vector Education',
        category: 'EDUKATIF & AKADEMIK',
        categoryId: 'edukatif_akademik',
        description: 'Ilustrasi vektor yang informatif, modern, dan ramah untuk pembelajaran.',
        characteristics: 'Ilustrasi vektor yang informatif, modern, dan ramah untuk pembelajaran.',
        promptInstruction: 'Gunakan gaya visual Vector Education dengan grafis vektor yang informatif, modern, elemen visual ramah pembelajaran, dan tata letak dinamis yang mendukung pemahaman siswa.',
        accentColor: 'emerald',
        tags: ['Vektor', 'Informatif', 'Ramah Siswa'],
      },
    ],
  },
  {
    id: 'visual_kreatif',
    name: 'VISUAL KREATIF',
    description: 'Gaya yang membuat materi pembelajaran terasa lebih ekspresif, kreatif, dan menarik.',
    iconName: 'Palette',
    accent: 'rose',
    styles: [
      {
        id: 'collage_art',
        name: 'Collage Art',
        category: 'VISUAL KREATIF',
        categoryId: 'visual_kreatif',
        description: 'Kombinasi berbagai elemen visual, gambar, bentuk, teks, dan ilustrasi.',
        characteristics: 'Kombinasi berbagai elemen visual, gambar, bentuk, teks, dan ilustrasi.',
        promptInstruction: 'Gunakan gaya visual Collage Art dengan kombinasi berbagai elemen visual artistik, potongan gambar tematik, variasi bentuk, tekstur kolase, dan tipografi kreatif yang menyatu harmonis.',
        accentColor: 'rose',
        tags: ['Artistik', 'Eksploratif', 'Tekstur'],
      },
      {
        id: 'pop_art',
        name: 'Pop Art',
        category: 'VISUAL KREATIF',
        categoryId: 'visual_kreatif',
        description: 'Warna ekspresif, visual energik, elemen kreatif, dan komposisi berani.',
        characteristics: 'Warna ekspresif, visual energik, elemen kreatif, dan komposisi berani.',
        promptInstruction: 'Gunakan gaya visual Pop Art dengan warna-warna ekspresif dan kontras tinggi, visual energik, elemen grafis pop yang berani, pola titik halftone, dan tipografi yang mencolok.',
        accentColor: 'amber',
        tags: ['Energik', 'Kontras', 'Berani'],
      },
      {
        id: 'clay_style',
        name: 'Clay Style',
        category: 'VISUAL KREATIF',
        categoryId: 'visual_kreatif',
        description: 'Ilustrasi lembut dengan objek bergaya tanah liat atau tiga dimensi.',
        characteristics: 'Ilustrasi lembut dengan objek bergaya tanah liat atau tiga dimensi.',
        promptInstruction: 'Gunakan gaya visual Clay Style dengan ilustrasi lembut berefek 3D tanah liat (claymorphic), pencahayaan halus, sudut-sudut membulat organik, dan suasana visual yang hangat serta ramah.',
        accentColor: 'orange',
        tags: ['Clay 3D', 'Lembut', 'Hangat'],
      },
      {
        id: 'handwritten',
        name: 'Handwritten',
        category: 'VISUAL KREATIF',
        categoryId: 'visual_kreatif',
        description: 'Elemen tulisan tangan dan ilustrasi dengan nuansa personal.',
        characteristics: 'Elemen tulisan tangan dan ilustrasi dengan nuansa personal.',
        promptInstruction: 'Gunakan gaya visual Handwritten dengan aksen tipografi tulisan tangan personal, garis sketsa organik, catatan bertema edukatif, dan ilustrasi bergaya jurnal belajar yang interaktif.',
        accentColor: 'pink',
        tags: ['Tulisan Tangan', 'Sketsa', 'Personal'],
      },
      {
        id: 'doodle_education',
        name: 'Doodle Education',
        category: 'VISUAL KREATIF',
        categoryId: 'visual_kreatif',
        description: 'Coretan edukatif, ilustrasi sederhana, ikon kreatif, dan suasana ramah.',
        characteristics: 'Coretan edukatif, ilustrasi sederhana, ikon kreatif, dan suasana ramah.',
        promptInstruction: 'Gunakan gaya visual Doodle Education dengan ilustrasi coretan edukatif tangan yang kreatif, ikon doodle kontekstual, panah dan garis penunjuk kasual, serta atmosfer belajar yang bersahabat.',
        accentColor: 'purple',
        tags: ['Doodle', 'Kasual', 'Bersahabat'],
      },
    ],
  },
  {
    id: 'teknologi_masa_depan',
    name: 'TEKNOLOGI & MASA DEPAN',
    description: 'Gaya yang cocok untuk teknologi, informatika, sains modern, dan inovasi.',
    iconName: 'Cpu',
    accent: 'cyan',
    styles: [
      {
        id: 'futuristic',
        name: 'Futuristic',
        category: 'TEKNOLOGI & MASA DEPAN',
        categoryId: 'teknologi_masa_depan',
        description: 'Nuansa masa depan, teknologi modern, elemen digital, dan visual dinamis.',
        characteristics: 'Nuansa masa depan, teknologi modern, elemen digital, dan visual dinamis.',
        promptInstruction: 'Gunakan gaya visual Futuristic dengan nuansa teknologi masa depan, elemen digital modern, ilustrasi bertema teknologi, komposisi visual dinamis, tipografi kontemporer, serta elemen visual yang mendukung suasana inovatif dan futuristik.',
        accentColor: 'cyan',
        tags: ['Futuristik', 'Digital', 'Inovatif'],
      },
      {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        category: 'TEKNOLOGI & MASA DEPAN',
        categoryId: 'teknologi_masa_depan',
        description: 'Teknologi digital, suasana futuristik, elemen modern, dan visual berani.',
        characteristics: 'Teknologi digital, suasana futuristik, elemen modern, dan visual berani.',
        promptInstruction: 'Gunakan gaya visual Cyberpunk dengan atmosfer digital high-tech, palet kontras neon beraksen cyan dan magenta, grid geometris futuristik, dan elemen grafis siber yang berani.',
        accentColor: 'fuchsia',
        tags: ['Neon Tech', 'Siber', 'High-Tech'],
      },
      {
        id: 'glassmorphism',
        name: 'Glassmorphism',
        category: 'TEKNOLOGI & MASA DEPAN',
        categoryId: 'teknologi_masa_depan',
        description: 'Elemen transparan seperti kaca, efek modern, dan tampilan digital.',
        characteristics: 'Elemen transparan seperti kaca, efek modern, dan tampilan digital.',
        promptInstruction: 'Gunakan gaya visual Glassmorphism dengan kartu transparan bertekstur kaca (frosted glass), bayangan lembut multi-layer, batas tepi tipis bercahaya, dan latar belakang bergradien modern.',
        accentColor: 'sky',
        tags: ['Transparan', 'Frosted Glass', 'Elegan'],
      },
      {
        id: 'aurora',
        name: 'Aurora',
        category: 'TEKNOLOGI & MASA DEPAN',
        categoryId: 'teknologi_masa_depan',
        description: 'Warna dinamis, pencahayaan lembut, dan suasana teknologi modern.',
        characteristics: 'Warna dinamis, pencahayaan lembut, dan suasana teknologi modern.',
        promptInstruction: 'Gunakan gaya visual Aurora dengan perpaduan gradasi warna cahaya kutub yang halus dan dinamis, pencahayaan lembut, kontras elegan, serta atmosfer teknologi modern yang menenangkan.',
        accentColor: 'teal',
        tags: ['Gradasi Halus', 'Glow', 'Modern'],
      },
      {
        id: 'digital_interface',
        name: 'Digital Interface',
        category: 'TEKNOLOGI & MASA DEPAN',
        categoryId: 'teknologi_masa_depan',
        description: 'Visual terinspirasi dari dashboard, antarmuka digital, data, dan teknologi.',
        characteristics: 'Visual terinspirasi dari dashboard, antarmuka digital, data, dan teknologi.',
        promptInstruction: 'Gunakan gaya visual Digital Interface yang terinspirasi dari dashboard modern, panel UI modular, indikator status, kartu data presisi, dan tipografi monospaced untuk kode atau istilah teknis.',
        accentColor: 'blue',
        tags: ['Dashboard UI', 'Panel Modular', 'Presisi'],
      },
    ],
  },
  {
    id: 'data_informasi',
    name: 'DATA & INFORMASI',
    description: 'Gaya yang cocok untuk materi dengan data, angka, perbandingan, proses, atau informasi kompleks.',
    iconName: 'BarChart2',
    accent: 'emerald',
    styles: [
      {
        id: 'data_visualization',
        name: 'Data Visualization',
        category: 'DATA & INFORMASI',
        categoryId: 'data_informasi',
        description: 'Fokus pada penyajian informasi melalui elemen visual dan data.',
        characteristics: 'Fokus pada penyajian informasi melalui elemen visual dan data.',
        promptInstruction: 'Gunakan gaya visual Data Visualization yang berfokus pada penyajian informasi terstruktur, grafik informatif, diagram proporsional, hierarki angka yang jelas, dan palet warna analitis.',
        accentColor: 'emerald',
        tags: ['Grafik', 'Data Angka', 'Analitis'],
      },
      {
        id: 'timeline',
        name: 'Timeline',
        category: 'DATA & INFORMASI',
        categoryId: 'data_informasi',
        description: 'Informasi disusun berdasarkan urutan waktu atau tahapan.',
        characteristics: 'Informasi disusun berdasarkan urutan waktu atau tahapan.',
        promptInstruction: 'Gunakan gaya visual Timeline dengan penekanan alur kronologis vertikal, penanda tonggak sejarah atau tahapan bernomor, garis penghubung yang tegas, dan kartu kejadian yang berurutan rapi.',
        accentColor: 'teal',
        tags: ['Kronologis', 'Tahapan', 'Alur Waktu'],
      },
      {
        id: 'diagrammatic',
        name: 'Diagrammatic',
        category: 'DATA & INFORMASI',
        categoryId: 'data_informasi',
        description: 'Menggunakan diagram, alur, hubungan konsep, dan struktur informasi.',
        characteristics: 'Menggunakan diagram, alur, hubungan konsep, dan struktur informasi.',
        promptInstruction: 'Gunakan gaya visual Diagrammatic dengan bagan alur konseptual, konektor logis antar-elemen, skema hubungan sistem, dan visualisasi relasi yang terdefinisi dengan sangat presisi.',
        accentColor: 'indigo',
        tags: ['Diagram', 'Hubungan Konsep', 'Skema'],
      },
      {
        id: 'swiss_design',
        name: 'Swiss Design',
        category: 'DATA & INFORMASI',
        categoryId: 'data_informasi',
        description: 'Grid yang kuat, tipografi jelas, tata letak terstruktur, dan profesional.',
        characteristics: 'Grid yang kuat, tipografi jelas, tata letak terstruktur, dan profesional.',
        promptInstruction: 'Gunakan gaya visual Swiss Design dengan sistem grid matematis yang ketat, tipografi sans-serif berbobot tinggi, tata letak asimetris yang elegan, ruang negatif yang terukur, dan kejelasan komunikasi mutlak.',
        accentColor: 'slate',
        tags: ['Grid Ketat', 'Tipografi Kuat', 'Minimalis'],
      },
      {
        id: 'editorial',
        name: 'Editorial',
        category: 'DATA & INFORMASI',
        categoryId: 'data_informasi',
        description: 'Tata letak seperti majalah atau publikasi profesional.',
        characteristics: 'Tata letak seperti majalah atau publikasi profesional.',
        promptInstruction: 'Gunakan gaya visual Editorial bergaya majalah edukasi atau jurnal ilmiah modern, tipografi serif elegan untuk judul, kolom teks tertata rapi, dan blok sorotan kutipan yang anggun.',
        accentColor: 'stone',
        tags: ['Majalah', 'Serif Elegan', 'Publikasi'],
      },
    ],
  },
  {
    id: 'karakter_cerita',
    name: 'KARAKTER & CERITA',
    description: 'Gaya yang cocok untuk materi naratif, cerita, karakter, dan pembelajaran anak.',
    iconName: 'Smile',
    accent: 'amber',
    styles: [
      {
        id: 'storytelling',
        name: 'Storytelling',
        category: 'KARAKTER & CERITA',
        categoryId: 'karakter_cerita',
        description: 'Materi disampaikan melalui alur cerita visual.',
        characteristics: 'Materi disampaikan melalui alur cerita visual.',
        promptInstruction: 'Gunakan gaya visual Storytelling dengan narasi visual berurutan dari pengantar hingga kesimpulan, ilustrasi alur cerita tematik, dan elemen transisi yang memikat rasa ingin tahu siswa.',
        accentColor: 'amber',
        tags: ['Naratif', 'Alur Cerita', 'Menarik'],
      },
      {
        id: 'cartoon_education',
        name: 'Cartoon Education',
        category: 'KARAKTER & CERITA',
        categoryId: 'karakter_cerita',
        description: 'Karakter kartun yang ramah dan edukatif.',
        characteristics: 'Karakter kartun yang ramah dan edukatif.',
        promptInstruction: 'Gunakan gaya visual Cartoon Education dengan maskot dan karakter kartun ekspresif yang ramah anak, warna-warna ceria hangat, bentuk elemen melengkung lembut, dan visualisasi yang menyenangkan.',
        accentColor: 'yellow',
        tags: ['Maskot Kartun', 'Ceria', 'Edukasi Seru'],
      },
      {
        id: 'comic_style',
        name: 'Comic Style',
        category: 'KARAKTER & CERITA',
        categoryId: 'karakter_cerita',
        description: 'Panel visual, dialog, ilustrasi, dan nuansa komik.',
        characteristics: 'Panel visual, dialog, ilustrasi, dan nuansa komik.',
        promptInstruction: 'Gunakan gaya visual Comic Style dengan pembagian panel bergaya komik edukasi, balon dialog informatif, garis tepi tebal khas komik, teks onomatopoeia, dan ilustrasi sekuensial yang dinamis.',
        accentColor: 'red',
        tags: ['Panel Komik', 'Balon Dialog', 'Sekuensial'],
      },
      {
        id: 'children_friendly',
        name: 'Children Friendly',
        category: 'KARAKTER & CERITA',
        categoryId: 'karakter_cerita',
        description: 'Visual sederhana, ramah anak, menarik, dan mudah dipahami.',
        characteristics: 'Visual sederhana, ramah anak, menarik, dan mudah dipahami.',
        promptInstruction: 'Gunakan gaya visual Children Friendly dengan elemen bentuk bulat besar yang aman dan ramah, warna pastel cerah berenergi positif, ilustrasi sederhana tanpa detail berlebih, dan keterbacaan ekstra tinggi.',
        accentColor: 'pink',
        tags: ['Ramah Anak', 'Bentuk Bulat', 'Mudah Dipahami'],
      },
      {
        id: 'character_illustration',
        name: 'Character Illustration',
        category: 'KARAKTER & CERITA',
        categoryId: 'karakter_cerita',
        description: 'Tokoh atau karakter menjadi bagian utama dalam penyampaian informasi.',
        characteristics: 'Tokoh atau karakter menjadi bagian utama dalam penyampaian informasi.',
        promptInstruction: 'Gunakan gaya visual Character Illustration di mana tokoh atau figur penjelas menjadi jangkar visual utama, memandu pembaca melewati setiap blok konsep materi dengan interaksi yang hidup.',
        accentColor: 'indigo',
        tags: ['Figur Utama', 'Karakter Pemandu', 'Interaktif'],
      },
    ],
  },
  {
    id: 'klasik_tematik',
    name: 'KLASIK & TEMATIK',
    description: 'Gaya yang cocok untuk sejarah, budaya, sastra, tokoh, dan peristiwa masa lalu.',
    iconName: 'Landmark',
    accent: 'stone',
    styles: [
      {
        id: 'vintage',
        name: 'Vintage',
        category: 'KLASIK & TEMATIK',
        categoryId: 'klasik_tematik',
        description: 'Nuansa klasik dan elemen visual masa lampau.',
        characteristics: 'Nuansa klasik dan elemen visual masa lampau.',
        promptInstruction: 'Gunakan gaya visual Vintage dengan nuansa klasik, tekstur kertas klasik bernuansa hangat, ornamen halus, tipografi bertema retro, dan palet warna sepia serta earthy tones yang autentik.',
        accentColor: 'amber',
        tags: ['Klasik', 'Sepia', 'Masa Lampau'],
      },
      {
        id: 'victorian',
        name: 'Victorian',
        category: 'KLASIK & TEMATIK',
        categoryId: 'klasik_tematik',
        description: 'Dekoratif, klasik, elegan, dan memiliki detail artistik.',
        characteristics: 'Dekoratif, klasik, elegan, dan memiliki detail artistik.',
        promptInstruction: 'Gunakan gaya visual Victorian dengan bingkai dekoratif klasik bernilai seni tinggi, detail artistik elegan, tipografi berornamen mewah, dan tata letak simetris yang megah.',
        accentColor: 'stone',
        tags: ['Dekoratif', 'Elegan', 'Artistik'],
      },
      {
        id: 'bohemian',
        name: 'Bohemian',
        category: 'KLASIK & TEMATIK',
        categoryId: 'klasik_tematik',
        description: 'Artistik, organik, bebas, dan ekspresif.',
        characteristics: 'Artistik, organik, bebas, dan ekspresif.',
        promptInstruction: 'Gunakan gaya visual Bohemian dengan bentuk organik bebas, palet warna bumi alami (terracotta, sage, warm beige), motif dedaunan atau botani, dan komposisi artistik yang ekspresif.',
        accentColor: 'orange',
        tags: ['Organik', 'Bumi Alami', 'Ekspresif'],
      },
      {
        id: 'retro_education',
        name: 'Retro Education',
        category: 'KLASIK & TEMATIK',
        categoryId: 'klasik_tematik',
        description: 'Terinspirasi desain masa lalu dengan pendekatan edukatif.',
        characteristics: 'Terinspirasi desain masa lalu dengan pendekatan edukatif.',
        promptInstruction: 'Gunakan gaya visual Retro Education yang terinspirasi dari poster sains dan ensiklopedia edukasi era pertengahan abad (mid-century), ilustrasi berarsir halus, dan skema warna nostalgia yang teratur.',
        accentColor: 'rose',
        tags: ['Retro Sains', 'Nostalgia', 'Ensiklopedia'],
      },
      {
        id: 'historical',
        name: 'Historical',
        category: 'KLASIK & TEMATIK',
        categoryId: 'klasik_tematik',
        description: 'Visual yang mendukung konteks sejarah, budaya, dan peristiwa masa lalu.',
        characteristics: 'Visual yang mendukung konteks sejarah, budaya, dan peristiwa masa lalu.',
        promptInstruction: 'Gunakan gaya Historical dengan nuansa sejarah yang relevan, ilustrasi kontekstual, elemen visual yang mendukung periode atau peristiwa yang dibahas, serta suasana klasik dan informatif.',
        accentColor: 'stone',
        tags: ['Sejarah', 'Peristiwa', 'Budaya'],
      },
    ],
  },
];

// Flat list of all 30 styles
export const ALL_INFOGRAPHIC_STYLES: InfographicStyleItem[] = INFOGRAPHIC_STYLE_CATEGORIES.flatMap(
  (c) => c.styles
);

/**
 * Find style by name or ID
 */
export function findStyleByNameOrId(nameOrId?: string): InfographicStyleItem | undefined {
  if (!nameOrId) return undefined;
  const target = nameOrId.toLowerCase().trim();
  return ALL_INFOGRAPHIC_STYLES.find(
    (s) =>
      s.id.toLowerCase() === target ||
      s.name.toLowerCase() === target ||
      target.includes(s.name.toLowerCase())
  );
}

/**
 * Generate AI Style Recommendations (max 3) based on existing context
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
      findStyleByNameOrId('Timeline')!,
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
    combinedText.includes('graph') ||
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

  // 3. Mathematics, Statistics, Data Analysis, Finance, Economy
  if (
    combinedText.includes('matematika') ||
    combinedText.includes('statistik') ||
    combinedText.includes('data') ||
    combinedText.includes('ekonomi') ||
    combinedText.includes('grafik') ||
    combinedText.includes('keuangan') ||
    combinedText.includes('akuntansi') ||
    combinedText.includes('peluang') ||
    combinedText.includes('aljabar')
  ) {
    return [
      findStyleByNameOrId('Data Visualization')!,
      findStyleByNameOrId('Diagrammatic')!,
      findStyleByNameOrId('Swiss Design')!,
    ].filter(Boolean);
  }

  // 4. Primary School (SD), Early childhood, Playful / Creative learning
  if (
    combinedText.includes('sd') ||
    combinedText.includes('anak') ||
    combinedText.includes('kelas 1') ||
    combinedText.includes('kelas 2') ||
    combinedText.includes('kelas 3') ||
    combinedText.includes('kelas 4') ||
    combinedText.includes('kelas 5') ||
    combinedText.includes('kelas 6') ||
    combinedText.includes('dongeng') ||
    combinedText.includes('kartun') ||
    combinedText.includes('cerita')
  ) {
    return [
      findStyleByNameOrId('Children Friendly')!,
      findStyleByNameOrId('Cartoon Education')!,
      findStyleByNameOrId('Doodle Education')!,
    ].filter(Boolean);
  }

  // 5. Biology, Natural Sciences, Environment, Geography
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
      findStyleByNameOrId('Vector Education')!,
      findStyleByNameOrId('Diagrammatic')!,
      findStyleByNameOrId('Modern Education')!,
    ].filter(Boolean);
  }

  // 6. Language, Art, Creative Expression
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

  // Default Academic recommendations (SMP / SMA / General)
  return [
    findStyleByNameOrId('Modern Education')!,
    findStyleByNameOrId('Minimalis Edukatif')!,
    findStyleByNameOrId('Vector Education')!,
  ].filter(Boolean);
}
