import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal, 
  Save, 
  Camera, 
  Check, 
  ChevronRight, 
  X, 
  School, 
  BookOpen, 
  ShieldCheck,
  ArrowRight,
  Sparkle,
  LayoutGrid,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSettings, EducationLevel, InfographicFormat, VisualLevel, ResponsiveViewMode } from '../../types';

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
  avatarUrl?: string;
}

const DEFAULT_PROFILE: EducatorProfile = {
  name: 'Amin Wahyudi, S.Pd.',
  role: 'Pengembang Media Pembelajaran',
  school: 'SMPN 2 Jetis Kab. Mojokerto',
};

const STORAGE_KEY = 'stivia_educator_profile';

type ModalType = 'akun' | 'preferensi' | 'tentang' | null;

export const PengaturanPage: React.FC<PengaturanPageProps> = ({ 
  settings,
  onUpdateSettings,
  onSaveToast,
}) => {
  // Modal state: null = no modal, or 'akun' | 'preferensi' | 'tentang'
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Profile state from localStorage or default
  const [profile, setProfile] = useState<EducatorProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.school) {
          return {
            name: parsed.name,
            role: parsed.role || DEFAULT_PROFILE.role,
            school: parsed.school,
            avatarUrl: parsed.avatarUrl || '',
          };
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  // Local draft state for editing in modals
  const [formProfile, setFormProfile] = useState<EducatorProfile>(profile);
  
  // Local preferences state (derived from props/settings)
  const [prefLevel, setPrefLevel] = useState<string>(settings?.defaultLevel || 'SMP');
  const [prefSubject, setPrefSubject] = useState<string>(settings?.defaultSubject || 'Informatika');
  const [prefFormat, setPrefFormat] = useState<InfographicFormat>(settings?.defaultFormat || 'portrait');
  const [prefVisualLevel, setPrefVisualLevel] = useState<VisualLevel>(settings?.defaultVisualLevel || 'seimbang');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync when settings prop updates
  useEffect(() => {
    if (settings) {
      setPrefLevel(settings.defaultLevel || 'SMP');
      setPrefSubject(settings.defaultSubject || 'Informatika');
      setPrefFormat(settings.defaultFormat || 'portrait');
      setPrefVisualLevel(settings.defaultVisualLevel || 'seimbang');
    }
  }, [settings]);

  // When opening a modal, ensure local draft states are synchronized
  const handleOpenModal = (type: ModalType) => {
    setFormProfile({ ...profile });
    if (settings) {
      setPrefLevel(settings.defaultLevel || 'SMP');
      setPrefSubject(settings.defaultSubject || 'Informatika');
      setPrefFormat(settings.defaultFormat || 'portrait');
      setPrefVisualLevel(settings.defaultVisualLevel || 'seimbang');
    }
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  // Handle avatar photo selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormProfile((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes from Modal 1
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = formProfile.name.trim() || DEFAULT_PROFILE.name;
    const cleanSchool = formProfile.school.trim() || DEFAULT_PROFILE.school;
    const cleanRole = formProfile.role.trim() || DEFAULT_PROFILE.role;

    const updatedProfile: EducatorProfile = {
      name: cleanName,
      school: cleanSchool,
      role: cleanRole,
      avatarUrl: formProfile.avatarUrl,
    };

    setProfile(updatedProfile);
    setFormProfile(updatedProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch {
      // ignore
    }

    // Sync to userSettings if available
    if (onUpdateSettings && settings) {
      onUpdateSettings({
        ...settings,
        authorName: cleanName,
        authorRole: cleanRole,
      });
    }

    const success = 'Informasi Pembuat & Pendidik berhasil disimpan';
    setToastMsg(success);
    if (onSaveToast) onSaveToast(success);
    handleCloseModal();

    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Save preference changes from Modal 2
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();

    if (onUpdateSettings && settings) {
      const mappedEducationLevel: EducationLevel = 
        (prefLevel === 'SD' || prefLevel === 'SMP' || prefLevel === 'SMA' || prefLevel === 'SMK') 
          ? (prefLevel as EducationLevel) 
          : 'SMP';

      const updatedSettings: UserSettings = {
        ...settings,
        defaultLevel: mappedEducationLevel,
        defaultSubject: prefSubject.trim() || 'Informatika',
        defaultFormat: prefFormat,
        defaultVisualLevel: prefVisualLevel,
      };
      onUpdateSettings(updatedSettings);
    }

    const success = 'Preferensi STIVIA berhasil diperbarui';
    setToastMsg(success);
    if (onSaveToast) onSaveToast(success);
    handleCloseModal();

    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Changelog & Fitur Tambahan untuk STIVIA Versi 2.2a
  const version22aHighlights = [
    {
      title: 'Multi-Style Visual Engine (14+ Preset Interaktif)',
      desc: 'Dukungan penggantian tema gaya visual secara instan (Modern Edukatif, Futuristic, Cyberpunk, Swiss Design, Clay Style, Pop Art, Editorial, Handwritten, Glassmorphism, Aurora, Academic Clean, Ceria, Vintage) tanpa mengubah materi pembelajaran.',
      tag: 'Fitur Utama 2.2a',
    },
    {
      title: 'Layout Archetype Sync & Auto-Adaptation',
      desc: 'Tata letak kanvas infografis kini otomatis menyesuaikan arketipe visual (Cyber HUD, Swiss Grid, Tactile 3D, Magazine Layout, Notebook Sketches) saat gaya visual diganti berulang kali.',
      tag: 'Desain & Kanvas',
    },
    {
      title: 'Zero-Stale State & Deep Clone Immutability',
      desc: 'Penyempurnaan arsitektur rendering berbasis key-remount dan deep immutability untuk menjamin transisi gaya visual 100% bersih tanpa sisa token warna atau font lama.',
      tag: 'Performa Sistem',
    },
    {
      title: 'Pilihan Gaya Visual Lengkap di Form Pembuatan',
      desc: 'Penambahan chip preset visual cepat pada form pembuatan awal dan modal penggantian gaya visual di halaman hasil infografis.',
      tag: 'Pengalaman Pengguna',
    },
    {
      title: 'Antarmuka Pengaturan Terstruktur Berbasis Popup',
      desc: 'Pengorganisasian menu pengaturan ke dalam 3 kartu fokus dengan modal dialog interaktif untuk Akun Pendidik, Preferensi STIVIA, dan Informasi Aplikasi.',
      tag: 'Navigasi',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-fadeIn">
      {/* ================================================== */}
      {/* HEADER HALAMAN */}
      {/* ================================================== */}
      <div className="border-b border-slate-200/80 pb-6 pt-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Pengaturan Profil
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal leading-relaxed">
            Kelola informasi akun, preferensi, dan informasi aplikasi STIVIA.
          </p>
        </div>

        {/* Status Badge Ringkas */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700">STIVIA Versi 2.2a</span>
        </div>
      </div>

      {/* Alert Notifikasi Sukses */}
      {toastMsg && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-sm font-semibold shadow-xs animate-fadeIn">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================================================== */}
      {/* KARTU RINGKASAN PROFIL & PREVIEW AKTIF */}
      {/* ================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Dekorasi halus */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border-2 border-white/20 shadow-inner flex items-center justify-center overflow-hidden shrink-0">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-indigo-200 opacity-90" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                {profile.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#3b49df] text-white tracking-wider uppercase border border-indigo-400/30">
                Pendidik
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-200/90 font-medium">
              {profile.school}
            </p>
            <p className="text-xs text-slate-400">
              {profile.role}
            </p>
          </div>

          <button
            type="button"
            id="btn-quick-edit-profile"
            onClick={() => handleOpenModal('akun')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer shrink-0"
          >
            Edit Profil
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* TAMPILAN MENU UTAMA PENGATURAN (3 KARTU INTERAKTIF) */}
      {/* ================================================== */}
      <div className="space-y-3">
        <div className="px-1">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Menu Pilihan Pengaturan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* ================================================== */}
          {/* KARTU 1: INFORMASI PEMBUAT & PENDIDIK */}
          {/* ================================================== */}
          <div
            id="card-menu-akun"
            role="button"
            tabIndex={0}
            onClick={() => handleOpenModal('akun')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenModal('akun'); }}
            className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left cursor-pointer transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="w-13 h-13 rounded-2xl bg-[#edf2fe] group-hover:bg-[#3b49df] text-[#3b49df] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <User className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#3b49df] transition-colors">
                  Informasi Pembuat & Pendidik
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  Kelola nama lengkap, instansi sekolah, dan foto profil pendidik.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between text-xs font-bold text-[#3b49df] group-hover:text-indigo-800">
              <span className="text-slate-400 group-hover:text-[#3b49df] transition-colors">
                {profile.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#edf2fe] flex items-center justify-center transition-all group-hover:translate-x-1">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* KARTU 2: PREFERENSI STIVIA */}
          {/* ================================================== */}
          <div
            id="card-menu-preferensi"
            role="button"
            tabIndex={0}
            onClick={() => handleOpenModal('preferensi')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenModal('preferensi'); }}
            className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left cursor-pointer transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="w-13 h-13 rounded-2xl bg-[#edf2fe] group-hover:bg-[#3b49df] text-[#3b49df] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <SlidersHorizontal className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#3b49df] transition-colors">
                  Preferensi STIVIA
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  Atur bawaan tingkat pendidikan, mata pelajaran, dan format infografis.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between text-xs font-bold text-[#3b49df] group-hover:text-indigo-800">
              <span className="text-slate-400 group-hover:text-[#3b49df] transition-colors">
                {prefLevel} • {prefSubject}
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#edf2fe] flex items-center justify-center transition-all group-hover:translate-x-1">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* KARTU 3: TENTANG STIVIA */}
          {/* ================================================== */}
          <div
            id="card-menu-tentang"
            role="button"
            tabIndex={0}
            onClick={() => handleOpenModal('tentang')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenModal('tentang'); }}
            className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left cursor-pointer transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="w-13 h-13 rounded-2xl bg-[#edf2fe] group-hover:bg-[#3b49df] text-[#3b49df] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <Info className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#3b49df] transition-colors">
                  Tentang STIVIA
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  Informasi platform AI, identitas rilis, dan fitur tambahan versi 2.2a.
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between text-xs font-bold text-[#3b49df] group-hover:text-indigo-800">
              <span className="text-slate-400 group-hover:text-[#3b49df] transition-colors">
                Versi 2.2a • Rilis Terbaru
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#edf2fe] flex items-center justify-center transition-all group-hover:translate-x-1">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* POPUP / MODAL DIALOGS (ANIMATED WITH BACKDROP) */}
      {/* ================================================== */}
      <AnimatePresence>
        {activeModal !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            />

            {/* ================================================== */}
            {/* MODAL 1: INFORMASI PEMBUAT & PENDIDIK */}
            {/* ================================================== */}
            {activeModal === 'akun' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#edf2fe] text-[#3b49df] flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Informasi Pembuat & Pendidik
                      </h2>
                      <p className="text-xs text-slate-500">
                        Kelola data identitas dan instansi sekolah
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="btn-close-modal-akun"
                    onClick={handleCloseModal}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body / Form */}
                <form onSubmit={handleSaveProfile} className="p-6 sm:p-7 space-y-6 text-left">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 rounded-full bg-white border-2 border-indigo-200 shadow-sm overflow-hidden flex items-center justify-center text-indigo-700">
                        {formProfile.avatarUrl ? (
                          <img 
                            src={formProfile.avatarUrl} 
                            alt={formProfile.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-[#3b49df] opacity-80" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#3b49df] hover:bg-indigo-700 text-white flex items-center justify-center shadow transition-transform hover:scale-105 cursor-pointer"
                        title="Ubah Foto"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-900 block">
                        Foto Profil Pendidik
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Format JPG atau PNG. Tampil pada identitas STIVIA.
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-[#3b49df] hover:text-indigo-800 transition-colors cursor-pointer inline-block pt-1"
                      >
                        Pilih Foto Baru
                      </button>
                    </div>
                  </div>

                  {/* Field 1: Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="input-nama-pembuat"
                      value={formProfile.name}
                      onChange={(e) => setFormProfile({ ...formProfile, name: e.target.value })}
                      placeholder="Contoh: Amin Wahyudi, S.Pd."
                      className="w-full px-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#3b49df] text-slate-900 font-medium transition-all shadow-2xs"
                    />
                  </div>

                  {/* Field 2: Asal Sekolah */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Asal Sekolah
                    </label>
                    <input
                      type="text"
                      id="input-asal-sekolah"
                      value={formProfile.school}
                      onChange={(e) => setFormProfile({ ...formProfile, school: e.target.value })}
                      placeholder="Contoh: SMPN 2 Jetis Kab. Mojokerto"
                      className="w-full px-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#3b49df] text-slate-900 font-medium transition-all shadow-2xs"
                    />
                  </div>

                  {/* Field 3: Peran */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Peran / Bidang Keahlian
                    </label>
                    <input
                      type="text"
                      id="input-peran-pembuat"
                      value={formProfile.role}
                      onChange={(e) => setFormProfile({ ...formProfile, role: e.target.value })}
                      placeholder="Contoh: Pengembang Media Pembelajaran"
                      className="w-full px-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#3b49df] text-slate-900 font-medium transition-all shadow-2xs"
                    />
                  </div>

                  {/* Modal Footer Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      id="btn-submit-modal-akun"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3b49df] hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ================================================== */}
            {/* MODAL 2: PREFERENSI STIVIA */}
            {/* ================================================== */}
            {activeModal === 'preferensi' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#edf2fe] text-[#3b49df] flex items-center justify-center font-bold">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Preferensi STIVIA
                      </h2>
                      <p className="text-xs text-slate-500">
                        Atur bawaan pembuatan materi dan infografis
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="btn-close-modal-preferensi"
                    onClick={handleCloseModal}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body / Form */}
                <form onSubmit={handleSavePreferences} className="p-6 sm:p-7 space-y-6 text-left">
                  {/* Tingkat Pendidikan (Level/Grades) */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Tingkat Pendidikan (Level/Grades)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['SD', 'SMP', 'SMA/SMK', 'Perguruan Tinggi'] as const).map((lvl) => {
                        const isSelected = 
                          (lvl === 'SMA/SMK' && (prefLevel === 'SMA' || prefLevel === 'SMK' || prefLevel === 'SMA/SMK')) ||
                          prefLevel === lvl;

                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              if (lvl === 'SMA/SMK') {
                                setPrefLevel('SMA');
                              } else {
                                setPrefLevel(lvl);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#3b49df] text-white shadow-sm shadow-indigo-600/20'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mata Pelajaran (Subjects) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Mata Pelajaran Bawaan
                    </label>
                    <input
                      type="text"
                      id="input-mata-pelajaran"
                      value={prefSubject}
                      onChange={(e) => setPrefSubject(e.target.value)}
                      placeholder="Contoh: Sejarah, Informatika, IPA"
                      className="w-full px-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#3b49df] text-slate-900 font-medium transition-all shadow-2xs"
                    />
                  </div>

                  {/* Format Kanvas & Kepadatan Visual */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Format Kanvas Bawaan
                      </label>
                      <select
                        value={prefFormat}
                        onChange={(e) => setPrefFormat(e.target.value as InfographicFormat)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#3b49df] text-slate-900 font-medium transition-all cursor-pointer"
                      >
                        <option value="portrait">Portrait (2:3)</option>
                        <option value="square">Square (1:1)</option>
                        <option value="landscape">Landscape (16:9)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Kepadatan Visual Bawaan
                      </label>
                      <select
                        value={prefVisualLevel}
                        onChange={(e) => setPrefVisualLevel(e.target.value as VisualLevel)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#3b49df] text-slate-900 font-medium transition-all cursor-pointer"
                      >
                        <option value="seimbang">Seimbang</option>
                        <option value="sederhana">Sederhana</option>
                        <option value="visual_dominan">Visual Dominan</option>
                      </select>
                    </div>
                  </div>

                  {/* Modal Footer Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      id="btn-submit-modal-preferensi"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3b49df] hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ================================================== */}
            {/* MODAL 3: TENTANG STIVIA */}
            {/* ================================================== */}
            {activeModal === 'tentang' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#edf2fe] text-[#3b49df] flex items-center justify-center font-bold">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Tentang STIVIA
                      </h2>
                      <p className="text-xs text-slate-500">
                        Platform perancangan materi infografis edukatif
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="btn-close-modal-tentang"
                    onClick={handleCloseModal}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-6 sm:p-7 space-y-6 overflow-y-auto text-left">
                  {/* Brand & Badge Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-indigo-50/70 border border-indigo-100/80">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xl font-black text-slate-900 tracking-tight">
                          STIVIA
                        </span>
                        <span className="text-[10px] font-bold text-[#3b49df] bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                          AI Infographics
                        </span>
                      </div>
                      <p className="text-xs font-bold text-indigo-700">
                        "Belajar Lebih Visual, Mengajar Lebih Mudah"
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#3b49df] text-white text-xs font-bold tracking-wide shadow-xs shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Versi 2.2a • Rilis Terbaru</span>
                    </div>
                  </div>

                  {/* Deskripsi Aplikasi */}
                  <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                    STIVIA adalah platform berbasis AI yang membantu pendidik dan guru mengembangkan kebutuhan pembelajaran secara lebih kreatif, visual, dan terstruktur.
                  </div>

                  {/* Informasi Developer */}
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="w-10 h-10 rounded-2xl bg-[#edf2fe] text-[#3b49df] flex items-center justify-center shrink-0">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Developer
                      </span>
                      <span className="text-sm font-bold text-slate-900 block">
                        Amin Wahyudi, S.Pd.
                      </span>
                    </div>
                  </div>

                  {/* Fitur Tambahan & Pembaruan di Versi 2.2a */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#3b49df]" />
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Fitur Tambahan di Versi 2.2a
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {version22aHighlights.map((item, idx) => (
                        <div 
                          key={idx}
                          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 hover:border-indigo-200 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-lg bg-[#edf2fe] text-[#3b49df] flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-[#3b49df]" />
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                {item.title}
                              </h4>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#3b49df] border border-indigo-100 shrink-0">
                              {item.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-normal pl-8">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end p-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 rounded-2xl bg-[#3b49df] hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
