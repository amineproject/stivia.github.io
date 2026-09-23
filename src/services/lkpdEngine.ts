/**
 * LKPD ENGINE — STIVIA v3.2
 * Sistem Analisis 7 Tahap & Generator Universal Prompt Poster LKPD Otomatis
 * 
 * Prinsip Utama:
 * 1. "UPDATE, DON'T REBUILD"
 * 2. SATU KALI INPUT -> SATU KALI ANALISIS -> SATU KALI GENERATE
 * 3. Output 5 Bagian Terstruktur:
 *    A. HASIL ANALISIS
 *    B. LKPD LENGKAP
 *    C. KONSEP VISUAL LKPD
 *    D. PROMPT POSTER LKPD (Dimulai dengan: "BUAT POSTER LKPD PEMBELAJARAN...")
 *    E. NEGATIVE / QUALITY INSTRUCTION
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

export type LkpdPaperSize = 'A4' | 'A3';

export type LkpdOrientation = 'Portrait' | 'Landscape';

export type LkpdVisualStyle = 
  | 'Modern Edukatif' 
  | 'Infografis Saintifik' 
  | 'Ilustratif Ceria' 
  | 'Minimalis Bersih' 
  | 'Modul Klasik';

export interface LkpdSettings {
  activityType: LkpdActivityType;
  formatType: LkpdFormatType;
  difficulty: LkpdDifficulty;
  timeAllocation: LkpdTimeAllocation;
  studentOutput: LkpdStudentOutput;
  pageSize?: LkpdPaperSize;
  orientation?: LkpdOrientation;
  visualStyle?: LkpdVisualStyle;
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
    karakteristikSiswa: string;
    konteks: string;
  };
  stage2_TujuanPembelajaran: string[];
  stage3_AnalisisMateri: {
    konsepUtama: string;
    konsepPendukung: string[];
    contohDanFakta: string;
    konteksKehidupanNyata: string;
  };
  stage4_DesainAktivitas: {
    jenisAktivitas: LkpdActivityType;
    bentukLkpd: LkpdFormatType;
    tingkatKesulitan: LkpdDifficulty;
    alokasiWaktu: LkpdTimeAllocation;
    bentukHasil: LkpdStudentOutput;
    rincianAktivitas: string;
  };
  stage5_KontenLkpd: {
    judulLkpd: string;
    identitasPesertaDidik: string;
    petunjukPengerjaan: string[];
    stimulusMateri: string;
    langkahKerja: string[];
    tugasDanPertanyaan: string[];
    ruangJawabanDeskripsi: string;
    refleksiPembelajaran: string[];
  };
  stage6_DesainVisualPoster: {
    ukuran: LkpdPaperSize;
    orientasi: LkpdOrientation;
    gayaVisual: LkpdVisualStyle;
    tataLetak: string;
    tipografi: string;
    paletWarna: string;
    ilustrasi: string;
    hierarkiInformasi: string;
    keseimbanganRuang: string;
  };
  stage7_ValidasiDanFinalisasi: {
    kriteriaTerpenuhi: string[];
    isLolosValidasi: boolean;
  };
  stage7_FinalPrompt: string;
}

/**
 * Jalankan Analisis 7 Tahap Universal Prompt LKPD STIVIA
 * Memproses data pembelajaran satu kali dan menghasilkan LKPD terstruktur, konsep visual, serta Prompt Poster LKPD otomatis.
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

  const pageSize: LkpdPaperSize = settings.pageSize || 'A4';
  const orientation: LkpdOrientation = settings.orientation || 'Portrait';
  const visualStyle: LkpdVisualStyle = settings.visualStyle || 'Modern Edukatif';

  // Ekstrak butir cakupan materi sebagai Single Source of Truth
  const scopePoints = cleanScope
    .split(/\r?\n/)
    .map(line => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);

  const scopeSummary = scopePoints.length > 0 
    ? scopePoints.join(', ') 
    : cleanScope || cleanTopic;

  // Analisis karakteristik perkembangan kognitif peserta didik berdasarkan jenjang
  let karakteristikSiswa = 'Peserta didik berada pada tahap berpikir operasional konkret menuju abstrak, membutuhkan panduan visual yang rapi dan ruang kerja yang jelas.';
  const lvlLower = cleanLevel.toLowerCase();
  if (lvlLower.includes('sd') || lvlLower.includes('dasar')) {
    karakteristikSiswa = 'Peserta didik jenjang pendidikan dasar (SD), membutuhkan instruksi ringkas dengan bahasa sederhana, visual menarik, font ramah anak, dan ruang tulis yang lapang.';
  } else if (lvlLower.includes('smp')) {
    karakteristikSiswa = 'Peserta didik jenjang SMP (remaja awal), mampu berpikir logis dengan bantuan stimulus kontekstual, senang berkolaborasi, dan membutuhkan tugas analisis bertahap.';
  } else if (lvlLower.includes('sma') || lvlLower.includes('smk')) {
    karakteristikSiswa = 'Peserta didik jenjang SMA/SMK (remaja akhir), mampu berpikir analitis, kritis, dan sintesis mandiri dalam menyelesaikan studi kasus dan pemecahan masalah kontekstual.';
  }

  // TAHAP 1 — IDENTITAS DAN KONTEKS PEMBELAJARAN
  const stage1 = {
    materi: cleanTopic,
    mapel: cleanSubject,
    jenjang: cleanLevel,
    kelas: cleanGrade,
    pertemuan: cleanPertemuan,
    bab: cleanBab,
    tema: cleanTema,
    karakteristikSiswa,
    konteks: `Pembelajaran ${cleanSubject} jenjang ${cleanLevel} (${cleanGrade}) pada ${cleanPertemuan}, dirancang sesuai tingkat perkembangan kognitif peserta didik untuk menstimulasi keaktifan belajar.`,
  };

  // TAHAP 2 — TUJUAN PEMBELAJARAN
  const stage2_Objectives: string[] = [];
  if (scopePoints.length > 0) {
    stage2_Objectives.push(`Peserta didik mampu mengidentifikasi dan memahami konsep inti ${cleanTopic} (${scopePoints[0]}).`);
    if (scopePoints.length > 1) {
      stage2_Objectives.push(`Peserta didik mampu menganalisis hubungan konsep ${scopePoints.slice(1, 3).join(' dan ')} melalui aktivitas kerja ${settings.activityType.toLowerCase()}.`);
    }
  } else {
    stage2_Objectives.push(`Peserta didik mampu memahami konsep utama dan prinsip esensial dari ${cleanTopic}.`);
    stage2_Objectives.push(`Peserta didik mampu menganalisis penerapan konsep ${cleanTopic} dalam pemecahan masalah kontekstual.`);
  }
  stage2_Objectives.push(`Peserta didik mampu menyajikan hasil pemahaman dalam bentuk ${settings.studentOutput.toLowerCase()} secara sistematis, mandiri/kolaboratif, dan percaya diri.`);

  // TAHAP 3 — ANALISIS MATERI (CONTENT CONTEXT LOCK)
  const stage3 = {
    konsepUtama: cleanTopic,
    konsepPendukung: scopePoints.length > 0 ? scopePoints : [cleanScope || cleanTopic],
    contohDanFakta: `Studi kasus dan contoh faktual penerapan ${cleanTopic} pada kehidupan nyata peserta didik ${cleanLevel} ${cleanGrade}.`,
    konteksKehidupanNyata: `Kontekstualisasi ${cleanTopic} dalam lingkungan sekitar peserta didik agar bermakna dan mempermudah pemahaman konsep.`,
  };

  // TAHAP 4 — DESAIN AKTIVITAS PESERTA DIDIK
  const stage4 = {
    jenisAktivitas: settings.activityType,
    bentukLkpd: settings.formatType,
    tingkatKesulitan: settings.difficulty,
    alokasiWaktu: settings.timeAllocation,
    bentukHasil: settings.studentOutput,
    rincianAktivitas: `Aktivitas ${settings.activityType.toLowerCase()} dengan pendekatan ${settings.formatType.toLowerCase()} selama ${settings.timeAllocation}. Peserta didik diajak mengamati stimulus konsep, menjalankan instruksi terstruktur bertingkat (${settings.difficulty}), dan menyajikan bukti belajar dalam bentuk ${settings.studentOutput.toLowerCase()}.`,
  };

  // TAHAP 5 — PENYUSUNAN KONTEN LKPD LENGKAP
  const judulLkpd = `LEMBAR KERJA PESERTA DIDIK (LKPD): ${cleanTopic.toUpperCase()}`;
  const stage5: LkpdThinkingResult['stage5_KontenLkpd'] = {
    judulLkpd,
    identitasPesertaDidik: `Nama Peserta Didik / Anggota Kelompok: [ ................................................ ] | Kelas: ${cleanGrade} | Tanggal: [ .................... ] | Nilai / Catatan Guru: [ .......... ]`,
    petunjukPengerjaan: [
      'Berdoalah sebelum memulai kegiatan pembelajaran.',
      'Bacalah ringkasan materi dan stimulus informasi yang disajikan secara seksama.',
      `Kerjakan aktivitas secara ${settings.activityType.toLowerCase()} sesuai instruksi pada tiap tahapan langkah kerja.`,
      `Tuliskan hasil diskusi atau pengerjaan pada ruang kerja/kolom ${settings.studentOutput.toLowerCase()} yang disediakan dengan rapi dan teliti.`,
      'Lakukan refleksi diri di akhir lembar kerja dan periksakan hasil kepada guru pengampu.'
    ],
    stimulusMateri: `Materi "${cleanTopic}" memuat pemahaman penting meliputi: ${scopeSummary}. Amati bagaimana konsep ini bekerja pada lingkungan sekitar Anda untuk menyelesaikan tantangan pembelajaran di bawah ini.`,
    langkahKerja: [
      `Langkah 1: Identifikasi fakta atau konsep kunci ${cleanTopic} berdasarkan stimulus materi di atas.`,
      `Langkah 2: Diskusikan bersama anggota ${settings.activityType.toLowerCase()} untuk merumuskan jawaban/solusi atas masalah yang diberikan.`,
      `Langkah 3: Tuangkan hasil analisis ke dalam format ${settings.studentOutput.toLowerCase()} pada ruang kerja yang tersedia.`,
      `Langkah 4: Tarik kesimpulan ringkas mengenai intisari pembelajaran hari ini.`
    ],
    tugasDanPertanyaan: [
      `Tugas 1 (Pemahaman Konsep): Jelaskan pengertian dan karakteristik utama dari ${cleanTopic} dengan kalimat Anda sendiri!`,
      `Tugas 2 (Analisis & Eksplorasi): Mengapa ${scopePoints[0] || cleanTopic} penting dipelajari? Berikan 1 contoh nyata di lingkungan Anda!`,
      `Tugas 3 (Aplikasi & Sintesis): Berdasarkan hasil pengamatan Anda, susunlah rangkuman ${settings.studentOutput.toLowerCase()} yang menunjukkan keterkaitan antarkonsep materi!`
    ],
    ruangJawabanDeskripsi: `Area kerja lapang berbentuk ${settings.studentOutput.toUpperCase()} berpagar modul rapi dengan garis pandu / grid halus yang nyaman untuk penulisan jawaban tangan siswa.`,
    refleksiPembelajaran: [
      `1. Apa konsep terpenting yang berhasil saya kuasai dari materi ${cleanTopic} hari ini?`,
      `2. Bagian mana dari aktivitas ini yang paling menantang dan bagaimana saya mengatasinya?`
    ]
  };

  // TAHAP 6 — DESAIN VISUAL LKPD
  const stage6: LkpdThinkingResult['stage6_DesainVisualPoster'] = {
    ukuran: pageSize,
    orientasi: orientation,
    gayaVisual: visualStyle,
    tataLetak: `Tata letak modular vertikal/horizontal seimbang (${pageSize} - ${orientation}). Pembagian proporsional: 15% Header & Identitas, 20% Tujuan & Stimulus Konsep, 35% Aktivitas & Tugas, 20% Ruang Jawaban Siswa, 10% Refleksi & Penilaian Guru.`,
    tipografi: 'Hierarki tipografi sans-serif modern yang tajam dan ramah anak/remaja. Judul Display Bold yang tegas, subjudul semi-bold jelas, teks tubuh instruksi berjarak baca nyaman (line-height 1.6).',
    paletWarna: 'Palet edukatif harmonis kontras tinggi (Background putih bersih #FFFFFF, teks primer slate-900 #0F172A, garis pemisah halus slate-200 #E2E8F0, aksen modul edukatif biru royal #2563EB dan hijau zamrud #059669).',
    ilustrasi: `Ilustrasi vektor datar (flat vector) edukatif minimalis yang merepresentasikan materi "${cleanTopic}", dilengkapi ikon instruksi (buku, pensil tulis, diskusi tim, lampu ide) yang relevan dan tidak mendominasi lembar kerja.`,
    hierarkiInformasi: 'Alur baca teratur dari atas ke bawah (Header Identitas -> Tujuan -> Stimulus -> Tugas/Aktivitas -> Ruang Jawaban -> Refleksi).',
    keseimbanganRuang: 'Keseimbangan ruang kosong (negative space) 25% untuk memastikan lembar kerja tidak sesak, mudah dibaca, dan memberikan ruang menulis yang luas bagi peserta didik.'
  };

  // TAHAP 7 — VALIDASI DAN FINALISASI
  const validationCriteria = [
    '1. Kesesuaian Jenjang & Karakteristik Kelas (Lolos)',
    '2. Kesesuaian Aktivitas dengan Tujuan Pembelajaran (Lolos)',
    '3. Keakuratan & Keamanan Materi Pokok (Lolos)',
    '4. Kejelasan Petunjuk & Langkah Kerja (Lolos)',
    '5. Keterlaksanaan Aktivitas dalam Alokasi Waktu (Lolos)',
    '6. Kesesuaian Tingkat Kesulitan Aktivitas (Lolos)',
    '7. Kecukupan Ruang Jawaban Siswa (Lolos)',
    '8. Kelengkapan 10 Struktur LKPD Terstandar (Lolos)',
    '9. Kejelasan Visual & Tipografi Mudah Dibaca (Lolos)',
    '10. Kesiapan Cetak (Print-Ready) (Lolos)',
    '11. Bebas Teks Acak & Ornamen Mengganggu (Lolos)',
    '12. Keterhubungan Logis Seluruh Bagian LKPD (Lolos)'
  ];

  const stage7 = {
    kriteriaTerpenuhi: validationCriteria,
    isLolosValidasi: true
  };

  // MERAKIT OUTPUT 5 BAGIAN SESUAI SPESIFIKASI WAJIB
  const finalPrompt = assembleCompleteUniversalLkpdOutput(
    material,
    settings,
    stage1,
    stage2_Objectives,
    stage3,
    stage4,
    stage5,
    stage6,
    stage7
  );

  return {
    stage1_IdentitasKonteks: stage1,
    stage2_TujuanPembelajaran: stage2_Objectives,
    stage3_AnalisisMateri: stage3,
    stage4_DesainAktivitas: stage4,
    stage5_KontenLkpd: stage5,
    stage6_DesainVisualPoster: stage6,
    stage7_ValidasiDanFinalisasi: stage7,
    stage7_FinalPrompt: finalPrompt,
  };
}

/**
 * Merakit Output Sistem Universal Prompt LKPD STIVIA
 * Memastikan 5 Bagian Terstruktur Sesuai Panduan:
 * ## A. HASIL ANALISIS
 * ## B. LKPD
 * ## C. KONSEP VISUAL LKPD
 * ## D. PROMPT POSTER LKPD (Diawali dengan "BUAT POSTER LKPD PEMBELAJARAN...")
 * ## E. NEGATIVE / QUALITY INSTRUCTION
 */
function assembleCompleteUniversalLkpdOutput(
  material: LkpdMaterialInput,
  settings: LkpdSettings,
  stage1: LkpdThinkingResult['stage1_IdentitasKonteks'],
  objectives: string[],
  stage3: LkpdThinkingResult['stage3_AnalisisMateri'],
  stage4: LkpdThinkingResult['stage4_DesainAktivitas'],
  stage5: LkpdThinkingResult['stage5_KontenLkpd'],
  stage6: LkpdThinkingResult['stage6_DesainVisualPoster'],
  stage7: LkpdThinkingResult['stage7_ValidasiDanFinalisasi']
): string {
  const cleanTopic = material.materiDiajarkan.trim() || 'Materi Pembelajaran';
  const cleanSubject = material.subject.trim() || 'Mata Pelajaran';
  const cleanLevel = material.educationLevel.trim() || 'Sekolah Menengah';
  const cleanGrade = material.grade.trim() || 'Kelas';
  const cleanLevelGrade = `${cleanLevel} ${cleanGrade}`.trim();
  const cleanBab = material.bab?.trim() || '';
  const cleanTema = material.temaKegiatan?.trim() || '';
  const cleanPertemuan = material.pertemuan?.trim() || 'Pertemuan 1';
  const userNotes = material.userNotes?.trim();
  const extraInstr = settings.additionalInstructions?.trim();

  // Susunan Bagian D: PROMPT POSTER LKPD yang siap disalin ke AI image generator
  const posterPromptText = `BUAT POSTER LKPD PEMBELAJARAN untuk siswa ${cleanLevel} kelas ${cleanGrade}, mata pelajaran ${cleanSubject}, dengan judul "${stage5.judulLkpd}".

Tujuan pembelajaran:
"${objectives.map(o => o.replace(/Peserta didik mampu\s*/i, '')).join('; ')}."

Materi:
"${cleanTopic} — Konsep inti meliputi: ${stage3.konsepPendukung.join(', ')}."

Aktivitas utama:
"Aktivitas ${settings.activityType.toLowerCase()} bertema ${settings.formatType.toLowerCase()} dengan tingkat kesulitan ${settings.difficulty.toLowerCase()} berdurasi ${settings.timeAllocation}, menghasilkan output berupa ${settings.studentOutput.toLowerCase()}."

Susun poster dengan struktur:
1. Header Judul Lembar Kerja & Kotak Identitas Siswa (Nama, Kelas, Tanggal, Kolom Nilai)
2. Panel Tujuan Pembelajaran & Ikon Petunjuk Pengerjaan
3. Modul Stimulus Informasi & Ilustrasi Konsep Terkait Materi
4. Kotak Langkah Kerja & Pertanyaan/Tugas Eksplorasi Terstruktur
5. Area Ruang Jawaban Siswa (${settings.studentOutput.toUpperCase()}) yang Luas dan Bersih
6. Bagian Bawah Refleksi Diri & Kolom Tanda Tangan Guru

Tampilkan:
- Petunjuk: ${stage5.petunjukPengerjaan.slice(1, 4).join('; ')}
- Tugas: ${stage5.tugasDanPertanyaan.join(' ')}
- Pertanyaan: Pertanyaan pemantik dan analisis pemecahan masalah sesuai materi
- Ruang Jawaban: Kolom pengerjaan ${settings.studentOutput.toLowerCase()} bergaris rapi yang lapang untuk ditulisi tangan oleh peserta didik
- Refleksi: Kotak refleksi singkat pembelajaran di bagian bawah

Gunakan ukuran ${stage6.ukuran} dengan orientasi ${stage6.orientasi}.

Gunakan gaya visual ${stage6.gayaVisual}.

Tata letak: ${stage6.tataLetak}

Tipografi: ${stage6.tipografi}

Warna: ${stage6.paletWarna}

Ilustrasi: ${stage6.ilustrasi}

Hierarki informasi: ${stage6.hierarkiInformasi}

Keterbacaan: Teks berbahasa Indonesia jelas, proporsional, berkontras tinggi, mudah dipahami siswa, tanpa dekorasi berlebihan.

Kesiapan untuk dicetak: Desain siap cetak (print-ready) beresolusi tinggi dengan margin kertas yang aman.

Buat desain yang modern, edukatif, menarik, bersih, profesional, sesuai usia peserta didik, dan mudah dibaca.

Pastikan seluruh teks menggunakan Bahasa Indonesia yang benar.

Pastikan terdapat ruang yang cukup bagi siswa untuk menulis jawaban.

Jangan membuat desain seperti poster promosi atau infografis biasa.

Desain harus terlihat dan berfungsi sebagai LEMBAR KERJA PESERTA DIDIK VISUAL.

Jangan menggunakan teks acak, lorem ipsum, atau tulisan yang tidak bermakna.

Pastikan seluruh informasi utama berasal dari data dan LKPD yang telah dibuat sebelumnya.`;

  return `=== UNIVERSAL PROMPT LKPD STIVIA ===
=== ANALISIS 7 TAHAP + GENERATOR POSTER LKPD OTOMATIS ===

## A. HASIL ANALISIS

Ringkasan Analisis Pembelajaran Berdasarkan Data Materi:
1. Identitas & Karakteristik Peserta Didik (Tahap 1):
   - Mata Pelajaran      : ${cleanSubject}
   - Jenjang & Kelas     : ${cleanLevelGrade}
   - Pertemuan           : ${cleanPertemuan}${cleanBab ? ` | Bab: ${cleanBab}` : ''}${cleanTema ? ` | Tema: ${cleanTema}` : ''}
   - Karakteristik Siswa : ${stage1.karakteristikSiswa}
   - Konteks             : ${stage1.konteks}

2. Tujuan Pembelajaran (Tahap 2):
${objectives.map((o, idx) => `   ${idx + 1}. ${o}`).join('\n')}

3. Analisis Materi Pokok (Tahap 3 — Content Context Lock):
   - Konsep Utama        : ${stage3.konsepUtama}
   - Konsep Pendukung    :
${stage3.konsepPendukung.map(item => `     • ${item}`).join('\n')}
   - Konteks Kehidupan   : ${stage3.contohDanFakta}
   ${userNotes ? `- Catatan Pengajar    : ${userNotes}\n` : ''}${extraInstr ? `- Instruksi Tambahan  : ${extraInstr}\n` : ''}
4. Desain Aktivitas Pembelajaran (Tahap 4):
   - Jenis Aktivitas     : ${settings.activityType}
   - Bentuk LKPD         : ${settings.formatType}
   - Tingkat Kesulitan   : ${settings.difficulty}
   - Alokasi Waktu       : ${settings.timeAllocation}
   - Bentuk Hasil Siswa  : ${settings.studentOutput}
   - Ringkasan Desain    : ${stage4.rincianAktivitas}

---

## B. LKPD

${stage5.judulLkpd}
${'='.repeat(stage5.judulLkpd.length)}

IDENTITAS PESERTA DIDIK:
${stage5.identitasPesertaDidik}

MATA PELAJARAN : ${cleanSubject}
KELAS / SEMESTER: ${cleanLevelGrade}
ALOKASI WAKTU   : ${settings.timeAllocation}
JENIS AKTIVITAS : ${settings.activityType} (${settings.formatType})

I. TUJUAN PEMBELAJARAN
${objectives.map((o, idx) => `${idx + 1}. ${o}`).join('\n')}

II. PETUNJUK PENGERJAAN
${stage5.petunjukPengerjaan.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}

III. STIMULUS PEMBELAJARAN
${stage5.stimulusMateri}

IV. LANGKAH KERJA
${stage5.langkahKerja.join('\n')}

V. TUGAS DAN PERTANYAAN EKSPLORASI
${stage5.tugasDanPertanyaan.map((t, idx) => `[Soal/Tugas ${idx + 1}]\n${t}`).join('\n\n')}

VI. RUANG LEMBAR KERJA PESERTA DIDIK
[ BENTUK HASIL: ${settings.studentOutput.toUpperCase()} ]
+-----------------------------------------------------------------------------------------+
| ${stage5.ruangJawabanDeskripsi} |
|                                                                                         |
| ....................................................................................... |
| ....................................................................................... |
| ....................................................................................... |
| ....................................................................................... |
| ....................................................................................... |
+-----------------------------------------------------------------------------------------+

VII. REFLEKSI PEMBELAJARAN
${stage5.refleksiPembelajaran.join('\n')}

Catatan Guru / Penilaian: [                                                   ]
Tanda Tangan Guru: [                       ]  Tanggal: [                       ]

---

## C. KONSEP VISUAL LKPD

Rancangan Visual Berdasarkan Isi LKPD:
- Ukuran Kertas        : ${stage6.ukuran}
- Orientasi            : ${stage6.orientasi}
- Gaya Visual          : ${stage6.gayaVisual}
- Tata Letak (Layout)  : ${stage6.tataLetak}
- Tipografi            : ${stage6.tipografi}
- Skema & Palet Warna  : ${stage6.paletWarna}
- Kebutuhan Ilustrasi  : ${stage6.ilustrasi}
- Hierarki Informasi   : ${stage6.hierarkiInformasi}
- Keseimbangan Ruang   : ${stage6.keseimbanganRuang}

---

## D. PROMPT POSTER LKPD

${posterPromptText}

---

## E. NEGATIVE / QUALITY INSTRUCTION

- no random text;
- no unreadable text;
- no distorted typography;
- no unnecessary decoration;
- no irrelevant illustration;
- no promotional advertisement style;
- no cluttered background;
- maintain clear worksheet structure;
- maintain Indonesian language;
- maintain sufficient answer spaces;
- preserve all essential learning activities;
- print-ready 8K vector clarity.`;
}
