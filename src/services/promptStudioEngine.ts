import { InfographicDraft, ContentSnapshot } from '../types';
import { getContentSnapshotFromDraft } from '../data/materialGenerator';
import { findStyleByNameOrId } from '../data/infographicStylesData';
import { runStiviaThinkingFramework, StiviaThinkingResult } from './stiviaThinkingFramework';

/**
 * PROMPT STUDIO ENGINE — STIVIA
 * Menghasilkan Universal Prompts yang bersih, sistematis, dan bebas dari vendor lock-in,
 * bertumpu pada CONTENT SNAPSHOT sebagai Single Source of Truth:
 * CAKUPAN -> STRUKTUR (2A) -> BOBOT (2B) -> KEDALAMAN (2C) -> CONTENT SNAPSHOT -> PROMPT
 */

// Helper: Buat Fallback StiviaThinkingResult jika analisis mengalami kendala
function createFallbackThinkingResult(params: {
  title: string;
  topic: string;
  subject: string;
  educationLevel: string;
  grade: string;
  pertemuan?: string | number;
  scope: string;
  styleName?: string;
}): StiviaThinkingResult {
  return runStiviaThinkingFramework({
    title: params.title || params.topic || 'Infografis Pembelajaran',
    topic: params.topic,
    subject: params.subject || 'Umum',
    educationLevel: params.educationLevel || 'SMA',
    grade: params.grade || 'Kelas X',
    pertemuan: params.pertemuan || 'Pertemuan 1',
    scope: params.scope || '',
    visualStyleName: params.styleName || 'Modern Edukatif'
  });
}

// 1. GENERATOR UNIVERSAL PROMPT INFOGRAFIS DARI PROYEK STIVIA
export interface InfographicPromptOptions {
  format?: 'Vertikal';
  visualStyleName: string;
  customStyleDescription?: string;
}

export function analyzeAndGenerateProjectInfographicPrompt(
  project: InfographicDraft,
  options: InfographicPromptOptions
): { prompt: string; thinkingResult: StiviaThinkingResult } {
  try {
    const snapshot: ContentSnapshot = getContentSnapshotFromDraft(project);
    const { identity, title, overview, sections, keySummary } = snapshot;

    // Kumpulkan materi lengkap untuk Kerangka Berpikir
    const rawSectionsText = (sections || []).map(sec => 
      `${sec.title}: ${sec.coreIdea}. ${sec.explanation} ${sec.keyPoints?.join(', ') || ''}`
    ).join('\n');

    const learningObjectives = project.learningObjective
      ? [project.learningObjective]
      : [overview || `Peserta didik memahami ${title} secara komprehensif.`];

    const keyPoints = (keySummary && keySummary.length > 0)
      ? keySummary
      : (sections || []).map(s => s.title);

    // Jalankan Kerangka Berpikir STIVIA 7 Tahap
    try {
      const thinkingResult = runStiviaThinkingFramework({
        title: title || project.rawTopic || 'Infografis Pembelajaran',
        topic: project.rawTopic || title,
        theme: project.theme && project.theme !== (project.rawTopic || title) ? project.theme : undefined,
        subject: identity.subject || project.subject || 'Umum',
        educationLevel: identity.educationLevel || project.educationLevel || 'SMA',
        grade: identity.grade || project.grade || 'Kelas X',
        bab: project.bab || identity.bab,
        pertemuan: project.pertemuan || identity.pertemuan || 'Pertemuan 1',
        scope: project.scope || overview || '',
        rawContent: rawSectionsText || project.scope || project.rawTopic || title,
        learningObjectives,
        keyPoints,
        userNotes: project.userNotes || snapshot.userNotes || identity.userNotes,
        visualStyleName: options.visualStyleName,
        customStyleDescription: options.customStyleDescription,
      });

      return {
        prompt: thinkingResult.stage7_FinalPrompt,
        thinkingResult
      };
    } catch (thinkErr) {
      console.warn('[STIVIA Engine] Framework thinking error for project infographic, using fallback:', thinkErr);
      const fallbackResult = createFallbackThinkingResult({
        title: title || project.rawTopic || 'Infografis Pembelajaran',
        topic: project.rawTopic || title,
        subject: identity.subject || project.subject || 'Umum',
        educationLevel: identity.educationLevel || project.educationLevel || 'SMA',
        grade: identity.grade || project.grade || 'Kelas X',
        pertemuan: project.pertemuan || identity.pertemuan || 'Pertemuan 1',
        scope: project.scope || overview || '',
        styleName: options.visualStyleName
      });

      return {
        prompt: fallbackResult.stage7_FinalPrompt,
        thinkingResult: fallbackResult
      };
    }
  } catch (err) {
    console.error('[STIVIA Engine] Global error in analyzeAndGenerateProjectInfographicPrompt:', err);
    const fallbackResult = createFallbackThinkingResult({
      title: project.title || 'Infografis Pembelajaran',
      topic: project.rawTopic || project.title || 'Infografis Pembelajaran',
      subject: project.subject || 'Umum',
      educationLevel: project.educationLevel || 'SMA',
      grade: project.grade || 'Kelas X',
      pertemuan: project.pertemuan || 'Pertemuan 1',
      scope: project.scope || '',
      styleName: options.visualStyleName
    });

    return {
      prompt: fallbackResult.stage7_FinalPrompt,
      thinkingResult: fallbackResult
    };
  }
}

export function generateUniversalInfographicFromProjectPrompt(
  project: InfographicDraft,
  options: InfographicPromptOptions
): string {
  const { prompt } = analyzeAndGenerateProjectInfographicPrompt(project, options);
  return prompt;
}

// 3. GENERATOR UNIVERSAL PROMPT INFOGRAFIS DARI MATERI SAYA (RAW USER CONTENT)
export interface RawMaterialPromptInput {
  title: string;
  rawMaterial: string;
  pertemuan?: string | number;
  format?: 'Vertikal';
  visualStyle: string;
  customStyleDescription?: string;
}

export function analyzeAndGenerateRawInfographicPrompt(
  input: RawMaterialPromptInput
): { prompt: string; thinkingResult: StiviaThinkingResult } {
  const { title, rawMaterial, pertemuan = 'Pertemuan 1', visualStyle, customStyleDescription } = input;
  const resolvedTitle = title.trim() || 'Infografis Pembelajaran';

  try {
    // Jalankan Kerangka Berpikir STIVIA 7 Tahap untuk Raw Material
    const thinkingResult = runStiviaThinkingFramework({
      title: resolvedTitle,
      topic: resolvedTitle,
      subject: 'Materi Pembelajaran',
      educationLevel: 'Umum',
      grade: 'Lengkap',
      pertemuan,
      scope: 'Analisis berbasis teks materi asli pengguna',
      rawContent: rawMaterial,
      learningObjectives: [`Peserta didik menguasai intisari pembelajaran dari ${resolvedTitle}.`],
      keyPoints: [],
      visualStyleName: visualStyle,
      customStyleDescription: customStyleDescription,
    });

    return {
      prompt: thinkingResult.stage7_FinalPrompt,
      thinkingResult
    };
  } catch (thinkErr) {
    console.warn('[STIVIA Engine] Framework thinking error for raw material, using fallback:', thinkErr);
    const fallbackResult = createFallbackThinkingResult({
      title: resolvedTitle,
      topic: resolvedTitle,
      subject: 'Materi Pembelajaran',
      educationLevel: 'Umum',
      grade: 'Lengkap',
      pertemuan,
      scope: rawMaterial.slice(0, 300),
      styleName: visualStyle
    });

    return {
      prompt: fallbackResult.stage7_FinalPrompt,
      thinkingResult: fallbackResult
    };
  }
}

export function generateUniversalInfographicFromRawMaterialPrompt(input: RawMaterialPromptInput): string {
  const { prompt } = analyzeAndGenerateRawInfographicPrompt(input);
  return prompt;
}
