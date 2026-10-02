import { 
  LearningProject, 
  ClassSubjectNode, 
  ChapterNode, 
  MeetingSession, 
  MasterLearningData, 
  ActiveLearningContext,
  InfographicDraft,
  EducationLevel,
  MeetingStatus,
  ProductLifecycleStatus
} from '../types';
import { suggestLearningObjectives } from './stiviaThinkingFramework';

const STORAGE_PROJECTS_KEY = 'stivia_learning_projects';
const STORAGE_ACTIVE_CONTEXT_KEY = 'stivia_active_learning_context';

/**
 * Data Awal Contoh Proyek Pembelajaran STIVIA
 */
export const DEFAULT_INITIAL_LEARNING_PROJECT: LearningProject = {
  id: 'proj-lp-001',
  name: 'Bahasa Indonesia Semester Ganjil 2026/2027',
  academicYear: '2026/2027',
  semester: 'Ganjil',
  teacherName: 'Amin Wahyudi, S.Pd.',
  schoolName: 'SMP Negeri 2 Jetis Kabupaten Mojokerto',
  createdAt: '2026-09-01',
  updatedAt: '2026-09-30',
  classSubjects: [
    {
      id: 'cs-001',
      educationLevel: 'SMP',
      grade: 'Kelas VIII',
      subject: 'Bahasa Indonesia',
      createdAt: '2026-09-01',
      updatedAt: '2026-09-30',
      chapters: [
        {
          id: 'ch-001',
          chapterNumber: 'Bab 2',
          title: 'Menemukan Pola Pesan dalam Iklan Komersial & Layanan Masyarakat',
          createdAt: '2026-09-01',
          updatedAt: '2026-09-30',
          meetings: [
            {
              id: 'meet-001',
              meetingNumber: 'Pertemuan 1',
              title: 'Slogan, Kalimat Persuasif, dan Naskah Iklan',
              status: 'ready',
              createdAt: '2026-09-05',
              updatedAt: '2026-09-30',
              masterLearningData: {
                temaKegiatan: 'Slogan, Kalimat Persuasif, dan Naskah Iklan',
                materiDiajarkan: 'Slogan, kalimat persuasif, dan naskah iklan',
                cakupanMateri: 
                  '1. Pengertian dan fungsi sosial teks iklan di era media digital.\n' +
                  '2. Ciri bahasa persuasif dalam slogan dan poster iklan.\n' +
                  '3. Unsur utama pembentuk iklan (Headline, Body Text, Visual, CTA).\n' +
                  '4. Contoh analisis perbandingan iklan komersial vs layanan masyarakat.\n' +
                  '5. Penyusunan naskah iklan informatif yang santun dan menarik.',
                learningObjectives: [
                  'Peserta didik mampu mengidentifikasi pengertian dan fungsi sosial teks iklan dengan tepat.',
                  'Peserta didik mampu membedakan ciri bahasa persuasif pada berbagai jenis iklan di media massa.',
                  'Peserta didik mampu menganalisis 4 unsur utama pembentuk iklan yang efektif dan menarik.'
                ],
                userNotes: 'Fokuskan contoh pada produk lokal siswa dan etika periklanan di media sosial.',
                version: 1,
                updatedAt: '2026-09-30'
              },
              productStates: {
                material: 'ready',
                infographic: 'ready',
                lkpd: 'draft',
                presentation: 'ready',
                assessment_harian: 'not_started',
                assessment_sumatif: 'not_started'
              }
            },
            {
              id: 'meet-002',
              meetingNumber: 'Pertemuan 2',
              title: 'Struktur Teks Iklan dan Praktik Perancangan Slogan',
              status: 'in_progress',
              createdAt: '2026-09-12',
              updatedAt: '2026-09-28',
              masterLearningData: {
                temaKegiatan: 'Struktur Teks Iklan dan Praktik Perancangan Slogan',
                materiDiajarkan: 'Struktur teks iklan dan teknik penulisan slogan persuasif',
                cakupanMateri: 
                  '1. Tiga bagian struktur teks iklan: Judul, Penjelasan, dan Nama Produk/Jasa.\n' +
                  '2. Kaidah kebahasaan slogan: rima, kata bertenaga, dan kemudahan diingat.\n' +
                  '3. Studi kasus bedah keefektifan slogan brand terkenal.\n' +
                  '4. Latihan terbimbing menyusun draf slogan kampanye hemat energi di sekolah.',
                learningObjectives: [
                  'Peserta didik mampu menelaah struktur pembangun teks iklan secara mendalam.',
                  'Peserta didik mampu merumuskan slogan orisinal yang memenuhi kaidah bahasa persuasif.'
                ],
                userNotes: 'Beri ruang diskusi kelompok kecil untuk saling menguji slogan antar-siswa.',
                version: 1,
                updatedAt: '2026-09-28'
              },
              productStates: {
                material: 'draft',
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

/**
 * Mengambil daftar proyek pembelajaran terstruktur dari localStorage
 */
export function getStoredLearningProjects(): LearningProject[] {
  if (typeof window === 'undefined') return [DEFAULT_INITIAL_LEARNING_PROJECT];
  try {
    const raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Inisialisasi awal
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify([DEFAULT_INITIAL_LEARNING_PROJECT]));
    return [DEFAULT_INITIAL_LEARNING_PROJECT];
  } catch (e) {
    console.warn('Gagal membaca learning projects dari localStorage:', e);
    return [DEFAULT_INITIAL_LEARNING_PROJECT];
  }
}

/**
 * Menyimpan daftar proyek pembelajaran ke localStorage
 */
export function saveStoredLearningProjects(projects: LearningProject[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Gagal menyimpan learning projects ke localStorage:', e);
  }
}

/**
 * Mengambil status konteks aktif (Project, Class, Chapter, Meeting)
 */
export function getStoredActiveContext(): ActiveLearningContext {
  if (typeof window === 'undefined') {
    return {
      activeProjectId: 'proj-lp-001',
      activeClassSubjectId: 'cs-001',
      activeChapterId: 'ch-001',
      activeMeetingId: 'meet-001'
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_CONTEXT_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Gagal membaca active context:', e);
  }
  return {
    activeProjectId: 'proj-lp-001',
    activeClassSubjectId: 'cs-001',
    activeChapterId: 'ch-001',
    activeMeetingId: 'meet-001'
  };
}

/**
 * Menyimpan status konteks aktif
 */
export function saveStoredActiveContext(context: ActiveLearningContext): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_ACTIVE_CONTEXT_KEY, JSON.stringify(context));
  } catch (e) {
    console.error('Gagal menyimpan active context:', e);
  }
}

/**
 * ADAPTER BACKWARD-COMPATIBILITY:
 * Mengubah InfographicDraft lama menjadi LearningProject secara deterministik & idempotent.
 * Tidak menghapus data lama dan tidak mengubah data sumber.
 */
export function adaptLegacyProjectToLearningProject(draft: InfographicDraft): LearningProject {
  const projectId = `lp-adapted-${draft.id}`;
  const classSubjectId = `cs-adapted-${draft.id}`;
  const chapterId = `ch-adapted-${draft.id}`;
  const meetingId = `meet-adapted-${draft.id}`;

  const cleanSubject = draft.subject || 'Bahasa Indonesia';
  const cleanGrade = draft.grade || 'Kelas VIII';
  const cleanLevel = draft.educationLevel || 'SMP';
  const cleanBab = draft.bab || (draft.title ? `Bab: ${draft.title}` : 'Bab 1: Konsep Dasar');
  const cleanMeetingNumber = typeof draft.pertemuan === 'string' && draft.pertemuan 
    ? draft.pertemuan 
    : 'Pertemuan 1';

  const tema = draft.theme && draft.theme !== draft.rawTopic ? draft.theme : (draft.rawTopic || draft.title || 'Materi Pembelajaran');
  const materi = draft.rawTopic || draft.title || 'Materi Pembelajaran';
  const cakupan = draft.scope || '1. Pengantar konsep materi.\n2. Ciri dan unsur pokok.\n3. Contoh penerapan.';

  const masterLearningData: MasterLearningData = {
    temaKegiatan: tema,
    materiDiajarkan: materi,
    cakupanMateri: cakupan,
    learningObjectives: draft.learningObjectivesList && draft.learningObjectivesList.length > 0
      ? draft.learningObjectivesList
      : draft.learningObjective ? [draft.learningObjective] : [],
    userNotes: draft.userNotes || '',
    version: 1,
    updatedAt: draft.updatedAt || draft.createdAt || new Date().toISOString().split('T')[0]
  };

  const meeting: MeetingSession = {
    id: meetingId,
    meetingNumber: cleanMeetingNumber,
    title: materi,
    status: draft.status === 'completed' ? 'ready' : 'draft',
    masterLearningData,
    productStates: {
      material: 'ready',
      infographic: 'ready',
      lkpd: 'not_started',
      presentation: 'not_started',
      assessment_harian: 'not_started',
      assessment_sumatif: 'not_started'
    },
    createdAt: draft.createdAt || new Date().toISOString().split('T')[0],
    updatedAt: draft.updatedAt || new Date().toISOString().split('T')[0],
    legacyDraftId: draft.id
  };

  const chapter: ChapterNode = {
    id: chapterId,
    chapterNumber: cleanBab.split(':')[0] || 'Bab 1',
    title: cleanBab,
    meetings: [meeting],
    createdAt: draft.createdAt || new Date().toISOString().split('T')[0],
    updatedAt: draft.updatedAt || new Date().toISOString().split('T')[0]
  };

  const classSubject: ClassSubjectNode = {
    id: classSubjectId,
    educationLevel: cleanLevel,
    grade: cleanGrade,
    subject: cleanSubject,
    chapters: [chapter],
    createdAt: draft.createdAt || new Date().toISOString().split('T')[0],
    updatedAt: draft.updatedAt || new Date().toISOString().split('T')[0]
  };

  return {
    id: projectId,
    name: draft.title || `${cleanSubject} - ${cleanGrade}`,
    academicYear: '2026/2027',
    semester: 'Ganjil',
    teacherName: draft.authorName || 'Pendidik STIVIA',
    schoolName: 'Sekolah Penggerak STIVIA',
    classSubjects: [classSubject],
    createdAt: draft.createdAt || new Date().toISOString().split('T')[0],
    updatedAt: draft.updatedAt || new Date().toISOString().split('T')[0],
    isLegacyAdapted: true
  };
}

/**
 * Menyinkronkan Master Learning Data dari Pertemuan Aktif ke objek InfographicDraft
 * agar seluruh generator existing (Materi, Infografis, LKPD, Presentasi)
 * otomatis mendapatkan Master Context tanpa perlu perubahan engine.
 */
export function syncMeetingToCurrentDraft(
  meeting: MeetingSession,
  chapter: ChapterNode,
  classSubject: ClassSubjectNode,
  project: LearningProject,
  existingDraft?: InfographicDraft
): InfographicDraft {
  const mld = meeting.masterLearningData;
  const now = new Date().toISOString().split('T')[0];

  const baseDraft: InfographicDraft = existingDraft || {
    id: meeting.legacyDraftId || `draft-sync-${meeting.id}`,
    title: mld.materiDiajarkan || meeting.title,
    learningObjective: mld.learningObjectives?.[0] || 'Memahami materi pembelajaran secara terstruktur.',
    educationLevel: classSubject.educationLevel,
    grade: classSubject.grade,
    subject: classSubject.subject,
    theme: mld.temaKegiatan,
    bab: chapter.title,
    rawTopic: mld.materiDiajarkan,
    pertemuan: meeting.meetingNumber,
    scope: mld.cakupanMateri,
    userNotes: mld.userNotes,
    visualStyle: 'Modern Edukatif',
    format: 'portrait',
    visualLevel: 'seimbang',
    exampleContext: 'sehari_hari',
    blocks: [],
    createdAt: meeting.createdAt || now,
    updatedAt: now,
    status: meeting.status === 'completed' || meeting.status === 'ready' ? 'completed' : 'draft',
    learningObjectivesList: mld.learningObjectives || []
  };

  return {
    ...baseDraft,
    title: mld.materiDiajarkan || meeting.title,
    theme: mld.temaKegiatan,
    bab: chapter.title,
    rawTopic: mld.materiDiajarkan,
    pertemuan: meeting.meetingNumber,
    scope: mld.cakupanMateri,
    userNotes: mld.userNotes,
    subject: classSubject.subject,
    grade: classSubject.grade,
    educationLevel: classSubject.educationLevel,
    learningObjectivesList: mld.learningObjectives || baseDraft.learningObjectivesList || [],
    learningObjective: mld.learningObjectives?.[0] || baseDraft.learningObjective,
    updatedAt: now
  };
}

/**
 * Mengambil detail objek aktif dari hierarki data
 */
export function resolveActiveHierarchy(
  projects: LearningProject[],
  context: ActiveLearningContext
): {
  project?: LearningProject;
  classSubject?: ClassSubjectNode;
  chapter?: ChapterNode;
  meeting?: MeetingSession;
} {
  const project = projects.find(p => p.id === context.activeProjectId) || projects[0];
  if (!project) return {};

  const classSubject = project.classSubjects.find(cs => cs.id === context.activeClassSubjectId) || project.classSubjects[0];
  if (!classSubject) return { project };

  const chapter = classSubject.chapters.find(ch => ch.id === context.activeChapterId) || classSubject.chapters[0];
  if (!chapter) return { project, classSubject };

  const meeting = chapter.meetings.find(m => m.id === context.activeMeetingId) || chapter.meetings[0];
  return { project, classSubject, chapter, meeting };
}

/**
 * Helper untuk memperbarui Master Learning Data pada sebuah pertemuan secara aman.
 * Jika cakupanMateri berubah, version dinaikkan otomatis.
 */
export function updateMeetingMasterLearningData(
  projects: LearningProject[],
  meetingId: string,
  newMasterData: Partial<MasterLearningData>
): LearningProject[] {
  const now = new Date().toISOString().split('T')[0];

  return projects.map(p => ({
    ...p,
    updatedAt: now,
    classSubjects: p.classSubjects.map(cs => ({
      ...cs,
      chapters: cs.chapters.map(ch => ({
        ...ch,
        meetings: ch.meetings.map(m => {
          if (m.id !== meetingId) return m;

          const oldData = m.masterLearningData;
          const isScopeChanged = newMasterData.cakupanMateri !== undefined && 
                                 newMasterData.cakupanMateri !== oldData.cakupanMateri;

          const newVersion = isScopeChanged 
            ? (oldData.version || 1) + 1 
            : (oldData.version || 1);

          return {
            ...m,
            updatedAt: now,
            masterLearningData: {
              ...oldData,
              ...newMasterData,
              version: newVersion,
              updatedAt: now
            }
          };
        })
      }))
    }))
  }));
}

/**
 * Helper untuk mengubah status lifecycle pertemuan (draft, in_progress, ready, completed)
 */
export function updateMeetingStatus(
  projects: LearningProject[],
  meetingId: string,
  newStatus: MeetingStatus
): LearningProject[] {
  const now = new Date().toISOString().split('T')[0];

  return projects.map(p => ({
    ...p,
    updatedAt: now,
    classSubjects: p.classSubjects.map(cs => ({
      ...cs,
      chapters: cs.chapters.map(ch => ({
        ...ch,
        meetings: ch.meetings.map(m => {
          if (m.id !== meetingId) return m;
          return {
            ...m,
            status: newStatus,
            updatedAt: now,
            completedAt: newStatus === 'completed' ? now : m.completedAt
          };
        })
      }))
    }))
  }));
}

/**
 * Helper untuk mengubah status produk spesifik pada pertemuan
 */
export function updateMeetingProductState(
  projects: LearningProject[],
  meetingId: string,
  productKey: keyof MeetingSession['productStates'],
  status: ProductLifecycleStatus
): LearningProject[] {
  const now = new Date().toISOString().split('T')[0];

  return projects.map(p => ({
    ...p,
    classSubjects: p.classSubjects.map(cs => ({
      ...cs,
      chapters: cs.chapters.map(ch => ({
        ...ch,
        meetings: ch.meetings.map(m => {
          if (m.id !== meetingId) return m;
          return {
            ...m,
            updatedAt: now,
            productStates: {
              ...m.productStates,
              [productKey]: status
            }
          };
        })
      }))
    }))
  }));
}

export interface CreateProjectFormInput {
  tingkat: EducationLevel;
  kelas: string;
  mapel: string;
  babTeks: string;
  temaPembelajaran: string;
  materiPelajaran: string;
  cakupanMateri: string;
  catatan?: string;
  teacherName?: string;
  schoolName?: string;
}

/**
 * Membuat entitas LearningProject lengkap dan terstruktur secara deterministik
 * dari input form sederhana "Buat Proyek" (1 Data -> Banyak Produk).
 */
export function createLearningProjectFromFormData(
  input: CreateProjectFormInput
): { project: LearningProject; activeContext: ActiveLearningContext } {
  const now = new Date().toISOString().split('T')[0];
  const projectId = `lp-${Date.now()}`;
  const classSubjectId = `cs-${Date.now()}`;
  const chapterId = `ch-${Date.now()}`;
  const meetingId = `meet-${Date.now()}`;

  const cleanBab = input.babTeks.trim();
  const cleanMateri = input.materiPelajaran.trim();
  const cleanTema = input.temaPembelajaran.trim();
  const cleanCakupan = input.cakupanMateri.trim();

  // Rekomendasi otomatis TP dari AI STIVIA jika belum ada
  const suggestedObjectives = suggestLearningObjectives(input.mapel, cleanMateri, cleanBab);
  const objectives = suggestedObjectives && suggestedObjectives.length > 0
    ? suggestedObjectives
    : [
        `Memahami konsep dasar dan karakteristik utama dari materi ${cleanMateri}.`,
        `Menganalisis keterkaitan materi ${cleanMateri} dalam konteks kehidupan nyata.`,
        `Menerapkan pemahaman untuk menyelesaikan persoalan kontekstual secara kritis.`
      ];

  const masterLearningData: MasterLearningData = {
    temaKegiatan: cleanTema,
    materiDiajarkan: cleanMateri,
    cakupanMateri: cleanCakupan,
    learningObjectives: objectives,
    userNotes: input.catatan?.trim() || '',
    version: 1,
    updatedAt: now
  };

  const meeting: MeetingSession = {
    id: meetingId,
    meetingNumber: 'Pertemuan 1',
    title: cleanTema || cleanMateri,
    status: 'ready',
    masterLearningData,
    productStates: {
      material: 'not_started',
      infographic: 'not_started',
      lkpd: 'not_started',
      presentation: 'not_started',
      assessment_harian: 'not_started',
      assessment_sumatif: 'not_started'
    },
    createdAt: now,
    updatedAt: now
  };

  const chapter: ChapterNode = {
    id: chapterId,
    chapterNumber: cleanBab.toLowerCase().startsWith('bab') ? cleanBab.split(':')[0].trim() : 'Bab 1',
    title: cleanBab,
    meetings: [meeting],
    createdAt: now,
    updatedAt: now
  };

  const classSubject: ClassSubjectNode = {
    id: classSubjectId,
    educationLevel: input.tingkat,
    grade: input.kelas,
    subject: input.mapel,
    chapters: [chapter],
    createdAt: now,
    updatedAt: now
  };

  const project: LearningProject = {
    id: projectId,
    name: `${cleanBab} (${input.mapel} • ${input.kelas})`,
    academicYear: '2026/2027',
    semester: 'Ganjil',
    teacherName: input.teacherName || 'Pendidik STIVIA',
    schoolName: input.schoolName || 'Sekolah Penggerak STIVIA',
    classSubjects: [classSubject],
    createdAt: now,
    updatedAt: now
  };

  const activeContext: ActiveLearningContext = {
    activeProjectId: projectId,
    activeClassSubjectId: classSubjectId,
    activeChapterId: chapterId,
    activeMeetingId: meetingId
  };

  return { project, activeContext };
}

