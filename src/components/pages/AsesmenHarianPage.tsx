import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Copy,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Coins,
  ShieldCheck,
  Award,
  Layers,
  Edit3
} from 'lucide-react';
import {
  NavigationTab,
  AssessmentProductContext,
  AssessmentForm,
  FEATURE_COSTS,
  EducationLevel,
  LearningProject,
  ActiveLearningContext,
  ClassSubjectNode,
  ChapterNode,
  MeetingSession
} from '../../types';
import {
  generateAssessmentInstrument,
  formatAssessmentAsPrintableText,
  GeneratedAssessmentInstrument,
  CognitiveLevel
} from '../../services/assessmentEngine';
import { checkCanGenerate, recordGenerateUsage } from '../../services/subscriptionService';
import {
  ProductDataSourceSelector,
  ProductDataSourceMode
} from '../ProductDataSourceSelector';

interface AsesmenHarianPageProps {
  onNavigate?: (tab: NavigationTab) => void;
  assessmentContext?: AssessmentProductContext | null;
  subscriptionSummary?: any;
  onUsageRecorded?: () => void;
  userId?: string;
  onSaveToast?: (msg: string) => void;
  learningProjects?: LearningProject[];
  activeLearningContext?: ActiveLearningContext;
  onSelectMeetingContext?: (
    project: LearningProject,
    classSubject: ClassSubjectNode,
    chapter: ChapterNode,
    meeting: MeetingSession
  ) => void;
}

const DEFAULT_SAMPLE_CONTEXT: AssessmentProductContext = {
  temaKegiatan: 'Memahami Ciri dan Unsur Teks Iklan',
  materiDiajarkan: 'Teks Iklan: Pengertian, Fungsi, dan Ciri Kebahasaan',
  cakupanMateri: 
    '1. Pengertian dan fungsi sosial teks iklan di ruang publik.\n' +
    '2. Karakteristik bahasa persuasif dalam slogan dan kalimat iklan.\n' +
    '3. Tiga struktur utama iklan: Headline, Body Text, dan Call-to-Action (CTA).\n' +
    '4. Analisis komparasi iklan komersial vs iklan layanan masyarakat.',
  learningObjectives: [
    'Peserta didik mampu mendefinisikan hakikat dan fungsi teks iklan dengan tepat.',
    'Peserta didik mampu mengidentifikasi unsur kebahasaan persuasif dalam iklan kontekstual.'
  ],
  educationLevel: 'SMP',
  grade: 'Kelas VIII',
  subject: 'Bahasa Indonesia',
  bab: 'Bab 2: Teks Iklan',
  pertemuan: 'Pertemuan 1',
  assessmentEnabled: true,
  assessmentType: 'Formatif',
  assessmentForms: ['Pilihan Ganda', 'Uraian'],
  assessmentNotes: 'Kuis formatif 5 butir untuk menguji pemahaman konsep awal.',
  sourceMeetingId: 'sample-meeting-1',
  sourceMasterVersion: 1
};

export const AsesmenHarianPage: React.FC<AsesmenHarianPageProps> = ({
  onNavigate,
  assessmentContext,
  subscriptionSummary,
  onUsageRecorded,
  userId,
  onSaveToast,
  learningProjects = [],
  activeLearningContext,
  onSelectMeetingContext
}) => {
  // Pilihan Sumber Data: 'project' atau 'manual'
  const [sourceMode, setSourceMode] = useState<ProductDataSourceMode>(() => {
    return assessmentContext ? 'project' : (learningProjects.length > 0 ? 'project' : 'manual');
  });

  // State untuk Input Manual
  const [manualSubject, setManualSubject] = useState<string>('Bahasa Indonesia');
  const [manualEducationLevel, setManualEducationLevel] = useState<EducationLevel>('SMP');
  const [manualGrade, setManualGrade] = useState<string>('Kelas VIII');
  const [manualBab, setManualBab] = useState<string>('Bab 1: Teks Deskripsi');
  const [manualPertemuan, setManualPertemuan] = useState<string>('Pertemuan 1');
  const [manualMateri, setManualMateri] = useState<string>('Ciri dan Struktur Teks Deskripsi');
  const [manualTema, setManualTema] = useState<string>('Mendeskripsikan Objek di Sekitar');
  const [manualCakupan, setManualCakupan] = useState<string>(
    '1. Pengertian dan tujuan teks deskripsi.\n2. Ciri-ciri kebahasaan teks deskripsi.\n3. Struktur identifikasi dan deskripsi bagian.'
  );

  // Buat context efektif berdasarkan mode yang dipilih
  const effectiveContext: AssessmentProductContext = sourceMode === 'project'
    ? (assessmentContext || DEFAULT_SAMPLE_CONTEXT)
    : {
        temaKegiatan: manualTema,
        materiDiajarkan: manualMateri,
        cakupanMateri: manualCakupan,
        learningObjectives: [
          `Peserta didik mampu memahami ${manualMateri}`,
          `Peserta didik mampu menyelesaikan evaluasi materi ${manualMateri}`
        ],
        educationLevel: manualEducationLevel,
        grade: manualGrade,
        subject: manualSubject,
        bab: manualBab,
        pertemuan: manualPertemuan,
        assessmentEnabled: true,
        assessmentType: 'Formatif',
        assessmentForms: ['Pilihan Ganda', 'Uraian'],
        sourceMeetingId: `manual-harian-${Date.now()}`,
        sourceMasterVersion: 1
      };

  const isUsingSample = sourceMode === 'project' && !assessmentContext;

  // Form State
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [cognitiveLevel, setCognitiveLevel] = useState<CognitiveLevel>('Campuran / Bertingkat (HOTS)');
  const [selectedForms, setSelectedForms] = useState<AssessmentForm[]>(
    effectiveContext.assessmentForms && effectiveContext.assessmentForms.length > 0
      ? effectiveContext.assessmentForms
      : ['Pilihan Ganda', 'Uraian']
  );
  const [includeAnswerKey, setIncludeAnswerKey] = useState<boolean>(true);
  const [includeRubric, setIncludeRubric] = useState<boolean>(true);
  const [timeAllocation, setTimeAllocation] = useState<string>('25 Menit');

  // Generator & View State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedInstrument, setGeneratedInstrument] = useState<GeneratedAssessmentInstrument | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<'preview' | 'keys' | 'prompt'>('preview');
  const [showKeysMap, setShowKeysMap] = useState<Record<string, boolean>>({});

  const availableForms: AssessmentForm[] = [
    'Pilihan Ganda',
    'Benar-Salah',
    'Menjodohkan',
    'Uraian',
    'Praktik'
  ];

  // Auto-generate on first load if context available
  useEffect(() => {
    if (!generatedInstrument) {
      handleGenerateAssessment(true);
    }
  }, [effectiveContext.sourceMeetingId]);

  const toggleForm = (form: AssessmentForm) => {
    if (selectedForms.includes(form)) {
      if (selectedForms.length > 1) {
        setSelectedForms(prev => prev.filter(f => f !== form));
      }
    } else {
      setSelectedForms(prev => [...prev, form]);
    }
  };

  const handleGenerateAssessment = async (isInitial = false) => {
    // Cek saldo jika bukan inisial sampel otomatis
    if (!isInitial && userId) {
      const allowed = await checkCanGenerate(userId, 'assessment');
      if (!allowed) {
        onSaveToast?.('Saldo prompt Anda tidak mencukupi untuk membuat Asesmen Harian (2 Saldo).');
        return;
      }
    }

    setIsGenerating(true);
    try {
      const instrument = generateAssessmentInstrument(effectiveContext, {
        type: 'Formatif',
        questionCount,
        cognitiveLevel,
        forms: selectedForms,
        includeAnswerKey,
        includeRubric,
        timeAllocation
      });

      setGeneratedInstrument(instrument);

      // Potong saldo prompt hanya pada trigger manual pengguna
      if (!isInitial && userId) {
        await recordGenerateUsage(userId, 'assessment');
        onUsageRecorded?.();
      }

      if (!isInitial) {
        onSaveToast?.('Instrumen Asesmen Harian berhasil dibuat!');
      }
    } catch (err) {
      console.error(err);
      onSaveToast?.('Terjadi kesalahan saat merumuskan instrumen asesmen.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (withAnswers = true) => {
    if (!generatedInstrument) return;
    const text = formatAssessmentAsPrintableText(generatedInstrument, withAnswers);
    navigator.clipboard.writeText(text);
    onSaveToast?.('Instrumen asesmen berhasil disalin ke clipboard!');
  };

  const handleCopyPromptAI = () => {
    if (!generatedInstrument) return;
    navigator.clipboard.writeText(generatedInstrument.generatedPromptAI);
    onSaveToast?.('Prompt AI Studio berhasil disalin ke clipboard!');
  };

  const handleDownloadTxt = () => {
    if (!generatedInstrument) return;
    const text = formatAssessmentAsPrintableText(generatedInstrument, true);
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Asesmen_Harian_${effectiveContext.pertemuan.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onSaveToast?.('File instrumen teks berhasil diunduh!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-xs shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-teal-700">
                Asesmen Formatif Harian
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>2 Saldo Prompt</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Asesmen Harian (Formatif)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
              Instrumen evaluasi formatif per pertemuan yang dirumuskan secara terikat dari Master Learning Data (Zero-Hallucination).
            </p>
          </div>
        </div>

        {onNavigate && (
          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              type="button"
              onClick={() => onNavigate('proyek_saya')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Proyek Pembelajaran</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('asesmen_sumatif')}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Asesmen Sumatif</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. PILIHAN SUMBER DATA: PROYEK SAYA ATAU MANUAL */}
      <ProductDataSourceSelector
        currentMode={sourceMode}
        onModeChange={setSourceMode}
        productTitle="Asesmen Harian (Formatif)"
        learningProjects={learningProjects}
        activeContext={activeLearningContext}
        onSelectMeetingContext={onSelectMeetingContext}
        onNavigate={onNavigate}
      />

      {/* 2B. FORM INPUT MANUAL KHUSUS ASESMEN (TAMPIL HANYA JIKA MODE MANUAL) */}
      {sourceMode === 'manual' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-teal-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-900 flex items-center justify-center font-bold text-xs">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Input Data Pembelajaran Manual
              </h2>
              <p className="text-[11px] text-slate-500">
                Tentukan identitas dan materi untuk instrumen asesmen ini secara mandiri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran</label>
              <input
                type="text"
                value={manualSubject}
                onChange={(e) => setManualSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kelas</label>
              <input
                type="text"
                value={manualGrade}
                onChange={(e) => setManualGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Bab / Teks Pokok</label>
              <input
                type="text"
                value={manualBab}
                onChange={(e) => setManualBab(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Pertemuan</label>
              <input
                type="text"
                value={manualPertemuan}
                onChange={(e) => setManualPertemuan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Materi yang Diajarkan</label>
              <input
                type="text"
                value={manualMateri}
                onChange={(e) => setManualMateri(e.target.value)}
                placeholder="Misal: Unsur Intrinsik Cerpen..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tema / Fokus Pembelajaran</label>
              <input
                type="text"
                value={manualTema}
                onChange={(e) => setManualTema(e.target.value)}
                placeholder="Misal: Memahami Alur dan Penokohan..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-xs"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-bold text-slate-700 block mb-1">Cakupan Materi (Batasan Butir Soal)</label>
            <textarea
              rows={3}
              value={manualCakupan}
              onChange={(e) => setManualCakupan(e.target.value)}
              placeholder="Tuliskan butir cakupan yang diuji..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono text-xs"
            />
          </div>
        </div>
      )}

      {/* 2C. Banner Koneksi Master Learning Data (Single Source of Truth) */}
      {sourceMode === 'project' && (
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  📌 Single Source of Learning Truth
                </span>
                <span className="text-xs font-extrabold text-slate-900">
                  {effectiveContext.pertemuan} • {effectiveContext.grade} ({effectiveContext.subject})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bab: <strong className="text-slate-800">{effectiveContext.bab}</strong> &bull; Tema: <strong className="text-slate-800">{effectiveContext.temaKegiatan}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              Versi Master: v{effectiveContext.sourceMasterVersion || 1}
            </span>
            {isUsingSample && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Mode Contoh
              </span>
            )}
          </div>
        </div>

        {/* Master Context Data Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
          <div>
            <span className="font-bold text-slate-700 block">Materi yang Diajarkan:</span>
            <span className="text-slate-900 font-medium">{effectiveContext.materiDiajarkan}</span>
          </div>
          {effectiveContext.cakupanMateri && (
            <div>
              <span className="font-bold text-slate-700 block">Cakupan Materi Pembahasan (Batas Soal):</span>
              <p className="text-slate-600 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                {effectiveContext.cakupanMateri}
              </p>
            </div>
          )}
          {effectiveContext.assessmentNotes && (
            <div className="pt-1 border-t border-slate-200/60 flex items-start gap-1.5 text-teal-900">
              <span className="font-bold text-teal-700 shrink-0">Catatan Asesmen Master:</span>
              <span>{effectiveContext.assessmentNotes}</span>
            </div>
          )}
        </div>
      </div>
      )}

      {/* 3. Panel Kontrol Form & Parameter Evaluasi */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Parameter Instrumen Asesmen Harian</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Penyesuaian kebutuhan kelas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Jumlah Soal */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Jumlah Butir Soal</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white text-xs cursor-pointer"
            >
              <option value={3}>3 Butir (Refleksi Kilat)</option>
              <option value={5}>5 Butir (Standar Formatif Harian)</option>
              <option value={8}>8 Butir (Latihan Intensif)</option>
              <option value={10}>10 Butir (Uji Pemahaman Penuh)</option>
            </select>
          </div>

          {/* Tingkat Kognitif Target */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Tingkat Kognitif (Taksonomi)</label>
            <select
              value={cognitiveLevel}
              onChange={(e) => setCognitiveLevel(e.target.value as CognitiveLevel)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white text-xs cursor-pointer"
            >
              <option value="Campuran / Bertingkat (HOTS)">Campuran Bertingkat (C2 - C4 HOTS)</option>
              <option value="C1-C2 (Mengingat & Memahami)">C1-C2 (Pemahaman Dasar)</option>
              <option value="C3-C4 (Menerapkan & Menganalisis)">C3-C4 (Aplikasi & Analisis)</option>
              <option value="C5-C6 (Mengevaluasi & Berkreasi)">C5-C6 (Kreativitas & Evaluasi)</option>
            </select>
          </div>

          {/* Alokasi Waktu */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Alokasi Waktu Pengerjaan</label>
            <input
              type="text"
              value={timeAllocation}
              onChange={(e) => setTimeAllocation(e.target.value)}
              placeholder="Misal: 20 Menit"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white text-xs"
            />
          </div>
        </div>

        {/* Bentuk Soal */}
        <div className="space-y-2">
          <label className="font-bold text-slate-700 text-xs block">
            Bentuk Soal yang Disertakan:
          </label>
          <div className="flex flex-wrap gap-2">
            {availableForms.map((form) => {
              const isSelected = selectedForms.includes(form);
              return (
                <button
                  key={form}
                  type="button"
                  onClick={() => toggleForm(form)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{form}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tombol Generate */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAnswerKey}
                onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <span className="font-semibold">Kunci Jawaban</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeRubric}
                onChange={(e) => setIncludeRubric(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <span className="font-semibold">Rubrik Penskoran</span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => handleGenerateAssessment(false)}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Merumuskan Soal...' : 'Rumuskan Asesmen Harian (2 Saldo)'}</span>
          </button>
        </div>
      </div>

      {/* 4. Output Hasil Asesmen */}
      {generatedInstrument && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          {/* Header Hasil & Aksi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                Hasil Instrumen Asesmen Siap Pakai
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">
                {generatedInstrument.title}
              </h3>
              <p className="text-xs text-slate-500">
                Total {generatedInstrument.totalQuestions} Butir Soal &bull; Bobot {generatedInstrument.totalPoints} Poin &bull; Alokasi: {generatedInstrument.timeAllocation}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyText(true)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Salin soal beserta kunci jawaban"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Soal & Kunci</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Unduh teks instrumen"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh TXT</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Cetak lembar soal"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak</span>
              </button>
            </div>
          </div>

          {/* Tab Pilihan Tampilan */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => setActiveViewTab('preview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeViewTab === 'preview'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Lembar Soal Siswa ({generatedInstrument.items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab('keys')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeViewTab === 'keys'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Kunci Jawaban & Rubrik
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab('prompt')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeViewTab === 'prompt'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Prompt AI Studio (Anti-Halusinasi)
            </button>
          </div>

          {/* TAB 1: LEMBAR SOAL */}
          {activeViewTab === 'preview' && (
            <div className="space-y-4">
              {/* Petunjuk Pengerjaan */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs space-y-1.5">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                  Petunjuk Pengerjaan:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  {generatedInstrument.instructions.map((ins, idx) => (
                    <li key={idx}>{ins}</li>
                  ))}
                </ol>
              </div>

              {/* Daftar Butir Soal */}
              <div className="space-y-4">
                {generatedInstrument.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 font-black flex items-center justify-center text-xs">
                          {item.number}
                        </span>
                        <span className="font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                          {item.form}
                        </span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {item.cognitiveLevel}
                        </span>
                      </div>
                      <span className="font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        Bobot: {item.point} Poin
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                      {item.questionText}
                    </p>

                    {/* Opsi Pilihan Ganda / Opsi Jawaban */}
                    {item.options && item.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {item.options.map((opt) => (
                          <div
                            key={opt.key}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs flex items-start gap-2 text-slate-800"
                          >
                            <span className="font-bold text-teal-700 w-5 shrink-0">{opt.key}.</span>
                            <span>{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: KUNCI JAWABAN & RUBRIK */}
          {activeViewTab === 'keys' && (
            <div className="space-y-4">
              <div className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-4 text-xs text-teal-900 space-y-1">
                <span className="font-bold block">Pedoman Penskoran:</span>
                <p className="text-teal-800 leading-relaxed">{generatedInstrument.rubricGeneral}</p>
              </div>

              <div className="space-y-3">
                {generatedInstrument.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/40 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">
                        Soal No. {item.number} ({item.form})
                      </span>
                      <span className="font-bold text-teal-700">Kunci: {item.answerKey}</span>
                    </div>
                    <div className="space-y-1 text-slate-600">
                      <p>
                        <strong className="text-slate-700">Pembahasan:</strong> {item.explanation}
                      </p>
                      {item.rubric && (
                        <p>
                          <strong className="text-slate-700">Rubrik:</strong> {item.rubric}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROMPT AI STUDIO */}
          {activeViewTab === 'prompt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Prompt Standar STIVIA (Dapat disalin ke AI Studio atau LLM eksternal)
                </span>
                <button
                  type="button"
                  onClick={handleCopyPromptAI}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Prompt</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96">
                {generatedInstrument.generatedPromptAI}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
