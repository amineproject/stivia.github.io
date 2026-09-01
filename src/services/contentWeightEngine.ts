import { 
  ContentWeight, 
  VisualPriority, 
  ScopeStructureItem, 
  ActiveProjectContext 
} from '../types';

export interface WeightedStructureItem extends ScopeStructureItem {
  weight: ContentWeight;          // TINGGI | SEDANG | RENDAH
  visualPriority: VisualPriority; // UTAMA | SEKUNDER | PENDUKUNG
  weightReason: string;
  complexityScore: number;        // 1 to 3
}

export interface ContentWeightEngineOutput {
  weightedItems: WeightedStructureItem[];
  weightSummary: {
    tinggiCount: number;
    sedangCount: number;
    rendahCount: number;
    // Backward-compat aliases
    ringanCount: number;
    utamaCount: number;
  };
}

/**
 * TAHAP 2B — CONTENT WEIGHT ENGINE (STIVIA)
 * 
 * Menentukan bobot setiap bagian materi: TINGGI | SEDANG | RENDAH
 * 
 * ATURAN PENENTUAN BOBOT (5 KRITERIA PEDAGOGIS):
 * 1. Cakupan yang diberikan pengguna: apakah bagian ini fokus pokok atau bagian pelengkap.
 * 2. Tujuan pembelajaran: keterkaitan langsung dengan kompetensi yang ditargetkan.
 * 3. Peran konsep dalam memahami materi: apakah merupakan prasyarat fondasi bagi bagian selanjutnya.
 * 4. Kompleksitas konsep: kedalaman unsur, relasi sebab-akibat, atau formula yang harus dikuasai.
 * 5. Hubungan antarbagian materi: sintesis akhir dan keterpaduan logis.
 * 
 * KLASIFIKASI BOBOT:
 * - TINGGI (UTAMA): Konsep inti, dasar memahami materi berikutnya, fokus utama cakupan, butuh penjelasan mendalam.
 * - SEDANG: Melengkapi pemahaman, penjelasan lanjutan yang teratur dan sistematis.
 * - RENDAH (RINGAN): Detail pendukung/pengantar singkat. 
 *   *PERHATIAN*: Bobot RENDAH TIDAK BERARTI DIHILANGKAN! Semua bagian cakupan tetap tampil dan dijelaskan secara proporsional.
 * 
 * PRIORITAS VISUAL:
 * - Bobot TINGGI  -> Prioritas Visual: UTAMA (HIGH)
 * - Bobot SEDANG  -> Prioritas Visual: SEKUNDER (MEDIUM)
 * - Bobot RENDAH  -> Prioritas Visual: PENDUKUNG (LOW)
 */
export function runContentWeightEngine(
  structureItems: ScopeStructureItem[],
  context: ActiveProjectContext
): ContentWeightEngineOutput {
  const { materi, mataPelajaran, tema, jenjang, kelas } = context;
  const normMateri = (materi || '').toLowerCase().trim();

  const weightedItems: WeightedStructureItem[] = structureItems.map((item, idx) => {
    // 1. Rangkuman Kunci di akhir materi
    if (item.isSummary) {
      return {
        ...item,
        weight: 'TINGGI' as ContentWeight,
        visualPriority: 'UTAMA' as VisualPriority,
        weightReason: 'Rangkuman Kunci merupakan sintesis pemahaman yang merangkum hal terpenting dari seluruh materi yang telah dibahas.',
        complexityScore: 3,
      };
    }

    const lowerTitle = item.cleanTitle.toLowerCase();
    const lowerRaw = item.rawText.toLowerCase();

    // 2. Evaluasi mendalam berbasis 5 kriteria pedagogis
    let score = 2; // Default: SEDANG (Bobot Sedang)
    let reason = 'Bagian penting penopang pemahaman yang memerlukan penjelasan terstruktur.';

    // Pola TINGGI: Komponen inti, anatomi/struktur, mekanisme kerja, proses/alur utama, variasi komparasi, rumus kalkulasi
    const isCoreComponent = lowerTitle.includes('komponen') || lowerTitle.includes('unsur') || lowerTitle.includes('struktur') || lowerTitle.includes('anatomi') || lowerTitle.includes('elemen');
    const isMechanismOrProcess = lowerTitle.includes('alur') || lowerTitle.includes('proses') || lowerTitle.includes('mekanisme') || lowerTitle.includes('cara kerja') || lowerTitle.includes('tahapan');
    const isFormulaOrCalc = lowerTitle.includes('rumus') || lowerTitle.includes('kalkulasi') || lowerTitle.includes('perhitungan') || lowerTitle.includes('formula') || lowerTitle.includes('hukum');
    const isComparisonOrTypes = lowerTitle.includes('variasi') || lowerTitle.includes('jenis') || lowerTitle.includes('klasifikasi') || lowerTitle.includes('perbandingan') || lowerTitle.includes('tipe') || lowerTitle.includes('karakteristik');
    const isCoreTopicName = normMateri && lowerTitle.includes(normMateri) && (lowerTitle.includes('inti') || lowerTitle.includes('pokok') || lowerTitle.includes('kunci') || lowerTitle.includes('prinsip'));

    // Pola RENDAH (RINGAN): Pengantar umum singkat, catatan sekilas, tips ringkas, pengenalan awal jika cakupan panjang
    const isBriefIntro = item.isIntro || (lowerTitle.includes('pengantar') && !lowerTitle.includes('komponen') && !lowerTitle.includes('unsur'));
    const isBasicDefinition = (lowerTitle.startsWith('pengertian') || lowerTitle.startsWith('definisi')) && !lowerTitle.includes('dan fungsi') && !lowerTitle.includes('dan ciri') && !lowerTitle.includes('dan peran');
    const isSimpleTip = lowerTitle.includes('tips') || lowerTitle.includes('sekilas') || lowerTitle.includes('catatan ringkas');

    // Evaluasi skor berdasarkan konteks bobot
    if (isCoreComponent || isMechanismOrProcess || isFormulaOrCalc || isComparisonOrTypes || isCoreTopicName) {
      score = 3; // TINGGI
      reason = `Konsep inti dan fokus utama ${materi} yang menjadi dasar pemahaman dan menuntut penjelasan mendalam.`;
    } else if (isBriefIntro || isSimpleTip || (isBasicDefinition && structureItems.length >= 4)) {
      score = 1; // RENDAH
      reason = `Detail pendukung / pengantar awal yang disajikan secara padat, ringkas, dan fokus.`;
    } else {
      // SEDANG: Tujuan, fungsi, peran nyata, ciri-ciri standar, langkah umum
      score = 2; // SEDANG
      reason = `Materi penting penopang pemahaman yang melengkapi konsep dasar secara terstruktur.`;
    }

    let weight: ContentWeight = 'SEDANG';
    let visualPriority: VisualPriority = 'SEKUNDER';

    if (score === 3) {
      weight = 'TINGGI';
      visualPriority = 'UTAMA';
    } else if (score === 1) {
      weight = 'RENDAH';
      visualPriority = 'PENDUKUNG';
    } else {
      weight = 'SEDANG';
      visualPriority = 'SEKUNDER';
    }

    return {
      ...item,
      weight,
      visualPriority,
      weightReason: reason,
      complexityScore: score,
    };
  });

  const tinggiCount = weightedItems.filter(i => i.weight === 'TINGGI' || i.weight === 'UTAMA').length;
  const sedangCount = weightedItems.filter(i => i.weight === 'SEDANG').length;
  const rendahCount = weightedItems.filter(i => i.weight === 'RENDAH' || i.weight === 'RINGAN').length;

  return {
    weightedItems,
    weightSummary: {
      tinggiCount,
      sedangCount,
      rendahCount,
      // Backward-compat aliases
      ringanCount: rendahCount,
      utamaCount: tinggiCount,
    },
  };
}
