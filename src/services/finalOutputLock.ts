import {
  InfographicDraft,
  FinalOutputState,
  FinalOutputValidationChecklist,
  MaterialBlock,
  LayoutType,
  StyleConfig,
} from '../types';
import { getStyleConfig } from '../data/styleSystem';

/**
 * TAHAP 4A: VALIDASI SEBELUM DIKUNCI
 * 
 * Melakukan validasi 10 kriteria dasar output Tahap 4 tanpa memanggil AI / generator.
 */
export function validateFinalOutput(draft: InfographicDraft | null | undefined): FinalOutputValidationChecklist {
  const errors: string[] = [];

  if (!draft) {
    return {
      subjectValid: false,
      topicValid: false,
      scopeValid: false,
      contentValid: false,
      sectionsValid: false,
      orderValid: false,
      noEmptyBlocks: false,
      infographicDataValid: false,
      layoutValid: false,
      visualStyleValid: false,
      isReadyToLock: false,
      validationErrors: ['Data draft infografis tidak ditemukan.'],
    };
  }

  // 1. Mata pelajaran tersedia
  const subjectValid = Boolean(draft.subject && draft.subject.trim().length > 0);
  if (!subjectValid) errors.push('Mata pelajaran belum terisi.');

  // 2. Topik tersedia
  const topicValid = Boolean(draft.rawTopic && draft.rawTopic.trim().length > 0);
  if (!topicValid) errors.push('Topik materi belum terisi.');

  // 3. Cakupan materi tersedia
  const scopeValid = Boolean(draft.scope && draft.scope.trim().length > 0);
  if (!scopeValid) errors.push('Cakupan materi belum tersedia.');

  // 4. generatedContent / isi materi tersedia
  const hasBlocks = Array.isArray(draft.blocks) && draft.blocks.length > 0;
  const contentValid = hasBlocks && draft.blocks.some((b) => Boolean(b.content && b.content.trim().length > 0));
  if (!contentValid) errors.push('Konten pembahasan materi belum dihasilkan.');

  // 5. materialSections tersedia
  const sectionsValid = hasBlocks;
  if (!sectionsValid) errors.push('Struktur bagian materi (sections) kosong.');

  // 6. Urutan bagian tersedia
  const orderValid = hasBlocks && draft.blocks.every((b) => typeof b.order === 'number');
  if (!orderValid) errors.push('Urutan bagian materi tidak valid.');

  // 7. Tidak ada bagian utama yang kosong
  const noEmptyBlocks = hasBlocks && draft.blocks.every(
    (b) => Boolean(b.title && b.title.trim().length > 0 && b.content && b.content.trim().length > 0)
  );
  if (!noEmptyBlocks) errors.push('Ditemukan bagian materi dengan judul atau konten kosong.');

  // 8. Data infografis terstruktur tersedia
  const infographicDataValid = Boolean(
    draft.title && 
    draft.title.trim().length > 0 && 
    draft.learningObjective && 
    draft.learningObjective.trim().length > 0
  );
  if (!infographicDataValid) errors.push('Data judul dan tujuan pembelajaran belum lengkap.');

  // 9. Layout final tersedia
  const layoutValid = Boolean(draft.format && draft.visualLevel);
  if (!layoutValid) errors.push('Konfigurasi tata letak / layout belum lengkap.');

  // 10. Gaya visual final tersedia
  const visualStyleValid = Boolean(draft.visualStyle && draft.visualStyle.trim().length > 0);
  if (!visualStyleValid) errors.push('Gaya visual belum dipilih.');

  const isReadyToLock = 
    subjectValid &&
    topicValid &&
    scopeValid &&
    contentValid &&
    sectionsValid &&
    orderValid &&
    noEmptyBlocks &&
    infographicDataValid &&
    layoutValid &&
    visualStyleValid;

  return {
    subjectValid,
    topicValid,
    scopeValid,
    contentValid,
    sectionsValid,
    orderValid,
    noEmptyBlocks,
    infographicDataValid,
    layoutValid,
    visualStyleValid,
    isReadyToLock,
    validationErrors: errors,
  };
}

/**
 * TAHAP 4A: BUAT SNAPSHOT FINAL OUTPUT
 * 
 * Mengambil data utuh dari Tahap 4 dan membuat deep copy snapshot mandiri.
 * TIDAK memanggil AI, TIDAK mengubah urutan, TIDAK mengubah style tokens.
 */
export function createFinalSnapshot(
  draft: InfographicDraft,
  validation?: FinalOutputValidationChecklist
): FinalOutputState {
  const resolvedStyleConfig: StyleConfig = 
    getStyleConfig(draft.visualStyle, draft.customVisualStyle);

  // Deep clone material blocks
  const clonedBlocks: MaterialBlock[] = JSON.parse(JSON.stringify(draft.blocks || []));

  // Extract layout mapping
  const layoutMap: Record<string, LayoutType | undefined> = {};
  clonedBlocks.forEach((block) => {
    layoutMap[block.id] = block.layoutType;
  });

  // Material order as array of IDs
  const materialOrder = clonedBlocks.map((b) => b.id);

  // Compile full text summary of generated content
  const generatedContentSummary = clonedBlocks
    .map((b) => `[${b.letterIndex || b.order}] ${b.title}\n${b.content}`)
    .join('\n\n');

  const finalRenderedText = `STIVIA INFOGRAPHIC\n${draft.title}\n${draft.subTitle || ''}\n${draft.learningObjective}\n\n${generatedContentSummary}`;

  const checklist = validation || validateFinalOutput(draft);

  const snapshot: FinalOutputState = {
    projectId: draft.id,
    projectTitle: draft.title,
    subject: draft.subject,
    gradeOrPhase: `${draft.educationLevel} • ${draft.grade}`,
    topic: draft.rawTopic,
    scope: draft.scope,
    learningObjectives: draft.learningObjective,
    generatedContent: generatedContentSummary,
    materialSections: clonedBlocks,
    materialOrder,
    selectedVisualStyle: draft.visualStyle,
    visualTheme: JSON.parse(JSON.stringify(resolvedStyleConfig)),
    typographySettings: JSON.parse(JSON.stringify(resolvedStyleConfig.typography)),
    colorSettings: JSON.parse(JSON.stringify(resolvedStyleConfig.colorPalette)),
    layoutConfiguration: {
      format: draft.format,
      visualLevel: draft.visualLevel,
      cardDensity: resolvedStyleConfig.cards.density,
      layoutTypes: layoutMap,
      columnsCount: draft.format === 'landscape' ? 3 : 2,
      layoutTemplate: draft.layoutTemplate,
    },
    infographicData: {
      conceptHighlights: draft.conceptHighlights ? [...draft.conceptHighlights] : [],
      synthesisSteps: draft.synthesisSteps ? JSON.parse(JSON.stringify(draft.synthesisSteps)) : [],
      caseStudyBlock: draft.caseStudyBlock ? JSON.parse(JSON.stringify(draft.caseStudyBlock)) : undefined,
      authorName: draft.authorName,
      authorRole: draft.authorRole,
      tagline: draft.tagline,
      subTitle: draft.subTitle,
      requiredTopics: draft.requiredTopics ? [...draft.requiredTopics] : [],
    },
    finalRenderedContent: finalRenderedText,
    createdAt: draft.createdAt || new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    lockedAt: new Date().toISOString(),
    status: checklist.isReadyToLock ? 'LOCKED' : 'OUTPUT_BELUM_SIAP',
    validationChecklist: checklist,
  };

  return snapshot;
}

/**
 * TAHAP 4A: LOCK FINAL OUTPUT
 * 
 * Alur eksekusi:
 * READ → VALIDATE → SNAPSHOT → LOCK
 * 
 * TIDAK memanggil AI generator.
 * TIDAK membuat layout baru.
 * TIDAK memilih gaya visual baru.
 */
export function lockFinalOutput(draft: InfographicDraft): {
  success: boolean;
  finalOutput: FinalOutputState;
  message: string;
  updatedDraft: InfographicDraft;
} {
  // 1. READ & VALIDATE
  const validation = validateFinalOutput(draft);

  if (!validation.isReadyToLock) {
    const errorList = validation.validationErrors.join(', ');
    const fallbackSnapshot = createFinalSnapshot(draft, validation);
    fallbackSnapshot.status = 'OUTPUT_BELUM_SIAP';

    return {
      success: false,
      finalOutput: fallbackSnapshot,
      message: `OUTPUT BELUM SIAP DIKUNCI: ${errorList}`,
      updatedDraft: {
        ...draft,
        isLocked: false,
        finalOutput: fallbackSnapshot,
      },
    };
  }

  // 2. SNAPSHOT
  const lockedSnapshot = createFinalSnapshot(draft, validation);
  lockedSnapshot.status = 'LOCKED';

  // 3. ATTACH & LOCK DRAFT
  const updatedDraft: InfographicDraft = {
    ...draft,
    isLocked: true,
    status: 'completed',
    finalOutput: lockedSnapshot,
    updatedAt: new Date().toISOString().split('T')[0],
  };

  return {
    success: true,
    finalOutput: lockedSnapshot,
    message: '🔒 FINAL OUTPUT LOCKED — Output infografis berhasil dikunci sebagai single source of truth.',
    updatedDraft,
  };
}

/**
 * TAHAP 4A: PREPARE DRAFT FOR EDITING (WHEN USER REQUESTS CHANGES)
 * 
 * Mengikuti prinsip:
 * Output lama tetap aman di `finalOutput` sampai perubahan baru selesai dan di-lock kembali.
 */
export function unlockForEditing(draft: InfographicDraft): InfographicDraft {
  return {
    ...draft,
    isLocked: false,
    status: 'draft',
    // We preserve existing finalOutput until a new lock is committed
  };
}

/**
 * TAHAP 4A: READ-ONLY DATA RESOLVER FOR PREVIEW, EXPORT, & SAVE
 * 
 * Memastikan bahwa jika status LOCKED, semua komponen konsumen (Preview, Export, Save)
 * membaca HANYA dari snapshot finalOutput, bukan dari raw state yang bisa terkontaminasi.
 */
export function getReadonlyInfographicFromLockedOutput(draft: InfographicDraft): InfographicDraft {
  if (!draft.finalOutput || draft.finalOutput.status !== 'LOCKED') {
    return draft;
  }

  const { finalOutput } = draft;

  return {
    ...draft,
    id: finalOutput.projectId,
    title: finalOutput.projectTitle,
    subTitle: finalOutput.infographicData.subTitle,
    tagline: finalOutput.infographicData.tagline,
    learningObjective: finalOutput.learningObjectives,
    subject: finalOutput.subject,
    rawTopic: finalOutput.topic,
    scope: finalOutput.scope,
    visualStyle: finalOutput.selectedVisualStyle,
    styleConfig: JSON.parse(JSON.stringify(finalOutput.visualTheme || getStyleConfig(finalOutput.selectedVisualStyle))),
    layoutTemplate: (finalOutput.layoutConfiguration as any)?.layoutTemplate || draft.layoutTemplate,
    format: finalOutput.layoutConfiguration.format,
    visualLevel: finalOutput.layoutConfiguration.visualLevel,
    blocks: JSON.parse(JSON.stringify(finalOutput.materialSections)),
    conceptHighlights: finalOutput.infographicData.conceptHighlights ? [...finalOutput.infographicData.conceptHighlights] : [],
    synthesisSteps: finalOutput.infographicData.synthesisSteps ? JSON.parse(JSON.stringify(finalOutput.infographicData.synthesisSteps)) : [],
    caseStudyBlock: finalOutput.infographicData.caseStudyBlock ? JSON.parse(JSON.stringify(finalOutput.infographicData.caseStudyBlock)) : undefined,
    authorName: finalOutput.infographicData.authorName,
    authorRole: finalOutput.infographicData.authorRole,
    requiredTopics: finalOutput.infographicData.requiredTopics ? [...finalOutput.infographicData.requiredTopics] : draft.requiredTopics,
    isLocked: true,
    status: 'completed',
    createdAt: finalOutput.createdAt,
    updatedAt: finalOutput.updatedAt,
    finalOutput,
  };
}
