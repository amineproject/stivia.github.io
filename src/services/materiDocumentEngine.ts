// ============================================================================
// STIVIA MATERI DOCUMENT ENGINE
// Modul Penyusun Dokumen Materi Ajar A4 Siap Cetak & Siap Digunakan
// Prinsip: Guru menentukan isi, STIVIA menyusun, merapikan, & memformat A4
// Tipografi Standar: Calibri Light, Body 10pt, Justify, A4 Portrait
// ============================================================================

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  convertInchesToTwip,
  Header,
  Footer,
  PageNumber
} from 'docx';
import { EducationLevel } from '../types';

export interface MateriSection {
  id: string;
  title: string;
  content: string;
  type?: string;
  isTable?: boolean;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface SupportingItem {
  id: string;
  type: 'contoh' | 'glosarium' | 'kutipan' | 'info_tambahan' | 'tabel';
  title: string;
  content: string;
}

export interface MateriDocument {
  id: string;
  subject: string;
  educationLevel: EducationLevel;
  grade: string;
  bab: string;
  pertemuan: string;
  title: string;
  teacherNotes?: string;
  includeTeacherNotesInDoc?: boolean;
  learningObjectives: string[];
  sections: MateriSection[];
  supportingItems?: SupportingItem[];
  summary?: string;
  includeSummary?: boolean;
  understandingCheck?: string[];
  includeUnderstandingCheck?: boolean;
  includeStudentNotesSheet?: boolean;
  institutionName?: string;
  teacherName?: string;
  sourceMeetingId?: string;
  sourceMasterVersion?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pilihan cepat judul bagian materi yang umum digunakan guru
 */
export const SUGGESTED_SECTION_PRESETS: { title: string; category: string }[] = [
  { title: 'Pengertian & Konsep Dasar', category: 'Fondasi' },
  { title: 'Tujuan Pembelajaran Khusus', category: 'Fondasi' },
  { title: 'Ciri-Ciri & Karakteristik', category: 'Karakteristik' },
  { title: 'Unsur-Unsur & Komponen', category: 'Struktur' },
  { title: 'Fungsi & Manfaat', category: 'Struktur' },
  { title: 'Jenis-Jenis & Klasifikasi', category: 'Variasi' },
  { title: 'Langkah-Langkah & Prosedur', category: 'Mekanisme' },
  { title: 'Contoh Konkret & Ilustrasi', category: 'Aplikasi' },
  { title: 'Non-Contoh & Kesalahan Umum', category: 'Aplikasi' },
  { title: 'Tabel Perbandingan', category: 'Analisis' },
  { title: 'Studi Kasus Kontekstual', category: 'Aplikasi' },
  { title: 'Penerapan dalam Kehidupan Nyata', category: 'Aplikasi' },
  { title: 'Latihan Mandiri & Tantangan', category: 'Evaluasi' }
];

/**
 * Contoh Draf Materi Default (Bahasa Indonesia - Konsep Dasar Teks Iklan)
 */
export const DEFAULT_SAMPLE_MATERI: MateriDocument = {
  id: 'materi-sample-iklan',
  subject: 'Bahasa Indonesia',
  educationLevel: 'SMP',
  grade: 'Kelas VIII',
  bab: 'Bab 2: Menemukan Pola Pesan dalam Iklan',
  pertemuan: 'Pertemuan 1',
  title: 'Konsep Dasar, Ciri, dan Unsur-Unsur Teks Iklan',
  teacherNotes: 'Berikan penekanan pada perbedaan kalimat persuasif iklan komersial dan ajakan sosial iklan layanan masyarakat.',
  includeTeacherNotesInDoc: false,
  learningObjectives: [
    'Peserta didik mampu mengidentifikasi pengertian dan fungsi sosial teks iklan dengan tepat.',
    'Peserta didik mampu membedakan ciri bahasa persuasif pada berbagai jenis iklan di media massa.',
    'Peserta didik mampu menganalisis 4 unsur utama pembentuk iklan yang efektif dan menarik.'
  ],
  sections: [
    {
      id: 'sec-1',
      title: 'A. Pengertian dan Hakikat Teks Iklan',
      content: 'Teks iklan merupakan salah satu bentuk komunikasi persuasif yang dirancang untuk memperkenalkan, mempromosikan, serta membujuk khalayak umum agar tertarik menggunakan produk, jasa, atau mengadopsi pesan gagasan tertentu. Secara historis dan fungsional, iklan menjadi jembatan informasi antara penyedia pesan dengan masyarakat sasaran. Dalam konteks literasi bahasa, teks iklan menuntut kecermatan memilih diksi yang padat makna, berdaya pikat tinggi, serta mampu menggugah respons afektif maupun kognitif pembacanya.'
    },
    {
      id: 'sec-2',
      title: 'B. Fungsi dan Peran Iklan dalam Kehidupan Sosial',
      content: 'Iklan memiliki multifungsi strategis dalam kehidupan modern. Pertama, fungsi informatif yang bertugas memperkenalkan keberadaan dan spesifikasi suatu hal baru. Kedua, fungsi persuasif yang berfokus pada penguatan keyakinan pembaca untuk memilih atau menyetujui pesan yang disampaikan. Ketiga, fungsi pengingat (reminding) yang menjaga kesinambungan kesadaran publik terhadap isu sosial maupun produk tertentu di tengah hiruk-pikuk arus informasi harian.'
    },
    {
      id: 'sec-3',
      title: 'C. Unsur-Unsur Pembentuk Iklan yang Efektif',
      content: 'Sebuah teks iklan yang utuh dan berdaya guna tersusun atas empat komponen integral berikut:\n1. Judul (Headline): Bagian penarik atensi utama yang berukuran paling menonjol dan memuat kata kunci pemikat.\n2. Nama Produk atau Gagasan Pokok: Identitas jelas mengenai apa yang ditawarkan atau diserukan.\n3. Penjelasan Inti (Body Copy): Uraian ringkas namun tajam mengenai keunggulan, fakta pendukung, atau manfaat langsung bagi khalayak.\n4. Ajakan Bertindak (Call to Action): Frasa penutup yang memandu pembaca mengenai tindakan konkret yang perlu diambil, seperti nomor kontak, alamat layanan, atau semboyan yang mudah diingat.'
    },
    {
      id: 'sec-4',
      title: 'D. Karakteristik Kaidah Kebahasaan Iklan',
      content: 'Teks iklan memanfaatkan ragam bahasa khusus dengan ciri-ciri sebagai berikut:\n• Bahasa Bersifat Persuasif: Memakai ungkapan yang bersifat mengajak dan mengarahkan opini tanpa terkesan memaksa.\n• Kalimat Imperatif Halus: Menggunakan kata kerja anjuran seperti marilah, gunakan, cintai, dan lindungi.\n• Rima dan Diksi Berkesan: Pemilihan susunan bunyi akhir yang serasi mempermudah khalayak menghafal pesan inti dalam jangka panjang.\n• Ringkas dan Padat (Concise): Menghindari kalimat berbelit-belit agar pesan dapat diserap seketika dalam hitungan detik.'
    },
    {
      id: 'sec-5',
      title: 'E. Tabel Perbandingan Jenis Iklan Komersial vs Iklan Layanan Masyarakat',
      content: 'Berikut adalah analisis komparatif antara dua rumpun utama iklan berdasarkan orientasi tujuan penyampaiannya:',
      isTable: true,
      tableData: {
        headers: ['Aspek Pembeda', 'Iklan Komersial', 'Iklan Layanan Masyarakat (ILM)'],
        rows: [
          ['Tujuan Utama', 'Meningkatkan penjualan barang/jasa dan profit ekonomi.', 'Membangun kesadaran sosial dan perubahan perilaku publik.'],
          ['Penyelenggara', 'Perusahaan swasta, produsen, atau pelaku usaha.', 'Pemerintah, lembaga swadaya masyarakat, atau institusi nirlaba.'],
          ['Sasaran Audiens', 'Konsumen potensial dengan segmentasi pasar tertentu.', 'Seluruh lapisan masyarakat umum tanpa terkecuali.'],
          ['Contoh Nyata', 'Promosi produk minuman sehat kemasan ramah lingkungan.', 'Kampanye bijak memilah sampah plastik sejak dari rumah.']
        ]
      }
    }
  ],
  supportingItems: [
    {
      id: 'sup-1',
      type: 'glosarium',
      title: 'Istilah Penting (Glosarium Saku)',
      content: 'Persuasif: Bentuk komunikasi yang bertujuan meyakinkan dan membujuk; Call to Action (CTA): Instruksi langsung kepada audiens untuk merespons pesan; Headline: Judul utama teks iklan berdaya pikat tinggi.'
    },
    {
      id: 'sup-2',
      type: 'contoh',
      title: 'Kutipan Slogan Reflektif',
      content: '"Kata yang dipilih dengan cermat mampu mengubah cara pandang dunia dalam satu tarikan napas."'
    }
  ],
  summary: 'Teks iklan adalah wacana persuasif yang memadukan judul mencolok, identitas produk/gagasan, uraian keunggulan ringkas, dan ajakan bertindak (CTA). Keberhasilan iklan ditentukan oleh ketepatan kaidah kebahasaan yang ringkas, persuasif, berima serasi, serta kejujuran informasi yang disampaikan kepada khalayak sasaran.',
  includeSummary: true,
  understandingCheck: [
    'Jelaskan mengapa pemilihan diksi dalam judul iklan (headline) memegang peranan paling krusial terhadap keberhasilan pesan!',
    'Analisislah perbedaan mendasar antara tujuan iklan komersial dengan iklan layanan masyarakat menggunakan contoh di lingkungan sekolahmu!',
    'Jika kamu diminta membuat iklan ajakan membaca buku di perpustakaan, tuliskan satu kalimat persuasif yang berima dan mudah diingat siswa!'
  ],
  includeUnderstandingCheck: true,
  includeStudentNotesSheet: false,
  institutionName: 'SMP NEGERI 2 JETIS KABUPATEN MOJOKERTO',
  teacherName: 'Amin Wahyudi, S.Pd.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Membersihkan string dari format markdown agar output dokumen bersih murni teks akademik
 */
function cleanAcademicText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // hapus bold markdown
    .replace(/\*(.*?)\*/g, '$1')     // hapus italic markdown
    .replace(/^#+\s+/gm, '')         // hapus heading markdown
    .replace(/`([^`]+)`/g, '$1')     // hapus code markdown
    .trim();
}

/**
 * Sintesis Rangkuman Otomatis Berdasarkan Teks Materi Pengguna (Strict Source of Truth)
 * Menyaring poin-poin paling esensial dari setiap section materi pengguna tanpa menambah fakta baru.
 */
export function synthesizeSummaryFromSections(sections: MateriSection[], title: string): string {
  if (!sections || sections.length === 0) {
    return `Materi ajar mengenai ${cleanAcademicText(title)} telah disusun secara sistematis untuk dipelajari dan dipahami secara mendalam.`;
  }

  const keySentences: string[] = [];

  for (const sec of sections) {
    if (!sec.content || sec.content.trim().length === 0) continue;
    // Bersihkan konten dari bullet points dan karakter khusus
    const cleanContent = cleanAcademicText(sec.content).replace(/^[-*•\d\.\)]+\s*/gm, '').trim();
    // Ambil kalimat pertama yang bermakna dari setiap bagian
    const sentences = cleanContent.split(/(?<=[.?!])\s+/);
    const validSentence = sentences.find(s => s.length > 25 && !s.toLowerCase().startsWith('tabel'));
    if (validSentence) {
      keySentences.push(validSentence.trim());
    }
  }

  if (keySentences.length > 0) {
    return `Intisari Pembelajaran: ${keySentences.slice(0, 4).join(' ')}`;
  }

  return `Pembelajaran materi ${cleanAcademicText(title)} menekankan penguasaan konsep, struktur, dan penerapannya secara kontekstual melalui telaah terstruktur pada setiap bagian materi ajar.`;
}

/**
 * Membuat Pertanyaan Cek Pemahaman Konseptual Berbasis Materi Pengguna
 */
export function generateUnderstandingQuestionsFromSections(sections: MateriSection[], title: string): string[] {
  const safeTitle = cleanAcademicText(title);
  if (!sections || sections.length === 0) {
    return [
      `Jelaskan kembali konsep utama dari materi ${safeTitle} dengan menggunakan bahasamu sendiri!`,
      `Mengapa materi ${safeTitle} penting dipelajari dan bagaimana penerapannya dalam kehidupan sehari-hari?`
    ];
  }

  const questions: string[] = [];

  sections.forEach((sec, idx) => {
    const cleanTitle = cleanAcademicText(sec.title).replace(/^[A-Z0-9\.\-\s]+/, '').trim();
    if (cleanTitle.length > 3 && idx < 3) {
      const lower = cleanTitle.toLowerCase();
      if (lower.includes('pengertian') || lower.includes('definisi') || lower.includes('konsep')) {
        questions.push(`Berdasarkan uraian di atas, simpulkan pengertian pokok dari ${cleanTitle} dan jelaskan mengapa konsep tersebut penting!`);
      } else if (lower.includes('ciri') || lower.includes('karakteristik') || lower.includes('unsur') || lower.includes('komponen')) {
        questions.push(`Sebutkan dan uraikan karakteristik serta unsur-unsur pembentuk ${cleanTitle} yang telah kamu pelajari!`);
      } else if (lower.includes('perbandingan') || lower.includes('jenis') || lower.includes('klasifikasi') || lower.includes('tabel')) {
        questions.push(`Analisislah perbedaan atau klasifikasi utama yang disajikan dalam bagian "${cleanTitle}", dan berikan contoh konkretnya!`);
      } else {
        questions.push(`Bagaimana penjelasan mengenai "${cleanTitle}" dapat membantu kamu memahami keseluruhan materi ${safeTitle}?`);
      }
    }
  });

  if (questions.length === 0) {
    questions.push(`Jelaskan intisari konsep ${safeTitle} yang paling berkesan bagi pemahamanmu hari ini!`);
  }

  // Tambahkan satu pertanyaan refleksi kontekstual
  questions.push(`Tuliskan satu contoh nyata atau situasi sehari-hari yang berkaitan erat dengan materi ${safeTitle}!`);

  return questions.slice(0, 4);
}

/**
 * Memperkirakan Alokasi Halaman Dokumen A4 (Estimator Pagination)
 * Membantu guru mengetahui estimasi jumlah halaman sebelum dicetak
 */
export function estimateA4PageCount(doc: MateriDocument): number {
  let charCount = 0;
  // Hitung karakter teks utama
  charCount += doc.title.length * 2;
  doc.learningObjectives.forEach(o => (charCount += o.length));
  doc.sections.forEach(s => {
    charCount += s.title.length * 1.5;
    charCount += s.content.length;
    if (s.isTable && s.tableData) {
      charCount += s.tableData.rows.length * 150;
    }
  });
  if (doc.includeSummary && doc.summary) charCount += doc.summary.length * 1.2;
  if (doc.includeUnderstandingCheck && doc.understandingCheck) {
    doc.understandingCheck.forEach(q => (charCount += q.length + 120)); // tambah ruang garis jawaban
  }
  if (doc.includeStudentNotesSheet) charCount += 1400; // 1 halaman tambahan untuk lembar catatan

  // Standar 1 halaman A4 Calibri Light 10pt portrait dengan margin rapi ~ 2.200 - 2.600 karakter
  const estimatedPages = Math.ceil(charCount / 2200);
  return Math.max(1, estimatedPages);
}

/**
 * Ekspor Dokumen Materi Ajar ke Format Microsoft Word (.docx)
 * Berorientasi Cetak A4, Tipografi Calibri Light, Rata Justify
 */
export async function exportMateriToDocx(doc: MateriDocument): Promise<{ success: boolean; filename?: string; error?: string }> {
  try {
    const docParagraphs: (Paragraph | Table)[] = [];

    // Header Lembaga / KOP
    if (doc.institutionName) {
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: doc.institutionName.toUpperCase(),
              bold: true,
              size: 24, // 12pt
              font: 'Calibri Light'
            })
          ]
        })
      );
    }

    // Identitas Dokumen
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: 'DOKUMEN MATERI PEMBELAJARAN TERSTRUKTUR',
            bold: true,
            size: 20, // 10pt
            color: '475569',
            font: 'Calibri Light'
          })
        ]
      })
    );

    // Judul Materi Ajar
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: doc.title.toUpperCase(),
            bold: true,
            size: 32, // 16pt
            font: 'Calibri Light'
          })
        ]
      })
    );

    // Tabel Informasi Meta (Mapel, Jenjang, Bab, Pertemuan, Guru)
    const metaTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.DOTTED, size: 2, color: 'E2E8F0' },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Mata Pelajaran: ', bold: true, size: 20, font: 'Calibri Light' }),
                    new TextRun({ text: doc.subject, size: 20, font: 'Calibri Light' })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Jenjang & Kelas: ', bold: true, size: 20, font: 'Calibri Light' }),
                    new TextRun({ text: `${doc.educationLevel} (${doc.grade})`, size: 20, font: 'Calibri Light' })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Bab / Topik: ', bold: true, size: 20, font: 'Calibri Light' }),
                    new TextRun({ text: doc.bab || '-', size: 20, font: 'Calibri Light' })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Alokasi Pertemuan: ', bold: true, size: 20, font: 'Calibri Light' }),
                    new TextRun({ text: doc.pertemuan || '1 Pertemuan', size: 20, font: 'Calibri Light' })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
    docParagraphs.push(metaTable);

    // Spacing
    docParagraphs.push(new Paragraph({ spacing: { after: 180 }, children: [] }));

    // TUJUAN PEMBELAJARAN
    if (doc.learningObjectives && doc.learningObjectives.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 120, after: 80 },
          children: [
            new TextRun({
              text: 'TUJUAN PEMBELAJARAN (CAPAIAN KOMPETENSI):',
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );

      doc.learningObjectives.forEach((obj, idx) => {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 60 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${idx + 1}. ${obj.replace(/^[-*•\d\.\)]+\s*/, '')}`,
                size: 20,
                font: 'Calibri Light'
              })
            ]
          })
        );
      });
      docParagraphs.push(new Paragraph({ spacing: { after: 140 }, children: [] }));
    }

    // BAGIAN-BAGIAN MATERI UTAMA
    doc.sections.forEach((sec) => {
      // Judul Bagian
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: sec.title,
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );

      // Isi Bagian (pecah per paragraf)
      const paragraphs = sec.content.split('\n').filter(p => p.trim().length > 0);
      paragraphs.forEach(p => {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: p,
                size: 20, // 10pt
                font: 'Calibri Light'
              })
            ]
          })
        );
      });

      // Jika ada tabel pada bagian materi
      if (sec.isTable && sec.tableData && sec.tableData.headers.length > 0) {
        const tableRows = [
          new TableRow({
            tableHeader: true,
            children: sec.tableData.headers.map(h => 
              new TableCell({
                shading: { fill: 'F1F5F9' },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ text: h, bold: true, size: 19, font: 'Calibri Light' })
                    ]
                  })
                ]
              })
            )
          }),
          ...sec.tableData.rows.map(row => 
            new TableRow({
              children: row.map(cellText => 
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.JUSTIFIED,
                      children: [
                        new TextRun({ text: cellText, size: 19, font: 'Calibri Light' })
                      ]
                    })
                  ]
                })
              )
            })
          )
        ];

        const contentTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        });
        docParagraphs.push(contentTable);
        docParagraphs.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      }
    });

    // RANGKUMAN MATERI
    if (doc.includeSummary && doc.summary) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 80 },
          children: [
            new TextRun({
              text: 'RANGKUMAN MATERI (INTISARI KUNCI):',
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 140 },
          children: [
            new TextRun({
              text: doc.summary,
              italics: true,
              size: 20,
              font: 'Calibri Light'
            })
          ]
        })
      );
    }

    // CEK PEMAHAMAN
    if (doc.includeUnderstandingCheck && doc.understandingCheck && doc.understandingCheck.length > 0) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: 'CEK PEMAHAMAN & PERTANYAAN DISKUSI:',
              bold: true,
              size: 22,
              font: 'Calibri Light'
            })
          ]
        })
      );

      doc.understandingCheck.forEach((q, qIdx) => {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `${qIdx + 1}. ${q}`,
                bold: true,
                size: 20,
                font: 'Calibri Light'
              })
            ]
          })
        );
        // Garis tempat jawaban siswa
        docParagraphs.push(
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'Jawaban: _____________________________________________________________________________________\n_____________________________________________________________________________________________',
                color: '94A3B8',
                size: 18,
                font: 'Calibri Light'
              })
            ]
          })
        );
      });
    }

    // Susun Document Word OpenXML (.docx)
    const wordDoc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: convertInchesToTwip(8.27), // A4 Width in inches
                height: convertInchesToTwip(11.69) // A4 Height in inches
              },
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1)
              }
            }
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `Materi Ajar: ${doc.title} | ${doc.subject} ${doc.grade}`,
                      size: 16,
                      color: '64748B',
                      font: 'Calibri Light'
                    })
                  ]
                })
              ]
            })
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: 'STIVIA Materi Ajar Siap Cetak • Halaman ', size: 16, font: 'Calibri Light', color: '64748B' }),
                    new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Calibri Light', color: '64748B' })
                  ]
                })
              ]
            })
          },
          children: docParagraphs
        }
      ]
    });

    const blob = await Packer.toBlob(wordDoc);
    const sanitizedTitle = doc.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const filename = `Materi_${doc.subject}_${sanitizedTitle}.docx`;

    // Trigger download di browser
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (err: any) {
    console.error('Error exporting materi to DOCX:', err);
    return { success: false, error: err?.message || 'Gagal mengekspor dokumen Word' };
  }
}
