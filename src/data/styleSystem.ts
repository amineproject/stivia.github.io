import { 
  ColorPaletteTokens, 
  TypographyTokens, 
  CardTokens, 
  IconTokens, 
  DecorationTokens, 
  CompositionTokens, 
  StyleConfig,
  TypographyProfile
} from '../types';
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
  TYPOGRAPHY_RETRO,
  TYPOGRAPHY_MODERN_EDUKATIF,
  getTypographyProfile,
  createTypographyTokensFromProfile,
} from './typographyProfiles';

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
    borderRadius: 'rounded-lg',
    innerRadius: 'rounded-md',
    borderStyle: 'border border-stone-200',
    shadowStyle: 'shadow-none hover:border-stone-400',
    padding: 'p-6 sm:p-7',
    density: 'spacious',
    cardBg: 'bg-white',
    highlightBorder: 'border-stone-800 ring-2 ring-stone-300 shadow-none',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-md',
    containerBg: 'bg-stone-100 text-stone-800 border border-stone-300',
  },
  decoration: {
    level: 'none',
    shapes: 'minimal',
    pattern: 'none',
    backgroundTreatment: '',
    badgeStyle: 'rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide border',
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
    badgeStyle: 'rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide border shadow-2xs',
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
 * PRESET 4: Akademik Elegan
 */
export const STYLE_AKADEMIK: StyleConfig = {
  id: 'akademik',
  name: 'Akademik Elegan',
  tagline: 'Formal, Berwibawa & Terstruktur',
  description: 'Tipografi klasik terpandu, palet formal navy-emas, dan kartu berbingkai rapi untuk disiplin ilmiah.',
  colorPalette: {
    background: 'bg-slate-100/90',
    surface: 'bg-white',
    surfaceBorder: 'border-slate-300',
    primary: 'navy',
    primaryBg: 'bg-slate-900',
    primaryText: 'text-slate-900',
    primaryLight: 'bg-slate-100',
    primaryBorder: 'border-slate-300',
    secondary: 'amber',
    secondaryBg: 'bg-amber-700',
    secondaryText: 'text-amber-900',
    secondaryLight: 'bg-amber-50',
    secondaryBorder: 'border-amber-300',
    accent: 'emerald',
    accentBg: 'bg-emerald-800',
    accentText: 'text-emerald-900',
    accentLight: 'bg-emerald-50',
    accentBorder: 'border-emerald-300',
    textPrimary: 'text-slate-950',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    headerGradient: 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950',
    headerText: 'text-white',
    headerSubtext: 'text-amber-200',
    headerBadgeBg: 'bg-amber-500/20 border-amber-400/30 text-amber-100',
    footerBg: 'bg-slate-950 border-t border-slate-800 text-slate-300',
    footerText: 'text-slate-400',
    footerAccent: 'bg-amber-600 text-white',
    summaryBorder: 'border-slate-900 ring-2 ring-slate-800/20 shadow-xs',
    summaryBadge: 'text-slate-900 bg-slate-100 border-slate-300',
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
    borderStyle: 'border border-slate-300',
    shadowStyle: 'shadow-2xs hover:border-slate-500',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-[#fafafa]',
    highlightBorder: 'border-slate-900 ring-2 ring-slate-700/30 shadow-xs',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-lg',
    containerBg: 'bg-slate-900 text-amber-200 border border-slate-800',
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
    visualEmphasis: 'text_first',
    gridGap: 'gap-5',
  },
};

/**
 * PRESET 5: Futuristic & Cyber Tech
 */
export const STYLE_FUTURISTIC: StyleConfig = {
  id: 'futuristic',
  name: 'Futuristic',
  tagline: 'Teknologi Tinggi & Grid Digital',
  description: 'Nuansa masa depan dengan aksen cyan-violet glowing, HUD digital badges, dan grid teknologi modern.',
  colorPalette: {
    background: 'bg-slate-950',
    surface: 'bg-slate-900',
    surfaceBorder: 'border-cyan-500/30',
    primary: 'cyan',
    primaryBg: 'bg-cyan-500',
    primaryText: 'text-cyan-400',
    primaryLight: 'bg-cyan-950/40',
    primaryBorder: 'border-cyan-500/40',
    secondary: 'violet',
    secondaryBg: 'bg-violet-600',
    secondaryText: 'text-violet-300',
    secondaryLight: 'bg-violet-950/40',
    secondaryBorder: 'border-violet-500/40',
    accent: 'fuchsia',
    accentBg: 'bg-fuchsia-500',
    accentText: 'text-fuchsia-300',
    accentLight: 'bg-fuchsia-950/40',
    accentBorder: 'border-fuchsia-500/40',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950 border-b border-cyan-500/30',
    headerText: 'text-cyan-100',
    headerSubtext: 'text-cyan-300',
    headerBadgeBg: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200',
    footerBg: 'bg-slate-950 border-t border-cyan-500/30 text-cyan-200',
    footerText: 'text-slate-400',
    footerAccent: 'bg-cyan-500 text-slate-950 font-bold',
    summaryBorder: 'border-cyan-500 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/10',
    summaryBadge: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/50',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-black',
    headingTracking: 'tracking-wide',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-xl',
    innerRadius: 'rounded-lg',
    borderStyle: 'border border-cyan-500/30 backdrop-blur-md',
    shadowStyle: 'shadow-lg shadow-cyan-500/5 hover:border-cyan-400 hover:shadow-cyan-500/15',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-slate-900/90',
    highlightBorder: 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-cyan-500/20',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-lg',
    containerBg: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40',
  },
  decoration: {
    level: 'expressive',
    shapes: 'geometric',
    pattern: 'grid',
    backgroundTreatment: 'bg-[linear-gradient(to_right,#06b6d410_1px,transparent_1px),linear-gradient(to_bottom,#06b6d410_1px,transparent_1px)] bg-[size:24px_24px]',
    badgeStyle: 'rounded-md px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border border-cyan-500/40 bg-cyan-950/60 text-cyan-300',
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
 * PRESET 6: Pop Art
 */
export const STYLE_POP_ART: StyleConfig = {
  id: 'pop_art',
  name: 'Pop Art',
  tagline: 'Bold Halftone & Komik Energik',
  description: 'Garis luar hitam tebal, warna-warna primer cerah, pola titik halftone komik, dan badge bertema seru.',
  colorPalette: {
    background: 'bg-amber-100',
    surface: 'bg-white',
    surfaceBorder: 'border-3 border-black',
    primary: 'amber',
    primaryBg: 'bg-yellow-400',
    primaryText: 'text-black font-extrabold',
    primaryLight: 'bg-yellow-100',
    primaryBorder: 'border-2 border-black',
    secondary: 'rose',
    secondaryBg: 'bg-rose-500',
    secondaryText: 'text-black font-extrabold',
    secondaryLight: 'bg-rose-100',
    secondaryBorder: 'border-2 border-black',
    accent: 'sky',
    accentBg: 'bg-sky-400',
    accentText: 'text-black font-extrabold',
    accentLight: 'bg-sky-100',
    accentBorder: 'border-2 border-black',
    textPrimary: 'text-black',
    textSecondary: 'text-slate-900',
    textMuted: 'text-slate-600',
    headerGradient: 'bg-yellow-400 border-b-4 border-black text-black',
    headerText: 'text-black font-black',
    headerSubtext: 'text-black font-bold',
    headerBadgeBg: 'bg-white border-2 border-black text-black',
    footerBg: 'bg-black text-white border-t-4 border-yellow-400',
    footerText: 'text-yellow-200',
    footerAccent: 'bg-rose-500 text-white font-bold',
    summaryBorder: 'border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    summaryBadge: 'text-black bg-yellow-300 border-2 border-black font-black',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-black',
    headingTracking: 'tracking-tight',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-medium',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-snug',
  },
  cards: {
    borderRadius: 'rounded-xl',
    innerRadius: 'rounded-lg',
    borderStyle: 'border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    shadowStyle: 'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all',
    padding: 'p-5 sm:p-6',
    density: 'compact',
    cardBg: 'bg-white',
    highlightBorder: 'border-4 border-black shadow-[6px_6px_0px_0px_rgba(244,63,94,1)]',
  },
  icons: {
    style: 'filled',
    size: 'w-4 h-4',
    containerShape: 'rounded-lg',
    containerBg: 'bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
  },
  decoration: {
    level: 'expressive',
    shapes: 'playful',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#00000015_2px,transparent_2px)] [background-size:12px_12px]',
    badgeStyle: 'rounded-md px-3 py-1 text-[11px] font-black uppercase tracking-wider border-2 border-black bg-yellow-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    showAccentBar: false,
  },
  composition: {
    density: 'compact',
    whitespace: 'balanced',
    alignment: 'left',
    visualEmphasis: 'visual_first',
    gridGap: 'gap-5',
  },
};

/**
 * PRESET 7: Cyberpunk
 */
export const STYLE_CYBERPUNK: StyleConfig = {
  id: 'cyberpunk',
  name: 'Cyberpunk',
  tagline: 'Neon High-Tech & Kontras Ekstrem',
  description: 'Palet neon cyan-magenta dengan latar belakang gelap kontras tinggi, elemen siber terminal, dan garis tegas.',
  colorPalette: {
    background: 'bg-[#090a0f]',
    surface: 'bg-[#121420]',
    surfaceBorder: 'border-fuchsia-500/40',
    primary: 'fuchsia',
    primaryBg: 'bg-fuchsia-600',
    primaryText: 'text-fuchsia-400',
    primaryLight: 'bg-fuchsia-950/50',
    primaryBorder: 'border-fuchsia-500/50',
    secondary: 'cyan',
    secondaryBg: 'bg-cyan-500',
    secondaryText: 'text-cyan-300',
    secondaryLight: 'bg-cyan-950/50',
    secondaryBorder: 'border-cyan-500/50',
    accent: 'yellow',
    accentBg: 'bg-yellow-400',
    accentText: 'text-yellow-300',
    accentLight: 'bg-yellow-950/50',
    accentBorder: 'border-yellow-500/50',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-fuchsia-950 via-[#121420] to-cyan-950 border-b-2 border-fuchsia-500',
    headerText: 'text-cyan-200 font-mono',
    headerSubtext: 'text-fuchsia-300',
    headerBadgeBg: 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-200',
    footerBg: 'bg-[#090a0f] border-t border-fuchsia-500/50 text-cyan-300',
    footerText: 'text-slate-400',
    footerAccent: 'bg-fuchsia-600 text-white font-mono',
    summaryBorder: 'border-fuchsia-500 ring-2 ring-cyan-500 shadow-lg shadow-fuchsia-500/20',
    summaryBadge: 'text-cyan-300 bg-cyan-950 border-cyan-400 font-mono',
  },
  typography: {
    fontFamily: 'font-mono',
    headingFont: 'font-mono',
    headingWeight: 'font-black',
    headingTracking: 'tracking-tight',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-none',
    innerRadius: 'rounded-none',
    borderStyle: 'border border-fuchsia-500/40 border-l-4 border-l-cyan-400',
    shadowStyle: 'shadow-md shadow-fuchsia-500/10 hover:border-cyan-400',
    padding: 'p-5 sm:p-6',
    density: 'compact',
    cardBg: 'bg-[#121420]/95',
    highlightBorder: 'border-2 border-cyan-400 ring-2 ring-fuchsia-500',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-none',
    containerBg: 'bg-fuchsia-950 text-cyan-300 border border-cyan-400',
  },
  decoration: {
    level: 'expressive',
    shapes: 'geometric',
    pattern: 'grid',
    backgroundTreatment: 'bg-[linear-gradient(to_right,#ec489915_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:20px_20px]',
    badgeStyle: 'rounded-none px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border border-cyan-400 bg-black text-cyan-300',
    showAccentBar: true,
  },
  composition: {
    density: 'compact',
    whitespace: 'balanced',
    alignment: 'left',
    visualEmphasis: 'balanced',
    gridGap: 'gap-5',
  },
};

/**
 * PRESET 8: Clay Style (3D Soft Tactile)
 */
export const STYLE_CLAY_STYLE: StyleConfig = {
  id: 'clay_style',
  name: 'Clay Style',
  tagline: 'Sentuhan 3D Lembut & Ramah',
  description: 'Efek claymorphic tanah liat 3D dengan sudut bulat lembut, bayangan halus, dan suasana belajar yang hangat.',
  colorPalette: {
    background: 'bg-orange-50/50',
    surface: 'bg-[#ffffff]',
    surfaceBorder: 'border-orange-200',
    primary: 'orange',
    primaryBg: 'bg-orange-500',
    primaryText: 'text-orange-900',
    primaryLight: 'bg-orange-100',
    primaryBorder: 'border-orange-300',
    secondary: 'teal',
    secondaryBg: 'bg-teal-500',
    secondaryText: 'text-teal-900',
    secondaryLight: 'bg-teal-100',
    secondaryBorder: 'border-teal-300',
    accent: 'purple',
    accentBg: 'bg-purple-500',
    accentText: 'text-purple-900',
    accentLight: 'bg-purple-100',
    accentBorder: 'border-purple-300',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400',
    headerText: 'text-white',
    headerSubtext: 'text-orange-950',
    headerBadgeBg: 'bg-white/30 border-white/40 text-orange-950 font-bold',
    footerBg: 'bg-slate-900 text-orange-100',
    footerText: 'text-orange-200/80',
    footerAccent: 'bg-orange-500 text-white font-bold',
    summaryBorder: 'border-orange-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_10px_20px_rgba(249,115,22,0.15)]',
    summaryBadge: 'text-orange-900 bg-orange-100 border-orange-300',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-extrabold',
    headingTracking: 'tracking-tight',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-medium',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-3xl',
    innerRadius: 'rounded-2xl',
    borderStyle: 'border border-orange-200/60',
    shadowStyle: 'shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_8px_16px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_12px_24px_rgba(249,115,22,0.12)]',
    padding: 'p-6',
    density: 'spacious',
    cardBg: 'bg-[#ffffff]',
    highlightBorder: 'border-2 border-orange-400 ring-4 ring-orange-200',
  },
  icons: {
    style: 'filled',
    size: 'w-4 h-4',
    containerShape: 'rounded-2xl',
    containerBg: 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-sm',
  },
  decoration: {
    level: 'expressive',
    shapes: 'playful',
    pattern: 'none',
    backgroundTreatment: '',
    badgeStyle: 'rounded-full px-3 py-1 text-[11px] font-bold shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.05)]',
    showAccentBar: false,
  },
  composition: {
    density: 'spacious',
    whitespace: 'generous',
    alignment: 'left',
    visualEmphasis: 'visual_first',
    gridGap: 'gap-6',
  },
};

/**
 * PRESET 9: Swiss Design (Grid Ketat & Tipografi Kuat)
 */
export const STYLE_SWISS_DESIGN: StyleConfig = {
  id: 'swiss_design',
  name: 'Swiss Design',
  tagline: 'Grid Matematis & Tipografi Kuat',
  description: 'Sistem tata letak presisi tinggi, tipografi sans-serif tebal, kontras hitam-putih-merah, dan keterbacaan mutlak.',
  colorPalette: {
    background: 'bg-[#f4f4f4]',
    surface: 'bg-white',
    surfaceBorder: 'border-2 border-black',
    primary: 'red',
    primaryBg: 'bg-[#e11d48]',
    primaryText: 'text-[#e11d48]',
    primaryLight: 'bg-red-50',
    primaryBorder: 'border-black',
    secondary: 'slate',
    secondaryBg: 'bg-black',
    secondaryText: 'text-black',
    secondaryLight: 'bg-slate-100',
    secondaryBorder: 'border-black',
    accent: 'red',
    accentBg: 'bg-[#e11d48]',
    accentText: 'text-[#e11d48]',
    accentLight: 'bg-red-50',
    accentBorder: 'border-black',
    textPrimary: 'text-black',
    textSecondary: 'text-slate-800',
    textMuted: 'text-slate-500',
    headerGradient: 'bg-black border-b-4 border-[#e11d48] text-white',
    headerText: 'text-white font-black',
    headerSubtext: 'text-red-200 font-bold',
    headerBadgeBg: 'bg-[#e11d48] text-white border-none',
    footerBg: 'bg-black text-white border-t-2 border-black',
    footerText: 'text-slate-400',
    footerAccent: 'bg-[#e11d48] text-white font-bold',
    summaryBorder: 'border-2 border-black ring-4 ring-[#e11d48]/20',
    summaryBadge: 'text-white bg-[#e11d48] border-none font-bold',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-black',
    headingTracking: 'tracking-tighter',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-medium',
    headingScale: 'text-base sm:text-xl',
    lineHeight: 'leading-tight',
  },
  cards: {
    borderRadius: 'rounded-none',
    innerRadius: 'rounded-none',
    borderStyle: 'border-2 border-black',
    shadowStyle: 'shadow-none hover:bg-slate-50',
    padding: 'p-6',
    density: 'compact',
    cardBg: 'bg-white',
    highlightBorder: 'border-4 border-[#e11d48]',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-none',
    containerBg: 'bg-black text-white',
  },
  decoration: {
    level: 'minimal',
    shapes: 'geometric',
    pattern: 'none',
    backgroundTreatment: '',
    badgeStyle: 'rounded-none px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-black text-white',
    showAccentBar: true,
  },
  composition: {
    density: 'compact',
    whitespace: 'balanced',
    alignment: 'left',
    visualEmphasis: 'text_first',
    gridGap: 'gap-6',
  },
};

/**
 * PRESET 10: Editorial (Majalah Ilmiah & Publikasi)
 */
export const STYLE_EDITORIAL: StyleConfig = {
  id: 'editorial',
  name: 'Editorial',
  tagline: 'Gaya Majalah Edukatif & Serif Elegan',
  description: 'Tipografi serif klasik berkualitas tinggi, pembagian kolom majalah berkelas, dan bingkai bernuansa editorial.',
  colorPalette: {
    background: 'bg-[#fcfbf9]',
    surface: 'bg-[#ffffff]',
    surfaceBorder: 'border-[#dfd7c5]',
    primary: 'emerald',
    primaryBg: 'bg-[#1c3d2e]',
    primaryText: 'text-[#1c3d2e]',
    primaryLight: 'bg-[#edf5f0]',
    primaryBorder: 'border-[#b8d4c3]',
    secondary: 'amber',
    secondaryBg: 'bg-[#8a5d25]',
    secondaryText: 'text-[#8a5d25]',
    secondaryLight: 'bg-[#f9f3ea]',
    secondaryBorder: 'border-[#ded1be]',
    accent: 'stone',
    accentBg: 'bg-stone-700',
    accentText: 'text-stone-900',
    accentLight: 'bg-stone-100',
    accentBorder: 'border-stone-300',
    textPrimary: 'text-[#1c241d]',
    textSecondary: 'text-[#444f46]',
    textMuted: 'text-[#7d8c80]',
    headerGradient: 'bg-gradient-to-r from-[#14261c] via-[#1c3d2e] to-[#14261c] text-[#f4f1ea]',
    headerText: 'text-[#f4f1ea] font-serif',
    headerSubtext: 'text-[#c6dcbe]',
    headerBadgeBg: 'bg-white/15 border-white/20 text-[#f4f1ea]',
    footerBg: 'bg-[#14261c] text-[#d6cdbd]',
    footerText: 'text-[#a99f8d]',
    footerAccent: 'bg-[#1c3d2e] text-white',
    summaryBorder: 'border-[#1c3d2e] ring-1 ring-[#1c3d2e]/30 shadow-xs',
    summaryBadge: 'text-[#1c3d2e] bg-[#edf5f0] border-[#b8d4c3] font-serif',
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
    shadowStyle: 'shadow-2xs hover:border-[#1c3d2e]',
    padding: 'p-6',
    density: 'balanced',
    cardBg: 'bg-[#ffffff]',
    highlightBorder: 'border-[#1c3d2e] ring-2 ring-[#1c3d2e]/20',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-lg',
    containerBg: 'bg-[#1c3d2e] text-white',
  },
  decoration: {
    level: 'minimal',
    shapes: 'geometric',
    pattern: 'lines',
    backgroundTreatment: '',
    badgeStyle: 'rounded-md px-2.5 py-0.5 text-[10px] font-serif font-bold uppercase tracking-wider border border-[#b8d4c3] bg-[#edf5f0] text-[#1c3d2e]',
    showAccentBar: true,
  },
  composition: {
    density: 'balanced',
    whitespace: 'balanced',
    alignment: 'left',
    visualEmphasis: 'text_first',
    gridGap: 'gap-5',
  },
};

/**
 * PRESET 11: Handwritten & Doodle
 */
export const STYLE_HANDWRITTEN: StyleConfig = {
  id: 'handwritten',
  name: 'Handwritten',
  tagline: 'Sketsa Tulisan Tangan & Catatan Guru',
  description: 'Nuansa catatan belajar personal dengan garis sketsa organik, aksen tulisan tangan, dan border bergaya buku tulis.',
  colorPalette: {
    background: 'bg-[#fdfaf5]',
    surface: 'bg-white',
    surfaceBorder: 'border-2 border-dashed border-amber-300',
    primary: 'amber',
    primaryBg: 'bg-amber-600',
    primaryText: 'text-amber-900',
    primaryLight: 'bg-amber-50',
    primaryBorder: 'border-amber-300',
    secondary: 'sky',
    secondaryBg: 'bg-sky-600',
    secondaryText: 'text-sky-900',
    secondaryLight: 'bg-sky-50',
    secondaryBorder: 'border-sky-300',
    accent: 'rose',
    accentBg: 'bg-rose-500',
    accentText: 'text-rose-900',
    accentLight: 'bg-rose-50',
    accentBorder: 'border-rose-300',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-amber-600 to-orange-500 text-white border-b-2 border-dashed border-amber-300',
    headerText: 'text-white font-bold',
    headerSubtext: 'text-amber-100',
    headerBadgeBg: 'bg-white/20 border border-white/40 text-white',
    footerBg: 'bg-slate-900 text-amber-100',
    footerText: 'text-amber-200/80',
    footerAccent: 'bg-amber-500 text-slate-950 font-bold',
    summaryBorder: 'border-2 border-dashed border-amber-500 ring-2 ring-amber-300/30',
    summaryBadge: 'text-amber-900 bg-amber-100 border border-amber-400',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-extrabold',
    headingTracking: 'tracking-normal',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-2xl',
    innerRadius: 'rounded-xl',
    borderStyle: 'border-2 border-dashed border-amber-300/90',
    shadowStyle: 'shadow-xs hover:border-amber-400',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-white',
    highlightBorder: 'border-2 border-dashed border-amber-500 ring-2 ring-amber-300',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-xl',
    containerBg: 'bg-amber-100 text-amber-800 border border-amber-300',
  },
  decoration: {
    level: 'expressive',
    shapes: 'playful',
    pattern: 'lines',
    backgroundTreatment: 'bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:16px_16px]',
    badgeStyle: 'rounded-xl px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border-2 border-dashed border-amber-300 bg-amber-50 text-amber-900',
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
 * PRESET 12: Glassmorphism
 */
export const STYLE_GLASSMORPHISM: StyleConfig = {
  id: 'glassmorphism',
  name: 'Glassmorphism',
  tagline: 'Kaca Transparan & Lapisan Elegan',
  description: 'Kartu frosted glass berlatar belakang gradasi halus dengan border tipis berkilau yang elegan.',
  colorPalette: {
    background: 'bg-gradient-to-br from-indigo-100 via-sky-50 to-teal-100',
    surface: 'bg-white/70 backdrop-blur-md',
    surfaceBorder: 'border-white/60',
    primary: 'indigo',
    primaryBg: 'bg-indigo-600',
    primaryText: 'text-indigo-800',
    primaryLight: 'bg-indigo-50/70 backdrop-blur-xs',
    primaryBorder: 'border-indigo-200/60',
    secondary: 'teal',
    secondaryBg: 'bg-teal-600',
    secondaryText: 'text-teal-800',
    secondaryLight: 'bg-teal-50/70 backdrop-blur-xs',
    secondaryBorder: 'border-teal-200/60',
    accent: 'sky',
    accentBg: 'bg-sky-500',
    accentText: 'text-sky-800',
    accentLight: 'bg-sky-50/70 backdrop-blur-xs',
    accentBorder: 'border-sky-200/60',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    headerGradient: 'bg-gradient-to-r from-indigo-900/90 via-sky-900/90 to-teal-900/90 backdrop-blur-md text-white border-b border-white/20',
    headerText: 'text-white',
    headerSubtext: 'text-sky-200',
    headerBadgeBg: 'bg-white/20 border-white/30 text-white',
    footerBg: 'bg-slate-900/90 backdrop-blur-md text-white',
    footerText: 'text-slate-300',
    footerAccent: 'bg-indigo-600 text-white font-bold',
    summaryBorder: 'border-white/80 ring-2 ring-indigo-400/30 shadow-lg shadow-indigo-500/10',
    summaryBadge: 'text-indigo-800 bg-white/80 border-indigo-200',
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
    borderStyle: 'border border-white/80 backdrop-blur-md',
    shadowStyle: 'shadow-md shadow-indigo-500/5 hover:shadow-lg hover:border-white',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-white/75',
    highlightBorder: 'border-2 border-indigo-500 ring-2 ring-indigo-400/30 shadow-md',
  },
  icons: {
    style: 'rounded-box',
    size: 'w-4 h-4',
    containerShape: 'rounded-xl',
    containerBg: 'bg-indigo-600 text-white shadow-xs',
  },
  decoration: {
    level: 'expressive',
    shapes: 'geometric',
    pattern: 'none',
    backgroundTreatment: '',
    badgeStyle: 'rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide border border-white/80 bg-white/60 backdrop-blur-xs text-indigo-900 shadow-2xs',
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
 * PRESET 13: Aurora (Gradasi Cahaya Kutub)
 */
export const STYLE_AURORA: StyleConfig = {
  id: 'aurora',
  name: 'Aurora',
  tagline: 'Cahaya Kutub & Gradasi Lembut',
  description: 'Palet gradasi lembut teal-emerald-violet bertekstur cahaya kutub malam yang menenangkan.',
  colorPalette: {
    background: 'bg-slate-950',
    surface: 'bg-slate-900/90',
    surfaceBorder: 'border-teal-500/30',
    primary: 'teal',
    primaryBg: 'bg-teal-500',
    primaryText: 'text-teal-300',
    primaryLight: 'bg-teal-950/40',
    primaryBorder: 'border-teal-500/40',
    secondary: 'emerald',
    secondaryBg: 'bg-emerald-500',
    secondaryText: 'text-emerald-300',
    secondaryLight: 'bg-emerald-950/40',
    secondaryBorder: 'border-emerald-500/40',
    accent: 'violet',
    accentBg: 'bg-violet-500',
    accentText: 'text-violet-300',
    accentLight: 'bg-violet-950/40',
    accentBorder: 'border-violet-500/40',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-teal-900 via-emerald-900 to-violet-900 text-white border-b border-teal-500/30',
    headerText: 'text-teal-100',
    headerSubtext: 'text-emerald-200',
    headerBadgeBg: 'bg-teal-500/20 border-teal-400/40 text-teal-200',
    footerBg: 'bg-slate-950 border-t border-teal-500/30 text-teal-200',
    footerText: 'text-slate-400',
    footerAccent: 'bg-teal-500 text-slate-950 font-bold',
    summaryBorder: 'border-teal-400 ring-2 ring-emerald-500/30 shadow-lg shadow-teal-500/10',
    summaryBadge: 'text-teal-300 bg-teal-950/80 border-teal-400/40',
  },
  typography: {
    fontFamily: 'font-sans',
    headingFont: 'font-sans',
    headingWeight: 'font-bold',
    headingTracking: 'tracking-tight',
    bodyStyle: 'font-sans',
    bodyWeight: 'font-normal',
    headingScale: 'text-base sm:text-lg',
    lineHeight: 'leading-relaxed',
  },
  cards: {
    borderRadius: 'rounded-2xl',
    innerRadius: 'rounded-xl',
    borderStyle: 'border border-teal-500/30',
    shadowStyle: 'shadow-lg shadow-teal-500/5 hover:border-teal-400 hover:shadow-teal-500/15',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-slate-900/90',
    highlightBorder: 'border-teal-400 ring-2 ring-emerald-400/30',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-xl',
    containerBg: 'bg-teal-500/20 text-teal-300 border border-teal-400/30',
  },
  decoration: {
    level: 'expressive',
    shapes: 'geometric',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#14b8a620_1px,transparent_1px)] [background-size:20px_20px]',
    badgeStyle: 'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-teal-400/40 bg-teal-950/80 text-teal-300',
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
 * PRESET 14: Bohemian (Earthy Terracotta & Botanical)
 */
export const STYLE_BOHEMIAN: StyleConfig = {
  id: 'bohemian',
  name: 'Bohemian',
  tagline: 'Warna Alami Bumi & Nuansa Botani',
  description: 'Palet terracotta, sage green, warm beige, dan aksen organik ramah lingkungan.',
  colorPalette: {
    background: 'bg-[#fbf7f2]',
    surface: 'bg-[#ffffff]',
    surfaceBorder: 'border-[#e3d7c7]',
    primary: 'amber',
    primaryBg: 'bg-[#c26d48]',
    primaryText: 'text-[#9c4d29]',
    primaryLight: 'bg-[#f7ece5]',
    primaryBorder: 'border-[#e4cfc2]',
    secondary: 'emerald',
    secondaryBg: 'bg-[#5c7a65]',
    secondaryText: 'text-[#3f5747]',
    secondaryLight: 'bg-[#edf3ee]',
    secondaryBorder: 'border-[#cfded2]',
    accent: 'stone',
    accentBg: 'bg-[#8c7866]',
    accentText: 'text-[#5e4f42]',
    accentLight: 'bg-[#f2eee9]',
    accentBorder: 'border-[#ded6cd]',
    textPrimary: 'text-[#2e261f]',
    textSecondary: 'text-[#574a3f]',
    textMuted: 'text-[#8c7e73]',
    headerGradient: 'bg-gradient-to-r from-[#9c4d29] via-[#c26d48] to-[#5c7a65] text-white',
    headerText: 'text-white',
    headerSubtext: 'text-amber-100',
    headerBadgeBg: 'bg-white/20 border-white/30 text-white',
    footerBg: 'bg-[#2e261f] text-[#fbf7f2]',
    footerText: 'text-[#cfded2]',
    footerAccent: 'bg-[#c26d48] text-white font-bold',
    summaryBorder: 'border-[#c26d48] ring-2 ring-[#c26d48]/20 shadow-xs',
    summaryBadge: 'text-[#9c4d29] bg-[#f7ece5] border-[#e4cfc2]',
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
    borderRadius: 'rounded-2xl',
    innerRadius: 'rounded-xl',
    borderStyle: 'border border-[#e3d7c7]',
    shadowStyle: 'shadow-2xs hover:border-[#c26d48]',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-[#ffffff]',
    highlightBorder: 'border-2 border-[#c26d48] ring-2 ring-[#c26d48]/20',
  },
  icons: {
    style: 'filled',
    size: 'w-4 h-4',
    containerShape: 'rounded-xl',
    containerBg: 'bg-[#c26d48] text-white',
  },
  decoration: {
    level: 'minimal',
    shapes: 'playful',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#e3d7c7_1px,transparent_1px)] [background-size:16px_16px]',
    badgeStyle: 'rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-[#e4cfc2] bg-[#f7ece5] text-[#9c4d29]',
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
 * PRESET 15: Vector Art & Flat Design
 */
export const STYLE_VECTOR_ART: StyleConfig = {
  id: 'vector_art',
  name: 'Vector Art',
  tagline: 'Vektor Tajam & Geometri Bersih',
  description: 'Ilustrasi vektor bersih, bentuk flat terstandar, ikon solid berenergi, dan keterbacaan tinggi.',
  colorPalette: {
    background: 'bg-slate-100/90',
    surface: 'bg-white',
    surfaceBorder: 'border-slate-300',
    primary: 'indigo',
    primaryBg: 'bg-blue-600',
    primaryText: 'text-blue-700',
    primaryLight: 'bg-blue-50',
    primaryBorder: 'border-blue-200',
    secondary: 'emerald',
    secondaryBg: 'bg-emerald-600',
    secondaryText: 'text-emerald-700',
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
    headerGradient: 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white',
    headerText: 'text-white font-black',
    headerSubtext: 'text-blue-100',
    headerBadgeBg: 'bg-white/20 border-white/30 text-white',
    footerBg: 'bg-slate-900 text-white',
    footerText: 'text-slate-400',
    footerAccent: 'bg-blue-600 text-white font-bold',
    summaryBorder: 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm',
    summaryBadge: 'text-blue-800 bg-blue-50 border-blue-200',
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
    borderRadius: 'rounded-xl',
    innerRadius: 'rounded-lg',
    borderStyle: 'border border-slate-200',
    shadowStyle: 'shadow-xs hover:border-blue-400 hover:shadow-sm',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-white',
    highlightBorder: 'border-2 border-blue-600 ring-2 ring-blue-400/20 shadow-sm',
  },
  icons: {
    style: 'filled',
    size: 'w-4 h-4',
    containerShape: 'rounded-lg',
    containerBg: 'bg-blue-600 text-white',
  },
  decoration: {
    level: 'minimal',
    shapes: 'geometric',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]',
    badgeStyle: 'rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
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
 * PRESET 16: Maximalism
 * Kaya detail visual, warna berani, ornamen berlapis, kehadiran visual bertenaga.
 */
export const STYLE_MAXIMALISM: StyleConfig = {
  id: 'maximalism',
  name: 'Maximalism',
  tagline: 'Kaya Detail, Berani & Penuh Energi Visual',
  description: 'Gaya ekspresif dengan detail kaya, ornamen beragam, warna berani, dan tipografi tegas penuh percaya diri.',
  colorPalette: {
    background: 'bg-amber-50/50',
    surface: 'bg-white',
    surfaceBorder: 'border-amber-300',
    primary: 'amber',
    primaryBg: 'bg-amber-600',
    primaryText: 'text-amber-800',
    primaryLight: 'bg-amber-100',
    primaryBorder: 'border-amber-400',
    secondary: 'violet',
    secondaryBg: 'bg-violet-700',
    secondaryText: 'text-violet-800',
    secondaryLight: 'bg-violet-100',
    secondaryBorder: 'border-violet-300',
    accent: 'rose',
    accentBg: 'bg-rose-600',
    accentText: 'text-rose-800',
    accentLight: 'bg-rose-100',
    accentBorder: 'border-rose-300',
    textPrimary: 'text-slate-950',
    textSecondary: 'text-slate-800',
    textMuted: 'text-slate-500',
    headerGradient: 'bg-gradient-to-r from-amber-700 via-rose-700 to-violet-800 text-white',
    headerText: 'text-white font-black',
    headerSubtext: 'text-amber-100',
    headerBadgeBg: 'bg-white/20 border-white/30 text-white',
    footerBg: 'bg-slate-950 text-white',
    footerText: 'text-amber-200',
    footerAccent: 'bg-amber-500 text-slate-950 font-black',
    summaryBorder: 'border-amber-600 ring-2 ring-amber-400/30 shadow-md',
    summaryBadge: 'text-amber-900 bg-amber-100 border-amber-300',
  },
  typographyProfile: TYPOGRAPHY_MAXIMALISM,
  typography: createTypographyTokensFromProfile(TYPOGRAPHY_MAXIMALISM),
  cards: {
    borderRadius: 'rounded-2xl',
    innerRadius: 'rounded-xl',
    borderStyle: 'border-2 border-amber-300 shadow-sm',
    shadowStyle: 'shadow-md hover:shadow-lg hover:border-amber-500',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-white',
    highlightBorder: 'border-2 border-amber-600 ring-2 ring-amber-400/30 shadow-lg',
  },
  icons: {
    style: 'geometric',
    size: 'w-4 h-4',
    containerShape: 'rounded-xl',
    containerBg: 'bg-amber-600 text-white shadow-sm',
  },
  decoration: {
    level: 'expressive',
    shapes: 'geometric',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:20px_20px]',
    badgeStyle: 'rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider',
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
 * PRESET 17: Collage Art
 * Guntingan majalah artistik, palet monokromatik dengan aksen tajam, tekstur kaya.
 */
export const STYLE_COLLAGE_ART: StyleConfig = {
  id: 'collage_art',
  name: 'Collage Art',
  tagline: 'Guntingan Majalah & Tekstur Kolase Artistik',
  description: 'Komposisi kreatif bergaya guntingan kertas dan majalah dengan kontras tajam serta tipografi display tegas.',
  colorPalette: {
    background: 'bg-stone-100',
    surface: 'bg-white',
    surfaceBorder: 'border-stone-400',
    primary: 'red',
    primaryBg: 'bg-red-700',
    primaryText: 'text-red-800',
    primaryLight: 'bg-red-50',
    primaryBorder: 'border-red-400',
    secondary: 'stone',
    secondaryBg: 'bg-stone-800',
    secondaryText: 'text-stone-900',
    secondaryLight: 'bg-stone-200',
    secondaryBorder: 'border-stone-400',
    accent: 'yellow',
    accentBg: 'bg-yellow-400',
    accentText: 'text-stone-950',
    accentLight: 'bg-yellow-100',
    accentBorder: 'border-yellow-400',
    textPrimary: 'text-stone-950',
    textSecondary: 'text-stone-700',
    textMuted: 'text-stone-500',
    headerGradient: 'bg-gradient-to-r from-stone-900 via-red-900 to-black text-white',
    headerText: 'text-white font-black',
    headerSubtext: 'text-stone-200',
    headerBadgeBg: 'bg-yellow-400 text-stone-950 font-black',
    footerBg: 'bg-stone-950 text-white',
    footerText: 'text-stone-400',
    footerAccent: 'bg-red-600 text-white font-black',
    summaryBorder: 'border-2 border-red-700 ring-2 ring-stone-400',
    summaryBadge: 'text-white bg-red-700 border-red-800',
  },
  typographyProfile: TYPOGRAPHY_COLLAGE_ART,
  typography: createTypographyTokensFromProfile(TYPOGRAPHY_COLLAGE_ART),
  cards: {
    borderRadius: 'rounded-none',
    innerRadius: 'rounded-none',
    borderStyle: 'border-2 border-stone-800 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)]',
    shadowStyle: 'shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-stone-50',
    highlightBorder: 'border-2 border-red-700 shadow-[5px_5px_0px_0px_rgba(185,28,28,1)]',
  },
  icons: {
    style: 'geometric',
    size: 'w-4 h-4',
    containerShape: 'rounded-none',
    containerBg: 'bg-stone-900 text-white',
  },
  decoration: {
    level: 'expressive',
    shapes: 'geometric',
    pattern: 'lines',
    backgroundTreatment: 'bg-[radial-gradient(#a8a29e_1px,transparent_1px)] [background-size:12px_12px]',
    badgeStyle: 'rounded-none px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider',
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
 * PRESET 18: Pixel Style
 * Retro arcade 8-bit/16-bit, warna neon cerah, grid tegas.
 */
export const STYLE_PIXEL_STYLE: StyleConfig = {
  id: 'pixel_style',
  name: 'Pixel Style',
  tagline: 'Nostalgia Game Retro 8-Bit & Grid Modular',
  description: 'Estetika video game pixel art retro dengan sudut modular tajam, warna arcade semarak, dan teks materi bersih.',
  colorPalette: {
    background: 'bg-slate-950 text-white',
    surface: 'bg-slate-900',
    surfaceBorder: 'border-emerald-500/70',
    primary: 'emerald',
    primaryBg: 'bg-emerald-500',
    primaryText: 'text-emerald-400',
    primaryLight: 'bg-emerald-950/80',
    primaryBorder: 'border-emerald-400',
    secondary: 'fuchsia',
    secondaryBg: 'bg-fuchsia-500',
    secondaryText: 'text-fuchsia-400',
    secondaryLight: 'bg-fuchsia-950/80',
    secondaryBorder: 'border-fuchsia-400',
    accent: 'yellow',
    accentBg: 'bg-yellow-400',
    accentText: 'text-yellow-300',
    accentLight: 'bg-yellow-950/80',
    accentBorder: 'border-yellow-400',
    textPrimary: 'text-emerald-100',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-500',
    headerGradient: 'bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-emerald-400',
    headerText: 'text-yellow-300 font-bold',
    headerSubtext: 'text-emerald-200',
    headerBadgeBg: 'bg-emerald-500/20 border border-emerald-400 text-emerald-300',
    footerBg: 'bg-black text-emerald-400',
    footerText: 'text-slate-400',
    footerAccent: 'bg-emerald-500 text-slate-950 font-bold',
    summaryBorder: 'border-2 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.4)]',
    summaryBadge: 'text-yellow-300 bg-yellow-950 border border-yellow-400',
  },
  typographyProfile: TYPOGRAPHY_PIXEL_STYLE,
  typography: createTypographyTokensFromProfile(TYPOGRAPHY_PIXEL_STYLE),
  cards: {
    borderRadius: 'rounded-none',
    innerRadius: 'rounded-none',
    borderStyle: 'border-2 border-emerald-500/80 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)]',
    shadowStyle: 'shadow-[4px_4px_0px_0px_rgba(16,185,129,0.4)] hover:border-emerald-400',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-slate-900/90',
    highlightBorder: 'border-2 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(250,204,21,0.6)]',
  },
  icons: {
    style: 'geometric',
    size: 'w-4 h-4',
    containerShape: 'rounded-none',
    containerBg: 'bg-emerald-500 text-slate-950',
  },
  decoration: {
    level: 'expressive',
    shapes: 'geometric',
    pattern: 'grid',
    backgroundTreatment: 'bg-[linear-gradient(to_right,#064e3b15_1px,transparent_1px),linear-gradient(to_bottom,#064e3b15_1px,transparent_1px)] bg-[size:16px_16px]',
    badgeStyle: 'rounded-none px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
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
 * PRESET 19: Y2K
 * Estetika retro-futuristik era 2000-an, kilau chrome dan cyan-magenta.
 */
export const STYLE_Y2K: StyleConfig = {
  id: 'y2k',
  name: 'Y2K',
  tagline: 'Retro-Futuristik Era 2000-an & Aksen Cyber Metalik',
  description: 'Estetika pergantian milenium dengan lengkungan geometris khas, warna biru es, magenta elektrik, dan tipografi Space Grotesk.',
  colorPalette: {
    background: 'bg-slate-100',
    surface: 'bg-white',
    surfaceBorder: 'border-cyan-300',
    primary: 'cyan',
    primaryBg: 'bg-cyan-500',
    primaryText: 'text-cyan-800',
    primaryLight: 'bg-cyan-50',
    primaryBorder: 'border-cyan-300',
    secondary: 'fuchsia',
    secondaryBg: 'bg-fuchsia-500',
    secondaryText: 'text-fuchsia-800',
    secondaryLight: 'bg-fuchsia-50',
    secondaryBorder: 'border-fuchsia-300',
    accent: 'blue',
    accentBg: 'bg-blue-600',
    accentText: 'text-blue-800',
    accentLight: 'bg-blue-50',
    accentBorder: 'border-blue-300',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 text-white',
    headerText: 'text-white font-black',
    headerSubtext: 'text-cyan-100',
    headerBadgeBg: 'bg-white/20 border-white/30 text-white',
    footerBg: 'bg-slate-900 text-white',
    footerText: 'text-cyan-300',
    footerAccent: 'bg-cyan-400 text-slate-900 font-black',
    summaryBorder: 'border-2 border-cyan-400 ring-2 ring-cyan-200 shadow-sm',
    summaryBadge: 'text-cyan-900 bg-cyan-100 border-cyan-300',
  },
  typographyProfile: TYPOGRAPHY_Y2K,
  typography: createTypographyTokensFromProfile(TYPOGRAPHY_Y2K),
  cards: {
    borderRadius: 'rounded-3xl',
    innerRadius: 'rounded-2xl',
    borderStyle: 'border border-cyan-200 shadow-sm',
    shadowStyle: 'shadow-md hover:shadow-cyan-500/10 hover:border-cyan-400',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-white/95',
    highlightBorder: 'border-2 border-cyan-500 ring-2 ring-cyan-300/30 shadow-md',
  },
  icons: {
    style: 'rounded-box',
    size: 'w-4 h-4',
    containerShape: 'rounded-2xl',
    containerBg: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm',
  },
  decoration: {
    level: 'moderate',
    shapes: 'organic',
    pattern: 'grid',
    backgroundTreatment: 'bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px]',
    badgeStyle: 'rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider',
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
 * PRESET 20: Surrealism
 * Puitis, imajinatif, atmosfer mistis dengan nuansa indigo-violet dan emas.
 */
export const STYLE_SURREALISM: StyleConfig = {
  id: 'surrealism',
  name: 'Surrealism',
  tagline: 'Puitis, Imajinatif & Eksplorasi Artistik',
  description: 'Sentuhan seni surealis yang memadukan keajaiban imajinasi visual, warna malam mistis, dan tipografi berwibawa.',
  colorPalette: {
    background: 'bg-slate-900 text-white',
    surface: 'bg-slate-800/90',
    surfaceBorder: 'border-indigo-700/60',
    primary: 'indigo',
    primaryBg: 'bg-indigo-600',
    primaryText: 'text-indigo-300',
    primaryLight: 'bg-indigo-950/80',
    primaryBorder: 'border-indigo-500/50',
    secondary: 'purple',
    secondaryBg: 'bg-purple-600',
    secondaryText: 'text-purple-300',
    secondaryLight: 'bg-purple-950/80',
    secondaryBorder: 'border-purple-500/50',
    accent: 'amber',
    accentBg: 'bg-amber-400',
    accentText: 'text-amber-300',
    accentLight: 'bg-amber-950/80',
    accentBorder: 'border-amber-400/60',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    headerGradient: 'bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 text-white',
    headerText: 'text-amber-300 font-bold',
    headerSubtext: 'text-indigo-200',
    headerBadgeBg: 'bg-indigo-500/20 border border-indigo-400/40 text-indigo-200',
    footerBg: 'bg-black text-slate-300',
    footerText: 'text-slate-400',
    footerAccent: 'bg-amber-400 text-slate-950 font-bold',
    summaryBorder: 'border-indigo-500 ring-2 ring-purple-500/20 shadow-md',
    summaryBadge: 'text-amber-300 bg-indigo-950 border border-amber-400/40',
  },
  typographyProfile: TYPOGRAPHY_SURREALISM,
  typography: createTypographyTokensFromProfile(TYPOGRAPHY_SURREALISM),
  cards: {
    borderRadius: 'rounded-2xl',
    innerRadius: 'rounded-xl',
    borderStyle: 'border border-indigo-700/50 shadow-sm',
    shadowStyle: 'shadow-md hover:shadow-indigo-500/20 hover:border-indigo-500',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-slate-800/80 backdrop-blur-xs',
    highlightBorder: 'border-2 border-amber-400 ring-2 ring-indigo-500/30 shadow-lg',
  },
  icons: {
    style: 'tinted',
    size: 'w-4 h-4',
    containerShape: 'rounded-xl',
    containerBg: 'bg-indigo-600 text-white shadow-sm',
  },
  decoration: {
    level: 'moderate',
    shapes: 'organic',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]',
    badgeStyle: 'rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider',
    showAccentBar: false,
  },
  composition: {
    density: 'balanced',
    whitespace: 'generous',
    alignment: 'left',
    visualEmphasis: 'visual_first',
    gridGap: 'gap-5',
  },
};

/**
 * PRESET 21: Victorian
 * Arsip sejarah klasik, ornamen ukiran halus, keanggunan abad ke-19.
 */
export const STYLE_VICTORIAN: StyleConfig = {
  id: 'victorian',
  name: 'Victorian',
  tagline: 'Keanggunan Klasik, Arsip Sejarah & Wibawa',
  description: 'Estetika dokumen arsip sejarah berwibawa dengan palet warna tanah hangat, bingkai teratur, dan serif klasik terkurasi.',
  colorPalette: {
    background: 'bg-stone-200/80',
    surface: 'bg-stone-50',
    surfaceBorder: 'border-stone-300',
    primary: 'stone',
    primaryBg: 'bg-stone-800',
    primaryText: 'text-stone-900',
    primaryLight: 'bg-stone-200',
    primaryBorder: 'border-stone-400',
    secondary: 'amber',
    secondaryBg: 'bg-amber-800',
    secondaryText: 'text-amber-900',
    secondaryLight: 'bg-amber-100',
    secondaryBorder: 'border-amber-300',
    accent: 'amber',
    accentBg: 'bg-amber-600',
    accentText: 'text-amber-900',
    accentLight: 'bg-amber-50',
    accentBorder: 'border-amber-300',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-700',
    textMuted: 'text-stone-500',
    headerGradient: 'bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white',
    headerText: 'text-amber-200 font-bold',
    headerSubtext: 'text-stone-300',
    headerBadgeBg: 'bg-white/10 border border-stone-400 text-stone-200',
    footerBg: 'bg-stone-950 text-stone-300',
    footerText: 'text-stone-400',
    footerAccent: 'bg-amber-700 text-white font-bold',
    summaryBorder: 'border-2 border-amber-800 ring-2 ring-stone-400/30',
    summaryBadge: 'text-amber-950 bg-amber-100 border-amber-400',
  },
  typographyProfile: TYPOGRAPHY_VICTORIAN,
  typography: createTypographyTokensFromProfile(TYPOGRAPHY_VICTORIAN),
  cards: {
    borderRadius: 'rounded-xl',
    innerRadius: 'rounded-lg',
    borderStyle: 'border border-stone-300 shadow-xs',
    shadowStyle: 'shadow-sm hover:border-amber-700',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-[#faf8f5]',
    highlightBorder: 'border-2 border-amber-800 ring-2 ring-amber-600/20 shadow-sm',
  },
  icons: {
    style: 'outline',
    size: 'w-4 h-4',
    containerShape: 'rounded-lg',
    containerBg: 'bg-stone-800 text-amber-200',
  },
  decoration: {
    level: 'moderate',
    shapes: 'geometric',
    pattern: 'lines',
    backgroundTreatment: 'bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:16px_16px]',
    badgeStyle: 'rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
    showAccentBar: true,
  },
  composition: {
    density: 'balanced',
    whitespace: 'balanced',
    alignment: 'left',
    visualEmphasis: 'text_first',
    gridGap: 'gap-5',
  },
};

/**
 * PRESET 22: Graffiti
 * Seni mural jalanan, garis bebas energik, semprotan cat dan stensil urban.
 */
export const STYLE_GRAFFITI: StyleConfig = {
  id: 'graffiti',
  name: 'Graffiti',
  tagline: 'Seni Mural Urban, Ekspresif & Berjiwa Muda',
  description: 'Energi mural perkotaan dengan semprotan warna dinamis, aksen stensil modern, dan tipografi display berani.',
  colorPalette: {
    background: 'bg-slate-950 text-white',
    surface: 'bg-slate-900',
    surfaceBorder: 'border-lime-400/60',
    primary: 'lime',
    primaryBg: 'bg-lime-500',
    primaryText: 'text-lime-400',
    primaryLight: 'bg-lime-950/80',
    primaryBorder: 'border-lime-400',
    secondary: 'fuchsia',
    secondaryBg: 'bg-fuchsia-500',
    secondaryText: 'text-fuchsia-400',
    secondaryLight: 'bg-fuchsia-950/80',
    secondaryBorder: 'border-fuchsia-400',
    accent: 'yellow',
    accentBg: 'bg-yellow-400',
    accentText: 'text-yellow-300',
    accentLight: 'bg-yellow-950/80',
    accentBorder: 'border-yellow-400',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-500',
    headerGradient: 'bg-gradient-to-r from-slate-950 via-slate-900 to-black text-lime-400',
    headerText: 'text-yellow-300 font-black',
    headerSubtext: 'text-lime-200',
    headerBadgeBg: 'bg-lime-500 text-slate-950 font-black',
    footerBg: 'bg-black text-white',
    footerText: 'text-slate-400',
    footerAccent: 'bg-lime-500 text-slate-950 font-black',
    summaryBorder: 'border-2 border-lime-400 shadow-[0_0_12px_rgba(132,204,22,0.4)]',
    summaryBadge: 'text-lime-950 bg-lime-400 font-black',
  },
  typographyProfile: TYPOGRAPHY_GRAFFITI,
  typography: createTypographyTokensFromProfile(TYPOGRAPHY_GRAFFITI),
  cards: {
    borderRadius: 'rounded-xl',
    innerRadius: 'rounded-lg',
    borderStyle: 'border-2 border-lime-500/70 shadow-sm',
    shadowStyle: 'shadow-md hover:border-lime-400 hover:shadow-lime-500/20',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-slate-900/90',
    highlightBorder: 'border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
  },
  icons: {
    style: 'geometric',
    size: 'w-4 h-4',
    containerShape: 'rounded-xl',
    containerBg: 'bg-lime-500 text-slate-950',
  },
  decoration: {
    level: 'expressive',
    shapes: 'geometric',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#84cc16_1px,transparent_1px)] [background-size:20px_20px]',
    badgeStyle: 'rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider',
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
 * PRESET 23: Retro
 * Poster sains dan ensiklopedia 1970-an, palet hangat nostalgia.
 */
export const STYLE_RETRO: StyleConfig = {
  id: 'retro',
  name: 'Retro',
  tagline: 'Nostalgia Sains & Ensiklopedia Era 70-an',
  description: 'Estetika ensiklopedia sains klasik era 1970-an dengan palet warna mustard, hangat nostalgia, dan tipografi display berkarakter.',
  colorPalette: {
    background: 'bg-amber-50/70',
    surface: 'bg-[#fffdf7]',
    surfaceBorder: 'border-amber-300',
    primary: 'amber',
    primaryBg: 'bg-amber-700',
    primaryText: 'text-amber-900',
    primaryLight: 'bg-amber-100',
    primaryBorder: 'border-amber-300',
    secondary: 'stone',
    secondaryBg: 'bg-stone-700',
    secondaryText: 'text-stone-800',
    secondaryLight: 'bg-stone-100',
    secondaryBorder: 'border-stone-300',
    accent: 'orange',
    accentBg: 'bg-orange-600',
    accentText: 'text-orange-900',
    accentLight: 'bg-orange-100',
    accentBorder: 'border-orange-300',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-700',
    textMuted: 'text-stone-400',
    headerGradient: 'bg-gradient-to-r from-amber-900 via-orange-900 to-stone-900 text-white',
    headerText: 'text-amber-100 font-bold',
    headerSubtext: 'text-amber-200',
    headerBadgeBg: 'bg-white/20 border border-white/20 text-white',
    footerBg: 'bg-stone-900 text-amber-100',
    footerText: 'text-stone-400',
    footerAccent: 'bg-amber-600 text-white font-bold',
    summaryBorder: 'border-2 border-amber-700 ring-2 ring-amber-300/40',
    summaryBadge: 'text-amber-900 bg-amber-100 border-amber-300',
  },
  typographyProfile: TYPOGRAPHY_RETRO,
  typography: createTypographyTokensFromProfile(TYPOGRAPHY_RETRO),
  cards: {
    borderRadius: 'rounded-2xl',
    innerRadius: 'rounded-xl',
    borderStyle: 'border border-amber-300/80 shadow-xs',
    shadowStyle: 'shadow-sm hover:border-amber-500',
    padding: 'p-5 sm:p-6',
    density: 'balanced',
    cardBg: 'bg-[#fffdf7]',
    highlightBorder: 'border-2 border-amber-700 ring-2 ring-amber-400/30 shadow-sm',
  },
  icons: {
    style: 'rounded-box',
    size: 'w-4 h-4',
    containerShape: 'rounded-xl',
    containerBg: 'bg-amber-700 text-white',
  },
  decoration: {
    level: 'moderate',
    shapes: 'geometric',
    pattern: 'dots',
    backgroundTreatment: 'bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]',
    badgeStyle: 'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
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

// All 20+ Canonical Presets Combined
export const AVAILABLE_STYLE_PRESETS: StyleConfig[] = [
  STYLE_MODERN_EDUKATIF,
  STYLE_MINIMALIS,
  STYLE_CERIA_KREATIF,
  STYLE_AKADEMIK,
  STYLE_FUTURISTIC,
  STYLE_POP_ART,
  STYLE_CYBERPUNK,
  STYLE_CLAY_STYLE,
  STYLE_SWISS_DESIGN,
  STYLE_EDITORIAL,
  STYLE_HANDWRITTEN,
  STYLE_GLASSMORPHISM,
  STYLE_AURORA,
  STYLE_BOHEMIAN,
  STYLE_VECTOR_ART,
  STYLE_MAXIMALISM,
  STYLE_COLLAGE_ART,
  STYLE_PIXEL_STYLE,
  STYLE_Y2K,
  STYLE_SURREALISM,
  STYLE_VICTORIAN,
  STYLE_GRAFFITI,
  STYLE_RETRO,
];

/**
 * Main resolver: converts any visualStyle string into a full, high-fidelity StyleConfig
 * Always returns a fresh, deep copy to prevent stale mutations or shared object references across style changes.
 *
 * Alur Pergantian Gaya STIVIA v2.2c:
 * 1. PENGGUNA MEMILIH GAYA BARU
 * 2. BERSIHKAN KONFIGURASI VISUAL SEMENTARA
 * 3. BERSIHKAN TYPOGRAPHY PROFILE LAMA
 * 4. MUAT STYLE PROFILE BARU
 * 5. MUAT TYPOGRAPHY PROFILE BARU
 * 6. TENTUKAN ULANG LAYOUT & FONT BARU
 */
export function getStyleConfig(visualStyleName?: string, customDescription?: string): StyleConfig {
  let matchedPreset = STYLE_MODERN_EDUKATIF;

  if (visualStyleName) {
    const normalized = visualStyleName.toLowerCase().trim();

    // 1. MINIMALISM
    if (normalized.includes('minimalis') || normalized === 'minimalism') {
      matchedPreset = STYLE_MINIMALIS;
    }
    // 2. MAXIMALISM
    else if (normalized.includes('maximalis') || normalized.includes('maksimal')) {
      matchedPreset = STYLE_MAXIMALISM;
    }
    // 3. FUTURISTIC
    else if (normalized.includes('futuristic') || normalized.includes('digital interface') || normalized.includes('teknologi')) {
      matchedPreset = STYLE_FUTURISTIC;
    }
    // 4. VECTOR ART
    else if (normalized.includes('vector') || normalized.includes('flat design') || normalized.includes('ilustratif')) {
      matchedPreset = STYLE_VECTOR_ART;
    }
    // 5. COLLAGE ART
    else if (normalized.includes('collage') || normalized.includes('kolase')) {
      matchedPreset = STYLE_COLLAGE_ART;
    }
    // 6. CYBERPUNK
    else if (normalized.includes('cyberpunk')) {
      matchedPreset = STYLE_CYBERPUNK;
    }
    // 7. POP ART
    else if (normalized.includes('pop art')) {
      matchedPreset = STYLE_POP_ART;
    }
    // 8. GLASSMORPHISM
    else if (normalized.includes('glassmorphism')) {
      matchedPreset = STYLE_GLASSMORPHISM;
    }
    // 9. CLAY STYLE
    else if (normalized.includes('clay style') || normalized.includes('claymorphic') || normalized.includes('clay')) {
      matchedPreset = STYLE_CLAY_STYLE;
    }
    // 10. PIXEL STYLE
    else if (normalized.includes('pixel')) {
      matchedPreset = STYLE_PIXEL_STYLE;
    }
    // 11. EDITORIAL
    else if (normalized.includes('editorial') || normalized.includes('majalah')) {
      matchedPreset = STYLE_EDITORIAL;
    }
    // 12. Y2K
    else if (normalized.includes('y2k')) {
      matchedPreset = STYLE_Y2K;
    }
    // 13. SWISS DESIGN
    else if (normalized.includes('swiss design') || normalized.includes('swiss')) {
      matchedPreset = STYLE_SWISS_DESIGN;
    }
    // 14. SURREALISM
    else if (normalized.includes('surreal') || normalized.includes('surealis')) {
      matchedPreset = STYLE_SURREALISM;
    }
    // 15. BOHEMIAN
    else if (normalized.includes('bohemian') || normalized.includes('botani') || normalized.includes('boho')) {
      matchedPreset = STYLE_BOHEMIAN;
    }
    // 16. VICTORIAN
    else if (normalized.includes('victorian') || normalized.includes('viktorian')) {
      matchedPreset = STYLE_VICTORIAN;
    }
    // 17. GRAFFITI
    else if (normalized.includes('graffiti') || normalized.includes('grafiti') || normalized.includes('street art')) {
      matchedPreset = STYLE_GRAFFITI;
    }
    // 18. AURORA
    else if (normalized.includes('aurora')) {
      matchedPreset = STYLE_AURORA;
    }
    // 19. HANDWRITTEN
    else if (normalized.includes('handwritten') || normalized.includes('doodle') || normalized.includes('sketsa') || normalized.includes('tangan')) {
      matchedPreset = STYLE_HANDWRITTEN;
    }
    // 20. RETRO
    else if (normalized.includes('retro')) {
      matchedPreset = STYLE_RETRO;
    }
    // AKADEMIK & CERIA & VINTAGE (Legacy / Secondary mappings)
    else if (normalized.includes('vintage') || normalized.includes('historical') || normalized.includes('arsip')) {
      matchedPreset = STYLE_VICTORIAN;
    }
    else if (normalized.includes('akademik') || normalized.includes('academic') || normalized.includes('formal') || normalized.includes('clean')) {
      matchedPreset = STYLE_AKADEMIK;
    }
    else if (normalized.includes('ceria') || normalized.includes('kartun') || normalized.includes('comic') || normalized.includes('children') || normalized.includes('ramah anak')) {
      matchedPreset = STYLE_CERIA_KREATIF;
    }
    else {
      const found = AVAILABLE_STYLE_PRESETS.find(p => p.id === normalized || p.name.toLowerCase() === normalized);
      if (found) {
        matchedPreset = found;
      }
    }
  }

  // Deep clone to guarantee complete isolation across style switches
  const freshConfig: StyleConfig = JSON.parse(JSON.stringify(matchedPreset));

  // MUAT TYPOGRAPHY PROFILE BARU SECARA DINAMIS & TERINTEGRASI
  const resolvedProfile = getTypographyProfile(visualStyleName || matchedPreset.id);
  freshConfig.typographyProfile = resolvedProfile;
  freshConfig.typography = createTypographyTokensFromProfile(resolvedProfile);

  if (customDescription && customDescription.trim()) {
    freshConfig.description = `${freshConfig.description} (Kustom: ${customDescription.trim()})`;
  }

  return freshConfig;
}
