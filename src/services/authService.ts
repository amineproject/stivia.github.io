import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SupabaseUserProfile } from '../types';
import { registerFreePromptClaim } from './subscriptionService';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface SupabaseDetailedError {
  operation: 'SELECT' | 'UPDATE' | 'INSERT' | 'AUTH_GET_USER' | 'AUTH_UPDATE_USER';
  code: string;
  message: string;
  details: string | null;
  hint: string | null;
}

export class ProfileSaveError extends Error {
  supabaseError: SupabaseDetailedError;

  constructor(message: string, supabaseError: SupabaseDetailedError) {
    super(message);
    this.name = 'ProfileSaveError';
    this.supabaseError = supabaseError;
    Object.setPrototypeOf(this, ProfileSaveError.prototype);
  }
}

/**
 * Menerjemahkan pesan error teknis Supabase Auth ke Bahasa Indonesia yang ramah dan mudah dipahami guru.
 */
export function formatAuthError(error: any): string {
  if (!error) return 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.';
  const msg = (typeof error === 'string' ? error : error.message || '').toLowerCase();

  if (
    msg.includes('invalid login credentials') ||
    msg.includes('invalid_grant') ||
    msg.includes('invalid_credentials')
  ) {
    return 'Email atau kata sandi salah. Silakan periksa kembali.';
  }

  if (
    msg.includes('user already registered') ||
    msg.includes('already registered') ||
    msg.includes('user_already_exists')
  ) {
    return 'Email tersebut sudah terdaftar. Silakan masuk menggunakan akun Anda.';
  }

  if (
    msg.includes('password should be at least') ||
    msg.includes('weak_password') ||
    msg.includes('password is too short')
  ) {
    return 'Kata sandi minimal terdiri dari 6 karakter.';
  }

  if (
    msg.includes('invalid email') ||
    msg.includes('unable to validate email') ||
    msg.includes('validation_failed')
  ) {
    return 'Format alamat email tidak valid.';
  }

  if (msg.includes('email not confirmed')) {
    return 'Email belum dikonfirmasi. Silakan periksa kotak masuk atau spam email Anda.';
  }

  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Terlalu banyak percobaan. Silakan tunggu beberapa menit sebelum mencoba lagi.';
  }

  if (
    msg.includes('token is expired') ||
    msg.includes('token has expired') ||
    msg.includes('recovery link is invalid') ||
    msg.includes('invalid or expired link') ||
    msg.includes('otp expired')
  ) {
    return 'Tautan reset password sudah kedaluwarsa atau tidak valid. Silakan ajukan permohonan baru.';
  }

  if (
    msg.includes('should be different') ||
    msg.includes('same_password') ||
    msg.includes('same as old')
  ) {
    return 'Kata sandi baru harus berbeda dari kata sandi sebelumnya.';
  }

  if (msg.includes('network') || msg.includes('failed to fetch') || msg.includes('cors')) {
    return 'Koneksi ke server terganggu. Periksa koneksi internet Anda.';
  }

  return error.message || 'Gagal memproses autentikasi. Silakan periksa data Anda.';
}

/**
 * Masuk menggunakan Supabase Auth email + kata sandi
 */
export async function signInWithEmail({ email, password }: SignInCredentials) {
  const cleanEmail = email.trim();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    throw new Error(formatAuthError(error));
  }

  if (data.session?.user) {
    try {
      await registerFreePromptClaim();
    } catch (claimError) {
      console.warn(
        '[STIVIA Anti-Abuse] Error klaim Free setelah sign in:',
        claimError
      );
    }
  }

  return data;
}

/**
 * Mendaftarkan akun pendidik baru ke Supabase Auth dengan menyertakan full_name di metadata.
 * Trigger database handle_new_user() di Supabase akan secara otomatis membuat entri di public.profiles.
 */
export async function signUpWithEmail({ fullName, email, password }: SignUpCredentials) {
  const cleanEmail = email.trim();
  const cleanName = fullName.trim();

const { data, error } = await supabase.auth.signUp({
  email: cleanEmail,
  password,
  options: {
    data: {
      full_name: cleanName,
      role: 'user',
      plan: 'free',
      subscription_status: 'active',
    },
  },
});

if (error) {
  throw new Error(formatAuthError(error));
}

  /**
   * Jika Supabase langsung memberikan session setelah sign up,
   * lakukan klaim Free 3 poin sekarang via anti-abuse check.
   *
   * Jika email confirmation aktif dan session belum tersedia,
   * proses klaim akan dilakukan secara otomatis pada saat session pertama aktif.
   */
  if (data.session?.user) {
    try {
      await registerFreePromptClaim();
    } catch (claimError) {
      console.warn(
        '[STIVIA Anti-Abuse] Error klaim Free setelah sign up:',
        claimError
      );
    }
  }

  return data;
}

/**
 * Mengirim email pemulihan kata sandi melalui Supabase Auth
 */
export async function resetPasswordForEmail(email: string) {
  const cleanEmail = email.trim();
  const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;

  const { data, error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo: redirectUrl,
  });

  if (error) {
    throw new Error(formatAuthError(error));
  }

  return data;
}

/**
 * Memperbarui kata sandi pengguna menggunakan Supabase Auth (setelah link reset dibuka)
 */
export async function updateUserPassword(newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Kata sandi baru minimal terdiri dari 6 karakter.');
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(formatAuthError(error));
  }

  return data;
}

/**
 * Keluar dari sesi Supabase Auth
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(formatAuthError(error));
  }
}

/**
 * Mengambil data profil dari public.profiles berdasarkan user ID (auth.users.id)
 */
export async function getUserProfile(userId: string): Promise<SupabaseUserProfile | null> {
  if (!userId) return null;

  // Baca cache lokal terlebih dahulu untuk sinkronisasi instan
  let cachedProfile: SupabaseUserProfile | null = null;
  try {
    const saved = localStorage.getItem(`stivia_profile_${userId}`);
    if (saved) {
      cachedProfile = JSON.parse(saved) as SupabaseUserProfile;
    }
  } catch {
    // ignore
  }

  // Fallback jika mode demo tanpa Supabase
  if (!isSupabaseConfigured) {
    return cachedProfile;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[STIVIA Profil] Catatan saat mengambil profil dari public.profiles:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return cachedProfile;
    }

    if (!data) {
      return cachedProfile;
    }

    // Gabungkan data Supabase dengan cache lokal jika ada field lokal
    const mergedProfile: SupabaseUserProfile = {
      id: data.id || userId,
      full_name: data.full_name ?? cachedProfile?.full_name ?? null,
      title: data.title ?? cachedProfile?.title ?? null,
      school_name: data.school_name ?? cachedProfile?.school_name ?? null,
      institution_name: (data as Record<string, any>).institution_name ?? cachedProfile?.institution_name ?? null,
      avatar_url: data.avatar_url ?? cachedProfile?.avatar_url ?? null,
      role: (data as Record<string, any>).role ?? cachedProfile?.role ?? 'user',
      plan: (data as Record<string, any>).plan ?? cachedProfile?.plan ?? 'free',
      subscription_status: (data as Record<string, any>).subscription_status ?? cachedProfile?.subscription_status ?? 'active',
      created_at: data.created_at ?? cachedProfile?.created_at,
      updated_at: data.updated_at ?? cachedProfile?.updated_at,
    };

    try {
      localStorage.setItem(`stivia_profile_${userId}`, JSON.stringify(mergedProfile));
    } catch {
      // ignore
    }

    return mergedProfile;
  } catch (err) {
    console.warn('[STIVIA Profil] Exception saat getUserProfile:', err);
    return cachedProfile;
  }
}

/**
 * Memperbarui data profil di tabel public.profiles untuk pengguna yang sedang login.
 * Mengikuti prinsip:
 * 1. Verifikasi user yang login via supabase.auth.getUser() (LANGKAH 2).
 * 2. Gunakan auth.uid() / user.id sebagai identifier profil yang sah.
 * 3. Periksa keberadaan record profiles (LANGKAH 3).
 * 4. Pola ownership murni: UPDATE public.profiles WHERE id = authenticated_user_id (LANGKAH 4).
 *    Hanya memperbarui: full_name, title, school_name, avatar_url, updated_at.
 *    TIDAK memperbarui id atau created_at.
 * 5. Log detail teknis Supabase (code, message, details, hint) untuk developer (LANGKAH 1 & 7).
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    full_name?: string | null;
    title?: string | null;
    school_name?: string | null;
    institution_name?: string | null;
    avatar_url?: string | null;
  }
): Promise<SupabaseUserProfile> {
  if (!userId) {
    throw new Error('Profil gagal disimpan. Silakan coba lagi.');
  }

  // Fallback untuk mode Demo jika Supabase belum dikonfigurasi
  if (!isSupabaseConfigured) {
    const mockProfile: SupabaseUserProfile = {
      id: userId,
      full_name: updates.full_name !== undefined ? updates.full_name : null,
      title: updates.title !== undefined ? updates.title : null,
      school_name: updates.school_name !== undefined ? updates.school_name : null,
      institution_name: updates.institution_name !== undefined ? updates.institution_name : null,
      avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : null,
      updated_at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(`stivia_profile_${userId}`, JSON.stringify(mockProfile));
    } catch {
      // ignore
    }
    return mockProfile;
  }

  // LANGKAH 2: Verifikasi user yang sedang login dengan supabase.auth.getUser()
  const { data: authData, error: authError } = await supabase.auth.getUser();
  let authenticatedUser = authData?.user;

  // Fallback ke getSession jika getUser() mengalami kegagalan transient
  if (!authenticatedUser) {
    const { data: sessionData } = await supabase.auth.getSession();
    authenticatedUser = sessionData?.session?.user;
  }

  if (!authenticatedUser || !authenticatedUser.id) {
    const detailError: SupabaseDetailedError = {
      operation: 'AUTH_GET_USER',
      code: authError?.status?.toString() || 'AUTH_NO_SESSION',
      message: authError?.message || 'Tidak ada sesi login aktif saat menyimpan profil.',
      details: null,
      hint: 'Silakan login kembali ke akun STIVIA Anda.',
    };
    console.error('[STIVIA Profil] Operasi autentikasi gagal:', detailError);
    throw new ProfileSaveError('Sesi autentikasi telah berakhir. Silakan login kembali.', detailError);
  }

  const authenticatedUserId = authenticatedUser.id;

  // Validasi kepemilikan: hanya bisa mengedit profil miliknya sendiri (auth.uid() = id)
  if (authenticatedUserId !== userId) {
    const detailError: SupabaseDetailedError = {
      operation: 'UPDATE',
      code: 'FORBIDDEN_USER_MISMATCH',
      message: `ID akun aktif (${authenticatedUserId}) tidak cocok dengan ID target profil (${userId}).`,
      details: null,
      hint: 'Pengguna hanya diizinkan memperbarui data profil akun miliknya sendiri sesuai kebijakan auth.uid() = id.',
    };
    console.error('[STIVIA Profil] Akses ditolak:', detailError);
    throw new ProfileSaveError('Akses ditolak: Anda hanya dapat mengubah profil akun Anda sendiri.', detailError);
  }

  // LANGKAH 4: Bentuk payload pembaruan (hanya field yang ada di public.profiles)
  const baseUpdatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.full_name !== undefined) {
    baseUpdatePayload.full_name = updates.full_name ? updates.full_name.trim() : null;
  }
  if (updates.title !== undefined) {
    baseUpdatePayload.title = updates.title ? updates.title.trim() : null;
  }
  if (updates.school_name !== undefined) {
    baseUpdatePayload.school_name = updates.school_name ? updates.school_name.trim() : null;
  }
  if (updates.avatar_url !== undefined) {
    baseUpdatePayload.avatar_url = updates.avatar_url ? updates.avatar_url.trim() : null;
  }

  // LANGKAH 3: Periksa apakah record sudah ada di public.profiles untuk profiles.id = auth.uid()
  let recordExists = false;
  try {
    const { data: checkData, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authenticatedUserId)
      .maybeSingle();

    if (checkError) {
      console.warn('[STIVIA Profil] Pemeriksaan profil (SELECT) menghasilkan catatan:', {
        operasi: 'SELECT',
        code: checkError.code,
        message: checkError.message,
        details: checkError.details,
        hint: checkError.hint,
      });
    }

    if (checkData && checkData.id) {
      recordExists = true;
    }
  } catch (checkErr) {
    console.warn('[STIVIA Profil] Gagal memeriksa profil yang ada via SELECT:', checkErr);
  }

  let savedData: SupabaseUserProfile | null = null;

  if (recordExists) {
    // =========================================================================
    // SKENARIO 1: RECORD SUDAH ADA -> EKSEKUSI MURNI UPDATE
    // Menggunakan WHERE id = authenticated_user_id (sesuai policy auth.uid() = id)
    // JANGAN melakukan fallback ke INSERT jika UPDATE gagal.
    // =========================================================================
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update(baseUpdatePayload)
      .eq('id', authenticatedUserId)
      .select();

    if (updateError) {
      const detailError: SupabaseDetailedError = {
        operation: 'UPDATE',
        code: updateError.code || 'UNKNOWN_UPDATE_ERROR',
        message: updateError.message || 'Gagal mengeksekusi UPDATE pada public.profiles.',
        details: updateError.details || null,
        hint: updateError.hint || null,
      };

      console.error('[STIVIA Profil] Operasi UPDATE public.profiles GAGAL:', {
        operasi: detailError.operation,
        code: detailError.code,
        message: detailError.message,
        details: detailError.details,
        hint: detailError.hint,
      });

      // Jangan menyembunyikan error teknis Supabase
      throw new ProfileSaveError(
        `Gagal memperbarui profil: [${detailError.code}] ${detailError.message}${detailError.hint ? ` (${detailError.hint})` : ''}`,
        detailError
      );
    }

    if (updateData && updateData.length === 0) {
      const detailError: SupabaseDetailedError = {
        operation: 'UPDATE',
        code: 'PGRST_ZERO_ROWS',
        message: '0 baris diperbarui. PostgREST tidak mengubah baris pada public.profiles.',
        details: `User ID: ${authenticatedUserId}`,
        hint: 'Periksa kebijakan RLS FOR UPDATE: pastikan kebijakan FOR UPDATE USING (auth.uid() = id) aktif di Supabase.',
      };

      console.error('[STIVIA Profil] Operasi UPDATE menghasilkan 0 baris:', {
        operasi: detailError.operation,
        code: detailError.code,
        message: detailError.message,
        details: detailError.details,
        hint: detailError.hint,
      });

      throw new ProfileSaveError(
        `Gagal memperbarui profil: [${detailError.code}] ${detailError.message}`,
        detailError
      );
    }

    if (updateData && updateData.length > 0) {
      savedData = updateData[0] as SupabaseUserProfile;
    }
  } else {
    // =========================================================================
    // SKENARIO 2: RECORD BELUM ADA -> EKSEKUSI INISIALISASI INSERT
    // id = authenticated_user_id (sesuai policy auth.uid() = id)
    // =========================================================================
    const insertPayload: Record<string, any> = {
      id: authenticatedUserId,
      ...baseUpdatePayload,
      created_at: new Date().toISOString(),
    };

    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert(insertPayload)
      .select();

    if (insertError) {
      const detailError: SupabaseDetailedError = {
        operation: 'INSERT',
        code: insertError.code || 'UNKNOWN_INSERT_ERROR',
        message: insertError.message || 'Gagal mengeksekusi INSERT pada public.profiles.',
        details: insertError.details || null,
        hint: insertError.hint || null,
      };

      console.error('[STIVIA Profil] Operasi INSERT public.profiles GAGAL:', {
        operasi: detailError.operation,
        code: detailError.code,
        message: detailError.message,
        details: detailError.details,
        hint: detailError.hint,
      });

      throw new ProfileSaveError(
        `Gagal membuat profil baru: [${detailError.code}] ${detailError.message}${detailError.hint ? ` (${detailError.hint})` : ''}`,
        detailError
      );
    }

    if (insertData && insertData.length > 0) {
      savedData = insertData[0] as SupabaseUserProfile;
    }
  }

  // Sinkronisasi metadata pengguna di Supabase Auth jika full_name / institution_name diperbarui
  if (updates.full_name || updates.institution_name !== undefined) {
    try {
      const authDataUpdates: Record<string, any> = {};
      if (updates.full_name) authDataUpdates.full_name = updates.full_name.trim();
      if (updates.institution_name !== undefined) authDataUpdates.institution_name = updates.institution_name ? updates.institution_name.trim() : '';
      
      await supabase.auth.updateUser({
        data: authDataUpdates,
      });
    } catch (authUpdateErr) {
      console.warn('[STIVIA Profil] Catatan pembaruan user_metadata Auth:', authUpdateErr);
    }
  }

  // Bentuk objek SupabaseUserProfile lengkap
  const finalProfile: SupabaseUserProfile = {
    id: authenticatedUserId,
    full_name: updates.full_name !== undefined ? updates.full_name : (savedData?.full_name || null),
    title: updates.title !== undefined ? updates.title : (savedData?.title || null),
    school_name: updates.school_name !== undefined ? updates.school_name : (savedData?.school_name || null),
    institution_name: updates.institution_name !== undefined ? updates.institution_name : (savedData?.institution_name || null),
    avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : (savedData?.avatar_url || null),
    created_at: savedData?.created_at,
    updated_at: savedData?.updated_at || new Date().toISOString(),
  };

  // Simpan ke localStorage sebagai cache yang persisten
  try {
    localStorage.setItem(`stivia_profile_${authenticatedUserId}`, JSON.stringify(finalProfile));
  } catch {
    // ignore
  }

  return finalProfile;
}
