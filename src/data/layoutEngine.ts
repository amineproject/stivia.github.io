import { InfographicDraft, MaterialBlock } from '../types';

export type InfographicLayoutArchetype = 
  | 'hero_visual'
  | 'modular_bento'
  | 'central_concept'
  | 'timeline_flow'
  | 'process_flow'
  | 'comparison_split'
  | 'editorial_magazine'
  | 'cyber_hud'
  | 'swiss_modernist'
  | 'clay_tactile'
  | 'pop_comic'
  | 'notebook_handwritten'
  | 'glassmorphism_layers';

export interface LayoutArchetypeInfo {
  id: InfographicLayoutArchetype;
  name: string;
  tagline: string;
  description: string;
  suitableStyles: string[];
  suitableMaterials: string[];
}

export const LAYOUT_ARCHETYPES_INFO: Record<InfographicLayoutArchetype, LayoutArchetypeInfo> = {
  hero_visual: {
    id: 'hero_visual',
    name: 'Hero Visual Layout',
    tagline: 'Fokus Visual Dominan & Blok Terstruktur',
    description: 'Menempatkan konsep utama pada kanvas visual sentral di bagian atas, diikuti informasi pendukung terstruktur.',
    suitableStyles: ['Minimalis', 'Minimalis Edukatif', 'Modern Education', 'Vector Education'],
    suitableMaterials: ['Materi Satu Konsep Utama', 'Pengenalan Teori', 'Definisi Pokok'],
  },
  modular_bento: {
    id: 'modular_bento',
    name: 'Modular Bento Grid',
    tagline: 'Grid Asimetris & Variasi Bobot Informasi',
    description: 'Menyusun materi dalam grid bento modern dengan variasi kartu lebar, tinggi, dan blok metrik/fitur dinamis.',
    suitableStyles: ['Modern Education', 'Academic Clean', 'Flat Design', 'Aurora'],
    suitableMaterials: ['Banyak Subtopik', 'Komponen & Unsur', 'Klasifikasi Materi'],
  },
  central_concept: {
    id: 'central_concept',
    name: 'Central Concept (Hub & Spoke)',
    tagline: 'Konsep Inti di Pusat & Hubungan Relasional',
    description: 'Menempatkan ide sentral di tengah kanvas dikelilingi simpul subkonsep yang saling berinteraksi.',
    suitableStyles: ['Diagrammatic', 'Data Visualization', 'Modern Education', 'Academic Clean'],
    suitableMaterials: ['Hubungan Antar Konsep', 'Jaringan Konseptual', 'Mindmap & Teori Terpadu'],
  },
  timeline_flow: {
    id: 'timeline_flow',
    name: 'Timeline & Chronology',
    tagline: 'Alur Waktu & Tonggak Peristiwa Berurutan',
    description: 'Menyusun informasi dalam jalur kronologis vertikal/horizontal dengan penanda tonggak peristiwa.',
    suitableStyles: ['Timeline', 'Historical', 'Vintage', 'Academic Clean'],
    suitableMaterials: ['Sejarah & Kronologis', 'Peristiwa Penting', 'Perkembangan Waktu'],
  },
  process_flow: {
    id: 'process_flow',
    name: 'Process Flow & Pipeline',
    tagline: 'Tahapan Sistematis & Alur Prosedural',
    description: 'Menyusun tahapan bertahap dari input menuju proses dan hasil akhir dengan indikator arah yang tegas.',
    suitableStyles: ['Modern Education', 'Diagrammatic', 'Flat Design', 'Academic Clean'],
    suitableMaterials: ['Proses & Prosedur', 'Langkah Kerja', 'Alur Algoritma / Siklus'],
  },
  comparison_split: {
    id: 'comparison_split',
    name: 'Comparison & Contrast',
    tagline: 'Perbandingan Berdampingan Konsep A vs B',
    description: 'Membagi layar menjadi dua kolom perbandingan simetris dilengkapi matriks parameter dan sintesis.',
    suitableStyles: ['Academic Clean', 'Swiss Design', 'Modern Education', 'Data Visualization'],
    suitableMaterials: ['Perbandingan Konsep', 'Perbedaan Karakteristik', 'Kelebihan & Kekurangan'],
  },
  editorial_magazine: {
    id: 'editorial_magazine',
    name: 'Editorial Magazine Spread',
    tagline: 'Tata Letak Majalah Ilmiah & Tipografi Kuat',
    description: 'Struktur artikel jurnal edukatif dengan masthead elegan, kolom naratif, dan pull-quote inspiratif.',
    suitableStyles: ['Editorial', 'Academic Clean', 'Vintage', 'Minimalis'],
    suitableMaterials: ['Materi Kompleks & Sastra', 'Wacana Pembelajaran', 'Analisis Mendalam'],
  },
  cyber_hud: {
    id: 'cyber_hud',
    name: 'Futuristic Cyber HUD',
    tagline: 'Antarmuka Digital, Telemetri & Panel Terminal',
    description: 'Antarmuka teknologi masa depan dengan header telemetri, panel modular cybernetic, dan garis sirkuit neon.',
    suitableStyles: ['Futuristic', 'Cyberpunk', 'Digital Interface', 'Y2K'],
    suitableMaterials: ['Informatika & AI', 'Sains Masa Depan', 'Teknologi Digital'],
  },
  swiss_modernist: {
    id: 'swiss_modernist',
    name: 'Swiss Modernist Grid',
    tagline: 'Grid Matematis Ketat, Tipografi Kontras Tinggi',
    description: 'Desain modernis berbasis grid asimetris ketat, penomoran berukuran besar, dan garis pemisah tegas.',
    suitableStyles: ['Swiss Design', 'Minimalis', 'Academic Clean', 'Data Visualization'],
    suitableMaterials: ['Struktur Logis', 'Teori Presisi', 'Data & Fakta Eksak'],
  },
  clay_tactile: {
    id: 'clay_tactile',
    name: 'Clay Tactile 3D',
    tagline: 'Kartu Mengambang 3D Lembut & Bentuk Pill Organik',
    description: 'Elemen bertekstur clay 3D yang lembut dan hangat, sudut melengkung ramah, dan lencana interaktif.',
    suitableStyles: ['Clay Style', 'Children Friendly', 'Cartoon Education', 'Visual Kreatif'],
    suitableMaterials: ['Pembelajaran Ramah Anak', 'Konsep Dasar Menyenangkan', 'Pengenalan Visual'],
  },
  pop_comic: {
    id: 'pop_comic',
    name: 'Pop Art & Comic Panel',
    tagline: 'Panel Komik, Pola Halftone & Bayangan Offset Tegas',
    description: 'Gaya komik edukatif dengan garis tepi tebal, bayangan solid offset, balon pesan, dan pola halftone.',
    suitableStyles: ['Pop Art', 'Comic Style', 'Collage Art', 'Maximalism'],
    suitableMaterials: ['Kreatif & Narasi Seru', 'Komunikasi Ekspresif', 'Sains Populer'],
  },
  notebook_handwritten: {
    id: 'notebook_handwritten',
    name: 'Notebook & Sketch Journal',
    tagline: 'Kertas Bergaris, Catatan Tempel & Sketsa Belajar',
    description: 'Suasana buku jurnal belajar dengan kertas bergaris, catatan tempel miring, selotip, dan coretan tangan.',
    suitableStyles: ['Handwritten', 'Doodle Education', 'Bohemian', 'Retro Education'],
    suitableMaterials: ['Catatan Pembelajaran Mandiri', 'Rangkuman Belajar Kreatif', 'Eksplorasi Ide'],
  },
  glassmorphism_layers: {
    id: 'glassmorphism_layers',
    name: 'Glassmorphism Multi-layer',
    tagline: 'Panel Kaca Transparan & Kedalaman Visual',
    description: 'Kartu frosted glass berlatar belakang gradasi halus dengan bayangan mendalam dan bingkai bercahaya.',
    suitableStyles: ['Glassmorphism', 'Aurora', 'Digital Interface', 'Modern Education'],
    suitableMaterials: ['Konsep Multi-Dimensi', 'Teknologi Modern', 'Visual Elegan'],
  },
};

/**
 * Intelligent Layout Classifier:
 * Determines the layout archetype considering:
 * 1. Explicit layoutTemplate in draft (if already chosen)
 * 2. Visual Style category & aesthetic guidelines
 * 3. Material content structure (timeline, process, comparison, mindmap, etc.)
 * 4. Layout variation cycle (when user regenerates or clicks cycle variations)
 */
export function determineLayoutArchetype(
  draft: InfographicDraft,
  cycleIndex: number = 0
): InfographicLayoutArchetype {
  const normStyle = (draft.visualStyle || '').toLowerCase();
  const normTopic = (draft.rawTopic || draft.title || '').toLowerCase();
  const normSubject = (draft.subject || '').toLowerCase();
  const normScope = (draft.scope || '').toLowerCase();

  const blocks = draft.blocks || [];
  const hasTimelineBlock = blocks.some(b => b.visualElementType === 'timeline' || b.informationType === 'timeline' || b.visualType === 'timeline');
  const hasProcessBlock = blocks.some(b => b.visualElementType === 'flowchart' || b.informationType === 'process' || (b.processSteps && b.processSteps.length > 0));
  const hasComparisonBlock = blocks.some(b => b.visualElementType === 'tabel_perbandingan' || b.informationType === 'comparison' || b.comparisonData);
  const hasNetworkOrMindmap = blocks.some(b => b.visualElementType === 'ilustrasi_jaringan' || b.visualElementType === 'mindmap' || b.informationType === 'relationship');
  const isHistorySubject = normSubject.includes('sejarah') || normTopic.includes('sejarah') || normTopic.includes('kemerdekaan') || normScope.includes('kronologis');
  const isTechSubject = normSubject.includes('informatika') || normTopic.includes('ai') || normTopic.includes('artificial intelligence') || normTopic.includes('jaringan') || normTopic.includes('algoritma');

  // Available candidate layouts tailored for this style and content
  let candidateLayouts: InfographicLayoutArchetype[] = [];

  // =========================================================================
  // 1. STYLE-DOMINANT DIRECT OVERRIDES (When style has strong physical signature)
  // =========================================================================
  if (normStyle.includes('cyberpunk') || normStyle.includes('futuristic') || normStyle.includes('digital interface') || normStyle.includes('y2k')) {
    candidateLayouts = ['cyber_hud', 'modular_bento', 'central_concept', 'glassmorphism_layers'];
  } else if (normStyle.includes('swiss design')) {
    candidateLayouts = ['swiss_modernist', 'modular_bento', 'comparison_split', 'editorial_magazine'];
  } else if (normStyle.includes('clay style') || normStyle.includes('claymorphic')) {
    candidateLayouts = ['clay_tactile', 'modular_bento', 'hero_visual', 'process_flow'];
  } else if (normStyle.includes('pop art') || normStyle.includes('comic') || normStyle.includes('maximalism')) {
    candidateLayouts = ['pop_comic', 'modular_bento', 'hero_visual', 'central_concept'];
  } else if (normStyle.includes('handwritten') || normStyle.includes('doodle') || normStyle.includes('sketsa')) {
    candidateLayouts = ['notebook_handwritten', 'modular_bento', 'timeline_flow', 'hero_visual'];
  } else if (normStyle.includes('editorial') || normStyle.includes('majalah')) {
    candidateLayouts = ['editorial_magazine', 'modular_bento', 'swiss_modernist', 'hero_visual'];
  } else if (normStyle.includes('glassmorphism') || normStyle.includes('aurora')) {
    candidateLayouts = ['glassmorphism_layers', 'modular_bento', 'hero_visual', 'central_concept'];
  } else if (normStyle.includes('minimalis') || normStyle.includes('minimalism')) {
    candidateLayouts = ['hero_visual', 'modular_bento', 'swiss_modernist', 'editorial_magazine'];
  }

  // =========================================================================
  // 2. MATERIAL CONTENT-DOMINANT MAPPINGS (If style is generic or content is specialized)
  // =========================================================================
  if (candidateLayouts.length === 0) {
    if (isHistorySubject || hasTimelineBlock) {
      candidateLayouts = ['timeline_flow', 'editorial_magazine', 'modular_bento', 'hero_visual'];
    } else if (hasProcessBlock || normScope.includes('langkah') || normScope.includes('tahapan') || normScope.includes('alur')) {
      candidateLayouts = ['process_flow', 'modular_bento', 'hero_visual', 'timeline_flow'];
    } else if (hasComparisonBlock || normScope.includes('perbedaan') || normScope.includes('perbandingan') || normScope.includes('jenis')) {
      candidateLayouts = ['comparison_split', 'modular_bento', 'swiss_modernist', 'hero_visual'];
    } else if (hasNetworkOrMindmap || normScope.includes('hubungan') || normScope.includes('jaringan') || normScope.includes('sistem')) {
      candidateLayouts = ['central_concept', 'modular_bento', 'hero_visual', 'glassmorphism_layers'];
    } else if (isTechSubject) {
      candidateLayouts = ['cyber_hud', 'modular_bento', 'central_concept', 'hero_visual'];
    } else if (blocks.length >= 4) {
      candidateLayouts = ['modular_bento', 'hero_visual', 'central_concept', 'editorial_magazine'];
    } else {
      candidateLayouts = ['hero_visual', 'modular_bento', 'central_concept', 'editorial_magazine'];
    }
  }

  // Ensure candidateLayouts has at least one item
  if (candidateLayouts.length === 0) {
    candidateLayouts = ['modular_bento', 'hero_visual', 'central_concept'];
  }

  // If explicitly specified in candidateLayouts and cycle is 0, use it
  if (
    draft.layoutTemplate && 
    cycleIndex === 0 && 
    candidateLayouts.includes(draft.layoutTemplate as InfographicLayoutArchetype)
  ) {
    return draft.layoutTemplate as InfographicLayoutArchetype;
  }

  // Pick layout based on cycleIndex
  const effectiveCycle = Math.max(0, cycleIndex + (draft.layoutVariationCycle || 0));
  const selected = candidateLayouts[effectiveCycle % candidateLayouts.length];

  return selected;
}
