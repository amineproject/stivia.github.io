import React from 'react';
import { Sparkles, BarChart2, ShieldCheck } from 'lucide-react';
import { MaterialBlock, StyleConfig } from '../../types';
import { STYLE_MODERN_EDUKATIF } from '../../data/styleSystem';

interface NetworkConceptCardProps {
  block: MaterialBlock;
  isHighlighted: boolean;
  onClick: () => void;
  styleConfig?: StyleConfig;
}

export const NetworkConceptCard: React.FC<NetworkConceptCardProps> = ({
  block,
  isHighlighted,
  onClick,
  styleConfig = STYLE_MODERN_EDUKATIF,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;

  const pillars = block.applicationPillars || [
    { title: 'Aplikasi 1', subtitle: 'Penerapan Praktis', colorScheme: 'emerald' },
    { title: 'Aplikasi 2', subtitle: 'Konteks Belajar', colorScheme: 'indigo' },
    { title: 'Aplikasi 3', subtitle: 'Lingkungan Nyata', colorScheme: 'teal' },
    { title: 'Aplikasi 4', subtitle: 'Dampak Positif', colorScheme: 'amber' },
  ];

  const metrics = block.statMetrics || [
    { label: 'Efektivitas Penerapan', value: 'Tinggi', percentage: 95, description: 'Meningkatkan pemahaman konsep' },
    { label: 'Relevansi Pembelajaran', value: 'Kontekstual', percentage: 90, description: 'Dapat diamati di sekitar kita' },
    { label: 'Ketercapaian Kompetensi', value: 'Optimal', percentage: 88, description: 'Sesuai indikator asesmen' },
  ];

  return (
    <div
      onClick={onClick}
      className={`${cards.borderRadius} ${cards.padding} transition-all duration-150 cursor-pointer ${cards.borderStyle} ${cards.cardBg} flex flex-col justify-between h-auto min-h-full w-full box-border relative overflow-hidden ${
        isHighlighted
          ? cards.highlightBorder
          : cards.shadowStyle
      }`}
    >
      {decoration.showAccentBar && (
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorPalette.secondaryBg}`} />
      )}

      <div className="w-full min-w-0">
        {/* Block Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-slate-100 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className={`w-6 h-6 ${icons.containerShape} ${colorPalette.secondaryBg} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
              {block.letterIndex || block.order}
            </span>
            <span className={`${decoration.badgeStyle} ${colorPalette.secondaryText} ${colorPalette.secondaryLight} ${colorPalette.secondaryBorder} border break-words whitespace-normal`}>
              {block.tag || 'PENERAPAN NYATA'}
            </span>
          </div>
          <span className={`text-[11px] font-medium ${colorPalette.textMuted} shrink-0`}>
            Bagian {block.order}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1 mb-3 w-full min-w-0">
          <h3 className={`${typography.headingScale} ${typography.headingFont} ${typography.headingWeight} ${typography.headingTracking} ${colorPalette.textPrimary} leading-snug break-words whitespace-normal`}>
            {block.title}
          </h3>
          {block.subTitle && (
            <p className={`text-xs sm:text-sm font-semibold ${colorPalette.secondaryText} ${typography.lineHeight} break-words whitespace-normal`}>
              {block.subTitle}
            </p>
          )}
        </div>

        <p className={`text-xs sm:text-sm ${colorPalette.textSecondary} ${typography.lineHeight} mb-4 break-words whitespace-normal`}>
          {block.content}
        </p>

        {/* Dynamic Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 w-full min-w-0">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className={`p-3 ${cards.innerRadius} border text-center flex flex-col justify-between h-auto min-h-full min-w-0 box-border overflow-hidden ${
                idx % 2 === 0
                  ? `${colorPalette.secondaryLight}/60 ${colorPalette.secondaryBorder}`
                  : `${colorPalette.primaryLight}/60 ${colorPalette.primaryBorder}`
              }`}
            >
              <div className="space-y-1.5 min-w-0">
                <div
                  className={`w-7 h-7 mx-auto ${icons.containerShape} text-white flex items-center justify-center mb-1 shrink-0 ${
                    idx % 2 === 0 ? colorPalette.secondaryBg : colorPalette.primaryBg
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className={`text-xs font-bold ${colorPalette.textPrimary} leading-snug break-words whitespace-normal`}>
                  {pillar.title}
                </p>
                <p className={`text-[11px] ${colorPalette.textSecondary} leading-relaxed break-words whitespace-normal`}>
                  {pillar.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quantitative Impact / Stat Metrics */}
        <div className={`p-3.5 ${cards.innerRadius} ${colorPalette.secondaryLight}/50 border ${colorPalette.secondaryBorder} mb-4 space-y-2 w-full min-w-0 box-border overflow-hidden`}>
          <div className={`flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${colorPalette.secondaryText}`}>
            <span className="flex items-center gap-1.5">
              <BarChart2 className={`w-3.5 h-3.5 ${colorPalette.secondaryText} shrink-0`} />
              Manfaat & Dampak Nyata
            </span>
            <span className={`${colorPalette.textMuted} font-normal`}>Relevansi Materi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full min-w-0">
            {metrics.map((metric, i) => (
              <div key={i} className={`bg-white p-2.5 ${cards.innerRadius} border ${colorPalette.secondaryBorder}/60 flex flex-col justify-between min-w-0 box-border overflow-hidden`}>
                <div className="flex items-baseline justify-between mb-1 min-w-0 gap-1">
                  <span className={`text-xs sm:text-sm font-bold ${colorPalette.secondaryText} break-words whitespace-normal`}>{metric.value}</span>
                  {metric.percentage && (
                    <span className={`text-[9px] sm:text-[10px] font-bold ${colorPalette.secondaryText} ${colorPalette.secondaryLight} px-1.5 py-0.5 ${cards.innerRadius} border ${colorPalette.secondaryBorder} shrink-0`}>
                      {metric.percentage}%
                    </span>
                  )}
                </div>
                <p className={`text-xs font-bold ${colorPalette.textPrimary} leading-tight break-words whitespace-normal line-clamp-2`}>{metric.label}</p>
                <p className={`text-[10px] sm:text-[11px] ${colorPalette.textMuted} leading-relaxed mt-0.5 break-words whitespace-normal line-clamp-2`}>{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real Example */}
      {block.example && (
        <div className={`p-3.5 ${cards.innerRadius} ${colorPalette.secondaryLight} border ${colorPalette.secondaryBorder} flex items-start gap-2.5 text-xs sm:text-sm ${colorPalette.secondaryText} mt-4 w-full min-w-0 box-border`}>
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
          <div className="leading-relaxed flex-1 min-w-0 break-words whitespace-normal">
            <span className="font-bold">
              {block.exampleTitle || 'Kasus Nyata'}:{' '}
            </span>
            <span>{block.example}</span>
          </div>
        </div>
      )}
    </div>
  );
};
