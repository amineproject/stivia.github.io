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
  RefreshCw
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
  const [scope, setScope] = useState<string>(
    currentDraft.scope || 
    '1. Pengantar dan definisi Graph sebagai struktur data non-linear.\n2. Komponen penyusun Graph (Node/Vertex dan Edge/Sisi).\n3. Variasi konsep Graph berbobot dan terarah.\n4. Penerapan nyata pada navigasi rute dan pertemanan media sosial.\n5. Ringkasan visual.'
  );

  const [visualStyle, setVisualStyle] = useState<string>(currentDraft.visualStyle || 'Modern Edukatif');
  const [customVisualStyle, setCustomVisualStyle] = useState<string>('');
  const [isCustomStyle, setIsCustomStyle] = useState<boolean>(false);

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
    setScope(INITIAL_SAMPLE_DRAFT.scope);
    setVisualStyle(INITIAL_SAMPLE_DRAFT.visualStyle);
    setIsCustomStyle(false);
    setFormat(INITIAL_SAMPLE_DRAFT.format);
    setVisualLevel(INITIAL_SAMPLE_DRAFT.visualLevel);
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

    onSubmitForm({
      educationLevel,
      grade,
      subject: finalSubject,
      theme,
      rawTopic,
      scope,
      visualStyle: finalStyle || 'Modern Edukatif',
      format,
      visualLevel,
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

          {/* 6. Cakupan Materi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                6. Cakupan Materi <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Bisa ditulis per baris atau berupa poin-poin
              </span>
            </div>
            <textarea
              rows={5}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Tuliskan poin-poin materi yang ingin dibahas...&#10;Contoh:&#10;1. Definisi dan konsep dasar&#10;2. Komponen penyusun dan hubungan&#10;3. Contoh penerapan di kehidupan&#10;4. Kesimpulan penting"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm leading-relaxed focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-sans"
            />
            {formErrors.scope && (
              <p className="text-xs text-rose-500">{formErrors.scope}</p>
            )}
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

          {/* 7. Gaya Visual */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                7. Gaya Visual
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomStyle(!isCustomStyle);
                  if (!isCustomStyle) setCustomVisualStyle('');
                }}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                {isCustomStyle ? '← Pilih dari Opsi' : '+ Ketik Gaya Visual Sendiri'}
              </button>
            </div>

            {isCustomStyle ? (
              <input
                type="text"
                value={customVisualStyle}
                onChange={(e) => setCustomVisualStyle(e.target.value)}
                placeholder="Ketik preferensi gaya visual (contoh: Cyberpunk Edukatif, Vintage Botanik)..."
                className="w-full px-4 py-2.5 rounded-xl border border-indigo-300 bg-indigo-50/20 text-slate-800 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                autoFocus
              />
            ) : (
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {VISUAL_STYLE_OPTIONS.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            )}

            {/* Visual style chips */}
            {!isCustomStyle && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Modern Edukatif',
                  'Minimalis',
                  'Futuristic',
                  'Cyberpunk',
                  'Swiss Design',
                  'Clay Style',
                  'Pop Art',
                  'Editorial',
                  'Handwritten & Doodle',
                  'Glassmorphism',
                  'Aurora',
                  'Academic Clean',
                  'Ceria & Kreatif',
                  'Vintage & Historical',
                ].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setVisualStyle(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      visualStyle === st
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
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
    </div>
  );
};
