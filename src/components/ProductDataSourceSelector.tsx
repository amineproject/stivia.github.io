import React, { useState } from 'react';
import {
  FolderKanban,
  PenLine,
  Layers,
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FolderPlus,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  LearningProject,
  ActiveLearningContext,
  ClassSubjectNode,
  ChapterNode,
  MeetingSession,
  NavigationTab
} from '../types';

export type ProductDataSourceMode = 'project' | 'manual';

interface ProductDataSourceSelectorProps {
  currentMode: ProductDataSourceMode;
  onModeChange: (mode: ProductDataSourceMode) => void;
  productTitle: string; // Misal: "Bahan Ajar A4", "Infografis", "LKPD", "Presentasi", "Asesmen"
  learningProjects: LearningProject[];
  activeContext?: ActiveLearningContext;
  onSelectMeetingContext?: (
    project: LearningProject,
    classSubject: ClassSubjectNode,
    chapter: ChapterNode,
    meeting: MeetingSession
  ) => void;
  onNavigate?: (tab: NavigationTab) => void;
  // Metadata dari context yang sedang aktif untuk ringkasan
  activeHierarchySummary?: {
    projectName?: string;
    classSubjectName?: string;
    chapterName?: string;
    meetingName?: string;
    materiDiajarkan?: string;
    temaKegiatan?: string;
    cakupanMateri?: string;
    learningObjectivesCount?: number;
    sourceMasterVersion?: number;
    hasRealLearningData?: boolean;
  } | null;
}

export const ProductDataSourceSelector: React.FC<ProductDataSourceSelectorProps> = ({
  currentMode,
  onModeChange,
  productTitle,
  learningProjects,
  activeContext,
  onSelectMeetingContext,
  onNavigate,
  activeHierarchySummary
}) => {
  // Local state untuk pemilihan interaktif dari Proyek Saya jika dropdown diubah
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    () => activeContext?.activeProjectId || learningProjects[0]?.id || ''
  );
  const [selectedClassSubjectId, setSelectedClassSubjectId] = useState<string>(
    () => activeContext?.activeClassSubjectId || ''
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    () => activeContext?.activeChapterId || ''
  );
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(
    () => activeContext?.activeMeetingId || ''
  );

  // Sync jika activeContext berubah dari luar
  React.useEffect(() => {
    if (activeContext?.activeProjectId) {
      setSelectedProjectId(activeContext.activeProjectId);
    }
    if (activeContext?.activeClassSubjectId) {
      setSelectedClassSubjectId(activeContext.activeClassSubjectId);
    }
    if (activeContext?.activeChapterId) {
      setSelectedChapterId(activeContext.activeChapterId);
    }
    if (activeContext?.activeMeetingId) {
      setSelectedMeetingId(activeContext.activeMeetingId);
    }
  }, [
    activeContext?.activeProjectId,
    activeContext?.activeClassSubjectId,
    activeContext?.activeChapterId,
    activeContext?.activeMeetingId
  ]);

  // Resolusi data terpilih
  const currentProject = learningProjects.find(p => p.id === selectedProjectId) || learningProjects[0];
  const currentClassSubject = currentProject?.classSubjects.find(cs => cs.id === selectedClassSubjectId) || currentProject?.classSubjects[0];
  const currentChapter = currentClassSubject?.chapters.find(ch => ch.id === selectedChapterId) || currentClassSubject?.chapters[0];
  const currentMeeting = currentChapter?.meetings.find(m => m.id === selectedMeetingId) || currentChapter?.meetings[0];

  const handleApplyMeetingSelection = () => {
    if (currentProject && currentClassSubject && currentChapter && currentMeeting && onSelectMeetingContext) {
      onSelectMeetingContext(currentProject, currentClassSubject, currentChapter, currentMeeting);
    }
  };

  const hasProjects = learningProjects && learningProjects.length > 0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
      {/* 1. Header & Switcher Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Sumber Data Pembelajaran • {productTitle}
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
            Pilih Sumber Data untuk {productTitle}
          </h2>
        </div>

        {/* Segmented Controller Mode Sumber */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onModeChange('project')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'project'
                ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100/50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Gunakan Proyek Saya</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('manual')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'manual'
                ? 'bg-white text-teal-700 shadow-xs border border-teal-100/50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Buat Secara Manual</span>
          </button>
        </div>
      </div>

      {/* 2A. MODE PROYEK SAYA */}
      {currentMode === 'project' && (
        <div className="space-y-4">
          {!hasProjects ? (
            /* Empty State: Belum Ada Proyek */
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <FolderPlus className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-sm font-bold text-amber-950">
                  Belum Ada Proyek Pembelajaran
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Anda belum memiliki proyek pembelajaran di Proyek Saya. Anda dapat membuat proyek baru untuk menyimpan data secara terpusat, atau beralih ke input manual untuk produk ini.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('buat_proyek')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Buat Proyek Baru</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onModeChange('manual')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  <span>Beralih ke Input Manual</span>
                </button>
              </div>
            </div>
          ) : (
            /* Selector Dropdown Hierarki Proyek -> Bab -> Pertemuan */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
                {/* 1. Pilih Proyek */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    1. Proyek Pembelajaran
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => {
                      const newProjId = e.target.value;
                      setSelectedProjectId(newProjId);
                      const proj = learningProjects.find(p => p.id === newProjId);
                      const cs = proj?.classSubjects[0];
                      const ch = cs?.chapters[0];
                      const m = ch?.meetings[0];
                      setSelectedClassSubjectId(cs?.id || '');
                      setSelectedChapterId(ch?.id || '');
                      setSelectedMeetingId(m?.id || '');
                      if (proj && cs && ch && m && onSelectMeetingContext) {
                        onSelectMeetingContext(proj, cs, ch, m);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                  >
                    {learningProjects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.classSubjects[0]?.subject || 'Pelajaran'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Pilih Bab / Teks */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    2. Bab / Teks Pokok
                  </label>
                  <select
                    value={selectedChapterId}
                    onChange={(e) => {
                      const newChId = e.target.value;
                      setSelectedChapterId(newChId);
                      const ch = currentClassSubject?.chapters.find(c => c.id === newChId);
                      const m = ch?.meetings[0];
                      setSelectedMeetingId(m?.id || '');
                      if (currentProject && currentClassSubject && ch && m && onSelectMeetingContext) {
                        onSelectMeetingContext(currentProject, currentClassSubject, ch, m);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                  >
                    {currentClassSubject?.chapters.map(ch => (
                      <option key={ch.id} value={ch.id}>
                        {ch.chapterNumber}: {ch.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Pilih Pertemuan */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    3. Pertemuan Pembelajaran
                  </label>
                  <select
                    value={selectedMeetingId}
                    onChange={(e) => {
                      const newMId = e.target.value;
                      setSelectedMeetingId(newMId);
                      const m = currentChapter?.meetings.find(me => me.id === newMId);
                      if (currentProject && currentClassSubject && currentChapter && m && onSelectMeetingContext) {
                        onSelectMeetingContext(currentProject, currentClassSubject, currentChapter, m);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                  >
                    {currentChapter?.meetings.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.meetingNumber}: {m.title || m.masterLearningData?.materiDiajarkan || 'Pertemuan'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ringkasan Master Learning Data Sumber */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                      📌 Data Sumber Terpilih
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {currentMeeting?.meetingNumber || 'Pertemuan'} • {currentClassSubject?.grade} ({currentClassSubject?.subject})
                    </span>
                    {currentMeeting?.masterLearningData?.version && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200">
                        v{currentMeeting.masterLearningData.version}
                      </span>
                    )}
                  </div>

                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('proyek_saya')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      <span>Kelola di Proyek Saya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100/70">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Materi yang Diajarkan
                    </span>
                    <span className="font-bold text-slate-900 line-clamp-1">
                      {currentMeeting?.masterLearningData?.materiDiajarkan || currentMeeting?.title || '(Belum diisi)'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100/70">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Fokus Tema / Kegiatan
                    </span>
                    <span className="font-bold text-slate-900 line-clamp-1">
                      {currentMeeting?.masterLearningData?.temaKegiatan || '(Belum diisi)'}
                    </span>
                  </div>
                </div>

                {/* Validasi Kelengkapan Data Pertemuan */}
                {(!currentMeeting?.masterLearningData?.materiDiajarkan || !currentMeeting?.masterLearningData?.cakupanMateri) && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Perhatian: Komponen pertemuan ini belum lengkap.</span>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Materi yang diajarkan atau cakupan materi pada pertemuan ini masih kosong di Master Learning Data. Anda dapat melengkapinya di menu Proyek Saya atau beralih ke input manual untuk produk ini.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2B. MODE BUAT SECARA MANUAL */}
      {currentMode === 'manual' && (
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <PenLine className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-teal-950">
                Mode Input Mandiri (Tanpa Kaitan Proyek)
              </h4>
              <p className="text-xs text-teal-800 leading-relaxed mt-0.5">
                Anda dapat mengisi data pembelajaran, topik, dan cakupan langsung pada form di bawah. Data ini tidak akan mengubah atau menimpa data di Proyek Saya.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
