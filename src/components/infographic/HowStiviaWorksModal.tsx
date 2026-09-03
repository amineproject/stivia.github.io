import React from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Palette, 
  Image as ImageIcon, 
  Layout, 
  FileCode, 
  CheckCircle2, 
  ArrowDown
} from 'lucide-react';

interface HowStiviaWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowStiviaWorksModal: React.FC<HowStiviaWorksModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      number: 1,
      title: 'Memahami Materi',
      desc: 'STIVIA membaca topik dan informasi pembelajaran yang Anda masukkan.',
      icon: BookOpen,
      accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'Tahap 1'
    },
    {
      number: 2,
      title: 'Menentukan Informasi Penting',
      desc: 'STIVIA mengenali konsep dan informasi utama yang perlu ditampilkan.',
      icon: Lightbulb,
      accentBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Tahap 2'
    },
    {
      number: 3,
      title: 'Memahami Gaya Pilihan',
      desc: 'Gaya yang Anda pilih menentukan karakter visual infografis.',
      icon: Palette,
      accentBg: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'Tahap 3'
    },
    {
      number: 4,
      title: 'Menentukan Visual Pendukung',
      desc: 'STIVIA menentukan ilustrasi, ikon, dan elemen visual yang relevan dengan materi.',
      icon: ImageIcon,
      accentBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'Tahap 4'
    },
    {
      number: 5,
      title: 'Menentukan Susunan',
      desc: 'STIVIA memilih susunan informasi yang sesuai.',
      icon: Layout,
      accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'Tahap 5'
    },
    {
      number: 6,
      title: 'Menyusun Prompt',
      desc: 'Seluruh informasi digabungkan menjadi prompt yang terarah.',
      icon: FileCode,
      accentBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      badge: 'Tahap 6'
    },
    {
      number: 7,
      title: 'Membuat Infografis',
      desc: 'Prompt digunakan untuk menghasilkan infografis pembelajaran.',
      icon: CheckCircle2,
      accentBg: 'bg-teal-50 text-teal-700 border-teal-200',
      badge: 'Tahap 7'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-how-works-title"
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-linear-to-r from-indigo-50/70 via-sky-50/50 to-white">
          <div className="space-y-1 pr-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Kerangka Berpikir STIVIA</span>
            </div>
            <h2 id="modal-how-works-title" className="text-xl font-extrabold text-slate-900 tracking-tight">
              Bagaimana STIVIA Bekerja?
            </h2>
            <p className="text-xs text-slate-600">
              Alur berpikir cerdas STIVIA dalam mengubah materi Anda menjadi infografis pembelajaran yang terarah dan bermakna.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup dialog"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten 7 Tahap Sederhana */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          <div className="relative pl-6 sm:pl-8 space-y-3 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-100">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              const isLast = idx === steps.length - 1;

              return (
                <div key={step.number} className="relative group">
                  {/* Pin Dot / Step Indicator */}
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center text-xs font-bold text-indigo-700 shadow-xs group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>

                  {/* Card Tahapan */}
                  <div className="bg-slate-50 hover:bg-indigo-50/40 p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-200 transition-all">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {step.title}
                        </span>
                      </div>
                      <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${step.accentBg}`}>
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Panah alur vertikal kecuali di langkah terakhir */}
                  {!isLast && (
                    <div className="flex justify-center my-1 text-slate-300">
                      <ArrowDown className="w-3 h-3 text-indigo-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Slogan & Integritas STIVIA */}
          <div className="mt-4 p-4 rounded-xl bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-100/80 text-center space-y-1">
            <p className="text-xs font-bold text-indigo-950">
              "Belajar Lebih Visual, Mengajar Lebih Mudah"
            </p>
            <p className="text-2xs text-slate-600">
              Gaya visual memperkaya keindahan estetika tanpa pernah mengubah kebenaran isi, judul, atau fakta materi pembelajaran Anda.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Mengerti & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};
