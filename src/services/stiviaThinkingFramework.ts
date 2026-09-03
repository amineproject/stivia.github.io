import { findStyleByNameOrId, InfographicStyleItem } from '../data/infographicStylesData';

/**
 * 9 Karakter Materi Pembelajaran yang dapat dikenali STIVIA
 */
export type MaterialCharacterType = 
  | 'Proses'
  | 'Kronologis'
  | 'Perbandingan'
  | 'Konsep'
  | 'Sistem'
  | 'Data'
  | 'Fakta'
  | 'Teknologi'
  | 'Naratif';

/**
 * 7 Strategi Layout Pembelajaran STIVIA
 */
export type InfographicLayoutStrategy =
  | 'Hero Visual'
  | 'Modular Grid'
  | 'Central Concept'
  | 'Timeline'
  | 'Process Flow'
  | 'Comparison'
  | 'Editorial';

/**
 * Input untuk Kerangka Berpikir STIVIA
 */
export interface StiviaThinkingInput {
  title: string;
  topic?: string;
  subject?: string;
  educationLevel?: string;
  grade?: string;
  scope?: string;
  rawContent?: string;
  learningObjectives?: string[];
  keyPoints?: string[];
  visualStyleName: string;
  customStyleDescription?: string;
}

/**
 * Hasil 7 Tahap Kerangka Berpikir STIVIA
 */
export interface StiviaThinkingResult {
  // Tahap 1: Memahami Materi
  stage1_Understanding: {
    title: string;
    subject: string;
    educationLevel: string;
    grade: string;
    learningObjective: string;
    scopeOverview: string;
    contentVolume: 'Ringkas' | 'Sedang' | 'Padat';
  };

  // Tahap 2: Mengidentifikasi Informasi Penting
  stage2_ImportantInfo: {
    mainConcept: string;
    subConcepts: string[];
    keywords: string[];
    essentialInformation: string[];
    informationRelationship: string;
  };

  // Tahap 3: Menentukan Karakter Materi
  stage3_MaterialCharacters: {
    detectedCharacters: MaterialCharacterType[];
    primaryCharacter: MaterialCharacterType;
    rationale: string;
  };

  // Tahap 4: Memahami Pilihan Gaya
  stage4_StyleUnderstanding: {
    selectedStyle: InfographicStyleItem;
    visualTone: string;
    compositionRule: string;
    elementShape: string;
    typographyRule: string;
    backgroundStyle: string;
    ornamentStyle: string;
    illustrationType: string;
    invarianceNotice: string; // Gaya TIDAK BOLEH mengubah materi
  };

  // Tahap 5: Menentukan Visual Pendukung
  stage5_SupportingVisuals: {
    heroVisual: string;
    supportingIllustrations: string[];
    icons: string[];
    relevantObjects: string[];
    supportingOrnaments: string[];
    styleAdaptiveVisualNote: string;
  };

  // Tahap 6: Menentukan Strategi Layout
  stage6_LayoutStrategy: {
    strategy: InfographicLayoutStrategy;
    layoutDescription: string;
    readingFlow: string;
    rationale: string;
  };

  // Tahap 7: Menyusun Prompt Akhir (12 Struktur Resmi)
  stage7_FinalPrompt: string;
}

/**
 * Ekstraktor Kata Kunci & Konsep Cerdas berbasis Naskah Materi
 */
function extractKeywords(text: string, count: number = 6): string[] {
  if (!text) return ['Pembelajaran', 'Konsep', 'Edukasi'];
  
  const stopWords = new Set([
    'dan', 'atau', 'yang', 'di', 'ke', 'dari', 'untuk', 'pada', 'dengan', 'adalah', 'yaitu', 
    'ini', 'itu', 'sebagai', 'dalam', 'oleh', 'karena', 'maka', 'secara', 'dapat', 'akan', 
    'serta', 'harus', 'bisa', 'antara', 'juga', 'saat', 'para', 'sebuah', 'suatu', 'tersebut',
    'the', 'and', 'of', 'to', 'in', 'is', 'for', 'with', 'on', 'as', 'by', 'at'
  ]);

  const words = text
    .replace(/[^\w\s\u00C0-\u024F]/gi, ' ')
    .split(/\s+/)
    .map(w => w.trim().toLowerCase())
    .filter(w => w.length > 3 && !stopWords.has(w) && !/^\d+$/.test(w));

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
  const capitalized = sorted.slice(0, count).map(w => w.charAt(0).toUpperCase() + w.slice(1));
  
  return capitalized.length > 0 ? capitalized : ['Konsep Dasar', 'Struktur Materi', 'Aplikasi'];
}

/**
 * Helper: Deteksi Karakter Materi Pembelajaran
 */
function detectMaterialCharacters(
  title: string,
  content: string,
  subject: string,
  scope: string
): { characters: MaterialCharacterType[]; primary: MaterialCharacterType; rationale: string } {
  const combined = `${title} ${content} ${subject} ${scope}`.toLowerCase();
  const detected: MaterialCharacterType[] = [];

  // 1. Karakter Proses
  if (
    combined.includes('proses') || 
    combined.includes('siklus') || 
    combined.includes('tahap') || 
    combined.includes('langkah') || 
    combined.includes('mekanisme') || 
    combined.includes('fotosintesis') || 
    combined.includes('daur') ||
    combined.includes('respirasi') ||
    combined.includes('cara kerja')
  ) {
    detected.push('Proses');
  }

  // 2. Karakter Kronologis
  if (
    combined.includes('sejarah') || 
    combined.includes('kronologi') || 
    combined.includes('peristiwa') || 
    combined.includes('tahun') || 
    combined.includes('abad') || 
    combined.includes('masa ') || 
    combined.includes('perang') || 
    combined.includes('kemerdekaan') ||
    combined.includes('perkembangan')
  ) {
    detected.push('Kronologis');
  }

  // 3. Karakter Perbandingan
  if (
    combined.includes('perbandingan') || 
    combined.includes('perbedaan') || 
    combined.includes('kelebihan dan kekurangan') || 
    combined.includes('komparasi') || 
    combined.includes('persamaan') || 
    combined.includes('versus') || 
    combined.includes(' vs ')
  ) {
    detected.push('Perbandingan');
  }

  // 4. Karakter Teknologi
  if (
    combined.includes('teknologi') || 
    combined.includes('komputer') || 
    combined.includes('ai') || 
    combined.includes('artificial intelligence') || 
    combined.includes('coding') || 
    combined.includes('algoritma') || 
    combined.includes('siber') || 
    combined.includes('jaringan') || 
    combined.includes('software') || 
    combined.includes('digital') ||
    combined.includes('robot')
  ) {
    detected.push('Teknologi');
  }

  // 5. Karakter Data
  if (
    combined.includes('statistik') || 
    combined.includes('data') || 
    combined.includes('angka') || 
    combined.includes('persentase') || 
    combined.includes('jumlah') || 
    combined.includes('grafik') || 
    combined.includes('populasi')
  ) {
    detected.push('Data');
  }

  // 6. Karakter Sistem
  if (
    combined.includes('sistem') || 
    combined.includes('organ') || 
    combined.includes('anatomi') || 
    combined.includes('ekosistem') || 
    combined.includes('komponen') || 
    combined.includes('struktur') ||
    combined.includes('arsitektur')
  ) {
    detected.push('Sistem');
  }

  // 7. Karakter Naratif
  if (
    combined.includes('cerita') || 
    combined.includes('kisah') || 
    combined.includes('sastra') || 
    combined.includes('dongeng') || 
    combined.includes('biografi') || 
    combined.includes('tokoh')
  ) {
    detected.push('Naratif');
  }

  // 8. Fakta & Konsep (Default/Fundamental)
  detected.push('Konsep');
  detected.push('Fakta');

  // Menentukan karakter primer
  let primary: MaterialCharacterType = 'Konsep';
  let rationale = 'Materi berpusat pada penanaman konsep fundamental dan pemahaman terminologi penting.';

  if (detected.includes('Proses')) {
    primary = 'Proses';
    rationale = 'Materi memiliki alur mekanisme atau tahapan berurutan yang menuntut visualisasi sekuensial.';
  } else if (detected.includes('Kronologis')) {
    primary = 'Kronologis';
    rationale = 'Materi mengandung linimasa waktu dan rentetan peristiwa sejarah yang harus tersusun runtut.';
  } else if (detected.includes('Perbandingan')) {
    primary = 'Perbandingan';
    rationale = 'Materi menyajikan komparasi dua atau lebih entitas dengan parameter perbedaan yang kontras.';
  } else if (detected.includes('Sistem')) {
    primary = 'Sistem';
    rationale = 'Materi menguraikan hubungan timbal balik antar-komponen dalam suatu ekosistem/struktur utuh.';
  } else if (detected.includes('Teknologi')) {
    primary = 'Teknologi';
    rationale = 'Materi membahas konsep teknologi digital, arsitektur komputasi, atau inovasi masa depan.';
  } else if (detected.includes('Data')) {
    primary = 'Data';
    rationale = 'Materi menonjolkan bukti empiris, metrik numerik, atau distribusi statistik terukur.';
  } else if (detected.includes('Naratif')) {
    primary = 'Naratif';
    rationale = 'Materi mengandung kisah bersambung yang mengalir dari pengantar, perkembangan, hingga resolusi.';
  }

  return { characters: Array.from(new Set(detected)), primary, rationale };
}

/**
 * Helper: Menentukan Visual Utama dan Pendukung berdasarkan Isi Materi & Pilihan Gaya
 */
function determineVisualAssets(
  title: string,
  content: string,
  primaryChar: MaterialCharacterType,
  styleItem: InfographicStyleItem
): {
  heroVisual: string;
  supportingIllustrations: string[];
  icons: string[];
  relevantObjects: string[];
  supportingOrnaments: string[];
  styleAdaptiveVisualNote: string;
} {
  const t = `${title} ${content}`.toLowerCase();

  let heroVisual = `Komposisi ilustrasi fokus utama yang memvisualisasikan esensi "${title}" secara representatif dan proporsional.`;
  let supportingIllustrations: string[] = ['Ilustrasi diagram konsep', 'Visualisasi proses materi', 'Simbol aplikasi nyata'];
  let icons: string[] = ['Ikon ide/konsep', 'Ikon mekanisme', 'Ikon penerapan'];
  let relevantObjects: string[] = ['Objek representatif materi'];
  let supportingOrnaments: string[] = ['Panah alur baca', 'Kartu pembatas modul', 'Badge penanda prioritas'];

  // Deteksi Topik Khusus untuk Objek Nyata:
  // Contoh: Ekosistem
  if (t.includes('ekosistem') || t.includes('rantai makanan') || t.includes('lingkungan hidup')) {
    heroVisual = 'Ilustrasi lanskap lingkungan ekosistem terpadu dengan interaksi komponen biotik dan abiotik yang harmonis.';
    supportingIllustrations = [
      'Pohon dan vegetasi alami',
      'Fauna/hewan konsumen primer dan sekunder',
      'Aliran air sungai atau danau jernih',
      'Pancaran sinar matahari sebagai sumber energi',
      'Mikroorganisme pengurai di dalam tanah'
    ];
    icons = ['Ikon Daun/Tumbuhan', 'Ikon Hewan', 'Ikon Sinar Matahari', 'Ikon Air Bersih', 'Ikon Daur Energi'];
    relevantObjects = ['Pohon', 'Hewan', 'Tumbuhan', 'Air', 'Matahari', 'Bebatuan'];
    supportingOrnaments = ['Garis aliran energi biotik', 'Panah siklus nutrisi', 'Badge penanda tingkat trofik'];
  }
  // Contoh: Fotosintesis
  else if (t.includes('fotosintesis') || t.includes('klorofil') || t.includes('daun')) {
    heroVisual = 'Ilustrasi penampang daun mikroskopis yang menangkap sinar matahari dan molekul reaksi fotosintesis.';
    supportingIllustrations = [
      'Struktur kloroplas dan tilakoid tempat reaksi cahaya',
      'Penyerapan molekul H2O (air) dari akar ke daun',
      'Penyerapan gas CO2 (karbondioksida) melalui stomata',
      'Pelepasan gas O2 (oksigen) ke atmosfer',
      'Sintesis glukosa (C6H12O6) sebagai cadangan makanan'
    ];
    icons = ['Ikon Daun Berurat', 'Ikon Foton Cahaya', 'Ikon Molekul Kimia', 'Ikon Tetesan Air', 'Ikon Oksigen Bersih'];
    relevantObjects = ['Daun Hijau', 'Klorofil', 'Matahari', 'Molekul H2O', 'Molekul CO2', 'Glukosa'];
    supportingOrnaments = ['Panah reaksi bolak-balik', 'Formula kimia reaksi fotosintesis', 'Kartu penjelas fase terang & gelap'];
  }
  // Contoh: AI & Informatika
  else if (t.includes('ai') || t.includes('artificial intelligence') || t.includes('informatika') || t.includes('komputer') || t.includes('jaringan')) {
    heroVisual = 'Visualisasi arsitektur komputasi cerdas dengan jalinan jaringan neural digital, simpul data (nodes), dan pemrosesan algoritma.';
    supportingIllustrations = [
      'Lapisan neural network (input, hidden layer, output)',
      'Aliran data biner dan sirkuit komputasi modern',
      'Interaksi manusia dengan antarmuka cerdas (human-in-the-loop)',
      'Server cloud dan pemrosesan paralel grafis (GPU)'
    ];
    icons = ['Ikon Otak Digital', 'Ikon Simpul Jaringan (Nodes)', 'Ikon Algoritma', 'Ikon Basis Data', 'Ikon Keamanan'];
    relevantObjects = ['Chip Mikroprosesor', 'Server Rack', 'Layar Antarmuka Interaktif', 'Graf Sirkuit'];
    supportingOrnaments = ['Garis konektivitas biner', 'Grid matriks teknologi', 'Badge komputasi pintar'];
  }
  // Contoh: Sejarah / Kemerdekaan
  else if (t.includes('sejarah') || t.includes('proklamasi') || t.includes('kemerdekaan') || t.includes('pahlawan')) {
    heroVisual = 'Ilustrasi adegan monumental peristiwa bersejarah dengan simbol persatuan dan dokumen naskah perjuangan.';
    supportingIllustrations = [
      'Naskah autentik dokumen sejarah dan ketikan otentik',
      'Simbol bendera kebangsaan dan lambang kemerdekaan',
      'Peta wilayah tempat peristiwa bersejarah berlangsung',
      'Garis waktu tonggak perjuangan tokoh bangsa'
    ];
    icons = ['Ikon Naskah Kuno', 'Ikon Monumen', 'Ikon Garis Waktu', 'Ikon Pena Bulu/Tinta', 'Ikon Peta'];
    relevantObjects = ['Naskah Proklamasi', 'Mikrofon Sejarah', 'Bendera Pusaka', 'Tugu Peringatan'];
    supportingOrnaments = ['Garis batas arsip kuno', 'Stempel arsip historis', 'Penanda tahun monumental'];
  }
  // Contoh: Tata Surya & Astronomi
  else if (t.includes('tata surya') || t.includes('planet') || t.includes('bumi') || t.includes('astronomi')) {
    heroVisual = 'Ilustrasi orbit heliosentris dengan Matahari sebagai pusat dan planet-planet tersusun rapi menurut jarak edarnya.';
    supportingIllustrations = [
      'Matahari dengan lidah api korona yang menyala',
      'Planet terrestrial (Merkurius, Venus, Bumi, Mars)',
      'Planet raksasa gas (Jupiter, Saturnus dengan cincinnya)',
      'Lintasan garis orbit elips dengan gravitasi kosmik'
    ];
    icons = ['Ikon Planet', 'Ikon Orbit Elips', 'Ikon Teleskop', 'Ikon Satelit Alami', 'Ikon Gravitasi'];
    relevantObjects = ['Matahari', 'Bumi & Bulan', 'Saturnus', 'Sabuk Asteroid', 'Roket Eksplorasi'];
    supportingOrnaments = ['Garis orbit elips putus-putus', 'Bintang-bintang latar belakang', 'Badge parameter astronomi'];
  }

  // Menyesuaikan bentuk visual dengan gaya terpilih (TAHAP 5 STIVIA)
  let styleAdaptiveVisualNote = '';
  const styleNameLower = styleItem.name.toLowerCase();

  if (styleNameLower.includes('vector art') || styleNameLower.includes('vector')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Bentuk seluruh objek (${relevantObjects.join(', ')}) sebagai ilustrasi vektor presisi beresolusi tinggi, dengan kontur tajam, garis halus, dan warna solid/gradasi flat yang bersih.`;
  } else if (styleNameLower.includes('clay')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Bentuk seluruh objek (${relevantObjects.join(', ')}) dengan efek visual plastisin tanah liat 3D yang lembut, tepi melengkung organik membal, pencahayaan studio hangat, dan tekstur clay yang bersahabat.`;
  } else if (styleNameLower.includes('pixel')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Bentuk seluruh objek (${relevantObjects.join(', ')}) dengan seni piksel retro 8-bit/16-bit ber-grid tegas, sudut modular khas game edukatif klasik, dan palet warna arcade yang cerah.`;
  } else if (styleNameLower.includes('futuristic') || styleNameLower.includes('cyberpunk')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Bentuk seluruh objek (${relevantObjects.join(', ')}) dengan estetika digital canggih, aksen cahaya neon elektrik, pola grid sirkuit teknologi, dan rendering holografik modern.`;
  } else if (styleNameLower.includes('minimalism') || styleNameLower.includes('minimalis')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Bentuk seluruh objek (${relevantObjects.join(', ')}) menjadi siluet geometris esensial yang sangat bersih, tanpa bayangan berat atau gradasi rumit, memanfaatkan ruang negatif (whitespace) secara elegan.`;
  } else if (styleNameLower.includes('retro') || styleNameLower.includes('vintage')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Bentuk seluruh objek (${relevantObjects.join(', ')}) dengan gaya ilustrasi arsir tinta ensiklopedia klasik abad pertengahan, tekstur cetak kertas hangat, dan palet warna nostalgia bersahaja.`;
  } else if (styleNameLower.includes('pop art')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Bentuk seluruh objek (${relevantObjects.join(', ')}) dengan garis tepi hitam tebal komik, pola titik halftone klasik, dan blok warna primer kontras tinggi.`;
  } else {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Terapkan karakteristik visual gaya ${styleItem.name} (${styleItem.visualCharacteristics.slice(0, 2).join(', ')}) secara konsisten pada seluruh objek dan ilustrasi materi.`;
  }

  return {
    heroVisual,
    supportingIllustrations,
    icons,
    relevantObjects,
    supportingOrnaments,
    styleAdaptiveVisualNote
  };
}

/**
 * Helper: Menentukan Strategi Layout (TAHAP 6 STIVIA)
 */
function determineLayoutStrategy(
  primaryChar: MaterialCharacterType,
  contentVolume: 'Ringkas' | 'Sedang' | 'Padat',
  styleItem: InfographicStyleItem
): {
  strategy: InfographicLayoutStrategy;
  layoutDescription: string;
  readingFlow: string;
  rationale: string;
} {
  // Aturan Mapping Layout:
  // 1. Materi Proses -> Process Flow
  // 2. Materi Sejarah / Kronologis -> Timeline
  // 3. Materi Perbandingan -> Comparison
  // 4. Konsep Utama Terpadu -> Central Concept
  // 5. Banyak Informasi / Padat -> Modular Grid
  // 6. Gaya Editorial -> Editorial
  // 7. Materi Visual Dominan -> Hero Visual

  if (primaryChar === 'Proses') {
    return {
      strategy: 'Process Flow',
      layoutDescription: 'Tata letak alur proses bertahap dari atas ke bawah, menghubungkan setiap tahapan dengan panah penunjuk visual yang mengalir alami.',
      readingFlow: 'Alur Alami Sekuensial: Input / Tahap 1 → Proses Berjalan → Output / Hasil Akhir.',
      rationale: 'Materi berkarakter Proses menuntut penyajian alur tahapan bertahap agar siswa dapat memahami mekanisme secara runut.'
    };
  }

  if (primaryChar === 'Kronologis') {
    return {
      strategy: 'Timeline',
      layoutDescription: 'Garis waktu vertikal berpenanda tonggak tahun/fase yang tersusun berurutan dengan kartu peristiwa di sisi alur.',
      readingFlow: 'Kronologi Vertikal: Awal Peristiwa (atas) → Perkembangan / Puncak → Dampak / Warisan Sejarah (bawah).',
      rationale: 'Materi mengandung linimasa sejarah yang harus ditata dengan garis waktu agar kronologi peristiwa tidak tertukar.'
    };
  }

  if (primaryChar === 'Perbandingan') {
    return {
      strategy: 'Comparison',
      layoutDescription: 'Tata letak perbandingan terstruktur (kolom sejajar atau kartu berpasangan) dengan parameter pembeda yang jelas.',
      readingFlow: 'Komparasi Komprehensif: Pengantar Karakteristik → Kartu Entitas A vs Entitas B → Matriks Kesimpulan.',
      rationale: 'Materi menyoroti perbedaan dan persamaan antara dua konsep atau lebih sehingga layout komparatif memberikan kejelasan instan.'
    };
  }

  if (styleItem.id === 'editorial') {
    return {
      strategy: 'Editorial',
      layoutDescription: 'Tata letak publikasi sains berwibawa dengan kolom berita teratur, blok kutipan penting (pull quotes), dan aksen akademis.',
      readingFlow: 'Alur Majalah Edukatif: Tajuk Utama → Ulasan Mendalam → Sorotan Fakta Kunci → Refleksi Akhir.',
      rationale: 'Gaya Editorial paling optimal disajikan dengan layout bergaya majalah ilmiah dengan tipografi berbobot tinggi.'
    };
  }

  if (contentVolume === 'Padat' || primaryChar === 'Data' || primaryChar === 'Sistem') {
    return {
      strategy: 'Modular Grid',
      layoutDescription: 'Sistem kartu modular (grid cards) proporsional yang membagi informasi padat ke dalam blok-blok terpisah yang mudah dicerna.',
      readingFlow: 'Alur Modular Grid: Header Pengantar → Blok-Blok Kartu Materi Seimbang → Kartu Rangkuman Inti.',
      rationale: 'Volume informasi yang kaya dan beragam paling efektif ditata dalam kisi modular agar tidak terasa sesak dan mudah dipindai.'
    };
  }

  if (styleItem.id === 'minimalism' || styleItem.id === 'swiss_design') {
    return {
      strategy: 'Central Concept',
      layoutDescription: 'Pusat konsep utama terletak di bagian tengah/fokus atas, dengan cabang-cabang subkonsep tersusun mengelilinginya secara harmonis.',
      readingFlow: 'Alur Konsentris: Konsep Inti di Tengah → Percabangan Komponen → Implementasi Terapan.',
      rationale: 'Memudahkan peserta didik memusatkan perhatian pada ide pokok sebelum mendalami cabang-cabang pembahasannya.'
    };
  }

  // Default: Hero Visual
  return {
    strategy: 'Hero Visual',
    layoutDescription: 'Kartu visual utama (Hero Card) yang dominan dan memukau di sepertiga atas, diikuti kartu-kartu materi penjelas di bawahnya.',
    readingFlow: 'Alur Hero Visual: Visual Utama yang Kuat → Analisis Komponen → Ringkasan Aplikatif.',
    rationale: 'Menarik perhatian visual peserta didik seketika melalui visual utama yang memikat, lalu membawa mereka membaca materi secara terarah.'
  };
}

/**
 * FUNGSI UTAMA: MENJALANKAN KERANGKA BERPIKIR STIVIA
 * Menganalisis materi secara komprehensif melalui 7 tahap sebelum membentuk prompt akhir.
 */
export function runStiviaThinkingFramework(input: StiviaThinkingInput): StiviaThinkingResult {
  const {
    title,
    topic = '',
    subject = 'Umum',
    educationLevel = 'SMA',
    grade = 'Kelas X',
    scope = '',
    rawContent = '',
    learningObjectives = [],
    keyPoints = [],
    visualStyleName,
    customStyleDescription = '',
  } = input;

  // 1. Resolve Style Item
  const resolvedStyle = findStyleByNameOrId(visualStyleName) || {
    id: 'modern_edukatif',
    name: visualStyleName || 'Modern Edukatif',
    category: 'EDUKATIF & TERSTRUKTUR',
    categoryId: 'edukatif_terstruktur',
    description: 'Gaya standar STIVIA yang menggabungkan keterbacaan prima dan sentuhan modern ramah siswa.',
    shortDescription: 'Standar resmi STIVIA: seimbang antara teks, ikon visual, dan warna ramah siswa.',
    visualCharacteristics: ['Sudut kartu melengkung lembut', 'Palet warna navy dan teal', 'Ikon edukatif terstruktur'],
    suitableFor: ['Semua mata pelajaran'],
    characterExample: 'Harmonis, profesional, ramah peserta didik.',
    characteristics: 'Terstruktur, bersih, ramah siswa.',
    promptInstruction: 'Gunakan tata letak edukatif terstruktur dengan palet warna navy dan teal seimbang.',
    accentColor: 'indigo',
    tags: ['Edukasi', 'Standar', 'Modern']
  };

  // TAHAP 1: MEMAHAMI MATERI
  const combinedContent = `${title} ${topic} ${scope} ${rawContent}`.trim();
  const wordCount = combinedContent.split(/\s+/).length;
  const contentVolume: 'Ringkas' | 'Sedang' | 'Padat' = 
    wordCount > 350 ? 'Padat' : wordCount > 120 ? 'Sedang' : 'Ringkas';

  const defaultObjective = learningObjectives.length > 0 
    ? learningObjectives[0] 
    : `Peserta didik mampu memahami konsep esensial, karakteristik, dan penerapan nyata dari ${title || 'materi pembelajaran'}.`;

  const stage1_Understanding = {
    title: title || 'Materi Pembelajaran',
    subject,
    educationLevel,
    grade,
    learningObjective: defaultObjective,
    scopeOverview: scope || 'Pembahasan menyeluruh dari konsep dasar, karakteristik, mekanisme, hingga manfaat dalam kehidupan nyata.',
    contentVolume
  };

  // TAHAP 2: MENGIDENTIFIKASI INFORMASI PENTING
  const keywords = extractKeywords(combinedContent, 6);
  const mainConcept = topic || title || 'Konsep Pokok Materi';
  const subConcepts = keyPoints.length > 0 
    ? keyPoints.slice(0, 4) 
    : [
        `Definisi & Pengertian ${mainConcept}`,
        `Karakteristik & Ciri-Ciri Utama`,
        `Mekanisme & Cara Kerja`,
        `Penerapan dalam Kehidupan Sehari-hari`
      ];

  const essentialInformation = [
    `Fakta kunci dan definisi otentik terkait ${mainConcept}`,
    `Hubungan sebab-akibat antar-bagian materi`,
    `Istilah teknis dan konsep ilmiah yang tidak boleh diubah artinya`,
    `Manfaat praktis bagi pemahaman peserta didik jenjang ${educationLevel} ${grade}`
  ];

  const informationRelationship = 
    'Hubungan hierarkis dari konsep fundamental, berlanjut ke unsur-unsur pembentuk, mekanisme kerja, dan bermuara pada penerapan praktis.';

  const stage2_ImportantInfo = {
    mainConcept,
    subConcepts,
    keywords,
    essentialInformation,
    informationRelationship
  };

  // TAHAP 3: MENENTUKAN KARAKTER MATERI
  const charAnalysis = detectMaterialCharacters(title, rawContent, subject, scope);
  const stage3_MaterialCharacters = {
    detectedCharacters: charAnalysis.characters,
    primaryCharacter: charAnalysis.primary,
    rationale: charAnalysis.rationale
  };

  // TAHAP 4: MEMAHAMI PILIHAN GAYA
  const stage4_StyleUnderstanding = {
    selectedStyle: resolvedStyle,
    visualTone: resolvedStyle.characterExample || 'Harmonis dan profesional untuk pembelajaran.',
    compositionRule: `Rasio kanvas tetap 2:3 vertikal, orientasi portrait, alur baca dari atas ke bawah.`,
    elementShape: resolvedStyle.visualCharacteristics[0] || 'Bentuk kartu modular teratur dengan batas halus.',
    typographyRule: resolvedStyle.visualCharacteristics[1] || 'Tipografi kontras tinggi, sans-serif atau serif terkurasi untuk keterbacaan prima.',
    backgroundStyle: `Latar belakang netral terpadu dengan palet aksen ${resolvedStyle.accentColor || 'harmonis'} tanpa menenggelamkan teks.`,
    ornamentStyle: resolvedStyle.visualCharacteristics[2] || 'Aksen visual pelengkap yang mendukung topik tanpa menimbulkan distraksi.',
    illustrationType: resolvedStyle.name,
    invarianceNotice: 'GAYA VISUAL TIDAK BOLEH MENGUBAH: Judul materi, isi materi, fakta ilmiah, informasi penting, atau cakupan pembelajaran.'
  };

  // TAHAP 5: MENENTUKAN VISUAL PENDUKUNG
  const visualAssets = determineVisualAssets(
    title,
    combinedContent,
    stage3_MaterialCharacters.primaryCharacter,
    resolvedStyle
  );

  const stage5_SupportingVisuals = {
    heroVisual: visualAssets.heroVisual,
    supportingIllustrations: visualAssets.supportingIllustrations,
    icons: visualAssets.icons,
    relevantObjects: visualAssets.relevantObjects,
    supportingOrnaments: visualAssets.supportingOrnaments,
    styleAdaptiveVisualNote: visualAssets.styleAdaptiveVisualNote
  };

  // TAHAP 6: MENENTUKAN STRATEGI LAYOUT
  const layoutAnalysis = determineLayoutStrategy(
    stage3_MaterialCharacters.primaryCharacter,
    contentVolume,
    resolvedStyle
  );

  const stage6_LayoutStrategy = {
    strategy: layoutAnalysis.strategy,
    layoutDescription: layoutAnalysis.layoutDescription,
    readingFlow: layoutAnalysis.readingFlow,
    rationale: layoutAnalysis.rationale
  };

  // TAHAP 7: MENYUSUN PROMPT AKHIR DENGAN 12 STRUKTUR RESMI
  const stage7_FinalPrompt = `=== UNIVERSAL PROMPT INFOGRAFIS STIVIA (ANALISIS 7 TAHAP) ===

1. IDENTITAS MATERI:
- Judul Infografis: ${stage1_Understanding.title}
- Mata Pelajaran: ${stage1_Understanding.subject}
- Jenjang Pendidikan & Kelas: ${stage1_Understanding.educationLevel} (${stage1_Understanding.grade})
- Cakupan Materi: ${stage1_Understanding.scopeOverview}

2. TUJUAN PEMBELAJARAN:
- ${stage1_Understanding.learningObjective}
- Menjadikan materi kompleks mudah dipahami, diingat, dan dianalisis oleh peserta didik melalui visualisasi yang tepat.

3. INFORMASI YANG HARUS DIPERTAHANKAN (KEASLIAN MATERI):
- Materi sumber adalah Single Source of Truth yang TIDAK BOLEH diubah makna, fakta, atau definisinya.
- Informasi penting yang wajib ada:
${stage2_ImportantInfo.essentialInformation.map(item => `  • ${item}`).join('\n')}
- Kata Kunci Wajib: ${stage2_ImportantInfo.keywords.join(', ')}.

4. KONSEP UTAMA:
- Konsep Sentral: ${stage2_ImportantInfo.mainConcept}
- Sub-Konsep Penjelas:
${stage2_ImportantInfo.subConcepts.map((sc, i) => `  ${i + 1}. ${sc}`).join('\n')}
- Hubungan Antar-Informasi: ${stage2_ImportantInfo.informationRelationship}
- Karakter Materi Terdeteksi: ${stage3_MaterialCharacters.detectedCharacters.join(', ')} (Karakter Primer: ${stage3_MaterialCharacters.primaryCharacter} — ${stage3_MaterialCharacters.rationale}).

5. STRATEGI VISUAL:
- Format Kanvas: Poster Infografis Pembelajaran Vertikal (Portrait), Rasio Tetap 2:3.
- Ukuran Referensi Desain: 1200 × 1800 px (atau 1024 × 1536 px).
- Hierarki Visual: Alokasi ruang terbesar diberikan kepada Konsep Utama dan Visual Sentral, diikuti kartu-kartu sub-materi proporsional, dan ditutup dengan rangkuman inti.
- Larangan: Jangan mengubah format menjadi horizontal atau persegi. Pertahankan orientasi vertikal 2:3.

6. VISUAL UTAMA:
- ${stage5_SupportingVisuals.heroVisual}
- Objek Nyata Utama: ${stage5_SupportingVisuals.relevantObjects.join(', ')}.

7. VISUAL PENDUKUNG:
- Ilustrasi Pendukung:
${stage5_SupportingVisuals.supportingIllustrations.map(il => `  • ${il}`).join('\n')}
- Ikon Edukatif Relevan: ${stage5_SupportingVisuals.icons.join(', ')}.
- Ornamen Pendukung: ${stage5_SupportingVisuals.supportingOrnaments.join(', ')}.
- Arahan Visual Adaptif: ${stage5_SupportingVisuals.styleAdaptiveVisualNote}

8. GAYA INFOGRAFIS:
- Nama Gaya: ${resolvedStyle.name}
- Kategori Gaya: ${resolvedStyle.category}
- Deskripsi Gaya: ${resolvedStyle.description}${customStyleDescription ? ` (Kustom: ${customStyleDescription})` : ''}

9. KARAKTER GAYA:
- Karakter Visual: ${stage4_StyleUnderstanding.visualTone}
- Ciri Khas Desain:
${resolvedStyle.visualCharacteristics.map(vc => `  • ${vc}`).join('\n')}
- Arahan Visual Gaya AI: ${resolvedStyle.promptInstruction}
- Batasan Mutlak: ${stage4_StyleUnderstanding.invarianceNotice}

10. LAYOUT YANG DIGUNAKAN:
- Strategi Layout Terpilih: ${stage6_LayoutStrategy.strategy}
- Deskripsi Tata Letak: ${stage6_LayoutStrategy.layoutDescription}
- Alur Baca Vertikal (Atas ke Bawah):
  ${stage6_LayoutStrategy.readingFlow}
- Rasionalitas Layout: ${stage6_LayoutStrategy.rationale}

11. ATURAN KETERBACAAN & AKSESIBILITAS:
- Semua tulisan harus terlihat lengkap, tajam, dan mudah dibaca dengan standar kontras WCAG AA (rasio kontras minimal 4.5:1 untuk teks normal).
- Tidak boleh ada teks terpotong (truncated), teks bertumpuk, atau elemen ilustrasi yang menutupi tulisan.
- Ukuran kartu harus menyesuaikan volume teks (padding dan margin proporsional).
- Tata letak tidak boleh berdesakan; sediakan ruang bernapas (whitespace) yang cukup di antara kartu-kartu materi.

12. STRUKTUR OUTPUT:
SEGERA GENERATE DAN TAMPILKAN SATU POSTER INFOGRAFIS PEMBELAJARAN VERTIKAL (RASIO 2:3) YANG UTUH BERDASARKAN SELURUH ANALISIS DI ATAS.
Jangan hanya memberikan outline teks atau konsep naratif jika kemampuan visual tersedia.
Prioritaskan output visual berupa poster pembelajaran yang siap digunakan oleh guru dan peserta didik.
LANGSUNG HASILKAN DESAIN POSTER INFOGRAFIS VERTIKALNYA.`;

  return {
    stage1_Understanding,
    stage2_ImportantInfo,
    stage3_MaterialCharacters,
    stage4_StyleUnderstanding,
    stage5_SupportingVisuals,
    stage6_LayoutStrategy,
    stage7_FinalPrompt
  };
}
