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
      const sub: UserSubscription = {
        userId: data.user_id || userId,
        plan: (data.plan as SubscriptionPlan) || 'free',
        role: (data.role as UserRole) || 'user',
        status: (data.status as SubscriptionStatus) || 'active',
        startDate: data.start_date || data.created_at || new Date().toISOString(),
        endDate: data.end_date || null,
        updatedAt: data.updated_at || new Date().toISOString(),
      };

      try {
        localStorage.setItem(`stivia_sub_${userId}`, JSON.stringify(sub));
      } catch {
        // ignore
      }
      return sub;
    }

    // 3. Jika record belum ada di Supabase, buat entri awal default Free
    const defaultSub = createDefaultSubscription(userId);
    try {
      const { error: insertErr } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan: defaultSub.plan,
          role: defaultSub.role,
          status: defaultSub.status,
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
 * Mengambil ringkasan lengkap subscription & penggunaan saat ini untuk UI
 */
export async function getSubscriptionSummary(userId: string): Promise<SubscriptionSummary> {
  const period = getCurrentBillingPeriod();
  const periodLabel = formatPeriodLabel(period);

  const sub = await getUserSubscription(userId);
  const usedThisMonth = await getMonthlyUsage(userId, period);

  const isAdmin = sub.role === 'admin';

  // Periksa kedaluwarsa masa aktif paket bulanan Pro
  let isExpired = false;
  let daysRemaining: number | null = null;

  if (sub.plan === 'pro' && sub.endDate) {
    const endMs = new Date(sub.endDate).getTime();
    const nowMs = Date.now();
    if (nowMs > endMs) {
      isExpired = true;
    } else {
      daysRemaining = Math.max(0, Math.ceil((endMs - nowMs) / (1000 * 60 * 60 * 24)));
    }
  }

  // Jika paket Pro sudah kedaluwarsa dan bukan admin, gunakan konfigurasi batas paket Free
  const effectivePlan = (sub.plan === 'pro' && isExpired && !isAdmin) ? 'free' : sub.plan;
  const planConfig = SUBSCRIPTION_PLANS[effectivePlan] || SUBSCRIPTION_PLANS.free;

  // Akun Admin memiliki hak akses Unlimited (tanpa batas kuota bulanan)
  const monthlyLimit = isAdmin ? Infinity : planConfig.monthlyLimit;
  const remaining = isAdmin ? Infinity : Math.max(0, monthlyLimit - usedThisMonth);
  const isLimitReached = isAdmin ? false : usedThisMonth >= monthlyLimit;
  const usagePercentage = isAdmin
    ? 0
    : Math.min(100, Math.round((usedThisMonth / (monthlyLimit || 1)) * 100));

  const effectiveStatus: SubscriptionStatus = isExpired ? 'expired' : sub.status;

  return {
    plan: sub.plan,
    planName: isAdmin ? 'Admin (Unlimited)' : planConfig.name,
    role: sub.role,
    status: effectiveStatus,
    period,
    periodLabel,
    monthlyLimit,
    usedThisMonth,
    remaining,
    isLimitReached,
    usagePercentage,
    startDate: sub.startDate,
    endDate: sub.endDate,
    daysRemaining,
    isExpired,
    isAdmin,
    isPro: sub.plan === 'pro',
  };
}

/**
 * Validasi apakah pengguna diizinkan untuk melakukan Generate Prompt Infografis
 * Alur: User Login? -> Check Admin (Unlimited bypass) -> Check Monthly Expiry -> Check Limit
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

  // 1. Akun Admin memiliki hak akses Unlimited secara otomatis
  if (summary.isAdmin) {
    return {
      allowed: true,
      summary,
    };
  }

  // 2. Cek apakah paket bulanan Pro telah kedaluwarsa
  if (summary.isExpired) {
    // Jika paket Pro kedaluwarsa, cek apakah penggunaan bulan ini melebihi limit Free dasar
    if (summary.usedThisMonth >= SUBSCRIPTION_PLANS.free.monthlyLimit) {
      return {
        allowed: false,
        reason: 'Masa aktif langganan paket Pro bulanan Anda telah berakhir dan batas kuota Free bulan ini telah terpakai. Silakan perpanjang paket Pro Anda.',
        summary,
      };
    }
  }

  // 3. Cek status akun reguler
  if (summary.status === 'inactive') {
    return {
      allowed: false,
      reason: `Status langganan akun Anda saat ini tidak aktif (${summary.status}).`,
      summary,
    };
  }

  // 4. Cek batas kuota bulanan reguler (Free 10, Pro 100)
  if (summary.isLimitReached) {
    return {
      allowed: false,
      reason: `Batas generate bulan ini telah tercapai (${summary.usedThisMonth}/${summary.monthlyLimit} generate).`,
      summary,
    };
  }

  return {
    allowed: true,
    summary,
  };
}

/**
 * Mencatat penggunaan (+1 generate) setelah generator berhasil menghasilkan prompt.
 * Memastikan data tersimpan aman di Supabase dan disinkronkan ke cache lokal.
 */
export async function recordGenerateUsage(userId: string): Promise<SubscriptionSummary> {
  if (!userId) {
    return createFallbackSummary('guest');
  }

  const period = getCurrentBillingPeriod();
  const cacheKey = `stivia_usage_${userId}_${period}`;

  // 1. Perbarui nilai lokal
  let newCount = 1;
  try {
    const raw = localStorage.getItem(cacheKey);
    const prev = raw ? parseInt(raw, 10) || 0 : 0;
    newCount = prev + 1;
    localStorage.setItem(cacheKey, String(newCount));
  } catch {
    // ignore
  }

  // 2. Simpan record log ke Supabase tabel usage_logs jika Supabase aktif
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
  }

  // 3. Beri notifikasi ke listener event di UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('stivia_usage_updated', {
        detail: { userId, period, newCount },
      })
    );
  }

  return await getSubscriptionSummary(userId);
}

/**
 * Utilitas Pengujian Manual: Mengubah paket pengguna antara Free dan Pro
 * (Disediakan khusus untuk tahap pengujian sesuai instruksi spesifikasi tanpa payment gateway)
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
  // Jika beralih ke Pro, berikan masa aktif 30 hari (1 bulan kalender)
  const startDate = isPro ? now.toISOString() : (existingSub.startDate || now.toISOString());
  const endDate = isPro ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;

  const updatedSub: UserSubscription = {
    ...existingSub,
    plan: newPlan,
    startDate,
    endDate,
    status: 'active',
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
          start_date: startDate,
          end_date: endDate,
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
 * Utilitas Pengujian / Administrasi: Mengubah Role Pengguna (user <-> admin)
 * Akun admin secara otomatis memperoleh kuota Unlimited.
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<SubscriptionSummary> {
  if (!userId) {
    return createFallbackSummary('guest');
  }

  const existingSub = await getUserSubscription(userId);
  const updatedSub: UserSubscription = {
    ...existingSub,
    role: newRole,
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
          status: updatedSub.status,
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
 * Helper internal untuk membuat record subscription default
 */
function createDefaultSubscription(userId: string): UserSubscription {
  return {
    userId,
    plan: 'free',
    role: 'user',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: null,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Helper internal untuk membuat ringkasan fallback
 */
function createFallbackSummary(userId: string): SubscriptionSummary {
  const period = getCurrentBillingPeriod();
  const freeConfig = SUBSCRIPTION_PLANS.free;
  return {
    plan: 'free',
    planName: freeConfig.name,
    role: 'user',
    status: 'active',
    period,
    periodLabel: formatPeriodLabel(period),
    monthlyLimit: freeConfig.monthlyLimit,
    usedThisMonth: 0,
    remaining: freeConfig.monthlyLimit,
    isLimitReached: false,
    isAdmin: false,
    isPro: false,
  };
}
