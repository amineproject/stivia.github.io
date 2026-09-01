import React, { useState, useRef } from 'react';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  FileJson, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  FolderKanban, 
  Download, 
  Upload, 
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { InfographicDraft, NavigationTab } from '../../types';
import { exportMaterialToDocx } from '../../services/docxExportService';

interface EksporImporPageProps {
  projects: InfographicDraft[];
  currentDraft: InfographicDraft;
  onImportProjects: (imported: InfographicDraft[]) => void;
  onNavigate: (tab: NavigationTab) => void;
  onSaveToast: (msg: string) => void;
}

export const EksporImporPage: React.FC<EksporImporPageProps> = ({
  projects,
  currentDraft,
  onImportProjects,
  onNavigate,
  onSaveToast,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Ekspor Semua Proyek ke File JSON
  const handleExportAllProjects = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `stivia_semua_proyek_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onSaveToast('Semua data proyek berhasil diekspor ke file JSON!');
    } catch (e) {
      onSaveToast('Gagal mengekspor data.');
    }
  };

  // 2. Ekspor Proyek Aktif Saja ke File JSON
  const handleExportActiveProject = () => {
    if (!currentDraft) {
      onSaveToast('Tidak ada draf aktif yang dapat diekspor.');
      return;
    }
    try {
      const cleanTitle = (currentDraft.title || 'proyek_stivia').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentDraft, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `stivia_${cleanTitle}_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onSaveToast(`Proyek "${currentDraft.title}" berhasil diekspor!`);
    } catch (e) {
      onSaveToast('Gagal mengekspor proyek aktif.');
    }
  };

  // 3. Ekspor Materi Draf Aktif ke File DOCX
  const handleExportActiveDocx = async () => {
    if (!currentDraft) {
      onSaveToast('Tidak ada draf materi aktif yang dapat diekspor.');
      return;
    }
    onSaveToast('Menyiapkan file dokumen materi (.DOCX)...');
    const res = await exportMaterialToDocx(currentDraft);
    if (res.success) {
      onSaveToast(`✅ ${res.message}`);
    } else {
      onSaveToast(`⚠️ ${res.message}`);
    }
  };

  // 4. Salin Data JSON ke Clipboard
  const handleCopyJSONToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(projects, null, 2));
    setCopiedAll(true);
    onSaveToast('Data cadangan berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedAll(false), 3000);
  };

  // 4. Impor File JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        let validList: InfographicDraft[] = [];

        if (Array.isArray(parsed)) {
          validList = parsed.filter((p) => p && typeof p === 'object' && p.id && p.title);
        } else if (parsed && typeof parsed === 'object' && parsed.id && parsed.title) {
          validList = [parsed];
        }

        if (validList.length === 0) {
          setImportError('Format file tidak valid. Pastikan file berisi data proyek STIVIA.');
          return;
        }

        onImportProjects(validList);
        setImportSuccess(`Berhasil mengimpor ${validList.length} proyek ke STIVIA!`);
        onSaveToast(`Berhasil mengimpor ${validList.length} proyek!`);
      } catch (err) {
        setImportError('Gagal membaca file JSON. Pastikan format file benar.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      {/* Header Halaman */}
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ekspor / Impor Data
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Cadangkan seluruh data proyek atau pulihkan arsip infografis pembelajaran Anda secara aman.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KARTU 1: EKSPOR PROYEK */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <ArrowDownToLine className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Ekspor Proyek
                </h2>
                <p className="text-xs text-slate-500">
                  Unduh cadangan data proyek ke format JSON
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Simpan seluruh rancangan materi, bobot, kedalaman, dan spesifikasi visual infografis Anda untuk dipindahkan ke perangkat lain atau disimpan sebagai arsip cadangan.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span>Total Proyek Tersedia:</span>
                <span className="font-bold text-indigo-700">{projects.length} Proyek</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 font-semibold">
                <span>Draf Aktif:</span>
                <span className="font-medium text-slate-800 truncate max-w-[180px]">{currentDraft?.title || '-'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleExportAllProjects}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Semua Proyek ({projects.length})</span>
            </button>

            <button
              onClick={handleExportActiveProject}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileJson className="w-4 h-4 text-slate-500" />
              <span>Unduh Draf Aktif JSON</span>
            </button>

            <button
              onClick={handleExportActiveDocx}
              className="w-full py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Unduh Materi DOCX (Word)</span>
            </button>

            <button
              onClick={handleCopyJSONToClipboard}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Data JSON Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Salin Data JSON ke Clipboard</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* KARTU 2: IMPOR PROYEK */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ArrowUpFromLine className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Impor Proyek
                </h2>
                <p className="text-xs text-slate-500">
                  Pulihkan proyek dari file JSON cadangan
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Buka kembali file JSON cadangan STIVIA yang pernah Anda unduh sebelumnya. Proyek akan ditambahkan ke daftar proyek lokal Anda secara instan.
            </p>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,application/json"
              className="hidden"
            />

            {/* Dropzone Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/30 rounded-2xl p-6 text-center space-y-3 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-indigo-600 shadow-xs flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Klik untuk Memilih File JSON
                </p>
                <p className="text-[11px] text-slate-400">
                  Mendukung file .json tunggal atau koleksi proyek
                </p>
              </div>
            </div>

            {/* Pesan Sukses / Error */}
            {importError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importSuccess}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('infografis_saya')}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FolderKanban className="w-4 h-4 text-slate-500" />
              <span>Lihat Daftar Proyek Saya</span>
            </button>
          </div>
        </div>
      </div>

      {/* Informasi Keamanan Data Lokal */}
      <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Penyimpanan Pribadi & Aman di Browser Anda</p>
          <p className="text-indigo-800/80 leading-relaxed">
            Semua proyek STIVIA disimpan secara privat di Local Storage peramban Anda. Melakukan ekspor secara berkala memastikan data pembelajaran Anda tetap aman jika Anda membersihkan cache browser.
          </p>
        </div>
      </div>
    </div>
  );
};
