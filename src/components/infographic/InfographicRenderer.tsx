import React from 'react';
import { HeaderSection } from './HeaderSection';
import { DefinitionCard } from './DefinitionCard';
import { ComponentsCard } from './ComponentsCard';
import { ComparisonCard } from './ComparisonCard';
import { ProcessFlowCard } from './ProcessFlowCard';
import { NetworkConceptCard } from './NetworkConceptCard';
import { SummaryCard } from './SummaryCard';
import { InfographicDraft, MaterialBlock } from '../../types';
import { GraduationCap, BookOpen } from 'lucide-react';
import { getStyleConfig } from '../../data/styleSystem';

interface InfographicRendererProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  visualStyle: string;
  format: 'portrait' | 'square' | 'landscape';
  visualLevel: 'sederhana' | 'seimbang' | 'visual_dominan';
}

export const InfographicRenderer: React.FC<InfographicRendererProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  visualStyle,
  format,
}) => {
  // Resolve the visual style tokens from the system
  const styleConfig = React.useMemo(() => {
    return getStyleConfig(visualStyle || draft.visualStyle, draft.customVisualStyle);
  }, [visualStyle, draft.visualStyle, draft.customVisualStyle]);

  const { colorPalette, composition, cards } = styleConfig;

  // Render appropriate block component based on type and content with styleConfig injected
  const renderBlock = (block: MaterialBlock) => {
    const isHighlighted = activeSectionId === block.id;
    const clickHandler = () => onSelectSection(block.id);

    switch (block.visualElementType) {
      case 'komponen':
        return (
          <ComponentsCard
            key={block.id}
            block={block}
            isHighlighted={isHighlighted}
            onClick={clickHandler}
            styleConfig={styleConfig}
          />
        );
      case 'tabel_perbandingan':
        return (
          <ComparisonCard
            key={block.id}
            block={block}
            isHighlighted={isHighlighted}
            onClick={clickHandler}
            styleConfig={styleConfig}
          />
        );
      case 'flowchart':
      case 'timeline':
        return (
          <ProcessFlowCard
            key={block.id}
            block={block}
            isHighlighted={isHighlighted}
            onClick={clickHandler}
            styleConfig={styleConfig}
          />
        );
      case 'ilustrasi_jaringan':
      case 'grafik':
      case 'mindmap':
        return (
          <NetworkConceptCard
            key={block.id}
            block={block}
            isHighlighted={isHighlighted}
            onClick={clickHandler}
            styleConfig={styleConfig}
          />
        );
      case 'ringkasan_kotak':
        return (
          <SummaryCard
            key={block.id}
            block={block}
            isHighlighted={isHighlighted}
            onClick={clickHandler}
            styleConfig={styleConfig}
          />
        );
      case 'diagram_konsep':
      case 'callout':
      default:
        return (
          <DefinitionCard
            key={block.id}
            block={block}
            isHighlighted={isHighlighted}
            onClick={clickHandler}
            styleConfig={styleConfig}
          />
        );
    }
  };

  // Layout container styling based on format
  const getContainerMaxWidth = () => {
    if (format === 'landscape') return 'max-w-5xl';
    return 'max-w-4xl'; // Default / Portrait / Square
  };

  // Separate non-summary blocks and summary blocks
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');
  const isOddCount = mainBlocks.length % 2 !== 0;

  return (
    <div
      id="infographic-preview-canvas"
      className={`w-full ${getContainerMaxWidth()} mx-auto ${composition.canvasBg} ${cards.borderRadius} shadow-xl border border-slate-300/80 overflow-hidden text-slate-900 font-sans transition-all duration-300 flex flex-col`}
    >
      {/* 1. Header Infografis (Judul dan Pengantar) */}
      <header className="w-full p-4 sm:p-6 bg-white border-b border-slate-200/80">
        <HeaderSection draft={draft} visualStyle={visualStyle} styleConfig={styleConfig} />
      </header>

      {/* 2. Infographic Material Canvas (Sections Materi & Rangkuman Kunci) */}
      <main className={`w-full ${composition.canvasPadding} ${composition.sectionGap} flex-1`}>
        {/* Responsive Grid for Material Sections */}
        {mainBlocks.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${composition.gridGap} w-full items-stretch min-w-0`}>
            {mainBlocks.map((block, index) => {
              const isLastOdd = isOddCount && index === mainBlocks.length - 1;
              return (
                <section
                  key={block.id}
                  className={`material-section w-full min-w-0 flex flex-col box-border overflow-hidden ${
                    isLastOdd ? 'md:col-span-2' : ''
                  }`}
                >
                  {renderBlock(block)}
                </section>
              );
            })}
          </div>
        )}

        {/* Section Rangkuman Kunci (Spans 100% full width at bottom) */}
        {summaryBlocks.map((summaryBlock) => (
          <section
            key={summaryBlock.id}
            className="material-section w-full min-w-0 mt-5 box-border overflow-hidden"
          >
            {renderBlock(summaryBlock)}
          </section>
        ))}
      </main>

      {/* 3. Professional Infographic Educational Footer */}
      <footer className="w-full bg-slate-900 text-slate-300 p-5 border-t border-slate-800 mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${styleConfig.icons.containerShape} ${colorPalette.primaryBg} text-white flex items-center justify-center font-black text-sm shadow-md`}>
              S
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">
                STIVIA • Media Infografis Pembelajaran
              </p>
              <p className="text-[10px] text-slate-400">
                “Belajar Lebih Visual, Mengajar Lebih Mudah”
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <GraduationCap className={`w-3.5 h-3.5 ${colorPalette.secondaryText}`} />
              {draft.educationLevel} • {draft.grade}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpen className={`w-3.5 h-3.5 ${colorPalette.primaryText}`} />
              {draft.subject}
            </span>
            <span>•</span>
            <span className="text-teal-300 font-semibold">
              Kurikulum Merdeka
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
