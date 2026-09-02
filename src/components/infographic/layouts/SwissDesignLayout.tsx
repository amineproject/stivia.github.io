import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Square, 
  Target, 
  BookOpen, 
  ArrowUpRight,
  Check
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const SwissDesignLayout: React.FC<LayoutProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  styleConfig,
  renderBlockCard,
}) => {
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');

  return (
    <div className="w-full flex flex-col space-y-6 bg-white text-black p-4 sm:p-6 border-4 border-black">
      {/* 1. SWISS MODERNIST HEADER */}
      <header className="w-full border-b-4 border-black pb-6 pt-2 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold tracking-widest uppercase border-b-2 border-black pb-2">
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-white px-2 py-0.5">CH-DESIGN</span>
            <span>{draft.subject}</span>
          </div>
          <span>{draft.educationLevel} // {draft.grade}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-none font-sans">
              {draft.title}
            </h1>
          </div>
          <div className="lg:col-span-4 text-xs font-sans text-stone-700 leading-relaxed border-l-2 border-black pl-4">
            {draft.subTitle && (
              <p className="font-bold text-black uppercase mb-1">{draft.subTitle}</p>
            )}
            {draft.learningObjective && (
              <p className="text-[11px] text-stone-600">Objektif: {draft.learningObjective}</p>
            )}
          </div>
        </div>
      </header>

      {/* 2. STRICT SWISS ASYMMETRIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black w-full items-stretch">
        {mainBlocks.map((block, index) => {
          const isHighlighted = activeSectionId === block.id;
          return (
            <div
              key={block.id}
              onClick={() => onSelectSection(block.id)}
              className={`p-6 flex flex-col justify-between cursor-pointer transition-all duration-150 ${
                isHighlighted ? 'bg-stone-100 ring-4 ring-red-600 z-10' : 'bg-white hover:bg-stone-50'
              }`}
            >
              <div>
                {/* Big Index Number */}
                <div className="flex items-baseline justify-between mb-4 border-b border-black pb-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tighter">
                    0{index + 1}
                  </span>
                  <span className="text-[10px] font-bold font-mono uppercase bg-black text-white px-2 py-0.5">
                    {block.tag || 'SECTION'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-3">
                  {block.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed mb-4">
                  {block.content}
                </p>

                {block.keyPoints && block.keyPoints.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-stone-300">
                    {block.keyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-900">
                        <span className="w-1.5 h-1.5 bg-red-600 shrink-0 mt-1.5" />
                        <span className="font-medium">{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-black text-[10px] font-mono flex items-center justify-between uppercase">
                <span>INDEX_0{index + 1}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. SWISS SUMMARY BANNER */}
      {summaryBlocks.map((summaryBlock) => (
        <div
          key={summaryBlock.id}
          onClick={() => onSelectSection(summaryBlock.id)}
          className="w-full bg-black text-white p-6 border-2 border-black cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white font-mono font-bold text-xs px-2 py-0.5 uppercase">
              RANGKUMAN KUNCI
            </span>
            <span className="text-xs font-mono text-stone-400">INTISARI MATERI</span>
          </div>

          <h3 className="text-xl font-black uppercase tracking-tight mb-2">
            {summaryBlock.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-3">
            {summaryBlock.content}
          </p>

          {summaryBlock.keyPoints && summaryBlock.keyPoints.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-800 text-xs text-stone-200 font-mono">
              {summaryBlock.keyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">■</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
