import React from 'react';
import { 
  Sparkles, 
  Palette, 
  ArrowRight, 
  FileText, 
  Bookmark, 
  Play,
  Zap,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { InfographicDraft, NavigationTab, SubscriptionSummary } from '../../types';

interface DashboardPageProps {
  projects: InfographicDraft[];
  onSelectProject: (project: InfographicDraft, targetTab: 'buat' | 'hasil' | 'preview') => void;
  onNavigate: (tab: NavigationTab) => void;
  onLoadSample: () => void;
  subscriptionSummary?: SubscriptionSummary | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  onSelectProject: _onSelectProject,
  onNavigate,
  onLoadSample,
  subscriptionSummary,
}) => {
  // Hanya ambil proyek yang dibuat/disimpan oleh pengguna (tanpa data contoh bawaan)
  const userProjects = (projects || []).filter(
    (p) => !['proj-002', 'proj-003', 'proj-004', 'sample-draft-001'].includes(p.id)
  );

  // Perhitungan prompt murni berdasarkan proyek nyata milik pengguna
  const promptCount = userProjects.length * 2;

  // Data langganan fallback & perlakuan role Saldo Prompt
  const isAdmin = Boolean(subscriptionSummary?.isAdmin);
  const plan = isAdmin ? 'admin' : (subscriptionSummary?.plan || 'free');
  const promptBalance = isAdmin ? Infinity : (subscriptionSummary?.promptBalance ?? subscriptionSummary?.remaining ?? 10);
  const totalGranted = isAdmin ? Infinity : (subscriptionSummary?.totalGranted ?? 10);
  const usedTotal = subscriptionSummary?.usedTotal ?? subscriptionSummary?.usedThisMonth ?? 0;
  const isLimitReached = isAdmin ? false : promptBalance <= 0;
  const usagePercentage = isAdmin
    ? 0
    : totalGranted > 0
    ? Math.min(100, Math.round((usedTotal / totalGranted) * 100))
    : 100;

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-10">
      {/* Header Selamat Datang with Pill Badge */}
      <div className="space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#3b49df] border border-slate-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#3b49df]" />
          <span>STIVIA — Belajar Lebih Visual, Mengajar Lebih Mudah</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Selamat Datang di STIVIA
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Rancang infografis pembelajaran dan prompt visual terstruktur dengan mudah melalui analisis kerangka berpikir pedagogik STIVIA.
          </p>
        </div>
      </div>

      {/* KARTU HERO UTAMA (SESUAI ALUR BARU STIVIA 3.1) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#3b49df] via-indigo-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg shadow-indigo-600/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-xs">
            <Palette className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <span>🎨</span>
              <span>Buat Prompt Infografis</span>
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              Input data pembelajaran, jalankan analisis 7 Tahap Kerangka Berpikir STIVIA, dan langsung hasilkan Prompt Infografis terstruktur siap pakai.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('buat')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#34d399] hover:bg-[#2bd094] active:bg-[#20b881] text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/15 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Mulai Buat Prompt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLoadSample}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-all cursor-pointer backdrop-blur-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white/90" />
              <span>Lihat Contoh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* KARTU STATISTIK & PENGGUNAAN (DATA NYATA PENGGUNA & SUBSCRIPTION) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: TOTAL INFOGRAFIS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-indigo-200 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#edf2fe] text-[#3b49df] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              TOTAL INFOGRAFIS
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {userProjects.length}
            </span>
          </div>
        </div>

        {/* STAT 2: PROMPT TERSIMPAN */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-200 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              PROMPT TERSIMPAN
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {promptCount}
            </span>
          </div>
        </div>

        {/* STAT 3: SALDO PROMPT (TOKEN BALANCE) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3 hover:border-amber-200 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isAdmin 
                  ? 'bg-purple-50 text-purple-600'
                  : isLimitReached 
                  ? 'bg-rose-50 text-rose-600' 
                  : 'bg-amber-50 text-amber-600'
              }`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  SALDO PROMPT
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-slate-900 tracking-tight">
                    {isAdmin ? 'Unlimited (∞)' : `${promptBalance} Prompt`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isAdmin
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 w-full'
                    : isLimitReached 
                    ? 'bg-rose-500' 
                    : promptBalance <= 3 
                    ? 'bg-amber-500' 
                    : 'bg-[#3b49df]'
                }`}
                style={{ width: isAdmin ? '100%' : `${Math.min(100, Math.max(8, 100 - usagePercentage))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className={`font-semibold ${isAdmin ? 'text-purple-600' : isLimitReached ? 'text-rose-600' : 'text-slate-500'}`}>
                {isAdmin ? 'Akses Admin: Tanpa batas kuota' : isLimitReached ? 'Saldo habis • Perlu top-up' : `Tersisa ${promptBalance} • Terpakai: ${usedTotal}`}
              </span>
              <span className="text-slate-400">{isAdmin ? 'Permanen' : 'Aktif Selamanya'}</span>
            </div>
          </div>
        </div>

        {/* STAT 4: PAKET & STATUS AKUN */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3 hover:border-purple-200 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isAdmin
                  ? 'bg-purple-50 text-purple-700'
                  : plan === 'pro'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}>
                {isAdmin ? <Crown className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isAdmin ? 'PERAN AKUN' : 'PAKET ANDA'}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {isAdmin ? 'ADMIN' : plan}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                    isAdmin
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : plan === 'pro'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {isAdmin
                      ? 'Permanen'
                      : 'Aktif Selamanya'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <span className="truncate">
              {isAdmin
                ? 'Hak akses penuh tanpa kedaluwarsa'
                : 'Saldo tidak pernah hangus'}
            </span>
            <button
              onClick={() => onNavigate('profil_saya')}
              className="text-[#3b49df] font-bold hover:underline shrink-0 cursor-pointer"
            >
              {isAdmin ? 'Kelola ›' : 'Top-Up Saldo ›'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
