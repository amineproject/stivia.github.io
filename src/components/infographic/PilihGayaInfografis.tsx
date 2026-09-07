import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Palette, 
  GraduationCap, 
  Cpu, 
  Check, 
  CheckCircle2, 
  Info, 
  HelpCircle,
  Eye,
  Layers,
  Search,
  BookOpen,
  Type,
  Briefcase
} from 'lucide-react';
import { 
  INFOGRAPHIC_STYLE_CATEGORIES, 
  ALL_INFOGRAPHIC_STYLES, 
  InfographicStyleItem, 
  getAIStyleRecommendations, 
  findStyleByNameOrId,
  StyleContextInput
} from '../../data/infographicStylesData';
import { getTypographyProfile } from '../../data/typographyProfiles';
import { StyleInfoModal } from './StyleInfoModal';
import { HowStiviaWorksModal } from './HowStiviaWorksModal';

interface PilihGayaInfografisProps {
  context: StyleContextInput;
  selectedStyleName: string;
  onSelectStyle: (style: InfographicStyleItem) => void;
  className?: string;
}

export const PilihGayaInfografis: React.FC<PilihGayaInfografisProps> = ({
  context,
  selectedStyleName,
  onSelectStyle,
  className = '',
}) => {
  // Mode pemilihan: 'kategori' (5 Kategori STIVIA v2.2) atau 'ai_recom' (Rekomendasi Cerdas)
  const [activeTab, setActiveTab] = useState<'kategori' | 'ai_recom'>('kategori');

  // Modal State
  const [inspectingStyle, setInspectingStyle] = useState<InfographicStyleItem | null>(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isHowWorksModalOpen, setIsHowWorksModalOpen] = useState(false);

  // Search filter
  const [searchKeyword, setSearchKeyword] = useState('');

  // AI recommendations based on context data
  const aiRecommendations = useMemo(() => {
    return getAIStyleRecommendations(context);
  }, [
    context.subject,
    context.theme,
    context.topic,
    context.scope,
    context.educationLevel,
    context.grade,
  ]);

  // Current selected style object
  const currentStyle: InfographicStyleItem = useMemo(() => {
    const found = findStyleByNameOrId(selectedStyleName);
    if (found) return found;
    return aiRecommendations[0] || ALL_INFOGRAPHIC_STYLES[0];
  }, [selectedStyleName, aiRecommendations]);

  // Active Category: null pada awal pembukaan agar tidak langsung menampilkan 20 gaya sekaligus
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const activeCategory = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === 'all') return null;
    return (
      INFOGRAPHIC_STYLE_CATEGORIES.find((c) => c.id === selectedCategoryId) || null
    );
  }, [selectedCategoryId]);

  // List of styles filtered by category and search
  const displayedStyles = useMemo(() => {
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      return ALL_INFOGRAPHIC_STYLES.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        (s.suitableFor && s.suitableFor.some(sf => sf.toLowerCase().includes(q)))
      );
    }

    if (!selectedCategoryId) {
      return [];
    }

    if (selectedCategoryId === 'all') {
      return ALL_INFOGRAPHIC_STYLES;
    }

    return activeCategory ? activeCategory.styles : [];
  }, [selectedCategoryId, activeCategory, searchKeyword]);

  // Category Icon Resolver
  const renderCategoryIcon = (iconName: string, classNameStr: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className={classNameStr} />;
      case 'Palette':
      case 'Feather':
        return <Palette className={classNameStr} />;
      case 'Cpu':
        return <Cpu className={classNameStr} />;
      case 'Briefcase':
        return <Briefcase className={classNameStr} />;
      case 'Sparkles':
        return <Sparkles className={classNameStr} />;
      default:
        return <Layers className={classNameStr} />;
    }
  };

  // Handler buka modal info gaya
  const handleOpenStyleInfo = (style: InfographicStyleItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInspectingStyle(style);
    setIsStyleModalOpen(true);
  };

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Palette className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Sistem Gaya Infografis STIVIA</span>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                v2.2d
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Pilih gaya visual untuk poster infografis pembelajaran Anda. Gaya visual memperindah estetika tanpa pernah mengubah kebenaran isi, judul, atau fakta materi.
          </p>
        </div>

        {/* Action Buttons: Bagaimana STIVIA Bekerja + Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Bagaimana STIVIA Bekerja (POIN E) */}
          <button
            type="button"
            onClick={() => setIsHowWorksModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Pelajari 7 Tahap Kerangka Berpikir STIVIA"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Bagaimana STIVIA Bekerja?</span>
          </button>

          {/* Toggle Tab */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => {
                setActiveTab('kategori');
                setSearchKeyword('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'kategori'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>5 Kategori Gaya</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai_recom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ai_recom'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Rekomendasi AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: STRUKTUR MENU 5 KATEGORI GAYA (B & A)                             */}
      {/* ========================================================================= */}
      {activeTab === 'kategori' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* LANGKAH 1: PILIH KATEGORI */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-2xs flex items-center justify-center font-bold">1</span>
                <span>LANGKAH 1: PILIH KATEGORI GAYA</span>
              </label>

              {/* Pencarian Gaya */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari gaya (misal: Clay, Y2K, Swiss)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 w-56 sm:w-64 transition-all"
                />
              </div>
            </div>

            {/* 5 Tab Kategori Utama + Opsi Semua Gaya (Responsif: Grid 2 kolom mobile, 3 kolom tablet/laptop, 6 kolom desktop lebar) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
              {INFOGRAPHIC_STYLE_CATEGORIES.map((cat) => {
                const isActive = selectedCategoryId === cat.id && !searchKeyword;
                const isCatContainingSelected = cat.styles.some((s) => s.id === currentStyle.id || s.name === currentStyle.name);

                return (
                  <button
                    key={cat.id}
                    type="button"
                    id={`category-tab-${cat.id}`}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setSearchKeyword('');
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer relative ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                        : isCatContainingSelected
                        ? 'bg-indigo-50/90 text-indigo-950 border-indigo-300 hover:border-indigo-400'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className={`p-1.5 rounded-xl shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600'}`}>
                        {renderCategoryIcon(cat.iconName, 'w-4 h-4')}
                      </div>
                      {isActive ? (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-indigo-700 shadow-2xs shrink-0">
                          AKTIF
                        </span>
                      ) : isCatContainingSelected ? (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-200/90 text-indigo-800 shrink-0">
                          Gaya Aktif
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                          {cat.styles.length} Gaya
                        </span>
                      )}
                    </div>

                    <div>
                      <div className={`text-xs sm:text-[13px] font-bold leading-snug break-normal whitespace-normal tracking-tight ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        {cat.name}
                      </div>
                      <div className="mt-1">
                        <span className={`text-[11px] font-medium block truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {cat.tagline ? cat.tagline.split(',')[0] : `${cat.styles.length} pilihan`}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Tab Semua Gaya */}
              <button
                type="button"
                id="category-tab-all"
                onClick={() => {
                  setSelectedCategoryId('all');
                  setSearchKeyword('');
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer relative ${
                  selectedCategoryId === 'all' && !searchKeyword
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className={`p-1.5 rounded-xl shrink-0 ${selectedCategoryId === 'all' && !searchKeyword ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600'}`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  {selectedCategoryId === 'all' && !searchKeyword ? (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-indigo-700 shadow-2xs shrink-0">
                      AKTIF
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      20 Gaya
                    </span>
                  )}
                </div>

                <div>
                  <div className={`text-xs sm:text-[13px] font-bold leading-snug break-normal whitespace-normal tracking-tight ${selectedCategoryId === 'all' && !searchKeyword ? 'text-white' : 'text-slate-800'}`}>
                    SEMUA GAYA
                  </div>
                  <div className="mt-1">
                    <span className={`text-[11px] font-medium block truncate ${selectedCategoryId === 'all' && !searchKeyword ? 'text-indigo-100' : 'text-slate-400'}`}>
                      Koleksi 20 Gaya Resmi
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* LANGKAH 2: PILIH GAYA INFOGRAFIS */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-2xs flex items-center justify-center font-bold">2</span>
              <span>LANGKAH 2: PILIH GAYA INFOGRAFIS</span>
            </label>

            {!selectedCategoryId && !searchKeyword ? (
              /* Pesan Pembuka Saat Belum Memilih Kategori */
              <div className="p-8 sm:p-12 text-center bg-slate-50/80 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                    Pilih Salah Satu Kategori Gaya
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Pilih salah satu kategori gaya di atas untuk melihat pilihan gaya infografis.
                  </p>
                </div>
              </div>
            ) : (
              /* Tampilan Gaya Setelah Kategori Dipilih */
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 pb-3 border-b border-slate-200/80">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0 mt-0.5 border border-indigo-100">
                      {activeCategory ? renderCategoryIcon(activeCategory.iconName, 'w-5 h-5') : <Layers className="w-5 h-5" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xs font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-100/80 px-2 py-0.5 rounded-md border border-indigo-200/60 inline-block">
                          {searchKeyword ? 'HASIL PENCARIAN GAYA' : activeCategory ? `Koleksi: ${activeCategory.name}` : 'Koleksi: SEMUA GAYA'}
                        </span>
                        {activeCategory?.tagline && (
                          <span className="text-xs font-semibold text-slate-700 hidden md:inline">
                            • {activeCategory.tagline}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal max-w-2xl">
                        {searchKeyword
                          ? `Ditemukan ${displayedStyles.length} gaya yang cocok dengan kata kunci.`
                          : activeCategory
                          ? activeCategory.description
                          : 'Koleksi lengkap seluruh 20 gaya visual infografis pembelajaran resmi STIVIA v2.2d.'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 shrink-0 self-start sm:self-auto shadow-2xs">
                    {displayedStyles.length} Gaya Tersedia
                  </span>
                </div>

                {/* Grid Responsif Gaya Infografis (1 col mobile, 2 tablet, 3 desktop medium, 4 desktop besar) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayedStyles.map((style) => {
                    const isSelected = currentStyle.id === style.id;
                    const typo = getTypographyProfile(style.id || style.name);
                    const shortTraits = style.tags && style.tags.length > 0 
                      ? style.tags.slice(0, 2) 
                      : ['TERSTRUKTUR', 'EDUKATIF'];

                    return (
                      <div
                        key={style.id}
                        id={`style-card-${style.id}`}
                        onClick={() => onSelectStyle(style)}
                        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 bg-white relative group select-none min-h-[175px] ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-500/20'
                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 hover:shadow-2xs'
                        }`}
                      >
                        <div className="space-y-2">
                          {/* Header Kartu: Nama & Badge Terpilih */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                                {style.name}
                              </h5>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                                {style.category}
                              </span>
                            </div>

                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                <span>Terpilih</span>
                              </span>
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-indigo-400 shrink-0 mt-0.5 transition-colors" />
                            )}
                          </div>

                          {/* Penggunaan Huruf (Pratinjau Tipografi Harmonis Sesuai Gaya) */}
                          <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-700 text-[11px]">
                            <Type className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span className="font-bold text-slate-800 truncate" style={{ fontFamily: typo.headingFont }}>
                              {typo.headingFont}
                            </span>
                            <span className="text-slate-300 font-light">•</span>
                            <span className="text-slate-500 text-[10px] truncate" style={{ fontFamily: typo.bodyFont }}>
                              {typo.bodyFont}
                            </span>
                          </div>

                          {/* Deskripsi Gaya */}
                          <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                            {style.shortDescription || style.description}
                          </p>
                        </div>

                        {/* Karakter Visual & Tombol Informasi Detail */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                          <div className="flex flex-wrap gap-1">
                            {shortTraits.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleOpenStyleInfo(style, e)}
                            className="inline-flex items-center gap-1 text-2xs font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer shrink-0"
                            title="Lihat informasi lengkap gaya ini"
                          >
                            <Info className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Detail</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: REKOMENDASI AI BERDASARKAN MATA PELAJARAN                         */}
      {/* ========================================================================= */}
      {activeTab === 'ai_recom' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Gaya yang Direkomendasikan Berdasarkan Mata Pelajaran & Tema:</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {context.subject || 'Umum'} • {context.educationLevel || 'SMA'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {aiRecommendations.map((style, idx) => {
              const isSelected = currentStyle.id === style.id;
              const typo = getTypographyProfile(style.id || style.name);
              const shortTraits = style.tags && style.tags.length > 0
                ? style.tags.slice(0, 2)
                : ['REKOMENDASI', 'AI'];

              return (
                <div
                  key={style.id}
                  id={`ai-style-card-${style.id}`}
                  onClick={() => onSelectStyle(style)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group select-none min-h-[175px] ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 hover:shadow-2xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                        Rekomendasi #{idx + 1}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span>Terpilih</span>
                        </span>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-indigo-400 shrink-0 transition-colors" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {style.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                        {style.category}
                      </span>
                    </div>

                    {/* Penggunaan Huruf (Pratinjau Tipografi) */}
                    <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-700 text-[11px]">
                      <Type className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="font-bold text-slate-800 truncate" style={{ fontFamily: typo.headingFont }}>
                        {typo.headingFont}
                      </span>
                      <span className="text-slate-300 font-light">•</span>
                      <span className="text-slate-500 text-[10px] truncate" style={{ fontFamily: typo.bodyFont }}>
                        {typo.bodyFont}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                      {style.shortDescription || style.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                    <div className="flex flex-wrap gap-1">
                      {shortTraits.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleOpenStyleInfo(style, e)}
                      className="inline-flex items-center gap-1 text-2xs font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer shrink-0"
                      title="Lihat informasi lengkap gaya ini"
                    >
                      <Info className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Detail</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANGKAH 3: KONFIGURASI GAYA TERPILIH                                      */}
      {/* ========================================================================= */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-2xs flex items-center justify-center font-bold">3</span>
          <span>LANGKAH 3: KONFIGURASI GAYA TERPILIH</span>
        </label>

        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-indigo-100">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-indigo-950 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>✓ GAYA INFOGRAFIS TERPILIH</span>
            </div>
            <button
              type="button"
              onClick={() => handleOpenStyleInfo(currentStyle)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-2xs transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lihat Rincian Gaya Ini</span>
            </button>
          </div>

        {(() => {
          const typo = getTypographyProfile(currentStyle.id || currentStyle.name);
          return (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider">
                    KATEGORI GAYA
                  </span>
                  <span className="font-extrabold text-slate-800 text-xs sm:text-sm block">
                    {currentStyle.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider">
                    NAMA GAYA VISUAL
                  </span>
                  <span className="font-black text-indigo-600 text-sm sm:text-base block">
                    {currentStyle.name}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider">
                    TIPOGRAFI OTOMATIS
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
                    <span style={{ fontFamily: typo.headingFont }}>{typo.headingFont}</span>
                    <span className="text-slate-400 font-light">+</span>
                    <span className="text-slate-700 font-medium" style={{ fontFamily: typo.bodyFont }}>{typo.bodyFont}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider">
                    KARAKTER UTAMA
                  </span>
                  <span className="font-medium text-slate-700 text-xs leading-relaxed block line-clamp-2">
                    {currentStyle.characterExample || currentStyle.shortDescription || currentStyle.description}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-0.5">
                <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Kerangka Berpikir STIVIA akan secara otomatis menerapkan tipografi harmonis (<strong className="text-slate-900" style={{ fontFamily: typo.headingFont }}>{typo.headingFont}</strong> & <strong className="text-slate-900" style={{ fontFamily: typo.bodyFont }}>{typo.bodyFont}</strong>), warna, serta ornamen visual sesuai gaya <strong className="text-slate-900">{currentStyle.name}</strong> tanpa mengubah materi asli.
                </span>
              </div>
            </>
          );
        })()}
        </div>
      </div>

      {/* Pop-up Modal Informasi Gaya (POIN C) */}
      <StyleInfoModal
        styleItem={inspectingStyle}
        isOpen={isStyleModalOpen}
        onClose={() => setIsStyleModalOpen(false)}
        onSelectAndApply={(style) => onSelectStyle(style)}
        isSelected={currentStyle.id === inspectingStyle?.id}
      />

      {/* Pop-up Modal Bagaimana STIVIA Bekerja (POIN E) */}
      <HowStiviaWorksModal
        isOpen={isHowWorksModalOpen}
        onClose={() => setIsHowWorksModalOpen(false)}
      />
    </div>
  );
};
