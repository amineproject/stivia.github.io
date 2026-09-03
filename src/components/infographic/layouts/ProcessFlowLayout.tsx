import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  GitCommit, 
  Target, 
  BookOpen, 
  ArrowDown, 
  ArrowRight,
  Workflow,
  CheckCircle2
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const ProcessFlowLayout: React.FC<LayoutProps> = ({
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
      {/* 1. PROCESS PIPELINE HEADER */}
      <header className={`relative w-full ${cards.borderRadius} ${colorPalette.headerGradient} ${colorPalette.headerText} p-6 sm:p-7 shadow-sm border border-white/20 overflow-hidden`}>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15 text-xs">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl ${colorPalette.headerBadgeBg} font-bold tracking-wider uppercase flex items-center gap-1.5`}>
                <Workflow className="w-3.5 h-3.5" />
                {draft.subject}
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/20 font-semibold border border-white/20">
                {draft.educationLevel} • {draft.grade}
              </span>
            </div>
            <span className="bg-white/10 px-3 py-0.5 rounded-full border border-white/15 text-xs flex items-center gap-1">
              <GitCommit className="w-3 h-3 text-emerald-300" />
              <span>Process Flow & Pipeline Layout</span>
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 
              style={{ fontFamily: styleConfig.typographyProfile?.headingFontFamilyCss }}
              className={`text-2xl sm:text-3xl ${typography.headingFont} ${typography.headingWeight} tracking-tight leading-snug`}
            >
              {draft.title}
            </h1>
            {draft.subTitle && (
              <p 
                style={{ fontFamily: styleConfig.typographyProfile?.subheadingFontFamilyCss }}
                className={`text-xs sm:text-sm font-medium ${colorPalette.headerSubtext} leading-relaxed`}
              >
                {draft.subTitle}
              </p>
            )}
          </div>

          {/* Flow indicator pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {mainBlocks.map((b, idx) => (
              <React.Fragment key={idx}>
                <span className="px-3 py-1 rounded-lg bg-black/25 text-white text-xs font-semibold">
                  {idx + 1}. {b.title.split(' ')[0]} {b.title.split(' ')[1] || ''}
                </span>
                {idx < mainBlocks.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-white/60 shrink-0 hidden sm:inline-block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      {/* 2. SEQUENTIAL FLOW PIPELINE */}
      <div className="w-full flex flex-col space-y-4">
        {mainBlocks.map((block, index) => (
          <div key={block.id} className="w-full flex flex-col items-center">
            {/* Step Card Container */}
            <div className="w-full">
              {renderBlockCard(block)}
            </div>

            {/* Connecting Flow Arrow between steps */}
            {index < mainBlocks.length - 1 && (
              <div className="flex flex-col items-center justify-center my-2">
                <div className="w-0.5 h-4 bg-slate-300" />
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-600 flex items-center justify-center shadow-xs">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
                <div className="w-0.5 h-4 bg-slate-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. SUMMARY */}
      {summaryBlocks.map((summaryBlock) => (
        <div key={summaryBlock.id} className="w-full">
          {renderBlockCard(summaryBlock)}
        </div>
      ))}
    </div>
  );
};
