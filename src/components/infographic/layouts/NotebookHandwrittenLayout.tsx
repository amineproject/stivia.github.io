import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  PenTool, 
  Target, 
  BookOpen, 
  Paperclip, 
  Bookmark,
  CheckSquare
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const NotebookHandwrittenLayout: React.FC<LayoutProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  styleConfig,
  renderBlockCard,
}) => {
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');

  return (
    <div className="w-full flex flex-col space-y-6 bg-[#fdfbf7] p-4 sm:p-6 rounded-2xl border-2 border-[#e5dfd5] shadow-md relative">
      {/* Notebook Spine Spiral Effect at top */}
      <div className="w-full flex justify-around pb-3 border-b-2 border-dashed border-stone-300">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-3 h-4 rounded-full bg-stone-300 border border-stone-400" />
        ))}
      </div>

      {/* 1. NOTEBOOK HEADER */}
      <header className="w-full bg-[#fbf9f4] border-2 border-dashed border-stone-400 p-6 rounded-xl shadow-xs space-y-3 relative">
        {/* Washi Tape Header Decor */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-200/80 border border-amber-300/80 -rotate-1 shadow-2xs" />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-serif text-stone-600 border-b border-stone-300 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">📒 {draft.subject}</span>
            <span>•</span>
            <span>{draft.educationLevel} Kelas {draft.grade}</span>
          </div>
          <span className="italic text-stone-500 font-serif">Catatan Belajar Mandiri</span>
        </div>

        <div className="space-y-1">
          <h1 
            style={{ fontFamily: styleConfig.typographyProfile?.headingFontFamilyCss }}
            className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight"
          >
            {draft.title}
          </h1>
          {draft.subTitle && (
            <p 
              style={{ fontFamily: styleConfig.typographyProfile?.subheadingFontFamilyCss }}
              className="text-xs sm:text-sm font-serif italic text-stone-600"
            >
              ~ {draft.subTitle} ~
            </p>
          )}
        </div>

        {draft.learningObjective && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs font-serif text-stone-700 flex items-start gap-2">
            <span className="font-bold text-amber-800">🎯 Sasaran:</span>
            <span>{draft.learningObjective}</span>
          </div>
        )}
      </header>

      {/* 2. STICKY NOTES & SKETCH CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
        {mainBlocks.map((block, index) => {
          const isHighlighted = activeSectionId === block.id;
          const rotateClass = index % 2 === 0 ? '-rotate-0.5' : 'rotate-0.5';

          return (
            <div
              key={block.id}
              onClick={() => onSelectSection(block.id)}
              className={`w-full bg-[#fffefc] border-2 border-dashed border-stone-400 p-5 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${rotateClass} ${
                isHighlighted
                  ? 'ring-2 ring-amber-500 border-amber-500 shadow-md scale-[1.01]'
                  : 'shadow-xs hover:border-stone-500 hover:shadow-sm'
              }`}
            >
              {/* Little Pin / Clip at top right */}
              <div className="absolute -top-2 right-4 text-stone-400">
                <Paperclip className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200 text-xs font-serif">
                  <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    Catatan #{index + 1}: {block.tag || 'POIN POKOK'}
                  </span>
                  <span className="text-stone-400 italic">Hal. {index + 1}</span>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-2">
                  {block.title}
                </h3>

                <p className="text-xs sm:text-sm font-serif text-stone-700 leading-relaxed mb-4">
                  {block.content}
                </p>

                {block.keyPoints && block.keyPoints.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-dashed border-stone-300">
                    {block.keyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-serif text-stone-800">
                        <CheckSquare className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {block.example && (
                <div className="mt-4 p-2 bg-yellow-100/60 border-l-3 border-amber-400 text-xs font-serif text-stone-800 italic">
                  <strong>Contoh: </strong>
                  <span>{block.example}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. SUMMARY NOTEBOOK TAPE */}
      {summaryBlocks.map((summaryBlock) => (
        <div
          key={summaryBlock.id}
          onClick={() => onSelectSection(summaryBlock.id)}
          className="w-full bg-[#f5efe6] border-2 border-stone-400 p-6 rounded-xl shadow-xs cursor-pointer relative"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-stone-300 text-xs font-serif font-bold text-stone-700">
            <span>📌</span>
            <span>RANGKUMAN INTI HARUS DIINGAT</span>
          </div>

          <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
            {summaryBlock.title}
          </h3>

          <p className="text-xs sm:text-sm font-serif text-stone-700 leading-relaxed mb-3">
            {summaryBlock.content}
          </p>

          {summaryBlock.keyPoints && summaryBlock.keyPoints.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif text-stone-800">
              {summaryBlock.keyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/60 p-2 rounded border border-stone-200">
                  <span className="text-amber-600 font-bold">✔</span>
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
