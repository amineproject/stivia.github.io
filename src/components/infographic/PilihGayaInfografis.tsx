import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Palette, 
  GraduationCap, 
  Cpu, 
  BarChart2, 
  Smile, 
  Landmark, 
  Check, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  Wand2, 
  Layers,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { 
  INFOGRAPHIC_STYLE_CATEGORIES, 
  ALL_INFOGRAPHIC_STYLES, 
  InfographicStyleItem, 
  InfographicStyleCategory, 
  getAIStyleRecommendations, 
  findStyleByNameOrId,
  StyleContextInput
} from '../../data/infographicStylesData';

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
  // Mode selection: 'ai_recom' (Rekomendasi AI) or 'manual' (Pilih Manual)
  const [selectionMode, setSelectionMode] = useState<'ai_recom' | 'manual'>('ai_recom');

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
    // Default to first AI recommendation or Modern Education
    return aiRecommendations[0] || ALL_INFOGRAPHIC_STYLES[0];
  }, [selectedStyleName, aiRecommendations]);

  // Active Category for manual browsing
  const [activeCategoryId, setActiveCategoryId] = useState<string>(() => {
    return currentStyle.categoryId || INFOGRAPHIC_STYLE_CATEGORIES[0].id;
  });

  const activeCategory = useMemo(() => {
    return (
      INFOGRAPHIC_STYLE_CATEGORIES.find((c) => c.id === activeCategoryId) ||
      INFOGRAPHIC_STYLE_CATEGORIES[0]
    );
  }, [activeCategoryId]);

  // Category Icon Resolver
  const renderCategoryIcon = (iconName: string, classNameStr: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className={classNameStr} />;
      case 'Palette':
        return <Palette className={classNameStr} />;
      case 'Cpu':
        return <Cpu className={classNameStr} />;
      case 'BarChart2':
        return <BarChart2 className={classNameStr} />;
      case 'Smile':
        return <Smile className={classNameStr} />;
      case 'Landmark':
        return <Landmark className={classNameStr} />;
      default:
        return <Palette className={classNameStr} />;
    }
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
              <span>🎨 Pilih Gaya Infografis</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Tentukan gaya visual yang akan diinstruksikan ke dalam Prompt Desain Infografis. Pilihan gaya hanya memengaruhi karakter estetika, tanpa mengubah isi materi.
          </p>
        </div>

        {/* Tab Pemilihan: Rekomendasi AI vs Pilih Manual */}
        <div className="flex items-center p-1 bg-[#f1f5f9] rounded-2xl border border-slate-200/70 self-start sm:self-auto">
          <button
            type="button"
            id="tab-style-ai-recom"
            onClick={() => setSelectionMode('ai_recom')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectionMode === 'ai_recom'
                ? 'bg-white text-[#3b49df] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3b49df]" />
            <span>✨ Rekomendasi AI</span>
          </button>

          <button
            type="button"
            id="tab-style-manual"
            onClick={() => setSelectionMode('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectionMode === 'manual'
                ? 'bg-white text-[#3b49df] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#3b49df]" />
            <span>🎨 Pilih Manual</span>
          </button>
        </div>
      </div>

      {/* METODE 1: REKOMENDASI AI */}
      {selectionMode === 'ai_recom' && (
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
                      ? 'bg-indigo-50/60 border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
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
                      {style.characteristics}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                    {style.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* METODE 2: PILIH MANUAL (6 KATEGORI & 5 GAYA PER KATEGORI) */}
      {selectionMode === 'manual' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* List 6 Kategori Tab Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Pilih Kategori Gaya
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {INFOGRAPHIC_STYLE_CATEGORIES.map((cat) => {
                const isActive = activeCategoryId === cat.id;
                const isCatContainingSelected = cat.styles.some((s) => s.id === currentStyle.id);

                return (
                  <button
                    key={cat.id}
                    type="button"
                    id={`btn-cat-${cat.id}`}
                    onClick={() => setActiveCategoryId(cat.id)}
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
                    <div className="text-[11px] font-bold tracking-tight leading-tight line-clamp-2">
                      {cat.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deskripsi Kategori Aktif & List 5 Gaya */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                  Kategori Terpilih
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {activeCategory.name}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeCategory.description}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shrink-0 self-start sm:self-auto">
                {activeCategory.styles.length} Pilihan Gaya
              </span>
            </div>

            {/* List 5 Gaya dalam Kategori Aktif */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {activeCategory.styles.map((style) => {
                const isSelected = currentStyle.id === style.id;

                return (
                  <div
                    key={style.id}
                    id={`manual-style-card-${style.id}`}
                    onClick={() => onSelectStyle(style)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 bg-white ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">
                          {style.category}
                        </span>
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {style.name}
                      </h5>

                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                        {style.characteristics}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-100">
                      {style.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STATUS PILIHAN GAYA SAAT INI (✓ Gaya Infografis Terpilih) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>✓ Gaya Infografis Terpilih</span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200 shadow-2xs">
            Siap Dimasukkan ke Prompt
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-indigo-100">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              Kategori
            </span>
            <span className="font-bold text-indigo-950">
              {currentStyle.category}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              Gaya Visual
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
              {currentStyle.characteristics}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-0.5">
          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
          <span>
            Instruksi visual untuk gaya <strong className="text-slate-900">{currentStyle.name}</strong> akan otomatis ditambahkan ke bagian spesifikasi visual prompt saat Anda menekan tombol Generate.
          </span>
        </div>
      </div>
    </div>
  );
};
