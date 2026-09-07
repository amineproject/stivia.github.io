import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { InfographicStyleItem } from '../../data/infographicStylesData';
import { getTypographyProfile } from '../../data/typographyProfiles';

interface StyleInfoModalProps {
  styleItem: InfographicStyleItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAndApply?: (styleItem: InfographicStyleItem) => void;
  onSelectStyle?: (styleName: string) => void;
  isSelected?: boolean;
}

/**
 * Curated bullet traits for each visual style in STIVIA 2.2d
 */
const getStyleBulletCharacters = (item: InfographicStyleItem): string[] => {
  const traitsMap: Record<string, string[]> = {
    futuristic: ['Modern', 'Teknologis', 'Presisi', 'Futuristik'],
    cyberpunk: ['Berani', 'Neon Kontras', 'Digital', 'Dinamis'],
    glassmorphism: ['Elegan', 'Transparan', 'Modern', 'Jernih'],
    aurora: ['Gradasi Halus', 'Spektrum Cahaya', 'Kosmis', 'Estetis'],
    y2k: ['Retro 2000-an', 'Kromatik', 'Dinamis', 'Ekspresif'],
    minimalism: ['Sederhana', 'Bersih', 'Esensial', 'Terstruktur'],
    swiss_design: ['Grid Rasional', 'Matematis', 'Tipografis', 'Objektif'],
    editorial: ['Akademik', 'Literer', 'Klasik', 'Mendalam'],
    vector_art: ['Rapi', 'Proporsional', 'Visual', 'Edukatif'],
    maximalism: ['Kaya Visual', 'Bento Modular', 'Ekspresif', 'Menonjol'],
    pop_art: ['Ceria', 'Ikonik Komik', 'Warna Primer', 'Kontras'],
    collage_art: ['Eklektik', 'Multi-Tekstur', 'Kreatif', 'Berlapis'],
    graffiti: ['Urban', 'Spontan', 'Berani', 'Ekspresif'],
    surrealism: ['Imajinatif', 'Konseptual', 'Artistik', 'Mendalam'],
    victorian: ['Khidmat', 'Historis', 'Klasik', 'Berwibawa'],
    bohemian: ['Organik', 'Hangat', 'Membumi', 'Teduh'],
    handwritten: ['Akrab', 'Catatan Belajar', 'Personal', 'Edukatif'],
    hand_drawing: ['Sketsa Tangan', 'Organik', 'Ilustratif', 'Kreatif'],
    clay_style: ['Taktil 3D', 'Ramah Anak', 'Plastisin', 'Hangat'],
    pixel_style: ['Retro 8-Bit', 'Interaktif', 'Gaming', 'Edukatif'],
  };

  const key = item.id.toLowerCase().replace(/[\s-]/g, '_');
  if (traitsMap[key]) return traitsMap[key];
  if (item.tags && item.tags.length >= 3) return item.tags.slice(0, 4);
  return ['Modern', 'Terstruktur', 'Edukatif', 'Visual'];
};

const getSuitableText = (item: InfographicStyleItem): string => {
  if (item.suitableFor && item.suitableFor.length > 0) {
    return item.suitableFor.join(', ') + '.';
  }
  return 'Materi proses, konsep, sains, dan pembelajaran yang membutuhkan visual terstruktur.';
};

const getVisualCharText = (item: InfographicStyleItem): string => {
  if (item.characterExample) return item.characterExample;
  if (item.visualCharacteristics && item.visualCharacteristics.length > 0) {
    return item.visualCharacteristics.slice(0, 2).join(', ') + '.';
  }
  return item.description;
};

export const StyleInfoModal: React.FC<StyleInfoModalProps> = ({
  styleItem,
  isOpen,
  onClose,
  onSelectAndApply,
  onSelectStyle,
  isSelected = false
}) => {
  if (!isOpen || !styleItem) return null;

  const characters = getStyleBulletCharacters(styleItem);
  const suitableText = getSuitableText(styleItem);
  const typo = getTypographyProfile(styleItem.id || styleItem.name);
  const visualCharText = getVisualCharText(styleItem);

  const handleSelect = () => {
    if (onSelectAndApply) onSelectAndApply(styleItem);
    if (onSelectStyle) onSelectStyle(styleItem.name);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-style-title"
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-slate-100 bg-slate-50/70">
          <div className="space-y-1 pr-4">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>{styleItem.category}</span>
            </div>
            <h2 id="modal-style-title" className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              {styleItem.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Tutup informasi"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Informasi Gaya (Ringkas & Terstruktur Sesuai Panduan) */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs sm:text-sm">
          {/* Deskripsi Singkat */}
          <p className="text-slate-700 leading-relaxed font-medium italic border-l-2 border-indigo-500 pl-3">
            &ldquo;{styleItem.shortDescription || styleItem.description}&rdquo;
          </p>

          {/* KARAKTER */}
          <div className="space-y-1.5 pt-1">
            <h3 className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">
              KARAKTER
            </h3>
            <ul className="grid grid-cols-2 gap-1.5 text-xs text-slate-800 font-medium">
              {characters.map((charItem, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{charItem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* COCOK UNTUK */}
          <div className="space-y-1 pt-1">
            <h3 className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">
              COCOK UNTUK
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {suitableText}
            </p>
          </div>

          {/* TIPOGRAFI */}
          <div className="space-y-1.5 pt-1">
            <h3 className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">
              TIPOGRAFI
            </h3>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-2xs text-slate-400 block font-bold uppercase tracking-wider">
                  Font Judul
                </span>
                <span className="font-extrabold text-slate-900 text-sm" style={{ fontFamily: typo.headingFont }}>
                  {typo.headingFont}
                </span>
              </div>
              <span className="text-slate-400 font-light text-base px-2">+</span>
              <div className="text-right">
                <span className="text-2xs text-slate-400 block font-bold uppercase tracking-wider">
                  Font Isi
                </span>
                <span className="font-bold text-slate-800 text-sm" style={{ fontFamily: typo.bodyFont }}>
                  {typo.bodyFont}
                </span>
              </div>
            </div>
          </div>

          {/* KARAKTER VISUAL */}
          <div className="space-y-1 pt-1">
            <h3 className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">
              KARAKTER VISUAL
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {visualCharText}
            </p>
          </div>
        </div>

        {/* Footer Tombol Aksi */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-slate-100 bg-slate-50/80">
          {(!isSelected && (onSelectAndApply || onSelectStyle)) && (
            <button
              type="button"
              onClick={handleSelect}
              className="px-4 py-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
            >
              Pilih Gaya Ini
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
