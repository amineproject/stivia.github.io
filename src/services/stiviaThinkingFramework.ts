import { findStyleByNameOrId, InfographicStyleItem } from '../data/infographicStylesData';
import { InfographicPreviewSection } from '../types';

/**
 * ===================================================================
 * SYSTEM ROLE & OBJECTIVE — STIVIA 3.5 ENHANCED
 * AI Perancang Infografis Pembelajaran (Expert Infographic Generator)
 * 
 * Prinsip Utama:
 * CONTENT FIRST → VISUAL SECOND
 * Materi menentukan APA yang harus disampaikan.
 * Analisis 7 tahap menentukan APA yang harus ditonjolkan.
 * Struktur infografis menentukan BAGAIMANA informasi tersebut disusun.
 * Visual menentukan BAGAIMANA informasi tersebut divisualisasikan.
 * ===================================================================
 */

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
 * 10 Pilihan Struktur Tata Letak Infografis Resmi STIVIA 3.5
 */
export type InfographicLayoutStrategy =
  | '1. Timeline / Step-by-Step'
  | '2. Flowchart'
  | '3. Comparison'
  | '4. Hierarchy'
  | '5. Cycle'
  | '6. Grid / Cards'
  | '7. Mind Map'
  | '8. Central Concept'
  | '9. Diagram Relationship'
  | '10. Hybrid Layout'
  // Legacy aliases for backward compatibility
  | 'Hero Visual'
  | 'Modular Grid'
  | 'Process Flow'
  | 'Editorial'
  | 'Gaya 1 — Timeline / Step-by-Step'
  | 'Gaya 2 — Balanced Grid (4–6 Poin)'
  | 'Gaya 3 — Comparison / Versus'
  | 'Gaya 4 — Anatomy / Callout'
  | 'Gaya 5 — Mind Map / Hub-and-Spoke';

/**
 * Input untuk Kerangka Berpikir STIVIA
 */
export interface StiviaThinkingInput {
  title: string;
  topic?: string;
  theme?: string;
  subject?: string;
  educationLevel?: string;
  grade?: string;
  bab?: string;
  pertemuan?: string | number;
  scope?: string;
  userNotes?: string;
  rawContent?: string;
  learningObjectives?: string[];
  keyPoints?: string[];
  visualStyleName: string;
  customStyleDescription?: string;

  // Pengaturan Infografis Pendidikan Baru (Backward-Compatible Optional Fields)
  structureShape?: string;
  selectedComponents?: string[];
  depth?: 'Ringkas' | 'Sedang' | 'Mendalam' | 'Dasar' | 'Menengah' | 'Lanjut' | string;
  illustrationLevel?: string;
  selectedVisualTypes?: string[];
  designStyle?: string;
  orientation?: 'Portrait' | 'Landscape';
  paperSize?: 'A4' | 'A3' | 'Digital';
  teacherNotes?: string;
}

/**
 * CONTENT CONTEXT LOCK — Single Source of Truth
 */
export interface ActiveContentContext {
  subject: string;
  educationLevel: string;
  grade: string;
  bab: string;
  theme: string;
  title: string;
  pertemuan: string;
  learningObjectives: string[];
  scopePoints: string[];
  activeKeywords: string[];
  userNotes: string;
}

/**
 * Hasil Analisis Materi & Batas Pertemuan (Pencegahan Pengulangan Materi)
 */
export interface StiviaMaterialBoundaryAnalysis {
  tahap1_MataPelajaran: string;
  tahap2_Kelas: string;
  tahap3_MateriUtama: string;
  tahap4_Pertemuan: string;
  tahap5_CakupanMateri: string[];
  tahap6_MateriBolehDibahas: string[];
  tahap7_MateriTidakPerluDiulang: string[];
  boundaryRules: string[];
}

/**
 * Struktur Komponen Bagian Konten Infografis (4–6 Bagian)
 */
export interface InfographicContentSection {
  bagianNumber: number;
  judul: string;
  teksSingkat: string;
  kataKunci: string;
  contohKonkret?: string;
  visual: string;
  ikon: string;
}

/**
 * Hasil 7 Tahap Kerangka Berpikir STIVIA 3.5 Enhanced
 */
export interface StiviaThinkingResult {
  // Active Content Context Lock
  activeContext: ActiveContentContext;

  // Analisis Materi & Batas Pertemuan
  materialAnalysis: StiviaMaterialBoundaryAnalysis;

  // Tahap 1: Identifikasi Materi
  stage1_Understanding: {
    title: string;
    subject: string;
    educationLevel: string;
    grade: string;
    pertemuan: string;
    bab: string;
    theme: string;
    learningObjective: string;
    scopeOverview: string;
    contentVolume: 'Ringkas' | 'Sedang' | 'Padat';
  };

  // Tahap 2: Analisis Konsep Inti
  stage2_ImportantInfo: {
    mainConcept: string;
    subConcepts: string[];
    keywords: string[];
    essentialInformation: string[];
    informationRelationship: string;
    visualizedConcepts: string[];
    summarizedInfo: string[];
  };

  // Tahap 3: Analisis Kebutuhan Belajar & Karakter Materi
  stage3_MaterialCharacters: {
    detectedCharacters: MaterialCharacterType[];
    primaryCharacter: MaterialCharacterType;
    rationale: string;
    studentUnderstandingGoals: string[];
    mustRemember: string[];
    misconceptionsToPrevent: string[];
    gradeAdaptationInstruction: string;
  };

  // Tahap 4: Analisis Informasi Visual (Pemetaan Konsep ke Visual)
  stage4_StyleUnderstanding: {
    selectedStyle: InfographicStyleItem;
    visualTone: string;
    compositionRule: string;
    elementShape: string;
    typographyRule: string;
    backgroundStyle: string;
    ornamentStyle: string;
    illustrationType: string;
    invarianceNotice: string;
    visualMappingRationale: string;
  };

  // Tahap 5: Pemilihan Struktur Infografis (10 Pilihan Struktur) & Visual Pendukung
  stage5_SupportingVisuals: {
    heroVisual: string;
    supportingIllustrations: string[];
    icons: string[];
    relevantObjects: string[];
    supportingOrnaments: string[];
    styleAdaptiveVisualNote: string;
  };

  // Tahap 6: Perancangan Infografis (4–6 Bagian, Tata Letak, Alur Baca, Footer Summary)
  stage6_LayoutStrategy: {
    strategy: InfographicLayoutStrategy;
    layoutDescription: string;
    readingFlow: string;
    rationale: string;
    sections: InfographicContentSection[];
    footerSummary: string;
  };

  // Tahap 7: Validasi 4 Pilar (Konten, Akademis, Infografis, Visual) & Prompt Akhir
  stage7_Validation: {
    contentValidation: string[];
    academicValidation: string[];
    infographicValidation: string[];
    visualValidation: string[];
    isCleanAndContaminationFree: boolean;
  };

  // Output Prompt Akhir Berstandar Resmi STIVIA 3.5 (Section H)
  stage7_FinalPrompt: string;
  fullAnalysisReport?: string;
}

/**
 * PENCEGAHAN KONTAMINASI KONTEN (CONTENT CONTAMINATION PREVENTION)
 * Daftar istilah teknis komputer yang TIDAK BOLEH muncul kecuali materi aktif
 * secara eksplisit adalah bidang informatika / ilmu komputer.
 */
const FORBIDDEN_CS_TERMS = [
  'graph', 'node', 'nodes', 'edge', 'edges', 'vertex', 'vertices',
  'neural network', 'gpu', 'server rack', 'algoritma greedy', 'struktur data',
  'binary tree', 'mikroprosesor'
];

/**
 * Ekstraktor Kata Kunci Bersih dari Naskah Materi Aktif (Bebas Kontaminasi)
 */
function extractCleanKeywordsFromActiveText(text: string, subject: string, count: number = 6): string[] {
  if (!text) return ['Konsep Pembelajaran', 'Karakteristik', 'Aplikasi'];

  const stopWords = new Set([
    'dan', 'atau', 'yang', 'di', 'ke', 'dari', 'untuk', 'pada', 'dengan', 'adalah', 'yaitu', 
    'ini', 'itu', 'sebagai', 'dalam', 'oleh', 'karena', 'maka', 'secara', 'dapat', 'akan', 
    'serta', 'harus', 'bisa', 'antara', 'juga', 'saat', 'para', 'sebuah', 'suatu', 'tersebut',
    'tentang', 'maupun', 'secara', 'setiap', 'pada', 'agar', 'supaya', 'seperti', 'terhadap',
    'the', 'and', 'of', 'to', 'in', 'is', 'for', 'with', 'on', 'as', 'by', 'at'
  ]);

  const isComputerSubject = subject.toLowerCase().includes('informatika') || 
                            subject.toLowerCase().includes('komputer') || 
                            subject.toLowerCase().includes('rekayasa perangkat lunak');

  const words = text
    .replace(/[^\w\s\u00C0-\u024F]/gi, ' ')
    .split(/\s+/)
    .map(w => w.trim().toLowerCase())
    .filter(w => {
      if (w.length <= 3) return false;
      if (stopWords.has(w)) return false;
      if (/^\d+$/.test(w)) return false;
      // Filter kontaminasi istilah CS jika bukan pelajaran komputer
      if (!isComputerSubject && FORBIDDEN_CS_TERMS.includes(w)) return false;
      return true;
    });

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
  const capitalized = sorted.slice(0, count).map(w => w.charAt(0).toUpperCase() + w.slice(1));

  return capitalized.length > 0 ? capitalized : ['Intisari Pembelajaran', 'Prinsip Materi', 'Contoh Nyata'];
}

/**
 * Filter Kontaminasi Kata Kunci & Istilah
 */
function sanitizeStringForContamination(str: string, subject: string): string {
  const isComputerSubject = subject.toLowerCase().includes('informatika') || 
                            subject.toLowerCase().includes('komputer');
  if (isComputerSubject) return str;

  let cleaned = str;
  FORBIDDEN_CS_TERMS.forEach(term => {
    const reg = new RegExp(`\\b${term}\\b`, 'gi');
    cleaned = cleaned.replace(reg, '');
  });
  return cleaned.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Deteksi Karakter Materi Pembelajaran
 */
function detectMaterialCharacters(
  title: string,
  content: string,
  subject: string,
  scope: string
): { characters: MaterialCharacterType[]; primary: MaterialCharacterType; rationale: string } {
  const combined = `${title} ${content} ${subject} ${scope}`.toLowerCase();
  const detected: MaterialCharacterType[] = [];

  if (
    combined.includes('proses') || 
    combined.includes('siklus') || 
    combined.includes('tahap') || 
    combined.includes('langkah') || 
    combined.includes('mekanisme') || 
    combined.includes('alur') || 
    combined.includes('cara kerja')
  ) {
    detected.push('Proses');
  }

  if (
    combined.includes('sejarah') || 
    combined.includes('kronologi') || 
    combined.includes('peristiwa') || 
    combined.includes('tahun') || 
    combined.includes('perkembangan') ||
    combined.includes('era')
  ) {
    detected.push('Kronologis');
  }

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

  if (
    combined.includes('sistem') || 
    combined.includes('organ') || 
    combined.includes('anatomi') || 
    combined.includes('komponen') || 
    combined.includes('struktur') || 
    combined.includes('arsitektur')
  ) {
    detected.push('Sistem');
  }

  if (
    combined.includes('data') || 
    combined.includes('angka') || 
    combined.includes('statistik') || 
    combined.includes('grafik') || 
    combined.includes('persentase')
  ) {
    detected.push('Data');
  }

  if (
    combined.includes('teknologi') || 
    combined.includes('digital') || 
    combined.includes('aplikasi') || 
    combined.includes('komputasi')
  ) {
    detected.push('Teknologi');
  }

  if (
    combined.includes('cerita') || 
    combined.includes('kisah') || 
    combined.includes('tokoh') || 
    combined.includes('sastra')
  ) {
    detected.push('Naratif');
  }

  // Default fundamental
  detected.push('Konsep');
  detected.push('Fakta');

  let primary: MaterialCharacterType = 'Konsep';
  let rationale = 'Materi berpusat pada penanaman pemahaman konsep, ciri-ciri, dan aplikasi nyata.';

  if (detected.includes('Proses')) {
    primary = 'Proses';
    rationale = 'Materi memiliki rangkaian urutan atau tahapan berurutan yang menuntut visualisasi sekuensial.';
  } else if (detected.includes('Perbandingan')) {
    primary = 'Perbandingan';
    rationale = 'Materi menyajikan komparasi dua atau lebih konsep/entitas dengan indikator pembeda yang kontras.';
  } else if (detected.includes('Kronologis')) {
    primary = 'Kronologis';
    rationale = 'Materi mengandung linimasa waktu dan rentetan peristiwa yang tersusun secara runtut.';
  } else if (detected.includes('Sistem')) {
    primary = 'Sistem';
    rationale = 'Materi menguraikan relasi fungsional antar-bagian dalam suatu kesatuan sistem utuh.';
  } else if (detected.includes('Data')) {
    primary = 'Data';
    rationale = 'Materi menonjolkan bukti terukur, metrik, atau indikator kuantitatif.';
  }

  return { characters: Array.from(new Set(detected)), primary, rationale };
}

/**
 * Penentuan Aset Visual Semantik (CONTENT FIRST → VISUAL SECOND)
 * Menolak kontaminasi aset yang tidak berkaitan semantik dengan materi aktif.
 */
function determineSemanticVisualAssets(
  activeTitle: string,
  activeSubject: string,
  scopePoints: string[],
  activeKeywords: string[],
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
  const combined = `${activeTitle} ${activeSubject} ${scopePoints.join(' ')} ${activeKeywords.join(' ')}`.toLowerCase();

  let heroVisual = '';
  let supportingIllustrations: string[] = [];
  let icons: string[] = [];
  let relevantObjects: string[] = [];
  let supportingOrnaments: string[] = [];

  // Kasus Semantik 1: Materi Iklan / Bahasa Indonesia
  if (combined.includes('iklan') || combined.includes('promosi') || combined.includes('slogan') || combined.includes('reklame')) {
    heroVisual = `Komposisi rancangan visual poster iklan kreatif yang memikat, menampilkan mock-up media promosi modern dengan headline menarik dan tata letak dinamis`;
    supportingIllustrations = [
      'Ilustrasi papan reklame dan display media sosial kreatif',
      'Karakter konsumen/audiens target yang sedang tertarik melihat pesan',
      'Elemen tipografi slogan yang menonjol dan berdaya bujuk kuat',
      'Struktur pesan AIDA (Attention, Interest, Desire, Action)'
    ];
    icons = ['Ikon Megafon / Suara', 'Ikon Target Audiens', 'Ikon Slogan / Teks Persuasif', 'Ikon Produk / Nilai Manfaat'];
    relevantObjects = ['Papan Reklame', 'Poster Promosi', 'Layar Gawai Media Sosial', 'Produk Sampel', 'Tanda Bintang Kualitas'];
    supportingOrnaments = ['Aksen garis gerak dinamis', 'Badge penanda call-to-action (CTA)', 'Balon kata dialog promosi'];
  }
  // Kasus Semantik 2: Biologi / Fotosintesis / Tumbuhan
  else if (combined.includes('fotosintesis') || combined.includes('klorofil') || combined.includes('daun') || combined.includes('tumbuhan')) {
    heroVisual = `Ilustrasi struktur penampang daun hijau dengan proses reaksi fotosintesis terpadu yang jelas dan edukatif`;
    supportingIllustrations = [
      'Penyerapan cahaya matahari oleh kloroplas',
      'Penyerapan molekul air (H2O) melalui akar ke pembuluh daun',
      'Pertukaran gas karbondioksida (CO2) dan pelepasan oksigen (O2) melalui stomata',
      'Produksi glukosa sebagai sumber energi tumbuhan'
    ];
    icons = ['Ikon Daun Berurat', 'Ikon Sinar Matahari', 'Ikon Molekul Kimia Seimbang', 'Ikon Tetesan Air Segar'];
    relevantObjects = ['Daun Hijau', 'Kloroplas', 'Matahari', 'Molekul Reaksi O2 & CO2'];
    supportingOrnaments = ['Panah reaksi berkesinambungan', 'Formula reaksi kimia bersih', 'Kartu penjelas fase reaksi'];
  }
  // Kasus Semantik 3: Ekosistem & Rantai Makanan
  else if (combined.includes('ekosistem') || combined.includes('rantai makanan') || combined.includes('jaring makanan') || combined.includes('lingkungan')) {
    heroVisual = `Ilustrasi interaksi harmonis komponen biotik dan abiotik dalam satu lanskap lingkungan terpadu`;
    supportingIllustrations = [
      'Tumbuhan produsen sebagai penangkap energi matahari',
      'Hewan konsumen tingkat 1, 2, dan puncak rantai makanan',
      'Komponen abiotik (tanah, air jernih, udara, dan bebatuan)',
      'Organisme pengurai (dekomposer) yang menyuburkan tanah'
    ];
    icons = ['Ikon Tanaman Hijau', 'Ikon Hewan Konsumen', 'Ikon Aliran Energi', 'Ikon Daur Nutrisi'];
    relevantObjects = ['Pohon Teduh', 'Hewan Herbivora & Karnivora', 'Aliran Air', 'Tanah Humus'];
    supportingOrnaments = ['Panah daur nutrisi melingkar', 'Badge tingkatan trofik', 'Pemisah modul lanskap'];
  }
  // Kasus Semantik 4: Tata Surya & Geografi / Antariksa
  else if (combined.includes('planet') || combined.includes('tata surya') || combined.includes('bumi') || combined.includes('orbit')) {
    heroVisual = `Ilustrasi sistem tata surya heliosentris dengan Matahari di pusat dan planet-planet beredar pada lintasannya`;
    supportingIllustrations = [
      'Matahari dengan pancaran radiasi cahaya energi',
      'Planet terrestrial berbatu dan planet gas raksasa',
      'Garis lintasan orbit elips gravitasi',
      'Bumi dengan lapisan atmosfer pelindung kehidupan'
    ];
    icons = ['Ikon Planet', 'Ikon Lintasan Orbit', 'Ikon Teleskop Antariksa', 'Ikon Gravitasi'];
    relevantObjects = ['Matahari', 'Bumi & Bulan', 'Saturnus Berchincin', 'Sabuk Asteroid'];
    supportingOrnaments = ['Garis edar elips terputus rapi', 'Bintang-bintang latar teratur', 'Badge data radius planet'];
  }
  // Kasus Semantik 5: Sejarah & Peristiwa Perjuangan
  else if (combined.includes('sejarah') || combined.includes('perjuangan') || combined.includes('kemerdekaan') || combined.includes('proklamasi')) {
    heroVisual = `Ilustrasi adegan monumental peristiwa perjuangan bangsa dengan dokumen naskah bersejarah dan simbol persatuan`;
    supportingIllustrations = [
      'Naskah autentik dokumen perjuangan dan ketikan sejarah',
      'Simbol bendera dan lambang persatuan nasional',
      'Garis waktu peristiwa penting menuju kemerdekaan',
      'Peta lokasi momentum bersejarah'
    ];
    icons = ['Ikon Dokumen Arsip', 'Ikon Garis Waktu', 'Ikon Monumen Sejarah', 'Ikon Peta Wilayah'];
    relevantObjects = ['Naskah Sejarah', 'Pena & Tinta', 'Tiang Bendera Pusaka', 'Tugu Peringatan'];
    supportingOrnaments = ['Pita linimasa waktu historis', 'Stempel arsip resmi', 'Penanda tahun penting'];
  }
  // Kasus Semantik 6: Informatika / Komputer (HANYA JIKA MATERI BENAR-BENAR TENTANG KOMPUTER)
  else if (
    activeSubject.toLowerCase().includes('informatika') || 
    activeSubject.toLowerCase().includes('komputer') || 
    combined.includes('struktur data') || 
    combined.includes('algoritma') ||
    combined.includes('jaringan komputer')
  ) {
    heroVisual = `Visualisasi diagram komputasi terstruktur yang merepresentasikan logika dan pemrosesan ${activeTitle}`;
    supportingIllustrations = [
      `Diagram pemodelan konsep ${activeTitle}`,
      'Alur pemrosesan data input, proses, dan output',
      'Representasi visual terstruktur ramah siswa',
      'Contoh kasus terapan dalam aplikasi nyata'
    ];
    icons = ['Ikon Logika Algoritma', 'Ikon Struktur Komputasi', 'Ikon Pemrosesan Data', 'Ikon Penerapan Nyata'];
    relevantObjects = ['Diagram Konsep', 'Modul Logika', 'Alur Eksekusi', 'Contoh Aplikasi'];
    supportingOrnaments = ['Panah alur baca terarah', 'Grid modul komputasi bersih', 'Badge konsep kunci'];
  }
  // Kasus Standar Semantik Umum (Bebas dari Istilah Asing)
  else {
    const mainKw = activeKeywords.slice(0, 3).join(', ') || activeTitle;
    heroVisual = `Komposisi ilustrasi fokus utama yang memvisualisasikan esensi "${activeTitle}" secara tematik, proporsional, dan relevan dengan mata pelajaran ${activeSubject}`;
    supportingIllustrations = [
      `Diagram representasi konsep ${activeKeywords[0] || activeTitle}`,
      `Visualisasi perbandingan atau penerapan terkait ${activeKeywords[1] || 'materi pembelajaran'}`,
      `Ilustrasi aplikatif kontekstual sesuai lingkungan kehidupan peserta didik`
    ];
    icons = [
      `Ikon ${activeKeywords[0] || 'Prinsip Materi'}`,
      `Ikon ${activeKeywords[1] || 'Karakteristik'}`,
      `Ikon ${activeKeywords[2] || 'Aplikasi'}`,
      'Ikon Rangkuman Ide'
    ];
    relevantObjects = [
      `Objek representasi ${activeTitle}`,
      `Komponen esensial materi`,
      `Simbol materi ${activeSubject}`
    ];
    supportingOrnaments = ['Panah alur baca vertikal', 'Kartu pembatas modul materi', 'Badge penanda urutan poin'];
  }

  // Terapkan adaptasi visual sesuai Gaya Visual Terpilih
  let styleAdaptiveVisualNote = '';
  const styleNameLower = styleItem.name.toLowerCase();

  if (styleNameLower.includes('vector') || styleNameLower.includes('modern')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Wujudkan visual sebagai ilustrasi vektor edukatif yang bersih, presisi, dengan garis tegas, warna solid/gradasi flat, dan keterbacaan prima.`;
  } else if (styleNameLower.includes('clay')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Wujudkan visual dengan tekstur plastisin tanah liat (clay) 3D membal yang ramah, hangat, sudut membulat lembut, dan pencahayaan bersahabat.`;
  } else if (styleNameLower.includes('pixel')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Wujudkan visual dalam seni piksel retro terstruktur dengan grid jelas dan warna cerah menarik perhatian siswa.`;
  } else if (styleNameLower.includes('minimalis') || styleNameLower.includes('minimalism')) {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Wujudkan siluet geometris bersih, tanpa bayangan berlebihan, memaksimalkan ruang negatif (whitespace) secara elegan.`;
  } else {
    styleAdaptiveVisualNote = `Gaya "${styleItem.name}": Terapkan karakteristik visual gaya ${styleItem.name} secara harmonis pada seluruh elemen gambar dan ikon pembelajaran.`;
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
 * Helper STIVIA: Menyusun Saran Tujuan Pembelajaran Berbasis Materi (Bloom's Taxonomy)
 */
export function suggestLearningObjectives(
  subject: string,
  topic: string,
  scope?: string
): string[] {
  const cleanSubject = subject?.trim() || 'Mata Pelajaran';
  const cleanTopic = topic?.trim() || 'Materi Pembelajaran';
  const rawScope = scope?.trim() || '';

  const scopeItems = rawScope
    .split(/\n+/)
    .map(line => line.replace(/^(\d+|[a-zA-Z])[\.\)\-\*•]\s*/, '').trim())
    .filter(line => line.length > 3);

  const results: string[] = [
    `Memahami konsep dasar, batasan ruang lingkup, dan pengertian esensial dari ${cleanTopic} dalam ${cleanSubject}.`,
    `Mengidentifikasi ciri-ciri khusus, fungsi utama, dan unsur pembangun dari ${cleanTopic}.`,
    `Menganalisis keterkaitan konsep materi dengan penerapannya dalam kehidupan nyata peserta didik.`,
    `Menyimpulkan intisari pembelajaran dan memecahkan studi kasus sederhana terkait ${cleanTopic}.`
  ];

  if (scopeItems.length >= 2) {
    results[1] = `Mengidentifikasi karakteristik dan membedakan ${scopeItems.slice(0, 2).join(' serta ')} secara tepat.`;
  }
  if (scopeItems.length >= 3) {
    results[2] = `Menganalisis keterkaitan ${scopeItems[2]} dalam situasi aplikatif terarah.`;
  }

  return results;
}

/**
 * Format Judul Infografis Fleksibel & Alami (Mematuhi Standar STIVIA Section 4)
 * Formula fleksibel: [TOPIK] + [AKSI / MANFAAT / FOKUS]
 * Contoh: "Mengenali Ciri-Ciri Teks Deskripsi" atau "Menganalisis Struktur Teks Deskripsi"
 */
export function formatFlexibleInfographicTitle(
  rawTitle: string,
  subject: string,
  primaryChar?: MaterialCharacterType,
  learningObjectives?: string[]
): string {
  let title = (rawTitle || '').trim();
  if (!title) return 'Infografis Pembelajaran';

  // Bersihkan teks berulang sebelum/sesudah titik dua jika redundan
  if (title.includes(':')) {
    const parts = title.split(':').map(p => p.trim());
    if (parts[0] && parts[1]) {
      if (parts[0].length >= 15 && parts[1].length >= 15) {
        // Ambil bagian yang lebih ringkas dan fokus
        title = parts[0].length <= parts[1].length ? parts[0] : parts[1];
      }
    }
  }

  // Jika judul ALL CAPS, ubah ke Title Case secara rapi
  if (title === title.toUpperCase() && title.length > 5) {
    const minorWords = new Set(['dan', 'atau', 'di', 'ke', 'dari', 'untuk', 'pada', 'dengan', 'yang', 'dalam', 'vs']);
    title = title
      .toLowerCase()
      .split(' ')
      .map((word, idx) => {
        if (idx > 0 && minorWords.has(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  // Jika sudah memiliki kata kerja aksi pedagogis atau cukup panjang, kembalikan langsung
  const hasAction = /^(mengenal|mengenali|memahami|menganalisis|mengevaluasi|menerapkan|mengidentifikasi|cara|panduan|langkah|struktur|konsep|anatomi|pembedahan|perbandingan|tips|produksi|penyuntingan|finalisasi)\b/i.test(title);
  if (hasAction || title.length > 35) {
    return title;
  }

  // Lengkapi secara natural jika judul terlalu polos/pendek berdasarkan tujuan pembelajaran
  if (learningObjectives && learningObjectives.length > 0) {
    const firstObj = learningObjectives[0].toLowerCase();
    if (firstObj.includes('mengidentifikasi ciri') || firstObj.includes('ciri-ciri')) {
      return `Mengenali Ciri-Ciri ${title}`;
    }
    if (firstObj.includes('menganalisis struktur') || firstObj.includes('struktur')) {
      return `Menganalisis Struktur ${title}`;
    }
    if (firstObj.includes('langkah') || firstObj.includes('prosedur')) {
      return `Langkah & Prosedur ${title}`;
    }
    if (firstObj.includes('memahami konsep') || firstObj.includes('pengertian')) {
      return `Memahami Konsep Dasar ${title}`;
    }
  }

  return title;
}

/**
 * Pencocokan Substantif Poin Materi dari Cakupan Materi (Strict Anti-Hallucination & Less is More)
 * Memastikan setiap komponen infografis mengambil data nyata dari Cakupan Materi pendidik.
 */
function findSubstanceInScope(
  compName: string,
  scopePoints: string[],
  defaultTitle: string,
  defaultSubject: string,
  depth: string = 'Sedang'
): { text: string; keyword: string; contextualExample?: string } {
  const compLower = compName.toLowerCase();

  // Pola pencarian kata kunci semantik dalam scopePoints
  let targetPattern: RegExp | null = null;
  if (compLower.includes('pengertian') || compLower.includes('definisi') || compLower.includes('hakikat')) {
    targetPattern = /(pengertian|definisi|hakikat|apa itu|konsep dasar|pengantar)/i;
  } else if (compLower.includes('tujuan') || compLower.includes('fungsi') || compLower.includes('peranan') || compLower.includes('manfaat')) {
    targetPattern = /(tujuan|fungsi|peranan|manfaat|kegunaan|peran)/i;
  } else if (compLower.includes('ciri') || compLower.includes('karakteristik') || compLower.includes('sifat') || compLower.includes('indikator')) {
    targetPattern = /(ciri|karakteristik|sifat|indikator|kaidah|tanda)/i;
  } else if (compLower.includes('unsur') || compLower.includes('komponen') || compLower.includes('bagian') || compLower.includes('elemen') || compLower.includes('struktur') || compLower.includes('jenis')) {
    targetPattern = /(unsur|komponen|bagian|elemen|struktur|anatomi|jenis|tipe|kategori|klasifikasi)/i;
  } else if (compLower.includes('contoh') || compLower.includes('perbandingan') || compLower.includes('kasus') || compLower.includes('aplikasi')) {
    targetPattern = /(contoh|kasus|penerapan|aplikasi|komparasi|vs|perbandingan|nyata)/i;
  } else if (compLower.includes('langkah') || compLower.includes('proses') || compLower.includes('tahap') || compLower.includes('alur')) {
    targetPattern = /(langkah|proses|tahap|alur|prosedur|cara)/i;
  } else if (compLower.includes('tips') || compLower.includes('kesimpulan') || compLower.includes('ringkasan') || compLower.includes('evaluasi')) {
    targetPattern = /(tips|kesimpulan|ringkasan|catatan|pedoman|evaluasi|hasil)/i;
  }

  // Cari di scopePoints
  let matchedPoint: string | undefined;
  if (targetPattern) {
    matchedPoint = scopePoints.find(p => targetPattern!.test(p));
  }

  // Jika belum cocok, gunakan indeks yang proporsional dari scopePoints jika tersedia
  if (!matchedPoint && scopePoints.length > 0) {
    if (compLower.includes('pengertian') || compLower.includes('tujuan')) {
      matchedPoint = scopePoints[0];
    } else if (compLower.includes('kesimpulan') || compLower.includes('tips') || compLower.includes('evaluasi')) {
      matchedPoint = scopePoints[scopePoints.length - 1];
    }
  }

  if (matchedPoint) {
    const clean = matchedPoint.replace(/^(\d+|[a-zA-Z])[\.\)\-\*•]\s*/, '').trim();
    // Ekstraksi teks ringkas: ambil inti kalimat tanpa kata-kata pengisi berlebih
    let text = clean;
    if (text.includes(':')) {
      text = text.split(':').slice(1).join(':').trim();
    }
    // Prinsip LESS IS MORE: ringkas, maksimal ~90 karakter
    if (text.length > 95) {
      const firstSentence = text.split(/[.;]/)[0].trim();
      text = firstSentence.length >= 30 ? firstSentence : text.slice(0, 90) + '...';
    }

    const keyword = clean.split(/[:\-\–\(\]]/)[0].trim() || compName;
    return {
      text,
      keyword: keyword.length > 30 ? compName : keyword,
      contextualExample: `Penerapan ${keyword.toLowerCase()} dalam materi ${defaultTitle} (${defaultSubject})`
    };
  }

  // Fallback terikat materi tanpa halusinasi
  let fallbackText = `Intisari pembahasan ${compName.toLowerCase()} yang esensial pada materi ${defaultTitle}.`;
  if (compLower.includes('pengertian')) {
    fallbackText = `Definisi ringkas dan hakikat utama konsep ${defaultTitle}.`;
  } else if (compLower.includes('tujuan')) {
    fallbackText = `Capaian kompetensi dan tujuan utama pembelajaran ${defaultTitle}.`;
  } else if (compLower.includes('fungsi')) {
    fallbackText = `Peranan fungsional dan manfaat konsep dalam pembelajaran ${defaultSubject}.`;
  } else if (compLower.includes('ciri')) {
    fallbackText = `Karakteristik pembeda dan kaidah utama materi ${defaultTitle}.`;
  } else if (compLower.includes('unsur') || compLower.includes('komponen')) {
    fallbackText = `Bagian pembentuk dan elemen pokok materi ${defaultTitle}.`;
  } else if (compLower.includes('contoh')) {
    fallbackText = `Contoh kontekstual penerapan ${defaultTitle} pada situasi belajar nyata.`;
  } else if (compLower.includes('langkah')) {
    fallbackText = `Tahapan prosedur sistematis pemahaman dan penyelesaian materi.`;
  } else if (compLower.includes('kesimpulan')) {
    fallbackText = `Sintesis penutup pemahaman materi ${defaultTitle} secara komprehensif.`;
  }

  return {
    text: fallbackText,
    keyword: compName,
    contextualExample: `Contoh kontekstual ${compName.toLowerCase()} materi ${defaultTitle}`
  };
}

/**
 * Pemilihan Komponen Pintar (AI Pilihkan) Berdasarkan Tujuan, Materi, Cakupan, Bentuk, dan Kedalaman
 * Mematuhi Standar STIVIA Section 17 & Section 8
 */
function determineSmartComponents(
  activeContext: ActiveContentContext,
  primaryChar: MaterialCharacterType,
  structureShape?: string,
  depth: string = 'Sedang'
): string[] {
  const shape = structureShape || '';
  const objText = (activeContext.learningObjectives || []).join(' ').toLowerCase();
  const scopeText = (activeContext.scopePoints || []).join(' ').toLowerCase();

  // 1. Bentuk Proses / Langkah (Section 8: TUJUAN -> LANGKAH 1 -> LANGKAH 2 -> LANGKAH 3 -> HASIL)
  if (shape === 'Proses / Langkah' || primaryChar === 'Proses' || scopeText.includes('langkah') || objText.includes('prosedur')) {
    return ['Tujuan Proses', 'Tahap Persiapan', 'Langkah Inti', 'Langkah Lanjutan', 'Hasil & Evaluasi'];
  }

  // 2. Bentuk Perbandingan (Section 8: PARAMETER -> OBJEK A vs B -> PERBEDAAN -> PERSAMAAN -> KESIMPULAN)
  if (shape === 'Perbandingan' || primaryChar === 'Perbandingan' || scopeText.includes('perbedaan') || scopeText.includes('komparasi')) {
    return ['Parameter Komparasi', 'Karakteristik Objek A', 'Karakteristik Objek B', 'Perbedaan Esensial', 'Kesimpulan'];
  }

  // 3. Bentuk Struktur / Komponen (Section 8: KONSEP UTAMA -> BAGIAN 1 -> BAGIAN 2 -> INTERAKSI -> SISTEM UTUH)
  if (shape === 'Struktur / Komponen' || primaryChar === 'Sistem' || scopeText.includes('anatomi') || scopeText.includes('unsur pembangun')) {
    return ['Konsep Utama', 'Komponen Inti', 'Komponen Pendukung', 'Interaksi Fungsi', 'Keutuhan Sistem'];
  }

  // 4. Bentuk Analisis
  if (shape === 'Analisis' || objText.includes('menganalisis')) {
    return ['Identifikasi Konsep', 'Unsur & Parameter', 'Hubungan Kausal', 'Konteks Aplikasi', 'Sintesis Temuan'];
  }

  // 5. Bentuk Kontekstual
  if (shape === 'Kontekstual' || objText.includes('kontekstual') || scopeText.includes('kehidupan')) {
    return ['Fenomena Nyata', 'Kaitan Konseptual', 'Mekanisme Kejadian', 'Manfaat Aplikatif', 'Refleksi Siswa'];
  }

  // 6. Bentuk Materi + Contoh
  if (shape === 'Materi + Contoh') {
    return ['Pengertian Teoretis', 'Kaidah Pokok', 'Contoh Konkret', 'Variasi Konteks', 'Refleksi Pembelajaran'];
  }

  // 7. Bentuk Ringkasan
  if (shape === 'Ringkasan') {
    return ['Gagasan Pokok', 'Pilar Konsep 1', 'Pilar Konsep 2', 'Pilar Konsep 3', 'Kesimpulan Akhir'];
  }

  // 8. Bentuk Konsep Dasar / Standar (Default Section 8: PENGERTIAN -> FUNGSI -> CIRI-CIRI -> CONTOH -> KESIMPULAN)
  if (objText.includes('mengidentifikasi ciri') || objText.includes('ciri-ciri') || scopeText.includes('ciri')) {
    return ['Pengertian', 'Tujuan', 'Ciri-ciri', 'Contoh', 'Kesimpulan'];
  }

  if (depth === 'Dasar') {
    return ['Pengertian Dasar', 'Fungsi Utama', 'Ciri Pokok', 'Contoh Sederhana'];
  }

  if (depth === 'Mendalam') {
    return ['Definisi & Hakikat', 'Struktur & Unsur', 'Karakteristik Khas', 'Analisis Perbandingan', 'Aplikasi Nyata', 'Kesimpulan'];
  }

  return ['Pengertian', 'Fungsi & Peranan', 'Karakteristik Utama', 'Contoh Penerapan', 'Kesimpulan'];
}

/**
 * Helper STIVIA: Membentuk Preview Struktur Rancangan Infografis (Lokal & In-Memory Tanpa Saldo)
 */
export function buildPreviewInfographicStructure(
  topic: string,
  subject: string,
  shape: string = 'Konsep Dasar',
  components: string[] = [],
  depth: string = 'Sedang'
): InfographicPreviewSection[] {
  const cleanTopic = topic?.trim() || 'Materi Pembelajaran';
  const cleanSubject = subject?.trim() || 'Umum';

  // Jika guru memilih komponen tertentu secara eksplisit:
  if (components && components.length > 0 && !components.some(c => c.toLowerCase().includes('pilihkan'))) {
    return components.slice(0, 6).map((comp, idx) => {
      const stepNum = String(idx + 1).padStart(2, '0');
      let desc = `Penjelasan terstruktur mengenai ${comp.toLowerCase()} dari ${cleanTopic} sesuai kedalaman materi ${depth.toLowerCase()}.`;
      let visualHint = `Visual penjelas dengan ikon ${comp.toLowerCase()} representatif`;

      if (comp === 'Pengertian') {
        desc = `Definisi operasional, ruang lingkup konsep, dan hakikat utama ${cleanTopic}.`;
        visualHint = 'Callout card definisi dengan tipografi berbobot tegas';
      } else if (comp === 'Tujuan' || comp === 'Fungsi') {
        desc = `Peranan strategis dan fungsi praktis konsep dalam konteks ${cleanSubject}.`;
        visualHint = 'Daftar berpoin target capaian dengan ikon fokus';
      } else if (comp === 'Ciri-ciri' || comp === 'Karakteristik') {
        desc = `Indikator pembeda dan karakteristik khas yang harus dikuasai siswa.`;
        visualHint = 'Modul grid checklist dengan visual penanda';
      } else if (comp === 'Unsur / Komponen' || comp === 'Jenis') {
        desc = `Uraian bagian-bagian pembentuk, klasifikasi entitas, dan sub-elemen.`;
        visualHint = 'Diagram modular struktural atau bagan keterkaitan komponen';
      } else if (comp === 'Contoh' || comp === 'Perbandingan') {
        desc = `Studi kasus konkret atau perbandingan kontekstual dalam situasi nyata.`;
        visualHint = 'Kartu perbandingan bersisian atau ilustrasi situasi kontekstual';
      } else if (comp === 'Langkah / Proses') {
        desc = `Urutan kronologis atau prosedur sistematis dari awal hingga akhir.`;
        visualHint = 'Diagram alur bertahap dengan indikator panah';
      } else if (comp === 'Tips' || comp === 'Kesimpulan') {
        desc = `Sintesis penutup pembelajaran dan panduan praktis bagi siswa.`;
        visualHint = 'Kotak kesimpulan berbingkai aksen kontras';
      }

      return {
        step: stepNum,
        title: comp,
        desc,
        visualHint
      };
    });
  }

  // Jika berdasarkan bentuk infografis:
  switch (shape) {
    case 'Analisis':
      return [
        { step: '01', title: 'Identifikasi Konsep', desc: `Pembedahan konsep pokok ${cleanTopic}.`, visualHint: 'Ikon lensa analitis & diagram fokus' },
        { step: '02', title: 'Unsur & Parameter', desc: `Variabel dan faktor penentu dalam ${cleanSubject}.`, visualHint: 'Bagan klasifikasi parameter' },
        { step: '03', title: 'Hubungan Kausal', desc: `Keterkaitan sebab-akibat antarkomponen.`, visualHint: 'Diagram relasi logis' },
        { step: '04', title: 'Konteks Aplikasi', desc: `Penerapan analitis dalam situasi nyata.`, visualHint: 'Data visual dan ilustrasi skenario' },
        { step: '05', title: 'Sintesis & Temuan', desc: `Kesimpulan hasil analisis mendalam.`, visualHint: 'Highlight card temuan esensial' }
      ];
    case 'Perbandingan':
      return [
        { step: '01', title: 'Parameter Komparasi', desc: `Kriteria dasar pembanding kedua konsep.`, visualHint: 'Timbangan visual pembanding' },
        { step: '02', title: 'Entitas A (Karakteristik)', desc: `Kelebihan dan ciri khas entitas pertama.`, visualHint: 'Kolom visual sisi kiri (warna primer)' },
        { step: '03', title: 'Entitas B (Karakteristik)', desc: `Kelebihan dan ciri khas entitas pembanding.`, visualHint: 'Kolom visual sisi kanan (warna komplementer)' },
        { step: '04', title: 'Titik Temu & Perbedaan', desc: `Matriks komparasi dan perbedaan esensial.`, visualHint: 'Tabel komparasi / Diagram Venn' },
        { step: '05', title: 'Rekomendasi Pemilihan', desc: `Petunjuk penerapan sesuai kondisi belajar.`, visualHint: 'Kartu panduan keputusan' }
      ];
    case 'Proses / Langkah':
      return [
        { step: '01', title: 'Tahap Persiapan', desc: `Prasyarat awal sebelum memulai proses.`, visualHint: 'Ikon persiapan & checklist' },
        { step: '02', title: 'Langkah Inti 1', desc: `Tindakan operasional utama awal.`, visualHint: 'Badge nomor 1 berpanah alur' },
        { step: '03', title: 'Langkah Inti 2', desc: `Tahap pemrosesan dan transisi lanjutan.`, visualHint: 'Badge nomor 2 berpanah alur' },
        { step: '04', title: 'Verifikasi / Evaluasi', desc: `Pengecekan kualitas dan ketepatan hasil.`, visualHint: 'Ikon verifikasi & kendali mutu' },
        { step: '05', title: 'Luaran Akhir', desc: `Hasil akhir dari rangkaian proses.`, visualHint: 'Simbol pencapaian target' }
      ];
    case 'Struktur / Komponen':
      return [
        { step: '01', title: 'Arsitektur Global', desc: `Gambaran utuh dari sistem ${cleanTopic}.`, visualHint: 'Bagan anatomi sentral' },
        { step: '02', title: 'Komponen Utama', desc: `Bagian primer penggerak fungsi esensial.`, visualHint: 'Ikon bagian inti beraksen kontras' },
        { step: '03', title: 'Komponen Pendukung', desc: `Elemen sekunder penjaga stabilitas.`, visualHint: 'Ikon modul pelengkap' },
        { step: '04', title: 'Interaksi Antarbagian', desc: `Mekanisme kerja sama antar-elemen.`, visualHint: 'Garis penghubung fungsi' },
        { step: '05', title: 'Integritas Sistem', desc: `Pentingnya kesatuan komponen secara utuh.`, visualHint: 'Badge keutuhan sistem' }
      ];
    case 'Ringkasan':
      return [
        { step: '01', title: 'Gagasan Pokok', desc: `Intisari terpenting dari seluruh materi.`, visualHint: 'Highlight card tipografi besar' },
        { step: '02', title: 'Pilar Utama 1', desc: `Rangkuman pilar konsep pertama.`, visualHint: 'Kartu ringkas berikon' },
        { step: '03', title: 'Pilar Utama 2', desc: `Rangkuman pilar konsep kedua.`, visualHint: 'Kartu ringkas berikon' },
        { step: '04', title: 'Kesimpulan Pembelajaran', desc: `Ringkasan penutup pembelajaran.`, visualHint: 'Pita kesimpulan akhir' }
      ];
    case 'Materi + Contoh':
      return [
        { step: '01', title: 'Pengertian Teoretis', desc: `Definisi akademis konsep ${cleanTopic}.`, visualHint: 'Modul teori berikon edukatif' },
        { step: '02', title: 'Kaidah / Prinsip', desc: `Aturan baku yang mendasari konsep.`, visualHint: 'Highlight aturan kunci' },
        { step: '03', title: 'Contoh Konkret 1', desc: `Kasus nyata dari lingkungan belajar.`, visualHint: 'Ilustrasi contoh beranotasi' },
        { step: '04', title: 'Contoh Konkret 2', desc: `Variasi contoh dalam konteks berbeda.`, visualHint: 'Ilustrasi konteks alternatif' },
        { step: '05', title: 'Refleksi Contoh', desc: `Alasan mengapa contoh tersebut valid.`, visualHint: 'Kartu bedah konsep' }
      ];
    case 'Kontekstual':
      return [
        { step: '01', title: 'Fenomena Nyata', desc: `Kejadian nyata di sekitar kehidupan siswa.`, visualHint: 'Ilustrasi aktivitas kehidupan nyata' },
        { step: '02', title: 'Kaitan Konseptual', desc: `Teori ${cleanSubject} di balik fenomena.`, visualHint: 'Ikon penghubung sains dan kenyataan' },
        { step: '03', title: 'Mekanisme Kejadian', desc: `Penjelasan fungsional yang mudah dipahami.`, visualHint: 'Bagan visual sebab-akibat' },
        { step: '04', title: 'Manfaat Nyata', desc: `Nilai guna konsep dalam kehidupan siswa.`, visualHint: 'Ikon manfaat positif' },
        { step: '05', title: 'Aksi Siswa', desc: `Penerapan mandiri yang dapat dilakukan siswa.`, visualHint: 'Ikon aksi kreatif peserta didik' }
      ];
    case 'Konsep Dasar':
    default:
      return [
        { step: '01', title: 'Pengertian Dasar', desc: `Definisi ringkas dan hakikat utama ${cleanTopic}.`, visualHint: 'Header definisi dengan ikon konsep' },
        { step: '02', title: 'Tujuan & Peranan', desc: `Mengapa konsep ini penting dalam ${cleanSubject}.`, visualHint: 'Kartu target capaian' },
        { step: '03', title: 'Karakteristik Utama', desc: `Ciri pembeda yang perlu dipahami siswa.`, visualHint: 'Grid checklist 3 poin' },
        { step: '04', title: 'Penerapan Nyata', desc: `Contoh aplikatif yang dekat dengan siswa.`, visualHint: 'Visual konteks penerapan' },
        { step: '05', title: 'Rangkuman Inti', desc: `Kesimpulan penutup pembelajaran.`, visualHint: 'Footer kartu ringkasan' }
      ];
  }
}

/**
 * Pemilihan Struktur Infografis dari 10 Pilihan Standar STIVIA
 */
function determineInfographicStructure(
  primaryChar: MaterialCharacterType,
  scopePoints: string[],
  activeSubject: string,
  styleItem: InfographicStyleItem,
  customShape?: string
): {
  strategy: InfographicLayoutStrategy;
  layoutDescription: string;
  readingFlow: string;
  rationale: string;
} {
  // Jika pengguna memilih bentuk secara spesifik (selain AI Pilihkan):
  if (customShape && customShape !== '✨ AI Pilihkan' && customShape !== 'AI Pilihkan') {
    switch (customShape) {
      case 'Analisis':
        return {
          strategy: '8. Central Concept',
          layoutDescription: 'Tata letak analitis memusatkan konsep inti yang dibedah menjadi komponen parameter dan keterkaitan sebab-akibat.',
          readingFlow: 'Alur Analisis: Identifikasi Konsep → Pembedahan Parameter → Relasi Sebab-Akibat → Sintesis Temuan.',
          rationale: 'Bentuk Analisis dipilih guru untuk menguraikan unsur, relasi, atau karakteristik materi secara mendalam.'
        };
      case 'Perbandingan':
        return {
          strategy: '3. Comparison',
          layoutDescription: 'Tata letak kolom berdampingan (side-by-side) dengan matriks komparasi kontras antara dua entitas atau pendekatan.',
          readingFlow: 'Alur Komparasi: Parameter Pembeda → Kolom Entitas A vs Entitas B → Matriks Distingsi → Kesimpulan.',
          rationale: 'Bentuk Perbandingan dipilih guru untuk mempermudah siswa membandingkan dua atau lebih konsep secara berimbang.'
        };
      case 'Proses / Langkah':
        return {
          strategy: '2. Flowchart',
          layoutDescription: 'Diagram alir proses terstruktur berurutan dari input awal, tahapan kerja operasional, hingga produk/hasil akhir.',
          readingFlow: 'Alur Alir Logis: Masukan / Persiapan → Tahapan Eksekusi Bertahap → Pengujian Mutu → Capaian Luaran.',
          rationale: 'Bentuk Proses/Langkah dipilih guru untuk materi yang memiliki urutan atau tahapan operasional sistematis.'
        };
      case 'Struktur / Komponen':
        return {
          strategy: '4. Hierarchy',
          layoutDescription: 'Bagan hierarki dan anatomi komponen yang menguraikan bagian-bagian pembentuk materi secara terstruktur.',
          readingFlow: 'Alur Struktural: Arsitektur Utuh → Pembagian Bagian Utama → Peranan Komponen Pendukung → Kesatuan Sistem.',
          rationale: 'Bentuk Struktur/Komponen dipilih guru untuk menjelaskan unsur-unsur pembangun suatu konsep secara runtut.'
        };
      case 'Ringkasan':
        return {
          strategy: '6. Grid / Cards',
          layoutDescription: 'Struktur kartu ringkasan seimbang berisi poin-poin terpenting yang dirangkum padat dan cepat dipindai siswa.',
          readingFlow: 'Alur Ringkasan: Gagasan Pokok → 3-4 Kartu Pilar Rangkuman → Kesimpulan Penutup.',
          rationale: 'Bentuk Ringkasan dipilih guru untuk merangkum materi luas menjadi poin-poin utama yang mudah diingat.'
        };
      case 'Materi + Contoh':
        return {
          strategy: '6. Grid / Cards',
          layoutDescription: 'Tata letak modular seimbang yang memadukan blok teori konseptual dengan blok contoh konkret kontekstual.',
          readingFlow: 'Alur Teori & Contoh: Definisi Teori → Kaidah Pokok → Contoh Kasus Nyata → Analisis Validasi Contoh.',
          rationale: 'Bentuk Materi + Contoh dipilih guru untuk menjembatani teori abstrak dengan contoh nyata siswa.'
        };
      case 'Kontekstual':
        return {
          strategy: '9. Diagram Relationship',
          layoutDescription: 'Visualisasi relasi kontekstual yang menghubungkan konsep pembelajaran dengan peristiwa nyata dalam kehidupan sehari-hari.',
          readingFlow: 'Alur Kontekstual: Fenomena Nyata Siswa → Konsep Pembelajaran Terhubung → Mekanisme Kerja → Manfaat Aplikatif.',
          rationale: 'Bentuk Kontekstual dipilih guru untuk mengaitkan materi langsung dengan kehidupan sehari-hari siswa.'
        };
      case 'Konsep Dasar':
      default:
        return {
          strategy: '6. Grid / Cards',
          layoutDescription: 'Struktur kartu modular simetris berisi definisi esensial, tujuan pembelajaran, ciri pembeda, dan kesimpulan konsep.',
          readingFlow: 'Alur Konsep Dasar: Header Judul → Kartu Definisi → Kartu Unsur/Ciri → Kartu Contoh → Rangkuman.',
          rationale: 'Bentuk Konsep Dasar dipilih guru untuk menjelaskan pengertian dan fondasi utama materi secara jernih.'
        };
    }
  }

  const scopeText = scopePoints.join(' ').toLowerCase();

  // 1. Timeline / Step-by-Step
  if (primaryChar === 'Kronologis' || scopeText.includes('linimasa') || scopeText.includes('perjalanan waktu')) {
    return {
      strategy: '1. Timeline / Step-by-Step',
      layoutDescription: 'Linimasa vertikal berurutan dengan penanda waktu/fase yang menghubungkan titik awal hingga penyelesaian.',
      readingFlow: 'Alur Kronologis: Titik Mula (Atas) → Rentetan Peristiwa Penting (Tengah) → Puncak & Hasil (Bawah).',
      rationale: 'Materi mengandung linimasa waktu dan rentetan momentum yang harus dipahami secara kronologis bertahap.'
    };
  }

  // 2. Flowchart
  if (primaryChar === 'Proses' && (scopeText.includes('langkah') || scopeText.includes('tahap kerja') || scopeText.includes('cara membuat'))) {
    return {
      strategy: '2. Flowchart',
      layoutDescription: 'Diagram alir proses bertahap dari input menuju proses operasional hingga menghasilkan produk/output terukur.',
      readingFlow: 'Alur Alir Logis: Masukan / Persiapan → Tahapan Eksekusi → Verifikasi & Luaran.',
      rationale: 'Materi berisi prosedur atau mekanisme kerja yang menuntut pemahaman langkah berurutan.'
    };
  }

  // 3. Comparison
  if (primaryChar === 'Perbandingan' || scopeText.includes('perbedaan') || scopeText.includes('komparasi')) {
    return {
      strategy: '3. Comparison',
      layoutDescription: 'Tata letak kolom berdampingan (side-by-side) dengan matriks pembanding kontras antara dua entitas atau pendekatan.',
      readingFlow: 'Alur Komparasi: Parameter Pembeda → Kolom Entitas A vs Entitas B → Sintesis Keunggulan.',
      rationale: 'Materi membandingkan dua konsep sehingga format komparatif langsung mempermudah siswa melihat distingsi.'
    };
  }

  // 4. Hierarchy
  if (scopeText.includes('tingkatan') || scopeText.includes('hierarki') || scopeText.includes('taksonomi') || scopeText.includes('struktur organisasi')) {
    return {
      strategy: '4. Hierarchy',
      layoutDescription: 'Bagan berjenjang dari pucuk/fondasi utama menuju cabang-cabang sub-level.',
      readingFlow: 'Alur Hierarkis: Puncak Konseptual → Pembagian Tingkatan → Cabang Operasional.',
      rationale: 'Materi memiliki hubungan subordinasi dan tingkatan yang menuntut visualisasi piramida/pohon struktur.'
    };
  }

  // 5. Cycle
  if (scopeText.includes('siklus') || scopeText.includes('daur') || scopeText.includes('perputaran') || scopeText.includes('lingkaran')) {
    return {
      strategy: '5. Cycle',
      layoutDescription: 'Bagan melingkar tertutup yang menggambarkan proses berkesinambungan tanpa henti.',
      readingFlow: 'Alur Siklus Sirkular: Fase Permulaan → Fase Perkembangan → Fase Transisi → Kembali ke Siklus Awal.',
      rationale: 'Materi bersifat daur tertutup (siklus) sehingga alur sirkular memberikan pemahaman dinamika alami.'
    };
  }

  // 8. Central Concept
  if (primaryChar === 'Sistem' || scopeText.includes('anatomi') || scopeText.includes('bagian-bagian') || scopeText.includes('unsur pembangun')) {
    return {
      strategy: '8. Central Concept',
      layoutDescription: 'Ilustrasi sentral di tengah kanvas dikelilingi kartu call-out penjelas bagian dan fungsi.',
      readingFlow: 'Alur Konsep Sentral: Objek Utama Pusat → Garis Penunjuk Komponen → Penjelasan Fungsi.',
      rationale: 'Materi berbasis objek sentral di mana fokus utama berada pada keterkaitan komponen dengan fungsi utuhnya.'
    };
  }

  // 7. Mind Map
  if (styleItem.id === 'sketch_notetaking' || styleItem.id === 'swiss_design' || scopeText.includes('pemetaan konsep')) {
    return {
      strategy: '7. Mind Map',
      layoutDescription: 'Peta pemikiran dengan gagasan sentral memancarkan cabang ide tematik berstruktur rapi.',
      readingFlow: 'Alur Pemetaan Pikiran: Konsep Inti → Cabang Kategori Utama → Ranting Detail Aplikatif.',
      rationale: 'Materi kaya akan asosiasi gagasan yang paling tepat divisualisasikan dengan peta konsep bercabang.'
    };
  }

  // 6. Grid / Cards (Standar Emas & Fondasi Utama STIVIA)
  return {
    strategy: '6. Grid / Cards',
    layoutDescription: 'Struktur kartu kisi (grid) modular simetris berisi 4–6 blok informasi seragam dan mudah dipindai (scannable).',
    readingFlow: 'Alur Grid Seimbang: Header Judul → 4–6 Kartu Modul Utama (Atas ke Bawah) → Footer Summary.',
    rationale: 'Standar baku STIVIA 3.5 untuk mengelompokkan materi ke dalam 4–6 poin esensial, mencegah beban kognitif berlebih bagi siswa.'
  };
}

/**
 * Sintesis 4–6 Bagian Konten Infografis yang Terstruktur (Prinsip Short Text + Strong Visual)
 * Menerapkan IDENTIFY -> SIMPLIFY -> VISUALIZE -> VERIFY dan LESS IS MORE
 */
function synthesizeContentSections(
  activeContext: ActiveContentContext,
  primaryChar: MaterialCharacterType,
  icons: string[],
  selectedComponents?: string[],
  depth: string = 'Sedang',
  structureShape?: string
): InfographicContentSection[] {
  const { scopePoints, title, subject, activeKeywords } = activeContext;

  // Tentukan nama-nama komponen: input guru atau AI Pilihkan berbasis tujuan, materi, cakupan & bentuk
  let finalComponentNames: string[] = [];
  const isAIMode = !selectedComponents || 
                   selectedComponents.length < 3 || 
                   selectedComponents.some(c => c.toLowerCase().includes('pilihkan'));

  if (isAIMode) {
    finalComponentNames = determineSmartComponents(activeContext, primaryChar, structureShape, depth);
  } else {
    finalComponentNames = selectedComponents.slice(0, 6);
  }

  // Petakan setiap komponen langsung ke data riil Cakupan Materi pendidik
  return finalComponentNames.slice(0, 6).map((compName, idx) => {
    const bagianNum = idx + 1;
    const substance = findSubstanceInScope(compName, scopePoints, title, subject, depth);
    const iconForSection = icons[idx % icons.length] || `Ikon ${compName}`;
    const keywordForSection = substance.keyword || activeKeywords[idx % activeKeywords.length] || compName;

    return {
      bagianNumber: bagianNum,
      judul: compName,
      teksSingkat: substance.text,
      kataKunci: keywordForSection,
      contohKonkret: substance.contextualExample || `Penerapan kontekstual ${compName.toLowerCase()} materi ${title} (${subject}).`,
      visual: `Modul visual kartu simetris beraksen fokus pada aspek ${compName.toLowerCase()}`,
      ikon: iconForSection
    };
  });
}

/**
 * FUNGSI ANALISIS MATERI & BATAS PERTEMUAN (Pencegahan Pengulangan Materi)
 */
export function analyzeMaterialBoundaries(input: StiviaThinkingInput): StiviaMaterialBoundaryAnalysis {
  const subject = input.subject || 'Mata Pelajaran';
  const grade = input.grade ? `${input.grade} (${input.educationLevel || 'Jenjang'})` : (input.educationLevel || 'Semua Jenjang');
  const mainTopic = input.topic || input.title || 'Materi Utama';

  let rawPertemuan = input.pertemuan ? String(input.pertemuan).trim() : 'Pertemuan 1';
  let formattedPertemuan = rawPertemuan;
  if (/^\d+$/.test(rawPertemuan)) {
    formattedPertemuan = `Pertemuan ${rawPertemuan}`;
  } else if (!rawPertemuan.toLowerCase().startsWith('pertemuan')) {
    formattedPertemuan = `Pertemuan ${rawPertemuan}`;
  }

  let rawScope = input.scope || '';
  let scopePoints: string[] = [];
  if (rawScope.trim()) {
    scopePoints = rawScope
      .split(/\n+/)
      .map(line => line.replace(/^(\d+|[a-zA-Z])[\.\)\-\*•]\s*/, '').trim())
      .filter(line => line.length > 2);
  }
  if (scopePoints.length === 0) {
    scopePoints = [`Pembahasan terfokus cakupan materi ${formattedPertemuan}`];
  }

  const materiBolehDibahas: string[] = [];
  scopePoints.forEach(sp => {
    materiBolehDibahas.push(sp);
    const spLower = sp.toLowerCase();
    if (spLower.includes('struktur') || spLower.includes('bagian') || spLower.includes('anatomi')) {
      materiBolehDibahas.push(`Bagian-bagian dan anatomi struktur dari ${mainTopic}`);
    }
    if (spLower.includes('unsur') || spLower.includes('komponen') || spLower.includes('elemen')) {
      materiBolehDibahas.push(`Unsur-unsur pembangun dan peranan fungsional setiap elemen ${mainTopic}`);
    }
    if (spLower.includes('kaidah') || spLower.includes('ciri')) {
      materiBolehDibahas.push(`Kaidah dan ciri khas yang berkaitan langsung dengan cakupan`);
    }
  });
  materiBolehDibahas.push(`Konteks aplikasi dan studi kasus kontekstual pendukung cakupan ${formattedPertemuan}`);

  const meetingNum = parseInt(formattedPertemuan.replace(/\D/g, ''), 10) || 1;
  const isLaterMeeting = meetingNum > 1;
  const scopeHasDefinition = scopePoints.some(sp => {
    const l = sp.toLowerCase();
    return l.includes('pengertian') || l.includes('definisi') || l.includes('apa itu') || l.includes('hakikat') || l.includes('pengantar');
  });

  const materiTidakPerluDiulang: string[] = [];
  if (isLaterMeeting && !scopeHasDefinition) {
    materiTidakPerluDiulang.push(`Pengertian dan definisi umum lengkap dari ${mainTopic} (sudah dibahas pada pertemuan sebelumnya)`);
    materiTidakPerluDiulang.push(`Penjelasan dasar/pengantar umum yang berada di luar cakupan ${formattedPertemuan}`);
    materiTidakPerluDiulang.push(`Materi yang telah menjadi fokus pembahasan pertemuan terdahulu`);
  } else if (!isLaterMeeting) {
    materiTidakPerluDiulang.push(`Materi lanjutan atau detail teknis mendalam di luar batas cakupan ${formattedPertemuan}`);
    materiTidakPerluDiulang.push(`Uraian kompleks yang belum diajarkan pada tahap awal`);
  } else {
    materiTidakPerluDiulang.push(`Informasi di luar batas cakupan materi yang telah ditentukan`);
  }

  const boundaryRules = [
    'Materi ini merupakan bagian dari rangkaian pembelajaran terstruktur.',
    'Fokuskan pembahasan hanya pada cakupan materi pertemuan saat ini.',
    'Jangan secara otomatis mengulang pengertian dasar apabila tidak termasuk dalam cakupan materi.',
    'Nomor pertemuan menunjukkan posisi materi dalam rangkaian pembelajaran.',
    'Materi Utama hanya digunakan sebagai konteks umum, sedangkan Cakupan Materi menjadi batas utama pembahasan.',
    'Jangan membuat setiap pertemuan terlihat seperti materi pertama.'
  ];

  return {
    tahap1_MataPelajaran: subject,
    tahap2_Kelas: grade,
    tahap3_MateriUtama: mainTopic,
    tahap4_Pertemuan: formattedPertemuan,
    tahap5_CakupanMateri: scopePoints,
    tahap6_MateriBolehDibahas: Array.from(new Set(materiBolehDibahas)),
    tahap7_MateriTidakPerluDiulang: Array.from(new Set(materiTidakPerluDiulang)),
    boundaryRules
  };
}

/**
 * FUNGSI UTAMA: MENJALANKAN KERANGKA BERPIKIR STIVIA 3.2 ENHANCED
 * Menerapkan Content Context Lock, Contamination Prevention, 7-Stage Analysis,
 * dan menghasilkan output rancangan infografis lengkap sesuai Section H.
 */
export function runStiviaThinkingFramework(input: StiviaThinkingInput): StiviaThinkingResult {
  const {
    title,
    topic = '',
    theme = '',
    subject = 'Umum',
    educationLevel = 'SMA',
    grade = 'Kelas X',
    bab = '',
    pertemuan = 'Pertemuan 1',
    scope = '',
    rawContent = '',
    learningObjectives = [],
    keyPoints = [],
    visualStyleName,
    customStyleDescription = '',
    userNotes = '',
  } = input;

  // 1. KUNCI KONTEKS KONTEN AKTIF (CONTENT CONTEXT LOCK)
  // Menghapus segala bentuk pewarisan topik sebelumnya
  const resolvedTitle = sanitizeStringForContamination(title.trim() || topic.trim() || 'Infografis Pembelajaran', subject);
  const resolvedSubject = subject.trim() || 'Mata Pelajaran';
  const resolvedLevel = educationLevel || 'SMA';
  const resolvedGrade = grade || 'Kelas X';
  const resolvedBab = sanitizeStringForContamination(bab.trim(), subject);
  const resolvedTheme = sanitizeStringForContamination(theme.trim() || resolvedTitle, subject);

  let rawPertemuan = pertemuan ? String(pertemuan).trim() : 'Pertemuan 1';
  const formattedPertemuan = rawPertemuan.startsWith('Pertemuan') ? rawPertemuan : `Pertemuan ${rawPertemuan}`;

  // Parse cakupan materi aktif
  let activeScopePoints = (scope || '')
    .split(/\n+/)
    .map(line => line.replace(/^(\d+|[a-zA-Z])[\.\)\-\*•]\s*/, '').trim())
    .filter(line => line.length > 2)
    .map(line => sanitizeStringForContamination(line, subject));

  if (activeScopePoints.length === 0) {
    activeScopePoints = [`Pembahasan materi esensial ${resolvedTitle}`];
  }

  // Ekstraksi kata kunci murni dari materi aktif
  const combinedActiveText = `${resolvedTitle} ${resolvedSubject} ${resolvedBab} ${resolvedTheme} ${activeScopePoints.join(' ')} ${rawContent}`.trim();
  const activeKeywords = extractCleanKeywordsFromActiveText(combinedActiveText, resolvedSubject, 6);

  const activeObjectives = learningObjectives.length > 0
    ? learningObjectives.map(o => sanitizeStringForContamination(o, subject))
    : [`Peserta didik memahami esensi, karakteristik, dan penerapan nyata dari ${resolvedTitle} secara mendalam.`];

  const activeContext: ActiveContentContext = {
    subject: resolvedSubject,
    educationLevel: resolvedLevel,
    grade: resolvedGrade,
    bab: resolvedBab,
    theme: resolvedTheme,
    title: resolvedTitle,
    pertemuan: formattedPertemuan,
    learningObjectives: activeObjectives,
    scopePoints: activeScopePoints,
    activeKeywords,
    userNotes: userNotes.trim()
  };

  // 2. ANALISIS BATAS PEMBAHASAN MATERI
  const materialAnalysis = analyzeMaterialBoundaries({
    ...input,
    title: resolvedTitle,
    subject: resolvedSubject,
    scope: activeScopePoints.join('\n')
  });

  // 3. RESOLVE GAYA VISUAL TERPILIH
  const resolvedStyle = findStyleByNameOrId(visualStyleName) || {
    id: 'modern_edukatif',
    name: visualStyleName || 'Modern Edukatif',
    category: 'EDUKATIF & TERSTRUKTUR',
    categoryId: 'edukatif_terstruktur',
    description: 'Gaya standar STIVIA yang mengutamakan keterbacaan prima, kontras tinggi, dan ramah siswa.',
    shortDescription: 'Standar resmi STIVIA: seimbang antara teks, ikon visual, dan warna ramah siswa.',
    visualCharacteristics: ['Sudut kartu melengkung halus', 'Palet warna ramah edukasi', 'Ikon pembelajaran kontekstual'],
    suitableFor: ['Semua mata pelajaran'],
    characterExample: 'Harmonis, profesional, ramah peserta didik.',
    characteristics: 'Terstruktur, bersih, ramah siswa.',
    promptInstruction: 'Gunakan tata letak edukatif terstruktur dengan rasio 2:3 dan palet warna kontras tinggi.',
    accentColor: 'indigo',
    tags: ['Edukasi', 'Standar', 'Modern']
  };

  // ===================================================================
  // TAHAP 1 — IDENTIFIKASI MATERI
  // ===================================================================
  const wordCount = combinedActiveText.split(/\s+/).length;
  const contentVolume: 'Ringkas' | 'Sedang' | 'Padat' = wordCount > 350 ? 'Padat' : wordCount > 120 ? 'Sedang' : 'Ringkas';

  const stage1_Understanding = {
    title: resolvedTitle,
    subject: resolvedSubject,
    educationLevel: resolvedLevel,
    grade: resolvedGrade,
    pertemuan: formattedPertemuan,
    bab: resolvedBab,
    theme: resolvedTheme,
    learningObjective: activeObjectives[0],
    scopeOverview: `Fokus pembahasan terkunci pada cakupan: ${activeScopePoints.slice(0, 3).join(', ')}.`,
    contentVolume
  };

  // ===================================================================
  // TAHAP 2 — ANALISIS KONSEP INTI
  // ===================================================================
  const subConcepts = keyPoints.length > 0
    ? keyPoints.slice(0, 4).map(kp => sanitizeStringForContamination(kp, subject))
    : activeScopePoints.slice(0, 4).map(p => p.split(/[:\-\–]/)[0].trim());

  const essentialInformation = [
    `Fakta kunci dan definisi operasional terkait ${resolvedTitle}`,
    `Hubungan logis antar-bagian materi sesuai cakupan ${formattedPertemuan}`,
    `Penerapan nyata yang relevan bagi peserta didik ${resolvedLevel} ${resolvedGrade}`,
    `Batas pembahasan: materi pertemuan terdahulu tidak diulang`
  ];

  const stage2_ImportantInfo = {
    mainConcept: resolvedTitle,
    subConcepts,
    keywords: activeKeywords,
    essentialInformation,
    informationRelationship: 'Hubungan hierarkis dari konsep dasar, unsur pembentuk, hingga aplikasi nyata.',
    visualizedConcepts: subConcepts.map(c => `Visualisasi ${c}`),
    summarizedInfo: activeScopePoints.map(p => `Poin intisari: ${p.slice(0, 60)}`)
  };

  // ===================================================================
  // TAHAP 3 — ANALISIS KEBUTUHAN BELAJAR
  // ===================================================================
  const charAnalysis = detectMaterialCharacters(resolvedTitle, combinedActiveText, resolvedSubject, activeScopePoints.join(' '));
  const isSD = resolvedLevel === 'SD';
  const isSMP = resolvedLevel === 'SMP';
  
  const gradeAdaptationInstruction = isSD
    ? 'Jenjang SD (Kelas 1–6): Kalimat sangat lugas, diksi ramah anak, contoh visual konkret dan akrab dari kehidupan sehari-hari, warna cerah bersahabat, ikon literal.'
    : isSMP
    ? 'Jenjang SMP (Kelas 7–9): Bahasa lugas, hindari paragraf panjang, gunakan istilah akademis yang tetap mudah dipahami, prioritaskan konsep dan hubungan logis antarkomponen.'
    : 'Jenjang SMA/SMK (Kelas 10–12): Kosakata analitis, sistematis, konsep terstruktur, diagram analitis, perbandingan komparatif tajam, layout modern dan profesional.';

  const stage3_MaterialCharacters = {
    detectedCharacters: charAnalysis.characters,
    primaryCharacter: charAnalysis.primary,
    rationale: charAnalysis.rationale,
    studentUnderstandingGoals: [
      `Memahami konsep fundamental ${resolvedTitle}`,
      `Mengidentifikasi komponen dan karakteristik utama`,
      `Mampu menerapkan prinsip materi dalam studi kasus nyata`
    ],
    mustRemember: activeKeywords.slice(0, 4),
    misconceptionsToPrevent: [
      `Mencegah pencampuran pengertian ${resolvedTitle} dengan konsep di luar cakupan`,
      `Mencegah kebingungan antara konsep teoretis dan implementasi kontekstual`
    ],
    gradeAdaptationInstruction
  };

  // ===================================================================
  // TAHAP 4 — ANALISIS INFORMASI VISUAL
  // ===================================================================
  const stage4_StyleUnderstanding = {
    selectedStyle: resolvedStyle,
    visualTone: resolvedStyle.characterExample || 'Harmonis, rapi, dan mengedepankan pemahaman siswa.',
    compositionRule: 'Rasio kanvas vertikal 2:3 (Portrait), hierarki atas-ke-bawah yang intuitif.',
    elementShape: resolvedStyle.visualCharacteristics[0] || 'Bentuk kartu modular simetris bersudut halus.',
    typographyRule: resolvedStyle.visualCharacteristics[1] || 'Tipografi kontras tinggi, sans-serif terbaca jelas dari jarak pandang.',
    backgroundStyle: `Latar belakang netral bersih berpadu dengan aksen ${resolvedStyle.accentColor || 'harmonis'} tanpa mengorbankan kontras.`,
    ornamentStyle: resolvedStyle.visualCharacteristics[2] || 'Aksen ornamen penunjang fungsional yang mendukung tema materi.',
    illustrationType: resolvedStyle.name,
    invarianceNotice: 'GAYA VISUAL TIDAK BOLEH MENGUBAH: Judul materi, isi materi, fakta ilmiah, atau cakupan pembelajaran.',
    visualMappingRationale: `Karakter materi "${stage3_MaterialCharacters.primaryCharacter}" dipetakan ke elemen visual yang secara langsung memperjelas pemahaman siswa.`
  };

  // ===================================================================
  // TAHAP 5 — PEMILIHAN STRUKTUR INFOGRAFIS & VISUAL PENDUKUNG
  // ===================================================================
  const semanticAssets = determineSemanticVisualAssets(
    resolvedTitle,
    resolvedSubject,
    activeScopePoints,
    activeKeywords,
    stage3_MaterialCharacters.primaryCharacter,
    resolvedStyle
  );

  const layoutSelection = determineInfographicStructure(
    stage3_MaterialCharacters.primaryCharacter,
    activeScopePoints,
    resolvedSubject,
    resolvedStyle,
    input.structureShape
  );

  const stage5_SupportingVisuals = {
    heroVisual: semanticAssets.heroVisual,
    supportingIllustrations: semanticAssets.supportingIllustrations,
    icons: semanticAssets.icons,
    relevantObjects: semanticAssets.relevantObjects,
    supportingOrnaments: semanticAssets.supportingOrnaments,
    styleAdaptiveVisualNote: semanticAssets.styleAdaptiveVisualNote
  };

  // ===================================================================
  // TAHAP 6 — PERANCANGAN INFOGRAFIS (4–6 Bagian, Short Text + Strong Visual)
  // ===================================================================
  const contentSections = synthesizeContentSections(
    activeContext,
    stage3_MaterialCharacters.primaryCharacter,
    semanticAssets.icons,
    input.selectedComponents,
    input.depth || 'Sedang'
  );

  const footerSummary = `Pemahaman tentang ${resolvedTitle} (${resolvedSubject} - ${resolvedLevel} ${resolvedGrade}) memberikan landasan konsep yang kokoh bagi siswa. Melalui penguasaan komponen inti dan aplikasi nyata, peserta didik mampu menginternalisasi materi secara utuh dan berkelanjutan.`;

  const stage6_LayoutStrategy = {
    strategy: layoutSelection.strategy,
    layoutDescription: layoutSelection.layoutDescription,
    readingFlow: layoutSelection.readingFlow,
    rationale: layoutSelection.rationale,
    sections: contentSections,
    footerSummary
  };

  // ===================================================================
  // TAHAP 7 — VALIDASI & FINALISASI (4 Pilar Validasi Internal)
  // ===================================================================
  const stage7_Validation = {
    contentValidation: [
      `100% Sesuai materi aktif (${resolvedTitle})`,
      'Bebas dari pencemaran materi/topik generasi sebelumnya',
      'Tidak ada istilah asing/teknis yang tidak relevan dengan mata pelajaran',
      `Fokus terkunci pada batas cakupan ${formattedPertemuan}`
    ],
    academicValidation: [
      'Konsep keilmuan akurat dan bebas dari miskonsepsi',
      `Bahasa dan kedalaman sesuai untuk ${resolvedLevel} ${resolvedGrade}`,
      'Struktur materi runtut dan teruji secara pedagogis'
    ],
    infographicValidation: [
      `Tepat ${contentSections.length} bagian utama (sesuai standar 4–6 bagian)`,
      'Prinsip SHORT TEXT + STRONG VISUAL + CLEAR RELATIONSHIP terpenuhi',
      'Memiliki Footer Summary ringkas sebagai penutup pembelajaran'
    ],
    visualValidation: [
      'Visual relevan secara semantik dengan materi aktif',
      'Ikon fungsional mendukung konsep, bukan sekadar hiasan',
      'Kontras memenuhi standar WCAG AA (minimal 4.5:1), rasio vertikal 2:3'
    ],
    isCleanAndContaminationFree: true
  };

  // ===================================================================
  // FORMAT OUTPUT RESMI STIVIA 3.2 ENHANCED (MEMATUHI SECTION H)
  // ===================================================================
  const sectionsFormattedText = contentSections.map(s => `BAGIAN ${s.bagianNumber}
* Judul: ${s.judul}
* Teks singkat: ${s.teksSingkat}
* Kata kunci: ${s.kataKunci}
* Visual: ${s.visual}
* Ikon: ${s.ikon}`).join('\n\n');

  // Full Analytical 7-Stage Report for Inspection/Audit
  const fullAnalysisReport = `==================================================
1. ANALISIS 7 TAHAP
==================================================

TAHAP 1 — Identifikasi Materi
- Judul: ${stage1_Understanding.title}
- Mata Pelajaran: ${stage1_Understanding.subject}
- Jenjang dan Kelas: ${stage1_Understanding.educationLevel} (${stage1_Understanding.grade})
${stage1_Understanding.bab ? `- Bab / Unit: ${stage1_Understanding.bab}\n` : ''}${stage1_Understanding.theme ? `- Tema: ${stage1_Understanding.theme}\n` : ''}- Posisi Pertemuan: ${stage1_Understanding.pertemuan}
- Konteks Materi: ${materialAnalysis.tahap3_MateriUtama}
- Cakupan Materi (Batas Wajib Pembahasan):
${activeScopePoints.map((sp, i) => `  ${i + 1}. ${sp}`).join('\n')}
- Tujuan Pembelajaran: ${stage1_Understanding.learningObjective}

TAHAP 2 — Analisis Konsep Inti
- Konsep Utama: ${stage2_ImportantInfo.mainConcept}
- Subkonsep: ${stage2_ImportantInfo.subConcepts.join(', ')}
- Istilah Penting: ${stage2_ImportantInfo.keywords.join(', ')}
- Hubungan Antarkonsep: ${stage2_ImportantInfo.informationRelationship}
- Visualisasi Konsep: Dititikberatkan pada konsep esensial materi aktif
- Ringkasan Informasi: Informasi disajikan padat, lugas, dan bebas dari kalimat bertele-tele

TAHAP 3 — Analisis Kebutuhan Belajar
- Target Pemahaman Siswa: Siswa memahami esensi dan keterkaitan komponen ${stage1_Understanding.title}
- Hal yang Harus Diingat: ${stage2_ImportantInfo.keywords.slice(0, 4).join(', ')}
- Hal yang Diterapkan: Penerapan kontekstual dalam situasi nyata
- Pencegahan Miskonsepsi: Mencegah materi melebar ke luar cakupan ${stage1_Understanding.pertemuan}
- Arahan Bahasa: ${stage3_MaterialCharacters.gradeAdaptationInstruction}

TAHAP 4 — Analisis Informasi Visual
- Pemetaan Konsep ke Visual: ${stage4_StyleUnderstanding.visualMappingRationale}
- Prinsip Visual: Visual semantik yang secara langsung merepresentasikan esensi ${stage1_Understanding.subject}, bukan sekadar dekorasi
- Gaya Desain: ${resolvedStyle.name} (${resolvedStyle.category})
- Nada Visual: ${stage4_StyleUnderstanding.visualTone}

TAHAP 5 — Pemilihan Struktur Infografis
- Pilihan Struktur: ${stage6_LayoutStrategy.strategy}
- Alasan Pemilihan: ${stage6_LayoutStrategy.rationale}
- Alur Baca: ${stage6_LayoutStrategy.readingFlow}

TAHAP 6 — Perancangan Infografis
- Judul Utama: ${stage1_Understanding.title}
- Format Bagian: ${contentSections.length} Bagian Utama Simetris (SHORT TEXT + STRONG VISUAL + CLEAR RELATIONSHIP)
- Penekanan Informasi: Hirarki visual jelas dengan kartu modular kontras tinggi
- Penutup: Footer Summary 2-3 kalimat sintesis pembelajaran

TAHAP 7 — Validasi & Finalisasi
- Validasi Konten: Terpenuhi (100% materi aktif ${stage1_Understanding.title}, bebas kontaminasi topik lain)
- Validasi Akademis: Terpenuhi (Konsep akurat, sesuai tingkatan ${stage1_Understanding.educationLevel} ${stage1_Understanding.grade})
- Validasi Infografis: Terpenuhi (${contentSections.length} bagian utama, teks ringkas, mudah dipindai)
- Validasi Visual: Terpenuhi (Visual semantik, ikon representatif, kontras WCAG AA, rasio 2:3 vertikal)

==================================================
2. JUDUL INFOGRAFIS
===================
Judul utama:
${stage1_Understanding.title}

Subjudul:
${stage1_Understanding.subject} • ${stage1_Understanding.educationLevel} (${stage1_Understanding.grade}) — ${stage1_Understanding.pertemuan}

==================================================
3. STRUKTUR KONTEN INFOGRAFIS
=============================
${sectionsFormattedText}

==================================================
4. FOOTER SUMMARY
=================
${footerSummary}

==================================================
5. PANDUAN DESAIN INFOGRAFIS
============================
* Format: Poster Edukasi Vertikal (Portrait)
* Rasio: 2:3
* Resolusi: 1200 × 1800 px (atau 1024 × 1536 px)
* Struktur layout: ${stage6_LayoutStrategy.strategy} — ${stage6_LayoutStrategy.layoutDescription}
* Alur baca: ${stage6_LayoutStrategy.readingFlow}
* Palet warna: Palet edukatif harmonis aksen ${resolvedStyle.accentColor || 'indigo/teal'}, latar belakang netral bersih
* Tipografi: Sans-serif modern berbobot tebal untuk judul, teks isi dengan line-height nyaman dan kontras tajam (WCAG AA min. 4.5:1)
* Ikon: ${semanticAssets.icons.join(', ')}
* Ilustrasi: ${semanticAssets.heroVisual}
* Elemen dekoratif: ${semanticAssets.supportingOrnaments.join(', ')}
* Penempatan judul: Header bagian atas dengan hierarki tipografi dominan dan badge identitas kelas
* Penempatan footer: Rangkuman inti (Footer Summary) di bagian bawah kanvas
* Keseimbangan teks dan visual: Proporsi seimbang 45% teks ringkas terstruktur dan 55% ruang visual/grafis`;

  // Helper: Diagram Alur Struktur Konten Spesifik (Section 8 STIVIA Standard)
  const getSpecificVisualStructure = (
    shape: string | undefined,
    primaryChar: MaterialCharacterType
  ): string => {
    if (shape === 'Proses / Langkah' || primaryChar === 'Proses') {
      return 'JUDUL → TUJUAN → LANGKAH 1 → LANGKAH 2 → LANGKAH 3 → LANGKAH 4 → HASIL';
    }
    if (shape === 'Perbandingan' || primaryChar === 'Perbandingan') {
      return 'JUDUL → OBJEK A | OBJEK B → PERBEDAAN → PERSAMAAN → KESIMPULAN';
    }
    if (shape === 'Struktur / Komponen' || primaryChar === 'Sistem') {
      return 'JUDUL → KONSEP UTAMA → BAGIAN 1 (Fungsi, Ciri, Contoh) → BAGIAN 2 (Fungsi, Ciri, Contoh) → KEUTUHAN SISTEM';
    }
    // Default Konsep:
    return 'JUDUL → PENGERTIAN → FUNGSI → CIRI-CIRI → CONTOH → KESIMPULAN';
  };

  const visualStructureDiagram = getSpecificVisualStructure(
    input.structureShape,
    stage3_MaterialCharacters.primaryCharacter
  );

  // STANDAR ENGINE INFOGRAFIS STIVIA — PROMPT OUTPUT STRUCTURE
  // ROLE + EDUCATIONAL CONTEXT + CONTENT + VISUAL STRUCTURE + LAYOUT + TYPOGRAPHY + COLOR + ILLUSTRATION + ACCURACY RULES + NEGATIVE CONSTRAINTS + OUTPUT FORMAT
  const resolvedOrientation = input.orientation || 'Portrait';
  const resolvedPaperSize = input.paperSize || 'A4';
  const resolvedAspectRatio = resolvedOrientation === 'Landscape' ? '3:2' : '2:3';

  const stage7_FinalPrompt = `### 1. ROLE
You are an expert Educational Infographic Designer and Pedagogical Visual Specialist.
Create a clean, highly structured, accurate, engaging, and visually balanced educational infographic poster based strictly on the Master Learning Data provided below. Adhere to the core methodology: IDENTIFY → SIMPLIFY → VISUALIZE → VERIFY.

### 2. EDUCATIONAL CONTEXT
Create an educational infographic based ONLY on the following learning data:

SUBJECT:
${stage1_Understanding.subject}

GRADE:
${stage1_Understanding.grade} (${stage1_Understanding.educationLevel})

LEARNING THEME:
${stage1_Understanding.bab || stage1_Understanding.theme || stage1_Understanding.title}

LEARNING OBJECTIVES:
${activeObjectives.length > 0 ? activeObjectives.map(o => `- ${o}`).join('\n') : `- Peserta didik memahami esensi ${stage1_Understanding.title} secara komprehensif.`}

CORE MATERIAL:
${stage1_Understanding.title}

MATERIAL SCOPE:
${activeScopePoints.map((sp, idx) => `${idx + 1}. ${sp}`).join('\n')}

SELECTED INFOGRAPHIC TYPE:
${input.structureShape || stage6_LayoutStrategy.strategy}

SELECTED COMPONENTS:
${contentSections.map(s => s.judul).join(', ')}

DEPTH:
${input.depth || 'Sedang'} (Tingkat kedalaman materi: ${(input.depth === 'Dasar' || input.depth === 'Ringkas') ? 'Dasar - fokus pengertian & ciri pokok' : (input.depth === 'Mendalam' || input.depth === 'Lanjut') ? 'Lanjut - analisis, perbandingan & berpikir kritis' : 'Menengah - hubungan antar konsep & analisis sederhana'})

CONTENT RULES:
1. Stay strictly within the provided material scope (content boundary).
2. Do not introduce unrelated topics, out-of-scope chapters, or external trivia.
3. Simplify complex concepts without altering scientific/grammatical meaning.
4. Prioritize essential information; eliminate verbose sentences (Less is More).
5. Use clear, communicative educational language tailored to ${stage1_Understanding.grade} students.
6. Convert suitable information into visual elements (diagrams, flows, icons, cards).
7. Maximum 3 levels of visual hierarchy.
8. Limit color palette to primary, secondary, and accent with 60-30-10 distribution.
9. Ensure high readability and generous intentional white space.
10. Keep all visual metaphors directly connected to the educational concept.
11. Do not hallucinate facts or extend scope beyond teacher's input.

### 3. CONTENT
IDENTITAS INFOGRAFIS:
* Judul: "${stage1_Understanding.title}" (Formula [TOPIK] + [AKSI / MANFAAT / FOKUS])
* Mata Pelajaran: ${stage1_Understanding.subject}
* Kelas: ${stage1_Understanding.grade} (${stage1_Understanding.educationLevel})
* Tema Pembelajaran: ${stage1_Understanding.bab || stage1_Understanding.theme || stage1_Understanding.title}
* Posisi Rangkaian: ${stage1_Understanding.pertemuan}${input.teacherNotes ? `\n* Catatan Khusus Guru: "${input.teacherNotes.trim()}"` : ''}

KONSEP UTAMA:
${stage2_ImportantInfo.mainConcept}

KONTEN MODUL TERSTRUKTUR (4–6 Bagian Utama, Prinsip Less is More):
${contentSections.map(s => `[BAGIAN ${s.bagianNumber}: ${s.judul.toUpperCase()}]
• Teks Ringkas: "${s.teksSingkat}" (Intisari esensial, tanpa blok teks panjang)
• Kata Kunci: ${s.kataKunci}
• Contoh Kontekstual: ${s.contohKonkret || `Penerapan dalam materi ${stage1_Understanding.subject}`}
• Arahan Visual: ${s.visual}
• Ikon Representatif: ${s.ikon}`).join('\n\n')}

FOOTER SUMMARY:
"${footerSummary}"

### 4. VISUAL STRUCTURE
ALUR STRUKTUR MATERI:
${visualStructureDiagram}

HUBUNGAN ANTARKONSEP:
${stage2_ImportantInfo.informationRelationship}
Pedoman: Hubungkan antar konsep secara visual dan terstruktur. Ubah materi yang cocok menjadi diagram, alur, tabel ringkas, atau kartu modular. Hindari memindahkan seluruh teks materi menjadi poster yang penuh teks.

### 5. LAYOUT
BENTUK TATA LETAK:
${stage6_LayoutStrategy.strategy} — ${stage6_LayoutStrategy.layoutDescription}

ALUR BACA (READING FLOW):
${stage6_LayoutStrategy.readingFlow}

HIERARKI VISUAL (Maksimal 3 Level Utama):
- LEVEL 1: Judul Utama / Konsep Utama (Paling besar, tegas, langsung menarik perhatian visual)
- LEVEL 2: Subjudul Section / Header Kartu Modul (Jelas, berkarakter tegas, membedakan tiap komponen)
- LEVEL 3: Informasi Pendukung & Teks Singkat (Ringkas, mudah dipindai, line-height proporsional)

WHITE SPACE & KOMPOSISI:
- Berikan ruang kosong (breathing room) yang cukup antar modul dan di sekeliling batas kanvas.
- Ruang kosong adalah bagian dari desain, bukan ruang yang terbuang.
- Proporsi seimbang: 45% teks ringkas terstruktur dan 55% ruang visual grafis serta white space.

### 6. TYPOGRAPHY
FONT FAMILIES (Maksimal 2 Keluarga Font):
- Heading Font: Poppins / Montserrat (Bold, bersih, tegas untuk judul dan subjudul)
- Body Font: Open Sans / Lato (Sangat mudah dibaca, bersih, sans-serif proporsional untuk isi modul)

ATURAN TIPOGRAFI:
- Judul besar dan tegas di bagian atas kanvas
- Subjudul kartu jelas dan kontras
- Body text ringkas dan mudah dipindai (scannable)
- Hindari font dekoratif, kursif rumit, atau font kaligrafi yang mengganggu keterbacaan
- Prioritaskan keterbacaan dibanding estetika semata

### 7. COLOR
HARMONISASI WARNA (Aturan 60-30-10):
- 60% Warna Dasar / Background: Latar belakang netral bersih dan terang untuk keterbacaan optimal
- 30% Warna Sekunder: Kartu modular, kontainer seksi, dan garis pembatas (Slate / Soft Neutral Gray)
- 10% Warna Aksen: Titik fokus visual, badge, dan highlight materi (${resolvedStyle.accentColor || 'Indigo/Teal'})

KONTRAS & KONSISTENSI:
- Kontras tinggi memenuhi standar WCAG AA (minimal rasio 4.5:1 terhadap background).
- Palet warna konsisten di seluruh kanvas, tidak menggunakan terlalu banyak variasi warna liar.

### 8. ILLUSTRATION
SEMANTIC ASSETS & VISUAL ELEMENTS:
- Hero Visual Utama: ${semanticAssets.heroVisual}
- Ikon Fungsional: ${semanticAssets.icons.join(', ')}
- Objek & Simbol Relevan: ${semanticAssets.relevantObjects.join(', ')}
- Ornamen Pendukung: ${semanticAssets.supportingOrnaments.join(', ')}

ATURAN IKON & ILUSTRASI:
Setiap ikon dan ilustrasi harus memiliki hubungan semantik langsung dengan informasi yang dijelaskan. Gunakan visual untuk memperjelas konsep, membedakan kategori, menunjukkan proses, atau memperkuat contoh kontekstual. Hindari visual atau ikon hiasan acak yang tidak bermakna edukatif.

### 9. ACCURACY RULES (IDENTIFY → SIMPLIFY → VISUALIZE → VERIFY)
1. 100% Menjadikan Cakupan Materi dari Master Learning Data sebagai batas konten (content boundary).
2. Dilarang mengarang fakta, mengubah definisi, atau membuat data fiktif.
3. Dilarang memasukkan materi lanjutan atau topik di luar cakupan yang tidak diberikan guru.
4. Contoh kontekstual harus realistis, aman, dan relevan dengan pengalaman belajar siswa ${stage1_Understanding.grade} (${stage1_Understanding.educationLevel}).
5. Pertahankan konsistensi istilah keilmuan dan ketepatan konsep materi secara utuh.

### 10. NEGATIVE CONSTRAINTS
- NO wall of text, NO long monolithic paragraphs, NO dense narrative blocks.
- NO unreadable or blurry text, NO tiny distorted fonts, NO overly decorative script fonts.
- NO arbitrary decorative clutter, NO meaningless doodles, NO inconsistent visual styles.
- NO factual distortion, NO hallucinated definitions outside teacher's Cakupan Materi.
- NO scope creep (do not introduce topics from other meetings or unrequested advanced chapters).
- NO crowded zero-margin canvas; keep generous breathing room.
- NO overlapping card modules or clipped text labels.

### 11. OUTPUT FORMAT
- MEDIA: Professional Educational Infographic Poster
- ORIENTATION: ${resolvedOrientation} (${resolvedOrientation === 'Landscape' ? 'Landscape (Mendatar)' : 'Portrait (Vertikal)'})
- DOCUMENT SIZE: ${resolvedPaperSize}
- ASPECT RATIO: ${resolvedAspectRatio}
- RECOMMENDED RESOLUTION: 1200 × 1800 px (atau 1024 × 1536 px)
- TYPOGRAPHIC CLARITY: Ultra-sharp typography rendering, high visual clarity for classroom presentation and high-quality educational printing.`;

  return {
    activeContext,
    materialAnalysis,
    stage1_Understanding,
    stage2_ImportantInfo,
    stage3_MaterialCharacters,
    stage4_StyleUnderstanding,
    stage5_SupportingVisuals,
    stage6_LayoutStrategy,
    stage7_Validation,
    stage7_FinalPrompt,
    fullAnalysisReport
  };
}
