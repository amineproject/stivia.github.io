import React from 'react';
import { 
  Sparkles, 
  Palette, 
  FolderKanban, 
  Plus, 
  ArrowRight, 
  Clock, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Lock, 
  CheckCircle2, 
  PlayCircle
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
  // Ambil hingga 4 proyek terbaru
  const recentProjects = projects.slice(0, 4);

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
      {/* Header Selamat Datang */}
      <div className="space-y-2 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STIVIA — Belajar Lebih Visual, Mengajar Lebih Mudah</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Selamat Datang di STIVIA
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          Buat materi pembelajaran, infografis, dan prompt dalam satu alur kerja.
        </p>
      </div>

      {/* DUA KARTU UTAMA PRIORITAS TINGGI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KARTU 1: BUAT INFOGRAFIS */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 text-white rounded-3xl p-7 sm:p-8 shadow-xl shadow-indigo-600/15 flex flex-col justify-between space-y-6 group hover:shadow-2xl transition-all">
          <div className="space-y-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Palette className="w-7 h-7 text-emerald-300" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">
                🎨 Buat Infografis
              </h2>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Buat infografis pembelajaran melalui alur STIVIA: Struktur → Bobot → Kedalaman → Layout → Visualisasi.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={() => onNavigate('buat')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Mulai Membuat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLoadSample}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-indigo-200" />
              <span>Lihat Demo</span>
            </button>
          </div>
        </div>

        {/* KARTU 2: PROMPT STUDIO */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-7 sm:p-8 shadow-xl shadow-slate-900/15 flex flex-col justify-between space-y-6 group hover:shadow-2xl transition-all">
          <div className="space-y-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-center text-white shadow-inner">
              <Sparkles className="w-7 h-7 text-amber-300" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">
                ✨ Prompt Studio
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Buat prompt materi dan prompt infografis yang dapat digunakan di berbagai AI (ChatGPT, Claude, Gemini).
              </p>
            </div>
          </div>

          <div className="pt-4 relative z-10">
            <button
              onClick={() => onNavigate('prompt_studio')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-950/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Buka Prompt Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* BAGIAN PROYEK TERBARU */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <FolderKanban className="w-5 h-5 text-indigo-600" />
              <span>Proyek Terbaru</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Kelola dan lanjutkan rancangan materi pembelajaran yang sedang berjalan.
            </p>
          </div>

          {projects.length > 0 && (
            <button
              onClick={() => onNavigate('infografis_saya')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>Lihat Semua ({projects.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* List / Grid Proyek Terbaru */}
        {recentProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <FolderKanban className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                Belum ada proyek. Mulai buat proyek pertama Anda.
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Susun materi pembelajaran terstruktur dengan alur STIVIA dan hasilkan infografis edukatif.
              </p>
            </div>
            <button
              onClick={() => onNavigate('buat')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Proyek Baru</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentProjects.map((project) => {
              const isLocked = project.isLocked;
              const isFinal = project.status === 'completed' || isLocked;

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mb-1">
                          {project.subject || 'Umum'}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      {getStatusBadge(project.status, project.isLocked)}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span>{project.educationLevel} Kelas {project.grade}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Diperbarui {project.updatedAt || project.createdAt}</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {project.blocks?.length || 0} Blok Konten
                    </span>
                    <button
                      onClick={() => onSelectProject(project, isFinal ? 'preview' : 'rancangan')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs transition-all cursor-pointer"
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
