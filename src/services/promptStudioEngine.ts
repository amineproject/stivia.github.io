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
  const resolvedStyle = styleName || 'Sains Modern (Navy Clean)';
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

// 1. GENERATOR UNIVERSAL PROMPT MATERI (DARI PROYEK STIVIA)
export function generateUniversalMaterialPrompt(project: InfographicDraft): string {
  try {
    const snapshot: ContentSnapshot = getContentSnapshotFromDraft(project);
    const identity = snapshot.identity || {
      subject: project.subject || 'Umum',
      educationLevel: project.educationLevel || 'Semua Jenjang',
      grade: project.grade || 'Lengkap',
      pertemuan: project.pertemuan || 'Pertemuan 1',
      theme: project.theme || 'Umum',
      topic: project.rawTopic || project.title || 'Materi Pembelajaran',
      scope: project.scope || '',
      learningObjective: project.learningObjective || ''
    };
    const title = snapshot.title || project.title || identity.topic;
    const pertemuan = project.pertemuan || identity.pertemuan || 'Pertemuan 1';
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
- Pertemuan: ${pertemuan}
- Tema Pembelajaran: ${identity.theme || 'Umum'}
- Materi Utama: ${identity.topic} (sebagai konteks umum)
- Tujuan Pembelajaran: ${identity.learningObjective || `Peserta didik memahami konsep ${identity.topic} secara terstruktur dan aplikatif.`}

GAMBARAN UMUM / PENGANTAR:
${overview || `Materi ini dirancang untuk memberikan pemahaman terfokus pada cakupan ${pertemuan}.`}

CAKUPAN MATERI YANG WAJIB DIBAHAS (BATAS UTAMA):
${scopeListStr}

PRINSIP BATAS MATERI & ATURAN PENCEGAHAN PENGULANGAN:
1. Cakupan Materi adalah Batas Wajib Pembahasan: Jangan secara otomatis mengulang pengertian, penjelasan dasar, atau pembahasan umum apabila tidak termasuk dalam cakupan materi.
2. Posisi Pertemuan: Nomor pertemuan (${pertemuan}) menunjukkan posisi materi dalam rangkaian pembelajaran.
3. Konteks Umum vs Batas Pembahasan: Materi Utama hanya digunakan sebagai konteks umum, sedangkan Cakupan Materi menjadi batas utama pembahasan.
4. Jangan membuat setiap pertemuan terlihat seperti materi pertama. Fokuskan langsung pada cakupan materi pertemuan saat ini.

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
Pertemuan: ${project.pertemuan || 'Pertemuan 1'}
Cakupan Materi:
${project.scope || '- Pembahasan materi esensial'}

TUGAS AI:
Susunlah naskah materi pembelajaran yang komprehensif, terstruktur, dan mudah dipahami oleh peserta didik berdasarkan data di atas tanpa mengulang materi pertemuan lain di luar cakupan.`;
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
      pertemuan: project.pertemuan || 'Pertemuan 1',
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
        pertemuan: project.pertemuan || identity.pertemuan || 'Pertemuan 1',
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
        pertemuan: project.pertemuan || identity.pertemuan || 'Pertemuan 1',
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
      pertemuan: project.pertemuan || 'Pertemuan 1',
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
        pertemuan: project.pertemuan || identity.pertemuan || 'Pertemuan 1',
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
