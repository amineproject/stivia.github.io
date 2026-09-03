import React from 'react';
import { InfographicDraft, MaterialBlock, StyleConfig } from '../../../types';
import { 
  Terminal, 
  Cpu, 
  Activity, 
  Radio, 
  Wifi, 
  Shield, 
  Zap,
  ChevronRight,
  Code
} from 'lucide-react';

interface LayoutProps {
  draft: InfographicDraft;
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  styleConfig: StyleConfig;
  renderBlockCard: (block: MaterialBlock) => React.ReactNode;
}

export const CyberHudLayout: React.FC<LayoutProps> = ({
  draft,
  activeSectionId,
  onSelectSection,
  styleConfig,
  renderBlockCard,
}) => {
  const { colorPalette, typography, cards, icons, decoration } = styleConfig;
  const mainBlocks = draft.blocks.filter(b => b.visualElementType !== 'ringkasan_kotak');
  const summaryBlocks = draft.blocks.filter(b => b.visualElementType === 'ringkasan_kotak');

  return (
    <div className="w-full flex flex-col space-y-6 bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-cyan-500/40 shadow-2xl relative overflow-hidden">
      {/* Background Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#08334415_1px,transparent_1px),linear-gradient(to_bottom,#08334415_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* 1. HUD CYBER HEADER */}
      <header className="relative z-10 w-full bg-slate-900/90 border border-cyan-500/50 rounded-xl p-5 sm:p-6 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] space-y-4">
        {/* Terminal Telemetry Line */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-cyan-500/30 text-[11px] font-mono text-cyan-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/40">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>SYS.ONLINE // v2.2c</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">
              MOD: {draft.subject.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700 text-slate-300">
              LVL: {draft.educationLevel}-{draft.grade}
            </span>
            <span className="text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800">
              STATUS: READY
            </span>
          </div>
        </div>

        {/* Cyber Title */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>&gt; INITIALIZE_LESSON_INTERFACE</span>
          </div>
          <h1 
            style={{ fontFamily: styleConfig.typographyProfile?.headingFontFamilyCss }}
            className="text-2xl sm:text-3xl font-black tracking-wider font-mono text-white bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-400 bg-clip-text text-transparent"
          >
            {draft.title}
          </h1>
          {draft.subTitle && (
            <p 
              style={{ fontFamily: styleConfig.typographyProfile?.subheadingFontFamilyCss }}
              className="text-xs sm:text-sm font-mono text-cyan-200/80"
            >
              // {draft.subTitle}
            </p>
          )}
        </div>

        {/* Objective Terminal Bar */}
        {draft.learningObjective && (
          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 font-mono text-xs text-cyan-200 flex items-start gap-2">
            <span className="text-cyan-400 font-bold shrink-0">[OBJ]:</span>
            <span className="opacity-90">{draft.learningObjective}</span>
          </div>
        )}
      </header>

      {/* 2. HUD MODULAR DATA GRID */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
        {mainBlocks.map((block, index) => {
          const isHighlighted = activeSectionId === block.id;
          return (
            <div 
              key={block.id}
              onClick={() => onSelectSection(block.id)}
              className={`w-full rounded-xl bg-slate-900/80 border transition-all duration-200 p-5 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isHighlighted 
                  ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_25px_rgba(6,182,212,0.3)] bg-slate-900' 
                  : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]'
              }`}
            >
              {/* Corner tech brackets */}
              <div className="absolute top-1 left-1 text-[9px] font-mono text-cyan-500/40">┌</div>
              <div className="absolute top-1 right-1 text-[9px] font-mono text-cyan-500/40">┐</div>
              <div className="absolute bottom-1 left-1 text-[9px] font-mono text-cyan-500/40">└</div>
              <div className="absolute bottom-1 right-1 text-[9px] font-mono text-cyan-500/40">┘</div>

              <div>
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-cyan-500 text-black font-bold flex items-center justify-center text-[10px]">
                      {block.letterIndex || index + 1}
                    </span>
                    <span className="text-cyan-400 font-semibold uppercase tracking-wider text-[11px]">
                      {block.tag || 'MODULE.DATA'}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[10px]">NODE_0{index + 1}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold font-mono text-white mb-2">
                  {block.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-4">
                  {block.content}
                </p>

                {/* Key Points in Tech Badges */}
                {block.keyPoints && block.keyPoints.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    {block.keyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-mono text-cyan-200/90 bg-cyan-950/30 p-2 rounded border border-cyan-900/40">
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Telemetry Status */}
              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>INT.WEIGHT: {block.weight || 'HIGH'}</span>
                <span className="text-cyan-400 font-bold">VERIFIED</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. SUMMARY CYBER CORE */}
      {summaryBlocks.map((summaryBlock) => (
        <div 
          key={summaryBlock.id} 
          onClick={() => onSelectSection(summaryBlock.id)}
          className="relative z-10 w-full rounded-xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-2 border-cyan-400 p-5 shadow-[0_0_30px_rgba(6,182,212,0.2)] cursor-pointer"
        >
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-cyan-500/40 font-mono text-cyan-300 text-xs">
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="font-bold tracking-wider">CORE_EVALUATION_SUMMARY</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-mono text-white mb-2">
            {summaryBlock.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans mb-3">
            {summaryBlock.content}
          </p>
          {summaryBlock.keyPoints && summaryBlock.keyPoints.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-cyan-100">
              {summaryBlock.keyPoints.map((pt, idx) => (
                <div key={idx} className="bg-slate-900/90 p-2 rounded border border-cyan-500/30 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
