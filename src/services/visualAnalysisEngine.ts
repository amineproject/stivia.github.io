import { ActiveProjectContext, VisualElementType, InformationType } from '../types';

export interface AnalyzedVisualObject {
  name: string;
  category: string;
  iconHint: string;
  visualRole: string;
  colorCue: string;
}

export interface VisualContentAnalysis {
  topicDomain: string;
  primarySubjectArea: 'sains' | 'bahasa' | 'matematika' | 'sosial_humaniora' | 'teknologi' | 'seni_budaya' | 'umum';
  keyConcepts: string[];
  visualObjects: AnalyzedVisualObject[];
  recommendedConceptModel: 'hero_visual' | 'concept_map' | 'storytelling' | 'timeline' | 'process_flow' | 'comparison' | 'data_focus' | 'modular_information';
  focalIllustrationType: string;
  semanticKeywords: string[];
  visualMetaphor: string;
  colorToneSuggestion: string;
}

/**
 * TAHAP 1 — ANALISIS KONTEN VISUAL (STIVIA Engine)
 * 
 * Menganalisis materi pembelajaran secara mendalam untuk menemukan objek visual,
 * metafora edukatif, dan konsep representasi yang relevan dengan topik pengguna.
 */
export function analyzeVisualContent(context: ActiveProjectContext): VisualContentAnalysis {
  const { mataPelajaran = '', materi = '', tema = '', cakupanMateri = '', jenjang = '', kelas = '' } = context;
  const fullText = `${mataPelajaran} ${materi} ${tema} ${cakupanMateri}`.toLowerCase();

  // 1. Domain Detection
  let primarySubjectArea: VisualContentAnalysis['primarySubjectArea'] = 'umum';
  let topicDomain = 'Pembelajaran Umum';

  if (
    fullText.includes('ipa') || 
    fullText.includes('biologi') || 
    fullText.includes('fisika') || 
    fullText.includes('kimia') || 
    fullText.includes('ekosistem') || 
    fullText.includes('fotosintesis') || 
    fullText.includes('pernapasan') || 
    fullText.includes('tata surya') || 
    fullText.includes('sel') ||
    fullText.includes('energi') ||
    fullText.includes('zat')
  ) {
    primarySubjectArea = 'sains';
    topicDomain = 'Sains & Alam (IPA)';
  } else if (
    fullText.includes('bahasa') || 
    fullText.includes('iklan') || 
    fullText.includes('teks') || 
    fullText.includes('puisi') || 
    fullText.includes('slogan') || 
    fullText.includes('cerpen') || 
    fullText.includes('paragraf') || 
    fullText.includes('literasi')
  ) {
    primarySubjectArea = 'bahasa';
    topicDomain = 'Bahasa & Komunikasi';
  } else if (
    fullText.includes('matematika') || 
    fullText.includes('aljabar') || 
    fullText.includes('geometri') || 
    fullText.includes('pecahan') || 
    fullText.includes('perbandingan') || 
    fullText.includes('statistik') || 
    fullText.includes('hitung') || 
    fullText.includes('skala')
  ) {
    primarySubjectArea = 'matematika';
    topicDomain = 'Matematika & Logika';
  } else if (
    fullText.includes('ips') || 
    fullText.includes('sejarah') || 
    fullText.includes('geografi') || 
    fullText.includes('ekonomi') || 
    fullText.includes('sosiologi') || 
    fullText.includes('pancasila') || 
    fullText.includes('ppkn') || 
    fullText.includes('kerajaan') || 
    fullText.includes('kemerdekaan')
  ) {
    primarySubjectArea = 'sosial_humaniora';
    topicDomain = 'Sosial, Sejarah & Humaniora';
  } else if (
    fullText.includes('informatika') || 
    fullText.includes('komputer') || 
    fullText.includes('kecerdasan buatan') || 
    fullText.includes('ai') || 
    fullText.includes('coding') || 
    fullText.includes('jaringan') || 
    fullText.includes('internet') || 
    fullText.includes('algoritma')
  ) {
    primarySubjectArea = 'teknologi';
    topicDomain = 'Teknologi & Informatika';
  } else if (
    fullText.includes('seni') || 
    fullText.includes('musik') || 
    fullText.includes('tari') || 
    fullText.includes('rupa') || 
    fullText.includes('budaya') || 
    fullText.includes('prakarya')
  ) {
    primarySubjectArea = 'seni_budaya';
    topicDomain = 'Seni & Kebudayaan';
  }

  // 2. Visual Objects & Key Concepts Extraction
  const visualObjects: AnalyzedVisualObject[] = [];
  const keyConcepts: string[] = [];
  let visualMetaphor = `Visualisasi Terpadu ${materi}`;
  let focalIllustrationType = 'concept_diagram';
  let recommendedConceptModel: VisualContentAnalysis['recommendedConceptModel'] = 'modular_information';

  // Specific Subject & Topic Mapping
  if (fullText.includes('iklan') || fullText.includes('poster') || fullText.includes('slogan')) {
    visualObjects.push(
      { name: 'Headline & Tipografi Persuasif', category: 'Verbal', iconHint: 'Megaphone', visualRole: 'Pesan Utama', colorCue: 'amber' },
      { name: 'Ilustrasi Visual & Desain', category: 'Visual', iconHint: 'Image', visualRole: 'Daya Tarik Mata', colorCue: 'indigo' },
      { name: 'Call to Action (Ajakan)', category: 'Interaksi', iconHint: 'MousePointerClick', visualRole: 'Respon Target', colorCue: 'emerald' },
      { name: 'Media Publikasi / Media Massa', category: 'Kanal', iconHint: 'Radio', visualRole: 'Penyebaran Luas', colorCue: 'rose' }
    );
    keyConcepts.push('Bahasa Persuasif', 'Struktur Iklan', 'Fungsi Komersial & Sosial', 'Call to Action');
    visualMetaphor = 'Bagan Komunikasi Persuasif dari Pesan Pengiklan menuju Tindakan Konsumen';
    focalIllustrationType = 'ad_campaign_breakdown';
    recommendedConceptModel = 'concept_map';
  } else if (fullText.includes('fotosintesis') || fullText.includes('tumbuhan') || fullText.includes('klorofil')) {
    visualObjects.push(
      { name: 'Cahaya Matahari (Foton)', category: 'Energi Input', iconHint: 'Sun', visualRole: 'Pemicu Reaksi', colorCue: 'amber' },
      { name: 'Kloroplas & Daun', category: 'Organel', iconHint: 'Leaf', visualRole: 'Pabrik Kimia Alami', colorCue: 'emerald' },
      { name: 'Karbon Dioksida (CO2) & Air (H2O)', category: 'Bahan Baku', iconHint: 'Droplets', visualRole: 'Reaktan', colorCue: 'cyan' },
      { name: 'Glukosa & Oksigen (O2)', category: 'Hasil Output', iconHint: 'Wind', visualRole: 'Nutrisi & Nafas Bumi', colorCue: 'teal' }
    );
    keyConcepts.push('Reaksi Terang & Gelap', 'Penyerapan Cahaya', 'Pembentukan Energi', 'Siklus Oksigen');
    visualMetaphor = 'Laboratorium Alami Daun Mengubah Foton dan Air Menjadi Energi Kehidupan';
    focalIllustrationType = 'photosynthesis_cycle';
    recommendedConceptModel = 'process_flow';
  } else if (fullText.includes('ekosistem') || fullText.includes('rantai makanan') || fullText.includes('simbiosis')) {
    visualObjects.push(
      { name: 'Produsen (Tumbuhan Hijau)', category: 'Tingkat Trofik 1', iconHint: 'Trees', visualRole: 'Penyedia Energi', colorCue: 'emerald' },
      { name: 'Konsumen Primer & Sekunder', category: 'Tingkat Trofik 2-3', iconHint: 'PawPrint', visualRole: 'Aliran Energi', colorCue: 'amber' },
      { name: 'Pengurai / Dekomposer', category: 'Siklus Materi', iconHint: 'Recycle', visualRole: 'Daur Ulang Hara', colorCue: 'stone' },
      { name: 'Faktor Abiotik (Tanah, Air, Udara)', category: 'Lingkungan', iconHint: 'Mountain', visualRole: 'Penopang Hayati', colorCue: 'sky' }
    );
    keyConcepts.push('Jaring-jaring Makanan', 'Piramida Energi', 'Keseimbangan Ekosistem', 'Interaksi Biotik-Abiotik');
    visualMetaphor = 'Piramida & Jaring Kehidupan yang Saling Bergantung Menjaga Harmoni Bumi';
    focalIllustrationType = 'ecosystem_food_web';
    recommendedConceptModel = 'concept_map';
  } else if (fullText.includes('pernapasan') || fullText.includes('paru-paru') || fullText.includes('alveolus')) {
    visualObjects.push(
      { name: 'Saluran Pernapasan (Hidung-Trakea)', category: 'Jalur Masuk', iconHint: 'Wind', visualRole: 'Penyaring Udara', colorCue: 'sky' },
      { name: 'Paru-paru & Bronkus', category: 'Organ Utama', iconHint: 'Activity', visualRole: 'Distribusi Gas', colorCue: 'rose' },
      { name: 'Alveolus & Kapiler Darah', category: 'Tempat Difusi', iconHint: 'CircleDot', visualRole: 'Pertukaran O2/CO2', colorCue: 'indigo' },
      { name: 'Otot Diafragma', category: 'Penggerak Mekanik', iconHint: 'MoveVertical', visualRole: 'Pompa Inspirasi-Ekspirasi', colorCue: 'teal' }
    );
    keyConcepts.push('Inspirasi vs Ekspirasi', 'Difusi Gas Alveolus', 'Fungsi Hemoglobin', 'Kesehatan Pernapasan');
    visualMetaphor = 'Mekanisme Pompa Pertukaran Gas Oksigen dan Karbondioksida dalam Tubuh';
    focalIllustrationType = 'respiratory_mechanism';
    recommendedConceptModel = 'comparison';
  } else if (fullText.includes('perbandingan') || fullText.includes('skala') || fullText.includes('pecahan')) {
    visualObjects.push(
      { name: 'Besaran A (Nilai Input)', category: 'Variabel 1', iconHint: 'Hash', visualRole: 'Data Awal', colorCue: 'indigo' },
      { name: 'Operator Relasi / Rasio', category: 'Hubungan', iconHint: 'ArrowRightLeft', visualRole: 'Perbandingan Tetap', colorCue: 'amber' },
      { name: 'Besaran B (Nilai Target)', category: 'Variabel 2', iconHint: 'Scale', visualRole: 'Hasil Terhitung', colorCue: 'emerald' },
      { name: 'Tabel Nilai & Grafik', category: 'Representasi', iconHint: 'BarChart2', visualRole: 'Pola Perubahan', colorCue: 'sky' }
    );
    keyConcepts.push('Rasio Senilai', 'Rasio Berbalik Nilai', 'Perkalian Silang', 'Pemodelan Soal Cerita');
    visualMetaphor = 'Timbangan Proporsi Matematis Membuktikan Hubungan Antar-Variabel';
    focalIllustrationType = 'math_proportion_matrix';
    recommendedConceptModel = 'comparison';
  } else if (fullText.includes('ai') || fullText.includes('kecerdasan buatan') || fullText.includes('teknologi') || fullText.includes('komputer')) {
    visualObjects.push(
      { name: 'Data Masukan (Dataset)', category: 'Input', iconHint: 'Database', visualRole: 'Bahan Pelatihan', colorCue: 'cyan' },
      { name: 'Model Jaringan Syaraf (Neural Net)', category: 'Pemrosesan', iconHint: 'Cpu', visualRole: 'Pengenalan Pola', colorCue: 'indigo' },
      { name: 'Algoritma Deep Learning', category: 'Logika', iconHint: 'GitBranch', visualRole: 'Penalaran Mesin', colorCue: 'violet' },
      { name: 'Prediksi & Output Solutif', category: 'Hasil', iconHint: 'Sparkles', visualRole: 'Keputusan Cerdas', colorCue: 'emerald' }
    );
    keyConcepts.push('Machine Learning', 'Pengenalan Pola', 'Etika AI', 'Otomasi Solutif');
    visualMetaphor = 'Jaringan Saraf Digital Memproses Big Data Menjadi Tindakan Cerdas Terarah';
    focalIllustrationType = 'ai_neural_pipeline';
    recommendedConceptModel = 'hero_visual';
  } else {
    // General Domain Generator
    visualObjects.push(
      { name: 'Konsep Dasar', category: 'Pondasi', iconHint: 'BookOpen', visualRole: 'Pilar Pemahaman', colorCue: 'indigo' },
      { name: 'Struktur & Bagian', category: 'Anatomi', iconHint: 'LayoutGrid', visualRole: 'Elemen Pembentuk', colorCue: 'teal' },
      { name: 'Proses & Alur', category: 'Dinamika', iconHint: 'Workflow', visualRole: 'Langkah Operasional', colorCue: 'amber' },
      { name: 'Aplikasi Kontekstual', category: 'Penerapan', iconHint: 'CheckCircle2', visualRole: 'Manfaat Nyata', colorCue: 'emerald' }
    );
    keyConcepts.push('Definisi Inti', 'Unsur Utama', 'Proses Kerja', 'Manfaat Kehidupan');
    visualMetaphor = `Struktur Konseptual dan Penerapan Terpadu Materi ${materi}`;
    focalIllustrationType = 'modular_concept_grid';
    recommendedConceptModel = 'modular_information';
  }

  // Determine Concept Model if material is heavily process/timeline/comparison oriented
  if (fullText.includes('sejarah') || fullText.includes('peristiwa') || fullText.includes('kronologi') || fullText.includes('abad') || fullText.includes('tahun')) {
    recommendedConceptModel = 'timeline';
  } else if (fullText.includes('tahap') || fullText.includes('siklus') || fullText.includes('langkah') || fullText.includes('alur') || fullText.includes('proses')) {
    recommendedConceptModel = 'process_flow';
  } else if (fullText.includes('perbedaan') || fullText.includes('jenis') || fullText.includes('banding') || fullText.includes('vs') || fullText.includes('klasifikasi')) {
    recommendedConceptModel = 'comparison';
  }

  // Keywords extraction
  const semanticKeywords = [
    materi,
    tema,
    mataPelajaran,
    ...keyConcepts,
    ...visualObjects.map(o => o.name)
  ].filter(Boolean);

  let colorToneSuggestion = 'Harmonis Edukatif (Indigo - Teal - Amber)';
  if (primarySubjectArea === 'sains') colorToneSuggestion = 'Alam & Hayati (Emerald - Teal - Amber)';
  if (primarySubjectArea === 'matematika') colorToneSuggestion = 'Eksak & Rasional (Blue - Cyan - Slate)';
  if (primarySubjectArea === 'bahasa') colorToneSuggestion = 'Komunikatif & Hangat (Indigo - Rose - Amber)';
  if (primarySubjectArea === 'teknologi') colorToneSuggestion = 'Futuristik Modern (Cyan - Violet - Fuchsia)';
  if (primarySubjectArea === 'sosial_humaniora') colorToneSuggestion = 'Klasik & Bernilai (Stone - Amber - Terracotta)';

  return {
    topicDomain,
    primarySubjectArea,
    keyConcepts,
    visualObjects,
    recommendedConceptModel,
    focalIllustrationType,
    semanticKeywords,
    visualMetaphor,
    colorToneSuggestion,
  };
}
