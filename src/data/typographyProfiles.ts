import React from 'react';
import { TypographyProfile, TypographyTokens } from '../types';

/**
 * =========================================================================
 * STIVIA TYPOGRAPHY SYSTEM (Versi 2.2c)
 * Sistem Tipografi 3-Tier (Heading, Subheading, Body) untuk 20 Gaya Infografis
 * "Belajar Lebih Visual, Mengajar Lebih Mudah"
 * =========================================================================
 */

// Sistem Fallback Font yang Aman (Anti-Crash)
export const FONT_FALLBACK_SANS =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const FONT_FALLBACK_SERIF =
  'Georgia, Cambria, "Times New Roman", Times, serif';

export const FONT_FALLBACK_MONO =
  'Menlo, Monaco, Consolas, "Courier New", monospace';

/**
 * Helper untuk menyusun CSS font-family lengkap dengan fallback aman
 */
export function buildFontFamilyCss(
  fontsText: string,
  preferredFallback: 'sans' | 'serif' | 'mono' = 'sans'
): string {
  if (!fontsText) {
    return preferredFallback === 'serif'
      ? FONT_FALLBACK_SERIF
      : preferredFallback === 'mono'
      ? FONT_FALLBACK_MONO
      : FONT_FALLBACK_SANS;
  }

  // Pecah font yang dipisah tanda "/" atau ","
  const fonts = fontsText
    .split(/[\/,]/)
    .map((f) => f.trim())
    .filter(Boolean);

  const quotedFonts = fonts.map((f) => (f.includes(' ') ? `"${f}"` : f));

  // Tentukan fallback yang paling serasi
  const lower = fontsText.toLowerCase();
  const fallback =
    lower.includes('serif') ||
    lower.includes('playfair') ||
    lower.includes('merriweather') ||
    lower.includes('cinzel') ||
    lower.includes('cormorant') ||
    lower.includes('lora')
      ? FONT_FALLBACK_SERIF
      : lower.includes('mono') || lower.includes('press start') || lower.includes('silkscreen')
      ? FONT_FALLBACK_MONO
      : FONT_FALLBACK_SANS;

  return `${quotedFonts.join(', ')}, ${fallback}`;
}

// =========================================================================
// DEFINISI 20 TYPOGRAPHY PROFILES STIVIA v2.2d
// =========================================================================

/** 1. MINIMALISM - Montserrat + Inter */
export const TYPOGRAPHY_MINIMALISM: TypographyProfile = {
  headingFont: 'Montserrat',
  subheadingFont: 'Montserrat',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Bersih, sederhana, modern, dan sangat mudah dibaca.',
  readabilityRules: 'Gunakan kontras tinggi dan ruang kosong yang cukup.',
  headingFontFamilyCss: buildFontFamilyCss('Montserrat, Inter', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Montserrat', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 2. MAXIMALISM - Archivo Black + Poppins */
export const TYPOGRAPHY_MAXIMALISM: TypographyProfile = {
  headingFont: 'Archivo Black',
  subheadingFont: 'Poppins',
  bodyFont: 'Poppins',
  headingWeight: 'black',
  subheadingWeight: 'bold',
  bodyWeight: 'medium',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Berani, kuat, dinamis, dan ekspresif.',
  readabilityRules: 'Hindari teks panjang yang terlalu rapat.',
  headingFontFamilyCss: buildFontFamilyCss('Archivo Black, Montserrat', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Poppins', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Poppins, Inter', 'sans'),
};

/** 3. FUTURISTIC - Orbitron + Exo 2 */
export const TYPOGRAPHY_FUTURISTIC: TypographyProfile = {
  headingFont: 'Orbitron',
  subheadingFont: 'Exo 2',
  bodyFont: 'Exo 2',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wider',
  lineHeight: 'normal',
  typographyCharacter: 'Teknologi dan futuristik dengan aksen geometris canggih.',
  readabilityRules: 'Gunakan font futuristik pada judul dan label singkat, isi tetap terbaca prima.',
  headingFontFamilyCss: buildFontFamilyCss('Orbitron, Chakra Petch', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Exo 2, Space Grotesk', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Exo 2, Inter', 'sans'),
};

/** 4. VECTOR ART - Poppins + Nunito Sans */
export const TYPOGRAPHY_VECTOR_ART: TypographyProfile = {
  headingFont: 'Poppins',
  subheadingFont: 'Poppins',
  bodyFont: 'Nunito Sans',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  typographyCharacter: 'Ilustratif, ramah, geometris, dan terstruktur jelas.',
  readabilityRules: 'Bentuk huruf tegas dan seimbang dengan kontur ilustrasi vektor.',
  headingFontFamilyCss: buildFontFamilyCss('Poppins', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Poppins', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Nunito Sans, Open Sans, Inter', 'sans'),
};

/** 5. COLLAGE ART - Bebas Neue + DM Sans */
export const TYPOGRAPHY_COLLAGE_ART: TypographyProfile = {
  headingFont: 'Bebas Neue',
  subheadingFont: 'DM Sans',
  bodyFont: 'DM Sans',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'tight',
  typographyCharacter: 'Kreatif dan editorial dengan gaya guntingan artistik.',
  readabilityRules: 'Body text harus tetap bersih dan menggunakan sans-serif netral.',
  headingFontFamilyCss: buildFontFamilyCss('Bebas Neue, Archivo Black', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('DM Sans, Archivo', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('DM Sans, Inter', 'sans'),
};

/** 6. CYBERPUNK - Orbitron + Rajdhani */
export const TYPOGRAPHY_CYBERPUNK: TypographyProfile = {
  headingFont: 'Orbitron',
  subheadingFont: 'Rajdhani',
  bodyFont: 'Rajdhani',
  headingWeight: 'bold',
  subheadingWeight: 'bold',
  bodyWeight: 'medium',
  headingCase: 'uppercase',
  letterSpacing: 'wider',
  lineHeight: 'normal',
  typographyCharacter: 'Digital, tajam, berenergi tinggi, dan bernuansa neon canggih.',
  readabilityRules: 'Warna font harus memiliki kontras tinggi terhadap latar belakang gelap.',
  headingFontFamilyCss: buildFontFamilyCss('Orbitron, Teko', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Rajdhani, Share Tech Mono', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Rajdhani, Chakra Petch, Inter', 'sans'),
};

/** 7. POP ART - Bangers + Poppins */
export const TYPOGRAPHY_POP_ART: TypographyProfile = {
  headingFont: 'Bangers',
  subheadingFont: 'Poppins',
  bodyFont: 'Poppins',
  headingWeight: 'black',
  subheadingWeight: 'bold',
  bodyWeight: 'medium',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Ceria, berani, komikal, dan memikat perhatian seketika.',
  readabilityRules: 'Gunakan font komik pada judul utama, isi tetap bersih dan berjarak lega.',
  headingFontFamilyCss: buildFontFamilyCss('Bangers, Bungee', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Poppins', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Poppins, Inter', 'sans'),
};

/** 8. GLASSMORPHISM - Outfit + Inter */
export const TYPOGRAPHY_GLASSMORPHISM: TypographyProfile = {
  headingFont: 'Outfit',
  subheadingFont: 'Outfit',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  typographyCharacter: 'Modern, elegan, bersih, dan memancarkan kejernihan visual.',
  readabilityRules: 'Hindari teks tipis di atas panel transparan blur.',
  headingFontFamilyCss: buildFontFamilyCss('Outfit, Plus Jakarta Sans', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Outfit', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 9. CLAY STYLE - Fredoka + Nunito */
export const TYPOGRAPHY_CLAY_STYLE: TypographyProfile = {
  headingFont: 'Fredoka',
  subheadingFont: 'Nunito',
  bodyFont: 'Nunito',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'medium',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Ramah, edukatif, membulat, dan bersahabat.',
  readabilityRules: 'Gunakan font bulat yang tetap terbaca pada ukuran kecil.',
  headingFontFamilyCss: buildFontFamilyCss('Fredoka, Nunito', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Nunito', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Nunito, Inter', 'sans'),
};

/** 10. PIXEL STYLE - Press Start 2P + VT323 */
export const TYPOGRAPHY_PIXEL_STYLE: TypographyProfile = {
  headingFont: 'Press Start 2P',
  subheadingFont: 'VT323',
  bodyFont: 'VT323',
  headingWeight: 'normal',
  subheadingWeight: 'normal',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Retro dan digital bernuansa game arkade 8-bit klasik.',
  readabilityRules: 'Ukuran font piksel disesuaikan agar tetap jelas dan tidak menyilaukan.',
  headingFontFamilyCss: buildFontFamilyCss('Press Start 2P, Silkscreen', 'mono'),
  subheadingFontFamilyCss: buildFontFamilyCss('VT323, Space Mono', 'mono'),
  bodyFontFamilyCss: buildFontFamilyCss('VT323, Inter', 'mono'),
};

/** 11. EDITORIAL - Playfair Display + Lora */
export const TYPOGRAPHY_EDITORIAL: TypographyProfile = {
  headingFont: 'Playfair Display',
  subheadingFont: 'Playfair Display',
  bodyFont: 'Lora',
  headingWeight: 'bold',
  subheadingWeight: 'medium',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Profesional, elegan, berwibawa, layaknya publikasi bergengsi.',
  readabilityRules: 'Kombinasi serif anggun untuk judul dan serif berjarak nyaman untuk isi materi.',
  headingFontFamilyCss: buildFontFamilyCss('Playfair Display, Merriweather', 'serif'),
  subheadingFontFamilyCss: buildFontFamilyCss('Playfair Display', 'serif'),
  bodyFontFamilyCss: buildFontFamilyCss('Lora, Georgia', 'serif'),
};

/** 12. Y2K - Space Grotesk + DM Sans */
export const TYPOGRAPHY_Y2K: TypographyProfile = {
  headingFont: 'Space Grotesk',
  subheadingFont: 'Space Grotesk',
  bodyFont: 'DM Sans',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Modern dan retro digital estetika pergantian milenium era 2000-an.',
  readabilityRules: 'Pertahankan tata letak modular yang mudah dibaca.',
  headingFontFamilyCss: buildFontFamilyCss('Space Grotesk, Syne', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Space Grotesk', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('DM Sans, Inter', 'sans'),
};

/** 13. SWISS DESIGN - Inter + Inter */
export const TYPOGRAPHY_SWISS_DESIGN: TypographyProfile = {
  headingFont: 'Inter',
  subheadingFont: 'Inter',
  bodyFont: 'Inter',
  headingWeight: 'black',
  subheadingWeight: 'bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'tight',
  lineHeight: 'tight',
  typographyCharacter: 'Bersih, terstruktur, rasional, dan presisi tinggi.',
  readabilityRules: 'Gunakan hierarki ukuran font dan ketebalan bobot yang sangat tegas.',
  headingFontFamilyCss: buildFontFamilyCss('Inter, Archivo', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 14. SURREALISM - Cormorant Garamond + Lora */
export const TYPOGRAPHY_SURREALISM: TypographyProfile = {
  headingFont: 'Cormorant Garamond',
  subheadingFont: 'Cormorant Garamond',
  bodyFont: 'Lora',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'wide',
  lineHeight: 'relaxed',
  typographyCharacter: 'Artistik, eksperimental, puitis, dan penuh daya imajinasi.',
  readabilityRules: 'Pertahankan keterbacaan materi dengan tipografi buku klasik berkualitas.',
  headingFontFamilyCss: buildFontFamilyCss('Cormorant Garamond, Cinzel', 'serif'),
  subheadingFontFamilyCss: buildFontFamilyCss('Cormorant Garamond', 'serif'),
  bodyFontFamilyCss: buildFontFamilyCss('Lora, Georgia', 'serif'),
};

/** 15. BOHEMIAN - DM Serif Display + Nunito */
export const TYPOGRAPHY_BOHEMIAN: TypographyProfile = {
  headingFont: 'DM Serif Display',
  subheadingFont: 'DM Serif Display',
  bodyFont: 'Nunito',
  headingWeight: 'bold',
  subheadingWeight: 'medium',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Hangat, artistik, membumi, dan bernuansa organik alami.',
  readabilityRules: 'Pastikan kontras teks terjaga pada palet warna tanah (earth tones).',
  headingFontFamilyCss: buildFontFamilyCss('DM Serif Display, Cormorant Garamond', 'serif'),
  subheadingFontFamilyCss: buildFontFamilyCss('DM Serif Display', 'serif'),
  bodyFontFamilyCss: buildFontFamilyCss('Nunito, Inter', 'sans'),
};

/** 16. VICTORIAN - Cinzel + Crimson Text */
export const TYPOGRAPHY_VICTORIAN: TypographyProfile = {
  headingFont: 'Cinzel',
  subheadingFont: 'Cinzel',
  bodyFont: 'Crimson Text',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'titlecase',
  letterSpacing: 'wide',
  lineHeight: 'relaxed',
  typographyCharacter: 'Klasik, historis, berwibawa, dan sarat kemegahan akademis.',
  readabilityRules: 'Gunakan serif klasik dengan spasi baris longgar untuk kenyamanan membaca.',
  headingFontFamilyCss: buildFontFamilyCss('Cinzel, Playfair Display', 'serif'),
  subheadingFontFamilyCss: buildFontFamilyCss('Cinzel', 'serif'),
  bodyFontFamilyCss: buildFontFamilyCss('Crimson Text, Merriweather, Georgia', 'serif'),
};

/** 17. GRAFFITI - Permanent Marker + Roboto */
export const TYPOGRAPHY_GRAFFITI: TypographyProfile = {
  headingFont: 'Permanent Marker',
  subheadingFont: 'Permanent Marker',
  bodyFont: 'Roboto',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Urban, ekspresif, berani, dan berjiwa bebas.',
  readabilityRules: 'Gunakan font marker hanya pada judul, isi teks tetap memakai Roboto yang jernih.',
  headingFontFamilyCss: buildFontFamilyCss('Permanent Marker, Rubik Wet Paint', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Permanent Marker', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Roboto, Inter', 'sans'),
};

/** 18. AURORA - Sora + Manrope */
export const TYPOGRAPHY_AURORA: TypographyProfile = {
  headingFont: 'Sora',
  subheadingFont: 'Sora',
  bodyFont: 'Manrope',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  typographyCharacter: 'Lembut, futuristik, bercahaya, dan memancarkan estetika modern.',
  readabilityRules: 'Pertahankan kontras teks terhadap latar gradasi cahaya aurora.',
  headingFontFamilyCss: buildFontFamilyCss('Sora, Montserrat', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Sora', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Manrope, Inter', 'sans'),
};

/** 19. HANDWRITTEN - Caveat + Nunito */
export const TYPOGRAPHY_HANDWRITTEN: TypographyProfile = {
  headingFont: 'Caveat',
  subheadingFont: 'Caveat',
  bodyFont: 'Nunito',
  headingWeight: 'bold',
  subheadingWeight: 'bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Personal, alami, hangat, layaknya tulisan tangan catatan belajar.',
  readabilityRules: 'Font tulisan tangan pada judul dan kutipan, materi tetap menggunakan sans-serif ramah.',
  headingFontFamilyCss: buildFontFamilyCss('Caveat, Kalam', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Caveat', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Nunito, Inter', 'sans'),
};

/** 20. HAND DRAWING - Kalam + Nunito (GAYA BARU STIVIA 2.2d) */
export const TYPOGRAPHY_HAND_DRAWING: TypographyProfile = {
  headingFont: 'Kalam',
  subheadingFont: 'Kalam',
  bodyFont: 'Nunito',
  headingWeight: 'bold',
  subheadingWeight: 'bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Ilustratif, organik, seperti gambar dan catatan yang dibuat secara manual.',
  readabilityRules: 'Gaya sketsa tangan pada judul dipadu dengan isi materi yang terbaca nyaman.',
  headingFontFamilyCss: buildFontFamilyCss('Kalam, Patrick Hand', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Kalam', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Nunito, Inter', 'sans'),
};

/**
 * Standard STIVIA Modern Edukatif Typography Profile
 */
export const TYPOGRAPHY_MODERN_EDUKATIF: TypographyProfile = {
  headingFont: 'Plus Jakarta Sans',
  subheadingFont: 'Plus Jakarta Sans',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Harmonis, seimbang, dan ramah bagi peserta didik.',
  readabilityRules: 'Standar keterbacaan tinggi dengan kontras prima pada latar terang.',
  headingFontFamilyCss: buildFontFamilyCss('Plus Jakarta Sans', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Plus Jakarta Sans', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** Alias retro untuk kompatibilitas */
export const TYPOGRAPHY_RETRO: TypographyProfile = TYPOGRAPHY_Y2K;

// =========================================================================
// MAPPER & RESOLVER
// =========================================================================

export const ALL_TYPOGRAPHY_PROFILES: Record<string, TypographyProfile> = {
  minimalism: TYPOGRAPHY_MINIMALISM,
  maximalism: TYPOGRAPHY_MAXIMALISM,
  futuristic: TYPOGRAPHY_FUTURISTIC,
  vector_art: TYPOGRAPHY_VECTOR_ART,
  collage_art: TYPOGRAPHY_COLLAGE_ART,
  cyberpunk: TYPOGRAPHY_CYBERPUNK,
  pop_art: TYPOGRAPHY_POP_ART,
  glassmorphism: TYPOGRAPHY_GLASSMORPHISM,
  clay_style: TYPOGRAPHY_CLAY_STYLE,
  pixel_style: TYPOGRAPHY_PIXEL_STYLE,
  editorial: TYPOGRAPHY_EDITORIAL,
  y2k: TYPOGRAPHY_Y2K,
  swiss_design: TYPOGRAPHY_SWISS_DESIGN,
  surrealism: TYPOGRAPHY_SURREALISM,
  bohemian: TYPOGRAPHY_BOHEMIAN,
  victorian: TYPOGRAPHY_VICTORIAN,
  graffiti: TYPOGRAPHY_GRAFFITI,
  aurora: TYPOGRAPHY_AURORA,
  handwritten: TYPOGRAPHY_HANDWRITTEN,
  hand_drawing: TYPOGRAPHY_HAND_DRAWING,
  retro: TYPOGRAPHY_RETRO,
  modern_edukatif: TYPOGRAPHY_MODERN_EDUKATIF,
};

/**
 * Pilihan font judul terpopuler untuk opsi kustomisasi "Sesuaikan Font"
 */
export const AVAILABLE_TITLE_FONTS = [
  'Montserrat',
  'Archivo Black',
  'Orbitron',
  'Poppins',
  'Bebas Neue',
  'Bangers',
  'Outfit',
  'Fredoka',
  'Press Start 2P',
  'Playfair Display',
  'Space Grotesk',
  'Inter',
  'Cormorant Garamond',
  'DM Serif Display',
  'Cinzel',
  'Permanent Marker',
  'Sora',
  'Caveat',
  'Kalam',
  'Plus Jakarta Sans',
];

/**
 * Pilihan font isi (body) terpopuler untuk opsi kustomisasi "Sesuaikan Font"
 */
export const AVAILABLE_BODY_FONTS = [
  'Inter',
  'Poppins',
  'Exo 2',
  'Nunito Sans',
  'DM Sans',
  'Rajdhani',
  'Nunito',
  'VT323',
  'Lora',
  'Crimson Text',
  'Roboto',
  'Manrope',
  'Plus Jakarta Sans',
];

/**
 * Helper untuk membangun TypographyProfile khusus ketika pengguna memilih "Sesuaikan Font"
 */
export function buildCustomTypographyProfile(
  customTitleFont: string,
  customBodyFont: string,
  baseProfile?: TypographyProfile
): TypographyProfile {
  const base = baseProfile || TYPOGRAPHY_MODERN_EDUKATIF;
  const title = customTitleFont.trim() || base.headingFont;
  const body = customBodyFont.trim() || base.bodyFont;

  return {
    ...base,
    headingFont: title,
    subheadingFont: title,
    bodyFont: body,
    typographyCharacter: `Kustom: Judul ${title} & Isi ${body}`,
    headingFontFamilyCss: buildFontFamilyCss(title, 'sans'),
    subheadingFontFamilyCss: buildFontFamilyCss(title, 'sans'),
    bodyFontFamilyCss: buildFontFamilyCss(body, 'sans'),
  };
}

/**
 * Resolver Tipografi berdasarkan nama atau ID gaya
 */
export function getTypographyProfile(styleNameOrId?: string): TypographyProfile {
  if (!styleNameOrId) return TYPOGRAPHY_MODERN_EDUKATIF;

  const target = styleNameOrId.toLowerCase().trim();

  // 1. Exact match di key
  if (ALL_TYPOGRAPHY_PROFILES[target]) {
    return ALL_TYPOGRAPHY_PROFILES[target];
  }

  // 2. Fuzzy match 20 gaya resmi
  if (target.includes('drawing') || target.includes('hand drawing') || target.includes('sketsa')) return TYPOGRAPHY_HAND_DRAWING;
  if (target.includes('minimal')) return TYPOGRAPHY_MINIMALISM;
  if (target.includes('maxi') || target.includes('maksimal')) return TYPOGRAPHY_MAXIMALISM;
  if (target.includes('futur')) return TYPOGRAPHY_FUTURISTIC;
  if (target.includes('vector') || target.includes('vektor')) return TYPOGRAPHY_VECTOR_ART;
  if (target.includes('collage') || target.includes('kolase')) return TYPOGRAPHY_COLLAGE_ART;
  if (target.includes('cyber')) return TYPOGRAPHY_CYBERPUNK;
  if (target.includes('pop')) return TYPOGRAPHY_POP_ART;
  if (target.includes('glass')) return TYPOGRAPHY_GLASSMORPHISM;
  if (target.includes('clay')) return TYPOGRAPHY_CLAY_STYLE;
  if (target.includes('pixel')) return TYPOGRAPHY_PIXEL_STYLE;
  if (target.includes('editorial')) return TYPOGRAPHY_EDITORIAL;
  if (target.includes('y2k')) return TYPOGRAPHY_Y2K;
  if (target.includes('swiss')) return TYPOGRAPHY_SWISS_DESIGN;
  if (target.includes('surreal') || target.includes('surealis')) return TYPOGRAPHY_SURREALISM;
  if (target.includes('bohemian') || target.includes('boho')) return TYPOGRAPHY_BOHEMIAN;
  if (target.includes('victorian') || target.includes('viktorian')) return TYPOGRAPHY_VICTORIAN;
  if (target.includes('graffiti') || target.includes('street')) return TYPOGRAPHY_GRAFFITI;
  if (target.includes('aurora')) return TYPOGRAPHY_AURORA;
  if (target.includes('handwritten') || target.includes('doodle') || target.includes('tangan')) return TYPOGRAPHY_HANDWRITTEN;
  if (target.includes('retro') || target.includes('vintage')) return TYPOGRAPHY_RETRO;

  // 3. Fallback ke Modern Edukatif
  return TYPOGRAPHY_MODERN_EDUKATIF;
}

/**
 * Konversi TypographyProfile ke TypographyTokens lengkap
 */
export function createTypographyTokensFromProfile(profile: TypographyProfile): TypographyTokens {
  const headingWeightClass =
    profile.headingWeight === 'black'
      ? 'font-black'
      : profile.headingWeight === 'extra bold'
      ? 'font-extrabold'
      : profile.headingWeight === 'normal'
      ? 'font-medium'
      : 'font-bold';

  const subheadingWeightClass =
    profile.subheadingWeight === 'bold'
      ? 'font-bold'
      : profile.subheadingWeight === 'medium'
      ? 'font-medium'
      : 'font-semibold';

  const bodyWeightClass =
    profile.bodyWeight === 'medium' ? 'font-medium' : 'font-normal';

  const headingTrackingClass =
    profile.letterSpacing === 'wider'
      ? 'tracking-wider'
      : profile.letterSpacing === 'wide'
      ? 'tracking-wide'
      : profile.letterSpacing === 'tight'
      ? 'tracking-tight'
      : 'tracking-normal';

  const lineHeightClass =
    profile.lineHeight === 'relaxed'
      ? 'leading-relaxed'
      : profile.lineHeight === 'tight'
      ? 'leading-tight'
      : 'leading-normal';

  return {
    fontFamily: profile.bodyFontFamilyCss || FONT_FALLBACK_SANS,
    headingFont: profile.headingFont,
    subheadingFont: profile.subheadingFont,
    bodyFont: profile.bodyFont,
    headingWeight: headingWeightClass,
    subheadingWeight: subheadingWeightClass,
    headingTracking: headingTrackingClass,
    bodyStyle: bodyWeightClass,
    bodyWeight: bodyWeightClass,
    headingScale: 'scale-100',
    lineHeight: lineHeightClass,
    headingCase: profile.headingCase,
    letterSpacing: profile.letterSpacing,
    typographyCharacter: profile.typographyCharacter,
    readabilityRules: profile.readabilityRules,
    headingFontFamilyCss: profile.headingFontFamilyCss,
    subheadingFontFamilyCss: profile.subheadingFontFamilyCss,
    bodyFontFamilyCss: profile.bodyFontFamilyCss,
  };
}

/**
 * Helper React CSS inline styles untuk headings
 */
export function getHeadingStyleObject(profile: TypographyProfile): React.CSSProperties {
  const styles: React.CSSProperties = {
    fontFamily: profile.headingFontFamilyCss,
  };

  if (profile.headingCase === 'uppercase') {
    styles.textTransform = 'uppercase';
  } else if (profile.headingCase === 'titlecase') {
    styles.textTransform = 'capitalize';
  }

  if (profile.letterSpacing === 'wider') {
    styles.letterSpacing = '0.05em';
  } else if (profile.letterSpacing === 'wide') {
    styles.letterSpacing = '0.025em';
  } else if (profile.letterSpacing === 'tight') {
    styles.letterSpacing = '-0.025em';
  }

  return styles;
}

/**
 * Helper React CSS inline styles untuk subheadings
 */
export function getSubheadingStyleObject(profile: TypographyProfile): React.CSSProperties {
  return {
    fontFamily: profile.subheadingFontFamilyCss,
  };
}

/**
 * Helper React CSS inline styles untuk body text
 */
export function getBodyStyleObject(profile: TypographyProfile): React.CSSProperties {
  const styles: React.CSSProperties = {
    fontFamily: profile.bodyFontFamilyCss,
  };

  if (profile.lineHeight === 'relaxed') {
    styles.lineHeight = 1.65;
  } else if (profile.lineHeight === 'tight') {
    styles.lineHeight = 1.35;
  } else {
    styles.lineHeight = 1.5;
  }

  return styles;
}

/**
 * Pilihan Font Judul Resmi STIVIA (Google Fonts)
 */
export const TITLE_FONT_PRESETS = [
  { name: 'Plus Jakarta Sans', category: 'Modern & Bersih', family: 'Plus Jakarta Sans, sans-serif' },
  { name: 'Outfit', category: 'Geometris & Segar', family: 'Outfit, sans-serif' },
  { name: 'Space Grotesk', category: 'Teknologi & Canggih', family: 'Space Grotesk, sans-serif' },
  { name: 'Orbitron', category: 'Futuristik & Cyber', family: 'Orbitron, sans-serif' },
  { name: 'Montserrat', category: 'Kokoh & Berbobot', family: 'Montserrat, sans-serif' },
  { name: 'Playfair Display', category: 'Elegan & Editorial', family: 'Playfair Display, serif' },
  { name: 'Cinzel', category: 'Historis & Arsitektural', family: 'Cinzel, serif' },
  { name: 'Fredoka', category: 'Ramah & Membulat', family: 'Fredoka, sans-serif' },
  { name: 'Patrick Hand', category: 'Catatan & Tulis Tangan', family: 'Patrick Hand, cursive' },
  { name: 'Kalam', category: 'Artistik & Kasual', family: 'Kalam, cursive' },
  { name: 'Bangers', category: 'Komik & Pop Art', family: 'Bangers, cursive' },
  { name: 'Press Start 2P', category: 'Retro 8-Bit Pixel', family: '"Press Start 2P", monospace' },
];

/**
 * Pilihan Font Isi / Body Resmi STIVIA (Google Fonts)
 */
export const BODY_FONT_PRESETS = [
  { name: 'Inter', category: 'Keterbacaan Tertinggi', family: 'Inter, sans-serif' },
  { name: 'Plus Jakarta Sans', category: 'Kontemporer & Halus', family: 'Plus Jakarta Sans, sans-serif' },
  { name: 'Nunito', category: 'Hangat & Ramah Pembaca', family: 'Nunito, sans-serif' },
  { name: 'Lora', category: 'Serif Nyaman & Sastra', family: 'Lora, serif' },
  { name: 'Source Sans 3', category: 'Netral & Profesional', family: '"Source Sans 3", sans-serif' },
  { name: 'Exo 2', category: 'Teknis & Futuristik', family: '"Exo 2", sans-serif' },
  { name: 'Space Mono', category: 'Monospace Rapi', family: '"Space Mono", monospace' },
  { name: 'VT323', category: 'Retro Terminal', family: 'VT323, monospace' },
  { name: 'Caveat', category: 'Cursive Santai', family: 'Caveat, cursive' },
];

/**
 * Helper untuk menerapkan kustomisasi font ke profil tipografi yang ada
 */
export function applyTypographyOverride(
  baseProfile: TypographyProfile,
  customTitleFont?: string,
  customBodyFont?: string
): TypographyProfile {
  if (!customTitleFont && !customBodyFont) {
    return baseProfile;
  }

  const headingFont = customTitleFont || baseProfile.headingFont;
  const bodyFont = customBodyFont || baseProfile.bodyFont;

  return {
    ...baseProfile,
    headingFont,
    bodyFont,
    headingFontFamilyCss: `"${headingFont}", ${baseProfile.headingFontFamilyCss || 'sans-serif'}`,
    subheadingFontFamilyCss: `"${headingFont}", ${baseProfile.subheadingFontFamilyCss || 'sans-serif'}`,
    bodyFontFamilyCss: `"${bodyFont}", ${baseProfile.bodyFontFamilyCss || 'sans-serif'}`,
  };
}

