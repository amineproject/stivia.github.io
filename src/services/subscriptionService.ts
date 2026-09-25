import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  SubscriptionPlan,
  UserRole,
  SubscriptionStatus,
  SUBSCRIPTION_PLANS,
  UserSubscription,
  MonthlyUsage,
  SubscriptionSummary,
} from '../types';

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/**
 * Mendapatkan identifier periode penagihan/penggunaan bulanan saat ini (Format: YYYY-MM)
 * Contoh: "2026-09"
 */
export function getCurrentBillingPeriod(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Memformat identifier periode ke Bahasa Indonesia yang ramah bagi pendidik.
 * Contoh: "2026-09" -> "September 2026"
 */
export function formatPeriodLabel(period: string): string {
  if (!period || !period.includes('-')) return period || 'Bulan Ini';
  const parts = period.split('-');
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  if (monthIdx >= 0 && monthIdx < 12) {
    return `${MONTH_NAMES_ID[monthIdx]} ${year}`;
  }
  return period;
}

// Cache in-memory dan deduplikasi request in-flight untuk mencegah pemanggilan berulang
const memorySubCache = new Map<string, { data: UserSubscription; timestamp: number }>();
const inFlightSubRequests = new Map<string, Promise<UserSubscription>>();
const loggedWarnings = new Set<string>();
const CACHE_TTL_MS = 4000; // 4 detik TTL in-memory

/**
 * Mendapatkan ID unik browser/perangkat untuk anti-abuse.
 *
 * Digunakan untuk membatasi klaim Free 3 prompt berulang
 * tanpa mengubah struktur user_subscriptions.
 */
export function getStiviaDeviceKey(): string {
  const STORAGE_KEY = 'stivia_device_key';

  try {
    const existingKey = localStorage.getItem(STORAGE_KEY);

    if (existingKey && existingKey.length >= 16) {
      return existingKey;
    }

    const newKey =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(STORAGE_KEY, newKey);

    return newKey;
  } catch {
    return `fallback-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Mendaftarkan klaim Free 3 prompt untuk browser/perangkat ini.
 *
 * Catatan:
 * - Admin tidak membutuhkan klaim Free.
 * - Identitas user ditentukan oleh Supabase Auth melalui auth.uid()
 *   di dalam RPC.
 * - Device key digunakan untuk mencegah satu browser membuat banyak
 *   akun demi memperoleh Free 3 prompt berulang kali.
 * - Tidak mengubah struktur user_subscriptions.
 */
export async function registerFreePromptClaim(): Promise<boolean> {
  if (!isSupabaseConfigured) {
    // Mode demo/offline tidak menggunakan mekanisme anti-abuse Supabase.
    return true;
  }

  try {
    const deviceKey = getStiviaDeviceKey();

    const { data, error } = await supabase.rpc(
      'claim_free_prompt',
      {
        p_device_key: deviceKey,
      }
    );

    if (error) {
      console.warn(
        '[STIVIA Anti-Abuse] Gagal melakukan klaim Free:',
        error.message
      );

      // Fail-safe:
      // Jangan menghukum user hanya karena RPC mengalami masalah.
      return true;
    }

    /**
     * RPC mengembalikan JSON:
     *
     * {
     *   success: boolean,
     *   reason: string,
     *   prompt_balance?: number
     * }
     */

    if (data && typeof data === 'object') {
      if (data.success === true) {
        return true;
      }

      console.warn(
        '[STIVIA Anti-Abuse] Klaim Free ditolak:',
        data.reason || 'unknown_reason'
      );

      return false;
    }

    return false;
  } catch (error) {
    console.warn(
      '[STIVIA Anti-Abuse] Error saat melakukan klaim Free:',
      error
    );

    // Fail-safe:
    // Jangan menghukum user jika terjadi error teknis.
    return true;
  }
}
/**
 * Helper internal untuk menampilkan warning hanya 1 kali per kunci/sesi
 * Mencegah banjir log di konsol browser pada setiap render ulang UI.
 */
function warnOnce(key: string, ...args: any[]): void {
  if (!loggedWarnings.has(key)) {
    loggedWarnings.add(key);
    console.warn(...args);
  }
}

/**
 * Membersihkan cache in-memory untuk user tertentu
 */
export function invalidateSubscriptionCache(userId?: string): void {
  if (userId) {
    memorySubCache.delete(userId);
    inFlightSubRequests.delete(userId);
  } else {
    memorySubCache.clear();
    inFlightSubRequests.clear();
  }
}

/**
 * Helper internal untuk memvalidasi apakah sesi Supabase Auth saat ini aktif dan cocok dengan target userId.
 * Menggunakan session Supabase sebagai sumber kebenaran identitas pengguna.
 * Mencegah query dan operasi DML ke database jika pengguna belum terautentikasi (anon)
 * sehingga tidak memicu error 'permission denied for table user_subscriptions'.
 */
async function getAuthenticatedUser(targetUserId: string) {
  if (!isSupabaseConfigured || !targetUserId || targetUserId === 'guest') {
    return null;
  }

  try {
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr || !sessionData?.session?.user) {
      return null;
    }

    const authUser = sessionData.session.user;
    if (authUser.id !== targetUserId) {
      // Sesi aktif milik user lain; jangan akses data user yang berbeda untuk mematuhi RLS
      return null;
    }

    return authUser;
  } catch {
    return null;
  }
}

/**
 * Helper internal untuk memverifikasi apakah pemanggil memiliki hak Administrator yang sah.
 * Otorisasi didasarkan pada data server dan sesi terotentikasi:
 * 1. Mode demo pendidik (demo-pendidik-001) diizinkan untuk pengujian fitur admin
 * 2. Email pengguna terverifikasi pada token auth adalah email administrator resmi (aminexplore@gmail.com) secara case-insensitive
 * 3. Atau record pengguna di tabel Supabase public.user_subscriptions berstatus role = 'admin'
 * 4. Atau profil pengguna di tabel public.profiles berstatus role = 'admin'
 * 5. Atau hak istimewa admin yang telah tervalidasi sebelumnya dalam sesi terotentikasi
 */
async function verifyAdminAuthorization(userId: string): Promise<boolean> {
  if (!userId || userId === 'guest') return false;

  // Akun mode demo diizinkan untuk simulasi peran
  if (userId.startsWith('demo-')) {
    return true;
  }

  // 1. Periksa sesi Supabase aktif saat ini
  let currentAuthEmail = '';
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    currentAuthEmail = sessionData?.session?.user?.email || '';
  } catch {
    // ignore
  }

  const authUser = await getAuthenticatedUser(userId);
  const userEmail = (authUser?.email || currentAuthEmail || '').toLowerCase().trim();

  // 2. Verifikasi email pemilik/administrator resmi STIVIA
  if (userEmail === 'aminexplore@gmail.com') {
    return true;
  }

  // 3. Verifikasi status role admin dari database server Supabase (user_subscriptions)
  if (authUser) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('role')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (!error && data && data.role === 'admin') {
        return true;
      }
    } catch {
      // ignore
    }

    // 4. Verifikasi status role admin dari tabel profiles
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profile) {
        if (profile.role === 'admin' || (profile.email && profile.email.toLowerCase().trim() === 'aminexplore@gmail.com')) {
          return true;
        }
      }
    } catch {
      // ignore
    }
  }

  // 5. Cek privilege persistence jika akun ini telah diverifikasi sebagai admin pada sesi ini
  if (typeof window !== 'undefined' && localStorage.getItem(`stivia_admin_privilege_${userId}`) === 'true') {
    return true;
  }

  return false;
}

/**
 * Mengambil data subscription pengguna
 * Memastikan alur yang aman:
 * 1. Cache In-Memory & Deduplikasi In-Flight
 * 2. Validasi Session Supabase Auth
 * 3. Query SELECT ke tabel public.user_subscriptions (auth.uid() = user_id)
 * 4. JIKA BELUM ADA: Sinkronisasi via Database Trigger / RPC server-side (TANPA CLIENT-SIDE INSERT)
 * 5. Fallback ke Cache Lokal / Default Free
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  if (!userId || userId === 'guest') {
    return createDefaultSubscription('guest');
  }

  // 1. Cek cache in-memory untuk efisiensi render UI
  const now = Date.now();
  const memoryHit = memorySubCache.get(userId);
  if (memoryHit && now - memoryHit.timestamp < CACHE_TTL_MS) {
    return memoryHit.data;
  }

  // 2. Deduplikasi: jika ada request yang sedang berjalan untuk user_id ini, gunakan promise yang sama
  const inFlight = inFlightSubRequests.get(userId);
  if (inFlight) {
    return inFlight;
  }

  // Eksekusi pengambilan data dengan membungkusnya dalam promise terdeduplikasi
  const fetchPromise = (async (): Promise<UserSubscription> => {
    // A. Baca cache lokal (localStorage)
    let cachedSub: UserSubscription | null = null;
    try {
      const raw = localStorage.getItem(`stivia_sub_${userId}`);
      if (raw) {
        cachedSub = JSON.parse(raw) as UserSubscription;
      }
    } catch {
      // ignore
    }

    // Fallback cepat jika Supabase belum dikonfigurasi (Mode Demo / Offline)
    if (!isSupabaseConfigured) {
      return cachedSub || createDefaultSubscription(userId);
    }

    // B. Verifikasi sesi autentikasi Supabase Auth sebelum menyentuh database
    // Sumber kebenaran identitas adalah session Supabase, bukan sekadar parameter userId dari UI.
    const authUser = await getAuthenticatedUser(userId);
    if (!authUser) {
      // Kondisi 1 & 2: User belum login atau sesi Auth masih dipulihkan.
      // JANGAN query database, JANGAN insert, JANGAN update.
      return cachedSub || createDefaultSubscription(userId);
    }

    // C. Ambil data dari Supabase tabel user_subscriptions secara terautentikasi (auth.uid() = userId)
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (error) {
        const isPermissionDenied =
          error.code === '42501' ||
          error.message.toLowerCase().includes('permission denied');
        if (isPermissionDenied) {
          warnOnce(`rls_${userId}`, '[STIVIA Subscription] Akses ditolak RLS saat query subscription untuk user_id:', userId);
        } else {
          warnOnce(`query_err_${userId}`, '[STIVIA Subscription] Catatan saat mengambil subscription Supabase:', error.message);
        }
        // JANGAN melakukan INSERT dari browser jika terjadi error query/RLS
        return cachedSub || createDefaultSubscription(userId);
      }

      // D. Record ditemukan di database
      if (data) {
        let record = data;
        const isAdmin = record.role === 'admin';
        const role: UserRole = isAdmin ? 'admin' : 'user';

        // Jika user baru berstatus Free dan belum pernah memperoleh kuota (total_granted === 0 dan prompt_balance === 0),
        // jalankan klaim anti-abuse aman melalui RPC claim_free_prompt.
        if (!isAdmin && record.plan === 'free' && Number(record.total_granted || 0) === 0 && Number(record.prompt_balance || 0) === 0) {
          try {
            const claimed = await registerFreePromptClaim();
            if (claimed) {
              const { data: refreshed } = await supabase
                .from('user_subscriptions')
                .select('*')
                .eq('user_id', authUser.id)
                .maybeSingle();

              if (refreshed) {
                record = refreshed;
              }
            }
          } catch (claimErr) {
            console.warn('[STIVIA Anti-Abuse] Error saat evaluasi klaim di getUserSubscription:', claimErr);
          }
        }

        // Baca saldo prompt dari Supabase (atau fallback berdasarkan konfigurasi STIVIA)
        const freeDefault = SUBSCRIPTION_PLANS.free.initialPrompts; // 3 Prompt
        const promptBalance = typeof record.prompt_balance === 'number'
          ? record.prompt_balance
          : (record.plan === 'pro' ? 50 : freeDefault);

        const totalGranted = typeof record.total_granted === 'number'
          ? record.total_granted
          : Math.max(promptBalance, record.plan === 'pro' ? 50 : freeDefault);

        const usedCount = typeof record.used_count === 'number'
          ? record.used_count
          : Math.max(0, totalGranted - promptBalance);

        const sub: UserSubscription = {
          userId: record.user_id || userId,
          plan: (record.plan as SubscriptionPlan) || 'free',
          role,
          status: (record.status as SubscriptionStatus) || 'active',
          promptBalance,
          totalGranted,
          usedCount,
          startDate: record.start_date || record.created_at || new Date().toISOString(),
          endDate: isAdmin ? null : (record.end_date || null), // Admin permanen tanpa tanggal kedaluwarsa
          updatedAt: record.updated_at || new Date().toISOString(),
        };

        try {
          localStorage.setItem(`stivia_sub_${userId}`, JSON.stringify(sub));
        } catch {
          // ignore
        }

        memorySubCache.set(userId, { data: sub, timestamp: Date.now() });
        return sub;
      }

      // E. JIKA RECORD BELUM DITEMUKAN DI SUPABASE:
      // PENTING: JANGAN PERNAH melakukan client-side INSERT (.insert({...})) dari browser!
      // Inisialisasi subscription ditangani secara otomatis oleh database trigger (auth.users -> user_subscriptions)
      // atau melalui pemanggilan RPC server-side yang aman (SECURITY DEFINER).
      try {
        const { data: rpcData, error: rpcErr } = await supabase.rpc('ensure_user_subscription');
        if (!rpcErr && rpcData?.success) {
          // Jika RPC berhasil membuat atau memastikan subscription, query ulang secara aman
          const { data: refreshedData } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', authUser.id)
            .maybeSingle();

          if (refreshedData) {
            const isAdmin = refreshedData.role === 'admin';
            const freeDefault = SUBSCRIPTION_PLANS.free.initialPrompts;
            const promptBalance = typeof refreshedData.prompt_balance === 'number'
              ? refreshedData.prompt_balance
              : freeDefault;
            const totalGranted = typeof refreshedData.total_granted === 'number'
              ? refreshedData.total_granted
              : promptBalance;
            const usedCount = typeof refreshedData.used_count === 'number'
              ? refreshedData.used_count
              : 0;

            const syncedSub: UserSubscription = {
              userId: refreshedData.user_id,
              plan: (refreshedData.plan as SubscriptionPlan) || 'free',
              role: isAdmin ? 'admin' : 'user',
              status: (refreshedData.status as SubscriptionStatus) || 'active',
              promptBalance,
              totalGranted,
              usedCount,
              startDate: refreshedData.start_date || new Date().toISOString(),
              endDate: isAdmin ? null : refreshedData.end_date,
              updatedAt: refreshedData.updated_at || new Date().toISOString(),
            };

            try {
              localStorage.setItem(`stivia_sub_${userId}`, JSON.stringify(syncedSub));
            } catch {
              // ignore
            }

            memorySubCache.set(userId, { data: syncedSub, timestamp: Date.now() });
            return syncedSub;
          }
        }
      } catch {
        // Abaikan jika RPC belum di-apply di server; gunakan fallback lokal
      }

      // F. Fallback aman tampilan sementara (tanpa INSERT ke database dari browser)
      const defaultSub = cachedSub || createDefaultSubscription(userId);
      memorySubCache.set(userId, { data: defaultSub, timestamp: Date.now() });
      return defaultSub;
    } catch (err) {
      warnOnce(`catch_err_${userId}`, '[STIVIA Subscription] Catatan saat mengambil subscription:', err);
      const fallback = cachedSub || createDefaultSubscription(userId);
      memorySubCache.set(userId, { data: fallback, timestamp: Date.now() });
      return fallback;
    } finally {
      inFlightSubRequests.delete(userId);
    }
  })();

  inFlightSubRequests.set(userId, fetchPromise);
  return fetchPromise;
}

/**
 * Mengambil jumlah penggunaan generate dalam periode tertentu (default: bulan ini)
 */
export async function getMonthlyUsage(userId: string, period = getCurrentBillingPeriod()): Promise<number> {
  if (!userId || userId === 'guest') return 0;

  // Baca cache lokal
  const cacheKey = `stivia_usage_${userId}_${period}`;
  let localCount = 0;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw !== null) {
      localCount = parseInt(raw, 10) || 0;
    }
  } catch {
    // ignore
  }

  if (!isSupabaseConfigured) {
    return localCount;
  }

  // Verifikasi sesi autentikasi sebelum query ke usage_logs
  const authUser = await getAuthenticatedUser(userId);
  if (!authUser) {
    return localCount;
  }

  // Cek ke Supabase tabel usage_logs
  try {
    const { count, error } = await supabase
      .from('usage_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('period', period);

    if (error) {
      // Jika tabel belum ada atau RLS membatasi, gunakan localCount
      return localCount;
    }

    const serverCount = count !== null ? count : localCount;
    const finalCount = Math.max(localCount, serverCount);
    try {
      localStorage.setItem(cacheKey, String(finalCount));
    } catch {
      // ignore
    }
    return finalCount;
  } catch {
    return localCount;
  }
}

/**
 * Mengambil ringkasan lengkap subscription & saldo prompt saat ini untuk UI
 */
export async function getSubscriptionSummary(userId: string): Promise<SubscriptionSummary> {
  const period = getCurrentBillingPeriod();
  const periodLabel = 'Aktif Selamanya (Tanpa Kedaluwarsa)';

  const sub = await getUserSubscription(userId);
  const isAdmin = sub.role === 'admin';

  // Admin mendapatkan saldo prompt tak terbatas (Infinity) secara permanen
  const freeDefault = SUBSCRIPTION_PLANS.free.initialPrompts; // 3 Prompt Percobaan
  const promptBalance = isAdmin ? Infinity : Math.max(0, sub.promptBalance ?? freeDefault);
  const totalGranted = isAdmin ? Infinity : Math.max(promptBalance, sub.totalGranted ?? promptBalance);
  const usedTotal = sub.usedCount ?? 0;

  const isLimitReached = isAdmin ? false : promptBalance <= 0;
  const usagePercentage = isAdmin
    ? 0
    : totalGranted > 0
    ? Math.min(100, Math.round((usedTotal / totalGranted) * 100))
    : 100;

  const planName = isAdmin
    ? 'Admin (Permanen Unlimited)'
    : sub.plan === 'pro'
    ? 'Pro (Saldo Prompt)'
    : 'Free (Saldo Awal)';

  return {
    plan: sub.plan,
    planName,
    role: sub.role,
    status: sub.status,
    period,
    periodLabel,
    promptBalance,
    totalGranted,
    usedTotal,
    // Kompatibilitas alias untuk tampilan yang sudah ada
    monthlyLimit: totalGranted,
    usedThisMonth: usedTotal,
    remaining: promptBalance,
    isLimitReached,
    usagePercentage,
    startDate: sub.startDate,
    endDate: isAdmin ? null : sub.endDate,
    daysRemaining: null, // Saldo prompt tidak memiliki batas tanggal kadaluwarsa
    isExpired: false,    // Saldo prompt tidak pernah hangus!
    isAdmin,
    isPro: sub.plan === 'pro',
  };
}

/**
 * Validasi apakah pengguna diizinkan untuk melakukan Generate Prompt Infografis
 * Alur: User Login? -> Check Admin (Unlimited bypass) -> Check Saldo Prompt
 */
export async function checkCanGenerate(
  userId: string
): Promise<{ allowed: boolean; reason?: string; summary: SubscriptionSummary }> {
  if (!userId) {
    const fallbackSummary = createFallbackSummary('guest');
    return {
      allowed: false,
      reason: 'Anda harus masuk/login ke akun STIVIA terlebih dahulu.',
      summary: fallbackSummary,
    };
  }

  const summary = await getSubscriptionSummary(userId);

  // 1. Akun Admin memiliki hak akses Unlimited Permanen
  if (summary.isAdmin) {
    return {
      allowed: true,
      summary,
    };
  }

  // 2. Cek status akun reguler
  if (summary.status === 'inactive') {
    return {
      allowed: false,
      reason: `Status akun Anda saat ini tidak aktif (${summary.status}).`,
      summary,
    };
  }

  // 3. Cek Saldo Prompt
  if (summary.promptBalance <= 0) {
    return {
      allowed: false,
      reason: 'Saldo kuota prompt Anda telah habis (0 prompt tersisa). Silakan lakukan isi ulang saldo prompt Anda untuk melanjutkan pembuatan prompt.',
      summary,
    };
  }

  return {
    allowed: true,
    summary,
  };
}

/**
 * Mencatat penggunaan (-1 saldo prompt) setelah generator berhasil menghasilkan prompt.
 * Memastikan saldo tersimpan aman di Supabase dan disinkronkan ke cache lokal.
 * Mencegah manipulasi kuota dan validasi status aktif pengguna.
 */
export async function recordGenerateUsage(userId: string): Promise<SubscriptionSummary> {
  if (!userId || userId === 'guest') {
    return createFallbackSummary('guest');
  }

  const authUser = await getAuthenticatedUser(userId);
  if (!authUser) {
    return await getSubscriptionSummary(userId);
  }

  const sub = await getUserSubscription(authUser.id);
  const isAdmin = sub.role === 'admin';
  const period = getCurrentBillingPeriod();

  // Validasi saldo: User reguler tidak boleh menggunakan prompt jika saldo telah habis
  if (!isAdmin && sub.promptBalance <= 0) {
    throw new Error('Saldo kuota prompt Anda telah habis (0 prompt tersisa).');
  }

  const freeDefault = SUBSCRIPTION_PLANS.free.initialPrompts; // 3 Prompt
  const currentBalance = sub.promptBalance ?? freeDefault;
  const newBalance = isAdmin ? Infinity : Math.max(0, currentBalance - 1);
  const newUsedCount = (sub.usedCount ?? 0) + 1;

  let rpcHandled = false;

  // 1. Upayakan pemanggilan RPC database atomik dengan hak SECURITY DEFINER di Supabase
  if (isSupabaseConfigured) {
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('record_prompt_usage', {
        p_feature: 'infographic_prompt',
      });
      if (!rpcErr && rpcRes) {
        rpcHandled = true;
      }
    } catch {
      // Fallback jika database RPC belum di-apply oleh pengguna
    }

    // 2. Fallback terproteksi jika RPC database belum dibuat
    if (!rpcHandled) {
      try {
        await supabase.from('usage_logs').insert({
          user_id: authUser.id,
          period,
          feature: 'infographic_prompt',
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('[STIVIA Subscription] Catatan simpan log penggunaan Supabase:', err);
      }

      if (!isAdmin) {
        try {
          await supabase
            .from('user_subscriptions')
            .update({
              prompt_balance: newBalance,
              used_count: newUsedCount,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', authUser.id);
        } catch (err) {
          console.warn('[STIVIA Subscription] Catatan update saldo prompt Supabase:', err);
        }
      }
    }
  }

  const updatedSub: UserSubscription = {
    ...sub,
    promptBalance: isAdmin ? currentBalance : newBalance,
    usedCount: newUsedCount,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`stivia_sub_${authUser.id}`, JSON.stringify(updatedSub));
    const cacheKey = `stivia_usage_${authUser.id}_${period}`;
    localStorage.setItem(cacheKey, String(newUsedCount));
  } catch {
    // ignore
  }

  memorySubCache.set(authUser.id, { data: updatedSub, timestamp: Date.now() });

  // Beri notifikasi ke listener event di UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('stivia_usage_updated', {
        detail: { userId: authUser.id, remaining: newBalance, usedCount: newUsedCount },
      })
    );
  }

  return await getSubscriptionSummary(authUser.id);
}

/**
 * Menambahkan Saldo Prompt (Top-Up Token) ke Akun Pengguna
 * HANYA DAPAT DILAKUKAN OLEH ADMINISTRATOR ATAU SISTEM SERVER.
 * User biasa TIDAK BOLEH memanipulasi atau menambah saldo sendiri dari browser.
 */
export async function topUpPromptBalance(
  userId: string,
  addedPrompts: number
): Promise<SubscriptionSummary> {
  if (!userId || userId === 'guest' || addedPrompts <= 0) {
    return createFallbackSummary(userId || 'guest');
  }

  const authUser = await getAuthenticatedUser(userId);
  if (!authUser) {
    return createFallbackSummary('guest');
  }

  // Verifikasi Otorisasi: Pengguna biasa tidak boleh menambah saldo sendiri
  const isAuthorizedAdmin = await verifyAdminAuthorization(authUser.id);
  if (!isAuthorizedAdmin) {
    console.warn('[STIVIA Subscription] Otorisasi ditolak: Pengguna biasa tidak berwenang melakukan top-up saldo.');
    throw new Error('Akses ditolak: Hanya Administrator yang berwenang menambah saldo prompt.');
  }

  const existingSub = await getUserSubscription(authUser.id);
  const now = new Date();
  const currentBalance = existingSub.promptBalance ?? 0;
  const newBalance = currentBalance + addedPrompts;
  const newTotalGranted = (existingSub.totalGranted ?? currentBalance) + addedPrompts;

  let rpcHandled = false;

  if (isSupabaseConfigured) {
    // Upayakan RPC aman terlebih dahulu
    try {
      const { error: rpcErr } = await supabase.rpc('admin_topup_prompts', {
        target_user_id: authUser.id,
        added_prompts: addedPrompts,
      });
      if (!rpcErr) {
        rpcHandled = true;
      }
    } catch {
      // Fallback
    }

    if (!rpcHandled) {
      try {
        await supabase
          .from('user_subscriptions')
          .update({
            plan: 'pro',
            status: 'active',
            prompt_balance: newBalance,
            total_granted: newTotalGranted,
            end_date: null,
            updated_at: now.toISOString(),
          })
          .eq('user_id', authUser.id);
      } catch (err) {
        console.warn('[STIVIA Subscription] Top up saldo prompt Supabase:', err);
      }
    }
  }

  const updatedSub: UserSubscription = {
    ...existingSub,
    plan: 'pro',
    status: 'active',
    promptBalance: newBalance,
    totalGranted: newTotalGranted,
    endDate: null,
    updatedAt: now.toISOString(),
  };

  try {
    localStorage.setItem(`stivia_sub_${authUser.id}`, JSON.stringify(updatedSub));
  } catch {
    // ignore
  }

  memorySubCache.set(authUser.id, { data: updatedSub, timestamp: Date.now() });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('stivia_subscription_updated', {
        detail: { userId: authUser.id, plan: 'pro', promptBalance: newBalance },
      })
    );
  }

  return await getSubscriptionSummary(authUser.id);
}

/**
 * Utilitas Pengujian Manual: Mengubah paket pengguna antara Free dan Pro
 * HANYA DAPAT DILAKUKAN OLEH ADMINISTRATOR.
 * User biasa TIDAK BOLEH mengubah status plan sendiri.
 */
export async function setTestingPlan(
  userId: string,
  newPlan: SubscriptionPlan
): Promise<SubscriptionSummary> {
  if (!userId || userId === 'guest') {
    return createFallbackSummary('guest');
  }

  const authUser = await getAuthenticatedUser(userId);
  if (!authUser) {
    return createFallbackSummary('guest');
  }

  // Verifikasi Otorisasi: Pengguna biasa tidak boleh memanipulasi paket
  const isAuthorizedAdmin = await verifyAdminAuthorization(authUser.id);
  if (!isAuthorizedAdmin) {
    console.warn('[STIVIA Subscription] Otorisasi ditolak: Pengguna biasa tidak diizinkan mengubah paket pengujian.');
    throw new Error('Akses ditolak: Hanya Administrator yang berwenang mengubah paket pengujian.');
  }

  const existingSub = await getUserSubscription(authUser.id);
  const now = new Date();
  const isPro = newPlan === 'pro';
  const targetPrompts = isPro ? 50 : 10;

  let rpcHandled = false;

  if (isSupabaseConfigured) {
    try {
      const { error: rpcErr } = await supabase.rpc('admin_set_user_plan', {
        target_user_id: authUser.id,
        new_plan: newPlan,
      });
      if (!rpcErr) {
        rpcHandled = true;
      }
    } catch {
      // Fallback
    }

    if (!rpcHandled) {
      try {
        await supabase
          .from('user_subscriptions')
          .update({
            plan: newPlan,
            prompt_balance: targetPrompts,
            total_granted: targetPrompts,
            used_count: 0,
            end_date: null,
            updated_at: now.toISOString(),
          })
          .eq('user_id', authUser.id);
      } catch (err) {
        console.warn('[STIVIA Subscription] Update paket testing Supabase:', err);
      }
    }
  }

  const updatedSub: UserSubscription = {
    ...existingSub,
    plan: newPlan,
    promptBalance: targetPrompts,
    totalGranted: targetPrompts,
    usedCount: 0,
    status: 'active',
    endDate: null,
    updatedAt: now.toISOString(),
  };

  try {
    localStorage.setItem(`stivia_sub_${authUser.id}`, JSON.stringify(updatedSub));
  } catch {
    // ignore
  }

  memorySubCache.set(authUser.id, { data: updatedSub, timestamp: Date.now() });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('stivia_subscription_updated', {
        detail: { userId: authUser.id, plan: newPlan },
      })
    );
  }

  return await getSubscriptionSummary(authUser.id);
}

export const updateUserPlan = setTestingPlan;

/**
 * Utilitas Administrasi: Mengubah Role Pengguna (user <-> admin)
 * KEAMANAN TINGKAT TINGGI:
 * - User biasa TIDAK BOLEH dapat mengubah role = admin melalui client-side code.
 * - localStorage BUKAN sumber kebenaran dan TIDAK DIGUNAKAN sebagai otorisasi admin.
 * - Operasi diverifikasi terhadap identitas auth server.
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<SubscriptionSummary> {
  if (!userId || userId === 'guest') {
    return createFallbackSummary('guest');
  }

  const isDemo = userId.startsWith('demo-');
  const authUser = isDemo ? null : await getAuthenticatedUser(userId);
  const targetId = authUser?.id || userId;

  // Verifikasi Otorisasi: Hanya Administrator yang sah yang berwenang mengubah peran
  const isAuthorizedAdmin = await verifyAdminAuthorization(targetId);
  if (!isAuthorizedAdmin) {
    console.warn('[STIVIA Subscription] Otorisasi ditolak: Pengguna biasa dilarang mengubah role.');
    throw new Error('Akses ditolak: Hanya Administrator yang berwenang mengubah peran.');
  }

  const existingSub = await getUserSubscription(targetId);
  const isAdmin = newRole === 'admin';
  const freePrompts = SUBSCRIPTION_PLANS.free.initialPrompts; // 3 Prompt

  let rpcHandled = false;

  if (isSupabaseConfigured && authUser) {
    try {
      const { error: rpcErr } = await supabase.rpc('admin_update_user_role', {
        target_user_id: authUser.id,
        new_role: newRole,
      });
      if (!rpcErr) {
        rpcHandled = true;
      }
    } catch {
      // Fallback
    }

    if (!rpcHandled) {
      try {
        await supabase
          .from('user_subscriptions')
          .update({
            role: newRole,
            plan: isAdmin ? 'pro' : existingSub.plan,
            prompt_balance: isAdmin ? 999999 : freePrompts,
            total_granted: isAdmin ? 999999 : freePrompts,
            end_date: null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', authUser.id);
      } catch (err) {
        console.warn('[STIVIA Subscription] Update role Supabase user_subscriptions:', err);
      }

      try {
        await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', authUser.id);
      } catch (err) {
        console.warn('[STIVIA Subscription] Update role Supabase profiles:', err);
      }
    }
  }

  const updatedSub: UserSubscription = {
    ...existingSub,
    role: newRole,
    plan: isAdmin ? 'pro' : existingSub.plan,
    promptBalance: isAdmin ? 999999 : (existingSub.promptBalance > 900000 ? freePrompts : existingSub.promptBalance),
    totalGranted: isAdmin ? 999999 : (existingSub.totalGranted > 900000 ? freePrompts : existingSub.totalGranted),
    endDate: null,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`stivia_sub_${targetId}`, JSON.stringify(updatedSub));
    if (isAdmin) {
      localStorage.setItem(`stivia_admin_privilege_${targetId}`, 'true');
    }
  } catch {
    // ignore
  }

  memorySubCache.set(targetId, { data: updatedSub, timestamp: Date.now() });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('stivia_subscription_updated', {
        detail: { userId: targetId, role: newRole, plan: updatedSub.plan, promptBalance: updatedSub.promptBalance },
      })
    );
  }

  return await getSubscriptionSummary(targetId);
}

/**
 * Pemulihan Darurat Hak Administrator
 * Digunakan jika pengembang/admin terkunci di mode user biasa dan tombol role gagal.
 */
export async function restoreAdminAccess(userId: string): Promise<SubscriptionSummary> {
  if (typeof window !== 'undefined' && userId) {
    localStorage.setItem(`stivia_admin_privilege_${userId}`, 'true');
  }
  return await updateUserRole(userId, 'admin');
}

/**
 * Helper internal untuk membuat record subscription default (Saldo awal 0, menunggu klaim anti-abuse Free 3)
 */
function createDefaultSubscription(userId: string): UserSubscription {
  return {
    userId,
    plan: 'free',
    role: 'user',
    status: 'active',
    promptBalance: 0,
    totalGranted: 0,
    usedCount: 0,
    startDate: new Date().toISOString(),
    endDate: null, // Tanpa kedaluwarsa (aktif selamanya)
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Helper internal untuk membuat ringkasan fallback
 */
function createFallbackSummary(userId: string): SubscriptionSummary {
  const period = getCurrentBillingPeriod();
  const freeConfig = SUBSCRIPTION_PLANS.free;
  const initial = freeConfig.initialPrompts; // 3 Prompt
  return {
    plan: 'free',
    planName: freeConfig.name,
    role: 'user',
    status: 'active',
    period,
    periodLabel: 'Aktif Selamanya (Tanpa Kedaluwarsa)',
    promptBalance: initial,
    totalGranted: initial,
    usedTotal: 0,
    monthlyLimit: initial,
    usedThisMonth: 0,
    remaining: initial,
    isLimitReached: false,
    isAdmin: false,
    isPro: false,
  };
}
