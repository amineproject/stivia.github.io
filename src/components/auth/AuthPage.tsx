import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  BookOpen,
  Palette,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { APP_CURRENT_VERSION } from '../../data/versionHistoryData';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  resetPasswordForEmail, 
  formatAuthError 
} from '../../services/authService';

export type AuthView = 'login' | 'register' | 'forgot_password';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onDemoLogin?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  onAuthSuccess,
  onDemoLogin 
}) => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetFormState = (newView: AuthView) => {
    setCurrentView(newView);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Validation Helpers
  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Silakan lengkapi alamat email dan kata sandi Anda.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Format alamat email tidak valid.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Konfigurasi Supabase (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) belum diatur di environment. Anda dapat menggunakan opsi Masuk Mode Demo di bawah.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail({ email, password });
      onAuthSuccess();
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validasi field
    if (!fullName.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Alamat email wajib diisi.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Format alamat email tidak valid.');
      return;
    }

    if (!password) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi harus terdiri dari minimal 6 karakter.');
      return;
    }

    if (!confirmPassword) {
      setErrorMessage('Silakan masukkan konfirmasi kata sandi.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak sama.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Konfigurasi Supabase (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) belum diatur di environment.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUpWithEmail({
        fullName,
        email,
        password,
      });

      // Jika user langsung memiliki session aktif
      if (res.session) {
        onAuthSuccess();
      } else {
        // Jika perlu konfirmasi email
        setSuccessMessage('Pendaftaran akun berhasil! Silakan periksa email Anda untuk verifikasi atau langsung coba masuk.');
        // Berpindah ke login
        setTimeout(() => {
          setCurrentView('login');
        }, 2000);
      }
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Silakan masukkan alamat email akun Anda.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Format alamat email tidak valid.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Konfigurasi Supabase (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) belum diatur di environment.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordForEmail(email);
      setSuccessMessage('Tautan pemulihan kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.');
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Brand Visual & Information (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#3b49df] via-[#323ebd] to-[#1e293b] p-10 text-white flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl font-black tracking-tight text-white font-sans">
                STIVIA
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/20">
                v{APP_CURRENT_VERSION}
              </span>
            </div>
            <p className="text-sm text-indigo-100 mt-2 font-medium leading-relaxed">
              Belajar Lebih Visual, Mengajar Lebih Mudah
            </p>
          </div>

          {/* Value Highlights */}
          <div className="relative z-10 space-y-6 my-auto py-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-200 shrink-0 border border-white/10">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">20 Gaya Visual Edukatif</h3>
                <p className="text-xs text-indigo-100/80 mt-1 leading-relaxed">
                  Dari Modern & Digital, Hand Drawing, hingga Infografis Sains yang terstandar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-200 shrink-0 border border-white/10">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Kendali Pertemuan Kurikulum</h3>
                <p className="text-xs text-indigo-100/80 mt-1 leading-relaxed">
                  Batas materi presisi per pertemuan tanpa pengulangan materi dasar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-200 shrink-0 border border-white/10">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Ekspor Kualitas Tinggi</h3>
                <p className="text-xs text-indigo-100/80 mt-1 leading-relaxed">
                  Simpan hasil desain dalam format PNG, JPG High-DPI, dan dokumen pembelajaran.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200/90">
            <span>Dirancang khusus untuk guru & pendidik</span>
            <span className="font-semibold text-white">Supabase Auth</span>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Mobile Header Brand */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#3b49df] font-sans">
                  STIVIA
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#3b49df] border border-indigo-100">
                  v{APP_CURRENT_VERSION}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Belajar Lebih Visual, Mengajar Lebih Mudah
              </p>
            </div>
          </div>

          {/* Environmental Notice if Supabase variables are absent */}
          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Konfigurasi Supabase Belum Lengkap</p>
                  <p className="text-amber-800 leading-relaxed">
                    Variabel <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_URL</code> dan <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_ANON_KEY</code> belum diisi di environment.
                  </p>
                  {onDemoLogin && (
                    <button
                      type="button"
                      onClick={onDemoLogin}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors cursor-pointer text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Masuk Mode Demo / Tinjau Aplikasi</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* Animate View Switches */}
          <AnimatePresence mode="wait">
            {currentView === 'login' && (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Masuk ke STIVIA
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Gunakan akun Anda untuk mengelola rancangan dan infografis pembelajaran.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="login-email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@sekolah.sch.id"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#3b49df] focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={() => resetFormState('forgot_password')}
                        className="text-xs font-semibold text-[#3b49df] hover:text-indigo-800 transition-colors cursor-pointer"
                      >
                        Lupa password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="login-password-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#3b49df] focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="btn-login-submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-[#3b49df] hover:bg-[#323ebd] text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memverifikasi Akun...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-8 pt-5 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-600">
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => resetFormState('register')}
                      className="font-bold text-[#3b49df] hover:underline cursor-pointer ml-1"
                    >
                      Daftar Akun
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {currentView === 'register' && (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Daftar Akun Pendidik
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Buat akun baru untuk mulai mendesain infografis pembelajaran berkualitas.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap & Gelar
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="register-fullname-input"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Amin Wahyudi, S.Pd."
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#3b49df] focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="register-email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@sekolah.sch.id"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#3b49df] focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kata Sandi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="register-password-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 6 karakter"
                          className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#3b49df] focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Konfirmasi Kata Sandi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="register-confirm-password-input"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi"
                          className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#3b49df] focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="btn-register-submit"
                    disabled={isLoading}
                    className="w-full mt-3 py-3 px-4 rounded-xl bg-[#3b49df] hover:bg-[#323ebd] text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mendaftarkan Akun...</span>
                      </>
                    ) : (
                      <>
                        <span>Daftar</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-600">
                    Sudah memiliki akun?{' '}
                    <button
                      type="button"
                      onClick={() => resetFormState('login')}
                      className="font-bold text-[#3b49df] hover:underline cursor-pointer ml-1"
                    >
                      Masuk
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {currentView === 'forgot_password' && (
              <motion.div
                key="forgot-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => resetFormState('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Halaman Masuk</span>
                  </button>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Lupa Password?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Masukkan email akun Anda. Kami akan mengirimkan tautan untuk menyetel ulang kata sandi Anda.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Alamat Email Terdaftar
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="forgot-email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@sekolah.sch.id"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#3b49df] focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="btn-forgot-submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-[#3b49df] hover:bg-[#323ebd] text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengirim Tautan...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Tautan Pemulihan</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-8 pt-5 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-600">
                    Ingat kata sandi Anda?{' '}
                    <button
                      type="button"
                      onClick={() => resetFormState('login')}
                      className="font-bold text-[#3b49df] hover:underline cursor-pointer ml-1"
                    >
                      Masuk sekarang
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
