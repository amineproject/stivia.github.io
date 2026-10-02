import {
  MeetingSession,
  ChapterNode,
  ClassSubjectNode,
  LearningProject,
  MateriProductContext,
  InfographicProductContext,
  LKPDProductContext,
  PresentationProductContext
} from '../types';
import { MateriSection } from './materiDocumentEngine';

/**
 * Membangun MateriProductContext dari MeetingSession aktif secara deterministik.
 * Mengisolasi Master Learning Data agar menjadi Single Source of Truth bagi Menu Materi.
 */
export function buildMateriProductContext(
  meeting: MeetingSession,
  chapter?: ChapterNode,
  classSubject?: ClassSubjectNode,
  project?: LearningProject
): MateriProductContext {
  const mld = meeting.masterLearningData;

  const cleanSubject = classSubject?.subject || 'Bahasa Indonesia';
  const cleanGrade = classSubject?.grade || 'Kelas VIII';
  const cleanLevel = classSubject?.educationLevel || 'SMP';
  const cleanBab = chapter?.title || 'Bab 1: Konsep Dasar';
  const cleanPertemuan = meeting.meetingNumber || 'Pertemuan 1';

  return {
    // Master Learning Data
    temaKegiatan: mld.temaKegiatan || meeting.title,
    materiDiajarkan: mld.materiDiajarkan || meeting.title,
    cakupanMateri: mld.cakupanMateri || '',
    learningObjectives: mld.learningObjectives || [],
    userNotes: mld.userNotes || '',

    // Hirarki Metadata
    educationLevel: cleanLevel,
    grade: cleanGrade,
    subject: cleanSubject,
    bab: cleanBab,
    pertemuan: cleanPertemuan,
    projectName: project?.name,
    schoolName: project?.schoolName,
    teacherName: project?.teacherName,

    // Provenance & Versioning
    sourceMeetingId: meeting.id,
    sourceMasterVersion: mld.version || 1
  };
}

/**
 * Membangun InfographicProductContext dari MeetingSession aktif secara deterministik.
 * Mengalirkan Master Learning Data ke Menu Infografis tanpa mengubah engine visual.
 */
export function buildInfographicProductContext(
  meeting: MeetingSession,
  chapter?: ChapterNode,
  classSubject?: ClassSubjectNode,
  project?: LearningProject
): InfographicProductContext {
  const mld = meeting.masterLearningData;

  const cleanSubject = classSubject?.subject || 'Informatika';
  const cleanGrade = classSubject?.grade || 'Kelas X';
  const cleanLevel = classSubject?.educationLevel || 'SMA';
  const cleanBab = chapter?.title || 'Bab 1: Konsep Dasar';
  const cleanPertemuan = meeting.meetingNumber || 'Pertemuan 1';

  return {
    // Master Learning Data
    temaKegiatan: mld.temaKegiatan || meeting.title,
    materiDiajarkan: mld.materiDiajarkan || meeting.title,
    cakupanMateri: mld.cakupanMateri || '',
    learningObjectives: mld.learningObjectives || [],
    userNotes: mld.userNotes || '',

    // Hirarki Metadata
    educationLevel: cleanLevel,
    grade: cleanGrade,
    subject: cleanSubject,
    bab: cleanBab,
    pertemuan: cleanPertemuan,
    projectName: project?.name,
    schoolName: project?.schoolName,
    teacherName: project?.teacherName,

    // Provenance & Versioning
    sourceMeetingId: meeting.id,
    sourceMasterVersion: mld.version || 1
  };
}


/**
 * Menghasilkan struktur bagian-bagian materi (MateriSection[]) dari teks Cakupan Materi Master
 * jika pengguna menginginkan sinkronisasi otomatis butir-butir materi ke dokumen A4.
 */
export function generateSectionsFromCakupan(
  cakupanMateri: string,
  materiDiajarkan: string
): MateriSection[] {
  if (!cakupanMateri || !cakupanMateri.trim()) {
    return [
      {
        id: `sec-${Date.now()}-1`,
        title: `A. Konsep Dasar ${materiDiajarkan}`,
        content: `${materiDiajarkan} merupakan konsep fundamental yang esensial dalam pembelajaran ini. Bagian ini menguraikan pengertian dasar, ruang lingkup materi, dan relevansinya bagi peserta didik.`
      }
    ];
  }

  const lines = cakupanMateri
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const sections: MateriSection[] = [];

  lines.forEach((line, idx) => {
    // Bersihkan prefix nomor/simbol seperti "1.", "2)", "-", "*"
    const cleanTitle = line.replace(/^(\d+[\.\)]|\-|\*|•)\s*/, '').trim();
    const letter = alphabet[idx % alphabet.length] || `${idx + 1}`;

    sections.push({
      id: `sec-${Date.now()}-${idx + 1}`,
      title: `${letter}. ${cleanTitle}`,
      content: `Bagian ini mendalami pembahasan mengenai "${cleanTitle}". Pendidik dapat menjabarkan penjelasan konseptual, karakteristik utama, serta ilustrasi pendukung materi ini secara komprehensif.`
    });
  });

  return sections;
}

/**
 * Memeriksa apakah dokumen materi yang sedang dibuka menggunakan versi Master Learning Data yang sudah usang.
 */
export function isMateriContextOutdated(
  docMasterVersion?: number,
  activeMasterVersion?: number
): boolean {
  if (docMasterVersion === undefined || activeMasterVersion === undefined) return false;
  return docMasterVersion < activeMasterVersion;
}

/**
 * Memeriksa apakah rancangan infografis yang sedang dibuka menggunakan versi Master Learning Data yang sudah usang.
 */
export function isInfographicContextOutdated(
  draftMasterVersion?: number,
  activeMasterVersion?: number
): boolean {
  if (draftMasterVersion === undefined || activeMasterVersion === undefined) return false;
  return draftMasterVersion < activeMasterVersion;
}

/**
 * Membangun LKPDProductContext dari MeetingSession aktif secara deterministik.
 * Mengalirkan Master Learning Data ke Menu LKPD (Poster LKPD) tanpa mengubah engine LKPD.
 */
export function buildLKPDProductContext(
  meeting: MeetingSession,
  chapter?: ChapterNode,
  classSubject?: ClassSubjectNode,
  project?: LearningProject
): LKPDProductContext {
  const mld = meeting.masterLearningData;

  const cleanSubject = classSubject?.subject || 'Informatika';
  const cleanGrade = classSubject?.grade || 'Kelas X';
  const cleanLevel = classSubject?.educationLevel || 'SMA';
  const cleanBab = chapter?.title || 'Bab 1: Konsep Dasar';
  const cleanPertemuan = meeting.meetingNumber || 'Pertemuan 1';

  return {
    // Master Learning Data
    temaKegiatan: mld.temaKegiatan || meeting.title,
    materiDiajarkan: mld.materiDiajarkan || meeting.title,
    cakupanMateri: mld.cakupanMateri || '',
    learningObjectives: mld.learningObjectives || [],
    userNotes: mld.userNotes || '',

    // Hirarki Metadata
    educationLevel: cleanLevel,
    grade: cleanGrade,
    subject: cleanSubject,
    bab: cleanBab,
    pertemuan: cleanPertemuan,
    projectName: project?.name,
    schoolName: project?.schoolName,
    teacherName: project?.teacherName,

    // Provenance & Versioning
    sourceMeetingId: meeting.id,
    sourceMasterVersion: mld.version || 1
  };
}

/**
 * Memeriksa apakah LKPD yang sedang dibuka menggunakan versi Master Learning Data yang sudah usang.
 */
export function isLKPDContextOutdated(
  lkpdMasterVersion?: number,
  activeMasterVersion?: number
): boolean {
  if (lkpdMasterVersion === undefined || activeMasterVersion === undefined) return false;
  return lkpdMasterVersion < activeMasterVersion;
}

/**
 * Membangun PresentationProductContext dari MeetingSession aktif secara deterministik.
 * Mengalirkan Master Learning Data ke Menu Presentasi (Gamma AI 10 Slide) tanpa mengubah engine presentasi.
 */
export function buildPresentationProductContext(
  meeting: MeetingSession,
  chapter?: ChapterNode,
  classSubject?: ClassSubjectNode,
  project?: LearningProject
): PresentationProductContext {
  const mld = meeting.masterLearningData;

  const cleanSubject = classSubject?.subject || 'Informatika';
  const cleanGrade = classSubject?.grade || 'Kelas X';
  const cleanLevel = classSubject?.educationLevel || 'SMA';
  const cleanBab = chapter?.title || 'Bab 1: Konsep Dasar';
  const cleanPertemuan = meeting.meetingNumber || 'Pertemuan 1';

  return {
    // Master Learning Data
    temaKegiatan: mld.temaKegiatan || meeting.title,
    materiDiajarkan: mld.materiDiajarkan || meeting.title,
    cakupanMateri: mld.cakupanMateri || '',
    learningObjectives: mld.learningObjectives || [],
    userNotes: mld.userNotes || '',

    // Hirarki Metadata
    educationLevel: cleanLevel,
    grade: cleanGrade,
    subject: cleanSubject,
    bab: cleanBab,
    pertemuan: cleanPertemuan,
    projectName: project?.name,
    schoolName: project?.schoolName,
    teacherName: project?.teacherName,

    // Provenance & Versioning
    sourceMeetingId: meeting.id,
    sourceMasterVersion: mld.version || 1
  };
}

/**
 * Memeriksa apakah rancangan presentasi yang sedang dibuka menggunakan versi Master Learning Data yang sudah usang.
 */
export function isPresentationContextOutdated(
  presentationMasterVersion?: number,
  activeMasterVersion?: number
): boolean {
  if (presentationMasterVersion === undefined || activeMasterVersion === undefined) return false;
  return presentationMasterVersion < activeMasterVersion;
}
