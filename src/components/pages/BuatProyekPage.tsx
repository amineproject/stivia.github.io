import React, { useState } from 'react';
import {
  FolderPlus,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Layers,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Play
} from 'lucide-react';
import { EducationLevel, NavigationTab } from '../../types';
import { CreateProjectFormInput } from '../../services/learningProjectService';
import { SUBJECT_OPTIONS, GRADE_OPTIONS_BY_LEVEL } from '../../data/mockData';

interface BuatProyekPageProps {
  onNavigate: (tab: NavigationTab) => void;
  onCreateProject: (input: CreateProjectFormInput) => void;
  authorName?: string;
  authorSchool?: string;
}

export const BuatProyekPage: React.FC<BuatProyekPageProps> = ({
  onNavigate,
  onCreateProject,
  authorName,
  authorSchool
}) => {
  // 8 Field Pembelajaran (7 Wajib + 1 Opsional)
  const [tingkat, setTingkat] = useState<EducationLevel>('SMP');
  const [kelas, setKelas] = useState<string>('Kelas VIII');
  const [mapel, setMapel] = useState<string>('Bahasa Indonesia');
  const [isCustomMapel, setIsCustomMapel] = useState<boolean>(false);
  const [customMapel, setCustomMapel] = useState<string>('');
  const [babTeks, setBabTeks] = useState<string>('Teks Iklan');
  const [temaPembelajaran, setTemaPembelajaran] = useState<string>('Menyusun slogan dan naskah iklan');
  const [materiPelajaran, setMateriPelajaran] = useState<string>('Slogan, kalimat persuasif, dan naskah iklan');
  const [cakupanMateri, setCakupanMateri] = useState<string>(
    '1. Pengertian slogan dan fungsinya dalam teks iklan.\n' +
    '2. Ciri-ciri bahasa persuasif pada slogan.\n' +
    '3. Unsur utama pembentuk naskah iklan (Headline, Body Text, Visual, CTA).\n' +
    '4. Contoh kalimat persuasif dalam iklan komersial vs layanan masyarakat.\n' +
    '5. Langkah menyusun naskah iklan informatif yang santun dan menarik.'
  );
  const [catatan, setCatatan] = useState<string>('Gunakan contoh kontekstual yang dekat dengan kehidupan siswa di lingkungan sekolah.');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Update saran kelas saat jenjang berganti
  const handleLevelChange = (newLevel: EducationLevel) => {
    setTingkat(newLevel);
    const availableGrades = GRADE_OPTIONS_BY_LEVEL[newLevel] || [];
    if (availableGrades.length > 0 && !availableGrades.includes(kelas)) {
      setKelas(availableGrades[0]);
    }
  };

  // Pengisian cepat contoh data (Teks Iklan)
  const handleFillSample = () => {
    setTingkat('SMP');
    setKelas('Kelas VIII');
    setMapel('Bahasa Indonesia');
    setIsCustomMapel(false);
    setCustomMapel('');
    setBabTeks('Teks Iklan');
    setTemaPembelajaran('Menyusun slogan dan naskah iklan');
    setMateriPelajaran('Slogan, kalimat persuasif, dan naskah iklan');
    setCakupanMateri(
      '1. Pengertian slogan dan peran sosial teks iklan.\n' +
      '2. Ciri-ciri dan kaidah kalimat persuasif pada slogan.\n' +
      '3. Struktur naskah iklan (Judul, Penjelasan, CTA).\n' +
      '4. Contoh analisis slogan produk komersial dan kampanye sosial.\n' +
      '5. Langkah praktis menyusun naskah iklan yang kreatif.'
    );
    setCatatan('Gunakan contoh yang dekat dengan kehidupan siswa dan media sosial.');
    setFormErrors({});
  };

  // Validasi form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const activeMapel = isCustomMapel ? customMapel.trim() : mapel.trim();

    if (!activeMapel) errors.mapel = 'Mata pelajaran wajib diisi.';
    if (!kelas.trim()) errors.kelas = 'Kelas wajib diisi.';
    if (!babTeks.trim()) errors.babTeks = 'Bab / Teks wajib diisi.';
    if (!temaPembelajaran.trim()) errors.temaPembelajaran = 'Tema pembelajaran wajib diisi.';
    if (!materiPelajaran.trim()) errors.materiPelajaran = 'Materi pelajaran wajib diisi.';
    if (!cakupanMateri.trim() || cakupanMateri.trim().length < 15) {
      errors.cakupanMateri = 'Cakupan materi wajib diisi (minimal 15 karakter / poin-poin bahasan).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const activeMapel = isCustomMapel ? customMapel.trim() : mapel.trim();

    onCreateProject({
      tingkat,
      kelas: kelas.trim(),
      mapel: activeMapel,
      babTeks: babTeks.trim(),
      temaPembelajaran: temaPembelajaran.trim(),
      materiPelajaran: materiPelajaran.trim(),
      cakupanMateri: cakupanMateri.trim(),
      catatan: catatan.trim(),
      teacherName: authorName,
      schoolName: authorSchool
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-6 animate-in fade-in duration-200">
      {/* Header Utama Buat Proyek */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3b49df] to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 shrink-0">
            <FolderPlus className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                1 Data → Banyak Produk
              </span>
              <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                Master Learning Data
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Buat Proyek Pembelajaran
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              Cukup definisikan materi satu kali. Data pembelajaran ini otomatis menjadi sumber tunggal (<em>Single Source of Truth</em>) untuk membuat Materi A4, Infografis, LKPD, Presentasi, dan Asesmen.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleFillSample}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            title="Isi contoh data cepat (Teks Iklan) untuk mencoba sistem"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Contoh Cepat</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Form Data Pembelajaran */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#3b49df] flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Data Pembelajaran Utama
                </h2>
                <p className="text-xs text-slate-500">
                  Isi 7 data wajib berikut untuk merumuskan ruang lingkup ajar.
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
              Wajib: 1 s/d 7 • Opsional: 8
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* 1. Tingkat (Wajib) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                1. Tingkat / Jenjang <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200">
                {(['SD', 'SMP', 'SMA', 'SMK'] as EducationLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleLevelChange(lvl)}
                    className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                      tingkat === lvl
                        ? 'bg-[#3b49df] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Kelas (Wajib) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                2. Kelas / Fase <span className="text-rose-500">*</span>
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border font-semibold bg-white transition-all ${
                  formErrors.kelas ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              >
                {(GRADE_OPTIONS_BY_LEVEL[tingkat] || []).map((grd) => (
                  <option key={grd} value={grd}>
                    {grd}
                  </option>
                ))}
                {!((GRADE_OPTIONS_BY_LEVEL[tingkat] || []).includes(kelas)) && (
                  <option value={kelas}>{kelas}</option>
                )}
              </select>
              {formErrors.kelas && (
                <p className="text-[11px] text-rose-500 font-semibold">{formErrors.kelas}</p>
              )}
            </div>

            {/* 3. Mata Pelajaran (Wajib) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  3. Mata Pelajaran <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomMapel(!isCustomMapel)}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  {isCustomMapel ? 'Pilih Daftar' : '+ Mapel Lain'}
                </button>
              </div>

              {isCustomMapel ? (
                <input
                  type="text"
                  value={customMapel}
                  onChange={(e) => setCustomMapel(e.target.value)}
                  placeholder="Ketik mata pelajaran..."
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white font-medium ${
                    formErrors.mapel ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              ) : (
                <select
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border font-semibold bg-white transition-all ${
                    formErrors.mapel ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                  }`}
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              )}
              {formErrors.mapel && (
                <p className="text-[11px] text-rose-500 font-semibold">{formErrors.mapel}</p>
              )}
            </div>

            {/* 4. Bab / Teks (Wajib) */}
            <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-bold text-slate-700">
                4. Bab / Teks <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={babTeks}
                onChange={(e) => setBabTeks(e.target.value)}
                placeholder="Contoh: Teks Iklan, Bab 2: Struktur Data Graph, Teks Eksplanasi, dll."
                className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white font-semibold ${
                  formErrors.babTeks ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
              {formErrors.babTeks && (
                <p className="text-[11px] text-rose-500 font-semibold">{formErrors.babTeks}</p>
              )}
            </div>

            {/* 5. Tema Pembelajaran (Wajib) */}
            <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-bold text-slate-700">
                5. Tema Pembelajaran <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={temaPembelajaran}
                onChange={(e) => setTemaPembelajaran(e.target.value)}
                placeholder="Contoh: Menyusun slogan dan naskah iklan persuasif"
                className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white font-semibold ${
                  formErrors.temaPembelajaran ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
              {formErrors.temaPembelajaran && (
                <p className="text-[11px] text-rose-500 font-semibold">{formErrors.temaPembelajaran}</p>
              )}
            </div>

            {/* 6. Materi Pelajaran (Wajib) */}
            <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-bold text-slate-700">
                6. Materi Pelajaran (Materi Pokok) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={materiPelajaran}
                onChange={(e) => setMateriPelajaran(e.target.value)}
                placeholder="Contoh: Slogan, kalimat persuasif, dan naskah iklan"
                className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white font-semibold ${
                  formErrors.materiPelajaran ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
              {formErrors.materiPelajaran && (
                <p className="text-[11px] text-rose-500 font-semibold">{formErrors.materiPelajaran}</p>
              )}
            </div>

            {/* 7. Cakupan Materi (Wajib - Textarea) */}
            <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  7. Cakupan Materi (Poin-poin Bahasan) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {cakupanMateri.length} karakter
                </span>
              </div>
              <textarea
                rows={5}
                value={cakupanMateri}
                onChange={(e) => setCakupanMateri(e.target.value)}
                placeholder="Tuliskan butir-butir submateri atau poin bahasan...&#10;Contoh:&#10;1. Pengertian slogan dan ciri-cirinya.&#10;2. Kalimat persuasif dan contohnya.&#10;3. Struktur naskah iklan.&#10;4. Langkah menyusun naskah iklan."
                className={`w-full p-4 text-xs sm:text-sm rounded-xl border bg-white leading-relaxed font-sans ${
                  formErrors.cakupanMateri ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
              {formErrors.cakupanMateri && (
                <p className="text-[11px] text-rose-500 font-semibold">{formErrors.cakupanMateri}</p>
              )}
              <p className="text-[11px] text-slate-500">
                💡 Cakupan materi ini akan otomatis dialirkan ke dokumen Materi, infografis, lembar stimulus LKPD, dan naskah 10 slide Presentasi.
              </p>
            </div>

            {/* 8. Catatan Pedagogis Guru (Opsional) */}
            <div className="space-y-1.5 sm:col-span-2 md:col-span-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>8. Catatan Pedagogis Guru (Opsional)</span>
                <span className="text-[11px] font-normal text-slate-400">Instruksi gaya bahasa / penekanan khusus</span>
              </label>
              <textarea
                rows={2}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: Gunakan analogi yang akrab dengan siswa, tekankan studi kasus iklan media sosial..."
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white leading-relaxed focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#3b49df] via-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Simpan & Buka Ruang Proyek</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
};
