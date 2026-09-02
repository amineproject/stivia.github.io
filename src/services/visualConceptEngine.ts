import { 
  ActiveProjectContext, 
  MaterialBlock, 
  LayoutType, 
  VisualElementType, 
  InformationType,
  VisualType
} from '../types';
import { VisualContentAnalysis } from './visualAnalysisEngine';

export type VisualConceptType = 
  | 'hero_visual'
  | 'concept_map'
  | 'storytelling'
  | 'timeline'
  | 'process_flow'
  | 'comparison'
  | 'data_focus'
  | 'modular_information';

export interface VisualConceptConfig {
  conceptType: VisualConceptType;
  conceptTitle: string;
  conceptDescription: string;
  layoutStructure: 'single_hero' | 'split_comparison' | 'pipeline_flow' | 'hub_spoke' | 'bento_modular';
  focalAnchorIndex: number;
  highlightStrategy: 'central_focus' | 'step_by_step' | 'contrast_pairs' | 'metric_callouts';
  hierarchyTokens: {
    primaryVisualLevel: string;
    secondaryVisualLevel: string;
    badgeStyle: string;
  };
}

/**
 * TAHAP 2 & 5 — SISTEM KONSEP VISUAL & KECERDASAN PEMILIHAN LAYOUT
 * 
 * Menentukan konsep visual induk dan mengatur tata letak yang paling sesuai
 * dengan struktur materi, alur logika, dan gaya penyajian yang dipilih.
 */
export function determineVisualConcept(
  analysis: VisualContentAnalysis,
  blocks: MaterialBlock[],
  context: ActiveProjectContext
): VisualConceptConfig {
  const model = analysis.recommendedConceptModel;

  switch (model) {
    case 'hero_visual':
      return {
        conceptType: 'hero_visual',
        conceptTitle: 'Hero Visual Fokus Inti',
        conceptDescription: 'Menampilkan satu ilustrasi/diagram utama yang kuat sebagai jangkar pemahaman siswa.',
        layoutStructure: 'single_hero',
        focalAnchorIndex: 0,
        highlightStrategy: 'central_focus',
        hierarchyTokens: {
          primaryVisualLevel: 'hero-dominant',
          secondaryVisualLevel: 'modular-cards',
          badgeStyle: 'prominent-hero',
        },
      };

    case 'concept_map':
      return {
        conceptType: 'concept_map',
        conceptTitle: 'Peta Konsep & Relasi Interaktif',
        conceptDescription: 'Menampilkan hubungan konseptual dan interkoneksi antar elemen materi.',
        layoutStructure: 'hub_spoke',
        focalAnchorIndex: 0,
        highlightStrategy: 'central_focus',
        hierarchyTokens: {
          primaryVisualLevel: 'relational-network',
          secondaryVisualLevel: 'sub-nodes',
          badgeStyle: 'connected-pill',
        },
      };

    case 'process_flow':
      return {
        conceptType: 'process_flow',
        conceptTitle: 'Alur Proses & Siklus Kerja',
        conceptDescription: 'Menyajikan tahapan berurutan atau siklus kerja yang logis dari awal hingga akhir.',
        layoutStructure: 'pipeline_flow',
        focalAnchorIndex: blocks.findIndex(b => b.visualElementType === 'flowchart') || 0,
        highlightStrategy: 'step_by_step',
        hierarchyTokens: {
          primaryVisualLevel: 'step-sequence',
          secondaryVisualLevel: 'phase-cards',
          badgeStyle: 'numbered-step',
        },
      };

    case 'timeline':
      return {
        conceptType: 'timeline',
        conceptTitle: 'Kronologi & Garis Waktu',
        conceptDescription: 'Menyusun peristiwa atau fase pembelajaran berdasarkan tonggak waktu yang teratur.',
        layoutStructure: 'pipeline_flow',
        focalAnchorIndex: 0,
        highlightStrategy: 'step_by_step',
        hierarchyTokens: {
          primaryVisualLevel: 'chronology-rail',
          secondaryVisualLevel: 'milestone-cards',
          badgeStyle: 'timeline-badge',
        },
      };

    case 'comparison':
      return {
        conceptType: 'comparison',
        conceptTitle: 'Perbandingan & Kontras Karakteristik',
        conceptDescription: 'Menandingkan dua atau lebih konsep secara sejajar untuk memperjelas perbedaan esensial.',
        layoutStructure: 'split_comparison',
        focalAnchorIndex: blocks.findIndex(b => b.visualElementType === 'tabel_perbandingan') || 0,
        highlightStrategy: 'contrast_pairs',
        hierarchyTokens: {
          primaryVisualLevel: 'side-by-side',
          secondaryVisualLevel: 'feature-rows',
          badgeStyle: 'contrast-pill',
        },
      };

    case 'data_focus':
      return {
        conceptType: 'data_focus',
        conceptTitle: 'Fokus Data & Metrik Dampak',
        conceptDescription: 'Menonjolkan angka penting, persentase, dan bukti empiris kontekstual.',
        layoutStructure: 'bento_modular',
        focalAnchorIndex: blocks.findIndex(b => b.visualElementType === 'grafik') || 0,
        highlightStrategy: 'metric_callouts',
        hierarchyTokens: {
          primaryVisualLevel: 'metric-hero',
          secondaryVisualLevel: 'detail-cards',
          badgeStyle: 'stat-badge',
        },
      };

    case 'storytelling':
      return {
        conceptType: 'storytelling',
        conceptTitle: 'Alur Cerita Naratif Edukatif',
        conceptDescription: 'Menyampaikan materi melalui narasi terstruktur yang memandu rasa ingin tahu peserta didik.',
        layoutStructure: 'pipeline_flow',
        focalAnchorIndex: 0,
        highlightStrategy: 'step_by_step',
        hierarchyTokens: {
          primaryVisualLevel: 'narrative-arc',
          secondaryVisualLevel: 'scene-blocks',
          badgeStyle: 'story-badge',
        },
      };

    case 'modular_information':
    default:
      return {
        conceptType: 'modular_information',
        conceptTitle: 'Struktur Modular Bento-Grid',
        conceptDescription: 'Menata informasi ke dalam modul-modul kartu terstruktur yang seimbang dan mudah dipindai.',
        layoutStructure: 'bento_modular',
        focalAnchorIndex: 0,
        highlightStrategy: 'central_focus',
        hierarchyTokens: {
          primaryVisualLevel: 'bento-cards',
          secondaryVisualLevel: 'supporting-grid',
          badgeStyle: 'modular-tag',
        },
      };
  }
}

/**
 * TAHAP 5 — KECERDASAN PEMILIHAN LAYOUT (Dynamic Layout Optimizer)
 * Mengoptimalkan konfigurasi visual type dan layout type tiap block agar harmonis
 */
export function optimizeBlockLayouts(
  blocks: MaterialBlock[],
  concept: VisualConceptConfig
): MaterialBlock[] {
  return blocks.map((block, idx) => {
    let updatedBlock = { ...block };

    // Set layout according to visual element type and concept structure
    if (block.visualElementType === 'flowchart' || block.visualElementType === 'timeline') {
      updatedBlock.layoutType = 'flow-horizontal';
      updatedBlock.layoutConfig = { columns: 4, direction: 'horizontal', spanFullWidth: true };
    } else if (block.visualElementType === 'tabel_perbandingan') {
      updatedBlock.layoutType = 'comparison';
      updatedBlock.layoutConfig = { columns: 2, direction: 'horizontal', spanFullWidth: false };
    } else if (block.visualElementType === 'ringkasan_kotak') {
      updatedBlock.layoutType = 'single-column';
      updatedBlock.layoutConfig = { columns: 1, direction: 'vertical', spanFullWidth: true };
    } else if (block.visualElementType === 'grafik') {
      updatedBlock.layoutType = 'two-column';
      updatedBlock.layoutConfig = { columns: 2, direction: 'horizontal', spanFullWidth: false };
    } else if (block.visualElementType === 'komponen') {
      updatedBlock.layoutType = 'feature-grid';
      updatedBlock.layoutConfig = { columns: 2, direction: 'horizontal', spanFullWidth: false };
    } else {
      updatedBlock.layoutType = 'hero';
      updatedBlock.layoutConfig = { columns: 1, direction: 'vertical', spanFullWidth: false };
    }

    return updatedBlock;
  });
}
