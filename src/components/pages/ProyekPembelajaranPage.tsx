import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Calendar,
  GraduationCap,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  Lock,
  Layers,
  FileText,
  Presentation,
  Palette,
  Check,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Award,
  ArrowRight,
  Coins,
  RefreshCw,
  Sliders,
  CheckSquare
} from 'lucide-react';
import {
  InfographicDraft,
  NavigationTab,
  LearningProject,
  ClassSubjectNode,
  ChapterNode,
  MeetingSession,
  MasterLearningData,
  ActiveLearningContext,
  EducationLevel,
  MeetingStatus,
  ProductLifecycleStatus,
  FEATURE_COSTS
} from '../../types';
import {
  updateMeetingMasterLearningData,
  updateMeetingStatus,
  updateMeetingProductState,
  syncMeetingToCurrentDraft
} from '../../services/learningProjectService';
import { suggestLearningObjectives } from '../../services/stiviaThinkingFramework';

interface ProyekPembelajaranPageProps {
  projects: InfographicDraft[];
  learningProjects: LearningProject[];
  activeContext: ActiveLearningContext;
  onUpdateLearningProjects: (projects: LearningProject[]) => void;
  onUpdateActiveContext: (context: ActiveLearningContext) => void;
  onSelectMeetingProduct: (
    productTab: NavigationTab,
    meeting: MeetingSession,
    chapter: ChapterNode,
    classSubject: ClassSubjectNode,
    project: LearningProject
  ) => void;
  onSelectLegacyProject: (project: InfographicDraft, targetTab: 'buat' | 'hasil' | 'preview') => void;
  onDeleteLegacyProject: (projectId: string) => void;
  onDuplicateLegacyProject: (project: InfographicDraft) => void;
  onNavigate: (tab: NavigationTab) => void;
  onSaveToast: (msg: string) => void;
}

export const ProyekPembelajaranPage: React.FC<ProyekPembelajaranPageProps> = ({
  projects,
  learningProjects,
  activeContext,
  onUpdateLearningProjects,
  onUpdateActiveContext,
  onSelectMeetingProduct,
  onSelectLegacyProject,
  onDeleteLegacyProject,
  onDuplicateLegacyProject,
  onNavigate,
  onSaveToast
}) => {
  // Mode Tampilan: 'hierarki' (Sistem Proyek & Pertemuan Baru) atau 'legacy' (Arsip Draft Lama)
  const [activeMainTab, setActiveMainTab] = useState<'hierarki' | 'legacy'>('hierarki');

  // Resolusi Objek Aktif
  const activeProject = learningProjects.find(p => p.id === activeContext.activeProjectId) || learningProjects[0];
  const activeClassSubject = activeProject?.classSubjects.find(cs => cs.id === activeContext.activeClassSubjectId) || activeProject?.classSubjects[0];
  const activeChapter = activeClassSubject?.chapters.find(ch => ch.id === activeContext.activeChapterId) || activeClassSubject?.chapters[0];
  const activeMeeting = activeChapter?.meetings.find(m => m.id === activeContext.activeMeetingId) || activeChapter?.meetings[0];

  // ==========================================================================
  // STATE MASTER LEARNING DATA FORM (UNTUK PERTEMUAN AKTIF)
  // ==========================================================================
  const [temaKegiatan, setTemaKegiatan] = useState<string>('');
  const [materiDiajarkan, setMateriDiajarkan] = useState<string>('');
  const [cakupanMateri, setCakupanMateri] = useState<string>('');
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [newObjectiveInput, setNewObjectiveInput] = useState<string>('');
  const [userNotes, setUserNotes] = useState<string>('');
  const [isSuggestingObjectives, setIsSuggestingObjectives] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ tema?: string; materi?: string; cakupan?: string }>({});

  // Modal Tambah Entitas
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectYear, setNewProjectYear] = useState('2026/2027');
  const [newProjectSemester, setNewProjectSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassLevel, setNewClassLevel] = useState<EducationLevel>('SMP');
  const [newClassGrade, setNewClassGrade] = useState('Kelas VIII');
  const [newClassSubject, setNewClassSubject] = useState('Bahasa Indonesia');

  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterNumber, setNewChapterNumber] = useState('Bab 3');
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [newMeetingNumber, setNewMeetingNumber] = useState('Pertemuan 3');
  const [newMeetingTitle, setNewMeetingTitle] = useState('');

  // Search & Filter untuk Legacy Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'completed'>('all');

  // Sinkronisasi data form ketika activeMeeting berubah
  useEffect(() => {
    if (activeMeeting) {
      const mld = activeMeeting.masterLearningData;
      setTemaKegiatan(mld.temaKegiatan || '');
      setMateriDiajarkan(mld.materiDiajarkan || '');
      setCakupanMateri(mld.cakupanMateri || '');
      setLearningObjectives(mld.learningObjectives || []);
      setUserNotes(mld.userNotes || '');
      setFormErrors({});
    }
  }, [activeMeeting?.id]);

  // Handler Simpan Master Learning Data
  const handleSaveMasterContext = () => {
    const errors: { tema?: string; materi?: string; cakupan?: string } = {};
    if (!temaKegiatan.trim()) errors.tema = 'Tema kegiatan pembelajaran wajib diisi.';
    if (!materiDiajarkan.trim()) errors.materi = 'Materi yang diajarkan wajib diisi.';
    if (!cakupanMateri.trim()) errors.cakupan = 'Cakupan materi wajib diisi.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      onSaveToast('Mohon lengkapi seluruh field wajib Master Learning Data.');
      return;
    }

    if (!activeMeeting) return;

    const updated = updateMeetingMasterLearningData(learningProjects, activeMeeting.id, {
      temaKegiatan: temaKegiatan.trim(),
      materiDiajarkan: materiDiajarkan.trim(),
      cakupanMateri: cakupanMateri.trim(),
      learningObjectives,
      userNotes: userNotes.trim()
    });

    onUpdateLearningProjects(updated);
    setFormErrors({});
    onSaveToast('Master Learning Data berhasil disimpan! Siap digunakan oleh semua produk.');
  };

  // Handler Tambah Tujuan Pembelajaran Manual
  const handleAddObjective = () => {
    if (!newObjectiveInput.trim()) return;
    setLearningObjectives(prev => [...prev, newObjectiveInput.trim()]);
    setNewObjectiveInput('');
  };

  const handleRemoveObjective = (index: number) => {
    setLearningObjectives(prev => prev.filter((_, i) => i !== index));
  };

  // Handler Rekomendasi AI Tujuan Pembelajaran
  const handleSuggestObjectives = () => {
    if (!materiDiajarkan.trim()) {
      onSaveToast('Isi materi yang diajarkan terlebih dahulu untuk rekomendasi AI.');
      return;
    }
    setIsSuggestingObjectives(true);
    setTimeout(() => {
      try {
        const suggested = suggestLearningObjectives(
          materiDiajarkan,
          activeClassSubject?.subject || 'Bahasa Indonesia',
          activeClassSubject?.grade || 'Kelas VIII'
        );
        if (suggested && suggested.length > 0) {
          setLearningObjectives(suggested);
          onSaveToast('Tujuan pembelajaran berhasil direkomendasikan.');
        }
      } catch (err) {
        console.warn('Gagal merekomendasikan tujuan:', err);
      } finally {
        setIsSuggestingObjectives(false);
      }
    }, 400);
  };

  // Handler Status Pertemuan (Lifecycle)
  const handleChangeMeetingStatus = (newStatus: MeetingStatus) => {
    if (!activeMeeting) return;
    const updated = updateMeetingStatus(learningProjects, activeMeeting.id, newStatus);
    onUpdateLearningProjects(updated);
    if (newStatus === 'completed') {
      onSaveToast(`Pertemuan ${activeMeeting.meetingNumber} ditandai selesai diajarkan.`);
    } else {
      onSaveToast(`Status pertemuan diperbarui menjadi: ${newStatus}`);
    }
  };

  // Handler Buat Proyek Baru
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const now = new Date().toISOString().split('T')[0];
    const newProj: LearningProject = {
      id: `lp-${Date.now()}`,
      name: newProjectName.trim(),
      academicYear: newProjectYear,
      semester: newProjectSemester,
      createdAt: now,
      updatedAt: now,
      classSubjects: [
        {
          id: `cs-${Date.now()}`,
          educationLevel: 'SMP',
          grade: 'Kelas VIII',
          subject: 'Bahasa Indonesia',
          createdAt: now,
          updatedAt: now,
          chapters: [
            {
              id: `ch-${Date.now()}`,
              chapterNumber: 'Bab 1',
              title: 'Pengenalan Materi Awal',
              createdAt: now,
              updatedAt: now,
              meetings: [
                {
                  id: `meet-${Date.now()}`,
                  meetingNumber: 'Pertemuan 1',
                  title: 'Konsep Dasar',
                  status: 'draft',
                  createdAt: now,
                  updatedAt: now,
                  masterLearningData: {
                    temaKegiatan: 'Konsep Dasar Pembelajaran',
                    materiDiajarkan: 'Konsep Dasar Pembelajaran',
                    cakupanMateri: '1. Pengantar dan definisi.\n2. Ciri pokok.\n3. Contoh pengenalan.',
                    learningObjectives: ['Memahami konsep dasar materi secara tepat.'],
                    version: 1,
                    updatedAt: now
                  },
                  productStates: {
                    material: 'not_started',
                    infographic: 'not_started',
                    lkpd: 'not_started',
                    presentation: 'not_started',
                    assessment_harian: 'not_started',
                    assessment_sumatif: 'not_started'
                  }
                }
              ]
            }
          ]
        }
      ]
    };

    const updatedProjects = [newProj, ...learningProjects];
    onUpdateLearningProjects(updatedProjects);
    onUpdateActiveContext({
      activeProjectId: newProj.id,
      activeClassSubjectId: newProj.classSubjects[0].id,
      activeChapterId: newProj.classSubjects[0].chapters[0].id,
      activeMeetingId: newProj.classSubjects[0].chapters[0].meetings[0].id
    });
    setShowAddProjectModal(false);
    setNewProjectName('');
    onSaveToast('Proyek pembelajaran baru berhasil dibuat!');
  };

  // Handler Tambah Kelas Baru pada Proyek Aktif
  const handleAddClass = () => {
    if (!activeProject) return;
    const now = new Date().toISOString().split('T')[0];
    const newClass: ClassSubjectNode = {
      id: `cs-${Date.now()}`,
      educationLevel: newClassLevel,
      grade: newClassGrade,
      subject: newClassSubject,
      createdAt: now,
      updatedAt: now,
      chapters: [
        {
          id: `ch-${Date.now()}`,
          chapterNumber: 'Bab 1',
          title: `Bab 1: Pengantar ${newClassSubject}`,
          createdAt: now,
          updatedAt: now,
          meetings: [
            {
              id: `meet-${Date.now()}`,
              meetingNumber: 'Pertemuan 1',
              title: 'Pengantar Materi',
              status: 'draft',
              createdAt: now,
              updatedAt: now,
              masterLearningData: {
                temaKegiatan: `Pengantar ${newClassSubject}`,
                materiDiajarkan: `Konsep Dasar ${newClassSubject}`,
                cakupanMateri: '1. Definisi dan ruang lingkup.\n2. Manfaat dan aplikasi nyata.',
                version: 1,
                updatedAt: now
              },
              productStates: {
                material: 'not_started',
                infographic: 'not_started',
                lkpd: 'not_started',
                presentation: 'not_started',
                assessment_harian: 'not_started',
                assessment_sumatif: 'not_started'
              }
            }
          ]
        }
      ]
    };

    const updated = learningProjects.map(p => {
      if (p.id !== activeProject.id) return p;
      return {
        ...p,
        updatedAt: now,
        classSubjects: [...p.classSubjects, newClass]
      };
    });

    onUpdateLearningProjects(updated);
    onUpdateActiveContext({
      ...activeContext,
      activeClassSubjectId: newClass.id,
      activeChapterId: newClass.chapters[0].id,
      activeMeetingId: newClass.chapters[0].meetings[0].id
    });
    setShowAddClassModal(false);
    onSaveToast(`Kelas ${newClassGrade} (${newClassSubject}) berhasil ditambahkan.`);
  };

  // Handler Tambah Bab Baru
  const handleAddChapter = () => {
    if (!activeProject || !activeClassSubject) return;
    if (!newChapterTitle.trim()) return;
    const now = new Date().toISOString().split('T')[0];

    const newChapter: ChapterNode = {
      id: `ch-${Date.now()}`,
      chapterNumber: newChapterNumber.trim(),
      title: `${newChapterNumber.trim()}: ${newChapterTitle.trim()}`,
      createdAt: now,
      updatedAt: now,
      meetings: [
        {
          id: `meet-${Date.now()}`,
          meetingNumber: 'Pertemuan 1',
          title: newChapterTitle.trim(),
          status: 'draft',
          createdAt: now,
          updatedAt: now,
          masterLearningData: {
            temaKegiatan: newChapterTitle.trim(),
            materiDiajarkan: newChapterTitle.trim(),
            cakupanMateri: '1. Pengantar konsep.\n2. Ciri utama.\n3. Contoh dan latihan.',
            version: 1,
            updatedAt: now
          },
          productStates: {
            material: 'not_started',
            infographic: 'not_started',
            lkpd: 'not_started',
            presentation: 'not_started',
            assessment_harian: 'not_started',
            assessment_sumatif: 'not_started'
          }
        }
      ]
    };

    const updated = learningProjects.map(p => {
      if (p.id !== activeProject.id) return p;
      return {
        ...p,
        classSubjects: p.classSubjects.map(cs => {
          if (cs.id !== activeClassSubject.id) return cs;
          return {
            ...cs,
            chapters: [...cs.chapters, newChapter]
          };
        })
      };
    });

    onUpdateLearningProjects(updated);
    onUpdateActiveContext({
      ...activeContext,
      activeChapterId: newChapter.id,
      activeMeetingId: newChapter.meetings[0].id
    });
    setShowAddChapterModal(false);
    setNewChapterTitle('');
    onSaveToast(`Bab baru berhasil ditambahkan.`);
  };

  // Handler Tambah Pertemuan Baru
  const handleAddMeeting = () => {
    if (!activeProject || !activeClassSubject || !activeChapter) return;
    if (!newMeetingTitle.trim()) return;
    const now = new Date().toISOString().split('T')[0];

    const newMeeting: MeetingSession = {
      id: `meet-${Date.now()}`,
      meetingNumber: newMeetingNumber.trim(),
      title: newMeetingTitle.trim(),
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      masterLearningData: {
        temaKegiatan: newMeetingTitle.trim(),
        materiDiajarkan: newMeetingTitle.trim(),
        cakupanMateri: '1. Pengantar pertemuan.\n2. Pembahasan materi pokok.\n3. Rangkuman dan refleksi.',
        version: 1,
        updatedAt: now
      },
      productStates: {
        material: 'not_started',
        infographic: 'not_started',
        lkpd: 'not_started',
        presentation: 'not_started',
        assessment_harian: 'not_started',
        assessment_sumatif: 'not_started'
      }
    };

    const updated = learningProjects.map(p => {
      if (p.id !== activeProject.id) return p;
      return {
        ...p,
        classSubjects: p.classSubjects.map(cs => {
          if (cs.id !== activeClassSubject.id) return cs;
          return {
            ...cs,
            chapters: cs.chapters.map(ch => {
              if (ch.id !== activeChapter.id) return ch;
              return {
                ...ch,
                meetings: [...ch.meetings, newMeeting]
              };
            })
          };
        })
      };
    });

    onUpdateLearningProjects(updated);
    onUpdateActiveContext({
      ...activeContext,
      activeMeetingId: newMeeting.id
    });
    setShowAddMeetingModal(false);
    setNewMeetingTitle('');
    onSaveToast(`${newMeetingNumber} berhasil ditambahkan!`);
  };

  // Filter untuk Legacy Drafts
  const filteredLegacyProjects = projects.filter(proj => {
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.theme.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' ? true : proj.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto pb-24 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner Utama */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fondasi Pembelajaran Berbasis Proyek</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Proyek & Ruang Belajar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Tentukan hierarki pembelajaran sekali, lalu hasilkan seluruh produk secara konsisten melalui Master Learning Data.
          </p>
        </div>

        {/* Tab Switcher: Hierarki Baru vs Arsip Lama */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMainTab('hierarki')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'hierarki'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Struktur Proyek & Pertemuan</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('legacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'legacy'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Arsip Rancangan Lama ({projects.length})</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAMPILAN 1: HIERARKI PROYEK -> KELAS -> MAPEL -> BAB -> PERTEMUAN   */}
      {/* ==================================================================== */}
      {activeMainTab === 'hierarki' && (
        <div className="space-y-6">
          {/* LEVEL 1 & 2: PILIH PROYEK DAN PILIH KELAS & MAPEL */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              {/* Selector Proyek */}
              <div className="flex-1 min-w-0">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                  1. Pilih Proyek Pembelajaran
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={activeProject?.id || ''}
                    onChange={(e) => {
                      const proj = learningProjects.find(p => p.id === e.target.value);
                      if (proj) {
                        onUpdateActiveContext({
                          activeProjectId: proj.id,
                          activeClassSubjectId: proj.classSubjects[0]?.id,
                          activeChapterId: proj.classSubjects[0]?.chapters[0]?.id,
                          activeMeetingId: proj.classSubjects[0]?.chapters[0]?.meetings[0]?.id
                        });
                      }
                    }}
                    className="flex-1 max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-sm font-bold focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                  >
                    {learningProjects.map(p => (
                      <option key={p.id} value={p.id}>
                        📁 {p.name} {p.academicYear ? `(${p.academicYear})` : ''}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowAddProjectModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Proyek Baru</span>
                  </button>
                </div>
              </div>

              {/* Info Singkat Lembaga */}
              <div className="text-left md:text-right text-xs text-slate-500 shrink-0">
                <p className="font-bold text-slate-800">{activeProject?.schoolName || 'Sekolah Penggerak STIVIA'}</p>
                <p className="text-[11px] text-slate-400">Guru: {activeProject?.teacherName || 'Pendidik STIVIA'}</p>
              </div>
            </div>

            {/* LEVEL 2: PILIH KELAS & MAPEL */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  2. Pilih Kelas & Mata Pelajaran
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah Kelas/Mapel</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeProject?.classSubjects.map(cs => {
                  const isActive = cs.id === activeClassSubject?.id;
                  return (
                    <button
                      key={cs.id}
                      type="button"
                      onClick={() => {
                        onUpdateActiveContext({
                          ...activeContext,
                          activeClassSubjectId: cs.id,
                          activeChapterId: cs.chapters[0]?.id,
                          activeMeetingId: cs.chapters[0]?.meetings[0]?.id
                        });
                      }}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                        isActive
                          ? 'bg-[#3b49df] text-white border-[#3b49df] shadow-md shadow-indigo-600/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <GraduationCap className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{cs.educationLevel} • {cs.grade}</span>
                      <span className="opacity-50">|</span>
                      <span>{cs.subject}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LEVEL 3 & 4: PILIH BAB/TEKS DAN PILIH PERTEMUAN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-3 border-t border-slate-100">
              {/* Kolom Kiri: Daftar Bab */}
              <div className="lg:col-span-5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    3. Bab / Teks Pembahasan
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddChapterModal(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Bab</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {activeClassSubject?.chapters.map(ch => {
                    const isActive = ch.id === activeChapter?.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          onUpdateActiveContext({
                            ...activeContext,
                            activeChapterId: ch.id,
                            activeMeetingId: ch.meetings[0]?.id
                          });
                        }}
                        className={`w-full text-left p-3 rounded-2xl text-xs transition-all flex items-center justify-between border cursor-pointer ${
                          isActive
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">
                            {ch.chapterNumber}
                          </span>
                          <span className="truncate block font-semibold">{ch.title}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 font-bold">
                          {ch.meetings.length} Pertemuan
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kolom Kanan: Daftar Pertemuan pada Bab Terpilih */}
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    4. Pertemuan Pembelajaran
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddMeetingModal(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Pertemuan</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {activeChapter?.meetings.map(m => {
                    const isActive = m.id === activeMeeting?.id;
                    const statusBadgeColor =
                      m.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : m.status === 'ready'
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                        : m.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300';

                    const statusLabel =
                      m.status === 'completed'
                        ? 'Selesai'
                        : m.status === 'ready'
                        ? 'Siap'
                        : m.status === 'in_progress'
                        ? 'Menyusun'
                        : 'Draf';

                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          onUpdateActiveContext({
                            ...activeContext,
                            activeMeetingId: m.id
                          });
                        }}
                        className={`text-left p-3.5 rounded-2xl text-xs transition-all border flex flex-col justify-between gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-[#3b49df] text-white border-[#3b49df] shadow-md shadow-indigo-600/20'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`font-black uppercase tracking-wider text-[11px] ${isActive ? 'text-indigo-100' : 'text-[#3b49df]'}`}>
                            {m.meetingNumber}
                          </span>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                            isActive ? 'bg-white/20 text-white border-white/30' : statusBadgeColor
                          }`}>
                            {statusLabel}
                          </span>
                        </div>
                        <p className={`line-clamp-2 font-semibold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                          {m.masterLearningData.materiDiajarkan || m.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* LEVEL 5: MASTER LEARNING DATA EDITOR (SINGLE SOURCE OF TRUTH)     */}
          {/* ================================================================ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#3b49df] shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Single Source of Learning Truth
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Versi Master: v{activeMeeting?.masterLearningData.version || 1}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                    Master Learning Data — {activeMeeting?.meetingNumber}
                  </h2>
                </div>
              </div>

              {/* Status Pertemuan Selector & Aksi Selesai */}
              <div className="flex items-center gap-2">
                {activeMeeting?.status === 'completed' ? (
                  <button
                    type="button"
                    onClick={() => handleChangeMeetingStatus('ready')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pertemuan Selesai Diajarkan</span>
                    <span className="text-[10px] text-emerald-600 underline ml-1">(Buka Kembali)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleChangeMeetingStatus('completed')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <CheckSquare className="w-4 h-4 text-slate-500" />
                    <span>Tandai Selesai Diajarkan</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveMasterContext}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3b49df] hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Master Data</span>
                </button>
              </div>
            </div>

            {/* FORM 3 DATA UTAMA MASTER LEARNING DATA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DATA 1: TEMA KEGIATAN PEMBELAJARAN */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>1. Tema Kegiatan Pembelajaran <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] font-normal text-slate-400">Fokus aktivitas pertemuan</span>
                </label>
                <textarea
                  rows={2}
                  value={temaKegiatan}
                  onChange={(e) => {
                    setTemaKegiatan(e.target.value);
                    if (formErrors.tema) setFormErrors(prev => ({ ...prev, tema: undefined }));
                  }}
                  placeholder="Misal: Slogan, Kalimat Persuasif, dan Naskah Iklan"
                  className={`w-full p-3.5 rounded-2xl bg-slate-50/70 border text-xs sm:text-sm font-medium focus:bg-white focus:outline-hidden transition-all ${
                    formErrors.tema ? 'border-rose-300 bg-rose-50/30 ring-2 ring-rose-100' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {formErrors.tema && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.tema}</span>
                  </p>
                )}
              </div>

              {/* DATA 2: MATERI YANG DIAJARKAN */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>2. Materi yang Diajarkan <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] font-normal text-slate-400">Materi pokok yang disampaikan</span>
                </label>
                <textarea
                  rows={2}
                  value={materiDiajarkan}
                  onChange={(e) => {
                    setMateriDiajarkan(e.target.value);
                    if (formErrors.materi) setFormErrors(prev => ({ ...prev, materi: undefined }));
                  }}
                  placeholder="Misal: Slogan, kalimat persuasif, dan naskah iklan"
                  className={`w-full p-3.5 rounded-2xl bg-slate-50/70 border text-xs sm:text-sm font-medium focus:bg-white focus:outline-hidden transition-all ${
                    formErrors.materi ? 'border-rose-300 bg-rose-50/30 ring-2 ring-rose-100' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {formErrors.materi && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.materi}</span>
                  </p>
                )}
              </div>
            </div>

            {/* DATA 3: CAKUPAN MATERI (BAGIAN-BAGIAN MATERI YANG DIBAHAS) */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>3. Cakupan Materi (Bagian-Bagian Pembahasan) <span className="text-rose-500">*</span></span>
                <span className="text-[10px] font-normal text-slate-400">Gunakan penomoran 1, 2, 3...</span>
              </label>
              <textarea
                rows={5}
                value={cakupanMateri}
                onChange={(e) => {
                  setCakupanMateri(e.target.value);
                  if (formErrors.cakupan) setFormErrors(prev => ({ ...prev, cakupan: undefined }));
                }}
                placeholder="1. Pengertian dan fungsi iklan di era media digital.&#10;2. Ciri bahasa persuasif dalam slogan dan poster.&#10;3. Unsur utama pembentuk iklan yang efektif.&#10;4. Contoh analisis perbandingan iklan komersial vs layanan masyarakat.&#10;5. Penyusunan naskah iklan informatif."
                className={`w-full p-3.5 rounded-2xl bg-slate-50/70 border text-xs sm:text-sm font-mono leading-relaxed focus:bg-white focus:outline-hidden transition-all ${
                  formErrors.cakupan ? 'border-rose-300 bg-rose-50/30 ring-2 ring-rose-100' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              {formErrors.cakupan && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.cakupan}</span>
                </p>
              )}
            </div>

            {/* TUJUAN PEMBELAJARAN (EDITOR + REKOMENDASI AI) */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Tujuan Pembelajaran Master (Pedoman Bersama)</span>
                </label>

                <button
                  type="button"
                  onClick={handleSuggestObjectives}
                  disabled={isSuggestingObjectives}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold cursor-pointer transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isSuggestingObjectives ? 'Menganalisis...' : 'Rekomendasi AI'}</span>
                </button>
              </div>

              {/* Daftar Tujuan Pembelajaran */}
              <div className="space-y-2">
                {learningObjectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
                    <span className="font-bold text-[#3b49df] mt-0.5">{idx + 1}.</span>
                    <span className="flex-1 text-slate-700 leading-relaxed">{obj}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Input Tambah Manual */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newObjectiveInput}
                    onChange={(e) => setNewObjectiveInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddObjective();
                      }
                    }}
                    placeholder="Ketik tujuan pembelajaran baru dan tekan Tambah..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>

            {/* CATATAN PEDAGOGIS GURU (OPSIONAL) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Catatan Pedagogis Guru (Opsional)</span>
                <span className="text-[10px] font-normal text-slate-400">Instruksi khusus untuk gaya atau penekanan materi</span>
              </label>
              <textarea
                rows={2}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Misal: Gunakan studi kasus lokal di lingkungan sekolah siswa..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* ================================================================ */}
          {/* LEVEL 6: HUB PRODUK PEMBELAJARAN (1 PERTEMUAN -> BANYAK PRODUK)   */}
          {/* ================================================================ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Studio Produk Pembelajaran
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  Produk untuk {activeMeeting?.meetingNumber}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Pilih produk yang ingin digenerate menggunakan Master Learning Data di atas.
              </p>
            </div>

            {/* 5 KARTU PRODUK PEMBELAJARAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* PRODUK 1: DOKUMEN MATERI A4 */}
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-500" />
                      <span>{FEATURE_COSTS.material} Saldo</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Dokumen Materi A4</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Modul bahan ajar siap cetak, struktur A4 rapi, uji pemahaman, dan ekspor DOCX.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (activeMeeting && activeChapter && activeClassSubject && activeProject) {
                      onSelectMeetingProduct('materi', activeMeeting, activeChapter, activeClassSubject, activeProject);
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <span>Buka Studio Materi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* PRODUK 2: INFOGRAFIS */}
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Palette className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-500" />
                      <span>{FEATURE_COSTS.infographic} Saldo</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Infografis Edukatif</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Prompt visual infografis 7 Tahap Berpikir Pedagogis STIVIA siap salin ke image AI.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (activeMeeting && activeChapter && activeClassSubject && activeProject) {
                      onSelectMeetingProduct('infografis', activeMeeting, activeChapter, activeClassSubject, activeProject);
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#3b49df] hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <span>Buka Studio Infografis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* PRODUK 3: LKPD (POSTER LKPD) */}
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-500" />
                      <span>{FEATURE_COSTS.lkpd} Saldo</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Lembar Kerja Siswa (LKPD)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Blueprint aktivitas kognitif, lembar stimulus, dan poster LKPD siap pakai.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (activeMeeting && activeChapter && activeClassSubject && activeProject) {
                      onSelectMeetingProduct('lkpd', activeMeeting, activeChapter, activeClassSubject, activeProject);
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <span>Buka Studio LKPD</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* PRODUK 4: PRESENTASI GAMMA AI */}
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Presentation className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-500" />
                      <span>{FEATURE_COSTS.presentation} Saldo</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Presentasi (10 Slide)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Struktur 10 slide Gamma AI teradaptasi dari Master Context untuk paparan kelas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (activeMeeting && activeChapter && activeClassSubject && activeProject) {
                      onSelectMeetingProduct('presentasi', activeMeeting, activeChapter, activeClassSubject, activeProject);
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <span>Buka Studio Presentasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* PRODUK 5: ASESMEN (HARIAN & SUMATIF) */}
              <div className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-500" />
                      <span>2 - 3 Saldo</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Asesmen Pembelajaran</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Kuis formatif harian per pertemuan atau asesmen sumatif capaian akhir bab.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeMeeting && activeChapter && activeClassSubject && activeProject) {
                        onSelectMeetingProduct('asesmen_harian', activeMeeting, activeChapter, activeClassSubject, activeProject);
                      }
                    }}
                    className="px-2.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold text-center cursor-pointer transition-colors"
                  >
                    Harian (2)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeMeeting && activeChapter && activeClassSubject && activeProject) {
                        onSelectMeetingProduct('asesmen_sumatif', activeMeeting, activeChapter, activeClassSubject, activeProject);
                      }
                    }}
                    className="px-2.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold text-center cursor-pointer transition-colors"
                  >
                    Sumatif (3)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAMPILAN 2: ARSIP DRAFT LAMA (100% BACKWARD COMPATIBLE)              */}
      {/* ==================================================================== */}
      {activeMainTab === 'legacy' && (
        <div className="space-y-6">
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau mata pelajaran..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'draft', label: 'Rancangan' },
                { id: 'completed', label: 'Selesai' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterStatus === tab.id
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Proyek Lama */}
          {filteredLegacyProjects.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  Tidak ada arsip yang cocok
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Seluruh rancangan tersimpan di penyimpanan lokal dan aman.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLegacyProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-indigo-200 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className={`h-28 bg-gradient-to-br ${project.thumbnailColor || 'from-indigo-600 to-indigo-800'} p-4 text-white flex flex-col justify-between relative overflow-hidden`}>
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-md">
                          {project.subject}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            project.status === 'completed' 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-amber-400 text-amber-950'
                          }`}>
                            {project.status === 'completed' ? 'Selesai' : 'Rancangan'}
                          </span>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <span className="text-[10px] text-white/80 font-medium">
                          {project.educationLevel} • {project.grade}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {project.learningObjective || project.theme}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{project.updatedAt || project.createdAt}</span>
                        <span className="font-semibold text-slate-600">{project.blocks?.length || 0} Blok</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDuplicateLegacyProject(project)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Duplikasi"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteLegacyProject(project.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onSelectLegacyProject(project, 'buat')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Draft</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: TAMBAH PROYEK BARU                                          */}
      {/* ==================================================================== */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Buat Proyek Pembelajaran Baru</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Proyek</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Misal: Bahasa Indonesia Semester Genap"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={newProjectYear}
                    onChange={(e) => setNewProjectYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={newProjectSemester}
                    onChange={(e) => setNewProjectSemester(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddProjectModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreateProject}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Simpan Proyek
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: TAMBAH KELAS & MAPEL                                        */}
      {/* ==================================================================== */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Tambah Kelas & Mata Pelajaran</h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenjang</label>
                  <select
                    value={newClassLevel}
                    onChange={(e) => setNewClassLevel(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                  >
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="SMK">SMK</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tingkat Kelas</label>
                  <input
                    type="text"
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value)}
                    placeholder="Misal: Kelas VII"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  placeholder="Misal: Ilmu Pengetahuan Alam (IPA)"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddClassModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddClass}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Tambah Kelas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: TAMBAH BAB                                                  */}
      {/* ==================================================================== */}
      {showAddChapterModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Tambah Bab / Teks Pembahasan</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Bab</label>
                <input
                  type="text"
                  value={newChapterNumber}
                  onChange={(e) => setNewChapterNumber(e.target.value)}
                  placeholder="Misal: Bab 3"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Bab / Teks</label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="Misal: Menggali Nilai Moral dalam Cerita Fantasi"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddChapterModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddChapter}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Tambah Bab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: TAMBAH PERTEMUAN                                            */}
      {/* ==================================================================== */}
      {showAddMeetingModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Tambah Pertemuan Pembelajaran</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Pertemuan</label>
                <input
                  type="text"
                  value={newMeetingNumber}
                  onChange={(e) => setNewMeetingNumber(e.target.value)}
                  placeholder="Misal: Pertemuan 3"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Fokus / Judul Pertemuan</label>
                <input
                  type="text"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  placeholder="Misal: Praktik Penulisan Naskah Iklan"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMeetingModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddMeeting}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Tambah Pertemuan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
