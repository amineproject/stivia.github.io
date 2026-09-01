import React from 'react';
import { AlertCircle, Database, Search, Map, CheckCircle2 } from 'lucide-react';
import { CaseStudyData, StyleConfig } from '../../types';
import { STYLE_MODERN_EDUKATIF } from '../../data/styleSystem';

interface CaseStudyCardProps {
  caseStudy?: CaseStudyData;
  isHighlighted?: boolean;
  styleConfig?: StyleConfig;
}

const DEFAULT_CASE_STUDY: CaseStudyData = {
  title: 'Studi Kasus Pemecahan Masalah Kontekstual',
  subTitle: 'Menerapkan materi pembelajaran dalam skenario dan pengambilan keputusan nyata.',
  problem: 'Mengidentifikasi tantangan dan skenario nyata yang relevan dengan topik bahasan.',
  dataConcept: 'Memetakan variabel, unsur-unsur kunci, dan relasi logis antar data materi.',
  analysis: 'Mengevaluasi pola, hubungan sebab-akibat, dan implikasi dari setiap opsi solusi.',
  visualizationNote: 'Menggunakan diagram visual dan alur logika terstruktur untuk menguji solusi.',
  solutionHighlight: 'Keputusan Tepat Berdasarkan Prinsip Materi',
  conclusion: 'Penerapan konsep materi secara sistematis menghasilkan keputusan yang lebih terukur, objektif, dan efektif!'
};

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  caseStudy = DEFAULT_CASE_STUDY,
  isHighlighted = false,
  styleConfig = STYLE_MODERN_EDUKATIF,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;

  return (
    <section className={`${cards.borderRadius} ${cards.padding} border transition-all ${
      isHighlighted
        ? `${colorPalette.headerGradient} ${colorPalette.headerText} border-teal-400 ring-2 ring-teal-400/20 shadow-md`
        : `${colorPalette.headerGradient} ${colorPalette.headerText} border-slate-700/80 shadow-xs`
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 ${icons.containerShape} ${colorPalette.accentBg} text-white font-black text-xs flex items-center justify-center shrink-0`}>
            ★
          </span>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${colorPalette.headerBadgeBg} px-2.5 py-0.5 ${cards.innerRadius} border border-white/20`}>
            STUDI KASUS PEMBELAJARAN
          </span>
        </div>
        <span className={`text-[11px] ${colorPalette.headerSubtext} font-medium`}>
          Aplikasi Pemecahan Masalah
        </span>
      </div>

      <div className="space-y-1 mb-4">
        <h3 className={`${typography.headingScale} ${typography.headingFont} ${typography.headingWeight} ${typography.headingTracking} leading-snug break-words whitespace-normal`}>
          {caseStudy.title || 'Studi Kasus Pemecahan Masalah'}
        </h3>
        <p className={`text-xs ${colorPalette.headerSubtext} leading-relaxed break-words whitespace-normal`}>
          {caseStudy.subTitle || 'Menerapkan materi pembelajaran dalam skenario dan pengambilan keputusan praktis.'}
        </p>
      </div>

      {/* 5-Phase Problem Solving Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2.5 mb-4 w-full min-w-0">
        {/* Phase 1: Problem */}
        <div className={`p-3 ${cards.innerRadius} bg-white/5 border border-white/10 flex flex-col justify-between min-w-0 box-border overflow-hidden`}>
          <div>
            <div className="flex items-center gap-1.5 text-rose-300 text-[10px] font-bold uppercase mb-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              1. Masalah / Kasus
            </div>
            <p className="text-[11px] text-white/90 leading-snug break-words whitespace-normal">
              {caseStudy.problem}
            </p>
          </div>
        </div>

        {/* Phase 2: Data Concept */}
        <div className={`p-3 ${cards.innerRadius} bg-white/5 border border-white/10 flex flex-col justify-between min-w-0 box-border overflow-hidden`}>
          <div>
            <div className="flex items-center gap-1.5 text-sky-300 text-[10px] font-bold uppercase mb-1">
              <Database className="w-3.5 h-3.5 shrink-0" />
              2. Konseptualisasi
            </div>
            <p className="text-[11px] text-white/90 leading-snug break-words whitespace-normal">
              {caseStudy.dataConcept}
            </p>
          </div>
        </div>

        {/* Phase 3: Analysis */}
        <div className={`p-3 ${cards.innerRadius} bg-white/5 border border-white/10 flex flex-col justify-between min-w-0 box-border overflow-hidden`}>
          <div>
            <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-bold uppercase mb-1">
              <Search className="w-3.5 h-3.5 shrink-0" />
              3. Analisis & Evaluasi
            </div>
            <p className="text-[11px] text-white/90 leading-snug break-words whitespace-normal">
              {caseStudy.analysis}
            </p>
          </div>
        </div>

        {/* Phase 4: Visualization Note */}
        <div className={`p-3 ${cards.innerRadius} bg-white/5 border border-white/10 flex flex-col justify-between min-w-0 box-border overflow-hidden`}>
          <div>
            <div className="flex items-center gap-1.5 text-indigo-200 text-[10px] font-bold uppercase mb-1">
              <Map className="w-3.5 h-3.5 shrink-0" />
              4. Mekanisme / Aturan
            </div>
            <p className="text-[11px] text-white/90 leading-snug break-words whitespace-normal">
              {caseStudy.visualizationNote}
            </p>
          </div>
        </div>

        {/* Phase 5: Conclusion */}
        <div className={`p-3 ${cards.innerRadius} bg-white/15 border border-white/25 flex flex-col justify-between min-w-0 box-border overflow-hidden`}>
          <div>
            <div className="flex items-center gap-1.5 text-teal-300 text-[10px] font-bold uppercase mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              5. Solusi / Keputusan
            </div>
            <p className="text-[11px] text-white font-semibold leading-snug break-words whitespace-normal">
              {caseStudy.solutionHighlight || 'Solusi Berbasis Prinsip Materi'}
            </p>
          </div>
        </div>
      </div>

      {/* Golden Conclusion Bar */}
      <div className={`p-3 ${cards.innerRadius} bg-white/10 border border-white/20 text-xs flex items-start gap-2.5`}>
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
        <p className="leading-relaxed break-words whitespace-normal">
          <span className="font-bold">Insight Kunci: </span>
          {caseStudy.conclusion}
        </p>
      </div>
    </section>
  );
};
