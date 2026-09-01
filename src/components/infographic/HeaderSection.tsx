import React from 'react';
import { BookOpen, Target, Sparkles, Clock } from 'lucide-react';
import { InfographicDraft, StyleConfig } from '../../types';
import { getStyleConfig } from '../../data/styleSystem';

interface HeaderSectionProps {
  draft: InfographicDraft;
  visualStyle?: string;
  styleConfig?: StyleConfig;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  draft, 
  visualStyle,
  styleConfig: propStyleConfig 
}) => {
  const styleConfig = propStyleConfig || draft.styleConfig || getStyleConfig(visualStyle || draft.visualStyle, draft.customVisualStyle);
  const { colorPalette, typography, cards } = styleConfig;

  return (
    <header className={`relative w-full ${cards.borderRadius} border border-white/20 shadow-sm ${colorPalette.headerGradient} ${colorPalette.headerText} box-border overflow-hidden`}>
      {/* Subtle Pattern Texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-6 space-y-4 w-full box-border">
        {/* Top Badges / Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/10 text-xs">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${colorPalette.headerBadgeBg} text-xs font-bold tracking-wide uppercase backdrop-blur-xs break-words`}>
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="break-words">{draft.subject}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/20 text-xs font-semibold border border-white/20 break-words">
              {draft.educationLevel} • {draft.grade}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs opacity-90">
            {draft.duration && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{draft.duration}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>Media Pembelajaran</span>
            </span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-1.5 w-full min-w-0">
          <h1 className={`text-xl sm:text-2xl lg:text-3xl ${typography.headingFont} ${typography.headingWeight} ${typography.headingTracking} leading-snug break-words whitespace-normal`}>
            {draft.title || 'INFOGRAFIS PEMBELAJARAN'}
          </h1>
          {draft.subTitle && (
            <p className={`text-xs sm:text-sm font-medium ${colorPalette.headerSubtext} leading-relaxed break-words whitespace-normal`}>
              {draft.subTitle}
            </p>
          )}
        </div>

        {/* Learning Objective Callout */}
        {draft.learningObjective && (
          <div className={`p-3.5 sm:p-4 ${cards.innerRadius} bg-white/10 border border-white/15 flex items-start gap-3 text-xs sm:text-sm leading-relaxed w-full min-w-0 box-border backdrop-blur-2xs`}>
            <Target className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
            <div className="flex-1 min-w-0 break-words whitespace-normal">
              <span className="font-bold">Tujuan Pembelajaran: </span>
              <span className="opacity-95">{draft.learningObjective}</span>
            </div>
          </div>
        )}

        {/* Fast Concept Highlights Bar */}
        {draft.conceptHighlights && draft.conceptHighlights.length > 0 && (
          <div className="pt-1 flex flex-wrap gap-2 w-full">
            {draft.conceptHighlights.map((highlight, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium bg-black/20 text-white px-3 py-1 rounded-lg border border-white/10 break-words"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                <span className="break-words whitespace-normal">{highlight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};


