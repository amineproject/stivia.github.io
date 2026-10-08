import React, { useState, useEffect } from 'react';
import {
  Award,
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
  Layers,
  GraduationCap
} from 'lucide-react';
import { NavigationTab, AssessmentProductContext, AssessmentForm, FEATURE_COSTS } from '../../types';
import {
  generateAssessmentInstrument,
  formatAssessmentAsPrintableText,
  GeneratedAssessmentInstrument,
  CognitiveLevel
} from '../../services/assessmentEngine';
import { checkCanGenerate, recordGenerateUsage } from '../../services/subscriptionService';

interface AsesmenSumatifPageProps {
  onNavigate?: (tab: NavigationTab) => void;
  assessmentContext?: AssessmentProductContext | null;
  subscriptionSummary?: any;
  onUsageRecorded?: () => void;
  userId?: string;
  onSaveToast?: (msg: string) => void;
}

const DEFAULT_SAMPLE_CONTEXT: AssessmentProductContext = {
  temaKegiatan: 'Evaluasi Komprehensif Bab Teks Iklan',
  materiDiajarkan: 'Teks Iklan: Kaidah, Struktur, Bahasa Persuasif, dan Produksi Karya',
  cakupanMateri: 
    '1. Definisi, fungsi sosial, dan tipologi teks iklan komersial vs layanan masyarakat.\n' +
    '2. Karakteristik kebahasaan persuasif: slogan, imperatif, ringkas, dan sugestif.\n' +
    '3. Anatomi struktural iklan visual dan audio-visual: Judul (Headline), Isi (Body Copy), dan CTA.\n' +
    '4. Prosedur penyuntingan dan finalisasi naskah iklan berbasis etika periklanan.',
  learningObjectives: [
    'Peserta didik mampu menganalisis struktur dan kaidah kebahasaan berbagai jenis teks iklan secara kritis.',
    'Peserta didik mampu merumuskan naskah iklan persuasif yang solutif terhadap isu kontekstual.'
  ],
  educationLevel: 'SMP',
  grade: 'Kelas VIII',
  subject: 'Bahasa Indonesia',
  bab: 'Bab 2: Teks Iklan',
  pertemuan: 'Evaluasi Sumatif Bab',
  assessmentEnabled: true,
  assessmentType: 'Sumatif',
  assessmentForms: ['Pilihan Ganda', 'Uraian'],
  assessmentNotes: 'Asesmen sumatif akhir bab untuk mengukur ketuntasan KKTP seluruh peserta didik.',
  sourceMeetingId: 'sample-sumatif-meeting',
  sourceMasterVersion: 1
};

export const AsesmenSumatifPage: React.FC<AsesmenSumatifPageProps> = ({
  onNavigate,
  assessmentContext,
  subscriptionSummary,
  onUsageRecorded,
  userId,
  onSaveToast
}) => {
  const activeContext = assessmentContext || DEFAULT_SAMPLE_CONTEXT;
  const isUsingSample = !assessmentContext;

  // Form State
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [cognitiveLevel, setCognitiveLevel] = useState<CognitiveLevel>('Campuran / Bertingkat (HOTS)');
  const [selectedForms, setSelectedForms] = useState<AssessmentForm[]>([
    'Pilihan Ganda',
    'Menjodohkan',
    'Uraian'
  ]);
  const [includeAnswerKey, setIncludeAnswerKey] = useState<boolean>(true);
  const [includeRubric, setIncludeRubric] = useState<boolean>(true);
  const [timeAllocation, setTimeAllocation] = useState<string>('60 - 80 Menit');

  // Generator & View State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedInstrument, setGeneratedInstrument] = useState<GeneratedAssessmentInstrument | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<'preview' | 'keys' | 'prompt'>('preview');

  const availableForms: AssessmentForm[] = [
    'Pilihan Ganda',
    'Benar-Salah',
    'Menjodohkan',
    'Uraian',
    'Praktik',
    'Proyek'
  ];

  useEffect(() => {
    if (!generatedInstrument) {
      handleGenerateAssessment(true);
    }
  }, [activeContext.sourceMeetingId]);

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
    if (!isInitial && userId) {
      const allowed = await checkCanGenerate(userId, 'assessment_sumatif');
      if (!allowed) {
        onSaveToast?.('Saldo prompt Anda tidak mencukupi untuk membuat Asesmen Sumatif (3 Saldo).');
        return;
      }
    }

    setIsGenerating(true);
    try {
      const instrument = generateAssessmentInstrument(activeContext, {
        type: 'Sumatif',
        questionCount,
        cognitiveLevel,
        forms: selectedForms,
        includeAnswerKey,
        includeRubric,
        timeAllocation
      });

      setGeneratedInstrument(instrument);

      if (!isInitial && userId) {
        await recordGenerateUsage(userId, 'assessment_sumatif');
        onUsageRecorded?.();
      }

      if (!isInitial) {
        onSaveToast?.('Instrumen Asesmen Sumatif berhasil dibuat murni dari Master Data!');
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
    onSaveToast?.('Instrumen asesmen sumatif berhasil disalin ke clipboard!');
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
    element.download = `Asesmen_Sumatif_${activeContext.bab.replace(/\s+/g, '_')}.txt`;
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
          <div className="w-13 h-13 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-purple-700">
                Asesmen Sumatif Bab
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>3 Saldo Prompt</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Asesmen Sumatif (Evaluasi Capaian Bab)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
              Instrumen evaluasi capaian akhir bab, rubrik KKTP, dan pembobotan nilai komprehensif terikat Master Learning Data.
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
              onClick={() => onNavigate('asesmen_harian')}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Asesmen Harian</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Banner Koneksi Master Learning Data (Single Source of Truth) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  📌 Single Source of Learning Truth
                </span>
                <span className="text-xs font-extrabold text-slate-900">
                  {activeContext.bab} • {activeContext.grade} ({activeContext.subject})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi Penutup Unit &bull; Posisi: <strong className="text-slate-800">{activeContext.pertemuan}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              Versi Master: v{activeContext.sourceMasterVersion || 1}
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
            <span className="font-bold text-slate-700 block">Materi yang Diuji:</span>
            <span className="text-slate-900 font-medium">{activeContext.materiDiajarkan}</span>
          </div>
          {activeContext.cakupanMateri && (
            <div>
              <span className="font-bold text-slate-700 block">Cakupan Materi Pembahasan (Batas Soal):</span>
              <p className="text-slate-600 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                {activeContext.cakupanMateri}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Panel Kontrol Form & Parameter Evaluasi Sumatif */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Parameter Instrumen Evaluasi Sumatif</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Penyesuaian kebutuhan ujian / akhir bab
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
              <option value={8}>8 Butir (Ringkas)</option>
              <option value={10}>10 Butir (Standar Sumatif Bab)</option>
              <option value={15}>15 Butir (Komprehensif)</option>
              <option value={20}>20 Butir (Ujian Akhir Unit)</option>
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
              <option value="Campuran / Bertingkat (HOTS)">Campuran Bertingkat (C2 - C5 HOTS)</option>
              <option value="C3-C4 (Menerapkan & Menganalisis)">Fokus Aplikasi & Analisis (C3-C4)</option>
              <option value="C5-C6 (Mengevaluasi & Berkreasi)">Fokus Evaluasi & Kreasi Solusi (C5-C6)</option>
              <option value="C1-C2 (Mengingat & Memahami)">Fokus Retensi & Pemahaman Konseptual</option>
            </select>
          </div>

          {/* Alokasi Waktu */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Alokasi Waktu Pengerjaan</label>
            <input
              type="text"
              value={timeAllocation}
              onChange={(e) => setTimeAllocation(e.target.value)}
              placeholder="Misal: 60 - 80 Menit"
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
                      ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
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
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span className="font-semibold">Kunci Jawaban</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeRubric}
                onChange={(e) => setIncludeRubric(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span className="font-semibold">Rubrik Penskoran & KKTP</span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => handleGenerateAssessment(false)}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Merumuskan Evaluasi...' : 'Rumuskan Asesmen Sumatif (3 Saldo)'}</span>
          </button>
        </div>
      </div>

      {/* 4. Output Hasil Asesmen Sumatif */}
      {generatedInstrument && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          {/* Header Hasil & Aksi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Hasil Instrumen Sumatif Siap Pakai
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
                title="Cetak lembar evaluasi"
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
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Lembar Evaluasi Siswa ({generatedInstrument.items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab('keys')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeViewTab === 'keys'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Kunci Jawaban & Rubrik KKTP
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab('prompt')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeViewTab === 'prompt'
                  ? 'bg-purple-600 text-white shadow-xs'
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
                  Petunjuk Evaluasi Sumatif:
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
                        <span className="w-6 h-6 rounded-lg bg-purple-50 text-purple-700 font-black flex items-center justify-center text-xs">
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

                    {/* Opsi Jawaban */}
                    {item.options && item.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {item.options.map((opt) => (
                          <div
                            key={opt.key}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs flex items-start gap-2 text-slate-800"
                          >
                            <span className="font-bold text-purple-700 w-5 shrink-0">{opt.key}.</span>
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

          {/* TAB 2: KUNCI JAWABAN & RUBRIK KKTP */}
          {activeViewTab === 'keys' && (
            <div className="space-y-4">
              <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 text-xs text-purple-900 space-y-1">
                <span className="font-bold block">Pedoman Konversi Nilai & KKTP:</span>
                <p className="text-purple-800 leading-relaxed">{generatedInstrument.rubricGeneral}</p>
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
                      <span className="font-bold text-purple-700">Kunci: {item.answerKey}</span>
                    </div>
                    <div className="space-y-1 text-slate-600">
                      <p>
                        <strong className="text-slate-700">Pembahasan:</strong> {item.explanation}
                      </p>
                      {item.rubric && (
                        <p>
                          <strong className="text-slate-700">Rubrik Skor:</strong> {item.rubric}
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
                  Prompt Standar Evaluasi Sumatif (Zero-Hallucination)
                </span>
                <button
                  type="button"
                  onClick={handleCopyPromptAI}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
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
