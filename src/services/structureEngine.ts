import { ActiveProjectContext, ScopeStructureItem } from '../types';
import { parseScopeToRequiredTopics } from '../data/materialGenerator';

export interface StructureEngineOutput {
  structureItems: ScopeStructureItem[];
  hasIntro: boolean;
  hasSummary: boolean;
  validationCheck: {
    rawScopeItems: string[];
    structuredItems: string[];
    isComplete: boolean;
    missingItems: string[];
  };
}

/**
 * TAHAP 2A — STRUCTURE ENGINE
 * 
 * Mengubah cakupan materi pengguna menjadi struktur pembahasan yang jelas, lengkap, dan terurut.
 * Aturan:
 * 1. Setiap konsep utama dalam cakupan wajib memiliki representasi dalam struktur.
 * 2. Tidak menghilangkan konsep apapun.
 * 3. Tidak menambahkan pembahasan asing yang keluar dari cakupan.
 * 4. Urutan mengikuti alur logis materi dan instruksi pengguna.
 * 5. Jumlah bagian bersifat dinamis sesuai kebutuhan materi.
 * 6. Menambahkan Rangkuman Kunci di akhir yang berakar dari materi yang dibahas.
 */
export function runStructureEngine(context: ActiveProjectContext): StructureEngineOutput {
  const { materi, cakupanMateri, mataPelajaran, kelas, tema } = context;

  // 1. Ekstraksi semua butir cakupan eksplisit
  const rawTopics = parseScopeToRequiredTopics(cakupanMateri, materi);
  const structureItems: ScopeStructureItem[] = [];

  // 2. Petakan setiap butir cakupan menjadi entitas struktur pembahasan
  rawTopics.forEach((topicText, idx) => {
    const order = idx + 1;
    const isIntro = idx === 0 && (
      topicText.toLowerCase().includes('pengantar') ||
      topicText.toLowerCase().includes('definisi') ||
      topicText.toLowerCase().includes('apa itu') ||
      topicText.toLowerCase().includes('konsep dasar')
    );

    structureItems.push({
      id: `sec-${order}-${Date.now()}-${idx}`,
      order,
      rawText: topicText,
      cleanTitle: topicText,
      sourceCoverage: topicText,
      isIntro: !!isIntro,
      isSummary: false,
    });
  });

  // 3. Tambahkan Rangkuman Kunci di bagian akhir (selalu disintesis dari materi yang dibahas)
  const summaryOrder = structureItems.length + 1;
  const summaryItem: ScopeStructureItem = {
    id: `sec-summary-${summaryOrder}-${Date.now()}`,
    order: summaryOrder,
    rawText: `Rangkuman Kunci & Golden Takeaways ${materi}`,
    cleanTitle: `Rangkuman Kunci ${materi}`,
    sourceCoverage: `Sintesis Keseluruhan Cakupan ${materi}`,
    isIntro: false,
    isSummary: true,
  };
  structureItems.push(summaryItem);

  // 4. Validasi Cakupan Input vs Structure Output
  const missingItems = rawTopics.filter(
    raw => !structureItems.some(st => st.sourceCoverage === raw || st.cleanTitle === raw)
  );

  return {
    structureItems,
    hasIntro: structureItems.some(s => s.isIntro),
    hasSummary: true,
    validationCheck: {
      rawScopeItems: rawTopics,
      structuredItems: structureItems.map(s => s.cleanTitle),
      isComplete: missingItems.length === 0,
      missingItems,
    },
  };
}
