// ============================================================================
// STIVIA GAMMA PRESENTATION ENGINE (STUDIO KONTEN — PRESENTASI 10 SLIDE)
// Generator Prompt Presentasi Pembelajaran Terstruktur & Terkunci untuk Gamma AI
// Aturan Mutlak: TEPAT 10 SLIDE (SLIDE 1 s/d SLIDE 10 ONLY - NO SLIDE 11)
// ============================================================================

export type PresentationVisualStyle = 
  | 'Modern Edukatif' 
  | 'Minimalis Profesional' 
  | 'Visual Interaktif' 
  | 'Akademik' 
  | 'Cerah dan Ramah Siswa';

export interface SlideDesign {
  slideNumber: number; // 1 to 10
  type: string;
  title: string;
  subtitle: string;
  keyPoints: string[];
  layoutGuidance: string;
  visualGuidance: string;
  contextualExample?: string;
}

export interface PresentationBlueprint {
  subject: string;
  educationLevel: string;
  grade: string;
  materi: string;
  bab: string;
  pertemuan: string;
  learningObjectives: string[];
  rawMaterial: string;
  userNotes?: string;
  visualStyle: PresentationVisualStyle;
}

export interface GeneratedPresentationResult {
  id: string;
  title: string;
  subject: string;
  educationLevel: string;
  grade: string;
  materi: string;
  bab: string;
  pertemuan: string;
  timeEstimate: string;
  slides: SlideDesign[]; // TEPAT 10 SLIDE
  gammaPrompt: string;
  createdAt: string;
}

export const PRESENTATION_VISUAL_STYLES: { id: PresentationVisualStyle; label: string; desc: string; icon: string }[] = [
  { 
    id: 'Modern Edukatif', 
    label: 'Modern Edukatif', 
    desc: 'Warna harmonis cerdas, visual infografis bersih, ikon modern terarah', 
    icon: '✨' 
  },
  { 
    id: 'Minimalis Profesional', 
    label: 'Minimalis Profesional', 
    desc: 'Ruang kosong lapang, tipografi tegas, fokus kuat pada esensi materi', 
    icon: '📐' 
  },
  { 
    id: 'Visual Interaktif', 
    label: 'Visual Interaktif', 
    desc: 'Bagan modular, diagram dinamis, alur konsep grafis yang memikat', 
    icon: '🎨' 
  },
  { 
    id: 'Akademik', 
    label: 'Akademik Terstruktur', 
    desc: 'Format formal ilmiah, hierarki data rapi, tata letak analitis', 
    icon: '🎓' 
  },
  { 
    id: 'Cerah dan Ramah Siswa', 
    label: 'Cerah & Ramah Siswa', 
    desc: 'Palet warna ramah menyenangkan, ilustrasi edukatif, bahasa bersahabat', 
    icon: '🌟' 
  }
];

/**
 * Memecah dan memadatkan materi masukan pengguna ke dalam segmen-segmen inti
 * Menerapkan prinsip: CONDENSE -> PRIORITIZE -> SUMMARIZE -> FIT INTO EXISTING 10 SLIDES
 * Materi tidak boleh menambah jumlah slide berapapun panjangnya.
 */
function extractMaterialKeyPoints(rawText: string, maxPoints: number = 12): string[] {
  if (!rawText || rawText.trim().length === 0) {
    return [
      'Konsep esensial yang menjadi landasan utama materi.',
      'Karakteristik penting dan terminologi kunci yang wajib dipahami.',
      'Hubungan relasional antara komponen dalam topik pembelajaran.'
    ];
  }

  // Bersihkan teks dari baris kosong berlebih dan format markdown
  const cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/^#+\s+/gm, '') // Hapus markdown headings
    .trim();

  // Pecah per baris atau per kalimat
  const rawSegments = cleaned
    .split(/\n+|\.\s+(?=[A-Z0-9])|\;\s+/)
    .map(l => l.replace(/^[-*•\d\.\)]+\s*/, '').trim())
    .filter(l => {
      if (l.length < 8) return false;
      const lower = l.toLowerCase();
      if (lower.startsWith('tujuan pembelajaran') || lower.startsWith('capaian pembelajaran')) return false;
      if (lower.startsWith('bab ') && l.length < 30) return false;
      return true;
    });

  if (rawSegments.length === 0) {
    return [cleaned.slice(0, 140)];
  }

  // Kondensasi poin materi agar ringkas, padat, dan ramah visual slide (maks 150 karakter per butir)
  const condensedSegments = rawSegments.map(seg => {
    if (seg.length > 150) {
      return seg.slice(0, 147).trim() + '...';
    }
    return seg;
  });

  return condensedSegments.slice(0, maxPoints);
}

/**
 * Menyusun Struktur Presentasi Tepat 10 Slide Secara Adaptif
 * Mengikuti arsitektur pedagogik: Cover -> TP -> Apersepsi -> Konsep 1, 2, 3 -> Penerapan -> Aktivitas -> Rangkuman -> Refleksi
 */
export function generateAdaptive10SlideStructure(blueprint: PresentationBlueprint): SlideDesign[] {
  const { subject, educationLevel, grade, materi, bab, pertemuan, learningObjectives, rawMaterial, userNotes } = blueprint;
  const s = (subject || '').toLowerCase();
  
  // Bahan materi yang diekstrak
  const allPoints = extractMaterialKeyPoints(rawMaterial, 12);
  const part1 = allPoints.slice(0, 3);
  const part2 = allPoints.slice(3, 6);
  const part3 = allPoints.slice(6, 9);
  const part4 = allPoints.slice(9, 12);

  // Tujuan pembelajaran tervalidasi
  const objList = learningObjectives && learningObjectives.length > 0
    ? learningObjectives
    : [
        `Memahami konsep dasar dan karakteristik utama dari materi ${materi}.`,
        `Menganalisis keterkaitan antar-komponen ${materi} dalam konteks nyata.`,
        `Menerapkan pemahaman untuk menyelesaikan persoalan kontekstual secara kritis.`
      ];

  // 1. SLIDE 1 — COVER
  const slide1: SlideDesign = {
    slideNumber: 1,
    type: 'COVER',
    title: materi.toUpperCase(),
    subtitle: `${subject} | ${educationLevel} ${grade}${bab ? ` • Bab: ${bab}` : ''}${pertemuan ? ` • ${pertemuan}` : ''}`,
    keyPoints: [
      `Mata Pelajaran: ${subject}`,
      `Jenjang & Kelas: ${educationLevel} ${grade}`,
      `Fokus Pembelajaran: Penguasaan Konseptual & Penerapan Kontekstual`,
      pertemuan ? `Sesi: ${pertemuan}` : 'Media Belajar Mandiri & Kelas'
    ],
    layoutGuidance: 'Cover layout dengan judul display besar yang menonjol, badge identitas kelas di sudut atas, dan background bernuansa akademis elegan.',
    visualGuidance: `Visual ilustrasi hero atau ikon grafis representatif tema "${materi}" yang modern dan menarik minat siswa.`
  };

  // 2. SLIDE 2 — TUJUAN PEMBELAJARAN
  const slide2: SlideDesign = {
    slideNumber: 2,
    type: 'TUJUAN PEMBELAJARAN',
    title: 'Apa yang Akan Kita Capai Hari Ini?',
    subtitle: 'Target Capaian & Kompetensi Pembelajaran',
    keyPoints: objList.slice(0, 3).map((obj, i) => `Target ${i + 1}: ${obj.replace(/^[-*•\d\.\)]+\s*/, '')}`),
    layoutGuidance: 'Tata letak 3 kartu/kolom horizontal berjajar dengan penomoran jelas (01, 02, 03) dan checklist indikator keberhasilan.',
    visualGuidance: 'Ikon target/panah pencapaian dengan aksen warna cerah yang menegaskan arah kompetensi belajar.'
  };

  // 3. SLIDE 3 — APERSEPSI / PERTANYAAN PEMANTIK
  let apersepsiTitle = 'Mengapa Topik Ini Penting Bagi Kita?';
  let apersepsiPoints: string[] = [];

  if (s.includes('matematika')) {
    apersepsiTitle = 'Pernahkah Kamu Berpikir Bagaimana Sistem Menghitung Rute Tercepat?';
    apersepsiPoints = [
      `Bayangkan ketika kamu membuka aplikasi peta digital atau merencanakan jadwal harian.`,
      `Bagaimana data saling dihubungkan secara matematis agar memberikan hasil paling efisien?`,
      `Konsep "${materi}" adalah kunci di balik pemodelan masalah nyata di sekitar kita.`
    ];
  } else if (s.includes('ipa') || s.includes('fisika') || s.includes('biologi') || s.includes('kimia')) {
    apersepsiTitle = 'Amati Fenomena di Sekitar Kita';
    apersepsiPoints = [
      `Perhatikan peristiwa nyata yang terjadi di alam dan lingkungan terdekatmu.`,
      `Apa faktor tersembunyi yang menyebabkan perubahan tersebut dapat berlangsung teratur?`,
      `Mari kita selidiki mekanisme ilmiah di balik peristiwa "${materi}".`
    ];
  } else if (s.includes('bahasa') || s.includes('indonesia') || s.includes('inggris')) {
    apersepsiTitle = 'Bagaimana Sebuah Pesan Dapat Mengubah Pikiran Orang Lain?';
    apersepsiPoints = [
      `Setiap hari kita membaca puluhan iklan, berita, dan wacana media sosial.`,
      `Mengapa ada teks yang begitu persuasif dan langsung memengaruhi keputusan pembaca?`,
      `Mari membedah kekuatan bahasa dan struktur dalam "${materi}".`
    ];
  } else if (s.includes('informatika')) {
    apersepsiTitle = 'Apa yang Terjadi di Balik Layar Smartphone Kamu?';
    apersepsiPoints = [
      `Jutaan data pengguna terhubung secara bersamaan tanpa mengalami tabrakan data.`,
      `Struktur logika apa yang mengatur jutaan relasi informasi tersebut dalam hitungan milidetik?`,
      `Hari ini kita mempelajari arsitektur cerdas "${materi}".`
    ];
  } else {
    apersepsiPoints = [
      `Hubungkan pengalaman belajarmu sebelumnya dengan tantangan baru hari ini.`,
      `Pertanyaan Pemantik: "Bagaimana konsep ${materi} dapat membantu kita menjawab masalah nyata?"`,
      `Simak situasi kontekstual berikut sebelum kita membedah konsep intinya.`
    ];
  }

  const slide3: SlideDesign = {
    slideNumber: 3,
    type: 'APERSEPSI',
    title: apersepsiTitle,
    subtitle: 'Pertanyaan Pemantik & Penghubung Konteks Kehidupan Nyata',
    keyPoints: apersepsiPoints,
    layoutGuidance: 'Layout split: Sisi kiri pertanyaan pemantik tebal berbingkai sorotan, sisi kanan skenario situasi nyata singkat.',
    visualGuidance: 'Ilustrasi adegan kontekstual siswa atau foto situasi dunia nyata yang relevan dengan pertanyaan pemantik.'
  };

  // 4. SLIDE 4 — KONSEP INTI 1 (Definisi & Fondasi Utama)
  const slide4: SlideDesign = {
    slideNumber: 4,
    type: 'KONSEP INTI 1',
    title: `Konsep Dasar & Definisi: ${materi}`,
    subtitle: 'Fondasi Utama dan Prinsip Paling Esensial',
    keyPoints: part1.length > 0 ? part1 : [
      `Pengertian pokok materi ${materi} dalam ruang lingkup ${subject}.`,
      `Istilah-istilah kunci yang mendasari pemahaman menyeluruh.`,
      `Karakteristik khas yang membedakannya dari konsep lain.`
    ],
    layoutGuidance: 'Tata letak card utama berisi definisi tegas, diiringi 2-3 poin penjabaran dengan ikon peluru yang rapi.',
    visualGuidance: 'Diagram blok konseptual atau ilustrasi visual yang menjelaskan hubungan istilah utama secara sederhana.'
  };

  // 5. SLIDE 5 — KONSEP INTI 2 (Karakteristik & Komponen Pembentuk)
  const slide5: SlideDesign = {
    slideNumber: 5,
    type: 'KONSEP INTI 2',
    title: `Komponen & Karakteristik ${materi}`,
    subtitle: 'Unsur Pembentuk, Sifat Khusus, dan Relasi Sistem',
    keyPoints: part2.length > 0 ? part2 : [
      `Unsur-unsur pembentuk dan bagaimana masing-masing bagian bekerja.`,
      `Ciri-ciri khas yang dapat diamati secara langsung pada materi.`,
      `Struktur mekanisme internal yang menjaga keteraturan konsep.`
    ],
    layoutGuidance: 'Grid komparasi 2 atau 3 kolom yang mengelompokkan komponen secara paralel dan mudah dibanding-bedakan.',
    visualGuidance: 'Diagram alur beranotasi atau bagan struktur berpenomoran yang menyoroti setiap komponen penting.'
  };

  // 6. SLIDE 6 — KONSEP INTI 3 (Mekanisme / Prosedur / Klasifikasi)
  const slide6: SlideDesign = {
    slideNumber: 6,
    type: 'KONSEP INTI 3',
    title: `Mekanisme & Cara Kerja ${materi}`,
    subtitle: 'Alur Sistematis, Klasifikasi, dan Tahapan Kerja',
    keyPoints: part3.length > 0 ? part3 : [
      `Langkah demi langkah dalam mengoperasikan atau menganalisis konsep.`,
      `Klasifikasi ragam variasi yang sering ditemui di lapangan.`,
      `Aturan dasar dan kaidah yang harus selalu dipatuhi.`
    ],
    layoutGuidance: 'Layout proses/linimasa horizontal (Langkah 1 -> Langkah 2 -> Langkah 3) yang menunjukkan arah alur logis.',
    visualGuidance: 'Bagan tahapan berpanah dengan ikon fungsional di setiap pemberhentian proses.'
  };

  // 7. SLIDE 7 — CONTOH / ILUSTRASI / PENERAPAN
  const slide7: SlideDesign = {
    slideNumber: 7,
    type: 'CONTOH & PENERAPAN',
    title: `Studi Kasus & Contoh Penerapan Nyata`,
    subtitle: 'Melihat Konsep Bekerja dalam Situasi Nyata di Lapangan',
    keyPoints: part4.length > 0 ? part4 : [
      `Kasus Konkret: Penggunaan ${materi} untuk memecahkan persoalan sehari-hari.`,
      `Analisis Solusi: Mengapa pendekatan ini efektif dan sesuai kaidah.`,
      `Hikmah Praktis: Hal-hal yang perlu dihindari saat mengimplementasikan konsep.`
    ],
    layoutGuidance: 'Side-by-side: Kolom kiri "Situasi Kasus", kolom kanan "Solusi & Analisis Konseptual" dengan callout tips.',
    visualGuidance: 'Ilustrasi studi kasus visual konkret atau foto penerapan nyata di dunia industri/kegiatan masyarakat.'
  };

  // 8. SLIDE 8 — AKTIVITAS / LATIHAN BERPIKIR
  const slide8: SlideDesign = {
    slideNumber: 8,
    type: 'AKTIVITAS BELAJAR',
    title: 'Aktivitas Diskusi & Latihan Berpikir Kritis',
    subtitle: 'Uji Pemahaman Bersama Rekan Belajar',
    keyPoints: [
      `Tantangan 1 (Identifikasi): Tentukan elemen utama pada studi kasus yang disajikan!`,
      `Tantangan 2 (Analisis): Apa akibat jika salah satu prinsip ${materi} diabaikan?`,
      `Instruksi Kerja: Diskusikan dalam kelompok kecil selama 5-7 menit dan rumuskan argumen terbaikmu!`
    ],
    layoutGuidance: 'Kotak tantangan bertema interaktif dengan badge "Zona Aksi Siswa" dan timer/alokasi waktu pengerjaan.',
    visualGuidance: 'Ikon gelembung diskusi kelompok atau simbol pensil eksplorasi dengan border aksen kontras tinggi.'
  };

  // 9. SLIDE 9 — RANGKUMAN
  const slide9: SlideDesign = {
    slideNumber: 9,
    type: 'RANGKUMAN',
    title: `Intisari Pembelajaran: Rangkuman ${materi}`,
    subtitle: 'Poin Esensial yang Wajib Kamu Ingat',
    keyPoints: [
      `1. Fondasi: ${materi} adalah prinsip krusial dalam memahami struktur ${subject}.`,
      `2. Hubungan: Karakteristik dan alurnya saling melengkapi untuk menghasilkan luaran yang optimal.`,
      `3. Aplikasi: Penerapan yang tepat membutuhkan kecermatan dalam menganalisis kondisi awal.`
    ],
    layoutGuidance: 'Layout 3 ringkasan takeaway berbentuk checklist terbingkai emas/hijau rapi dengan kesimpulan akhir.',
    visualGuidance: 'Ikon lampu/ide atau simbol bintang rangkuman dengan tata letak ringkas tanpa teks berlebih.'
  };

  // 10. SLIDE 10 — REFLEKSI DAN PENUTUP
  const slide10: SlideDesign = {
    slideNumber: 10,
    type: 'REFLEKSI & PENUTUP',
    title: 'Refleksi Diri & Penutup Pembelajaran',
    subtitle: 'Menghubungkan Pemahaman Hari Ini dengan Rencana Aksimu',
    keyPoints: [
      `Pertanyaan Refleksi 1: "Konsep baru apa yang paling mengubah cara pandangmu hari ini?"`,
      `Pertanyaan Refleksi 2: "Bagaimana kamu akan menerapkan pemahaman ${materi} ini dalam tugas belajarmu?"`,
      `Pesan Penutup: Teruslah bereksplorasi, berpikir kritis, dan bagikan wawasan barumu kepada sesama!`
    ],
    layoutGuidance: 'Slide penutup elegan dengan 2 kartu refleksi mandiri, kotak pesan inspiratif guru, dan ucapan terima kasih.',
    visualGuidance: 'Visual apresiasi inspiratif dengan lencana bintang refleksi dan tipografi penutup yang hangat bersahabat.'
  };

  // HARDENING: Penguncian mutlak tepat 10 slide (Slide 1 s/d Slide 10 Only)
  const resultSlides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9, slide10];
  return resultSlides.slice(0, 10);
}

/**
 * Menyusun Prompt Gamma AI yang SANGAT KETAT, TEGAS, dan TERSTRUKTUR
 * Memisahkan 3 Lapisan Arsitektur secara tegas:
 * - LAYER 1: PRIMARY CONTENT SOURCE / SINGLE SOURCE OF TRUTH (Materi Asli Pendidik)
 * - LAYER 2: PEDAGOGICAL STRUCTURE (Struktur 10 Slide Buatan STIVIA)
 * - LAYER 3: PRESENTATION DESIGN & VISUALIZATION (Instruksi Tata Letak & Visual Gamma AI)
 */
export function buildStrictGammaPrompt(blueprint: PresentationBlueprint, slides: SlideDesign[]): string {
  const { subject, educationLevel, grade, materi, bab, pertemuan, rawMaterial, visualStyle, userNotes } = blueprint;

  // Pastikan render tepat 10 slide
  const validSlides = slides.slice(0, 10);

  // Render per slide secara eksplisit berpenomoran 1 dari 10 hingga 10 dari 10
  const renderedSlideSections = validSlides.map((s) => {
    return `### SLIDE ${s.slideNumber} OF 10 — [${s.type}]
- Slide Title: "${s.title}"
- Subtitle / Header Context: "${s.subtitle}"
- Core Learning Content (Bullet Points):
${s.keyPoints.map(p => `  • ${p}`).join('\n')}
- Visual & Layout Guidance for Gamma: ${s.layoutGuidance}
- Suggested Visual Asset / Diagram: ${s.visualGuidance}`;
  }).join('\n\n---\n\n');

  return `# PROMPT GENERATOR PRESENTASI PEMBELAJARAN UNTUK GAMMA AI
# ATURAN UTAMA: TEPAT 10 SLIDE (SLIDE 1 S/D SLIDE 10 ONLY - NO SLIDE 11)

---

## 1. ROLE & CORE MISSION
You are an expert educational instructional designer and presentation visualizer.
Your mission is to generate an interactive, engaging, and pedagogically sound classroom presentation based strictly on the educator's material provided below.
The presentation must consist of **EXACTLY 10 SLIDES**.

---

## 2. STRICT SLIDE COUNT (NON-NEGOTIABLE)
IMPORTANT — FOLLOW THIS RULE EXACTLY:
Create **EXACTLY 10 SLIDES**.
The final presentation must contain:
**SLIDE 1 through SLIDE 10 ONLY.**

Do NOT create slide 11 or any additional slide.
Do NOT:
- add extra slides;
- remove slides;
- merge two required slides into one;
- split one required slide into multiple slides;
- create additional introduction slides;
- create an additional table of contents slide;
- create additional explanation slides;
- create additional example slides;
- create additional quiz slides;
- create additional summary slides;
- create additional conclusion slides;
- create additional reference/source slides outside the 10-slide structure.

If the material is extensive, **compress, summarize, prioritize, and organize the information within the existing 10 slides.**
**Never increase the slide count.**

---

## 3. LAYER 1: PRIMARY CONTENT SOURCE / SINGLE SOURCE OF TRUTH
The following learning material provided by the educator is the **SINGLE SOURCE OF TRUTH**.
Gamma AI must use ONLY this information as the factual basis for the presentation.

### EDUCATOR'S PRIMARY MATERIAL:
"""
${rawMaterial.trim()}
"""

### MATERIAL BOUNDARY RULES:
- Do NOT expand the topic beyond the provided material.
- Do NOT introduce new theories, additional topics, or external concepts not mentioned in the source material.
- Do NOT add extensive theoretical debates or invent unrequested subchapters.
- Do NOT invent new curriculum components.
- STIVIA organizes, structures, and refines the presentation flow; Gamma AI visualizes it within the 10 slides.
- If additional explanation is needed to bridge concepts, keep it minimal, direct, and confined strictly within the designated slide.

---

## 4. METADATA & CONTEXT
- **Mata Pelajaran (Subject)**: ${subject}
- **Jenjang & Kelas (Target Grade)**: ${educationLevel} ${grade}
- **Materi Pokok**: ${materi}${bab ? ` (Bab: ${bab})` : ''}
- **Sesi / Alokasi**: ${pertemuan || '1 Sesi Pertemuan Efektif'}
- **Gaya Desain Visual**: ${visualStyle}
${userNotes ? `- **Catatan Khusus Guru**: "${userNotes}"` : ''}

---

## 5. LAYER 2: PEDAGOGICAL STRUCTURE (STIVIA 10-SLIDE BLUEPRINT)
Follow this exact 10-slide instructional sequence. Do not alter the order.

${renderedSlideSections}

---

## 6. LAYER 3: PRESENTATION DESIGN & VISUALIZATION (GAMMA AI INSTRUCTIONS)
Apply the "${visualStyle}" visual philosophy with high student engagement:
- **Visual Hierarchy**: Big prominent slide titles, concise subtitles, structured cards, and uncluttered content sections.
- **Card-Based & Grid Layouts**: Structure points into 2 or 3 clean cards or columns rather than monolithic walls of text.
- **Graphic Assets**: Include relevant educational diagrams, flowchart icons, or thematic illustrations inside each slide.
- **Generous Whitespace**: Maintain at least 25% negative space on every slide for maximum student reading comfort.
- **Color Harmony**: Use a cohesive, professional palette suitable for ${educationLevel} ${grade} learners.
- **Language**: Bahasa Indonesia (clear, communicative, engaging, grammatically correct).

---

## 7. FORBIDDEN ACTIONS FOR GAMMA AI
Under NO circumstances may Gamma AI:
1. Create a slide 11, slide 12, or any subsequent slide.
2. Split a slide because of text length (condense the text instead).
3. Create a separate bibliography, credits, or Q&A slide outside the 10 slides.
4. Introduce outside curriculum topics not present in the educator's source material.
5. Create duplicate title or agenda slides.

---

## 8. FINAL COMPLIANCE VERIFICATION
Before producing the final output, verify:
✓ Total Slide Count = EXACTLY 10.
✓ Slides are strictly numbered from Slide 1 to Slide 10.
✓ Slide 11 DOES NOT exist.
✓ All content is derived from the educator's Single Source of Truth.
✓ Presentation is in natural Bahasa Indonesia tailored for ${educationLevel} ${grade}.

IF ANY SLIDE OVERFLOWS: CONDENSE AND SUMMARIZE IMMEDIATELY. NEVER EXPAND BEYOND 10 SLIDES.`;
}
