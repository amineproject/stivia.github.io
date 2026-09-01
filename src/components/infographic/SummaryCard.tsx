import React from 'react';
import { MaterialBlock, StyleConfig } from '../../types';
import { STYLE_MODERN_EDUKATIF } from '../../data/styleSystem';

interface SummaryCardProps {
  block: MaterialBlock;
  isHighlighted: boolean;
  onClick: () => void;
  styleConfig?: StyleConfig;
}

interface ParsedConcept {
  concept: string;
  explanation: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  block,
  isHighlighted,
  onClick,
  styleConfig = STYLE_MODERN_EDUKATIF,
}) => {
  const { colorPalette, typography, cards, decoration } = styleConfig;

  // Parse and sanitize key points into structured [Konsep Penting] + [Penjelasan Singkat] (max 3 points)
  const parsedConcepts = React.useMemo<ParsedConcept[]>(() => {
    const rawPoints = block.keyPoints || [];
    
    // Generic banned phrases check
    const isGenericBanned = (text: string) => {
      const lower = text.toLowerCase();
      return (
        lower.includes('pola hubungan antar variabel') ||
        lower.includes('manfaat praktis pengetahuan ini') ||
        lower.includes('lorem ipsum') ||
        lower.includes('pilar kunci yang wajib')
      );
    };

    const validPoints = rawPoints.filter(p => !isGenericBanned(p));

    if (validPoints.length > 0) {
      return validPoints.slice(0, 3).map(item => {
        // Strip leading numbering e.g. "1. ", "A. "
        const cleaned = item.replace(/^(\d+|[a-zA-Z])[\.\)]\s*/, '').trim();
        
        if (cleaned.includes(':')) {
          const parts = cleaned.split(':');
          const concept = parts[0].trim();
          const explanation = parts.slice(1).join(':').trim();
          return { concept, explanation };
        }

        if (cleaned.includes(' - ')) {
          const parts = cleaned.split(' - ');
          const concept = parts[0].trim();
          const explanation = parts.slice(1).join(' - ').trim();
          return { concept, explanation };
        }

        // Fallback: split on first period or sentence
        const firstPeriodIdx = cleaned.indexOf('.');
        if (firstPeriodIdx > 5 && firstPeriodIdx < cleaned.length - 5) {
          return {
            concept: cleaned.slice(0, firstPeriodIdx).trim(),
            explanation: cleaned.slice(firstPeriodIdx + 1).trim()
          };
        }

        return {
          concept: cleaned,
          explanation: ''
        };
      });
    }

    // Fallback grounded in block data if rawPoints were empty or generic
    const fallbackConcept = block.title && block.title !== 'RANGKUMAN KUNCI'
      ? block.title
      : 'Konsep Pokok Materi';

    return [
      {
        concept: fallbackConcept,
        explanation: block.content ? block.content.split('.')[0] + '.' : 'Kuasai definisi pokok dan prinsip fundamental materi.'
      }
    ];
  }, [block.keyPoints, block.title, block.content]);

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
        {/* Section Header */}
        <div className="space-y-1 mb-5 pb-3.5 border-b border-slate-100 min-w-0">
          <h3 className={`${typography.headingScale} ${typography.headingFont} ${typography.headingWeight} ${typography.headingTracking} ${colorPalette.textPrimary} leading-snug tracking-tight break-words whitespace-normal`}>
            RANGKUMAN KUNCI
          </h3>
          <p className={`text-xs sm:text-sm font-semibold ${colorPalette.primaryText} ${typography.lineHeight} break-words whitespace-normal`}>
            Intisari Pembelajaran untuk Evaluasi
          </p>
        </div>

        {/* Structured 1-3 Key Concepts List */}
        <div className="space-y-4 w-full min-w-0">
          {parsedConcepts.map((item, idx) => (
            <div key={idx} className="space-y-1 w-full min-w-0">
              <h4 className={`text-xs sm:text-sm font-bold ${colorPalette.textPrimary} leading-snug break-words whitespace-normal`}>
                {idx + 1}. {item.concept}
              </h4>
              {item.explanation && (
                <p className={`text-xs sm:text-sm ${colorPalette.textSecondary} leading-relaxed pl-4 break-words whitespace-normal`}>
                  {item.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
