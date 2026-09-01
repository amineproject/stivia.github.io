import React from 'react';
import { HelpCircle } from 'lucide-react';
import { MaterialBlock, StyleConfig } from '../../types';
import { STYLE_MODERN_EDUKATIF } from '../../data/styleSystem';

interface ComparisonCardProps {
  block: MaterialBlock;
  isHighlighted: boolean;
  onClick: () => void;
  styleConfig?: StyleConfig;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  block,
  isHighlighted,
  onClick,
  styleConfig = STYLE_MODERN_EDUKATIF,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;

  const comparisonData = block.comparisonData || {
    headerA: 'Kategori / Varian A',
    headerB: 'Kategori / Varian B',
    rows: [
      { attribute: 'Ciri Utama', itemA: 'Karakteristik spesifik tipe A', itemB: 'Karakteristik pembeda tipe B' },
      { attribute: 'Mekanisme', itemA: 'Bekerja secara langsung', itemB: 'Memerlukan variabel perantara' },
      { attribute: 'Implementasi', itemA: 'Kasus umum sehari-hari', itemB: 'Kondisi bersyarat tertentu' },
    ]
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
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorPalette.accentBg}`} />
      )}

      <div className="w-full min-w-0">
        {/* Block Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-slate-100 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className={`w-6 h-6 ${icons.containerShape} ${colorPalette.accentBg} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
              {block.letterIndex || block.order}
            </span>
            <span className={`${decoration.badgeStyle} ${colorPalette.accentText} ${colorPalette.accentLight} ${colorPalette.accentBorder} border break-words whitespace-normal`}>
              {block.tag || 'VARIASI & PERBANDINGAN'}
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
            <p className={`text-xs sm:text-sm font-semibold ${colorPalette.accentText} ${typography.lineHeight} break-words whitespace-normal`}>
              {block.subTitle}
            </p>
          )}
        </div>

        <p className={`text-xs sm:text-sm ${colorPalette.textSecondary} ${typography.lineHeight} mb-4 break-words whitespace-normal`}>
          {block.content}
        </p>

        {/* Comparison Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 w-full min-w-0">
          {/* Type A */}
          <div className={`p-3 sm:p-3.5 ${cards.innerRadius} ${colorPalette.accentLight}/60 border ${colorPalette.accentBorder} space-y-1.5 flex flex-col justify-between h-auto min-h-full min-w-0 overflow-hidden`}>
            <div className="flex items-start justify-between gap-2 min-w-0">
              <span className={`text-xs sm:text-sm font-bold ${colorPalette.textPrimary} break-words whitespace-normal flex-1 min-w-0`}>
                {comparisonData.headerA}
              </span>
              <span className={`text-[9px] sm:text-[10px] bg-white px-2 py-0.5 ${cards.innerRadius} font-semibold ${colorPalette.accentText} border ${colorPalette.accentBorder} shrink-0`}>
                Tipe 1
              </span>
            </div>
            <p className={`text-xs ${colorPalette.textSecondary} leading-relaxed break-words whitespace-normal`}>
              {comparisonData.rows[0]?.itemA || 'Fokus pada karakteristik mendasar.'}
            </p>
          </div>

          {/* Type B */}
          <div className={`p-3 sm:p-3.5 ${cards.innerRadius} ${colorPalette.primaryLight}/60 border ${colorPalette.primaryBorder} space-y-1.5 flex flex-col justify-between h-auto min-h-full min-w-0 overflow-hidden`}>
            <div className="flex items-start justify-between gap-2 min-w-0">
              <span className={`text-xs sm:text-sm font-bold ${colorPalette.textPrimary} break-words whitespace-normal flex-1 min-w-0`}>
                {comparisonData.headerB}
              </span>
              <span className={`text-[9px] sm:text-[10px] bg-white px-2 py-0.5 ${cards.innerRadius} font-semibold ${colorPalette.primaryText} border ${colorPalette.primaryBorder} shrink-0`}>
                Tipe 2
              </span>
            </div>
            <p className={`text-xs ${colorPalette.textSecondary} leading-relaxed break-words whitespace-normal`}>
              {comparisonData.rows[0]?.itemB || 'Fokus pada variasi atau kondisi lanjutan.'}
            </p>
          </div>
        </div>

        {/* Structured Comparison Table */}
        <div className={`w-full overflow-hidden ${cards.innerRadius} border border-slate-200 mb-4 bg-white box-border`}>
          <table className="w-full text-left text-xs border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-100/80 text-slate-800 border-b border-slate-200">
                <th className="p-2 sm:p-2.5 font-bold text-[10px] sm:text-[11px] uppercase text-slate-600 w-1/3 break-words whitespace-normal">
                  Kriteria
                </th>
                <th className={`p-2 sm:p-2.5 font-bold text-[10px] sm:text-[11px] ${colorPalette.accentText} ${colorPalette.accentLight}/60 w-1/3 break-words whitespace-normal`}>
                  {comparisonData.headerA}
                </th>
                <th className={`p-2 sm:p-2.5 font-bold text-[10px] sm:text-[11px] ${colorPalette.primaryText} ${colorPalette.primaryLight}/60 w-1/3 break-words whitespace-normal`}>
                  {comparisonData.headerB}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {comparisonData.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-2 sm:p-2.5 font-semibold text-slate-700 bg-slate-50/30 text-[11px] sm:text-xs break-words whitespace-normal align-top">
                    {row.attribute}
                  </td>
                  <td className="p-2 sm:p-2.5 text-slate-600 text-[11px] sm:text-xs leading-relaxed break-words whitespace-normal align-top">
                    {row.itemA}
                  </td>
                  <td className="p-2 sm:p-2.5 text-slate-600 text-[11px] sm:text-xs leading-relaxed break-words whitespace-normal align-top">
                    {row.itemB}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practical Example */}
      {block.example && (
        <div className={`p-3.5 ${cards.innerRadius} ${colorPalette.accentLight} border ${colorPalette.accentBorder} flex items-start gap-2.5 text-xs sm:text-sm ${colorPalette.accentText} mt-4 w-full min-w-0 box-border`}>
          <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
          <div className="leading-relaxed flex-1 min-w-0 break-words whitespace-normal">
            <span className="font-bold">
              {block.exampleTitle || 'Penerapan Praktis'}:{' '}
            </span>
            <span>{block.example}</span>
          </div>
        </div>
      )}
    </div>
  );
};
