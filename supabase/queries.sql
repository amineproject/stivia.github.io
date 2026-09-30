-- ========================================================
-- STIVIA 3.1 — QUERY ADMIN & MONITORING LANGGANAN
-- ========================================================

-- 1. DAFTAR PENGGUNA PAKET PRO (PEMBELIAN BULANAN) AKTIF
-- Mengambil email dari auth.users dan nama dari public.profiles
SELECT 
    s.user_id,
    u.email,
    p.full_name AS nama_pengguna,
    s.plan,
    s.status,
    s.start_date AS tanggal_mulai,
    s.end_date AS tanggal_berakhir,
    CASE 
        WHEN s.end_date IS NULL THEN 'Tanpa batas waktu'
        WHEN s.end_date < NOW() THEN 'Kedaluwarsa (Expired)'
        ELSE CONCAT(CEIL(EXTRACT(EPOCH FROM (s.end_date - NOW())) / 86400), ' hari tersisa')
    END AS sisa_masa_aktif
FROM public.user_subscriptions s
LEFT JOIN auth.users u ON u.id = s.user_id
LEFT JOIN public.profiles p ON p.id = s.user_id
WHERE s.plan = 'pro'
ORDER BY s.end_date DESC;


-- 2. LIHAT SEMUA STATUS LANGGANAN & SALDO PROMPT (FREE, PRO, ADMIN)
SELECT 
    s.user_id,
    u.email,
    p.full_name AS nama_pengguna,
    s.plan,
    s.role,
    s.status,
    s.prompt_balance AS sisa_saldo_prompt,
    s.total_granted AS total_kuota_diberikan,
    s.used_count AS jumlah_prompt_terpakai,
    s.start_date,
    s.end_date
FROM public.user_subscriptions s
LEFT JOIN auth.users u ON u.id = s.user_id
LEFT JOIN public.profiles p ON p.id = s.user_id
ORDER BY s.created_at DESC;


-- 3. CEK TOTAL PENGGUNAAN GENERATE BULAN INI PER PENGGUNA
-- Ganti '2026-09' dengan periode bulan berjalan yang ingin dicek
SELECT 
    u.email,
    p.full_name,
    s.plan,
    s.role,
    COUNT(l.id) AS total_generate_bulan_ini
FROM public.user_subscriptions s
LEFT JOIN auth.users u ON u.id = s.user_id
LEFT JOIN public.profiles p ON p.id = s.user_id
LEFT JOIN public.usage_logs l ON l.user_id = s.user_id AND l.period = TO_CHAR(NOW(), 'YYYY-MM')
GROUP BY u.email, p.full_name, s.plan, s.role
ORDER BY total_generate_bulan_ini DESC;


-- 4. CARA MENJADIKAN USER TERTENTU SEBAGAI ADMIN (UNLIMITED)
-- Eksekusi di Supabase SQL Editor:
-- UPDATE public.user_subscriptions 
-- SET 
--     role = 'admin',
--     plan = 'pro',
--     prompt_balance = 999999,
--     total_granted = 999999,
--     end_date = NULL,
--     updated_at = NOW()
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'aminexplore@gmail.com');


-- 5. CARA TOP-UP KUOTA PROMPT MANUAL PENGGUNA (CONTOH: +50 PROMPT)
-- UPDATE public.user_subscriptions 
-- SET 
--     prompt_balance = prompt_balance + 50,
--     total_granted = total_granted + 50,
--     plan = 'pro',
--     status = 'active',
--     updated_at = NOW()
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'alamat_email_user@gmail.com');


-- 6. UPDATE RPC RECORD_PROMPT_USAGE (BIAYA FITUR MATERI = 2 SALDO PROMPT)
-- Eksekusi di Supabase SQL Editor jika Menu Materi pada database live masih memotong 1 koin:
DROP FUNCTION IF EXISTS public.record_prompt_usage();
DROP FUNCTION IF EXISTS public.record_prompt_usage(TEXT);
DROP FUNCTION IF EXISTS public.record_prompt_usage(TEXT, INT);

CREATE OR REPLACE FUNCTION public.record_prompt_usage(
    p_feature TEXT DEFAULT 'infographic',
    p_cost INT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_role VARCHAR(20);
    v_balance INT;
    v_used INT;
    v_period VARCHAR(7) := TO_CHAR(NOW(), 'YYYY-MM');
    v_cost INT := 1;
    v_clean_feature TEXT := LOWER(TRIM(COALESCE(p_feature, 'infographic')));
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Pengguna belum terautentikasi';
    END IF;

    -- Tentukan biaya (cost) di level server berdasarkan feature ID
    CASE v_clean_feature
        WHEN 'infographic' THEN v_cost := 1;
        WHEN 'infografis' THEN v_cost := 1;
        WHEN 'infographic_prompt' THEN v_cost := 1;
        WHEN 'lkpd' THEN v_cost := 2;
        WHEN 'poster_lkpd' THEN v_cost := 2;
        WHEN 'material' THEN v_cost := 2;
        WHEN 'materi' THEN v_cost := 2;
        WHEN 'material_document' THEN v_cost := 2;
        WHEN 'materi_ajar' THEN v_cost := 2;
        WHEN 'assessment' THEN v_cost := 2;
        WHEN 'asesmen' THEN v_cost := 2;
        WHEN 'asesmen_harian' THEN v_cost := 2;
        WHEN 'assessment_sumatif' THEN v_cost := 3;
        WHEN 'asesmen_sumatif' THEN v_cost := 3;
        WHEN 'presentation' THEN v_cost := 3;
        WHEN 'presentasi' THEN v_cost := 3;
        ELSE 
            IF p_cost IS NOT NULL AND p_cost > 0 THEN
                v_cost := p_cost;
            ELSE
                v_cost := 1;
            END IF;
    END CASE;

    -- Ambil data subscription saat ini dengan row lock atomik
    SELECT role, prompt_balance, used_count INTO v_role, v_balance, v_used
    FROM public.user_subscriptions
    WHERE user_id = v_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record subscription tidak ditemukan untuk pengguna ini';
    END IF;

    -- Bypass untuk admin (unlimited)
    IF v_role = 'admin' THEN
        INSERT INTO public.usage_logs (user_id, period, feature, created_at)
        VALUES (v_user_id, v_period, v_clean_feature, NOW());
        
        RETURN jsonb_build_object(
            'success', true, 
            'role', 'admin', 
            'prompt_balance', 999999,
            'cost', 0,
            'feature', v_clean_feature
        );
    END IF;

    -- Validasi kuota user reguler
    IF v_balance < v_cost THEN
        RAISE EXCEPTION 'Saldo kuota prompt Anda tidak mencukupi untuk membuat % (Kebutuhan: % saldo, Tersisa: % saldo)', 
            v_clean_feature, v_cost, v_balance;
    END IF;

    -- Kurangi saldo sejumlah v_cost
    UPDATE public.user_subscriptions
    SET 
        prompt_balance = prompt_balance - v_cost,
        used_count = used_count + 1,
        updated_at = NOW()
    WHERE user_id = v_user_id;

    -- Catat log penggunaan
    INSERT INTO public.usage_logs (user_id, period, feature, created_at)
    VALUES (v_user_id, v_period, v_clean_feature, NOW());

    RETURN jsonb_build_object(
        'success', true,
        'role', v_role,
        'prompt_balance', v_balance - v_cost,
        'used_count', v_used + 1,
        'cost', v_cost,
        'feature', v_clean_feature
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
