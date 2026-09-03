import { 
  ActiveProjectContext, 
  MaterialBlock, 
  ContentValidationResult,
  ContentSnapshot,
  ContentSnapshotSection
} from '../types';
import { runStructureEngine, StructureEngineOutput } from './structureEngine';
import { runContentWeightEngine, ContentWeightEngineOutput } from './contentWeightEngine';
import { runContentDepthEngine, ContentDepthEngineOutput } from './contentDepthEngine';
import { validateFinalContent } from './contentValidationEngine';
import { analyzeVisualContent, VisualContentAnalysis } from './visualAnalysisEngine';
import { determineVisualConcept, optimizeBlockLayouts, VisualConceptConfig } from './visualConceptEngine';

export interface ContentEnginePipelineResult {
  blocks: MaterialBlock[];
  contentSnapshot: ContentSnapshot;
  overview: string;
  keySummary: string[];
  validation: ContentValidationResult;
  visualAnalysis: VisualContentAnalysis;
  visualConcept: VisualConceptConfig;
  stage2AOutput: StructureEngineOutput;
  stage2BOutput: ContentWeightEngineOutput;
  stage2COutput: ContentDepthEngineOutput;
  metadata: {
    executedAt: string;
    totalBlocks: number;
    requiredTopicsCount: number;
    weightSummary: {
      tinggi: number;
      sedang: number;
      rendah: number;
      ringan: number;
      utama: number;
    };
    depthSummary: {
      ringkas: number;
      sedang: number;
      mendalam: number;
    };
  };
}

/**
 * PIPELINE UTAMA: STIVIA CONTENT & VISUAL ENGINE
 * 
 * Rangkaian Tahap Terintegrasi:
 * 1. TAHAP 1: ANALISIS KONTEN VISUAL (Domain, Objek Visual, Metafora Edukatif)
 * 2. TAHAP 2A: STRUCTURE ENGINE (Menyusun struktur berdasarkan cakupan wajib)
 * 3. TAHAP 2B: CONTENT WEIGHT ENGINE (Menentukan bobot TINGGI | SEDANG | RENDAH)
 * 4. TAHAP 2C: CONTENT DEPTH ENGINE (Menentukan kedalaman RINGKAS | SEDANG | MENDALAM)
 * 5. TAHAP 2 & 5: VISUAL CONCEPT & LAYOUT OPTIMIZER (Menentukan model visual & layout)
 * 6. VALIDASI KONTEN FINAL & CONTENT SNAPSHOT (Single Source of Truth)
 */
export function runContentEnginePipeline(context: ActiveProjectContext): ContentEnginePipelineResult {
  // 1. TAHAP 1: ANALISIS KONTEN VISUAL
  const visualAnalysis = analyzeVisualContent(context);

  // 2. TAHAP 2A: STRUCTURE ENGINE
  const stage2AOutput = runStructureEngine(context);

  // 3. TAHAP 2B: CONTENT WEIGHT ENGINE
  const stage2BOutput = runContentWeightEngine(stage2AOutput.structureItems, context);

  // 4. TAHAP 2C: CONTENT DEPTH ENGINE
  const stage2COutput = runContentDepthEngine(stage2BOutput.weightedItems, context);

  // 5. TAHAP 2 & 5: VISUAL CONCEPT ENGINE & LAYOUT OPTIMIZER
  const initialBlocks = stage2COutput.blocks;
  const visualConcept = determineVisualConcept(visualAnalysis, initialBlocks, context);
  const optimizedBlocks = optimizeBlockLayouts(initialBlocks, visualConcept);

  // 6. VALIDASI CONTENT FINAL
  const validation = validateFinalContent(optimizedBlocks, context);

  // 7. BANGUN CONTENT SNAPSHOT (SINGLE SOURCE OF TRUTH)
  const sections: ContentSnapshotSection[] = optimizedBlocks.map((b, idx) => ({
    order: b.order,
    letterIndex: b.letterIndex || String.fromCharCode(65 + idx),
    title: b.title,
    coreIdea: b.coreIdea || b.content,
    explanation: b.explanation || b.content,
    keyPoints: b.keyPoints || [],
    example: b.example,
    exampleTitle: b.exampleTitle,
    weight: b.weight || 'SEDANG',
    depth: b.depth || 'SEDANG',
    visualPriority: b.visualPriority || 'SEKUNDER',
    presentationType: b.presentationType || 'Definisi + penjelasan',
    sourceCoverage: b.sourceCoverage || b.title,
  }));

  const contentSnapshot: ContentSnapshot = {
    identity: {
      educationLevel: context.jenjang,
      grade: context.kelas,
      subject: context.mataPelajaran,
      theme: context.tema,
      topic: context.materi,
      scope: context.cakupanMateri,
    },
    title: `${context.materi.toUpperCase()} : ${context.tema.toUpperCase()}`,
    overview: stage2COutput.overview,
    sections,
    keySummary: stage2COutput.keySummary,
    createdAt: new Date().toISOString(),
    version: '2.2c',
  };

  return {
    blocks: optimizedBlocks,
    contentSnapshot,
    overview: stage2COutput.overview,
    keySummary: stage2COutput.keySummary,
    validation,
    visualAnalysis,
    visualConcept,
    stage2AOutput,
    stage2BOutput,
    stage2COutput,
    metadata: {
      executedAt: new Date().toISOString(),
      totalBlocks: optimizedBlocks.length,
      requiredTopicsCount: stage2AOutput.validationCheck.rawScopeItems.length,
      weightSummary: {
        tinggi: stage2BOutput.weightSummary.tinggiCount,
        sedang: stage2BOutput.weightSummary.sedangCount,
        rendah: stage2BOutput.weightSummary.rendahCount,
        ringan: stage2BOutput.weightSummary.rendahCount,
        utama: stage2BOutput.weightSummary.tinggiCount,
      },
      depthSummary: {
        ringkas: stage2COutput.depthSummary.ringkasCount,
        sedang: stage2COutput.depthSummary.sedangCount,
        mendalam: stage2COutput.depthSummary.mendalamCount,
      },
    },
  };
}
