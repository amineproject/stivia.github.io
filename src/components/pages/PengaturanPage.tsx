import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Info, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  SlidersHorizontal, 
  Palette, 
  Lock, 
  Eye, 
  Download, 
  FolderKanban, 
  TerminalSquare, 
  Bot, 
  Zap, 
  Smartphone,
  Monitor,
  Layout,
  Edit3,
  Save,
  X,
  AlertCircle,
  Check
} from 'lucide-react';
import { UserSettings, ResponsiveViewMode } from '../../types';

interface PengaturanPageProps {
  settings?: UserSettings;
  onUpdateSettings?: (newSettings: UserSettings) => void;
  onSaveToast?: (msg: string) => void;
  viewMode?: ResponsiveViewMode;
  onSetViewMode?: (mode: ResponsiveViewMode) => void;
  effectiveMode?: 'mobile' | 'desktop';
}

interface EducatorProfile {
  name: string;
  role: string;
  school: string;
}

const DEFAULT_PROFILE: EducatorProfile = {
  name: 'Amin Wahyudi, S.Pd.',
  role: 'Pengembang Media Pembelajaran',
  school: 'SMPN 2 Jetis Kab. Mojokerto',
};

const STORAGE_KEY = 'stivia_educator_profile';

export const PengaturanPage: React.FC<PengaturanPageProps> = ({ 
  onSaveToast,
  viewMode = 'auto',
  onSetViewMode,
  effectiveMode = 'desktop'
}) => {
  // State Profile Pendidik
  const [profile, setProfile] = useState<EducatorProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.role && parsed.school) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<EducatorProfile>(profile);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // State Modal Pembaruan Versi 2.0
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleStartEdit = () => {
    setEditForm({ ...profile });
    setValidationError(null);
    setSaveSuccessMsg(null);
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profile });
    setValidationError(null);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!editForm.name.trim()) {
      setValidationError('Nama tidak boleh kosong.');
      return;
    }
    if (!editForm.role.trim()) {
      setValidationError('Peran tidak boleh kosong.');
      return;
    }
    if (!editForm.school.trim()) {
      setValidationError('Asal sekolah tidak boleh kosong.');
      return;
    }

    const updatedProfile: EducatorProfile = {
      name: editForm.name.trim(),
      role: editForm.role.trim(),
      school: editForm.school.trim(),
    };

    setProfile(updatedProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch {
      // ignore
    }

    setValidationError(null);
    setIsEditingProfile(false);
    setSaveSuccessMsg('Informasi profil pendidik berhasil diperbarui!');
    if (onSaveToast) {
      onSaveToast('Informasi profil pendidik berhasil disimpan');
    }

    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  const versionFeatures = [
    {
      text: 'Penyegaran tampilan antarmuka agar lebih modern, bersih, dan nyaman digunakan.',
      icon: Sparkles,
    },
    {
      text: 'Peningkatan tata letak dan pengalaman pengguna tanpa mengubah sistem utama STIVIA.',
      icon: Layers,
    },
    {
      text: 'Penambahan dan pengembangan fitur pilihan Gaya Infografis untuk membantu pengguna menentukan karakter visual infografis sebelum menghasilkan prompt.',
      icon: Palette,
    },
    {
      text: 'Pilihan gaya visual terintegrasi dengan Prompt Desain Infografis sehingga gaya yang dipilih pengguna dapat memengaruhi hasil desain.',
      icon: Zap,
    },
    {
      text: 'Penghapusan materi contoh bawaan sehingga daftar materi hanya menampilkan materi yang dibuat atau digunakan oleh pengguna.',
      icon: FolderKanban,
    },
    {
      text: 'Penyempurnaan tampilan berbagai komponen aplikasi agar lebih konsisten dengan identitas STIVIA.',
      icon: SlidersHorizontal,
    },
    {
      text: 'Penghapusan bagian "Tampilan & Mode Responsif" dari antarmuka pengaturan.',
      icon: Layout,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      {/* Header Halaman */}
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <span>⚙️</span>
          <span>PENGATURAN</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Informasi profil pendidik, identitas aplikasi, dan ringkasan pembaruan sistem STIVIA.
        </p>
      </div>

      {saveSuccessMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* ================================================== */}
        {/* 1. INFORMASI PEMBUAT & PENDIDIK (EDITABLE) */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                <User className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                  INFORMASI PEMBUAT & PENDIDIK
                </h2>
                <p className="text-xs text-slate-500">
                  Profil pengembang media pembelajaran STIVIA
                </p>
              </div>
            </div>

            {!isEditingProfile && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer border border-indigo-200/60"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Informasi</span>
              </button>
            )}
          </div>

          {!isEditingProfile ? (
            /* View Mode */
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/70 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Nama
                  </span>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {profile.name}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Peran
                  </span>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {profile.role}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Asal Sekolah
                  </span>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {profile.school}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Form Mode */
            <form onSubmit={handleSaveProfile} className="bg-slate-50/90 rounded-xl p-5 border border-indigo-200/80 space-y-4">
              {validationError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Nama <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Contoh: Amin Wahyudi, S.Pd."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Peran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    placeholder="Contoh: Pengembang Media Pembelajaran"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Asal Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.school}
                    onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                    placeholder="Contoh: SMPN 2 Jetis Kab. Mojokerto"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-200/80 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ================================================== */}
        {/* 2. TENTANG APLIKASI (RINGKASAN & BUTTON MODAL) */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              <Info className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                TENTANG STIVIA
              </h2>
              <p className="text-xs text-slate-500">
                Identitas dan ringkasan media pembelajaran
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Nama Aplikasi
              </span>
              <p className="text-lg font-black text-indigo-700 mt-0.5 tracking-tight">
                STIVIA
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tagline
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                Belajar Lebih Visual, Mengajar Lebih Mudah
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Versi
              </span>
              <div className="inline-flex items-center gap-1.5 mt-0.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Versi 2.1
              </div>
            </div>
          </div>

          {/* Deskripsi Singkat & Action Popup */}
          <div className="p-4 sm:p-5 rounded-xl bg-indigo-50/40 border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">
                Pengembangan Terbaru STIVIA
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                STIVIA Versi 2.1 merupakan pembaruan yang berfokus pada peningkatan pengalaman pengguna dan pengembangan tampilan aplikasi agar lebih modern, menarik, dan mudah digunakan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lihat Pembaruan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. MODAL / POPUP: PEMBARUAN VERSI 2.1 */}
      {/* ================================================== */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      PEMBARUAN VERSI 2.1
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-extrabold text-indigo-700">
                      STIVIA • VERSION 2.1
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Peningkatan pengalaman pengguna dan tampilan antarmuka STIVIA
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with Internal Scroll */}
            <div className="px-6 py-5 overflow-y-auto space-y-4 text-left">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                STIVIA Versi 2.1 merupakan pembaruan yang berfokus pada peningkatan pengalaman pengguna dan pengembangan tampilan aplikasi agar lebih modern, menarik, dan mudah digunakan.
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Daftar Pembaruan & Fitur Utama
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {versionFeatures.map((feat, idx) => {
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60"
                      >
                        <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                          {feat.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
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
