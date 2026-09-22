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

/**
 * Mengambil data subscription pengguna
 * Memastikan alur: Database (Supabase) -> Cache Lokal -> Default Free
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  if (!userId) {
    return createDefaultSubscription('guest');
  }

  // 1. Baca cache lokal terlebih dahulu untuk kecepatan render UI
  let cachedSub: UserSubscription | null = null;
  try {
    const raw = localStorage.getItem(`stivia_sub_${userId}`);
    if (raw) {
      cachedSub = JSON.parse(raw) as UserSubscription;
    }
  } catch {
    // ignore
  }

  // Fallback cepat jika Supabase belum dikonfigurasi (Mode Demo)
  if (!isSupabaseConfigured) {
    return cachedSub || createDefaultSubscription(userId);
  }

  // 2. Ambil data dari Supabase tabel user_subscriptions
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[STIVIA Subscription] Catatan saat mengambil subscription Supabase:', error.message);
      return cachedSub || createDefaultSubscription(userId);
    }

    if (data) {
      const isAdmin = data.role === 'admin';
      const role: UserRole = isAdmin ? 'admin' : 'user';

      // Baca saldo prompt dari Supabase (atau fallback berdasarkan plan)
      const freeDefault = SUBSCRIPTION_PLANS.free.initialPrompts; // 3 Prompt
      const promptBalance = typeof data.prompt_balance === 'number'
        ? data.prompt_balance
        : (data.plan === 'pro' ? 50 : freeDefault);

      const totalGranted = typeof data.total_granted === 'number'
        ? data.total_granted
        : Math.max(promptBalance, data.plan === 'pro' ? 50 : freeDefault);

      const usedCount = typeof data.used_count === 'number'
        ? data.used_count
        : Math.max(0, totalGranted - promptBalance);

      const sub: UserSubscription = {
        userId: data.user_id || userId,
        plan: (data.plan as SubscriptionPlan) || 'free',
        role,
        status: (data.status as SubscriptionStatus) || 'active',
        promptBalance,
        totalGranted,
        usedCount,
        startDate: data.start_date || data.created_at || new Date().toISOString(),
        endDate: isAdmin ? null : (data.end_date || null), // Admin permanen tanpa tanggal kedaluwarsa
        updatedAt: data.updated_at || new Date().toISOString(),
      };

      try {
        localStorage.setItem(`stivia_sub_${userId}`, JSON.stringify(sub));
      } catch {
        // ignore
      }
      return sub;
    }

    // 3. Jika record belum ada di Supabase, buat entri awal default Free (10 Saldo Prompt Awal)
    const defaultSub = createDefaultSubscription(userId);
    try {
      const { error: insertErr } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan: defaultSub.plan,
          role: defaultSub.role,
          status: defaultSub.status,
          prompt_balance: defaultSub.promptBalance,
          total_granted: defaultSub.totalGranted,
          used_count: defaultSub.usedCount,
          start_date: defaultSub.startDate,
          end_date: defaultSub.endDate,
        });

      if (insertErr) {
        console.warn('[STIVIA Subscription] Inisialisasi subscription Supabase:', insertErr.message);
      }
    } catch {
      // ignore
    }

    try {
      localStorage.setItem(`stivia_sub_${userId}`, JSON.stringify(defaultSub));
    } catch {
      // ignore
    }

    return defaultSub;
  } catch (err) {
    console.warn('[STIVIA Subscription] Exception saat mengambil subscription:', err);
    return cachedSub || createDefaultSubscription(userId);
  }
}

/**
 * Mengambil jumlah penggunaan generate dalam periode tertentu (default: bulan ini)
 */
export async function getMonthlyUsage(userId: string, period = getCurrentBillingPeriod()): Promise<number> {
  if (!userId) return 0;

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
  const promptBalance = isAdmin ? Infinity : Math.max(0, sub.promptBalance ?? 10);
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
 */
export async function recordGenerateUsage(userId: string): Promise<SubscriptionSummary> {
  if (!userId) {
    return createFallbackSummary('guest');
  }

  const sub = await getUserSubscription(userId);
  const isAdmin = sub.role === 'admin';
  const period = getCurrentBillingPeriod();

  // Kurangi saldo prompt sebanyak 1 jika bukan admin
  const currentBalance = sub.promptBalance ?? 10;
  const newBalance = isAdmin ? Infinity : Math.max(0, currentBalance - 1);
  const newUsedCount = (sub.usedCount ?? 0) + 1;

  const updatedSub: UserSubscription = {
    ...sub,
    promptBalance: isAdmin ? currentBalance : newBalance,
    usedCount: newUsedCount,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`stivia_sub_${userId}`, JSON.stringify(updatedSub));
    // Simpan juga ke cache usage periodik
    const cacheKey = `stivia_usage_${userId}_${period}`;
    localStorage.setItem(cacheKey, String(newUsedCount));
  } catch {
    // ignore
  }

  // Simpan record log ke Supabase tabel usage_logs jika Supabase aktif
  if (isSupabaseConfigured) {
    try {
      await supabase.from('usage_logs').insert({
        user_id: userId,
        period,
        feature: 'infographic_prompt',
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[STIVIA Subscription] Catatan simpan log penggunaan Supabase:', err);
    }

    // Perbarui saldo prompt di user_subscriptions
    if (!isAdmin) {
      try {
        await supabase
          .from('user_subscriptions')
          .update({
            prompt_balance: newBalance,
            used_count: newUsedCount,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);
      } catch (err) {
        console.warn('[STIVIA Subscription] Catatan update saldo prompt Supabase:', err);
      }
    }
  }

  // Beri notifikasi ke listener event di UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('stivia_usage_updated', {
        detail: { userId, remaining: newBalance, usedCount: newUsedCount },
      })
    );
  }

  return await getSubscriptionSummary(userId);
}

/**
 * Menambahkan Saldo Prompt (Top-Up Token) ke Akun Pengguna
 * Digunakan saat pengguna membeli paket (20, 50, 120 prompt) atau via admin.
 * Saldo otomatis bertambah dan aktif selamanya (tidak pernah hangus).
 */
export async function topUpPromptBalance(
  userId: string,
  addedPrompts: number
): Promise<SubscriptionSummary> {
  if (!userId || addedPrompts <= 0) {
    return createFallbackSummary(userId || 'guest');
  }

  const existingSub = await getUserSubscription(userId);
  const now = new Date();
  const currentBalance = existingSub.promptBalance ?? 0;
  const newBalance = currentBalance + addedPrompts;
  const newTotalGranted = (existingSub.totalGranted ?? currentBalance) + addedPrompts;

  const updatedSub: UserSubscription = {
    ...existingSub,
    plan: 'pro',
    status: 'active',
    promptBalance: newBalance,
    totalGranted: newTotalGranted,
    endDate: null, // Tanpa batas waktu (aktif selamanya)
    updatedAt: now.toISOString(),
  };

  try {
    localStorage.setItem(`stivia_sub_${userId}`, JSON.stringify(updatedSub));
  } catch {
    // ignore
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan: 'pro',
          role: updatedSub.role,
          status: 'active',
          prompt_balance: newBalance,
          total_granted: newTotalGranted,
          used_count: updatedSub.usedCount,
          end_date: null,
          updated_at: now.toISOString(),
        });
    } catch (err) {
      console.warn('[STIVIA Subscription] Top up saldo prompt Supabase:', err);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('stivia_subscription_updated', {
        detail: { userId, plan: 'pro', promptBalance: newBalance },
      })
    );
  }

  return await getSubscriptionSummary(userId);
}

/**
 * Utilitas Pengujian Manual: Mengubah paket pengguna antara Free dan Pro
 */
export async function setTestingPlan(
  userId: string,
  newPlan: SubscriptionPlan
): Promise<SubscriptionSummary> {
  if (!userId) {
    return createFallbackSummary('guest');
  }

  const existingSub = await getUserSubscription(userId);
  const now = new Date();
  const isPro = newPlan === 'pro';
  const targetPrompts = isPro ? 50 : 10;

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
    localStorage.setItem(`stivia_sub_${userId}`, JSON.stringify(updatedSub));
  } catch {
    // ignore
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan: newPlan,
          role: updatedSub.role,
          status: 'active',
          prompt_balance: targetPrompts,
          total_granted: targetPrompts,
          used_count: 0,
          end_date: null,
          updated_at: now.toISOString(),
        });
    } catch (err) {
      console.warn('[STIVIA Subscription] Update paket testing Supabase:', err);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('stivia_subscription_updated', {
        detail: { userId, plan: newPlan },
      })
    );
  }

  return await getSubscriptionSummary(userId);
}

export const updateUserPlan = setTestingPlan;

/**
 * Utilitas Administrasi: Mengubah Role Pengguna (user <-> admin)
 * Pengguna yang dijadikan admin menjadi ADMINISTRATOR PERMANEN dengan kuota Unlimited (∞).
 * Ketika admin menguji akun sebagai user, status admin tetap terotorisasi dan dapat dikembalikan kapan saja.
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<SubscriptionSummary> {
  if (!userId) {
    return createFallbackSummary('guest');
  }

  const existingSub = await getUserSubscription(userId);
  const isAdmin = newRole === 'admin';
  const freePrompts = SUBSCRIPTION_PLANS.free.initialPrompts; // 3 Prompt

  // Simpan jejak bahwa user ini memiliki hak admin asli di browser
  if (isAdmin) {
    try {
      localStorage.setItem(`stivia_is_admin_user_${userId}`, 'true');
    } catch {
      // ignore
    }
  }

  const updatedSub: UserSubscription = {
    ...existingSub,
    role: newRole,
    plan: isAdmin ? 'pro' : existingSub.plan,
    // Jika kembali jadi admin, berikan kuota unlimited (999999).
    // Jika beralih ke user untuk simulasi, berikan kuota testing (3 prompt jika sebelumnya habis atau unlimited)
    promptBalance: isAdmin
      ? 999999
      : (existingSub.promptBalance > 900000 ? freePrompts : existingSub.promptBalance),
    totalGranted: isAdmin ? 999999 : (existingSub.totalGranted > 900000 ? freePrompts : existingSub.totalGranted),
    endDate: null, // Tanpa batas waktu (permanen)
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`stivia_sub_${userId}`, JSON.stringify(updatedSub));
  } catch {
    // ignore
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan: updatedSub.plan,
          role: newRole,
          status: 'active',
          prompt_balance: updatedSub.promptBalance,
          total_granted: updatedSub.totalGranted,
          end_date: null, // Permanen
          updated_at: new Date().toISOString(),
        });

      // Sinkronkan juga ke tabel profiles jika ada kolom role
      await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
    } catch (err) {
      console.warn('[STIVIA Subscription] Update role Supabase:', err);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('stivia_subscription_updated', {
        detail: { userId, role: newRole },
      })
    );
  }

  return await getSubscriptionSummary(userId);
}

/**
 * Helper internal untuk membuat record subscription default (3 Saldo Prompt Gratis Awal)
 */
function createDefaultSubscription(userId: string): UserSubscription {
  const freePrompts = SUBSCRIPTION_PLANS.free.initialPrompts; // 3 Prompt
  return {
    userId,
    plan: 'free',
    role: 'user',
    status: 'active',
    promptBalance: freePrompts,
    totalGranted: freePrompts,
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
