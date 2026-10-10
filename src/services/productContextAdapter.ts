import {
  MeetingSession,
  ChapterNode,
  ClassSubjectNode,
  LearningProject,
  MateriProductContext,
  InfographicProductContext,
  LKPDProductContext,
  PresentationProductContext,
  AssessmentProductContext
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
    reinforcementActivities: mld.reinforcementActivities || '',
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


import { 
  generateDeepAcademicMaterial, 
  MateriDocument 
} from './materiDocumentEngine';

/**
 * Menghasilkan struktur bagian-bagian materi (MateriSection[]) yang mendalam, terurai,
 * dan terstruktur secara akademis dari teks Cakupan Materi Master Learning Data.
 */
export function generateSectionsFromCakupan(
  cakupanMateri: string,
  materiDiajarkan: string,
  subject: string = 'Bahasa Indonesia'
): MateriSection[] {
  const normSubj = (subject || '').toLowerCase();
  const isBahasa = normSubj.includes('bahasa') || normSubj.includes('indonesia');

  if (!cakupanMateri || !cakupanMateri.trim()) {
    return [
      {
        id: `sec-${Date.now()}-1`,
        title: `A. Hakikat dan Konsep Dasar ${materiDiajarkan}`,
        content: `${materiDiajarkan} merupakan konsep fundamental dalam ranah pembelajaran ini. Secara hakiki, pemahaman atas materi ini membekali peserta didik dengan kerangka berpikir terstruktur, kemampuan mengenali pola, serta keterampilan mengurai gagasan secara logis dan analitis.\n\nPembahasan ini menjadi batu pijakan sebelum melangkah pada penerapan teknis lebih lanjut. Melalui pemahaman yang mendalam, peserta didik diajak tidak hanya menghafal fakta, melainkan memaknai fungsi sosial dan nilai terapan konsep dalam kehidupan sehari-hari.`
      },
      {
        id: `sec-${Date.now()}-2`,
        title: `B. Karakteristik, Dimensi, dan Parameter Utama`,
        content: `Untuk membedakan ${materiDiajarkan} dari konsep lainnya, perhatikan ciri-ciri esensial berikut:\n• Keteraturan Logis: Disusun berdasarkan kaidah keilmuan yang baku dan teruji.\n• Keberfungsian Kontekstual: Relevan dalam menjawab persoalan komunikasi, sains, atau penalaran praktis peserta didik.\n• Keterukuran Hasil: Capaian penguasaan materi dapat diamati melalui karya tulis, analisis teks, atau pemecahan masalah objektif.`
      },
      {
        id: `sec-${Date.now()}-3`,
        title: `C. Unsur-Unsur Pembentuk dan Analisis Struktur`,
        content: `Secara anatomi, ${materiDiajarkan} dibangun oleh komponen-komponen yang saling melengkapi:\n1. Bagian Orientasi: Menetapkan fokus awal dan batas ruang lingkup gagasan.\n2. Bagian Substansi: Rangkaian penjelasan inti, data pendukung, atau argumen penjelas.\n3. Bagian Keterhubungan: Tali pengait logis yang menjamin kohesi antargagasan.\n4. Bagian Penutup / Aksi: Arahan konklusif atau respons nyata yang diharapkan dari pembaca/peserta didik.`
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
    const lowerTitle = cleanTitle.toLowerCase();

    let content = '';
    let isTable = false;
    let tableData: { headers: string[]; rows: string[][] } | undefined = undefined;

    if (lowerTitle.includes('pengertian') || lowerTitle.includes('definisi') || lowerTitle.includes('hakikat') || lowerTitle.includes('konsep')) {
      content = `Dalam menelaah "${cleanTitle}", peserta didik dipandu memahami definisi pokok secara etimologis dan operasional. ${cleanTitle} menjadi pilar utama yang menopang pemahaman menyeluruh terhadap topik ${materiDiajarkan}.\n\nPembahasan ini tidak sekadar menyajikan batasan teoretis, melainkan menguraikan latar belakang konseptual mengapa prinsip ini esensial dikuasai, bagaimana perkembangannya, dan bagaimana prinsip ini diterapkan secara konsisten dalam literatur ilmiah maupun komunikasi praktis.`;
    } else if (lowerTitle.includes('ciri') || lowerTitle.includes('karakteristik') || lowerTitle.includes('sifat')) {
      content = `Karakteristik utama dari "${cleanTitle}" tercermin dalam sejumlah parameter berikut yang memudahkan peserta didik melakukan identifikasi secara presisi:\n• Ciri Pembeda Utama: Memiliki identitas khas yang tidak dijumpai pada bentuk konsep lainnya.\n• Keterpaduan Fungsi: Setiap ciri bekerja secara sinergis untuk mencapai tujuan komunikasi atau fungsi analitis yang diharapkan.\n• Konsistensi Penerapan: Ciri-ciri ini dapat diidentifikasi secara berulang pada berbagai contoh kasus otentik di lapangan.`;
    } else if (lowerTitle.includes('unsur') || lowerTitle.includes('komponen') || lowerTitle.includes('struktur') || lowerTitle.includes('bagian')) {
      content = `Struktur pembentuk "${cleanTitle}" tersusun atas rangkaian komponen yang terintegrasi secara runtut:\n1. Komponen Fondasi (Pendasaran): Pengantar konteks dan penetapan arah pembahasan.\n2. Komponen Penjelas (Uraian Rinci): Bukti pendukung, rincian fakta, atau elaborasi gagasan pokok.\n3. Komponen Pengait (Sintesis): Hubungan sebab-akibat atau kaidah yang menyatukan komponen menjadi satu kesatuan bermakna.\n4. Komponen Penegasan: Kesimpulan atau arahan tindak lanjut yang dapat diuji ketepatannya.`;
    } else if (lowerTitle.includes('kaidah') || lowerTitle.includes('kebahasaan') || lowerTitle.includes('aturan') || lowerTitle.includes('formula') || lowerTitle.includes('rumus')) {
      if (isBahasa) {
        content = `Aspek kaidah kebahasaan dalam "${cleanTitle}" menuntut kecermatan penggunaan diksi dan tata kalimat:\n• Diksi Persuasif & Lugas: Pemilihan kata yang padat makna, komunikatif, dan langsung menyentuh pemahaman pembaca.\n• Kalimat Efektif & Berpadu: Penyusunan kalimat yang mematuhi subjek-predikat yang jelas serta hubungan konjungsi yang logis.\n• Kepatuhan Ejaan Baku: Mengikuti pedoman tata bahasa dan tanda baca resmi untuk menghindari ambiguitas penafsiran.`;
      } else {
        content = `Tata aturan ilmiah dan kaidah formal pada "${cleanTitle}" menjadi jaminan validitas analisis:\n• Ketertiban Notasi: Penggunaan simbol atau terminologi baku yang diakui secara akademis.\n• Alur Inferensi Logis: Setiap kesimpulan diturunkan dari premis-premis awal yang telah terbukti kebenarannya.\n• Konsistensi Satuan & Variabel: Pengukuran dan pemodelan dilakukan tanpa kontradiksi perhitungan.`;
      }
    } else if (lowerTitle.includes('tabel') || lowerTitle.includes('perbandingan') || lowerTitle.includes('komparasi') || lowerTitle.includes('jenis') || lowerTitle.includes('klasifikasi')) {
      isTable = true;
      content = `Tabel analisis komparatif berikut menyajikan perincian perbedaan dan karakteristik pada aspek "${cleanTitle}":`;
      tableData = {
        headers: ['Aspek Telaah', 'Kategori A (Bentuk Primer)', 'Kategori B (Bentuk Sekunder / Alternatif)'],
        rows: [
          ['Fokus Utama', `Penerapan langsung konsep ${cleanTitle} pada situasi standar.`, 'Variasi pengembangan untuk situasi khusus atau kontekstual.'],
          ['Karakteristik Khas', 'Mengutamakan kejelasan, keteraturan struktur, dan kemudahan identifikasi.', 'Mengedepankan fleksibilitas, adaptasi konteks, dan sentuhan kreatif.'],
          ['Peran Pembelajar', 'Menganalisis pola dan membuktikan kesesuaian kaidah.', 'Mengevaluasi efektivitas dan memilih opsi solusi terbaik.'],
          ['Contoh Konkret', 'Penerapan pada lingkungan kelas dan modul ajar terstruktur.', 'Penerapan pada studi kasus nyata di masyarakat luas.']
        ]
      };
    } else if (lowerTitle.includes('langkah') || lowerTitle.includes('prosedur') || lowerTitle.includes('tahap') || lowerTitle.includes('cara')) {
      content = `Prosedur penerapan sistematis untuk "${cleanTitle}" dijabarkan melalui tahapan metodis berikut:\n1. Tahap Perencanaan & Orientasi: Pahami tujuan, kumpulkan data awal, dan tetapkan kriteria keberhasilan.\n2. Tahap Analisis & Dekonstruksi: Uraikan persoalan menjadi unit-unit lebih kecil sesuai komponen yang telah dipelajari.\n3. Tahap Formulasi & Eksekusi: Terapkan kaidah keilmuan atau tuliskan wacana dengan memperhatikan keterpaduan antarbagian.\n4. Tahap Evaluasi & Penyuntingan: Periksa kembali keakuratan isi, keterbacaan bahasa, serta keselarasan dengan tujuan pembelajaran.`;
    } else {
      content = `Pembahasan mengenai "${cleanTitle}" memperdalam pemahaman menyeluruh peserta didik terhadap keterkaitan konsep dalam tema ${materiDiajarkan}.\n\nPada bagian ini, peserta didik diajak menelaah bagaimana prinsip ini beroperasi, mengenali contoh kasus nyata di lapangan, serta mengidentifikasi faktor-faktor yang menentukan keberhasilan penerapannya dalam kehidupan sehari-hari secara kritis dan bertanggung jawab.`;
    }

    sections.push({
      id: `sec-${Date.now()}-${idx + 1}`,
      title: `${letter}. ${cleanTitle}`,
      content,
      isTable,
      tableData
    });
  });

  return sections;
}

/**
 * Menyusun MateriDocument lengkap (Turnkey Academic Document) secara instan dari MateriProductContext.
 */
export function synthesizeDeepMateriDocumentFromContext(
  context: MateriProductContext
): MateriDocument {
  return generateDeepAcademicMaterial({
    subject: context.subject,
    topic: context.materiDiajarkan,
    educationLevel: context.educationLevel,
    grade: context.grade,
    bab: context.bab,
    pertemuan: context.pertemuan,
    cakupanMateri: context.cakupanMateri,
    learningObjectives: context.learningObjectives,
    userNotes: context.userNotes,
    schoolName: context.schoolName,
    teacherName: context.teacherName,
    sourceMeetingId: context.sourceMeetingId,
    sourceMasterVersion: context.sourceMasterVersion
  });
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
    reinforcementActivities: mld.reinforcementActivities || '',
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
    reinforcementActivities: mld.reinforcementActivities || '',
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

/**
 * Membangun AssessmentProductContext dari MeetingSession aktif secara deterministik.
 * Mengalirkan Master Learning Data ke Menu Asesmen (Harian & Sumatif) secara kondisional.
 */
export function buildAssessmentProductContext(
  meeting: MeetingSession,
  chapter?: ChapterNode,
  classSubject?: ClassSubjectNode,
  project?: LearningProject
): AssessmentProductContext {
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
    reinforcementActivities: mld.reinforcementActivities || '',
    userNotes: mld.userNotes || '',

    // Konfigurasi Asesmen Kondisional (Default: false jika belum diatur)
    assessmentEnabled: Boolean(mld.assessmentEnabled),
    assessmentType: mld.assessmentType || 'Formatif',
    assessmentForms: mld.assessmentForms && mld.assessmentForms.length > 0
      ? mld.assessmentForms
      : ['Pilihan Ganda', 'Uraian'],
    assessmentNotes: mld.assessmentNotes || '',

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
 * Memeriksa apakah asesmen yang sedang dibuka menggunakan versi Master Learning Data yang sudah usang.
 */
export function isAssessmentContextOutdated(
  assessmentMasterVersion?: number,
  activeMasterVersion?: number
): boolean {
  if (assessmentMasterVersion === undefined || activeMasterVersion === undefined) return false;
  return assessmentMasterVersion < activeMasterVersion;
}
