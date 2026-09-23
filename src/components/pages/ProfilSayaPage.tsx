import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  School, 
  Mail, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  RefreshCw,
  Clock,
  Check,
  Zap,
  Crown,
  Info,
  Coins,
  MessageCircle
} from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { NavigationTab, SupabaseUserProfile, SubscriptionSummary, SubscriptionPlan, UserRole, SUBSCRIPTION_PLANS, PROMPT_PACKAGES } from '../../types';
import { getUserProfile, updateUserProfile, ProfileSaveError, SupabaseDetailedError } from '../../services/authService';
import { updateUserPlan, updateUserRole, topUpPromptBalance } from '../../services/subscriptionService';
import { getWhatsAppTopUpUrl, getAdminWhatsAppNumber, setAdminWhatsAppNumber } from '../../lib/whatsapp';

// Pilihan avatar preset pendidik khas STIVIA (fallback ramah visual)
const AVATAR_PRESETS = [
  { id: 'avatar-1', label: 'Pendidik 1', emoji: '👨‍🏫', bg: 'bg-indigo-600' },
  { id: 'avatar-2', label: 'Pendidik 2', emoji: '👩‍🏫', bg: 'bg-violet-600' },
  { id: 'avatar-3', label: 'Inovator', emoji: '💡', bg: 'bg-amber-600' },
  { id: 'avatar-4', label: 'Teknologi', emoji: '💻', bg: 'bg-cyan-600' },
  { id: 'avatar-5', label: 'Sains', emoji: '🔬', bg: 'bg-emerald-600' },
  { id: 'avatar-6', label: 'Buku', emoji: '📚', bg: 'bg-blue-600' },
];

interface ProfilSayaPageProps {
  userProfile: SupabaseUserProfile | null;
  session: Session | null;
  onProfileUpdated: (updatedProfile: SupabaseUserProfile) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  showToast: (message: string) => void;
  effectiveMode?: 'mobile' | 'desktop';
  subscriptionSummary?: SubscriptionSummary | null;
  onRefreshSubscription?: () => void;
}

export const ProfilSayaPage: React.FC<ProfilSayaPageProps> = ({
  userProfile,
  session,
  onProfileUpdated,
  onNavigateTab,
  showToast,
  effectiveMode = 'desktop',
  subscriptionSummary,
  onRefreshSubscription,
}) => {
  const userId = session?.user?.id || '';
  const userEmail = session?.user?.email || '';

  // State mode edit & data form
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(!userProfile && !!userId);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<SupabaseDetailedError | null>(null);

  // Form input state: Nama, Sekolah, Instansi
  const [fullName, setFullName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [institutionName, setInstitutionName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Subscription Plan & Role Switcher (Testing & Simulation without payment gateway)
  const [isSwitchingPlan, setIsSwitchingPlan] = useState<boolean>(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState<boolean>(false);
  const [showProModal, setShowProModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Verifikasi apakah akun ini adalah Administrator yang sah
  // (Tetap diakui meski admin sedang dalam mode simulasi pengguna biasa)
  // Otorisasi didasarkan pada data server dan auth session (bukan localStorage)
  const isActualAdmin = Boolean(
    subscriptionSummary?.isAdmin ||
    userProfile?.role === 'admin' ||
    userEmail === 'aminexplore@gmail.com' ||
    session?.user?.email === 'aminexplore@gmail.com'
  );

  // Status apakah admin sedang menguji akun sebagai pengguna biasa
  const isSimulatingUser = isActualAdmin && !subscriptionSummary?.isAdmin;

  // Inisialisasi data form dari props userProfile
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setSchoolName(userProfile.school_name || '');
      setInstitutionName(userProfile.institution_name || '');
      setAvatarUrl(userProfile.avatar_url || '');
      setIsLoading(false);
      setErrorMessage(null);
    } else if (userId) {
      fetchLatestProfile();
    }
  }, [userProfile, userId]);

  // Fungsi untuk memuat ulang profil dari Supabase jika belum tersedia
  const fetchLatestProfile = async () => {
    if (!userId) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getUserProfile(userId);
      if (data) {
        onProfileUpdated(data);
        setFullName(data.full_name || '');
        setSchoolName(data.school_name || '');
        setInstitutionName(data.institution_name || '');
        setAvatarUrl(data.avatar_url || '');
      } else {
        // Fallback inisialisasi awal jika record baru
        setFullName(session?.user?.user_metadata?.full_name || '');
        setInstitutionName(session?.user?.user_metadata?.institution_name || '');
      }
    } catch {
      setErrorMessage('Profil belum dapat dimuat. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Masuk ke mode edit
  const handleStartEdit = () => {
    setFullName(userProfile?.full_name || '');
    setSchoolName(userProfile?.school_name || '');
    setInstitutionName(userProfile?.institution_name || '');
    setAvatarUrl(userProfile?.avatar_url || '');
    setSelectedPreset(null);
    setErrorMessage(null);
    setIsEditing(true);
  };

  // Batalkan mode edit
  const handleCancelEdit = () => {
    setFullName(userProfile?.full_name || '');
    setSchoolName(userProfile?.school_name || '');
    setInstitutionName(userProfile?.institution_name || '');
    setAvatarUrl(userProfile?.avatar_url || '');
    setSelectedPreset(null);
    setErrorMessage(null);
    setIsEditing(false);
  };

  // Upload foto lokal via FileReader (disimpan sebagai data URL)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran < 2MB agar ramah database
      if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 2 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
          setSelectedPreset(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Simpan perubahan profil ke public.profiles
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setErrorMessage('Sesi akun tidak valid. Silakan login kembali.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setDetailedError(null);

    try {
      const cleanName = fullName.trim() || 'Pendidik STIVIA';
      const cleanSchool = schoolName.trim() || null;
      const cleanAvatar = avatarUrl.trim() || null;

      const updated = await updateUserProfile(userId, {
        full_name: cleanName,
        title: null, // Tanpa gelar
        school_name: cleanSchool,
        institution_name: userProfile?.institution_name || null, // Pertahankan data instansi yang ada di akun
        avatar_url: cleanAvatar,
      });

      onProfileUpdated(updated);
      setIsEditing(false);
      showToast('Profil berhasil diperbarui.');
    } catch (err: unknown) {
      console.error('[STIVIA Profil] Gagal menyimpan profil pada komponen ProfilSayaPage:', err);
      if (err instanceof ProfileSaveError) {
        setErrorMessage(err.message);
        setDetailedError(err.supabaseError);
        showToast(`Profil gagal disimpan: [${err.supabaseError.code}] ${err.supabaseError.message}`);
      } else {
        const msg = err instanceof Error ? err.message : 'Profil gagal disimpan. Silakan coba lagi.';
        setErrorMessage(msg);
        showToast(msg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Nama tampilan (hanya Nama Lengkap tanpa gelar)
  const displayName = fullName || userProfile?.full_name || session?.user?.user_metadata?.full_name || 'Pendidik STIVIA';
  const fullDisplayName = displayName;
  const displaySchool = schoolName || userProfile?.school_name || 'Sekolah belum diatur';

  const handleTogglePlan = async (targetPlan: SubscriptionPlan) => {
    if (!userId) return;
    const isActualAdmin = Boolean(subscriptionSummary?.isAdmin || userProfile?.role === 'admin');
    if (!isActualAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang berwenang mengubah paket secara langsung.');
      return;
    }
    setIsSwitchingPlan(true);
    try {
      await updateUserPlan(userId, targetPlan);
      showToast(`Paket berhasil diubah menjadi ${targetPlan.toUpperCase()}`);
      if (onRefreshSubscription) {
        onRefreshSubscription();
      }
      if (userProfile) {
        onProfileUpdated({
          ...userProfile,
          plan: targetPlan,
        });
      }
    } catch (err) {
      console.error('[ProfilSaya] Gagal mengubah paket:', err);
      showToast('Gagal mengubah paket.');
    } finally {
      setIsSwitchingPlan(false);
    }
  };

  const handleToggleRole = async (targetRole: UserRole) => {
    if (!userId) return;
    if (!isActualAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang berwenang mengubah peran.');
      return;
    }
    setIsSwitchingRole(true);
    try {
      await updateUserRole(userId, targetRole);
      showToast(
        targetRole === 'admin'
          ? 'Peran berhasil dikembalikan menjadi ADMIN (Akses Unlimited Permanen)'
          : 'Beralih ke mode UJI COBA PENGGUNA (Saldo Terbatas 3 Prompt)'
      );
      if (onRefreshSubscription) {
        onRefreshSubscription();
      }
      if (userProfile) {
        onProfileUpdated({
          ...userProfile,
          role: targetRole,
        });
      }
    } catch (err) {
      console.error('[ProfilSaya] Gagal mengubah role:', err);
      showToast('Gagal mengubah role.');
    } finally {
      setIsSwitchingRole(false);
    }
  };

  const handleTopUpPrompts = async (amount: number) => {
    if (!userId) return;
    if (!isActualAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang berwenang menambah saldo prompt.');
      return;
    }
    setIsSwitchingPlan(true);
    try {
      await topUpPromptBalance(userId, amount);
      showToast(`Berhasil menambahkan +${amount} Saldo Prompt!`);
      if (onRefreshSubscription) {
        onRefreshSubscription();
      }
    } catch (err) {
      console.error('[ProfilSaya] Gagal top-up saldo prompt:', err);
      showToast('Gagal menambahkan saldo prompt.');
    } finally {
      setIsSwitchingPlan(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-[#3b49df] border border-indigo-100 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Profil Pengguna • STIVIA 3.1A</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Profil Saya
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Kelola data identitas pendidik dan instansi sekolah Anda di STIVIA
            </p>
          </div>
        </div>

        {/* Tombol Edit / Simpan di Header (Desktop & Tablet) */}
        {!isLoading && !errorMessage && (
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                id="btn-edit-profil-header"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#3b49df] hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profil</span>
              </button>
            ) : (
              <button
                id="btn-batal-profil-header"
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Batal</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pesan Kesalahan Loading / Save */}
      {errorMessage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start justify-between gap-4 text-rose-800 text-sm animate-fade-in">
          <div className="flex items-start gap-3 w-full">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-2 w-full">
              <p className="font-bold text-rose-900">{errorMessage}</p>
              
              {detailedError && (
                <div className="p-3 bg-white/90 rounded-xl border border-rose-200 text-xs font-mono space-y-1.5 text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      Operasi: {detailedError.operation}
                    </span>
                    <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Kode: {detailedError.code}
                    </span>
                  </div>
                  <p className="text-slate-700">
                    <span className="font-semibold">Pesan:</span> {detailedError.message}
                  </p>
                  {detailedError.details && (
                    <p className="text-slate-500">
                      <span className="font-semibold">Detail:</span> {detailedError.details}
                    </p>
                  )}
                  {detailedError.hint && (
                    <p className="text-indigo-600 bg-indigo-50/50 p-1.5 rounded border border-indigo-100">
                      <span className="font-semibold">Petunjuk Supabase:</span> {detailedError.hint}
                    </p>
                  )}
                </div>
              )}

              <p className="text-xs text-rose-600">
                Pastikan koneksi internet stabil atau periksa pesan teknis di atas.
              </p>
            </div>
          </div>
          <button
            onClick={fetchLatestProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer shrink-0 self-end sm:self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#3b49df] animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Memuat data profil...
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Menghubungkan ke database akun Supabase
            </p>
          </div>
        </div>
      ) : isEditing ? (
        /* ================================================== */
        /* MODE EDIT PROFIL                                   */
        /* ================================================== */
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Ubah Data Profil Pendidik
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Perbarui nama lengkap, sekolah, dan foto profil Anda. Data akan disimpan aman ke akun Anda.
            </p>
          </div>

          {/* Pengaturan Avatar / Foto */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Foto / Avatar Pendidik
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              {/* Preview Avatar */}
              <div className="relative group shrink-0 self-center sm:self-auto">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-indigo-200 shadow-sm overflow-hidden flex items-center justify-center text-indigo-700">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar Pendidik" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-[#3b49df] opacity-80" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#3b49df] hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
                  title="Pilih Berkas Foto"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Kontrol Foto */}
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Pilih Foto Pribadi atau Preset Avatar
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mendukung berkas JPG atau PNG (maks 2MB).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-bold text-[#3b49df] transition-colors cursor-pointer shadow-2xs"
                  >
                    Unggah Berkas Foto
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl('');
                        setSelectedPreset(null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs font-bold text-rose-600 transition-colors cursor-pointer shadow-2xs"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>

                {/* Preset Avatar Cepat */}
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    Atau gunakan preset avatar STIVIA:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_PRESETS.map((preset) => {
                      const isSelected = selectedPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setSelectedPreset(preset.id);
                            // Set SVG inline dataURL ramah browser
                            const svgDataUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%233b49df"/><text x="50" y="62" font-size="44" text-anchor="middle" dominant-baseline="middle">${preset.emoji}</text></svg>`;
                            setAvatarUrl(svgDataUrl);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-100 border-indigo-400 text-indigo-900 font-bold'
                              : 'bg-white border-slate-200 hover:border-indigo-200 text-slate-700'
                          }`}
                        >
                          <span className="text-sm">{preset.emoji}</span>
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Field 1: Nama Lengkap */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#3b49df]" />
                <span>Nama Lengkap <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                id="input-profil-fullname"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Amin Wahyudi"
                className="w-full px-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#3b49df] text-slate-900 font-medium transition-all shadow-2xs"
              />
              <p className="text-[11px] text-slate-500">
                Nama lengkap pendidik.
              </p>
            </div>

            {/* Field 2: Sekolah */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-[#3b49df]" />
                <span>Sekolah</span>
              </label>
              <input
                type="text"
                id="input-profil-school"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Contoh: SMPN 2 Jetis"
                className="w-full px-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#3b49df] text-slate-900 font-medium transition-all shadow-2xs"
              />
              <p className="text-[11px] text-slate-500">
                Nama sekolah atau madrasah tempat bertugas.
              </p>
            </div>

            {/* Field 3: Alamat Email (Permanen ketika login, tidak dapat diisi/diubah) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alamat Email</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Permanen (Tidak dapat diubah)
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="input-profil-email"
                  disabled
                  readOnly
                  value={userEmail}
                  className="w-full px-4 py-3 text-sm bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-medium cursor-not-allowed select-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Akun Login</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Alamat email terhubung permanen saat login akun dan tidak dapat diedit.
              </p>
            </div>
          </div>

          {/* Action Buttons: Simpan & Batal */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              id="btn-batal-profil"
              type="button"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              id="btn-simpan-profil"
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#3b49df] hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all cursor-pointer hover:scale-[1.02]"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* ================================================== */
        /* MODE TAMPILAN PROFIL (READ-ONLY VIEW)              */
        /* ================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Kartu Identitas Pendidik */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
            {/* Foto Avatar */}
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-50 to-indigo-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-indigo-700">
                {userProfile?.avatar_url ? (
                  <img 
                    src={userProfile.avatar_url} 
                    alt={displayName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-14 h-14 text-[#3b49df] opacity-80" />
                )}
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs" title="Akun Aktif">
                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
              </div>
            </div>

            {/* Nama Lengkap */}
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {fullDisplayName}
            </h2>

            {/* Sekolah */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 max-w-full">
              <School className="w-4 h-4 text-[#3b49df] shrink-0" />
              <span className="truncate">{displaySchool}</span>
            </div>

            {/* Status Akun */}
            <div className="mt-6 w-full pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Status Akun</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Akun Aktif</span>
              </span>
            </div>

            {/* Tombol Edit Profil */}
            <button
              id="btn-edit-profil-card"
              onClick={handleStartEdit}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#3b49df] hover:bg-indigo-700 text-white font-bold text-sm shadow-sm shadow-indigo-600/20 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profil</span>
            </button>
          </div>

          {/* Kolom Kanan: Rincian Informasi Akun */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Informasi Akun
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rincian data identitas resmi yang terhubung dengan akun STIVIA Anda
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Terverifikasi</span>
                </div>
              </div>

              {/* Tabel / Grid Rincian Akun */}
              <div className="divide-y divide-slate-100">
                {/* 1. Nama Lengkap */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Nama Lengkap</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {displayName}
                  </span>
                </div>

                {/* 2. Sekolah */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                    <School className="w-4 h-4 text-slate-400" />
                    <span>Sekolah</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {displaySchool}
                  </span>
                </div>

                {/* 3. Email Akun (Permanen) */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>Email Akun (Permanen)</span>
                  </span>
                  <span className="font-mono font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 text-xs">
                    {userEmail || '-'}
                  </span>
                </div>

                {/* 4. Status */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Status</span>
                  </span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Akun Aktif</span>
                  </span>
                </div>
              </div>
            </div>

            {/* KARTU PAKET AKUN & LIMIT PENGGUNAAN (STIVIA 3.1) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Coins className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Paket Akun & Saldo Prompt
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Sistem saldo token prompt aktif selamanya tanpa batas kedaluwarsa bulanan
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {subscriptionSummary?.isAdmin || userProfile?.role === 'admin' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border bg-purple-50 text-purple-800 border-purple-200 flex items-center gap-1.5 shadow-xs">
                      <Crown className="w-3.5 h-3.5 text-purple-600" />
                      <span>ADMIN PERMANEN • UNLIMITED</span>
                    </span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
                      (subscriptionSummary?.promptBalance ?? 0) > 0
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      Saldo: {subscriptionSummary?.promptBalance ?? 0} Prompt
                    </span>
                  )}
                </div>
              </div>

              {/* KETERANGAN BAGIAN & SIMULASI KHUSUS ADMIN DI ATAS POIN PROMPT */}
              {isActualAdmin && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/90 space-y-2.5">
                  {isSimulatingUser && (
                    <div className="p-2.5 rounded-lg bg-amber-100/90 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-800 shrink-0" />
                        <span className="text-xs text-amber-950 font-medium">
                          Sedang menguji sebagai <strong>Pengguna Standar</strong> (Saldo: {subscriptionSummary?.promptBalance} Prompt).
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleRole('admin')}
                        disabled={isSwitchingRole}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        <Crown className="w-3.5 h-3.5 text-purple-200" />
                        <span>{isSwitchingRole ? 'Mengaktifkan...' : 'Kembali ke Admin'}</span>
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-purple-600 text-white tracking-wider">
                        KHUSUS ADMIN
                      </span>
                      <span className="text-xs font-bold text-purple-950 flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-purple-600" />
                        <span>Simulasi Pengujian:</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTopUpPrompts(20)}
                        disabled={isSwitchingPlan}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                        title="Tambah 20 saldo prompt"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>+20 Prompt</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTopUpPrompts(50)}
                        disabled={isSwitchingPlan}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                        title="Tambah 50 saldo prompt"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>+50 Prompt</span>
                      </button>

                      {subscriptionSummary?.isAdmin ? (
                        <button
                          type="button"
                          onClick={() => handleToggleRole('user')}
                          disabled={isSwitchingRole}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-purple-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isSwitchingRole ? 'Mengubah...' : 'Uji Akun Pengguna'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleRole('admin')}
                          disabled={isSwitchingRole}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Crown className="w-3.5 h-3.5 text-purple-200" />
                          <span>{isSwitchingRole ? 'Mengubah...' : 'Kembali ke Admin'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowProModal(true)}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 shadow-2xs transition-colors cursor-pointer"
                      >
                        Pilihan Top-Up
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rincian Status Saldo & Poin Prompt */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Peran Akun
                  </span>
                  <div className="my-1">
                    <span className="text-lg font-black text-slate-900 block truncate">
                      {subscriptionSummary?.isAdmin || userProfile?.role === 'admin'
                        ? 'Administrator'
                        : 'Pengguna Reguler'}
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                    subscriptionSummary?.isAdmin || userProfile?.role === 'admin'
                      ? 'text-purple-600'
                      : 'text-emerald-600'
                  }`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>
                      {subscriptionSummary?.isAdmin || userProfile?.role === 'admin'
                        ? 'Hak Akses Penuh'
                        : 'Akun Aktif Selamanya'}
                    </span>
                  </span>
                </div>

                <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                  subscriptionSummary?.isAdmin || userProfile?.role === 'admin'
                    ? 'bg-purple-50/40 border-purple-200/80'
                    : (subscriptionSummary?.promptBalance ?? 0) <= 0
                    ? 'bg-rose-50/40 border-rose-200/80'
                    : 'bg-indigo-50/40 border-indigo-200/80'
                }`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Saldo Poin Prompt
                  </span>
                  <div className="my-1">
                    <span className={`text-xl font-black block tracking-tight ${
                      subscriptionSummary?.isAdmin || userProfile?.role === 'admin'
                        ? 'text-purple-700'
                        : (subscriptionSummary?.promptBalance ?? 0) <= 0
                        ? 'text-rose-600'
                        : 'text-indigo-900'
                    }`}>
                      {subscriptionSummary?.isAdmin || userProfile?.role === 'admin'
                        ? 'Unlimited (∞)'
                        : `${subscriptionSummary?.promptBalance ?? 0} Poin`}
                    </span>
                  </div>
                  <span className={`text-[11px] font-medium block truncate ${
                    subscriptionSummary?.isAdmin || userProfile?.role === 'admin'
                      ? 'text-purple-600 font-semibold'
                      : (subscriptionSummary?.promptBalance ?? 0) <= 0
                      ? 'text-rose-600 font-semibold'
                      : 'text-indigo-700'
                  }`}>
                    {subscriptionSummary?.isAdmin || userProfile?.role === 'admin'
                      ? 'Bebas generate tanpa batas'
                      : `Dari total ${subscriptionSummary?.totalGranted ?? 3} poin`}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Total Penggunaan
                  </span>
                  <div className="my-1">
                    <span className="text-lg font-black text-slate-900 block">
                      {subscriptionSummary?.usedTotal ?? 0}
                      <span className="text-xs font-semibold text-slate-400 ml-1">Prompt</span>
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 block truncate">
                    Telah berhasil dibuat
                  </span>
                </div>
              </div>

              {/* Indikator Kuota / Kapasitas */}
              {subscriptionSummary?.isAdmin || userProfile?.role === 'admin' ? (
                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-900 flex items-center gap-2.5">
                  <Crown className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>
                    <strong>Akun Administrator:</strong> Anda memiliki hak akses penuh tanpa batasan poin (Unlimited) untuk seluruh pembuatan prompt infografis.
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Ketersediaan Poin Prompt</span>
                    <span className="font-bold text-slate-800">
                      {subscriptionSummary?.promptBalance ?? 0} / {subscriptionSummary?.totalGranted ?? 3} Poin
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        (subscriptionSummary?.promptBalance ?? 0) <= 0
                          ? 'bg-rose-500 w-full'
                          : (subscriptionSummary?.promptBalance ?? 0) < 3
                          ? 'bg-amber-500'
                          : 'bg-[#3b49df]'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(5, ((subscriptionSummary?.promptBalance ?? 0) / Math.max(1, subscriptionSummary?.totalGranted ?? 3)) * 100))}%`
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    * Poin prompt aktif selamanya tanpa batas waktu dan hanya berkurang saat Anda men-generate prompt infografis baru.
                  </p>
                </div>
              )}

              {/* Untuk PENGGUNA BIASA — Tombol Top-Up Saldo Prompt */}
              {!isActualAdmin && (
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>Isi Ulang Saldo Prompt STIVIA</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Beli paket saldo prompt sesuai kebutuhan mengajar Anda. Saldo aktif selamanya dan tidak pernah hangus.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href={getWhatsAppTopUpUrl({
                        userEmail,
                        userName: userProfile?.full_name,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                      title="Chat langsung dengan Admin via WhatsApp untuk aktivasi cepat"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat Admin via WA</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowProModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm bg-gradient-to-r from-[#3b49df] to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white shadow-indigo-600/20"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-300" />
                      <span>Pilihan Paket Saldo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Kartu Informasi Hak Akses & Keamanan RLS */}
            <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/50 rounded-3xl p-6 border border-indigo-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-[#3b49df] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Keamanan & Kepemilikan Data Terproteksi</span>
              </div>
              <p className="leading-relaxed">
                Profil dan saldo prompt Anda diamankan dengan mekanisme <strong>Row Level Security (RLS)</strong> Supabase. Hanya Anda dan sistem STIVIA yang berhak mengakses data ini.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PILIHAN PAKET TOP-UP SALDO PROMPT */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 block">
                    Model Saldo Prompt
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Paket Saldo Prompt STIVIA
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              STIVIA menggunakan sistem <strong>Saldo Prompt</strong> yang fleksibel. Saldo tidak pernah kedaluwarsa atau hangus di akhir bulan, sangat cocok untuk pendidik saat libur semester maupun saat sibuk mengajar.
            </p>

            <div className="space-y-3">
              {PROMPT_PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    pkg.popular
                      ? 'bg-gradient-to-br from-indigo-50/90 to-blue-50/80 border-indigo-200 shadow-2xs'
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
                      <span className="text-[11px] font-bold text-amber-700 block">+{pkg.prompts} Prompt</span>
                      <a
                        href={getWhatsAppTopUpUrl({
                          userEmail,
                          userName: userProfile?.full_name,
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Aktif Selamanya (Tanpa Batas Waktu)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Tidak Pernah Hangus</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">20 Gaya Visual Lengkap</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Format Portrait, Square, Landscape</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#3b49df]">
                <Info className="w-4 h-4 shrink-0" />
                <span>Petunjuk Pembelian & Top-Up:</span>
              </div>
              <p className="leading-relaxed text-[11px] text-indigo-900/80">
                Untuk menambah saldo prompt, hubungi <strong>Administrator STIVIA</strong> dengan menyebutkan email akun Anda ({userProfile?.email || session?.user?.email || 'email Anda'}) dan paket yang dipilih. Saldo akan ditambahkan secara instan ke akun Anda.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={getWhatsAppTopUpUrl({
                  userEmail,
                  userName: userProfile?.full_name,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Admin via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setShowProModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
