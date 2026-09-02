import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Sparkles, 
  Target, 
  BookOpen, 
  Layers,
  LayoutGrid,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const ModularBentoLayout: React.FC<LayoutProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  styleConfig,
  renderBlockCard,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* 1. BENTO STYLE HEADER */}
      <header className={`relative w-full ${cards.borderRadius} ${colorPalette.headerGradient} ${colorPalette.headerText} p-6 sm:p-7 shadow-sm border border-white/20 overflow-hidden`}>
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <LayoutGrid className="w-32 h-32" />
        </div>

        <div className="relative z-10 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15 text-xs">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl ${colorPalette.headerBadgeBg} font-bold tracking-wider uppercase flex items-center gap-1.5`}>
                <BookOpen className="w-3.5 h-3.5" />
                {draft.subject}
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/20 font-semibold border border-white/20">
                {draft.educationLevel} • {draft.grade}
              </span>
            </div>
            <span className="bg-white/10 px-3 py-0.5 rounded-full border border-white/15 text-xs flex items-center gap-1">
              <LayoutGrid className="w-3 h-3 text-teal-300" />
              <span>Modular Bento Layout</span>
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className={`text-2xl sm:text-3xl ${typography.headingFont} ${typography.headingWeight} tracking-tight leading-snug`}>
              {draft.title}
            </h1>
            {draft.subTitle && (
              <p className={`text-xs sm:text-sm font-medium ${colorPalette.headerSubtext} leading-relaxed`}>
                {draft.subTitle}
              </p>
            )}
          </div>

          {draft.learningObjective && (
            <div className={`p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-start gap-2.5 text-xs sm:text-sm`}>
              <Target className="w-4 h-4 mt-0.5 text-teal-300 shrink-0" />
              <div>
                <span className="font-bold">Capaian Pembelajaran: </span>
                <span className="opacity-95">{draft.learningObjective}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. ASYMMETRIC BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full items-stretch">
        {mainBlocks.map((block, index) => {
          // Asymmetric spans: 1st block or wide block spans 2 cols
          let colSpan = 'md:col-span-1 lg:col-span-1';
          if (index === 0 && mainBlocks.length >= 3) {
            colSpan = 'md:col-span-2 lg:col-span-2';
          } else if (block.visualElementType === 'tabel_perbandingan' || block.visualElementType === 'flowchart' || block.visualElementType === 'timeline') {
            colSpan = 'md:col-span-2 lg:col-span-3';
          } else if (index === mainBlocks.length - 1 && mainBlocks.length % 2 !== 0) {
            colSpan = 'md:col-span-2 lg:col-span-1';
          }

          return (
            <div key={block.id} className={`${colSpan} flex flex-col w-full min-w-0`}>
              {renderBlockCard(block)}
            </div>
          );
        })}
      </div>

      {/* 3. SUMMARY CARDS */}
      {summaryBlocks.map((summaryBlock) => (
        <div key={summaryBlock.id} className="w-full">
          {renderBlockCard(summaryBlock)}
        </div>
      ))}
    </div>
  );
};
