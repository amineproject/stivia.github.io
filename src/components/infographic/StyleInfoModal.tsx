import React from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Eye, 
  Layers, 
  Target, 
  Palette,
  CheckCircle2,
  Info
} from 'lucide-react';
import { InfographicStyleItem } from '../../data/infographicStylesData';

interface StyleInfoModalProps {
  styleItem: InfographicStyleItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAndApply: (styleItem: InfographicStyleItem) => void;
  isSelected?: boolean;
}

export const StyleInfoModal: React.FC<StyleInfoModalProps> = ({
  styleItem,
  isOpen,
  onClose,
  onSelectAndApply,
  isSelected = false
}) => {
  if (!isOpen || !styleItem) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-style-title"
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-linear-to-r from-slate-50 to-indigo-50/40">
          <div className="space-y-1 pr-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>{styleItem.category}</span>
            </div>
            <h2 id="modal-style-title" className="text-xl font-extrabold text-slate-900 tracking-tight">
              {styleItem.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Tutup informasi"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Informasi Gaya */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar text-sm">
          {/* Deskripsi Singkat */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>Deskripsi Singkat</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {styleItem.shortDescription || styleItem.description}
            </p>
          </div>

          {/* Ciri Visual */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ciri Visual</span>
            </h3>
            <ul className="space-y-2">
              {styleItem.visualCharacteristics && styleItem.visualCharacteristics.length > 0 ? (
                styleItem.visualCharacteristics.map((trait, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-700 bg-indigo-50/30 px-3 py-2 rounded-lg border border-indigo-100/50">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{trait}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-600 italic">Karakteristik visual standar STIVIA.</li>
              )}
            </ul>
          </div>

          {/* Cocok Untuk */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cocok Untuk</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {styleItem.suitableFor && styleItem.suitableFor.length > 0 ? (
                styleItem.suitableFor.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                  >
                    • {item}
                  </span>
                ))
              ) : (
                <span className="text-slate-600 text-xs">Materi pembelajaran umum</span>
              )}
            </div>
          </div>

          {/* Contoh Karakter */}
          <div className="space-y-1.5 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>Contoh Karakter Estetika</span>
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs">
              {styleItem.characterExample || styleItem.characteristics}
            </p>
          </div>

          {/* Catatan Integritas Materi STIVIA */}
          <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-500 text-2xs leading-relaxed">
            <strong className="text-slate-700">Komitmen Integritas Materi:</strong> Gaya visual ini diterapkan pada estetika, warna, bentuk kartu, dan ilustrasi tanpa mengubah judul materi, isi, fakta, atau cakupan pembelajaran Anda.
          </div>
        </div>

        {/* Footer Tombol Aksi */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectAndApply(styleItem);
              onClose();
            }}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isSelected ? 'Tetap Gunakan Gaya Ini' : 'Gunakan Gaya Ini'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
