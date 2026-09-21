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
  const { title, topic, subject, educationLevel, grade, pertemuan = 'Pertemuan 1', scope, styleName } = params;
  const resolvedTopic = topic || title || 'Materi Pembelajaran';
  const resolvedStyle = styleName || 'Modern Edukatif';
  const formattedPertemuan = typeof pertemuan === 'number' ? `Pertemuan ${pertemuan}` : (String(pertemuan).startsWith('Pertemuan') ? String(pertemuan) : `Pertemuan ${pertemuan}`);

  return {
    materialAnalysis: {
      tahap1_MataPelajaran: subject || 'Mata Pelajaran',
      tahap2_Kelas: grade || 'Semua Jenjang',
      tahap3_MateriUtama: resolvedTopic,
      tahap4_Pertemuan: formattedPertemuan,
      tahap5_CakupanMateri: [scope || 'Cakupan materi esensial'],
      tahap6_MateriBolehDibahas: [scope || 'Pembahasan terfokus sesuai cakupan'],
      tahap7_MateriTidakPerluDiulang: ['Pengertian dasar lengkap di luar cakupan'],
      boundaryRules: [
        'Materi ini merupakan bagian dari rangkaian pembelajaran.',
        'Fokuskan pembahasan hanya pada cakupan materi pertemuan saat ini.',
        'Jangan secara otomatis mengulang pengertian, penjelasan dasar, atau pembahasan umum apabila tidak termasuk dalam cakupan materi.',
        'Nomor pertemuan menunjukkan posisi materi dalam rangkaian pembelajaran.',
        'Materi Utama hanya digunakan sebagai konteks umum, sedangkan Cakupan Materi menjadi batas utama pembahasan.',
        'Jangan membuat setiap pertemuan terlihat seperti materi pertama.'
      ]
    },
    stage1_Understanding: {
      title: resolvedTopic,
      subject: subject || 'Mata Pelajaran',
      educationLevel: educationLevel || 'Semua Jenjang',
      grade: grade || 'Lengkap',
      pertemuan: formattedPertemuan,
      learningObjective: `Peserta didik memahami konsep ${resolvedTopic} secara terstruktur dan mendalam.`,
      scopeOverview: scope || 'Pembahasan materi esensial sesuai kurikulum.',
      contentVolume: 'Sedang'
    },
    stage2_ImportantInfo: {
      mainConcept: resolvedTopic,
      subConcepts: ['Pengenalan Konsep', 'Prinsip Dasar', 'Penerapan Kontekstual'],
      keywords: [resolvedTopic, 'Definisi', 'Karakteristik', 'Aplikasi'],
      essentialInformation: [`Intisari utama konsep ${resolvedTopic}`],
      informationRelationship: 'Hubungan sebab-akibat dan hierarki logis'
    },
    stage3_MaterialCharacters: {
      detectedCharacters: ['Konsep'],
      primaryCharacter: 'Konsep',
      rationale: `Materi ${resolvedTopic} mengutamakan pemahaman konsep terstruktur dan aplikatif.`
    },
    stage4_StyleUnderstanding: {
      selectedStyle: findStyleByNameOrId(resolvedStyle),
      visualTone: 'Edukatif, profesional, rapi, dan mudah dipelajari',
      compositionRule: 'Hierarki vertikal berimbang dengan kartu materi proporsional',
      elementShape: 'Kartu modul bergaris tegas dengan radius halus',
      typographyRule: 'Sains modern sans-serif dengan kontras minimum 4.5:1',
      backgroundStyle: 'Latar netral bersih untuk memaksimalkan keterbacaan',
      ornamentStyle: 'Garis pemisah subtle dan ikon fungsional',
      illustrationType: 'Ilustrasi vektor edukatif terstruktur',
      invarianceNotice: 'Gaya visual tidak boleh mengubah fakta atau struktur materi.'
    },
    stage5_SupportingVisuals: {
      heroVisual: `Ilustrasi sentral edukatif merepresentasikan konsep ${resolvedTopic}`,
      supportingIllustrations: ['Diagram alur konsep', 'Bagan perbandingan', 'Infografis kartu poin'],
      icons: ['Buku / Teori', 'Bagan / Grafik', 'Ceklis / Aplikasi', 'Lampu / Ide'],
      relevantObjects: [resolvedTopic, 'Komponen Sistem', 'Contoh Kontekstual'],
      supportingOrnaments: ['Badge jenjang', 'Nomor urut bagian', 'Aksen garis'],
      styleAdaptiveVisualNote: `Visual pendukung diselaraskan dengan gaya ${resolvedStyle}`
    },
    stage6_LayoutStrategy: {
      strategy: 'Central Concept',
      layoutDescription: 'Tata letak vertikal rasio 2:3 dengan hierarki atas ke bawah',
      readingFlow: 'Header Identitas -> Konsep Sentral -> Pembahasan Modul -> Rangkuman Kunci',
      rationale: 'Menjamin kenyamanan alur kognitif peserta didik dalam menyerap materi'
    },
    stage7_FinalPrompt: `=== PROMPT CADANGAN STIVIA ===\nTopik: ${resolvedTopic}\nMata Pelajaran: ${subject}\nJenjang: ${educationLevel} (${grade})\nCakupan: ${scope}`
  };
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
