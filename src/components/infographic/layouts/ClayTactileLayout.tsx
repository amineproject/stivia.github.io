import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Smile, 
  Target, 
  BookOpen, 
  Sparkles, 
  Heart,
  CheckCircle,
  Star
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const ClayTactileLayout: React.FC<LayoutProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  styleConfig,
  renderBlockCard,
}) => {
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');

  return (
    <div className="w-full flex flex-col space-y-6 bg-amber-50/40 p-4 sm:p-6 rounded-[2.5rem] border-2 border-amber-200/60">
      {/* 1. CLAY TACTILE BUBBLY HEADER */}
      <header className="w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-6 sm:p-8 rounded-[2rem] shadow-[0_12px_24px_rgba(168,85,247,0.25)] border-4 border-white/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white text-purple-700 font-black text-xs shadow-sm flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {draft.subject}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 font-bold text-xs border border-white/30 backdrop-blur-xs">
              {draft.educationLevel} • {draft.grade}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-pink-400 text-white font-bold text-xs shadow-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clay Tactile 3D</span>
          </span>
        </div>

        <div className="space-y-1.5">
          <h1 
            style={{ fontFamily: styleConfig.typographyProfile?.headingFontFamilyCss }}
            className="text-2xl sm:text-4xl font-black tracking-tight leading-tight drop-shadow-sm"
          >
            {draft.title}
          </h1>
          {draft.subTitle && (
            <p 
              style={{ fontFamily: styleConfig.typographyProfile?.subheadingFontFamilyCss }}
              className="text-xs sm:text-sm font-medium text-pink-100 leading-relaxed max-w-2xl"
            >
              {draft.subTitle}
            </p>
          )}
        </div>

        {draft.learningObjective && (
          <div className="p-3.5 rounded-2xl bg-white/15 border-2 border-white/20 backdrop-blur-xs flex items-start gap-2.5 text-xs sm:text-sm">
            <Star className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Misi Belajar: </span>
              <span className="opacity-95">{draft.learningObjective}</span>
            </div>
          </div>
        )}
      </header>

      {/* 2. FLOATING CLAY 3D CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
        {mainBlocks.map((block, index) => {
          const isHighlighted = activeSectionId === block.id;
          return (
            <div
              key={block.id}
              onClick={() => onSelectSection(block.id)}
              className={`w-full rounded-[2rem] bg-white p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between border-2 ${
                isHighlighted
                  ? 'border-purple-500 ring-4 ring-purple-300/50 shadow-[0_16px_32px_rgba(168,85,247,0.2)] -translate-y-1'
                  : 'border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                      {block.letterIndex || index + 1}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold uppercase tracking-wider">
                      {block.tag || 'MATERI'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">Blok {index + 1}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-2">
                  {block.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {block.content}
                </p>

                {block.keyPoints && block.keyPoints.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {block.keyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 text-xs text-slate-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {block.example && (
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100 text-indigo-900">
                  <span className="font-bold">💡 Contoh Nyata: </span>
                  <span>{block.example}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. CLAY SUMMARY */}
      {summaryBlocks.map((summaryBlock) => (
        <div
          key={summaryBlock.id}
          onClick={() => onSelectSection(summaryBlock.id)}
          className="w-full rounded-[2rem] bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white p-6 sm:p-7 shadow-[0_12px_28px_rgba(147,51,234,0.3)] border-4 border-white/50 cursor-pointer"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/20 text-xs font-bold uppercase">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Rangkuman Belajar Bintang Lima</span>
          </div>

          <h3 className="text-xl font-black mb-2">{summaryBlock.title}</h3>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed mb-3">{summaryBlock.content}</p>

          {summaryBlock.keyPoints && summaryBlock.keyPoints.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-white">
              {summaryBlock.keyPoints.map((pt, idx) => (
                <div key={idx} className="bg-white/20 p-2.5 rounded-xl backdrop-blur-xs flex items-center gap-2 font-medium">
                  <span className="text-amber-300">★</span>
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
