import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SupabaseUserProfile } from '../types';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  fullName: string;
  email: string;
  password: string;
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
      },
    },
  });

  if (error) {
    throw new Error(formatAuthError(error));
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
  if (!userId || !isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Jika profile belum siap atau query RLS mengembalikan empty, log sebagai info
      return null;
    }

    return data as SupabaseUserProfile;
  } catch (err) {
    console.warn('Gagal memuat profil pengguna dari public.profiles:', err);
    return null;
  }
}
