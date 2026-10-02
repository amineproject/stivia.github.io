import React, { useState, useEffect, useRef } from 'react';
import {
  Presentation,
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  Palette,
  Check,
  Copy,
  RotateCcw,
  Loader2,
  ExternalLink,
  ChevronRight,
  Info,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Coins,
  MessageCircle,
  X,
  FileText,
  Sliders,
  Share2,
  Bookmark
} from 'lucide-react';
import {
  EducationLevel,
  InfographicDraft,
  NavigationTab,
  SubscriptionSummary,
  PROMPT_PACKAGES,
  PresentationProductContext
} from '../../types';
import {
  PresentationVisualStyle,
  SlideDesign,
  PresentationBlueprint,
  GeneratedPresentationResult,
  PRESENTATION_VISUAL_STYLES,
  generateAdaptive10SlideStructure,
  buildStrictGammaPrompt
} from '../../services/gammaPresentationEngine';
import { isPresentationContextOutdated } from '../../services/productContextAdapter';
import { suggestLearningObjectives } from '../../services/stiviaThinkingFramework';
import { checkCanGenerate, recordGenerateUsage } from '../../services/subscriptionService';
import { getWhatsAppTopUpUrl } from '../../lib/whatsapp';

interface PresentasiPageProps {
  onNavigate?: (tab: NavigationTab) => void;
  currentDraft?: InfographicDraft;
  userId?: string;
  subscriptionSummary?: SubscriptionSummary | null;
  onUsageRecorded?: () => void;
  onSubmitForm?: (draft: InfographicDraft) => void;
  presentationContext?: PresentationProductContext | null;
  onRefreshFromMasterContext?: () => void;
}

export const PresentasiPage: React.FC<PresentasiPageProps> = ({
  onNavigate,
  currentDraft,
  userId,
  subscriptionSummary,
  onUsageRecorded,
  onSubmitForm,
  presentationContext,
  onRefreshFromMasterContext
}) => {
  // ==========================================================================
  // TRACKING PROVENANCE MASTER CONTEXT (TAHAP 3D)
  // ==========================================================================
  const [draftMasterVersion, setDraftMasterVersion] = useState<number>(
    () => presentationContext?.sourceMasterVersion || currentDraft?.sourceMasterVersion || 1
  );
  const [draftMeetingId, setDraftMeetingId] = useState<string>(
    () => presentationContext?.sourceMeetingId || currentDraft?.sourceMeetingId || ''
  );

  const isOutdated = Boolean(
    presentationContext &&
    isPresentationContextOutdated(draftMasterVersion, presentationContext.sourceMasterVersion)
  );

  // ==========================================================================
  // STATE INPUT FORM PRESENTASI 10 SLIDE
  // Pre-filled dari Master Learning Data (Single Source of Truth) jika tersedia
  // ==========================================================================
  const [subject, setSubject] = useState<string>(
    () => presentationContext?.subject || currentDraft?.subject || 'Informatika'
  );
  const [customSubject, setCustomSubject] = useState<string>('');
  const [isCustomSubject, setIsCustomSubject] = useState<boolean>(false);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    () => presentationContext?.educationLevel || currentDraft?.educationLevel || 'SMA'
  );
  const [grade, setGrade] = useState<string>(
    () => presentationContext?.grade || currentDraft?.grade || 'Kelas X'
  );
  const [materi, setMateri] = useState<string>(
    () => presentationContext?.materiDiajarkan || currentDraft?.rawTopic || 'Struktur Data Graph'
  );
  const [bab, setBab] = useState<string>(
    () => presentationContext?.bab || currentDraft?.bab || 'Bab 2: Pemodelan Graf & Logika Jaringan'
  );
  const [pertemuan, setPertemuan] = useState<string>(
    () => presentationContext?.pertemuan || currentDraft?.pertemuan || 'Pertemuan 1'
  );

  // Materi Pembelajaran (Textarea Utama) - Mengalirkan cakupanMateri Master Learning Data
  const [rawMaterial, setRawMaterial] = useState<string>(() => {
    if (presentationContext?.cakupanMateri) return presentationContext.cakupanMateri;
    if (currentDraft?.scope) return currentDraft.scope;
    return '1. Pengantar dan definisi Graph sebagai struktur data non-linear yang merepresentasikan keterhubungan antar-objek.\n2. Komponen pokok Graph: Vertex (Simpul) dan Edge (Sisi/Garis relasi).\n3. Klasifikasi Graph: Graph terarah (Directed) vs tidak terarah (Undirected), serta Graph berbobot (Weighted).\n4. Studi kasus nyata: Navigasi rute jalan terpendek (Google Maps) dan relasi pertemanan media sosial.\n5. Keuntungan dan analisis kompleksitas algoritma traversal (BFS dan DFS).';
  });

  // Tujuan Pembelajaran (Master TP -> currentDraft.learningObjectivesList -> defaults)
  const [learningObjectives, setLearningObjectives] = useState<string[]>(() => {
    if (presentationContext?.learningObjectives && presentationContext.learningObjectives.length > 0) {
      return presentationContext.learningObjectives;
    }
    if (currentDraft?.learningObjectivesList && currentDraft.learningObjectivesList.length > 0) {
      return currentDraft.learningObjectivesList;
    }
    return [
      'Memahami definisi, simpul (vertex), dan sisi (edge) pada struktur data Graph secara komprehensif.',
      'Membedakan karakteristik graph terarah, tidak terarah, dan berbobot melalui studi kasus nyata.',
      'Menganalisis penerapan algoritma graf dalam memecahkan masalah pencarian rute sehari-hari.'
    ];
  });
  const [newObjectiveInput, setNewObjectiveInput] = useState<string>('');
  const [isSuggestingObjectives, setIsSuggestingObjectives] = useState<boolean>(false);

  // Catatan Guru (Opsional)
  const [userNotes, setUserNotes] = useState<string>(
    () => presentationContext?.userNotes || currentDraft?.userNotes || 'Gunakan gaya bahasa semi-formal yang komunikatif untuk siswa SMA. Tekankan analogi rute kota agar materi mudah dibayangkan.'
  );

  // Pilihan Gaya Visual Presentasi
  const [visualStyle, setVisualStyle] = useState<PresentationVisualStyle>('Modern Edukatif');

  // Preview Slide Terpilih pada Hasil Generate
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Status Eksekusi & Modal
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedPresentationResult | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [limitReason, setLimitReason] = useState<string>('');

  // Sinkronisasi data awal jika currentDraft berubah dan tidak ada presentationContext (legacy fallback)
  useEffect(() => {
    if (!presentationContext && currentDraft) {
      if (currentDraft.subject) setSubject(currentDraft.subject);
      if (currentDraft.educationLevel) setEducationLevel(currentDraft.educationLevel);
      if (currentDraft.grade) setGrade(currentDraft.grade);
      if (currentDraft.rawTopic) setMateri(currentDraft.rawTopic);
      if (currentDraft.bab) setBab(currentDraft.bab);
      if (currentDraft.pertemuan) setPertemuan(currentDraft.pertemuan);
      if (currentDraft.scope) setRawMaterial(currentDraft.scope);
      if (currentDraft.learningObjectivesList && currentDraft.learningObjectivesList.length > 0) {
        setLearningObjectives(currentDraft.learningObjectivesList);
      }
      if (currentDraft.userNotes) setUserNotes(currentDraft.userNotes);
    }
  }, [currentDraft, presentationContext]);

  // ==========================================================================
  // SINKRONISASI ULANG DARI MASTER LEARNING DATA (Tahap 3D)
  // Memperbarui materi, cakupan, dan TP tanpa merusak preferensi gaya visual guru
  // ==========================================================================
  const handleSyncToLatestMasterContext = () => {
    if (!presentationContext) return;
    setEducationLevel(presentationContext.educationLevel);
    setGrade(presentationContext.grade);
    setSubject(presentationContext.subject);
    setIsCustomSubject(false);
    setCustomSubject('');
    setMateri(presentationContext.materiDiajarkan);
    setBab(presentationContext.bab);
    setPertemuan(presentationContext.pertemuan);
    if (presentationContext.cakupanMateri) {
      setRawMaterial(presentationContext.cakupanMateri);
    }
    if (presentationContext.userNotes) {
      setUserNotes(presentationContext.userNotes);
    }
    if (presentationContext.learningObjectives && presentationContext.learningObjectives.length > 0) {
      setLearningObjectives(presentationContext.learningObjectives);
    }
    setDraftMasterVersion(presentationContext.sourceMasterVersion);
    setDraftMeetingId(presentationContext.sourceMeetingId);

    if (onRefreshFromMasterContext) {
      onRefreshFromMasterContext();
    }

    setCopyToast(`🔄 Presentasi berhasil diselaraskan dengan Master Learning Data v${presentationContext.sourceMasterVersion}!`);
    setTimeout(() => setCopyToast(null), 3000);
  };

  // Deteksi pergantian pertemuan aktif secara otomatis
  useEffect(() => {
    if (presentationContext && presentationContext.sourceMeetingId && presentationContext.sourceMeetingId !== draftMeetingId) {
      handleSyncToLatestMasterContext();
    }
  }, [presentationContext?.sourceMeetingId]);


  // ==========================================================================
  // HANDLERS: TUJUAN PEMBELAJARAN
  // ==========================================================================
  const handleSuggestObjectives = () => {
    setIsSuggestingObjectives(true);
    setTimeout(() => {
      const activeSubj = isCustomSubject ? customSubject : subject;
      const suggestions = suggestLearningObjectives(activeSubj, materi, bab || materi);
      if (suggestions && suggestions.length > 0) {
        setLearningObjectives(suggestions);
        setCopyToast('✨ 3 Tujuan Pembelajaran berhasil diselaraskan otomatis oleh AI!');
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

  // ==========================================================================
  // VALIDASI FORM SEBELUM GENERATE
  // ==========================================================================
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const activeSubj = isCustomSubject ? customSubject : subject;

    if (!activeSubj.trim()) errors.subject = 'Mata pelajaran wajib diisi.';
    if (!materi.trim()) errors.materi = 'Topik / Materi pembelajaran wajib diisi.';
    if (!rawMaterial.trim() || rawMaterial.trim().length < 15) {
      errors.rawMaterial = 'Bahan materi pembelajaran minimal berisi 15 karakter.';
    }
    if (learningObjectives.length === 0) {
      errors.objectives = 'Minimal 1 tujuan pembelajaran harus diisi.';
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
  // EKSEKUSI GENERATE PRESENTASI 10 SLIDE (ATURAN SALDO & INTEGRITAS)
  // ==========================================================================
  const isGeneratingRef = useRef<boolean>(false);

  const executeGeneratePresentation = async () => {
    // 0. Double Click & In-Flight Lock Protection (Requirement 14)
    if (isGenerating || isGeneratingRef.current) return;
    if (!validateForm()) return;

    // 1. Pengecekan limit & saldo STIVIA (Biaya: 3 Saldo Prompt untuk Presentasi 10 Slide)
    if (userId) {
      const check = await checkCanGenerate(userId, 'presentation');
      if (!check.allowed) {
        setLimitReason(
          check.reason || 
          'Saldo koin generate Anda tidak mencukupi untuk membuat Presentasi (Kebutuhan: 3 Saldo Prompt).'
        );
        setShowLimitModal(true);
        return;
      }
    }

    isGeneratingRef.current = true;
    setIsGenerating(true);

    try {
      const activeSubj = isCustomSubject ? customSubject : subject;
      const blueprint: PresentationBlueprint = {
        subject: activeSubj,
        educationLevel,
        grade,
        materi,
        bab,
        pertemuan,
        learningObjectives,
        rawMaterial,
        userNotes,
        visualStyle
      };

      // 2. Susun 10 slide secara adaptif & terstruktur
      const slides: SlideDesign[] = generateAdaptive10SlideStructure(blueprint);

      // 3. Susun Prompt Gamma AI yang sangat ketat (Strict 10 Slides Only)
      const gammaPrompt = buildStrictGammaPrompt(blueprint, slides);

      // 4. Catat transaksi koin (Biaya: 3 Saldo Prompt) di database via Supabase RPC jika terautentikasi
      if (userId) {
        const usageSuccess = await recordGenerateUsage(userId, 'presentation');
        if (!usageSuccess) {
          throw new Error('Gagal memverifikasi pemotongan saldo generate presentasi.');
        }
        if (onUsageRecorded) onUsageRecorded();
      }

      const result: GeneratedPresentationResult = {
        id: `pres-${Date.now()}`,
        title: `PRESENTASI: ${materi.toUpperCase()}`,
        subject: activeSubj,
        educationLevel,
        grade,
        materi,
        bab,
        pertemuan,
        timeEstimate: '35–45 menit pembelajaran',
        slides,
        gammaPrompt,
        createdAt: new Date().toISOString()
      };

      setGeneratedResult(result);
      setActiveSlideIndex(0);

      // 5. Sinkronkan hasil generate & perbarui status produk pertemuan menjadi ready (Requirement 16, 17, 18)
      if (onSubmitForm) {
        onSubmitForm({
          ...(currentDraft || {
            id: `proj-pres-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'completed',
            viewCount: 0
          }),
          id: currentDraft?.id || `proj-pres-${Date.now()}`,
          title: result.title,
          educationLevel,
          grade,
          subject: activeSubj,
          rawTopic: materi,
          bab,
          pertemuan,
          scope: rawMaterial,
          learningObjective: learningObjectives[0] || '',
          learningObjectivesList: learningObjectives,
          userNotes,
          stiviaPrompt: result.gammaPrompt,
          updatedAt: new Date().toISOString().split('T')[0],
          status: 'completed',
          sourceMeetingId: presentationContext?.sourceMeetingId || draftMeetingId,
          sourceMasterVersion: presentationContext?.sourceMasterVersion || draftMasterVersion
        });
      }

      // Scroll halus ke area hasil
      setTimeout(() => {
        const el = document.getElementById('gamma-output-container');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);

      setCopyToast('✨ Prompt Presentasi 10 Slide siap digunakan di Gamma AI!');
      setTimeout(() => setCopyToast(null), 3000);
    } catch (err: any) {
      setLimitReason(err?.message || 'Terjadi kendala teknis saat menyusun prompt presentasi.');
      setShowLimitModal(true);
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }
  };

  // ==========================================================================
  // AKSI OUTPUT: SALIN, BUKA GAMMA, SIMPAN DRAFT
  // ==========================================================================
  const handleCopyGammaPrompt = () => {
    if (!generatedResult?.gammaPrompt) return;
    navigator.clipboard.writeText(generatedResult.gammaPrompt);
    setCopyToast('📋 Prompt Gamma AI berhasil disalin! Silakan tempel di gamma.app');
    setTimeout(() => setCopyToast(null), 3000);
  };

  const handleOpenGammaApp = () => {
    // Copy otomatis ke clipboard agar user tinggal paste di Gamma
    if (generatedResult?.gammaPrompt) {
      navigator.clipboard.writeText(generatedResult.gammaPrompt);
      setCopyToast('📋 Prompt disalin ke clipboard! Membuka gamma.app...');
      setTimeout(() => setCopyToast(null), 3000);
    }
  };

  const handleSaveToProjects = () => {
    if (!generatedResult || !onSubmitForm) return;
    const activeSubj = isCustomSubject ? customSubject : subject;
    const updatedDraft: InfographicDraft = {
      ...(currentDraft || {
        id: `proj-pres-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'completed',
        viewCount: 0
      }),
      id: currentDraft?.id || `proj-pres-${Date.now()}`,
      title: generatedResult.title,
      educationLevel,
      grade,
      subject: activeSubj,
      rawTopic: materi,
      bab,
      pertemuan,
      scope: rawMaterial,
      learningObjective: learningObjectives[0] || '',
      learningObjectivesList: learningObjectives,
      userNotes,
      stiviaPrompt: generatedResult.gammaPrompt,
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'completed',
      sourceMeetingId: presentationContext?.sourceMeetingId || draftMeetingId,
      sourceMasterVersion: presentationContext?.sourceMasterVersion || draftMasterVersion
    };
    onSubmitForm(updatedDraft);
    setCopyToast('💾 Proyek Presentasi berhasil disimpan ke daftar proyek!');
    setTimeout(() => setCopyToast(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* ====================================================================== */}
      {/* HEADER UTAMA MENU PRESENTASI */}
      {/* ====================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
            <Presentation className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Studio Konten
              </span>
              <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
                <span>🎯</span>
                <span>TEPAT 10 SLIDE</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                Khusus Gamma AI
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Presentasi Pembelajaran (Gamma AI)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Buat prompt presentasi berbobot pedagogik tinggi yang dikunci <strong>tepat 10 slide</strong>. STIVIA menentukan isi dan struktur materi; Gamma AI bertugas memvisualisasikannya tanpa menambah slide baru.
            </p>
          </div>
        </div>

        {onNavigate && (
          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>
        )}
      </div>

      {/* ====================================================================== */}
      {/* BANNER KONEKSI MASTER LEARNING DATA (SINGLE SOURCE OF TRUTH - TAHAP 3D) */}
      {/* ====================================================================== */}
      {presentationContext && (
        <div className={`rounded-3xl p-5 sm:p-6 border transition-all ${
          isOutdated 
            ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs' 
            : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                isOutdated 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    📌 Terhubung dengan Master Learning Data
                  </span>
                  <span className="text-[11px] font-bold text-slate-600">
                    {presentationContext.pertemuan} • {presentationContext.grade} ({presentationContext.subject})
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    isOutdated 
                      ? 'bg-amber-200 text-amber-900 border-amber-300 font-extrabold'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    Versi Master: v{presentationContext.sourceMasterVersion} {isOutdated ? `(Presentasi saat ini: v${draftMasterVersion})` : ''}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">
                  {isOutdated ? (
                    <span className="text-amber-900 font-semibold">
                      ⚠️ <strong>Master Context telah diperbarui:</strong> Cakupan atau materi pertemuan ini telah diubah ke versi <strong>v{presentationContext.sourceMasterVersion}</strong>. Konfigurasi visual presentasi Anda tetap aman dan tidak diubah paksa.
                    </span>
                  ) : (
                    <span className="text-slate-600">
                      Fokus Tema: <strong className="text-slate-900">{presentationContext.temaKegiatan}</strong> — Bab: <strong className="text-slate-900">{presentationContext.bab}</strong>. Seluruh identitas & cakupan materi otomatis dialirkan ke prompt presentasi 10 slide Gamma AI.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={handleSyncToLatestMasterContext}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                  isOutdated
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
                title="Terapkan cakupan dan data materi terbaru dari Master Context ke presentasi"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isOutdated ? `Selaraskan ke Master v${presentationContext.sourceMasterVersion}` : 'Sinkronkan Ulang Master'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* FORM PENGISIAN MATERI & KONTEKS PRESENTASI */}
      {/* ====================================================================== */}
      <div className="space-y-6">
        {/* A. IDENTITAS PEMBELAJARAN */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                Identitas Pembelajaran
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Single Source of Truth</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Mata Pelajaran */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Mata Pelajaran</label>
                <button
                  type="button"
                  onClick={() => setIsCustomSubject(!isCustomSubject)}
                  className="text-[10px] text-amber-700 font-semibold hover:underline cursor-pointer"
                >
                  {isCustomSubject ? 'Pilih dari Daftar' : '+ Mapel Lain'}
                </button>
              </div>
              {isCustomSubject ? (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Ketik mata pelajaran kustom..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/40 text-slate-800 font-medium"
                />
              ) : (
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800 font-medium"
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
                  <option value="Seni Budaya">Seni Budaya</option>
                  <option value="PJOK">PJOK (Pendidikan Jasmani)</option>
                </select>
              )}
            </div>

            {/* Jenjang */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Jenjang</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800 font-medium"
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
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800"
              />
            </div>

            {/* Bab / Pokok Bahasan */}
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">Bab / Subpokok Bahasan</label>
              <input
                type="text"
                value={bab}
                onChange={(e) => setBab(e.target.value)}
                placeholder="Contoh: Bab 2: Struktur Data Non-Linear & Graf Berarah"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800"
              />
            </div>

            {/* Pertemuan */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Pertemuan / Alokasi</label>
              <input
                type="text"
                value={pertemuan}
                onChange={(e) => setPertemuan(e.target.value)}
                placeholder="Contoh: Pertemuan 1 (2 JP)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* B. MATERI PEMBELAJARAN (TEXTAREA UTAMA) */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                B
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                  Materi Pembelajaran (Bahan Utama Slide)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Materi ini menjadi Single Source of Truth yang akan dipadatkan secara proporsional ke dalam 10 slide.
                </p>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              {rawMaterial.length} karakter
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="block text-xs font-bold text-slate-700">Topik Inti Presentasi:</label>
              <input
                type="text"
                value={materi}
                onChange={(e) => setMateri(e.target.value)}
                placeholder="Contoh: Struktur Data Graph, Teks Iklan Komersial, Daur Karbon, dll."
                className="flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 text-slate-900"
              />
            </div>

            <textarea
              rows={6}
              value={rawMaterial}
              onChange={(e) => setRawMaterial(e.target.value)}
              placeholder="Masukkan materi, teks bacaan, konsep, poin-poin penting, rumus, atau bahan ajar yang ingin dijadikan presentasi...&#10;Contoh:&#10;1. Pengertian materi dan terminologi kunci.&#10;2. Komponen pokok pembentuk.&#10;3. Contoh kasus nyata di sekitar siswa.&#10;4. Tahapan analisis dan pemecahan masalah."
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800 leading-relaxed font-sans"
            />

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Aturan Prioritas STIVIA:</strong> Jika materi Anda sangat panjang, STIVIA secara otomatis <strong>meringkas, memadatkan, dan memprioritaskan</strong> poin esensial ke dalam 10 slide tanpa memicu pembuatan slide ke-11 di Gamma AI.
              </p>
            </div>
          </div>
        </div>

        {/* C. TUJUAN PEMBELAJARAN (PEDAGOGIK BASIS) */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                C
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                  Tujuan Pembelajaran (Slide 2)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Target kompetensi yang akan ditampilkan secara elegan pada Slide 2 presentasi.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSuggestObjectives}
              disabled={isSuggestingObjectives}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              {isSuggestingObjectives ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>✨ Rekomendasikan TP Otomatis</span>
            </button>
          </div>

          {/* List TP */}
          <div className="space-y-2">
            {learningObjectives.map((obj, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
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
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800"
            />
            <button
              type="button"
              onClick={handleAddObjective}
              className="px-3.5 py-2 bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* D. FORMAT 10 SLIDE & GAYA VISUAL */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                D
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                  Format Presentasi & Gaya Visual Gamma
                </h2>
                <p className="text-[11px] text-slate-500">
                  Parameter tata letak dan estetika visual yang akan diinstruksikan kepada Gamma AI.
                </p>
              </div>
            </div>

            {/* Indikator Terkunci 10 Slide */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 font-black text-xs border border-orange-300">
              <span>🔒 FORMAT: 10 SLIDE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Informasi Penguncian Slide */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Struktur Terkunci 10 Slide (Non-Negotiable)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Gamma AI akan dilarang membuat slide 11, memecah slide, atau menambah submateri baru. Seluruh alur (Cover, TP, Apersepsi, 3 Konsep Inti, Penerapan, Aktivitas, Rangkuman, Refleksi) diatur presisi 1:1.
              </p>
              <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                ✓ Sesuai batas standar free tier & kenyamanan durasi ajar 1 JP
              </div>
            </div>

            {/* Catatan Guru (Opsional) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Catatan Tambahan Guru (Opsional):</label>
              <textarea
                rows={3}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Contoh: Tekankan analogi kehidupan sehari-hari, gunakan gaya bahasa santai dan bersahabat untuk siswa SMA..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Pilihan Gaya Visual Presentasi */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">Pilih Gaya Visual Presentasi:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {PRESENTATION_VISUAL_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setVisualStyle(style.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    visualStyle === style.id
                      ? 'bg-amber-50/90 border-amber-600 text-amber-950 shadow-xs ring-1 ring-amber-500 font-bold'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{style.icon}</span>
                    {visualStyle === style.id && <Check className="w-3.5 h-3.5 text-amber-700" />}
                  </div>
                  <span className="text-xs font-bold leading-tight block">{style.label}</span>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-normal font-normal">
                    {style.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TOMBOL GENERATE UTAMA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={executeGeneratePresentation}
            disabled={isGenerating}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all cursor-pointer shadow-lg flex items-center justify-center gap-3 active:scale-[0.99] ${
              isGenerating
                ? 'bg-amber-400 text-white cursor-wait'
                : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white shadow-amber-500/20 hover:shadow-xl'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sedang Menganalisis & Mengunci Struktur 10 Slide...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>GENERATE PROMPT GAMMA (TEPAT 10 SLIDE)</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2">
            ✨ Biaya Generate: 3 Saldo Prompt • Menghasilkan naskah prompt instruksi lengkap & terkunci untuk Gamma AI
          </p>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* AREA HASIL GENERATE PROMPT GAMMA (10 SLIDE PREVIEW & CODE CONTAINER) */}
      {/* ====================================================================== */}
      {generatedResult && (
        <div
          id="gamma-output-container"
          className="mt-10 pt-8 border-t-2 border-amber-200/80 space-y-6 animate-in fade-in duration-300"
        >
          {/* Action Deck Atas */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 sm:p-7 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                <span>Prompt Terstruktur Siap Pakai</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {generatedResult.title}
              </h2>
              <p className="text-xs text-amber-100 max-w-xl">
                Prompt telah dirancang dengan batasan ketat <strong>TEPAT 10 SLIDE</strong>. Salin prompt di bawah ini lalu tempelkan langsung ke Gamma AI untuk menghasilkan slide presentasi otomatis.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
              {onSubmitForm && (
                <button
                  type="button"
                  onClick={handleSaveToProjects}
                  className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  title="Simpan presentasi ini ke daftar proyek pembelajaran"
                >
                  <Bookmark className="w-4 h-4 text-slate-950" />
                  <span>Simpan Proyek</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyGammaPrompt}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-amber-50 text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Copy className="w-4 h-4 text-amber-600" />
                <span>Salin Prompt Gamma</span>
              </button>

              <a
                href="https://gamma.app/new"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpenGammaApp}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                title="Buka situs Gamma AI dan mulai presentasi baru"
              >
                <span>🚀 Buka Gamma</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>
          </div>

          {/* RANCANGAN 10 SLIDE INTERAKTIF (SLIDE-BY-SLIDE OVERVIEW) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Pratinjau Struktur 10 Slide STIVIA</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    10 dari 10 Terisi
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Klik nomor slide di bawah untuk meninjau detail distribusi materi setiap slide:
                </p>
              </div>

              <div className="flex items-center gap-1">
                {onSubmitForm && (
                  <button
                    type="button"
                    onClick={handleSaveToProjects}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                    <span>Simpan Proyek</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={executeGeneratePresentation}
                  disabled={isGenerating}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate (1 Koin)</span>
                </button>
              </div>
            </div>

            {/* Slide Navigation Numbers 1 - 10 */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {generatedResult.slides.map((s, idx) => (
                <button
                  key={s.slideNumber}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                    activeSlideIndex === idx
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] block font-mono opacity-80">Slide</span>
                  <span className="text-sm font-extrabold">{s.slideNumber}</span>
                </button>
              ))}
            </div>

            {/* Active Slide Card Display */}
            {generatedResult.slides[activeSlideIndex] && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-amber-200/80 space-y-3 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                      {generatedResult.slides[activeSlideIndex].slideNumber}
                    </span>
                    <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                      {generatedResult.slides[activeSlideIndex].type}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {generatedResult.slides[activeSlideIndex].subtitle}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {generatedResult.slides[activeSlideIndex].title}
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {generatedResult.slides[activeSlideIndex].keyPoints.map((pt, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 flex flex-col sm:flex-row gap-2 border-t border-slate-200">
                  <div>
                    <strong className="text-slate-700">Panduan Tata Letak:</strong>{' '}
                    {generatedResult.slides[activeSlideIndex].layoutGuidance}
                  </div>
                  <div>
                    <strong className="text-slate-700">Visual Asset:</strong>{' '}
                    {generatedResult.slides[activeSlideIndex].visualGuidance}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CODE / TEXT CONTAINER PROMPT GAMMA AI */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4 text-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                  Naskah Prompt Gamma AI (Siap Salin)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyGammaPrompt}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Naskah</span>
                </button>
                <a
                  href="https://gamma.app/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOpenGammaApp}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <span>Buka Gamma</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
              </div>
            </div>

            {/* Code Box Display */}
            <div className="relative">
              <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed selection:bg-amber-500 selection:text-black">
                {generatedResult.gammaPrompt}
              </pre>
            </div>

            {/* Checklist Validasi Kepatuhan Gamma */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
              <span className="text-[11px] font-bold text-amber-400 block uppercase tracking-wider">
                ✓ Protokol Penguncian Gamma Aktif:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Klausul "EXACTLY 10 SLIDES" disematkan tegas.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Larangan Slide 11 & materi tambahan aktif.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Batas materi terkunci pada Single Source of Truth.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Checklist verifikasi akhir otomatis sebelum eksekusi.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TOAST NOTIFIKASI */}
      {/* ====================================================================== */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL LIMIT SALDO / TOP UP WHATSAPP */}
      {/* ====================================================================== */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Coins className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Batas Penggunaan Koin Tercapai
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {limitReason || 'Saldo koin akun Anda telah habis untuk periode saat ini.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block">Pilihan Paket Koin Pendidik:</span>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                {PROMPT_PACKAGES.map((pkg) => (
                  <li key={pkg.id} className="flex items-center justify-between">
                    <span>{pkg.name} ({pkg.prompts} Koin)</span>
                    <span className="font-bold text-amber-700">{pkg.priceLabel}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <a
                href={getWhatsAppTopUpUrl({
                  planName: 'Paket Pendidik Presentasi',
                  prompts: 50,
                  priceLabel: 'Top Up Koin STIVIA'
                })}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
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
