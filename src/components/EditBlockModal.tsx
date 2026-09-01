import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Trash2, Gauge, Scale, Layers } from 'lucide-react';
import { MaterialBlock, VisualElementType, ContentWeight, ContentDepth, VisualPriority } from '../types';

interface EditBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: MaterialBlock) => void;
  onDelete?: (blockId: string) => void;
  blockToEdit: MaterialBlock | null;
  totalBlocksCount: number;
}

const VISUAL_TYPE_OPTIONS: { id: VisualElementType; label: string }[] = [
  { id: 'diagram_konsep', label: 'Diagram Konsep & Peta Hubungan' },
  { id: 'komponen', label: 'Anatomi & Komponen Utama' },
  { id: 'tabel_perbandingan', label: 'Tabel Komparasi & Variasi Tipe' },
  { id: 'flowchart', label: 'Flowchart / Alur Proses Bertahap' },
  { id: 'ilustrasi_jaringan', label: 'Ilustrasi Jaringan & Topologi Kasus Nyata' },
  { id: 'callout', label: 'Call-out Box & Analogi' },
  { id: 'timeline', label: 'Timeline Kronologis' },
  { id: 'grafik', label: 'Grafik / Chart Data Statistik' },
  { id: 'mindmap', label: 'Mindmap Cabang Konseptual' },
  { id: 'studi_kasus', label: 'Studi Kasus Pembelajaran Terstruktur' },
  { id: 'benang_merah', label: 'Benang Merah / Siklus Pemahaman' },
  { id: 'ringkasan_kotak', label: 'Kotak Rangkuman / Golden Takeaways' },
];

export const EditBlockModal: React.FC<EditBlockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  blockToEdit,
  totalBlocksCount,
}) => {
  const [tag, setTag] = useState('MATERI INTI');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [example, setExample] = useState('');
  const [visualRecommendation, setVisualRecommendation] = useState('');
  const [visualElementType, setVisualElementType] = useState<VisualElementType>('diagram_konsep');
  const [accentColor, setAccentColor] = useState('indigo');
  const [weight, setWeight] = useState<ContentWeight>('SEDANG');
  const [depth, setDepth] = useState<ContentDepth>('SEDANG');
  const [visualPriority, setVisualPriority] = useState<VisualPriority>('MEDIUM');

  useEffect(() => {
    if (blockToEdit) {
      setTag(blockToEdit.tag);
      setTitle(blockToEdit.title);
      setContent(blockToEdit.content);
      setExample(blockToEdit.example || '');
      setVisualRecommendation(blockToEdit.visualRecommendation);
      setVisualElementType(blockToEdit.visualElementType);
      setAccentColor(blockToEdit.accentColor || 'indigo');
      setWeight(blockToEdit.weight || 'SEDANG');
      setDepth(blockToEdit.depth || 'SEDANG');
      setVisualPriority(blockToEdit.visualPriority || 'MEDIUM');
    } else {
      setTag(`BAGIAN 0${totalBlocksCount + 1}`);
      setTitle('');
      setContent('');
      setExample('Konteks: Contoh relevan di kehidupan sehari-hari.');
      setVisualRecommendation('Ilustrasi grafis yang menjelaskan konsep dengan jelas.');
      setVisualElementType('diagram_konsep');
      setAccentColor('indigo');
      setWeight('SEDANG');
      setDepth('SEDANG');
      setVisualPriority('MEDIUM');
    }
  }, [blockToEdit, isOpen, totalBlocksCount]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedBlock: MaterialBlock = {
      ...(blockToEdit || {}),
      id: blockToEdit ? blockToEdit.id : `blk-${Date.now()}`,
      order: blockToEdit ? blockToEdit.order : totalBlocksCount + 1,
      tag: tag.trim() || 'MATERI',
      title: title.trim(),
      content: content.trim(),
      example: example.trim(),
      visualRecommendation: visualRecommendation.trim() || 'Visualisasi terstruktur.',
      visualElementType,
      accentColor,
      weight,
      depth,
      visualPriority,
      sourceCoverage: blockToEdit?.sourceCoverage || title.trim(),
    };

    onSave(updatedBlock);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-xl p-6 sm:p-8 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {blockToEdit ? `Edit Blok #${blockToEdit.order}` : 'Tambah Blok Baru'}
              </span>
              {weight && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  weight === 'UTAMA' ? 'bg-purple-100 text-purple-700' :
                  weight === 'SEDANG' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  Bobot {weight}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {blockToEdit ? 'Sesuaikan Bagian Materi' : 'Buat Sub-Topik Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Tag */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori / Tag
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Misal: PENGANTAR, KOMPONEN"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm uppercase font-semibold focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Warna Aksen
              </label>
              <select
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="indigo">Indigo / Biru Ungu</option>
                <option value="teal">Teal / Toska</option>
                <option value="amber">Amber / Emas</option>
                <option value="emerald">Emerald / Hijau</option>
                <option value="rose">Rose / Merah Muda</option>
                <option value="sky">Sky / Biru Langit</option>
                <option value="violet">Violet / Ungu Gelap</option>
              </select>
            </div>
          </div>

          {/* Engine Parameters: Bobot & Kedalaman (Tahap 2B & 2C) */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                <span>Bobot (Tahap 2B)</span>
              </label>
              <select
                value={weight}
                onChange={(e) => {
                  const w = e.target.value as ContentWeight;
                  setWeight(w);
                  if (w === 'UTAMA') {
                    setDepth('MENDALAM');
                    setVisualPriority('HIGH');
                  } else if (w === 'RINGAN') {
                    setDepth('RINGKAS');
                    setVisualPriority('LOW');
                  } else {
                    setDepth('SEDANG');
                    setVisualPriority('MEDIUM');
                  }
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="RINGAN">RINGAN (Pendukung/Ringkas)</option>
                <option value="SEDANG">SEDANG (Penting/Terstruktur)</option>
                <option value="UTAMA">UTAMA (Fokus Inti/Mendalam)</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                <span>Kedalaman (Tahap 2C)</span>
              </label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value as ContentDepth)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="RINGKAS">RINGKAS (1-2 poin padat)</option>
                <option value="SEDANG">SEDANG (2-3 poin jelas)</option>
                <option value="MENDALAM">MENDALAM (Komprehensif)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Judul Bagian <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Misal: Apa itu Graph? atau Komponen Node & Edge"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Ringkasan Isi Materi
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Uraikan isi konsep materi secara padat dan mudah dipahami siswa..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm leading-relaxed focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Example / Analogy Context */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Area Contoh & Analogi Nyata
            </label>
            <input
              type="text"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="Misal: Konteks: Bayangkan kota (Node) dan jalan raya (Edge)..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Visual Element Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Bentuk Visual yang Digunakan
            </label>
            <select
              value={visualElementType}
              onChange={(e) => setVisualElementType(e.target.value as VisualElementType)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {VISUAL_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Visual Recommendation Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Rekomendasi Unsur Visual
            </label>
            <input
              type="text"
              value={visualRecommendation}
              onChange={(e) => setVisualRecommendation(e.target.value)}
              placeholder="Misal: Ilustrasi jaringan titik terhubung dengan label angka..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {blockToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(blockToEdit.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Blok</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
