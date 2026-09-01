import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Layers, 
  BookOpen, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2,
  FileText,
  Lightbulb,
  Palette,
  Eye,
  Scale,
  Gauge,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { 
  InfographicDraft, 
  MaterialBlock, 
  NavigationTab,
  ExampleContext 
} from '../../types';
import { 
  EXAMPLE_CONTEXT_OPTIONS 
} from '../../data/mockData';
import { EditBlockModal } from '../EditBlockModal';

interface RancanganMateriPageProps {
  draft: InfographicDraft;
  onUpdateDraft: (updated: Partial<InfographicDraft>) => void;
  onNavigate: (tab: NavigationTab) => void;
  onSaveToast: (msg: string) => void;
}

export const RancanganMateriPage: React.FC<RancanganMateriPageProps> = ({
  draft,
  onUpdateDraft,
  onNavigate,
  onSaveToast,
}) => {
  const [title, setTitle] = useState(draft.title || 'Rancangan Materi Pembelajaran');
  const [learningObjective, setLearningObjective] = useState(
    draft.learningObjective || 
    'Siswa dapat memahami definisi, konsep pokok, dan penerapan praktis materi dalam kehidupan sehari-hari.'
  );
  const [exampleContext, setExampleContext] = useState<ExampleContext>(draft.exampleContext || 'otomatis');
  const [customContext, setCustomContext] = useState(draft.customExampleContext || '');
  const [blocks, setBlocks] = useState<MaterialBlock[]>(draft.blocks || []);

  // Sync state when draft prop changes
  React.useEffect(() => {
    setTitle(draft.title || 'Rancangan Materi Pembelajaran');
    setLearningObjective(
      draft.learningObjective || 
      'Siswa dapat memahami definisi, konsep pokok, dan penerapan praktis materi dalam kehidupan sehari-hari.'
    );
    setExampleContext(draft.exampleContext || 'otomatis');
    setCustomContext(draft.customExampleContext || '');
    setBlocks(draft.blocks || []);
  }, [draft.id, draft.title, draft.blocks]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<MaterialBlock | null>(null);

  // Sync title and objective changes to parent draft
  const handleTitleChange = (val: string) => {
    setTitle(val);
    onUpdateDraft({ title: val });
  };

  const handleObjectiveChange = (val: string) => {
    setLearningObjective(val);
    onUpdateDraft({ learningObjective: val });
  };

  const handleContextChange = (val: ExampleContext) => {
    setExampleContext(val);
    onUpdateDraft({ exampleContext: val });
  };

  const handleCustomContextChange = (val: string) => {
    setCustomContext(val);
    onUpdateDraft({ customExampleContext: val });
  };

  // Block management
  const handleOpenAddBlock = () => {
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const handleOpenEditBlock = (block: MaterialBlock) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleSaveBlock = (savedBlock: MaterialBlock) => {
    let updated: MaterialBlock[];
    const exists = blocks.some(b => b.id === savedBlock.id);

    if (exists) {
      updated = blocks.map(b => b.id === savedBlock.id ? savedBlock : b);
    } else {
      updated = [...blocks, savedBlock];
    }

    // Re-index orders
    const reIndexed = updated.map((b, i) => ({ ...b, order: i + 1 }));
    setBlocks(reIndexed);
    onUpdateDraft({ blocks: reIndexed });
    onSaveToast('Rancangan blok materi diperbarui.');
  };

  const handleDeleteBlock = (blockId: string) => {
    const filtered = blocks.filter(b => b.id !== blockId);
    const reIndexed = filtered.map((b, i) => ({ ...b, order: i + 1 }));
    setBlocks(reIndexed);
    onUpdateDraft({ blocks: reIndexed });
    onSaveToast('Blok materi berhasil dihapus.');
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;

    const reIndexed = newBlocks.map((b, i) => ({ ...b, order: i + 1 }));
    setBlocks(reIndexed);
    onUpdateDraft({ blocks: reIndexed });
  };

  const handleSaveDraft = () => {
    onUpdateDraft({
      title,
      learningObjective,
      exampleContext,
      customExampleContext: customContext,
      blocks,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    onSaveToast('Draft rancangan materi berhasil disimpan ke penyimpanan lokal.');
  };

  // Helper for card styling based on order or color
  const getBadgeColor = (order: number, accent?: string) => {
    if (accent === 'teal' || order === 2) {
      return {
        bgBadge: 'bg-teal-500 text-white',
        borderAccent: 'border-l-4 border-l-teal-500',
        tagText: 'text-teal-800',
        subBg: 'bg-teal-50/50',
      };
    }
    if (accent === 'amber' || order === 3) {
      return {
        bgBadge: 'bg-amber-500 text-white',
        borderAccent: 'border-l-4 border-l-amber-500',
        tagText: 'text-amber-800',
        subBg: 'bg-amber-50/50',
      };
    }
    if (accent === 'emerald' || order === 4) {
      return {
        bgBadge: 'bg-emerald-500 text-white',
        borderAccent: 'border-l-4 border-l-emerald-500',
        tagText: 'text-emerald-800',
        subBg: 'bg-emerald-50/50',
      };
    }
    if (accent === 'sky' || order === 5) {
      return {
        bgBadge: 'bg-sky-500 text-white',
        borderAccent: 'border-l-4 border-l-sky-500',
        tagText: 'text-sky-800',
        subBg: 'bg-sky-50/50',
      };
    }
    if (accent === 'violet' || order === 6) {
      return {
        bgBadge: 'bg-violet-600 text-white',
        borderAccent: 'border-l-4 border-l-violet-600',
        tagText: 'text-violet-800',
        subBg: 'bg-violet-50/50',
      };
    }
    return {
      bgBadge: 'bg-indigo-600 text-white',
      borderAccent: 'border-l-4 border-l-indigo-600',
      tagText: 'text-indigo-800',
      subBg: 'bg-indigo-50/50',
    };
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      {/* Top Header matching 3. rancangan infografis.png */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rancangan Materi
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Periksa dan sesuaikan struktur serta konten materi sebelum kecerdasan buatan STIVIA mengubahnya menjadi infografis visual.
          </p>
        </div>

        {/* Top Right: Konteks Visual & Analogi selector (Matches Screenshot) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
            Konteks Visual & Analogi:
          </label>
          <div className="relative min-w-[260px]">
            <select
              value={exampleContext}
              onChange={(e) => handleContextChange(e.target.value as ExampleContext)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-xs focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
            >
              {EXAMPLE_CONTEXT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Custom Context input if selected */}
      {exampleContext === 'kustom' && (
        <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl animate-in fade-in">
          <label className="block text-xs font-bold text-indigo-900 mb-1">
            Ketik konteks contoh yang diinginkan:
          </label>
          <input
            type="text"
            value={customContext}
            onChange={(e) => handleCustomContextChange(e.target.value)}
            placeholder="Contoh: Peternakan lebah madu, transportasi maritim nusantara, dll."
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      )}

      {/* Detail Infografis & Estimasi Layout Cards (Matches 3. rancangan infografis.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: DETAIL INFOGRAFIS */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 pb-1">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              DETAIL INFOGRAFIS
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Judul Infografis
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Judul Infografis..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm sm:text-base font-bold focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Tujuan Pembelajaran
              </label>
              <textarea
                rows={3}
                value={learningObjective}
                onChange={(e) => handleObjectiveChange(e.target.value)}
                placeholder="Tujuan Pembelajaran..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Card: ESTIMASI LAYOUT & CONTENT ENGINE */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ESTIMASI LAYOUT
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>100% Sesuai Cakupan</span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
                {blocks.length}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                Blok Konten
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Kepadatan konten ideal untuk format {draft.format === 'portrait' ? 'Vertikal A4' : draft.format}.
            </p>

            {/* Tahap 2A, 2B, 2C Metrics Summary */}
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">2A. Struktur</p>
                <p className="text-xs font-extrabold text-indigo-700 mt-0.5">{blocks.length} Bagian</p>
              </div>
              <div className="bg-purple-50/60 p-2 rounded-xl border border-purple-100">
                <p className="text-[9px] font-bold uppercase tracking-wider text-purple-700">2B. Bobot</p>
                <p className="text-xs font-extrabold text-purple-800 mt-0.5">
                  {blocks.filter(b => b.weight === 'UTAMA').length} Utama
                </p>
              </div>
              <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">2C. Kedalaman</p>
                <p className="text-xs font-extrabold text-emerald-800 mt-0.5">Proporsional</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Validasi Konten:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>10 Parameter Lolos</span>
            </span>
          </div>
        </div>
      </div>

      {/* Coverage Check Banner */}
      {draft.requiredTopics && draft.requiredTopics.length > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-emerald-950">
                Tahap 2A — Verifikasi Struktur & Kontrak Cakupan ({draft.requiredTopics.length} Topik Wajib Terpenuhi)
              </span>
            </div>
            <span className="text-[11px] font-medium text-emerald-700">
              Semua poin dari pengguna dibahas berurutan & berbobot
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
            {draft.requiredTopics.map((topic, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 border border-emerald-200 text-xs font-semibold text-slate-800 shadow-2xs"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                  ✓
                </span>
                <span className="truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urutan Materi Section (Matches 3. rancangan infografis.png) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <h2 className="text-base font-bold text-slate-900 shrink-0">
              Urutan Materi
            </h2>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* + Tambah Blok Action */}
          <button
            onClick={handleOpenAddBlock}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Blok</span>
          </button>
        </div>

        {/* Blocks Grid (Matches 3. rancangan infografis.png) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blocks.map((block, index) => {
            const badgeStyle = getBadgeColor(block.order, block.accentColor);
            return (
              <div
                key={block.id}
                className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group ${badgeStyle.borderAccent}`}
              >
                <div className="p-5 space-y-3">
                  {/* Top Block Header with Badge & Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${badgeStyle.bgBadge}`}>
                        {block.order}
                      </span>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${badgeStyle.tagText}`}>
                        {block.tag}
                      </span>
                    </div>

                    {/* Reorder and action controls */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button
                          onClick={() => handleMoveBlock(index, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                          title="Geser ke Atas"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {index < blocks.length - 1 && (
                        <button
                          onClick={() => handleMoveBlock(index, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                          title="Geser ke Bawah"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEditBlock(block)}
                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                        title="Edit Blok Ini"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Weight & Depth Badges (Tahap 2B & 2C) */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {block.weight && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        block.weight === 'UTAMA' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                        block.weight === 'SEDANG' ? 'bg-sky-100 text-sky-700 border border-sky-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        Bobot: {block.weight}
                      </span>
                    )}
                    {block.depth && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Kedalaman: {block.depth}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {block.title}
                  </h3>

                  {/* Content */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {block.content}
                  </p>

                  {/* Context Quote Area */}
                  {block.example && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 italic leading-snug">
                      {block.example}
                    </div>
                  )}
                </div>

                {/* Bottom Recommendation Bar (Matches Reference Image) */}
                <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-start gap-2">
                  <Palette className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-700 leading-none">
                      Rekomendasi Visual
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate" title={block.visualRecommendation}>
                      {block.visualRecommendation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Sub-topic Card (Matches 3. rancangan infografis.png) */}
          <button
            type="button"
            onClick={handleOpenAddBlock}
            className="min-h-[220px] rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 flex flex-col items-center justify-center p-6 text-center transition-all group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-indigo-600 text-slate-400 group-hover:text-white border border-slate-200 group-hover:border-indigo-600 flex items-center justify-center shadow-xs transition-colors mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-900 transition-colors">
              Tambah Sub-Topik Baru
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Tambahkan bagian materi atau ringkasan baru
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Actions Bar (Matches 3. rancangan infografis.png) */}
      <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Kembali Button */}
        <button
          type="button"
          onClick={() => onNavigate('buat')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Simpan Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Draft</span>
          </button>

          {/* Lanjut ke Visualisasi Button */}
          <button
            id="btn-lanjut-visualisasi"
            type="button"
            onClick={() => onNavigate('visual')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#4f46e5] hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Lanjut ke Visualisasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal for Editing/Adding Material Block */}
      <EditBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBlock}
        onDelete={handleDeleteBlock}
        blockToEdit={editingBlock}
        totalBlocksCount={blocks.length}
      />
    </div>
  );
};
