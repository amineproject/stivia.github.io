import React from 'react';
import { CircleDot, ArrowRightLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { MaterialBlock, StyleConfig } from '../../types';
import { STYLE_MODERN_EDUKATIF } from '../../data/styleSystem';

interface ComponentsCardProps {
  block: MaterialBlock;
  isHighlighted: boolean;
  onClick: () => void;
  styleConfig?: StyleConfig;
}

export const ComponentsCard: React.FC<ComponentsCardProps> = ({
  block,
  isHighlighted,
  onClick,
  styleConfig = STYLE_MODERN_EDUKATIF,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;

  const components = block.componentsList && block.componentsList.length > 0
    ? block.componentsList
    : [
        {
          title: 'Komponen Utama',
          description: 'Elemen primer yang membangun karakteristik sistem materi.',
          badge: 'Peran Pokok',
          iconName: 'CircleDot'
        },
        {
          title: 'Komponen Pendukung',
          description: 'Elemen relasional atau pendukung keterpaduan fungsi.',
          badge: 'Interaksi & Relasi',
          iconName: 'ArrowRightLeft'
        }
      ];

  const getGridColsClass = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    return 'grid-cols-1 sm:grid-cols-2';
  };

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
              {block.tag || 'ANATOMI & KOMPONEN'}
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

        {/* Dynamic Component Cards Grid */}
        <div className={`grid ${getGridColsClass(components.length)} gap-3 mb-4 w-full min-w-0`}>
          {components.map((comp, idx) => {
            const isEven = idx % 2 === 0;
            const bgClass = isEven ? `${colorPalette.secondaryLight} ${colorPalette.secondaryBorder}` : `${colorPalette.primaryLight} ${colorPalette.primaryBorder}`;
            const iconBg = isEven ? colorPalette.secondaryBg : colorPalette.primaryBg;
            const textTitleColor = colorPalette.textPrimary;
            const badgeTextColor = isEven ? colorPalette.secondaryText : colorPalette.primaryText;

            return (
              <div
                key={idx}
                className={`p-3.5 sm:p-4 ${cards.innerRadius} border ${bgClass} space-y-2 flex flex-col justify-between h-auto min-h-full min-w-0 box-border`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-start gap-2 mb-1 min-w-0">
                    <div className={`w-6 h-6 ${icons.containerShape} ${iconBg} text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5`}>
                      {idx === 0 ? <CircleDot className="w-3.5 h-3.5" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
                    </div>
                    <h4 className={`text-xs sm:text-sm font-bold ${textTitleColor} leading-snug break-words whitespace-normal flex-1 min-w-0`}>
                      {comp.title}
                    </h4>
                  </div>
                  <p className={`text-xs ${colorPalette.textSecondary} leading-relaxed break-words whitespace-normal`}>
                    {comp.description}
                  </p>
                </div>

                {(comp.badge || comp.features) && (
                  <div className={`text-[10px] sm:text-[11px] font-medium ${badgeTextColor} bg-white/95 px-2.5 py-1 ${cards.innerRadius} border border-slate-200/70 mt-2 break-words whitespace-normal`}>
                    {comp.badge || (comp.features ? comp.features.join(', ') : '')}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bulleted Points */}
        {block.keyPoints && block.keyPoints.length > 0 && (
          <div className={`space-y-2 mb-4 p-3.5 ${cards.innerRadius} bg-slate-50 border border-slate-200/60 w-full min-w-0`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Penjelasan Teknis Komponen:
            </p>
            <div className="space-y-2">
              {block.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 min-w-0">
                  <CheckCircle2 className={`w-4 h-4 ${colorPalette.secondaryText} shrink-0 mt-0.5`} />
                  <span className="leading-relaxed break-words whitespace-normal flex-1 min-w-0">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real-world Analogy */}
      {block.example && (
        <div className={`p-3.5 ${cards.innerRadius} ${colorPalette.secondaryLight} border ${colorPalette.secondaryBorder} flex items-start gap-2.5 text-xs sm:text-sm ${colorPalette.secondaryText} mt-4 w-full min-w-0 box-border`}>
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
          <div className="leading-relaxed flex-1 min-w-0 break-words whitespace-normal">
            <span className="font-bold">
              {block.exampleTitle || 'Analogi Komponen'}:{' '}
            </span>
            <span>{block.example}</span>
          </div>
        </div>
      )}
    </div>
  );
};
