import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  ShieldCheck, 
  ShieldAlert, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Printer, 
  FileText,
  Sparkles, 
  FolderKanban, 
  Layers, 
  Check, 
  BookOpen, 
  Calendar,
  Eye,
  Info,
  X
} from 'lucide-react';
import { InfographicDraft, NavigationTab } from '../../types';
import { getReadonlyInfographicFromLockedOutput } from '../../services/finalOutputLock';
import { exportMaterialToDocx } from '../../services/docxExportService';
import { InfographicRenderer } from '../infographic/InfographicRenderer';

interface PreviewInfografisPageProps {
  draft: InfographicDraft | null | undefined;
  onNavigate: (tab: NavigationTab) => void;
  onSaveToast?: (msg: string) => void;
}

/**
 * TAHAP 5 — PREVIEW FINAL READ-ONLY
 * 
 * Bertugas HANYA MENAMPILKAN hasil final yang sudah dibuat dan dikunci pada Tahap 4A.
 * 
 * Prinsip:
 * - Single Source of Truth: finalOutput dengan status LOCKED.
 * - WHAT WAS LOCKED = WHAT IS PREVIEWED (WYSIWYG).
 * - Read-Only: Tidak memanggil AI, tidak menjalankan Content/Layout/Visual Engine.
 * - Tidak ada regenerasi otomatis atau modifikasi state diam-diam.
 */
export const PreviewInfografisPage: React.FC<PreviewInfografisPageProps> = ({
  draft,
  onNavigate,
  onSaveToast,
}) => {
  // Pure local UI states (TIDAK mempengaruhi data finalOutput)
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // 1. VALIDASI PREVIEW SEBELUM RENDER:
  // Periksa apakah finalOutput tersedia, status === 'LOCKED', dan memiliki sections data
  const isLockedAndReady = Boolean(
    draft &&
    draft.finalOutput &&
    draft.finalOutput.status === 'LOCKED' &&
    draft.finalOutput.materialSections &&
    draft.finalOutput.materialSections.length > 0 &&
    draft.finalOutput.projectId === draft.id
  );

  // 2. READ-ONLY DATA RESOLVER:
  // Selalu membaca murni dari finalOutput locked snapshot
  const readonlyDraft: InfographicDraft | null = useMemo(() => {
    if (!draft || !isLockedAndReady) return null;
    return getReadonlyInfographicFromLockedOutput(draft);
  }, [draft, isLockedAndReady]);

  // Handle Zoom UI controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 60));
  const handleZoomReset = () => setZoomLevel(100);

  // Handle Print Action
  const handlePrint = () => {
    if (onSaveToast) {
      onSaveToast('Menyiapkan tampilan cetak infografis final...');
    }
    window.print();
  };

  const handleExportDocx = async () => {
    if (onSaveToast) {
      onSaveToast('Menyiapkan dokumen materi DOCX...');
    }
    const res = await exportMaterialToDocx(draft);
    if (onSaveToast) {
      if (res.success) {
        onSaveToast(`✅ ${res.message}`);
      } else {
        onSaveToast(`⚠️ ${res.message}`);
      }
    }
  };

  // =========================================================================
  // KONDISI JIKA OUTPUT BELUM DIKUNCI / BELUM TERSEDIA
  // =========================================================================
  if (!isLockedAndReady || !readonlyDraft) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        {/* Header App */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
            <span>STIVIA</span>
            <span>•</span>
            <span>Belajar Lebih Visual, Mengajar Lebih Mudah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            PREVIEW FINAL READ-ONLY (TAHAP 5)
          </h1>
        </div>

        {/* Empty / Unlocked Notice Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-slate-900">
              Belum Ada Infografis Final yang Terkunci
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tahap 5 bertugas secara murni untuk menampilkan snapshot infografis yang telah diverifikasi dan berstatus <strong className="text-slate-800">LOCKED</strong> pada Tahap 4A.
            </p>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2 text-left">
              💡 <strong>Catatan Integritas STIVIA:</strong> Sistem tidak akan membuat materi otomatis atau memanggil AI generator di halaman Preview untuk menjaga keaslian dan kestabilan data rancangan Anda.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('hasil')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Editor Hasil</span>
            </button>

            <button
              onClick={() => onNavigate('buat')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Buat Infografis Baru</span>
            </button>

            <button
              onClick={() => onNavigate('infografis_saya')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <FolderKanban className="w-4 h-4 text-slate-500" />
              <span>Daftar Proyek Saya</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // KONDISI UTAMA: OUTPUT FINAL TERSEDIA & TERKUNCI (READ-ONLY VIEW)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto pb-24 space-y-6">
      {/* 1. Header Aplikasi & Bar Status Output Final Terkunci */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
              <span className="bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                STIVIA
              </span>
              <span className="text-slate-400 font-normal">
                • Belajar Lebih Visual, Mengajar Lebih Mudah
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center gap-2.5">
              <span>PREVIEW FINAL INFOGRAFIS</span>
              
              {/* TAHAP 5 LOCK BADGE */}
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>OUTPUT FINAL TERKUNCI</span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600">
              Preview menampilkan hasil infografis final yang telah dikunci pada Tahap 4A sebagai <strong className="text-slate-800">single source of truth</strong>.
            </p>
          </div>

          {/* Action Area Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('hasil')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="Kembali ke halaman editor hasil"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              title="Cetak infografis"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            <button
              onClick={handleExportDocx}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200/80 transition-all cursor-pointer"
              title="Ekspor materi terstruktur ke file Word (.DOCX)"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Ekspor DOCX</span>
            </button>

            <button
              onClick={() => setIsFullscreen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/80 transition-all cursor-pointer"
              title="Tampilan layar penuh"
            >
              <Maximize2 className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Layar Penuh</span>
            </button>

            <button
              onClick={() => onNavigate('buat')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buat Baru</span>
            </button>
          </div>
        </div>

        {/* Locked Metadata Snapshot Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-600">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>{readonlyDraft.subject}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
              <span>{readonlyDraft.educationLevel} • {readonlyDraft.grade}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-teal-800 bg-teal-50 border border-teal-200/60 px-2.5 py-1 rounded-lg font-medium">
              <span>Gaya: {readonlyDraft.visualStyle}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-indigo-800 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 rounded-lg font-medium">
              <span>Format: {readonlyDraft.format.toUpperCase()}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>Snapshot ID: {readonlyDraft.id}</span>
            <span>•</span>
            <span>
              {draft.finalOutput?.lockedAt ? new Date(draft.finalOutput.lockedAt).toLocaleTimeString('id-ID') : 'Terkunci'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Preview Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Outline Daftar Bagian Terkunci */}
        <div className="lg:col-span-3 space-y-4">
          {/* Box Cakupan Materi Wajib Terkunci */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Cakupan Materi
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {(readonlyDraft.requiredTopics || []).length} Topik
              </span>
            </div>

            <div className="space-y-1.5">
              {(readonlyDraft.requiredTopics || []).map((topic, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="font-semibold text-slate-800 leading-snug break-words">
                    {topic}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-medium text-slate-700">Tujuan Pembelajaran:</span>
              <p className="mt-1 text-slate-600 leading-relaxed line-clamp-4 text-[11px]">
                {readonlyDraft.learningObjective}
              </p>
            </div>
          </div>

          {/* Navigasi Bagian Terkunci (Local View State Only) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Struktur Bagian ({readonlyDraft.blocks.length})
              </h3>
            </div>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {readonlyDraft.blocks.map((block) => {
                const isActive = activeSectionId === block.id;
                return (
                  <button
                    key={block.id}
                    onClick={() => setActiveSectionId(isActive ? null : block.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-100'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {block.letterIndex || block.order}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-semibold leading-tight">
                        {block.title}
                      </p>
                      <p className={`text-[10px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {block.tag || `Bagian ${block.order}`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Canvas: Pure Read-Only Preview Frame */}
        <div className="lg:col-span-9 space-y-4">
          {/* Zoom & View Controls Floating Bar */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-semibold text-slate-700">Kontrol Tampilan:</span>
              <span className="text-[11px] text-slate-400">
                (Pengaturan zoom murni untuk kenyamanan layar, tidak mengubah output final)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 60}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
                title="Perkecil Tampilan"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold text-slate-700 px-2 py-0.5 rounded-md bg-slate-100 min-w-[50px] text-center font-mono">
                {zoomLevel}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 150}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
                title="Perbesar Tampilan"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={handleZoomReset}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer ml-1"
                title="Reset Ukuran (100%)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Container — Spacious, High Legibility, No Cutoffs */}
          <div className="bg-slate-100/90 rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-inner flex flex-col items-center justify-start min-h-[600px] overflow-x-auto relative">
            <div
              className="w-full transition-transform duration-200 origin-top flex justify-center"
              style={zoomLevel !== 100 ? { transform: `scale(${zoomLevel / 100})` } : undefined}
            >
              {/* Infographic Renderer strictly rendering the locked single source of truth */}
              <InfographicRenderer
                draft={readonlyDraft}
                activeSectionId={activeSectionId}
                onSelectSection={(id) => setActiveSectionId(id)}
                visualStyle={readonlyDraft.visualStyle}
                format={readonlyDraft.format}
                visualLevel={readonlyDraft.visualLevel}
              />
            </div>
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-slate-900">
                  Infografis Final Terkunci Siap Digunakan
                </h4>
                <p className="text-slate-600 text-[11px]">
                  Tampilan WYSIWYG presisi sesuai dengan apa yang telah dikunci pada Tahap 4A.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('infografis_saya')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 shadow-2xs transition-all cursor-pointer"
              >
                Ke Infografis Saya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN MODAL PREVIEW (DISTRACTION-FREE VIEW) */}
      {/* ========================================================================= */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-start p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          {/* Top floating toolbar */}
          <div className="sticky top-0 z-50 w-full max-w-4xl mb-6 bg-slate-900/95 text-white p-2.5 sm:p-3 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] font-bold bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full shrink-0">
                LOCKED OUTPUT
              </span>
              <span className="text-xs text-white/90 font-semibold truncate max-w-xs sm:max-w-sm md:max-w-md">
                {readonlyDraft.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Zoom Controls inside Fullscreen */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 60}
                  className="p-1 rounded-lg hover:bg-white/20 text-white disabled:opacity-40 cursor-pointer"
                  title="Perkecil"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold text-white px-1.5 font-mono min-w-[40px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 150}
                  className="p-1 rounded-lg hover:bg-white/20 text-white disabled:opacity-40 cursor-pointer"
                  title="Perbesar"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleZoomReset}
                  className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                  title="Reset (100%)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* DOCX Export Button */}
              <button
                onClick={handleExportDocx}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Ekspor materi DOCX"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">DOCX</span>
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Cetak Infografis"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cetak</span>
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded-xl bg-white/15 hover:bg-rose-600 text-white transition-all cursor-pointer"
                title="Tutup Layar Penuh (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Poster Wrapper with Zoom Scale */}
          <div className="w-full max-w-4xl pb-12 flex justify-center">
            <div
              className="w-full transition-transform duration-200 origin-top flex justify-center"
              style={zoomLevel !== 100 ? { transform: `scale(${zoomLevel / 100})` } : undefined}
            >
              <InfographicRenderer
                draft={readonlyDraft}
                activeSectionId={activeSectionId}
                onSelectSection={(id) => setActiveSectionId(id)}
                visualStyle={readonlyDraft.visualStyle}
                format={readonlyDraft.format}
                visualLevel={readonlyDraft.visualLevel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
