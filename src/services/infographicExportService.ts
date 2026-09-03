import { toPng, toJpeg, toBlob } from 'html-to-image';
import html2canvas from 'html2canvas';
import { InfographicDraft } from '../types';
import { exportMaterialToDocx } from './docxExportService';

export type InfographicExportFormat = 'png' | 'jpg' | 'jpeg' | 'pdf' | 'docx';

export interface ExportInfographicOptions {
  scale?: number;
  quality?: number;
  backgroundColor?: string;
  onProgress?: (message: string) => void;
}

export interface ExportInfographicResult {
  success: boolean;
  message: string;
  filename?: string;
}

/**
 * Normalizes user/UI strings into standard export format keys.
 */
export function normalizeExportFormat(input: string): InfographicExportFormat {
  const lower = (input || '').toLowerCase();
  if (lower.includes('docx') || lower.includes('word')) return 'docx';
  if (lower.includes('jpg') || lower.includes('jpeg')) return 'jpg';
  if (lower.includes('png')) return 'png';
  if (lower.includes('pdf') || lower.includes('cetak') || lower.includes('print')) return 'pdf';
  return 'png';
}

/**
 * Generates a clean, safe filename based on the infographic topic/title.
 * Example: "Ekosistem & Rantai Makanan" -> "infografis-ekosistem-rantai-makanan.png"
 * Fallback: "stivia-infografis.png"
 */
export function generateSafeInfographicFilename(
  title?: string,
  extension: string = 'png'
): string {
  const ext = extension.replace(/^\./, '').toLowerCase();
  const raw = (title || '').trim();

  if (!raw) {
    return `stivia-infografis.${ext}`;
  }

  // Remove accents & special characters, keep letters, numbers, spaces, and hyphens
  const clean = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-_]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  if (!clean) {
    return `stivia-infografis.${ext}`;
  }

  const prefix = clean.startsWith('infografis') ? '' : 'infografis-';
  return `${prefix}${clean}.${ext}`;
}

/**
 * Finds and validates the active infographic canvas element in the DOM.
 * Prioritizes:
 * 1. An explicitly provided target element (e.g. from React ref)
 * 2. An element inside an open modal (such as fullscreen modal)
 * 3. The primary #infographic-preview-canvas element on the page
 */
export function findActiveInfographicElement(preferredElement?: HTMLElement | null): HTMLElement | null {
  // 1. Check explicitly passed target
  if (preferredElement && document.body.contains(preferredElement)) {
    return preferredElement;
  }

  // 2. Check for canvas inside active modal / fullscreen overlay first
  const modalCanvas = document.querySelector('.fixed.z-50 #infographic-preview-canvas') as HTMLElement | null;
  if (modalCanvas && modalCanvas.offsetParent !== null) {
    return modalCanvas;
  }

  // 3. Check all matching elements and pick the currently visible one
  const allCanvases = document.querySelectorAll('#infographic-preview-canvas');
  if (allCanvases.length > 0) {
    for (let i = allCanvases.length - 1; i >= 0; i--) {
      const el = allCanvases[i] as HTMLElement;
      if (el.offsetParent !== null || el.offsetWidth > 0) {
        return el;
      }
    }
    return allCanvases[0] as HTMLElement;
  }

  return null;
}

/**
 * Validates the target element before capturing.
 * Throws a descriptive error if the element cannot be captured.
 */
export function validateExportTarget(preferredElement?: HTMLElement | null): HTMLElement {
  const target = findActiveInfographicElement(preferredElement);

  if (!target) {
    console.error('[STIVIA Export Error] Target infografis tidak ditemukan di DOM.');
    throw new Error('Target infografis tidak ditemukan di layar. Pastikan infografis sudah selesai dimuat.');
  }

  if (target.offsetWidth === 0 && target.offsetHeight === 0) {
    console.error('[STIVIA Export Error] Target infografis memiliki dimensi 0 (belum ter-render sempurna).', target);
    throw new Error('Elemen infografis belum selesai dirender sempurna oleh browser.');
  }

  return target;
}

/**
 * Triggers a file download in the browser given a Blob and a filename.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);
}

/**
 * Triggers a file download given a data URL and a filename.
 */
function downloadDataUrl(dataUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/**
 * Direct synchronous print handler.
 * Must be triggered directly by a user click event to preserve browser user activation gesture.
 */
export function handleDirectPrint(onToast?: (message: string) => void): void {
  console.log('[STIVIA] Memulai proses cetak');
  try {
    if (onToast) {
      onToast('Membuka dialog cetak browser...');
    }
    window.print();
    console.log('[STIVIA] window.print() berhasil dipanggil');
  } catch (error) {
    console.error('[STIVIA Print Error]', error);
    if (onToast) {
      onToast('⚠️ Gagal membuka dialog cetak browser: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
}

/**
 * Centralized export engine for STIVIA infographics.
 * Supports: PNG, JPG/JPEG, PDF (Print), and DOCX.
 */
export async function exportInfographic(
  rawFormat: string,
  draft: InfographicDraft | null | undefined,
  targetElement?: HTMLElement | null,
  options?: ExportInfographicOptions
): Promise<ExportInfographicResult> {
  const format = normalizeExportFormat(rawFormat);

  if (!draft) {
    console.error('[STIVIA Export Error] Draft data is missing.');
    return {
      success: false,
      message: 'Data infografis belum tersedia untuk diekspor.',
    };
  }

  // =========================================================================
  // 1. DOCX EXPORT (Word document of structured learning materials)
  // JANGAN UBAH: DOCX sudah berjalan dengan baik dan harus dipertahankan.
  // =========================================================================
  if (format === 'docx') {
    return await exportMaterialToDocx(draft);
  }

  // =========================================================================
  // 2. PDF / PRINT EXPORT
  // =========================================================================
  if (format === 'pdf') {
    handleDirectPrint();
    return {
      success: true,
      message: 'Dialog cetak / PDF infografis telah dibuka.',
    };
  }

  // =========================================================================
  // 3. IMAGE EXPORT: PNG & JPG / JPEG
  // =========================================================================
  const isJpg = format === 'jpg' || format === 'jpeg';
  const ext = isJpg ? 'jpg' : 'png';
  const mimeType = isJpg ? 'image/jpeg' : 'image/png';
  const filename = generateSafeInfographicFilename(draft.title || draft.rawTopic, ext);

  console.log(`[STIVIA] Memulai proses ekspor ${ext.toUpperCase()} untuk topik:`, draft.title || draft.rawTopic);

  let target: HTMLElement;
  try {
    target = validateExportTarget(targetElement);
    console.log(`[STIVIA] Target elemen infografis terverifikasi:`, {
      tagName: target.tagName,
      id: target.id,
      width: target.offsetWidth,
      height: target.offsetHeight,
    });
  } catch (validationErr) {
    const errMsg = validationErr instanceof Error ? validationErr.message : String(validationErr);
    if (isJpg) {
      console.error('[STIVIA JPG Export Error]', validationErr);
    } else {
      console.error('[STIVIA PNG Export Error]', validationErr);
    }
    return {
      success: false,
      message: errMsg,
    };
  }

  // Wait for web fonts so typography renders cleanly
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (fontErr) {
      console.warn('[STIVIA] Font ready promise caught non-fatal warning:', fontErr);
    }
  }

  // Handle any zoomed/scaled parent containers temporarily
  // so rendering captures the unconstrained natural layout coordinates
  const transformedAncestors: { element: HTMLElement; originalTransform: string }[] = [];
  let curr: HTMLElement | null = target.parentElement;
  while (curr && curr !== document.body) {
    if (curr.style && curr.style.transform && curr.style.transform !== 'none') {
      transformedAncestors.push({ element: curr, originalTransform: curr.style.transform });
      curr.style.transform = 'none';
    }
    curr = curr.parentElement;
  }

  const pixelRatio = options?.scale ?? 2.5; // High-DPI crisp rendering (~300 DPI)
  const quality = options?.quality ?? (isJpg ? 0.95 : 1.0);
  const backgroundColor = options?.backgroundColor ?? '#ffffff';

  // Common html-to-image render options
  const renderOptions = {
    pixelRatio,
    backgroundColor,
    quality,
    cacheBust: true,
    filter: (node: Node) => {
      // Exclude interactive overlays or export controls if any inside target
      if (node instanceof HTMLElement && node.classList.contains('no-export')) {
        return false;
      }
      return true;
    },
  };

  try {
    // -----------------------------------------------------------------------
    // PRIMARY STRATEGY: html-to-image
    // Uses browser-native SVG foreignObject rendering.
    // Flawlessly handles Tailwind v4 colors (OKLCH), Lucide SVG icons,
    // flexbox, and complex CSS without color parser crashes.
    // -----------------------------------------------------------------------
    let downloaded = false;

    try {
      if (isJpg) {
        console.log('[STIVIA] Menjalankan konversi toJpeg via html-to-image...');
        const dataUrl = await toJpeg(target, renderOptions);
        if (!dataUrl || dataUrl.length < 50) {
          throw new Error('Hasil data URL JPG tidak valid atau kosong.');
        }
        downloadDataUrl(dataUrl, filename);
        downloaded = true;
      } else {
        console.log('[STIVIA] Menjalankan konversi toBlob (PNG) via html-to-image...');
        const blob = await toBlob(target, renderOptions);
        if (!blob || blob.size === 0) {
          console.warn('[STIVIA] toBlob menghasilkan blob kosong, mencoba toPng data URL fallback...');
          const dataUrl = await toPng(target, renderOptions);
          if (!dataUrl || dataUrl.length < 50) {
            throw new Error('Hasil data URL PNG tidak valid atau kosong.');
          }
          downloadDataUrl(dataUrl, filename);
          downloaded = true;
        } else {
          downloadBlob(blob, filename);
          downloaded = true;
        }
      }
    } catch (primaryErr) {
      console.warn(`[STIVIA] Primary html-to-image export encountered error, trying secondary canvas fallback:`, primaryErr);

      // ---------------------------------------------------------------------
      // SECONDARY FALLBACK STRATEGY: html2canvas
      // ---------------------------------------------------------------------
      try {
        console.log('[STIVIA] Menjalankan secondary fallback via html2canvas...');
        const canvas = await html2canvas(target, {
          scale: pixelRatio,
          useCORS: true,
          allowTaint: true,
          backgroundColor,
          logging: false,
          scrollX: 0,
          scrollY: 0,
        });

        const blob: Blob | null = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b), mimeType, quality);
        });

        if (!blob || blob.size === 0) {
          throw new Error('Gagal mengonversi kanvas html2canvas menjadi Blob.');
        }

        downloadBlob(blob, filename);
        downloaded = true;
      } catch (fallbackErr) {
        // Log both errors clearly
        if (isJpg) {
          console.error('[STIVIA JPG Export Error]', { primaryErr, fallbackErr });
        } else {
          console.error('[STIVIA PNG Export Error]', { primaryErr, fallbackErr });
        }
        throw primaryErr; // Re-throw the primary error to show descriptive information
      }
    }

    if (downloaded) {
      console.log(`[STIVIA] Ekspor ${ext.toUpperCase()} berhasil diselesaikan: ${filename}`);
      return {
        success: true,
        message: `Infografis (${ext.toUpperCase()}) berhasil diunduh: ${filename}`,
        filename,
      };
    }

    throw new Error('Proses unduhan berkas tidak dapat diselesaikan.');
  } catch (error) {
    if (isJpg) {
      console.error('[STIVIA JPG Export Error]', error);
    } else {
      console.error('[STIVIA PNG Export Error]', error);
    }

    const detail = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Gagal mengekspor infografis (${ext.toUpperCase()}): ${detail}`,
    };
  } finally {
    // Always restore any transforms back to their original values
    transformedAncestors.forEach(({ element, originalTransform }) => {
      element.style.transform = originalTransform;
    });
  }
}
