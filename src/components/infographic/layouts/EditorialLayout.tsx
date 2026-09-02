import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Newspaper, 
  Target, 
  BookOpen, 
  Quote, 
  Bookmark,
  Calendar,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const EditorialLayout: React.FC<LayoutProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  styleConfig,
  renderBlockCard,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');

  const leadBlock = mainBlocks[0];
  const otherBlocks = mainBlocks.slice(1);

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* 1. EDITORIAL MASTHEAD HEADER */}
      <header className="w-full bg-white border-b-2 border-stone-800 pb-5 pt-2 px-2 text-stone-900 space-y-3">
        {/* Top Masthead Info Bar */}
        <div className="flex items-center justify-between border-b border-stone-300 pb-2 text-[11px] font-serif uppercase tracking-widest text-stone-600">
          <span>STIVIA EDUCATIONAL REVIEW</span>
          <span className="font-bold">{draft.subject} • KELAS {draft.grade}</span>
          <span>EDISI KURIKULUM MERDEKA</span>
        </div>

        {/* Big Editorial Headline */}
        <div className="text-center py-2 space-y-2">
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-stone-900 leading-tight">
            {draft.title}
          </h1>
          {draft.subTitle && (
            <p className="text-sm sm:text-base font-serif italic text-stone-600 max-w-2xl mx-auto">
              "{draft.subTitle}"
            </p>
          )}
        </div>

        {/* Double rule divider */}
        <div className="border-t-2 border-stone-800 border-b border-stone-300 py-1" />
      </header>

      {/* 2. EDITORIAL LEAD SECTION */}
      {leadBlock && (
        <section
          onClick={() => onSelectSection(leadBlock.id)}
          className={`w-full bg-stone-50 border border-stone-300 p-6 sm:p-7 rounded-lg shadow-xs transition-all duration-200 cursor-pointer ${
            activeSectionId === leadBlock.id ? 'ring-2 ring-stone-900 border-stone-900' : 'hover:border-stone-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-md bg-stone-900 text-white font-serif font-bold text-xs flex items-center justify-center">
              §1
            </span>
            <span className="text-[11px] font-bold font-serif uppercase tracking-wider text-stone-700 bg-stone-200/80 px-2.5 py-0.5 rounded">
              {leadBlock.tag || 'EDITORIAL PENGANTAR'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-2">
            {leadBlock.title}
          </h2>

          <p className="text-sm sm:text-base font-serif leading-relaxed text-stone-700 mb-4">
            <span className="text-3xl float-left font-serif font-bold mr-2 leading-none text-stone-900">
              {leadBlock.content.charAt(0)}
            </span>
            {leadBlock.content.slice(1)}
          </p>

          {leadBlock.keyPoints && leadBlock.keyPoints.length > 0 && (
            <div className="border-t border-stone-200 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif text-stone-800">
              {leadBlock.keyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="font-bold text-stone-900">•</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. COLUMNS JOURNAL SPREAD */}
      {otherBlocks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
          {otherBlocks.map((block) => (
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
