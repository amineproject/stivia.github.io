-- ============================================================================
-- STIVIA — MIGRASI TIPE KOLOM CHAPTER & MEETING NUMBER KE TEXT
-- ============================================================================
-- File: supabase/migration_chapter_meeting_number_type.sql
-- Status: SIAP DITINJAU (REVIEW BEFORE EXECUTION)
--
-- LATAR BELAKANG & ALASAN:
-- 1. Skema live saat ini mendefinisikan:
--    - public.learning_chapters.chapter_number sebagai INTEGER
--    - public.learning_meetings.meeting_number sebagai INTEGER
--    - public.learning_meetings.continuation_from_meeting_number sebagai INTEGER (atau TEXT)
-- 2. Dalam standar kurikulum (Kurikulum Merdeka) dan kebutuhan pendidik:
--    - Bab pembelajaran sering kali dinamai "Bab 1", "Teks 1" (Bahasa Indonesia),
--      "Unit 2" (Bahasa Inggris), atau "Bab 1A".
--    - Nomor pertemuan diformat sebagai "Pertemuan 1", "Pertemuan 2".
-- 3. Mengubah tipe kolom ke TEXT memberikan fleksibilitas penuh tanpa membatasi
--    input pengguna hanya pada digit murni.
--
-- ANALISIS DAMPAK:
-- 1. Non-destruktif: Klausul USING ...::text mengonversi data integer yang ada (1, 2, 3)
--    menjadi string ('1', '2', '3') tanpa kehilangan data historis.
-- 2. Foreign key, primary key, dan kebijakan RLS (stivia_*_owner_all) TIDAK terpengaruh.
-- 3. Aplikasi STIVIA memiliki adaptor cerdas yang kompatibel dengan tipe INTEGER maupun TEXT,
--    sehingga aplikasi tetap berfungsi aman baik sebelum maupun sesudah migrasi ini dijalankan.
-- ============================================================================

-- 1. Ubah tipe kolom chapter_number pada tabel learning_chapters menjadi TEXT
ALTER TABLE public.learning_chapters 
    ALTER COLUMN chapter_number TYPE TEXT USING chapter_number::text;

-- 2. Ubah tipe kolom meeting_number pada tabel learning_meetings menjadi TEXT
ALTER TABLE public.learning_meetings 
    ALTER COLUMN meeting_number TYPE TEXT USING meeting_number::text;

-- 3. Ubah tipe kolom continuation_from_meeting_number (jika ada dan bertipe integer)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'learning_meetings' 
          AND column_name = 'continuation_from_meeting_number'
          AND data_type IN ('integer', 'smallint', 'bigint', 'numeric')
    ) THEN
        ALTER TABLE public.learning_meetings 
            ALTER COLUMN continuation_from_meeting_number TYPE TEXT USING continuation_from_meeting_number::text;
    END IF;
END $$;

-- 4. Verifikasi perubahan tipe kolom
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('learning_chapters', 'learning_meetings')
  AND column_name IN ('chapter_number', 'meeting_number', 'continuation_from_meeting_number');
