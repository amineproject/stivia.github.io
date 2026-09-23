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
