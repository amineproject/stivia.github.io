import { StyleProfile } from '../types';
import {
  TYPOGRAPHY_MINIMALISM,
  TYPOGRAPHY_MAXIMALISM,
  TYPOGRAPHY_FUTURISTIC,
  TYPOGRAPHY_VECTOR_ART,
  TYPOGRAPHY_COLLAGE_ART,
  TYPOGRAPHY_CYBERPUNK,
  TYPOGRAPHY_POP_ART,
  TYPOGRAPHY_GLASSMORPHISM,
  TYPOGRAPHY_CLAY_STYLE,
  TYPOGRAPHY_PIXEL_STYLE,
  TYPOGRAPHY_EDITORIAL,
  TYPOGRAPHY_Y2K,
  TYPOGRAPHY_SWISS_DESIGN,
  TYPOGRAPHY_SURREALISM,
  TYPOGRAPHY_BOHEMIAN,
  TYPOGRAPHY_VICTORIAN,
  TYPOGRAPHY_GRAFFITI,
  TYPOGRAPHY_AURORA,
  TYPOGRAPHY_HANDWRITTEN,
  TYPOGRAPHY_HAND_DRAWING,
  TYPOGRAPHY_MODERN_EDUKATIF,
} from './typographyProfiles';

export interface StyleCategoryDef {
  id: string;
  code: string;
  name: string;
  description: string;
  characteristics: string[];
  iconName: 'Cpu' | 'Briefcase' | 'Sparkles' | 'Feather' | 'BookOpen';
  accentColor: string;
  bgGradient: string;
  styleIds: string[];
}

/**
 * 5 Kategori Utama Gaya Infografis STIVIA v2.2d
 */
export const STYLE_CATEGORIES_V22D: StyleCategoryDef[] = [
  {
    id: 'modern_digital',
    code: '01',
    name: 'MODERN & DIGITAL',
    description: 'Gaya modern dengan nuansa teknologi, digital, inovasi, dan masa depan.',
    characteristics: ['Modern', 'Digital', 'Dinamis', 'Inovatif', 'Futuristik'],
    iconName: 'Cpu',
    accentColor: 'indigo',
    bgGradient: 'from-blue-600 to-indigo-700',
    styleIds: ['futuristic', 'cyberpunk', 'glassmorphism', 'aurora', 'y2k'],
  },
  {
    id: 'sederhana_profesional',
    code: '02',
    name: 'SEDERHANA & PROFESIONAL',
    description: 'Gaya yang bersih, terstruktur, mudah dibaca, dan berorientasi pada penyampaian informasi.',
    characteristics: ['Bersih', 'Terstruktur', 'Informatif', 'Profesional', 'Efektif'],
    iconName: 'Briefcase',
    accentColor: 'slate',
    bgGradient: 'from-slate-700 to-slate-900',
    styleIds: ['minimalism', 'swiss_design', 'editorial', 'vector_art'],
  },
  {
    id: 'kreatif_ekspresif',
    code: '03',
    name: 'KREATIF & EKSPRESIF',
    description: 'Gaya dengan karakter visual yang kuat, berani, kreatif, dinamis, dan ekspresif.',
    characteristics: ['Berani', 'Kreatif', 'Ekspresif', 'Dinamis', 'Menarik perhatian'],
    iconName: 'Sparkles',
    accentColor: 'rose',
    bgGradient: 'from-rose-500 to-amber-600',
    styleIds: ['maximalism', 'pop_art', 'collage_art', 'graffiti', 'surrealism'],
  },
  {
    id: 'artistik_tematik',
    code: '04',
    name: 'ARTISTIK & TEMATIK',
    description: 'Gaya yang memiliki karakter artistik, personal, kreatif, dan suasana visual yang khas.',
    characteristics: ['Artistik', 'Personal', 'Tematik', 'Kreatif', 'Ekspresif'],
    iconName: 'Feather',
    accentColor: 'amber',
    bgGradient: 'from-amber-600 to-yellow-800',
    styleIds: ['victorian', 'bohemian', 'handwritten', 'hand_drawing'],
  },
  {
    id: 'ilustratif_edukatif',
    code: '05',
    name: 'ILUSTRATIF & EDUKATIF',
    description: 'Gaya yang mengutamakan ilustrasi dan visualisasi untuk membantu penyampaian materi pembelajaran.',
    characteristics: ['Visual', 'Ilustratif', 'Edukatif', 'Menarik', 'Mudah dipahami'],
    iconName: 'BookOpen',
    accentColor: 'emerald',
    bgGradient: 'from-emerald-600 to-teal-700',
    styleIds: ['clay_style', 'pixel_style'],
  },
];

/**
 * 20 Centralized Style Profiles STIVIA v2.2d
 */
export const STYLE_PROFILES_V22D: Record<string, StyleProfile> = {
  // =========================================================================
  // KATEGORI 01: MODERN & DIGITAL
  // =========================================================================

  futuristic: {
    id: 'futuristic',
    name: 'Futuristic',
    category: 'MODERN & DIGITAL',
    categoryId: 'modern_digital',
    description: 'Tampilan modern dan futuristik yang cocok untuk materi teknologi, inovasi, dan sains.',
    visualCharacteristics: [
      'Garis aksen geometris presisi bercahaya neon halus',
      'Panel informasi semi-transparan berlatar teknologi tinggi',
      'Sudut tepi chamfered/cybernetic berbobot modern',
      'Palet biru cyan, kobalt, dan ungu kosmis',
    ],
    titleFont: 'Orbitron',
    subtitleFont: 'Exo 2',
    bodyFont: 'Exo 2',
    typographyProfile: TYPOGRAPHY_FUTURISTIC,
    colorProfile: {
      primary: '#2563eb',
      secondary: '#06b6d4',
      accent: '#8b5cf6',
      background: '#f8faff',
      surface: '#ffffff',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      paletteTag: 'Cyber Tech Blue',
      swatches: ['#1e40af', '#2563eb', '#06b6d4', '#0284c7'],
    },
    layoutProfile: {
      archetype: 'Hero Visual & Cyber HUD',
      defaultLayout: 'hero',
      columnStructure: 'Grid asimetris 2 kolom dengan kartu sorotan metrik',
      density: 'balanced',
      recommendedFor: ['Informatika & Robotika', 'Fisika Kuantum & Astronomi', 'Inovasi Teknologi'],
    },
    compositionProfile: {
      whitespace: 'balanced',
      alignment: 'left',
      visualEmphasis: 'visual_first',
      gridGap: 'gap-5',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-bold tracking-wider uppercase',
      subtitleScale: 'text-sm sm:text-base font-semibold text-cyan-700',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-slate-700',
      badgeStyle: 'bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-lg px-2 py-0.5 font-mono text-2xs',
      contrastRatio: 'Tinggi (WCAG AAA)',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-2xl',
      innerBorderRadius: 'rounded-xl',
      borderTreatment: 'border border-blue-200/90 hover:border-blue-400 transition-all',
      shadowStyle: 'shadow-sm hover:shadow-md hover:shadow-blue-500/10',
      depthLevel: 'Z-1 (Floating Card dengan aksen garis neon)',
    },
    iconProfile: {
      style: 'geometric',
      containerShape: 'rounded-xl bg-blue-50 text-blue-600 border border-blue-200',
      character: 'Modern cybernetic dengan kontur sudut tajam',
    },
    illustrationProfile: {
      style: 'Digital Vektor Holistik',
      treatment: 'Glow aksen dan diagram sirkuit terstruktur',
      character: 'Sains dan teknologi canggih',
    },
    ornamentProfile: {
      level: 'moderate',
      motifs: ['Garis aksen grid', 'Label status HUD', 'Indikator dot matriks'],
      description: 'Aksen garis pandu data dan node penunjuk relasi',
    },
    backgroundProfile: {
      treatment: 'Latar terang dengan kisi-kisi titik digital mikro',
      texturePattern: 'dots',
      description: 'Latar belakang bersih dengan titik koordinat halus 16px',
    },
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    category: 'MODERN & DIGITAL',
    categoryId: 'modern_digital',
    description: 'Estetika futuristik berani dengan nuansa neon, glitch digital, dan atmosfer perkotaan teknologi tinggi.',
    visualCharacteristics: [
      'Kontras ultra-tajam dengan aksen neon kuning elektrik dan pink fuchsia',
      'Stempel peringatan industri dan kode digital modular',
      'Tipografi teknikal berenergi tinggi',
      'Panel data bertingkat ala antarmuka konsol canggih',
    ],
    titleFont: 'Orbitron',
    subtitleFont: 'Rajdhani',
    bodyFont: 'Rajdhani',
    typographyProfile: TYPOGRAPHY_CYBERPUNK,
    colorProfile: {
      primary: '#0ea5e9',
      secondary: '#e11d48',
      accent: '#eab308',
      background: '#0f172a',
      surface: '#1e293b',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      paletteTag: 'Neon Night Circuit',
      swatches: ['#0ea5e9', '#e11d48', '#eab308', '#10b981'],
    },
    layoutProfile: {
      archetype: 'Cyber HUD & Terminal Console',
      defaultLayout: 'hero',
      columnStructure: 'Bento modular terfragmentasi dengan header status',
      density: 'compact',
      recommendedFor: ['Keamanan Siber', 'Jaringan Komputer', 'Koding & Algoritma'],
    },
    compositionProfile: {
      whitespace: 'compact',
      alignment: 'left',
      visualEmphasis: 'visual_first',
      gridGap: 'gap-4',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-black tracking-widest uppercase text-cyan-400',
      subtitleScale: 'text-sm sm:text-base font-bold text-amber-400 tracking-wide',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-slate-200',
      badgeStyle: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 rounded px-2 py-0.5 font-mono text-2xs uppercase tracking-wider',
      contrastRatio: 'Kontras Ekstrem Gelap-Terang',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-xl',
      innerBorderRadius: 'rounded-lg',
      borderTreatment: 'border border-cyan-500/40 bg-slate-900/80 shadow-inner',
      shadowStyle: 'shadow-lg shadow-cyan-500/10',
      depthLevel: 'Z-2 (Dark Mode Terminal dengan border neon tipis)',
    },
    iconProfile: {
      style: 'pixel',
      containerShape: 'rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/50',
      character: 'Teknologikal, HUD indikator, dan sinyal digital',
    },
    illustrationProfile: {
      style: 'Cybernetic Wireframe',
      treatment: 'Garis kawat isometrik dengan sorotan warna neon',
      character: 'Teknologi masa depan yang misterius dan kuat',
    },
    ornamentProfile: {
      level: 'expressive',
      motifs: ['Pita barcode industri', 'Garis target silang (crosshair)', 'Kode terminal'],
      description: 'Aksen garis peringatan dan sudut pemotong diagonal',
    },
    backgroundProfile: {
      treatment: 'Latar gelap pekat slate-900 dengan garis sirkuit halus',
      texturePattern: 'grid',
      description: 'Grid koordinat digital dengan opasitas 10%',
    },
  },

  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    category: 'MODERN & DIGITAL',
    categoryId: 'modern_digital',
    description: 'Desain modern elegan dengan kartu transparan bertekstur kaca halus dan pencahayaan lembut.',
    visualCharacteristics: [
      'Kartu panel kaca semi-transparan bertekstur frosted blur',
      'Garis tepi tipis memantulkan cahaya putih lembut',
      'Latar belakang gradasi pastel aurora di balik kartu',
      'Kesan kedalaman visual berlapis yang bersih',
    ],
    titleFont: 'Outfit',
    subtitleFont: 'Outfit',
    bodyFont: 'Inter',
    typographyProfile: TYPOGRAPHY_GLASSMORPHISM,
    colorProfile: {
      primary: '#4f46e5',
      secondary: '#0284c7',
      accent: '#ec4899',
      background: '#f1f5f9',
      surface: 'rgba(255, 255, 255, 0.75)',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      paletteTag: 'Frosted Crystal Elegance',
      swatches: ['#4f46e5', '#38bdf8', '#a855f7', '#f43f5e'],
    },
    layoutProfile: {
      archetype: 'Floating Glass Cards',
      defaultLayout: 'central',
      columnStructure: 'Tata letak kartu berjarak lega dengan bayangan melayang lembut',
      density: 'spacious',
      recommendedFor: ['Teori Multi-Lapisan', 'Struktur Sel & Ekosistem', 'Komunikasi Digital'],
    },
    compositionProfile: {
      whitespace: 'generous',
      alignment: 'balanced',
      visualEmphasis: 'balanced',
      gridGap: 'gap-6',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-bold tracking-tight text-slate-900',
      subtitleScale: 'text-sm sm:text-base font-semibold text-indigo-700',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-slate-600',
      badgeStyle: 'bg-white/80 backdrop-blur-md text-indigo-700 border border-indigo-200/60 rounded-full px-2.5 py-0.5 text-2xs font-semibold shadow-xs',
      contrastRatio: 'Tinggi dan Jernih',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-3xl',
      innerBorderRadius: 'rounded-2xl',
      borderTreatment: 'border border-white/80 bg-white/70 backdrop-blur-md',
      shadowStyle: 'shadow-xl shadow-indigo-500/5',
      depthLevel: 'Z-3 (Kaca Transparan Terapung)',
    },
    iconProfile: {
      style: 'tinted',
      containerShape: 'rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 text-indigo-600 border border-white/90',
      character: 'Ikon bertekstur kristal halus dengan pantulan warna lembut',
    },
    illustrationProfile: {
      style: 'Gradien Translusen Halus',
      treatment: 'Objek semi-transparan bertumpuk dengan bayangan terdispersi',
      character: 'Modern, tenang, dan berkelas tinggi',
    },
    ornamentProfile: {
      level: 'minimal',
      motifs: ['Lingkaran blur gradasi latar', 'Garis batas spektrum cahaya'],
      description: 'Lingkaran cahaya warna-warni lembut di balik modul kaca',
    },
    backgroundProfile: {
      treatment: 'Gradasi lembut dari langit biru ke ungu pastel',
      texturePattern: 'clean',
      description: 'Latar gradien lembut bebas noise yang menonjolkan efek frosted blur',
    },
  },

  aurora: {
    id: 'aurora',
    name: 'Aurora',
    category: 'MODERN & DIGITAL',
    categoryId: 'modern_digital',
    description: 'Pendaran cahaya gradasi spektakuler dari hijau toska, ungu lembayung, dan biru langit yang tenang.',
    visualCharacteristics: [
      'Pendaran warna gradasi aurora lembut yang menyatu harmonis',
      'Tipografi modern yang bersih dan bernafas lega',
      'Kartu materi dengan tepi aksen gradasi yang memikat',
      'Suasana damai, futuristik, dan menenangkan konsentrasi',
    ],
    titleFont: 'Sora',
    subtitleFont: 'Sora',
    bodyFont: 'Manrope',
    typographyProfile: TYPOGRAPHY_AURORA,
    colorProfile: {
      primary: '#0d9488',
      secondary: '#6366f1',
      accent: '#ec4899',
      background: '#f8fafc',
      surface: '#ffffff',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      paletteTag: 'Northern Light Spectrum',
      swatches: ['#14b8a6', '#06b6d4', '#6366f1', '#a855f7'],
    },
    layoutProfile: {
      archetype: 'Flowing Horizon Layout',
      defaultLayout: 'central',
      columnStructure: 'Blok modular dengan transisi kurva gradien',
      density: 'balanced',
      recommendedFor: ['Geografi & Atmosfer', 'Biologi Molekuler', 'Psikologi & Seni Rupa'],
    },
    compositionProfile: {
      whitespace: 'generous',
      alignment: 'balanced',
      visualEmphasis: 'balanced',
      gridGap: 'gap-5',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-bold tracking-tight text-slate-900',
      subtitleScale: 'text-sm sm:text-base font-semibold text-teal-700',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-slate-600',
      badgeStyle: 'bg-teal-50 text-teal-800 border border-teal-200 rounded-full px-3 py-0.5 text-2xs font-semibold',
      contrastRatio: 'Tinggi & Ramah Mata',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-2xl',
      innerBorderRadius: 'rounded-xl',
      borderTreatment: 'border border-teal-100 bg-white shadow-sm hover:border-teal-300',
      shadowStyle: 'shadow-md shadow-teal-500/5',
      depthLevel: 'Z-1 (Soft Glowing Border)',
    },
    iconProfile: {
      style: 'rounded-box',
      containerShape: 'rounded-xl bg-teal-50 text-teal-600 border border-teal-200',
      character: 'Lembut, bercahaya, dan bergaris kontur jelas',
    },
    illustrationProfile: {
      style: 'Cahaya Gelombang Aurora',
      treatment: 'Aliran gelombang kurva organik gradasi multi-nada',
      character: 'Menyejukkan, estetik, dan berwawasan luas',
    },
    ornamentProfile: {
      level: 'moderate',
      motifs: ['Kurva gelombang halus', 'Bintang partikel kecil', 'Garis cakrawala'],
      description: 'Pendaran cahaya pada sudut tajuk infografis',
    },
    backgroundProfile: {
      treatment: 'Latar putih bersih dengan semburat gradasi teal dan indigo di bagian atas',
      texturePattern: 'waves',
      description: 'Gelombang halus bercahaya pada kanvas materi',
    },
  },

  y2k: {
    id: 'y2k',
    name: 'Y2K',
    category: 'MODERN & DIGITAL',
    categoryId: 'modern_digital',
    description: 'Estetika pergantian milenium era tahun 2000-an dengan elemen retro digital, kawat chrome, dan keceriaan tekno.',
    visualCharacteristics: [
      'Bintang 4 titik (sparkles) kromatik khas era milenium',
      'Bentuk kapsul pil dan sudut melengkung tebal',
      'Warna ceria perak krom, biru langit, dan oranye menyala',
      'Tipografi space-age yang berkarakter retro-futuristik',
    ],
    titleFont: 'Space Grotesk',
    subtitleFont: 'Space Grotesk',
    bodyFont: 'DM Sans',
    typographyProfile: TYPOGRAPHY_Y2K,
    colorProfile: {
      primary: '#3b82f6',
      secondary: '#f97316',
      accent: '#8b5cf6',
      background: '#f8faff',
      surface: '#ffffff',
      textPrimary: '#1e293b',
      textSecondary: '#64748b',
      paletteTag: 'Millennium Cyber Pop',
      swatches: ['#3b82f6', '#f97316', '#a855f7', '#06b6d4'],
    },
    layoutProfile: {
      archetype: 'Retro Cyber Bento',
      defaultLayout: 'grid',
      columnStructure: 'Grid modular dengan stiker aksen bintang 4 sudut',
      density: 'compact',
      recommendedFor: ['Inovasi Internet', 'Sejarah Komunikasi Digital', 'Media Populer'],
    },
    compositionProfile: {
      whitespace: 'compact',
      alignment: 'left',
      visualEmphasis: 'visual_first',
      gridGap: 'gap-4',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-blue-700',
      subtitleScale: 'text-sm sm:text-base font-bold text-orange-600',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-slate-700',
      badgeStyle: 'bg-orange-100 text-orange-800 border border-orange-300 rounded-full px-2.5 py-0.5 text-2xs font-bold uppercase',
      contrastRatio: 'Tinggi dan Kontras Ceria',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-2xl',
      innerBorderRadius: 'rounded-xl',
      borderTreatment: 'border-2 border-blue-200 bg-white shadow-sm',
      shadowStyle: 'shadow-md shadow-blue-500/10',
      depthLevel: 'Z-2 (Border 2px Solid dengan Sudut Bulat Tegas)',
    },
    iconProfile: {
      style: 'rounded-box',
      containerShape: 'rounded-full bg-blue-100 text-blue-700 border-2 border-blue-300',
      character: 'Retro techno dengan bentuk kapsul dan lencana lingkaran',
    },
    illustrationProfile: {
      style: 'Chrome & Cyber 3D 2000s',
      treatment: 'Bentuk geometris gelembung perak dan kurva orbit luar angkasa',
      character: 'Optimisme masa depan awal abad 21',
    },
    ornamentProfile: {
      level: 'expressive',
      motifs: ['Bintang 4 titik (Y2K star)', 'Simbol planet dan cincin orbit', 'Stiker kapsul'],
      description: 'Ikon bintang bersinar dan pita kurva berputar',
    },
    backgroundProfile: {
      treatment: 'Latar biru pucat dengan aksen lingkaran konsentris',
      texturePattern: 'dots',
      description: 'Grid titik retro halus dengan latar bersih',
    },
  },

  // =========================================================================
  // KATEGORI 02: SEDERHANA & PROFESIONAL
  // =========================================================================

  minimalism: {
    id: 'minimalism',
    name: 'Minimalism',
    category: 'SEDERHANA & PROFESIONAL',
    categoryId: 'sederhana_profesional',
    description: 'Tampilan bersih, tenang, tanpa elemen dekorasi yang mengganggu, fokus pada esensi materi inti.',
    visualCharacteristics: [
      'Banyak ruang kosong (whitespace) yang lega dan nyaman di mata',
      'Tipografi sans-serif Montserrat + Inter yang sangat teratur',
      'Palet monokromatik abu-abu elegan dengan aksen tunggal',
      'Garis pembatas halus dan presisi',
    ],
    titleFont: 'Montserrat',
    subtitleFont: 'Montserrat',
    bodyFont: 'Inter',
    typographyProfile: TYPOGRAPHY_MINIMALISM,
    colorProfile: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#2563eb',
      background: '#ffffff',
      surface: '#f8fafc',
      textPrimary: '#0f172a',
      textSecondary: '#64748b',
      paletteTag: 'Pure Monochromatic Slate',
      swatches: ['#0f172a', '#334155', '#64748b', '#2563eb'],
    },
    layoutProfile: {
      archetype: 'Modular Clean Grid',
      defaultLayout: 'grid',
      columnStructure: 'Kolom vertikal rapi dengan pembagian seksi tegas',
      density: 'spacious',
      recommendedFor: ['Matematika & Rumus', 'Definisi Konsep Ilmiah', 'Pedoman Resmi & Hukum'],
    },
    compositionProfile: {
      whitespace: 'generous',
      alignment: 'left',
      visualEmphasis: 'text_first',
      gridGap: 'gap-6',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900',
      subtitleScale: 'text-sm sm:text-base font-semibold text-slate-600',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-slate-700',
      badgeStyle: 'bg-slate-100 text-slate-800 border border-slate-200 rounded-md px-2 py-0.5 text-2xs font-semibold',
      contrastRatio: 'Tinggi Maksimal (WCAG AAA)',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-xl',
      innerBorderRadius: 'rounded-lg',
      borderTreatment: 'border border-slate-200/80 bg-white',
      shadowStyle: 'shadow-xs',
      depthLevel: 'Z-0 (Flat Minimalis Bersih)',
    },
    iconProfile: {
      style: 'outline',
      containerShape: 'rounded-lg bg-slate-100 text-slate-700',
      character: 'Garis tipis minimal 1.5px tanpa ornamen',
    },
    illustrationProfile: {
      style: 'Ikonik Monokrom',
      treatment: 'Siluet bersih dan bagan alir sederhana',
      character: 'Jujur, objektif, dan langsung pada substansi',
    },
    ornamentProfile: {
      level: 'none',
      motifs: ['Garis pembatas 1px', 'Titik bullet teratur'],
      description: 'Bebas dari dekorasi grafis yang mengalihkan perhatian',
    },
    backgroundProfile: {
      treatment: 'Putih solid bersih murni',
      texturePattern: 'clean',
      description: 'Latar belakang putih mutlak tanpa pola',
    },
  },

  swiss_design: {
    id: 'swiss_design',
    name: 'Swiss Design',
    category: 'SEDERHANA & PROFESIONAL',
    categoryId: 'sederhana_profesional',
    description: 'Sistem grid matematis yang ketat, tipografi neo-grotesque tegas, dan kejelasan komunikasi mutlak.',
    visualCharacteristics: [
      'Struktur kolom grid asimetris yang sangat rapi dan presisi',
      'Tipografi tebal Inter dengan penataan hierarki objektif',
      'Blok warna aksen primer (merah/hitam/putih) yang mencolok',
      'Penyajian fakta, data angka, dan komparasi yang disiplin',
    ],
    titleFont: 'Inter',
    subtitleFont: 'Inter',
    bodyFont: 'Inter',
    typographyProfile: TYPOGRAPHY_SWISS_DESIGN,
    colorProfile: {
      primary: '#dc2626',
      secondary: '#0f172a',
      accent: '#2563eb',
      background: '#f8fafc',
      surface: '#ffffff',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      paletteTag: 'International Typographic Red',
      swatches: ['#dc2626', '#0f172a', '#64748b', '#ffffff'],
    },
    layoutProfile: {
      archetype: 'Strict Swiss Grid',
      defaultLayout: 'grid',
      columnStructure: 'Grid kolom matematis dengan garis koordinasi horizontal',
      density: 'compact',
      recommendedFor: ['Fisika & Teknik', 'Data Statistik & Perbandingan', 'Studi Klasifikasi'],
    },
    compositionProfile: {
      whitespace: 'compact',
      alignment: 'left',
      visualEmphasis: 'text_first',
      gridGap: 'gap-4',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-4xl font-black tracking-tight uppercase text-slate-950',
      subtitleScale: 'text-sm sm:text-base font-bold text-red-600 tracking-tight',
      bodyScale: 'text-xs sm:text-sm leading-normal text-slate-800',
      badgeStyle: 'bg-red-600 text-white rounded-none px-2 py-0.5 text-2xs font-bold uppercase tracking-wider',
      contrastRatio: 'Kontras Absolut 100%',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-none',
      innerBorderRadius: 'rounded-none',
      borderTreatment: 'border-2 border-slate-900 bg-white',
      shadowStyle: 'shadow-none',
      depthLevel: 'Z-0 (Strict Flat Bauhaus)',
    },
    iconProfile: {
      style: 'geometric',
      containerShape: 'rounded-none bg-slate-950 text-white',
      character: 'Simbol piktogram internasional yang objektif',
    },
    illustrationProfile: {
      style: 'Diagram Matematis',
      treatment: 'Garis lurus, koordinat sumbu, dan tabel komparasi',
      character: 'Rasional, analitis, dan sangat tertib',
    },
    ornamentProfile: {
      level: 'minimal',
      motifs: ['Garis hitam tebal 2px', 'Label nomor indeks besar (01, 02)'],
      description: 'Garis batas fungsional pembagi blok informasi',
    },
    backgroundProfile: {
      treatment: 'Putih netral dengan garis grid horizontal',
      texturePattern: 'lines',
      description: 'Garis tipis modular yang memandu mata pembaca',
    },
  },

  editorial: {
    id: 'editorial',
    name: 'Editorial',
    category: 'SEDERHANA & PROFESIONAL',
    categoryId: 'sederhana_profesional',
    description: 'Format publikasi berwibawa layaknya majalah sains atau jurnal profesional dengan tipografi serif elegan.',
    visualCharacteristics: [
      'Judul berkarakter serif anggun Playfair Display dipadu teks isi Lora',
      'Blok kutipan penting (pull quotes) beraksen garis halus',
      'Kolom informasi tertata rapi layaknya ensiklopedia ilmiah',
      'Suasana intelektual, terpercaya, dan mendalam',
    ],
    titleFont: 'Playfair Display',
    subtitleFont: 'Playfair Display',
    bodyFont: 'Lora',
    typographyProfile: TYPOGRAPHY_EDITORIAL,
    colorProfile: {
      primary: '#1c1917',
      secondary: '#78716c',
      accent: '#0284c7',
      background: '#fafaf9',
      surface: '#ffffff',
      textPrimary: '#1c1917',
      textSecondary: '#57534e',
      paletteTag: 'Warm Paper Editorial',
      swatches: ['#1c1917', '#44403c', '#78716c', '#0284c7'],
    },
    layoutProfile: {
      archetype: 'Scientific Magazine Column',
      defaultLayout: 'editorial',
      columnStructure: 'Struktur artikel ilmiah dengan tajuk sorotan dan kutipan inti',
      density: 'spacious',
      recommendedFor: ['Bahasa & Sastra', 'Biografi Tokoh & Sejarah', 'Kajian Teori Filosofis'],
    },
    compositionProfile: {
      whitespace: 'generous',
      alignment: 'left',
      visualEmphasis: 'text_first',
      gridGap: 'gap-6',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-serif font-bold italic tracking-tight text-stone-900',
      subtitleScale: 'text-sm sm:text-base font-serif font-medium text-stone-600',
      bodyScale: 'text-xs sm:text-sm font-serif leading-relaxed text-stone-700',
      badgeStyle: 'bg-stone-100 text-stone-800 border border-stone-300 rounded-sm px-2 py-0.5 text-2xs font-serif uppercase tracking-widest',
      contrastRatio: 'Tinggi dan Sangat Nyaman Dibaca',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-lg',
      innerBorderRadius: 'rounded-md',
      borderTreatment: 'border border-stone-200/90 bg-white',
      shadowStyle: 'shadow-xs',
      depthLevel: 'Z-0 (Lembaran Kertas Buku)',
    },
    iconProfile: {
      style: 'outline',
      containerShape: 'rounded-md bg-stone-100 text-stone-700',
      character: 'Klasik, elegan, bersahaja',
    },
    illustrationProfile: {
      style: 'Sketsa Litografi Klasik',
      treatment: 'Garis arsir halus bernuansa buku ensiklopedia',
      character: 'Historis, ilmiah, dan berkelas',
    },
    ornamentProfile: {
      level: 'minimal',
      motifs: ['Garis aksen ganda klasik', 'Karakter kutipan besar (pull quotes)'],
      description: 'Garis pemisah elegan dengan aksen ornamen pustaka',
    },
    backgroundProfile: {
      treatment: 'Warna kertas krem lembut bernuansa pustaka',
      texturePattern: 'clean',
      description: 'Latar bernuansa kertas arsip premium yang menenangkan mata',
    },
  },

  vector_art: {
    id: 'vector_art',
    name: 'Vector Art',
    category: 'SEDERHANA & PROFESIONAL',
    categoryId: 'sederhana_profesional',
    description: 'Ilustrasi vektor garis halus berkualitas tinggi, modern, rapi, dan menjelaskan objek materi secara presisi.',
    visualCharacteristics: [
      'Garis tepi objek tajam, bersih, dan proporsional',
      'Visualisasi objek nyata (tumbuhan, organ, mesin) yang akurat',
      'Tipografi Poppins + Nunito Sans yang ramah dan jelas',
      'Perpaduan seimbang antara teks penjelas dan visual tematik',
    ],
    titleFont: 'Poppins',
    subtitleFont: 'Poppins',
    bodyFont: 'Nunito Sans',
    typographyProfile: TYPOGRAPHY_VECTOR_ART,
    colorProfile: {
      primary: '#059669',
      secondary: '#0284c7',
      accent: '#f59e0b',
      background: '#f0fdf4',
      surface: '#ffffff',
      textPrimary: '#064e3b',
      textSecondary: '#065f46',
      paletteTag: 'Emerald Fresh Vector',
      swatches: ['#059669', '#10b981', '#0284c7', '#f59e0b'],
    },
    layoutProfile: {
      archetype: 'Visual Diagram & Flow',
      defaultLayout: 'process',
      columnStructure: 'Alur proses horizontal dengan ikon penjelas bertahap',
      density: 'balanced',
      recommendedFor: ['Biologi (Organ, Sel, Fotosintesis)', 'Siklus Alam & Lingkungan', 'Mekanika Sederhana'],
    },
    compositionProfile: {
      whitespace: 'balanced',
      alignment: 'balanced',
      visualEmphasis: 'balanced',
      gridGap: 'gap-5',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-bold tracking-tight text-emerald-950',
      subtitleScale: 'text-sm sm:text-base font-semibold text-emerald-700',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-slate-700',
      badgeStyle: 'bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full px-3 py-0.5 text-2xs font-semibold',
      contrastRatio: 'Tinggi dan Segar',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-2xl',
      innerBorderRadius: 'rounded-xl',
      borderTreatment: 'border border-emerald-200 bg-white hover:border-emerald-400 transition-colors',
      shadowStyle: 'shadow-sm hover:shadow-md',
      depthLevel: 'Z-1 (Kartu Vektor Terapung Lembut)',
    },
    iconProfile: {
      style: 'rounded-box',
      containerShape: 'rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200',
      character: 'Ilustratif, jelas, dan menggambarkan objek sains nyata',
    },
    illustrationProfile: {
      style: 'Flat 2D Vector Terstandar',
      treatment: 'Kontur tegas dengan warna datar harmonis',
      character: 'Edukatif, representatif, dan mudah dipahami seketika',
    },
    ornamentProfile: {
      level: 'moderate',
      motifs: ['Panah alur vektor', 'Label penunjuk bagian (callouts)', 'Pin sorotan'],
      description: 'Penunjuk garis panah yang menghubungkan istilah ke gambar',
    },
    backgroundProfile: {
      treatment: 'Latar hijau pastel sangat lembut dengan kanvas kartu putih',
      texturePattern: 'clean',
      description: 'Latar bersih yang menjaga kesegaran visual',
    },
  },

  // =========================================================================
  // KATEGORI 03: KREATIF & EKSPRESIF
  // =========================================================================

  maximalism: {
    id: 'maximalism',
    name: 'Maximalism',
    category: 'KREATIF & EKSPRESIF',
    categoryId: 'kreatif_ekspresif',
    description: 'Gaya berani, padat, penuh energi visual, warna kontras tinggi, dan memicu antusiasme belajar peserta didik.',
    visualCharacteristics: [
      'Tipografi tebal bertenaga Archivo Black + Poppins',
      'Tabrakan warna dinamis (kuning, ungu, jingga, hitam)',
      'Komposisi kaya elemen stiker dan kartu sorotan mencolok',
      'Penyampaian poin dengan daya pikat tinggi',
    ],
    titleFont: 'Archivo Black',
    subtitleFont: 'Poppins',
    bodyFont: 'Poppins',
    typographyProfile: TYPOGRAPHY_MAXIMALISM,
    colorProfile: {
      primary: '#7c3aed',
      secondary: '#f59e0b',
      accent: '#ec4899',
      background: '#faf5ff',
      surface: '#ffffff',
      textPrimary: '#1e1b4b',
      textSecondary: '#4c1d95',
      paletteTag: 'Bold Vibrant Chaos',
      swatches: ['#7c3aed', '#f59e0b', '#ec4899', '#06b6d4'],
    },
    layoutProfile: {
      archetype: 'Dynamic Collage Bento',
      defaultLayout: 'hero',
      columnStructure: 'Bento asimetris dengan skala kartu bertingkat kontras',
      density: 'compact',
      recommendedFor: ['Kampanye Kesadaran Sosial', 'Isu Kreatif & Seni', 'Debat & Argumentasi Kritis'],
    },
    compositionProfile: {
      whitespace: 'compact',
      alignment: 'left',
      visualEmphasis: 'visual_first',
      gridGap: 'gap-4',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-black uppercase tracking-tight text-violet-950',
      subtitleScale: 'text-sm sm:text-base font-extrabold text-amber-600',
      bodyScale: 'text-xs sm:text-sm leading-normal text-slate-800 font-medium',
      badgeStyle: 'bg-amber-400 text-slate-950 border-2 border-slate-950 rounded-lg px-2.5 py-0.5 text-2xs font-black uppercase shadow-xs',
      contrastRatio: 'Kontras Maksimal Kuat',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-2xl',
      innerBorderRadius: 'rounded-xl',
      borderTreatment: 'border-2 border-violet-900/40 bg-white shadow-md',
      shadowStyle: 'shadow-lg shadow-violet-500/15',
      depthLevel: 'Z-2 (Bold Pop-out Card)',
    },
    iconProfile: {
      style: 'filled',
      containerShape: 'rounded-xl bg-violet-600 text-white shadow-xs',
      character: 'Berani, padat warna solid, dan berbobot tinggi',
    },
    illustrationProfile: {
      style: 'Grafis Pop Bertumpuk',
      treatment: 'Lapisan bentuk geometris kontras dengan bayangan tajam',
      character: 'Penuh gairah, dinamis, dan ekspresif',
    },
    ornamentProfile: {
      level: 'expressive',
      motifs: ['Pita tajuk sorotan', 'Stiker stempel tebal', 'Pola halfton titik'],
      description: 'Lencana stiker dan panah tebal penarik perhatian',
    },
    backgroundProfile: {
      treatment: 'Latar ungu muda dengan aksen taburan pola dinamis',
      texturePattern: 'dots',
      description: 'Tekstur pola titik ceria yang menghidupkan kanvas',
    },
  },

  pop_art: {
    id: 'pop_art',
    name: 'Pop Art',
    category: 'KREATIF & EKSPRESIF',
    categoryId: 'kreatif_ekspresif',
    description: 'Estetika komik ceria dengan pola halftone ben-day dots, balon dialog, dan warna primer cerah yang disukai siswa.',
    visualCharacteristics: [
      'Judul komik komikal Bangers berpadu teks isi Poppins yang nyaman',
      'Pola bintik halftone (Ben-Day dots) khas buku komik klasik',
      'Garis tepi hitam tebal ala buku cerita bergambar',
      'Warna primer ceria: kuning komik, biru cerah, dan merah cabai',
    ],
    titleFont: 'Bangers',
    subtitleFont: 'Poppins',
    bodyFont: 'Poppins',
    typographyProfile: TYPOGRAPHY_POP_ART,
    colorProfile: {
      primary: '#e11d48',
      secondary: '#facc15',
      accent: '#2563eb',
      background: '#fffbeb',
      surface: '#ffffff',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      paletteTag: 'Classic Comic Book',
      swatches: ['#e11d48', '#facc15', '#2563eb', '#000000'],
    },
    layoutProfile: {
      archetype: 'Pop Art Comic Panels',
      defaultLayout: 'grid',
      columnStructure: 'Panel komik modular berbingkai hitam tegas',
      density: 'compact',
      recommendedFor: ['Materi Menyenangkan SMP', 'Sastra & Cerita Rakyat', 'Pendidikan Karakter & Moral'],
    },
    compositionProfile: {
      whitespace: 'compact',
      alignment: 'left',
      visualEmphasis: 'visual_first',
      gridGap: 'gap-4',
    },
    hierarchyProfile: {
      titleScale: 'text-3xl sm:text-4xl tracking-wider uppercase text-rose-600',
      subtitleScale: 'text-sm sm:text-base font-bold text-blue-700',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-slate-800',
      badgeStyle: 'bg-yellow-300 text-black border-2 border-black rounded-md px-2 py-0.5 text-2xs font-bold uppercase rotate-[-2deg]',
      contrastRatio: 'Kontras Super Tegas',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-xl',
      innerBorderRadius: 'rounded-lg',
      borderTreatment: 'border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      shadowStyle: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      depthLevel: 'Z-2 (Hard Shadow Komik Retro)',
    },
    iconProfile: {
      style: 'filled',
      containerShape: 'rounded-lg bg-yellow-400 text-black border-2 border-black',
      character: 'Komikal, balon kata, dan ekspresif',
    },
    illustrationProfile: {
      style: 'Comic Book Art',
      treatment: 'Batas tinta hitam pekat dengan tekstur bintik raster',
      character: 'Humoris, ceria, dan tidak membosankan',
    },
    ornamentProfile: {
      level: 'expressive',
      motifs: ['Balon kata (speech bubble)', 'Ledakan aksi (action burst)', 'Halftone dots'],
      description: 'Aksen balon dialog dan efek suara komik',
    },
    backgroundProfile: {
      treatment: 'Kuning pastel hangat dengan pola raster titik halus',
      texturePattern: 'dots',
      description: 'Pola Ben-Day dots berjarak teratur khas komik cetak',
    },
  },

  collage_art: {
    id: 'collage_art',
    name: 'Collage Art',
    category: 'KREATIF & EKSPRESIF',
    categoryId: 'kreatif_ekspresif',
    description: 'Kombinasi artistik potongan gambar tematik, tekstur kertas robek, dan tipografi kreatif multi-lapisan.',
    visualCharacteristics: [
      'Efek tepi guntingan kertas dan layer bertumpuk',
      'Tipografi tajam Bebas Neue berpadu DM Sans yang fleksibel',
      'Tekstur kertas daur ulang dan aksen selotip transparan',
      'Kesan organik, humanis, dan eksploratif',
    ],
    titleFont: 'Bebas Neue',
    subtitleFont: 'DM Sans',
    bodyFont: 'DM Sans',
    typographyProfile: TYPOGRAPHY_COLLAGE_ART,
    colorProfile: {
      primary: '#9333ea',
      secondary: '#ea580c',
      accent: '#0d9488',
      background: '#fefce8',
      surface: '#ffffff',
      textPrimary: '#1c1917',
      textSecondary: '#44403c',
      paletteTag: 'Mixed Media Paper Craft',
      swatches: ['#9333ea', '#ea580c', '#0d9488', '#eab308'],
    },
    layoutProfile: {
      archetype: 'Tactile Collage Board',
      defaultLayout: 'central',
      columnStructure: 'Papan kolase terorganisir dengan kartu bertumpuk asimetris',
      density: 'balanced',
      recommendedFor: ['Seni Rupa & Budaya', 'Antropologi & Sosiologi', 'Isu Sejarah & Gerakan Sosial'],
    },
    compositionProfile: {
      whitespace: 'balanced',
      alignment: 'balanced',
      visualEmphasis: 'visual_first',
      gridGap: 'gap-5',
    },
    hierarchyProfile: {
      titleScale: 'text-3xl sm:text-4xl font-black uppercase tracking-wider text-purple-900',
      subtitleScale: 'text-sm sm:text-base font-bold text-orange-600',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-stone-800',
      badgeStyle: 'bg-amber-100 text-amber-900 border border-dashed border-amber-400 rounded px-2.5 py-0.5 text-2xs font-mono',
      contrastRatio: 'Tinggi dan Berkarakter',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-xl',
      innerBorderRadius: 'rounded-lg',
      borderTreatment: 'border border-amber-300/80 bg-white shadow-sm',
      shadowStyle: 'shadow-md shadow-stone-900/5',
      depthLevel: 'Z-2 (Kertas Potongan Bertumpuk)',
    },
    iconProfile: {
      style: 'sketch',
      containerShape: 'rounded-md bg-amber-50 text-purple-700 border border-amber-200',
      character: 'Stempel tinta, potongan foto mini, dan klip kertas',
    },
    illustrationProfile: {
      style: 'Mixed-Media Scrapbook',
      treatment: 'Tekstur kertas, selotip bening, dan garis guntingan',
      character: 'Artistik, bercerita, dan penuh sentuhan manusia',
    },
    ornamentProfile: {
      level: 'expressive',
      motifs: ['Potongan selotip washi', 'Klip kertas logam', 'Cap stempel materi'],
      description: 'Aksen selotip di sudut kartu dan cap tanggal belajar',
    },
    backgroundProfile: {
      treatment: 'Kertas manila berserat halus dengan warna gading hangat',
      texturePattern: 'clean',
      description: 'Latar bertekstur kertas jurnal kreatif',
    },
  },

  graffiti: {
    id: 'graffiti',
    name: 'Graffiti',
    category: 'KREATIF & EKSPRESIF',
    categoryId: 'kreatif_ekspresif',
    description: 'Sentuhan urban street-art dengan aksen spidol marker tebal, percikan cat dinamis, dan karakter yang berjiwa bebas.',
    visualCharacteristics: [
      'Judul ekspresif Permanent Marker dengan isi materi Roboto yang sangat jernih',
      'Aksen percikan cat semprot (spray stencil) yang terkontrol',
      'Garis bawah marker melengkung penegas kata kunci',
      'Suasana muda, energik, dan menolak kebosanan',
    ],
    titleFont: 'Permanent Marker',
    subtitleFont: 'Permanent Marker',
    bodyFont: 'Roboto',
    typographyProfile: TYPOGRAPHY_GRAFFITI,
    colorProfile: {
      primary: '#d97706',
      secondary: '#dc2626',
      accent: '#2563eb',
      background: '#fafaf9',
      surface: '#ffffff',
      textPrimary: '#1c1917',
      textSecondary: '#44403c',
      paletteTag: 'Urban Spray Street',
      swatches: ['#d97706', '#dc2626', '#2563eb', '#1e293b'],
    },
    layoutProfile: {
      archetype: 'Street Wall Board',
      defaultLayout: 'hero',
      columnStructure: 'Blok modular urban dengan garis penegas diagonal',
      density: 'compact',
      recommendedFor: ['Pendidikan Jasmani & Olahraga', 'Musik & Seni Urban', 'Bahasa Gaul & Komunikasi'],
    },
    compositionProfile: {
      whitespace: 'compact',
      alignment: 'left',
      visualEmphasis: 'visual_first',
      gridGap: 'gap-4',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-black uppercase text-amber-700 tracking-wider',
      subtitleScale: 'text-sm sm:text-base font-bold text-red-600',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-slate-800',
      badgeStyle: 'bg-red-600 text-white rounded-md px-2 py-0.5 text-2xs font-bold uppercase rotate-[-1deg]',
      contrastRatio: 'Tinggi dan Berani',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-xl',
      innerBorderRadius: 'rounded-lg',
      borderTreatment: 'border-2 border-stone-800 bg-white',
      shadowStyle: 'shadow-md shadow-stone-800/20',
      depthLevel: 'Z-2 (Dinding Grafiti Modern)',
    },
    iconProfile: {
      style: 'sketch',
      containerShape: 'rounded-lg bg-stone-900 text-amber-400',
      character: 'Stensil urban, kuas spidol tebal, dan simbol jalanan',
    },
    illustrationProfile: {
      style: 'Stencil & Spray Art',
      treatment: 'Bentuk stensil cat semprot dengan kontur tajam',
      character: 'Bebas, berani, dan berjiwa muda',
    },
    ornamentProfile: {
      level: 'expressive',
      motifs: ['Coretan spidol penegas', 'Percikan cat semprot kecil', 'Tanda panah grafiti'],
      description: 'Garis highlight spidol tebal di bawah kata penting',
    },
    backgroundProfile: {
      treatment: 'Tekstur dinding semen terang yang bersih dan artistik',
      texturePattern: 'clean',
      description: 'Latar terang dengan aksen semprotan halus di sudut kanvas',
    },
  },

  surrealism: {
    id: 'surrealism',
    name: 'Surrealism',
    category: 'KREATIF & EKSPRESIF',
    categoryId: 'kreatif_ekspresif',
    description: 'Estetika artistik eksperimental dengan perpaduan metafora visual tak terduga, puitis, dan membangkitkan imajinasi.',
    visualCharacteristics: [
      'Tipografi anggun Cormorant Garamond + Lora yang memikat',
      'Metafora visual puitis yang menyederhanakan gagasan abstrak',
      'Warna safir misterius, emas temaram, dan biru malam',
      'Suasana reflektif, filosofis, dan merangsang pemikiran kritis',
    ],
    titleFont: 'Cormorant Garamond',
    subtitleFont: 'Cormorant Garamond',
    bodyFont: 'Lora',
    typographyProfile: TYPOGRAPHY_SURREALISM,
    colorProfile: {
      primary: '#312e81',
      secondary: '#b45309',
      accent: '#0d9488',
      background: '#f5f3ff',
      surface: '#ffffff',
      textPrimary: '#1e1b4b',
      textSecondary: '#4338ca',
      paletteTag: 'Mystic Dream Sapphire',
      swatches: ['#312e81', '#4338ca', '#b45309', '#0d9488'],
    },
    layoutProfile: {
      archetype: 'Philosophical Reflection Canvas',
      defaultLayout: 'central',
      columnStructure: 'Tata letak terpusat dengan portal visual metafora materi',
      density: 'spacious',
      recommendedFor: ['Filsafat & Logika', 'Karya Sastra Agung', 'Evolusi Gagasan & Sains'],
    },
    compositionProfile: {
      whitespace: 'generous',
      alignment: 'balanced',
      visualEmphasis: 'balanced',
      gridGap: 'gap-6',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-serif font-bold italic tracking-wide text-indigo-950',
      subtitleScale: 'text-sm sm:text-base font-serif font-semibold text-amber-700',
      bodyScale: 'text-xs sm:text-sm font-serif leading-relaxed text-slate-700',
      badgeStyle: 'bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-full px-3 py-0.5 text-2xs font-serif italic',
      contrastRatio: 'Tinggi dan Bernuansa Kontemplatif',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-2xl',
      innerBorderRadius: 'rounded-xl',
      borderTreatment: 'border border-indigo-200 bg-white shadow-sm',
      shadowStyle: 'shadow-lg shadow-indigo-500/5',
      depthLevel: 'Z-2 (Kartu Bernuansa Galeri Seni)',
    },
    iconProfile: {
      style: 'tinted',
      containerShape: 'rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200',
      character: 'Simbolis puitis seperti kunci, jam meleleh, dan jendela dimensi',
    },
    illustrationProfile: {
      style: 'Surealis Metaforis',
      treatment: 'Visualisasi simbolik bermakna ganda yang mudah dicerna siswa',
      character: 'Mendalam, imajinatif, dan membuka wawasan luas',
    },
    ornamentProfile: {
      level: 'moderate',
      motifs: ['Bingkai oval kurva cermin', 'Fase bulan dan rasi bintang', 'Garis cakrawala semu'],
      description: 'Garis aksen melengkung tipis layaknya konstelasi',
    },
    backgroundProfile: {
      treatment: 'Latar ungu lembut temaram dengan aksen kabut cahaya halus',
      texturePattern: 'clean',
      description: 'Latar pastel bernuansa mimpi yang bersih',
    },
  },

  // =========================================================================
  // KATEGORI 04: ARTISTIK & TEMATIK
  // =========================================================================

  victorian: {
    id: 'victorian',
    name: 'Victorian',
    category: 'ARTISTIK & TEMATIK',
    categoryId: 'artistik_tematik',
    description: 'Estetika klasik historis dengan ornamen bingkai megah, tipografi berwibawa, dan suasana arsip akademik bersejarah.',
    visualCharacteristics: [
      'Tipografi monumental Cinzel dipadu Crimson Text yang elok',
      'Ornamen sudut bingkai klasik berukir halus',
      'Warna merah marun, emas tua (antique gold), dan perkamen hangat',
      'Mencerminkan keagungan literatur dan sejarah masa lampau',
    ],
    titleFont: 'Cinzel',
    subtitleFont: 'Cinzel',
    bodyFont: 'Crimson Text',
    typographyProfile: TYPOGRAPHY_VICTORIAN,
    colorProfile: {
      primary: '#881337',
      secondary: '#92400e',
      accent: '#1e3a8a',
      background: '#fffbeb',
      surface: '#ffffff',
      textPrimary: '#4c0519',
      textSecondary: '#78350f',
      paletteTag: 'Royal Antique Parchment',
      swatches: ['#881337', '#92400e', '#b45309', '#1e3a8a'],
    },
    layoutProfile: {
      archetype: 'Historical Archive Layout',
      defaultLayout: 'timeline',
      columnStructure: 'Alur kronologis vertikal dengan plakat monogram bertingkat',
      density: 'balanced',
      recommendedFor: ['Sejarah Nasional & Dunia', 'Peristiwa Kemerdekaan', 'Arkeologi & Peradaban Kuno'],
    },
    compositionProfile: {
      whitespace: 'balanced',
      alignment: 'balanced',
      visualEmphasis: 'text_first',
      gridGap: 'gap-5',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-serif font-bold uppercase tracking-widest text-rose-950',
      subtitleScale: 'text-sm sm:text-base font-serif font-semibold text-amber-800 tracking-wider',
      bodyScale: 'text-xs sm:text-sm font-serif leading-relaxed text-stone-800',
      badgeStyle: 'bg-amber-100 text-amber-950 border border-amber-400 rounded px-2.5 py-0.5 text-2xs font-serif uppercase tracking-widest font-bold',
      contrastRatio: 'Tinggi dan Berwibawa',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-lg',
      innerBorderRadius: 'rounded-md',
      borderTreatment: 'border-2 border-amber-700/60 bg-white shadow-xs',
      shadowStyle: 'shadow-md shadow-amber-900/10',
      depthLevel: 'Z-1 (Plakat Berbingkai Klasik)',
    },
    iconProfile: {
      style: 'outline',
      containerShape: 'rounded-md bg-amber-50 text-amber-900 border border-amber-300',
      character: 'Lambang cap lilin kerajaan, bulu unggas, dan kompas kuno',
    },
    illustrationProfile: {
      style: 'Engraving & Arsiran Klasik',
      treatment: 'Ilustrasi berarsir halus layaknya ukiran buku abad ke-19',
      character: 'Berwibawa, terpercaya, dan sarat nilai sejarah',
    },
    ornamentProfile: {
      level: 'expressive',
      motifs: ['Ornamen sudut bingkai klasik', 'Monogram romawi', 'Pita gulungan naskah'],
      description: 'Hiasan sudut ukiran pada setiap kartu materi',
    },
    backgroundProfile: {
      treatment: 'Kertas perkamen antik lembut bernuansa museum',
      texturePattern: 'clean',
      description: 'Latar hangat bertekstur kertas arsip tua bersih',
    },
  },

  bohemian: {
    id: 'bohemian',
    name: 'Bohemian',
    category: 'ARTISTIK & TEMATIK',
    categoryId: 'artistik_tematik',
    description: 'Gaya visual hangat, membumi, artistik, dan bernuansa alam organik dengan palet warna tanah yang menenangkan.',
    visualCharacteristics: [
      'Tipografi elegan DM Serif Display berpadu Nunito yang bersahabat',
      'Palet warna terakota, sage green, oker emas, dan pasir pantai',
      'Bentuk lengkung kurva busur (arch) dan daun tumbuhan kering',
      'Atmosfer rileks, penuh harmoni, dan menghargai alam',
    ],
    titleFont: 'DM Serif Display',
    subtitleFont: 'DM Serif Display',
    bodyFont: 'Nunito',
    typographyProfile: TYPOGRAPHY_BOHEMIAN,
    colorProfile: {
      primary: '#9a3412',
      secondary: '#4d7c0f',
      accent: '#d97706',
      background: '#fefce8',
      surface: '#ffffff',
      textPrimary: '#431407',
      textSecondary: '#713f12',
      paletteTag: 'Warm Earth Terracotta',
      swatches: ['#9a3412', '#4d7c0f', '#d97706', '#ca8a04'],
    },
    layoutProfile: {
      archetype: 'Organic Arch Gallery',
      defaultLayout: 'central',
      columnStructure: 'Struktur kartu melengkung (archway) dengan tata letak santai',
      density: 'balanced',
      recommendedFor: ['Pertanian & Kehutanan', 'Ekologi Lingkungan Hidup', 'Seni Tradisional & Kerajinan'],
    },
    compositionProfile: {
      whitespace: 'generous',
      alignment: 'balanced',
      visualEmphasis: 'balanced',
      gridGap: 'gap-5',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-serif font-normal tracking-tight text-orange-950',
      subtitleScale: 'text-sm sm:text-base font-semibold text-lime-800',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-stone-700',
      badgeStyle: 'bg-orange-100 text-orange-900 border border-orange-300 rounded-full px-3 py-0.5 text-2xs font-medium',
      contrastRatio: 'Tinggi dan Teduh di Mata',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-3xl',
      innerBorderRadius: 'rounded-2xl',
      borderTreatment: 'border border-orange-200 bg-white hover:border-orange-300',
      shadowStyle: 'shadow-md shadow-orange-900/5',
      depthLevel: 'Z-1 (Kartu Organik Sudut Lembut)',
    },
    iconProfile: {
      style: 'rounded-box',
      containerShape: 'rounded-2xl bg-orange-50 text-orange-800 border border-orange-200',
      character: 'Bentuk daun, matahari terbit, pot gerabah, dan siluet botani',
    },
    illustrationProfile: {
      style: 'Ilustrasi Botani Organik',
      treatment: 'Garis kurva lembut terinspirasi alam bebas',
      character: 'Damai, membumi, dan menumbuhkan rasa cinta lingkungan',
    },
    ornamentProfile: {
      level: 'moderate',
      motifs: ['Bentuk gerbang busur (arch)', 'Siluet dedaunan kering', 'Matahari terbit minimalis'],
      description: 'Aksen kurva setengah lingkaran di bagian kepala kartu',
    },
    backgroundProfile: {
      treatment: 'Warna pasir pantai gading dengan kehangatan lembut',
      texturePattern: 'clean',
      description: 'Latar hangat bebas silau yang nyaman dipelajari berlama-lama',
    },
  },

  handwritten: {
    id: 'handwritten',
    name: 'Handwritten',
    category: 'ARTISTIK & TEMATIK',
    categoryId: 'artistik_tematik',
    description: 'Sentuhan tulisan tangan, garis penunjuk kasual, dan suasana akrab layaknya catatan belajar siswa teladan.',
    visualCharacteristics: [
      'Tipografi judul tulisan tangan ekspresif Caveat dipadu Nunito yang jelas',
      'Garis bawah melengkung dan lingkaran penanda kata kunci',
      'Kartu bergaya memo tempel (sticky note) untuk poin krusial',
      'Suasana belajar personal, ramah, dan memotivasi',
    ],
    titleFont: 'Caveat',
    subtitleFont: 'Caveat',
    bodyFont: 'Nunito',
    typographyProfile: TYPOGRAPHY_HANDWRITTEN,
    colorProfile: {
      primary: '#2563eb',
      secondary: '#ca8a04',
      accent: '#dc2626',
      background: '#f8fafc',
      surface: '#ffffff',
      textPrimary: '#1e293b',
      textSecondary: '#475569',
      paletteTag: 'Study Notebook Blue & Yellow',
      swatches: ['#2563eb', '#ca8a04', '#dc2626', '#16a34a'],
    },
    layoutProfile: {
      archetype: 'Study Journal & Notebook',
      defaultLayout: 'grid',
      columnStructure: 'Kolom catatan belajar dengan kartu sorotan bergaya memo tempel',
      density: 'balanced',
      recommendedFor: ['Tips Belajar & Cara Menghafal', 'Ringkasan Rumus Penting', 'Rangkuman Pembelajaran Harian'],
    },
    compositionProfile: {
      whitespace: 'balanced',
      alignment: 'left',
      visualEmphasis: 'balanced',
      gridGap: 'gap-5',
    },
    hierarchyProfile: {
      titleScale: 'text-3xl sm:text-4xl font-bold tracking-tight text-blue-800',
      subtitleScale: 'text-lg sm:text-xl font-bold text-amber-700',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-slate-800',
      badgeStyle: 'bg-amber-100 text-amber-900 border border-amber-300 rounded-md px-2.5 py-0.5 text-2xs font-bold rotate-[-1deg]',
      contrastRatio: 'Tinggi dan Nyaman',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-2xl',
      innerBorderRadius: 'rounded-xl',
      borderTreatment: 'border border-slate-300/80 bg-white shadow-xs',
      shadowStyle: 'shadow-md shadow-slate-400/10',
      depthLevel: 'Z-1 (Buku Catatan Bergaris)',
    },
    iconProfile: {
      style: 'sketch',
      containerShape: 'rounded-xl bg-blue-50 text-blue-700 border border-blue-200',
      character: 'Sketsa pensil, spidol stabilo, dan pin kertas',
    },
    illustrationProfile: {
      style: 'Sketsa Spidol Belajar',
      treatment: 'Garis organik kasual yang menyederhanakan materi sulit',
      character: 'Akrab, bersahabat, dan tidak menakutkan',
    },
    ornamentProfile: {
      level: 'moderate',
      motifs: ['Garis stabilo kuning transparan', 'Panah lengkung tangan', 'Lingkaran sorotan'],
      description: 'Coretan stabilo pada poin-poin rumus dan konsep kunci',
    },
    backgroundProfile: {
      treatment: 'Kertas catatan buku belajar bergaris halus',
      texturePattern: 'notebook',
      description: 'Garis grid buku catatan matematika atau garis jurnal tipis',
    },
  },

  hand_drawing: {
    id: 'hand_drawing',
    name: 'Hand Drawing',
    category: 'ARTISTIK & TEMATIK',
    categoryId: 'artistik_tematik',
    description: 'Gaya ilustratif dan organik, seperti gambar dan catatan sketsa yang dibuat secara manual dengan tangan.',
    visualCharacteristics: [
      'Tipografi judul berkarakter sketsa Kalam berpadu isi Nunito yang mudah dicerna',
      'Garis kontur sketsa tangan yang luwes dan hidup',
      'Ikon dan diagram berbentuk doodle tangan kontekstual',
      'Kesan alami, menyenangkan, dan membebaskan imajinasi siswa',
    ],
    titleFont: 'Kalam',
    subtitleFont: 'Kalam',
    bodyFont: 'Nunito',
    typographyProfile: TYPOGRAPHY_HAND_DRAWING,
    colorProfile: {
      primary: '#0891b2',
      secondary: '#ea580c',
      accent: '#16a34a',
      background: '#fafaf9',
      surface: '#ffffff',
      textPrimary: '#1c1917',
      textSecondary: '#44403c',
      paletteTag: 'Hand Drawn Sketch Slate',
      swatches: ['#0891b2', '#ea580c', '#16a34a', '#eab308'],
    },
    layoutProfile: {
      archetype: 'Hand-drawn Process & Map',
      defaultLayout: 'process',
      columnStructure: 'Alur konsep bertahap dengan diagram sketsa penunjuk yang mengalir',
      density: 'balanced',
      recommendedFor: ['Eksperimen Praktikum Siswa', 'Peta Konsep & Siklus Alam', 'Diagram Penjelasan Langkah Demi Langkah'],
    },
    compositionProfile: {
      whitespace: 'balanced',
      alignment: 'left',
      visualEmphasis: 'visual_first',
      gridGap: 'gap-5',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-bold tracking-tight text-cyan-900',
      subtitleScale: 'text-base sm:text-lg font-bold text-orange-600',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-stone-800',
      badgeStyle: 'bg-cyan-50 text-cyan-800 border border-dashed border-cyan-400 rounded-lg px-2.5 py-0.5 text-2xs font-bold',
      contrastRatio: 'Tinggi dan Alami',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-2xl',
      innerBorderRadius: 'rounded-xl',
      borderTreatment: 'border-2 border-stone-300 bg-white shadow-xs',
      shadowStyle: 'shadow-md shadow-stone-300/30',
      depthLevel: 'Z-1 (Kartu Sketsa Tangan Organik)',
    },
    iconProfile: {
      style: 'sketch',
      containerShape: 'rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-300',
      character: 'Gambar tangan, sketsa pensil, dan ikon coretan kapur',
    },
    illustrationProfile: {
      style: 'Organik Hand Drawing',
      treatment: 'Garis kontur sketsa luwes dengan sapuan warna pensil warna',
      character: 'Interaktif, menyenangkan, dan memicu rasa ingin tahu',
    },
    ornamentProfile: {
      level: 'moderate',
      motifs: ['Panah sketsa tangan melengkung', 'Awan pemikiran (thought cloud)', 'Bintang coretan'],
      description: 'Panah sketsa tangan yang menghubungkan urutan materi',
    },
    backgroundProfile: {
      treatment: 'Kertas gambar sketsa bersih bertekstur halus',
      texturePattern: 'clean',
      description: 'Latar putih gading menyerupai buku sketsa seni',
    },
  },

  // =========================================================================
  // KATEGORI 05: ILUSTRATIF & EDUKATIF
  // =========================================================================

  clay_style: {
    id: 'clay_style',
    name: 'Clay Style',
    category: 'ILUSTRATIF & EDUKATIF',
    categoryId: 'ilustratif_edukatif',
    description: 'Visual 3D lembut bergaya tanah liat plastisin yang ramah, hangat, dan sangat disukai peserta didik.',
    visualCharacteristics: [
      'Bentuk membulat 3D plastisin yang ramah dan bersahabat',
      'Pencahayaan lembut dan bayangan halus bertekstur empuk',
      'Tipografi Fredoka + Nunito yang membulat dan mudah dibaca',
      'Materi terasa seperti model fisik nyata yang menyenangkan',
    ],
    titleFont: 'Fredoka',
    subtitleFont: 'Nunito',
    bodyFont: 'Nunito',
    typographyProfile: TYPOGRAPHY_CLAY_STYLE,
    colorProfile: {
      primary: '#ea580c',
      secondary: '#0284c7',
      accent: '#16a34a',
      background: '#fff7ed',
      surface: '#ffffff',
      textPrimary: '#431407',
      textSecondary: '#7c2d12',
      paletteTag: 'Soft Clay Plasticine',
      swatches: ['#ea580c', '#0284c7', '#16a34a', '#f59e0b'],
    },
    layoutProfile: {
      archetype: 'Tactile 3D Cards',
      defaultLayout: 'central',
      columnStructure: 'Kartu modular membulat empuk dengan visual 3D di tengah',
      density: 'spacious',
      recommendedFor: ['Materi IPA Sekolah Dasar & SMP', 'Struktur Bumi & Gunung Berapi', 'Siklus Hewan & Tumbuhan'],
    },
    compositionProfile: {
      whitespace: 'generous',
      alignment: 'balanced',
      visualEmphasis: 'visual_first',
      gridGap: 'gap-6',
    },
    hierarchyProfile: {
      titleScale: 'text-2xl sm:text-3xl font-bold tracking-tight text-orange-950',
      subtitleScale: 'text-sm sm:text-base font-bold text-sky-700',
      bodyScale: 'text-xs sm:text-sm leading-relaxed text-stone-800 font-medium',
      badgeStyle: 'bg-orange-100 text-orange-900 border border-orange-300 rounded-full px-3 py-1 text-2xs font-bold shadow-xs',
      contrastRatio: 'Tinggi dan Lembut',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-3xl',
      innerBorderRadius: 'rounded-2xl',
      borderTreatment: 'border border-orange-200/90 bg-white shadow-lg shadow-orange-500/10',
      shadowStyle: 'shadow-xl shadow-orange-500/10',
      depthLevel: 'Z-2 (Bentuk 3D Plastisin Melengkung Lembut)',
    },
    iconProfile: {
      style: 'rounded-box',
      containerShape: 'rounded-2xl bg-orange-100 text-orange-700 shadow-inner border border-orange-200',
      character: 'Miniatur model clay 3D dengan lekukan bulat menggemaskan',
    },
    illustrationProfile: {
      style: '3D Claymation Modeling',
      treatment: 'Bentuk plastisin mengembang dengan pencahayaan studio hangat',
      character: 'Ramah, mendidik, bersahabat, dan memicu imajinasi kreatif',
    },
    ornamentProfile: {
      level: 'moderate',
      motifs: ['Bola-bola clay mini', 'Gelembung membulat empuk', 'Tombol clay timbul'],
      description: 'Bentuk-bentuk membulat lembut di sudut-sudut kartu materi',
    },
    backgroundProfile: {
      treatment: 'Latar krem oranye sangat lembut dengan kedalaman pencahayaan hangat',
      texturePattern: 'clean',
      description: 'Latar bersih yang nyaman tanpa membuat silau mata',
    },
  },

  pixel_style: {
    id: 'pixel_style',
    name: 'Pixel Style',
    category: 'ILUSTRATIF & EDUKATIF',
    categoryId: 'ilustratif_edukatif',
    description: 'Seni piksel retro 8-bit/16-bit yang terstruktur, kreatif, dan membangkitkan suasana game edukasi interaktif.',
    visualCharacteristics: [
      'Judul retro arkade Press Start 2P berpadu teks isi VT323 yang jernih',
      'Grid piksel berkarakter game retro klasik',
      'Batas kartu bergaya kotak modular modular',
      'Meningkatkan antusiasme siswa lewat gamifikasi belajar',
    ],
    titleFont: 'Press Start 2P',
    subtitleFont: 'VT323',
    bodyFont: 'VT323',
    typographyProfile: TYPOGRAPHY_PIXEL_STYLE,
    colorProfile: {
      primary: '#7c3aed',
      secondary: '#06b6d4',
      accent: '#10b981',
      background: '#f8fafc',
      surface: '#ffffff',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      paletteTag: 'Arcade 8-Bit Quest',
      swatches: ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'],
    },
    layoutProfile: {
      archetype: 'Retro Arcade Game Quest',
      defaultLayout: 'grid',
      columnStructure: 'Grid modular balok piksel dengan penanda poin dan skor',
      density: 'compact',
      recommendedFor: ['Logika Komputasi & Pemrograman Dasar', 'Matematika Geometri & Koordinat', 'Kuis & Gamifikasi Belajar'],
    },
    compositionProfile: {
      whitespace: 'compact',
      alignment: 'left',
      visualEmphasis: 'visual_first',
      gridGap: 'gap-4',
    },
    hierarchyProfile: {
      titleScale: 'text-lg sm:text-xl font-mono uppercase tracking-wider text-purple-700',
      subtitleScale: 'text-base sm:text-lg font-mono text-cyan-600 font-bold',
      bodyScale: 'text-sm sm:text-base font-mono leading-tight text-slate-800',
      badgeStyle: 'bg-purple-100 text-purple-900 border-2 border-purple-400 rounded-none px-2 py-0.5 text-2xs font-mono uppercase',
      contrastRatio: 'Tinggi dan Kontras Tajam',
    },
    elementProfile: {
      cardBorderRadius: 'rounded-none',
      innerBorderRadius: 'rounded-none',
      borderTreatment: 'border-2 border-slate-900 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
      shadowStyle: 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
      depthLevel: 'Z-1 (Balok Piksel Retro 2D)',
    },
    iconProfile: {
      style: 'pixel',
      containerShape: 'rounded-none bg-purple-100 text-purple-800 border-2 border-slate-900',
      character: 'Sprite game 8-bit, pedang quest, piala, dan koin belajar',
    },
    illustrationProfile: {
      style: 'Pixel Art Modular',
      treatment: 'Grid piksel tajam dengan warna solid tanpa blur',
      character: 'Nostalgik, seru layaknya petualangan game edukatif',
    },
    ornamentProfile: {
      level: 'expressive',
      motifs: ['Hati nyawa game (pixel heart)', 'Bar energi level materi', 'Koin bintang'],
      description: 'Lencana skor belajar dan indikator quest level di setiap bab',
    },
    backgroundProfile: {
      treatment: 'Latar abu-abu sangat muda dengan garis petak piksel samar',
      texturePattern: 'grid',
      description: 'Kisi-kisi piksel berjarak 8px yang rapi',
    },
  },
};

/**
 * Resolver Profile Gaya Lengkap (Anti-Crash, Deep Resolver)
 */
export function getStyleProfile(styleNameOrId?: string): StyleProfile {
  if (!styleNameOrId) {
    return STYLE_PROFILES_V22D.futuristic;
  }

  const target = styleNameOrId.toLowerCase().trim();

  // 1. Direct key match
  if (STYLE_PROFILES_V22D[target]) {
    return STYLE_PROFILES_V22D[target];
  }

  // 2. Fuzzy mapping across all 20 styles
  if (target.includes('drawing') || target.includes('sketsa')) return STYLE_PROFILES_V22D.hand_drawing;
  if (target.includes('minimal')) return STYLE_PROFILES_V22D.minimalism;
  if (target.includes('maxi') || target.includes('maksimal')) return STYLE_PROFILES_V22D.maximalism;
  if (target.includes('futur')) return STYLE_PROFILES_V22D.futuristic;
  if (target.includes('vector') || target.includes('vektor')) return STYLE_PROFILES_V22D.vector_art;
  if (target.includes('collage') || target.includes('kolase')) return STYLE_PROFILES_V22D.collage_art;
  if (target.includes('cyber')) return STYLE_PROFILES_V22D.cyberpunk;
  if (target.includes('pop')) return STYLE_PROFILES_V22D.pop_art;
  if (target.includes('glass')) return STYLE_PROFILES_V22D.glassmorphism;
  if (target.includes('clay')) return STYLE_PROFILES_V22D.clay_style;
  if (target.includes('pixel')) return STYLE_PROFILES_V22D.pixel_style;
  if (target.includes('editorial')) return STYLE_PROFILES_V22D.editorial;
  if (target.includes('y2k')) return STYLE_PROFILES_V22D.y2k;
  if (target.includes('swiss')) return STYLE_PROFILES_V22D.swiss_design;
  if (target.includes('surreal') || target.includes('surealis')) return STYLE_PROFILES_V22D.surrealism;
  if (target.includes('bohemian') || target.includes('boho')) return STYLE_PROFILES_V22D.bohemian;
  if (target.includes('victorian') || target.includes('viktorian')) return STYLE_PROFILES_V22D.victorian;
  if (target.includes('graffiti') || target.includes('street')) return STYLE_PROFILES_V22D.graffiti;
  if (target.includes('aurora')) return STYLE_PROFILES_V22D.aurora;
  if (target.includes('handwritten') || target.includes('tangan')) return STYLE_PROFILES_V22D.handwritten;

  // 3. Fallback to Futuristic
  return STYLE_PROFILES_V22D.futuristic;
}

/**
 * Daftar seluruh 20 gaya terdaftar
 */
export const ALL_20_STYLE_PROFILES: StyleProfile[] = Object.values(STYLE_PROFILES_V22D);

/**
 * Ambil daftar style profile berdasarkan kategori id
 */
export function getStyleProfilesByCategoryId(categoryId: string): StyleProfile[] {
  return ALL_20_STYLE_PROFILES.filter((s) => s.categoryId === categoryId);
}
