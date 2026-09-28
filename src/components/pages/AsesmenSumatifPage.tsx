import React from 'react';
import { Award, ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { NavigationTab } from '../../types';

interface AsesmenSumatifPageProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const AsesmenSumatifPage: React.FC<AsesmenSumatifPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                Studio Konten • Asesmen
              </span>
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Tahap Berikutnya</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Asesmen Sumatif
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Penyusunan evaluasi akhir bab, ujian tengah/akhir semester, dan rubrik penilaian capaian pembelajaran.
            </p>
          </div>
        </div>

        {onNavigate && (
          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('asesmen_harian')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <span>Asesmen Harian</span>
            </button>
          </div>
        )}
      </div>

      {/* Placeholder Content Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
          <Sparkles className="w-8 h-8 text-purple-500" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Menu Asesmen Sumatif Segera Hadir
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Struktur navigasi submenu <strong>Asesmen Sumatif</strong> telah aktif pada Studio Konten. Fungsionalitas pembuatan instrumen asesmen sumatif akan dikembangkan secara bertahap pada tahap berikutnya sesuai roadmap STIVIA.
          </p>
        </div>
      </div>
    </div>
  );
};
