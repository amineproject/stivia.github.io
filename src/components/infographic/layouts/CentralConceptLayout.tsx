import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Network, 
  Target, 
  BookOpen, 
  Share2, 
  ArrowRight,
  GitFork,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const CentralConceptLayout: React.FC<LayoutProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  styleConfig,
  renderBlockCard,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');

  const centralBlock = mainBlocks[0];
  const satelliteBlocks = mainBlocks.slice(1);

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* 1. CENTRAL CONCEPT HEADER */}
      <header className={`relative w-full ${cards.borderRadius} ${colorPalette.headerGradient} ${colorPalette.headerText} p-6 sm:p-7 shadow-sm border border-white/20 overflow-hidden text-center`}>
        <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold uppercase tracking-wider">
            <Network className="w-3.5 h-3.5 text-amber-300" />
            <span>Central Concept & System Network</span>
          </div>

          <h1 className={`text-2xl sm:text-3xl ${typography.headingFont} ${typography.headingWeight} tracking-tight leading-tight`}>
            {draft.title}
          </h1>

          {draft.subTitle && (
            <p className={`text-xs sm:text-sm font-medium ${colorPalette.headerSubtext} leading-relaxed`}>
              {draft.subTitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="px-3 py-1 rounded-lg bg-black/20 text-white font-semibold">
              {draft.subject} • {draft.educationLevel} {draft.grade}
            </span>
          </div>
        </div>
      </header>

      {/* 2. CENTRAL CORE NODE */}
      {centralBlock && (
        <div className="w-full flex flex-col items-center">
          <div 
            onClick={() => onSelectSection(centralBlock.id)}
            className={`w-full max-w-3xl ${cards.borderRadius} ${cards.cardBg} ${cards.borderStyle} p-6 sm:p-7 shadow-md transition-all duration-200 cursor-pointer relative ${
              activeSectionId === centralBlock.id ? cards.highlightBorder : cards.shadowStyle
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 ${icons.containerShape} ${colorPalette.primaryBg} text-white font-black flex items-center justify-center text-sm shadow-xs`}>
                  ★
                </div>
                <div>
                  <span className={`${decoration.badgeStyle} ${colorPalette.primaryText} ${colorPalette.primaryLight} ${colorPalette.primaryBorder} border font-bold`}>
                    KONSEP SENTRAL (PUSAT)
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Node Inti</span>
            </div>

            <h2 className={`text-xl sm:text-2xl ${typography.headingFont} font-extrabold ${colorPalette.textPrimary} mb-2`}>
              {centralBlock.title}
            </h2>

            <p className={`text-sm ${colorPalette.textSecondary} leading-relaxed mb-4`}>
              {centralBlock.content}
            </p>

            {/* Central hub branches connector indicators */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-around gap-2 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Share2 className={`w-3.5 h-3.5 ${colorPalette.primaryText}`} />
                <span>Koneksi Cabang Konsep:</span>
              </span>
              {satelliteBlocks.map((b, idx) => (
                <span key={idx} className={`px-2.5 py-0.5 rounded-md ${colorPalette.primaryLight} ${colorPalette.primaryText} font-semibold text-[11px] border ${colorPalette.primaryBorder}`}>
                  {idx + 1}. {b.title.split(' ')[0]} {b.title.split(' ')[1] || ''}
                </span>
              ))}
            </div>
          </div>

          {/* Visual Connector Line Down */}
          <div className="w-1 h-6 bg-indigo-300 opacity-60 my-1 rounded-full" />
        </div>
      )}

      {/* 3. SATELLITE BLOCKS GRID */}
      {satelliteBlocks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
          {satelliteBlocks.map((block) => (
            <div key={block.id} className="w-full flex flex-col">
              {renderBlockCard(block)}
            </div>
          ))}
        </div>
      )}

      {/* 4. SUMMARY */}
      {summaryBlocks.map((summaryBlock) => (
        <div key={summaryBlock.id} className="w-full">
          {renderBlockCard(summaryBlock)}
        </div>
      ))}
    </div>
  );
};
