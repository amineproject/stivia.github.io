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

export interface ContentEnginePipelineResult {
  blocks: MaterialBlock[];
  contentSnapshot: ContentSnapshot;
  overview: string;
  keySummary: string[];
  validation: ContentValidationResult;
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
 * PIPELINE UTAMA: STIVIA CONTENT ENGINE (TAHAP 2A, 2B, 2C + CONTENT SNAPSHOT)
 * 
 * Menghubungkan seluruh rangkaian sebelum diserahkan ke Layout Engine (Tahap 3):
 * 
 * INPUT PENGGUNA
 *   ↓
 * TAHAP 2A — STRUCTURE ENGINE (Menyusun struktur berdasarkan cakupan wajib)
 *   ↓
 * TAHAP 2B — CONTENT WEIGHT ENGINE (Menentukan bobot TINGGI | SEDANG | RENDAH)
 *   ↓
 * TAHAP 2C — CONTENT DEPTH ENGINE (Menentukan kedalaman RINGKAS | SEDANG | MENDALAM)
 *   ↓
 * CONTENT SNAPSHOT (Single Source of Truth terpadu)
 *   ↓
 * VALIDASI CONTENT FINAL (Memverifikasi parameter kualitas)
 */
export function runContentEnginePipeline(context: ActiveProjectContext): ContentEnginePipelineResult {
  // 1. TAHAP 2A: STRUCTURE ENGINE
  const stage2AOutput = runStructureEngine(context);

  // 2. TAHAP 2B: CONTENT WEIGHT ENGINE
  const stage2BOutput = runContentWeightEngine(stage2AOutput.structureItems, context);

  // 3. TAHAP 2C: CONTENT DEPTH ENGINE
  const stage2COutput = runContentDepthEngine(stage2BOutput.weightedItems, context);

  // 4. VALIDASI CONTENT FINAL
  let blocks = stage2COutput.blocks;
  const validation = validateFinalContent(blocks, context);

  // 5. BANGUN CONTENT SNAPSHOT (SINGLE SOURCE OF TRUTH)
  const sections: ContentSnapshotSection[] = blocks.map((b, idx) => ({
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
    version: '2.0-stabilized',
  };

  return {
    blocks,
    contentSnapshot,
    overview: stage2COutput.overview,
    keySummary: stage2COutput.keySummary,
    validation,
    stage2AOutput,
    stage2BOutput,
    stage2COutput,
    metadata: {
      executedAt: new Date().toISOString(),
      totalBlocks: blocks.length,
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
