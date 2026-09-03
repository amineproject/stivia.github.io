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
  scope: string;
  styleName?: string;
}): StiviaThinkingResult {
  const { title, topic, subject, educationLevel, grade, scope, styleName } = params;
  const resolvedTopic = topic || title || 'Materi Pembelajaran';
  const resolvedStyle = styleName || 'Sains Modern (Navy Clean)';

  return {
    stage1_Understanding: {
      title: resolvedTopic,
      subject: subject || 'Mata Pelajaran',
      educationLevel: educationLevel || 'Semua Jenjang',
      grade: grade || 'Lengkap',
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

// 1. GENERATOR UNIVERSAL PROMPT MATERI (DARI PROYEK STIVIA)
export function generateUniversalMaterialPrompt(project: InfographicDraft): string {
  try {
    const snapshot: ContentSnapshot = getContentSnapshotFromDraft(project);
    const identity = snapshot.identity || {
      subject: project.subject || 'Umum',
      educationLevel: project.educationLevel || 'Semua Jenjang',
      grade: project.grade || 'Lengkap',
      theme: project.theme || 'Umum',
      topic: project.rawTopic || project.title || 'Materi Pembelajaran',
      scope: project.scope || '',
      learningObjective: project.learningObjective || ''
    };
    const title = snapshot.title || project.title || identity.topic;
    const overview = snapshot.overview || project.overview || '';
    const sections = Array.isArray(snapshot.sections) && snapshot.sections.length > 0
      ? snapshot.sections
      : (Array.isArray(project.blocks) && project.blocks.length > 0
          ? project.blocks.map((b, i) => ({
              order: b.order || i + 1,
              letterIndex: String.fromCharCode(65 + i),
              title: b.title || `Bagian ${i + 1}`,
              weight: 'SEDANG' as const,
              depth: 'MENDALAM' as const,
              coreIdea: b.contentPriority?.primary || b.title || 'Inti materi',
              explanation: b.content || 'Pembahasan materi pembelajaran.',
              keyPoints: b.contentPriority?.secondary || ['Poin esensial materi'],
              example: b.contentPriority?.supporting?.[0]
            }))
          : [{
              order: 1,
              letterIndex: 'A',
              title: title,
              weight: 'SEDANG' as const,
              depth: 'MENDALAM' as const,
              coreIdea: `Inti konsep ${title}`,
              explanation: overview || `Materi pembelajaran mengenai ${title}.`,
              keyPoints: ['Pengenalan materi', 'Prinsip utama', 'Penerapan'],
              example: undefined
            }]);

    const keySummary = Array.isArray(snapshot.keySummary) && snapshot.keySummary.length > 0
      ? snapshot.keySummary
      : sections.map(s => s.title);

    // Bangun representasi struktur, bobot, kedalaman, dan inti materi
    const sectionsList = sections.map((sec) => {
      const keyPointsStr = sec.keyPoints && sec.keyPoints.length > 0
        ? sec.keyPoints.map(k => `      • ${k}`).join('\n')
        : '      • Poin esensial materi';

      return `BAGIAN ${sec.order}: [${sec.letterIndex}] ${sec.title}
    - Bobot Materi: ${sec.weight} | Tingkat Kedalaman: ${sec.depth}
    - Inti Materi (Harus Dipahami Siswa): "${sec.coreIdea}"
    - Penjelasan Lengkap: ${sec.explanation}
    - Poin-Poin Penting:
${keyPointsStr}${sec.example ? `\n    - Contoh Kontekstual: "${sec.example}"` : ''}`;
    }).join('\n\n');

    const keySummaryStr = (keySummary || []).map(s => `- ${s}`).join('\n');

    const scopeListStr = (typeof identity.scope === 'string' && identity.scope.trim().length > 0)
      ? identity.scope.split('\n').filter(Boolean).map((s, i) => `${i + 1}. ${s.replace(/^[-*•0-9.]+\s*/, '')}`).join('\n')
      : '- ' + identity.topic;

    return `=== UNIVERSAL PROMPT: PENYUSUNAN MATERI PEMBELAJARAN TERSTRUKTUR ===

PERAN DAN TUJUAN:
Bertindaklah sebagai Ahli Kurikulum & Pengembang Materi Pembelajaran Profesional. Tugas Anda adalah menyusun materi pembelajaran yang lengkap, akurat, terstruktur secara logis, dan mudah dipahami oleh peserta didik sesuai jenjang yang ditargetkan, berpedoman ketat pada CONTENT SNAPSHOT terstruktur di bawah ini.

INFORMASI DASAR PEMBELAJARAN (IDENTITAS):
- Judul Materi: ${title}
- Mata Pelajaran: ${identity.subject || 'Umum'}
- Jenjang / Target: ${identity.educationLevel} - Kelas ${identity.grade || '-'}
- Tema Pembelajaran: ${identity.theme || 'Umum'}
- Tujuan Pembelajaran: ${identity.learningObjective || `Peserta didik memahami konsep ${identity.topic} secara terstruktur dan aplikatif.`}

GAMBARAN UMUM / PENGANTAR:
${overview || `Materi ini dirancang untuk memberikan pemahaman menyeluruh mengenai ${identity.topic}.`}

CAKUPAN MATERI YANG WAJIB DIBAHAS (BATAS UTAMA):
${scopeListStr}

STRUKTUR DAN KONTEN SUMBER (CONTENT SNAPSHOT STIVIA):
${sectionsList}

RANGKUMAN KUNCI:
${keySummaryStr || '- Sintesis konsep materi secara utuh dan aplikatif.'}

PETUNJUK DAN ATURAN PENULISAN:
1. Membahas seluruh bagian materi di atas secara berurutan tanpa ada topik yang terlewatkan.
2. Tidak menambahkan materi dari topik atau mata pelajaran lain yang tidak tercantum dalam cakupan.
3. Menyesuaikan kedalaman pembahasan dengan bobot yang ditentukan:
   - Bagian berbobot TINGGI/MENDALAM harus dijelaskan secara komprehensif, mencakup definisi, prinsip kerja, mekanisme, dan hubungan logis.
   - Bagian berbobot SEDANG dijelaskan secara terstruktur dengan poin-poin yang runtut dan jelas.
   - Bagian berbobot RENDAH/RINGKAS disajikan secara padat, fokus, dan esensial tanpa menghilangkan bagian tersebut.
4. Menggunakan bahasa Indonesia yang baku, komunikatif, dan sesuai dengan tingkat perkembangan kognitif peserta didik jenjang ${identity.educationLevel}.
5. Sertakan contoh yang kontekstual dan dekat dengan keseharian peserta didik untuk memudahkan pemahaman.
6. Buat rangkuman kunci di akhir materi yang hanya merangkum poin-poin yang benar-benar telah dibahas.

FORMAT KELUARAN YANG DIHARAPKAN:
- Judul Utama & Gambaran Umum Pengantar
- Pembahasan per Bagian sesuai urutan struktur Content Snapshot di atas
- Setiap bagian memuat: Penjelasan Inti, Poin Kunci, dan Contoh Kontekstual (jika relevan)
- Rangkuman Pembelajaran (Key Takeaways)
- 3 Pertanyaan Refleksi / Diskusi untuk mengevaluasi pemahaman peserta didik.`;
  } catch (err) {
    console.error('[STIVIA Prompt Engine] Error generating universal material prompt, using basic fallback:', err);
    return `=== UNIVERSAL PROMPT: MATERI PEMBELAJARAN (MODE DASAR) ===
Topik: ${project.rawTopic || project.title || 'Materi Pembelajaran'}
Mata Pelajaran: ${project.subject || 'Umum'}
Jenjang: ${project.educationLevel || 'Umum'} - Kelas ${project.grade || '-'}
Cakupan Materi:
${project.scope || '- Pembahasan materi esensial'}

TUGAS AI:
Susunlah naskah materi pembelajaran yang komprehensif, terstruktur, dan mudah dipahami oleh peserta didik berdasarkan data di atas.`;
  }
}

// 1B. ANALISIS & GENERATOR PROMPT MATERI DENGAN KERANGKA BERPIKIR STIVIA
export function analyzeAndGenerateMaterialPrompt(
  project: InfographicDraft
): { prompt: string; thinkingResult: StiviaThinkingResult } {
  try {
    const prompt = generateUniversalMaterialPrompt(project);
    const snapshot = getContentSnapshotFromDraft(project);
    const identity = snapshot.identity || {
      subject: project.subject || 'Umum',
      educationLevel: project.educationLevel || 'Umum',
      grade: project.grade || 'Lengkap',
      theme: project.theme || 'Umum',
      topic: project.rawTopic || project.title || 'Materi Pembelajaran',
      scope: project.scope || '',
      learningObjective: project.learningObjective || ''
    };

    const rawSectionsText = (snapshot.sections || []).map(sec =>
      `${sec.title}: ${sec.coreIdea}. ${sec.explanation} ${sec.keyPoints?.join(', ') || ''}`
    ).join('\n');

    let thinkingResult: StiviaThinkingResult;
    try {
      thinkingResult = runStiviaThinkingFramework({
        title: snapshot.title || project.title || identity.topic,
        topic: identity.topic,
        subject: identity.subject || project.subject || 'Umum',
        educationLevel: identity.educationLevel || project.educationLevel || 'Umum',
        grade: identity.grade || project.grade || 'Lengkap',
        scope: identity.scope || project.scope || '',
        rawContent: rawSectionsText || identity.scope || identity.topic,
        learningObjectives: [identity.learningObjective || project.learningObjective || `Peserta didik memahami konsep ${identity.topic} secara terstruktur.`],
        keyPoints: snapshot.keySummary || [],
        visualStyleName: 'Pedagogis Terstruktur'
      });
    } catch (thinkErr) {
      console.warn('[STIVIA Engine] Framework thinking soft error for material, using fallback framework data:', thinkErr);
      thinkingResult = createFallbackThinkingResult({
        title: snapshot.title || project.title || identity.topic,
        topic: identity.topic,
        subject: identity.subject || project.subject || 'Umum',
        educationLevel: identity.educationLevel || project.educationLevel || 'Umum',
        grade: identity.grade || project.grade || 'Lengkap',
        scope: identity.scope || project.scope || '',
        styleName: 'Pedagogis Terstruktur'
      });
    }

    return {
      prompt,
      thinkingResult
    };
  } catch (err) {
    console.error('[STIVIA Engine] Global error in analyzeAndGenerateMaterialPrompt:', err);
    const fallbackPrompt = generateUniversalMaterialPrompt(project);
    const fallbackResult = createFallbackThinkingResult({
      title: project.title || 'Materi Pembelajaran',
      topic: project.rawTopic || project.title || 'Materi Pembelajaran',
      subject: project.subject || 'Umum',
      educationLevel: project.educationLevel || 'Umum',
      grade: project.grade || 'Lengkap',
      scope: project.scope || ''
    });

    return {
      prompt: fallbackPrompt,
      thinkingResult: fallbackResult
    };
  }
}

// 2. GENERATOR UNIVERSAL PROMPT INFOGRAFIS DARI PROYEK STIVIA
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
        subject: identity.subject || project.subject || 'Umum',
        educationLevel: identity.educationLevel || project.educationLevel || 'SMA',
        grade: identity.grade || project.grade || 'Kelas X',
        scope: project.scope || overview || '',
        rawContent: rawSectionsText || project.scope || project.rawTopic || title,
        learningObjectives,
        keyPoints,
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
  format?: 'Vertikal';
  visualStyle: string;
  customStyleDescription?: string;
}

export function analyzeAndGenerateRawInfographicPrompt(
  input: RawMaterialPromptInput
): { prompt: string; thinkingResult: StiviaThinkingResult } {
  const { title, rawMaterial, visualStyle, customStyleDescription } = input;
  const resolvedTitle = title.trim() || 'Infografis Pembelajaran';

  try {
    // Jalankan Kerangka Berpikir STIVIA 7 Tahap untuk Raw Material
    const thinkingResult = runStiviaThinkingFramework({
      title: resolvedTitle,
      topic: resolvedTitle,
      subject: 'Materi Pembelajaran',
      educationLevel: 'Umum',
      grade: 'Lengkap',
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
