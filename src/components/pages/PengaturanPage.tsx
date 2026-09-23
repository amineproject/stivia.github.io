import React, { useState, useEffect } from 'react';
import { 
  User, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  ShieldCheck,
  ArrowRight,
  Code2,
  FileText,
  BookOpen,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSettings, ResponsiveViewMode, NavigationTab, SupabaseUserProfile } from '../../types';
import { APP_CURRENT_VERSION, STIVIA_VERSION_HISTORY } from '../../data/versionHistoryData';

interface PengaturanPageProps {
  settings?: UserSettings;
  onUpdateSettings?: (newSettings: UserSettings) => void;
  onSaveToast?: (msg: string) => void;
  viewMode?: ResponsiveViewMode;
  onSetViewMode?: (mode: ResponsiveViewMode) => void;
  effectiveMode?: 'mobile' | 'desktop';
  userEmail?: string;
  onLogout?: () => void;
  profileName?: string;
  profileSchool?: string;
  userProfile?: SupabaseUserProfile | null;
  userId?: string;
  onProfileUpdated?: (updatedProfile: SupabaseUserProfile) => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

interface EducatorProfile {
  name: string;
  school: string;
  avatarUrl?: string;
}

const DEFAULT_PROFILE: EducatorProfile = {
  name: 'Amin Wahyudi',
  school: 'SMPN 2 Jetis Kab. Mojokerto',
};

const STORAGE_KEY = 'stivia_educator_profile';

type ModalType = 'tentang' | null;

export const PengaturanPage: React.FC<PengaturanPageProps> = ({ 
  profileName,
  profileSchool,
  userProfile,
  userId,
  userEmail,
  onProfileUpdated,
  onSaveToast,
  onNavigateTab,
}) => {
  // Modal state: null = no modal, or 'tentang'
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedVersionTab, setSelectedVersionTab] = useState<string>(APP_CURRENT_VERSION);

  // Profile state from localStorage or default or userProfile
  const [profile, setProfile] = useState<EducatorProfile>(() => {
    if (userProfile) {
      return {
        name: userProfile.full_name || profileName || DEFAULT_PROFILE.name,
        school: userProfile.school_name || profileSchool || DEFAULT_PROFILE.school,
        avatarUrl: userProfile.avatar_url || '',
      };
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.school) {
          return {
            name: profileName || parsed.name,
            school: profileSchool || parsed.school,
            avatarUrl: parsed.avatarUrl || '',
          };
        }
      }
    } catch {
      // fallback
    }
    return {
      ...DEFAULT_PROFILE,
      name: profileName || DEFAULT_PROFILE.name,
      school: profileSchool || DEFAULT_PROFILE.school,
    };
  });

  // Sync profile when userProfile, profileName or profileSchool props change
  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.full_name || profileName || DEFAULT_PROFILE.name,
        school: userProfile.school_name || profileSchool || DEFAULT_PROFILE.school,
        avatarUrl: userProfile.avatar_url || '',
      });
    } else if (profileName) {
      setProfile((prev) => ({
        ...prev,
        name: profileName,
        school: profileSchool || prev.school,
      }));
    }
  }, [userProfile, profileName, profileSchool]);

  const handleOpenModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-fadeIn">
      {/* ================================================== */}
      {/* HEADER HALAMAN */}
      {/* ================================================== */}
      <div className="border-b border-slate-200/80 pb-6 pt-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Pengaturan
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal leading-relaxed">
            Kelola profil pendidik, informasi sistem perancangan materi, dan catatan rilis STIVIA.
          </p>
        </div>

        {/* Status Badge Ringkas */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700">STIVIA Versi {APP_CURRENT_VERSION}</span>
        </div>
      </div>

      {/* ================================================== */}
      {/* KARTU RINGKASAN PROFIL & PREVIEW AKTIF */}
      {/* ================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
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
            <div className="text-xs sm:text-sm text-indigo-200/90 font-medium">
              <p>{profile.school}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onNavigateTab && (
              <button
                type="button"
                id="btn-open-profil-saya"
                onClick={() => onNavigateTab('profil_saya')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
              >
                <span>Edit Profil</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* INFORMASI SISTEM & APLIKASI (TENTANG STIVIA)       */}
      {/* ================================================== */}
      <div className="space-y-4">
        <div className="px-1 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Informasi Sistem & Pembaruan Aplikasi
          </h2>
          <span className="text-[11px] font-bold text-[#3b49df] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            Versi Aktif: v{APP_CURRENT_VERSION}
          </span>
        </div>

        {/* KARTU SOROTAN PENGEMBANGAN VERSI 3.2 */}
        <div className="bg-gradient-to-br from-indigo-900 via-[#1e2b8f] to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg shadow-indigo-950/15 border border-indigo-800/40 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-8 bottom-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/15 text-white backdrop-blur-xs border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>STIVIA v{APP_CURRENT_VERSION}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Rilis Terbaru</span>
                </span>
              </div>
              <span className="text-xs text-indigo-200/80 font-medium">
                Pembaruan September 2026
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Catatan Pengembangan STIVIA 3.2
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-normal">
                Pembaruan terpadu STIVIA 3.2 memperluas Analisis 7 Tahap Kerangka Berpikir untuk pembuatan media ajar yang semakin lengkap, mencakup modul Generator Poster LKPD Pembelajaran, Kendali Pertemuan Kurikulum otomatis, serta penguatan keamanan database Supabase Row Level Security (RLS) dan Server-Side RPC.
              </p>
            </div>

            {/* 3 Pilar Pengembangan v3.2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-200">
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold text-white">Poster LKPD Edukatif</span>
                </div>
                <p className="text-[11px] text-indigo-100/80 leading-relaxed">
                  Menghasilkan naskah lembar kerja peserta didik terstruktur dan prompt poster visual siap cetak (A4/A3) untuk aktivitas penemuan bermakna.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-200">
                  <BookOpen className="w-4 h-4 text-emerald-300" />
                  <span className="text-xs font-bold text-white">Kendali Pertemuan Silabus</span>
                </div>
                <p className="text-[11px] text-indigo-100/80 leading-relaxed">
                  Batas materi presisi per pertemuan kelas tanpa pengulangan materi pengantar, menjaga kontinuitas dan target kurikulum pembelajaran.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-200">
                  <ShieldCheck className="w-4 h-4 text-cyan-300" />
                  <span className="text-xs font-bold text-white">Keamanan Supabase RLS</span>
                </div>
                <p className="text-[11px] text-indigo-100/80 leading-relaxed">
                  Perlindungan saldo prompt dengan Row Level Security ketat, RPC server-side atomik, dan in-memory cache deduplikasi bebas query berulang.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
              <span className="text-xs text-indigo-200/90 font-medium">
                Developer: <span className="text-white font-bold">Amin Wahyudi, S.Pd.</span>
              </span>
              <button
                type="button"
                onClick={() => handleOpenModal('tentang')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-[#3b49df] hover:bg-indigo-50 font-bold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02] shrink-0"
              >
                <span>Lihat Seluruh Catatan Rilis & Riwayat Versi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* KARTU MENU TENTANG STIVIA RINGKAS */}
        <div
          id="card-menu-tentang"
          role="button"
          tabIndex={0}
          onClick={() => handleOpenModal('tentang')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenModal('tentang'); }}
          className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left cursor-pointer transform hover:-translate-y-0.5 relative overflow-hidden"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#edf2fe] group-hover:bg-[#3b49df] text-[#3b49df] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs shrink-0">
              <Info className="w-5 h-5" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#3b49df] transition-colors">
                  Tentang STIVIA & Profil Pendidik
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#3b49df] border border-indigo-200/60">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  <span>v{APP_CURRENT_VERSION}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Informasi platform, lisensi edukasi, profil pengembang, dan log rilis versi terdahulu (v3.1, v3.0, v2.2e).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="text-xs font-bold text-[#3b49df] group-hover:text-indigo-800">
              Detail Lengkap
            </span>
            <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#edf2fe] text-[#3b49df] flex items-center justify-center transition-all group-hover:translate-x-1">
              <ChevronRight className="w-3.5 h-3.5" />
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
            {/* MODAL: TENTANG STIVIA                              */}
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
                      <span>Versi {APP_CURRENT_VERSION} • Rilis Terbaru</span>
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

                  {/* Tab Pemilihan Versi Rilis */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#3b49df]" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                          Riwayat Versi & Pembaruan
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Pilih versi untuk melihat catatan rilis
                      </span>
                    </div>

                    {/* Version Selector Tabs */}
                    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/70">
                      {STIVIA_VERSION_HISTORY.map((ver) => {
                        const isSelected = selectedVersionTab === ver.version;
                        return (
                          <button
                            key={ver.version}
                            type="button"
                            onClick={() => setSelectedVersionTab(ver.version)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-white text-[#3b49df] shadow-xs border border-indigo-100'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`}
                          >
                            <span>v{ver.version}</span>
                            {ver.status === 'Rilis Terbaru' && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Version Content */}
                    {(() => {
                      const currentVer =
                        STIVIA_VERSION_HISTORY.find((v) => v.version === selectedVersionTab) ||
                        STIVIA_VERSION_HISTORY[0];

                      return (
                        <div className="space-y-4 pt-1">
                          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/90 space-y-1.5">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-xs font-extrabold text-[#3b49df] uppercase tracking-wider">
                                {currentVer.updateName}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200">
                                {currentVer.releaseDate}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                              {currentVer.description}
                            </p>
                          </div>

                          {/* Fitur Baru */}
                          {currentVer.newFeatures && currentVer.newFeatures.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                                <span>Fitur Baru</span>
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {currentVer.newFeatures.map((feat, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-2.5 text-xs text-slate-700"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed font-medium">{feat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Peningkatan Sistem */}
                          {currentVer.improvements && currentVer.improvements.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span>Peningkatan Sistem</span>
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {currentVer.improvements.map((imp, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-2.5 text-xs text-slate-700"
                                  >
                                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed font-medium">{imp}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Perbaikan Bug */}
                          {currentVer.bugFixes && currentVer.bugFixes.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Perbaikan & Stabilitas</span>
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {currentVer.bugFixes.map((fix, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-2.5 text-xs text-slate-700"
                                  >
                                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed font-medium">{fix}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end p-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
                  <button
                    type="button"
                    id="btn-close-modal-tentang-footer"
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
