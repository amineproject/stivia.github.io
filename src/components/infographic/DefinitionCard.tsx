import React from 'react';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { MaterialBlock, StyleConfig } from '../../types';
import { STYLE_MODERN_EDUKATIF } from '../../data/styleSystem';

interface DefinitionCardProps {
  block: MaterialBlock;
  isHighlighted: boolean;
  onClick: () => void;
  styleConfig?: StyleConfig;
}

export const DefinitionCard: React.FC<DefinitionCardProps> = ({
  block,
  isHighlighted,
  onClick,
  styleConfig = STYLE_MODERN_EDUKATIF,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;

  return (
    <div
      onClick={onClick}
      className={`${cards.borderRadius} ${cards.padding} transition-all duration-150 cursor-pointer ${cards.borderStyle} ${cards.cardBg} flex flex-col justify-between h-auto min-h-full w-full box-border relative overflow-hidden ${
        isHighlighted
          ? cards.highlightBorder
          : cards.shadowStyle
      }`}
    >
      {/* Optional Top Accent Bar for structured/professional styles */}
      {decoration.showAccentBar && (
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorPalette.primaryBg}`} />
      )}

      <div className="w-full min-w-0">
        {/* Block Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-slate-100 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className={`w-6 h-6 ${icons.containerShape} ${colorPalette.primaryBg} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
              {block.letterIndex || block.order}
            </span>
            <span className={`${decoration.badgeStyle} ${colorPalette.primaryText} ${colorPalette.primaryLight} ${colorPalette.primaryBorder} border break-words whitespace-normal`}>
              {block.tag || 'DEFINISI & KONSEP DASAR'}
            </span>
          </div>
          <span className={`text-[11px] font-medium ${colorPalette.textMuted} shrink-0`}>
            Bagian {block.order}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1 mb-3 w-full min-w-0">
          <h3 
            style={{ fontFamily: styleConfig.typographyProfile?.headingFontFamilyCss }}
            className={`${typography.headingScale} ${typography.headingFont} ${typography.headingWeight} ${typography.headingTracking} ${colorPalette.textPrimary} leading-snug break-words whitespace-normal`}
          >
            {block.title}
          </h3>
          {block.subTitle && (
            <p 
              style={{ fontFamily: styleConfig.typographyProfile?.subheadingFontFamilyCss }}
              className={`text-xs sm:text-sm font-semibold ${colorPalette.primaryText} ${typography.lineHeight} break-words whitespace-normal`}
            >
              {block.subTitle}
            </p>
          )}
        </div>

        {/* Primary Explanation */}
        <p className={`text-xs sm:text-sm ${colorPalette.textSecondary} ${typography.lineHeight} mb-4 break-words whitespace-normal`}>
          {block.content}
        </p>

        {/* Dynamic Concept Diagram with full responsive wrapping */}
        <div className={`mb-4 p-3 sm:p-3.5 ${cards.innerRadius} ${colorPalette.primaryLight}/40 border ${colorPalette.primaryBorder} w-full min-w-0 box-border overflow-hidden`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-2.5 text-center w-full min-w-0">
            {/* Element A */}
            <div className="flex flex-col items-center gap-1 w-full sm:flex-1 min-w-0">
              <div className={`w-full px-2.5 py-1.5 ${cards.innerRadius} ${colorPalette.primaryBg} text-white font-bold text-xs flex items-center justify-center shadow-xs text-center break-words`}>
                {block.conceptDiagram?.itemAName || 'Elemen Pokok'}
              </div>
              <span className={`text-[10px] sm:text-[11px] font-semibold ${colorPalette.textSecondary} leading-tight break-words`}>
                {block.conceptDiagram?.itemARole || 'Gagasan Utama'}
              </span>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center justify-center w-full sm:flex-1 min-w-0 px-1 py-1 sm:py-0">
              <span className={`text-[9px] sm:text-[10px] font-bold ${colorPalette.primaryText} bg-white px-2 py-0.5 rounded-full border ${colorPalette.primaryBorder} shadow-2xs mb-0.5 text-center break-words`}>
                {block.conceptDiagram?.connectorLabel || 'Relasi / Interaksi'}
              </span>
              <div className={`w-full h-1 ${colorPalette.primaryBg} opacity-30 rounded-full my-0.5`} />
              <span className={`text-[9px] sm:text-[10px] ${colorPalette.textMuted} text-center break-words`}>
                {block.conceptDiagram?.connectorSub || 'Proses Terhubung'}
              </span>
            </div>

            {/* Element B */}
            <div className="flex flex-col items-center gap-1 w-full sm:flex-1 min-w-0">
              <div className={`w-full px-2.5 py-1.5 ${cards.innerRadius} ${colorPalette.secondaryBg} text-white font-bold text-xs flex items-center justify-center shadow-xs text-center break-words`}>
                {block.conceptDiagram?.itemBName || 'Target Solusi'}
              </div>
              <span className={`text-[10px] sm:text-[11px] font-semibold ${colorPalette.textSecondary} leading-tight break-words`}>
                {block.conceptDiagram?.itemBRole || 'Target Hasil'}
              </span>
            </div>
          </div>
        </div>

        {/* Bulleted Key Points */}
        {block.keyPoints && block.keyPoints.length > 0 && (
          <div className={`space-y-2 mb-4 p-3.5 ${cards.innerRadius} bg-slate-50 border border-slate-200/60 w-full min-w-0`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Karakteristik Utama:
            </p>
            <div className="space-y-2">
              {block.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 min-w-0">
                  <CheckCircle2 className={`w-4 h-4 ${colorPalette.primaryText} shrink-0 mt-0.5`} />
                  <span className="leading-relaxed break-words whitespace-normal flex-1 min-w-0">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real-world Context */}
      {block.example && (
        <div className={`p-3.5 ${cards.innerRadius} ${colorPalette.accentLight} border ${colorPalette.accentBorder} flex items-start gap-2.5 text-xs sm:text-sm ${colorPalette.accentText} mt-4 w-full min-w-0 box-border`}>
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
          <div className="leading-relaxed flex-1 min-w-0 break-words whitespace-normal">
            <span className="font-bold">
              {block.exampleTitle || 'Konteks Penerapan'}:{' '}
            </span>
            <span>{block.example}</span>
          </div>
        </div>
      )}
    </div>
  );
};


