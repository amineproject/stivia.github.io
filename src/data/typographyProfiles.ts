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
// DEFINISI 20 TYPOGRAPHY PROFILES
// =========================================================================

/** 1. MINIMALISM */
export const TYPOGRAPHY_MINIMALISM: TypographyProfile = {
  headingFont: 'Plus Jakarta Sans / Inter',
  subheadingFont: 'Plus Jakarta Sans',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Bersih, modern, dan sangat mudah dibaca.',
  readabilityRules: 'Gunakan kontras tinggi dan ruang kosong yang cukup.',
  headingFontFamilyCss: buildFontFamilyCss('Plus Jakarta Sans, Inter', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Plus Jakarta Sans', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 2. MAXIMALISM */
export const TYPOGRAPHY_MAXIMALISM: TypographyProfile = {
  headingFont: 'Syne / Montserrat',
  subheadingFont: 'Montserrat',
  bodyFont: 'Plus Jakarta Sans',
  headingWeight: 'extra bold',
  subheadingWeight: 'bold',
  bodyWeight: 'medium',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Berani, ekspresif, dan kuat.',
  readabilityRules: 'Hindari teks panjang yang terlalu rapat.',
  headingFontFamilyCss: buildFontFamilyCss('Syne, Montserrat', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Montserrat', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Plus Jakarta Sans, Inter', 'sans'),
};

/** 3. FUTURISTIC */
export const TYPOGRAPHY_FUTURISTIC: TypographyProfile = {
  headingFont: 'Orbitron / Rajdhani',
  subheadingFont: 'Space Grotesk',
  bodyFont: 'Space Grotesk / Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wider',
  lineHeight: 'normal',
  typographyCharacter: 'Digital, modern, dan bernuansa teknologi.',
  readabilityRules: 'Gunakan font futuristik HANYA pada judul dan label singkat.',
  headingFontFamilyCss: buildFontFamilyCss('Orbitron, Rajdhani', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Space Grotesk', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Space Grotesk, Inter', 'sans'),
};

/** 4. VECTOR ART */
export const TYPOGRAPHY_VECTOR_ART: TypographyProfile = {
  headingFont: 'Poppins',
  subheadingFont: 'Poppins',
  bodyFont: 'Open Sans / Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  typographyCharacter: 'Geometris, bersahabat, dan jelas.',
  readabilityRules: 'Bentuk huruf tegas agar serasi dengan ilustrasi vektor.',
  headingFontFamilyCss: buildFontFamilyCss('Poppins', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Poppins', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Open Sans, Inter', 'sans'),
};

/** 5. COLLAGE ART */
export const TYPOGRAPHY_COLLAGE_ART: TypographyProfile = {
  headingFont: 'Bebas Neue / Anton',
  subheadingFont: 'Archivo',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'tight',
  typographyCharacter: 'Kontras tinggi seperti guntingan majalah.',
  readabilityRules: 'Body text harus tetap bersih dan menggunakan font netral.',
  headingFontFamilyCss: buildFontFamilyCss('Bebas Neue, Anton, Archivo Black', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Archivo', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 6. CYBERPUNK */
export const TYPOGRAPHY_CYBERPUNK: TypographyProfile = {
  headingFont: 'Teko / Orbitron',
  subheadingFont: 'Share Tech Mono',
  bodyFont: 'Chakra Petch / Inter',
  headingWeight: 'bold',
  subheadingWeight: 'medium',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wider',
  lineHeight: 'normal',
  typographyCharacter: 'Neon, tajam, dan industrial.',
  readabilityRules: 'Warna font harus memiliki kontras tinggi terhadap latar belakang gelap.',
  headingFontFamilyCss: buildFontFamilyCss('Teko, Orbitron', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Share Tech Mono', 'mono'),
  bodyFontFamilyCss: buildFontFamilyCss('Chakra Petch, Inter', 'sans'),
};

/** 7. POP ART */
export const TYPOGRAPHY_POP_ART: TypographyProfile = {
  headingFont: 'Bangers / Bungee',
  subheadingFont: 'Poppins',
  bodyFont: 'Poppins / Inter',
  headingWeight: 'black',
  subheadingWeight: 'bold',
  bodyWeight: 'medium',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Ceria, komikal, dan mencolok.',
  readabilityRules: 'Gunakan font komik hanya pada judul utama.',
  headingFontFamilyCss: buildFontFamilyCss('Bangers, Bungee', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Poppins', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Poppins, Inter', 'sans'),
};

/** 8. GLASSMORPHISM */
export const TYPOGRAPHY_GLASSMORPHISM: TypographyProfile = {
  headingFont: 'Plus Jakarta Sans',
  subheadingFont: 'Plus Jakarta Sans',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  typographyCharacter: 'Elegan, modern, dan transparan.',
  readabilityRules: 'Hindari teks tipis di atas latar belakang transparan.',
  headingFontFamilyCss: buildFontFamilyCss('Plus Jakarta Sans', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Plus Jakarta Sans', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 9. CLAY STYLE */
export const TYPOGRAPHY_CLAY_STYLE: TypographyProfile = {
  headingFont: 'Fredoka / Nunito',
  subheadingFont: 'Nunito',
  bodyFont: 'Nunito / Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'medium',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Membulat, ramah, dan lembut.',
  readabilityRules: 'Gunakan font bulat yang tetap terbaca pada ukuran kecil.',
  headingFontFamilyCss: buildFontFamilyCss('Fredoka, Nunito', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Nunito', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Nunito, Inter', 'sans'),
};

/** 10. PIXEL STYLE */
export const TYPOGRAPHY_PIXEL_STYLE: TypographyProfile = {
  headingFont: 'Press Start 2P / Silkscreen',
  subheadingFont: 'Space Mono',
  bodyFont: 'Inter',
  headingWeight: 'normal',
  subheadingWeight: 'medium',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Nostalgia game retro 8-bit.',
  readabilityRules: 'WAJIB menggunakan sans-serif bersih untuk paragraf materi.',
  headingFontFamilyCss: buildFontFamilyCss('Press Start 2P, Silkscreen', 'mono'),
  subheadingFontFamilyCss: buildFontFamilyCss('Space Mono', 'mono'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 11. EDITORIAL */
export const TYPOGRAPHY_EDITORIAL: TypographyProfile = {
  headingFont: 'Playfair Display / Merriweather',
  subheadingFont: 'Merriweather',
  bodyFont: 'Source Sans Pro / Inter',
  headingWeight: 'bold',
  subheadingWeight: 'medium',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Klasik, ilmiah, dan elegan seperti jurnal.',
  readabilityRules: 'Kombinasi serif untuk judul dan sans-serif untuk isi materi.',
  headingFontFamilyCss: buildFontFamilyCss('Playfair Display, Merriweather', 'serif'),
  subheadingFontFamilyCss: buildFontFamilyCss('Merriweather', 'serif'),
  bodyFontFamilyCss: buildFontFamilyCss('Source Sans 3, Inter', 'sans'),
};

/** 12. Y2K */
export const TYPOGRAPHY_Y2K: TypographyProfile = {
  headingFont: 'Syne / Space Grotesk',
  subheadingFont: 'Space Grotesk',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Retro-futuristik era 2000-an.',
  readabilityRules: 'Jangan gunakan efek teks berlebihan yang mengganggu keterbacaan.',
  headingFontFamilyCss: buildFontFamilyCss('Syne, Space Grotesk', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Space Grotesk', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 13. SWISS DESIGN */
export const TYPOGRAPHY_SWISS_DESIGN: TypographyProfile = {
  headingFont: 'Archivo / Inter',
  subheadingFont: 'Archivo',
  bodyFont: 'Inter',
  headingWeight: 'black',
  subheadingWeight: 'bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'tight',
  lineHeight: 'tight',
  typographyCharacter: 'Struktur grid ketat, tipografi tegas.',
  readabilityRules: 'Gunakan hierarki ukuran font yang sangat jelas.',
  headingFontFamilyCss: buildFontFamilyCss('Archivo, Inter', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Archivo', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 14. SURREALISM */
export const TYPOGRAPHY_SURREALISM: TypographyProfile = {
  headingFont: 'Cinzel / Cormorant Garamond',
  subheadingFont: 'Cormorant Garamond',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'wide',
  lineHeight: 'relaxed',
  typographyCharacter: 'Puitis, imajinatif, dan artistik.',
  readabilityRules: 'Batasi elemen tipografi artistik agar materi tetap fokus.',
  headingFontFamilyCss: buildFontFamilyCss('Cinzel, Cormorant Garamond', 'serif'),
  subheadingFontFamilyCss: buildFontFamilyCss('Cormorant Garamond', 'serif'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 15. BOHEMIAN */
export const TYPOGRAPHY_BOHEMIAN: TypographyProfile = {
  headingFont: 'Cormorant Garamond / Lora',
  subheadingFont: 'Lora',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'medium',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Alami, hangat, dan bersahaja.',
  readabilityRules: 'Pastikan keterbacaan tetap terjaga pada teks berwarna bumi.',
  headingFontFamilyCss: buildFontFamilyCss('Cormorant Garamond, Lora', 'serif'),
  subheadingFontFamilyCss: buildFontFamilyCss('Lora', 'serif'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 16. VICTORIAN */
export const TYPOGRAPHY_VICTORIAN: TypographyProfile = {
  headingFont: 'Playfair Display / Cinzel',
  subheadingFont: 'Cinzel',
  bodyFont: 'Merriweather / Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'titlecase',
  letterSpacing: 'wide',
  lineHeight: 'relaxed',
  typographyCharacter: 'Formal, ornamen historis, dan berwibawa.',
  readabilityRules: 'Gunakan serif klasik tanpa mengurangi kenyamanan membaca.',
  headingFontFamilyCss: buildFontFamilyCss('Playfair Display, Cinzel', 'serif'),
  subheadingFontFamilyCss: buildFontFamilyCss('Cinzel', 'serif'),
  bodyFontFamilyCss: buildFontFamilyCss('Merriweather, Inter', 'serif'),
};

/** 17. GRAFFITI */
export const TYPOGRAPHY_GRAFFITI: TypographyProfile = {
  headingFont: 'Rubik Wet Paint / Permanent Marker',
  subheadingFont: 'Archivo Black',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Street art, ekspresif, dan bebas.',
  readabilityRules: 'DILARANG menggunakan font graffiti pada teks materi.',
  headingFontFamilyCss: buildFontFamilyCss('Rubik Wet Paint, Permanent Marker', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Archivo Black', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 18. AURORA */
export const TYPOGRAPHY_AURORA: TypographyProfile = {
  headingFont: 'Montserrat / Plus Jakarta Sans',
  subheadingFont: 'Plus Jakarta Sans',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  typographyCharacter: 'Lembut, bercahaya, dan modern.',
  readabilityRules: 'Pertahankan kontras teks terhadap latar belakang gradasi.',
  headingFontFamilyCss: buildFontFamilyCss('Montserrat, Plus Jakarta Sans', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Plus Jakarta Sans', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 19. HANDWRITTEN */
export const TYPOGRAPHY_HANDWRITTEN: TypographyProfile = {
  headingFont: 'Caveat / Kalam',
  subheadingFont: 'Patrick Hand',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'medium',
  bodyWeight: 'regular',
  headingCase: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  typographyCharacter: 'Catatan personal seperti tulisan guru di papan tulis.',
  readabilityRules: 'Gunakan font tulisan tangan hanya untuk judul dan catatan kecil.',
  headingFontFamilyCss: buildFontFamilyCss('Caveat, Kalam', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Patrick Hand', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
};

/** 20. RETRO */
export const TYPOGRAPHY_RETRO: TypographyProfile = {
  headingFont: 'Righteous / Bungee',
  subheadingFont: 'Poppins',
  bodyFont: 'Inter',
  headingWeight: 'bold',
  subheadingWeight: 'semi bold',
  bodyWeight: 'regular',
  headingCase: 'uppercase',
  letterSpacing: 'wide',
  lineHeight: 'normal',
  typographyCharacter: 'Poster era 70-80an dengan kepribadian kuat.',
  readabilityRules: 'Warna font harus kontras kuat dengan latar belakang retro.',
  headingFontFamilyCss: buildFontFamilyCss('Righteous, Bungee', 'sans'),
  subheadingFontFamilyCss: buildFontFamilyCss('Poppins', 'sans'),
  bodyFontFamilyCss: buildFontFamilyCss('Inter', 'sans'),
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
  retro: TYPOGRAPHY_RETRO,
  modern_edukatif: TYPOGRAPHY_MODERN_EDUKATIF,
};

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
