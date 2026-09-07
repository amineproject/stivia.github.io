import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Palette, 
  Layout, 
  Sliders, 
  Check, 
  ArrowRight,
  Info,
  Layers,
  Wand2,
  RefreshCw,
  Eye,
  Type,
  CheckCircle2,
  Cpu,
  Briefcase,
  FileCheck,
  Lightbulb,
  PenTool,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { 
  EducationLevel, 
  InfographicFormat, 
  VisualLevel, 
  InfographicDraft 
} from '../../types';
import { 
  GRADE_OPTIONS_BY_LEVEL, 
  SUBJECT_OPTIONS, 
  VISUAL_STYLE_OPTIONS,
  INITIAL_SAMPLE_DRAFT
} from '../../data/mockData';
import { 
  INFOGRAPHIC_STYLE_CATEGORIES, 
  ALL_INFOGRAPHIC_STYLES, 
  findStyleByNameOrId, 
  InfographicStyleItem 
} from '../../data/infographicStylesData';
import { 
  getTypographyProfile, 
  TITLE_FONT_PRESETS, 
  BODY_FONT_PRESETS 
} from '../../data/typographyProfiles';
import { getStyleProfile } from '../../data/styleProfilesData';
import { StyleInfoModal } from '../infographic/StyleInfoModal';

const renderCategoryIcon = (iconName: string, classNameStr: string = 'w-4 h-4') => {
  switch (iconName) {
    case 'Cpu':
      return <Cpu className={classNameStr} />;
    case 'Briefcase':
      return <Briefcase className={classNameStr} />;
    case 'Sparkles':
      return <Sparkles className={classNameStr} />;
    case 'Palette':
    case 'Feather':
      return <Palette className={classNameStr} />;
    case 'GraduationCap':
      return <GraduationCap className={classNameStr} />;
    default:
      return <Layers className={classNameStr} />;
  }
};

interface BuatInfografisPageProps {
  currentDraft: InfographicDraft;
  onSubmitForm: (formData: Partial<InfographicDraft>) => void;
  onLoadSampleData: () => void;
}

export const BuatInfografisPage: React.FC<BuatInfografisPageProps> = ({
  currentDraft,
  onSubmitForm,
  onLoadSampleData,
}) => {
  // Form state
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(currentDraft.educationLevel || 'SMA');
  const [grade, setGrade] = useState<string>(currentDraft.grade || 'Kelas X');
  const [subject, setSubject] = useState<string>(currentDraft.subject || 'Informatika');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [isCustomSubject, setIsCustomSubject] = useState<boolean>(false);

  const [theme, setTheme] = useState<string>(currentDraft.theme || 'Analisis dan Visualisasi Data');
  const [rawTopic, setRawTopic] = useState<string>(currentDraft.rawTopic || 'Graph, Data Terstruktur, dan Visualisasi Data');
  const [pertemuan, setPertemuan] = useState<string>(currentDraft.pertemuan || 'Pertemuan 1');
  const [scope, setScope] = useState<string>(
    currentDraft.scope || 
    '1. Pengantar dan definisi Graph sebagai struktur data non-linear.\n2. Komponen penyusun Graph (Node/Vertex dan Edge/Sisi).\n3. Variasi konsep Graph berbobot dan terarah.\n4. Penerapan nyata pada navigasi rute dan pertemanan media sosial.\n5. Ringkasan visual.'
  );

  const [visualStyle, setVisualStyle] = useState<string>(currentDraft.visualStyle || 'Modern Edukatif');
  const [customVisualStyle, setCustomVisualStyle] = useState<string>('');
  const [isCustomStyle, setIsCustomStyle] = useState<boolean>(false);

  // Default null agar tidak langsung menampilkan 20 gaya sekaligus saat halaman dibuka
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [typographyMode, setTypographyMode] = useState<'otomatis' | 'kustom'>(currentDraft.typographyMode || 'otomatis');
  const [customTitleFont, setCustomTitleFont] = useState<string>(currentDraft.customTitleFont || 'Plus Jakarta Sans');
  const [customBodyFont, setCustomBodyFont] = useState<string>(currentDraft.customBodyFont || 'Inter');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [inspectingStyle, setInspectingStyle] = useState<InfographicStyleItem | null>(null);

  const [format, setFormat] = useState<InfographicFormat>(currentDraft.format || 'portrait');
  const [visualLevel, setVisualLevel] = useState<VisualLevel>(currentDraft.visualLevel || 'seimbang');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Sync available grades when education level changes
  useEffect(() => {
    const availableGrades = GRADE_OPTIONS_BY_LEVEL[educationLevel];
    if (!availableGrades.includes(grade)) {
      setGrade(availableGrades[0]);
    }
  }, [educationLevel]);

  // Synchronize form fields whenever currentDraft updates (e.g. from Edit Data in Preview)
  useEffect(() => {
    if (currentDraft) {
      setEducationLevel(currentDraft.educationLevel || 'SMA');
      setGrade(currentDraft.grade || 'Kelas X');
      
      const isKnownSubject = SUBJECT_OPTIONS.includes(currentDraft.subject);
      if (isKnownSubject) {
        setSubject(currentDraft.subject);
        setIsCustomSubject(false);
      } else if (currentDraft.subject) {
        setSubject('Lainnya');
        setCustomSubject(currentDraft.subject);
        setIsCustomSubject(true);
      }

      setTheme(currentDraft.theme || '');
      setRawTopic(currentDraft.rawTopic || '');
      setScope(currentDraft.scope || '');
      setVisualStyle(currentDraft.visualStyle || 'Modern Edukatif');
      setFormat(currentDraft.format || 'portrait');
      setVisualLevel(currentDraft.visualLevel || 'seimbang');
      setTypographyMode(currentDraft.typographyMode || 'otomatis');
      setCustomTitleFont(currentDraft.customTitleFont || 'Plus Jakarta Sans');
      setCustomBodyFont(currentDraft.customBodyFont || 'Inter');
    }
  }, [currentDraft.id, currentDraft.updatedAt]);

  const handleLevelChange = (level: EducationLevel) => {
    setEducationLevel(level);
  };

  const handleFillSample = () => {
    setEducationLevel(INITIAL_SAMPLE_DRAFT.educationLevel);
    setGrade(INITIAL_SAMPLE_DRAFT.grade);
    setSubject(INITIAL_SAMPLE_DRAFT.subject);
    setIsCustomSubject(false);
    setTheme(INITIAL_SAMPLE_DRAFT.theme);
    setRawTopic(INITIAL_SAMPLE_DRAFT.rawTopic);
    setPertemuan(INITIAL_SAMPLE_DRAFT.pertemuan || 'Pertemuan 1');
    setScope(INITIAL_SAMPLE_DRAFT.scope);
    setVisualStyle(INITIAL_SAMPLE_DRAFT.visualStyle);
    setIsCustomStyle(false);
    setFormat(INITIAL_SAMPLE_DRAFT.format);
    setVisualLevel(INITIAL_SAMPLE_DRAFT.visualLevel);
    setTypographyMode('otomatis');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const finalSubject = isCustomSubject ? customSubject.trim() : subject.trim();
    if (!finalSubject) {
      errors.subject = 'Mata pelajaran wajib diisi atau dipilih.';
    }
    if (!theme.trim()) {
      errors.theme = 'Tema kegiatan pembelajaran wajib diisi.';
    }
    if (!rawTopic.trim()) {
      errors.rawTopic = 'Materi yang diajarkan wajib diisi.';
    }
    if (!scope.trim()) {
      errors.scope = 'Cakupan materi wajib diisi minimal beberapa poin.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalSubject = isCustomSubject ? customSubject.trim() : subject;
    const finalStyle = isCustomStyle ? customVisualStyle.trim() : visualStyle;
    const styleProfile = getStyleProfile(finalStyle || 'Modern Edukatif');

    onSubmitForm({
      educationLevel,
      grade,
      subject: finalSubject,
      theme,
      rawTopic,
      pertemuan: pertemuan.trim() || 'Pertemuan 1',
      scope,
      visualStyle: finalStyle || 'Modern Edukatif',
      format,
      visualLevel,
      styleProfile,
      customTitleFont: typographyMode === 'kustom' ? customTitleFont : undefined,
      customBodyFont: typographyMode === 'kustom' ? customBodyFont : undefined,
      typographyMode,
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      {/* Header matching specification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Langkah 1: Pengumpulan Konteks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Buat Infografis
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Berikan konteks pembelajaran dan preferensi visual. STIVIA akan membantu menyusun materi sebelum infografis dibuat.
          </p>
        </div>

        {/* Quick Sample Button */}
        <button
          type="button"
          onClick={handleFillSample}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold border border-slate-200 hover:border-indigo-200 transition-colors shrink-0 shadow-xs cursor-pointer"
          title="Isi form otomatis dengan contoh materi Graph"
        >
          <Wand2 className="w-4 h-4 text-indigo-600" />
          <span>Gunakan Contoh Otomatis</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION A: INFORMASI PEMBELAJARAN */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Informasi Pembelajaran
              </h2>
              <p className="text-xs text-slate-500">
                Tentukan target jenjang, kelas, dan mata pelajaran
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Jenjang Pendidikan */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Jenjang Pendidikan <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['SD', 'SMP', 'SMA', 'SMK'] as EducationLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleLevelChange(lvl)}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-center ${
                      educationLevel === lvl
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Tingkat / Kelas */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Tingkat / Kelas <span className="text-rose-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                {GRADE_OPTIONS_BY_LEVEL[educationLevel].map((gr) => (
                  <option key={gr} value={gr}>
                    {gr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Mata Pelajaran (Searchable/Custom) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Mata Pelajaran <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomSubject(!isCustomSubject);
                  if (!isCustomSubject) setCustomSubject('');
                }}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                {isCustomSubject ? '← Pilih dari Daftar' : '+ Ketik Mata Pelajaran Lain'}
              </button>
            </div>

            {isCustomSubject ? (
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Ketik mata pelajaran Anda (contoh: Kecerdasan Buatan Dasar)..."
                className="w-full px-4 py-2.5 rounded-xl border border-indigo-300 bg-indigo-50/20 text-slate-800 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                autoFocus
              />
            ) : (
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {SUBJECT_OPTIONS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}

            {/* Quick preset chips */}
            {!isCustomSubject && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-medium">Saran Cepat:</span>
                {['Informatika', 'Matematika', 'IPA', 'Bahasa Indonesia', 'Fisika'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      const matched = SUBJECT_OPTIONS.find(s => s.startsWith(item)) || item;
                      setSubject(matched);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                      subject.startsWith(item)
                        ? 'bg-indigo-100 text-indigo-800 font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            {formErrors.subject && (
              <p className="text-xs text-rose-500">{formErrors.subject}</p>
            )}
          </div>
        </div>

        {/* SECTION B: INFORMASI MATERI */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
              B
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Informasi Materi
              </h2>
              <p className="text-xs text-slate-500">
                Uraikan tema, materi pokok, dan poin-poin bahasan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 4. Tema Kegiatan Pembelajaran */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Tema Kegiatan Pembelajaran <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Contoh: Analisis dan Visualisasi Data"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {formErrors.theme && (
                <p className="text-xs text-rose-500">{formErrors.theme}</p>
              )}
            </div>

            {/* 5. Materi yang Diajarkan */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                5. Materi yang Diajarkan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={rawTopic}
                onChange={(e) => setRawTopic(e.target.value)}
                placeholder="Contoh: Graph, Data Terstruktur, dan Visualisasi Data"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {formErrors.rawTopic && (
                <p className="text-xs text-rose-500">{formErrors.rawTopic}</p>
              )}
            </div>
          </div>

          {/* 6. Informasi Pertemuan (STIVIA 2.2d) */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                6. Rangkaian Pertemuan <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Pilih atau ketik pertemuan kegiatan belajar
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Pertemuan 1', 'Pertemuan 2', 'Pertemuan 3', 'Pertemuan 4'].map((ptm) => (
                <button
                  key={ptm}
                  type="button"
                  onClick={() => setPertemuan(ptm)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center ${
                    pertemuan === ptm
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {ptm}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={pertemuan}
                onChange={(e) => setPertemuan(e.target.value)}
                placeholder="Atau ketik pertemuan kustom, misal: Pertemuan 5 / Praktik Lab"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-800 flex items-start gap-2">
              <span className="font-bold text-amber-900 shrink-0">💡 Prinsip STIVIA:</span>
              <span>
                Nomor pertemuan menunjukkan posisi materi dalam silabus. Pada <strong>Pertemuan 2 dan seterusnya</strong>, STIVIA secara otomatis <em>tidak mengulang pengertian dasar/umum</em> kecuali jika diminta secara eksplisit dalam cakupan materi di bawah.
              </span>
            </div>
          </div>

          {/* 7. Cakupan Materi */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                7. Cakupan Materi (Batas Wajib Pembahasan) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-indigo-600 font-medium">
                Batas utama pembahasan visual
              </span>
            </div>
            <textarea
              rows={5}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Tuliskan poin-poin materi yang ingin dibahas...&#10;Contoh:&#10;1. Komponen struktur teks&#10;2. Kaidah kebahasaan spesifik&#10;3. Langkah-langkah penyusunan&#10;4. Contoh analisis kontekstual"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm leading-relaxed focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-sans"
            />
            {formErrors.scope && (
              <p className="text-xs text-rose-500">{formErrors.scope}</p>
            )}
            <p className="text-[11px] text-slate-500">
              * Hanya materi yang tertulis dalam Cakupan Materi yang akan divisualisasikan ke dalam infografis.
            </p>
          </div>
        </div>

        {/* SECTION C: PREFERENSI INFOGRAFIS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
              C
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Preferensi Infografis
              </h2>
              <p className="text-xs text-slate-500">
                Sesuaikan estetika visual, orientasi kanvas, dan kepadatan grafis
              </p>
            </div>
          </div>

          {/* 7. Gaya Visual & Sistem Kategori STIVIA 2.2d */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  <span>7. Gaya Visual Infografis</span>
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    2.2d • 5 Kategori
                  </span>
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih gaya visual untuk menentukan palet warna, ornamen, dan tipografi otomatis
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCustomStyle(!isCustomStyle);
                  if (!isCustomStyle) setCustomVisualStyle('');
                }}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline self-start sm:self-auto cursor-pointer"
              >
                {isCustomStyle ? '← Pilih dari 20 Gaya Resmi' : '+ Ketik Gaya Visual Sendiri'}
              </button>
            </div>

            {isCustomStyle ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={customVisualStyle}
                  onChange={(e) => setCustomVisualStyle(e.target.value)}
                  placeholder="Ketik preferensi gaya visual (contoh: Cyberpunk Edukatif, Vintage Botanik)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-300 bg-indigo-50/20 text-slate-800 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  autoFocus
                />
                <p className="text-2xs text-slate-500 italic">
                  Tip: Kerangka Berpikir STIVIA akan tetap menjaga integritas materi asli Anda.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* LANGKAH 1: PILIH KATEGORI GAYA */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-2xs flex items-center justify-center font-bold">1</span>
                    <span>LANGKAH 1: PILIH KATEGORI GAYA</span>
                  </label>

                  {/* 5 Filter Tab Kategori Utama + Opsi Semua Gaya */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                    {INFOGRAPHIC_STYLE_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategoryFilter === cat.id;
                      const hasActiveStyle = cat.styles.some((s) => s.name === visualStyle || s.id === visualStyle);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          id={`buat-cat-tab-${cat.id}`}
                          onClick={() => setSelectedCategoryFilter(cat.id)}
                          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer relative ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                              : hasActiveStyle
                              ? 'bg-indigo-50/90 text-indigo-950 border-indigo-300 hover:border-indigo-400'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <div className={`p-1.5 rounded-xl shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600'}`}>
                              {renderCategoryIcon(cat.iconName, 'w-4 h-4')}
                            </div>
                            {isSelected ? (
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-indigo-700 shadow-2xs shrink-0">
                                AKTIF
                              </span>
                            ) : hasActiveStyle ? (
                              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-200/90 text-indigo-800 shrink-0">
                                Gaya Aktif
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                                {cat.styles.length} Gaya
                              </span>
                            )}
                          </div>

                          <div>
                            <div className={`text-xs sm:text-[13px] font-bold leading-snug break-normal whitespace-normal tracking-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                              {cat.name}
                            </div>
                            <div className="mt-1">
                              <span className={`text-[11px] font-medium block truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {cat.tagline ? cat.tagline.split(',')[0] : `${cat.styles.length} pilihan`}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Filter Semua Gaya */}
                    <button
                      type="button"
                      id="buat-cat-tab-all"
                      onClick={() => setSelectedCategoryFilter('all')}
                      className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer relative ${
                        selectedCategoryFilter === 'all'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className={`p-1.5 rounded-xl shrink-0 ${selectedCategoryFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600'}`}>
                          <Layers className="w-4 h-4" />
                        </div>
                        {selectedCategoryFilter === 'all' ? (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-indigo-700 shadow-2xs shrink-0">
                            AKTIF
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                            20 Gaya
                          </span>
                        )}
                      </div>

                      <div>
                        <div className={`text-xs sm:text-[13px] font-bold leading-snug break-normal whitespace-normal tracking-tight ${selectedCategoryFilter === 'all' ? 'text-white' : 'text-slate-800'}`}>
                          SEMUA GAYA
                        </div>
                        <div className="mt-1">
                          <span className={`text-[11px] font-medium block truncate ${selectedCategoryFilter === 'all' ? 'text-indigo-100' : 'text-slate-400'}`}>
                            Koleksi 20 Gaya Resmi
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* LANGKAH 2: PILIH GAYA INFOGRAFIS */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-2xs flex items-center justify-center font-bold">2</span>
                    <span>LANGKAH 2: PILIH GAYA INFOGRAFIS</span>
                  </label>

                  {!selectedCategoryFilter ? (
                    /* Pesan Pembuka Saat Belum Memilih Kategori */
                    <div className="p-8 sm:p-12 text-center bg-slate-50/80 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 max-w-md">
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                          Pilih Salah Satu Kategori Gaya
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          Pilih salah satu kategori gaya di atas untuk melihat pilihan gaya infografis.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Banner Kategori Aktif */}
                      {(() => {
                        const activeCatObj = INFOGRAPHIC_STYLE_CATEGORIES.find((c) => c.id === selectedCategoryFilter);
                        const stylesCount = selectedCategoryFilter === 'all' ? ALL_INFOGRAPHIC_STYLES.length : (activeCatObj?.styles.length || 0);
                        return (
                          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-2xs">
                            <div className="flex items-start gap-3.5">
                              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0 mt-0.5 border border-indigo-100">
                                {activeCatObj ? renderCategoryIcon(activeCatObj.iconName, 'w-5 h-5') : <Layers className="w-5 h-5" />}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-2xs font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-100/80 px-2 py-0.5 rounded-md border border-indigo-200/60 inline-block">
                                    {activeCatObj ? `Koleksi: ${activeCatObj.name}` : 'Koleksi: SEMUA GAYA'}
                                  </span>
                                  {activeCatObj?.tagline && (
                                    <span className="text-xs font-semibold text-slate-700 hidden md:inline">
                                      • {activeCatObj.tagline}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed font-normal max-w-3xl">
                                  {activeCatObj ? activeCatObj.description : 'Koleksi lengkap seluruh 20 gaya visual infografis pembelajaran resmi STIVIA v2.2d.'}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 shrink-0 self-start sm:self-auto shadow-2xs">
                              {stylesCount} Gaya Tersedia
                            </span>
                          </div>
                        );
                      })()}

                      {/* Grid Pilihan Gaya Sesuai Filter Kategori (1 col mobile, 2 tablet, 3 desktop medium, 4 desktop besar) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {(selectedCategoryFilter === 'all'
                          ? ALL_INFOGRAPHIC_STYLES
                          : INFOGRAPHIC_STYLE_CATEGORIES.find((c) => c.id === selectedCategoryFilter)?.styles || ALL_INFOGRAPHIC_STYLES
                        ).map((style) => {
                          const isSelected = visualStyle === style.name || visualStyle === style.id;
                          const typo = getTypographyProfile(style.id || style.name);
                          const shortTraits = style.tags && style.tags.length > 0
                            ? style.tags.slice(0, 2)
                            : ['TERSTRUKTUR', 'EDUKATIF'];

                          return (
                            <div
                              key={style.id}
                              id={`buat-style-card-${style.id}`}
                              onClick={() => setVisualStyle(style.name)}
                              className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 bg-white relative group select-none min-h-[175px] ${
                                isSelected
                                  ? 'bg-indigo-50/50 border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-950 shadow-sm'
                                  : 'bg-white hover:bg-slate-50/70 border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-2xs'
                              }`}
                            >
                              <div className="space-y-2">
                                {/* Header Kartu: Nama & Badge Terpilih */}
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h5 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                                      {style.name}
                                    </h5>
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                                      {style.category}
                                    </span>
                                  </div>

                                  {isSelected ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs shrink-0">
                                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                                      <span>Terpilih</span>
                                    </span>
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-indigo-400 shrink-0 mt-0.5 transition-colors" />
                                  )}
                                </div>

                                {/* Penggunaan Huruf (Pratinjau Tipografi Harmonis Sesuai Gaya) */}
                                <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-700 text-[11px]">
                                  <Type className="w-3 h-3 text-indigo-500 shrink-0" />
                                  <span className="font-bold text-slate-800 truncate" style={{ fontFamily: typo.headingFont }}>
                                    {typo.headingFont}
                                  </span>
                                  <span className="text-slate-300 font-light">•</span>
                                  <span className="text-slate-500 text-[10px] truncate" style={{ fontFamily: typo.bodyFont }}>
                                    {typo.bodyFont}
                                  </span>
                                </div>

                                {/* Deskripsi Gaya */}
                                <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                                  {style.shortDescription || style.description}
                                </p>
                              </div>

                              {/* Karakter Visual & Tombol Info Detail */}
                              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                                <div className="flex flex-wrap gap-1">
                                  {shortTraits.map((t) => (
                                    <span
                                      key={t}
                                      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInspectingStyle(style);
                                    setIsInfoModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 text-2xs font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer shrink-0"
                                  title="Lihat informasi lengkap gaya ini"
                                >
                                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Detail</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* LANGKAH 3: KONFIGURASI GAYA TERPILIH & PREVIEW TIPOGRAFI */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-2xs flex items-center justify-center font-bold">3</span>
                    <span>LANGKAH 3: KONFIGURASI GAYA TERPILIH</span>
                  </label>

                  {(() => {
                    const styleItem = findStyleByNameOrId(visualStyle);
                    const typo = getTypographyProfile(visualStyle);
                    const effectiveTitleFont = typographyMode === 'kustom' ? customTitleFont : typo.headingFont;
                    const effectiveBodyFont = typographyMode === 'kustom' ? customBodyFont : typo.bodyFont;

                    return (
                      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-indigo-100">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-indigo-950 uppercase tracking-wide">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>✓ GAYA INFOGRAFIS TERPILIH</span>
                          </div>

                          {styleItem && (
                            <button
                              type="button"
                              onClick={() => {
                                setInspectingStyle(styleItem);
                                setIsInfoModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-2xs transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Lihat Rincian Gaya Ini</span>
                            </button>
                          )}
                        </div>

                        {/* 4 Kolom Informasi Gaya Aktif */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider">
                              KATEGORI GAYA
                            </span>
                            <span className="font-extrabold text-slate-800 text-xs sm:text-sm block">
                              {styleItem?.category || 'Infografis'}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider">
                              GAYA VISUAL
                            </span>
                            <span className="font-black text-indigo-600 text-sm sm:text-base block">
                              {visualStyle}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider">
                              TIPOGRAFI {typographyMode === 'otomatis' ? 'OTOMATIS' : 'KUSTOM'}
                            </span>
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
                              <span style={{ fontFamily: effectiveTitleFont }}>{effectiveTitleFont}</span>
                              <span className="text-slate-400 font-light">+</span>
                              <span className="text-slate-700 font-medium" style={{ fontFamily: effectiveBodyFont }}>{effectiveBodyFont}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider">
                              KARAKTER UTAMA
                            </span>
                            <span className="font-medium text-slate-700 text-xs leading-relaxed block line-clamp-2">
                              {styleItem?.characterExample || styleItem?.shortDescription || styleItem?.description || 'Gaya visual infografis resmi STIVIA'}
                            </span>
                          </div>
                        </div>

                        {/* Sistem Tipografi Otomatis vs Kustom (POIN D STIVIA 2.2d) */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                            <Type className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Pengaturan Tipografi Infografis</span>
                          </label>

                          <div className="inline-flex rounded-lg p-0.5 bg-white border border-indigo-200 text-xs">
                            <button
                              type="button"
                              onClick={() => setTypographyMode('otomatis')}
                              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                                typographyMode === 'otomatis'
                                  ? 'bg-indigo-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-indigo-600'
                              }`}
                            >
                              Otomatis (Default 2.2d)
                            </button>
                            <button
                              type="button"
                              onClick={() => setTypographyMode('kustom')}
                              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                                typographyMode === 'kustom'
                                  ? 'bg-indigo-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-indigo-600'
                              }`}
                            >
                              Mode Kustom
                            </button>
                          </div>
                        </div>

                        {typographyMode === 'otomatis' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-indigo-100 text-xs">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Font Judul Otomatis</span>
                              <span className="font-extrabold text-slate-900 text-base" style={{ fontFamily: typo.headingFont }}>
                                {typo.headingFont}
                              </span>
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                Dipasangkan presisi dengan karakter {styleItem?.name || visualStyle}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Font Isi Otomatis</span>
                              <span className="font-extrabold text-slate-900 text-base" style={{ fontFamily: typo.bodyFont }}>
                                {typo.bodyFont}
                              </span>
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                Keterbacaan tinggi untuk uraian materi dan kartu visual
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              {/* Custom Title Font */}
                              <div className="space-y-1.5">
                                <label className="block font-bold text-slate-700">
                                  Pilih Font Judul (Google Fonts):
                                </label>
                                <select
                                  value={customTitleFont}
                                  onChange={(e) => setCustomTitleFont(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold focus:outline-hidden focus:border-indigo-500"
                                >
                                  {TITLE_FONT_PRESETS.map((f) => (
                                    <option key={f.name} value={f.name}>
                                      {f.name} ({f.category})
                                    </option>
                                  ))}
                                </select>
                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Pratinjau Judul:</span>
                                  <span className="text-sm font-bold text-indigo-900" style={{ fontFamily: customTitleFont }}>
                                    {rawTopic || 'Judul Materi Pembelajaran'}
                                  </span>
                                </div>
                              </div>

                              {/* Custom Body Font */}
                              <div className="space-y-1.5">
                                <label className="block font-bold text-slate-700">
                                  Pilih Font Isi (Google Fonts):
                                </label>
                                <select
                                  value={customBodyFont}
                                  onChange={(e) => setCustomBodyFont(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold focus:outline-hidden focus:border-indigo-500"
                                >
                                  {BODY_FONT_PRESETS.map((f) => (
                                    <option key={f.name} value={f.name}>
                                      {f.name} ({f.category})
                                    </option>
                                  ))}
                                </select>
                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Pratinjau Isi:</span>
                                  <span className="text-xs text-slate-700 leading-relaxed line-clamp-2" style={{ fontFamily: customBodyFont }}>
                                    Memastikan penjelasan materi pembelajaran nyaman dibaca dan dipahami siswa secara optimal.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Live Typography Preview Banner */}
                        <div className="bg-white/90 p-3 rounded-xl border border-indigo-100/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-2xs font-bold text-slate-400 uppercase">Kombinasi Aktif:</span>
                            <span className="font-bold text-indigo-950" style={{ fontFamily: effectiveTitleFont }}>
                              {effectiveTitleFont}
                            </span>
                            <span className="text-slate-400 font-light">+</span>
                            <span className="font-medium text-slate-800" style={{ fontFamily: effectiveBodyFont }}>
                              {effectiveBodyFont}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 hidden sm:inline">
                            Akan otomatis diterapkan ke kanvas infografis
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* 8. Format Infografis */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                8. Format Infografis
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'portrait' as InfographicFormat, label: 'Portrait', sub: 'A4 Vertikal (Rekomendasi)' },
                  { id: 'square' as InfographicFormat, label: 'Square', sub: '1:1 Persegi' },
                  { id: 'landscape' as InfographicFormat, label: 'Landscape', sub: '16:9 Presentasi' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormat(fmt.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      format === fmt.id
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-bold">{fmt.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{fmt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 9. Tingkat Visual */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                9. Tingkat Visual
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sederhana' as VisualLevel, label: 'Sederhana', sub: 'Fokus teks & outline' },
                  { id: 'seimbang' as VisualLevel, label: 'Seimbang', sub: 'Grafik + Uraian (Default)' },
                  { id: 'visual_dominan' as VisualLevel, label: 'Visual Dominan', sub: 'Kaya ilustrasi & chart' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setVisualLevel(lvl.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      visualLevel === lvl.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-bold">{lvl.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{lvl.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Main Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            id="btn-buat-rancangan-materi"
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#4f46e5] hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base shadow-xl shadow-indigo-600/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <span>Buat Rancangan Materi</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Modal Rincian Gaya & Tipografi STIVIA 2.2d */}
      <StyleInfoModal
        isOpen={isInfoModalOpen}
        styleItem={inspectingStyle}
        onClose={() => {
          setIsInfoModalOpen(false);
          setInspectingStyle(null);
        }}
        onSelectStyle={(styleName) => {
          setVisualStyle(styleName);
          setIsInfoModalOpen(false);
          setInspectingStyle(null);
        }}
      />
    </div>
  );
};
