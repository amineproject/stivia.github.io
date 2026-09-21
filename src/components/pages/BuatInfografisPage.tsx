import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  ArrowRight,
  RefreshCw,
  Layout,
  Sliders,
  Wand2,
  CheckCircle2,
  Layers,
  Check,
  Copy,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { 
  EducationLevel, 
  InfographicFormat, 
  VisualLevel, 
  InfographicDraft,
  NavigationTab
} from '../../types';
import { 
  GRADE_OPTIONS_BY_LEVEL, 
  SUBJECT_OPTIONS, 
  INITIAL_SAMPLE_DRAFT
} from '../../data/mockData';
import { getStyleProfile } from '../../data/styleProfilesData';
import { APP_CURRENT_VERSION } from '../../data/versionHistoryData';
import { analyzeAndGenerateProjectInfographicPrompt } from '../../services/promptStudioEngine';
import { StiviaThinkingResult } from '../../services/stiviaThinkingFramework';
import { StiviaThinkingPanel } from '../infographic/StiviaThinkingPanel';

interface BuatInfografisPageProps {
  projects?: InfographicDraft[];
  currentDraft: InfographicDraft;
  onSubmitForm: (formData: Partial<InfographicDraft>, options?: { navigateToStudio?: boolean }) => void;
  onLoadSampleData: () => void;
  onSelectProject?: (project: InfographicDraft) => void;
  onNavigate?: (tab: NavigationTab) => void;
}

export const BuatInfografisPage: React.FC<BuatInfografisPageProps> = ({
  projects = [],
  currentDraft,
  onSubmitForm,
  onLoadSampleData,
  onSelectProject,
  onNavigate,
}) => {
  // Form state
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(currentDraft.educationLevel || 'SMA');
  const [grade, setGrade] = useState<string>(currentDraft.grade || 'Kelas X');
  const [subject, setSubject] = useState<string>(currentDraft.subject || 'Informatika');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [isCustomSubject, setIsCustomSubject] = useState<boolean>(false);

  const [materiDiajarkan, setMateriDiajarkan] = useState<string>(
    currentDraft.rawTopic || currentDraft.title || currentDraft.theme || 'Struktur Data Graph'
  );
  const [bab, setBab] = useState<string>(currentDraft.bab || '');
  const [temaKegiatan, setTemaKegiatan] = useState<string>(
    currentDraft.theme && currentDraft.theme !== (currentDraft.rawTopic || currentDraft.title)
      ? currentDraft.theme
      : ''
  );
  const [pertemuan, setPertemuan] = useState<string>(currentDraft.pertemuan || 'Pertemuan 1');
  const [scope, setScope] = useState<string>(
    currentDraft.scope || 
    '1. Pengantar dan definisi Graph sebagai struktur data non-linear.\n2. Komponen penyusun Graph (Node/Vertex dan Edge/Sisi).\n3. Variasi konsep Graph berbobot dan terarah.\n4. Penerapan nyata pada navigasi rute dan pertemanan media sosial.\n5. Ringkasan visual.'
  );
  const [userNotes, setUserNotes] = useState<string>(currentDraft.userNotes || '');

  const [format, setFormat] = useState<InfographicFormat>(currentDraft.format || 'portrait');
  const [visualLevel, setVisualLevel] = useState<VisualLevel>(currentDraft.visualLevel || 'seimbang');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>(() => currentDraft.stiviaPrompt || '');
  const [thinkingResult, setThinkingResult] = useState<StiviaThinkingResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync available grades when education level changes
  useEffect(() => {
    const availableGrades = GRADE_OPTIONS_BY_LEVEL[educationLevel];
    if (!availableGrades.includes(grade)) {
      setGrade(availableGrades[0]);
    }
  }, [educationLevel]);

  // Synchronize form fields whenever currentDraft updates (e.g. from Edit Data in Preview or Selection)
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

      const rawMat = currentDraft.rawTopic || currentDraft.title || currentDraft.theme || '';
      setMateriDiajarkan(rawMat);
      setBab(currentDraft.bab || '');
      setTemaKegiatan(currentDraft.theme && currentDraft.theme !== rawMat ? currentDraft.theme : '');
      setPertemuan(currentDraft.pertemuan || 'Pertemuan 1');
      setScope(currentDraft.scope || '');
      setUserNotes(currentDraft.userNotes || '');
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
    setMateriDiajarkan('Struktur Data Graph');
    setBab('Bab 2: Struktur Data dan Algoritma');
    setTemaKegiatan('Eksplorasi Struktur Data Non-Linear');
    setPertemuan(INITIAL_SAMPLE_DRAFT.pertemuan || 'Pertemuan 1');
    setScope(INITIAL_SAMPLE_DRAFT.scope);
    setUserNotes(INITIAL_SAMPLE_DRAFT.userNotes || '');
    setFormat(INITIAL_SAMPLE_DRAFT.format);
    setVisualLevel(INITIAL_SAMPLE_DRAFT.visualLevel);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const finalSubject = isCustomSubject ? customSubject.trim() : subject.trim();
    if (!finalSubject) {
      errors.subject = 'Mata pelajaran wajib diisi atau dipilih.';
    }
    if (!materiDiajarkan.trim()) {
      errors.materiDiajarkan = 'Materi yang akan diajarkan wajib diisi.';
    }
    if (!scope.trim()) {
      errors.scope = 'Cakupan materi wajib diisi minimal beberapa poin.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const scrollToResult = () => {
    setTimeout(() => {
      const resultEl = document.getElementById('prompt-result-section');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleRegenerate = () => {
    if (!validateForm()) return;
    executeGeneratePrompt();
  };

  const executeGeneratePrompt = () => {
    const finalSubject = isCustomSubject ? customSubject.trim() : subject;
    const finalStyle = 'Modern Edukatif';
    const styleProfile = getStyleProfile(finalStyle);

    setIsGenerating(true);
    setCopied(false);

    setTimeout(() => {
      try {
        const fullDraft: InfographicDraft = {
          ...currentDraft,
          educationLevel,
          grade,
          subject: finalSubject,
          theme: temaKegiatan.trim() || materiDiajarkan.trim(),
          title: materiDiajarkan.trim(),
          rawTopic: materiDiajarkan.trim(),
          bab: bab.trim(),
          pertemuan: pertemuan.trim() || 'Pertemuan 1',
          scope,
          userNotes: userNotes.trim(),
          visualStyle: finalStyle,
          format,
          visualLevel,
          styleProfile,
          typographyMode: 'otomatis',
          updatedAt: new Date().toISOString().split('T')[0],
        };

        const { prompt, thinkingResult: result } = analyzeAndGenerateProjectInfographicPrompt(fullDraft, {
          format: 'Vertikal',
          visualStyleName: finalStyle,
        });

        setGeneratedPrompt(prompt);
        setThinkingResult(result);

        onSubmitForm({
          ...fullDraft,
          stiviaPrompt: prompt,
        });

        scrollToResult();
      } catch (err) {
        console.error('[Buat Prompt Generator Error]', err);
      } finally {
        setIsGenerating(false);
      }
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    executeGeneratePrompt();
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STIVIA v{APP_CURRENT_VERSION} • Generator Prompt Infografis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Buat Prompt
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Input data materi: <strong>Kelas</strong>, <strong>Mata Pelajaran</strong>, dan <strong>Materi yang akan dibuat promptnya</strong>. Sistem STIVIA akan menganalisis data pembelajaran dan langsung menghasilkan <strong>Prompt Infografis</strong> yang siap digunakan.
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
        {/* SECTION A: DATA POKOK PEMBELAJARAN (KELAS, MAPEL, MATERI) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Data Pokok Pembelajaran & Prompt
              </h2>
              <p className="text-xs text-slate-500">
                Tentukan Kelas, Mata Pelajaran (Mapel), dan Materi yang akan dibuat promptnya
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Jenjang Pendidikan & Kelas */}
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
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-center cursor-pointer ${
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
                id="select-kelas"
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

          {/* 3. Mata Pelajaran (Mapel) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="select-mapel" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Mata Pelajaran (Mapel) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomSubject(!isCustomSubject);
                  if (!isCustomSubject) setCustomSubject('');
                }}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                {isCustomSubject ? '← Pilih dari Daftar Mapel' : '+ Ketik Mapel Lain'}
              </button>
            </div>

            {isCustomSubject ? (
              <input
                id="input-mapel-kustom"
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Ketik mata pelajaran Anda (contoh: Kecerdasan Buatan Dasar)..."
                className="w-full px-4 py-2.5 rounded-xl border border-indigo-300 bg-indigo-50/20 text-slate-800 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                autoFocus
              />
            ) : (
              <select
                id="select-mapel"
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
                <span className="text-[10px] text-slate-400 font-medium">Saran Mapel:</span>
                {['Informatika', 'Matematika', 'IPA', 'Bahasa Indonesia', 'Fisika', 'Biologi', 'Kimia', 'IPS', 'PPKn'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      const matched = SUBJECT_OPTIONS.find(s => s.startsWith(item)) || item;
                      setSubject(matched);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
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

          {/* 4. Materi yang Akan Diajarkan */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="input-materi-yang-diajarkan" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Materi yang Akan Diajarkan <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                Materi Pokok Pembelajaran
              </span>
            </div>
            <input
              id="input-materi-yang-diajarkan"
              type="text"
              value={materiDiajarkan}
              onChange={(e) => setMateriDiajarkan(e.target.value)}
              placeholder="Contoh: Struktur Data Graph / Sistem Ekskresi Manusia / Teks LHO"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
            />
            {formErrors.materiDiajarkan && (
              <p className="text-xs text-rose-500 font-medium">{formErrors.materiDiajarkan}</p>
            )}
            <p className="text-[11px] text-slate-500">
              * Tuliskan materi pokok yang akan diajarkan dan dirumuskan ke dalam prompt infografis (misal: <em>Struktur Data Graph</em>, <em>Sistem Ekskresi Manusia</em>, <em>Hukum Newton</em>).
            </p>
          </div>
        </div>

        {/* SECTION B: RINCIAN & CAKUPAN PEMBELAJARAN (STIVIA) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
              B
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Rincian & Cakupan Pembelajaran (STIVIA)
              </h2>
              <p className="text-xs text-slate-500">
                Uraikan bab, tema materi/kegiatan, rangkaian pertemuan, dan batasan wajib cakupan materi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 5. Bab / Teks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="input-bab-teks" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  5. Bab / Teks <span className="text-slate-400 font-normal lowercase">(opsional)</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Bab atau jenis teks
                </span>
              </div>
              <input
                id="input-bab-teks"
                type="text"
                value={bab}
                onChange={(e) => setBab(e.target.value)}
                placeholder="Contoh: Bab 2 / Teks LHO / Unit 1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* 6. Tema Materi / Kegiatan */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="input-tema-kegiatan" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  6. Tema Materi / Kegiatan <span className="text-slate-400 font-normal lowercase">(opsional)</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Tema materi / kegiatan belajar
                </span>
              </div>
              <input
                id="input-tema-kegiatan"
                type="text"
                value={temaKegiatan}
                onChange={(e) => setTemaKegiatan(e.target.value)}
                placeholder="Contoh: Eksplorasi Struktur Data Non-Linear / Praktikum Jaringan / Diskusi Kelompok"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* 7. Informasi Pertemuan (STIVIA 2.2d) */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                7. Rangkaian Pertemuan <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Pilih atau ketik urutan pertemuan belajar
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Pertemuan 1', 'Pertemuan 2', 'Pertemuan 3', 'Pertemuan 4'].map((ptm) => (
                <button
                  key={ptm}
                  type="button"
                  onClick={() => setPertemuan(ptm)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer ${
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
                id="input-pertemuan"
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

          {/* 8. Cakupan Materi */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="textarea-cakupan-materi" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                8. Cakupan Materi (Batas Wajib Pembahasan) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-indigo-600 font-medium">
                Batas utama pembahasan visual & teks
              </span>
            </div>
            <textarea
              id="textarea-cakupan-materi"
              rows={5}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Tuliskan poin-poin materi yang ingin dibahas...&#10;Contoh:&#10;1. Pengantar struktur graph&#10;2. Node (Vertex) dan Edge (Sisi)&#10;3. Graph terarah vs tidak terarah&#10;4. Penerapan navigasi rute dan pertemanan"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm leading-relaxed focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-sans"
            />
            {formErrors.scope && (
              <p className="text-xs text-rose-500">{formErrors.scope}</p>
            )}
            <p className="text-[11px] text-slate-500">
              * Hanya poin-poin yang tertera dalam Cakupan Materi yang akan diintegrasikan secara presisi ke dalam struktur prompt.
            </p>
          </div>

          {/* 9. Catatan Pengguna (Opsional) */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="user-notes-field" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                9. Catatan Pengguna <span className="text-slate-400 font-normal lowercase">(opsional)</span>
              </label>
              <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 border border-indigo-100/80 px-2.5 py-0.5 rounded-md">
                Ikut pada Hasil Generate
              </span>
            </div>
            <textarea
              id="user-notes-field"
              rows={3}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Tuliskan catatan, penekanan topik, instruksi khusus, atau preferensi tambahan...&#10;Contoh: Sertakan analogi rute transportasi kota untuk pemodelan graph, gunakan gaya bahasa interaktif dan mudah dipahami siswa SMA."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm leading-relaxed focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-sans"
            />
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>💡</span>
              <span>Catatan ini akan otomatis disertakan ke dalam parameter data materi untuk analisis Prompt Infografis.</span>
            </p>
          </div>
        </div>

        {/* RINGKASAN DATA PROMPT & TOMBOL SUBMIT */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block">
                Ringkasan Data Materi
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Materi Siap Digenerate Menjadi Prompt Infografis
              </h3>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700 self-start sm:self-auto">
              STIVIA 3.1 Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Materi yang Diajarkan:
              </span>
              <span className="text-sm font-bold text-white block mt-0.5 truncate">
                {materiDiajarkan.trim() || '(Ketik materi yang diajarkan di atas)'}
              </span>
              {temaKegiatan.trim() && (
                <span className="text-[11px] text-indigo-300 block truncate mt-0.5 font-medium">
                  Tema/Kegiatan: {temaKegiatan.trim()}
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Mata Pelajaran (Mapel):
              </span>
              <span className="text-sm font-bold text-emerald-300 block mt-0.5 truncate">
                {isCustomSubject ? (customSubject.trim() || 'Lainnya') : subject}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Jenjang & Kelas:
              </span>
              <span className="text-sm font-bold text-indigo-300 block mt-0.5 truncate">
                {educationLevel} • {grade}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sistem menganalisis data & langsung menghasilkan Prompt Infografis STIVIA.</span>
            </div>

            <button
              id="btn-generate-prompt"
              type="submit"
              disabled={isGenerating}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base shadow-xl transition-all ${
                isGenerating
                  ? 'bg-indigo-400 text-white cursor-not-allowed opacity-80'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-indigo-600/25 cursor-pointer transform hover:-translate-y-0.5 shrink-0'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Menganalisis & Menghasilkan Prompt...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span>GENERATE PROMPT</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* PANEL HASIL KERANGKA BERPIKIR STIVIA (7 TAHAP) */}
      {thinkingResult && (
        <StiviaThinkingPanel thinkingResult={thinkingResult} />
      )}

      {/* HASIL PROMPT INFOGRAFIS KELUARAN (READ-ONLY TEXTAREA & COPY BUTTON) */}
      {generatedPrompt && (
        <div 
          id="prompt-result-section"
          className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300 scroll-mt-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  Hasil Prompt Infografis STIVIA (Siap Digunakan)
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/80">
                  Universal AI Prompt
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Salin teks prompt di bawah ini dan tempelkan langsung ke AI pilihan Anda (ChatGPT, Claude, Gemini, dll).
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                id="btn-regenerate-prompt"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700 shadow-sm"
                title="Regenerate Prompt dengan data materi saat ini"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                id="btn-copy-prompt"
                type="button"
                onClick={handleCopyPrompt}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-900/40'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Prompt Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Area Teks Prompt Read-Only */}
          <div className="relative">
            <textarea
              readOnly
              rows={14}
              value={generatedPrompt}
              className="w-full bg-slate-950/80 text-slate-200 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed focus:outline-hidden select-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
            <div className="flex items-center gap-3">
              <span>Panjang Karakter: {generatedPrompt.length} karakter</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Universal Compatibility ✓</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
