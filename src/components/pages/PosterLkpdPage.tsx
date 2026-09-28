import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  FileText,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Loader2,
  Check,
  Copy,
  Printer,
  Clock,
  Target,
  PenTool,
  AlertTriangle,
  Info,
  CheckCircle2,
  Coins,
  MessageCircle,
  X,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Palette,
  Image as ImageIcon,
  Layers,
  ChevronRight,
  HelpCircle,
  Save,
  CheckSquare
} from 'lucide-react';
import {
  EducationLevel,
  InfographicDraft,
  NavigationTab,
  SubscriptionSummary,
  PROMPT_PACKAGES
} from '../../types';
import {
  LkpdStimulusType,
  LkpdStimulusSource,
  LkpdActivityCategory,
  LkpdQuestionType,
  LkpdDifficultyComposition,
  LkpdBlueprintDesign,
  GeneratedLkpdDocument,
  PosterLkpdPageLayout,
  ALL_LKPD_ACTIVITY_CATEGORIES,
  ALL_LKPD_QUESTION_TYPES,
  ALL_LKPD_STIMULUS_TYPES,
  recommendLkpdComposition,
  checkTimeAllocationWarning,
  generateLkpdFromBlueprint,
  generatePosterPagesFromLkpd,
  buildUniversalPosterPromptFromLkpd,
  LkpdPaperSize,
  LkpdOrientation,
  LkpdVisualStyle
} from '../../services/lkpdEngine';
import { suggestLearningObjectives } from '../../services/stiviaThinkingFramework';
import { checkCanGenerate, recordGenerateUsage } from '../../services/subscriptionService';
import { getWhatsAppTopUpUrl } from '../../lib/whatsapp';

interface PosterLkpdPageProps {
  projects: InfographicDraft[];
  currentDraft: InfographicDraft;
  onSelectProject: (draft: InfographicDraft) => void;
  onSubmitForm: (draft: InfographicDraft) => void;
  onLoadSampleData: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  userId?: string;
  subscriptionSummary?: SubscriptionSummary | null;
  onUsageRecorded?: () => void;
}

export const PosterLkpdPage: React.FC<PosterLkpdPageProps> = ({
  currentDraft,
  onSubmitForm,
  onNavigate,
  userId,
  subscriptionSummary,
  onUsageRecorded
}) => {
  // ==========================================================================
  // STEPPER PROGRESSIF:
  // 'blueprint' -> Rancang Struktur LKPD
  // 'review_doc' -> Review & Edit Dokumen LKPD Terstruktur
  // 'poster_final' -> Poster LKPD Visual (Output Akhir Utama)
  // ==========================================================================
  const [activeStep, setActiveStep] = useState<'blueprint' | 'review_doc' | 'poster_final'>('blueprint');

  // 1. Identitas LKPD
  const [title, setTitle] = useState<string>(
    currentDraft.title && !currentDraft.title.includes('Draft') 
      ? currentDraft.title 
      : `LEMBAR KERJA PESERTA DIDIK: ${(currentDraft.rawTopic || 'STRUKTUR DATA GRAPH').toUpperCase()}`
  );
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(currentDraft.educationLevel || 'SMA');
  const [grade, setGrade] = useState<string>(currentDraft.grade || 'Kelas X');
  const [subject, setSubject] = useState<string>(currentDraft.subject || 'Informatika');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [isCustomSubject, setIsCustomSubject] = useState<boolean>(false);
  const [materi, setMateri] = useState<string>(currentDraft.rawTopic || 'Struktur Data Graph');
  const [subTopic, setSubTopic] = useState<string>(currentDraft.bab || 'Representasi Simpul & Sisi Terarah');
  const [timeAllocation, setTimeAllocation] = useState<string>('40 menit');

  // 2. Tujuan Pembelajaran
  const [learningObjectives, setLearningObjectives] = useState<string[]>(() => {
    if (currentDraft.learningObjectivesList && currentDraft.learningObjectivesList.length > 0) {
      return currentDraft.learningObjectivesList;
    }
    return [
      'Memahami definisi, karakteristik, dan terminologi dasar materi secara tepat.',
      'Menganalisis hubungan antar-elemen konsep materi berdasarkan stimulus yang disajikan.',
      'Mengevaluasi dan merumuskan solusi atau simpulan kritis secara mandiri maupun kolaboratif.'
    ];
  });
  const [newObjectiveInput, setNewObjectiveInput] = useState<string>('');
  const [isSuggestingObjectives, setIsSuggestingObjectives] = useState<boolean>(false);

  // 3. Stimulus Pembelajaran
  const [stimulusType, setStimulusType] = useState<LkpdStimulusType>('Teks + Ilustrasi');
  const [stimulusSource, setStimulusSource] = useState<LkpdStimulusSource>('ai_generated');
  const [userStimulusText, setUserStimulusText] = useState<string>('');

  // 4. Komposisi Aktivitas (Kategori Kognitif dengan Jumlah)
  const [activityComposition, setActivityComposition] = useState<{ category: LkpdActivityCategory; count: number }[]>([
    { category: 'Memahami', count: 2 },
    { category: 'Mengidentifikasi', count: 2 },
    { category: 'Menganalisis', count: 2 },
    { category: 'Mengevaluasi', count: 1 },
    { category: 'Refleksi', count: 1 }
  ]);

  // 5. Jenis Soal / Respons Siswa
  const [questionTypes, setQuestionTypes] = useState<{ type: LkpdQuestionType; count: number }[]>([
    { type: 'Pilihan Ganda', count: 3 },
    { type: 'Isian Singkat', count: 2 },
    { type: 'Uraian', count: 2 },
    { type: 'Refleksi', count: 1 }
  ]);

  // 6. Tingkat Kesulitan
  const [difficultyMode, setDifficultyMode] = useState<'ai' | 'manual'>('ai');
  const [diffMudah, setDiffMudah] = useState<number>(30);
  const [diffSedang, setDiffSedang] = useState<number>(50);
  const [diffHots, setDiffHots] = useState<number>(20);

  // 7. Pengaturan Desain Poster Visual
  const [posterPaperSize, setPosterPaperSize] = useState<LkpdPaperSize>('A4');
  const [posterOrientation, setPosterOrientation] = useState<LkpdOrientation>('Portrait');
  const [posterVisualStyle, setPosterVisualStyle] = useState<LkpdVisualStyle>('Modern Edukatif');
  const [activePosterPageIndex, setActivePosterPageIndex] = useState<number>(0);

  // Status Eksekusi & Modal
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedLkpdDocument | null>(null);
  const [generatedPosterPages, setGeneratedPosterPages] = useState<PosterLkpdPageLayout[]>([]);
  const [universalPrompt, setUniversalPrompt] = useState<string>('');
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [limitReason, setLimitReason] = useState<string>('');

  // Edit Mode untuk Review Dokumen
  const [isEditingDoc, setIsEditingDoc] = useState<boolean>(false);

  // ==========================================================================
  // KALKULASI TOTAL RESPON & VALIDASI WAKTU
  // ==========================================================================
  const totalActivityCount = activityComposition.reduce((sum, a) => sum + a.count, 0);
  const totalQuestionCount = questionTypes.reduce((sum, q) => sum + q.count, 0);
  const effectiveTotalResponses = Math.max(totalActivityCount, totalQuestionCount);
  const timeWarning = checkTimeAllocationWarning(timeAllocation, effectiveTotalResponses);

  // ==========================================================================
  // SINKRONISASI MATERI AWAL DARI DRAFT
  // ==========================================================================
  useEffect(() => {
    if (currentDraft) {
      if (currentDraft.title && !currentDraft.title.includes('Draft')) setTitle(currentDraft.title);
      if (currentDraft.educationLevel) setEducationLevel(currentDraft.educationLevel);
      if (currentDraft.grade) setGrade(currentDraft.grade);
      if (currentDraft.subject) setSubject(currentDraft.subject);
      if (currentDraft.rawTopic) setMateri(currentDraft.rawTopic);
      if (currentDraft.bab) setSubTopic(currentDraft.bab);
    }
  }, [currentDraft]);

  // ==========================================================================
  // HANDLERS: REKOMENDASI STIVIA & OBJECTIVES
  // ==========================================================================
  const handleApplyStiviaRecommendation = () => {
    const activeSubj = isCustomSubject ? customSubject : subject;
    const rec = recommendLkpdComposition(timeAllocation, educationLevel, grade, activeSubj);
    setActivityComposition(rec.recommendedActivities);
    setQuestionTypes(rec.recommendedQuestionTypes);
    setDifficultyMode(rec.difficulty.mode);
    setDiffMudah(rec.difficulty.mudah);
    setDiffSedang(rec.difficulty.sedang);
    setDiffHots(rec.difficulty.hots);

    setCopyToast(`✨ Rekomendasi STIVIA (${rec.totalResponses} respon untuk ${timeAllocation}) diterapkan!`);
    setTimeout(() => setCopyToast(null), 3000);
  };

  const handleSuggestObjectives = () => {
    setIsSuggestingObjectives(true);
    setTimeout(() => {
      const activeSubj = isCustomSubject ? customSubject : subject;
      const suggestions = suggestLearningObjectives(activeSubj, materi, subTopic || materi);
      if (suggestions && suggestions.length > 0) {
        setLearningObjectives(suggestions);
        setCopyToast('✨ 3 Tujuan Pembelajaran berhasil diselaraskan oleh AI!');
      }
      setIsSuggestingObjectives(false);
      setTimeout(() => setCopyToast(null), 3000);
    }, 450);
  };

  const handleAddObjective = () => {
    const trimmed = newObjectiveInput.trim();
    if (!trimmed) return;
    setLearningObjectives(prev => [...prev, trimmed]);
    setNewObjectiveInput('');
  };

  const handleRemoveObjective = (index: number) => {
    if (learningObjectives.length <= 1) {
      setCopyToast('Minimal harus ada 1 tujuan pembelajaran.');
      setTimeout(() => setCopyToast(null), 2000);
      return;
    }
    setLearningObjectives(prev => prev.filter((_, i) => i !== index));
  };

  // Activity Counter Helper
  const handleUpdateActivityCount = (category: LkpdActivityCategory, delta: number) => {
    setActivityComposition(prev => {
      const exists = prev.find(a => a.category === category);
      if (!exists) {
        if (delta > 0) return [...prev, { category, count: delta }];
        return prev;
      }
      return prev.map(a => {
        if (a.category === category) {
          const nextCount = Math.max(0, a.count + delta);
          return { ...a, count: nextCount };
        }
        return a;
      }).filter(a => a.count > 0);
    });
  };

  // Question Type Counter Helper
  const handleUpdateQuestionCount = (type: LkpdQuestionType, delta: number) => {
    setQuestionTypes(prev => {
      const exists = prev.find(q => q.type === type);
      if (!exists) {
        if (delta > 0) return [...prev, { type, count: delta }];
        return prev;
      }
      return prev.map(q => {
        if (q.type === type) {
          const nextCount = Math.max(0, q.count + delta);
          return { ...q, count: nextCount };
        }
        return q;
      }).filter(q => q.count > 0);
    });
  };

  // ==========================================================================
  // VALIDASI FORM RANCANGAN SEBELUM GENERATE
  // ==========================================================================
  const validateBlueprint = (): boolean => {
    const errors: Record<string, string> = {};
    if (!materi.trim()) errors.materi = 'Materi pokok pembelajaran wajib diisi.';
    if (learningObjectives.length === 0) errors.objectives = 'Minimal 1 tujuan pembelajaran harus tersedia.';
    if (stimulusSource === 'user_manual' && stimulusType !== 'Tanpa Stimulus' && userStimulusText.trim().length < 10) {
      errors.userStimulus = 'Silakan tuliskan naskah atau data stimulus pembelajaran Anda (minimal 10 karakter).';
    }
    if (activityComposition.filter(a => a.count > 0).length === 0) {
      errors.activities = 'Minimal harus memilih 1 aktivitas pembelajaran.';
    }
    if (questionTypes.filter(q => q.count > 0).length === 0) {
      errors.questions = 'Minimal harus menentukan 1 jenis pertanyaan/tugas.';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      setCopyToast(`Mohon periksa: ${errors[firstKey]}`);
      setTimeout(() => setCopyToast(null), 3000);
      return false;
    }
    return true;
  };

  // ==========================================================================
  // EKSEKUSI GENERATE LKPD (INTEGRITAS SALDO & PEDAGOGIK)
  // ==========================================================================
  const executeGenerateLkpd = async () => {
    if (!validateBlueprint()) return;

    if (userId) {
      const check = await checkCanGenerate(userId);
      if (!check.allowed) {
        setLimitReason(check.reason || 'Saldo koin tidak mencukupi.');
        setShowLimitModal(true);
        return;
      }
    }

    setIsGenerating(true);

    try {
      const activeSubj = isCustomSubject ? customSubject : subject;
      const blueprint: LkpdBlueprintDesign = {
        id: `lkpd-${Date.now()}`,
        title: title.trim() || `LEMBAR KERJA PESERTA DIDIK: ${materi.toUpperCase()}`,
        subject: activeSubj,
        educationLevel,
        grade,
        materi,
        subTopic,
        timeAllocation,
        learningObjectives,
        stimulusType,
        stimulusSource,
        userStimulusText: stimulusSource === 'user_manual' ? userStimulusText : undefined,
        activityComposition: activityComposition.filter(a => a.count > 0),
        questionTypes: questionTypes.filter(q => q.count > 0),
        difficultyComposition: {
          mudah: diffMudah,
          sedang: diffSedang,
          hots: diffHots,
          mode: difficultyMode
        },
        totalResponses: effectiveTotalResponses
      };

      // 1. Eksekusi Analisis & Generate Dokumen LKPD
      const generatedDoc = generateLkpdFromBlueprint(blueprint);
      setGeneratedDocument(generatedDoc);

      // 2. Potong saldo atomik di Supabase jika terautentikasi
      if (userId) {
        const usageSuccess = await recordGenerateUsage(userId);
        if (!usageSuccess) {
          throw new Error('Gagal mencatat penggunaan saldo.');
        }
        if (onUsageRecorded) onUsageRecorded();
      }

      // 3. Masuk ke Step Review Dokumen LKPD
      setActiveStep('review_doc');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCopyToast('✨ LKPD Pembelajaran berhasil dirancang sesuai stimulus!');
      setTimeout(() => setCopyToast(null), 3000);
    } catch (err: any) {
      setLimitReason(err?.message || 'Terjadi kendala teknis saat memproses LKPD.');
      setShowLimitModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // ==========================================================================
  // HANDLER MASUK KE TAHAP POSTER LKPD FINAL (OUTPUT UTAMA)
  // ==========================================================================
  const handleProceedToPosterFinal = () => {
    if (!generatedDocument) return;

    // Susun lembar poster (Page 1 & Page 2 jika panjang)
    const pages = generatePosterPagesFromLkpd(generatedDocument, posterPaperSize, posterOrientation);
    setGeneratedPosterPages(pages);
    setActivePosterPageIndex(0);

    // Susun Universal Prompt Poster LKPD untuk AI Image Generator
    const prompt = buildUniversalPosterPromptFromLkpd(generatedDocument, {
      paperSize: posterPaperSize,
      orientation: posterOrientation,
      visualStyle: posterVisualStyle
    });
    setUniversalPrompt(prompt);

    setActiveStep('poster_final');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCopyToast('🎨 Rancangan Poster LKPD Visual siap ditampilkan & dicetak!');
    setTimeout(() => setCopyToast(null), 3000);
  };

  // Action Helpers
  const handleCopyPrompt = () => {
    if (!universalPrompt) return;
    navigator.clipboard.writeText(universalPrompt);
    setCopyToast('📋 Universal Poster Prompt berhasil disalin ke clipboard!');
    setTimeout(() => setCopyToast(null), 2500);
  };

  const handlePrintPoster = () => {
    window.print();
  };

  const handleSaveDraftProject = () => {
    if (!generatedDocument) return;
    const activeSubj = isCustomSubject ? customSubject : subject;
    const updatedDraft: InfographicDraft = {
      ...currentDraft,
      id: currentDraft.id || `proj-lkpd-${Date.now()}`,
      title: generatedDocument.title,
      educationLevel,
      grade,
      subject: activeSubj,
      rawTopic: materi,
      bab: subTopic,
      learningObjective: learningObjectives[0] || '',
      learningObjectivesList: learningObjectives,
      stiviaPrompt: universalPrompt,
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    onSubmitForm(updatedDraft);
    setCopyToast('💾 Proyek Poster LKPD berhasil disimpan ke riwayat!');
    setTimeout(() => setCopyToast(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ====================================================================== */}
      {/* HEADER BREADCRUMB & PROGRESS STEPPER */}
      {/* ====================================================================== */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <span className="px-2 py-0.5 rounded bg-emerald-100 font-bold">Studio Konten</span>
              <span>/</span>
              <span>Poster LKPD</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Lembar Kerja Peserta Didik (Poster LKPD)</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                STIVIA v3.2
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Rancang LKPD berbasis stimulus kontekstual nyata, aktivitas kognitif bertingkat, dan hasilkan output akhir berupa <strong>Poster LKPD Visual siap pakai</strong>.
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-center">
            <button
              type="button"
              onClick={() => setActiveStep('blueprint')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStep === 'blueprint'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>1. Rancang LKPD</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              type="button"
              onClick={() => generatedDocument && setActiveStep('review_doc')}
              disabled={!generatedDocument}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                !generatedDocument ? 'opacity-40 cursor-not-allowed text-slate-400' : 'cursor-pointer'
              } ${
                activeStep === 'review_doc'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Review LKPD</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              type="button"
              onClick={() => generatedPosterPages.length > 0 && setActiveStep('poster_final')}
              disabled={generatedPosterPages.length === 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                generatedPosterPages.length === 0 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'cursor-pointer'
              } ${
                activeStep === 'poster_final'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>3. 🎨 Poster LKPD</span>
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* TAHAP 1: RANCANG STRUKTUR LKPD (BLUEPRINT DESIGN) */}
      {/* ====================================================================== */}
      {activeStep === 'blueprint' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* A. IDENTITAS LKPD */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                  Identitas LKPD & Alokasi Waktu
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Single Source of Truth</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Judul LKPD */}
              <div className="sm:col-span-2 md:col-span-3 space-y-1">
                <label className="block text-xs font-bold text-slate-700">Judul LKPD</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: LEMBAR KERJA PESERTA DIDIK: ANALISIS STRUKTUR DATA GRAPH"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800"
                />
              </div>

              {/* Jenjang */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Jenjang Pendidikan</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800 font-medium"
                >
                  <option value="SD">SD (Pendidikan Dasar)</option>
                  <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                  <option value="SMK">SMK (Kejuruan)</option>
                </select>
              </div>

              {/* Kelas */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Kelas / Fase</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Contoh: Kelas X (Fase E)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800"
                />
              </div>

              {/* Alokasi Waktu */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Alokasi Waktu</span>
                  <Clock className="w-3 h-3 text-emerald-600" />
                </label>
                <select
                  value={timeAllocation}
                  onChange={(e) => setTimeAllocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800 font-medium"
                >
                  <option value="20 menit">20 menit (Aktivitas Ringkas / Kuis)</option>
                  <option value="30 menit">30 menit (Standar 1 Pertemuan)</option>
                  <option value="40 menit">40 menit (1 Jam Pelajaran Ideal)</option>
                  <option value="60 menit">60 menit (Eksplorasi Mendalam)</option>
                  <option value="80 menit">80 menit (2 Jam Pelajaran Blok)</option>
                  <option value="90 menit">90 menit (Proyek & Diskusi Tim)</option>
                </select>
              </div>

              {/* Mata Pelajaran */}
              <div className="space-y-1 sm:col-span-2 md:col-span-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">Mata Pelajaran</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomSubject(!isCustomSubject)}
                    className="text-[10px] text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    {isCustomSubject ? 'Pilih dari Daftar' : '+ Mapel Lain'}
                  </button>
                </div>
                {isCustomSubject ? (
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Ketik nama mata pelajaran khusus..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/40 text-slate-800"
                  />
                ) : (
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800 font-medium"
                  >
                    <option value="Informatika">Informatika</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                    <option value="Matematika">Matematika</option>
                    <option value="IPA">Ilmu Pengetahuan Alam (IPA)</option>
                    <option value="IPS">Ilmu Pengetahuan Sosial (IPS)</option>
                    <option value="Biologi">Biologi</option>
                    <option value="Fisika">Fisika</option>
                    <option value="Kimia">Kimia</option>
                    <option value="Sejarah">Sejarah</option>
                    <option value="Pendidikan Pancasila">Pendidikan Pancasila / PKn</option>
                    <option value="Pendidikan Agama">Pendidikan Agama</option>
                    <option value="Seni Budaya">Seni Budaya & Prakarya</option>
                    <option value="PJOK">PJOK (Olahraga)</option>
                  </select>
                )}
              </div>

              {/* Materi Pokok */}
              <div className="space-y-1 sm:col-span-1 md:col-span-1">
                <label className="block text-xs font-bold text-slate-700">Materi Pokok / Tema</label>
                <input
                  type="text"
                  value={materi}
                  onChange={(e) => setMateri(e.target.value)}
                  placeholder="Contoh: Struktur Data Graph, Teks Iklan, dll."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800 font-medium"
                />
              </div>

              {/* Subtopik / Bab */}
              <div className="space-y-1 sm:col-span-1 md:col-span-1">
                <label className="block text-xs font-bold text-slate-700">Bab / Subtopik Spesifik</label>
                <input
                  type="text"
                  value={subTopic}
                  onChange={(e) => setSubTopic(e.target.value)}
                  placeholder="Contoh: Simpul & Sisi Berbobot"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* B. TUJUAN PEMBELAJARAN (PEDAGOGIK BASIS) */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Tujuan Pembelajaran (Pedagogik Basis)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    AI menggunakan tujuan pembelajaran sebagai jangkar penyusunan stimulus, tingkat kognitif, dan pertanyaan.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSuggestObjectives}
                disabled={isSuggestingObjectives}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                {isSuggestingObjectives ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
                <span>✨ Rekomendasikan TP Otomatis</span>
              </button>
            </div>

            {/* List Tujuan Pembelajaran */}
            <div className="space-y-2">
              {learningObjectives.map((obj, index) => (
                <div key={index} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLearningObjectives(prev => prev.map((item, i) => i === index ? val : item));
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(index)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    title="Hapus tujuan ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Tambah TP Manual */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newObjectiveInput}
                onChange={(e) => setNewObjectiveInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddObjective();
                  }
                }}
                placeholder="Tambahkan tujuan pembelajaran spesifik lainnya..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-3 py-2 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah TP</span>
              </button>
            </div>
          </div>

          {/* C. STIMULUS PEMBELAJARAN (JANGKAR UTAMA SOAL) */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  C
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Stimulus Pembelajaran (Pemantik Soal)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Satu stimulus menjadi dasar utama bagi seluruh aktivitas dan pertanyaan berantai.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setStimulusSource('ai_generated')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    stimulusSource === 'ai_generated'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✨ AI STIVIA Buatkan
                </button>
                <button
                  type="button"
                  onClick={() => setStimulusSource('user_manual')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    stimulusSource === 'user_manual'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✏️ Masukkan Sendiri
                </button>
              </div>
            </div>

            {/* Pilihan Jenis Stimulus */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Pilih Format / Jenis Stimulus</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_LKPD_STIMULUS_TYPES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStimulusType(st.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      stimulusType === st.id
                        ? 'bg-emerald-50/90 border-emerald-600 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <span>{st.icon}</span>
                        <span>{st.label}</span>
                      </span>
                      {stimulusType === st.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{st.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Stimulus Mandiri jika dipilih user_manual */}
            {stimulusSource === 'user_manual' && stimulusType !== 'Tanpa Stimulus' && (
              <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-emerald-800">
                  Naskah / Data Stimulus Mandiri Guru (AI tidak akan merombak isi):
                </label>
                <textarea
                  rows={4}
                  value={userStimulusText}
                  onChange={(e) => setUserStimulusText(e.target.value)}
                  placeholder="Ketik atau tempelkan teks wacana, berita, iklan, kasus nyata, atau tabel angka yang ingin dijadikan acuan pengerjaan siswa..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800 leading-relaxed font-sans"
                />
              </div>
            )}

            {/* Petunjuk Karakteristik Stimulus Berdasarkan Mapel */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Karakteristik Stimulus Mapel {isCustomSubject ? customSubject : subject}:</strong> STIVIA akan menyesuaikan stimulus secara otomatis sesuai psikologi perkembangan usia siswa {educationLevel} {grade}, menghubungkan teori dengan masalah kontekstual nyata.
              </p>
            </div>
          </div>

          {/* D. KOMPOSISI AKTIVITAS LKPD */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  D
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Komposisi Aktivitas LKPD (Kognitif Bertingkat)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Bukan sekadar jumlah soal, tentukan tahapan proses berpikir siswa terhadap stimulus.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyStiviaRecommendation}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Rekomendasi STIVIA ({timeAllocation})</span>
              </button>
            </div>

            {/* Grid Aktivitas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {ALL_LKPD_ACTIVITY_CATEGORIES.map((cat) => {
                const current = activityComposition.find(a => a.category === cat);
                const count = current ? current.count : 0;
                return (
                  <div
                    key={cat}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                      count > 0
                        ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs truncate mr-1">{cat}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateActivityCount(cat, -1)}
                        className="w-5 h-5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Kurangi"
                      >
                        -
                      </button>
                      <span className={`w-5 text-center text-xs font-bold ${count > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateActivityCount(cat, 1)}
                        className="w-5 h-5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Tambah"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* E. JENIS PERTANYAAN / SOAL */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  E
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Bentuk & Jenis Pertanyaan / Tugas
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Pilih variasi format respon yang harus dikerjakan siswa di lembar poster.
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Total Soal: {totalQuestionCount}
              </span>
            </div>

            {/* Grid Jenis Soal */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {ALL_LKPD_QUESTION_TYPES.map((qt) => {
                const current = questionTypes.find(q => q.type === qt);
                const count = current ? current.count : 0;
                return (
                  <div
                    key={qt}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                      count > 0
                        ? 'bg-teal-50/80 border-teal-500 text-teal-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs truncate mr-1">{qt}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuestionCount(qt, -1)}
                        className="w-5 h-5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className={`w-5 text-center text-xs font-bold ${count > 0 ? 'text-teal-700' : 'text-slate-400'}`}>
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuestionCount(qt, 1)}
                        className="w-5 h-5 rounded-md bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* F. TINGKAT KESULITAN & PERINGATAN ALOKASI WAKTU */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  F
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Tingkat Kesulitan & Manajemen Alokasi Waktu
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Menjaga keseimbangan kognitif agar lembar kerja proporsional dan tidak membebani siswa.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDifficultyMode('ai')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    difficultyMode === 'ai' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✨ AI Komposisi
                </button>
                <button
                  type="button"
                  onClick={() => setDifficultyMode('manual')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    difficultyMode === 'manual' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🎛️ Guru Atur %
                </button>
              </div>
            </div>

            {/* Slider / Pengaturan Kesulitan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-800">Mudah (C1–C2)</span>
                  <span className="text-xs font-black text-slate-800">{diffMudah}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={5}
                  disabled={difficultyMode === 'ai'}
                  value={diffMudah}
                  onChange={(e) => setDiffMudah(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <span className="text-[10px] text-slate-400">Pemahaman konsep & identifikasi dasar</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-blue-800">Sedang (C3–C4)</span>
                  <span className="text-xs font-black text-slate-800">{diffSedang}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={70}
                  step={5}
                  disabled={difficultyMode === 'ai'}
                  value={diffSedang}
                  onChange={(e) => setDiffSedang(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="text-[10px] text-slate-400">Aplikasi konsep & analisis stimulus</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-purple-800">Sulit / HOTS (C5–C6)</span>
                  <span className="text-xs font-black text-slate-800">{diffHots}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  disabled={difficultyMode === 'ai'}
                  value={diffHots}
                  onChange={(e) => setDiffHots(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <span className="text-[10px] text-slate-400">Evaluasi kritis, kreasi, & pemecahan masalah</span>
              </div>
            </div>

            {/* Peringatan Waktu Jika Padat */}
            {timeWarning.hasWarning && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Peringatan Keseimbangan Waktu:</span>
                  <span className="text-[11px] leading-relaxed">{timeWarning.message}</span>
                </div>
              </div>
            )}
          </div>

          {/* G. REVIEW RANCANGAN & TOMBOL GENERATE LKPD */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
                  Tahap 4 — Review Rancangan Sebelum Generate
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  Ringkasan Blueprint Lembar Kerja Peserta Didik
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">{effectiveTotalResponses}</span>
                <span className="text-xs text-white/70 block">Target Respon Siswa</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/60 block">Materi & Kelas:</span>
                <span className="font-bold text-white truncate block">{materi} ({grade})</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/60 block">Alokasi Waktu:</span>
                <span className="font-bold text-emerald-300 block">{timeAllocation}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/60 block">Stimulus Pembelajaran:</span>
                <span className="font-bold text-white truncate block">{stimulusType}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/60 block">Sebaran Kesulitan:</span>
                <span className="font-bold text-teal-300 block">{diffMudah}% M | {diffSedang}% S | {diffHots}% H</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={executeGenerateLkpd}
                disabled={isGenerating}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer ${
                  isGenerating
                    ? 'bg-emerald-700/80 text-white cursor-wait'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>STIVIA Sedang Merancang LKPD Kontekstual Berbasis Stimulus...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-slate-900" />
                    <span>GENERATE LKPD PEMBELAJARAN TERSTRUKTUR</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-white/60 mt-2">
                ✨ Menghasilkan LKPD berpedagogi tinggi yang 100% patuh pada stimulus & komposisi soal yang telah Anda tentukan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAHAP 2: REVIEW & EDIT DOKUMEN LKPD TERSTRUKTUR */}
      {/* ====================================================================== */}
      {activeStep === 'review_doc' && generatedDocument && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Header Nav */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setActiveStep('blueprint')}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Rancangan</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingDoc(!isEditingDoc)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingDoc ? 'Selesai Edit' : 'Edit Teks LKPD'}</span>
              </button>
              <button
                type="button"
                onClick={executeGenerateLkpd}
                disabled={isGenerating}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Generate Ulang</span>
              </button>
              <button
                type="button"
                onClick={handleProceedToPosterFinal}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-200 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Palette className="w-4 h-4" />
                <span>BUAT POSTER LKPD VISUAL</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Dokumen LKPD Terstruktur Sheet */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm space-y-6 font-sans">
            {/* Header Identitas Siswa */}
            <div className="border-b-2 border-slate-900 pb-4 space-y-3">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest block">
                  LEMBAR KERJA PESERTA DIDIK (LKPD)
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  {generatedDocument.title}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600 pt-1">
                  <span>Mata Pelajaran: {generatedDocument.subject}</span>
                  <span>•</span>
                  <span>Jenjang/Kelas: {generatedDocument.educationLevel} {generatedDocument.grade}</span>
                  <span>•</span>
                  <span>Alokasi Waktu: {generatedDocument.timeAllocation}</span>
                </div>
              </div>

              {/* Kotak Nama & Kolom Nilai */}
              <div className="p-3 rounded-xl border border-slate-300 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="sm:col-span-2">
                  <span className="font-bold text-slate-500 block text-[10px]">NAMA SISWA / ANGGOTA KELOMPOK:</span>
                  <div className="border-b border-dotted border-slate-400 h-5 mt-1"></div>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block text-[10px]">KELAS / NO. ABSEN:</span>
                  <div className="border-b border-dotted border-slate-400 h-5 mt-1"></div>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block text-[10px]">NILAI / PARAF GURU:</span>
                  <div className="border border-slate-300 rounded h-6 mt-1 flex items-center justify-center font-bold text-slate-400 text-xs">
                    [ ......... ]
                  </div>
                </div>
              </div>
            </div>

            {/* I. Tujuan Pembelajaran */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>I. Tujuan Pembelajaran</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                {generatedDocument.learningObjectives.map((tp, i) => (
                  <li key={i}>{tp}</li>
                ))}
              </ul>
            </div>

            {/* II. Petunjuk Pengerjaan */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>II. Petunjuk Pengerjaan</span>
              </h3>
              <ul className="list-decimal list-inside text-xs text-slate-600 space-y-1 pl-1">
                {generatedDocument.generalInstructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>

            {/* III. Stimulus Pembelajaran */}
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                  III. STIMULUS PEMBELAJARAN ({generatedDocument.stimulus.type})
                </span>
                <span className="text-[10px] font-semibold text-emerald-700">Single Source of Truth</span>
              </div>
              <h4 className="text-sm font-bold text-emerald-950 pt-1">
                {generatedDocument.stimulus.title}
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium bg-white/80 p-3 rounded-xl border border-emerald-100">
                {generatedDocument.stimulus.content}
              </p>
              <p className="text-[11px] text-emerald-800 italic flex items-center gap-1">
                <span>💡</span>
                <span>{generatedDocument.stimulus.contextualHint}</span>
              </p>
            </div>

            {/* IV. Rangkaian Aktivitas & Pertanyaan */}
            <div className="space-y-6 pt-2">
              {generatedDocument.sections.map((sec, secIdx) => (
                <div key={secIdx} className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">
                        {secIdx + 1}
                      </span>
                      <span>{sec.title}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {sec.questions.length} tugas
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">{sec.instruction}</p>

                  <div className="space-y-4 pl-2">
                    {sec.questions.map((q) => (
                      <div key={q.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900">
                            <span className="text-emerald-700 mr-1.5">[Tugas {q.number}]</span>
                            <span>{q.prompt}</span>
                          </p>
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                            q.cognitiveLevel === 'HOTS' 
                              ? 'bg-purple-100 text-purple-800' 
                              : q.cognitiveLevel === 'Sedang' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {q.cognitiveLevel}
                          </span>
                        </div>

                        {/* Options if Multiple Choice */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 pl-2">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="p-1.5 rounded bg-slate-50 border border-slate-200">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Ruang Jawaban Siswa */}
                        <div className="pt-1">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">RUANG TULIS JAWABAN SISWA:</span>
                          <div className="space-y-1.5">
                            {Array.from({ length: q.answerLineCount || 3 }).map((_, l) => (
                              <div key={l} className="border-b border-dashed border-slate-300 h-4"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* V. Refleksi Pembelajaran */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>V. Refleksi Pembelajaran Siswa</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5">
                {generatedDocument.reflectionQuestions.map((rf, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
              <div className="border-b border-dashed border-slate-300 h-6"></div>
              <div className="border-b border-dashed border-slate-300 h-6"></div>
            </div>

            {/* Bottom Call-to-action */}
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={handleProceedToPosterFinal}
                className="px-6 py-3.5 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-200 inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Palette className="w-5 h-5" />
                <span>LANJUTKAN: GENERATE POSTER LKPD VISUAL</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAHAP 3: OUTPUT AKHIR POSTER LKPD VISUAL (POSTER LKPD FINAL) */}
      {/* ====================================================================== */}
      {activeStep === 'poster_final' && generatedDocument && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Deck Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStep('review_doc')}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Teks LKPD</span>
              </button>

              {/* Multi-page switcher jika ada lebih dari 1 halaman */}
              {generatedPosterPages.length > 1 && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {generatedPosterPages.map((page, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePosterPageIndex(idx)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activePosterPageIndex === idx
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Halaman {page.pageNumber}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Salin Universal Prompt</span>
              </button>
              <button
                type="button"
                onClick={handlePrintPoster}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Cetak / PDF</span>
              </button>
              <button
                type="button"
                onClick={handleSaveDraftProject}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Proyek</span>
              </button>
            </div>
          </div>

          {/* Canvas Poster LKPD Visual Sheet */}
          {generatedPosterPages[activePosterPageIndex] && (
            <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-emerald-500 shadow-xl space-y-6 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
              {/* Header Visual Poster LKPD */}
              <div className="border-b-4 border-slate-900 pb-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider inline-block mb-1">
                      POSTER LEMBAR KERJA PESERTA DIDIK
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {generatedPosterPages[activePosterPageIndex].title}
                    </h1>
                    <p className="text-xs font-bold text-emerald-800 mt-0.5">
                      {generatedPosterPages[activePosterPageIndex].metadata}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 block">
                      Halaman {generatedPosterPages[activePosterPageIndex].pageNumber} dari {generatedPosterPages[activePosterPageIndex].totalPages}
                    </span>
                  </div>
                </div>

                {/* Kotak Identitas Siswa Visual */}
                {generatedPosterPages[activePosterPageIndex].hasStudentHeader && (
                  <div className="p-3 rounded-2xl border-2 border-slate-800 bg-slate-50/90 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="col-span-2">
                      <span className="font-extrabold text-[10px] text-slate-600 block">NAMA SISWA / TIM:</span>
                      <div className="border-b-2 border-dotted border-slate-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="font-extrabold text-[10px] text-slate-600 block">KELAS & TANGGAL:</span>
                      <div className="border-b-2 border-dotted border-slate-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="font-extrabold text-[10px] text-slate-600 block">SKOR / NILAI:</span>
                      <div className="border-2 border-slate-400 rounded-lg h-7 mt-1 flex items-center justify-center font-black text-slate-400 text-xs">
                        [ ............ ]
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modul Stimulus Visual (Jika ada di halaman ini) */}
              {generatedPosterPages[activePosterPageIndex].stimulusBox && (
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50/90 to-teal-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                      STIMULUS: {generatedPosterPages[activePosterPageIndex].stimulusBox?.type}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold">Amati & Analisis</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {generatedPosterPages[activePosterPageIndex].stimulusBox?.title}
                  </h3>
                  <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                    {generatedPosterPages[activePosterPageIndex].stimulusBox?.content}
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-100/60 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong>Konsep Visual:</strong> {generatedPosterPages[activePosterPageIndex].stimulusBox?.illustrationDesc}</span>
                  </div>
                </div>
              )}

              {/* Blok Aktivitas & Pertanyaan Siswa */}
              <div className="space-y-5">
                {generatedPosterPages[activePosterPageIndex].activityBoxes.map((box, bIdx) => (
                  <div key={bIdx} className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b-2 border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                        {bIdx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                        AKTIVITAS: {box.category}
                      </h4>
                    </div>

                    <div className="space-y-3.5 pl-1">
                      {box.questions.map((q) => (
                        <div key={q.number} className="p-3.5 rounded-2xl border-2 border-slate-200 bg-white space-y-2">
                          <p className="text-xs font-bold text-slate-900 leading-relaxed">
                            <span className="text-emerald-700 mr-1.5">[Tugas {q.number}]</span>
                            <span>{q.prompt}</span>
                          </p>

                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                                  {opt}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Ruang Garis Jawaban Siswa */}
                          <div className="pt-1.5">
                            <span className="text-[9px] font-black text-slate-400 block mb-1">
                              RUANG TULIS JAWABAN SISWA:
                            </span>
                            <div className="space-y-2">
                              {Array.from({ length: q.answerLineCount || 3 }).map((_, li) => (
                                <div key={li} className="border-b-2 border-slate-200 h-4"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Poster & Kolom Tanda Tangan */}
              {generatedPosterPages[activePosterPageIndex].footer?.teacherSignBox && (
                <div className="border-t-2 border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Refleksi Belajar:</span>
                    <p className="text-[11px] text-slate-700 italic">
                      "Pelajaran apa yang paling berharga dan bagaimana stimulus membantu pemahaman saya hari ini?"
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-300 text-center shrink-0 w-48">
                    <span className="text-[10px] font-bold text-slate-500 block">Tanda Tangan Guru Pengampu</span>
                    <div className="h-10"></div>
                    <div className="border-t border-dotted border-slate-400 pt-1 text-[10px] font-bold text-slate-700">
                      ( ........................................ )
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================== */}
          {/* UNIVERSAL POSTER PROMPT CARD (UNTUK AI IMAGE GENERATOR) */}
          {/* ================================================================== */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  ✨
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                    Universal Educational Poster Prompt (AI Generator Ready)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Prompt ini disusun langsung dari LKPD Final untuk dimasukkan ke Midjourney, Ideogram, DALL-E, atau Flux.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Prompt Poster</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={8}
              value={universalPrompt}
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-mono leading-relaxed select-all focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TOAST NOTIFIKASI */}
      {/* ====================================================================== */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL LIMIT KUOTA / SALDO */}
      {/* ====================================================================== */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Coins className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">Saldo Koin Tidak Mencukupi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {limitReason || 'Anda telah mencapai batas kuota prompt LKPD. Silakan top up koin untuk melanjutkan pembuatan poster LKPD edukatif.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 block">Paket Top Up Tersedia:</span>
              <ul className="text-slate-600 space-y-1 text-[11px]">
                {PROMPT_PACKAGES.map((pkg) => (
                  <li key={pkg.id} className="flex items-center justify-between">
                    <span>{pkg.name} ({pkg.prompts} Koin)</span>
                    <span className="font-bold text-emerald-700">{pkg.priceLabel}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <a
                href={getWhatsAppTopUpUrl({
                  planName: 'Paket Pendidik LKPD',
                  prompts: 50,
                  priceLabel: 'Top Up Koin STIVIA'
                })}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Top Up WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
