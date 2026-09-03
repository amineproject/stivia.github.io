import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Scale, 
  Target, 
  BookOpen, 
  Columns,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const ComparisonLayout: React.FC<LayoutProps> = ({
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
      {/* 1. COMPARISON HEADER */}
      <header className={`relative w-full ${cards.borderRadius} ${colorPalette.headerGradient} ${colorPalette.headerText} p-6 sm:p-7 shadow-sm border border-white/20 overflow-hidden`}>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15 text-xs">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full ${colorPalette.headerBadgeBg} font-bold tracking-wider uppercase flex items-center gap-1.5`}>
                <Scale className="w-3.5 h-3.5" />
                {draft.subject}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 font-semibold border border-white/20">
                {draft.educationLevel} • {draft.grade}
              </span>
            </div>
            <span className="bg-white/10 px-3 py-0.5 rounded-full border border-white/15 text-xs flex items-center gap-1">
              <Columns className="w-3 h-3 text-amber-300" />
              <span>Comparison & Contrast Layout</span>
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
        </div>
      </header>

      {/* 2. SPLIT COMPARISON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
        {mainBlocks.map((block, index) => {
          // If a block is a full comparison table, allow it to span across
          const isComparisonCard = block.visualElementType === 'tabel_perbandingan' || Boolean(block.comparisonData);
          const colSpan = isComparisonCard ? 'md:col-span-2' : 'md:col-span-1';

          return (
            <div key={block.id} className={`${colSpan} flex flex-col w-full min-w-0`}>
              {renderBlockCard(block)}
            </div>
          );
        })}
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
