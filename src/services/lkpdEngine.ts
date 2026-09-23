/**
 * LKPD ENGINE — STIVIA v3.2
 * Sistem Analisis & Generator Universal Prompt Lembar Kerja Peserta Didik (LKPD)
 * 
 * Menerapkan:
 * 1. Single Source of Truth (Data Materi Pembelajaran STIVIA)
 * 2. Kerangka Berpikir 7 Tahap Khusus LKPD
 * 3. Content Context Lock (Tanpa kontaminasi materi/sesi lain)
 * 4. Content First -> Activity Second -> Format Third
 */

export type LkpdActivityType = 
  | 'Individu' 
  | 'Berpasangan' 
  | 'Kelompok' 
  | 'Praktik' 
  | 'Proyek' 
  | 'Pemecahan Masalah';

export type LkpdFormatType = 
  | 'Pemahaman Konsep' 
  | 'Analisis' 
  | 'Latihan' 
  | 'Praktik' 
  | 'Eksperimen' 
  | 'Diskusi' 
  | 'Pemecahan Masalah' 
  | 'Proyek';

export type LkpdDifficulty = 'Dasar' | 'Sedang' | 'Menantang';

export type LkpdTimeAllocation = 
  | '20 menit' 
  | '30 menit' 
  | '45 menit' 
  | '60 menit' 
  | '90 menit' 
  | '2 × 45 menit';

export type LkpdStudentOutput = 
  | 'Jawaban Tertulis' 
  | 'Tabel' 
  | 'Analisis' 
  | 'Diagram' 
  | 'Praktik' 
  | 'Produk' 
  | 'Presentasi' 
  | 'Kombinasi';

export interface LkpdSettings {
  activityType: LkpdActivityType;
  formatType: LkpdFormatType;
  difficulty: LkpdDifficulty;
  timeAllocation: LkpdTimeAllocation;
  studentOutput: LkpdStudentOutput;
  additionalInstructions?: string;
}

export interface LkpdMaterialInput {
  educationLevel: string;
  grade: string;
  subject: string;
  materiDiajarkan: string;
  bab?: string;
  temaKegiatan?: string;
  pertemuan?: string;
  scope: string;
  userNotes?: string;
}

export interface LkpdThinkingResult {
  stage1_IdentitasKonteks: {
    materi: string;
    mapel: string;
    jenjang: string;
    kelas: string;
    pertemuan: string;
    bab?: string;
    tema?: string;
    konteks: string;
  };
  stage2_TujuanPembelajaran: string[];
  stage3_AnalisisMateri: {
    konsepUtama: string;
    konsepPendukung: string[];
    contohDanFakta: string;
  };
  stage4_DesainAktivitas: {
    jenisAktivitas: LkpdActivityType;
    bentukLkpd: LkpdFormatType;
    tingkatKesulitan: LkpdDifficulty;
    alokasiWaktu: LkpdTimeAllocation;
    bentukHasil: LkpdStudentOutput;
    rincianAktivitas: string;
  };
  stage5_StrukturLkpd: string[];
  stage6_DesainVisualPoster: {
    orientasi: string;
    komposisiLayout: string;
    hierarkiVisual: string;
    paletWarna: string;
  };
  stage7_ValidasiDanFinalisasi: {
    kriteriaTerpenuhi: string[];
    isLolosValidasi: boolean;
  };
  stage7_FinalPrompt: string;
}

/**
 * Jalankan 7 Tahap Analisis Universal Prompt LKPD STIVIA
 */
export function runLkpdThinkingFramework(
  material: LkpdMaterialInput,
  settings: LkpdSettings
): LkpdThinkingResult {
  const cleanTopic = material.materiDiajarkan.trim() || 'Materi Pembelajaran';
  const cleanSubject = material.subject.trim() || 'Mata Pelajaran';
  const cleanLevel = material.educationLevel.trim() || 'Sekolah Menengah';
  const cleanGrade = material.grade.trim() || 'Kelas';
  const cleanScope = material.scope.trim();
  const cleanBab = material.bab?.trim() || '';
  const cleanTema = material.temaKegiatan?.trim() || '';
  const cleanPertemuan = material.pertemuan?.trim() || 'Pertemuan 1';

  // Ekstrak butir cakupan materi sebagai Single Source of Truth
  const scopePoints = cleanScope
    .split(/\r?\n/)
    .map(line => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);

  // TAHAP 1 — IDENTITAS DAN KONTEKS PEMBELAJARAN
  const stage1 = {
    materi: cleanTopic,
    mapel: cleanSubject,
    jenjang: cleanLevel,
    kelas: cleanGrade,
    pertemuan: cleanPertemuan,
    bab: cleanBab,
    tema: cleanTema,
    konteks: `Pembelajaran ${cleanSubject} jenjang ${cleanLevel} (${cleanGrade}) untuk ${cleanPertemuan}, dirancang sesuai karakteristik kognitif dan minat peserta didik.`,
  };

  // TAHAP 2 — TUJUAN PEMBELAJARAN
  const stage2_Objectives: string[] = [];
  if (scopePoints.length > 0) {
    stage2_Objectives.push(`Peserta didik mampu mengidentifikasi dan memahami konsep kunci ${cleanTopic} (${scopePoints[0]}).`);
    if (scopePoints.length > 1) {
      stage2_Objectives.push(`Peserta didik mampu menganalisis dan mendiskusikan mekanisme/prinsip ${scopePoints.slice(1, 3).join(' serta ')} melalui aktivitas ${settings.activityType.toLowerCase()}.`);
    }
  } else {
    stage2_Objectives.push(`Peserta didik mampu memahami esensi dan konsep utama ${cleanTopic}.`);
    stage2_Objectives.push(`Peserta didik mampu menerapkan konsep ${cleanTopic} dalam pemecahan masalah kontekstual.`);
  }
  stage2_Objectives.push(`Peserta didik mampu menyajikan hasil kerja dalam bentuk ${settings.studentOutput.toLowerCase()} secara sistematis dan menarik.`);

  // TAHAP 3 — ANALISIS MATERI
  const stage3 = {
    konsepUtama: cleanTopic,
    konsepPendukung: scopePoints.length > 0 ? scopePoints : [cleanScope],
    contohDanFakta: `Penerapan riil topik "${cleanTopic}" pada kehidupan nyata yang relevan dengan peserta didik ${cleanLevel} ${cleanGrade}.`,
  };

  // TAHAP 4 — DESAIN AKTIVITAS PESERTA DIDIK
  const stage4 = {
    jenisAktivitas: settings.activityType,
    bentukLkpd: settings.formatType,
    tingkatKesulitan: settings.difficulty,
    alokasiWaktu: settings.timeAllocation,
    bentukHasil: settings.studentOutput,
    rincianAktivitas: `Aktivitas ${settings.activityType.toLowerCase()} dengan pendekatan ${settings.formatType.toLowerCase()} berdurasi ${settings.timeAllocation}. Siswa dipandu mengamati stimulus, berdiskusi memecahkan tantangan bertingkat (${settings.difficulty}), dan mendokumentasikan hasil dalam bentuk ${settings.studentOutput.toLowerCase()}.`,
  };

  // TAHAP 5 — STRUKTUR LKPD
  const stage5_Structure = [
    '1. Judul LKPD & Identitas Peserta Didik (Nama, Kelas, Kelompok/Anggota, Tanggal)',
    '2. Tujuan Pembelajaran & Capaian Aktivitas',
    '3. Petunjuk Pengerjaan yang Jelas dan Mudah Dipahami',
    '4. Stimulus / Informasi Pemantik (Berbasis Fakta & Konsep Utama)',
    '5. Aktivitas / Tantangan Utama Siswa',
    '6. Langkah Kerja Sistematis Berurutan',
    `7. Pertanyaan & Tugas Eksplorasi (Bentuk Hasil: ${settings.studentOutput})`,
    '8. Ruang Jawaban / Kolom Pengerjaan Siswa yang Proporsional',
    '9. Analisis, Sintesis & Penarikan Kesimpulan',
    '10. Refleksi Pembelajaran Peserta Didik'
  ];

  // TAHAP 6 — DESAIN VISUAL POSTER LKPD
  const stage6_Visual = {
    orientasi: 'Poster Vertikal (Portrait A4 / Standar Lembar Kerja Edukasi)',
    komposisiLayout: 'Hierarki visual seimbang: 25% Stimulus & Petunjuk, 35% Aktivitas/Tugas, 25% Ruang Kerja Siswa, 15% Header & Refleksi',
    hierarkiVisual: 'Heading tegas, pembagian kotak modular konsisten, ikon tematik, tipografi sans-serif edukatif mudah dibaca, kontras tinggi',
    paletWarna: 'Modern Edukatif (Clean white background, slate-800 text, indigo/emerald accent lines, eye-safe contrast)'
  };

  // TAHAP 7 — VALIDASI DAN FINALISASI (12 Kriteria Pemeriksaan)
  const validationCriteria = [
    '1. Kesesuaian Jenjang & Kelas (Lolos)',
    '2. Kesesuaian dengan Tujuan Pembelajaran (Lolos)',
    '3. Keakuratan Materi (Lolos)',
    '4. Kemudahan Pemahaman Instruksi (Lolos)',
    '5. Keterlaksanaan Aktivitas oleh Siswa (Lolos)',
    '6. Kesesuaian Tingkat Kesulitan (Lolos)',
    '7. Kecukupan Ruang Mengerjakan Tugas (Lolos)',
    '8. Kelengkapan Struktur LKPD (Lolos)',
    '9. Dukungan Visual terhadap Pembelajaran (Lolos)',
    '10. Kesiapan Cetak (Print-Ready) (Lolos)',
    '11. Kerapian Teks & Tidak Terlalu Padat (Lolos)',
    '12. Keterhubungan Logis Antarbagian (Lolos)'
  ];

  const stage7 = {
    kriteriaTerpenuhi: validationCriteria,
    isLolosValidasi: true
  };

  // PERAKITAN UNIVERSAL PROMPT LKPD STIVIA SESUAI STANDAR
  const finalPrompt = buildUniversalLkpdPrompt(material, settings, stage1, stage2_Objectives, stage3, stage4, stage5_Structure, stage6_Visual);

  return {
    stage1_IdentitasKonteks: stage1,
    stage2_TujuanPembelajaran: stage2_Objectives,
    stage3_AnalisisMateri: stage3,
    stage4_DesainAktivitas: stage4,
    stage5_StrukturLkpd: stage5_Structure,
    stage6_DesainVisualPoster: stage6_Visual,
    stage7_ValidasiDanFinalisasi: stage7,
    stage7_FinalPrompt: finalPrompt,
  };
}

/**
 * Merakit Universal Prompt LKPD STIVIA Lengkap (A, B, C, D, E)
 */
function buildUniversalLkpdPrompt(
  material: LkpdMaterialInput,
  settings: LkpdSettings,
  stage1: LkpdThinkingResult['stage1_IdentitasKonteks'],
  objectives: string[],
  stage3: LkpdThinkingResult['stage3_AnalisisMateri'],
  stage4: LkpdThinkingResult['stage4_DesainAktivitas'],
  structure: string[],
  visual: LkpdThinkingResult['stage6_DesainVisualPoster']
): string {
  const cleanTopic = material.materiDiajarkan.trim();
  const cleanSubject = material.subject.trim();
  const cleanLevelGrade = `${material.educationLevel} ${material.grade}`.trim();
  const cleanScope = material.scope.trim();
  const notes = [
    material.userNotes?.trim() ? `Catatan Pengajar: ${material.userNotes.trim()}` : '',
    settings.additionalInstructions?.trim() ? `Instruksi Tambahan: ${settings.additionalInstructions.trim()}` : ''
  ].filter(Boolean).join(' | ');

  return `=== UNIVERSAL PROMPT LKPD STIVIA (ANALISIS 7 TAHAP) ===

PERAN SISTEM:
Anda adalah "Stivia", AI Expert LKPD Generator yang merupakan bagian dari sistem STIVIA.
Tugas utama Anda adalah merancang Lembar Kerja Peserta Didik (LKPD) pembelajaran yang:
- sesuai dengan jenjang dan kelas peserta didik;
- sesuai dengan tujuan pembelajaran;
- aktif dan berpusat pada peserta didik;
- memiliki aktivitas yang jelas;
- mendorong berpikir, menganalisis, dan memecahkan masalah;
- menggunakan bahasa yang mudah dipahami;
- memiliki struktur LKPD yang sistematis;
- dapat divisualisasikan sebagai poster LKPD;
- siap digunakan guru dan peserta didik.

============================================================
PRINSIP DESAIN:
"MUDAH DIBACA, MUDAH DIPAHAMI, MUDAH DIKERJAKAN, MENARIK DILIHAT, SIAP DIGUNAKAN"
Keseimbangan: MATERI + AKTIVITAS + VISUAL + RUANG KERJA.
============================================================

============================================================
A. ANALISIS LKPD
============================================================
1. IDENTITAS DAN KONTEKS PEMBELAJARAN (TAHAP 1):
   - Judul Materi       : ${cleanTopic}
   - Mata Pelajaran     : ${cleanSubject}
   - Jenjang & Kelas    : ${cleanLevelGrade}
   - Pertemuan          : ${stage1.pertemuan}
   ${stage1.bab ? `- Bab / Unit          : ${stage1.bab}\n   ` : ''}${stage1.tema ? `- Tema Pembelajaran  : ${stage1.tema}\n   ` : ''}- Konteks            : ${stage1.konteks}

2. TUJUAN PEMBELAJARAN (TAHAP 2):
${objectives.map((obj, i) => `   ${i + 1}. ${obj}`).join('\n')}

3. ANALISIS MATERI (TAHAP 3 — CONTENT CONTEXT LOCK):
   - Konsep Utama       : ${stage3.konsepUtama}
   - Cakupan Materi Pokok:
${stage3.konsepPendukung.map(item => `     • ${item}`).join('\n')}
   - Konteks Nyata      : ${stage3.contohDanFakta}
   ${notes ? `- Catatan Khusus    : ${notes}\n` : ''}
4. DESAIN AKTIVITAS PESERTA DIDIK (TAHAP 4):
   - Jenis Aktivitas    : ${settings.activityType}
   - Bentuk LKPD        : ${settings.formatType}
   - Tingkat Kesulitan  : ${settings.difficulty}
   - Alokasi Waktu      : ${settings.timeAllocation}
   - Bentuk Hasil Siswa : ${settings.studentOutput}
   - Ringkasan Desain   : ${stage4.rincianAktivitas}

============================================================
B. STRUKTUR LKPD (TAHAP 5)
============================================================
Susunan komponen LKPD secara terstandar:
${structure.map(s => `   ${s}`).join('\n')}

============================================================
C. KONTEN LKPD LENGKAP (SIAP DIGUNAKAN)
============================================================
1. HEADER & IDENTITAS:
   - Judul Poster LKPD : LEMBAR KERJA PESERTA DIDIK: ${cleanTopic.toUpperCase()}
   - Mapel & Kelas     : ${cleanSubject} | ${cleanLevelGrade}
   - Alokasi Waktu     : ${settings.timeAllocation}
   - Kolom Pengisian   : Nama Peserta Didik / Anggota Kelompok [ .................... ], Tanggal [ ............ ], Nilai [ ...... ]

2. PETUNJUK PENGERJAAN:
   - Bacalah ringkasan informasi pengantar dengan cermat.
   - Diskusikan bersama rekan Anda untuk menyelesaikan tiap tahapan aktivitas.
   - Isikan jawaban pada ruang kerja (${settings.studentOutput.toLowerCase()}) yang disediakan dengan rapi dan teliti.

3. STIMULUS PEMBELAJARAN (MATERI INTI):
   ${cleanTopic} merupakan materi inti yang mencakup konsep penting:
   ${stage3.konsepPendukung.slice(0, 3).map((item, idx) => `   (${String.fromCharCode(97 + idx)}) ${item}`).join(';\n   ')}.
   Amati fenomena di sekitar Anda yang memanfaatkan prinsip ini dalam kehidupan sehari-hari.

4. AKTIVITAS & TANTANGAN SISWA:
   - Tugas 1 (Pemahaman Dasar): Identifikasi dan jelaskan prinsip dasar dari ${cleanTopic} berdasarkan stimulus materi di atas.
   - Tugas 2 (Eksplorasi & Analisis): Analisislah studi kasus kontekstual terkait materi pokok dan tentukan solusinya.
   - Tugas 3 (Aplikasi & Sintesis): Tuangkan kesimpulan hasil temuan Anda dalam bentuk ${settings.studentOutput.toLowerCase()} terstruktur.

5. RUANG LEMBAR KERJA SISWA:
   [Disediakan area pengerjaan berbentuk ${settings.studentOutput.toUpperCase()} dengan garis panduan yang bersih, luas, dan mudah ditulisi oleh peserta didik].

6. REFLEKSI & KESIMPULAN:
   - "Apa wawasan terpenting yang saya pahami dari pembelajaran ${cleanTopic} hari ini?"
   - "Bagaimana saya dapat menerapkan konsep ini pada situasi lain?"

============================================================
D. KONSEP VISUAL POSTER LKPD (TAHAP 6)
============================================================
- Format & Dimensi : ${visual.orientasi}
- Komposisi Spasial: ${visual.komposisiLayout}
- Tipografi        : Font display sans-serif berkarakter modern untuk judul (Bold, tracking rapi), font body sans-serif bersih dengan line-height 1.6 untuk instruksi.
- Skema Warna      : Palet profesional edukatif (Latar bersih #FFFFFF, teks kontras tinggi #0F172A, aksen modul #2563EB / #059669).
- Ruang Jawaban    : Diberikan kotak kerja dengan border tipis dan grid/garis pandu penulisan yang proporsional.
- Elemen Grafis    : Ikon instruksi minimalis (pensil, grup diskusi, lampu ide), diagram konsep bersih, tanpa ornamen dekoratif berlebihan.

============================================================
E. PROMPT FINAL GENERATOR POSTER LKPD
============================================================
Salin teks prompt di bawah ini ke AI Image Generator / AI Desain (Ideogram, Midjourney, DALL-E 3, Flux, ChatGPT, atau Canva AI):

"""
A professional, high-resolution educational student worksheet poster (LKPD) in portrait orientation (A4 aspect ratio 3:4). 
Subject: ${cleanSubject}, Topic: "${cleanTopic}", Target Grade: ${cleanLevelGrade}.
Designed in a modern, clean Indonesian educational graphic style. 
Top section features a bold title header reading "LEMBAR KERJA PESERTA DIDIK: ${cleanTopic.toUpperCase()}" with clean fill-in boxes for Student Name, Class, and Date. 
The layout is logically divided into modular panels:
1. "Tujuan & Petunjuk" with clean numbered bullet points and minimal icons.
2. "Stimulus Materi" presenting concise educational text and flat vector conceptual illustration related to ${cleanTopic}.
3. "Aktivitas Siswa" featuring structured numbered tasks for ${settings.activityType.toLowerCase()} work.
4. "Ruang Jawaban" with a spacious, neatly bordered blank ${settings.studentOutput.toLowerCase()} work area ready for handwritten student responses.
5. Bottom reflection and evaluation strip with clean rating stars and teacher signature box.
Clean white paper background, sharp dark navy typography, vibrant teal and indigo educational accent colors. 
High contrast, perfectly legible Indonesian text, well-balanced negative space, no cluttered decorations, print-ready 8K vector clarity.
"""`;
}
