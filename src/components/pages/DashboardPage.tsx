import React from 'react';
import { 
  Plus, 
  Palette, 
  ArrowRight, 
  FileText, 
  BookOpen, 
  Presentation, 
  GraduationCap, 
  FolderKanban,
  Zap,
  Play,
  Sparkles,
  CheckCircle2
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
  onNavigate,
  onLoadSample,
  subscriptionSummary,
}) => {
  // Hanya ambil proyek yang dibuat/disimpan oleh pengguna
  const userProjects = (projects || []).filter(
    (p) => !['proj-002', 'proj-003', 'proj-004', 'sample-draft-001'].includes(p.id)
  );

  const totalLearningProjects = (learningProjects || []).length;

  // Resolusi Konteks Aktif
  const activeProject = (learningProjects || []).find(p => p.id === activeContext?.activeProjectId) || learningProjects?.[0];
  const activeClassSubject = activeProject?.classSubjects.find(cs => cs.id === activeContext?.activeClassSubjectId) || activeProject?.classSubjects[0];
  const activeChapter = activeClassSubject?.chapters.find(ch => ch.id === activeContext?.activeChapterId) || activeClassSubject?.chapters[0];
  const activeMeeting = activeChapter?.meetings.find(m => m.id === activeContext?.activeMeetingId) || activeChapter?.meetings[0];

  // Data langganan fallback & role Saldo Prompt
  const isAdmin = Boolean(subscriptionSummary?.isAdmin);
  const promptBalance = isAdmin ? 'Unlimited (∞)' : `${subscriptionSummary?.promptBalance ?? subscriptionSummary?.remaining ?? 10} Prompt`;

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      {/* 1. Header & Aksi Cepat */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <span>STIVIA Edukasi</span>
            <span aria-hidden="true">·</span>
            <span>Perangkat Ajar Terintegrasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Selamat Datang di STIVIA
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Rancang Bahan Ajar A4, Infografis Visual, Lembar Kerja LKPD, Slide Presentasi, dan Asesmen langsung dari satu <strong>Master Learning Data</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('buat_proyek')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3b49df] hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Proyek Baru</span>
          </button>
          <button
            onClick={() => onNavigate('proyek_saya')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <FolderKanban className="w-4 h-4 text-slate-500" />
            <span>Proyek Saya</span>
          </button>
          <button
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer"
            title="Muat data contoh cepat"
          >
            <Play className="w-3.5 h-3.5 fill-current text-slate-400" />
            <span>Contoh</span>
          </button>
        </div>
      </div>

      {/* 2. Alur Kerja Sederhana STIVIA (3 Langkah Mudah) */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/40 rounded-2xl p-5 border border-indigo-100 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Alur Mudah STIVIA: 1 Kali Masukkan Materi, Buat Semua Perangkat Ajar</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Tidak perlu mengetik ulang data yang sama berulang kali. Cukup tentukan materi, lalu pilih produk visual yang Anda butuhkan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900">Tentukan Master Data</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Pilih atau buat proyek belajar (Kelas, Mapel, Materi, dan Cakupan).
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900">Pilih Media Pembelajaran</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Buka studio: Infografis, Bahan Ajar A4, LKPD, Slide, atau Asesmen.
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900">Dapatkan Hasil Cepat</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Prompt visual & materi terstruktur siap pakai untuk kegiatan belajar siswa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Banner Proyek Aktif (Jika Ada Proyek Sedang Dikerjakan) */}
      {activeMeeting && activeProject && (
        <div className="bg-indigo-50/70 rounded-2xl p-4 sm:p-5 border border-indigo-100 flex flex-col gap-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#3b49df] text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                  <span className="font-semibold text-indigo-700">{activeProject.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeClassSubject?.grade} ({activeClassSubject?.subject})</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeMeeting.meetingNumber}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
                  {activeMeeting.title || activeMeeting.masterLearningData?.temaKegiatan}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('proyek_saya')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
            >
              <span>Kelola di Proyek Saya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Akses Langsung Perangkat Ajar untuk Pertemuan Aktif */}
          <div className="pt-2 border-t border-indigo-100/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 mr-1">
              ⚡ Buat Langsung untuk Materi Ini:
            </span>
            <button
              type="button"
              onClick={() => onNavigate('infografis')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Infografis</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('materi')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bahan Ajar A4</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('lkpd')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lembar LKPD</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('presentasi')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slide Presentasi</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('asesmen_harian')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Asesmen</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Studio Produk Pembelajaran (5 Generator Utama) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Studio Produk Pembelajaran
          </h2>
          <span className="text-xs text-slate-400">Pilih jenis produk yang ingin dibuat</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {/* 1. Bahan Ajar A4 */}
          <div 
            onClick={() => onNavigate('materi')}
            className="bg-white rounded-2xl p-4.5 border border-slate-200/80 hover:border-indigo-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Bahan Ajar A4
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Modul teks terstruktur, uji pemahaman & ekspor DOCX.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-2 border-t border-slate-100">
              <span>Buka Studio</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 2. Infografis */}
          <div 
            onClick={() => onNavigate('infografis')}
            className="bg-white rounded-2xl p-4.5 border border-slate-200/80 hover:border-purple-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Palette className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Infografis Visual
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Prompt visual terstruktur 7 Tahap Berpikir STIVIA.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-purple-600 pt-2 border-t border-slate-100">
              <span>Buka Studio</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3. LKPD */}
          <div 
            onClick={() => onNavigate('lkpd')}
            className="bg-white rounded-2xl p-4.5 border border-slate-200/80 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Lembar LKPD
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Lembar kerja, aktivitas kontekstual, stimulus & tugas siswa.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-blue-600 pt-2 border-t border-slate-100">
              <span>Buka Studio</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 4. Presentasi */}
          <div 
            onClick={() => onNavigate('presentasi')}
            className="bg-white rounded-2xl p-4.5 border border-slate-200/80 hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Presentation className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Presentasi Slide
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Naskah terstruktur 10 slide Gamma AI untuk tayang kelas.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 pt-2 border-t border-slate-100">
              <span>Buka Studio</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 5. Asesmen */}
          <div 
            onClick={() => onNavigate('asesmen_harian')}
            className="bg-white rounded-2xl p-4.5 border border-slate-200/80 hover:border-teal-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  Asesmen & Kuis
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Instrumen formatif harian & evaluasi sumatif akhir bab.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-teal-600 pt-2 border-t border-slate-100">
              <span>Buka Studio</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Ringkasan Aktivitas & Saldo Ringkas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <FolderKanban className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-500 block">Total Proyek</span>
            <span className="text-xl font-bold text-slate-900">{totalLearningProjects} Proyek</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-500 block">Draf Tersimpan</span>
            <span className="text-xl font-bold text-slate-900">{userProjects.length} Draf</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block">Saldo Prompt</span>
              <span className="text-xl font-bold text-slate-900 truncate block">{promptBalance}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('profil_saya')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 shrink-0 cursor-pointer"
          >
            Kelola ›
          </button>
        </div>
      </div>
    </div>
  );
};

