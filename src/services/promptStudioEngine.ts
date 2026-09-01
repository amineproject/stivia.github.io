import { InfographicDraft, ContentSnapshot } from '../types';
import { getContentSnapshotFromDraft } from '../data/materialGenerator';
import { findStyleByNameOrId } from '../data/infographicStylesData';

/**
 * PROMPT STUDIO ENGINE — STIVIA
 * Menghasilkan Universal Prompts yang bersih, sistematis, dan bebas dari vendor lock-in,
 * bertumpu pada CONTENT SNAPSHOT sebagai Single Source of Truth:
 * CAKUPAN -> STRUKTUR (2A) -> BOBOT (2B) -> KEDALAMAN (2C) -> CONTENT SNAPSHOT -> PROMPT
 */

// 1. GENERATOR UNIVERSAL PROMPT MATERI (DARI PROYEK STIVIA)
export function generateUniversalMaterialPrompt(project: InfographicDraft): string {
  const snapshot: ContentSnapshot = getContentSnapshotFromDraft(project);
  const { identity, title, overview, sections, keySummary } = snapshot;

  // Bangun representasi struktur, bobot, kedalaman, dan inti materi
  const sectionsList = sections.map((sec, idx) => {
    const keyPointsStr = sec.keyPoints && sec.keyPoints.length > 0
      ? sec.keyPoints.map(k => `      • ${k}`).join('\n')
      : '      • Poin esensial materi';

    return `BAGIAN ${sec.order}: [${sec.letterIndex}] ${sec.title}
   - Bobot Materi: ${sec.weight} | Tingkat Kedalaman: ${sec.depth}
   - Inti Materi (Harus Dipahami Siswa): "${sec.coreIdea}"
   - Penjelasan Lengkap: ${sec.explanation}
   - Poin-Poin Penting:
${keyPointsStr}${sec.example ? `\n   - Contoh Kontekstual: "${sec.example}"` : ''}`;
  }).join('\n\n');

  const keySummaryStr = (keySummary || []).map(s => `- ${s}`).join('\n');

  return `=== UNIVERSAL PROMPT: PENYUSUNAN MATERI PEMBELAJARAN TERSTRUKTUR ===

PERAN DAN TUJUAN:
Bertindaklah sebagai Ahli Kurikulum & Pengembang Materi Pembelajaran Profesional. Tugas Anda adalah menyusun materi pembelajaran yang lengkap, akurat, terstruktur secara logis, dan mudah dipahami oleh peserta didik sesuai jenjang yang ditargetkan, berpedoman ketat pada CONTENT SNAPSHOT terstruktur di bawah ini.

INFORMASI DASAR PEMBELAJARAN (IDENTITAS):
- Judul Materi: ${title}
- Mata Pelajaran: ${identity.subject || 'Umum'}
- Jenjang / Target: ${identity.educationLevel} - Kelas ${identity.grade || '-'}
- Tema Pembelajaran: ${identity.theme || 'Umum'}
- Tujuan Pembelajaran: ${identity.learningObjective || `Peserta didik memahami konsep ${identity.topic} secara terstruktur dan aplikatif.`}

GAMBARAN UMUM / PENGANTAR:
${overview || `Materi ini dirancang untuk memberikan pemahaman menyeluruh mengenai ${identity.topic}.`}

CAKUPAN MATERI YANG WAJIB DIBAHAS (BATAS UTAMA):
${identity.scope ? identity.scope.split('\n').filter(Boolean).map((s, i) => `${i + 1}. ${s.replace(/^[-*•0-9.]+\s*/, '')}`).join('\n') : '- ' + identity.topic}

STRUKTUR DAN KONTEN SUMBER (CONTENT SNAPSHOT STIVIA):
${sectionsList}

RANGKUMAN KUNCI:
${keySummaryStr || '- Sintesis konsep materi secara utuh dan aplikatif.'}

PETUNJUK DAN ATURAN PENULISAN:
1. Membahas seluruh bagian materi di atas secara berurutan tanpa ada topik yang terlewatkan.
2. Tidak menambahkan materi dari topik atau mata pelajaran lain yang tidak tercantum dalam cakupan.
3. Menyesuaikan kedalaman pembahasan dengan bobot yang ditentukan:
   - Bagian berbobot TINGGI/MENDALAM harus dijelaskan secara komprehensif, mencakup definisi, prinsip kerja, mekanisme, dan hubungan logis.
   - Bagian berbobot SEDANG dijelaskan secara terstruktur dengan poin-poin yang runtut dan jelas.
   - Bagian berbobot RENDAH/RINGKAS disajikan secara padat, fokus, dan esensial tanpa menghilangkan bagian tersebut.
4. Menggunakan bahasa Indonesia yang baku, komunikatif, dan sesuai dengan tingkat perkembangan kognitif peserta didik jenjang ${identity.educationLevel}.
5. Sertakan contoh yang kontekstual dan dekat dengan keseharian peserta didik untuk memudahkan pemahaman.
6. Buat rangkuman kunci di akhir materi yang hanya merangkum poin-poin yang benar-benar telah dibahas.

FORMAT KELUARAN YANG DIHARAPKAN:
- Judul Utama & Gambaran Umum Pengantar
- Pembahasan per Bagian sesuai urutan struktur Content Snapshot di atas
- Setiap bagian memuat: Penjelasan Inti, Poin Kunci, dan Contoh Kontekstual (jika relevan)
- Rangkuman Pembelajaran (Key Takeaways)
- 3 Pertanyaan Refleksi / Diskusi untuk mengevaluasi pemahaman peserta didik.`;
}

// 2. GENERATOR UNIVERSAL PROMPT INFOGRAFIS DARI PROYEK STIVIA
export interface InfographicPromptOptions {
  format?: 'Vertikal';
  visualStyleName: string;
}

export function generateUniversalInfographicFromProjectPrompt(
  project: InfographicDraft,
  options: InfographicPromptOptions
): string {
  const snapshot: ContentSnapshot = getContentSnapshotFromDraft(project);
  const { identity, title, overview, sections, keySummary } = snapshot;

  // Bangun rincian kartu visual dari Content Snapshot
  const visualSections = sections.map((sec) => {
    const keyPointsStr = (sec.keyPoints || []).map((k) => `      • ${k}`).join('\n');

    return `BAGIAN ${sec.order}: [${sec.letterIndex}] ${sec.title}
   - Prioritas Visual: ${sec.visualPriority} (Alokasi: ${sec.visualPriority === 'UTAMA' ? 'Dominan / Area Luas' : sec.visualPriority === 'SEKUNDER' ? 'Proporsional / Seimbang' : 'Kompak / Ringkas'})
   - Bobot Materi: ${sec.weight} | Tingkat Kedalaman: ${sec.depth}
   - Format Penyajian Visual: ${sec.presentationType}
   - Inti Materi: "${sec.coreIdea}"
   - Penjelasan Lengkap: ${sec.explanation}
   - Poin Kunci yang Wajib Tampil:
${keyPointsStr || '      • Poin utama terstruktur'}
   ${sec.example ? `- Contoh / Kasus Nyata: "${sec.example}"` : ''}`;
  }).join('\n\n');

  const keySummaryStr = (keySummary || []).map(s => `   • ${s}`).join('\n');

  // Resolusi instruksi gaya visual
  const matchedStyle = findStyleByNameOrId(options.visualStyleName);
  const visualInstruction = matchedStyle
    ? `- Gaya Visual Terpilih: ${matchedStyle.name} (Kategori: ${matchedStyle.category})
- Karakteristik Desain: ${matchedStyle.characteristics}
- Instruksi Visual Spesifik: ${matchedStyle.promptInstruction}`
    : `- Terapkan gaya visual: "${options.visualStyleName}" pada skema warna, tipografi judul dan teks, bentuk sudut card/kontainer, ikon edukatif, dan komposisi artistik.`;

  return `=== UNIVERSAL PROMPT: GENERATE POSTER INFOGRAFIS PEMBELAJARAN (VERTIKAL 2:3) ===

1. TUGAS UTAMA:
LANGSUNG BUATKAN SATU POSTER INFOGRAFIS PEMBELAJARAN YANG UTUH BERORIENTASI VERTIKAL BERDASARKAN SELURUH MATERI DAN INSTRUKSI DI BAWAH INI.

GUNAKAN FORMAT POSTER VERTIKAL DENGAN RASIO KANVAS TETAP 2:3.
PERTAHANKAN ORIENTASI PORTRAIT PADA SELURUH KOMPOSISI DESAIN.
JANGAN MENGUBAH FORMAT MENJADI HORIZONTAL ATAU PERSEGI.

JANGAN HANYA MENJELASKAN KONSEP DESAIN.
JANGAN HANYA MEMBERIKAN SARAN.
JANGAN HANYA MEMBUAT OUTLINE ATAU STRUKTUR TEKS.
LANGSUNG HASILKAN HASIL DESAIN / POSTER INFOGRAFISNYA.

2. INSTRUKSI GENERATE:
- Jika Anda memiliki kemampuan menghasilkan gambar atau desain visual, LANGSUNG GUNAKAN KEMAMPUAN TERSEBUT untuk menghasilkan SATU poster infografis vertikal (rasio 2:3, ukuran acuan 1024 × 1536 px / 1200 × 1800 px) berdasarkan prompt ini. Prioritaskan OUTPUT VISUAL berupa poster infografis utuh. Jangan hanya memberikan jawaban dalam bentuk teks jika kemampuan pembuatan gambar/desain tersedia.
- Jika Anda tidak dapat menghasilkan gambar secara langsung, buatkan rancangan poster infografis vertikal (rasio 2:3) yang lengkap dan siap divisualkan, dengan susunan layout visual presisi dari atas ke bawah, hierarki teks, posisi setiap card/blok, ukuran relatif elemen, arahan visual, ikon/ilustrasi yang diperlukan, dan seluruh isi teks yang harus ditempatkan pada poster. Namun jika kemampuan menghasilkan gambar tersedia, LANGSUNG BUAT POSTER INFOGRAFISNYA.

3. JUDUL & INFORMASI DASAR:
- Judul Infografis: ${title}
- Subjudul / Konteks: Materi ${identity.subject} untuk ${identity.educationLevel} Kelas ${identity.grade}
- Mata Pelajaran / Tema: ${identity.subject} (${identity.theme || 'Umum'})
- Sasaran Audiens: ${identity.educationLevel} Kelas ${identity.grade || '-'}
- Pengantar Singkat: ${overview}

4. FORMAT KANVAS DAN UKURAN DESAIN (STANDAR TETAP):
- Format: Poster Infografis Vertikal (Portrait)
- Rasio Desain: Rasio Tetap 2:3
- Ukuran / Resolusi Acuan: 1024 × 1536 px (atau 1200 × 1800 px)
- Arah Alur Baca: Dari atas ke bawah secara mengalir, runtut, dan terstruktur
- Batasan Format: Jangan menghasilkan beberapa versi format/orientasi. Buat SATU poster infografis utama dengan tampilan vertikal.

5. MATERI SUMBER (CONTENT SNAPSHOT STIVIA — SINGLE SOURCE OF TRUTH):
${visualSections}

RANGKUMAN KUNCI PENUTUP:
${keySummaryStr}

6. STRUKTUR MATERI & ALUR BACA VERTIKAL:
- Alur Visual Wajib (Atas ke Bawah): 
  Header Utama (Judul, Subjudul & Metadata) 
  ↓
  Pengantar Singkat
  ↓
  Bagian Materi 1 s/d Selesai (secara berurutan dari atas ke bawah sesuai Content Snapshot)
  ↓
  Rangkuman Kunci Visual

7. HIERARKI VISUAL & ALOKASI RUANG VERTIKAL:
- Alokasi card menyesuaikan Bobot, Kedalaman, dan Prioritas Visual:
  • Prioritas UTAMA / Bobot TINGGI / Kedalaman MENDALAM: Diberikan ukuran card lebih luas, dominan, dan menjadi fokus visual utama.
  • Prioritas SEKUNDER / Bobot SEDANG: Disusun dalam card proporsional dan seimbang.
  • Prioritas PENDUKUNG / Bobot RENDAH: Disajikan dalam card ringkas/kompak tanpa menghilangkan kontennya.
- Gunakan ruang vertikal kanvas 2:3 secara optimal dan proporsional.

8. ATURAN MATERI (KESETIAAN SUMBER):
- Content Snapshot di atas adalah SUMBER UTAMA. Gunakan seluruh informasi yang diberikan secara lengkap.
- Jangan mengubah makna materi, jangan mencampurkan topik luar yang tidak relevan, jangan memotong informasi penting, dan jangan mengganti materi dengan teks generik.
- Pertahankan hubungan logis antara Judul, Subjudul, Isi Materi, Poin Kunci, dan Rangkuman.

9. ATURAN LAYOUT & KETERBACAAN (KANVAS VERTIKAL 2:3):
- Semua tulisan harus terlihat lengkap, tajam, dan mudah dibaca (WCAG AA).
- Tidak boleh ada teks terpotong, teks bertumpuk, atau elemen grafis yang menutupi tulisan.
- Sesuaikan ukuran container dengan volume teks.
- Berikan jarak (padding internal & margin/gap) yang proporsional agar tata letak nyaman dipandang dan tidak sesak.

10. GAYA VISUAL & KARAKTER DESAIN:
${visualInstruction}
- Aturan Mutlak Gaya Visual: Gaya visual hanya menentukan karakter estetika (skema warna, tipografi judul dan teks, bentuk sudut kontainer/card, ikonografi edukatif, dan komposisi visual). Gaya visual TIDAK BOLEH mengubah format kanvas vertikal rasio 2:3, judul materi, isi materi, fakta, informasi, struktur urutan pembahasan, atau cakupan pembelajaran.

11. OUTPUT AKHIR:
Buat satu poster infografis pembelajaran vertikal (rasio 2:3) yang utuh, rapi, proporsional, menarik, mudah dibaca, dan setia pada materi sumber.

Jika kemampuan membuat gambar atau desain tersedia, SEKARANG LANGSUNG GENERATE DAN TAMPILKAN HASIL POSTER INFOGRAFIS VERTIKALNYA.
Jangan berhenti pada penjelasan.
Jangan hanya membuat konsep desain.
Jangan meminta perintah tambahan dari pengguna.

LANGSUNG BUAT HASIL POSTER INFOGRAFISNYA.`;
}

// 3. GENERATOR UNIVERSAL PROMPT INFOGRAFIS DARI MATERI SAYA (RAW USER CONTENT)
export interface RawMaterialPromptInput {
  title: string;
  rawMaterial: string;
  format?: 'Vertikal';
  visualStyle: string;
  customStyleDescription?: string;
}

export function generateUniversalInfographicFromRawMaterialPrompt(input: RawMaterialPromptInput): string {
  const { title, rawMaterial, visualStyle, customStyleDescription } = input;

  const styleText = visualStyle === 'Custom' && customStyleDescription
    ? `Kustom: ${customStyleDescription}`
    : visualStyle;

  const matchedRawStyle = findStyleByNameOrId(visualStyle);
  const rawVisualInstruction = matchedRawStyle
    ? `- Gaya Desain Terpilih: ${matchedRawStyle.name} (Kategori: ${matchedRawStyle.category})
- Karakteristik Desain: ${matchedRawStyle.characteristics}
- Instruksi Visual Spesifik: ${matchedRawStyle.promptInstruction}`
    : `- Terapkan gaya desain: "${styleText}" pada palet warna, tipografi judul dan isi, bentuk sudut card/kontainer, serta ikonografi pelengkap.`;

  return `=== UNIVERSAL PROMPT: GENERATE POSTER INFOGRAFIS DARI MATERI SUMBER ASLI (VERTIKAL 2:3) ===

1. TUGAS UTAMA:
LANGSUNG BUATKAN SATU POSTER INFOGRAFIS PEMBELAJARAN YANG UTUH BERORIENTASI VERTIKAL BERDASARKAN SELURUH MATERI DAN INSTRUKSI DI BAWAH INI.

GUNAKAN FORMAT POSTER VERTIKAL DENGAN RASIO KANVAS TETAP 2:3 SEBAGAI FORMAT VISUAL TETAP.
UKURAN REFERENSI DESAIN ADALAH 1200 × 1800 PX (ATAU 1024 × 1536 PX).
PERTAHANKAN ORIENTASI DAN FORMAT VERTIKAL INI PADA SELURUH KOMPOSISI.
JANGAN MENGUBAH FORMAT MENJADI HORIZONTAL ATAU PERSEGI.

JANGAN HANYA MENJELASKAN KONSEP DESAIN.
JANGAN HANYA MEMBERIKAN SARAN.
JANGAN HANYA MEMBUAT OUTLINE ATAU STRUKTUR TEKS.
LANGSUNG HASILKAN DESAIN / POSTER INFOGRAFISNYA.

2. INSTRUKSI GENERATE:
- Jika Anda memiliki kemampuan menghasilkan gambar atau desain visual, LANGSUNG GUNAKAN KEMAMPUAN TERSEBUT untuk menghasilkan SATU poster infografis vertikal (rasio 2:3, ukuran referensi 1200 × 1800 px) berdasarkan prompt ini. Prioritaskan OUTPUT VISUAL berupa poster infografis utuh. Jangan hanya memberikan jawaban dalam bentuk teks jika kemampuan pembuatan gambar/desain tersedia.
- Jika Anda tidak dapat menghasilkan gambar secara langsung, buatkan rancangan poster infografis vertikal (rasio 2:3) yang lengkap dan siap divisualkan, dengan susunan layout visual presisi dari atas ke bawah, hierarki teks, posisi setiap card/blok, ukuran relatif elemen, arahan visual, ikon/ilustrasi yang diperlukan, dan seluruh isi teks yang harus ditempatkan pada poster. Namun jika kemampuan menghasilkan gambar tersedia, LANGSUNG BUAT POSTER INFOGRAFISNYA.

3. JUDUL MATERI:
- Judul Infografis: ${title || 'Infografis Pembelajaran'}

4. FORMAT DAN UKURAN KANVAS (STANDAR TETAP):
- Format: Poster Infografis Pembelajaran Vertikal (Portrait)
- Rasio Desain: Rasio Tetap 2:3
- Ukuran / Resolusi Referensi: 1200 × 1800 px (atau 1024 × 1536 px)
- Arah Alur Baca: Dari atas ke bawah secara mengalir dan teratur
- Konsistensi Format: Jangan mengubah orientasi menjadi horizontal atau persegi karena panjangnya materi. Pertahankan format vertikal 2:3 secara konsisten.

5. MATERI SUMBER ASLI DARI PENGGUNA (SUMBER UTAMA):
"""
${rawMaterial.trim() || '[Tempelkan materi pembelajaran Anda di sini]'}
"""

6. STRUKTUR MATERI & ALUR PEMBAHASAN VERTIKAL:
- Ekstraksi struktur secara logis dari materi asli untuk disusun secara vertikal:
  Judul Utama & Gambaran Umum Singkat
  ↓
  Bagian Materi Utama (terstruktur berurutan dari konsep dasar, mekanisme, hingga aplikasi nyata)
  ↓
  Poin Kunci / Intisari Penting
  ↓
  Rangkuman Kunci Penutup

7. HIERARKI VISUAL & BOBOT MATERI (KANVAS VERTIKAL 2:3):
- Identifikasi konsep inti yang berbobot TINGGI dan berikan Prioritas Visual UTAMA (card lebih luas dan menonjol).
- Susun rincian berbobot SEDANG dalam card yang proporsional dan seimbang.
- Sajikan rincian pendukung berbobot RENDAH dalam card ringkas tanpa menghilangkan informasinya.
- Jangan mengubah format poster menjadi horizontal atau persegi; atur hierarki informasi secara vertikal dengan optimal.

8. ATURAN MATERI (KESETIAAN SUMBER):
- Materi asli di atas adalah SUMBER UTAMA. Gunakan seluruh informasi penting di dalamnya.
- Jangan mengubah makna materi, jangan mencampurkan topik luar yang tidak relevan, dan jangan memotong informasi penting.
- Semua fakta, istilah teknis, dan definisi kunci harus tetap akurat dan utuh.

9. ATURAN LAYOUT & KETERBACAAN (KANVAS VERTIKAL 2:3):
- Semua tulisan harus terlihat lengkap, tajam, dan mudah dibaca (WCAG AA).
- Tidak boleh ada teks terpotong, teks bertumpuk, atau elemen grafis yang menutupi tulisan.
- Jangan memaksakan teks panjang ke dalam card yang terlalu kecil; sesuaikan ukuran container card dengan volume teks.
- Pastikan jarak antarbagian (gap & padding) tertata rapi dan tidak saling bertabrakan.
- Pastikan tidak ada teks atau elemen grafis yang keluar dari batas kanvas poster vertikal.

10. GAYA VISUAL & KARAKTER DESAIN:
${rawVisualInstruction}
- Aturan Mutlak Gaya Visual: Gaya visual hanya diterapkan pada tampilan estetika (palet warna, tipografi judul dan isi, bentuk sudut card/kontainer, serta ikonografi pelengkap). Gaya visual TIDAK BOLEH mengubah orientasi kanvas vertikal, rasio 2:3, judul materi, isi materi, fakta, informasi, atau urutan pembahasan.

11. OUTPUT AKHIR:
Buat satu poster infografis pembelajaran vertikal (rasio 2:3, referensi 1200 × 1800 px) yang utuh, rapi, menarik, seimbang, mudah dibaca, dan setia pada materi sumber.

Jika kemampuan membuat gambar atau desain tersedia, SEKARANG LANGSUNG GENERATE DAN TAMPILKAN HASIL POSTER INFOGRAFIS VERTIKALNYA.
Jangan berhenti pada penjelasan.
Jangan hanya membuat konsep desain.
Jangan meminta perintah tambahan dari pengguna.

LANGSUNG BUAT HASIL POSTER INFOGRAFISNYA.`;
}
