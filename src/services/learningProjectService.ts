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
  ProductLifecycleStatus,
  MeetingProductStates
} from '../types';
import { suggestLearningObjectives } from './stiviaThinkingFramework';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_SAMPLE_DRAFT } from '../data/mockData';

export function getStorageProjectsKey(userId?: string): string {
  if (userId) return `stivia_learning_projects_${userId}`;
  return 'stivia_learning_projects_guest';
}

export function getStorageContextKey(userId?: string): string {
  if (userId) return `stivia_active_learning_context_${userId}`;
  return 'stivia_active_learning_context_guest';
}

export function getStorageLegacyProjectsKey(userId?: string): string {
  if (userId) return `stivia_projects_${userId}`;
  return 'stivia_projects_guest';
}

export function getStorageCurrentDraftKey(userId?: string): string {
  if (userId) return `stivia_current_draft_${userId}`;
  return 'stivia_current_draft_guest';
}

/**
 * Data Awal Contoh Proyek Pembelajaran STIVIA (Template Netral & Bebas Data Pribadi Tertentu)
 */
export const DEFAULT_INITIAL_LEARNING_PROJECT: LearningProject = {
  id: 'proj-lp-sample',
  name: 'Contoh Proyek Bahasa Indonesia (Kurikulum Merdeka)',
  academicYear: '2026/2027',
  semester: 'Ganjil',
  teacherName: 'Pendidik STIVIA',
  schoolName: 'Sekolah Penggerak STIVIA',
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
                reinforcementActivities: 'Diskusi berpasangan membandingkan 2 contoh iklan di majalah dan media sosial, dilanjutkan latihan identifikasi 4 unsur pembentuk iklan.',
                assessmentEnabled: false,
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
              isContinuation: true,
              continuationFromMeetingId: 'meet-001',
              continuationFromMeetingNumber: 'Pertemuan 1',
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
                reinforcementActivities: 'Praktik terbimbing dalam kelompok 3-4 siswa merancang 1 slogan kreatif untuk kampanye kebersihan lingkungan sekolah.',
                assessmentEnabled: true,
                assessmentType: 'Formatif',
                assessmentForms: ['Pilihan Ganda', 'Praktik'],
                assessmentNotes: 'Asesmen formatif unjuk kerja perancangan slogan dan kuis 5 butir pemahaman struktur iklan.',
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
 * Membuat entitas contoh proyek yang dikustomisasi dengan profil pendidik aktif
 */
export function createSampleProjectForUser(teacherName?: string, schoolName?: string): LearningProject {
  const now = new Date().toISOString().split('T')[0];
  const uniqueId = `proj-sample-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  return {
    ...DEFAULT_INITIAL_LEARNING_PROJECT,
    id: uniqueId,
    name: 'Contoh Proyek Pembelajaran',
    teacherName: teacherName || 'Pendidik STIVIA',
    schoolName: schoolName || 'Sekolah Penggerak STIVIA',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Mengambil daftar proyek pembelajaran terstruktur dari localStorage secara terisolasi per pengguna.
 * Mencegah data akun lain bocor pada browser yang sama.
 */
export function getStoredLearningProjects(userId?: string): LearningProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const effectiveUserId = userId || (localStorage.getItem('stivia_last_user_id') || undefined);
    const key = getStorageProjectsKey(effectiveUserId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    // Jika pengguna belum login (guest), sediakan template netral
    if (!effectiveUserId) {
      const guestRaw = localStorage.getItem('stivia_learning_projects_guest');
      if (guestRaw) {
        try {
          const parsedGuest = JSON.parse(guestRaw);
          if (Array.isArray(parsedGuest) && parsedGuest.length > 0) return parsedGuest;
        } catch (_) {}
      }
      const initial = [DEFAULT_INITIAL_LEARNING_PROJECT];
      localStorage.setItem('stivia_learning_projects_guest', JSON.stringify(initial));
      return initial;
    }

    // Untuk pengguna terautentikasi: default ke array kosong jika belum ada proyek
    return [];
  } catch (e) {
    console.warn('Gagal membaca learning projects dari localStorage:', e);
    return [];
  }
}

/**
 * Menyimpan daftar proyek pembelajaran ke localStorage secara terisolasi per pengguna.
 */
export function saveStoredLearningProjects(projects: LearningProject[], userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const effectiveUserId = userId || (localStorage.getItem('stivia_last_user_id') || undefined);
    const key = getStorageProjectsKey(effectiveUserId);
    localStorage.setItem(key, JSON.stringify(projects));
  } catch (e) {
    console.error('Gagal menyimpan learning projects ke localStorage:', e);
  }
}

/**
 * Mengambil status konteks aktif terisolasi per pengguna.
 */
export function getStoredActiveContext(userId?: string): ActiveLearningContext {
  const fallbackContext: ActiveLearningContext = {
    activeProjectId: undefined,
    activeClassSubjectId: undefined,
    activeChapterId: undefined,
    activeMeetingId: undefined
  };

  if (typeof window === 'undefined') return fallbackContext;
  try {
    const effectiveUserId = userId || (localStorage.getItem('stivia_last_user_id') || undefined);
    const key = getStorageContextKey(effectiveUserId);
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Gagal membaca active context:', e);
  }
  return fallbackContext;
}

/**
 * Menyimpan status konteks aktif ke localStorage terisolasi per pengguna.
 */
export function saveStoredActiveContext(context: ActiveLearningContext, userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const effectiveUserId = userId || (localStorage.getItem('stivia_last_user_id') || undefined);
    const key = getStorageContextKey(effectiveUserId);
    localStorage.setItem(key, JSON.stringify(context));
  } catch (e) {
    console.error('Gagal menyimpan active context:', e);
  }
}

/**
 * Mengambil daftar proyek/draf infografis lama terisolasi per pengguna.
 */
export function getStoredLegacyProjects(userId?: string): InfographicDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const effectiveUserId = userId || (localStorage.getItem('stivia_last_user_id') || undefined);
    const key = getStorageLegacyProjectsKey(effectiveUserId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (p) => !['proj-002', 'proj-003', 'proj-004', 'sample-draft-001'].includes(p.id)
        );
      }
    }
  } catch (e) {
    console.warn('Gagal membaca legacy projects dari localStorage:', e);
  }
  return [];
}

/**
 * Menyimpan daftar proyek/draf infografis lama terisolasi per pengguna.
 */
export function saveStoredLegacyProjects(drafts: InfographicDraft[], userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const effectiveUserId = userId || (localStorage.getItem('stivia_last_user_id') || undefined);
    const key = getStorageLegacyProjectsKey(effectiveUserId);
    localStorage.setItem(key, JSON.stringify(drafts));
  } catch (e) {
    console.error('Gagal menyimpan legacy projects ke localStorage:', e);
  }
}

/**
 * Mengambil draf aktif (current draft) terisolasi per pengguna.
 */
export function getStoredCurrentDraft(userId?: string, fallbackDraft?: InfographicDraft): InfographicDraft {
  const fallback: InfographicDraft = fallbackDraft || {
    ...INITIAL_SAMPLE_DRAFT,
    id: `draft-${Date.now()}`
  };

  if (typeof window === 'undefined') return fallback;
  try {
    const effectiveUserId = userId || (localStorage.getItem('stivia_last_user_id') || undefined);
    const key = getStorageCurrentDraftKey(effectiveUserId);
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Gagal membaca current draft dari localStorage:', e);
  }
  return fallback;
}

/**
 * Menyimpan draf aktif (current draft) terisolasi per pengguna.
 */
export function saveStoredCurrentDraft(draft: InfographicDraft, userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const effectiveUserId = userId || (localStorage.getItem('stivia_last_user_id') || undefined);
    const key = getStorageCurrentDraftKey(effectiveUserId);
    localStorage.setItem(key, JSON.stringify(draft));
  } catch (e) {
    console.error('Gagal menyimpan current draft ke localStorage:', e);
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
 * Jika cakupanMateri atau materiDiajarkan berubah secara substantif, version dinaikkan otomatis.
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
          const isSubstantiveChange = 
            (newMasterData.cakupanMateri !== undefined && newMasterData.cakupanMateri !== oldData.cakupanMateri) ||
            (newMasterData.materiDiajarkan !== undefined && newMasterData.materiDiajarkan !== oldData.materiDiajarkan);

          const newVersion = isSubstantiveChange 
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
 * Helper untuk memperbarui metadata pertemuan (judul, kelanjutan dari pertemuan sebelumnya).
 */
export function updateMeetingMetadata(
  projects: LearningProject[],
  meetingId: string,
  metadata: {
    title?: string;
    isContinuation?: boolean;
    continuationFromMeetingId?: string;
    continuationFromMeetingNumber?: string;
  }
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
            ...metadata,
            updatedAt: now
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

/**
 * Membandingkan nomor pertemuan secara alami/numerik (Pertemuan 1, Pertemuan 2, ... Pertemuan 10).
 */
export function compareMeetingNumbers(
  aNum?: string,
  bNum?: string,
  aCreated?: string,
  bCreated?: string
): number {
  const parseNum = (str?: string): number | null => {
    if (!str) return null;
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };
  const numA = parseNum(aNum);
  const numB = parseNum(bNum);
  if (numA !== null && numB !== null) {
    if (numA !== numB) return numA - numB;
  }
  if (aNum && bNum && aNum !== bNum) {
    return aNum.localeCompare(bNum, undefined, { numeric: true });
  }
  return (aCreated || '').localeCompare(bCreated || '');
}

/**
 * Menormalkan nomor urut pertemuan (meetingNumber) dalam sebuah chapter
 * menjadi "Pertemuan 1", "Pertemuan 2", ..., "Pertemuan N".
 * PENTING:
 * - meeting.id (UUID/identitas permanen) TIDAK BERUBAH.
 * - masterLearningData TIDAK BERUBAH.
 * - productStates TIDAK BERUBAH.
 * - Hanya properti `meetingNumber` yang diselaraskan dengan indeks 1-based.
 */
export function normalizeMeetingNumbers(meetings: MeetingSession[]): MeetingSession[] {
  return meetings.map((m, index) => {
    const expectedNumber = `Pertemuan ${index + 1}`;
    if (m.meetingNumber === expectedNumber) {
      return m;
    }
    return {
      ...m,
      meetingNumber: expectedNumber
    };
  });
}

/**
 * Menyisipkan pertemuan baru ke dalam chapter pada posisi tertentu (1-based),
 * kemudian menormalkan urutan nomor pertemuan secara berurutan.
 * Jika targetPosition tidak ditentukan atau lebih besar dari panjang array,
 * pertemuan akan ditambahkan sebagai pertemuan terakhir.
 */
export function insertMeetingIntoProject(
  projects: LearningProject[],
  targetChapterId: string,
  newMeeting: MeetingSession,
  targetPosition?: number
): { updatedProjects: LearningProject[]; targetProjectId?: string } {
  const now = new Date().toISOString().split('T')[0];
  let targetProjectId: string | undefined;

  const updatedProjects = projects.map(p => {
    let pModified = false;
    const updatedClasses = p.classSubjects.map(cs => {
      let csModified = false;
      const updatedChapters = cs.chapters.map(ch => {
        if (ch.id !== targetChapterId) return ch;

        pModified = true;
        csModified = true;
        targetProjectId = p.id;

        const currentMeetings = [...ch.meetings];
        // Jika pertemuan yang ada saat ini hanya 1 draft kosong ("Pertemuan 1 (Belum Diatur)"),
        // gantikan draft kosong tersebut agar alur langsung rapi
        const hasOnlyOneEmptyDraft =
          currentMeetings.length === 1 &&
          currentMeetings[0].status === 'draft' &&
          !currentMeetings[0].masterLearningData.materiDiajarkan &&
          !currentMeetings[0].masterLearningData.temaKegiatan;

        if (hasOnlyOneEmptyDraft) {
          return {
            ...ch,
            updatedAt: now,
            meetings: [{ ...newMeeting, meetingNumber: 'Pertemuan 1' }]
          };
        }

        // Tentukan posisi index 0-based
        const pos = (targetPosition && targetPosition >= 1 && targetPosition <= currentMeetings.length + 1)
          ? targetPosition - 1
          : currentMeetings.length;

        currentMeetings.splice(pos, 0, newMeeting);
        const normalized = normalizeMeetingNumbers(currentMeetings);

        return {
          ...ch,
          updatedAt: now,
          meetings: normalized
        };
      });

      if (!csModified) return cs;
      return {
        ...cs,
        chapters: updatedChapters,
        updatedAt: now
      };
    });

    if (!pModified) return p;
    return {
      ...p,
      classSubjects: updatedClasses,
      updatedAt: now
    };
  });

  return { updatedProjects, targetProjectId };
}

/**
 * Mengubah posisi urutan pertemuan ke atas ('up') atau ke bawah ('down') dalam chapter,
 * lalu menormalkan penomoran seluruh pertemuan yang tersisa.
 */
export function reorderMeetingInProject(
  projects: LearningProject[],
  targetChapterId: string,
  targetMeetingId: string,
  direction: 'up' | 'down'
): { updatedProjects: LearningProject[]; targetProjectId?: string } {
  let targetProjectId: string | undefined;
  const now = new Date().toISOString().split('T')[0];

  const updatedProjects = projects.map(p => {
    let pModified = false;
    const updatedClasses = p.classSubjects.map(cs => {
      let csModified = false;
      const updatedChapters = cs.chapters.map(ch => {
        if (ch.id !== targetChapterId) return ch;

        const idx = ch.meetings.findIndex(m => m.id === targetMeetingId);
        if (idx === -1) return ch;
        if (direction === 'up' && idx === 0) return ch;
        if (direction === 'down' && idx === ch.meetings.length - 1) return ch;

        pModified = true;
        csModified = true;
        targetProjectId = p.id;

        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        const list = [...ch.meetings];
        const temp = list[idx];
        list[idx] = list[swapIdx];
        list[swapIdx] = temp;

        const normalized = normalizeMeetingNumbers(list);

        return {
          ...ch,
          updatedAt: now,
          meetings: normalized
        };
      });

      if (!csModified) return cs;
      return {
        ...cs,
        chapters: updatedChapters,
        updatedAt: now
      };
    });

    if (!pModified) return p;
    return {
      ...p,
      classSubjects: updatedClasses,
      updatedAt: now
    };
  });

  return { updatedProjects, targetProjectId };
}

/**
 * Menghapus pertemuan dari proyek dan menormalkan kembali nomor urut pertemuan yang tersisa.
 * Menghasilkan proyek terbarukan, ID pertemuan aktif berikutnya, dan data pertemuan yang dihapus.
 */
export function removeMeetingFromProject(
  projects: LearningProject[],
  targetMeetingId: string
): {
  updatedProjects: LearningProject[];
  nextActiveMeetingId?: string;
  deletedMeeting?: MeetingSession;
  targetProjectId?: string;
} {
  let nextActiveMeetingId: string | undefined;
  let deletedMeeting: MeetingSession | undefined;
  let targetProjectId: string | undefined;
  const now = new Date().toISOString().split('T')[0];

  const updatedProjects = projects.map(p => {
    let pModified = false;
    const updatedClasses = p.classSubjects.map(cs => {
      let csModified = false;
      const updatedChapters = cs.chapters.map(ch => {
        const meetingIndex = ch.meetings.findIndex(m => m.id === targetMeetingId);
        if (meetingIndex === -1) return ch;

        pModified = true;
        csModified = true;
        targetProjectId = p.id;
        deletedMeeting = ch.meetings[meetingIndex];

        const remaining = ch.meetings.filter(m => m.id !== targetMeetingId);
        const normalized = normalizeMeetingNumbers(remaining);

        if (normalized.length > 0) {
          // Pilih pertemuan pada posisi yang sama, atau pertemuan terakhir jika yang dihapus adalah paling belakang
          const newActiveIndex = Math.min(meetingIndex, normalized.length - 1);
          nextActiveMeetingId = normalized[newActiveIndex].id;
        } else {
          nextActiveMeetingId = undefined;
        }

        return {
          ...ch,
          updatedAt: now,
          meetings: normalized
        };
      });

      if (!csModified) return cs;
      return {
        ...cs,
        chapters: updatedChapters,
        updatedAt: now
      };
    });

    if (!pModified) return p;
    return {
      ...p,
      classSubjects: updatedClasses,
      updatedAt: now
    };
  });

  return { updatedProjects, nextActiveMeetingId, deletedMeeting, targetProjectId };
}

export interface CreateProjectFormInput {
  namaProyek: string;
  tingkat: EducationLevel;
  kelas: string;
  mapel: string;
  teacherName?: string;
  schoolName?: string;
  // Properti backward compatibility opsional
  babTeks?: string;
  temaPembelajaran?: string;
  materiPelajaran?: string;
  cakupanMateri?: string;
  catatan?: string;
}

/**
 * Membuat entitas LearningProject (Wadah Pembelajaran) dari input "Buat Proyek".
 * Sesuai prinsip STIVIA:
 * - PROYEK = Wadah Pembelajaran (Nama Proyek, Tingkat, Kelas, Mata Pelajaran)
 * - PERTEMUAN = Unit Pembelajaran (Materi, Tema, Cakupan, TP, Catatan)
 * Proyek baru TIDAK membuat Master Learning Data palsu/dummy.
 */
export function createLearningProjectFromFormData(
  input: CreateProjectFormInput
): { project: LearningProject; activeContext: ActiveLearningContext } {
  const now = new Date().toISOString().split('T')[0];
  const entropy = Math.random().toString(36).substring(2, 7);
  const ts = Date.now();
  const projectId = `lp-${ts}-${entropy}`;
  const classSubjectId = `cs-${ts}-${entropy}`;
  const chapterId = `ch-${ts}-${entropy}`;
  const meetingId = `meet-${ts}-${entropy}`;

  const cleanNamaProyek = input.namaProyek?.trim() || `${input.mapel} ${input.kelas} (${input.tingkat})`;
  const cleanBab = input.babTeks?.trim() || 'Bab 1';

  // Periksa apakah ada input materi kustom (untuk backward compatibility)
  const hasCustomLearningData = Boolean(
    input.materiPelajaran?.trim() || input.temaPembelajaran?.trim() || input.cakupanMateri?.trim()
  );

  // Jika input murni dari Buat Proyek baru: JANGAN membuat data pembelajaran dummy/palsu!
  const masterLearningData: MasterLearningData = hasCustomLearningData
    ? {
        temaKegiatan: input.temaPembelajaran?.trim() || '',
        materiDiajarkan: input.materiPelajaran?.trim() || '',
        cakupanMateri: input.cakupanMateri?.trim() || '',
        learningObjectives: [],
        reinforcementActivities: '',
        assessmentEnabled: false,
        userNotes: input.catatan?.trim() || '',
        version: 1,
        updatedAt: now
      }
    : {
        temaKegiatan: '',
        materiDiajarkan: '',
        cakupanMateri: '',
        learningObjectives: [],
        reinforcementActivities: '',
        assessmentEnabled: false,
        userNotes: '',
        version: 1,
        updatedAt: now
      };

  const meeting: MeetingSession = {
    id: meetingId,
    meetingNumber: 'Pertemuan 1',
    title: hasCustomLearningData 
      ? (input.temaPembelajaran?.trim() || input.materiPelajaran?.trim() || 'Pertemuan 1')
      : 'Pertemuan 1 (Belum Diatur)',
    status: hasCustomLearningData ? 'ready' : 'draft',
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
    grade: input.kelas.trim(),
    subject: input.mapel.trim(),
    chapters: [chapter],
    createdAt: now,
    updatedAt: now
  };

  const project: LearningProject = {
    id: projectId,
    name: cleanNamaProyek,
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

// ============================================================================
// STIVIA MULTI-DEVICE CLOUD PERSISTENCE & SYNCHRONIZATION (SUPABASE)
// ============================================================================

/**
 * Mengambil seluruh hierarki proyek pembelajaran milik pengguna yang sedang login dari Supabase.
 * Menggunakan nested select PostgreSQL/PostgREST untuk efisiensi maksimal (tanpa N+1 query).
 */
export async function fetchLearningProjectsFromSupabase(userId: string): Promise<LearningProject[]> {
  if (!isSupabaseConfigured || !userId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('learning_projects')
      .select(`
        id,
        name,
        academic_year,
        semester,
        teacher_name,
        school_name,
        is_legacy_adapted,
        created_at,
        updated_at,
        learning_classes (
          id,
          education_level,
          grade,
          subject,
          created_at,
          updated_at,
          learning_chapters (
            id,
            chapter_number,
            title,
            created_at,
            updated_at,
            learning_meetings (
              *,
              master_learning_data (
                *
              )
            )
          )
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        console.warn('[STIVIA Supabase] Tabel public.learning_projects belum diinisialisasi di Supabase. Menggunakan local cache.');
      } else {
        console.warn('[STIVIA Supabase] Gagal mengambil learning_projects dari Supabase:', error);
      }
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    const projects: LearningProject[] = data.map((p: any) => {
      const classes: ClassSubjectNode[] = ((p.learning_classes || []) as any[])
        .slice()
        .sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''))
        .map((c: any) => {
          const chapters: ChapterNode[] = ((c.learning_chapters || []) as any[])
            .slice()
            .sort((a, b) => (a.chapter_number || a.created_at || '').localeCompare(b.chapter_number || b.created_at || ''))
            .map((ch: any) => {
              const meetings: MeetingSession[] = ((ch.learning_meetings || []) as any[])
                .slice()
                .sort((a, b) => compareMeetingNumbers(a.meeting_number, b.meeting_number, a.created_at, b.created_at))
                .map((m: any) => {
                const mldRaw = Array.isArray(m.master_learning_data) 
                  ? m.master_learning_data[0] 
                  : m.master_learning_data;

                const masterLearningData: MasterLearningData = {
                  temaKegiatan: mldRaw?.tema_kegiatan || m.title || '',
                  materiDiajarkan: mldRaw?.materi_diajarkan || m.title || '',
                  cakupanMateri: mldRaw?.cakupan_materi || '',
                  learningObjectives: Array.isArray(mldRaw?.learning_objectives) 
                    ? mldRaw.learning_objectives 
                    : [],
                  reinforcementActivities: mldRaw?.reinforcement_activities || '',
                  assessmentEnabled: Boolean(mldRaw?.assessment_enabled),
                  assessmentType: mldRaw?.assessment_type || undefined,
                  assessmentForms: Array.isArray(mldRaw?.assessment_forms) ? mldRaw.assessment_forms : undefined,
                  assessmentNotes: mldRaw?.assessment_notes || '',
                  userNotes: mldRaw?.user_notes || '',
                  version: typeof mldRaw?.version === 'number' ? mldRaw.version : 1,
                  updatedAt: mldRaw?.updated_at || m.updated_at
                };

                const defaultProductStates: MeetingProductStates = {
                  material: 'not_started',
                  infographic: 'not_started',
                  lkpd: 'not_started',
                  presentation: 'not_started',
                  assessment_harian: 'not_started',
                  assessment_sumatif: 'not_started'
                };

                return {
                  id: m.id,
                  meetingNumber: m.meeting_number,
                  title: m.title,
                  status: (m.status || 'draft') as MeetingStatus,
                  isContinuation: Boolean(m.is_continuation),
                  continuationFromMeetingId: m.continuation_from_meeting_id || undefined,
                  continuationFromMeetingNumber: m.continuation_from_meeting_number || undefined,
                  masterLearningData,
                  productStates: m.product_states ? { ...defaultProductStates, ...m.product_states } : defaultProductStates,
                  createdAt: m.created_at,
                  updatedAt: m.updated_at,
                  completedAt: m.completedAt || m.completed_at || undefined,
                  legacyDraftId: m.legacy_draft_id || undefined
                };
              });

              return {
                id: ch.id,
                chapterNumber: ch.chapter_number,
                title: ch.title,
                meetings,
                createdAt: ch.created_at,
                updatedAt: ch.updated_at
              };
            });

          return {
            id: c.id,
            educationLevel: (c.education_level || 'SMP') as EducationLevel,
            grade: c.grade,
            subject: c.subject,
            chapters,
            createdAt: c.created_at,
            updatedAt: c.updated_at
          };
        });

      return {
        id: p.id,
        name: p.name,
        academicYear: p.academic_year || '2026/2027',
        semester: (p.semester || 'Ganjil') as 'Ganjil' | 'Genap',
        teacherName: p.teacher_name || 'Pendidik STIVIA',
        schoolName: p.school_name || 'Sekolah Penggerak STIVIA',
        classSubjects: classes,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        isLegacyAdapted: Boolean(p.is_legacy_adapted)
      };
    });

    return projects;
  } catch (err) {
    console.warn('[STIVIA Supabase] Error saat query learning projects:', err);
    return [];
  }
}

/**
 * Menyimpan seluruh hierarki satu LearningProject ke Supabase secara aman.
 * Menjamin idempotency (tidak terjadi duplicate record) dengan upsert per ID.
 */
export async function saveLearningProjectToSupabase(
  project: LearningProject,
  userId: string
): Promise<{ success: boolean; isSchemaMissing?: boolean; error?: string }> {
  if (!isSupabaseConfigured || !userId) {
    return { success: false, error: 'Supabase belum dikonfigurasi atau sesi tidak aktif.' };
  }

  try {
    const now = new Date().toISOString();

    let effectiveUserId = userId;
    const { data: authData } = await supabase.auth.getSession();
    if (authData.session?.user?.id) {
      effectiveUserId = authData.session.user.id;
    }

    // 1. Upsert Proyek Utama
    const { error: projErr } = await supabase
      .from('learning_projects')
      .upsert({
        id: project.id,
        user_id: effectiveUserId,
        name: project.name,
        academic_year: project.academicYear || '2026/2027',
        semester: project.semester || 'Ganjil',
        teacher_name: project.teacherName || null,
        school_name: project.schoolName || null,
        is_legacy_adapted: Boolean(project.isLegacyAdapted),
        created_at: project.createdAt || now,
        updated_at: now
      }, { onConflict: 'id' });

    if (projErr) {
      if (projErr.code === 'PGRST205' || projErr.message?.includes('schema cache')) {
        return { success: false, isSchemaMissing: true, error: 'Tabel database Supabase belum dibuat.' };
      }
      return { success: false, error: projErr.message };
    }

    // 2. Upsert Kelas, Bab, Pertemuan, dan Master Learning Data
    for (const cs of project.classSubjects) {
      const { error: classErr } = await supabase
        .from('learning_classes')
        .upsert({
          id: cs.id,
          project_id: project.id,
          education_level: cs.educationLevel,
          grade: cs.grade,
          subject: cs.subject,
          created_at: cs.createdAt || now,
          updated_at: now
        }, { onConflict: 'id' });

      if (classErr) {
        console.warn('[STIVIA Supabase] Gagal menyimpan learning_classes:', classErr);
      }

      for (const ch of cs.chapters) {
        const { error: chErr } = await supabase
          .from('learning_chapters')
          .upsert({
            id: ch.id,
            class_id: cs.id,
            chapter_number: ch.chapterNumber,
            title: ch.title,
            created_at: ch.createdAt || now,
            updated_at: now
          }, { onConflict: 'id' });

        if (chErr) {
          console.warn('[STIVIA Supabase] Gagal menyimpan learning_chapters:', chErr);
        }

        for (const m of ch.meetings) {
          const meetingFullPayload: any = {
            id: m.id,
            chapter_id: ch.id,
            meeting_number: m.meetingNumber,
            title: m.title,
            status: m.status,
            product_states: m.productStates,
            is_continuation: Boolean(m.isContinuation),
            continuation_from_meeting_id: m.continuationFromMeetingId || null,
            continuation_from_meeting_number: m.continuationFromMeetingNumber || null,
            completed_at: m.completedAt || null,
            legacy_draft_id: m.legacyDraftId || null,
            created_at: m.createdAt || now,
            updated_at: now
          };

          let { error: meetErr } = await supabase
            .from('learning_meetings')
            .upsert(meetingFullPayload, { onConflict: 'id' });

          if (meetErr) {
            // Fallback jika kolom continuation belum ada di skema SQL database
            const meetingFallbackPayload = {
              id: m.id,
              chapter_id: ch.id,
              meeting_number: m.meetingNumber,
              title: m.title,
              status: m.status,
              product_states: m.productStates,
              completed_at: m.completedAt || null,
              legacy_draft_id: m.legacyDraftId || null,
              created_at: m.createdAt || now,
              updated_at: now
            };
            const { error: retryMeetErr } = await supabase
              .from('learning_meetings')
              .upsert(meetingFallbackPayload, { onConflict: 'id' });
            if (retryMeetErr) {
              console.warn('[STIVIA Supabase] Gagal menyimpan learning_meetings:', retryMeetErr);
            }
          }

          const mld = m.masterLearningData;
          if (mld) {
            const mldFullPayload: any = {
              meeting_id: m.id,
              tema_kegiatan: mld.temaKegiatan,
              materi_diajarkan: mld.materiDiajarkan,
              cakupan_materi: mld.cakupanMateri,
              learning_objectives: mld.learningObjectives || [],
              reinforcement_activities: mld.reinforcementActivities || '',
              assessment_enabled: Boolean(mld.assessmentEnabled),
              assessment_type: mld.assessmentType || null,
              assessment_forms: mld.assessmentForms || [],
              assessment_notes: mld.assessmentNotes || '',
              user_notes: mld.userNotes || '',
              version: mld.version || 1,
              created_at: mld.updatedAt || now,
              updated_at: now
            };

            let { error: mldErr } = await supabase
              .from('master_learning_data')
              .upsert(mldFullPayload, { onConflict: 'meeting_id' });

            if (mldErr) {
              // Fallback jika kolom baru belum ada di skema SQL database
              const mldFallbackPayload = {
                meeting_id: m.id,
                tema_kegiatan: mld.temaKegiatan,
                materi_diajarkan: mld.materiDiajarkan,
                cakupan_materi: mld.cakupanMateri,
                learning_objectives: mld.learningObjectives || [],
                user_notes: mld.userNotes || '',
                version: mld.version || 1,
                created_at: mld.updatedAt || now,
                updated_at: now
              };
              const { error: retryMldErr } = await supabase
                .from('master_learning_data')
                .upsert(mldFallbackPayload, { onConflict: 'meeting_id' });
              if (retryMldErr) {
                console.warn('[STIVIA Supabase] Gagal menyimpan master_learning_data:', retryMldErr);
              }
            }
          }
        }

        // Pruning meeting yatim: Bersihkan meeting di database yang sudah dihapus dari array chapter lokal
        try {
          const validMeetingIds = ch.meetings.map(m => m.id);
          const { data: existingDbMeetings } = await supabase
            .from('learning_meetings')
            .select('id')
            .eq('chapter_id', ch.id);

          if (existingDbMeetings && existingDbMeetings.length > 0) {
            const orphanMeetingIds = existingDbMeetings
              .map((row: any) => row.id)
              .filter((id: string) => !validMeetingIds.includes(id));

            if (orphanMeetingIds.length > 0) {
              await supabase.from('master_learning_data').delete().in('meeting_id', orphanMeetingIds);
              await supabase.from('learning_meetings').delete().in('id', orphanMeetingIds);
            }
          }
        } catch (pruneErr) {
          console.warn('[STIVIA Supabase] Catatan saat pruning meeting yatim:', pruneErr);
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[STIVIA Supabase] Error saat saveLearningProjectToSupabase:', err);
    return { success: false, error: err?.message || 'Gagal menyimpan ke Supabase.' };
  }
}

/**
 * Menghapus proyek pembelajaran dari Supabase secara konsisten.
 * Mencakup penghapusan relasional dari bawah ke atas jika cascade tidak aktif di Supabase:
 * master_learning_data -> learning_meetings -> learning_chapters -> learning_classes -> learning_projects.
 * Jika tabel belum dibuat di database Supabase (PGRST205), fungsi mengembalikan isSchemaMissing: true
 * agar penghapusan di sisi lokal tetap berjalan mulus tanpa menghalangi pengguna.
 */
export async function deleteLearningProjectFromSupabase(
  projectId: string,
  userId?: string
): Promise<{ success: boolean; isSchemaMissing?: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true, isSchemaMissing: true };
  }
  if (!projectId) {
    return { success: false, error: 'ID Proyek tidak valid.' };
  }

  try {
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const { data: authData } = await supabase.auth.getSession();
      effectiveUserId = authData.session?.user?.id;
    }

    // 1. Coba hapus langsung dari learning_projects (memanfaatkan DB FK ON DELETE CASCADE jika tersedia)
    let query = supabase.from('learning_projects').delete().eq('id', projectId);
    if (effectiveUserId) {
      query = query.eq('user_id', effectiveUserId);
    }
    const { error: directErr } = await query;

    // Jika berhasil langsung di Supabase tanpa error
    if (!directErr) {
      return { success: true };
    }

    // Jika tabel belum diinisialisasi / belum ada di schema cache Supabase (PGRST205)
    if (directErr.code === 'PGRST205' || directErr.message?.includes('schema cache')) {
      console.warn('[STIVIA Supabase] Tabel public.learning_projects belum diinisialisasi di Supabase. Proyek dihapus dari cache lokal.');
      return { success: true, isSchemaMissing: true };
    }

    // Jika error karena RLS (Permission Denied)
    if (directErr.code === '42501' || directErr.message?.includes('permission')) {
      return { success: false, error: 'Izin ditolak oleh database (RLS). Pastikan Anda pemilik proyek ini.' };
    }

    // 2. Fallback: Eksekusi penghapusan hierarki data secara eksplisit jika terjadi foreign key block (23503)
    console.warn('[STIVIA Supabase] Direct project delete encounter note, mencoba explicit cascade delete:', directErr.message);

    // Ambil seluruh class_id dalam project
    const { data: classes, error: classSelectErr } = await supabase
      .from('learning_classes')
      .select('id')
      .eq('project_id', projectId);

    if (classSelectErr?.code === 'PGRST205') {
      return { success: true, isSchemaMissing: true };
    }

    const classIds = (classes || []).map((c: any) => c.id).filter(Boolean);

    if (classIds.length > 0) {
      // Ambil seluruh chapter_id dalam class
      const { data: chapters } = await supabase
        .from('learning_chapters')
        .select('id')
        .in('class_id', classIds);

      const chapterIds = (chapters || []).map((ch: any) => ch.id).filter(Boolean);

      if (chapterIds.length > 0) {
        // Ambil seluruh meeting_id dalam chapter
        const { data: meetings } = await supabase
          .from('learning_meetings')
          .select('id')
          .in('chapter_id', chapterIds);

        const meetingIds = (meetings || []).map((m: any) => m.id).filter(Boolean);

        if (meetingIds.length > 0) {
          // Hapus master_learning_data
          await supabase
            .from('master_learning_data')
            .delete()
            .in('meeting_id', meetingIds);

          // Hapus learning_meetings
          await supabase
            .from('learning_meetings')
            .delete()
            .in('id', meetingIds);
        }

        // Hapus learning_chapters
        await supabase
          .from('learning_chapters')
          .delete()
          .in('id', chapterIds);
      }

      // Hapus learning_classes
      await supabase
        .from('learning_classes')
        .delete()
        .in('id', classIds);
    }

    // Terakhir: Hapus learning_projects record
    let finalQuery = supabase.from('learning_projects').delete().eq('id', projectId);
    if (effectiveUserId) {
      finalQuery = finalQuery.eq('user_id', effectiveUserId);
    }
    const { error: finalErr } = await finalQuery;

    if (finalErr) {
      if (finalErr.code === 'PGRST205' || finalErr.message?.includes('schema cache')) {
        return { success: true, isSchemaMissing: true };
      }
      console.error('[STIVIA Supabase] Gagal menghapus learning project setelah explicit cascade:', finalErr);
      return { success: false, error: finalErr.message };
    }

    return { success: true };
  } catch (err: any) {
    if (err?.code === 'PGRST205' || err?.message?.includes('schema cache')) {
      return { success: true, isSchemaMissing: true };
    }
    console.error('[STIVIA Supabase] Error saat deleteLearningProjectFromSupabase:', err);
    return { success: false, error: err?.message || 'Gagal menghapus proyek di cloud.' };
  }
}

/**
 * Menghapus sebuah record pertemuan pembelajaran dari Supabase secara langsung.
 * Menghapus master_learning_data terkait dan record di public.learning_meetings
 * tanpa meninggalkan orphan/data yatim.
 */
export async function deleteLearningMeetingFromSupabase(
  meetingId: string
): Promise<{ success: boolean; isSchemaMissing?: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true, isSchemaMissing: true };
  }

  try {
    // 1. Bersihkan master_learning_data secara eksplisit
    const { error: mldErr } = await supabase
      .from('master_learning_data')
      .delete()
      .eq('meeting_id', meetingId);

    if (mldErr && mldErr.code !== 'PGRST116' && mldErr.code !== 'PGRST205') {
      console.warn('[STIVIA Supabase] Catatan saat hapus master_learning_data:', mldErr);
    }

    // 2. Hapus record pertemuan dari public.learning_meetings
    const { error: meetErr } = await supabase
      .from('learning_meetings')
      .delete()
      .eq('id', meetingId);

    if (meetErr) {
      if (meetErr.code === 'PGRST205' || meetErr.message?.includes('schema cache')) {
        return { success: true, isSchemaMissing: true };
      }
      console.error('[STIVIA Supabase] Gagal menghapus meeting dari Supabase:', meetErr);
      return { success: false, error: meetErr.message };
    }

    return { success: true };
  } catch (err: any) {
    if (err?.code === 'PGRST205' || err?.message?.includes('schema cache')) {
      return { success: true, isSchemaMissing: true };
    }
    console.error('[STIVIA Supabase] Error saat delete meeting di Supabase:', err);
    return { success: false, error: err?.message || 'Gagal menghapus pertemuan di cloud.' };
  }
}

/**
 * Memperbarui Master Learning Data pada sebuah pertemuan secara langsung di Supabase.
 * Otomatis mendeteksi perubahan cakupan materi dan menaikkan version.
 */
export async function updateMeetingMasterInSupabase(
  meetingId: string,
  newMasterData: Partial<MasterLearningData>,
  userId?: string
): Promise<{ success: boolean; newVersion?: number; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase tidak dikonfigurasi.' };
  }

  try {
    const now = new Date().toISOString();

    // 1. Ambil data saat ini untuk cek version & cakupan materi
    const { data: current, error: getErr } = await supabase
      .from('master_learning_data')
      .select('version, cakupan_materi')
      .eq('meeting_id', meetingId)
      .maybeSingle();

    if (getErr && getErr.code !== 'PGRST116') {
      console.warn('[STIVIA Supabase] Catatan saat cek version master:', getErr);
    }

    const currentVersion = current?.version || 1;
    const isScopeChanged = newMasterData.cakupanMateri !== undefined && 
                           current?.cakupan_materi !== undefined &&
                           newMasterData.cakupanMateri !== current.cakupan_materi;
    const nextVersion = isScopeChanged ? currentVersion + 1 : currentVersion;

    const payload: Record<string, any> = {
      meeting_id: meetingId,
      version: nextVersion,
      updated_at: now
    };
    if (newMasterData.temaKegiatan !== undefined) payload.tema_kegiatan = newMasterData.temaKegiatan;
    if (newMasterData.materiDiajarkan !== undefined) payload.materi_diajarkan = newMasterData.materiDiajarkan;
    if (newMasterData.cakupanMateri !== undefined) payload.cakupan_materi = newMasterData.cakupanMateri;
    if (newMasterData.learningObjectives !== undefined) payload.learning_objectives = newMasterData.learningObjectives;
    if (newMasterData.userNotes !== undefined) payload.user_notes = newMasterData.userNotes;

    const { error: upsertErr } = await supabase
      .from('master_learning_data')
      .upsert(payload, { onConflict: 'meeting_id' });

    if (upsertErr) {
      console.warn('[STIVIA Supabase] Gagal menyimpan master learning data ke Supabase:', upsertErr);
      return { success: false, error: upsertErr.message };
    }

    // Perbarui juga updated_at pada pertemuan induk
    await supabase
      .from('learning_meetings')
      .update({ updated_at: now })
      .eq('id', meetingId);

    return { success: true, newVersion: nextVersion };
  } catch (err: any) {
    console.warn('[STIVIA Supabase] Error saat update master di Supabase:', err);
    return { success: false, error: err?.message || 'Gagal menyimpan ke Supabase.' };
  }
}

/**
 * Memperbarui status produk spesifik pada pertemuan di Supabase.
 */
export async function updateMeetingProductStateInSupabase(
  meetingId: string,
  productKey: keyof MeetingSession['productStates'],
  status: ProductLifecycleStatus
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { data: currentMeet, error: getErr } = await supabase
      .from('learning_meetings')
      .select('product_states')
      .eq('id', meetingId)
      .maybeSingle();

    if (getErr && getErr.code !== 'PGRST116') {
      console.warn('[STIVIA Supabase] Catatan saat baca product_states:', getErr);
    }

    const currentStates = currentMeet?.product_states || {};
    const updatedStates = { ...currentStates, [productKey]: status };

    const { error: updErr } = await supabase
      .from('learning_meetings')
      .update({
        product_states: updatedStates,
        updated_at: new Date().toISOString()
      })
      .eq('id', meetingId);

    if (updErr) {
      console.warn('[STIVIA Supabase] Gagal update product_states di Supabase:', updErr);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[STIVIA Supabase] Error updateMeetingProductStateInSupabase:', err);
    return false;
  }
}

/**
 * Memperbarui status lifecycle pertemuan di Supabase.
 */
export async function updateMeetingStatusInSupabase(
  meetingId: string,
  newStatus: MeetingStatus
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('learning_meetings')
      .update({
        status: newStatus,
        completed_at: newStatus === 'completed' ? now : null,
        updated_at: now
      })
      .eq('id', meetingId);

    if (error) {
      console.warn('[STIVIA Supabase] Gagal update status pertemuan di Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[STIVIA Supabase] Error updateMeetingStatusInSupabase:', err);
    return false;
  }
}

/**
 * Mengambil arsip draf lama / prompt infografis pengguna dari tabel stivia_projects di Supabase.
 */
export async function fetchLegacyProjectsFromSupabase(userId: string): Promise<InfographicDraft[]> {
  if (!isSupabaseConfigured || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('stivia_projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      if (error.code !== 'PGRST205') {
        console.warn('[STIVIA Supabase] Catatan query stivia_projects:', error);
      }
      return [];
    }

    return (data || []).map((row: any) => {
      const payload = row.draft_payload || {};
      return {
        id: row.id,
        title: row.title,
        subject: row.subject || payload.subject || 'Bahasa Indonesia',
        grade: row.grade || payload.grade || 'Kelas VIII',
        educationLevel: (row.education_level || payload.educationLevel || 'SMP') as EducationLevel,
        theme: row.theme || payload.theme || '',
        bab: row.bab || payload.bab || '',
        rawTopic: row.raw_topic || payload.rawTopic || '',
        pertemuan: row.pertemuan || payload.pertemuan || 'Pertemuan 1',
        scope: row.scope || payload.scope || '',
        userNotes: row.user_notes || payload.userNotes || '',
        learningObjective: row.learning_objective || payload.learningObjective || '',
        learningObjectivesList: Array.isArray(row.learning_objectives_list) ? row.learning_objectives_list : (payload.learningObjectivesList || []),
        visualStyle: row.visual_style || payload.visualStyle || 'Modern Edukatif',
        format: row.format || payload.format || 'portrait',
        visualLevel: row.visual_level || payload.visualLevel || 'seimbang',
        exampleContext: row.example_context || payload.exampleContext || 'sehari_hari',
        status: (row.status || payload.status || 'draft') as 'draft' | 'completed',
        sourceMeetingId: row.source_meeting_id || payload.sourceMeetingId,
        sourceMasterVersion: row.source_master_version || payload.sourceMasterVersion,
        blocks: payload.blocks || [],
        overview: payload.overview,
        contentSnapshot: payload.contentSnapshot,
        caseStudyBlock: payload.caseStudyBlock,
        synthesisSteps: payload.synthesisSteps,
        infographicSettings: payload.infographicSettings,
        stiviaPrompt: payload.stiviaPrompt,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      } as InfographicDraft;
    });
  } catch (err) {
    console.warn('[STIVIA Supabase] Error saat fetch legacy projects dari Supabase:', err);
    return [];
  }
}

/**
 * Menyimpan draf proyek lama / prompt infografis ke tabel stivia_projects di Supabase.
 */
export async function saveLegacyProjectToSupabase(
  draft: InfographicDraft,
  userId: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !userId) return false;
  try {
    const payload = {
      id: draft.id,
      user_id: userId,
      title: draft.title || 'Draf Pembelajaran',
      subject: draft.subject || null,
      grade: draft.grade || null,
      education_level: draft.educationLevel || null,
      theme: draft.theme || null,
      bab: draft.bab || null,
      raw_topic: draft.rawTopic || null,
      pertemuan: typeof draft.pertemuan === 'string' ? draft.pertemuan : (draft.pertemuan ? `Pertemuan ${draft.pertemuan}` : 'Pertemuan 1'),
      scope: draft.scope || null,
      user_notes: draft.userNotes || null,
      learning_objective: draft.learningObjective || null,
      learning_objectives_list: draft.learningObjectivesList || [],
      visual_style: draft.visualStyle || null,
      format: draft.format || null,
      visual_level: draft.visualLevel || null,
      example_context: draft.exampleContext || null,
      status: draft.status || 'draft',
      source_meeting_id: draft.sourceMeetingId || null,
      source_master_version: draft.sourceMasterVersion || null,
      draft_payload: {
        blocks: draft.blocks || [],
        overview: draft.overview || null,
        contentSnapshot: draft.contentSnapshot || null,
        caseStudyBlock: draft.caseStudyBlock || null,
        synthesisSteps: draft.synthesisSteps || null,
        infographicSettings: draft.infographicSettings || null,
        stiviaPrompt: draft.stiviaPrompt || null,
        materiDocumentConfig: draft.materiDocumentConfig || null
      },
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('stivia_projects')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      if (error.code !== 'PGRST205') {
        console.warn('[STIVIA Supabase] Gagal menyimpan legacy draft ke Supabase:', error);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[STIVIA Supabase] Error saat simpan legacy project ke Supabase:', err);
    return false;
  }
}

/**
 * Menghapus draf lama dari stivia_projects di Supabase.
 */
export async function deleteLegacyProjectFromSupabase(
  draftId: string,
  userId: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !userId) return false;
  try {
    const { error } = await supabase
      .from('stivia_projects')
      .delete()
      .eq('id', draftId)
      .eq('user_id', userId);

    if (error) {
      console.warn('[STIVIA Supabase] Gagal menghapus legacy draft dari Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[STIVIA Supabase] Error saat delete legacy project di Supabase:', err);
    return false;
  }
}

/**
 * FUNGSI UTAMA SINKRONISASI SAAT PENGGUNA LOGIN (Multi-Device Sync & Strict User Isolation):
 * 1. Ambil data dari Supabase Cloud khusus untuk userId tersebut (Source of Truth).
 * 2. Jika Supabase memiliki data, simpan ke local partition user tersebut (stivia_learning_projects_${userId}).
 * 3. Jika Supabase belum memiliki data:
 *    - HANYA periksa partition lokal user ini (getStoredLearningProjects(userId)).
 *    - JANGAN PERNAH mengambil data pengguna lain atau partisi global.
 *    - Jika user ini memiliki proyek lokal sendiri, sinkronkan ke Supabase.
 *    - Jika akun baru dan belum ada proyek, kembalikan [] (empty).
 * 4. Jamin tidak terjadi kebocoran atau tumpang tindih data antar-akun.
 */
export async function syncLearningProjectsOnLogin(userId: string): Promise<{
  learningProjects: LearningProject[];
  legacyProjects: InfographicDraft[];
  syncStatus: 'supabase_synced' | 'local_fallback' | 'empty';
}> {
  if (!isSupabaseConfigured || !userId) {
    return {
      learningProjects: getStoredLearningProjects(userId),
      legacyProjects: [],
      syncStatus: 'local_fallback'
    };
  }

  try {
    // 1. Ambil proyek hierarki milik pengguna dari Supabase Cloud (Source of Truth)
    const cloudProjects = await fetchLearningProjectsFromSupabase(userId);
    // 2. Ambil draf legacy milik pengguna dari Supabase Cloud
    const cloudLegacyDrafts = await fetchLegacyProjectsFromSupabase(userId);

    if (cloudProjects.length > 0) {
      // Supabase adalah Source of Truth: simpan ke partisi lokal user ini
      saveStoredLearningProjects(cloudProjects, userId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('stivia_last_user_id', userId);
      }
      return {
        learningProjects: cloudProjects,
        legacyProjects: cloudLegacyDrafts,
        syncStatus: 'supabase_synced'
      };
    }

    // 3. Jika di Supabase belum ada data:
    // HANYA ambil data lokal yang berada pada partisi user ini (stivia_learning_projects_${userId})
    const userLocalProjects = getStoredLearningProjects(userId);

    if (userLocalProjects.length > 0) {
      for (const p of userLocalProjects) {
        if (!p.id.startsWith('proj-lp-sample')) {
          await saveLearningProjectToSupabase(p, userId);
        }
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('stivia_last_user_id', userId);
      }
      return {
        learningProjects: userLocalProjects,
        legacyProjects: cloudLegacyDrafts,
        syncStatus: 'supabase_synced'
      };
    }

    // 4. Jika user ini memang belum memiliki proyek sama sekali (Akun Baru / Tanpa Proyek):
    if (typeof window !== 'undefined') {
      localStorage.setItem('stivia_last_user_id', userId);
    }
    return {
      learningProjects: [],
      legacyProjects: cloudLegacyDrafts,
      syncStatus: 'empty'
    };
  } catch (err) {
    console.warn('[STIVIA Supabase] Gagal sinkronisasi proyek saat login:', err);
    return {
      learningProjects: getStoredLearningProjects(userId),
      legacyProjects: [],
      syncStatus: 'local_fallback'
    };
  }
}


