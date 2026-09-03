import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Flame, 
  Target, 
  BookOpen, 
  Zap, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const PopArtComicLayout: React.FC<LayoutProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  styleConfig,
  renderBlockCard,
}) => {
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');

  return (
    <div className="w-full flex flex-col space-y-6 bg-amber-100 p-4 sm:p-6 border-4 border-black shadow-[10px_10px_0px_#000]">
      {/* 1. COMIC BOOK POP HEADER */}
      <header className="w-full bg-yellow-400 border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-3 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-black text-yellow-300 font-black text-xs uppercase tracking-wider border-2 border-black">
              ★ {draft.subject} ★
            </span>
            <span className="px-3 py-1 bg-white text-black font-black text-xs border-2 border-black">
              {draft.educationLevel} • {draft.grade}
            </span>
          </div>
          <span className="px-3 py-1 bg-rose-500 text-white font-black text-xs uppercase tracking-wider border-2 border-black rotate-1">
            💥 POP COMIC STYLE 💥
          </span>
        </div>

        <div className="space-y-1">
          <h1 
            style={{ fontFamily: styleConfig.typographyProfile?.headingFontFamilyCss }}
            className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none drop-shadow-[2px_2px_0px_#fff]"
          >
            {draft.title}
          </h1>
          {draft.subTitle && (
            <p 
              style={{ fontFamily: styleConfig.typographyProfile?.subheadingFontFamilyCss }}
              className="text-xs sm:text-sm font-black text-slate-900 bg-white/70 px-3 py-1 inline-block border-2 border-black mt-2"
            >
              "{draft.subTitle}"
            </p>
          )}
        </div>

        {draft.learningObjective && (
          <div className="p-3 bg-white border-3 border-black shadow-[4px_4px_0px_#000] text-xs font-bold text-black flex items-start gap-2">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0 mt-0.5" />
            <div>
              <span className="uppercase text-rose-600">MISI KOMIK: </span>
              <span>{draft.learningObjective}</span>
            </div>
          </div>
        )}
      </header>

      {/* 2. COMIC PANELS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
        {mainBlocks.map((block, index) => {
          const isHighlighted = activeSectionId === block.id;
          const panelColors = ['bg-white', 'bg-cyan-50', 'bg-pink-50', 'bg-lime-50'];
          const bgColor = panelColors[index % panelColors.length];

          return (
            <div
              key={block.id}
              onClick={() => onSelectSection(block.id)}
              className={`w-full border-4 border-black p-5 sm:p-6 transition-all duration-150 cursor-pointer flex flex-col justify-between ${bgColor} ${
                isHighlighted
                  ? 'ring-4 ring-rose-500 shadow-[8px_8px_0px_#f43f5e] -translate-y-1'
                  : 'shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-black text-white font-black text-xs flex items-center justify-center border border-black shadow-[2px_2px_0px_#ff0]">
                      #{block.letterIndex || index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 bg-yellow-300 text-black border-2 border-black font-black text-[11px] uppercase tracking-wider">
                      {block.tag || 'PANEL MATERI'}
                    </span>
                  </div>
                  <span className="text-xs font-black uppercase text-slate-800">PANEL {index + 1}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black uppercase text-black mb-2">
                  {block.title}
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed mb-4">
                  {block.content}
                </p>

                {block.keyPoints && block.keyPoints.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t-2 border-black/30">
                    {block.keyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-white p-2 border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-bold text-slate-900">
                        <span className="text-rose-600 font-black">▶</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {block.example && (
                <div className="mt-4 p-2.5 bg-yellow-200 border-2 border-black text-xs font-bold text-black shadow-[3px_3px_0px_#000]">
                  <span className="text-rose-600 uppercase">💥 CONTOH: </span>
                  <span>{block.example}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. COMIC FINALE SUMMARY */}
      {summaryBlocks.map((summaryBlock) => (
        <div
          key={summaryBlock.id}
          onClick={() => onSelectSection(summaryBlock.id)}
          className="w-full bg-rose-500 text-white border-4 border-black p-6 shadow-[8px_8px_0px_#000] cursor-pointer"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b-2 border-black text-xs font-black uppercase text-yellow-300">
            <Zap className="w-4 h-4 fill-yellow-300" />
            <span>★ KESIMPULAN AKHIR KOMIK EDUKASI ★</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black uppercase text-white mb-2">
            {summaryBlock.title}
          </h3>

          <p className="text-xs sm:text-sm font-bold text-rose-100 leading-relaxed mb-3">
            {summaryBlock.content}
          </p>

          {summaryBlock.keyPoints && summaryBlock.keyPoints.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-black text-black">
              {summaryBlock.keyPoints.map((pt, idx) => (
                <div key={idx} className="bg-yellow-300 p-2.5 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2">
                  <span>💥</span>
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
