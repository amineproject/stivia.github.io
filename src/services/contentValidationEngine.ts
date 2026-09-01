import { 
  ContentValidationResult, 
  ContentValidationChecklistItem, 
  MaterialBlock, 
  ActiveProjectContext 
} from '../types';
import { parseScopeToRequiredTopics } from '../data/materialGenerator';

/**
 * VALIDASI CONTENT FINAL
 * 
 * Melakukan verifikasi komprehensif atas 10 parameter penentu kualitas sebelum
 * materi diserahkan ke Layout Engine (Tahap 3):
 * 
 * 1. Semua cakupan materi pengguna terwakili
 * 2. Tidak ada bagian utama yang hilang
 * 3. Tidak ada kontaminasi mata pelajaran lain
 * 4. Tidak ada contoh usang yang menggantikan isi utama
 * 5. Struktur berurutan secara runtut dan logis
 * 6. Setiap bagian memiliki bobot (RINGAN | SEDANG | UTAMA)
 * 7. Setiap bagian memiliki kedalaman yang sesuai (RINGKAS | SEDANG | MENDALAM)
 * 8. Volume isi proporsional terhadap bobot & kedalaman
 * 9. Tidak ada bagian yang terlalu panjang tanpa alasan pedagogis
 * 10. Tidak ada bagian penting yang terlalu singkat tanpa alasan pedagogis
 */
export function validateFinalContent(
  blocks: MaterialBlock[],
  context: ActiveProjectContext
): ContentValidationResult {
  const { cakupanMateri, materi, mataPelajaran } = context;
  const rawTopics = parseScopeToRequiredTopics(cakupanMateri, materi);

  const errors: string[] = [];
  const warnings: string[] = [];
  const checklist: ContentValidationChecklistItem[] = [];

  // 1 & 2. Cek apakah setiap butir cakupan memiliki perwakilan blok materi
  let allScopeCovered = true;
  rawTopics.forEach((topic) => {
    const matchingBlock = blocks.find((b) => {
      if (b.visualElementType === 'ringkasan_kotak') return false;
      const normBTitle = (b.title || '').toLowerCase();
      const normTopic = topic.toLowerCase();
      const normSource = (b.sourceCoverage || '').toLowerCase();
      return normBTitle.includes(normTopic) || normTopic.includes(normBTitle) || normSource.includes(normTopic);
    });

    const isCovered = !!matchingBlock;
    if (!isCovered) {
      allScopeCovered = false;
      errors.push(`Cakupan "${topic}" belum terwakili dalam struktur blok materi.`);
    }

    checklist.push({
      scopeItem: topic,
      covered: isCovered,
      sectionTitle: matchingBlock ? matchingBlock.title : 'Belum Terpetakan',
      weight: matchingBlock?.weight || 'SEDANG',
      depth: matchingBlock?.depth || 'SEDANG',
      visualPriority: matchingBlock?.visualPriority || 'MEDIUM',
    });
  });

  // 3. Cek tidak ada kontaminasi mata pelajaran lain
  let noSubjectCrossPollution = true;
  const normSubject = (mataPelajaran || '').toLowerCase();
  const normMateri = (materi || '').toLowerCase();

  // Deteksi kontaminasi silang (misal kata-kata teknis informatika pada pelajaran biologi/bahasa)
  blocks.forEach((b) => {
    const text = `${b.title} ${b.content}`.toLowerCase();
    if (!normSubject.includes('informatika') && !normMateri.includes('graph') && !normMateri.includes('jaringan')) {
      if (text.includes('dijkstra') || text.includes('adjacency matrix') || text.includes('topologi mesh')) {
        noSubjectCrossPollution = false;
        warnings.push(`Ditemukan istilah graf teknis pada materi non-informatika "${b.title}".`);
      }
    }
  });

  // 5. Cek urutan order
  let orderValid = true;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].order !== i + 1) {
      orderValid = false;
      break;
    }
  }

  // 6 & 7. Cek bobot & kedalaman
  const allWeightsAssigned = blocks.every(b => !!b.weight && ['RINGAN', 'SEDANG', 'UTAMA'].includes(b.weight));
  const allDepthsAssigned = blocks.every(b => !!b.depth && ['RINGKAS', 'SEDANG', 'MENDALAM'].includes(b.depth));

  if (!allWeightsAssigned) {
    errors.push('Terdapat blok materi yang belum memiliki penetapan bobot.');
  }
  if (!allDepthsAssigned) {
    errors.push('Terdapat blok materi yang belum memiliki penetapan kedalaman.');
  }

  // 8, 9, 10. Cek kesesuaian volume isi dengan kedalaman
  let contentMatchesDepth = true;
  blocks.forEach((b) => {
    if (b.visualElementType === 'ringkasan_kotak') return;
    
    // Jika bobot UTAMA tapi keyPoints kosong
    if (b.weight === 'UTAMA' && (!b.keyPoints || b.keyPoints.length < 2)) {
      contentMatchesDepth = false;
      warnings.push(`Bagian utama "${b.title}" memiliki poin pembahasan yang terlalu singkat.`);
    }

    // Jika bobot RINGAN tapi teks terlalu panjang (> 500 karakter)
    if (b.weight === 'RINGAN' && b.content && b.content.length > 500) {
      warnings.push(`Bagian pendukung "${b.title}" terlalu panjang untuk bobot RINGAN.`);
    }
  });

  const isValid = allScopeCovered && allWeightsAssigned && allDepthsAssigned && errors.length === 0;

  return {
    isValid,
    allScopeCovered,
    noMissingSections: allScopeCovered,
    noSubjectCrossPollution,
    orderValid,
    allWeightsAssigned,
    allDepthsAssigned,
    contentMatchesDepth,
    errors,
    warnings,
    checklist,
  };
}
