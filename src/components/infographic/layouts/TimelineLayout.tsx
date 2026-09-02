import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Calendar, 
  Target, 
  BookOpen, 
  Clock, 
  Milestone,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const TimelineLayout: React.FC<LayoutProps> = ({
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
      {/* 1. TIMELINE HEADER */}
      <header className={`relative w-full ${cards.borderRadius} ${colorPalette.headerGradient} ${colorPalette.headerText} p-6 sm:p-7 shadow-sm border border-white/20 overflow-hidden`}>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15 text-xs">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full ${colorPalette.headerBadgeBg} font-bold tracking-wider uppercase flex items-center gap-1.5`}>
                <Calendar className="w-3.5 h-3.5" />
                {draft.subject}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 font-semibold border border-white/20">
                {draft.educationLevel} • {draft.grade}
              </span>
            </div>
            <span className="bg-white/10 px-3 py-0.5 rounded-full border border-white/15 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>Timeline & Chronology Layout</span>
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
              <Target className="w-4 h-4 mt-0.5 text-amber-300 shrink-0" />
              <div>
                <span className="font-bold">Target Pemahaman Kronologis: </span>
                <span className="opacity-95">{draft.learningObjective}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. CHRONOLOGICAL TIMELINE SPINE */}
      <div className="relative w-full pl-6 sm:pl-10 space-y-8">
        {/* Continuous Spine Rail Line */}
        <div className="absolute top-4 bottom-4 left-3 sm:left-5 w-1 bg-gradient-to-b from-indigo-500 via-teal-400 to-indigo-600 rounded-full opacity-60" />

        {mainBlocks.map((block, index) => {
          const isHighlighted = activeSectionId === block.id;
          return (
            <div key={block.id} className="relative w-full">
              {/* Milestone Node on Spine */}
              <div 
                className={`absolute -left-6 sm:-left-10 top-6 w-7 h-7 sm:w-8 sm:h-8 rounded-full ${
                  isHighlighted ? 'bg-indigo-600 text-white ring-4 ring-indigo-200' : `${colorPalette.primaryBg} text-white`
                } font-bold text-xs sm:text-sm flex items-center justify-center shadow-md z-10`}
              >
                {index + 1}
              </div>

              {/* Milestone Card Content */}
              <div className="w-full">
                {renderBlockCard(block)}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. SUMMARY */}
      {summaryBlocks.map((summaryBlock) => (
        <div key={summaryBlock.id} className="w-full pt-2">
          {renderBlockCard(summaryBlock)}
        </div>
      ))}
    </div>
  );
};
