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
  Loader2,
  Zap,
  ShieldAlert,
  AlertTriangle,
  X,
  ShieldCheck,
  Info,
  Coins,
  MessageCircle,
  Printer,
  Image as ImageIcon,
  Users,
  Clock,
  Target,
  PenTool,
  HelpCircle
} from 'lucide-react';
import { 
  EducationLevel, 
  InfographicFormat, 
  VisualLevel, 
  InfographicDraft,
  NavigationTab,
  SubscriptionSummary,
  PROMPT_PACKAGES
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
import { 
  LkpdActivityType, 
  LkpdFormatType, 
  LkpdDifficulty, 
  LkpdTimeAllocation, 
  LkpdStudentOutput, 
  LkpdThinkingResult, 
  runLkpdThinkingFramework 
} from '../../services/lkpdEngine';
import { checkCanGenerate, recordGenerateUsage } from '../../services/subscriptionService';
import { getWhatsAppTopUpUrl } from '../../lib/whatsapp';

const LKPD_ACTIVITY_OPTIONS: LkpdActivityType[] = [
  'Individu',
  'Berpasangan',
  'Kelompok',
  'Praktik',
  'Proyek',
  'Pemecahan Masalah'
];

const LKPD_FORMAT_OPTIONS: LkpdFormatType[] = [
  'Pemahaman Konsep',
  'Analisis',
  'Latihan',
  'Praktik',
  'Eksperimen',
  'Diskusi',
  'Pemecahan Masalah',
  'Proyek'
];

const LKPD_DIFFICULTY_OPTIONS: LkpdDifficulty[] = [
  'Dasar',
  'Sedang',
  'Menantang'
];

const LKPD_TIME_OPTIONS: LkpdTimeAllocation[] = [
  '20 menit',
  '30 menit',
  '45 menit',
  '60 menit',
  '90 menit',
  '2 × 45 menit'
];

const LKPD_OUTPUT_OPTIONS: LkpdStudentOutput[] = [
  'Jawaban Tertulis',
  'Tabel',
  'Analisis',
  'Diagram',
  'Praktik',
  'Produk',
  'Presentasi',
  'Kombinasi'
];

interface BuatInfografisPageProps {
  projects?: InfographicDraft[];
  currentDraft: InfographicDraft;
  onSubmitForm: (formData: Partial<InfographicDraft>, options?: { navigateToStudio?: boolean }) => void;
  onLoadSampleData: () => void;
  onSelectProject?: (project: InfographicDraft) => void;
  onNavigate?: (tab: NavigationTab) => void;
  userId?: string;
  subscriptionSummary?: SubscriptionSummary | null;
  onUsageRecorded?: () => void;
}

export const BuatInfografisPage: React.FC<BuatInfografisPageProps> = ({
  projects = [],
  currentDraft,
  onSubmitForm,
  onLoadSampleData,
  onSelectProject,
  onNavigate,
  userId = '',
  subscriptionSummary,
  onUsageRecorded,
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

  // Subscription Limit & Modal State
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [showProInfoModal, setShowProInfoModal] = useState<boolean>(false);
  const [limitReason, setLimitReason] = useState<string>('');

  // Prompt Type Selection (Infografis vs LKPD)
  const [selectedPromptType, setSelectedPromptType] = useState<'infografis' | 'lkpd'>('infografis');
  const [activeOutputType, setActiveOutputType] = useState<'infografis' | 'lkpd'>('infografis');

  // Pengaturan Khusus LKPD (Section 7)
  const [lkpdActivityType, setLkpdActivityType] = useState<LkpdActivityType>('Kelompok');
  const [lkpdFormatType, setLkpdFormatType] = useState<LkpdFormatType>('Pemahaman Konsep');
  const [lkpdDifficulty, setLkpdDifficulty] = useState<LkpdDifficulty>('Sedang');
  const [lkpdTimeAllocation, setLkpdTimeAllocation] = useState<LkpdTimeAllocation>('45 menit');
  const [lkpdStudentOutput, setLkpdStudentOutput] = useState<LkpdStudentOutput>('Tabel');
  const [lkpdAdditionalInstructions, setLkpdAdditionalInstructions] = useState<string>('');
  const [lkpdThinkingResult, setLkpdThinkingResult] = useState<LkpdThinkingResult | null>(null);

  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>(() => currentDraft.stiviaPrompt || '');
  const [thinkingResult, setThinkingResult] = useState<StiviaThinkingResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);

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
    const isValid = Object.keys(errors).length === 0;

    if (!isValid) {
      // Auto-scroll dan fokus ke field pertama yang belum terisi
      if (errors.subject) {
        const el = document.getElementById(isCustomSubject ? 'input-mapel-kustom' : 'select-mapel');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus();
      } else if (errors.materiDiajarkan) {
        const el = document.getElementById('input-materi-yang-diajarkan');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus();
      } else if (errors.scope) {
        const el = document.getElementById('textarea-cakupan-materi');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus();
      }
    }

    return isValid;
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedPrompt);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = generatedPrompt;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setCopyToast('Prompt berhasil disalin.');
      setTimeout(() => {
        setCopied(false);
        setCopyToast(null);
      }, 3000);
    } catch (err) {
      console.error('Gagal menyalin prompt:', err);
    }
  };

  const handlePrintPrompt = () => {
    if (!generatedPrompt) return;
    window.print();
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
    if (activeOutputType === 'lkpd') {
      executeGenerateLkpdPrompt();
    } else {
      executeGeneratePrompt();
    }
  };

  const executeGenerateLkpdPrompt = async () => {
    if (!validateForm()) return;

    // 1. Validasi Akses & Limit Subscription
    if (userId) {
      const check = await checkCanGenerate(userId);
      if (!check.allowed) {
        setLimitReason(
          check.reason ||
          'Saldo kuota percobaan gratis akun Free Anda telah habis (3 prompt percobaan awal). Silakan lakukan isi ulang saldo prompt Anda untuk melanjutkan pembuatan prompt LKPD.'
        );
        setShowLimitModal(true);
        return;
      }
    }

    const finalSubject = isCustomSubject ? customSubject.trim() : subject;

    setIsGenerating(true);
    setCopied(false);

    setTimeout(async () => {
      try {
        const lkpdResult = runLkpdThinkingFramework(
          {
            educationLevel,
            grade,
            subject: finalSubject,
            materiDiajarkan: materiDiajarkan.trim(),
            bab: bab.trim(),
            temaKegiatan: temaKegiatan.trim(),
            pertemuan: pertemuan.trim() || 'Pertemuan 1',
            scope: scope.trim(),
            userNotes: userNotes.trim(),
          },
          {
            activityType: lkpdActivityType,
            formatType: lkpdFormatType,
            difficulty: lkpdDifficulty,
            timeAllocation: lkpdTimeAllocation,
            studentOutput: lkpdStudentOutput,
            additionalInstructions: lkpdAdditionalInstructions.trim(),
          }
        );

        setGeneratedPrompt(lkpdResult.stage7_FinalPrompt);
        setLkpdThinkingResult(lkpdResult);
        setActiveOutputType('lkpd');

        onSubmitForm({
          ...currentDraft,
          educationLevel,
          grade,
          subject: finalSubject,
          title: materiDiajarkan.trim(),
          rawTopic: materiDiajarkan.trim(),
          theme: temaKegiatan.trim() || materiDiajarkan.trim(),
          bab: bab.trim(),
          pertemuan: pertemuan.trim() || 'Pertemuan 1',
          scope,
          userNotes: userNotes.trim(),
          stiviaPrompt: lkpdResult.stage7_FinalPrompt,
          updatedAt: new Date().toISOString().split('T')[0],
        });

        // 2. Catat penambahan penggunaan (+1 generate) jika pengguna login
        if (userId) {
          try {
            await recordGenerateUsage(userId);
            if (onUsageRecorded) {
              onUsageRecorded();
            }
          } catch (usageErr) {
            console.warn('[Buat Prompt LKPD] Gagal mencatat log penggunaan:', usageErr);
          }
        }

        scrollToResult();
      } catch (err) {
        console.error('[Buat Prompt LKPD Generator Error]', err);
      } finally {
        setIsGenerating(false);
      }
    }, 250);
  };

  const executeGeneratePrompt = async () => {
    // 1. Validasi Akses & Limit Subscription
    if (userId) {
      const check = await checkCanGenerate(userId);
      if (!check.allowed) {
        setLimitReason(
          check.reason ||
          'Saldo kuota percobaan gratis akun Free Anda telah habis (3 prompt percobaan awal). Silakan lakukan isi ulang saldo prompt Anda untuk melanjutkan pembuatan rancangan infografis.'
        );
        setShowLimitModal(true);
        return;
      }
    }

    const finalSubject = isCustomSubject ? customSubject.trim() : subject;
    const finalStyle = 'Modern Edukatif';
    const styleProfile = getStyleProfile(finalStyle);

    setIsGenerating(true);
    setCopied(false);

    setTimeout(async () => {
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
        setActiveOutputType('infografis');

        onSubmitForm({
          ...fullDraft,
          stiviaPrompt: prompt,
        });

        // 2. Catat penambahan penggunaan (+1 generate) jika pengguna login
        if (userId) {
          try {
            await recordGenerateUsage(userId);
            if (onUsageRecorded) {
              onUsageRecorded();
            }
          } catch (usageErr) {
            console.warn('[Buat Prompt] Gagal mencatat log penggunaan:', usageErr);
          }
        }

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
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STIVIA v{APP_CURRENT_VERSION} • Generator Prompt Infografis</span>
            </div>

            {/* Saldo Prompt & Role Status Pill */}
            {subscriptionSummary && (
              <div 
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  subscriptionSummary.isAdmin
                    ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-xs'
                    : subscriptionSummary.isLimitReached
                    ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 shadow-2xs'
                }`}
                title={subscriptionSummary.isAdmin ? 'Akses Admin Permanen Unlimited' : 'Saldo Prompt Aktif Selamanya'}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  subscriptionSummary.isAdmin
                    ? 'bg-purple-600'
                    : subscriptionSummary.isLimitReached 
                    ? 'bg-rose-500 animate-pulse' 
                    : 'bg-emerald-500'
                }`} />
                <span>Saldo Prompt:</span>
                <span className="font-bold text-slate-900">
                  {subscriptionSummary.isAdmin ? 'Unlimited (∞)' : `${subscriptionSummary.promptBalance ?? subscriptionSummary.remaining} Prompt`}
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                  subscriptionSummary.isAdmin
                    ? 'bg-purple-100 text-purple-800'
                    : subscriptionSummary.plan === 'pro'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {subscriptionSummary.isAdmin ? 'ADMIN' : subscriptionSummary.plan}
                </span>
              </div>
            )}
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

      {/* Peringatan Banner Jika Saldo Prompt Habis */}
      {subscriptionSummary?.isLimitReached && !subscriptionSummary?.isAdmin && (
        <div className="p-4 sm:p-5 rounded-3xl bg-rose-50 border border-rose-200 flex items-start gap-3.5 text-rose-900 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm flex-1">
            <h4 className="font-bold text-rose-950">
              Saldo Kuota Prompt Telah Habis (0 Prompt Tersisa)
            </h4>
            <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
              Anda telah menggunakan seluruh saldo prompt yang tersedia. Lakukan isi ulang saldo prompt tambahan (mulai Rp 20.000 untuk 20 prompt) untuk melanjutkan pembuatan prompt infografis. Saldo baru aktif selamanya dan tidak pernah hangus.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={getWhatsAppTopUpUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                title="Hubungi Admin di WhatsApp untuk top-up instan"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Top-Up via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setShowProInfoModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-rose-300 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer shadow-2xs"
              >
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Lihat Pilihan Paket Saldo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION A: DATA POKOK PEMBELAJARAN (KELAS, MAPEL, MATERI) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
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
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
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

        {/* 2. PILIH JENIS PROMPT YANG DIINGINKAN (DI BAWAH FORM PENGISIAN DATA) */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                Pilih Jenis Prompt
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Pilih jenis prompt yang dibuat:
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Satu data materi sebagai Single Source of Truth menghasilkan dua jenis prompt
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* TOMBOL 1: INFOGRAFIS (SISTEM YANG SUDAH BERJALAN - TETAP IDENTIK) */}
            <button
              type="button"
              id="btn-prompt-type-infografis"
              onClick={() => {
                setSelectedPromptType('infografis');
                if (validateForm()) {
                  executeGeneratePrompt();
                }
              }}
              disabled={isGenerating}
              className={`group flex items-center gap-3.5 px-5 py-3.5 rounded-xl border-2 transition-all cursor-pointer shadow-xs active:scale-[0.99] ${
                isGenerating && selectedPromptType === 'infografis'
                  ? 'border-indigo-400 bg-indigo-50/90 text-indigo-950 cursor-wait'
                  : selectedPromptType === 'infografis'
                  ? 'border-[#3b49df] bg-indigo-50/70 hover:bg-[#3b49df] text-slate-900 hover:text-white hover:shadow-md'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isGenerating && selectedPromptType === 'infografis'
                  ? 'bg-indigo-600 text-white'
                  : selectedPromptType === 'infografis'
                  ? 'bg-[#3b49df] text-white group-hover:bg-white group-hover:text-[#3b49df] shadow-xs'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-[#3b49df] group-hover:text-white'
              }`}>
                {isGenerating && selectedPromptType === 'infografis' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
              </div>

              <div className="text-left flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold tracking-tight">
                    INFOGRAFIS
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    isGenerating && selectedPromptType === 'infografis'
                      ? 'bg-indigo-200 text-indigo-900'
                      : 'bg-indigo-100 text-indigo-800 group-hover:bg-white/20 group-hover:text-white'
                  }`}>
                    Poster Vertikal
                  </span>
                </div>
                <p className={`text-xs mt-0.5 transition-colors ${
                  isGenerating && selectedPromptType === 'infografis'
                    ? 'text-indigo-700 font-medium'
                    : 'text-slate-500 group-hover:text-indigo-100'
                }`}>
                  {isGenerating && selectedPromptType === 'infografis' ? 'Sedang memproses prompt...' : 'Klik untuk langsung generate prompt'}
                </p>
              </div>

              <div className={`ml-auto p-1.5 rounded-lg transition-all ${
                isGenerating && selectedPromptType === 'infografis'
                  ? 'text-indigo-600'
                  : 'text-indigo-600 group-hover:text-white group-hover:translate-x-0.5'
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
            </button>

            {/* TOMBOL 2: LKPD (FITUR BARU - STYLE KONSISTEN) */}
            <button
              type="button"
              id="btn-prompt-type-lkpd"
              onClick={() => {
                setSelectedPromptType('lkpd');
                setTimeout(() => {
                  const el = document.getElementById('lkpd-settings-panel');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              disabled={isGenerating}
              className={`group flex items-center gap-3.5 px-5 py-3.5 rounded-xl border-2 transition-all cursor-pointer shadow-xs active:scale-[0.99] ${
                isGenerating && selectedPromptType === 'lkpd'
                  ? 'border-emerald-400 bg-emerald-50/90 text-emerald-950 cursor-wait'
                  : selectedPromptType === 'lkpd'
                  ? 'border-emerald-600 bg-emerald-50/80 text-slate-900 hover:shadow-md'
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isGenerating && selectedPromptType === 'lkpd'
                  ? 'bg-emerald-600 text-white'
                  : selectedPromptType === 'lkpd'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white'
              }`}>
                {isGenerating && selectedPromptType === 'lkpd' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>

              <div className="text-left flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold tracking-tight">
                    LKPD
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    isGenerating && selectedPromptType === 'lkpd'
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Lembar Kerja Siswa
                  </span>
                </div>
                <p className={`text-xs mt-0.5 transition-colors ${
                  isGenerating && selectedPromptType === 'lkpd'
                    ? 'text-emerald-700 font-medium'
                    : 'text-slate-500'
                }`}>
                  {isGenerating && selectedPromptType === 'lkpd' ? 'Sedang memproses prompt...' : 'Klik untuk atur & buat prompt LKPD'}
                </p>
              </div>

              <div className="ml-auto p-1.5 rounded-lg text-emerald-600">
                <Sparkles className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* PENGATURAN KHUSUS LKPD (MUNCUL KETIKA PENGGUNA MEMILIH LKPD) */}
          {selectedPromptType === 'lkpd' && (
            <div 
              id="lkpd-settings-panel"
              className="mt-6 pt-6 border-t border-slate-200/80 space-y-6 animate-in fade-in duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-1">
                    <PenTool className="w-3 h-3" />
                    <span>Pengaturan Khusus LKPD</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Karakteristik & Format Lembar Kerja Peserta Didik
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data materi aktif di atas otomatis menjadi Single Source of Truth. Tentukan parameter aktivitas pembelajaran di bawah ini:
                  </p>
                </div>
              </div>

              {/* A. Jenis Aktivitas */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>A. Jenis Aktivitas</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {LKPD_ACTIVITY_OPTIONS.map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setLkpdActivityType(act)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer ${
                        lkpdActivityType === act
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* B. Bentuk LKPD */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>B. Bentuk LKPD</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LKPD_FORMAT_OPTIONS.map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setLkpdFormatType(fmt)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer ${
                        lkpdFormatType === fmt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* C & D. Tingkat Kesulitan & Alokasi Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* C. Tingkat Kesulitan */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    <span>C. Tingkat Kesulitan</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {LKPD_DIFFICULTY_OPTIONS.map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setLkpdDifficulty(diff)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer ${
                          lkpdDifficulty === diff
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* D. Alokasi Waktu */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>D. Alokasi Waktu</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {LKPD_TIME_OPTIONS.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setLkpdTimeAllocation(time)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer ${
                          lkpdTimeAllocation === time
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* E. Bentuk Hasil Siswa */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>E. Bentuk Hasil Siswa</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LKPD_OUTPUT_OPTIONS.map((out) => (
                    <button
                      key={out}
                      type="button"
                      onClick={() => setLkpdStudentOutput(out)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer ${
                        lkpdStudentOutput === out
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {out}
                    </button>
                  ))}
                </div>
              </div>

              {/* F. Instruksi / Konteks Tambahan (Opsional) */}
              <div className="space-y-2">
                <label htmlFor="lkpd-extra-instructions" className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>F. Instruksi/Konteks Tambahan <span className="text-slate-400 font-normal lowercase">(opsional)</span></span>
                </label>
                <textarea
                  id="lkpd-extra-instructions"
                  rows={2}
                  value={lkpdAdditionalInstructions}
                  onChange={(e) => setLkpdAdditionalInstructions(e.target.value)}
                  placeholder="Tambahkan kondisi khusus, kebutuhan aktivitas, atau instruksi lain jika diperlukan."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs leading-relaxed focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-sans"
                />
              </div>

              {/* Tombol Eksekusi Generate Prompt LKPD */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                <div className="text-xs text-emerald-900">
                  <span className="font-bold block">Siap Menganalisis LKPD</span>
                  <span>Menjalankan 7 Tahap Analisis LKPD bebas kontaminasi konteks.</span>
                </div>

                <button
                  type="button"
                  id="btn-generate-lkpd-prompt"
                  onClick={executeGenerateLkpdPrompt}
                  disabled={isGenerating}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm text-white shadow-md transition-all cursor-pointer ${
                    isGenerating
                      ? 'bg-emerald-400 cursor-wait'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-emerald-700/20'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Analisis LKPD...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>GENERATE PROMPT LKPD</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* 9. HALAMAN / PANEL HASIL PROMPT */}
      {generatedPrompt && (
        <div 
          id="prompt-result-section"
          className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300 scroll-mt-6"
        >
          {/* Header Panel Hasil Prompt */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  activeOutputType === 'lkpd' ? 'bg-emerald-400' : 'bg-indigo-400'
                }`} />
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  {activeOutputType === 'lkpd' ? 'PROMPT LKPD SIAP DIGUNAKAN' : 'PROMPT INFOGRAFIS SIAP DIGUNAKAN'}
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  activeOutputType === 'lkpd'
                    ? 'text-emerald-300 bg-emerald-950/80 border-emerald-800'
                    : 'text-indigo-300 bg-indigo-950/80 border-indigo-800'
                }`}>
                  {activeOutputType === 'lkpd' ? 'Terverifikasi 7 Tahap LKPD ✓' : 'Terverifikasi 7 Tahap ✓'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {activeOutputType === 'lkpd' ? (
                  <>
                    Materi: <span className="font-bold text-white">{materiDiajarkan.trim() || currentDraft.title || 'Materi Pembelajaran'}</span> • {isCustomSubject ? customSubject : subject} ({educationLevel} {grade}) • Aktivitas: {lkpdActivityType} ({lkpdFormatType}) • Waktu: {lkpdTimeAllocation}
                  </>
                ) : (
                  <>
                    Materi: <span className="font-bold text-white">{materiDiajarkan.trim() || currentDraft.title || 'Materi Pembelajaran'}</span> • {isCustomSubject ? customSubject : subject} ({educationLevel} {grade})
                  </>
                )}
              </p>
            </div>

            {/* Action Buttons: SALIN PROMPT & CETAK & REGENERATE */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                id="btn-regenerate-prompt"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700 shadow-sm"
                title="Regenerate Prompt dengan data materi saat ini"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                id="btn-print-prompt"
                type="button"
                onClick={handlePrintPrompt}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer border border-slate-700 shadow-sm"
                title={`Cetak Prompt ${activeOutputType === 'lkpd' ? 'LKPD' : 'Infografis'}`}
              >
                <Printer className="w-4 h-4" />
                <span>CETAK</span>
              </button>

              <button
                id="btn-copy-prompt"
                type="button"
                onClick={handleCopyPrompt}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                    : activeOutputType === 'lkpd'
                    ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-900/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-900/40'
                }`}
                title="Salin Seluruh Prompt ke Clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Prompt Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>SALIN PROMPT</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Copy Toast Notification */}
          {copyToast && (
            <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-700/80 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{copyToast}</span>
            </div>
          )}

          {/* Checklist 10 Validasi Sebelum Final Prompt (Section 15) */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {activeOutputType === 'lkpd' 
                    ? 'Pemeriksaan Validasi Final STIVIA LKPD (12 Kriteria Tahap 7 Terpenuhi)'
                    : 'Pemeriksaan Validasi Final STIVIA (10 Kriteria Terpenuhi)'}
                </span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                100% Lolos
              </span>
            </div>
            {activeOutputType === 'lkpd' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Sesuai Kelas</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Sesuai Tujuan</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Materi Akurat</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Instruksi Dipahami</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Aktivitas Terlaksana</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Kesulitan Sesuai</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Ruang Tugas Cukup</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Struktur Lengkap</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Visual Edukatif</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Siap Cetak</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Teks Proporsional</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Hubungan Logis</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Topik Sesuai</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Mapel Sesuai</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Kelas Sesuai</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Tujuan Sesuai</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Cakupan Terkunci</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Bebas Kontaminasi</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Istilah Relevan</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Struktur Jelas</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> 4–6 Bagian Utama</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Siap Digunakan</div>
              </div>
            )}
          </div>

          {/* Area Teks Prompt Read-Only */}
          <div className="relative">
            <textarea
              readOnly
              rows={16}
              value={generatedPrompt}
              className="w-full bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed focus:outline-hidden select-all shadow-inner"
            />
          </div>

          {/* Footer Panel Hasil */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <span>Panjang Prompt: {generatedPrompt.length} karakter</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">
                {activeOutputType === 'lkpd' 
                  ? 'Siap Digunakan di AI Image & Visual Design Generator (Ideogram, Midjourney, DALL-E, Canva AI) & AI Model'
                  : 'Siap Digunakan di AI Image Generator (DALL-E, Ideogram, Midjourney, Flux, ChatGPT & Gemini)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintPrompt}
                className="text-slate-300 hover:text-white underline cursor-pointer"
              >
                Cetak Halaman Prompt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAMPILAN KHUSUS CETAK (PRINT-ONLY) */}
      {generatedPrompt && (
        <div id="stivia-prompt-print-area" className="hidden print:block text-slate-900 font-sans">
          <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.025em', margin: 0 }}>
              {activeOutputType === 'lkpd' ? 'STIVIA — PROMPT LKPD' : 'STIVIA — PROMPT INFOGRAFIS'}
            </h1>
            <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div><strong>Judul Materi:</strong> {materiDiajarkan.trim() || currentDraft.title || 'Materi Pembelajaran'}</div>
              <div><strong>Mata Pelajaran:</strong> {isCustomSubject ? customSubject : subject}</div>
              <div><strong>Kelas:</strong> {educationLevel} ({grade})</div>
              <div><strong>Tanggal:</strong> {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              {activeOutputType === 'lkpd' && (
                <>
                  <div><strong>Jenis Aktivitas:</strong> {lkpdActivityType} ({lkpdFormatType})</div>
                  <div><strong>Tingkat Kesulitan:</strong> {lkpdDifficulty}</div>
                  <div><strong>Alokasi Waktu:</strong> {lkpdTimeAllocation}</div>
                  <div><strong>Bentuk Hasil:</strong> {lkpdStudentOutput}</div>
                </>
              )}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>
              {activeOutputType === 'lkpd' ? 'FINAL PROMPT LKPD' : 'FINAL PROMPT'}
            </h2>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.6, color: '#0f172a', margin: 0 }}>
              {generatedPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* MODAL 1: BATAS GENERATE BULAN INI TERCAPAI */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Saldo Kuota Prompt Telah Habis
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Anda telah menggunakan seluruh saldo prompt pada akun Anda. Isi ulang saldo prompt Anda untuk melanjutkan membuat prompt infografis. Saldo aktif selamanya.
              </p>
            </div>

            {/* Ringkasan Penggunaan */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Paket Anda:</span>
                <span className="font-extrabold text-slate-900 uppercase">
                  {subscriptionSummary?.isAdmin ? 'Admin' : subscriptionSummary?.plan || 'Free'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Saldo Prompt Tersisa:</span>
                <span className="font-bold text-rose-600">
                  {subscriptionSummary?.isAdmin ? 'Unlimited' : `${subscriptionSummary?.promptBalance ?? 0} Prompt`}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Masa Aktif Saldo:</span>
                <span className="font-bold text-emerald-600">
                  Aktif Selamanya (Tanpa Batas Waktu)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowLimitModal(false);
                  setShowProInfoModal(true);
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#3b49df] hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-300" />
                <span>Pilihan Top-Up Saldo Prompt</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PILIHAN PAKET TOP-UP SALDO PROMPT */}
      {showProInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 block">
                    Top-Up Saldo Prompt
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Paket Saldo Prompt STIVIA
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProInfoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pilih paket saldo prompt sesuai ritme mengajar Anda. Saldo <strong>aktif selamanya</strong> dan hanya berkurang saat Anda men-generate prompt infografis.
            </p>

            <div className="space-y-3">
              {PROMPT_PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-indigo-50/90 to-blue-50/80 border-indigo-200 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900">{pkg.name}</h4>
                        {pkg.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-600 text-white tracking-wider uppercase">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{pkg.description}</p>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <span className="text-base font-black text-[#3b49df]">{pkg.priceLabel}</span>
                      <span className="text-[11px] font-bold text-amber-700 block">{pkg.prompts} Prompt</span>
                      <a
                        href={getWhatsAppTopUpUrl({
                          planName: pkg.name,
                          prompts: pkg.prompts,
                          priceLabel: pkg.priceLabel,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors"
                        title={`Pesan ${pkg.name} via WhatsApp`}
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Pesan via WA</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Petunjuk Aktivasi */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#3b49df]">
                <Info className="w-4 h-4 shrink-0" />
                <span>Cara Top-Up Saldo Prompt:</span>
              </div>
              <p className="leading-relaxed text-[11px] text-indigo-900/80">
                Hubungi <strong>Administrator STIVIA</strong> dengan menyebutkan email akun dan paket pilihan Anda. Saldo prompt akan langsung ditambahkan ke akun Anda dan aktif selamanya.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={getWhatsAppTopUpUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Admin via WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProInfoModal(false);
                    if (onNavigate) {
                      onNavigate('profil_saya');
                    }
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-[#3b49df] hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Status di Profil Saya
                </button>
                <button
                  type="button"
                  onClick={() => setShowProInfoModal(false)}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
