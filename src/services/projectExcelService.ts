import * as XLSX from 'xlsx';
import { 
  LearningProject, 
  EducationLevel, 
  ClassSubjectNode, 
  ChapterNode, 
  MeetingSession, 
  MasterLearningData,
  MeetingStatus,
  ProductLifecycleStatus,
  MeetingProductStates
} from '../types';
import { parseIntegerNumber } from './learningProjectService';

/**
 * Representasi satu baris datar data impor/ekspor Excel
 */
export interface ExcelProjectRow {
  namaProyek: string;
  tahunAjaran?: string;
  semester?: string;
  guru?: string;
  sekolah?: string;
  jenjang: string;
  kelas: string;
  mapel: string;
  bab: string;
  pertemuan: string;
  judulPertemuan?: string;
  temaKegiatan?: string;
  materiDiajarkan?: string;
  cakupanMateri?: string;
  tujuanPembelajaran?: string;
  kegiatanPenguat?: string;
  statusPertemuan?: string;
  catatanGuru?: string;
}

/**
 * Hasil validasi per baris Excel
 */
export interface RowValidationResult {
  rowNumber: number;
  data: ExcelProjectRow;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Ringkasan hierarki hasil parsing kolektif
 */
export interface CollectiveImportPreview {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  warningsCount: number;
  rowResults: RowValidationResult[];
  hierarchicalProjects: LearningProject[];
  summary: {
    totalProjects: number;
    totalClasses: number;
    totalChapters: number;
    totalMeetings: number;
    projectNames: string[];
  };
}

/**
 * Normalisasi jenjang pendidikan
 */
export function normalizeEducationLevel(raw?: string): EducationLevel {
  const clean = (raw || '').toUpperCase().trim();
  if (clean.includes('SD') || clean.includes('SEKOLAH DASAR') || clean.includes('MI')) return 'SD';
  if (clean.includes('SMA') || clean.includes('MA')) return 'SMA';
  if (clean.includes('SMK') || clean.includes('KEJURUAN')) return 'SMK';
  return 'SMP'; // default netral
}

/**
 * Kolom resmi Excel STIVIA
 */
export const STIVIA_EXCEL_COLUMNS = [
  'Nama Proyek',
  'Tahun Ajaran',
  'Semester',
  'Nama Guru',
  'Nama Sekolah',
  'Jenjang',
  'Kelas',
  'Mata Pelajaran',
  'Bab / Teks',
  'Nomor Pertemuan',
  'Judul Pertemuan',
  'Tema Kegiatan',
  'Materi yang Diajarkan',
  'Cakupan Materi',
  'Tujuan Pembelajaran',
  'Kegiatan / Latihan Penguat',
  'Catatan Guru'
] as const;

/**
 * Membuat dan mengunduh templat resmi Excel STIVIA (.xlsx)
 */
export function generateOfficialExcelTemplate(): void {
  const headers = [...STIVIA_EXCEL_COLUMNS];

  const sampleRows: Record<string, string>[] = [
    {
      'Nama Proyek': 'Perangkat Ajar Bahasa Indonesia Kelas VIII',
      'Tahun Ajaran': '2026/2027',
      'Semester': 'Ganjil',
      'Nama Guru': 'Pendidik STIVIA',
      'Nama Sekolah': 'SMP Bintang Bangsa',
      'Jenjang': 'SMP',
      'Kelas': 'Kelas VIII',
      'Mata Pelajaran': 'Bahasa Indonesia',
      'Bab / Teks': 'Bab 1: Menemukan Pola Pesan dalam Iklan',
      'Nomor Pertemuan': 'Pertemuan 1',
      'Judul Pertemuan': 'Slogan, Kalimat Persuasif, dan Naskah Iklan',
      'Tema Kegiatan': 'Mengenal Ciri dan Unsur Teks Iklan Komersial',
      'Materi yang Diajarkan': 'Pengertian, fungsi, dan unsur utama teks iklan',
      'Cakupan Materi': '1. Pengertian dan fungsi sosial iklan di media digital.\n2. Ciri bahasa persuasif pada slogan.\n3. Empat unsur iklan: Headline, Body, Visual, CTA.\n4. Analisis iklan komersial vs layanan masyarakat.',
      'Tujuan Pembelajaran': '1. Peserta didik mampu mengidentifikasi pengertian dan fungsi sosial iklan.\n2. Peserta didik mampu menelaah 4 unsur pembangun iklan.',
      'Kegiatan / Latihan Penguat': 'Diskusi berpasangan membandingkan 2 contoh iklan cetak dan digital.',
      'Catatan Guru': 'Fokuskan pada contoh produk lokal dan etika periklanan.'
    },
    {
      'Nama Proyek': 'Perangkat Ajar Bahasa Indonesia Kelas VIII',
      'Tahun Ajaran': '2026/2027',
      'Semester': 'Ganjil',
      'Nama Guru': 'Pendidik STIVIA',
      'Nama Sekolah': 'SMP Bintang Bangsa',
      'Jenjang': 'SMP',
      'Kelas': 'Kelas VIII',
      'Mata Pelajaran': 'Bahasa Indonesia',
      'Bab / Teks': 'Bab 1: Menemukan Pola Pesan dalam Iklan',
      'Nomor Pertemuan': 'Pertemuan 2',
      'Judul Pertemuan': 'Struktur Teks Iklan dan Perancangan Slogan',
      'Tema Kegiatan': 'Struktur Pembentuk Iklan dan Kaidah Kebahasaan',
      'Materi yang Diajarkan': 'Struktur teks iklan dan teknik penulisan slogan persuasif',
      'Cakupan Materi': '1. Struktur teks iklan: Judul, Penjelasan, Nama Produk.\n2. Kaidah kebahasaan slogan: rima, padat, bertenaga.\n3. Praktik merancang draf naskah iklan persuasif.',
      'Tujuan Pembelajaran': '1. Peserta didik mampu merumuskan slogan iklan yang kreatif dan etis.',
      'Kegiatan / Latihan Penguat': 'Praktik berkelompok menyusun poster slogan kampanye kebersihan sekolah.',
      'Catatan Guru': 'Beri apresiasi pada keaslian ide slogan tiap kelompok.'
    },
    {
      'Nama Proyek': 'Perangkat Ajar IPA Kelas VIII',
      'Tahun Ajaran': '2026/2027',
      'Semester': 'Ganjil',
      'Nama Guru': 'Pendidik STIVIA',
      'Nama Sekolah': 'SMP Bintang Bangsa',
      'Jenjang': 'SMP',
      'Kelas': 'Kelas VIII',
      'Mata Pelajaran': 'IPA',
      'Bab / Teks': 'Bab 1: Pengenalan Sel dan Mikroskop',
      'Nomor Pertemuan': 'Pertemuan 1',
      'Judul Pertemuan': 'Struktur Sel Hewan dan Tumbuhan',
      'Tema Kegiatan': 'Pengamatan Mikroskopik Struktur Sel',
      'Materi yang Diajarkan': 'Organel sel, dinding sel, membran, dan fungsi sitoplasma',
      'Cakupan Materi': '1. Perbedaan mendasar sel tumbuhan dan sel hewan.\n2. Fungsi membran sel, nukleus, kloroplas, dan mitokondria.\n3. Cara kerja preparat basah di bawah mikroskop cahaya.',
      'Tujuan Pembelajaran': '1. Siswa mampu membedakan organel khas tumbuhan dan hewan secara tepat.',
      'Kegiatan / Latihan Penguat': 'Pengamatan preparat bawang merah di laboratorium sains.',
      'Catatan Guru': 'Pastikan protokol keselamatan kerja lab dipatuhi.'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleRows, { header: headers });

  // Lebar kolom rapi
  const colWidths = [
    { wch: 35 }, // Nama Proyek
    { wch: 14 }, // Tahun Ajaran
    { wch: 12 }, // Semester
    { wch: 22 }, // Guru
    { wch: 25 }, // Sekolah
    { wch: 10 }, // Jenjang
    { wch: 14 }, // Kelas
    { wch: 22 }, // Mapel
    { wch: 30 }, // Bab
    { wch: 18 }, // Pertemuan
    { wch: 35 }, // Judul
    { wch: 35 }, // Tema
    { wch: 35 }, // Materi
    { wch: 45 }, // Cakupan
    { wch: 45 }, // TP
    { wch: 35 }, // Penguat
    { wch: 30 }, // Catatan
  ];
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Proyek STIVIA');

  // Panduan Sheet
  const guideRows = [
    { 'Panduan Pengisian': '1. Kolom wajib: Nama Proyek, Jenjang (SD/SMP/SMA/SMK), Kelas, Mata Pelajaran, Bab/Teks, Nomor Pertemuan.' },
    { 'Panduan Pengisian': '2. Anda dapat mengisi beberapa pertemuan dalam satu bab dengan mengulang Nama Proyek, Kelas, Mapel, dan Bab yang sama.' },
    { 'Panduan Pengisian': '3. Anda dapat membuat banyak proyek sekaligus dalam file Excel yang sama.' },
    { 'Panduan Pengisian': '4. Kolom Cakupan Materi dan Tujuan Pembelajaran dapat berisi beberapa poin yang dipisahkan enter (baris baru).' },
    { 'Panduan Pengisian': '5. Kolom Catatan Guru dan Kegiatan Penguat bersifat opsional.' }
  ];
  const wsGuide = XLSX.utils.json_to_sheet(guideRows);
  wsGuide['!cols'] = [{ wch: 100 }];
  XLSX.utils.book_append_sheet(wb, wsGuide, 'Petunjuk Pengisian');

  XLSX.writeFile(wb, 'Template_Proyek_Kolektif_STIVIA.xlsx');
}

/**
 * Helper untuk membaca sel dengan fleksibilitas nama header
 */
function getCellFlexible(row: Record<string, any>, possibleKeys: string[]): string {
  for (const k of Object.keys(row)) {
    const norm = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const target of possibleKeys) {
      const targetNorm = target.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (norm === targetNorm) {
        return row[k] !== undefined && row[k] !== null ? String(row[k]).trim() : '';
      }
    }
  }
  return '';
}

/**
 * Parsing ArrayBuffer / File Excel menjadi baris terstruktur ExcelProjectRow
 */
export function parseExcelBufferToRows(data: ArrayBuffer): ExcelProjectRow[] {
  const wb = XLSX.read(data, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  if (!firstSheetName) return [];

  const ws = wb.Sheets[firstSheetName];
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

  return rawRows.map(row => {
    return {
      namaProyek: getCellFlexible(row, ['Nama Proyek', 'Proyek', 'Judul Proyek', 'Project Name']),
      tahunAjaran: getCellFlexible(row, ['Tahun Ajaran', 'Tahun', 'Academic Year']) || '2026/2027',
      semester: getCellFlexible(row, ['Semester', 'Sem']) || 'Ganjil',
      guru: getCellFlexible(row, ['Nama Guru', 'Guru', 'Pendidik', 'Teacher']),
      sekolah: getCellFlexible(row, ['Nama Sekolah', 'Sekolah', 'School']),
      jenjang: getCellFlexible(row, ['Jenjang', 'Tingkat', 'Level']) || 'SMP',
      kelas: getCellFlexible(row, ['Kelas', 'Grade', 'Tingkat Kelas']),
      mapel: getCellFlexible(row, ['Mata Pelajaran', 'Mapel', 'Subject']),
      bab: getCellFlexible(row, ['Bab / Teks', 'Bab', 'Teks', 'Chapter', 'Bab Teks']),
      pertemuan: getCellFlexible(row, ['Nomor Pertemuan', 'Pertemuan', 'Meeting', 'Sesi']),
      judulPertemuan: getCellFlexible(row, ['Judul Pertemuan', 'Judul Sesi', 'Title']),
      temaKegiatan: getCellFlexible(row, ['Tema Kegiatan', 'Tema', 'Theme']),
      materiDiajarkan: getCellFlexible(row, ['Materi yang Diajarkan', 'Materi', 'Materi Pokok', 'Topic']),
      cakupanMateri: getCellFlexible(row, ['Cakupan Materi', 'Cakupan', 'Submateri', 'Scope']),
      tujuanPembelajaran: getCellFlexible(row, ['Tujuan Pembelajaran', 'TP', 'Tujuan', 'Objectives']),
      kegiatanPenguat: getCellFlexible(row, ['Kegiatan / Latihan Penguat', 'Kegiatan Penguat', 'Latihan Penguat', 'Aktivitas']),
      catatanGuru: getCellFlexible(row, ['Catatan Guru', 'Catatan', 'Notes'])
    };
  });
}

/**
 * Validasi baris dan konversi ke model hierarki STIVIA LearningProject[]
 */
export function validateAndTransformExcelRows(
  rows: ExcelProjectRow[],
  defaultAuthor?: string,
  defaultSchool?: string
): CollectiveImportPreview {
  const rowResults: RowValidationResult[] = [];
  const validDataRows: { rowNumber: number; data: ExcelProjectRow }[] = [];

  let validCount = 0;
  let invalidCount = 0;
  let warningsCount = 0;

  rows.forEach((row, idx) => {
    const rowNum = idx + 2; // Baris 1 adalah header di Excel
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validasi field wajib
    if (!row.namaProyek?.trim()) {
      errors.push('Nama Proyek wajib diisi.');
    }
    if (!row.mapel?.trim()) {
      errors.push('Mata Pelajaran wajib diisi.');
    }
    if (!row.kelas?.trim()) {
      errors.push('Kelas wajib diisi.');
    }
    if (!row.bab?.trim()) {
      errors.push('Bab / Teks wajib diisi.');
    }
    if (!row.pertemuan?.trim()) {
      errors.push('Nomor Pertemuan wajib diisi (misal: "Pertemuan 1").');
    }

    // Peringatan pedagogis
    if (!row.materiDiajarkan?.trim() && !row.temaKegiatan?.trim()) {
      warnings.push('Materi yang Diajarkan atau Tema Kegiatan belum diisi.');
    }
    if (!row.cakupanMateri?.trim()) {
      warnings.push('Cakupan materi kosong; pertemuan akan menjadi draft awal.');
    }

    const isValid = errors.length === 0;
    if (isValid) {
      validCount++;
      validDataRows.push({ rowNumber: rowNum, data: row });
    } else {
      invalidCount++;
    }
    warningsCount += warnings.length;

    rowResults.push({
      rowNumber: rowNum,
      data: row,
      isValid,
      errors,
      warnings
    });
  });

  // Susun ke hierarki LearningProject
  const now = new Date().toISOString().split('T')[0];
  const projectMap = new Map<string, LearningProject>();

  validDataRows.forEach(({ rowNumber, data }) => {
    const projKey = data.namaProyek.trim().toLowerCase();
    let project = projectMap.get(projKey);

    if (!project) {
      const entropy = Math.random().toString(36).substring(2, 6);
      const projId = `lp-bulk-${Date.now()}-${entropy}`;
      project = {
        id: projId,
        name: data.namaProyek.trim(),
        academicYear: data.tahunAjaran?.trim() || '2026/2027',
        semester: (data.semester?.trim().toLowerCase().includes('genap') ? 'Genap' : 'Ganjil') as 'Ganjil' | 'Genap',
        teacherName: data.guru?.trim() || defaultAuthor || 'Pendidik STIVIA',
        schoolName: data.sekolah?.trim() || defaultSchool || 'Sekolah Penggerak STIVIA',
        classSubjects: [],
        createdAt: now,
        updatedAt: now
      };
      projectMap.set(projKey, project);
    }

    // ClassSubjectNode
    const level = normalizeEducationLevel(data.jenjang);
    const grade = data.kelas.trim();
    const subject = data.mapel.trim();
    const classKey = `${level}_${grade}_${subject}`.toLowerCase();

    let classSubject = project.classSubjects.find(
      cs => `${cs.educationLevel}_${cs.grade}_${cs.subject}`.toLowerCase() === classKey
    );

    if (!classSubject) {
      const entropy = Math.random().toString(36).substring(2, 6);
      classSubject = {
        id: `cs-bulk-${Date.now()}-${entropy}`,
        educationLevel: level,
        grade,
        subject,
        chapters: [],
        createdAt: now,
        updatedAt: now
      };
      project.classSubjects.push(classSubject);
    }

    // ChapterNode
    const rawBab = data.bab.trim();
    let chapterNum = 'Bab 1';
    let chapterTitle = rawBab;
    if (rawBab.toLowerCase().startsWith('bab') || rawBab.toLowerCase().startsWith('teks')) {
      const parts = rawBab.split(':');
      chapterNum = parts[0].trim();
      chapterTitle = parts.length > 1 ? parts.slice(1).join(':').trim() : rawBab;
    }

    const chapterKey = rawBab.toLowerCase();
    let chapter = classSubject.chapters.find(
      ch => ch.title.trim().toLowerCase() === chapterKey
    );

    if (!chapter) {
      const entropy = Math.random().toString(36).substring(2, 6);
      chapter = {
        id: `ch-bulk-${Date.now()}-${entropy}`,
        chapterNumber: chapterNum,
        title: rawBab,
        meetings: [],
        createdAt: now,
        updatedAt: now
      };
      classSubject.chapters.push(chapter);
    }

    // MeetingSession
    const rawMeetNum = data.pertemuan.trim();
    const meetingNumInt = parseIntegerNumber(rawMeetNum, chapter.meetings.length + 1);
    const meetingNumFormatted = rawMeetNum.toLowerCase().startsWith('pertemuan')
      ? rawMeetNum
      : `Pertemuan ${meetingNumInt}`;

    const tpList = (data.tujuanPembelajaran || '')
      .split('\n')
      .map(s => s.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);

    const hasContent = Boolean(data.materiDiajarkan?.trim() || data.temaKegiatan?.trim() || data.cakupanMateri?.trim());

    const masterLearningData: MasterLearningData = {
      temaKegiatan: data.temaKegiatan?.trim() || data.materiDiajarkan?.trim() || meetingNumFormatted,
      materiDiajarkan: data.materiDiajarkan?.trim() || data.temaKegiatan?.trim() || meetingNumFormatted,
      cakupanMateri: data.cakupanMateri?.trim() || '',
      learningObjectives: tpList,
      reinforcementActivities: data.kegiatanPenguat?.trim() || '',
      assessmentEnabled: false,
      userNotes: data.catatanGuru?.trim() || '',
      version: 1,
      updatedAt: now
    };

    const defaultProductStates: MeetingProductStates = {
      material: 'not_started',
      infographic: 'not_started',
      lkpd: 'not_started',
      presentation: 'not_started',
      assessment_harian: 'not_started',
      assessment_sumatif: 'not_started'
    };

    const entropy = Math.random().toString(36).substring(2, 6);
    const meeting: MeetingSession = {
      id: `meet-bulk-${Date.now()}-${entropy}-${rowNumber}`,
      meetingNumber: meetingNumFormatted,
      title: data.judulPertemuan?.trim() || masterLearningData.materiDiajarkan || meetingNumFormatted,
      status: hasContent ? 'ready' : 'draft',
      masterLearningData,
      productStates: defaultProductStates,
      createdAt: now,
      updatedAt: now
    };

    chapter.meetings.push(meeting);
  });

  const hierarchicalProjects = Array.from(projectMap.values());

  let totalClasses = 0;
  let totalChapters = 0;
  let totalMeetings = 0;
  hierarchicalProjects.forEach(p => {
    totalClasses += p.classSubjects.length;
    p.classSubjects.forEach(cs => {
      totalChapters += cs.chapters.length;
      cs.chapters.forEach(ch => {
        totalMeetings += ch.meetings.length;
      });
    });
  });

  return {
    totalRows: rows.length,
    validRows: validCount,
    invalidRows: invalidCount,
    warningsCount,
    rowResults,
    hierarchicalProjects,
    summary: {
      totalProjects: hierarchicalProjects.length,
      totalClasses,
      totalChapters,
      totalMeetings,
      projectNames: hierarchicalProjects.map(p => p.name)
    }
  };
}

/**
 * Mengekspor seluruh atau sebagian proyek tersimpan ke file Excel (.xlsx)
 */
export function exportProjectsToExcel(
  projects: LearningProject[],
  fileName = 'Data_Proyek_Pembelajaran_STIVIA.xlsx'
): void {
  const exportRows: Record<string, string>[] = [];

  projects.forEach(p => {
    p.classSubjects.forEach(cs => {
      cs.chapters.forEach(ch => {
        ch.meetings.forEach(m => {
          const mld = m.masterLearningData;
          const tpText = (mld.learningObjectives || []).map((tp, idx) => `${idx + 1}. ${tp}`).join('\n');

          exportRows.push({
            'Nama Proyek': p.name,
            'Tahun Ajaran': p.academicYear || '2026/2027',
            'Semester': p.semester || 'Ganjil',
            'Nama Guru': p.teacherName || '',
            'Nama Sekolah': p.schoolName || '',
            'Jenjang': cs.educationLevel,
            'Kelas': cs.grade,
            'Mata Pelajaran': cs.subject,
            'Bab / Teks': ch.title,
            'Nomor Pertemuan': m.meetingNumber,
            'Judul Pertemuan': m.title,
            'Tema Kegiatan': mld.temaKegiatan || '',
            'Materi yang Diajarkan': mld.materiDiajarkan || '',
            'Cakupan Materi': mld.cakupanMateri || '',
            'Tujuan Pembelajaran': tpText,
            'Kegiatan / Latihan Penguat': mld.reinforcementActivities || '',
            'Catatan Guru': mld.userNotes || ''
          });
        });
      });
    });
  });

  const ws = XLSX.utils.json_to_sheet(exportRows, { header: [...STIVIA_EXCEL_COLUMNS] });
  ws['!cols'] = [
    { wch: 35 },
    { wch: 14 },
    { wch: 12 },
    { wch: 22 },
    { wch: 25 },
    { wch: 10 },
    { wch: 14 },
    { wch: 22 },
    { wch: 30 },
    { wch: 18 },
    { wch: 35 },
    { wch: 35 },
    { wch: 35 },
    { wch: 45 },
    { wch: 45 },
    { wch: 35 },
    { wch: 30 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Daftar Proyek STIVIA');
  XLSX.writeFile(wb, fileName);
}

/**
 * Cadangan lengkap dalam format JSON terstruktur (Full Backup & Restore)
 */
export function exportProjectsToJSONBackup(projects: LearningProject[]): void {
  const backupData = {
    app: 'STIVIA',
    version: '3.5',
    exportedAt: new Date().toISOString(),
    totalProjects: projects.length,
    projects
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `STIVIA_Backup_Proyek_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Memulihkan proyek dari file backup JSON
 */
export function parseJSONBackupFile(jsonString: string): LearningProject[] {
  const parsed = JSON.parse(jsonString);
  if (Array.isArray(parsed)) {
    return parsed;
  }
  if (parsed && Array.isArray(parsed.projects)) {
    return parsed.projects;
  }
  throw new Error('Format file backup JSON tidak valid.');
}
