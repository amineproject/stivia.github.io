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
import { InfographicDraft, ContentSnapshot } from '../types';
import { getContentSnapshotFromDraft } from '../data/materialGenerator';

interface EducatorProfile {
  name: string;
  role: string;
  school: string;
}

function getStoredEducatorProfile(): EducatorProfile | null {
  try {
    const saved = localStorage.getItem('stivia_educator_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.name && parsed.school) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {
    name: 'Amin Wahyudi, S.Pd.',
    role: 'Pengembang Media Pembelajaran',
    school: 'SMPN 2 Jetis Kab. Mojokerto',
  };
}

/**
 * Generate and download STIVIA Learning Material in Microsoft Word Open XML (.docx) format.
 * Strictly reads from ContentSnapshot (Single Source of Truth) without regenerating content.
 */
export async function exportMaterialToDocx(
  draft: InfographicDraft | null | undefined
): Promise<{ success: boolean; message: string; filename?: string }> {
  if (!draft || (!draft.blocks?.length && !draft.contentSnapshot?.sections?.length)) {
    return {
      success: false,
      message: 'Materi belum tersedia untuk diekspor. Silakan selesaikan proses pembuatan materi terlebih dahulu.',
    };
  }

  // 1. Get Content Snapshot (Single Source of Truth)
  const snapshot: ContentSnapshot = getContentSnapshotFromDraft(draft);
  const educatorProfile = getStoredEducatorProfile();

  // 2. Prepare file name
  const rawTitle = snapshot.title || draft.title || snapshot.identity.topic || 'Materi_Pembelajaran';
  const cleanTitle = rawTitle
    .replace(/[/\\?%*:|"<>]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .substring(0, 50);
  const filename = `STIVIA_${cleanTitle}_v2.2.docx`;

  try {
    // 3. Build docx elements
    const docChildren: (Paragraph | Table)[] = [];

    // --- HEADER UTAMA ---
    docChildren.push(
      new Paragraph({
        text: 'STIVIA',
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        run: {
          color: '4F46E5', // Indigo
          bold: true,
          size: 24, // 12pt
          font: 'Arial',
        },
      }),
      new Paragraph({
        text: 'MATERI PEMBELAJARAN',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 240 },
        run: {
          color: '0F172A', // Slate-900
          bold: true,
          size: 36, // 18pt
          font: 'Arial',
        },
      })
    );

    // --- 1. IDENTITAS PEMBELAJARAN ---
    docChildren.push(
      new Paragraph({
        text: '1. IDENTITAS PEMBELAJARAN',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 120 },
        run: {
          bold: true,
          size: 26, // 13pt
          color: '1E293B',
          font: 'Arial',
        },
      })
    );

    // Identity Table
    const identityRows: [string, string][] = [];
    if (snapshot.identity.subject) identityRows.push(['Mata Pelajaran', snapshot.identity.subject]);
    if (snapshot.identity.educationLevel) identityRows.push(['Jenjang Pendidikan', snapshot.identity.educationLevel]);
    if (snapshot.identity.grade) identityRows.push(['Kelas / Fase', snapshot.identity.grade]);
    if (snapshot.identity.theme) identityRows.push(['Tema Kegiatan Pembelajaran', snapshot.identity.theme]);
    if (snapshot.identity.topic) identityRows.push(['Materi yang Diajarkan', snapshot.identity.topic]);
    if (snapshot.identity.scope) identityRows.push(['Cakupan Materi', snapshot.identity.scope]);
    if (snapshot.identity.learningObjective) identityRows.push(['Tujuan Pembelajaran', snapshot.identity.learningObjective]);

    const tableRows = identityRows.map(([label, val]) => {
      return new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
              left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: label,
                    bold: true,
                    size: 20, // 10pt
                    color: '475569',
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
              left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: val,
                    size: 20, // 10pt
                    color: '0F172A',
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    });

    docChildren.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
      })
    );

    // --- 2. JUDUL MATERI ---
    docChildren.push(
      new Paragraph({
        text: '2. JUDUL MATERI',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        run: {
          bold: true,
          size: 26,
          color: '1E293B',
          font: 'Arial',
        },
      }),
      new Paragraph({
        text: snapshot.title,
        spacing: { before: 0, after: 200 },
        run: {
          bold: true,
          size: 24, // 12pt
          color: '4F46E5',
          font: 'Arial',
        },
      })
    );

    // --- 3. GAMBARAN UMUM ---
    docChildren.push(
      new Paragraph({
        text: '3. GAMBARAN UMUM',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 100 },
        run: {
          bold: true,
          size: 26,
          color: '1E293B',
          font: 'Arial',
        },
      }),
      new Paragraph({
        text: snapshot.overview || '-',
        spacing: { before: 0, after: 240, line: 276 },
        alignment: AlignmentType.JUSTIFIED,
        run: {
          size: 22, // 11pt
          color: '334155',
          font: 'Arial',
        },
      })
    );

    // --- 4. MATERI PEMBELAJARAN ---
    docChildren.push(
      new Paragraph({
        text: '4. MATERI PEMBELAJARAN',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 160 },
        run: {
          bold: true,
          size: 26,
          color: '1E293B',
          font: 'Arial',
        },
      })
    );

    // Loop every section in Content Snapshot
    snapshot.sections.forEach((sec, idx) => {
      const sectionNum = idx + 1;
      const sectionTitle = `${sectionNum}. ${sec.title}`;

      // Section Title
      docChildren.push(
        new Paragraph({
          text: sectionTitle,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 100 },
          run: {
            bold: true,
            size: 24, // 12pt
            color: '0F172A',
            font: 'Arial',
          },
        })
      );

      // Inti Materi
      if (sec.coreIdea) {
        docChildren.push(
          new Paragraph({
            text: 'Inti Materi:',
            spacing: { before: 80, after: 40 },
            run: {
              bold: true,
              size: 21,
              color: '4338CA', // Indigo-700
              font: 'Arial',
            },
          }),
          new Paragraph({
            text: sec.coreIdea,
            spacing: { before: 0, after: 120 },
            alignment: AlignmentType.JUSTIFIED,
            run: {
              size: 22,
              color: '1E293B',
              font: 'Arial',
            },
          })
        );
      }

      // Penjelasan
      if (sec.explanation) {
        docChildren.push(
          new Paragraph({
            text: 'Penjelasan:',
            spacing: { before: 80, after: 40 },
            run: {
              bold: true,
              size: 21,
              color: '475569',
              font: 'Arial',
            },
          }),
          new Paragraph({
            text: sec.explanation,
            spacing: { before: 0, after: 120 },
            alignment: AlignmentType.JUSTIFIED,
            run: {
              size: 22,
              color: '334155',
              font: 'Arial',
            },
          })
        );
      }

      // Poin Penting
      if (sec.keyPoints && sec.keyPoints.length > 0) {
        docChildren.push(
          new Paragraph({
            text: 'Poin Penting:',
            spacing: { before: 80, after: 40 },
            run: {
              bold: true,
              size: 21,
              color: '475569',
              font: 'Arial',
            },
          })
        );

        sec.keyPoints.forEach((pt) => {
          docChildren.push(
            new Paragraph({
              text: `•  ${pt}`,
              spacing: { before: 20, after: 40 },
              indent: { left: convertInchesToTwip(0.25) },
              run: {
                size: 22,
                color: '334155',
                font: 'Arial',
              },
            })
          );
        });
      }

      // Contoh / Konteks Kehidupan Sehari-hari (jika ada dan relevan)
      if (sec.example) {
        docChildren.push(
          new Paragraph({
            text: sec.exampleTitle ? `Contoh / Konteks (${sec.exampleTitle}):` : 'Contoh / Konteks Kehidupan Sehari-hari:',
            spacing: { before: 100, after: 40 },
            run: {
              bold: true,
              size: 21,
              color: '047857', // Emerald-700
              font: 'Arial',
            },
          }),
          new Paragraph({
            text: sec.example,
            spacing: { before: 0, after: 160 },
            indent: { left: convertInchesToTwip(0.15) },
            alignment: AlignmentType.JUSTIFIED,
            run: {
              italics: true,
              size: 21,
              color: '065F46',
              font: 'Arial',
            },
          })
        );
      }
    });

    // --- 5. RANGKUMAN KUNCI ---
    docChildren.push(
      new Paragraph({
        text: '5. RANGKUMAN KUNCI',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 120 },
        run: {
          bold: true,
          size: 26,
          color: '1E293B',
          font: 'Arial',
        },
      })
    );

    if (snapshot.keySummary && snapshot.keySummary.length > 0) {
      snapshot.keySummary.forEach((sum) => {
        docChildren.push(
          new Paragraph({
            text: `•  ${sum}`,
            spacing: { before: 40, after: 60 },
            indent: { left: convertInchesToTwip(0.25) },
            alignment: AlignmentType.JUSTIFIED,
            run: {
              size: 22,
              color: '1E293B',
              font: 'Arial',
            },
          })
        );
      });
    }

    // --- 6. IDENTITAS STIVIA & PENUTUP ---
    docChildren.push(
      new Paragraph({
        text: '────────────────────────────────────────────────────────',
        spacing: { before: 400, after: 120 },
        alignment: AlignmentType.CENTER,
        run: {
          size: 16,
          color: 'CBD5E1',
          font: 'Arial',
        },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 40 },
        children: [
          new TextRun({
            text: 'STIVIA',
            bold: true,
            size: 22,
            color: '4F46E5',
            font: 'Arial',
          }),
          new TextRun({
            text: ' — Belajar Lebih Visual, Mengajar Lebih Mudah',
            size: 20,
            color: '64748B',
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        text: 'Versi 2.2',
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 100 },
        run: {
          size: 18,
          color: '94A3B8',
          font: 'Arial',
        },
      })
    );

    if (educatorProfile && educatorProfile.name) {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: `Dikembangkan oleh: ${educatorProfile.name} • ${educatorProfile.school}`,
              size: 18,
              color: '64748B',
              font: 'Arial',
            }),
          ],
        })
      );
    }

    // 4. Create Document definition
    const doc = new Document({
      title: snapshot.title,
      description: snapshot.overview,
      styles: {
        default: {
          document: {
            run: {
              font: 'Arial',
              size: 22, // 11pt default
              color: '334155',
            },
            paragraph: {
              spacing: { line: 276, before: 0, after: 100 }, // 1.15x line spacing
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: 'STIVIA — Materi Pembelajaran Terstruktur',
                      size: 16,
                      color: '94A3B8',
                      font: 'Arial',
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: 'Halaman ',
                      size: 16,
                      color: '94A3B8',
                      font: 'Arial',
                    }),
                    new TextRun({
                      children: [PageNumber.CURRENT],
                      size: 16,
                      color: '94A3B8',
                      font: 'Arial',
                    }),
                    new TextRun({
                      text: ' dari ',
                      size: 16,
                      color: '94A3B8',
                      font: 'Arial',
                    }),
                    new TextRun({
                      children: [PageNumber.TOTAL_PAGES],
                      size: 16,
                      color: '94A3B8',
                      font: 'Arial',
                    }),
                  ],
                }),
              ],
            }),
          },
          children: docChildren,
        },
      ],
    });

    // 5. Generate blob & trigger browser download
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = filename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);

    return {
      success: true,
      message: `File dokumen ${filename} berhasil diunduh!`,
      filename,
    };
  } catch (error) {
    console.error('Failed to export DOCX:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat menyusun berkas DOCX.',
    };
  }
}
