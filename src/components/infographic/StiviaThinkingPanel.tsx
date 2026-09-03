import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Palette, 
  Image as ImageIcon, 
  Layout, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Compass,
  Layers
} from 'lucide-react';
import { StiviaThinkingResult } from '../../services/stiviaThinkingFramework';

interface StiviaThinkingPanelProps {
  thinkingResult: StiviaThinkingResult | null;
  className?: string;
}

export const StiviaThinkingPanel: React.FC<StiviaThinkingPanelProps> = ({
  thinkingResult,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!thinkingResult) return null;

  // Normalisasi data dari StiviaThinkingResult (mendukung format v2.2 maupun fallback)
  const stage1 = (thinkingResult as any).stage1_Understanding || (thinkingResult as any).stage1_MaterialUnderstanding || {
    title: 'Materi Pembelajaran',
    topic: 'Materi Pembelajaran',
    subject: 'Mata Pelajaran',
    educationLevel: 'Umum',
    grade: 'Lengkap',
    learningObjective: 'Memahami konsep pembelajaran secara terstruktur.',
    coreMessage: 'Memahami konsep pembelajaran secara terstruktur.',
    scopeOverview: 'Cakupan materi lengkap.',
    contentVolume: 'Sedang'
  };

  const stage2 = (thinkingResult as any).stage2_ImportantInfo || {
    mainConcept: stage1.title || stage1.topic || 'Konsep Pokok',
    subConcepts: [],
    keywords: [],
    essentialInformation: [],
    informationRelationship: 'Hubungan logis terstruktur'
  };

  const stage3 = (thinkingResult as any).stage3_MaterialCharacters || (thinkingResult as any).stage2_CharacterDetection || {
    detectedCharacters: ['Konseptual'],
    primaryCharacter: 'Konseptual',
    rationale: 'Materi pembelajaran tersusun atas konsep esensial yang runut.'
  };

  const stage4 = (thinkingResult as any).stage4_StyleUnderstanding || (thinkingResult as any).stage3_StyleUnderstanding || {
    selectedStyle: { name: 'Sains Modern (Navy Clean)', category: 'Sains & Edukasi' },
    styleName: 'Sains Modern (Navy Clean)',
    category: 'Sains & Edukasi',
    visualTone: 'Edukatif, rapi, dan modern',
    visualAtmosphere: 'Penyajian visual edukatif yang selaras',
    invarianceNotice: 'Gaya visual tidak mengubah isi materi.'
  };

  const stage5 = (thinkingResult as any).stage5_SupportingVisuals || (thinkingResult as any).stage4_MainVisual || {
    heroVisual: 'Visual sentral mewakili konsep materi utama',
    primaryAnchor: 'Visual sentral mewakili konsep materi utama',
    reason: 'Memudahkan peserta didik menangkap ide utama seketika',
    placement: 'Area atas / tengah kanvas',
    supportingIllustrations: [],
    supportingElements: [],
    icons: [],
    relevantObjects: [],
    supportingOrnaments: [],
    styleAdaptiveVisualNote: 'Visual pendukung proporsional sesuai gaya'
  };

  const stage6 = (thinkingResult as any).stage6_LayoutStrategy || {
    strategy: 'Struktur Vertikal Berjenjang',
    layoutDescription: 'Tata letak kanvas vertikal 2:3 terstruktur',
    readingFlow: 'Alur baca vertikal dari atas ke bawah',
    rationale: 'Menjamin hierarki visual logis dan keterbacaan prima',
    canvasStandard: 'Vertikal (Rasio 2:3)',
    spacingGuidance: 'Spasi bernapas proporsional antar kartu materi'
  };

  // Safe helper properties
  const displayTopic = stage1.title || stage1.topic || 'Materi Pembelajaran';
  const displaySubject = stage1.subject || 'Umum';
  const displayLevel = stage1.educationLevel || 'Semua Jenjang';
  const displayGrade = stage1.grade ? `(${stage1.grade})` : '';
  const displayCore = stage1.learningObjective || stage1.coreMessage || stage1.scopeOverview || 'Intisari materi terstruktur.';

  const displayCharacter = stage3.primaryCharacter || stage3.primaryNature || 'Konseptual';
  const displayCharacterDesc = stage3.rationale || stage3.explanation || 'Analisis karakter materi pembelajaran';
  const displayKeywords = (stage2.keywords && stage2.keywords.length > 0)
    ? stage2.keywords.slice(0, 5).join(', ')
    : (stage3.detectedCharacters ? stage3.detectedCharacters.join(', ') : 'Konsep, Prinsip, Aplikasi');

  const displayStyleName = stage4.selectedStyle?.name || stage4.styleName || 'Gaya Edukatif';
  const displayStyleCat = stage4.selectedStyle?.category || stage4.category || 'Desain Pembelajaran';
  const displayStyleTone = stage4.visualTone || stage4.visualAtmosphere || 'Penyajian visual selaras karakter materi';

  const displayHeroVisual = stage5.heroVisual || stage5.primaryAnchor || 'Visual sentral konsep utama';
  const displayHeroReason = stage5.reason || 'Memberi fokus visual utama bagi peserta didik';
  const displayHeroPlacement = stage5.placement || 'Area Utama Kanvas (Rasio 2:3)';

  const supportingItems = stage5.supportingIllustrations?.length > 0 
    ? stage5.supportingIllustrations 
    : (stage5.supportingElements?.length > 0 ? stage5.supportingElements : stage5.relevantObjects || ['Diagram Alur', 'Kartu Poin', 'Ikon Edukasi']);

  const displayIcons = stage5.icons?.length > 0
    ? stage5.icons.slice(0, 4).join(', ')
    : (stage5.iconographyGuidance || 'Ikon simbolik kontekstual');

  const displayFlow = stage6.readingFlow || 'Alur baca vertikal dari atas ke bawah';
  const displayLayoutDesc = stage6.layoutDescription || stage6.strategy || 'Tata letak kanvas vertikal terstruktur';
  const displaySpacing = stage6.spacingGuidance || stage6.rationale || 'Komposisi seimbang dengan kontras WCAG AA';

  return (
    <div className={`bg-linear-to-br from-indigo-900/90 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-7 border border-indigo-500/30 shadow-xl space-y-5 animate-in fade-in duration-300 ${className}`}>
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-500/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-2xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Kerangka Berpikir STIVIA v2.2</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <span>Hasil Analisis 7 Tahap Kerangka Berpikir</span>
          </h3>
          <p className="text-xs text-indigo-200/80 max-w-xl">
            STIVIA menganalisis materi dan menyelaraskan gaya visual pilihan Anda sebelum menyusun prompt akhir.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Materi Terlindungi 100%</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? 'Sembunyikan rincian analisis' : 'Tampilkan rincian analisis'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Konten Rincian 6 Tahap Analisis (Tahap 7 adalah prompt teks di bawahnya) */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs animate-in fade-in duration-200">
          {/* TAHAP 1: MEMAHAMI MATERI */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Tahap 1: Memahami Materi</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="font-semibold text-white truncate">{displayTopic}</div>
              <div className="text-2xs text-slate-400">{displaySubject} • {displayLevel} {displayGrade}</div>
              <p className="text-2xs text-slate-300 line-clamp-2 mt-1">
                {displayCore}
              </p>
            </div>
          </div>

          {/* TAHAP 2: MENGENALI KARAKTER MATERI */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Tahap 2: Karakter Materi</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <span className="inline-block text-2xs font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {displayCharacter}
              </span>
              <p className="text-2xs text-slate-300 leading-relaxed line-clamp-2">
                {displayCharacterDesc}
              </p>
              <div className="text-2xs text-slate-400">
                Kata Kunci: <span className="text-slate-200">{displayKeywords}</span>
              </div>
            </div>
          </div>

          {/* TAHAP 3: MEMAHAMI GAYA YANG DIPILIH */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Tahap 3: Gaya Pilihan</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="font-bold text-white text-sm truncate">{displayStyleName}</div>
              <div className="text-2xs text-purple-300 font-semibold">{displayStyleCat}</div>
              <p className="text-2xs text-slate-300 line-clamp-2">
                {displayStyleTone}
              </p>
            </div>
          </div>

          {/* TAHAP 4: MENENTUKAN VISUAL UTAMA */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Tahap 4: Visual Utama</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="font-semibold text-white leading-tight line-clamp-1">
                {displayHeroVisual}
              </div>
              <p className="text-2xs text-slate-300 line-clamp-2">
                {displayHeroReason}
              </p>
              <div className="text-2xs text-emerald-400">
                Fokus: {displayHeroPlacement}
              </div>
            </div>
          </div>

          {/* TAHAP 5: MENENTUKAN VISUAL PENDUKUNG */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Tahap 5: Visual Pendukung</span>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex flex-wrap gap-1">
                {supportingItems.slice(0, 3).map((el: string, i: number) => (
                  <span key={i} className="text-2xs px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-200">
                    {el}
                  </span>
                ))}
              </div>
              <p className="text-2xs text-slate-300 line-clamp-2">
                Ikon: {displayIcons}
              </p>
            </div>
          </div>

          {/* TAHAP 6: MENENTUKAN STRUKTUR & TATA LETAK */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <Layout className="w-4 h-4 text-rose-400" />
              <span>Tahap 6: Strategi Tata Letak</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="font-semibold text-white truncate">
                {displayFlow}
              </div>
              <div className="text-2xs text-slate-400">
                Standar: Vertikal (Rasio 2:3)
              </div>
              <p className="text-2xs text-slate-300 line-clamp-2">
                {displaySpacing}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Catatan Integritas Materi STIVIA */}
      <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-start gap-2 text-xs text-indigo-200">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-white">
            Prinsip Mutlak Kerangka Berpikir STIVIA:
          </span>
          <p className="text-2xs text-indigo-200/90 leading-relaxed">
            Gaya <span className="text-white font-semibold">{displayStyleName}</span> hanya mengatur karakter visual, ilustrasi pendukung, dan tata letak kanvas 2:3. Judul, fakta ilmiah, isi pembahasan, dan kedalaman materi pembelajaran tetap 100% utuh dan orisinal.
          </p>
        </div>
      </div>
    </div>
  );
};
