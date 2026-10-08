import { AssessmentProductContext, AssessmentForm, AssessmentType } from '../types';

export type CognitiveLevel = 
  | 'C1-C2 (Mengingat & Memahami)'
  | 'C3-C4 (Menerapkan & Menganalisis)'
  | 'C5-C6 (Mengevaluasi & Berkreasi)'
  | 'Campuran / Bertingkat (HOTS)';

export interface AssessmentQuestionItem {
  id: string;
  number: number;
  form: AssessmentForm;
  cognitiveLevel: string;
  topicRef: string;
  questionText: string;
  options?: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  answerKey: string;
  explanation: string;
  rubric?: string;
  point: number;
}

export interface GeneratedAssessmentInstrument {
  id: string;
  title: string;
  type: AssessmentType;
  educationLevel: string;
  grade: string;
  subject: string;
  bab: string;
  pertemuan: string;
  temaKegiatan: string;
  materiDiajarkan: string;
  cakupanMateri: string;
  learningObjectives: string[];
  cognitiveLevel: CognitiveLevel;
  totalQuestions: number;
  totalPoints: number;
  timeAllocation: string;
  instructions: string[];
  items: AssessmentQuestionItem[];
  rubricGeneral: string;
  generatedPromptAI: string;
  createdAt: string;
  version: number;
}

export interface AssessmentGenerateOptions {
  type: AssessmentType;
  questionCount: number;
  cognitiveLevel: CognitiveLevel;
  forms: AssessmentForm[];
  includeAnswerKey: boolean;
  includeRubric: boolean;
  timeAllocation?: string;
}

/**
 * Ekstraksi topik-topik spesifik dari Cakupan Materi untuk memastikan
 * setiap butir soal bersumber tepat dari materi yang diajarkan (Strict Anti-Hallucination).
 */
function extractTopicsFromCakupan(cakupan: string, materiDiajarkan: string): string[] {
  if (!cakupan || !cakupan.trim()) {
    return [materiDiajarkan || 'Konsep Dasar Pembelajaran'];
  }
  const lines = cakupan
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .map(l => l.replace(/^(\d+[\.\)]|\-|\*|•)\s*/, '').trim())
    .filter(l => l.length > 2);

  return lines.length > 0 ? lines : [materiDiajarkan];
}

/**
 * Merumuskan butir-butir instrumen asesmen secara deterministik dari Master Learning Data.
 */
export function generateAssessmentInstrument(
  context: AssessmentProductContext,
  options: AssessmentGenerateOptions
): GeneratedAssessmentInstrument {
  const topics = extractTopicsFromCakupan(context.cakupanMateri, context.materiDiajarkan);
  const items: AssessmentQuestionItem[] = [];
  const count = Math.max(1, Math.min(options.questionCount, 20));
  const activeForms = options.forms.length > 0 ? options.forms : ['Pilihan Ganda', 'Uraian'];

  const subject = context.subject || 'Bahasa Indonesia';
  const materi = context.materiDiajarkan || 'Materi Pembelajaran';

  for (let i = 1; i <= count; i++) {
    const topic = topics[(i - 1) % topics.length];
    const form = activeForms[(i - 1) % activeForms.length];

    let item: AssessmentQuestionItem;

    if (form === 'Pilihan Ganda') {
      item = {
        id: `q-${i}-${Date.now()}`,
        number: i,
        form: 'Pilihan Ganda',
        cognitiveLevel: i % 2 === 1 ? 'C2 (Memahami)' : 'C4 (Menganalisis)',
        topicRef: topic,
        questionText: `Berdasarkan materi "${topic}" pada pembelajaran ${materi}, manakah pernyataan berikut yang paling tepat menjelaskan konsep tersebut?`,
        options: [
          { key: 'A', text: `Konsep ${topic} berfokus pada penerapan langsung dalam memecahkan masalah kontekstual.` },
          { key: 'B', text: `Unsur ${topic} hanya digunakan sebagai pelengkap tanpa fungsi analitis formal.` },
          { key: 'C', text: `Kaidah ${topic} tidak memiliki keterkaitan dengan materi ${materi}.` },
          { key: 'D', text: `Penetapan ${topic} dilakukan secara acak tanpa mengikuti struktur pembelajaran.` }
        ],
        answerKey: 'A',
        explanation: `Pilihan A tepat karena konsep ${topic} esensial dalam pemahaman dan penerapan kontekstual pada materi ${materi}.`,
        rubric: 'Benar = skor 10; Salah/Kosong = skor 0.',
        point: 10
      };
    } else if (form === 'Benar-Salah') {
      item = {
        id: `q-${i}-${Date.now()}`,
        number: i,
        form: 'Benar-Salah',
        cognitiveLevel: 'C2 (Memahami)',
        topicRef: topic,
        questionText: `Pernyataan: "Dalam pembahasan ${topic}, setiap indikator harus saling terintegrasi untuk mendukung tujuan materi ${materi}." (Tentukan Benar atau Salah beserta alasannya)`,
        options: [
          { key: 'A', text: 'Benar' },
          { key: 'B', text: 'Salah' }
        ],
        answerKey: 'Benar',
        explanation: `Pernyataan bernilai Benar karena integrasi indikator merupakan prinsip utama dalam penguasaan ${topic}.`,
        rubric: 'Pilihan benar & alasan logis = skor 10; Pilihan benar tanpa alasan = skor 5; Salah = 0.',
        point: 10
      };
    } else if (form === 'Menjodohkan') {
      item = {
        id: `q-${i}-${Date.now()}`,
        number: i,
        form: 'Menjodohkan',
        cognitiveLevel: 'C3 (Menerapkan)',
        topicRef: topic,
        questionText: `Jodohkan istilah utama dalam topik "${topic}" berikut dengan fungsi atau deskripsi yang paling tepat!`,
        options: [
          { key: 'A', text: `Ciri Utama ${topic} → Karakteristik pembeda dalam materi ${materi}` },
          { key: 'B', text: `Tujuan Konseptual → Capaian kompetensi peserta didik` },
          { key: 'C', text: `Aplikasi Lapangan → Contoh penerapan riil dalam kehidupan sehari-hari` },
          { key: 'D', text: `Indikator Evaluasi → Tolok ukur ketercapaian pemahaman` }
        ],
        answerKey: 'Pasangan A-1, B-2, C-3, D-4',
        explanation: `Pencocokan disusun berdasarkan taksonomi definisi dan peran fungsional pada ${topic}.`,
        rubric: 'Setiap pasangan benar bernilai 2.5 poin (Total 10 poin).',
        point: 10
      };
    } else if (form === 'Praktik' || form === 'Proyek') {
      item = {
        id: `q-${i}-${Date.now()}`,
        number: i,
        form,
        cognitiveLevel: 'C5-C6 (Mengevaluasi & Berkreasi)',
        topicRef: topic,
        questionText: `Tugas Unjuk Kerja: Buatlah karya/analisis mandiri yang mendemonstrasikan penerapan topik "${topic}". Sertakan bukti identifikasi unsur-unsur materi ${materi} yang relevan!`,
        answerKey: 'Penilaian berbasis performa (Rubrik Unjuk Kerja)',
        explanation: `Peserta didik dinilai dari ketepatan konsep, kelengkapan komponen ${topic}, dan orisinalitas karya.`,
        rubric: 'Kriteria: (1) Ketepatan konsep (40%), (2) Sistematika sajian (30%), (3) Kreativitas/solusi kontekstual (30%).',
        point: 20
      };
    } else {
      // Default: Uraian
      item = {
        id: `q-${i}-${Date.now()}`,
        number: i,
        form: 'Uraian',
        cognitiveLevel: 'C4 (Menganalisis)',
        topicRef: topic,
        questionText: `Jelaskan secara mendalam konsep "${topic}" pada materi ${materi}! Berikan satu contoh konkret penerapannya dalam kehidupan sehari-hari serta dampaknya bagi pemahaman peserta didik.`,
        answerKey: `Jawaban memuat: (1) Definisi dan hakikat ${topic}, (2) Unsur pembentuk, dan (3) Contoh kontekstual yang relevan dengan ${materi}.`,
        explanation: `Pertanyaan menguji kemampuan elaborasi konsep dan transfer knowledge peserta didik pada topik ${topic}.`,
        rubric: 'Skor 15: Penjelasan lengkap & contoh konkret sangat tepat. Skor 10: Penjelasan tepat namun contoh terbatas. Skor 5: Penjelasan kurang lengkap. Skor 0: Tidak menjawab.',
        point: 15
      };
    }

    items.push(item);
  }

  const totalPoints = items.reduce((acc, curr) => acc + curr.point, 0);

  // Prompt AI yang ketat terhadap Master Data (Anti-Halusinasi)
  const generatedPromptAI = buildAssessmentAIPrompt(context, options, items);

  return {
    id: `assess-${Date.now()}`,
    title: `Instrumen Asesmen ${options.type} — ${context.pertemuan}`,
    type: options.type,
    educationLevel: context.educationLevel,
    grade: context.grade,
    subject: context.subject,
    bab: context.bab,
    pertemuan: context.pertemuan,
    temaKegiatan: context.temaKegiatan,
    materiDiajarkan: context.materiDiajarkan,
    cakupanMateri: context.cakupanMateri,
    learningObjectives: context.learningObjectives,
    cognitiveLevel: options.cognitiveLevel,
    totalQuestions: items.length,
    totalPoints,
    timeAllocation: options.timeAllocation || (options.type === 'Sumatif' ? '60 - 80 Menit' : '20 - 30 Menit'),
    instructions: [
      'Berdoalah sebelum mengerjakan soal.',
      'Bacalah setiap butir pertanyaan dengan teliti dan cermat.',
      'Dahulukan menjawab pertanyaan yang Anda anggap paling mudah.',
      'Periksa kembali seluruh jawaban sebelum diserahkan kepada pendidik.'
    ],
    items,
    rubricGeneral: options.type === 'Sumatif'
      ? 'Pedoman Penilaian Sumatif: Skor Akhir = (Total Skor Perolehan / Total Skor Maksimal) × 100. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) ditentukan berdasarkan interval skor standar sekolah.'
      : 'Pedoman Penilaian Formatif: Asesmen bertujuan untuk mendiagnosis penguasaan materi dan memberikan umpan balik perbaikan belajar secara langsung.',
    generatedPromptAI,
    createdAt: new Date().toISOString().split('T')[0],
    version: context.sourceMasterVersion || 1
  };
}

/**
 * Menyusun prompt terstruktur untuk LLM / AI Studio dengan aturan anti-halusinasi ketat.
 */
export function buildAssessmentAIPrompt(
  context: AssessmentProductContext,
  options: AssessmentGenerateOptions,
  items: AssessmentQuestionItem[]
): string {
  const objectivesText = context.learningObjectives && context.learningObjectives.length > 0
    ? context.learningObjectives.map((o, idx) => `  ${idx + 1}. ${o}`).join('\n')
    : '  - Menguasai materi pembelajaran yang diajarkan secara komprehensif.';

  return `BUAT INSTRUMEN ASESMEN PEMBELAJARAN STIVIA (STRICT ZERO-HALLUCINATION)

### 1. IDENTITAS PEMBELAJARAN (MASTER LEARNING TRUTH)
* Jenis Asesmen: ${options.type} (${options.type === 'Sumatif' ? 'Penilaian Capaian Akhir' : 'Penilaian Proses Belajar'})
* Mata Pelajaran: ${context.subject}
* Jenjang & Kelas: ${context.educationLevel} (${context.grade})
* Bab / Teks: ${context.bab}
* Posisi Pertemuan: ${context.pertemuan}
* Tema Kegiatan: ${context.temaKegiatan}
* Materi Diajarkan: ${context.materiDiajarkan}
* Tingkat Kognitif Target: ${options.cognitiveLevel}
* Alokasi Waktu: ${options.timeAllocation || (options.type === 'Sumatif' ? '60-80 Menit' : '20-30 Menit')}
* Bentuk Soal: ${options.forms.join(', ')}

### 2. BATASAN CAKUPAN MATERI (DILARANG KELUAR DARI CAKUPAN INI)
${context.cakupanMateri || context.materiDiajarkan}

### 3. TUJUAN PEMBELAJARAN
${objectivesText}

${context.userNotes ? `### 4. CATATAN PEDAGOGIS KHUSUS GURU\n${context.userNotes}\n` : ''}
### 5. ATURAN INTEGRITAS KONTEN (ANTI-HALLUCINATION PROTOCOL)
1. Seluruh butir soal, stimulus bacaan, opsi jawaban, dan kunci jawaban WAJIB 100% bersumber dari materi "${context.materiDiajarkan}" dan cakupan materi di atas.
2. DILARANG memasukkan topik baru, istilah luar, atau materi lanjutan yang belum tercantum pada cakupan.
3. Soal Pilihan Ganda harus memiliki 1 kunci jawaban pasti dan 3 pengecoh (distractor) yang masuk akal namun salah secara konsep.
4. Sertakan rubrik penskoran dan kunci jawaban lengkap untuk setiap butir soal.`;
}

/**
 * Format teks siap cetak / unduh dari instrumen asesmen.
 */
export function formatAssessmentAsPrintableText(
  instrument: GeneratedAssessmentInstrument,
  includeAnswers: boolean = true
): string {
  let text = `================================================================================\n`;
  text += `                     INSTRUMEN ASESMEN PEMBELAJARAN\n`;
  text += `                       STIVIA LEARNING PLATFORM\n`;
  text += `================================================================================\n\n`;

  text += `Mata Pelajaran    : ${instrument.subject}\n`;
  text += `Jenjang / Kelas   : ${instrument.educationLevel} / ${instrument.grade}\n`;
  text += `Bab / Teks        : ${instrument.bab}\n`;
  text += `Pertemuan         : ${instrument.pertemuan}\n`;
  text += `Materi Pokok      : ${instrument.materiDiajarkan}\n`;
  text += `Jenis Asesmen     : ${instrument.type}\n`;
  text += `Alokasi Waktu     : ${instrument.timeAllocation}\n`;
  text += `Jumlah Soal       : ${instrument.totalQuestions} Butir\n\n`;

  text += `PETUNJUK PENGERJAAN:\n`;
  instrument.instructions.forEach((ins, idx) => {
    text += `${idx + 1}. ${ins}\n`;
  });
  text += `\n--------------------------------------------------------------------------------\n\n`;

  text += `SOAL EVALUASI:\n\n`;
  instrument.items.forEach((item) => {
    text += `${item.number}. [${item.form}] (${item.cognitiveLevel}) — Bobot: ${item.point} Poin\n`;
    text += `   ${item.questionText}\n`;
    if (item.options && item.options.length > 0) {
      item.options.forEach((opt) => {
        text += `   ${opt.key}. ${opt.text}\n`;
      });
    }
    text += `\n`;
  });

  if (includeAnswers) {
    text += `\n================================================================================\n`;
    text += `                           KUNCI JAWABAN & PEMBAHASAN\n`;
    text += `================================================================================\n\n`;

    instrument.items.forEach((item) => {
      text += `${item.number}. Kunci Jawaban : ${item.answerKey}\n`;
      text += `   Pembahasan    : ${item.explanation}\n`;
      if (item.rubric) {
        text += `   Rubrik Skor   : ${item.rubric}\n`;
      }
      text += `\n`;
    });

    text += `\nPEDOMAN PENSKORAN UMUM:\n${instrument.rubricGeneral}\n`;
  }

  return text;
}
