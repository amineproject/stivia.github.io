import React from 'react';
import { GitBranch, CheckCircle2 } from 'lucide-react';
import { MaterialBlock, StyleConfig } from '../../types';
import { STYLE_MODERN_EDUKATIF } from '../../data/styleSystem';

interface ProcessFlowCardProps {
  block: MaterialBlock;
  isHighlighted: boolean;
  onClick: () => void;
  styleConfig?: StyleConfig;
}

export const ProcessFlowCard: React.FC<ProcessFlowCardProps> = ({
  block,
  isHighlighted,
  onClick,
  styleConfig = STYLE_MODERN_EDUKATIF,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;

  const steps = block.processSteps && block.processSteps.length > 0 
    ? block.processSteps 
    : [
        { stepNumber: 1, title: 'Identifikasi Awal', description: 'Pahami kondisi awal dan variabel yang diketahui.', badgeText: 'Tahap 1' },
        { stepNumber: 2, title: 'Analisis Hubungan', description: 'Telusuri kaitan logis antar komponen materi.', badgeText: 'Tahap 2' },
        { stepNumber: 3, title: 'Eksekusi Aturan', description: 'Terapkan prinsip atau rumus yang berlaku.', badgeText: 'Tahap 3' },
        { stepNumber: 4, title: 'Validasi Hasil', description: 'Evaluasi ketercapaian solusi dan kesimpulan.', badgeText: 'Tahap 4' },
      ];

  const getGridCols = (count: number) => {
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
              {block.tag || 'ALUR & PROSES'}
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
            <p className={`text-xs sm:text-sm font-semibold ${colorPalette.primaryText} ${typography.lineHeight} break-words whitespace-normal`}>
              {block.subTitle}
            </p>
          )}
        </div>

        <p className={`text-xs sm:text-sm ${colorPalette.textSecondary} ${typography.lineHeight} mb-4 break-words whitespace-normal`}>
          {block.content}
        </p>

        {/* Process Flow Step Grid */}
        <div className={`grid ${getGridCols(steps.length)} gap-2.5 mb-4 w-full min-w-0`}>
          {steps.map((step) => (
            <div 
              key={step.stepNumber}
              className={`p-3 ${cards.innerRadius} ${colorPalette.primaryLight}/50 border ${colorPalette.primaryBorder} flex flex-col justify-between h-auto min-h-full min-w-0 box-border`}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-1.5 mb-1 min-w-0 flex-wrap">
                  <span className={`w-5 h-5 rounded-full ${colorPalette.primaryBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                    {step.stepNumber}
                  </span>
                  {step.badgeText && (
                    <span className={`text-[9px] sm:text-[10px] font-semibold ${colorPalette.primaryText} bg-white px-2 py-0.5 ${cards.innerRadius} border ${colorPalette.primaryBorder} break-words whitespace-normal`}>
                      {step.badgeText}
                    </span>
                  )}
                </div>
                <h4 className={`text-xs sm:text-sm font-bold ${colorPalette.textPrimary} leading-snug break-words whitespace-normal`}>
                  {step.title}
                </h4>
                <p className={`text-xs ${colorPalette.textSecondary} leading-relaxed break-words whitespace-normal`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bulleted Points */}
        {block.keyPoints && block.keyPoints.length > 0 && (
          <div className={`space-y-2 mb-4 p-3.5 ${cards.innerRadius} bg-slate-50 border border-slate-200/60 w-full min-w-0`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Panduan Analisis Alur:
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

      {/* Example Box */}
      {block.example && (
        <div className={`p-3.5 ${cards.innerRadius} ${colorPalette.primaryLight} border ${colorPalette.primaryBorder} flex items-start gap-2.5 text-xs sm:text-sm ${colorPalette.primaryText} mt-4 w-full min-w-0 box-border`}>
          <GitBranch className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
          <div className="leading-relaxed flex-1 min-w-0 break-words whitespace-normal">
            <span className="font-bold">
              {block.exampleTitle || 'Alur Kerja Kasus'}:{' '}
            </span>
            <span>{block.example}</span>
          </div>
        </div>
      )}
    </div>
  );
};
