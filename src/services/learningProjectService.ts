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
  const entropy = Math.random().toString(36).substring(2, 7);
  const ts = Date.now();
  const projectId = `lp-${ts}-${entropy}`;
  const classSubjectId = `cs-${ts}-${entropy}`;
  const chapterId = `ch-${ts}-${entropy}`;
  const meetingId = `meet-${ts}-${entropy}`;

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
              id,
              meeting_number,
              title,
              status,
              product_states,
              completed_at,
              legacy_draft_id,
              created_at,
              updated_at,
              master_learning_data (
                id,
                tema_kegiatan,
                materi_diajarkan,
                cakupan_materi,
                learning_objectives,
                user_notes,
                version,
                created_at,
                updated_at
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
                .sort((a, b) => (a.meeting_number || a.created_at || '').localeCompare(b.meeting_number || b.created_at || ''))
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
                  masterLearningData,
                  productStates: m.product_states ? { ...defaultProductStates, ...m.product_states } : defaultProductStates,
                  createdAt: m.created_at,
                  updatedAt: m.updated_at,
                  completedAt: m.completed_at || undefined,
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

    // 1. Upsert Proyek Utama
    const { error: projErr } = await supabase
      .from('learning_projects')
      .upsert({
        id: project.id,
        user_id: userId,
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
          const { error: meetErr } = await supabase
            .from('learning_meetings')
            .upsert({
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
            }, { onConflict: 'id' });

          if (meetErr) {
            console.warn('[STIVIA Supabase] Gagal menyimpan learning_meetings:', meetErr);
          }

          const mld = m.masterLearningData;
          if (mld) {
            const { error: mldErr } = await supabase
              .from('master_learning_data')
              .upsert({
                meeting_id: m.id,
                tema_kegiatan: mld.temaKegiatan,
                materi_diajarkan: mld.materiDiajarkan,
                cakupan_materi: mld.cakupanMateri,
                learning_objectives: mld.learningObjectives || [],
                user_notes: mld.userNotes || '',
                version: mld.version || 1,
                created_at: mld.updatedAt || now,
                updated_at: now
              }, { onConflict: 'meeting_id' });

            if (mldErr) {
              console.warn('[STIVIA Supabase] Gagal menyimpan master_learning_data:', mldErr);
            }
          }
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
 * Menghapus proyek pembelajaran dari Supabase.
 * Database foreign key cascade otomatis menghapus seluruh kelas, bab, pertemuan, dan master data.
 */
export async function deleteLearningProjectFromSupabase(
  projectId: string,
  userId: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !userId) return false;
  try {
    const { error } = await supabase
      .from('learning_projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) {
      console.warn('[STIVIA Supabase] Gagal menghapus learning project dari Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[STIVIA Supabase] Error saat delete project di Supabase:', err);
    return false;
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
 * FUNGSI UTAMA SINKRONISASI SAAT PENGGUNA LOGIN (Multi-Device Sync):
 * 1. Ambil data dari Supabase Cloud (sebagai Source of Truth).
 * 2. Jika Supabase memiliki data, gunakan data tersebut dan update local cache.
 * 3. Jika Supabase kosong tetapi user punya data lokal kustom, backfill ke Supabase.
 * 4. Jika Supabase belum memiliki tabel atau offline, gunakan local cache dengan graceful degradation.
 */
export async function syncLearningProjectsOnLogin(userId: string): Promise<{
  learningProjects: LearningProject[];
  legacyProjects: InfographicDraft[];
  syncStatus: 'supabase_synced' | 'local_fallback' | 'empty';
}> {
  if (!isSupabaseConfigured || !userId) {
    return {
      learningProjects: getStoredLearningProjects(),
      legacyProjects: [],
      syncStatus: 'local_fallback'
    };
  }

  try {
    // 1. Ambil proyek hierarki dari Supabase
    const cloudProjects = await fetchLearningProjectsFromSupabase(userId);
    // 2. Ambil draf legacy dari Supabase
    const cloudLegacyDrafts = await fetchLegacyProjectsFromSupabase(userId);

    if (cloudProjects.length > 0) {
      // Supabase adalah Source of Truth: update local cache agar instan saat offline
      saveStoredLearningProjects(cloudProjects);
      return {
        learningProjects: cloudProjects,
        legacyProjects: cloudLegacyDrafts,
        syncStatus: 'supabase_synced'
      };
    }

    // Jika di Supabase belum ada data, periksa local storage untuk backfill aman
    const localProjects = getStoredLearningProjects();
    const hasCustomLocal = localProjects.some(p => !p.id.startsWith('proj-lp-001'));

    if (hasCustomLocal) {
      // Backfill proyek lokal kustom ke akun pengguna di Supabase
      for (const p of localProjects) {
        if (!p.id.startsWith('proj-lp-001')) {
          await saveLearningProjectToSupabase(p, userId);
        }
      }
      return {
        learningProjects: localProjects,
        legacyProjects: cloudLegacyDrafts,
        syncStatus: 'supabase_synced'
      };
    }

    return {
      learningProjects: localProjects,
      legacyProjects: cloudLegacyDrafts,
      syncStatus: 'local_fallback'
    };
  } catch (err) {
    console.warn('[STIVIA Supabase] Gagal sinkronisasi proyek saat login:', err);
    return {
      learningProjects: getStoredLearningProjects(),
      legacyProjects: [],
      syncStatus: 'local_fallback'
    };
  }
}


