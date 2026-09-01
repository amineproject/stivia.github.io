import { 
  ColorPaletteTokens, 
  TypographyTokens, 
  CardTokens, 
  IconTokens, 
  DecorationTokens, 
  CompositionTokens, 
  StyleConfig 
} from '../types';

/**
 * PRESET 1: Modern Edukatif (Default STIVIA)
 * Bersih, modern, ramah untuk pembelajaran, seimbang antara teks dan visual.
 */
export const STYLE_MODERN_EDUKATIF: StyleConfig = {
  id: 'modern_edukatif',
  name: 'Modern Edukatif',
  tagline: 'Bersih, Seimbang & Ramah Siswa',
  description: 'Gaya visual standar STIVIA yang menggabungkan kejelasan materi, kontras optimal, dan estetika modern.',
  colorPalette: {
    background: 'bg-slate-100/80',
    surface: 'bg-white',
    surfaceBorder: 'border-slate-200/80',
    primary: 'indigo',
    primaryBg: 'bg-indigo-600',
    primaryText: 'text-indigo-700',
    primaryLight: 'bg-indigo-50',
    primaryBorder: 'border-indigo-200/70',
    secondary: 'teal',
    secondaryBg: 'bg-teal-600',
    secondaryText: 'text-teal-700',
    secondaryLight: 'bg-teal-50',
    secondaryBorder: 'border-teal-200/70',
    accent: 'amber',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-800',
    accentLight: 'bg-amber-50',
    accentBorder: 'border-amber-200/70',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900',
    headerText: 'text-white',
    headerSubtext: 'text-teal-200',
    headerBadgeBg: 'bg-white/15 border-white/15 text-white',
    footerBg: 'bg-slate-900',
    footerText: 'text-slate-300',
    footerAccent: 'bg-indigo-600 text-white',
    summaryBorder: 'border-violet-600 ring-2 ring-violet-500/20',
    summaryBadge: 'text-violet-700 bg-violet-50 border-violet-200',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-extrabold',
    headingTracking: 'tracking-tight',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-2xl',
    innerRadius: 'rounded-xl',
    borderStyle: 'border border-slate-200/80',
    shadowStyle: 'shadow-xs hover:shadow-md hover:border-indigo-300',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-white',
    highlightBorder: 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md',
  },
  icons: {
    style: 'rounded-box',
    size: 'w-4 h-4',
    containerShape: 'rounded-xl',
    containerBg: 'bg-indigo-600 text-white',
  },
  decoration: {
    level: 'minimal',
    shapes: 'geometric',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]',
    badgeStyle: 'rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider',
    showAccentBar: false,
  },
  composition: {
    density: 'balanced',
    whitespace: 'balanced',
    alignment: 'left',
    visualEmphasis: 'balanced',
    gridGap: 'gap-5',
  },
};

/**
 * PRESET 2: Minimalis
 * Sangat bersih, fokus pada isi, ruang kosong cukup, sedikit dekorasi, elegan.
 */
export const STYLE_MINIMALIS: StyleConfig = {
  id: 'minimalis',
  name: 'Minimalis',
  tagline: 'Sangat Bersih, Elegan & Fokus Isi',
  description: 'Mengedepankan whitespace luas, tipografi proporsional, dan palet netral tanpa ornamen berlebih.',
  colorPalette: {
    background: 'bg-stone-50/60',
    surface: 'bg-white',
    surfaceBorder: 'border-stone-200',
    primary: 'slate',
    primaryBg: 'bg-slate-800',
    primaryText: 'text-slate-800',
    primaryLight: 'bg-slate-100',
    primaryBorder: 'border-slate-300',
    secondary: 'zinc',
    secondaryBg: 'bg-zinc-700',
    secondaryText: 'text-zinc-700',
    secondaryLight: 'bg-zinc-100',
    secondaryBorder: 'border-zinc-300',
    accent: 'stone',
    accentBg: 'bg-stone-600',
    accentText: 'text-stone-800',
    accentLight: 'bg-stone-100',
    accentBorder: 'border-stone-300',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-600',
    textMuted: 'text-stone-400',
    headerGradient: 'bg-white border-2 border-stone-300 text-stone-900',
    headerText: 'text-stone-900',
    headerSubtext: 'text-stone-600',
    headerBadgeBg: 'bg-stone-100 border-stone-300 text-stone-800',
    footerBg: 'bg-stone-100 border-t border-stone-300 text-stone-700',
    footerText: 'text-stone-600',
    footerAccent: 'bg-stone-800 text-white',
    summaryBorder: 'border-stone-700 ring-1 ring-stone-400 shadow-none',
    summaryBadge: 'text-stone-800 bg-stone-100 border-stone-300',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-bold',
    headingTracking: 'tracking-normal',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-xl',
    innerRadius: 'rounded-lg',
    borderStyle: 'border border-stone-200',
    shadowStyle: 'shadow-none hover:border-stone-400',
    padding: 'p-6 sm:p-7',
    density: 'spacious',
    cardBg: 'bg-white',
    highlightBorder: 'border-stone-800 ring-2 ring-stone-300 shadow-xs',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-lg',
    containerBg: 'bg-stone-100 text-stone-800 border border-stone-300',
  },
  decoration: {
    level: 'none',
    shapes: 'minimal',
    pattern: 'none',
    backgroundTreatment: '',
    badgeStyle: 'rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide border',
    showAccentBar: false,
  },
  composition: {
    density: 'spacious',
    whitespace: 'generous',
    alignment: 'left',
    visualEmphasis: 'text_first',
    gridGap: 'gap-6',
  },
};

/**
 * PRESET 3: Ceria & Kreatif
 * Ramah, energik, menarik untuk siswa, ekspresif, edukatif.
 */
export const STYLE_CERIA_KREATIF: StyleConfig = {
  id: 'ceria_kreatif',
  name: 'Ceria & Kreatif',
  tagline: 'Energik, Ramah & Menarik Siswa',
  description: 'Palet hangat yang bersahabat, card dengan sudut lembut, dan aksen warna-warni yang memotivasi siswa.',
  colorPalette: {
    background: 'bg-amber-50/40',
    surface: 'bg-white',
    surfaceBorder: 'border-amber-200/80',
    primary: 'amber',
    primaryBg: 'bg-amber-500',
    primaryText: 'text-amber-800',
    primaryLight: 'bg-amber-100/80',
    primaryBorder: 'border-amber-300',
    secondary: 'sky',
    secondaryBg: 'bg-sky-500',
    secondaryText: 'text-sky-800',
    secondaryLight: 'bg-sky-100/80',
    secondaryBorder: 'border-sky-300',
    accent: 'rose',
    accentBg: 'bg-rose-500',
    accentText: 'text-rose-800',
    accentLight: 'bg-rose-100/80',
    accentBorder: 'border-rose-300',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500',
    headerText: 'text-white',
    headerSubtext: 'text-amber-100',
    headerBadgeBg: 'bg-white/20 border-white/30 text-white',
    footerBg: 'bg-slate-900 text-amber-100',
    footerText: 'text-amber-200/80',
    footerAccent: 'bg-amber-500 text-slate-950 font-bold',
    summaryBorder: 'border-orange-500 ring-2 ring-orange-400/20 shadow-md',
    summaryBadge: 'text-orange-800 bg-orange-100 border-orange-300',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-extrabold',
    headingTracking: 'tracking-tight',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-3xl',
    innerRadius: 'rounded-2xl',
    borderStyle: 'border-2 border-amber-200/90',
    shadowStyle: 'shadow-xs shadow-amber-500/10 hover:shadow-md hover:border-amber-400',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-white',
    highlightBorder: 'border-amber-500 ring-3 ring-amber-400/30 shadow-md',
  },
  icons: {
    style: 'filled',
    size: 'w-4 h-4',
    containerShape: 'rounded-full',
    containerBg: 'bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-xs',
  },
  decoration: {
    level: 'expressive',
    shapes: 'playful',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:20px_20px]',
    badgeStyle: 'rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide shadow-2xs',
    showAccentBar: true,
  },
  composition: {
    density: 'balanced',
    whitespace: 'balanced',
    alignment: 'left',
    visualEmphasis: 'balanced',
    gridGap: 'gap-5',
  },
};

/**
 * PRESET 4: Profesional
 * Formal, bersih, terpercaya, terstruktur, dewasa (SMP, SMA, SMK, atau materi sains/teknologi).
 */
export const STYLE_PROFESIONAL: StyleConfig = {
  id: 'profesional',
  name: 'Profesional',
  tagline: 'Formal, Terstruktur & Presisi Tinggi',
  description: 'Tampilan rapi dan simetris dengan palet navy/steel blue, sudut tajam presisi, dan hierarki tegas.',
  colorPalette: {
    background: 'bg-slate-100/90',
    surface: 'bg-white',
    surfaceBorder: 'border-slate-300',
    primary: 'blue',
    primaryBg: 'bg-blue-700',
    primaryText: 'text-blue-800',
    primaryLight: 'bg-blue-50',
    primaryBorder: 'border-blue-200',
    secondary: 'slate',
    secondaryBg: 'bg-slate-700',
    secondaryText: 'text-slate-800',
    secondaryLight: 'bg-slate-100',
    secondaryBorder: 'border-slate-300',
    accent: 'cyan',
    accentBg: 'bg-cyan-600',
    accentText: 'text-cyan-900',
    accentLight: 'bg-cyan-50',
    accentBorder: 'border-cyan-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    headerGradient: 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900',
    headerText: 'text-white',
    headerSubtext: 'text-sky-300',
    headerBadgeBg: 'bg-blue-900/60 border-blue-400/30 text-white',
    footerBg: 'bg-slate-950 border-t border-slate-800 text-slate-400',
    footerText: 'text-slate-300',
    footerAccent: 'bg-blue-600 text-white',
    summaryBorder: 'border-blue-700 ring-2 ring-blue-500/20 shadow-md',
    summaryBadge: 'text-blue-800 bg-blue-50 border-blue-300',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-bold',
    headingTracking: 'tracking-tight',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-normal',
  },
  cards: {
    borderRadius: 'rounded-xl',
    innerRadius: 'rounded-lg',
    borderStyle: 'border border-slate-300',
    shadowStyle: 'shadow-xs hover:border-blue-500 hover:shadow-sm',
    padding: 'p-5 sm:p-6',
    density: 'compact',
    cardBg: 'bg-white',
    highlightBorder: 'border-blue-700 ring-2 ring-blue-500/30 shadow-md',
  },
  icons: {
    style: 'geometric',
    size: 'w-4 h-4',
    containerShape: 'rounded-lg',
    containerBg: 'bg-blue-700 text-white shadow-2xs',
  },
  decoration: {
    level: 'minimal',
    shapes: 'technical',
    pattern: 'grid',
    backgroundTreatment: 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]',
    badgeStyle: 'rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border',
    showAccentBar: true,
  },
  composition: {
    density: 'compact',
    whitespace: 'compact',
    alignment: 'left',
    visualEmphasis: 'balanced',
    gridGap: 'gap-4 sm:gap-5',
  },
};

/**
 * PRESET 5: Ilustratif
 * Lebih visual, representasi gambar/ikon dominan, membantu pemahaman konsep abstrak.
 */
export const STYLE_ILUSTRATIF: StyleConfig = {
  id: 'ilustratif',
  name: 'Ilustratif',
  tagline: 'Kaya Visual & Metafora Konseptual',
  description: 'Menonjolkan blok visual, ikon diagramatis dominan, dan kontras warna yang memperjelas materi abstrak.',
  colorPalette: {
    background: 'bg-teal-50/30',
    surface: 'bg-white',
    surfaceBorder: 'border-teal-200/80',
    primary: 'teal',
    primaryBg: 'bg-teal-600',
    primaryText: 'text-teal-800',
    primaryLight: 'bg-teal-50',
    primaryBorder: 'border-teal-200',
    secondary: 'emerald',
    secondaryBg: 'bg-emerald-600',
    secondaryText: 'text-emerald-800',
    secondaryLight: 'bg-emerald-50',
    secondaryBorder: 'border-emerald-200',
    accent: 'amber',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-800',
    accentLight: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-teal-950 via-emerald-950 to-slate-900',
    headerText: 'text-white',
    headerSubtext: 'text-emerald-200',
    headerBadgeBg: 'bg-emerald-500/20 border-emerald-400/30 text-white',
    footerBg: 'bg-slate-900 text-teal-200',
    footerText: 'text-teal-300/80',
    footerAccent: 'bg-teal-500 text-slate-950 font-bold',
    summaryBorder: 'border-teal-600 ring-2 ring-teal-500/20 shadow-md',
    summaryBadge: 'text-teal-800 bg-teal-50 border-teal-200',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-extrabold',
    headingTracking: 'tracking-tight',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-2xl',
    innerRadius: 'rounded-xl',
    borderStyle: 'border-2 border-teal-200/80',
    shadowStyle: 'shadow-xs hover:shadow-md hover:border-teal-400',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-white',
    highlightBorder: 'border-teal-600 ring-2 ring-teal-500/30 shadow-md',
  },
  icons: {
    style: 'rounded-box',
    size: 'w-5 h-5',
    containerShape: 'rounded-xl',
    containerBg: 'bg-teal-600 text-white shadow-xs',
  },
  decoration: {
    level: 'moderate',
    shapes: 'organic',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#99f6e4_1px,transparent_1px)] [background-size:18px_18px]',
    badgeStyle: 'rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider border shadow-2xs',
    showAccentBar: false,
  },
  composition: {
    density: 'balanced',
    whitespace: 'balanced',
    alignment: 'left',
    visualEmphasis: 'visual_first',
    gridGap: 'gap-5',
  },
};

/**
 * PRESET 6: Akademik
 * Terstruktur, formal, jelas, fokus pada pembelajaran konseptual dan asesmen evaluasi.
 */
export const STYLE_AKADEMIK: StyleConfig = {
  id: 'akademik',
  name: 'Akademik',
  tagline: 'Ilmiah, Sistematis & Konseptual',
  description: 'Tata letak ilmiah yang fokus pada hierarki heading, ketegasan konsep, dan ringkasan evaluasi belajar.',
  colorPalette: {
    background: 'bg-[#fbfbf9]',
    surface: 'bg-white',
    surfaceBorder: 'border-stone-300',
    primary: 'rose',
    primaryBg: 'bg-[#881337]',
    primaryText: 'text-[#881337]',
    primaryLight: 'bg-rose-50',
    primaryBorder: 'border-rose-200',
    secondary: 'stone',
    secondaryBg: 'bg-stone-700',
    secondaryText: 'text-stone-800',
    secondaryLight: 'bg-stone-100',
    secondaryBorder: 'border-stone-300',
    accent: 'amber',
    accentBg: 'bg-amber-600',
    accentText: 'text-amber-900',
    accentLight: 'bg-amber-50',
    accentBorder: 'border-amber-300',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-700',
    textMuted: 'text-stone-500',
    headerGradient: 'bg-gradient-to-r from-[#2a0812] via-[#4c0519] to-[#1c1917]',
    headerText: 'text-white',
    headerSubtext: 'text-amber-200',
    headerBadgeBg: 'bg-white/10 border-white/20 text-white',
    footerBg: 'bg-[#1c1917] border-t border-stone-800 text-stone-400',
    footerText: 'text-stone-300',
    footerAccent: 'bg-[#881337] text-white',
    summaryBorder: 'border-[#881337] ring-2 ring-rose-900/20 shadow-xs',
    summaryBadge: 'text-[#881337] bg-rose-50 border-rose-200',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-serif',
    headingWeight: 'font-bold',
    headingTracking: 'tracking-tight',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-xl',
    innerRadius: 'rounded-lg',
    borderStyle: 'border border-stone-300',
    shadowStyle: 'shadow-none hover:border-stone-500 hover:shadow-xs',
    padding: 'p-5 sm:p-6',
    density: 'compact',
    cardBg: 'bg-white',
    highlightBorder: 'border-[#881337] ring-2 ring-rose-900/30 shadow-xs',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-md',
    containerBg: 'bg-[#881337] text-white',
  },
  decoration: {
    level: 'minimal',
    shapes: 'geometric',
    pattern: 'lines',
    backgroundTreatment: '',
    badgeStyle: 'rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border',
    showAccentBar: true,
  },
  composition: {
    density: 'compact',
    whitespace: 'balanced',
    alignment: 'left',
    visualEmphasis: 'text_first',
    gridGap: 'gap-5',
  },
};

/**
 * PRESET 7: Colorful Infografis
 * Kaya visual, berwarna-warni teratur, dinamis, menarik perhatian dengan multi-aksen terpadu.
 */
export const STYLE_COLORFUL_INFOGRAFIS: StyleConfig = {
  id: 'colorful_infografis',
  name: 'Colorful Infografis',
  tagline: 'Vibran, Dinamis & Multi-Aksen Harmonis',
  description: 'Kombinasi multi-warna yang dinamis dan kontras namun tetap terpadu dalam satu sistem desain teratur.',
  colorPalette: {
    background: 'bg-gradient-to-b from-indigo-50/40 via-purple-50/30 to-sky-50/40',
    surface: 'bg-white',
    surfaceBorder: 'border-purple-200/80',
    primary: 'purple',
    primaryBg: 'bg-purple-600',
    primaryText: 'text-purple-700',
    primaryLight: 'bg-purple-50',
    primaryBorder: 'border-purple-200',
    secondary: 'cyan',
    secondaryBg: 'bg-cyan-600',
    secondaryText: 'text-cyan-800',
    secondaryLight: 'bg-cyan-50',
    secondaryBorder: 'border-cyan-200',
    accent: 'pink',
    accentBg: 'bg-pink-500',
    accentText: 'text-pink-800',
    accentLight: 'bg-pink-50',
    accentBorder: 'border-pink-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500',
    headerText: 'text-white',
    headerSubtext: 'text-pink-100',
    headerBadgeBg: 'bg-white/20 border-white/30 text-white',
    footerBg: 'bg-slate-950 text-slate-300',
    footerText: 'text-purple-200/80',
    footerAccent: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold',
    summaryBorder: 'border-purple-600 ring-2 ring-purple-500/20 shadow-md',
    summaryBadge: 'text-purple-800 bg-purple-100 border-purple-300',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-extrabold',
    headingTracking: 'tracking-tight',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-2xl',
    innerRadius: 'rounded-xl',
    borderStyle: 'border border-purple-200/80',
    shadowStyle: 'shadow-xs hover:shadow-md hover:border-purple-400',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-white',
    highlightBorder: 'border-purple-600 ring-3 ring-purple-400/30 shadow-md',
  },
  icons: {
    style: 'rounded-box',
    size: 'w-4 h-4',
    containerShape: 'rounded-xl',
    containerBg: 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-2xs',
  },
  decoration: {
    level: 'expressive',
    shapes: 'geometric',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#e9d5ff_1px,transparent_1px)] [background-size:16px_16px]',
    badgeStyle: 'rounded-full px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider border shadow-2xs',
    showAccentBar: true,
  },
  composition: {
    density: 'balanced',
    whitespace: 'balanced',
    alignment: 'left',
    visualEmphasis: 'visual_first',
    gridGap: 'gap-5',
  },
};

/**
 * List of all standard available Style Presets
 */
export const AVAILABLE_STYLE_PRESETS: StyleConfig[] = [
  STYLE_MODERN_EDUKATIF,
  STYLE_MINIMALIS,
  STYLE_CERIA_KREATIF,
  STYLE_PROFESIONAL,
  STYLE_ILUSTRATIF,
  STYLE_AKADEMIK,
  STYLE_COLORFUL_INFOGRAFIS,
];

/**
 * Translate user custom prompt / custom visual style description into a coherent StyleConfig
 */
export function buildCustomStyleConfig(customDescription: string): StyleConfig {
  const desc = (customDescription || '').toLowerCase();

  // Determine base tone
  const isPastelOrSoft = desc.includes('pastel') || desc.includes('lembut') || desc.includes('soft') || desc.includes('majalah');
  const isDarkOrTech = desc.includes('dark') || desc.includes('gelap') || desc.includes('cyber') || desc.includes('futuristik') || desc.includes('tech') || desc.includes('neon');
  const isNatureOrVintage = desc.includes('vintage') || desc.includes('klasik') || desc.includes('alam') || desc.includes('botani') || desc.includes('retro');
  const isPlayful = desc.includes('anak') || desc.includes('playful') || desc.includes('ceria') || desc.includes('lucu') || desc.includes('ramah');

  if (isDarkOrTech) {
    return {
      id: 'custom_tech',
      name: 'Custom (Futuristik & Tech)',
      tagline: 'Modern Digital & High-Contrast Tech',
      description: customDescription || 'Tampilan bertema futuristik dengan aksen neon dan kontras tajam.',
      colorPalette: {
        background: 'bg-slate-900',
        surface: 'bg-slate-950',
        surfaceBorder: 'border-cyan-800/80',
        primary: 'cyan',
        primaryBg: 'bg-cyan-500',
        primaryText: 'text-cyan-400',
        primaryLight: 'bg-cyan-950/80',
        primaryBorder: 'border-cyan-700/60',
        secondary: 'indigo',
        secondaryBg: 'bg-indigo-600',
        secondaryText: 'text-indigo-400',
        secondaryLight: 'bg-indigo-950/80',
        secondaryBorder: 'border-indigo-700/60',
        accent: 'emerald',
        accentBg: 'bg-emerald-500',
        accentText: 'text-emerald-400',
        accentLight: 'bg-emerald-950/80',
        accentBorder: 'border-emerald-700/60',
        textPrimary: 'text-white',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        headerGradient: 'bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950 border border-cyan-800/50',
        headerText: 'text-white',
        headerSubtext: 'text-cyan-300',
        headerBadgeBg: 'bg-cyan-950 border-cyan-500/40 text-cyan-200',
        footerBg: 'bg-slate-950 border-t border-cyan-900/50 text-slate-400',
        footerText: 'text-cyan-200/80',
        footerAccent: 'bg-cyan-500 text-slate-950 font-bold',
        summaryBorder: 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-md',
        summaryBadge: 'text-cyan-300 bg-cyan-950 border-cyan-700',
      },
      typography: {
        fontFamily: 'font-mono',
        headingFont: 'font-mono',
        headingWeight: 'font-bold',
        headingTracking: 'tracking-tight',
        bodyStyle: 'font-sans',
        bodyWeight: 'font-normal',
        headingScale: 'text-base sm:text-lg',
        lineHeight: 'leading-relaxed',
      },
      cards: {
        borderRadius: 'rounded-xl',
        innerRadius: 'rounded-lg',
        borderStyle: 'border border-cyan-800/80',
        shadowStyle: 'shadow-xs hover:border-cyan-400 hover:shadow-md hover:shadow-cyan-500/10',
        padding: 'p-5 sm:p-6',
        density: 'compact',
        cardBg: 'bg-slate-950 text-slate-100',
        highlightBorder: 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-md',
      },
      icons: {
        style: 'geometric',
        size: 'w-4 h-4',
        containerShape: 'rounded-lg',
        containerBg: 'bg-cyan-500 text-slate-950 font-bold',
      },
      decoration: {
        level: 'moderate',
        shapes: 'technical',
        pattern: 'grid',
        backgroundTreatment: 'bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:20px_20px]',
        badgeStyle: 'rounded-md px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border',
        showAccentBar: true,
      },
      composition: {
        density: 'compact',
        whitespace: 'compact',
        alignment: 'left',
        visualEmphasis: 'balanced',
        gridGap: 'gap-5',
      },
    };
  }

  if (isPastelOrSoft) {
    return {
      id: 'custom_pastel',
      name: 'Custom (Soft Pastel Edukatif)',
      tagline: 'Nuansa Majalah, Warna Lembut & Bersih',
      description: customDescription || 'Tampilan lembut bergaya majalah edukasi dengan warna pastel harmonis.',
      colorPalette: {
        background: 'bg-[#faf7f5]',
        surface: 'bg-white',
        surfaceBorder: 'border-rose-100',
        primary: 'rose',
        primaryBg: 'bg-rose-400',
        primaryText: 'text-rose-800',
        primaryLight: 'bg-rose-50',
        primaryBorder: 'border-rose-200',
        secondary: 'teal',
        secondaryBg: 'bg-teal-400',
        secondaryText: 'text-teal-800',
        secondaryLight: 'bg-teal-50',
        secondaryBorder: 'border-teal-200',
        accent: 'amber',
        accentBg: 'bg-amber-400',
        accentText: 'text-amber-800',
        accentLight: 'bg-amber-50',
        accentBorder: 'border-amber-200',
        textPrimary: 'text-slate-800',
        textSecondary: 'text-slate-600',
        textMuted: 'text-slate-400',
        headerGradient: 'bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300',
        headerText: 'text-slate-900',
        headerSubtext: 'text-rose-900',
        headerBadgeBg: 'bg-white/50 border-white/60 text-slate-800',
        footerBg: 'bg-slate-900 text-slate-200',
        footerText: 'text-rose-200/80',
        footerAccent: 'bg-rose-400 text-slate-900 font-bold',
        summaryBorder: 'border-rose-400 ring-2 ring-rose-300/30 shadow-sm',
        summaryBadge: 'text-rose-800 bg-rose-50 border-rose-200',
      },
      typography: {
        fontFamily: 'font-sans',
        headingFont: 'font-serif',
        headingWeight: 'font-bold',
        headingTracking: 'tracking-normal',
        bodyStyle: 'font-sans',
        bodyWeight: 'font-normal',
        headingScale: 'text-base sm:text-lg',
        lineHeight: 'leading-relaxed',
      },
      cards: {
        borderRadius: 'rounded-2xl',
        innerRadius: 'rounded-xl',
        borderStyle: 'border border-rose-100/80',
        shadowStyle: 'shadow-2xs hover:shadow-md hover:border-rose-300',
        padding: 'p-5 sm:p-6',
        density: 'balanced',
        cardBg: 'bg-white',
        highlightBorder: 'border-rose-400 ring-2 ring-rose-200 shadow-sm',
      },
      icons: {
        style: 'rounded-box',
        size: 'w-4 h-4',
        containerShape: 'rounded-xl',
        containerBg: 'bg-rose-400 text-white',
      },
      decoration: {
        level: 'moderate',
        shapes: 'organic',
        pattern: 'dots',
        backgroundTreatment: 'bg-[radial-gradient(#fecdd3_1px,transparent_1px)] [background-size:20px_20px]',
        badgeStyle: 'rounded-full px-3 py-0.5 text-[11px] font-bold tracking-wide border',
        showAccentBar: false,
      },
      composition: {
        density: 'balanced',
        whitespace: 'generous',
        alignment: 'left',
        visualEmphasis: 'balanced',
        gridGap: 'gap-5',
      },
    };
  }

  if (isNatureOrVintage) {
    return {
      id: 'custom_vintage',
      name: 'Custom (Vintage Botanik / Sains Klasik)',
      tagline: 'Koleksi Ilmiah Klasik & Natural',
      description: customDescription || 'Tampilan bertema natural/vintage dengan warna tanah dan botanical green.',
      colorPalette: {
        background: 'bg-[#f4f1ea]',
        surface: 'bg-[#fcfbf9]',
        surfaceBorder: 'border-[#dfd7c5]',
        primary: 'emerald',
        primaryBg: 'bg-emerald-800',
        primaryText: 'text-emerald-900',
        primaryLight: 'bg-emerald-50',
        primaryBorder: 'border-emerald-200',
        secondary: 'amber',
        secondaryBg: 'bg-amber-800',
        secondaryText: 'text-amber-900',
        secondaryLight: 'bg-amber-50',
        secondaryBorder: 'border-amber-200',
        accent: 'stone',
        accentBg: 'bg-stone-700',
        accentText: 'text-stone-900',
        accentLight: 'bg-stone-100',
        accentBorder: 'border-stone-300',
        textPrimary: 'text-[#2b251d]',
        textSecondary: 'text-[#564e43]',
        textMuted: 'text-[#8b8273]',
        headerGradient: 'bg-gradient-to-r from-[#243325] via-[#2f4331] to-[#1c241d]',
        headerText: 'text-[#f4f1ea]',
        headerSubtext: 'text-[#c6dcbe]',
        headerBadgeBg: 'bg-white/15 border-white/20 text-[#f4f1ea]',
        footerBg: 'bg-[#1c241d] text-[#d6cdbd]',
        footerText: 'text-[#a99f8d]',
        footerAccent: 'bg-emerald-700 text-white',
        summaryBorder: 'border-emerald-800 ring-2 ring-emerald-900/20 shadow-xs',
        summaryBadge: 'text-emerald-900 bg-emerald-50 border-emerald-300',
      },
      typography: {
        fontFamily: 'font-serif',
        headingFont: 'font-serif',
        headingWeight: 'font-bold',
        headingTracking: 'tracking-tight',
        bodyStyle: 'font-sans',
        bodyWeight: 'font-normal',
        headingScale: 'text-base sm:text-lg',
        lineHeight: 'leading-relaxed',
      },
      cards: {
        borderRadius: 'rounded-xl',
        innerRadius: 'rounded-lg',
        borderStyle: 'border border-[#dfd7c5]',
        shadowStyle: 'shadow-2xs hover:border-emerald-800',
        padding: 'p-5 sm:p-6',
        density: 'balanced',
        cardBg: 'bg-[#fcfbf9]',
        highlightBorder: 'border-emerald-800 ring-2 ring-emerald-700/30 shadow-xs',
      },
      icons: {
        style: 'outline',
        size: 'w-4 h-4',
        containerShape: 'rounded-lg',
        containerBg: 'bg-emerald-800 text-white',
      },
      decoration: {
        level: 'minimal',
        shapes: 'geometric',
        pattern: 'lines',
        backgroundTreatment: '',
        badgeStyle: 'rounded-md px-2.5 py-0.5 text-[10px] font-serif font-bold uppercase tracking-wider border',
        showAccentBar: true,
      },
      composition: {
        density: 'balanced',
        whitespace: 'balanced',
        alignment: 'left',
        visualEmphasis: 'balanced',
        gridGap: 'gap-5',
      },
    };
  }

  // Generic customized adaptive style
  return {
    ...STYLE_MODERN_EDUKATIF,
    id: 'custom_style',
    name: 'Custom',
    tagline: 'Gaya Kustom Sesuai Arahan',
    description: customDescription || 'Gaya visual khusus berdasarkan instruksi pengguna dengan tetap menjaga keterbacaan materi.',
  };
}

/**
 * Main resolver: converts any visualStyle string into a full StyleConfig
 */
export function getStyleConfig(visualStyleName?: string, customDescription?: string): StyleConfig {
  if (!visualStyleName) return STYLE_MODERN_EDUKATIF;

  const normalized = visualStyleName.toLowerCase().trim();

  // 1. EDUKATIF & AKADEMIK
  if (normalized.includes('minimalis edukatif') || normalized === 'minimalis') {
    return STYLE_MINIMALIS;
  }
  if (normalized.includes('academic clean') || normalized.includes('akademik') || normalized.includes('elegan akademik')) {
    return STYLE_AKADEMIK;
  }
  if (normalized.includes('modern education') || normalized.includes('modern edukatif') || normalized.includes('vector education') || normalized.includes('flat design')) {
    return STYLE_MODERN_EDUKATIF;
  }

  // 2. VISUAL KREATIF
  if (normalized.includes('pop art') || normalized.includes('collage art') || normalized.includes('clay style')) {
    return STYLE_COLORFUL_INFOGRAFIS;
  }
  if (normalized.includes('handwritten') || normalized.includes('doodle education') || normalized.includes('ceria') || normalized.includes('kreatif')) {
    return STYLE_CERIA_KREATIF;
  }

  // 3. TEKNOLOGI & MASA DEPAN
  if (normalized.includes('futuristic') || normalized.includes('cyberpunk') || normalized.includes('glassmorphism') || normalized.includes('aurora') || normalized.includes('digital interface')) {
    return STYLE_PROFESIONAL;
  }

  // 4. DATA & INFORMASI
  if (normalized.includes('data visualization') || normalized.includes('timeline') || normalized.includes('diagrammatic') || normalized.includes('swiss design') || normalized.includes('editorial')) {
    return STYLE_PROFESIONAL;
  }

  // 5. KARAKTER & CERITA
  if (normalized.includes('storytelling') || normalized.includes('cartoon education') || normalized.includes('comic style') || normalized.includes('children friendly') || normalized.includes('character illustration') || normalized.includes('ramah anak')) {
    return STYLE_CERIA_KREATIF;
  }

  // 6. KLASIK & TEMATIK
  if (normalized.includes('vintage') || normalized.includes('victorian') || normalized.includes('bohemian') || normalized.includes('retro education') || normalized.includes('historical') || normalized.includes('klasik')) {
    return STYLE_AKADEMIK;
  }

  if (normalized.includes('ilustratif') || normalized.includes('visual interaktif')) {
    return STYLE_ILUSTRATIF;
  }
  if (normalized.includes('custom') || customDescription) {
    return buildCustomStyleConfig(customDescription || visualStyleName);
  }

  // Exact match search
  const found = AVAILABLE_STYLE_PRESETS.find(p => p.name.toLowerCase() === normalized);
  if (found) return found;

  // Default fallback
  return STYLE_MODERN_EDUKATIF;
}
