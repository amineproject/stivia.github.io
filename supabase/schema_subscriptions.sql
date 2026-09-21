-- ========================================================
-- STIVIA 3.1 — SUBSCRIPTION & USAGE FOUNDATION SCHEMA
-- ========================================================
-- Schema ini merupakan extension modular untuk Supabase Auth & public.profiles
-- Mendukung fondasi akun pengguna, paket (FREE & PRO), status langganan,
-- dan pencatatan batas penggunaan generate bulanan dengan Row Level Security (RLS).
-- ========================================================

-- 1. TABEL: user_subscriptions
-- Menyimpan data paket, role, dan masa aktif pengguna
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- Indeks untuk pencarian cepat berdasarkan user_id
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
    ON public.user_subscriptions(user_id);

-- 2. TABEL: usage_logs
-- Mencatat setiap kali pengguna berhasil melakukan Generate Prompt Infografis
-- Periode disimpan dalam format YYYY-MM (misal: '2026-09') sehingga data historis aman
CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    period VARCHAR(7) NOT NULL, -- e.g., '2026-09'
    feature VARCHAR(50) NOT NULL DEFAULT 'infographic_prompt',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indeks untuk agregasi penghitungan limit bulanan per user
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_period 
    ON public.usage_logs(user_id, period);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- Memastikan privasi data: Pengguna hanya dapat mengakses dan mengelola data miliknya sendiri.

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Kebijakan user_subscriptions:
DROP POLICY IF EXISTS "Users can read own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can read own subscription" 
    ON public.user_subscriptions 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can insert own subscription" 
    ON public.user_subscriptions 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can update own subscription" 
    ON public.user_subscriptions 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Kebijakan usage_logs:
DROP POLICY IF EXISTS "Users can read own usage logs" ON public.usage_logs;
CREATE POLICY "Users can read own usage logs" 
    ON public.usage_logs 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own usage logs" ON public.usage_logs;
CREATE POLICY "Users can insert own usage logs" 
    ON public.usage_logs 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 4. OPSIONAL: Kolom pelengkap di tabel profiles (jika ada)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'free';
    END IF;
END $$;

-- 5. DATABASE TRIGGER: OTOMATIS INISIALISASI UNTUK PENGGUNA BARU
-- Saat pengguna baru mendaftar di auth.users, fungsi ini otomatis membuat subscription Free.
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_subscriptions (user_id, plan, role, status)
    VALUES (NEW.id, 'free', 'user', 'active')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();
