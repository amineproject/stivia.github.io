import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Sparkles, 
  Target, 
  BookOpen, 
  Layers, 
  Compass,
  CheckCircle2
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const GlassmorphismLayout: React.FC<LayoutProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  styleConfig,
  renderBlockCard,
}) => {
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');

  return (
    <div className="w-full flex flex-col space-y-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-7 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
      {/* Luminous Ambient Background Glow Orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* 1. GLASS HEADER */}
      <header className="relative z-10 w-full bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-2xl shadow-lg text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/15 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 font-bold backdrop-blur-xs flex items-center gap-1.5 border border-white/30">
              <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
              {draft.subject}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 font-semibold border border-white/15">
              {draft.educationLevel} • {draft.grade}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/40 to-fuchsia-500/40 border border-white/30 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Glassmorphism Dynamic</span>
          </span>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-transparent">
            {draft.title}
          </h1>
          {draft.subTitle && (
            <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed max-w-2xl">
              {draft.subTitle}
            </p>
          )}
        </div>

        {draft.learningObjective && (
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
            <Target className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Tujuan Pembelajaran: </span>
              <span className="opacity-95">{draft.learningObjective}</span>
            </div>
          </div>
        )}
      </header>

      {/* 2. TRANSLUCENT GLASS CARDS GRID */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
        {mainBlocks.map((block, index) => {
          const isHighlighted = activeSectionId === block.id;

          return (
            <div
              key={block.id}
              onClick={() => onSelectSection(block.id)}
              className={`w-full bg-white/10 backdrop-blur-md border rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isHighlighted
                  ? 'border-cyan-400/80 ring-2 ring-cyan-400/40 shadow-[0_8px_32px_rgba(6,182,212,0.25)] bg-white/15'
                  : 'border-white/15 hover:border-white/30 hover:bg-white/12 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      {block.letterIndex || index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-cyan-200 border border-white/15 text-[11px] font-bold uppercase tracking-wider">
                      {block.tag || 'MODUL'}
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs">Bagian {index + 1}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {block.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {block.content}
                </p>

                {block.keyPoints && block.keyPoints.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    {block.keyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {block.example && (
                <div className="mt-4 p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-200">
                  <span className="font-bold">✨ Aplikasi Nyata: </span>
                  <span>{block.example}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. GLASS SUMMARY */}
      {summaryBlocks.map((summaryBlock) => (
        <div
          key={summaryBlock.id}
          onClick={() => onSelectSection(summaryBlock.id)}
          className="relative z-10 w-full bg-white/15 backdrop-blur-lg border-2 border-cyan-400/50 p-6 sm:p-7 rounded-2xl shadow-xl cursor-pointer text-white"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/15 text-xs font-bold uppercase text-cyan-300">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Rangkuman Inti & Intisari Materi</span>
          </div>

          <h3 className="text-xl font-bold mb-2">{summaryBlock.title}</h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">{summaryBlock.content}</p>

          {summaryBlock.keyPoints && summaryBlock.keyPoints.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-cyan-100">
              {summaryBlock.keyPoints.map((pt, idx) => (
                <div key={idx} className="bg-white/10 p-2.5 rounded-xl border border-white/15 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
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
