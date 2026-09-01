import { 
  ContentDepth, 
  ContentWeight,
  VisualPriority,
  PresentationType,
  MaterialBlock, 
  ActiveProjectContext 
} from '../types';
import { WeightedStructureItem } from './contentWeightEngine';
import { 
  generateDomainTopicBundle, 
  analyzeScopeItem 
} from '../data/materialGenerator';

export interface DeepContentBlock extends MaterialBlock {
  depth: ContentDepth;
  depthDescription: string;
  coreIdea: string;
  explanation: string;
  presentationType: string;
}

export interface ContentDepthEngineOutput {
  blocks: DeepContentBlock[];
  overview: string;                // Gambaran Umum / Pengantar (1-3 kalimat)
  keySummary: string[];            // Rangkuman Kunci (2-4 poin utama sederhana)
  depthSummary: {
    ringkasCount: number;
    sedangCount: number;
    mendalamCount: number;
  };
}

/**
 * TAHAP 2C — CONTENT DEPTH ENGINE (STIVIA)
 * 
 * Menghasilkan komponen materi terstruktur dan kedalaman proporsional:
 * - INTI SETIAP BAGIAN: Apa hal terpenting yang harus dipahami siswa (singkat & jelas).
 * - PENJELASAN: Sesuai tingkat kepentingan dan kompleksitas.
 * - POIN PENTING: Bullet points yang mudah dipahami.
 * - CONTOH / KONTEKS: Hanya jika relevan & membantu (tidak dipaksakan di semua bagian).
 * - JENIS PENYAJIAN: Format visual/teks terbaik untuk bagian tersebut.
 */
export function runContentDepthEngine(
  weightedItems: WeightedStructureItem[],
  context: ActiveProjectContext
): ContentDepthEngineOutput {
  const { jenjang, kelas, mataPelajaran, tema, materi, konteksContoh, customExampleContext, cakupanMateri } = context;

  // Context Label for Real-World Examples
  let contextLabel = 'Kehidupan Sehari-hari';
  if (konteksContoh === 'sekolah') contextLabel = 'Lingkungan Sekolah';
  else if (konteksContoh === 'rumah') contextLabel = 'Lingkungan Rumah & Keluarga';
  else if (konteksContoh === 'teknologi') contextLabel = 'Dunia Digital & Teknologi';
  else if (konteksContoh === 'lokal') contextLabel = 'Kearifan Lokal & Budaya Nusantara';
  else if (konteksContoh === 'akademik') contextLabel = 'Eksperimen & Riset Ilmiah';
  else if (konteksContoh === 'kustom' && customExampleContext) contextLabel = customExampleContext;

  const bundle = generateDomainTopicBundle(mataPelajaran, materi, tema, jenjang, kelas, contextLabel);
  const colorPalette: ('indigo' | 'teal' | 'amber' | 'emerald' | 'sky')[] = ['indigo', 'teal', 'amber', 'emerald', 'sky'];

  // Gambaran Umum / Pengantar (1-3 kalimat pengantar kontekstual)
  const overview = `Materi pembelajaran ${materi} pada mata pelajaran ${mataPelajaran} untuk jenjang ${jenjang} Kelas ${kelas} dirancang untuk membekali peserta didik dengan pemahaman konsep yang kokoh, terstruktur, dan aplikatif dalam tema ${tema}.`;

  const blocks: DeepContentBlock[] = weightedItems.map((item, idx) => {
    const orderNum = idx + 1;
    const letter = String.fromCharCode(65 + idx);
    const accent = colorPalette[idx % colorPalette.length];
    const analyzed = analyzeScopeItem(item.rawText, idx, materi, mataPelajaran);

    // 1. Tentukan kedalaman berdasarkan Bobot (Tahap 2B)
    let depth: ContentDepth = 'SEDANG';
    let depthDescription = 'Kedalaman pembahasan sedang dengan poin-poin terstruktur.';

    const isHighWeight = item.weight === 'TINGGI' || item.weight === 'UTAMA';
    const isLowWeight = item.weight === 'RENDAH' || item.weight === 'RINGAN';

    if (isLowWeight) {
      depth = 'RINGKAS';
      depthDescription = 'Pembahasan ringkas dan padat untuk pengantar atau konsep penunjang.';
    } else if (isHighWeight) {
      depth = 'MENDALAM';
      depthDescription = 'Pembahasan mendalam dan komprehensif dengan rincian unsur & relasi konsep.';
    }

    // 2. Tentukan Jenis Penyajian (Presentation Type)
    let presentationType = 'Definisi + penjelasan';
    if (analyzed.stage === 'ciri_karakteristik') presentationType = 'Checklist';
    else if (analyzed.stage === 'tujuan' || analyzed.stage === 'fungsi') presentationType = 'Bullet point';
    else if (analyzed.stage === 'unsur_komponen') presentationType = 'Bullet point';
    else if (analyzed.stage === 'jenis_variasi') presentationType = 'Perbandingan';
    else if (analyzed.stage === 'proses_alur') presentationType = 'Numbered list';
    else if (analyzed.stage === 'peran_kehidupan') presentationType = 'Konsep + contoh';
    else if (analyzed.stage === 'rumus_kalkulasi') presentationType = 'Definisi + penjelasan';

    // 3. Special Handling: Rangkuman Kunci di akhir
    if (item.isSummary) {
      const summaryHighlights = bundle.highlights && bundle.highlights.length > 0 
        ? bundle.highlights 
        : [
            `Pondasi Konsep: Penguasaan hakikat dan batasan konsep ${materi}.`,
            `Penerapan Praktis: Kemampuan menghubungkan materi dengan persoalan di ${contextLabel}.`,
            `Capaian Belajar: Penguatan nalar kritis sesuai standar capaian ${mataPelajaran}.`
          ];

      return {
        id: `blk-${orderNum}-${Date.now()}-${idx}`,
        order: orderNum,
        letterIndex: letter,
        tag: 'RANGKUMAN KUNCI',
        title: item.cleanTitle,
        subTitle: `Sintesis Esensial Materi ${materi}`,
        coreIdea: `Rangkuman menyeluruh yang mengikat seluruh konsep pokok ${materi} menjadi satu kesatuan pemahaman yang utuh.`,
        content: `Kesimpulan inti dari seluruh pembahasan ${materi} dalam ${mataPelajaran} (${jenjang} Kelas ${kelas}). Ingat dan kuasai poin-poin emas berikut sebagai bekal pemahaman jangka panjang.`,
        explanation: `Sintesis menyeluruh dari topik-topik yang telah dibahas untuk mengunci pemahaman siswa.`,
        keyPoints: summaryHighlights,
        subPoints: [
          `Pahami hubungan antar konsep secara holistik`,
          `Gunakan sebagai rujukan cepat dalam belajar mandiri`
        ],
        exampleTitle: `Golden Takeaway`,
        example: `Penguasaan materi ini menjadi pondasi kuat untuk melangkah ke materi pembelajaran selanjutnya.`,
        visualRecommendation: 'Kotak rangkuman emas dengan kartu kesimpulan utama dan badge capaian.',
        visualElementType: 'ringkasan_kotak',
        accentColor: 'indigo',
        sourceCoverage: item.sourceCoverage,
        weight: 'TINGGI',
        depth: 'MENDALAM',
        depthDescription: 'Sintesis mendalam yang merangkum seluruh esensi materi yang telah dibahas.',
        visualPriority: 'UTAMA',
        presentationType: 'Bullet point',
        informationType: 'summary',
        visualType: 'summary_card',
        layoutType: 'mixed',
        layoutConfig: { columns: 3, direction: 'horizontal', spanFullWidth: true },
        contentPriority: {
          primary: `Sintesis menyeluruh dari seluruh cakupan ${materi}.`,
          secondary: summaryHighlights,
          supporting: [`Refleksi capaian pembelajaran ${mataPelajaran} Kelas ${kelas}.`]
        }
      };
    }

    // 4. Sintesis Inti Materi (Core Idea), Penjelasan (Explanation), & Poin Penting (Key Points)
    let coreIdea = '';
    let explanation = '';
    let keyPoints: string[] = [];
    let subPoints: string[] = [];
    let example: string | undefined = undefined;
    let exampleTitle: string | undefined = undefined;

    // Inti materi spesifik per stage
    if (analyzed.stage === 'pengertian') {
      coreIdea = `${materi} adalah konsep fundamental dalam ${mataPelajaran} yang mendasari pemahaman topik secara keseluruhan.`;
    } else if (analyzed.stage === 'tujuan') {
      coreIdea = `Tujuan utama ${materi} adalah memberikan arah dan standar capaian yang jelas dalam penerapan pembelajarannya.`;
    } else if (analyzed.stage === 'fungsi') {
      coreIdea = `Fungsi ${materi} berperan sebagai instrumen utama dalam menjalankan perannya secara optimal.`;
    } else if (analyzed.stage === 'ciri_karakteristik') {
      coreIdea = `${materi} memiliki karakteristik pembeda yang khas sehingga mudah dikenali dan diidentifikasi.`;
    } else if (analyzed.stage === 'unsur_komponen') {
      coreIdea = `${materi} tersusun dari unsur-unsur pembangun yang saling terhubung dan tidak dapat dipisahkan.`;
    } else if (analyzed.stage === 'jenis_variasi') {
      coreIdea = `Variasi dan klasifikasi ${materi} membantu memetakan jenis-jenisnya sesuai konteks kebutuhan.`;
    } else if (analyzed.stage === 'proses_alur') {
      coreIdea = `Alur tahapan ${materi} tersusun secara logis dan runtut dari langkah awal hingga tercapainya hasil.`;
    } else if (analyzed.stage === 'peran_kehidupan') {
      coreIdea = `Dalam ${contextLabel}, ${materi} memiliki peran nyata untuk menyelesaikan persoalan praktis.`;
    } else {
      coreIdea = `${item.cleanTitle} merupakan bagian penting dari materi ${materi} yang menunjang pemahaman topik secara terpadu.`;
    }

    // Penjelasan proporsional berdasarkan Kedalaman (depth)
    if (depth === 'RINGKAS') {
      explanation = `${item.cleanTitle} memberikan pemahaman awal mengenai batasan dan landasan konsep ${materi} secara padat dan fokus.`;
      keyPoints = [
        `Konsep Pokok: Memahami definisi awal dan batasan ${materi}.`,
        `Fokus Esensial: Mengetahui prinsip dasar tanpa rincian berlebih.`
      ];
      subPoints = [`Poin pengantar esensial`];
    } else if (depth === 'SEDANG') {
      explanation = `Dalam pembelajaran ${mataPelajaran}, ${item.cleanTitle} menghubungkan konsep ${materi} dengan fakta dan kebutuhan terstruktur peserta didik.`;
      keyPoints = [
        `Aspek Utama: Membedakan karakteristik dan fungsi secara teratur.`,
        `Keterpaduan Konsep: Menghubungkan teori ${materi} dengan penerapannya.`,
        `Manfaat Praktis: Memberikan panduan jelas bagi pemahaman siswa.`
      ];
      subPoints = [
        `Kesesuaian dengan indikator capaian kelas ${kelas}`,
        `Aplikasi dalam diskusi dan pemecahan masalah`
      ];
    } else {
      // MENDALAM
      explanation = `${item.cleanTitle} merupakan bagian inti yang paling mendasar dalam materi ${materi}. Penguasaan menyeluruh terhadap struktur dan mekanismenya sangat menentukan keberhasilan pemahaman materi secara utuh.`;
      keyPoints = [
        `Prinsip Fundamental: Membedah struktur dan mekanisme kerja internal ${materi} secara presisi.`,
        `Analisis Kritis: Memahami mengapa setiap unsur saling bergantung dan tidak dapat dipisahkan.`,
        `Kaidah Baku: Mengikuti kaidah saintifik dan alur logis materi ${mataPelajaran}.`,
        `Dampak Pemahaman: Menghindarkan siswa dari miskonsepsi umum dalam topik ini.`
      ];
      subPoints = [
        `Rincian unsur pembangun primer dan sekunder`,
        `Hubungan sebab-akibat antar komponen konsep`,
        `Strategi identifikasi dan pemecahan kasus kompleks`
      ];
    }

    // Hanya jika bagian ini adalah penerapan nyata / konteks kehidupan khusus, sertakan contoh kontekstual spesifik
    if (analyzed.stage === 'peran_kehidupan' || analyzed.informationType === 'real_life_context') {
      exampleTitle = `Contoh Nyata di ${contextLabel}`;
      example = `Penerapan ${materi} dalam menyelesaikan masalah praktis di ${contextLabel}.`;
    }

    // Gabungkan konten lengkap
    const content = `${coreIdea} ${explanation}`;

    // Integrasikan data kaya jika ada dari bundle
    let conceptDiagram = undefined;
    let componentsList = undefined;
    let comparisonData = undefined;
    let processSteps = undefined;

    if (analyzed.stage === 'pengertian') {
      conceptDiagram = bundle.conceptDiagram;
    } else if (analyzed.stage === 'tujuan' || analyzed.stage === 'fungsi' || analyzed.stage === 'unsur_komponen' || analyzed.stage === 'rumus_kalkulasi') {
      componentsList = analyzed.stage === 'tujuan' 
        ? (bundle.goalComponents || bundle.components)
        : analyzed.stage === 'fungsi'
          ? (bundle.functionComponents || bundle.components)
          : bundle.components;
    } else if (analyzed.stage === 'ciri_karakteristik' || analyzed.stage === 'jenis_variasi') {
      comparisonData = bundle.comparison;
    } else if (analyzed.stage === 'proses_alur') {
      processSteps = bundle.processSteps;
    }

    return {
      id: `blk-${orderNum}-${Date.now()}-${idx}`,
      order: orderNum,
      letterIndex: letter,
      tag: analyzed.tag,
      title: analyzed.cleanTitle,
      subTitle: `Pembahasan ${item.weight === 'TINGGI' || item.weight === 'UTAMA' ? 'Mendalam' : item.weight === 'SEDANG' ? 'Terstruktur' : 'Ringkas'} ${materi}`,
      coreIdea,
      content,
      explanation,
      keyPoints,
      subPoints,
      example,
      exampleTitle,
      visualRecommendation: `Visualisasi ${analyzed.visualType.replace('_', ' ')} yang disesuaikan dengan bobot ${item.weight}.`,
      visualElementType: analyzed.visualType,
      accentColor: accent,
      sourceCoverage: item.sourceCoverage,
      weight: item.weight,
      depth,
      depthDescription,
      visualPriority: item.visualPriority,
      presentationType,
      informationType: analyzed.informationType,
      visualType: analyzed.visualTypeT2,
      layoutType: analyzed.layoutType,
      layoutConfig: analyzed.layoutConfig || { columns: item.weight === 'TINGGI' || item.weight === 'UTAMA' ? 2 : 1, direction: 'horizontal', spanFullWidth: (item.weight === 'TINGGI' || item.weight === 'UTAMA') && idx === weightedItems.length - 2 },
      conceptDiagram,
      componentsList,
      comparisonData,
      processSteps,
      contentPriority: {
        primary: content,
        secondary: keyPoints,
        supporting: subPoints,
      },
    };
  });

  // Rangkuman Kunci (2-4 poin utama sederhana yang merangkum hal terpenting yang sudah dibahas)
  const keySummary = [
    `Penguasaan Konsep: Memahami hakikat, batasan, dan prinsip dasar ${materi}.`,
    `Struktur & Mekanisme: Mengenali komponen pembangun dan hubungan logis antarbagian materi.`,
    `Aplikasi Nyata: Mampu menerapkan pengetahuan ${materi} secara tepat dalam konteks ${contextLabel}.`
  ];

  const ringkasCount = blocks.filter(b => b.depth === 'RINGKAS').length;
  const sedangCount = blocks.filter(b => b.depth === 'SEDANG').length;
  const mendalamCount = blocks.filter(b => b.depth === 'MENDALAM').length;

  return {
    blocks,
    overview,
    keySummary,
    depthSummary: {
      ringkasCount,
      sedangCount,
      mendalamCount,
    },
  };
}
