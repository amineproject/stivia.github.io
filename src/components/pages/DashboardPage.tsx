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
  Crown,
  FolderPlus,
  FolderKanban,
  BookOpen,
  Presentation,
  GraduationCap,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  InfographicDraft, 
  NavigationTab, 
  SubscriptionSummary,
  LearningProject,
  ActiveLearningContext
} from '../../types';

interface DashboardPageProps {
  projects: InfographicDraft[];
  learningProjects?: LearningProject[];
  activeContext?: ActiveLearningContext;
  onSelectProject: (project: InfographicDraft, targetTab: 'buat' | 'hasil' | 'preview') => void;
  onNavigate: (tab: NavigationTab) => void;
  onLoadSample: () => void;
  subscriptionSummary?: SubscriptionSummary | null;
  isCloudSyncing?: boolean;
  cloudSyncStatus?: 'synced' | 'local' | 'syncing' | 'error';
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  learningProjects,
  activeContext,
  onSelectProject: _onSelectProject,
  onNavigate,
  onLoadSample,
  subscriptionSummary,
  isCloudSyncing = false,
  cloudSyncStatus = 'local',
}) => {
  // Hanya ambil proyek yang dibuat/disimpan oleh pengguna (tanpa data contoh bawaan)
  const userProjects = (projects || []).filter(
    (p) => !['proj-002', 'proj-003', 'proj-004', 'sample-draft-001'].includes(p.id)
  );

  const totalLearningProjects = (learningProjects || []).length;

  // Resolusi Konteks Aktif
  const activeProject = (learningProjects || []).find(p => p.id === activeContext?.activeProjectId) || learningProjects?.[0];
  const activeClassSubject = activeProject?.classSubjects.find(cs => cs.id === activeContext?.activeClassSubjectId) || activeProject?.classSubjects[0];
  const activeChapter = activeClassSubject?.chapters.find(ch => ch.id === activeContext?.activeChapterId) || activeClassSubject?.chapters[0];
  const activeMeeting = activeChapter?.meetings.find(m => m.id === activeContext?.activeMeetingId) || activeChapter?.meetings[0];

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
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Platform perancangan perangkat ajar terintegrasi — Dokumen Materi A4, Infografis Visual, Lembar Kerja LKPD, Presentasi 10 Slide, dan Asesmen — dari satu <strong>Master Learning Data</strong>.
          </p>
        </div>
      </div>

      {/* KARTU HERO UTAMA: ALUR 1 DATA -> BANYAK PRODUK */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#3b49df] via-indigo-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg shadow-indigo-600/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-xs">
            <FolderPlus className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 border border-white/30 text-white backdrop-blur-xs">
              <span>⚡ 1 DATA → BANYAK PRODUK</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <span>Buat Proyek Pembelajaran</span>
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              Cukup definisikan materi pelajaran satu kali. Data Master Learning otomatis terhubung ke seluruh studio: Dokumen Materi A4, Infografis Visual, Lembar Kerja LKPD, Presentasi Gamma 10 Slide, dan Asesmen.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('buat_proyek')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#34d399] hover:bg-[#2bd094] active:bg-[#20b881] text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/15 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Buat Proyek Baru</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('proyek_saya')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-all cursor-pointer backdrop-blur-xs"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Buka Ruang Proyek</span>
            </button>
            <button
              onClick={onLoadSample}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 font-medium text-xs sm:text-sm border border-white/15 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white/80" />
              <span>Contoh Cepat</span>
            </button>
          </div>
        </div>
      </div>

      {/* BANNER KONTEKS PEMBELAJARAN AKTIF (JIKA ADA PROYEK TERPILIH) */}
      {activeMeeting && activeProject && (
        <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#3b49df] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 shrink-0">
                  Konteks Aktif
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                  cloudSyncStatus === 'synced'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : cloudSyncStatus === 'syncing'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse'
                    : cloudSyncStatus === 'error'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <span>{cloudSyncStatus === 'synced' ? '☁️ Cloud Synced' : cloudSyncStatus === 'syncing' ? '🔄 Menyinkronkan...' : cloudSyncStatus === 'error' ? '⚠️ Sync Pending' : '💾 Mode Lokal'}</span>
                </span>
                <span className="text-xs font-bold text-slate-800 truncate">
                  {activeProject.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {activeClassSubject?.grade} • {activeClassSubject?.subject} • {activeMeeting.meetingNumber}: <strong className="text-slate-800 font-semibold">{activeMeeting.title || activeMeeting.masterLearningData?.temaKegiatan}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('proyek_saya')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs self-start md:self-auto shrink-0"
          >
            <span>Lanjutkan Proyek Ini</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION STUDIO PRODUK PEMBELAJARAN (5 PRODUK DARI 1 MASTER DATA) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Studio Produk Pembelajaran
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              5 Generator terpadu yang terhubung langsung dengan Master Learning Data Anda.
            </p>
          </div>
          <button
            onClick={() => onNavigate('buat_proyek')}
            className="text-xs font-bold text-[#3b49df] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>+ Buat Proyek Baru</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* 1. Materi A4 */}
          <div 
            onClick={() => onNavigate('materi')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Materi A4
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Modul bahan ajar terstruktur A4 rapi, uji pemahaman, dan ekspor DOCX.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-indigo-600 pt-2 border-t border-slate-100">
              <span>Buka Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Infografis */}
          <div 
            onClick={() => onNavigate('infografis')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Infografis
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Prompt visual terstruktur 7 Tahap Berpikir Pedagogis STIVIA.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-purple-600 pt-2 border-t border-slate-100">
              <span>Buka Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. LKPD */}
          <div 
            onClick={() => onNavigate('lkpd')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  LKPD
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Aktivitas kognitif, situasi nyata, stimulus & poster LKPD siap pakai.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-600 pt-2 border-t border-slate-100">
              <span>Buka Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Presentasi */}
          <div 
            onClick={() => onNavigate('presentasi')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Presentation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Presentasi
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Naskah terstruktur 10 slide Gamma AI teradaptasi dari Master Context.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 pt-2 border-t border-slate-100">
              <span>Buka Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Asesmen */}
          <div 
            onClick={() => onNavigate('asesmen_harian')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  Asesmen
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Kuis formatif harian & asesmen sumatif capaian pembelajaran bab.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-teal-600 pt-2 border-t border-slate-100">
              <span>Buka Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* KARTU STATISTIK & PENGGUNAAN (DATA NYATA PENGGUNA & SUBSCRIPTION) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: TOTAL PROYEK PEMBELAJARAN */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-indigo-200 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#edf2fe] text-[#3b49df] flex items-center justify-center shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              TOTAL PROYEK
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {totalLearningProjects}
            </span>
          </div>
        </div>

        {/* STAT 2: PRODUK / ARSIP TERSIMPAN */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-200 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              DRAFT TERSIMPAN
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {userProjects.length}
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
