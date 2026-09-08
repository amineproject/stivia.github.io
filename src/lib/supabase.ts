import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Mengetahui apakah variabel lingkungan Supabase sudah dikonfigurasi dengan benar.
 */
export const isSupabaseConfigured: boolean = Boolean(
  rawUrl &&
  rawUrl.trim() !== '' &&
  rawAnonKey &&
  rawAnonKey.trim() !== '' &&
  rawUrl.startsWith('http')
);

// Menggunakan fallback URL yang aman agar createClient tidak menghasilkan uncaught exception saat env belum diisi
const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawAnonKey : 'placeholder-anon-key';

/**
 * Client Supabase terpusat untuk STIVIA 2.2D
 * Menyediakan fondasi untuk Supabase Auth dan operasi database tanpa menduplikasi instans client.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
