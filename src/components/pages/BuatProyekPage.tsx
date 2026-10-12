import React, { useState, useRef } from 'react';
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
  Info,
  FileSpreadsheet,
  Download,
  Upload,
  AlertTriangle,
  XCircle,
  Check,
  ChevronDown,
  ChevronRight,
  Calendar,
  Eye,
  RefreshCw
} from 'lucide-react';
import { EducationLevel, NavigationTab, LearningProject } from '../../types';
import { CreateProjectFormInput } from '../../services/learningProjectService';
import { SUBJECT_OPTIONS, GRADE_OPTIONS_BY_LEVEL } from '../../data/mockData';
import {
  generateOfficialExcelTemplate,
  parseExcelBufferToRows,
  validateAndTransformExcelRows,
  CollectiveImportPreview,
  RowValidationResult
} from '../../services/projectExcelService';

interface BuatProyekPageProps {
  onNavigate: (tab: NavigationTab) => void;
  onCreateProject: (input: CreateProjectFormInput) => void;
  onCreateCollectiveProjects?: (projects: LearningProject[]) => Promise<void> | void;
  authorName?: string;
  authorSchool?: string;
}

export const BuatProyekPage: React.FC<BuatProyekPageProps> = ({
  onNavigate,
  onCreateProject,
  onCreateCollectiveProjects,
  authorName,
  authorSchool
}) => {
  // Mode Pembuatan: 'manual' (Satu Wadah Pembelajaran) atau 'kolektif' (Impor Excel Massal)
  const [creationMode, setCreationMode] = useState<'manual' | 'kolektif'>('manual');

  // ==========================================
  // STATE MODE MANUAL
  // ==========================================
  const [namaProyek, setNamaProyek] = useState<string>('');
  const [tingkat, setTingkat] = useState<EducationLevel>('SMP');
  const [kelas, setKelas] = useState<string>('Kelas VIII');
  const [mapel, setMapel] = useState<string>('Bahasa Indonesia');
  const [isCustomMapel, setIsCustomMapel] = useState<boolean>(false);
  const [customMapel, setCustomMapel] = useState<string>('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ==========================================
  // STATE MODE KOLEKTIF (EXCEL)
  // ==========================================
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isParsingExcel, setIsParsingExcel] = useState<boolean>(false);
  const [excelPreview, setExcelPreview] = useState<CollectiveImportPreview | null>(null);
  const [excelParseError, setExcelParseError] = useState<string | null>(null);
  const [isSavingCollective, setIsSavingCollective] = useState<boolean>(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'ringkasan' | 'tabel' | 'hierarki'>('ringkasan');
  const [filterRowStatus, setFilterRowStatus] = useState<'all' | 'valid' | 'invalid'>('all');

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

  // Validasi form manual (Hanya 4 field dasar proyek)
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

  // Handler Download Templat Resmi Excel
  const handleDownloadTemplate = () => {
    try {
      generateOfficialExcelTemplate();
    } catch (err: any) {
      console.error('Gagal mengunduh template Excel:', err);
      alert('Gagal membuat template Excel. Silakan coba kembali.');
    }
  };

  // Handler Unggah & Parse File Excel
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setIsParsingExcel(true);
    setExcelParseError(null);
    setExcelPreview(null);

    try {
      const buffer = await file.arrayBuffer();
      const rawRows = parseExcelBufferToRows(buffer);

      if (rawRows.length === 0) {
        setExcelParseError('File Excel tidak memiliki data baris atau format kosong.');
        setIsParsingExcel(false);
        return;
      }

      const preview = validateAndTransformExcelRows(rawRows, authorName, authorSchool);
      setExcelPreview(preview);
    } catch (err: any) {
      console.error('Error membaca file Excel:', err);
      setExcelParseError(`Gagal membaca file Excel: ${err?.message || 'Format tidak didukung'}`);
    } finally {
      setIsParsingExcel(false);
    }
  };

  // Handler Reset Unggahan
  const handleResetUpload = () => {
    setSelectedFileName('');
    setExcelPreview(null);
    setExcelParseError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handler Simpan Proyek Kolektif
  const handleSaveCollective = async () => {
    if (!excelPreview || excelPreview.hierarchicalProjects.length === 0) return;

    setIsSavingCollective(true);
    try {
      if (onCreateCollectiveProjects) {
        await onCreateCollectiveProjects(excelPreview.hierarchicalProjects);
      } else {
        // Fallback jika callback belum dipasang: tambahkan satu per satu
        for (const proj of excelPreview.hierarchicalProjects) {
          const firstCs = proj.classSubjects[0];
          const firstCh = firstCs?.chapters[0];
          const firstMeet = firstCh?.meetings[0];
          onCreateProject({
            namaProyek: proj.name,
            tingkat: firstCs?.educationLevel || 'SMP',
            kelas: firstCs?.grade || 'Kelas VIII',
            mapel: firstCs?.subject || 'Bahasa Indonesia',
            babTeks: firstCh?.title,
            temaPembelajaran: firstMeet?.masterLearningData?.temaKegiatan,
            materiPelajaran: firstMeet?.masterLearningData?.materiDiajarkan,
            cakupanMateri: firstMeet?.masterLearningData?.cakupanMateri,
            catatan: firstMeet?.masterLearningData?.userNotes,
            teacherName: proj.teacherName,
            schoolName: proj.schoolName
          });
        }
      }
    } catch (err: any) {
      console.error('Gagal menyimpan proyek kolektif:', err);
      alert('Terjadi kesalahan saat menyimpan proyek kolektif.');
    } finally {
      setIsSavingCollective(false);
    }
  };

  // Filter baris data untuk tab tabel
  const filteredRows = excelPreview?.rowResults.filter(r => {
    if (filterRowStatus === 'valid') return r.isValid;
    if (filterRowStatus === 'invalid') return !r.isValid;
    return true;
  }) || [];

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6 animate-in fade-in duration-200">
      {/* Header Utama Buat Proyek */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Buat Proyek Pembelajaran
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
              STIVIA Ruang Belajar
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tentukan wadah pembelajaran mandiri atau gunakan Mode Kolektif untuk membuat banyak proyek dari Excel.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {creationMode === 'manual' && (
            <button
              type="button"
              onClick={handleFillSample}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Isi contoh wadah proyek cepat"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Contoh Cepat</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Switcher Mode Pembuatan: Manual vs Mode Kolektif */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setCreationMode('manual')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            creationMode === 'manual'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Mode Standar (Satu Proyek)</span>
        </button>

        <button
          type="button"
          onClick={() => setCreationMode('kolektif')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            creationMode === 'kolektif'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Mode Kolektif (Impor Excel)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold uppercase hidden sm:inline">
            Eksklusif
          </span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* MODE 1: FORM STANDAR SATU PROYEK PEMBELAJARAN                        */}
      {/* ==================================================================== */}
      {creationMode === 'manual' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#3b49df] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Data Dasar Wadah Proyek
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
      )}

      {/* ==================================================================== */}
      {/* MODE 2: MODE KOLEKTIF (IMPOR & EKSPOR EXCEL SEKALIGUS)               */}
      {/* ==================================================================== */}
      {creationMode === 'kolektif' && (
        <div className="space-y-6">
          {/* Card Langkah 1: Unduh Templat Resmi */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Langkah 1: Unduh Templat Excel Resmi
                  </h2>
                  <p className="text-xs text-slate-500">
                    Format resmi STIVIA telah dilengkapi struktur kolom, petunjuk pengisian, dan contoh data.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 shrink-0 active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Templat (.xlsx)</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Ketentuan Kolom Wajib:</span>
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                <strong>Nama Proyek</strong>, <strong>Jenjang</strong> (SD/SMP/SMA/SMK), <strong>Kelas</strong>, <strong>Mata Pelajaran</strong>, <strong>Bab / Teks</strong>, dan <strong>Nomor Pertemuan</strong>.
                Kolom materi, cakupan, dan tujuan pembelajaran dapat diisi untuk langsung menghasilkan Master Learning Data.
              </p>
            </div>
          </div>

          {/* Card Langkah 2: Unggah File Excel */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Langkah 2: Unggah & Periksa File Excel
                </h2>
                <p className="text-xs text-slate-500">
                  Pilih file Excel yang telah Anda isi untuk divalidasi dan ditinjau sebelum disimpan.
                </p>
              </div>
            </div>

            {/* Area Drag / Upload */}
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-3xl p-6 sm:p-8 text-center transition-all bg-slate-50/50">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-file-upload-input"
              />

              {!selectedFileName ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-[#3b49df] flex items-center justify-center mx-auto">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <label
                      htmlFor="excel-file-upload-input"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer inline-flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Pilih File Excel (.xlsx)</span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Mendukung format Microsoft Excel (.xlsx dan .xls)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>File Terpilih: {selectedFileName}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <label
                      htmlFor="excel-file-upload-input"
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Ganti File</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleResetUpload}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Loading Indicator */}
            {isParsingExcel && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-3">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="font-semibold">Menganalisis baris data Excel dan menyusun hierarki pembelajaran...</span>
              </div>
            )}

            {/* Error Parse */}
            {excelParseError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Gagal Membaca File Excel</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">{excelParseError}</p>
                </div>
              </div>
            )}
          </div>

          {/* ================================================================ */}
          {/* PRATINJAU & VALIDASI DATA HASIL PARSING EXCEL                     */}
          {/* ================================================================ */}
          {excelPreview && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
              {/* Header Hasil Validasi */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Langkah 3: Pratinjau & Hasil Validasi</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold">
                      {excelPreview.totalRows} Baris Terbaca
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Periksa keabsahan data sebelum menyimpannya ke hierarki proyek pembelajaran STIVIA.
                  </p>
                </div>

                {/* Indikator Status Valid / Invalid */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{excelPreview.validRows} Valid</span>
                  </span>
                  {excelPreview.invalidRows > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{excelPreview.invalidRows} Error</span>
                    </span>
                  )}
                  {excelPreview.warningsCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{excelPreview.warningsCount} Peringatan</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-Tabs Pratinjau: Ringkasan, Tabel Baris, Struktur Hierarki */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('ringkasan')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activePreviewTab === 'ringkasan'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Ringkasan Proyek ({excelPreview.summary.totalProjects})
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('tabel')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activePreviewTab === 'tabel'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Daftar Baris Excel ({excelPreview.rowResults.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('hierarki')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activePreviewTab === 'hierarki'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Pohon Hierarki ({excelPreview.summary.totalMeetings} Pertemuan)
                </button>
              </div>

              {/* TAB A: RINGKASAN PROYEK */}
              {activePreviewTab === 'ringkasan' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
                      <p className="text-2xl font-black text-indigo-700">{excelPreview.summary.totalProjects}</p>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">Wadah Proyek</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
                      <p className="text-2xl font-black text-blue-700">{excelPreview.summary.totalClasses}</p>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">Kelas & Mapel</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-center">
                      <p className="text-2xl font-black text-purple-700">{excelPreview.summary.totalChapters}</p>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">Bab / Teks</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                      <p className="text-2xl font-black text-emerald-700">{excelPreview.summary.totalMeetings}</p>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">Pertemuan Siap</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Daftar Proyek yang Akan Dibuat:
                    </p>
                    <div className="space-y-2">
                      {excelPreview.hierarchicalProjects.map((proj, idx) => (
                        <div
                          key={proj.id}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <span>📁 {proj.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                                {proj.academicYear} • {proj.semester}
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {proj.classSubjects.map(cs => `${cs.educationLevel} ${cs.grade} - ${cs.subject}`).join(', ')}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-indigo-600 shrink-0">
                            {proj.classSubjects.reduce((acc, cs) => acc + cs.chapters.reduce((cAcc, ch) => cAcc + ch.meetings.length, 0), 0)} Pertemuan
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB B: DAFTAR BARIS TABEL EXCEL */}
              {activePreviewTab === 'tabel' && (
                <div className="space-y-3">
                  {/* Filter Baris */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Menampilkan {filteredRows.length} dari {excelPreview.rowResults.length} baris
                    </p>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setFilterRowStatus('all')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          filterRowStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                        }`}
                      >
                        Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterRowStatus('valid')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          filterRowStatus === 'valid' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600'
                        }`}
                      >
                        Valid
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterRowStatus('invalid')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          filterRowStatus === 'invalid' ? 'bg-white text-rose-800 shadow-2xs font-bold' : 'text-slate-600'
                        }`}
                      >
                        Error
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 text-xs">
                    {filteredRows.map((r) => (
                      <div key={r.rowNumber} className={`p-3 space-y-1 ${!r.isValid ? 'bg-rose-50/50' : 'bg-white hover:bg-slate-50'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-400">#{r.rowNumber}</span>
                            <span className="font-bold text-slate-900">{r.data.namaProyek || '(Tanpa Nama)'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                              {r.data.kelas} • {r.data.mapel}
                            </span>
                          </div>
                          {r.isValid ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Ada Masalah
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600">
                          <strong>{r.data.bab}</strong> · {r.data.pertemuan}: {r.data.materiDiajarkan || r.data.judulPertemuan || '-'}
                        </p>

                        {/* Error Messages */}
                        {r.errors.length > 0 && (
                          <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                            <XCircle className="w-3 h-3 shrink-0" />
                            <span>{r.errors.join(' | ')}</span>
                          </div>
                        )}

                        {/* Warnings */}
                        {r.warnings.length > 0 && (
                          <div className="text-[11px] text-amber-700 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{r.warnings.join(' | ')}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB C: POHON HIERARKI */}
              {activePreviewTab === 'hierarki' && (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {excelPreview.hierarchicalProjects.map((proj) => (
                    <div key={proj.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <FolderPlus className="w-4 h-4 text-indigo-600" />
                          <span>{proj.name}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {proj.academicYear} • {proj.semester}
                        </span>
                      </div>

                      {proj.classSubjects.map((cs) => (
                        <div key={cs.id} className="pl-3 border-l-2 border-indigo-200 space-y-2">
                          <p className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{cs.educationLevel} • {cs.grade} • {cs.subject}</span>
                          </p>

                          {cs.chapters.map((ch) => (
                            <div key={ch.id} className="pl-3 border-l-2 border-slate-200 space-y-1">
                              <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                <span>{ch.chapterNumber}: {ch.title}</span>
                              </p>

                              <div className="pl-4 space-y-1">
                                {ch.meetings.map((m) => (
                                  <div
                                    key={m.id}
                                    className="p-2 rounded-xl bg-white border border-slate-200/80 text-[11px] flex items-center justify-between"
                                  >
                                    <span className="font-semibold text-slate-800">
                                      {m.meetingNumber}: {m.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {m.masterLearningData?.cakupanMateri ? 'Lengkap' : 'Draft Awal'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Simpan Proyek Kolektif */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {excelPreview.invalidRows > 0 ? (
                    <span className="text-rose-600 font-semibold">
                      Terdapat {excelPreview.invalidRows} baris bermasalah. Hanya baris valid ({excelPreview.validRows}) yang akan disimpan.
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      Semua data ({excelPreview.validRows} baris) siap disimpan ke STIVIA.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetUpload}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCollective}
                    disabled={isSavingCollective || excelPreview.hierarchicalProjects.length === 0}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
                  >
                    {isSavingCollective ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan Proyek...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Simpan {excelPreview.summary.totalProjects} Proyek Kolektif</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
