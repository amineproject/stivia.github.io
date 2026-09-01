import React from 'react';
import { Compass } from 'lucide-react';
import { SynthesisStep, StyleConfig } from '../../types';
import { STYLE_MODERN_EDUKATIF } from '../../data/styleSystem';

interface SynthesisFlowCardProps {
  steps?: SynthesisStep[];
  styleConfig?: StyleConfig;
}

export const SynthesisFlowCard: React.FC<SynthesisFlowCardProps> = ({
  steps = [
    { step: 1, title: 'Identifikasi Konsep', desc: 'Pahami definisi dasar dan fenomena utama materi.' },
    { step: 2, title: 'Analisis Komponen', desc: 'Bedah unsur-unsur esensial dan keterkaitannya.' },
    { step: 3, title: 'Bandingkan Pola', desc: 'Evaluasi variasi dan aturan operasional konsep.' },
    { step: 4, title: 'Simulasikan Kasus', desc: 'Terapkan konsep pada skenario pemecahan masalah.' },
    { step: 5, title: 'Sintesis & Refleksi', desc: 'Tarik kesimpulan terintegrasi untuk asesmen nyata.' }
  ],
  styleConfig = STYLE_MODERN_EDUKATIF
}) => {
  const { colorPalette, typography, cards, icons } = styleConfig;

  return (
    <section className={`${cards.borderRadius} ${cards.padding} ${colorPalette.headerGradient} ${colorPalette.headerText} border border-white/20 shadow-xs box-border`}>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 ${icons.containerShape} ${colorPalette.accentBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
            <Compass className="w-3.5 h-3.5" />
          </span>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${colorPalette.headerBadgeBg} px-2.5 py-0.5 ${cards.innerRadius} border border-white/20`}>
            BENANG MERAH MATERI
          </span>
        </div>
        <span className={`text-[11px] ${colorPalette.headerSubtext} font-medium`}>
          Siklus Pemahaman Terpadu
        </span>
      </div>

      <p className={`text-xs ${colorPalette.headerSubtext} mb-3.5 leading-relaxed break-words whitespace-normal`}>
        {steps.length} tahapan berkesinambungan menguasai konsep dan menerapkannya dalam konteks nyata:
      </p>

      {/* Connected Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2.5 w-full min-w-0">
        {steps.map((item) => (
          <div 
            key={item.step}
            className={`p-3 ${cards.innerRadius} bg-white/10 border border-white/15 flex flex-col justify-between min-w-0 box-border overflow-hidden`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5 min-w-0 gap-1">
                <span className={`w-5 h-5 rounded-full ${colorPalette.accentBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                  {item.step}
                </span>
                <span className="text-[9px] font-semibold text-white/90 uppercase truncate">
                  Tahap {item.step}
                </span>
              </div>
              <h4 className="text-[11px] font-bold text-white mb-0.5 leading-snug break-words whitespace-normal">
                {item.title}
              </h4>
              <p className="text-[10px] text-white/80 leading-snug break-words whitespace-normal">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
