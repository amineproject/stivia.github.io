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
  ArrowUp,
  ArrowDown,
  Coins,
  RefreshCw,
  Sliders,
  CheckSquare,
  FolderPlus,
  Info
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
  FEATURE_COSTS,
  AssessmentType,
  AssessmentForm
} from '../../types';
import {
  updateMeetingMasterLearningData,
  updateMeetingMetadata,
  updateMeetingStatus,
  updateMeetingProductState,
  syncMeetingToCurrentDraft,
  insertMeetingIntoProject,
  removeMeetingFromProject,
  reorderMeetingInProject,
  deleteLearningMeetingFromSupabase,
  deleteLearningProjectFromSupabase
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
  onDeleteLearningProject?: (projectId: string) => void;
  onDeleteLearningMeeting?: (meetingId: string) => Promise<void> | void;
  onRefreshCloud?: () => Promise<void>;
  isCloudSyncing?: boolean;
  cloudSyncStatus?: 'synced' | 'local' | 'syncing' | 'error';
  userId?: string;
}

const ASSESSMENT_FORMS_LIST: { id: AssessmentForm; label: string; desc: string }[] = [
  { id: 'Pilihan Ganda', label: 'Pilihan Ganda', desc: 'Soal objektif dengan opsi jawaban' },
  { id: 'Benar-Salah', label: 'Benar-Salah', desc: 'Uji kebenaran pernyataan konsep' },
  { id: 'Menjodohkan', label: 'Menjodohkan', desc: 'Memasangkan istilah dengan konsep' },
  { id: 'Uraian', label: 'Uraian / Esai', desc: 'Pertanyaan pemahaman mendalam' },
  { id: 'Praktik', label: 'Praktik / Unjuk Kerja', desc: 'Aktivitas aksi terapan langsung' },
  { id: 'Proyek', label: 'Proyek', desc: 'Pembuatan produk nyata kontekstual' },
  { id: 'Observasi', label: 'Observasi', desc: 'Pengamatan sikap & proses belajar' },
  { id: 'Presentasi', label: 'Presentasi', desc: 'Paparan lisan hasil telaah' },
  { id: 'Self Assessment', label: 'Self Assessment', desc: 'Refleksi mandiri ketercapaian kompetensi' },
];

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
  onSaveToast,
  onDeleteLearningProject,
  onDeleteLearningMeeting,
  onRefreshCloud,
  isCloudSyncing = false,
  cloudSyncStatus = 'local',
  userId,
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
  const [reinforcementActivities, setReinforcementActivities] = useState<string>('');
  const [assessmentEnabled, setAssessmentEnabled] = useState<boolean>(false);
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('Formatif');
  const [assessmentForms, setAssessmentForms] = useState<AssessmentForm[]>(['Pilihan Ganda', 'Uraian']);
  const [assessmentNotes, setAssessmentNotes] = useState<string>('');
  const [isContinuation, setIsContinuation] = useState<boolean>(false);
  const [continuationFromMeetingId, setContinuationFromMeetingId] = useState<string>('');
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
  const [newMeetingPosition, setNewMeetingPosition] = useState<number>(1);
  const [newMeetingNumber, setNewMeetingNumber] = useState('Pertemuan 1');
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingTema, setNewMeetingTema] = useState('');
  const [newMeetingMateri, setNewMeetingMateri] = useState('');
  const [newMeetingCakupan, setNewMeetingCakupan] = useState('');
  const [newMeetingActivities, setNewMeetingActivities] = useState('');
  const [newMeetingAssessmentEnabled, setNewMeetingAssessmentEnabled] = useState(false);
  const [newMeetingAssessmentType, setNewMeetingAssessmentType] = useState<AssessmentType>('Formatif');
  const [newMeetingAssessmentForms, setNewMeetingAssessmentForms] = useState<AssessmentForm[]>(['Pilihan Ganda', 'Uraian']);
  const [newMeetingAssessmentNotes, setNewMeetingAssessmentNotes] = useState('');
  const [newMeetingIsContinuation, setNewMeetingIsContinuation] = useState(false);
  const [newMeetingContinuationId, setNewMeetingContinuationId] = useState('');
  const [newMeetingNotes, setNewMeetingNotes] = useState('');
  const [meetingFormErrors, setMeetingFormErrors] = useState<Record<string, string>>({});
  const [meetingToDelete, setMeetingToDelete] = useState<MeetingSession | null>(null);
  const [isDeletingMeeting, setIsDeletingMeeting] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<LearningProject | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState<boolean>(false);

  const handleOpenAddMeetingModal = () => {
    const nextIdx = (activeChapter?.meetings.length || 0) + 1;
    const lastMeeting = activeChapter?.meetings[activeChapter.meetings.length - 1];
    setNewMeetingPosition(nextIdx);
    setNewMeetingNumber(`Pertemuan ${nextIdx}`);
    setNewMeetingTitle('');
    setNewMeetingTema('');
    setNewMeetingMateri('');
    setNewMeetingCakupan('');
    setNewMeetingActivities('');
    setNewMeetingAssessmentEnabled(false);
    setNewMeetingAssessmentType('Formatif');
    setNewMeetingAssessmentForms(['Pilihan Ganda', 'Uraian']);
    setNewMeetingAssessmentNotes('');
    setNewMeetingIsContinuation(false);
    setNewMeetingContinuationId(lastMeeting?.id || '');
    setNewMeetingNotes('');
    setMeetingFormErrors({});
    setShowAddMeetingModal(true);
  };

  const handleFillSampleMeeting = () => {
    setNewMeetingTitle('Mengenal Teks Iklan');
    setNewMeetingTema('Memahami karakteristik teks iklan');
    setNewMeetingMateri('Pengertian, tujuan, fungsi, dan ciri-ciri iklan');
    setNewMeetingCakupan(
      '1. Pengertian, tujuan, dan fungsi sosial teks iklan.\n' +
      '2. Ciri-ciri bahasa persuasif dalam slogan dan poster iklan.\n' +
      '3. Unsur pembentuk naskah iklan (Headline, Body text, CTA).\n' +
      '4. Contoh analisis iklan komersial vs layanan masyarakat.'
    );
    setNewMeetingActivities('Diskusi kelompok membandingkan 2 contoh poster iklan, lalu latihan menganalisis 4 unsur pembentuknya.');
    setNewMeetingAssessmentEnabled(true);
    setNewMeetingAssessmentType('Formatif');
    setNewMeetingAssessmentForms(['Pilihan Ganda', 'Uraian']);
    setNewMeetingAssessmentNotes('Kuis 5 soal konsep iklan dan latihan analisis singkat.');
    setNewMeetingNotes('Fokus pada iklan komersial dan layanan masyarakat di media digital.');
    setMeetingFormErrors({});
  };

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
      setReinforcementActivities(mld.reinforcementActivities || '');
      setAssessmentEnabled(Boolean(mld.assessmentEnabled));
      setAssessmentType(mld.assessmentType || 'Formatif');
      setAssessmentForms(mld.assessmentForms && mld.assessmentForms.length > 0 ? mld.assessmentForms : ['Pilihan Ganda', 'Uraian']);
      setAssessmentNotes(mld.assessmentNotes || '');
      setUserNotes(mld.userNotes || '');
      setIsContinuation(Boolean(activeMeeting.isContinuation));
      setContinuationFromMeetingId(activeMeeting.continuationFromMeetingId || '');
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

    const contTargetMeeting = isContinuation && continuationFromMeetingId
      ? activeChapter?.meetings.find(m => m.id === continuationFromMeetingId)
      : undefined;

    let updated = updateMeetingMasterLearningData(learningProjects, activeMeeting.id, {
      temaKegiatan: temaKegiatan.trim(),
      materiDiajarkan: materiDiajarkan.trim(),
      cakupanMateri: cakupanMateri.trim(),
      learningObjectives,
      reinforcementActivities: reinforcementActivities.trim(),
      assessmentEnabled,
      assessmentType: assessmentEnabled ? assessmentType : undefined,
      assessmentForms: assessmentEnabled ? assessmentForms : undefined,
      assessmentNotes: assessmentEnabled ? assessmentNotes.trim() : undefined,
      userNotes: userNotes.trim()
    });

    updated = updateMeetingMetadata(updated, activeMeeting.id, {
      isContinuation,
      continuationFromMeetingId: isContinuation ? continuationFromMeetingId : undefined,
      continuationFromMeetingNumber: contTargetMeeting?.meetingNumber
    });

    onUpdateLearningProjects(updated);
    setFormErrors({});
    onSaveToast('Master Learning Data berhasil disimpan! Siap digunakan oleh seluruh produk.');
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

  // Handler Buat Proyek Baru (Wadah Pembelajaran)
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
              title: 'Bab 1',
              createdAt: now,
              updatedAt: now,
              meetings: [
                {
                  id: `meet-${Date.now()}`,
                  meetingNumber: 'Pertemuan 1',
                  title: 'Pertemuan 1 (Belum Diatur)',
                  status: 'draft',
                  createdAt: now,
                  updatedAt: now,
                  masterLearningData: {
                    temaKegiatan: '',
                    materiDiajarkan: '',
                    cakupanMateri: '',
                    learningObjectives: [],
                    userNotes: '',
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
    onSaveToast('Wadah proyek pembelajaran baru berhasil dibuat! Silakan tentukan bab dan pertemuan.');
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
          title: 'Bab 1',
          createdAt: now,
          updatedAt: now,
          meetings: [
            {
              id: `meet-${Date.now()}`,
              meetingNumber: 'Pertemuan 1',
              title: 'Pertemuan 1 (Belum Diatur)',
              status: 'draft',
              createdAt: now,
              updatedAt: now,
              masterLearningData: {
                temaKegiatan: '',
                materiDiajarkan: '',
                cakupanMateri: '',
                learningObjectives: [],
                userNotes: '',
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

  // Handler Tambah Bab Baru (Wadah Pembahasan)
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
          title: 'Pertemuan 1 (Belum Diatur)',
          status: 'draft',
          createdAt: now,
          updatedAt: now,
          masterLearningData: {
            temaKegiatan: '',
            materiDiajarkan: '',
            cakupanMateri: '',
            learningObjectives: [],
            userNotes: '',
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
    onSaveToast(`Bab "${newChapterTitle}" berhasil ditambahkan.`);
  };

  // Handler Tambah/Buat Pertemuan Baru (Unit Pembelajaran dengan Master Learning Data)
  const handleAddMeeting = () => {
    if (!activeProject || !activeClassSubject || !activeChapter) return;

    const errors: Record<string, string> = {};
    if (!newMeetingTitle.trim()) errors.title = 'Judul pertemuan wajib diisi.';
    if (!newMeetingTema.trim()) errors.tema = 'Tema pembelajaran wajib diisi.';
    if (!newMeetingMateri.trim()) errors.materi = 'Materi pelajaran wajib diisi.';
    if (!newMeetingCakupan.trim()) errors.cakupan = 'Cakupan materi wajib diisi.';

    if (Object.keys(errors).length > 0) {
      setMeetingFormErrors(errors);
      onSaveToast('Mohon lengkapi seluruh field wajib data pertemuan.');
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    // ID pertemuan permanen dan mandiri, tidak bergantung pada nomor pertemuan
    const meetingId = `meet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const contTarget = newMeetingIsContinuation && newMeetingContinuationId
      ? activeChapter.meetings.find(m => m.id === newMeetingContinuationId)
      : undefined;

    const newMeeting: MeetingSession = {
      id: meetingId,
      meetingNumber: `Pertemuan ${newMeetingPosition}`,
      title: newMeetingTitle.trim(),
      status: 'ready',
      isContinuation: newMeetingIsContinuation,
      continuationFromMeetingId: newMeetingIsContinuation ? newMeetingContinuationId : undefined,
      continuationFromMeetingNumber: contTarget?.meetingNumber,
      createdAt: now,
      updatedAt: now,
      masterLearningData: {
        temaKegiatan: newMeetingTema.trim(),
        materiDiajarkan: newMeetingMateri.trim(),
        cakupanMateri: newMeetingCakupan.trim(),
        learningObjectives: [],
        reinforcementActivities: newMeetingActivities.trim(),
        assessmentEnabled: newMeetingAssessmentEnabled,
        assessmentType: newMeetingAssessmentEnabled ? newMeetingAssessmentType : undefined,
        assessmentForms: newMeetingAssessmentEnabled ? newMeetingAssessmentForms : undefined,
        assessmentNotes: newMeetingAssessmentEnabled ? newMeetingAssessmentNotes.trim() : undefined,
        userNotes: newMeetingNotes.trim(),
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

    // Sisipkan pertemuan pada posisi pilihan guru dan normalkan urutan seluruh pertemuan di bab ini
    const { updatedProjects } = insertMeetingIntoProject(
      learningProjects,
      activeChapter.id,
      newMeeting,
      newMeetingPosition
    );

    onUpdateLearningProjects(updatedProjects);
    onUpdateActiveContext({
      ...activeContext,
      activeMeetingId: newMeeting.id
    });
    setShowAddMeetingModal(false);
    setNewMeetingTitle('');
    setNewMeetingTema('');
    setNewMeetingMateri('');
    setNewMeetingCakupan('');
    setNewMeetingNotes('');
    setMeetingFormErrors({});
    onSaveToast(`Pertemuan "${newMeeting.title}" berhasil disimpan di posisi ${newMeetingPosition}!`);
  };

  // Handler Konfirmasi Penghapusan Pertemuan
  const handleConfirmDeleteMeeting = async () => {
    if (!meetingToDelete) return;
    const targetId = meetingToDelete.id;
    const targetTitle = meetingToDelete.title;

    setIsDeletingMeeting(true);
    try {
      if (onDeleteLearningMeeting) {
        await onDeleteLearningMeeting(targetId);
      } else {
        const { updatedProjects, nextActiveMeetingId } =
          removeMeetingFromProject(learningProjects, targetId);

        onUpdateLearningProjects(updatedProjects);
        if (activeMeeting?.id === targetId) {
          onUpdateActiveContext({
            ...activeContext,
            activeMeetingId: nextActiveMeetingId
          });
        }
        if (userId) {
          await deleteLearningMeetingFromSupabase(targetId);
        }
        onSaveToast(`Pertemuan "${targetTitle}" berhasil dihapus.`);
      }
    } catch (err) {
      console.warn('Gagal menghapus pertemuan:', err);
      onSaveToast('Gagal menghapus pertemuan.');
    } finally {
      setIsDeletingMeeting(false);
      setMeetingToDelete(null);
    }
  };

  // Handler Konfirmasi Penghapusan Proyek (Cascade & Orphan-free)
  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;
    const targetId = projectToDelete.id;
    const targetName = projectToDelete.name;

    setIsDeletingProject(true);
    try {
      if (onDeleteLearningProject) {
        await onDeleteLearningProject(targetId);
      } else {
        const updated = learningProjects.filter((p) => p.id !== targetId);
        onUpdateLearningProjects(updated);
        if (activeProject?.id === targetId) {
          const nextProj = updated[0];
          onUpdateActiveContext({
            activeProjectId: nextProj?.id,
            activeClassSubjectId: nextProj?.classSubjects[0]?.id,
            activeChapterId: nextProj?.classSubjects[0]?.chapters[0]?.id,
            activeMeetingId: nextProj?.classSubjects[0]?.chapters[0]?.meetings[0]?.id,
          });
        }
        if (userId) {
          await deleteLearningProjectFromSupabase(targetId, userId);
        }
        onSaveToast(`Proyek "${targetName}" berhasil dihapus.`);
      }
      setProjectToDelete(null);
    } catch (err: any) {
      console.warn('Gagal menghapus proyek:', err);
      onSaveToast(`Gagal menghapus proyek: ${err?.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsDeletingProject(false);
    }
  };

  // Handler Geser Urutan Pertemuan (Move Up / Down)
  const handleReorderMeeting = (meetingId: string, direction: 'up' | 'down') => {
    if (!activeChapter) return;
    const { updatedProjects } = reorderMeetingInProject(
      learningProjects,
      activeChapter.id,
      meetingId,
      direction
    );
    onUpdateLearningProjects(updatedProjects);
    onSaveToast(`Urutan pertemuan berhasil digeser ke ${direction === 'up' ? 'atas' : 'bawah'}.`);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Proyek Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola bab dan pertemuan untuk menghasilkan perangkat ajar terintegrasi.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Switcher Tab */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveMainTab('hierarki')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMainTab === 'hierarki'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Hierarki Proyek</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMainTab('legacy')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMainTab === 'legacy'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Draf Lama ({projects.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAMPILAN 1: HIERARKI PROYEK -> KELAS -> MAPEL -> BAB -> PERTEMUAN   */}
      {/* ==================================================================== */}
      {activeMainTab === 'hierarki' && (
        learningProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200/90 shadow-xs text-center space-y-4 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-[#3b49df] flex items-center justify-center mx-auto">
              <FolderKanban className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Belum Ada Proyek Pembelajaran</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Seluruh proyek pembelajaran telah dihapus. Anda dapat membuat proyek baru untuk mulai menyusun Master Learning Data.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('buat_proyek')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Buat Proyek Baru</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddProjectModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Cepat</span>
              </button>
            </div>
          </div>
        ) : (
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
                    onClick={() => onNavigate('buat_proyek')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#3b49df] text-xs font-bold cursor-pointer transition-colors border border-indigo-200"
                    title="Buat Proyek Baru dengan Master Learning Data (1 Data -> Banyak Produk)"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Buat Proyek Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddProjectModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                    title="Tambah Cepat Struktur Proyek Baru"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Cepat</span>
                  </button>

                  {onDeleteLearningProject && activeProject && (
                    <button
                      type="button"
                      onClick={() => setProjectToDelete(activeProject)}
                      disabled={isDeletingProject}
                      className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                      title={`Hapus Proyek "${activeProject.name}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
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
                    onClick={handleOpenAddMeetingModal}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Buat Pertemuan</span>
                  </button>
                </div>

                {(!activeChapter?.meetings || activeChapter.meetings.length === 0) ? (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
                    <p className="text-xs font-semibold text-slate-500">Belum ada pertemuan di bab ini.</p>
                    <button
                      type="button"
                      onClick={handleOpenAddMeetingModal}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Buat Pertemuan Pertama</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {activeChapter.meetings.map((m, mIdx) => {
                      const isActive = m.id === activeMeeting?.id;
                      const hasData = Boolean(m.masterLearningData.materiDiajarkan || m.masterLearningData.temaKegiatan);
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
                        <div
                          key={m.id}
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
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className={`font-black uppercase tracking-wider text-[11px] truncate ${isActive ? 'text-indigo-100' : 'text-[#3b49df]'}`}>
                                {m.meetingNumber}
                              </span>
                              {/* Reorder Buttons (Move Up / Down) */}
                              {activeChapter.meetings.length > 1 && (
                                <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                  {mIdx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleReorderMeeting(m.id, 'up')}
                                      className={`p-0.5 rounded transition-colors cursor-pointer ${
                                        isActive ? 'text-white/80 hover:bg-white/20' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                      }`}
                                      title="Geser posisi ke atas"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                  )}
                                  {mIdx < activeChapter.meetings.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleReorderMeeting(m.id, 'down')}
                                      className={`p-0.5 rounded transition-colors cursor-pointer ${
                                        isActive ? 'text-white/80 hover:bg-white/20' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                      }`}
                                      title="Geser posisi ke bawah"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                                isActive ? 'bg-white/20 text-white border-white/30' : statusBadgeColor
                              }`}>
                                {statusLabel}
                              </span>
                              {/* Hapus Pertemuan Button */}
                              <button
                                type="button"
                                onClick={() => setMeetingToDelete(m)}
                                className={`p-1 rounded-md transition-colors cursor-pointer ${
                                  isActive ? 'text-white/80 hover:text-white hover:bg-white/20' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                }`}
                                title={`Hapus ${m.meetingNumber}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className={`line-clamp-2 font-semibold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                            {hasData ? (m.masterLearningData.materiDiajarkan || m.title) : `${m.title} (Belum diisi)`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* LEVEL 5 & 6: MASTER LEARNING DATA & STUDIO PRODUK                */}
          {/* ================================================================ */}
          {!activeMeeting ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#3b49df] mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Belum Ada Pertemuan di Bab Ini
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Pertemuan adalah unit pembelajaran untuk menentukan materi yang diajarkan. Buat pertemuan baru untuk mulai menyusun Master Learning Data dan menghasilkan produk pembelajaran.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddMeetingModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3b49df] hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Pertemuan Baru</span>
              </button>
            </div>
          ) : (
            <>
              {/* LEVEL 5: MASTER LEARNING DATA EDITOR (SINGLE SOURCE OF TRUTH)     */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            {/* Banner peringatan jika pertemuan aktif belum diatur materinya */}
            {activeMeeting && (!activeMeeting.masterLearningData.materiDiajarkan && !activeMeeting.masterLearningData.temaKegiatan) && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-900">
                    Pertemuan ini belum memiliki data materi pembelajaran.
                  </p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Tentukan materi yang akan diajarkan pada pertemuan ini. Data ini akan menjadi dasar pembuatan produk pembelajaran (Materi, Infografis, LKPD, Presentasi, Asesmen).
                  </p>
                </div>
              </div>
            )}
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
                    {activeMeeting?.isContinuation && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                        Lanjutan dari {activeMeeting.continuationFromMeetingNumber || 'Pertemuan Sebelumnya'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                    Master Learning Data — {activeMeeting?.meetingNumber}
                  </h2>
                </div>
              </div>

              {/* Status Pertemuan Selector, Hapus Pertemuan & Aksi Selesai */}
              <div className="flex flex-wrap items-center gap-2">
                {activeMeeting && (
                  <button
                    type="button"
                    onClick={() => setMeetingToDelete(activeMeeting)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold cursor-pointer transition-colors"
                    title={`Hapus ${activeMeeting.meetingNumber} dari proyek`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span className="hidden sm:inline">Hapus Pertemuan</span>
                  </button>
                )}

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

            {/* OPSI KELANJUTAN PERTEMUAN (OPSIONAL) */}
            {activeChapter && activeChapter.meetings.length > 1 && (
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="cb-is-continuation"
                    checked={isContinuation}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsContinuation(checked);
                      if (checked && !continuationFromMeetingId) {
                        const previousMeetings = activeChapter.meetings.filter(m => m.id !== activeMeeting?.id);
                        if (previousMeetings.length > 0) {
                          setContinuationFromMeetingId(previousMeetings[0].id);
                        }
                      }
                    }}
                    className="w-4 h-4 rounded text-[#3b49df] focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="cb-is-continuation" className="font-bold text-slate-800 cursor-pointer select-none">
                    Tandai pertemuan ini sebagai kelanjutan dari pertemuan sebelumnya
                  </label>
                </div>

                {isContinuation && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Lanjutan dari:</span>
                    <select
                      value={continuationFromMeetingId}
                      onChange={(e) => setContinuationFromMeetingId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs cursor-pointer focus:outline-hidden"
                    >
                      {activeChapter.meetings
                        .filter(m => m.id !== activeMeeting?.id)
                        .map(m => (
                          <option key={m.id} value={m.id}>
                            {m.meetingNumber} — {m.title}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            )}

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

            {/* DATA 4: KEGIATAN / LATIHAN PENGUAT (OPSIONAL) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>4. Kegiatan / Latihan Penguat (Opsional)</span>
                <span className="text-[10px] font-normal text-slate-400">Diskusi, praktik, demonstrasi, studi kasus, latihan soal</span>
              </label>
              <textarea
                rows={3}
                value={reinforcementActivities}
                onChange={(e) => setReinforcementActivities(e.target.value)}
                placeholder="Contoh: Peserta didik membaca dua contoh teks iklan secara berpasangan, kemudian mengidentifikasi ciri kebahasaan persuasif dan mempresentasikan hasil temuannya."
                className="w-full p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:outline-hidden focus:border-indigo-500 transition-all leading-relaxed"
              />
            </div>

            {/* DATA 5: ASESMEN PEMBELAJARAN (KOMPONEN KONDISIONAL - OPSIONAL) */}
            <div className="space-y-3.5 pt-3 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-teal-600" />
                    <span>5. Asesmen Pembelajaran (Opsional)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Apakah pertemuan ini menggunakan asesmen? (Default: Tidak, fokus eksplorasi materi)
                  </p>
                </div>

                {/* Switch Kondisional: Tidak / Ya */}
                <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setAssessmentEnabled(false)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !assessmentEnabled
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Tidak
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssessmentEnabled(true)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      assessmentEnabled
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Ya, Gunakan Asesmen
                  </button>
                </div>
              </div>

              {!assessmentEnabled ? (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Pertemuan ini diset tanpa asesmen formal. Pembelajaran berfokus pada penyampaian dan penguatan konsep materi.
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-4 animate-in fade-in duration-150">
                  {/* Pilihan Jenis Asesmen */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-950 block">
                      Jenis Asesmen <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Diagnostik', 'Formatif', 'Sumatif'] as AssessmentType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAssessmentType(type)}
                          className={`p-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                            assessmentType === type
                              ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50/60'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pilihan Bentuk Asesmen */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-950 flex items-center justify-between">
                      <span>Bentuk Asesmen (Pilih satu atau beberapa) <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-teal-700 font-normal">Klik untuk memilih/membatalkan</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ASSESSMENT_FORMS_LIST.map((form) => {
                        const isSelected = assessmentForms.includes(form.id);
                        return (
                          <button
                            key={form.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                if (assessmentForms.length > 1) {
                                  setAssessmentForms(prev => prev.filter(f => f !== form.id));
                                }
                              } else {
                                setAssessmentForms(prev => [...prev, form.id]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-teal-600 text-white border-teal-700 shadow-2xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                            title={form.desc}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{form.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Catatan Asesmen */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-teal-950 block">
                      Catatan Asesmen (Opsional)
                    </label>
                    <textarea
                      rows={2}
                      value={assessmentNotes}
                      onChange={(e) => setAssessmentNotes(e.target.value)}
                      placeholder="Misal: Kuis 5 butir pemahaman konsep iklan dan unjuk kerja mandiri..."
                      className="w-full p-2.5 rounded-xl bg-white border border-teal-200 text-xs font-medium focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* DATA 6: CATATAN PEDAGOGIS GURU (OPSIONAL) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>6. Catatan Pedagogis Guru (Opsional)</span>
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
            </>
          )}
        </div>
        )
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
      {/* MODAL 4: BUAT PERTEMUAN (UNIT PEMBELAJARAN & MASTER LEARNING DATA)    */}
      {/* ==================================================================== */}
      {showAddMeetingModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Buat Pertemuan Pembelajaran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Tentukan materi yang akan diajarkan pada pertemuan ini. Data ini akan menjadi dasar pembuatan produk pembelajaran.
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillSampleMeeting}
                className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold shrink-0 inline-flex items-center gap-1 cursor-pointer transition-colors"
                title="Isi contoh cepat data pertemuan teks iklan"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Contoh Cepat</span>
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Posisi / Urutan Pertemuan */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Posisi / Urutan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newMeetingPosition}
                    onChange={(e) => {
                      const pos = Number(e.target.value);
                      setNewMeetingPosition(pos);
                      setNewMeetingNumber(`Pertemuan ${pos}`);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white text-xs cursor-pointer"
                  >
                    {Array.from({ length: (activeChapter?.meetings.length || 0) + 1 }, (_, i) => i + 1).map((pos) => {
                      const total = activeChapter?.meetings.length || 0;
                      const isLast = pos === total + 1;
                      const isFirst = pos === 1;
                      return (
                        <option key={pos} value={pos}>
                          {isLast
                            ? `Urutan ${pos} (Akhir)`
                            : isFirst
                            ? `Urutan 1 (Awal)`
                            : `Urutan ${pos}`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 2. Judul Pertemuan */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Judul Pertemuan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMeetingTitle}
                    onChange={(e) => {
                      setNewMeetingTitle(e.target.value);
                      if (meetingFormErrors.title) setMeetingFormErrors(prev => ({ ...prev, title: undefined }));
                    }}
                    placeholder="Misal: Mengenal Teks Iklan"
                    className={`w-full px-3 py-2.5 rounded-xl border bg-slate-50 font-bold focus:bg-white text-xs ${
                      meetingFormErrors.title ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/40' : 'border-slate-200'
                    }`}
                  />
                  {meetingFormErrors.title && (
                    <p className="text-[10px] text-rose-500 font-semibold mt-1">{meetingFormErrors.title}</p>
                  )}
                </div>
              </div>

              {/* Notice jika pertemuan disisipkan di tengah urutan */}
              {activeChapter && newMeetingPosition <= activeChapter.meetings.length && activeChapter.meetings.length > 0 && !(activeChapter.meetings.length === 1 && activeChapter.meetings[0].status === 'draft' && !activeChapter.meetings[0].masterLearningData.materiDiajarkan) && (
                <div className="bg-indigo-50 border border-indigo-200/80 rounded-xl p-2.5 flex items-start gap-2">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-indigo-900 leading-relaxed">
                    Pertemuan baru akan disisipkan di <strong>Posisi ke-{newMeetingPosition}</strong>. Pertemuan yang sebelumnya berada di urutan ke-{newMeetingPosition} dan setelahnya otomatis bergeser menjadi Pertemuan {newMeetingPosition + 1}, Pertemuan {newMeetingPosition + 2}, dst.
                  </p>
                </div>
              )}

              {/* 3. Tema Pembelajaran */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tema Pembelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newMeetingTema}
                  onChange={(e) => {
                    setNewMeetingTema(e.target.value);
                    if (meetingFormErrors.tema) setMeetingFormErrors(prev => ({ ...prev, tema: undefined }));
                  }}
                  placeholder="Misal: Memahami karakteristik teks iklan"
                  className={`w-full px-3 py-2.5 rounded-xl border bg-slate-50 font-medium focus:bg-white text-xs ${
                    meetingFormErrors.tema ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/40' : 'border-slate-200'
                  }`}
                />
                {meetingFormErrors.tema && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{meetingFormErrors.tema}</p>
                )}
              </div>

              {/* 4. Materi Pelajaran */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Materi Pelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newMeetingMateri}
                  onChange={(e) => {
                    setNewMeetingMateri(e.target.value);
                    if (meetingFormErrors.materi) setMeetingFormErrors(prev => ({ ...prev, materi: undefined }));
                  }}
                  placeholder="Misal: Pengertian, tujuan, fungsi, dan ciri-ciri iklan"
                  className={`w-full px-3 py-2.5 rounded-xl border bg-slate-50 font-medium focus:bg-white text-xs ${
                    meetingFormErrors.materi ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/40' : 'border-slate-200'
                  }`}
                />
                {meetingFormErrors.materi && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{meetingFormErrors.materi}</p>
                )}
              </div>

              {/* 5. Cakupan Materi */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Cakupan Materi (Poin-poin Bahasan) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={newMeetingCakupan}
                  onChange={(e) => {
                    setNewMeetingCakupan(e.target.value);
                    if (meetingFormErrors.cakupan) setMeetingFormErrors(prev => ({ ...prev, cakupan: undefined }));
                  }}
                  placeholder="Contoh:&#10;1. Pengertian dan fungsi iklan&#10;2. Ciri bahasa persuasif&#10;3. Contoh iklan komersial vs layanan masyarakat"
                  className={`w-full p-3 rounded-xl border bg-slate-50 font-medium focus:bg-white text-xs leading-relaxed ${
                    meetingFormErrors.cakupan ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/40' : 'border-slate-200'
                  }`}
                />
                {meetingFormErrors.cakupan && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{meetingFormErrors.cakupan}</p>
                )}
              </div>

              {/* Opsi Kelanjutan Pertemuan (Opsional) */}
              {activeChapter && activeChapter.meetings.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="modal-cb-continuation"
                      checked={newMeetingIsContinuation}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setNewMeetingIsContinuation(checked);
                        if (checked && !newMeetingContinuationId && activeChapter.meetings.length > 0) {
                          setNewMeetingContinuationId(activeChapter.meetings[activeChapter.meetings.length - 1].id);
                        }
                      }}
                      className="w-4 h-4 rounded text-[#3b49df] focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="modal-cb-continuation" className="font-bold text-slate-800 cursor-pointer select-none text-xs">
                      Tandai sebagai kelanjutan dari pertemuan sebelumnya
                    </label>
                  </div>
                  {newMeetingIsContinuation && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-slate-500 font-medium text-[11px]">Lanjutan dari:</span>
                      <select
                        value={newMeetingContinuationId}
                        onChange={(e) => setNewMeetingContinuationId(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs cursor-pointer focus:outline-hidden"
                      >
                        {activeChapter.meetings.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.meetingNumber} — {m.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Kegiatan / Latihan Penguat (Opsional) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Kegiatan / Latihan Penguat (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={newMeetingActivities}
                  onChange={(e) => setNewMeetingActivities(e.target.value)}
                  placeholder="Misal: Diskusi kelompok membedakan ciri iklan komersial vs non-komersial..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white text-xs leading-relaxed"
                />
              </div>

              {/* 6. Asesmen Pembelajaran (Opsional) */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-slate-800 text-xs block">
                      Asesmen Pembelajaran (Opsional)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Gunakan asesmen pada pertemuan ini? (Default: Tidak)
                    </p>
                  </div>
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setNewMeetingAssessmentEnabled(false)}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                        !newMeetingAssessmentEnabled
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      Tidak
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewMeetingAssessmentEnabled(true)}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                        newMeetingAssessmentEnabled
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      Ya, Gunakan
                    </button>
                  </div>
                </div>

                {newMeetingAssessmentEnabled && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-2.5 animate-in fade-in duration-150">
                    {/* Jenis Asesmen */}
                    <div>
                      <span className="font-semibold text-slate-700 text-[11px] block mb-1">
                        Jenis Asesmen:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['Diagnostik', 'Formatif', 'Sumatif'] as AssessmentType[]).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewMeetingAssessmentType(t)}
                            className={`py-1.5 rounded-lg border text-[11px] font-bold text-center cursor-pointer transition-all ${
                              newMeetingAssessmentType === t
                                ? 'bg-teal-600 text-white border-teal-700 shadow-2xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bentuk Asesmen */}
                    <div>
                      <span className="font-semibold text-slate-700 text-[11px] block mb-1">
                        Bentuk Asesmen:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {ASSESSMENT_FORMS_LIST.map((form) => {
                          const isSel = newMeetingAssessmentForms.includes(form.id);
                          return (
                            <button
                              key={form.id}
                              type="button"
                              onClick={() => {
                                if (isSel) {
                                  if (newMeetingAssessmentForms.length > 1) {
                                    setNewMeetingAssessmentForms(prev => prev.filter(f => f !== form.id));
                                  }
                                } else {
                                  setNewMeetingAssessmentForms(prev => [...prev, form.id]);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                isSel
                                  ? 'bg-teal-600 text-white border-teal-700'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {form.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Catatan Asesmen */}
                    <div>
                      <input
                        type="text"
                        value={newMeetingAssessmentNotes}
                        onChange={(e) => setNewMeetingAssessmentNotes(e.target.value)}
                        placeholder="Catatan asesmen (misal: Kuis 5 soal konsep dasar)..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Catatan Pedagogis */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Catatan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={newMeetingNotes}
                  onChange={(e) => setNewMeetingNotes(e.target.value)}
                  placeholder="Misal: Fokus pada iklan komersial dan layanan masyarakat"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white text-xs leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddMeetingModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddMeeting}
                className="px-6 py-2.5 rounded-xl bg-[#3b49df] hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Pertemuan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: KONFIRMASI HAPUS PERTEMUAN (AMANKAN DARI ORPHAN DATA)       */}
      {/* ==================================================================== */}
      {meetingToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Pertemuan?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pertemuan ini akan dihapus dari proyek beserta data pembelajaran yang secara langsung terkait dengan pertemuan tersebut. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Target Pertemuan
                </span>
                <span className="font-extrabold text-[#3b49df] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {meetingToDelete.meetingNumber}
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm truncate">
                {meetingToDelete.title || 'Pertemuan (Belum Diatur)'}
              </p>
              {meetingToDelete.masterLearningData?.materiDiajarkan && (
                <p className="text-slate-600 text-[11px] line-clamp-2">
                  <span className="font-semibold text-slate-700">Materi:</span> {meetingToDelete.masterLearningData.materiDiajarkan}
                </p>
              )}
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900">
              💡 <strong>Otomatis Normalisasi:</strong> Seluruh nomor pertemuan setelahnya akan otomatis dinormalisasi ulang (Pertemuan 1, Pertemuan 2, dst.) dan disinkronkan ke Supabase.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMeetingToDelete(null)}
                disabled={isDeletingMeeting}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteMeeting}
                disabled={isDeletingMeeting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingMeeting ? 'Menghapus...' : 'Hapus Pertemuan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 6: KONFIRMASI HAPUS PROYEK (CASCADE & ORPHAN-FREE)             */}
      {/* ==================================================================== */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Proyek?
                </h3>
                <p className="text-xs text-rose-600 font-semibold leading-relaxed">
                  Menghapus proyek akan menghapus data pembelajaran yang berada di dalam proyek ini. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 text-xs space-y-2.5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Nama Proyek
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {projectToDelete.name}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tingkat
                  </span>
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-0.5 text-xs">
                    {projectToDelete.classSubjects[0]?.educationLevel || 'SMP'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Kelas
                  </span>
                  <span className="font-bold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded-md inline-block mt-0.5 text-xs">
                    {projectToDelete.classSubjects[0]?.grade || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Mata Pelajaran
                  </span>
                  <span className="font-bold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded-md inline-block mt-0.5 text-xs truncate max-w-full">
                    {projectToDelete.classSubjects[0]?.subject || '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                disabled={isDeletingProject}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProject}
                disabled={isDeletingProject}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingProject ? 'Menghapus Proyek...' : 'Hapus Proyek'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
