import React from 'react';
import { InfographicDraft, MaterialBlock } from '../../types';
import { getStyleConfig } from '../../data/styleSystem';
import { determineLayoutArchetype, InfographicLayoutArchetype } from '../../data/layoutEngine';

// Layout Templates
import { HeroVisualLayout } from './layouts/HeroVisualLayout';
import { ModularBentoLayout } from './layouts/ModularBentoLayout';
import { CentralConceptLayout } from './layouts/CentralConceptLayout';
import { TimelineLayout } from './layouts/TimelineLayout';
import { ProcessFlowLayout } from './layouts/ProcessFlowLayout';
import { ComparisonLayout } from './layouts/ComparisonLayout';
import { EditorialLayout } from './layouts/EditorialLayout';
import { CyberHudLayout } from './layouts/CyberHudLayout';
import { SwissDesignLayout } from './layouts/SwissDesignLayout';
import { ClayTactileLayout } from './layouts/ClayTactileLayout';
import { PopArtComicLayout } from './layouts/PopArtComicLayout';
import { NotebookHandwrittenLayout } from './layouts/NotebookHandwrittenLayout';
import { GlassmorphismLayout } from './layouts/GlassmorphismLayout';

// Block Components
import { DefinitionCard } from './DefinitionCard';
import { ComponentsCard } from './ComponentsCard';
import { ComparisonCard } from './ComparisonCard';
import { ProcessFlowCard } from './ProcessFlowCard';
import { NetworkConceptCard } from './NetworkConceptCard';
import { SummaryCard } from './SummaryCard';
import { GraduationCap, BookOpen } from 'lucide-react';

interface InfographicRendererProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  visualStyle?: string;
  format?: 'portrait' | 'square' | 'landscape';
  visualLevel?: 'sederhana' | 'seimbang' | 'visual_dominan';
  canvasRef?: React.Ref<HTMLDivElement>;
}

export const InfographicRenderer: React.FC<InfographicRendererProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  visualStyle,
  format = 'portrait',
  canvasRef,
}) => {
  // 1. Resolve Style Tokens
  const effectiveStyle = visualStyle || draft.visualStyle;
  const styleConfig = React.useMemo(() => {
    return getStyleConfig(effectiveStyle, draft.customVisualStyle);
  }, [effectiveStyle, draft.customVisualStyle]);

  // 2. Resolve Layout Archetype dynamically
  const layoutArchetype: InfographicLayoutArchetype = React.useMemo(() => {
    return determineLayoutArchetype(
      { ...draft, visualStyle: effectiveStyle },
      draft.layoutVariationCycle || 0
    );
  }, [draft.id, draft.visualStyle, effectiveStyle, draft.layoutTemplate, draft.layoutVariationCycle, draft.blocks]);

  // 3. Render individual block helper
  const renderBlockCard = (block: MaterialBlock) => {
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

  // Layout container sizing
  const getContainerMaxWidth = () => {
    if (format === 'landscape') return 'max-w-5xl';
    return 'max-w-4xl';
  };

  const layoutProps = {
    draft,
    activeSectionId,
    onSelectSection,
    styleConfig,
    renderBlockCard,
  };

  // Render the selected Layout Archetype
  const renderLayoutContent = () => {
    switch (layoutArchetype) {
      case 'cyber_hud':
        return <CyberHudLayout {...layoutProps} />;
      case 'swiss_modernist':
        return <SwissDesignLayout {...layoutProps} />;
      case 'clay_tactile':
        return <ClayTactileLayout {...layoutProps} />;
      case 'pop_comic':
        return <PopArtComicLayout {...layoutProps} />;
      case 'notebook_handwritten':
        return <NotebookHandwrittenLayout {...layoutProps} />;
      case 'glassmorphism_layers':
        return <GlassmorphismLayout {...layoutProps} />;
      case 'editorial_magazine':
        return <EditorialLayout {...layoutProps} />;
      case 'central_concept':
        return <CentralConceptLayout {...layoutProps} />;
      case 'timeline_flow':
        return <TimelineLayout {...layoutProps} />;
      case 'process_flow':
        return <ProcessFlowLayout {...layoutProps} />;
      case 'comparison_split':
        return <ComparisonLayout {...layoutProps} />;
      case 'modular_bento':
        return <ModularBentoLayout {...layoutProps} />;
      case 'hero_visual':
      default:
        return <HeroVisualLayout {...layoutProps} />;
    }
  };

  return (
    <div
      ref={canvasRef}
      id="infographic-preview-canvas"
      key={`${draft.id || 'draft'}-${effectiveStyle}-${layoutArchetype}-${draft.layoutVariationCycle || 0}`}
      className={`w-full ${getContainerMaxWidth()} mx-auto ${styleConfig.cards.borderRadius} shadow-xl border border-slate-300/80 overflow-hidden text-slate-900 font-sans transition-all duration-300 flex flex-col bg-slate-50/50`}
    >
      {/* Dynamic Layout Content */}
      <main className="w-full p-4 sm:p-6 lg:p-8 flex-1">
        {renderLayoutContent()}
      </main>

      {/* Professional STIVIA Educational Footer */}
      <footer className="w-full bg-slate-900 text-slate-300 p-5 border-t border-slate-800 mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${styleConfig.icons.containerShape} ${styleConfig.colorPalette.primaryBg} text-white flex items-center justify-center font-black text-sm shadow-md`}>
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
              <GraduationCap className={`w-3.5 h-3.5 text-indigo-400`} />
              {draft.educationLevel} • {draft.grade}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpen className={`w-3.5 h-3.5 text-teal-400`} />
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
