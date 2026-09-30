import React from 'react';
import { Calendar, ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { NavigationTab } from '../../types';

interface AsesmenHarianPageProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const AsesmenHarianPage: React.FC<AsesmenHarianPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-xs shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                Studio Konten • Asesmen
              </span>
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Tahap Berikutnya</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Asesmen Harian
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Perumusan kuis formatif harian, uji pemahaman per pertemuan, dan latihan cek konsep siswa.
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
              onClick={() => onNavigate('asesmen_sumatif')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <span>Asesmen Sumatif</span>
            </button>
          </div>
        )}
      </div>

      {/* Placeholder Content Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
          <Sparkles className="w-8 h-8 text-teal-500" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Menu Asesmen Harian Segera Hadir
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold my-1">
            <span>🪙 Biaya Generate: 2 Saldo Prompt</span>
            <span className="text-teal-400">•</span>
            <span className="text-teal-600 font-mono text-[11px]">Feature: assessment</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Struktur navigasi submenu <strong>Asesmen Harian</strong> telah aktif pada Studio Konten. Fungsionalitas pembuatan instrumen asesmen formatif harian akan menggunakan alokasi standar 2 Saldo Prompt per generate.
          </p>
        </div>
      </div>
    </div>
  );
};
