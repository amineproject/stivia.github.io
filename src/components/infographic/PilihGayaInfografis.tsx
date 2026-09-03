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
  BookOpen
} from 'lucide-react';
import { 
  INFOGRAPHIC_STYLE_CATEGORIES, 
  ALL_INFOGRAPHIC_STYLES, 
  InfographicStyleItem, 
  getAIStyleRecommendations, 
  findStyleByNameOrId,
  StyleContextInput
} from '../../data/infographicStylesData';
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

  // Active Category (default ke kategori dari style yang sedang terpilih atau kategori pertama)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    return currentStyle.categoryId || INFOGRAPHIC_STYLE_CATEGORIES[0].id;
  });

  const activeCategory = useMemo(() => {
    if (selectedCategoryId === 'all') return null;
    return (
      INFOGRAPHIC_STYLE_CATEGORIES.find((c) => c.id === selectedCategoryId) ||
      INFOGRAPHIC_STYLE_CATEGORIES[0]
    );
  }, [selectedCategoryId]);

  // List of styles filtered by category and search
  const displayedStyles = useMemo(() => {
    let list = selectedCategoryId === 'all' 
      ? ALL_INFOGRAPHIC_STYLES 
      : activeCategory ? activeCategory.styles : ALL_INFOGRAPHIC_STYLES;

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      list = ALL_INFOGRAPHIC_STYLES.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        (s.suitableFor && s.suitableFor.some(sf => sf.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [selectedCategoryId, activeCategory, searchKeyword]);

  // Category Icon Resolver
  const renderCategoryIcon = (iconName: string, classNameStr: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className={classNameStr} />;
      case 'Palette':
        return <Palette className={classNameStr} />;
      case 'Cpu':
        return <Cpu className={classNameStr} />;
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
                v2.2
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
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* TAHAP 1: PILIH KATEGORI GAYA */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-2xs flex items-center justify-center font-bold">1</span>
                <span>PILIH KATEGORI GAYA</span>
              </label>

              {/* Pencarian Gaya */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari gaya (misal: Clay, Y2K, Swiss)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 w-52 sm:w-64 transition-all"
                />
              </div>
            </div>

            {/* 5 Tab Kategori Utama + Opsi Semua Gaya */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {INFOGRAPHIC_STYLE_CATEGORIES.map((cat) => {
                const isActive = selectedCategoryId === cat.id && !searchKeyword;
                const isCatContainingSelected = cat.styles.some((s) => s.id === currentStyle.id);

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setSearchKeyword('');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : isCatContainingSelected
                        ? 'bg-indigo-50/80 text-indigo-900 border-indigo-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600'}`}>
                        {renderCategoryIcon(cat.iconName, 'w-3.5 h-3.5')}
                      </div>
                      {isCatContainingSelected && (
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-indigo-600'}`} />
                      )}
                    </div>
                    <div>
                      <div className="text-2xs font-extrabold uppercase tracking-tight leading-tight line-clamp-2">
                        {cat.name}
                      </div>
                      <span className={`text-[10px] block mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {cat.styles.length} gaya
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Tab Semua Gaya */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryId('all');
                  setSearchKeyword('');
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                  selectedCategoryId === 'all' && !searchKeyword
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${selectedCategoryId === 'all' && !searchKeyword ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600'}`}>
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xs font-extrabold uppercase tracking-tight leading-tight">
                    SEMUA GAYA
                  </div>
                  <span className={`text-[10px] block mt-0.5 ${selectedCategoryId === 'all' && !searchKeyword ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {ALL_INFOGRAPHIC_STYLES.length} pilihan
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* TAHAP 2: PILIH GAYA INFOGRAFIS & LIHAT INFORMASI */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                  {searchKeyword ? 'Hasil Pencarian Gaya' : activeCategory ? `Kategori: ${activeCategory.name}` : 'Semua Koleksi Gaya'}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {searchKeyword ? `Mencari "${searchKeyword}"` : activeCategory ? activeCategory.tagline : 'Seluruh Gaya Infografis STIVIA'}
                </h4>
                {activeCategory && !searchKeyword && (
                  <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
                    {activeCategory.description}
                  </p>
                )}
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shrink-0 self-start sm:self-auto">
                {displayedStyles.length} Gaya Tersedia
              </span>
            </div>

            {/* Grid Gaya Infografis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {displayedStyles.map((style) => {
                const isSelected = currentStyle.id === style.id;

                return (
                  <div
                    key={style.id}
                    id={`style-card-${style.id}`}
                    onClick={() => onSelectStyle(style)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 bg-white relative group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200/90 hover:border-indigo-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600/90 uppercase tracking-wider">
                          {style.category}
                        </span>
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shadow-2xs">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-indigo-400" />
                        )}
                      </div>

                      <h5 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        {style.name}
                      </h5>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {style.shortDescription || style.description}
                      </p>
                    </div>

                    {/* Tombol Lihat Informasi Gaya (POIN B & C) */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {style.tags.slice(0, 1).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleOpenStyleInfo(style, e)}
                        className="inline-flex items-center gap-1 text-2xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 hover:bg-indigo-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Buka pop-up informasi lengkap gaya ini"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lihat Info</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {aiRecommendations.map((style, idx) => {
              const isSelected = currentStyle.id === style.id;
              return (
                <div
                  key={style.id}
                  id={`ai-style-card-${style.id}`}
                  onClick={() => onSelectStyle(style)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-600 shadow-xs ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                        Rekomendasi #{idx + 1}
                      </span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-indigo-400" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {style.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-indigo-600 block mt-0.5">
                        {style.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {style.shortDescription || style.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {style.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleOpenStyleInfo(style, e)}
                      className="inline-flex items-center gap-1 text-2xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Info</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAHAP 4: GUNAKAN GAYA (STATUS PILIHAN GAYA SAAT INI)                       */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>✓ Gaya Infografis Terpilih</span>
          </div>
          <button
            type="button"
            onClick={() => handleOpenStyleInfo(currentStyle)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-2xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Lihat Rincian Gaya Ini</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-indigo-100">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              Kategori Gaya
            </span>
            <span className="font-bold text-indigo-950">
              {currentStyle.category}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              Nama Gaya Visual
            </span>
            <span className="font-extrabold text-indigo-600 text-sm">
              {currentStyle.name}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              Karakter Utama
            </span>
            <span className="font-medium text-slate-700 line-clamp-2">
              {currentStyle.characterExample || currentStyle.shortDescription || currentStyle.description}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-0.5">
          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
          <span>
            Kerangka Berpikir STIVIA akan secara otomatis menyesuaikan ilustrasi, ikon, dan komposisi visual sesuai gaya <strong className="text-slate-900">{currentStyle.name}</strong> tanpa mengubah materi asli.
          </span>
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
