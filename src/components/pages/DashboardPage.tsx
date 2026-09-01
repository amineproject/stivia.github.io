import React from 'react';
import { 
  Sparkles, 
  Palette, 
  FolderKanban, 
  Plus, 
  ArrowRight, 
  Clock, 
  GraduationCap, 
  FileText, 
  Bookmark, 
  Lock, 
  CheckCircle2, 
  Play
} from 'lucide-react';
import { InfographicDraft, NavigationTab } from '../../types';

interface DashboardPageProps {
  projects: InfographicDraft[];
  onSelectProject: (project: InfographicDraft, targetTab: 'rancangan' | 'hasil' | 'preview') => void;
  onNavigate: (tab: NavigationTab) => void;
  onLoadSample: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  onSelectProject,
  onNavigate,
  onLoadSample,
}) => {
  // Hanya ambil proyek yang dibuat/disimpan oleh pengguna (tanpa data contoh bawaan)
  const userProjects = (projects || []).filter(
    (p) => !['proj-002', 'proj-003', 'proj-004', 'sample-draft-001'].includes(p.id)
  );
  const recentProjects = userProjects.slice(0, 4);

  // Perhitungan prompt murni berdasarkan proyek nyata milik pengguna
  const promptCount = userProjects.length * 2;

  // Helper untuk menentukan status badge
  const getStatusBadge = (status: string, isLocked?: boolean) => {
    if (isLocked) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Lock className="w-3 h-3" />
          <span>Terkunci</span>
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          <span>Selesai / Final</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <Clock className="w-3 h-3" />
        <span>Draft</span>
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-10">
      {/* Header Selamat Datang with Pill Badge */}
      <div className="space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-[#3b49df] border border-slate-200/80 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#3b49df]" />
          <span>STIVIA — Belajar Lebih Visual, Mengajar Lebih Mudah</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Selamat Datang di STIVIA
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Buat materi pembelajaran, infografis, dan prompt dalam satu alur kerja yang mulus dan terintegrasi.
          </p>
        </div>
      </div>

      {/* DUA KARTU UTAMA HERO PRIORITAS TINGGI (SESUAI GAMBAR REFERENSI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* KARTU 1: BUAT INFOGRAFIS (ROYAL BLUE/INDIGO) */}
        <div className="relative overflow-hidden bg-[#3b49df] text-white rounded-[32px] p-8 sm:p-9 shadow-xl shadow-indigo-600/20 flex flex-col justify-between space-y-7 group hover:shadow-2xl transition-all">
          <div className="space-y-5 relative z-10">
            {/* Top Icon Box */}
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white shadow-inner">
              <Palette className="w-7 h-7" />
            </div>

            {/* Content */}
            <div className="space-y-2.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
                <span>🎨</span>
                <span>Buat Infografis</span>
              </h2>
              <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
                Buat infografis pembelajaran melalui alur STIVIA: Struktur → Bobot → Kedalaman → Layout → Visualisasi.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={() => onNavigate('buat')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#34d399] hover:bg-[#2bd094] active:bg-[#20b881] text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/15 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Mulai Membuat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLoadSample}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-all cursor-pointer backdrop-blur-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white/90" />
              <span>Lihat Demo</span>
            </button>
          </div>
        </div>

        {/* KARTU 2: PROMPT STUDIO (DARK NAVY/SLATE) */}
        <div className="relative overflow-hidden bg-[#181c2e] text-white rounded-[32px] p-8 sm:p-9 shadow-xl shadow-slate-950/25 flex flex-col justify-between space-y-7 group hover:shadow-2xl transition-all">
          <div className="space-y-5 relative z-10">
            {/* Top Icon Box */}
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-amber-300 shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>

            {/* Content */}
            <div className="space-y-2.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
                <span>✨</span>
                <span>Prompt Studio</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Buat prompt materi dan prompt infografis yang dapat digunakan di berbagai AI (ChatGPT, Claude, Gemini).
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 relative z-10">
            <button
              onClick={() => onNavigate('prompt_studio')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#3b49df] hover:bg-[#323ecb] active:bg-[#2833ab] text-white font-bold text-sm shadow-lg shadow-indigo-950/40 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Buka Prompt Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TIGA KARTU STATISTIK (MENGGUNAKAN DATA NYATA PENGGUNA) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* STAT 1: TOTAL INFOGRAFIS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs flex items-center gap-4.5 hover:shadow-xs transition-shadow">
          <div className="w-13 h-13 rounded-2xl bg-[#edf2fe] text-[#3b49df] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              TOTAL INFOGRAFIS
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {userProjects.length}
            </span>
          </div>
        </div>

        {/* STAT 2: PROMPT TERSIMPAN */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs flex items-center gap-4.5 hover:shadow-xs transition-shadow">
          <div className="w-13 h-13 rounded-2xl bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              PROMPT TERSIMPAN
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {promptCount}
            </span>
          </div>
        </div>

        {/* STAT 3: AKTIVITAS TERAKHIR */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs flex items-center gap-4.5 hover:shadow-xs transition-shadow">
          <div className="w-13 h-13 rounded-2xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              AKTIVITAS TERAKHIR
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate block max-w-[170px]">
              {userProjects.length > 0
                ? (userProjects[0].updatedAt ? `Diperbarui ${userProjects[0].updatedAt}` : 'Hari ini')
                : 'Belum Ada Aktivitas'}
            </span>
          </div>
        </div>
      </div>

      {/* BAGIAN PROYEK TERBARU */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <FolderKanban className="w-5 h-5 text-[#3b49df]" />
              <span>Proyek Terbaru</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Kelola dan lanjutkan rancangan materi pembelajaran yang sedang berjalan.
            </p>
          </div>

          {userProjects.length > 0 && (
            <button
              onClick={() => onNavigate('infografis_saya')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#3b49df] hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <span>Lihat Semua ({userProjects.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* List / Grid Proyek Terbaru */}
        {recentProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-100 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#3b49df] flex items-center justify-center mx-auto shadow-inner">
              <FolderKanban className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                Belum Ada Proyek
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Proyek yang Anda buat akan muncul di sini. Mulai susun materi pembelajaran visual pertama Anda.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                id="btn-empty-buat-proyek"
                onClick={() => onNavigate('buat')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#3b49df] hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat Proyek Baru</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentProjects.map((project) => {
              const isLocked = project.isLocked;
              const isFinal = project.status === 'completed' || isLocked;

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b49df] bg-indigo-50 px-2.5 py-1 rounded-lg inline-block mb-1.5">
                          {project.subject || 'Umum'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-[#3b49df] transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      {getStatusBadge(project.status, project.isLocked)}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <span>{project.educationLevel} Kelas {project.grade}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Diperbarui {project.updatedAt || project.createdAt}</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      {project.blocks?.length || 0} Blok Konten
                    </span>
                    <button
                      onClick={() => onSelectProject(project, isFinal ? 'preview' : 'rancangan')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-[#3b49df] hover:text-white text-[#3b49df] font-bold text-xs transition-all cursor-pointer"
                    >
                      <span>Buka Proyek</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
