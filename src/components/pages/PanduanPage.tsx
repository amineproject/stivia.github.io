import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Palette, 
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface PanduanPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const PanduanPage: React.FC<PanduanPageProps> = ({ onNavigate }) => {
  const [openStep, setOpenStep] = useState<number>(1);

  const steps = [
    {
      number: 1,
      title: 'Pilih Konteks Pembelajaran',
      subtitle: 'Tentukan target jenjang, kelas, dan mata pelajaran',
      desc: 'Langkah awal adalah menetapkan jenjang pendidikan (SD, SMP, SMA, SMK) dan tingkat kelas yang tepat. Pilihan kelas akan otomatis disesuaikan secara dinamis. Pilih mata pelajaran dari daftar rekomendasi atau ketik mata pelajaran spesifik Anda.',
      tips: 'Menentukan jenjang dengan akurat membantu STIVIA menyesuaikan kompleksitas bahasa dan analogi yang tepat bagi siswa.',
    },
    {
      number: 2,
      title: 'Masukkan Informasi Materi',
      subtitle: 'Isi tema pokok dan cakupan poin-poin materi',
      desc: 'Tuliskan Tema Kegiatan Pembelajaran, Materi Pokok yang diajarkan, serta Cakupan Materi berupa beberapa poin kunci. Anda bisa memasukkan silabus mentah, poin modul ajar, atau sub-bab buku pegangan.',
      tips: 'Pisahkan setiap poin bahasan per baris untuk mempermudah sistem membagi blok konten secara proporsional.',
    },
    {
      number: 3,
      title: 'Tentukan Preferensi Visual',
      subtitle: 'Sesuaikan gaya estetika, orientasi format, dan kepadatan',
      desc: 'Pilih gaya visual (Modern Edukatif, Diagramatis, Ramah Anak, dsb.), format orientasi (Portrait A4, Square 1:1, atau Landscape), serta tingkat visual (Sederhana, Seimbang, atau Visual Dominan).',
      tips: 'Format Portrait A4 sangat direkomendasikan untuk lembar kerja cetak, sedangkan Landscape ideal untuk slide presentasi infografis.',
    },
    {
      number: 4,
      title: 'Buat Rancangan Materi',
      subtitle: 'Kecerdasan sistem menyusun struktur materi menjadi blok terurut',
      desc: 'Klik "Buat Rancangan Materi". STIVIA akan menghasilkan blueprint terstruktur berisi Judul Infografis, Tujuan Pembelajaran, serta urutan blok materi lengkap dengan analogi dan rekomendasi visual.',
      tips: 'Gunakan pemilih "Konteks Visual & Analogi" di pojok kanan atas untuk menghubungkan materi dengan analogi kehidupan sehari-hari siswa.',
    },
    {
      number: 5,
      title: 'Periksa dan Sesuaikan Rancangan',
      subtitle: 'Guru memiliki kendali penuh mengedit, menambah, atau memindahkan blok',
      desc: 'Periksa setiap kartu bagian materi. Anda dapat mengedit judul, uraian isi, analogi contoh, menambah sub-topik baru (+ Tambah Blok), mengubah urutan atas/bawah, hingga menghapus blok yang kurang relevan.',
      tips: 'Pastikan setiap blok memiliki poin fokus yang jelas agar infografis tidak terlalu padat saat divisualisasikan.',
    },
    {
      number: 6,
      title: 'Buat Preview Infografis & Unduh',
      subtitle: 'Pratinjau hasil infografis secara interaktif',
      desc: 'Masuk ke halaman Preview Infografis. Anda dapat melihat representasi visual dari seluruh rancangan, mengubah tema gaya visual di panel kanan, memperbesar/memperkecil kanvas, dan mengunduh infografis siap pakai.',
      tips: 'Gunakan panel navigasi kiri untuk memeriksa penempatan setiap blok materi pada infografis.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Panduan Lengkap</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Panduan Penggunaan STIVIA
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Pelajari bagaimana menyusun materi pembelajaran dari konsep teks mentah menjadi rancangan infografis edukatif yang terstruktur dan siap digunakan dalam kegiatan belajar mengajar.
        </p>
      </div>

      {/* 6 Step Accordion / Cards */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isOpen = openStep === step.number;
          return (
            <div
              key={step.number}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenStep(isOpen ? 0 : step.number)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                    0{step.number}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  <p>{step.desc}</p>
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 text-amber-950">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold">Tips Pendidik: </span>
                      <span>{step.tips}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-bold">Siap menyusun infografis Anda?</h3>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-md">
            Mulai dari memasukkan konteks kurikulum dan biarkan STIVIA membantu menyusun materi visual terbaik.
          </p>
        </div>
        <button
          onClick={() => onNavigate('buat')}
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all shrink-0 cursor-pointer"
        >
          Buat Infografis Sekarang
        </button>
      </div>
    </div>
  );
};
