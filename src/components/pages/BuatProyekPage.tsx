import React, { useState } from 'react';
import {
  FolderPlus,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Layers,
  HelpCircle,
  CheckCircle2,
  Info
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
  // Hanya 4 Data Dasar Proyek sebagai Wadah Pembelajaran
  const [namaProyek, setNamaProyek] = useState<string>('Perangkat Ajar Bahasa Indonesia Kelas VIII');
  const [tingkat, setTingkat] = useState<EducationLevel>('SMP');
  const [kelas, setKelas] = useState<string>('Kelas VIII');
  const [mapel, setMapel] = useState<string>('Bahasa Indonesia');
  const [isCustomMapel, setIsCustomMapel] = useState<boolean>(false);
  const [customMapel, setCustomMapel] = useState<string>('');

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

  // Pengisian cepat contoh data wadah proyek
  const handleFillSample = () => {
    setNamaProyek('Perangkat Ajar Bahasa Indonesia Kelas VIII');
    setTingkat('SMP');
    setKelas('Kelas VIII');
    setMapel('Bahasa Indonesia');
    setIsCustomMapel(false);
    setCustomMapel('');
    setFormErrors({});
  };

  // Validasi form (Hanya 4 field dasar proyek)
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const activeMapel = isCustomMapel ? customMapel.trim() : mapel.trim();

    if (!namaProyek.trim()) errors.namaProyek = 'Nama proyek pembelajaran wajib diisi.';
    if (!activeMapel) errors.mapel = 'Mata pelajaran wajib diisi.';
    if (!kelas.trim()) errors.kelas = 'Tingkat kelas wajib diisi.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const activeMapel = isCustomMapel ? customMapel.trim() : mapel.trim();

    onCreateProject({
      namaProyek: namaProyek.trim(),
      tingkat,
      kelas: kelas.trim(),
      mapel: activeMapel,
      teacherName: authorName,
      schoolName: authorSchool
    });
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 space-y-6 animate-in fade-in duration-200">
      {/* Header Utama Buat Proyek (Wadah Pembelajaran) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3b49df] to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 shrink-0">
            <FolderPlus className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Wadah Pembelajaran
              </span>
              <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                STIVIA Proyek
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Buat Proyek Pembelajaran
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              Buat wadah pembelajaran. Data materi dan pertemuan ditambahkan setelah proyek dibuat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleFillSample}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            title="Isi contoh wadah proyek cepat"
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

      {/* Info Banner Alur Pembelajaran STIVIA */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-900 leading-relaxed">
          <span className="font-bold">Konsep STIVIA: </span>
          <span className="font-semibold text-indigo-700">Proyek = Wadah</span> (Kelas & Mapel) &bull; <span className="font-semibold text-indigo-700">Pertemuan = Unit Pembelajaran</span> (Materi, Cakupan, TP). Setelah proyek dibuat, Anda dapat menambahkan Bab dan membuat Pertemuan di ruang <strong>Proyek Saya</strong>.
        </div>
      </div>

      {/* Form Data Dasar Proyek */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#3b49df] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Data Dasar Proyek
                </h2>
                <p className="text-xs text-slate-500">
                  Hanya 4 data identitas wadah pembelajaran yang diperlukan.
                </p>
              </div>
            </div>
            <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold">
              4 Field Utama
            </span>
          </div>

          <div className="space-y-5">
            {/* A. Nama Proyek */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Nama Proyek <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={namaProyek}
                onChange={(e) => {
                  setNamaProyek(e.target.value);
                  if (formErrors.namaProyek) setFormErrors((prev) => ({ ...prev, namaProyek: undefined }));
                }}
                placeholder="Contoh: Perangkat Ajar Bahasa Indonesia Kelas VIII"
                className={`w-full px-4 py-3 text-xs sm:text-sm rounded-xl border bg-white font-semibold ${
                  formErrors.namaProyek ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
              {formErrors.namaProyek && (
                <p className="text-[11px] text-rose-500 font-semibold">{formErrors.namaProyek}</p>
              )}
              <p className="text-[11px] text-slate-400">
                Beri nama wadah ajar, misalnya: <em>Perangkat Ajar Bahasa Indonesia Kelas VIII</em>
              </p>
            </div>

            {/* Grid 3 Kolom: Tingkat, Kelas, Mata Pelajaran */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* B. Tingkat */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Tingkat <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200">
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

              {/* C. Kelas */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Kelas <span className="text-rose-500">*</span>
                </label>
                <select
                  value={kelas}
                  onChange={(e) => {
                    setKelas(e.target.value);
                    if (formErrors.kelas) setFormErrors((prev) => ({ ...prev, kelas: undefined }));
                  }}
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

              {/* D. Mata Pelajaran */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Mata Pelajaran <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomMapel(!isCustomMapel)}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                  >
                    {isCustomMapel ? 'Pilih Opsi' : '+ Kustom'}
                  </button>
                </div>

                {isCustomMapel ? (
                  <input
                    type="text"
                    value={customMapel}
                    onChange={(e) => {
                      setCustomMapel(e.target.value);
                      if (formErrors.mapel) setFormErrors((prev) => ({ ...prev, mapel: undefined }));
                    }}
                    placeholder="Ketik nama mapel..."
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white font-medium ${
                      formErrors.mapel ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                ) : (
                  <select
                    value={mapel}
                    onChange={(e) => {
                      setMapel(e.target.value);
                      if (formErrors.mapel) setFormErrors((prev) => ({ ...prev, mapel: undefined }));
                    }}
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
            <span>Buat Proyek</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
};
