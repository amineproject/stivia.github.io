import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Sparkles, 
  Target, 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Layers,
  Award
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const HeroVisualLayout: React.FC<LayoutProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  styleConfig,
  renderBlockCard,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');

  const heroBlock = mainBlocks[0];
  const supportingBlocks = mainBlocks.slice(1);

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* 1. HERO HEADER BANNER */}
      <header className={`relative w-full ${cards.borderRadius} ${colorPalette.headerGradient} ${colorPalette.headerText} p-6 sm:p-8 shadow-md border border-white/20 overflow-hidden`}>
        {/* Subtle decorative pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15 text-xs">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full ${colorPalette.headerBadgeBg} font-bold tracking-wider uppercase backdrop-blur-xs flex items-center gap-1.5`}>
                <BookOpen className="w-3.5 h-3.5" />
                {draft.subject}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 font-semibold border border-white/20">
                {draft.educationLevel} • {draft.grade}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-90">
              <span className="bg-white/10 px-3 py-0.5 rounded-full border border-white/15 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Hero Visual Template</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl ${typography.headingFont} ${typography.headingWeight} tracking-tight leading-tight`}>
              {draft.title}
            </h1>
            {draft.subTitle && (
              <p className={`text-sm sm:text-base font-medium ${colorPalette.headerSubtext} max-w-3xl leading-relaxed`}>
                {draft.subTitle}
              </p>
            )}
          </div>

          {draft.learningObjective && (
            <div className={`p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xs flex items-start gap-3 text-xs sm:text-sm`}>
              <Target className="w-4 h-4 mt-0.5 text-amber-300 shrink-0" />
              <div>
                <span className="font-bold text-white">Tujuan Pembelajaran: </span>
                <span className="text-white/95">{draft.learningObjective}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. HERO VISUAL FOCAL SECTION (DOMINANT VISUAL) */}
      {heroBlock && (
        <section 
          onClick={() => onSelectSection(heroBlock.id)}
          className={`w-full ${cards.borderRadius} ${cards.cardBg} ${cards.borderStyle} p-6 sm:p-7 shadow-sm transition-all duration-200 cursor-pointer ${
            activeSectionId === heroBlock.id ? cards.highlightBorder : cards.shadowStyle
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 ${icons.containerShape} ${colorPalette.primaryBg} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                  {heroBlock.letterIndex || 'A'}
                </span>
                <span className={`${decoration.badgeStyle} ${colorPalette.primaryText} ${colorPalette.primaryLight} ${colorPalette.primaryBorder} border font-bold`}>
                  {heroBlock.tag || 'FOKUS UTAMA MATERI'}
                </span>
                <span className="text-xs text-slate-400 font-medium">Bagian Utama</span>
              </div>

              <h2 className={`text-xl sm:text-2xl ${typography.headingFont} font-extrabold ${colorPalette.textPrimary}`}>
                {heroBlock.title}
              </h2>

              {heroBlock.subTitle && (
                <p className={`text-sm font-semibold ${colorPalette.primaryText}`}>
                  {heroBlock.subTitle}
                </p>
              )}

              <p className={`text-sm ${colorPalette.textSecondary} leading-relaxed`}>
                {heroBlock.content}
              </p>

              {heroBlock.keyPoints && heroBlock.keyPoints.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {heroBlock.keyPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${colorPalette.primaryText} mt-0.5 shrink-0`} />
                      <span className="text-slate-700 font-medium">{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Concept Diagram / Hero Visual Showcase */}
            {heroBlock.conceptDiagram && (
              <div className={`lg:w-80 w-full p-4 rounded-2xl ${colorPalette.primaryLight}/50 border ${colorPalette.primaryBorder} flex flex-col justify-center items-center gap-3 shrink-0`}>
                <span className="text-[11px] font-bold tracking-wide uppercase text-slate-600">Skema Inti Konsep</span>
                <div className={`w-full p-3 rounded-xl ${colorPalette.primaryBg} text-white font-bold text-center text-xs shadow-sm`}>
                  {heroBlock.conceptDiagram.itemAName}
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-indigo-700 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-2xs">
                  <ArrowRight className="w-3 h-3" />
                  <span>{heroBlock.conceptDiagram.connectorLabel}</span>
                </div>
                <div className={`w-full p-3 rounded-xl ${colorPalette.secondaryBg} text-white font-bold text-center text-xs shadow-sm`}>
                  {heroBlock.conceptDiagram.itemBName}
                </div>
                <p className="text-[10px] text-center text-slate-500 italic mt-1">
                  {heroBlock.conceptDiagram.connectorSub}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. SUPPORTING MATERIAL BLOCKS GRID */}
      {supportingBlocks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
          {supportingBlocks.map((block) => (
            <div key={block.id} className="w-full flex flex-col">
              {renderBlockCard(block)}
            </div>
          ))}
        </div>
      )}

      {/* 4. SUMMARY / EVALUATION SECTION */}
      {summaryBlocks.map((summaryBlock) => (
        <div key={summaryBlock.id} className="w-full">
          {renderBlockCard(summaryBlock)}
        </div>
      ))}
    </div>
  );
};
