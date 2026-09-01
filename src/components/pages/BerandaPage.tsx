import React from 'react';
import { 
  Sparkles, 
  PlayCircle, 
  CheckCircle2, 
  FileEdit, 
  Network, 
  Palette, 
  ArrowRight,
  Layers,
  BookOpen,
  Eye
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface BerandaPageProps {
  onNavigate: (tab: NavigationTab) => void;
  onLoadSample: () => void;
}

export const BerandaPage: React.FC<BerandaPageProps> = ({
  onNavigate,
  onLoadSample,
}) => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-12">
      {/* Hero Banner Section (Matches 1. beranda.png) */}
      <section 
        id="hero-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white p-8 sm:p-12 shadow-xl shadow-indigo-600/15"
      >
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.2]">
              Belajar Lebih{' '}
              <span className="text-emerald-400 underline decoration-emerald-400/30 decoration-wavy decoration-2">
                Visual
              </span>
              , Mengajar Lebih Mudah.
            </h1>

            <p className="text-base sm:text-lg text-indigo-100/90 font-normal leading-relaxed max-w-xl">
              Ubah konteks dan materi pembelajaran menjadi rancangan infografis yang terstruktur, relevan, dan mudah dipahami. Tingkatkan interaktivitas dan pemahaman siswa dengan visual yang memukau.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary Green CTA Button */}
              <button
                id="cta-buat-infografis"
                onClick={() => onNavigate('buat')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-900/30 hover:shadow-emerald-600/40 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>Buat Infografis Sekarang</span>
              </button>

              {/* Secondary Demo Button */}
              <button
                id="cta-lihat-demo"
                onClick={onLoadSample}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-medium text-sm sm:text-base border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
              >
                <PlayCircle className="w-5 h-5 text-indigo-200" />
                <span>Lihat Contoh Desain</span>
              </button>
            </div>
          </div>

          {/* Right Stylized Graphic Preview Mockup (Matches 1. beranda.png) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[340px] bg-slate-50 text-slate-800 rounded-2xl p-5 shadow-2xl border border-white/20 transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Mock Infographic Header */}
              <div className="text-center pb-4 border-b border-slate-200">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700 mb-1.5">
                  STIVIA INFOGRAFIS
                </span>
                <h3 className="text-xs font-bold text-slate-900 leading-tight">
                  SELAMAT DATANG DI BERANDA STIVIA
                </h3>
              </div>

              {/* Graphic Mock Blocks */}
              <div className="py-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-indigo-50/80 rounded-xl border border-indigo-100 flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-1 text-[10px] font-bold">
                      01
                    </div>
                    <span className="text-[10px] font-bold text-indigo-950">LEARN</span>
                    <span className="text-[8px] text-indigo-600">Pahami Konsep</span>
                  </div>
                  <div className="p-2.5 bg-sky-50/80 rounded-xl border border-sky-100 flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center mb-1 text-[10px] font-bold">
                      02
                    </div>
                    <span className="text-[10px] font-bold text-sky-950">EXPLORE</span>
                    <span className="text-[8px] text-sky-600">Telusuri Pola</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-950">APPLY & GROW</p>
                    <p className="text-[8px] text-emerald-700">Visualisasi data & relasi materi</p>
                  </div>
                </div>

                <div className="pt-1 text-center">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    PLATFORM PENDIDIKAN INTEGRATIF
                  </p>
                </div>
              </div>

              {/* Floating Ready Badge (Matches Reference image exactly!) */}
              <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">
                    Struktur Selesai
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Siap untuk divisualisasikan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How STIVIA Works Section (Matches 1. beranda.png) */}
      <section id="how-stivia-works" className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bagaimana STIVIA Bekerja?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Tiga langkah mudah untuk mentransformasi materi pembelajaran kompleks menjadi visual yang menarik dan terstruktur.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Step 1 */}
          <div className="relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            {/* Background 01 */}
            <span className="absolute -top-3 -right-2 text-7xl font-extrabold text-slate-100 select-none group-hover:text-indigo-50 transition-colors pointer-events-none">
              01
            </span>

            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <FileEdit className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Berikan Konteks
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Guru mengisi informasi pembelajaran inti dan memasukkan materi mentah yang akan diajarkan.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            {/* Background 02 */}
            <span className="absolute -top-3 -right-2 text-7xl font-extrabold text-slate-100 select-none group-hover:text-emerald-50 transition-colors pointer-events-none">
              02
            </span>

            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Network className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  STIVIA Menyusun
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sistem cerdas kami membantu menentukan struktur logis, unsur materi utama, dan contoh yang relevan.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            {/* Background 03 */}
            <span className="absolute -top-3 -right-2 text-7xl font-extrabold text-slate-100 select-none group-hover:text-amber-50 transition-colors pointer-events-none">
              03
            </span>

            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Palette className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Materi Menjadi Visual
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Rancangan materi yang terstruktur langsung digunakan sebagai dasar untuk membuat infografis pembelajaran yang memukau.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launchpad & Shortcut to Features */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Alur Edukatif Terstandar</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">
            Mulai rancang infografis pertama Anda hari ini
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm">
            Tersedia berbagai pilihan jenjang (SD, SMP, SMA, SMK) dengan rekomendasi visual otomatis yang dirancang khusus untuk pembelajaran di Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('buat')}
            className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
