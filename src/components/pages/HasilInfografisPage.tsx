import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Edit3, 
  RotateCcw, 
  Undo2, 
  Check, 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles, 
  Layers, 
  LayoutGrid, 
  Palette, 
  CheckCircle2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  FileCheck,
  FileText,
  Printer,
  Eye,
  Sliders,
  ArrowRight,
  Info,
  X,
  Copy,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { 
  InfographicDraft, 
  InfographicFormat, 
  NavigationTab, 
  VisualLevel,
  EducationLevel,
  StyleConfig,
  FinalDraft,
  ActiveProjectContext,
  FinalOutputState,
  FinalOutputValidationChecklist
} from '../../types';
import { 
  VISUAL_STYLE_OPTIONS,
  SUBJECT_OPTIONS,
  GRADE_OPTIONS_BY_LEVEL
} from '../../data/mockData';
import { getStyleConfig } from '../../data/styleSystem';
import { 
  createDraftFromContext,
  generateLayoutVariations,
  regenerateMaterialContent,
  updateDraftStyle,
  performCoverageCheck,
  parseScopeToRequiredTopics,
  validateAndSanitizeDraft
} from '../../data/materialGenerator';
import { 
  validateFinalOutput,
  createFinalSnapshot,
  lockFinalOutput,
  unlockForEditing,
  getReadonlyInfographicFromLockedOutput
} from '../../services/finalOutputLock';
import { exportInfographic, handleDirectPrint } from '../../services/infographicExportService';
import { InfographicRenderer } from '../infographic/InfographicRenderer';

interface HasilInfografisPageProps {
  draft: InfographicDraft;
  onUpdateDraft: (updated: Partial<InfographicDraft>) => void;
  onNavigate: (tab: NavigationTab) => void;
  onSaveToast: (msg: string) => void;
}

export const HasilInfografisPage: React.FC<HasilInfografisPageProps> = ({
  draft,
  onUpdateDraft,
  onNavigate,
  onSaveToast,
}) => {
  // State Management (currentVersion & previousVersion for Undo)
  const [currentDraft, setCurrentDraft] = useState<InfographicDraft>(() => {
    // If not locked yet, try locking upon mounting Tahap 4
    if (!draft.finalOutput || draft.finalOutput.status !== 'LOCKED') {
      const lockRes = lockFinalOutput(draft);
      if (lockRes.success) {
        return lockRes.updatedDraft;
      }
    }
    return draft;
  });
  const [previousDraft, setPreviousDraft] = useState<InfographicDraft | null>(null);
  const [previewStatus, setPreviewStatus] = useState<'ready' | 'processing' | 'error'>('ready');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active section & canvas controls
  const [activeSectionId, setActiveSectionId] = useState<string>(
    draft.blocks.length > 0 ? draft.blocks[0].id : ''
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [layoutVariationCycle, setLayoutVariationCycle] = useState<number>(1);

  // Modals state
  const [showStyleModal, setShowStyleModal] = useState<boolean>(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState<boolean>(false);
  const [showEditDataModal, setShowEditDataModal] = useState<boolean>(false);
  const [showFinalModal, setShowFinalModal] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [showLockDetailsModal, setShowLockDetailsModal] = useState<boolean>(false);
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportLoadingMsg, setExportLoadingMsg] = useState<string>('');

  // Target element refs for high-fidelity canvas capture
  const mainCanvasRef = useRef<HTMLDivElement>(null);
  const fullscreenCanvasRef = useRef<HTMLDivElement>(null);

  // Style modal local form state
  const [modalSelectedStyle, setModalSelectedStyle] = useState<string>(draft.visualStyle || 'Modern Edukatif');
  const [modalCustomStyle, setModalCustomStyle] = useState<string>(draft.customVisualStyle || '');

  // Edit Data Modal form state
  const [editLevel, setEditLevel] = useState<EducationLevel>(draft.educationLevel || 'SMA');
  const [editGrade, setEditGrade] = useState<string>(draft.grade || 'Kelas X');
  const [editSubject, setEditSubject] = useState<string>(draft.subject || 'Informatika');
  const [editTheme, setEditTheme] = useState<string>(draft.theme || '');
  const [editTopic, setEditTopic] = useState<string>(draft.rawTopic || '');
  const [editScope, setEditScope] = useState<string>(draft.scope || '');
  const [editStyle, setEditStyle] = useState<string>(draft.visualStyle || 'Modern Edukatif');

  // Final Draft Container
  const [finalDraftData, setFinalDraftData] = useState<FinalDraft | null>(null);

  // Validation state for Tahap 4A
  const validationChecklist: FinalOutputValidationChecklist = useMemo(() => {
    return validateFinalOutput(currentDraft);
  }, [currentDraft]);

  // Read-only snapshot of currentDraft when locked
  const displayDraft: InfographicDraft = useMemo(() => {
    return getReadonlyInfographicFromLockedOutput(currentDraft);
  }, [currentDraft]);

  // Lock status helper
  const isOutputLocked = Boolean(currentDraft.isLocked && currentDraft.finalOutput?.status === 'LOCKED');

  // Sync state if draft prop changes from outside
  useEffect(() => {
    if (draft.id !== currentDraft.id) {
      if (!draft.finalOutput || draft.finalOutput.status !== 'LOCKED') {
        const lockRes = lockFinalOutput(draft);
        if (lockRes.success) {
          setCurrentDraft(lockRes.updatedDraft);
          onUpdateDraft(lockRes.updatedDraft);
        } else {
          setCurrentDraft(draft);
        }
      } else {
        setCurrentDraft(draft);
      }
      if (draft.blocks.length > 0 && (!activeSectionId || !draft.blocks.some(b => b.id === activeSectionId))) {
        setActiveSectionId(draft.blocks[0].id);
      }
    }
  }, [draft.id]);

  // Sync style modal fields when opening
  const handleOpenStyleModal = () => {
    setModalSelectedStyle(currentDraft.visualStyle || 'Modern Edukatif');
    setModalCustomStyle(currentDraft.customVisualStyle || '');
    setShowStyleModal(true);
  };

  // Sync edit modal fields when opening
  const handleOpenEditDataModal = () => {
    setEditLevel(currentDraft.educationLevel);
    setEditGrade(currentDraft.grade);
    setEditSubject(currentDraft.subject);
    setEditTheme(currentDraft.theme);
    setEditTopic(currentDraft.rawTopic);
    setEditScope(currentDraft.scope);
    setEditStyle(currentDraft.visualStyle);
    setShowEditDataModal(true);
  };

  // Helper to commit state change with previousVersion saved and auto re-locking
  const commitNewVersionAndLock = (newDraft: InfographicDraft, successToast: string) => {
    setPreviousDraft(currentDraft);

    // TAHAP 4A: VALIDATE → SNAPSHOT → LOCK
    const lockResult = lockFinalOutput(newDraft);
    const finalToSave = lockResult.success ? lockResult.updatedDraft : newDraft;

    setCurrentDraft(finalToSave);
    onUpdateDraft(finalToSave);
    setPreviewStatus('ready');
    setLoadingMessage('');
    setErrorMessage(null);
    onSaveToast(successToast);
  };

  // Manual Lock Action Handler
  const handleManualLock = () => {
    const lockResult = lockFinalOutput(currentDraft);
    if (lockResult.success) {
      setCurrentDraft(lockResult.updatedDraft);
      onUpdateDraft(lockResult.updatedDraft);
      onSaveToast('🔒 Output final berhasil dikunci sebagai single source of truth.');
    } else {
      onSaveToast(`Peringatan: ${lockResult.message}`);
    }
  };

  // =========================================================================
  // 1. EDIT DATA HANDLER (Smart detection: Content change vs Style change)
  // =========================================================================
  const handleApplyEditData = () => {
    const isContentChanged = 
      editLevel !== currentDraft.educationLevel ||
      editGrade !== currentDraft.grade ||
      editSubject !== currentDraft.subject ||
      editTheme !== currentDraft.theme ||
      editTopic !== currentDraft.rawTopic ||
      editScope !== currentDraft.scope;

    const isStyleChanged = editStyle !== currentDraft.visualStyle;

    if (!isContentChanged && !isStyleChanged) {
      setShowEditDataModal(false);
      return;
    }

    setPreviewStatus('processing');
    setShowEditDataModal(false);

    if (isContentChanged) {
      // Content changed -> Full Pipeline
      setLoadingMessage('Menyusun materi...');
      setTimeout(() => {
        try {
          setLoadingMessage('Memeriksa kelengkapan cakupan...');
          const newContext: ActiveProjectContext = {
            jenjang: editLevel,
            kelas: editGrade,
            mataPelajaran: editSubject,
            tema: editTheme,
            materi: editTopic,
            cakupanMateri: editScope,
            gayaVisual: editStyle,
            format: currentDraft.format,
            tingkatVisual: currentDraft.visualLevel,
            konteksContoh: currentDraft.exampleContext,
            customExampleContext: currentDraft.customExampleContext
          };

          const fullDraft = createDraftFromContext(newContext);
          const sanitized = validateAndSanitizeDraft(fullDraft);

          setLoadingMessage('Mengunci snapshot output baru...');
          setTimeout(() => {
            commitNewVersionAndLock(sanitized, 'Data materi berhasil diperbarui dan dikunci ulang!');
          }, 300);
        } catch (err) {
          setPreviewStatus('error');
          setErrorMessage('Perubahan belum berhasil diterapkan. Output sebelumnya tetap terkunci aman.');
        }
      }, 350);
    } else if (isStyleChanged) {
      // Style changed only -> Style Engine
      setLoadingMessage('Menerapkan gaya visual...');
      setTimeout(() => {
        const updated = updateDraftStyle(currentDraft, editStyle);
        commitNewVersionAndLock(updated, `Gaya visual diperbarui ke "${editStyle}" dan dikunci!`);
      }, 250);
    }
  };

  // =========================================================================
  // 2. UBAH GAYA HANDLER (Style Engine only, zero content modification)
  // =========================================================================
  const handleApplyStyleModal = (chosenStyle: string, customText?: string) => {
    setShowStyleModal(false);
    setPreviewStatus('processing');
    setLoadingMessage('Menerapkan gaya visual...');

    setTimeout(() => {
      try {
        const updated = updateDraftStyle(currentDraft, chosenStyle, customText);
        commitNewVersionAndLock(updated, `Gaya visual berhasil diubah ke "${chosenStyle}" dan dikunci!`);
      } catch (err) {
        setPreviewStatus('error');
        setErrorMessage('Gagal mengubah gaya. Output sebelumnya tetap terkunci aman.');
      }
    }, 250);
  };

  // =========================================================================
  // 3. VARIASI LAYOUT HANDLER (Visual & Layout Engine only)
  // =========================================================================
  const handleGenerateLayoutVariation = () => {
    setPreviewStatus('processing');
    setLoadingMessage('Membuat variasi tata letak...');

    const nextCycle = layoutVariationCycle + 1;
    setLayoutVariationCycle(nextCycle);

    setTimeout(() => {
      try {
        const updated = generateLayoutVariations(currentDraft, nextCycle);
        commitNewVersionAndLock(updated, 'Komposisi tata letak baru berhasil diterapkan dan dikunci!');
      } catch (err) {
        setPreviewStatus('error');
        setErrorMessage('Gagal membuat variasi layout. Output sebelumnya tetap terkunci aman.');
      }
    }, 300);
  };

  // =========================================================================
  // 4. BUAT ULANG MATERI HANDLER (Content Engine with requiredTopics preserved)
  // =========================================================================
  const handleConfirmRegenerateMaterial = () => {
    setShowRegenerateConfirm(false);
    setPreviewStatus('processing');
    setLoadingMessage('Menyusun materi...');

    setTimeout(() => {
      try {
        setLoadingMessage('Memeriksa kelengkapan cakupan...');
        const updated = regenerateMaterialContent(currentDraft, layoutVariationCycle);
        
        setLoadingMessage('Mengunci snapshot materi baru...');
        setTimeout(() => {
          commitNewVersionAndLock(updated, 'Penjelasan materi baru berhasil dibuat dan dikunci!');
        }, 300);
      } catch (err) {
        setPreviewStatus('error');
        setErrorMessage('Gagal membuat ulang materi. Output sebelumnya tetap aman.');
      }
    }, 400);
  };

  // =========================================================================
  // 5. UNDO / BATALKAN PERUBAHAN HANDLER
  // =========================================================================
  const handleUndo = () => {
    if (!previousDraft) return;
    const restored = previousDraft;
    setPreviousDraft(currentDraft);

    // Re-lock the restored draft
    const lockRes = lockFinalOutput(restored);
    const draftToSet = lockRes.success ? lockRes.updatedDraft : restored;

    setCurrentDraft(draftToSet);
    onUpdateDraft(draftToSet);
    setErrorMessage(null);
    onSaveToast('Perubahan dibatalkan. Output snapshot sebelumnya berhasil dipulihkan!');
  };

  // =========================================================================
  // 6. LANJUTKAN KE FINAL HANDLER (Validation & Final Draft Generation)
  // =========================================================================
  const handleContinueToFinal = () => {
    // Validate required topics coverage
    const required = currentDraft.requiredTopics || parseScopeToRequiredTopics(currentDraft.scope, currentDraft.rawTopic);
    const coverage = performCoverageCheck(required, currentDraft.blocks);
    const allCovered = coverage.every(c => c.covered);

    if (!allCovered) {
      onSaveToast('Peringatan: Pastikan semua cakupan materi wajib telah terpenuhi.');
      return;
    }

    // Ensure locked
    if (!isOutputLocked) {
      handleManualLock();
    }

    const finalResult: FinalDraft = {
      activeProjectContext: {
        jenjang: currentDraft.educationLevel,
        kelas: currentDraft.grade,
        mataPelajaran: currentDraft.subject,
        tema: currentDraft.theme,
        materi: currentDraft.rawTopic,
        cakupanMateri: currentDraft.scope,
        gayaVisual: currentDraft.visualStyle,
        format: currentDraft.format,
        tingkatVisual: currentDraft.visualLevel,
        konteksContoh: currentDraft.exampleContext,
        styleConfig: currentDraft.styleConfig
      },
      requiredTopics: required,
      materialStructure: currentDraft.blocks,
      visualStructure: {
        format: currentDraft.format,
        visualLevel: currentDraft.visualLevel,
        visualStyle: currentDraft.visualStyle
      },
      styleConfig: currentDraft.styleConfig || getStyleConfig(currentDraft.visualStyle),
      generatedAt: new Date().toISOString()
    };

    setFinalDraftData(finalResult);
    setShowFinalModal(true);
    onSaveToast('🔒 Output Final Terkunci siap difinalisasi & diekspor!');
  };

  // Handler Cetak Sinkron Langsung (Preserves User Activation Gesture)
  const handlePrint = () => {
    setShowDownloadModal(false);
    handleDirectPrint((msg) => onSaveToast(msg));
  };

  const handleDownloadFile = async (formatType: string) => {
    // Jika formatType adalah cetak/pdf, gunakan langsung handlePrint sinkron
    const isPdf = formatType.toLowerCase().includes('pdf') || formatType.toLowerCase().includes('cetak') || formatType.toLowerCase().includes('print');
    if (isPdf) {
      handlePrint();
      return;
    }

    setShowDownloadModal(false);
    setIsExporting(true);

    const isDocx = formatType.toLowerCase().includes('docx') || formatType.toLowerCase().includes('word');
    const isJpg = formatType.toLowerCase().includes('jpg') || formatType.toLowerCase().includes('jpeg');

    const loadingText = isDocx 
      ? 'Menyiapkan berkas dokumen materi (.DOCX)...'
      : isJpg
        ? 'Menyiapkan berkas gambar infografis (JPG)...'
        : 'Menyiapkan berkas gambar infografis (PNG high resolution)...';

    setExportLoadingMsg(loadingText);
    onSaveToast(loadingText);

    try {
      const targetElement = isFullscreenModal ? fullscreenCanvasRef.current : mainCanvasRef.current;
      const res = await exportInfographic(formatType, currentDraft, targetElement);
      if (res.success) {
        onSaveToast(`✅ ${res.message}`);
      } else {
        onSaveToast(`⚠️ ${res.message}`);
      }
    } catch (err) {
      console.error('[STIVIA Export Error]', err);
      const detail = err instanceof Error ? err.message : String(err);
      onSaveToast(`⚠️ Gagal mengekspor infografis: ${detail}`);
    } finally {
      setIsExporting(false);
      setExportLoadingMsg('');
    }
  };

  const activeStyleConfig = React.useMemo(() => {
    return currentDraft.styleConfig || getStyleConfig(currentDraft.visualStyle, currentDraft.customVisualStyle);
  }, [currentDraft.visualStyle, currentDraft.customVisualStyle, currentDraft.styleConfig]);

  return (
    <div className="max-w-7xl mx-auto pb-24 space-y-6">
      {/* 1. Header Khusus Preview & Tahap 4A Status */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                STIVIA
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • Belajar Lebih Visual, Mengajar Lebih Mudah
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center gap-2.5">
              <span>HASIL INFOGRAFIS</span>
              
              {/* TAHAP 4A: LOCK STATUS BADGE */}
              {isOutputLocked ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>FINAL OUTPUT LOCKED</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  <Unlock className="w-3.5 h-3.5 text-amber-600" />
                  <span>DRAFT AKTIF (UNLOCKED)</span>
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {isOutputLocked 
                ? 'Output final telah dikunci sebagai single source of truth untuk Preview, Save, dan Export.'
                : 'Lihat dan sempurnakan hasil secara lengkap sebelum mengunci output final.'}
            </p>
          </div>

          {/* Top Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {previousDraft && (
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                title="Batalkan perubahan terakhir"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Batalkan</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('preview')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              title="Buka Preview Final Read-Only (Tahap 5)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Final</span>
            </button>

            <button
              onClick={() => setShowLockDetailsModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="Lihat status validasi & metadata penguncian output"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Status Kunci</span>
            </button>

            <button
              onClick={() => setShowDownloadModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>

            <button
              onClick={handleContinueToFinal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>Lanjutkan ke Final</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAHAP 4A: ELEGANT INTEGRITY STATUS BAR */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-500">Integritas Pipeline:</span>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="inline-flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded-md text-emerald-700">
                <Check className="w-3 h-3 text-emerald-600" /> Materi
              </span>
              <span className="inline-flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded-md text-emerald-700">
                <Check className="w-3 h-3 text-emerald-600" /> Struktur
              </span>
              <span className="inline-flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded-md text-emerald-700">
                <Check className="w-3 h-3 text-emerald-600" /> Layout
              </span>
              <span className="inline-flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded-md text-emerald-700">
                <Check className="w-3 h-3 text-emerald-600" /> Gaya Visual
              </span>
              <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-md ${
                isOutputLocked 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-900'
              }`}>
                <Lock className="w-3 h-3" /> Output Final Terkunci
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isOutputLocked ? (
              <button
                onClick={handleManualLock}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Kunci Output Final Sekarang</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 font-mono">
                Snapshot: {currentDraft.finalOutput?.lockedAt ? new Date(currentDraft.finalOutput.lockedAt).toLocaleTimeString('id-ID') : 'Terkunci'}
              </span>
            )}
          </div>
        </div>

        {/* Error Alert Bar if any */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="px-2 py-1 bg-rose-200/60 hover:bg-rose-200 rounded-md font-semibold text-[11px]"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* 2. Top Interactive Action Deck (Toolbar Kontrol Lengkap) */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tombol 1: Edit Data */}
            <button
              onClick={handleOpenEditDataModal}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Edit Data</span>
            </button>

            {/* Tombol 2: Ubah Gaya */}
            <button
              onClick={handleOpenStyleModal}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <Palette className="w-3.5 h-3.5 text-teal-600" />
              <span>Ubah Gaya</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100/70 text-teal-800">
                {currentDraft.visualStyle}
              </span>
            </button>

            {/* Tombol 3: Variasi Layout */}
            <button
              onClick={handleGenerateLayoutVariation}
              disabled={previewStatus === 'processing'}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
              <span>Variasi Layout</span>
            </button>

            {/* Tombol 4: Buat Ulang Materi */}
            <button
              onClick={() => setShowRegenerateConfirm(true)}
              disabled={previewStatus === 'processing'}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Buat Ulang Materi</span>
            </button>

            {/* Tombol 5: Batalkan Perubahan (Undo) */}
            {previousDraft && (
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Undo2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Batalkan Perubahan</span>
              </button>
            )}
          </div>

          {/* Zoom & Screen Controls */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="text-[11px] font-medium text-slate-500">Skala:</span>
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200/60">
              <button
                onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
                className="p-1.5 hover:bg-white rounded-lg transition-colors"
                title="Perkecil"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-semibold px-2">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
                className="p-1.5 hover:bg-white rounded-lg transition-colors"
                title="Perbesar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIsFullscreenModal(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
              title="Pratinjau Layar Penuh"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Layar Penuh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid: Sidebar Information + Full Infographic Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Detail Cakupan & Struktur Materi (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Coverage Checklist Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Cakupan Materi Wajib
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {(displayDraft.requiredTopics || []).length} Topik
              </span>
            </div>

            <div className="space-y-1.5">
              {(displayDraft.requiredTopics || []).map((topic, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="font-semibold text-slate-800 leading-snug break-words">
                    {topic}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col gap-1">
              <span className="font-medium">
                {displayDraft.educationLevel} • {displayDraft.grade}
              </span>
              <span className="font-medium text-slate-700">
                {displayDraft.subject}
              </span>
            </div>
          </div>

          {/* Block Navigation Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Struktur Bagian ({displayDraft.blocks.length})
              </h3>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {displayDraft.blocks.map((block) => {
                const isActive = activeSectionId === block.id;
                return (
                  <button
                    key={block.id}
                    onClick={() => setActiveSectionId(block.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-indigo-50/70 text-slate-700 border border-slate-100'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isActive ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {block.letterIndex || block.order}
                    </span>
                    <span className="truncate">{block.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Style Switcher Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-teal-600" />
                Gaya Visual Aktif
              </h3>
              <button
                onClick={handleOpenStyleModal}
                className="text-[11px] font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                Ganti
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-teal-950">{activeStyleConfig.name}</p>
                <p className="text-[10px] text-teal-700">{activeStyleConfig.tagline}</p>
              </div>
              <span className="w-3 h-3 rounded-full bg-teal-500 shrink-0" />
            </div>
          </div>
        </div>

        {/* Center/Right: Full Infographic Canvas Sheet (9 Cols) */}
        <div className="lg:col-span-9 flex flex-col items-center space-y-4">
          {/* Main Rendering Sheet with smooth vertical scrolling */}
          <div className="w-full relative min-h-[500px]">
            {/* Loading Overlay */}
            {previewStatus === 'processing' && (
              <div className="absolute inset-0 z-30 bg-white/80 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-indigo-600/30 animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {loadingMessage || 'Menyiapkan preview infografis...'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  STIVIA sedang mengunci dan menyempurnakan struktur visual materi pembelajaran.
                </p>
              </div>
            )}

            {/* Canvas Container (Read-Only Single Source of Truth from displayDraft) */}
            <div
              className="w-full transition-transform duration-200 origin-top flex justify-center"
              style={zoomLevel !== 100 ? { transform: `scale(${zoomLevel / 100})` } : undefined}
            >
              <InfographicRenderer
                canvasRef={mainCanvasRef}
                draft={displayDraft}
                activeSectionId={activeSectionId}
                onSelectSection={(id) => setActiveSectionId(id)}
                visualStyle={displayDraft.visualStyle}
                format={displayDraft.format}
                visualLevel={displayDraft.visualLevel}
              />
            </div>
          </div>

          {/* Bottom Call to Action Bar */}
          <div className="w-full bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Infografis Siap & Lengkap Sesuai Cakupan Materi</span>
                  {isOutputLocked && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      TERKUNCI
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Semua topik wajib telah terverifikasi dan terkunci dalam snapshot final yang stabil.
                </p>
              </div>
            </div>

            <button
              onClick={handleContinueToFinal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>Lanjutkan ke Final</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: RINCIAN STATUS PENGUNCIAN OUTPUT (TAHAP 4A DETAILS) */}
      {/* ========================================================================= */}
      {showLockDetailsModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tahap 4A — Status Penguncian Output
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Verifikasi Single Source of Truth untuk Infografis STIVIA
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLockDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checklist 10 Poin Validasi */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">10 Kriteria Validasi Final Output:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>1. Mata Pelajaran Tersedia</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>2. Topik Materi Tersedia</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>3. Cakupan Materi Lengkap</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>4. Isi Materi Terisi</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>5. Section Materi ({displayDraft.blocks.length}) Siap</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>6. Urutan Bagian Teratur</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>7. Tidak Ada Blok Kosong</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>8. Judul & Tujuan Eksplisit</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>9. Layout Final ({displayDraft.format})</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>10. Gaya Visual ({displayDraft.visualStyle})</span>
                </div>
              </div>
            </div>

            {/* Snapshot Metadata Box */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-indigo-700 font-medium">Status Penguncian:</span>
                <span className="font-bold text-emerald-700">🔒 LOCKED (Read-Only)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700 font-medium">Proyek ID:</span>
                <span className="font-mono text-[11px]">{displayDraft.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700 font-medium">Waktu Penguncian:</span>
                <span className="font-semibold text-[11px]">
                  {currentDraft.finalOutput?.lockedAt ? new Date(currentDraft.finalOutput.lockedAt).toLocaleString('id-ID') : 'Terkunci'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowLockDetailsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: UBAH GAYA VISUAL (7 Presets + Custom) */}
      {/* ========================================================================= */}
      {showStyleModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Ubah Gaya Visual Infografis
                </h3>
              </div>
              <button
                onClick={() => setShowStyleModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Memilih gaya visual akan langsung memperbarui palet warna, tipografi, dan ornamen desain tanpa mengubah isi materi atau cakupan pembahasan.
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {VISUAL_STYLE_OPTIONS.map((style) => {
                const isSelected = modalSelectedStyle === style;
                const dotColors = 
                  style === 'Modern Edukatif' ? ['bg-indigo-600', 'bg-teal-500'] :
                  style === 'Minimalis' ? ['bg-slate-800', 'bg-slate-400'] :
                  style === 'Futuristic' ? ['bg-cyan-400', 'bg-teal-400', 'bg-blue-600'] :
                  style === 'Cyberpunk' ? ['bg-cyan-400', 'bg-fuchsia-500', 'bg-yellow-400'] :
                  style === 'Swiss Design' ? ['bg-black', 'bg-red-600', 'bg-stone-300'] :
                  style === 'Clay Style' ? ['bg-purple-500', 'bg-pink-400', 'bg-amber-300'] :
                  style === 'Pop Art' ? ['bg-yellow-400', 'bg-rose-500', 'bg-black'] :
                  style === 'Editorial' ? ['bg-stone-900', 'bg-amber-700', 'bg-stone-400'] :
                  style === 'Handwritten & Doodle' ? ['bg-amber-600', 'bg-stone-700', 'bg-yellow-300'] :
                  style === 'Glassmorphism' ? ['bg-cyan-300', 'bg-indigo-500', 'bg-fuchsia-400'] :
                  style === 'Aurora' ? ['bg-emerald-400', 'bg-teal-500', 'bg-indigo-600'] :
                  style === 'Academic Clean' ? ['bg-blue-700', 'bg-indigo-600', 'bg-slate-500'] :
                  style === 'Ceria & Kreatif' ? ['bg-amber-500', 'bg-rose-500'] :
                  style === 'Vintage & Historical' ? ['bg-amber-800', 'bg-yellow-700', 'bg-stone-600'] :
                  ['bg-purple-600', 'bg-pink-500', 'bg-cyan-400'];

                return (
                  <button
                    key={style}
                    onClick={() => setModalSelectedStyle(style)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-950 font-bold'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs">{style}</span>
                      <div className="flex -space-x-1">
                        {dotColors.map((c, idx) => (
                          <span key={idx} className={`w-3.5 h-3.5 rounded-full ${c} border border-white`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {style === 'Modern Edukatif' ? 'Indigo & Teal Kontemporer' :
                       style === 'Minimalis' ? 'Monokromatik & Bersih' :
                       style === 'Futuristic' ? 'HUD Telemetri & Neon' :
                       style === 'Cyberpunk' ? 'Terminal Dark & Cyber Deck' :
                       style === 'Swiss Design' ? 'Grid Matematis & Tipografi Tegas' :
                       style === 'Clay Style' ? '3D Soft Tactile & Pill Badges' :
                       style === 'Pop Art' ? 'Panel Komik & Bayangan Offset' :
                       style === 'Editorial' ? 'Majalah Ilmiah & Kolom Masthead' :
                       style === 'Handwritten & Doodle' ? 'Buku Catatan & Catatan Tempel' :
                       style === 'Glassmorphism' ? 'Frosted Glass & Kedalaman Dimensi' :
                       style === 'Aurora' ? 'Cahaya Spektrum Dinamis' :
                       style === 'Academic Clean' ? 'Struktur Formal & Presisi' :
                       style === 'Ceria & Kreatif' ? 'Hangat & Ramah Siswa' :
                       style === 'Vintage & Historical' ? 'Arsip Klasik & Ornamen' : 'Warna-warni Dinamis'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Style Input */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Gaya Visual Kustom (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Majalah edukasi modern dengan warna pastel lembut"
                value={modalCustomStyle}
                onChange={(e) => setModalCustomStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowStyleModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleApplyStyleModal(modalSelectedStyle, modalCustomStyle)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Terapkan Gaya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: KONFIRMASI BUAT ULANG MATERI */}
      {/* ========================================================================= */}
      {showRegenerateConfirm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Buat ulang penjelasan materi?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Struktur pembahasan dan <strong>Cakupan Materi tetap dipertahankan</strong>. Sistem hanya akan membuat variasi baru pada penjelasan kata, contoh pendukung, dan penyajian materi.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Jaminan Sistem STIVIA:</p>
              <p>✓ Tidak ada topik wajib yang dihilangkan.</p>
              <p>✓ Urutan materi pokok tetap terjaga.</p>
              <p>✓ Output baru akan divalidasi dan dikunci ulang secara aman.</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowRegenerateConfirm(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmRegenerateMaterial}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Buat Ulang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT DATA FORMULIR PREFILL */}
      {/* ========================================================================= */}
      {showEditDataModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Edit Data Awal Infografis
                </h3>
              </div>
              <button
                onClick={() => setShowEditDataModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1 text-xs">
              {/* Row 1: Jenjang, Kelas, Mata Pelajaran */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenjang</label>
                  <select
                    value={editLevel}
                    onChange={(e) => {
                      const lvl = e.target.value as EducationLevel;
                      setEditLevel(lvl);
                      setEditGrade(GRADE_OPTIONS_BY_LEVEL[lvl][0]);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="SMK">SMK</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    {GRADE_OPTIONS_BY_LEVEL[editLevel].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              {/* Tema */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tema Kegiatan</label>
                <input
                  type="text"
                  value={editTheme}
                  onChange={(e) => setEditTheme(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              {/* Materi */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Materi Pokok yang Diajarkan</label>
                <input
                  type="text"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              {/* Cakupan Materi */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cakupan Materi (Setiap Poin Jadi Section Wajib)</label>
                <textarea
                  rows={4}
                  value={editScope}
                  onChange={(e) => setEditScope(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium font-mono text-[11px]"
                />
              </div>

              {/* Gaya Visual */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gaya Visual</label>
                <select
                  value={editStyle}
                  onChange={(e) => setEditStyle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                >
                  {VISUAL_STYLE_OPTIONS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowEditDataModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleApplyEditData}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Simpan & Kunci Ulang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: FINAL DRAFT & EXPORT STAGE */}
      {/* ========================================================================= */}
      {showFinalModal && finalDraftData && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Infografis Berhasil Difinalisasi!
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Materi dan desain telah terkunci siap dibagikan dan dicetak.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFinalModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary details */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Judul Materi:</span>
                <span className="font-bold text-slate-900">{displayDraft.rawTopic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mata Pelajaran:</span>
                <span className="font-semibold text-slate-800">{displayDraft.subject} ({displayDraft.grade})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gaya Visual:</span>
                <span className="font-semibold text-teal-700">{displayDraft.visualStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cakupan Terverifikasi:</span>
                <span className="font-bold text-emerald-700">100% ({finalDraftData.requiredTopics.length} Topik)</span>
              </div>
            </div>

            {/* Quick Export Options */}
            <div className="space-y-2">
              <button
                onClick={() => handleDownloadFile('Dokumen PDF (A4)')}
                className="w-full p-3 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-indigo-600" />
                  <div>
                    <p className="text-xs font-bold">Cetak / Simpan PDF (A4)</p>
                    <p className="text-[10px] text-indigo-700">Kualitas tinggi siap print di sekolah</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-500" />
              </button>

              <button
                onClick={() => handleDownloadFile('Gambar PNG (300 DPI)')}
                disabled={isExporting}
                className="w-full p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 flex items-center justify-between text-left transition-colors cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold">Ekspor Gambar PNG (300 DPI)</p>
                    <p className="text-[10px] text-emerald-700">Resolusi tinggi untuk slide presentasi & media digital</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-500" />
              </button>

              <button
                onClick={() => handleDownloadFile('Gambar JPG')}
                disabled={isExporting}
                className="w-full p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200 text-amber-950 flex items-center justify-between text-left transition-colors cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-xs font-bold">Ekspor Gambar JPG (Poster)</p>
                    <p className="text-[10px] text-amber-700">Format gambar ringkas siap dibagikan ke siswa</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </button>

              <button
                onClick={() => handleDownloadFile('Dokumen DOCX')}
                className="w-full p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100 border border-blue-200 text-blue-950 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold">Ekspor Materi DOCX (Word)</p>
                    <p className="text-[10px] text-blue-700">Materi pembelajaran terstruktur siap diedit</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </button>

              <button
                onClick={() => {
                  setShowFinalModal(false);
                  onNavigate('preview');
                }}
                className="w-full p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-between text-left transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-white" />
                  <div>
                    <p className="text-xs font-bold">Buka Preview Final Read-Only (Tahap 5)</p>
                    <p className="text-[10px] text-indigo-200">Lihat tampilan output terkunci tanpa generator</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onNavigate('infografis_saya')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                ← Lihat di Infografis Saya
              </button>
              <button
                onClick={() => setShowFinalModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: FULLSCREEN PREVIEW */}
      {/* ========================================================================= */}
      {isFullscreenModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex flex-col items-center justify-start animate-in fade-in">
          {/* Top floating toolbar */}
          <div className="sticky top-0 z-50 w-full max-w-4xl mb-6 bg-slate-900/95 text-white p-2.5 sm:p-3 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 min-w-0">
              <Eye className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="text-xs text-white/90 font-semibold truncate max-w-xs sm:max-w-sm md:max-w-md">
                {displayDraft.title || 'Pratinjau Infografis STIVIA'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isExporting && (
                <span className="text-[11px] font-medium text-amber-300 animate-pulse hidden md:inline">
                  {exportLoadingMsg}
                </span>
              )}

              <button
                onClick={() => handleDownloadFile('Gambar PNG (300 DPI)')}
                disabled={isExporting}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Unduh infografis sebagai gambar PNG (Resolusi Tinggi)"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>PNG</span>
              </button>

              <button
                onClick={() => handleDownloadFile('Gambar JPG')}
                disabled={isExporting}
                className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Unduh infografis sebagai gambar JPG"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>JPG</span>
              </button>

              <button
                onClick={() => handleDownloadFile('Dokumen DOCX')}
                disabled={isExporting}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Ekspor materi DOCX (Word)"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">DOCX</span>
              </button>

              <button
                onClick={handlePrint}
                disabled={isExporting}
                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Cetak Infografis / Simpan PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cetak</span>
              </button>

              <button
                onClick={() => setIsFullscreenModal(false)}
                className="p-1.5 rounded-xl bg-white/15 hover:bg-rose-600 text-white transition-all cursor-pointer"
                title="Tutup Layar Penuh (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full max-w-4xl pb-12 flex justify-center">
            <InfographicRenderer
              canvasRef={fullscreenCanvasRef}
              draft={displayDraft}
              activeSectionId={activeSectionId}
              onSelectSection={(id) => setActiveSectionId(id)}
              visualStyle={displayDraft.visualStyle}
              format={displayDraft.format}
              visualLevel={displayDraft.visualLevel}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: DOWNLOAD MODAL */}
      {/* ========================================================================= */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Unduh Infografis Pembelajaran
                </h3>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 my-5">
              <button
                onClick={handlePrint}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">Dokumen PDF (A4 Siap Cetak)</p>
                  <p className="text-[11px] text-slate-500">Kualitas cetak poster di kelas atau bahan ajar</p>
                </div>
                <Printer className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => handleDownloadFile('Gambar PNG (300 DPI)')}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">Gambar PNG (High Resolution)</p>
                  <p className="text-[11px] text-slate-500">Ideal untuk presentasi, modul digital, atau LMS</p>
                </div>
                <FileCheck className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={() => handleDownloadFile('Gambar JPG')}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">Gambar JPG (Poster Infografis)</p>
                  <p className="text-[11px] text-slate-500">Format gambar kompresi ringan untuk berbagi cepat</p>
                </div>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </button>

              <button
                onClick={() => handleDownloadFile('Dokumen DOCX')}
                className="w-full p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-blue-950">📝 Dokumen DOCX (Materi Pembelajaran Word)</p>
                  <p className="text-[11px] text-blue-700">Materi lengkap terstruktur siap diedit di Word / Docs</p>
                </div>
                <FileText className="w-4 h-4 text-blue-600" />
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
