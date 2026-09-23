-- ========================================================
-- STIVIA 3.1 — SUBSCRIPTION & USAGE SECURE SCHEMA & RLS
-- ========================================================
-- Schema ini dirancang khusus untuk memisahkan otorisasi, kuota prompt,
-- dan subscription secara aman di level database Supabase (PostgreSQL).
--
-- PRINSIP KEAMANAN:
-- 1. Role 'anon' TIDAK MEMILIKI AKSES SELECT/INSERT/UPDATE/DELETE pada user_subscriptions.
-- 2. Role 'authenticated' HANYA MEMILIKI AKSES SELECT pada record miliknya sendiri (auth.uid() = user_id).
-- 3. JANGAN MEMBERIKAN AKSES INSERT ATAU UPDATE BEBAS KEPADA authenticated.
-- 4. Pembuatan record subscription baru ditangani otomatis oleh DATABASE TRIGGER pada auth.users.
-- 5. Perubahan saldo dan role HANYA dilakukan via FUNCTION SECURITY DEFINER yang tervalidasi.
-- ========================================================

-- 1. TABEL: user_subscriptions
-- Menyimpan data paket, role, saldo prompt, dan masa aktif pengguna
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    prompt_balance INT NOT NULL DEFAULT 3,
    total_granted INT NOT NULL DEFAULT 3,
    used_count INT NOT NULL DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- Pastikan kolom saldo prompt ada jika tabel sudah dibuat sebelumnya
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS prompt_balance INT DEFAULT 3;
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS total_granted INT DEFAULT 3;
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS used_count INT DEFAULT 0;

-- Indeks untuk pencarian cepat berdasarkan user_id
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
    ON public.user_subscriptions(user_id);

-- 2. TABEL: usage_logs
-- Mencatat setiap kali pengguna berhasil melakukan Generate Prompt Infografis/LKPD
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

-- 3. ROW LEVEL SECURITY (RLS) POLICIES KETAT
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Cabut seluruh akses dari role anon secara eksplisit
REVOKE ALL ON public.user_subscriptions FROM anon;
REVOKE ALL ON public.usage_logs FROM anon;

-- Role authenticated HANYA mendapatkan hak SELECT pada user_subscriptions
-- Mencegah manipulasi kuota, role, atau bypass paket dari browser/client
REVOKE INSERT, UPDATE, DELETE ON public.user_subscriptions FROM authenticated;
GRANT SELECT ON public.user_subscriptions TO authenticated;

-- Role authenticated mendapatkan hak SELECT dan INSERT pada usage_logs
GRANT SELECT, INSERT ON public.usage_logs TO authenticated;

-- Kebijakan user_subscriptions:
-- Pengguna HANYA dapat membaca (SELECT) subscription miliknya sendiri
DROP POLICY IF EXISTS "Users can read own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can read own subscription" 
    ON public.user_subscriptions 
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

-- Hapus policy INSERT dan UPDATE client-side pada user_subscriptions jika ada
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own default subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;

-- Kebijakan usage_logs:
DROP POLICY IF EXISTS "Users can read own usage logs" ON public.usage_logs;
CREATE POLICY "Users can read own usage logs" 
    ON public.usage_logs 
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own usage logs" ON public.usage_logs;
CREATE POLICY "Users can insert own usage logs" 
    ON public.usage_logs 
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 4. DATABASE TRIGGER: OTOMATIS INISIALISASI UNTUK PENGGUNA BARU
-- Dijalankan saat user baru mendaftar di auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_subscriptions (
        user_id,
        plan,
        role,
        status,
        prompt_balance,
        total_granted,
        used_count,
        start_date,
        end_date,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        'free',
        'user',
        'active',
        3, -- 3 Free Prompt Percobaan Awal STIVIA
        3,
        0,
        NOW(),
        NULL,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- 5. BACKFILL UNTUK PENGGUNA LAMA (USER YANG SUDAH ADA DI AUTH.USERS)
-- Memastikan pengguna yang sudah ada di auth.users tetapi belum memiliki record di user_subscriptions
-- otomatis dibuatkan subscription Free tanpa error duplicate (ON CONFLICT DO NOTHING)
INSERT INTO public.user_subscriptions (
    user_id,
    plan,
    role,
    status,
    prompt_balance,
    total_granted,
    used_count,
    start_date,
    end_date,
    created_at,
    updated_at
)
SELECT 
    u.id, 
    'free', 
    'user', 
    'active', 
    3, 
    3, 
    0, 
    COALESCE(u.created_at, NOW()), 
    NULL,
    NOW(),
    NOW()
FROM auth.users u
LEFT JOIN public.user_subscriptions s ON u.id = s.user_id
WHERE s.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 6. RPC SERVER-SIDE: ENSURE USER SUBSCRIPTION
-- Memastikan pengguna yang sedang login memiliki record subscription secara aman (idempotent)
-- tanpa membutuhkan izin INSERT langsung dari browser ke tabel
CREATE OR REPLACE FUNCTION public.ensure_user_subscription()
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_record RECORD;
BEGIN
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Pengguna belum terautentikasi');
    END IF;

    -- Cari atau buat record secara aman (hanya Free default)
    INSERT INTO public.user_subscriptions (
        user_id, plan, role, status, prompt_balance, total_granted, used_count, start_date, end_date
    )
    VALUES (
        v_user_id, 'free', 'user', 'active', 3, 3, 0, NOW(), NULL
    )
    ON CONFLICT (user_id) DO NOTHING;

    SELECT * INTO v_record FROM public.user_subscriptions WHERE user_id = v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'user_id', v_record.user_id,
        'plan', v_record.plan,
        'role', v_record.role,
        'status', v_record.status,
        'prompt_balance', v_record.prompt_balance,
        'total_granted', v_record.total_granted,
        'used_count', v_record.used_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.ensure_user_subscription() FROM anon;
GRANT EXECUTE ON FUNCTION public.ensure_user_subscription() TO authenticated;

-- 7. RPC SERVER-SIDE UNTUK OPERASI SENSITIF (SECURITY DEFINER)

-- Helper: Cek apakah user saat ini adalah admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_subscriptions 
        WHERE user_id = check_user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function: Catat pengurangan kuota generate secara atomik (-1 saldo)
CREATE OR REPLACE FUNCTION public.record_prompt_usage(p_feature TEXT DEFAULT 'infographic_prompt')
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_role VARCHAR(20);
    v_balance INT;
    v_used INT;
    v_period VARCHAR(7) := TO_CHAR(NOW(), 'YYYY-MM');
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Pengguna belum terautentikasi';
    END IF;

    -- Ambil data subscription saat ini
    SELECT role, prompt_balance, used_count INTO v_role, v_balance, v_used
    FROM public.user_subscriptions
    WHERE user_id = v_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record subscription tidak ditemukan untuk pengguna ini';
    END IF;

    -- Jika admin, bypass pengurangan kuota (unlimited) namun tetap catat log
    IF v_role = 'admin' THEN
        INSERT INTO public.usage_logs (user_id, period, feature, created_at)
        VALUES (v_user_id, v_period, p_feature, NOW());
        
        RETURN jsonb_build_object('success', true, 'role', 'admin', 'prompt_balance', 999999);
    END IF;

    -- Validasi kuota untuk user reguler
    IF v_balance <= 0 THEN
        RAISE EXCEPTION 'Saldo kuota prompt Anda telah habis (0 prompt tersisa)';
    END IF;

    -- Kurangi saldo -1 dan tambah used_count +1
    UPDATE public.user_subscriptions
    SET 
        prompt_balance = prompt_balance - 1,
        used_count = used_count + 1,
        updated_at = NOW()
    WHERE user_id = v_user_id;

    -- Catat log penggunaan
    INSERT INTO public.usage_logs (user_id, period, feature, created_at)
    VALUES (v_user_id, v_period, p_feature, NOW());

    RETURN jsonb_build_object(
        'success', true,
        'role', v_role,
        'prompt_balance', v_balance - 1,
        'used_count', v_used + 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function: Ubah peran pengguna (user <-> admin)
-- HANYA DAPAT DIPANGGIL OLEH ADMINISTRATOR
CREATE OR REPLACE FUNCTION public.admin_update_user_role(target_user_id UUID, new_role VARCHAR(20))
RETURNS JSONB AS $$
DECLARE
    caller_role VARCHAR(20);
    caller_email TEXT;
BEGIN
    -- Validasi pemanggil adalah admin yang sah
    SELECT role INTO caller_role FROM public.user_subscriptions WHERE user_id = auth.uid();
    SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();

    IF caller_role != 'admin' AND caller_email != 'aminexplore@gmail.com' THEN
        RAISE EXCEPTION 'Akses ditolak: Hanya Administrator yang berwenang mengubah peran pengguna';
    END IF;

    -- Terapkan perubahan
    UPDATE public.user_subscriptions
    SET 
        role = new_role,
        plan = CASE WHEN new_role = 'admin' THEN 'pro' ELSE plan END,
        prompt_balance = CASE WHEN new_role = 'admin' THEN 999999 ELSE LEAST(prompt_balance, 3) END,
        total_granted = CASE WHEN new_role = 'admin' THEN 999999 ELSE LEAST(total_granted, 3) END,
        updated_at = NOW()
    WHERE user_id = target_user_id;

    RETURN jsonb_build_object('success', true, 'target_user_id', target_user_id, 'new_role', new_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function: Top-up saldo prompt
-- HANYA DAPAT DIPANGGIL OLEH ADMINISTRATOR
CREATE OR REPLACE FUNCTION public.admin_topup_prompts(target_user_id UUID, added_prompts INT)
RETURNS JSONB AS $$
DECLARE
    caller_role VARCHAR(20);
    caller_email TEXT;
BEGIN
    SELECT role INTO caller_role FROM public.user_subscriptions WHERE user_id = auth.uid();
    SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();

    IF caller_role != 'admin' AND caller_email != 'aminexplore@gmail.com' THEN
        RAISE EXCEPTION 'Akses ditolak: Hanya Administrator yang berwenang melakukan top-up kuota prompt';
    END IF;

    UPDATE public.user_subscriptions
    SET 
        plan = 'pro',
        status = 'active',
        prompt_balance = prompt_balance + added_prompts,
        total_granted = total_granted + added_prompts,
        end_date = NULL,
        updated_at = NOW()
    WHERE user_id = target_user_id;

    RETURN jsonb_build_object('success', true, 'added_prompts', added_prompts);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function: Ubah paket testing (Free <-> Pro)
-- HANYA DAPAT DIPANGGIL OLEH ADMINISTRATOR
CREATE OR REPLACE FUNCTION public.admin_set_user_plan(target_user_id UUID, new_plan VARCHAR(20))
RETURNS JSONB AS $$
DECLARE
    caller_role VARCHAR(20);
    caller_email TEXT;
    target_prompts INT := CASE WHEN new_plan = 'pro' THEN 50 ELSE 10 END;
BEGIN
    SELECT role INTO caller_role FROM public.user_subscriptions WHERE user_id = auth.uid();
    SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();

    IF caller_role != 'admin' AND caller_email != 'aminexplore@gmail.com' THEN
        RAISE EXCEPTION 'Akses ditolak: Hanya Administrator yang berwenang mengubah paket pengujian';
    END IF;

    UPDATE public.user_subscriptions
    SET 
        plan = new_plan,
        prompt_balance = target_prompts,
        total_granted = target_prompts,
        used_count = 0,
        end_date = NULL,
        updated_at = NOW()
    WHERE user_id = target_user_id;

    RETURN jsonb_build_object('success', true, 'new_plan', new_plan);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. OPSIONAL: Sinkronisasi kolom di tabel profiles (jika tabel profiles ada)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'free';
    END IF;
END $$;
