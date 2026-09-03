import {
  InfographicDraft,
  MaterialBlock,
  CaseStudyData,
  SynthesisStep,
  ActiveProjectContext,
  EducationLevel,
  InfographicFormat,
  VisualLevel,
  ExampleContext,
  ComparisonRow,
  ProcessStep,
  ConceptDiagramData,
  ComponentItem,
  ApplicationPillar,
  VisualElementType,
  InformationType,
  VisualType,
  LayoutType,
  ContentPriority,
  LayoutConfig,
} from '../types';
import { getStyleConfig } from './styleSystem';
import { determineLayoutArchetype } from './layoutEngine';
import { runContentEnginePipeline } from '../services/contentEnginePipeline';

/**
 * Pedagogical Section Types and Stages
 */
export type PedagogicalStage = 
  | 'pengertian'
  | 'tujuan'
  | 'fungsi'
  | 'ciri_karakteristik'
  | 'unsur_komponen'
  | 'jenis_variasi'
  | 'proses_alur'
  | 'peran_kehidupan'
  | 'rumus_kalkulasi'
  | 'rangkuman';

export interface AnalyzedScopeItem {
  rawText: string;
  cleanTitle: string;
  stage: PedagogicalStage;
  visualType: VisualElementType;
  tag: string;
  informationType: InformationType;
  visualTypeT2: VisualType;
  layoutType: LayoutType;
  layoutConfig?: LayoutConfig;
}

/**
 * Robust, intelligent parser that extracts strictly all required topics from user's Cakupan Materi
 * Handles commas, "dan", "serta", semicolons, bullet points, numbers, and newlines
 */
export function parseScopeToRequiredTopics(rawScope: string, topicName: string = ''): string[] {
  if (!rawScope || !rawScope.trim()) {
    const topicLabel = topicName.trim() || 'Materi';
    return [
      `Pengertian ${topicLabel}`,
      `Tujuan & Fungsi Pokok`,
      `Ciri-Ciri Utama`,
      `Peran dalam Kehidupan Sehari-hari`
    ];
  }

  // 1. Clean bullet characters & line breaks
  let cleaned = rawScope
    .replace(/\r\n/g, '\n')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '\n')
    .trim();

  // Split into initial chunks
  const lineSplits = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  const rawItems: string[] = [];

  if (lineSplits.length > 1) {
    for (const line of lineSplits) {
      // Strip leading numbering or bullet prefixes: "1. ", "1) ", "a. ", "- ", "* "
      const stripped = line.replace(/^(\d+|[a-zA-Z])[\.\)\-\*•]\s*/, '').trim();
      if (stripped) {
        // If line contains multiple comma-separated items without full sentences, we can parse them
        if (stripped.includes(',') && !stripped.includes('.')) {
          const subParts = stripped.replace(/,\s*(dan|serta|and)\s+/gi, ', ').split(/[,;]+/).map(s => s.trim()).filter(Boolean);
          for (const sp of subParts) {
            const cleanSub = sp.replace(/^(\d+|[a-zA-Z])[\.\)\-\*•]\s*/, '').trim();
            if (cleanSub) rawItems.push(cleanSub);
          }
        } else {
          rawItems.push(stripped);
        }
      }
    }
  } else {
    // Single block of text: e.g. "Pengertian iklan, tujuan, fungsi, ciri-ciri, dan peran iklan dalam kehidupan sehari-hari."
    let text = lineSplits[0] || cleaned;

    // Handle "dan" / "serta" delimiters gracefully
    text = text.replace(/,\s*(dan|serta|and)\s+/gi, ', ');
    text = text.replace(/\s+(dan|serta|and)\s+/gi, ', ');

    const parts = text.split(/[,;]+/).map(p => p.trim()).filter(Boolean);
    for (const part of parts) {
      const stripped = part.replace(/^(\d+|[a-zA-Z])[\.\)\-\*•]\s*/, '').trim();
      if (stripped) {
        rawItems.push(stripped);
      }
    }
  }

  const cleanTopicName = topicName.trim().replace(/^konsep dasar\s+/i, '');
  const lowerTopic = cleanTopicName.toLowerCase();
  const requiredTopics: string[] = [];

  for (let item of rawItems) {
    // Strip trailing punctuation
    item = item.replace(/[\.,;:]+$/, '').trim();
    if (!item || item.length < 2) continue;

    // Capitalize words nicely
    const words = item.split(/\s+/);
    let formatted = words.map((w, idx) => {
      const lower = w.toLowerCase();
      // Keep grammatical prepositions lowercase unless first word
      if (idx > 0 && ['dan', 'atau', 'di', 'ke', 'dari', 'yang', 'dalam', 'untuk', 'pada', 'dengan', 'atas'].includes(lower)) {
        return lower;
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');

    const lowerFormatted = formatted.toLowerCase();

    // Contextual enrichment for short standalone terms
    if (cleanTopicName && !lowerFormatted.includes(lowerTopic)) {
      if (lowerFormatted === 'pengertian' || lowerFormatted === 'definisi' || lowerFormatted === 'konsep') {
        formatted = `${formatted} ${cleanTopicName}`;
      } else if (lowerFormatted === 'tujuan') {
        formatted = `Tujuan ${cleanTopicName}`;
      } else if (lowerFormatted === 'fungsi') {
        formatted = `Fungsi ${cleanTopicName}`;
      } else if (lowerFormatted === 'ciri' || lowerFormatted === 'ciri-ciri' || lowerFormatted === 'karakteristik' || lowerFormatted === 'sifat') {
        formatted = `Ciri-Ciri ${cleanTopicName}`;
      } else if (lowerFormatted === 'unsur' || lowerFormatted === 'unsur-unsur' || lowerFormatted === 'komponen' || lowerFormatted === 'struktur') {
        formatted = `Unsur & Struktur ${cleanTopicName}`;
      } else if (lowerFormatted === 'jenis' || lowerFormatted === 'jenis-jenis' || lowerFormatted === 'macam' || lowerFormatted === 'klasifikasi') {
        formatted = `Jenis & Klasifikasi ${cleanTopicName}`;
      } else if (lowerFormatted === 'peran' || lowerFormatted === 'peranan' || lowerFormatted === 'manfaat') {
        formatted = `Peran ${cleanTopicName} dalam Kehidupan`;
      } else if (lowerFormatted === 'proses' || lowerFormatted === 'alur' || lowerFormatted === 'tahapan' || lowerFormatted === 'langkah') {
        formatted = `Alur & Tahapan ${cleanTopicName}`;
      }
    }

    if (formatted && !requiredTopics.includes(formatted)) {
      requiredTopics.push(formatted);
    }
  }

  // Fallback if empty
  if (requiredTopics.length === 0) {
    const topicLabel = cleanTopicName || 'Materi';
    return [
      `Pengertian ${topicLabel}`,
      `Tujuan & Fungsi Pokok`,
      `Ciri-Ciri Utama`,
      `Peran dalam Kehidupan Sehari-hari`
    ];
  }

  return requiredTopics;
}

/**
 * Intelligent analyzer that classifies each scope item into the pedagogical pipeline
 */
export function analyzeScopeItem(itemText: string, index: number, topicName: string = '', subjectName: string = ''): AnalyzedScopeItem {
  const clean = itemText.replace(/^(\d+|[a-zA-Z])[\.\)\-\*•]\s*/, '').trim();
  const lower = clean.toLowerCase();

  // 1. Pengertian / Definisi / Konsep Dasar
  if (
    lower.includes('pengertian') || 
    lower.includes('definisi') || 
    lower.includes('konsep') || 
    lower.includes('apa itu') || 
    lower.includes('hakikat') ||
    lower.includes('pengantar') ||
    lower.includes('makna') ||
    (index === 0 && !lower.includes('tujuan') && !lower.includes('fungsi') && !lower.includes('ciri') && !lower.includes('unsur') && !lower.includes('jenis'))
  ) {
    return {
      rawText: itemText,
      cleanTitle: clean,
      stage: 'pengertian',
      visualType: 'diagram_konsep',
      tag: 'PENGENALAN KONSEP',
      informationType: 'definition',
      visualTypeT2: 'hero_definition',
      layoutType: 'hero',
      layoutConfig: { columns: 1, direction: 'vertical', spanFullWidth: true }
    };
  }

  // 2. Tujuan
  if (lower.includes('tujuan') || lower.includes('maksud') || lower.includes('target') || lower.includes('capaian')) {
    return {
      rawText: itemText,
      cleanTitle: clean,
      stage: 'tujuan',
      visualType: 'komponen',
      tag: 'TUJUAN UTAMA',
      informationType: 'goals',
      visualTypeT2: 'goal_cards',
      layoutType: 'three-column',
      layoutConfig: { columns: 3, direction: 'horizontal', spanFullWidth: false }
    };
  }

  // 3. Fungsi & Manfaat
  if (lower.includes('fungsi') || lower.includes('kegunaan') || (lower.includes('manfaat') && !lower.includes('peran'))) {
    return {
      rawText: itemText,
      cleanTitle: clean,
      stage: 'fungsi',
      visualType: 'komponen',
      tag: 'FUNGSI POKOK',
      informationType: 'functions',
      visualTypeT2: 'function_cards',
      layoutType: 'feature-grid',
      layoutConfig: { columns: 2, direction: 'horizontal', spanFullWidth: false }
    };
  }

  // 4. Ciri / Karakteristik / Sifat
  if (lower.includes('ciri') || lower.includes('karakteristik') || lower.includes('sifat') || lower.includes('kaidah') || lower.includes('prinsip')) {
    return {
      rawText: itemText,
      cleanTitle: clean,
      stage: 'ciri_karakteristik',
      visualType: 'tabel_perbandingan',
      tag: 'CIRI-CIRI & SIFAT',
      informationType: 'characteristics',
      visualTypeT2: 'checklist',
      layoutType: 'checklist',
      layoutConfig: { columns: 2, direction: 'vertical', spanFullWidth: false }
    };
  }

  // 5. Unsur / Komponen / Struktur / Bagian / Anatomi
  if (lower.includes('unsur') || lower.includes('komponen') || lower.includes('bagian') || lower.includes('struktur') || lower.includes('anatomi') || lower.includes('elemen')) {
    return {
      rawText: itemText,
      cleanTitle: clean,
      stage: 'unsur_komponen',
      visualType: 'komponen',
      tag: 'UNSUR & STRUKTUR',
      informationType: 'components',
      visualTypeT2: 'component_cards',
      layoutType: 'two-column',
      layoutConfig: { columns: 2, direction: 'horizontal', spanFullWidth: false }
    };
  }

  // 6. Jenis / Macam / Tipe / Klasifikasi / Bentuk / Variasi
  if (lower.includes('jenis') || lower.includes('macam') || lower.includes('tipe') || lower.includes('klasifikasi') || lower.includes('variasi') || lower.includes('perbedaan') || lower.includes('banding') || lower.includes('vs')) {
    return {
      rawText: itemText,
      cleanTitle: clean,
      stage: 'jenis_variasi',
      visualType: 'tabel_perbandingan',
      tag: 'JENIS & KLASIFIKASI',
      informationType: 'comparison',
      visualTypeT2: 'comparison_table',
      layoutType: 'comparison',
      layoutConfig: { columns: 2, direction: 'horizontal', spanFullWidth: false }
    };
  }

  // 7. Alur / Proses / Cara Kerja / Tahapan / Mekanisme / Siklus
  if (lower.includes('tahap') || lower.includes('langkah') || lower.includes('proses') || lower.includes('alur') || lower.includes('mekanisme') || lower.includes('siklus') || lower.includes('cara kerja') || lower.includes('urutan') || lower.includes('metode')) {
    return {
      rawText: itemText,
      cleanTitle: clean,
      stage: 'proses_alur',
      visualType: 'flowchart',
      tag: 'ALUR & TAHAPAN KERJA',
      informationType: 'process',
      visualTypeT2: 'flow_diagram',
      layoutType: 'flow-horizontal',
      layoutConfig: { columns: 4, direction: 'horizontal', spanFullWidth: true }
    };
  }

  // 8. Peran dalam Kehidupan Sehari-hari / Penerapan / Aplikasi / Contoh / Dampak
  if (lower.includes('peran') || lower.includes('kehidupan') || lower.includes('penerapan') || lower.includes('aplikasi') || lower.includes('contoh') || lower.includes('kasus') || lower.includes('implementasi') || lower.includes('dampak')) {
    return {
      rawText: itemText,
      cleanTitle: clean,
      stage: 'peran_kehidupan',
      visualType: 'grafik',
      tag: 'PERAN & PENERAPAN NYATA',
      informationType: 'real_life_context',
      visualTypeT2: 'context_cards',
      layoutType: 'two-column',
      layoutConfig: { columns: 2, direction: 'horizontal', spanFullWidth: false }
    };
  }

  // 9. Rumus / Kalkulasi / Formula
  if (lower.includes('rumus') || lower.includes('hitung') || lower.includes('kalkulasi') || lower.includes('formula') || lower.includes('persamaan')) {
    return {
      rawText: itemText,
      cleanTitle: clean,
      stage: 'rumus_kalkulasi',
      visualType: 'komponen',
      tag: 'FORMULA & KALKULASI',
      informationType: 'components',
      visualTypeT2: 'component_cards',
      layoutType: 'two-column',
      layoutConfig: { columns: 2, direction: 'horizontal', spanFullWidth: false }
    };
  }

  // Default fallback
  return {
    rawText: itemText,
    cleanTitle: clean,
    stage: 'pengertian',
    visualType: 'komponen',
    tag: 'PEMBAHASAN MATERI',
    informationType: 'definition',
    visualTypeT2: 'concept_card',
    layoutType: 'single-column',
    layoutConfig: { columns: 1, direction: 'vertical', spanFullWidth: false }
  };
}

/**
 * Subject Knowledge Generator with Rich Topic Presets & Smart Dynamic Synthesis
 */
export interface TopicContentBundle {
  conceptDiagram: ConceptDiagramData;
  components: ComponentItem[];
  goalComponents?: ComponentItem[];
  functionComponents?: ComponentItem[];
  comparison: { headerA: string; headerB: string; rows: ComparisonRow[] };
  processSteps: ProcessStep[];
  pillars: ApplicationPillar[];
  metrics: { label: string; value: string; percentage?: number; description: string }[];
  highlights: string[];
}

/**
 * Generate deep, domain-specific visual and contextual assets strictly for the active subject and topic
 */
export function generateDomainTopicBundle(
  subject: string,
  topic: string,
  theme: string,
  level: EducationLevel,
  grade: string,
  contextLabel: string
): TopicContentBundle {
  const normSubj = subject.toLowerCase().trim();
  const normTopic = topic.toLowerCase().trim();

  // 1. BAHASA INDONESIA (Iklan, Teks, Puisi, dll.)
  if (normSubj.includes('bahasa indonesia') || normTopic.includes('iklan') || normTopic.includes('teks')) {
    if (normTopic.includes('iklan') || normTopic.includes('slogan') || normTopic.includes('poster')) {
      return {
        conceptDiagram: {
          itemAName: 'Pesan / Gagasan Utama',
          itemARole: 'Informasi Produk & Tawaran Nilai',
          connectorLabel: 'Media Persuasif & Visual',
          connectorSub: 'Bahasa Sugestif + Tata Letak Harmonis',
          itemBName: 'Respon Khalayak Sasaran',
          itemBRole: 'Keputusan Tindakan / Kesadaran Sikap'
        },
        components: [
          {
            title: 'Unsur Verbal (Bahasa)',
            subtitle: 'Kalimat Persuasif, Slogan, & Rima',
            badge: 'Verbal',
            description: 'Pilihan kata yang menarik, sugestif, padat makna, dan mudah diingat oleh khalayak sasaran.',
            features: ['Menggunakan kalimat imperatif santun', 'Mengedepankan keunggulan produk/ide', 'Terdapat Call to Action (CTA) yang jelas']
          },
          {
            title: 'Unsur Visual (Desain)',
            subtitle: 'Ilustrasi, Warna, & Tipografi',
            badge: 'Visual',
            description: 'Penataan elemen grafis untuk memikat perhatian pandangan mata audiens secara instan.',
            features: ['Kontras warna yang kuat dan harmonis', 'Hierarki huruf dari judul hingga kontak', 'Ruang kosong seimbang agar mudah dibaca']
          }
        ],
        goalComponents: [
          {
            title: 'Tujuan Memberikan Informasi (Informing)',
            subtitle: 'Mengenalkan Produk & Layanan Baru',
            badge: 'Informasi',
            description: 'Menyampaikan kabar kepada masyarakat luas tentang keberadaan produk, fitur baru, potongan harga, atau kegiatan.',
            features: ['Menjelaskan cara kerja dan manfaat', 'Mengurangi kecemasan konsumen', 'Membangun citra awal yang terpercaya']
          },
          {
            title: 'Tujuan Membujuk & Meyakinkan (Persuading)',
            subtitle: 'Mendorong Tindakan Positif & Pembelian',
            badge: 'Persuasi',
            description: 'Mempengaruhi emosi dan rasionalitas audiens agar memilih opsi yang ditawarkan dibanding alternatif lain.',
            features: ['Menonjolkan keunggulan kompetitif', 'Mengajak mencoba sekarang juga', 'Mengubah persepsi nilai produk']
          }
        ],
        functionComponents: [
          {
            title: 'Fungsi Ekonomi & Komersial',
            subtitle: 'Menggerakkan Perputaran Pasar & Usaha',
            badge: 'Ekonomi',
            description: 'Mempertemukan penyedia barang/jasa dengan konsumen yang membutuhkan sehingga transaksi dapat berjalan efisien.',
            features: ['Meningkatkan penjualan produk', 'Memperkenalkan merek usaha lokal', 'Membuka lapangan kerja promosi']
          },
          {
            title: 'Fungsi Edukasi & Penggerak Sosial',
            subtitle: 'Membangun Kesadaran Moral Masyarakat',
            badge: 'Sosial',
            description: 'Mengajak warga berpartisipasi dalam kebaikan umum seperti hemat energi, disiplin lalu lintas, dan menjaga kebersihan.',
            features: ['Menyebarkan nilai-nilai positif', 'Mencegah perilaku berbahaya', 'Meningkatkan kepedulian lingkungan']
          }
        ],
        comparison: {
          headerA: 'Teks Iklan Persuasif',
          headerB: 'Teks Informasi / Berita Biasa',
          rows: [
            { attribute: 'Tujuan Utama', itemA: 'Membujuk dan mengajak khalayak bertindak', itemB: 'Menyampaikan fakta peristiwa secara objektif' },
            { attribute: 'Gaya Bahasa', itemA: 'Sugestif, berima, singkat, dan memikat', itemB: 'Lugas, denotatif, netral, dan terurai' },
            { attribute: 'Penggunaan Visual', itemA: 'Wajib estetik, kontras, dan menarik mata', itemB: 'Bersifat dokumentasi pelengkap fakta' }
          ]
        },
        processSteps: [
          { stepNumber: 1, title: 'Analisis Audiens Sasaran', description: 'Kenali usia, kebutuhan, dan gaya bahasa audiens pembaca.', badgeText: 'Audiens' },
          { stepNumber: 2, title: 'Rumuskan Pesan Inti', description: 'Tentukan satu gagasan pokok yang ingin diingat audiens.', badgeText: 'Gagasan' },
          { stepNumber: 3, title: 'Rancang Redaksi Persuasif', description: 'Susun kalimat sugestif dengan slogan yang berima dan berkesan.', badgeText: 'Redaksi' },
          { stepNumber: 4, title: 'Padukan Visual & Publikasi', description: 'Tambahkan ilustrasi pendukung dan sebarluaskan di media tepat.', badgeText: 'Publikasi' }
        ],
        pillars: [
          { title: 'Solusi Kebutuhan Warga', subtitle: 'Informasi Produk & Jasa', colorScheme: 'indigo' },
          { title: 'Penggerak Ekonomi UMKM', subtitle: 'Peluang Usaha Kreatif', colorScheme: 'emerald' },
          { title: 'Kampanye Sosial Warga', subtitle: 'Edukasi Lingkungan & Disiplin', colorScheme: 'teal' },
          { title: 'Literasi Konsumen Kritis', subtitle: 'Memilih Pilihan Bijak', colorScheme: 'amber' }
        ],
        metrics: [
          { label: 'Daya Tangkap Pesan', value: '3 Detik Pertama', percentage: 90, description: 'Rata-rata audiens memahami inti gagasan iklan' },
          { label: 'Efektivitas Pesan', value: '85% Lebih Kuat', percentage: 85, description: 'Perpaduan teks persuasif dan visual harmonis' },
          { label: 'Respon Tindakan', value: '4x Lipat', percentage: 80, description: 'Peningkatan respon pada pesan yang terstruktur rapi' }
        ],
        highlights: ['Definisi Komunikasi Persuasif', 'Tujuan & Fungsi Komprehensif', 'Ciri Khas Bahasa Sugestif', 'Peran Nyata Sehari-hari']
      };
    }

    // Generic Bahasa Indonesia (Teks Eksposisi, LHO, Cerpen, dll.)
    return {
      conceptDiagram: {
        itemAName: 'Gagasan Pokok Penulis',
        itemARole: 'Ide Utama / Topik Pembahasan',
        connectorLabel: 'Struktur Teks & Kaidah Bahasa',
        connectorSub: 'Diksi Tepat, Konjungsi Logis, & Ejaan Baku',
        itemBName: 'Pemahaman Pembaca',
        itemBRole: 'Informasi Terserap Utuh & Logis'
      },
      components: [
        {
          title: 'Struktur Pembangun Teks',
          subtitle: 'Kerangka Paragraf Berurutan',
          badge: 'Struktur',
          description: 'Rangkaian bagian teks yang disusun sistematis dari orientasi hingga penutup.',
          features: ['Pengenalan topik (Orientasi)', 'Pengembangan isi (Rangkaian argumen/deskripsi)', 'Penegasan ulang / Kesimpulan']
        },
        {
          title: 'Kaidah Kebahasaan',
          subtitle: 'Diksi, Konjungsi, & Ejaan',
          badge: 'Kaidah',
          description: 'Tata aturan penggunaan kata, istilah khusus, kalimat efektif, dan tanda baca.',
          features: ['Kata baku sesuai KBBI & PUEBI', 'Konjungsi kronologis dan kausalitas', 'Kalimat lugas dan padu']
        }
      ],
      goalComponents: [
        {
          title: 'Tujuan Komunikatif',
          subtitle: 'Menyampaikan Pesan Secara Efektif',
          badge: 'Komunikasi',
          description: 'Memastikan ide, data, atau cerita dapat dipahami pembaca tanpa salah tafsir.',
          features: ['Kejelasan alur penyampaian', 'Kerapian tata bahasa baku', 'Menghidupkan daya imajinasi/penalaran']
        },
        {
          title: 'Tujuan Edukatif & Wawasan',
          subtitle: 'Memperluas Pengetahuan Pembaca',
          badge: 'Wawasan',
          description: 'Memberikan informasi faktual dan inspirasi pemikiran baru bagi pembaca.',
          features: ['Menyajikan fakta terpercaya', 'Membangun kemampuan berpikir kritis', 'Menumbuhkan kecintaan literasi']
        }
      ],
      functionComponents: [
        {
          title: 'Fungsi Informasi & Dokumentasi',
          subtitle: 'Merekam Fakta dan Pengetahuan',
          badge: 'Informasi',
          description: 'Berfungsi sebagai sumber rujukan tertulis yang dapat dibaca dan diverifikasi kapan saja.',
          features: ['Dokumentasi pengamatan lapangan', 'Referensi belajar siswa', 'Arsip gagasan ilmiah']
        },
        {
          title: 'Fungsi Estetika & Refleksi',
          subtitle: 'Menyentuh Nilai Moral & Rasa',
          badge: 'Refleksi',
          description: 'Mengajak pembaca merenungkan pesan moral, etika, dan keindahan bahasa.',
          features: ['Memperhalus budi pekerti', 'Membangun empati kemanusiaan', 'Menghargai keragaman sudut pandang']
        }
      ],
      comparison: {
        headerA: 'Teks Fiksi (Sastra)',
        headerB: 'Teks Nonfiksi (Informatif)',
        rows: [
          { attribute: 'Sifat Fakta', itemA: 'Imajinatif / Rekaan Penulis', itemB: 'Faktual & Dapat Dibuktikan Nyata' },
          { attribute: 'Gaya Bahasa', itemA: 'Konotatif, Kiasan, & Estetis', itemB: 'Denotatif, Lugas, & Objektif' },
          { attribute: 'Tujuan Membaca', itemA: 'Hiburan & Apresiasi Estetika', itemB: 'Pengetahuan & Wawasan Ilmiah' }
        ]
      },
      processSteps: [
        { stepNumber: 1, title: 'Menentukan Topik & Tujuan', description: 'Pilih ide utama yang hendak disampaikan secara fokus.', badgeText: 'Topik' },
        { stepNumber: 2, title: 'Mengumpulkan Bahan Data', description: 'Cari fakta, referensi, atau inspirasi pendukung.', badgeText: 'Riset' },
        { stepNumber: 3, title: 'Menyusun Kerangka Teks', description: 'Buat bagan alur urutan paragraf secara teratur.', badgeText: 'Bagan' },
        { stepNumber: 4, title: 'Menyunting & Merevisi', description: 'Periksa kembali ejaan, keterpaduan kalimat, dan tanda baca.', badgeText: 'Editing' }
      ],
      pillars: [
        { title: 'Keterampilan Menulis', subtitle: 'Penyusunan Teks Efektif', colorScheme: 'indigo' },
        { title: 'Kemampuan Menyimak', subtitle: 'Kritis Menangkap Gagasan', colorScheme: 'emerald' },
        { title: 'Apresiasi Literasi', subtitle: 'Membaca Aktif & Diskusi', colorScheme: 'sky' },
        { title: 'Komunikasi Publik', subtitle: 'Penyampaian Ide Santun', colorScheme: 'amber' }
      ],
      metrics: [
        { label: 'Keterbacaan Teks', value: 'Sangat Baik', percentage: 92, description: 'Sesuai dengan tingkat membaca siswa' },
        { label: 'Kepaduan Paragraf', value: 'Kohesif & Koheren', percentage: 88, description: 'Antar kalimat saling terkait erat' },
        { label: 'Ketepatan Kaidah', value: '100% Baku', percentage: 95, description: 'Mematuhi pedoman ejaan resmi' }
      ],
      highlights: ['Kaidah Bahasa Baku', 'Struktur Teks Terpadu', 'Literasi Membaca-Menulis']
    };
  }

  // 2. MATEMATIKA (Perbandingan, Aljabar, Geometri, dll.)
  if (normSubj.includes('matematika') || normTopic.includes('perbandingan') || normTopic.includes('aljabar') || normTopic.includes('geometri')) {
    return {
      conceptDiagram: {
        itemAName: 'Besaran / Variabel X',
        itemARole: 'Nilai Diketahui / Input Awal',
        connectorLabel: 'Relasi Rumus & Proporsi Matematis',
        connectorSub: 'Operasi Aljabar / Perhitungan Eksak',
        itemBName: 'Besaran / Variabel Y',
        itemBRole: 'Solusi Target / Output Terhitung'
      },
      components: [
        {
          title: 'Konsep Dasar & Rumus',
          subtitle: 'Persamaan & Sifat Proporsi',
          badge: 'Formula',
          description: `Pondasi logika hitung yang menghubungkan dua variabel atau lebih secara eksak.`,
          features: ['Notasi matematis baku', 'Sifat perkalian silang & kesebandingan', 'Prinsip keseimbangan ruas']
        },
        {
          title: 'Penerapan Masalah Nyata',
          subtitle: 'Pemodelan Soal Kontekstual',
          badge: 'Aplikasi',
          description: `Menerjemahkan cerita kehidupan nyata (${contextLabel}) ke dalam bahasa matematis.`,
          features: ['Identifikasi variabel yang dicari', 'Penyusunan tabel nilai bantuan', 'Verifikasi kewajaran angka hasil']
        }
      ],
      goalComponents: [
        {
          title: 'Tujuan Pemodelan Logis',
          subtitle: 'Menyederhanakan Masalah Kompleks',
          badge: 'Logika',
          description: 'Mengubah persoalan sehari-hari ke dalam bentuk persamaan matematis yang dapat dihitung.',
          features: ['Menemukan pola hubungan antar nilai', 'Menghindari perkiraan spekulatif', 'Menghasilkan jawaban yang pasti']
        },
        {
          title: 'Tujuan Pengambilan Keputusan',
          subtitle: 'Optimasi Waktu dan Biaya',
          badge: 'Solusi',
          description: 'Membantu menentukan pilihan paling efisien dalam perencanaan anggaran, skala denah, dan waktu perjalanan.',
          features: ['Kalkulasi anggaran presisi', 'Efisiensi waktu tempuh', 'Pemanfaatan sumber daya optimal']
        }
      ],
      functionComponents: [
        {
          title: 'Fungsi Analitis & Prediktif',
          subtitle: 'Menghitung Nilai Masa Depan',
          badge: 'Prediksi',
          description: 'Menghitung perkiraan kebutuhan berdasarkan rasio yang telah terbukti tetap.',
          features: ['Estimasi kebutuhan bahan baku', 'Prediksi kecepatan dan durasi', 'Perhitungan skala peta']
        },
        {
          title: 'Fungsi Standardisasi Eksak',
          subtitle: 'Tolok Ukur Ilmiah Universal',
          badge: 'Standar',
          description: 'Memastikan hasil perhitungan dapat diuji ulang oleh siapa saja dengan metode yang sama.',
          features: ['Ketepatan pengukuran', 'Transparansi perhitungan', 'Kesesuaian hukum matematika']
        }
      ],
      comparison: {
        headerA: 'Perbandingan Senilai (Langsung)',
        headerB: 'Perbandingan Berbalik Nilai (Invers)',
        rows: [
          { attribute: 'Pola Perubahan', itemA: 'Searah (Variabel A naik, Variabel B ikut naik)', itemB: 'Berlawanan (Variabel A naik, Variabel B justru turun)' },
          { attribute: 'Bentuk Persamaan', itemA: 'Rasio bagi tetap (y / x = k)', itemB: 'Hasil kali tetap (x · y = k)' },
          { attribute: 'Contoh Nyata', itemA: 'Jumlah barang dibeli vs Total harga bayar', itemB: 'Kecepatan kendaraan vs Waktu tempuh perjalanan' }
        ]
      },
      processSteps: [
        { stepNumber: 1, title: 'Identifikasi Variabel Soal', description: 'Tuliskan informasi apa yang diketahui dan apa yang ditanyakan.', badgeText: 'Variabel' },
        { stepNumber: 2, title: 'Pilih Model Persamaan', description: 'Tentukan apakah perbandingan senilai atau berbalik nilai.', badgeText: 'Model' },
        { stepNumber: 3, title: 'Eksekusi Perkalian Silang', description: 'Lakukan operasi aljabar untuk mencari nilai variabel target.', badgeText: 'Hitung' },
        { stepNumber: 4, title: 'Validasi Jawaban Kontekstual', description: 'Cek apakah angka jawaban logis dalam situasi dunia nyata.', badgeText: 'Validasi' }
      ],
      pillars: [
        { title: 'Kalkulasi Finansial', subtitle: 'Harga, Untung, & Diskon', colorScheme: 'emerald' },
        { title: 'Navigasi & Waktu', subtitle: 'Kecepatan & Estimasi Tiba', colorScheme: 'indigo' },
        { title: 'Skala & Arsitektur', subtitle: 'Denah Bangunan & Peta', colorScheme: 'sky' },
        { title: 'Sains & Resep Masakan', subtitle: 'Takaran Bahan Proporsional', colorScheme: 'amber' }
      ],
      metrics: [
        { label: 'Akurasi Perhitungan', value: '100% Eksak', percentage: 98, description: 'Berdasarkan kaidah aljabar universal' },
        { label: 'Efisiensi Solusi', value: '2x Lebih Cepat', percentage: 88, description: 'Metode perkalian silang langsung terarah' },
        { label: 'Relevansi Kasus', value: 'Setiap Hari', percentage: 95, description: 'Digunakan dalam belanja, navigasi, dan skala' }
      ],
      highlights: ['Logika Aljabar Presisi', 'Metode Hitung Cepat', 'Pemecahan Masalah Kontekstual']
    };
  }

  // 3. IPA / BIOLOGI / FISIKA / KIMIA
  if (normSubj.includes('ipa') || normSubj.includes('biologi') || normSubj.includes('fisika') || normSubj.includes('kimia') || normTopic.includes('pernapasan') || normTopic.includes('ekosistem')) {
    return {
      conceptDiagram: {
        itemAName: 'Masukan Lingkungan / Zat',
        itemARole: 'Oksigen / Nutrisi / Energi Awal',
        connectorLabel: 'Proses Biologis & Fisik Terpadu',
        connectorSub: 'Difusi, Reaksi Seluler, & Perpindahan',
        itemBName: 'Hasil Fungsi / Energi Tubuh',
        itemBRole: 'Metabolisme Aktif & Keseimbangan Alami'
      },
      components: [
        {
          title: 'Struktur Organ / Komponen Fisik',
          subtitle: 'Anatomi & Saluran Penunjang',
          badge: 'Struktur',
          description: 'Kumpulan bagian fisik yang memiliki peran spesifik untuk menopang sistem kerja secara utuh.',
          features: ['Lapisan pelindung dan penyaring', 'Jaringan pembuluh darah / kapiler', 'Dinding elastis beradaptasi luas']
        },
        {
          title: 'Mekanisme & Fungsi Kerja',
          subtitle: 'Proses Kimiawi & Mekanis',
          badge: 'Fungsi',
          description: 'Aktivitas fungsional yang mengubah masukan zat/energi menjadi hasil yang dibutuhkan tubuh/alam.',
          features: ['Pertukaran gas/zat teratur', 'Pengaturan tekanan dan volume', 'Menjaga kestabilan homeostatis']
        }
      ],
      goalComponents: [
        {
          title: 'Tujuan Kelangsungan Hidup',
          subtitle: 'Menyuplai Kebutuhan Vital Sel',
          badge: 'Vital',
          description: 'Memastikan seluruh jaringan tubuh mendapatkan oksigen dan energi untuk beraktivitas.',
          features: ['Produksi energi ATP seluler', 'Menjaga kelangsungan metabolisme', 'Mencegah kerusakan jaringan tubuh']
        },
        {
          title: 'Tujuan Pembuangan Racun',
          subtitle: 'Ekskresi Zat Sisa Berbahaya',
          badge: 'Pembersihan',
          description: 'Mengeluarkan karbondioksida dan zat buangan agar tidak meracuni peredaran darah.',
          features: ['Detoksifikasi alami tubuh', 'Keseimbangan asam-basa darah', 'Kestabilan suhu internal']
        }
      ],
      functionComponents: [
        {
          title: 'Fungsi Pernapasan & Difusi Gas',
          subtitle: 'Pertukaran O2 dan CO2 di Alveolus',
          badge: 'Difusi',
          description: 'Menyerap oksigen dari udara bebas dan membuang karbondioksida hasil pembakaran sel.',
          features: ['Luas permukaan pertukaran optimal', 'Pengikatan oleh hemoglobin', 'Respon otomatis saat berolahraga']
        },
        {
          title: 'Fungsi Perlindungan & Penyaringan',
          subtitle: 'Menahan Debu dan Patogen Masuk',
          badge: 'Imunitas',
          description: 'Silia dan lendir di saluran napas menyaring kotoran agar udara yang masuk ke paru-paru steril.',
          features: ['Penyaringan partikel berbahaya', 'Penyesuaian suhu udara masuk', 'Respon batuk dan bersin protektif']
        }
      ],
      comparison: {
        headerA: 'Fase Inspirasi (Menghirup Udara)',
        headerB: 'Fase Ekspirasi (Menghembuskan Udara)',
        rows: [
          { attribute: 'Kondisi Otot Diafragma', itemA: 'Berkontraksi & mendatar ke bawah', itemB: 'Relaksasi & melengkung ke atas' },
          { attribute: 'Volume & Tekanan Dada', itemA: 'Rongga dada membesar, tekanan turun', itemB: 'Rongga dada mengecil, tekanan naik' },
          { attribute: 'Arah Aliran Udara', itemA: 'Udara luar kaya O2 masuk ke paru-paru', itemB: 'Udara kaya CO2 terdorong keluar' }
        ]
      },
      processSteps: [
        { stepNumber: 1, title: 'Penyaringan di Hidung', description: 'Udara masuk, disaring rambut hidung, dan dihangatkan.', badgeText: 'Hidung' },
        { stepNumber: 2, title: 'Penyaluran Trakea & Bronkus', description: 'Udara dialirkan melalui cabang-cabang pipa saluran napas.', badgeText: 'Saluran' },
        { stepNumber: 3, title: 'Pertukaran Gas di Alveolus', description: 'O2 diserap ke pembuluh darah kapiler, CO2 dilepaskan.', badgeText: 'Alveolus' },
        { stepNumber: 4, title: 'Sirkulasi ke Seluruh Sel', description: 'Jantung memompa darah kaya O2 ke seluruh jaringan tubuh.', badgeText: 'Sirkulasi' }
      ],
      pillars: [
        { title: 'Kebugaran & Olahraga', subtitle: 'Optimalisasi Kapasitas Paru', colorScheme: 'emerald' },
        { title: 'Kesehatan Lingkungan', subtitle: 'Udara Bersih & Penghijauan', colorScheme: 'sky' },
        { title: 'Pencegahan Penyakit', subtitle: 'Imunitas & Pola Hidup Sehat', colorScheme: 'rose' },
        { title: 'Eksplorasi Sains', subtitle: 'Eksperimen Kapasitas Udara', colorScheme: 'teal' }
      ],
      metrics: [
        { label: 'Efisiensi Pertukaran', value: 'Optimal', percentage: 94, description: 'Luas jutaan alveolus memaksimalkan difusi gas' },
        { label: 'Frekuensi Normal', value: '12-20x / Menit', percentage: 90, description: 'Frekuensi napas sehat orang dewasa saat istirahat' },
        { label: 'Respon Adaptasi', value: 'Sangat Cepat', percentage: 88, description: 'Menyesuaikan kebutuhan oksigen saat aktivitas berat' }
      ],
      highlights: ['Anatomi Organ Pernapasan', 'Mekanisme Inspirasi-Ekspirasi', 'Pola Hidup Sehat']
    };
  }

  // 4. IPS / EKONOMI / SOSIOLOGI / GEOGRAFI
  if (normSubj.includes('ips') || normSubj.includes('ekonomi') || normSubj.includes('sosiologi') || normSubj.includes('geografi') || normTopic.includes('pasar') || normTopic.includes('distribusi')) {
    return {
      conceptDiagram: {
        itemAName: 'Pelaku Utama (Produsen / Warga)',
        itemARole: 'Penyedia Barang / Penggagas Nilai',
        connectorLabel: 'Saluran Distribusi & Pasar',
        connectorSub: 'Logistik, Transaksi, & Informasi Harga',
        itemBName: 'Konsumen / Masyarakat',
        itemBRole: 'Pemenuhan Kebutuhan Hidup & Evaluasi Nilai'
      },
      components: [
        {
          title: 'Sektor Produksi & Penyediaan',
          subtitle: 'Penciptaan Nilai Tambah',
          badge: 'Produksi',
          description: 'Aktivitas mengolah sumber daya menjadi barang/jasa siap guna bagi masyarakat.',
          features: ['Efisiensi biaya dan tenaga kerja', 'Inovasi produk berkualitas', 'Pemanfaatan potensi sumber daya lokal']
        },
        {
          title: 'Sektor Konsumsi & Pemenuhan',
          subtitle: 'Kebutuhan & Skala Prioritas',
          badge: 'Konsumsi',
          description: 'Perilaku masyarakat dalam memanfaatkan barang/jasa demi menjaga kesejahteraan hidup.',
          features: ['Daya beli dan pengelolaan anggaran', 'Pola konsumsi bijak & hemat', 'Perlindungan hak konsumen']
        }
      ],
      goalComponents: [
        {
          title: 'Tujuan Pemenuhan Kebutuhan Hidup',
          subtitle: 'Menjamin Ketersediaan Barang & Jasa',
          badge: 'Kebutuhan',
          description: 'Memastikan masyarakat dapat menjangkau kebutuhan sandang, pangan, papan, dan jasa secara adil.',
          features: ['Ketersediaan pasokan pasar', 'Pencegahan kelangkaan barang', 'Pemerataan distribusi antarwilayah']
        },
        {
          title: 'Tujuan Kesejahteraan Bersama',
          subtitle: 'Mendorong Pertumbuhan Ekonomi',
          badge: 'Kesejahteraan',
          description: 'Menciptakan lapangan kerja, meningkatkan pendapatan keluarga, dan mengurangi kesenjangan.',
          features: ['Pemberdayaan usaha kecil', 'Perputaran uang di masyarakat', 'Peningkatan taraf hidup warga']
        }
      ],
      functionComponents: [
        {
          title: 'Fungsi Pembentukan Harga Pasar',
          subtitle: 'Keseimbangan Permintaan & Penawaran',
          badge: 'Harga',
          description: 'Menjadi tempat bertemunya penjual dan pembeli untuk menyepakati harga yang wajar.',
          features: ['Transparansi informasi harga', 'Penetapan nilai barang adil', 'Mencegah monopoli sepihak']
        },
        {
          title: 'Fungsi Distribusi & Penyaluran',
          subtitle: 'Menghubungkan Produsen ke Konsumen',
          badge: 'Distribusi',
          description: 'Menyalurkan hasil bumi dan produk pabrik dari sentra produksi ke pemukiman warga.',
          features: ['Efisiensi jaringan logistik', 'Kemudahan akses belanja', 'Konektivitas desa dan kota']
        }
      ],
      comparison: {
        headerA: 'Pasar Tradisional',
        headerB: 'Pasar Digital (E-Commerce)',
        rows: [
          { attribute: 'Media Transaksi', itemA: 'Tatap muka langsung dan tawar-menawar', itemB: 'Aplikasi online dengan pembayaran digital' },
          { attribute: 'Jangkauan Wilayah', itemA: 'Terbatas warga sekitar lokasi pasar', itemB: 'Mencakup seluruh nusantara hingga global' },
          { attribute: 'Pemeriksaan Barang', itemA: 'Dapat dilihat dan disentuh langsung', itemB: 'Berdasarkan foto, video, dan ulasan pembeli' }
        ]
      },
      processSteps: [
        { stepNumber: 1, title: 'Perencanaan & Pengadaan Bahan', description: 'Pengumpulan sumber daya dan bahan baku produksi.', badgeText: 'Bahan' },
        { stepNumber: 2, title: 'Pengolahan Nilai Tambah', description: 'Proses produksi barang jadi bermutu sesuai standar.', badgeText: 'Produksi' },
        { stepNumber: 3, title: 'Penyaluran Distribusi', description: 'Pengiriman barang ke pasar, toko grosir, dan agen.', badgeText: 'Distribusi' },
        { stepNumber: 4, title: 'Konsumsi & Evaluasi', description: 'Pemanfaatan produk oleh pembeli untuk kebutuhan sehari-hari.', badgeText: 'Konsumsi' }
      ],
      pillars: [
        { title: 'Pemberdayaan UMKM', subtitle: 'Ekonomi Kerakyatan Kreatif', colorScheme: 'emerald' },
        { title: 'Literasi Keuangan Warga', subtitle: 'Manajemen Tabungan Cerdas', colorScheme: 'indigo' },
        { title: 'Keadilan Pangan & Distribusi', subtitle: 'Pemerataan Pasokan Daerah', colorScheme: 'amber' },
        { title: 'Keberlanjutan Lingkungan', subtitle: 'Produksi Ramah Bumi', colorScheme: 'teal' }
      ],
      metrics: [
        { label: 'Dampak Kesejahteraan', value: 'Sangat Tinggi', percentage: 92, description: 'Meningkatkan kemandirian ekonomi keluarga' },
        { label: 'Efisiensi Distribusi', value: '+35% Lebih Cepat', percentage: 88, description: 'Pemanfaatan jalur transportasi modern' },
        { label: 'Partisipasi Warga', value: 'Aktif & Sadar', percentage: 90, description: 'Kepedulian terhadap produk lokal nusantara' }
      ],
      highlights: ['Interaksi Sosial Ekonomi', 'Rantai Pasok Berkelanjutan', 'Konsumen Cerdas & Bijak']
    };
  }

  // 5. INFORMATIKA (Graph, Algoritma, Jaringan, dll.)
  if (normSubj.includes('informatika') || normTopic.includes('graph') || normTopic.includes('algoritma') || normTopic.includes('koding')) {
    return {
      conceptDiagram: {
        itemAName: 'Simpul Asal (Node A)',
        itemARole: 'Entitas Objek / Titik Data Awal',
        connectorLabel: 'Garis Relasi (Edge Berbobot)',
        connectorSub: 'Jarak (km), Waktu (menit), atau Kapasitas',
        itemBName: 'Simpul Tujuan (Node B)',
        itemBRole: 'Entitas Terhubung / Target Solusi'
      },
      components: [
        {
          title: 'Node / Vertex (Simpul)',
          subtitle: 'Representasi Objek & Entitas Data',
          badge: 'Node',
          description: 'Titik dasar yang memuat identitas entitas spesifik seperti lokasi kota, akun pengguna, atau server.',
          features: ['Identitas unik (Unique ID)', 'Menyimpan atribut data', 'Memiliki derajat keterhubungan (Degree)']
        },
        {
          title: 'Edge / Sisi (Garis Relasi)',
          subtitle: 'Penghubung Antar Simpul',
          badge: 'Edge',
          description: 'Jalur interaksi logika atau fisik yang menghubungkan dua simpul dalam struktur topologi.',
          features: ['Dapat memiliki arah (Directed)', 'Dapat memiliki bobot nilai (Weighted)', 'Menentukan jalur lintasan terpendek']
        }
      ],
      goalComponents: [
        {
          title: 'Tujuan Pemodelan Struktur Non-Linear',
          subtitle: 'Memetakan Hubungan Antar Objek Kompleks',
          badge: 'Topologi',
          description: 'Menyajikan data yang memiliki relasi banyak-ke-banyak secara visual dan terstruktur.',
          features: ['Pemetaan jejaring pertemanan sosial', 'Peta topologi jaringan komputer', 'Rute jalan raya antarkota']
        },
        {
          title: 'Tujuan Optimasi Jalur & Pencarian',
          subtitle: 'Menemukan Solusi Rute Tercepat',
          badge: 'Optimasi',
          description: 'Menghitung jalur terpendek, rute terhemat, dan kapasitas maksimal menggunakan algoritma komputer.',
          features: ['Pencarian rute tercepat GPS', 'Penghematan konsumsi bahan bakar', 'Minimalkan latensi pengiriman data']
        }
      ],
      functionComponents: [
        {
          title: 'Fungsi Navigasi & Routing Data',
          subtitle: 'Pengarah Aliran Informasi Jaringan',
          badge: 'Routing',
          description: 'Mengarahkan paket data atau kendaraan melewati simpul-simpul penghubung paling lancar.',
          features: ['Routing paket internet', 'Navigasi peta digital Google Maps', 'Manajemen armada kurir logistik']
        },
        {
          title: 'Fungsi Rekomendasi & Analisis Klaster',
          subtitle: 'Menemukan Komunitas & Minat Sama',
          badge: 'Analisis',
          description: 'Menganalisis pola kedekatan antar pengguna di media sosial untuk merekomendasikan teman atau konten.',
          features: ['Rekomendasi teman & konten baru', 'Deteksi klaster komunitas', 'Analisis pengaruh sentralitas']
        }
      ],
      comparison: {
        headerA: 'Graph Tak Terarah (Undirected)',
        headerB: 'Graph Terarah & Berbobot (Directed Weighted)',
        rows: [
          { attribute: 'Arah Koneksi', itemA: 'Simetris 2 arah (A ↔ B)', itemB: '1 arah spesifik (A → B)' },
          { attribute: 'Nilai Bobot', itemA: 'Hanya ada/tidaknya hubungan relasi', itemB: 'Memiliki nilai (jarak/waktu/biaya)' },
          { attribute: 'Contoh Nyata', itemA: 'Jejaring pertemanan timbal balik', itemB: 'Navigasi rute jalan satu arah GPS' }
        ]
      },
      processSteps: [
        { stepNumber: 1, title: 'Identifikasi Simpul Data', description: 'Petakan semua entitas objek yang terlibat.', badgeText: 'Entitas' },
        { stepNumber: 2, title: 'Hubungkan Garis Relasi', description: 'Tarik edge antar simpul yang saling berinteraksi.', badgeText: 'Relasi' },
        { stepNumber: 3, title: 'Sematkan Nilai Bobot', description: 'Beri atribut jarak tempuh, durasi, atau biaya.', badgeText: 'Bobot' },
        { stepNumber: 4, title: 'Eksekusi Algoritma Jalur', description: 'Hitung rute paling efisien atau klaster terpadat.', badgeText: 'Solusi' }
      ],
      pillars: [
        { title: 'GPS & Navigasi Rute', subtitle: 'Pencarian Rute Cepat', colorScheme: 'emerald' },
        { title: 'Media Sosial & Graf Teman', subtitle: 'Grafik Interaksi Pengguna', colorScheme: 'indigo' },
        { title: 'Infrastruktur Internet', subtitle: 'Routing Paket Jaringan', colorScheme: 'teal' },
        { title: 'Logistik Armada Terpadu', subtitle: 'Optimasi Rute Kurir', colorScheme: 'amber' }
      ],
      metrics: [
        { label: 'Akurasi Navigasi', value: 'Optimal', percentage: 96, description: 'Rute tercepat berbasis perhitungan bobot' },
        { label: 'Efisiensi Waktu', value: 'Hemat 35%', percentage: 88, description: 'Menghindari simpul kemacetan' },
        { label: 'Kapasitas Jaringan', value: 'Skala Besar', percentage: 92, description: 'Mampu menghubungkan jutaan entitas' }
      ],
      highlights: ['Struktur Data Non-Linear', 'Pemodelan Relasi Graf', 'Optimasi Algoritma Komputasi']
    };
  }

  // 6. DYNAMIC ADAPTIVE FALLBACK FOR ANY GENERAL / CUSTOM SUBJECT
  return {
    conceptDiagram: {
      itemAName: `Gagasan Inti (${topic.slice(0, 16)})`,
      itemARole: `Pondasi Teori & Fakta Pokok ${subject}`,
      connectorLabel: `Analisis & Pembelajaran Terstruktur`,
      connectorSub: `Metode Kurikulum ${level} Kelas ${grade}`,
      itemBName: `Pemahaman Mandiri Siswa`,
      itemBRole: 'Penguasaan Kompetensi & Pemecahan Masalah'
    },
    components: [
      {
        title: `Unsur Pokok Materi`,
        subtitle: `Pilar Konseptual Utama`,
        badge: 'Pilar 1',
        description: `Struktur esensial yang menjelaskan definisi, karakteristik, dan fungsi pokok dari ${topic}.`,
        features: [
          `Memahami definisi ${topic} secara mendalam`,
          'Mengidentifikasi bagian-bagian utama pembentuknya',
          'Dasar pembentukan pola berpikir logis'
        ]
      },
      {
        title: `Penerapan Kontekstual`,
        subtitle: `Aplikasi di ${contextLabel}`,
        badge: 'Pilar 2',
        description: `Hubungan antara teori ${topic} dengan fakta yang diamati langsung di lingkungan siswa.`,
        features: [
          'Memetakan hubungan sebab-akibat antar unsur',
          'Analisis contoh nyata secara kontekstual',
          'Refleksi evaluasi penguasaan materi'
        ]
      }
    ],
    goalComponents: [
      {
        title: 'Tujuan Penguasaan Konseptual',
        subtitle: 'Membangun Kerangka Berpikir Ilmiah',
        badge: 'Konsep',
        description: `Membekali siswa dengan pemahaman dasar yang kuat mengenai prinsip kerja ${topic}.`,
        features: ['Memahami hakikat dan definisi baku', 'Mengenali prinsip-prinsip utama', 'Menjadi landasan belajar lanjutan']
      },
      {
        title: 'Tujuan Keterampilan Praktis',
        subtitle: 'Aplikasi dalam Pemecahan Masalah',
        badge: 'Aplikasi',
        description: `Mengasah kemampuan siswa untuk menerapkan materi pada situasi nyata di ${contextLabel}.`,
        features: ['Menganalisis studi kasus kontekstual', 'Menemukan solusi secara mandiri', 'Meningkatkan kecakapan bernalar kritis']
      }
    ],
    functionComponents: [
      {
        title: 'Fungsi Analitis & Edukatif',
        subtitle: 'Membedakan Pola & Struktur',
        badge: 'Analitis',
        description: 'Membantu siswa mengidentifikasi keterkaitan antar bagian materi secara sistematis.',
        features: ['Memudahkan pemetaan masalah', 'Mengurangi kerancuan konsep', 'Memperkuat daya ingat jangka panjang']
      },
      {
        title: 'Fungsi Aplikatif Sehari-hari',
        subtitle: 'Penerapan di Lingkungan Sekitar',
        badge: 'Praktis',
        description: 'Menghubungkan konsep teoritis dengan pengalaman sehari-hari yang ditemui siswa.',
        features: ['Relevan dengan kehidupan siswa', 'Mendorong rasa ingin tahu', 'Membangun kebiasaan bernalar logis']
      }
    ],
    comparison: {
      headerA: `Bentuk / Karakteristik Standar`,
      headerB: `Bentuk / Karakteristik Khusus`,
      rows: [
        { attribute: 'Fokus Utama', itemA: 'Menekankan struktur dan aturan dasar', itemB: 'Menekankan variasi dan adaptasi kondisi' },
        { attribute: 'Tingkat Kompleksitas', itemA: 'Mudah diidentifikasi pada situasi umum', itemB: 'Memerlukan analisis mendalam dan kritis' },
        { attribute: 'Penerapan Kasus', itemA: 'Konteks pembelajaran kelas sehari-hari', itemB: 'Penyelesaian tantangan kasus kontekstual' }
      ]
    },
    processSteps: [
      { stepNumber: 1, title: 'Eksplorasi Konsep Awal', description: `Mengenali fakta dan definisi dasar dari ${topic}.`, badgeText: 'Amati' },
      { stepNumber: 2, title: 'Analisis Struktur & Unsur', description: `Menguraikan bagian-bagian penting menjadi poin sistematis.`, badgeText: 'Analisis' },
      { stepNumber: 3, title: 'Latihan / Penerapan Terarah', description: `Menerapkan konsep pada contoh studi kasus kontekstual.`, badgeText: 'Praktik' },
      { stepNumber: 4, title: 'Sintesis & Kesimpulan', description: `Menyimpulkan wawasan inti untuk pemahaman jangka panjang.`, badgeText: 'Wawasan' }
    ],
    pillars: [
      { title: 'Pondasi Konseptual', subtitle: 'Penguasaan Teori Kuat', colorScheme: 'indigo' },
      { title: 'Aplikasi Nyata', subtitle: `Konteks ${contextLabel}`, colorScheme: 'emerald' },
      { title: 'Berpikir Kritis', subtitle: 'Analisis & Refleksi', colorScheme: 'sky' },
      { title: 'Evaluasi Mandiri', subtitle: 'Ketercapaian Asesmen', colorScheme: 'amber' }
    ],
    metrics: [
      { label: 'Kesesuaian Kurikulum', value: 'Sesuai Standar', percentage: 95, description: `Tepat untuk ${level} Kelas ${grade}` },
      { label: 'Kemudahan Pemahaman', value: '3x Lebih Cepat', percentage: 90, description: 'Penyajian infografis visual terstruktur' },
      { label: 'Relevansi Konteks', value: 'Tinggi', percentage: 92, description: 'Aplikatif untuk kehidupan sehari-hari siswa' }
    ],
    highlights: [`Kuasai Konsep ${topic}`, `Berpikir Kritis & Logis`, `Aplikatif untuk Kelas ${grade}`]
  };
}

/**
 * Generate 1 to max 3 topic-grounded summary points strictly derived from active material blocks
 */
export function generateTopicSpecificSummaryPoints(
  context: ActiveProjectContext,
  mainBlocks: MaterialBlock[]
): string[] {
  const { mataPelajaran, materi, kelas, jenjang } = context;

  if (mainBlocks && mainBlocks.length > 0) {
    const validBlocks = mainBlocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
    if (validBlocks.length > 0) {
      // Pick key points from up to 3 distinct blocks
      const derived = validBlocks.slice(0, 3).map((b) => {
        let conceptName = b.title
          .replace(/^(\d+|[a-zA-Z])[\.\)\-\*•]\s*/, '')
          .replace(/^apa itu\s+/i, 'Pengertian ')
          .replace(/\?$/, '')
          .trim();

        let explanation = '';
        if (b.keyPoints && b.keyPoints.length > 0) {
          const firstPt = b.keyPoints[0].replace(/^(\d+|[a-zA-Z])[\.\)\-\*•]\s*/, '').trim();
          explanation = firstPt.includes(':') ? firstPt.split(':')[1].trim() : firstPt;
        } else {
          explanation = b.content.split('.')[0] + '.';
        }

        if (!explanation.endsWith('.')) explanation += '.';
        return `${conceptName}: ${explanation}`;
      });

      if (derived.length >= 1) {
        return derived;
      }
    }
  }

  // Fallback points
  return [
    `Konsep Inti ${materi}: Memahami prinsip fundamental materi sebagai landasan berpikir dalam ${mataPelajaran}.`,
    `Tujuan, Fungsi & Karakteristik: Menguasai peran praktis dan ciri khas yang membedakan materi secara sistematis.`,
    `Aplikasi Pembelajaran: Menghubungkan teori ${materi} Kelas ${kelas} ${jenjang} dengan penerapan nyata dalam kehidupan sehari-hari.`
  ];
}

/**
 * Coverage Check Validation Engine:
 * Validates that every requiredTopic has a matching substantive block
 */
export function performCoverageCheck(
  requiredTopics: string[],
  blocks: MaterialBlock[]
): { topic: string; covered: boolean; blockTitle: string }[] {
  return requiredTopics.map(topic => {
    const normTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '');
    const topicWords = topic.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    const foundBlock = blocks.find(b => {
      if (b.visualElementType === 'ringkasan_kotak') return false;

      const normTitle = b.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normTag = b.tag.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (normTitle.includes(normTopic) || normTopic.includes(normTitle)) return true;
      if (normTag.includes(normTopic) || normTopic.includes(normTag)) return true;

      // Check overlapping keywords
      const matchCount = topicWords.filter(w => 
        b.title.toLowerCase().includes(w) || 
        b.tag.toLowerCase().includes(w) ||
        (b.subTitle && b.subTitle.toLowerCase().includes(w))
      ).length;

      return matchCount >= Math.min(2, topicWords.length);
    });

    return {
      topic,
      covered: !!foundBlock,
      blockTitle: foundBlock ? foundBlock.title : ''
    };
  });
}

/**
 * Build rich, highly structured MaterialBlocks strictly aligned with user's active context and scope
 * ATURAN UTAMA: Cakupan Materi adalah KERANGKA WAJIB & SUMBER UTAMA.
 * Pertahankan urutan cakupan dari pengguna sebagai urutan utama pembahasan.
 */
export function generateMaterialBlocksFromContext(context: ActiveProjectContext): MaterialBlock[] {
  const { jenjang, kelas, mataPelajaran, tema, materi, cakupanMateri, konteksContoh, customExampleContext } = context;

  // Context Label for Real-World Examples
  let contextLabel = 'Kehidupan Sehari-hari';
  if (konteksContoh === 'sekolah') contextLabel = 'Lingkungan Sekolah';
  else if (konteksContoh === 'rumah') contextLabel = 'Lingkungan Rumah & Keluarga';
  else if (konteksContoh === 'teknologi') contextLabel = 'Dunia Digital & Teknologi';
  else if (konteksContoh === 'lokal') contextLabel = 'Kearifan Lokal & Budaya Nusantara';
  else if (konteksContoh === 'akademik') contextLabel = 'Eksperimen & Riset Ilmiah';
  else if (konteksContoh === 'kustom' && customExampleContext) contextLabel = customExampleContext;

  const bundle = generateDomainTopicBundle(mataPelajaran, materi, tema, jenjang, kelas, contextLabel);

  // 1. PARSE USER SCOPE TO REQUIRED TOPICS
  const requiredTopics = parseScopeToRequiredTopics(cakupanMateri, materi);

  const colorPalette: ('indigo' | 'teal' | 'amber' | 'emerald' | 'sky')[] = ['indigo', 'teal', 'amber', 'emerald', 'sky'];

  // 2. BUILD A DEDICATED SECTION FOR EVERY REQUIRED TOPIC IN EXACT USER ORDER
  const blocks: MaterialBlock[] = requiredTopics.map((topicItem, idx) => {
    const orderNum = idx + 1;
    const letter = String.fromCharCode(65 + idx); // A, B, C, D, E...
    const accent = colorPalette[idx % colorPalette.length];

    const analyzed = analyzeScopeItem(topicItem, idx, materi, mataPelajaran);

    // ==========================================
    // STAGE 1: PENGERTIAN / DEFINISI
    // ==========================================
    // STAGE 1: PENGERTIAN / DEFINISI
    // ==========================================
    if (analyzed.stage === 'pengertian') {
      return {
        id: `blk-${orderNum}-${Date.now()}-${idx}`,
        order: orderNum,
        letterIndex: letter,
        tag: analyzed.tag,
        title: analyzed.cleanTitle.includes('?') ? analyzed.cleanTitle : analyzed.cleanTitle,
        subTitle: `Pondasi Definisi & Gagasan Pokok Pembelajaran`,
        content: `${materi} merupakan topik esensial dalam pembelajaran ${mataPelajaran} Kelas ${kelas} (${jenjang}) yang menjelaskan prinsip fundamental, batasan konsep, dan keterhubungan logis antar gagasan secara terstruktur.`,
        keyPoints: [
          `Definisi Pokok: Pemahaman hakikat dasar dari ${materi} sebagai pondasi utama berpikir.`,
          `Fokus Pembelajaran: Mengembangkan penalaran kritis siswa dalam mengidentifikasi konsep materi.`,
          `Landasan Pemikiran: Menjadi titik tolak sebelum melangkah ke analisis tujuan, ciri, dan penerapan nyata.`
        ],
        exampleTitle: `Analogi Konsep (${contextLabel})`,
        example: `Bayangkan sistem yang tertata rapi di mana setiap unsur memiliki fungsi saling melengkapi untuk menghasilkan pemahaman yang utuh.`,
        visualRecommendation: 'Diagram konsep titik berelasi dengan arah panah penjelas yang kontras.',
        visualElementType: 'diagram_konsep',
        accentColor: accent,
        conceptDiagram: bundle.conceptDiagram,
        informationType: analyzed.informationType,
        visualType: analyzed.visualTypeT2,
        layoutType: analyzed.layoutType,
        layoutConfig: analyzed.layoutConfig || { columns: 1, direction: 'vertical', spanFullWidth: true },
        contentPriority: {
          primary: `${materi} merupakan prinsip fundamental dan batasan konsep pembelajaran ${mataPelajaran} Kelas ${kelas}.`,
          secondary: [
            `Definisi Pokok: Pemahaman hakikat dasar dari ${materi}.`,
            `Fokus Pembelajaran: Penalaran kritis siswa dalam mengidentifikasi konsep.`
          ],
          supporting: [
            `Analogi Konsep: Sistem saling melengkapi untuk menghasilkan pemahaman utuh di ${contextLabel}.`
          ]
        }
      };
    }

    // ==========================================
    // STAGE 2: TUJUAN
    // ==========================================
    if (analyzed.stage === 'tujuan') {
      return {
        id: `blk-${orderNum}-${Date.now()}-${idx}`,
        order: orderNum,
        letterIndex: letter,
        tag: 'TUJUAN PEMBELAJARAN',
        title: analyzed.cleanTitle,
        subTitle: `Apa yang Ingin Dicapai Melalui ${materi}?`,
        content: `Tujuan utama dari ${materi} adalah memberikan arah dan target capaian yang jelas bagi peserta didik, membantu memahami mengapa konsep ini penting, serta membekali keterampilan untuk mencapai hasil yang diinginkan.`,
        keyPoints: [
          `Tujuan Utama: Menyampaikan pesan dan gagasan pokok kepada sasaran secara tepat dan terukur.`,
          `Tujuan Persuasif & Edukatif: Membimbing sikap dan pemahaman audiens agar terjadi perubahan positif.`,
          `Capaian Pembelajaran: Menuntaskan kompetensi ${mataPelajaran} Kurikulum Merdeka untuk Kelas ${kelas}.`
        ],
        exampleTitle: `Target Capaian di Lapangan`,
        example: `Tujuan yang dirumuskan secara jelas berfungsi seperti kompas pemandu agar setiap tindakan tepat sasaran.`,
        visualRecommendation: 'Dua kartu tujuan pokok dengan badge pembeda target capaian.',
        visualElementType: 'komponen',
        accentColor: accent,
        componentsList: bundle.goalComponents || bundle.components,
        informationType: analyzed.informationType,
        visualType: analyzed.visualTypeT2,
        layoutType: analyzed.layoutType,
        layoutConfig: analyzed.layoutConfig || { columns: 3, direction: 'horizontal', spanFullWidth: false },
        contentPriority: {
          primary: `Target capaian dan arah kompetensi yang wajib dikuasai peserta didik dalam materi ${materi}.`,
          secondary: [
            `Menyampaikan pesan gagasan pokok secara tepat dan terukur.`,
            `Membimbing pemahaman dan sikap positif peserta didik.`
          ],
          supporting: [
            `Kompas pemandu keberhasilan belajar di ${contextLabel}.`
          ]
        }
      };
    }

    // ==========================================
    // STAGE 3: FUNGSI
    // ==========================================
    if (analyzed.stage === 'fungsi') {
      return {
        id: `blk-${orderNum}-${Date.now()}-${idx}`,
        order: orderNum,
        letterIndex: letter,
        tag: 'FUNGSI & PERAN POKOK',
        title: analyzed.cleanTitle,
        subTitle: `Peran Fungsional & Kegunaan Praktis ${materi}`,
        content: `Secara fungsional, ${materi} memiliki peran operasional yang nyata dalam menjembatani kebutuhan informasi, mempermudah pemecahan masalah, dan memberikan manfaat langsung dalam kehidupan masyarakat.`,
        keyPoints: [
          `Fungsi Informasi & Edukasi: Memberikan petunjuk jelas mengenai manfaat, tata cara, dan nilai lebih materi.`,
          `Fungsi Analitis & Operasional: Membantu siswa membedakan pola, mengkategorikan data, dan menarik kesimpulan.`,
          `Fungsi Sosial & Kemasyarakatan: Menggerakkan partisipasi aktif warga dalam menciptakan kebaikan bersama.`
        ],
        exampleTitle: `Peran Fungsional Nyata`,
        example: `Konsep ini bekerja secara terus-menerus untuk menjaga keteraturan sistem komunikasi dan pemecahan masalah di sekitar kita.`,
        visualRecommendation: 'Dua kartu pilar fungsi operasional dilengkapi rincian manfaat spesifik.',
        visualElementType: 'komponen',
        accentColor: accent,
        componentsList: bundle.functionComponents || bundle.components,
        informationType: analyzed.informationType,
        visualType: analyzed.visualTypeT2,
        layoutType: analyzed.layoutType,
        layoutConfig: analyzed.layoutConfig || { columns: 2, direction: 'horizontal', spanFullWidth: false },
        contentPriority: {
          primary: `Peran operasional nyata ${materi} dalam menjembatani kebutuhan informasi dan pemecahan masalah.`,
          secondary: [
            `Fungsi Informasi & Edukasi bagi masyarakat.`,
            `Fungsi Operasional dan penggerak sosial aktif.`
          ],
          supporting: [
            `Bekerja terus menerus mempermudah kehidupan di ${contextLabel}.`
          ]
        }
      };
    }

    // ==========================================
    // STAGE 4: CIRI-CIRI / KARAKTERISTIK
    // ==========================================
    if (analyzed.stage === 'ciri_karakteristik') {
      return {
        id: `blk-${orderNum}-${Date.now()}-${idx}`,
        order: orderNum,
        letterIndex: letter,
        tag: 'CIRI-CIRI & KARAKTERISTIK',
        title: analyzed.cleanTitle,
        subTitle: `Karakteristik Khas yang Membedakan dari Konsep Lain`,
        content: `Setiap materi memiliki atribut dan ciri khas unik. Dengan mengenali ciri-ciri ${materi}, siswa dapat membedakan bentuk konsep ini secara presisi dibanding bentuk komunikasi atau materi lainnya.`,
        keyPoints: [
          `Kekhasan Format & Bahasa: Menggunakan bahasa yang terarah, padat makna, komunikatif, dan memikat.`,
          `Kriteria Khas: Ditandai oleh keterpaduan unsur-unsur pembangun dan keteraturan kaidah kerja yang baku.`,
          `Daya Pembeda Utama: Menjadi tolok ukur untuk mengidentifikasi keberhasilan penerapan materi.`
        ],
        exampleTitle: `Panduan Identifikasi`,
        example: `Perhatikan ciri pembeda utama agar tidak tertukar dengan konsep atau format teks lainnya.`,
        visualRecommendation: 'Matriks tabel perbandingan ciri khas dengan highlight atribut kontras.',
        visualElementType: 'tabel_perbandingan',
        accentColor: accent,
        comparisonData: bundle.comparison,
        informationType: analyzed.informationType,
        visualType: analyzed.visualTypeT2,
        layoutType: analyzed.layoutType,
        layoutConfig: analyzed.layoutConfig || { columns: 2, direction: 'vertical', spanFullWidth: false },
        contentPriority: {
          primary: `Atribut dan ciri khas unik yang membedakan ${materi} secara presisi dari materi lainnya.`,
          secondary: [
            `Kekhasan format dan bahasa yang komunikatif.`,
            `Kriteria keterpaduan unsur pembangun yang baku.`
          ],
          supporting: [
            `Daya pembeda utama dalam evaluasi pemahaman siswa.`
          ]
        }
      };
    }

    // ==========================================
    // STAGE 5: UNSUR & STRUKTUR
    // ==========================================
    if (analyzed.stage === 'unsur_komponen') {
      return {
        id: `blk-${orderNum}-${Date.now()}-${idx}`,
        order: orderNum,
        letterIndex: letter,
        tag: 'UNSUR & STRUKTUR',
        title: analyzed.cleanTitle,
        subTitle: `Komponen Penting Pembentuk Materi yang Lengkap`,
        content: `Keberhasilan pemahaman ${materi} ditopang oleh kesatuan struktur unsur-unsur utama yang saling berinteraksi secara fungsional. Setiap bagian memiliki peranan khusus yang tak terpisahkan.`,
        keyPoints: [
          `${bundle.components[0]?.title || 'Unsur Utama'}: ${bundle.components[0]?.description || 'Elemen primer yang membangun materi.'}`,
          `${bundle.components[1]?.title || 'Unsur Pendukung'}: ${bundle.components[1]?.description || 'Elemen penunjang yang memperkuat efektivitas pesan dan cara kerja.'}`,
          `Keterpaduan Struktur: Seluruh bagian beroperasi harmonis untuk menghasilkan pemahaman yang utuh.`
        ],
        exampleTitle: `Harmoni Antar Unsur`,
        example: `Seluruh unsur bekerja bersama-sama untuk memastikan konsep berfungsi optimal di ${contextLabel}.`,
        visualRecommendation: 'Dua kartu anatomi struktur berdampingan dengan badge unsur pembeda.',
        visualElementType: 'komponen',
        accentColor: accent,
        componentsList: bundle.components,
        informationType: analyzed.informationType,
        visualType: analyzed.visualTypeT2,
        layoutType: analyzed.layoutType,
        layoutConfig: analyzed.layoutConfig || { columns: 2, direction: 'horizontal', spanFullWidth: false },
        contentPriority: {
          primary: `Struktur kesatuan unsur utama dan pendukung yang membangun materi ${materi}.`,
          secondary: bundle.components.map(c => `${c.title}: ${c.description}`),
          supporting: [
            `Harmoni integrasi seluruh elemen pembangun.`
          ]
        }
      };
    }

    // ==========================================
    // STAGE 6: JENIS & KLASIFIKASI
    // ==========================================
    if (analyzed.stage === 'jenis_variasi') {
      return {
        id: `blk-${orderNum}-${Date.now()}-${idx}`,
        order: orderNum,
        letterIndex: letter,
        tag: 'JENIS & KLASIFIKASI',
        title: analyzed.cleanTitle,
        subTitle: `Komparasi Tipe, Ragam Bentuk, & Kondisi Penggunaan`,
        content: `Dalam praktiknya, ${materi} memiliki varian atau klasifikasi spesifik untuk merespons kebutuhan kondisi dan sasaran yang berbeda-beda.`,
        keyPoints: [
          `Identifikasi perbedaan mendasar antara ${bundle.comparison.headerA} dan ${bundle.comparison.headerB}.`,
          `Gunakan kriteria atribut yang tepat sesuai situasi dan target permasalahan yang dihadapi.`,
          `Pilih klasifikasi yang paling efektif untuk mencapai hasil belajar maksimal.`
        ],
        exampleTitle: `Panduan Pemilihan Bentuk`,
        example: `Pilihlah tipe yang paling relevan dengan sasaran agar pesan atau solusi tersampaikan efektif.`,
        visualRecommendation: 'Tabel komparasi matriks dua kolom dengan highlight warna kontras.',
        visualElementType: 'tabel_perbandingan',
        accentColor: accent,
        comparisonData: bundle.comparison,
        informationType: analyzed.informationType,
        visualType: analyzed.visualTypeT2,
        layoutType: analyzed.layoutType,
        layoutConfig: analyzed.layoutConfig || { columns: 2, direction: 'horizontal', spanFullWidth: false },
        contentPriority: {
          primary: `Komparasi ragam tipe dan varian ${materi} berdasarkan kriteria atribut spesifik.`,
          secondary: [
            `Membedakan karakteristik ${bundle.comparison.headerA} vs ${bundle.comparison.headerB}.`,
            `Panduan pemilihan jenis sesuai konteks kebutuhan.`
          ],
          supporting: [
            `Menyesuaikan pilihan bentuk dengan audiens sasaran.`
          ]
        }
      };
    }

    // ==========================================
    // STAGE 7: PROSES & ALUR KERJA
    // ==========================================
    if (analyzed.stage === 'proses_alur') {
      return {
        id: `blk-${orderNum}-${Date.now()}-${idx}`,
        order: orderNum,
        letterIndex: letter,
        tag: 'ALUR & TAHAPAN KERJA',
        title: analyzed.cleanTitle,
        subTitle: `Langkah Kerja Sistematis untuk Hasil yang Presisi`,
        content: `Ikuti alur kerja berurutan berikut untuk menerapkan konsep ${materi} secara bertahap, disiplin, dan terverifikasi.`,
        keyPoints: bundle.processSteps.map(s => `${s.title}: ${s.description}`),
        exampleTitle: `Disiplin Alur`,
        example: `Pastikan setiap tahapan selesai divalidasi sebelum melangkah ke tahapan berikutnya.`,
        visualRecommendation: 'Flowchart langkah berurutan dengan badge nomor urut mencolok.',
        visualElementType: 'flowchart',
        accentColor: accent,
        processSteps: bundle.processSteps,
        informationType: analyzed.informationType,
        visualType: analyzed.visualTypeT2,
        layoutType: analyzed.layoutType,
        layoutConfig: analyzed.layoutConfig || { columns: 4, direction: 'horizontal', spanFullWidth: true },
        contentPriority: {
          primary: `Alur tahapan kerja sistematis dan berurutan dalam mengeksekusi ${materi}.`,
          secondary: bundle.processSteps.map(s => `Tahap ${s.stepNumber}: ${s.title}`),
          supporting: [
            `Validasi output di setiap fase sebelum berpindah ke langkah selanjutnya.`
          ]
        }
      };
    }

    // ==========================================
    // STAGE 8: PERAN & PENERAPAN DALAM KEHIDUPAN
    // ==========================================
    if (analyzed.stage === 'peran_kehidupan') {
      return {
        id: `blk-${orderNum}-${Date.now()}-${idx}`,
        order: orderNum,
        letterIndex: letter,
        tag: 'PERAN & PENERAPAN NYATA',
        title: analyzed.cleanTitle,
        subTitle: `Kehadiran & Dampak Nyata di ${contextLabel}`,
        content: `Dalam kehidupan sehari-hari, ${materi} hadir dan berperan nyata dalam menyelesaikan masalah praktis, membantu masyarakat mengambil keputusan bijak, serta menggerakkan kemajuan di berbagai sektor.`,
        keyPoints: [
          `Penyelesaian Masalah Nyata: Membantu warga dan siswa menyelesaikan tantangan kontekstual di ${contextLabel}.`,
          `Dampak Sosial & Ekonomi: Meningkatkan efisiensi kerja, literasi masyarakat, dan kesadaran lingkungan.`,
          `Kecakapan Hidup Siswa: Mengasah penalaran kritis siswa Kelas ${kelas} ${jenjang} untuk berpikir solutif.`
        ],
        exampleTitle: `Fakta Kehidupan Sehari-hari`,
        example: `Penerapan konsep ${materi} yang tepat terbukti meningkatkan keteraturan dan kualitas keputusan sehari-hari.`,
        visualRecommendation: 'Grid 4 pilar penerapan dilengkapi kartu metrik statistik berdampak tinggi.',
        visualElementType: 'grafik',
        accentColor: accent,
        applicationPillars: bundle.pillars,
        statMetrics: bundle.metrics,
        informationType: analyzed.informationType,
        visualType: analyzed.visualTypeT2,
        layoutType: analyzed.layoutType,
        layoutConfig: analyzed.layoutConfig || { columns: 2, direction: 'horizontal', spanFullWidth: false },
        contentPriority: {
          primary: `Kehadiran kontekstual dan dampak nyata ${materi} di tengah masyarakat dan ${contextLabel}.`,
          secondary: [
            `Solusi pemecahan masalah praktis sehari-hari.`,
            `Meningkatkan kecakapan bernalar kritis siswa.`
          ],
          supporting: [
            `Bukti implementasi nyata dengan indikator capaian terukur.`
          ]
        }
      };
    }

    // ==========================================
    // STAGE 9: RUMUS / KALKULASI
    // ==========================================
    if (analyzed.stage === 'rumus_kalkulasi') {
      return {
        id: `blk-${orderNum}-${Date.now()}-${idx}`,
        order: orderNum,
        letterIndex: letter,
        tag: 'FORMULA & KALKULASI',
        title: analyzed.cleanTitle,
        subTitle: `Formula Matematis & Metode Perhitungan Eksak`,
        content: `Gunakan formula matematis terstandar untuk menyelesaikan persoalan ${materi} dengan langkah hitung yang terverifikasi dan logis.`,
        keyPoints: [
          `Notasi Rumus Baku: Menghubungkan variabel yang diketahui dengan variabel yang dicari.`,
          `Langkah Substitusi & Kalkulasi: Menerapkan operasi perkalian dan pembagian secara berurutan.`,
          `Verifikasi Hasil: Memastikan satuan dan besaran nilai akhir sesuai dengan konteks soal.`
        ],
        exampleTitle: `Tips Perhitungan Cepat`,
        example: `Selalu periksa kembali hubungan antar ruas sebelum menyelesaikan perkalian silang.`,
        visualRecommendation: 'Card formula aljabar dengan langkah perhitungan sistematis.',
        visualElementType: 'komponen',
        accentColor: accent,
        componentsList: bundle.components,
        informationType: analyzed.informationType,
        visualType: analyzed.visualTypeT2,
        layoutType: analyzed.layoutType,
        layoutConfig: analyzed.layoutConfig || { columns: 2, direction: 'horizontal', spanFullWidth: false },
        contentPriority: {
          primary: `Formula matematis terstandar dan notasi kalkulasi ${materi}.`,
          secondary: [
            `Langkah substitusi variabel yang diketahui.`,
            `Verifikasi besaran dan satuan hasil akhir.`
          ],
          supporting: [
            `Tips penghitungan efisien dan bebas kesalahan.`
          ]
        }
      };
    }

    // Generic Fallback Block
    return {
      id: `blk-${orderNum}-${Date.now()}-${idx}`,
      order: orderNum,
      letterIndex: letter,
      tag: analyzed.tag,
      title: analyzed.cleanTitle,
      subTitle: `Pembahasan Topik Pokok Pembelajaran`,
      content: `Pembahasan mendalam mengenai ${topicItem} dalam materi ${materi} untuk mendukung penguasaan kompetensi siswa secara komprehensif.`,
      keyPoints: [
        `Gagasan Inti: Memahami poin-poin utama dari ${topicItem}.`,
        `Keterkaitan Materi: Terhubung secara harmonis dengan materi pokok ${materi}.`,
        `Aplikasi Praktis: Bermanfaat untuk evaluasi dan tugas pembelajaran siswa.`
      ],
      exampleTitle: `Contoh Pembahasan`,
      example: `Terapkan konsep ${topicItem} secara teratur dalam kegiatan belajar di kelas.`,
      visualRecommendation: 'Card visual terstruktur dengan penanda poin dan rincian fitur.',
      visualElementType: analyzed.visualType,
      accentColor: accent,
      componentsList: bundle.components,
      informationType: analyzed.informationType,
      visualType: analyzed.visualTypeT2,
      layoutType: analyzed.layoutType,
      layoutConfig: analyzed.layoutConfig || { columns: 1, direction: 'vertical', spanFullWidth: false },
      contentPriority: {
        primary: `Uraian pokok ${topicItem} dalam materi ${materi}.`,
        secondary: [
          `Gagasan inti dan pembuktian konsep.`,
          `Keterkaitan harmonis antar topik.`
        ],
        supporting: [
          `Penerapan dalam tugas belajar di kelas.`
        ]
      }
    };
  });

  // 3. COVERAGE CHECK: Ensure all requiredTopics are covered
  const coverageCheck = performCoverageCheck(requiredTopics, blocks);
  for (const item of coverageCheck) {
    if (!item.covered) {
      // Add missing section to ensure 100% coverage
      const missingIdx = blocks.length;
      const orderNum = missingIdx + 1;
      const letter = String.fromCharCode(65 + missingIdx);
      const analyzed = analyzeScopeItem(item.topic, missingIdx, materi, mataPelajaran);
      blocks.push({
        id: `blk-cov-${orderNum}-${Date.now()}`,
        order: orderNum,
        letterIndex: letter,
        tag: analyzed.tag,
        title: item.topic,
        subTitle: `Pembahasan Lengkap Topik Wajib`,
        content: `Uraian terstruktur mengenai ${item.topic} sebagai bagian dari cakupan materi wajib ${materi} (${mataPelajaran} - Kelas ${kelas}).`,
        keyPoints: [
          `Poin Kunci 1: Penjelasan substansial mengenai ${item.topic}.`,
          `Poin Kunci 2: Karakteristik dan peran dalam pembelajaran.`,
          `Poin Kunci 3: Contoh penerapan dalam kehidupan sehari-hari.`
        ],
        exampleTitle: `Contoh Praktis`,
        example: `Penerapan ${item.topic} dalam konteks nyata yang mudah diamati siswa.`,
        visualRecommendation: 'Card visual terstruktur dengan highlight poin utama.',
        visualElementType: analyzed.visualType,
        accentColor: colorPalette[missingIdx % colorPalette.length],
        informationType: analyzed.informationType,
        visualType: analyzed.visualTypeT2,
        layoutType: analyzed.layoutType,
        layoutConfig: analyzed.layoutConfig || { columns: 2, direction: 'horizontal', spanFullWidth: false },
        contentPriority: {
          primary: `Uraian terstruktur mengenai ${item.topic}.`,
          secondary: [
            `Karakteristik dan peran dalam pembelajaran.`
          ],
          supporting: [
            `Contoh penerapan nyata.`
          ]
        }
      });
    }
  }

  // 4. APPEND RANGKUMAN KUNCI AS FINAL SUMMARY
  const summaryOrder = blocks.length + 1;
  const summaryLetter = String.fromCharCode(65 + blocks.length);
  const summaryPoints = generateTopicSpecificSummaryPoints(context, blocks);

  blocks.push({
    id: `blk-summary-${Date.now()}`,
    order: summaryOrder,
    letterIndex: summaryLetter,
    tag: 'RANGKUMAN KUNCI',
    title: 'RANGKUMAN KUNCI',
    subTitle: 'Intisari Pembelajaran untuk Evaluasi',
    content: `Intisari konsep terpenting dari materi ${materi} (${mataPelajaran} - Kelas ${kelas} ${jenjang}) yang wajib dikuasai peserta didik:`,
    keyPoints: summaryPoints,
    exampleTitle: 'Kunci Penguasaan',
    example: `Kuasai keterkaitan antar konsep materi ${materi} untuk membangun pemahaman yang kokoh dan aplikatif.`,
    visualRecommendation: 'Card rangkuman terstruktur dengan 1-3 poin konsep kunci dan penjelasan ringkas.',
    visualElementType: 'ringkasan_kotak',
    accentColor: 'violet',
    informationType: 'summary',
    visualType: 'summary_card',
    layoutType: 'single-column',
    layoutConfig: { columns: 1, direction: 'vertical', spanFullWidth: true },
    contentPriority: {
      primary: `Intisari konsep terpenting dari materi ${materi} (${mataPelajaran} - Kelas ${kelas} ${jenjang}).`,
      secondary: summaryPoints,
      supporting: [
        `Kuasai keterkaitan antar konsep materi untuk evaluasi pemahaman yang kokoh.`
      ]
    }
  });

  return blocks;
}

/**
 * Generate full new Draft strictly from activeProjectContext
 */
export function createDraftFromContext(context: ActiveProjectContext): InfographicDraft {
  const { jenjang, kelas, mataPelajaran, tema, materi, cakupanMateri, gayaVisual, format, tingkatVisual, konteksContoh, customExampleContext } = context;
  const bundle = generateDomainTopicBundle(mataPelajaran, materi, tema, jenjang, kelas, 'Kehidupan Sehari-hari');

  const pipelineResult = runContentEnginePipeline(context);
  const requiredTopics = parseScopeToRequiredTopics(cakupanMateri, materi);
  const blocks = pipelineResult.blocks;
  const coverageChecklist = performCoverageCheck(requiredTopics, blocks);

  const draft: InfographicDraft = {
    id: `proj-${Date.now()}`,
    title: `${materi.toUpperCase()} : ${tema.toUpperCase()}`,
    subTitle: `Materi Pokok ${mataPelajaran} • Kelas ${kelas} ${jenjang}`,
    tagline: `Panduan Visual Pembelajaran Terstruktur Kurikulum Merdeka`,
    learningObjective: `Peserta didik mampu memahami konsep dasar, menganalisis struktur komponen, membandingkan variasi karakteristik, dan menerapkan materi ${materi} dalam pemecahan masalah kontekstual.`,
    educationLevel: jenjang,
    grade: kelas,
    subject: mataPelajaran,
    theme: tema,
    rawTopic: materi,
    scope: cakupanMateri,
    requiredTopics,
    coverageChecklist,
    contentValidation: pipelineResult.validation,
    visualStyle: gayaVisual || 'Modern Edukatif',
    customVisualStyle: customExampleContext || '',
    styleConfig: getStyleConfig(gayaVisual || 'Modern Edukatif', customExampleContext),
    format: format || 'portrait',
    visualLevel: tingkatVisual || 'seimbang',
    exampleContext: konteksContoh || 'otomatis',
    customExampleContext: customExampleContext || '',
    overview: pipelineResult.overview,
    contentSnapshot: pipelineResult.contentSnapshot,
    blocks,
    conceptHighlights: bundle.highlights,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    thumbnailColor: 'indigo',
    authorName: 'STIVIA Smart Teacher',
    authorRole: `Guru ${mataPelajaran} ${jenjang}`
  };

  return draft;
}

/**
 * Get or dynamically build ContentSnapshot from any InfographicDraft (Single Source of Truth)
 */
export function getContentSnapshotFromDraft(draft: InfographicDraft): import('../types').ContentSnapshot {
  if (draft.contentSnapshot) {
    return draft.contentSnapshot;
  }

  const sections: import('../types').ContentSnapshotSection[] = (draft.blocks || []).map((b, idx) => ({
    order: b.order || idx + 1,
    letterIndex: b.letterIndex || String.fromCharCode(65 + idx),
    title: b.title,
    coreIdea: b.coreIdea || b.content,
    explanation: b.explanation || b.content,
    keyPoints: b.keyPoints || [],
    example: b.example,
    exampleTitle: b.exampleTitle,
    weight: b.weight || 'SEDANG',
    depth: b.depth || 'SEDANG',
    visualPriority: b.visualPriority || 'SEKUNDER',
    presentationType: b.presentationType || 'Definisi + penjelasan',
    sourceCoverage: b.sourceCoverage || b.title,
  }));

  const keySummary = [
    `Pondasi Konsep: Penguasaan hakikat dan batasan konsep ${draft.rawTopic || draft.title}.`,
    `Struktur & Mekanisme: Mengenali komponen pembangun dan hubungan logis materi.`,
    `Penerapan Praktis: Kemampuan menghubungkan materi dengan pemecahan masalah nyata.`
  ];

  return {
    identity: {
      educationLevel: draft.educationLevel,
      grade: draft.grade,
      subject: draft.subject,
      theme: draft.theme,
      topic: draft.rawTopic || draft.title,
      scope: draft.scope,
      learningObjective: draft.learningObjective,
    },
    title: draft.title,
    overview: draft.overview || `Materi pembelajaran ${draft.rawTopic || draft.title} pada mata pelajaran ${draft.subject} untuk jenjang ${draft.educationLevel} Kelas ${draft.grade} dirancang terstruktur dan aplikatif.`,
    sections,
    keySummary,
    createdAt: draft.createdAt || new Date().toISOString(),
    version: '2.2c',
  };
}

/**
 * Strict Validation & Sanitization Engine
 * Ensures NO leaked content or cross-subject anomalies can persist
 */
export function validateAndSanitizeDraft(draft: InfographicDraft): InfographicDraft {
  const normSubject = (draft.subject || '').toLowerCase();
  const isInformatika = normSubject.includes('informatika') || normSubject.includes('komputer') || normSubject.includes('koding');

  // Forbidden terms in non-informatics subjects
  const forbiddenInformaticsTerms = ['dijkstra', 'graph tak terarah', 'graph berbobot', 'social graph', 'simpul (node)', 'garis (edge)', 'node a', 'node b'];
  
  // Forbidden generic template sentences banned across all subjects
  const genericBannedPhrases = [
    'pola hubungan antar variabel yang konsisten',
    'manfaat praktis pengetahuan ini untuk pemecahan masalah lanjutan',
    'lorem ipsum',
    'pilar kunci yang wajib diingat siswa',
  ];

  const containsForbiddenTerms = (str?: string) => {
    if (!str) return false;
    const lower = str.toLowerCase();
    if (!isInformatika && forbiddenInformaticsTerms.some(term => lower.includes(term))) {
      return true;
    }
    return genericBannedPhrases.some(phrase => lower.includes(phrase));
  };

  let needsRegeneration = false;

  // Check blocks
  for (const block of draft.blocks || []) {
    if (
      containsForbiddenTerms(block.title) || 
      containsForbiddenTerms(block.content) || 
      containsForbiddenTerms(block.subTitle) ||
      (block.keyPoints && block.keyPoints.some(pt => containsForbiddenTerms(pt)))
    ) {
      needsRegeneration = true;
      break;
    }
  }

  if (needsRegeneration) {
    const freshContext: ActiveProjectContext = {
      jenjang: draft.educationLevel || 'SMP',
      kelas: draft.grade || '8',
      mataPelajaran: draft.subject || 'Bahasa Indonesia',
      tema: draft.theme || 'Pembelajaran Terpadu',
      materi: draft.rawTopic || 'Materi Pokok',
      cakupanMateri: draft.scope || '1. Pengertian\n2. Tujuan\n3. Fungsi\n4. Ciri-ciri\n5. Peran dalam kehidupan',
      gayaVisual: draft.visualStyle,
      format: draft.format,
      tingkatVisual: draft.visualLevel,
      konteksContoh: draft.exampleContext,
      customExampleContext: draft.customExampleContext
    };

    return createDraftFromContext(freshContext);
  }

  // Ensure summary block is properly formatted as RANGKUMAN KUNCI
  const summaryBlock = (draft.blocks || []).find(b => b.visualElementType === 'ringkasan_kotak' || b.tag.includes('RANGKUMAN'));
  if (summaryBlock) {
    summaryBlock.tag = 'RANGKUMAN KUNCI';
    summaryBlock.title = 'RANGKUMAN KUNCI';
    summaryBlock.subTitle = 'Intisari Pembelajaran untuk Evaluasi';
  }

  // Re-calculate coverageChecklist if missing
  if (!draft.coverageChecklist || draft.coverageChecklist.length === 0) {
    const requiredTopics = draft.requiredTopics || parseScopeToRequiredTopics(draft.scope || '', draft.rawTopic || '');
    draft.requiredTopics = requiredTopics;
    draft.coverageChecklist = performCoverageCheck(requiredTopics, draft.blocks || []);
  }

  return draft;
}

/**
 * TAHAP 4: Layout Variations Engine
 * Generates alternative compatible visual layout representations without modifying content or requiredTopics
 */
export function generateLayoutVariations(currentDraft: InfographicDraft, variationCycle: number = 1): InfographicDraft {
  const updatedBlocks = currentDraft.blocks.map((block, idx) => {
    // Summary block remains standard summary card
    if (block.visualElementType === 'ringkasan_kotak' || block.informationType === 'summary') {
      return block;
    }

    const infoType = block.informationType || 'definition';
    let newVisualType = block.visualType;
    let newLayoutType = block.layoutType;
    let newLayoutConfig = { ...block.layoutConfig };

    // Select compatible alternative representation based on informationType and variationCycle
    switch (infoType) {
      case 'definition': {
        const variants: { vType: VisualType; lType: LayoutType; cols: number; dir?: 'horizontal' | 'vertical' }[] = [
          { vType: 'hero_definition', lType: 'hero', cols: 1 },
          { vType: 'split_definition', lType: 'two-column', cols: 2, dir: 'horizontal' },
          { vType: 'concept_card', lType: 'single-column', cols: 1, dir: 'vertical' },
        ];
        const choice = variants[(idx + variationCycle) % variants.length];
        newVisualType = choice.vType;
        newLayoutType = choice.lType;
        newLayoutConfig = { columns: choice.cols, direction: choice.dir || 'vertical', spanFullWidth: choice.lType === 'hero' };
        break;
      }

      case 'process':
      case 'timeline': {
        const variants: { vType: VisualType; lType: LayoutType; cols: number; dir: 'horizontal' | 'vertical' }[] = [
          { vType: 'horizontal_flow', lType: 'flow-horizontal', cols: 4, dir: 'horizontal' },
          { vType: 'vertical_flow', lType: 'flow-vertical', cols: 1, dir: 'vertical' },
          { vType: 'step_by_step', lType: 'timeline', cols: 2, dir: 'horizontal' },
        ];
        const choice = variants[(idx + variationCycle) % variants.length];
        newVisualType = choice.vType;
        newLayoutType = choice.lType;
        newLayoutConfig = { columns: choice.cols, direction: choice.dir, spanFullWidth: true };
        break;
      }

      case 'characteristics': {
        const variants: { vType: VisualType; lType: LayoutType; cols: number; dir?: 'horizontal' | 'vertical' }[] = [
          { vType: 'feature_grid', lType: 'feature-grid', cols: 2, dir: 'horizontal' },
          { vType: 'checklist', lType: 'checklist', cols: 1, dir: 'vertical' },
          { vType: 'feature_cards', lType: 'three-column', cols: 3, dir: 'horizontal' },
          { vType: 'icon_checklist', lType: 'two-column', cols: 2, dir: 'horizontal' },
        ];
        const choice = variants[(idx + variationCycle) % variants.length];
        newVisualType = choice.vType;
        newLayoutType = choice.lType;
        newLayoutConfig = { columns: choice.cols, direction: choice.dir || 'horizontal', spanFullWidth: false };
        break;
      }

      case 'components': {
        const variants: { vType: VisualType; lType: LayoutType; cols: number }[] = [
          { vType: 'component_cards', lType: 'two-column', cols: 2 },
          { vType: 'parts_diagram', lType: 'feature-grid', cols: 3 },
          { vType: 'hub_and_spoke', lType: 'diagram', cols: 2 },
        ];
        const choice = variants[(idx + variationCycle) % variants.length];
        newVisualType = choice.vType;
        newLayoutType = choice.lType;
        newLayoutConfig = { columns: choice.cols, direction: 'horizontal', spanFullWidth: false };
        break;
      }

      case 'comparison': {
        const variants: { vType: VisualType; lType: LayoutType; cols: number }[] = [
          { vType: 'comparison_table', lType: 'comparison', cols: 1 },
          { vType: 'side_by_side', lType: 'two-column', cols: 2 },
          { vType: 'comparison_layout', lType: 'comparison', cols: 2 },
        ];
        const choice = variants[(idx + variationCycle) % variants.length];
        newVisualType = choice.vType;
        newLayoutType = choice.lType;
        newLayoutConfig = { columns: choice.cols, direction: 'horizontal', spanFullWidth: true };
        break;
      }

      case 'goals':
      case 'functions': {
        const variants: { vType: VisualType; lType: LayoutType; cols: number }[] = [
          { vType: 'goal_cards', lType: 'three-column', cols: 3 },
          { vType: 'function_cards', lType: 'two-column', cols: 2 },
          { vType: 'target_layout', lType: 'feature-grid', cols: 2 },
          { vType: 'icon_list', lType: 'single-column', cols: 1 },
        ];
        const choice = variants[(idx + variationCycle) % variants.length];
        newVisualType = choice.vType;
        newLayoutType = choice.lType;
        newLayoutConfig = { columns: choice.cols, direction: 'horizontal', spanFullWidth: false };
        break;
      }

      case 'relationship':
      case 'example':
      case 'real_life_context': {
        const variants: { vType: VisualType; lType: LayoutType; cols: number }[] = [
          { vType: 'context_cards', lType: 'two-column', cols: 2 },
          { vType: 'daily_life_pillars', lType: 'feature-grid', cols: 2 },
          { vType: 'scenario_layout', lType: 'single-column', cols: 1 },
          { vType: 'relationship_diagram', lType: 'diagram', cols: 2 },
        ];
        const choice = variants[(idx + variationCycle) % variants.length];
        newVisualType = choice.vType;
        newLayoutType = choice.lType;
        newLayoutConfig = { columns: choice.cols, direction: 'horizontal', spanFullWidth: false };
        break;
      }

      default: {
        const variants: { vType: VisualType; lType: LayoutType; cols: number }[] = [
          { vType: 'concept_card', lType: 'two-column', cols: 2 },
          { vType: 'feature_grid', lType: 'feature-grid', cols: 2 },
          { vType: 'split_definition', lType: 'single-column', cols: 1 },
        ];
        const choice = variants[(idx + variationCycle) % variants.length];
        newVisualType = choice.vType;
        newLayoutType = choice.lType;
        newLayoutConfig = { columns: choice.cols, direction: 'horizontal', spanFullWidth: false };
      }
    }

    return {
      ...block,
      visualType: newVisualType,
      layoutType: newLayoutType,
      layoutConfig: newLayoutConfig,
    };
  });

  const nextCycle = (currentDraft.layoutVariationCycle || 0) + 1;
  const newArchetype = determineLayoutArchetype(
    { ...currentDraft, blocks: updatedBlocks, layoutVariationCycle: nextCycle },
    nextCycle
  );

  return {
    ...currentDraft,
    blocks: updatedBlocks,
    layoutTemplate: newArchetype,
    layoutVariationCycle: nextCycle,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * TAHAP 4: Material Content Regeneration Engine
 * Re-runs the Content Engine to create fresh pedagogical explanations while keeping identical requiredTopics and order
 */
export function regenerateMaterialContent(currentDraft: InfographicDraft, variationCycle: number = 1): InfographicDraft {
  const context: ActiveProjectContext = {
    jenjang: currentDraft.educationLevel,
    kelas: currentDraft.grade,
    mataPelajaran: currentDraft.subject,
    tema: currentDraft.theme,
    materi: currentDraft.rawTopic,
    cakupanMateri: currentDraft.scope,
    gayaVisual: currentDraft.visualStyle,
    customVisualStyle: currentDraft.customVisualStyle,
    format: currentDraft.format,
    tingkatVisual: currentDraft.visualLevel,
    konteksContoh: currentDraft.exampleContext,
    customExampleContext: currentDraft.customExampleContext,
    styleConfig: currentDraft.styleConfig
  };

  // Re-generate fresh blocks from context
  const freshBlocks = generateMaterialBlocksFromContext(context);
  
  // Mandatory Coverage Check validation
  const requiredTopics = currentDraft.requiredTopics || parseScopeToRequiredTopics(currentDraft.scope, currentDraft.rawTopic);
  const coverageChecklist = performCoverageCheck(requiredTopics, freshBlocks);

  const updatedDraft: InfographicDraft = {
    ...currentDraft,
    blocks: freshBlocks,
    requiredTopics,
    coverageChecklist,
    updatedAt: new Date().toISOString(),
    status: 'draft',
  };

  return validateAndSanitizeDraft(updatedDraft);
}

/**
 * TAHAP 4: Visual Style Switcher Engine
 * Updates design tokens, visual configuration, and layout archetype without altering material content facts
 */
export function updateDraftStyle(currentDraft: InfographicDraft, newStyle: string, customStyleText?: string): InfographicDraft {
  const newStyleConfig = getStyleConfig(newStyle, customStyleText);
  
  // Clone blocks to preserve 100% of material content while detaching previous references
  const preservedBlocks = (currentDraft.blocks || []).map((b) => ({ ...b }));

  // Evaluate the ideal layout archetype for this new visual style
  const matchedLayout = determineLayoutArchetype({
    ...currentDraft,
    visualStyle: newStyle,
    customVisualStyle: customStyleText || '',
    layoutTemplate: undefined, // ensure layout classifier evaluates the new style cleanly
    layoutVariationCycle: 0,
    blocks: preservedBlocks,
  }, 0);

  // Return a fresh, clean draft with updated visual configuration and no stale cached layout
  const updatedDraft: InfographicDraft = {
    ...currentDraft,
    visualStyle: newStyle,
    customVisualStyle: customStyleText || '',
    styleConfig: newStyleConfig,
    layoutTemplate: matchedLayout,
    layoutVariationCycle: 0,
    blocks: preservedBlocks,
    finalOutput: undefined, // invalidate old locked snapshot to trigger fresh lock
    updatedAt: new Date().toISOString(),
  };

  return updatedDraft;
}
