import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Network, 
  GitBranch, 
  BarChart3, 
  Columns3, 
  Clock, 
  Maximize2,
  CheckCircle2,
  HelpCircle,
  Eye
} from 'lucide-react';
import { 
  InfographicDraft, 
  MaterialBlock, 
  NavigationTab, 
  VisualElementType 
} from '../../types';

interface RancanganVisualPageProps {
  draft: InfographicDraft;
  onUpdateDraft: (updated: Partial<InfographicDraft>) => void;
  onNavigate: (tab: NavigationTab) => void;
  onSaveToast: (msg: string) => void;
}

const VISUAL_MAPPING_INFO: {
  type: VisualElementType;
  name: string;
  materialConcept: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  sampleBadge: string;
}[] = [
  {
    type: 'diagram_konsep',
    name: 'Diagram Konsep',
    materialConcept: 'Pengertian & Konsep Dasar',
    description: 'Menghubungkan simpul-simpul ide untuk memberikan gambaran utuh hubungan logis.',
    icon: <Network className="w-5 h-5" />,
    accent: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    sampleBadge: 'Simpul & Jaringan',
  },
  {
    type: 'callout',
    name: 'Call-out & Komponen',
    materialConcept: 'Elemen & Bagian Kunci',
    description: 'Menyorot kartu informasi penting dengan ikon representatif dan penjelasan singkat.',
    icon: <Maximize2 className="w-5 h-5" />,
    accent: 'bg-teal-50 border-teal-200 text-teal-700',
    sampleBadge: 'Sorotan Kartu',
  },
  {
    type: 'flowchart',
    name: 'Flowchart / Alur Proses',
    materialConcept: 'Tahapan & Langkah Kerja',
    description: 'Menggambarkan proses berurutan 1 → 2 → 3 menggunakan panah alir terarah.',
    icon: <GitBranch className="w-5 h-5" />,
    accent: 'bg-sky-50 border-sky-200 text-sky-700',
    sampleBadge: 'Alur Bertahap',
  },
  {
    type: 'grafik',
    name: 'Grafik & Data Angka',
    materialConcept: 'Data Kuantitatif & Distribusi',
    description: 'Menyajikan perbandingan angka statistik menggunakan grafik batang atau garis yang mudah dibaca.',
    icon: <BarChart3 className="w-5 h-5" />,
    accent: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    sampleBadge: 'Grafik Statistik',
  },
  {
    type: 'tabel_perbandingan',
    name: 'Tabel Perbandingan',
    materialConcept: 'Komparasi & Variasi Konsep',
    description: 'Membandingkan dua atau lebih konsep secara sejajar (misal: Bentuk A vs Bentuk B).',
    icon: <Columns3 className="w-5 h-5" />,
    accent: 'bg-amber-50 border-amber-200 text-amber-700',
    sampleBadge: 'Split Komparasi',
  },
  {
    type: 'timeline',
    name: 'Timeline Kronologis',
    materialConcept: 'Urutan Waktu & Peristiwa',
    description: 'Menyusun kronologi waktu atau evolusi konsep secara linier horizontal/vertikal.',
    icon: <Clock className="w-5 h-5" />,
    accent: 'bg-rose-50 border-rose-200 text-rose-700',
    sampleBadge: 'Garis Waktu',
  },
];

export const RancanganVisualPage: React.FC<RancanganVisualPageProps> = ({
  draft,
  onUpdateDraft,
  onNavigate,
  onSaveToast,
}) => {
  const [blocks, setBlocks] = useState<MaterialBlock[]>(draft.blocks || []);

  React.useEffect(() => {
    setBlocks(draft.blocks || []);
  }, [draft.id, draft.blocks]);

  const handleVisualTypeChange = (blockId: string, newType: VisualElementType) => {
    const updated = blocks.map((b) => {
      if (b.id === blockId) {
        return {
          ...b,
          visualElementType: newType,
          visualRecommendation: `Visualisasi ${newType.replace('_', ' ')} yang disesuaikan untuk ${b.title}`,
        };
      }
      return b;
    });
    setBlocks(updated);
    onUpdateDraft({ blocks: updated });
    onSaveToast('Bentuk visual blok diperbarui.');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Langkah 3: Pemetaan Unsur Visual</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rancangan Visual
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Sistem STIVIA secara otomatis memetakan setiap unsur materi menjadi representasi visual yang optimal untuk memudahkan pemahaman peserta didik.
          </p>
        </div>
      </div>

      {/* Guide Cards of UNSUR MATERI -> UNSUR VISUAL */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold">
            Pedoman Pemetaan Unsur Materi ke Unsur Visual
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VISUAL_MAPPING_INFO.map((item) => (
            <div
              key={item.type}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`p-2.5 rounded-xl border ${item.accent}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                    {item.sampleBadge}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {item.materialConcept}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <span>↓</span>
                    <span>{item.name}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Mapping for Current Blueprint Blocks */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Konfigurasi Bentuk Visual untuk: "{draft.title || 'Infografis'}"
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {blocks.length} Bagian Terpetakan
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs divide-y divide-slate-100">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
            >
              {/* Left Info */}
              <div className="lg:col-span-5 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {block.order}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {block.tag}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {block.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {block.content}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex lg:col-span-1 justify-center text-slate-400 font-bold text-lg">
                →
              </div>

              {/* Right Selector */}
              <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <select
                  value={block.visualElementType}
                  onChange={(e) => handleVisualTypeChange(block.id, e.target.value as VisualElementType)}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                >
                  {VISUAL_MAPPING_INFO.map((v) => (
                    <option key={v.type} value={v.type}>
                      {v.name}
                    </option>
                  ))}
                  <option value="mindmap">Mindmap Konsep</option>
                  <option value="ringkasan_kotak">Kotak Rangkuman</option>
                </select>

                <span className="text-[11px] text-slate-500 italic truncate max-w-[200px]" title={block.visualRecommendation}>
                  {block.visualRecommendation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('rancangan')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Rancangan Materi</span>
        </button>

        <button
          id="btn-buat-preview-infografis"
          type="button"
          onClick={() => onNavigate('hasil')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <Eye className="w-4 h-4 text-emerald-200" />
          <span>Buat Preview Infografis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
