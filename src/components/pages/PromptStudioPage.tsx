import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Palette, 
  Copy, 
  Check, 
  Layers, 
  FileText, 
  FolderKanban, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  Info,
  ArrowLeft,
  Monitor,
  LayoutTemplate,
  Lock,
  Loader2
} from 'lucide-react';
import { InfographicDraft, NavigationTab } from '../../types';
import { VISUAL_STYLE_OPTIONS } from '../../data/mockData';
import { 
  generateUniversalMaterialPrompt, 
  generateUniversalInfographicFromProjectPrompt, 
  generateUniversalInfographicFromRawMaterialPrompt,
  analyzeAndGenerateProjectInfographicPrompt,
  analyzeAndGenerateRawInfographicPrompt,
  analyzeAndGenerateMaterialPrompt
} from '../../services/promptStudioEngine';
import { StiviaThinkingResult } from '../../services/stiviaThinkingFramework';
import { PilihGayaInfografis } from '../infographic/PilihGayaInfografis';
import { StiviaThinkingPanel } from '../infographic/StiviaThinkingPanel';
import { HowStiviaWorksModal } from '../infographic/HowStiviaWorksModal';

interface PromptStudioPageProps {
  projects: InfographicDraft[];
  currentDraft: InfographicDraft;
  onNavigate: (tab: NavigationTab) => void;
  onSaveToast: (msg: string) => void;
}

type StudioMode = 'selection' | 'material' | 'infographic';
type InfographicSource = 'project' | 'raw_material';

export const PromptStudioPage: React.FC<PromptStudioPageProps> = ({
  projects,
  currentDraft,
  onNavigate,
  onSaveToast,
}) => {
  // State navigasi mode internal
  const [mode, setMode] = useState<StudioMode>('selection');
  const [infographicSource, setInfographicSource] = useState<InfographicSource>('project');

  // State Proyek Terpilih untuk Prompt Materi / Infografis Proyek
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return currentDraft?.id || (projects.length > 0 ? projects[0].id : '');
  });

  // State Konfigurasi Gaya Visual Infografis dari Proyek
  const [selectedVisualStyle, setSelectedVisualStyle] = useState<string>(() => {
    return currentDraft?.styleConfig?.name || 'Sains Modern (Navy Clean)';
  });

  // State Konfigurasi Prompt Infografis dari Materi Saya
  const [rawTitle, setRawTitle] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [rawVisualStyle, setRawVisualStyle] = useState<string>('Sains Modern (Navy Clean)');
  const [customStyleDesc, setCustomStyleDesc] = useState('');

  // State Hasil Prompt & Kerangka Berpikir STIVIA
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [thinkingResult, setThinkingResult] = useState<StiviaThinkingResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHowWorksModalOpen, setIsHowWorksModalOpen] = useState(false);

  // Ambil data proyek yang dipilih
  const activeProject = projects.find((p) => p.id === selectedProjectId) || currentDraft;

  // Helper untuk scroll mulus ke hasil setelah generate selesai
  const scrollToResult = () => {
    setTimeout(() => {
      const resultEl = document.getElementById('prompt-result-section');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // Handler Generate Prompt Materi
  const handleGenerateMaterialPrompt = () => {
    if (!activeProject) {
      onSaveToast('Pilih proyek terlebih dahulu untuk membuat prompt materi.');
      return;
    }

    setIsGenerating(true);
    setCopied(false);

    setTimeout(() => {
      try {
        const { prompt, thinkingResult: result } = analyzeAndGenerateMaterialPrompt(activeProject);
        setGeneratedPrompt(prompt);
        setThinkingResult(result);
        onSaveToast('Universal Prompt Materi & Kerangka Berpikir STIVIA berhasil dibuat!');
        scrollToResult();
      } catch (err) {
        console.error('[Prompt Studio Material Error]', err);
        try {
          const fallback = generateUniversalMaterialPrompt(activeProject);
          setGeneratedPrompt(fallback);
          onSaveToast('Prompt Materi berhasil dibuat dengan mode pemulihan (fallback).');
          scrollToResult();
        } catch (fbErr) {
          onSaveToast('Gagal memproses data proyek. Pastikan materi sudah memiliki judul dan cakupan.');
        }
      } finally {
        setIsGenerating(false);
      }
    }, 200);
  };

  // Handler Generate Prompt Infografis dari Proyek STIVIA
  const handleGenerateProjectInfographicPrompt = () => {
    if (!activeProject) {
      onSaveToast('Pilih proyek terlebih dahulu untuk membuat prompt infografis.');
      return;
    }

    setIsGenerating(true);
    setCopied(false);

    setTimeout(() => {
      try {
        const { prompt, thinkingResult: result } = analyzeAndGenerateProjectInfographicPrompt(activeProject, {
          format: 'Vertikal',
          visualStyleName: selectedVisualStyle,
        });
        setGeneratedPrompt(prompt);
        setThinkingResult(result);
        onSaveToast('Universal Prompt Infografis Proyek berhasil dibuat!');
        scrollToResult();
      } catch (err) {
        console.error('[Prompt Studio Infographic Error]', err);
        onSaveToast('Gagal menganalisis gaya visual. Silakan coba kembali.');
      } finally {
        setIsGenerating(false);
      }
    }, 200);
  };

  // Handler Generate Prompt Infografis dari Materi Saya
  const handleGenerateRawInfographicPrompt = () => {
    if (!rawContent.trim()) {
      onSaveToast('Silakan tempelkan isi materi pembelajaran Anda terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    setCopied(false);

    setTimeout(() => {
      try {
        const { prompt, thinkingResult: result } = analyzeAndGenerateRawInfographicPrompt({
          title: rawTitle.trim() || 'Infografis Materi Pembelajaran',
          rawMaterial: rawContent,
          format: 'Vertikal',
          visualStyle: rawVisualStyle,
          customStyleDescription: customStyleDesc,
        });
        setGeneratedPrompt(prompt);
        setThinkingResult(result);
        onSaveToast('Universal Prompt Infografis dari materi Anda berhasil dibuat!');
        scrollToResult();
      } catch (err) {
        console.error('[Prompt Studio Raw Error]', err);
        onSaveToast('Gagal menganalisis naskah materi. Silakan periksa teks Anda.');
      } finally {
        setIsGenerating(false);
      }
    }, 200);
  };

  // Handler Copy to Clipboard
  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    onSaveToast('Prompt berhasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-6">
      {/* Header Halaman Utama Prompt Studio */}
      {mode === 'selection' ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal AI Prompt Generator • STIVIA v2.2c</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              PROMPT STUDIO
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Buat prompt siap pakai berdasarkan alur STIVIA atau materi Anda.
            </p>
          </div>

          {/* Tombol Bagaimana STIVIA Bekerja di Header Utama */}
          <button
            type="button"
            onClick={() => setIsHowWorksModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Bagaimana STIVIA Bekerja?</span>
          </button>
        </div>
      ) : (
        /* Navigasi Internal di Kiri Atas Sub-halaman */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="space-y-1.5">
            {/* Tombol Kembali ke Halaman Utama Prompt Studio */}
            <div className="flex items-center gap-2">
              <button
                id="btn-back-to-prompt-studio"
                onClick={() => setMode('selection')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all shadow-2xs cursor-pointer group"
                title="Kembali ke Halaman Pilihan Prompt Studio"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600 group-hover:-translate-x-0.5 transition-transform" />
                <span>← Kembali ke Prompt Studio</span>
              </button>

              <span className="text-slate-300 text-xs">/</span>

              {/* Breadcrumb identifier */}
              <span className="text-xs font-semibold text-slate-500">
                {mode === 'material' ? '📝 Prompt Materi' : '🎨 Prompt Infografis'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{mode === 'material' ? '📝 Prompt Materi Pembelajaran' : '🎨 Prompt Desain Infografis'}</span>
            </h1>
          </div>

          <button
            onClick={() => setMode('selection')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pilih Jenis Prompt Lain</span>
          </button>
        </div>
      )}

      {/* TAHAP 1: HALAMAN UTAMA PROMPT STUDIO (SELEKSI AWAL) */}
      {mode === 'selection' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* KARTU 1: PROMPT MATERI */}
            <div 
              id="card-prompt-materi"
              onClick={() => {
                setMode('material');
              }}
              className="bg-white rounded-3xl p-7 border-2 border-slate-200/80 hover:border-indigo-500 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      📝 PROMPT MATERI
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      Alur STIVIA
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Buat prompt universal untuk menghasilkan materi pembelajaran sesuai struktur, bobot, dan kedalaman materi STIVIA.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Menjamin 100% cakupan materi terbahas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Kedalaman proporsional sesuai bobot materi</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode('material');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Pilih Prompt Materi</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* KARTU 2: PROMPT INFOGRAFIS */}
            <div 
              id="card-prompt-infografis"
              onClick={() => {
                setMode('infographic');
              }}
              className="bg-white rounded-3xl p-7 border-2 border-slate-200/80 hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Palette className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      🎨 PROMPT INFOGRAFIS
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Visual Blueprint
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Buat prompt universal untuk menghasilkan infografis berdasarkan proyek STIVIA atau materi yang Anda miliki.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Berdasarkan Content Snapshot terstruktur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dukungan sumber proyek STIVIA atau materi mandiri</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode('infographic');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Pilih Prompt Infografis</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE A: HALAMAN PROMPT MATERI */}
      {mode === 'material' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Penyusunan Prompt Materi Pembelajaran
                  </h2>
                  <p className="text-xs text-slate-500">
                    Menghasilkan Universal Prompt berbasis prinsip STIVIA (Cakupan → Struktur → Bobot → Kedalaman → Materi).
                  </p>
                </div>
              </div>
            </div>

            {/* Pemilihan Proyek */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pilih Proyek STIVIA Sebagai Sumber Snapshot
              </label>
              {projects.length === 0 ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  Belum ada proyek tersimpan. Anda dapat menggunakan draf aktif saat ini atau membuat proyek baru di menu Buat Infografis.
                </div>
              ) : (
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title} — ({proj.subject}, {proj.educationLevel} Kelas {proj.grade}) [{proj.status.toUpperCase()}]
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Ringkasan Metadata Proyek Terpilih */}
            {activeProject && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-indigo-600" />
                  <span>Snapshot Proyek: {activeProject.title}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Mata Pelajaran</span>
                    <span className="font-semibold text-slate-800">{activeProject.subject || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Jenjang / Kelas</span>
                    <span className="font-semibold text-slate-800">{activeProject.educationLevel} - Kelas {activeProject.grade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Blok Materi</span>
                    <span className="font-semibold text-slate-800">{activeProject.blocks?.length || 0} Bagian</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Status Proyek</span>
                    <span className="font-semibold text-emerald-700 capitalize">{activeProject.status}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tombol Generate */}
            <div className="pt-2">
              <button
                id="btn-generate-material-prompt"
                onClick={handleGenerateMaterialPrompt}
                disabled={isGenerating}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  isGenerating 
                    ? 'bg-indigo-400 text-white cursor-not-allowed opacity-80' 
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-indigo-600/20 cursor-pointer'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Menganalisis & Membuat Universal Prompt Materi...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Prompt Materi Universal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE B: HALAMAN PROMPT INFOGRAFIS */}
      {mode === 'infographic' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Generator Prompt Desain Infografis
                  </h2>
                  <p className="text-xs text-slate-500">
                    Hasilkan prompt spesifikasi visual yang terstruktur untuk merancang tata letak infografis.
                  </p>
                </div>
              </div>
            </div>

            {/* Pilihan Sumber Konten: Dari Proyek STIVIA atau Dari Materi Saya */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Sumber Data Materi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-source-project"
                  onClick={() => {
                    setInfographicSource('project');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    infographicSource === 'project'
                      ? 'bg-indigo-50/70 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                    infographicSource === 'project' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    ●
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold">Dari Proyek STIVIA</div>
                    <div className="text-[11px] text-slate-500 font-normal">Menggunakan Content Snapshot proyek aktif</div>
                  </div>
                </button>

                <button
                  type="button"
                  id="btn-source-raw-material"
                  onClick={() => {
                    setInfographicSource('raw_material');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    infographicSource === 'raw_material'
                      ? 'bg-indigo-50/70 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                    infographicSource === 'raw_material' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    ○
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold">Dari Materi Saya</div>
                    <div className="text-[11px] text-slate-500 font-normal">Tempelkan teks materi Anda sendiri secara langsung</div>
                  </div>
                </button>
              </div>
            </div>

            {/* OPSI B: SUMBER DARI PROYEK STIVIA */}
            {infographicSource === 'project' && (
              <div className="space-y-5 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pilih Proyek STIVIA
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => {
                      setSelectedProjectId(e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                  >
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.title} — ({proj.subject}, {proj.educationLevel} Kelas {proj.grade})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Format Infografis (Standar Tetap Read-Only) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                      <span>Format Output</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Standar Konsisten
                      </span>
                    </label>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">Poster Infografis Vertikal</div>
                        <div className="text-[11px] text-slate-500 font-medium truncate">↕ Rasio 2:3 • 1024 × 1536 px</div>
                      </div>
                    </div>
                  </div>

                  {/* Gaya Visual */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Gaya Visual
                    </label>
                    <select
                      value={selectedVisualStyle}
                      onChange={(e) => setSelectedVisualStyle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-indigo-500"
                    >
                      {VISUAL_STYLE_OPTIONS.map((style) => (
                        <option key={style} value={style}>
                          {style}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* FITUR BARU: PILIH GAYA INFOGRAFIS (SEBELUM GENERATE PROMPT) */}
                <PilihGayaInfografis
                  context={{
                    educationLevel: activeProject?.educationLevel,
                    grade: activeProject?.grade,
                    subject: activeProject?.subject,
                    theme: activeProject?.theme,
                    topic: activeProject?.rawTopic || activeProject?.title,
                    scope: activeProject?.scope,
                  }}
                  selectedStyleName={selectedVisualStyle}
                  onSelectStyle={(style) => {
                    setSelectedVisualStyle(style.name);
                    onSaveToast(`Gaya visual "${style.name}" dipilih untuk prompt infografis.`);
                  }}
                />

                <div className="pt-2">
                  <button
                    id="btn-generate-project-infographic-prompt"
                    onClick={handleGenerateProjectInfographicPrompt}
                    disabled={isGenerating}
                    className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                      isGenerating
                        ? 'bg-emerald-400 text-white cursor-not-allowed opacity-80'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-600/20 cursor-pointer'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Menganalisis Gaya & Merancang Prompt Infografis...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Prompt Desain Infografis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* OPSI C: SUMBER DARI MATERI SAYA */}
            {infographicSource === 'raw_material' && (
              <div className="space-y-5 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Judul Materi Pembelajaran
                  </label>
                  <input
                    type="text"
                    value={rawTitle}
                    onChange={(e) => setRawTitle(e.target.value)}
                    placeholder="Contoh: Siklus Air dan Pelestarian Lingkungan"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Materi Saya (Sumber Utama)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Teks asli akan dianalisis strukturnya tanpa mengubah maknanya
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    placeholder="Tempelkan naskah materi, artikel pembelajaran, atau catatan lengkap Anda di sini..."
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-mono leading-relaxed focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Format Infografis (Standar Tetap Read-Only) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                      <span>Format Output</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Standar Konsisten
                      </span>
                    </label>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">Poster Infografis Pembelajaran</div>
                        <div className="text-[11px] text-slate-500 font-medium truncate">↕ Vertikal • Rasio 2:3 (1200 × 1800 px)</div>
                      </div>
                    </div>
                  </div>

                  {/* Gaya Visual */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Gaya Visual
                    </label>
                    <select
                      value={rawVisualStyle}
                      onChange={(e) => setRawVisualStyle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-indigo-500"
                    >
                      {VISUAL_STYLE_OPTIONS.map((style) => (
                        <option key={style} value={style}>
                          {style}
                        </option>
                      ))}
                      <option value="Custom">Kustom (Jelaskan Gaya Sendiri)</option>
                    </select>
                  </div>
                </div>

                {/* Input Deskripsi Gaya Kustom jika dipilih */}
                {rawVisualStyle === 'Custom' && (
                  <div className="space-y-2 animate-in fade-in">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Jelaskan Gaya Visual yang Anda Inginkan
                    </label>
                    <input
                      type="text"
                      value={customStyleDesc}
                      onChange={(e) => setCustomStyleDesc(e.target.value)}
                      placeholder="Contoh: Nuansa retro pastel lembut dengan elemen garis doodle dan tipografi serif yang ramah"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                )}

                {/* FITUR BARU: PILIH GAYA INFOGRAFIS UNTUK MATERI SAYA */}
                <PilihGayaInfografis
                  context={{
                    topic: rawTitle,
                    scope: rawContent,
                  }}
                  selectedStyleName={rawVisualStyle}
                  onSelectStyle={(style) => {
                    setRawVisualStyle(style.name);
                    onSaveToast(`Gaya visual "${style.name}" dipilih untuk prompt materi Anda.`);
                  }}
                />

                <div className="pt-2">
                  <button
                    id="btn-generate-raw-infographic-prompt"
                    onClick={handleGenerateRawInfographicPrompt}
                    disabled={isGenerating}
                    className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                      isGenerating
                        ? 'bg-emerald-400 text-white cursor-not-allowed opacity-80'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-600/20 cursor-pointer'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Menganalisis Teks Materi & Merancang Prompt...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Prompt Desain Infografis dari Materi Saya</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PANEL HASIL KERANGKA BERPIKIR STIVIA (7 TAHAP) */}
      {thinkingResult && (
        <StiviaThinkingPanel thinkingResult={thinkingResult} />
      )}

      {/* HASIL PROMPT KELUARAN (READ-ONLY TEXTAREA & COPY BUTTON) */}
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
                  Hasil Universal Prompt Siap Pakai (Tahap 7)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Salin teks di bawah ini dan tempelkan langsung ke AI pilihan Anda (ChatGPT, Claude, Gemini, dll).
              </p>
            </div>

            <button
              onClick={handleCopyPrompt}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
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

          {/* Area Teks Prompt Read-Only */}
          <div className="relative">
            <textarea
              readOnly
              rows={14}
              value={generatedPrompt}
              className="w-full bg-slate-950/80 text-slate-200 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed focus:outline-hidden select-all"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Panjang Karakter: {generatedPrompt.length} karakter</span>
            <span className="text-emerald-400 font-semibold">Universal Compatibility ✓</span>
          </div>
        </div>
      )}

      {/* Pop-up Modal Bagaimana STIVIA Bekerja */}
      <HowStiviaWorksModal
        isOpen={isHowWorksModalOpen}
        onClose={() => setIsHowWorksModalOpen(false)}
      />
    </div>
  );
};
