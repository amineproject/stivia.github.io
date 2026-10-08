-- ============================================================================
-- STIVIA 3.2 — LEARNING PROJECTS & MULTI-DEVICE SYNC SCHEMA & RLS
-- ============================================================================
-- Schema ini dirancang untuk persistensi hierarki pembelajaran STIVIA:
-- USER -> PROJECT -> CLASS+SUBJECT -> CHAPTER/TEXT -> MEETING -> MASTER LEARNING DATA
--
-- PRINSIP KEAMANAN:
-- 1. Semua tabel memiliki Row Level Security (RLS) diaktifkan.
-- 2. Role 'anon' DILARANG mengakses seluruh tabel proyek.
-- 3. Role 'authenticated' HANYA dapat membaca, menulis, memperbarui, dan menghapus
--    data miliknya sendiri (berdasarkan auth.uid() pada learning_projects).
-- 4. Keamanan child tables diverifikasi secara relasional melalui rantai foreign key.
-- ============================================================================

-- 1. TABEL: learning_projects
-- Menyimpan entitas utama Proyek Pembelajaran guru
CREATE TABLE IF NOT EXISTS public.learning_projects (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    academic_year VARCHAR(20) DEFAULT '2026/2027',
    semester VARCHAR(10) DEFAULT 'Ganjil' CHECK (semester IN ('Ganjil', 'Genap')),
    teacher_name TEXT,
    school_name TEXT,
    is_legacy_adapted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_projects_user_id ON public.learning_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_projects_updated_at ON public.learning_projects(updated_at DESC);

-- 2. TABEL: learning_classes
-- Menyimpan node Kelas & Mata Pelajaran dalam proyek
CREATE TABLE IF NOT EXISTS public.learning_classes (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES public.learning_projects(id) ON DELETE CASCADE,
    education_level VARCHAR(10) NOT NULL CHECK (education_level IN ('SD', 'SMP', 'SMA', 'SMK')),
    grade TEXT NOT NULL,
    subject TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_classes_project_id ON public.learning_classes(project_id);

-- 3. TABEL: learning_chapters
-- Menyimpan node Bab / Teks di dalam Kelas & Mapel
CREATE TABLE IF NOT EXISTS public.learning_chapters (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL REFERENCES public.learning_classes(id) ON DELETE CASCADE,
    chapter_number TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_chapters_class_id ON public.learning_chapters(class_id);

-- 4. TABEL: learning_meetings
-- Menyimpan sesi Pertemuan (Meeting Session) dan status produknya
CREATE TABLE IF NOT EXISTS public.learning_meetings (
    id TEXT PRIMARY KEY,
    chapter_id TEXT NOT NULL REFERENCES public.learning_chapters(id) ON DELETE CASCADE,
    meeting_number TEXT NOT NULL,
    title TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'ready', 'completed')),
    product_states JSONB NOT NULL DEFAULT '{"material":"not_started","infographic":"not_started","lkpd":"not_started","presentation":"not_started","assessment_harian":"not_started","assessment_sumatif":"not_started"}'::jsonb,
    completed_at TIMESTAMPTZ,
    legacy_draft_id TEXT,
    is_continuation BOOLEAN NOT NULL DEFAULT FALSE,
    continuation_from_meeting_id TEXT,
    continuation_from_meeting_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_meetings_chapter_id ON public.learning_meetings(chapter_id);

-- 5. TABEL: master_learning_data
-- Single Source of Truth konten pembelajaran (Tema, Materi, Cakupan, TP, Kegiatan, Asesmen, Catatan)
CREATE TABLE IF NOT EXISTS public.master_learning_data (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    meeting_id TEXT NOT NULL REFERENCES public.learning_meetings(id) ON DELETE CASCADE,
    tema_kegiatan TEXT NOT NULL,
    materi_diajarkan TEXT NOT NULL,
    cakupan_materi TEXT NOT NULL,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    reinforcement_activities TEXT DEFAULT '',
    assessment_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    assessment_type TEXT,
    assessment_forms JSONB DEFAULT '[]'::jsonb,
    assessment_notes TEXT DEFAULT '',
    user_notes TEXT DEFAULT '',
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_meeting_master UNIQUE (meeting_id)
);

CREATE INDEX IF NOT EXISTS idx_master_learning_data_meeting_id ON public.master_learning_data(meeting_id);

-- Migrasi non-destruktif kolom baru jika tabel sudah ada sebelumnya
ALTER TABLE public.learning_meetings ADD COLUMN IF NOT EXISTS is_continuation BOOLEAN DEFAULT FALSE;
ALTER TABLE public.learning_meetings ADD COLUMN IF NOT EXISTS continuation_from_meeting_id TEXT;
ALTER TABLE public.learning_meetings ADD COLUMN IF NOT EXISTS continuation_from_meeting_number TEXT;

ALTER TABLE public.master_learning_data ADD COLUMN IF NOT EXISTS reinforcement_activities TEXT DEFAULT '';
ALTER TABLE public.master_learning_data ADD COLUMN IF NOT EXISTS assessment_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE public.master_learning_data ADD COLUMN IF NOT EXISTS assessment_type TEXT;
ALTER TABLE public.master_learning_data ADD COLUMN IF NOT EXISTS assessment_forms JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.master_learning_data ADD COLUMN IF NOT EXISTS assessment_notes TEXT DEFAULT '';

-- 6. TABEL: stivia_projects (Arsip Draf / Prompt Infografis / Proyek Legacy)
CREATE TABLE IF NOT EXISTS public.stivia_projects (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT,
    grade TEXT,
    education_level TEXT,
    theme TEXT,
    bab TEXT,
    raw_topic TEXT,
    pertemuan TEXT,
    scope TEXT,
    user_notes TEXT,
    learning_objective TEXT,
    learning_objectives_list JSONB DEFAULT '[]'::jsonb,
    visual_style TEXT,
    format TEXT,
    visual_level TEXT,
    example_context TEXT,
    status TEXT DEFAULT 'draft',
    source_meeting_id TEXT,
    source_master_version INT,
    draft_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stivia_projects_user_id ON public.stivia_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_stivia_projects_updated_at ON public.stivia_projects(updated_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.learning_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stivia_projects ENABLE ROW LEVEL SECURITY;

-- Cabut seluruh akses dari role anon
REVOKE ALL ON public.learning_projects FROM anon;
REVOKE ALL ON public.learning_classes FROM anon;
REVOKE ALL ON public.learning_chapters FROM anon;
REVOKE ALL ON public.learning_meetings FROM anon;
REVOKE ALL ON public.master_learning_data FROM anon;
REVOKE ALL ON public.stivia_projects FROM anon;

-- Berikan akses CRUD kepada authenticated dengan kebijakan kepemilikan ketat
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_classes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_chapters TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_meetings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.master_learning_data TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stivia_projects TO authenticated;

-- Policy 1: learning_projects (Direct user_id ownership)
DROP POLICY IF EXISTS "Users can read own learning projects" ON public.learning_projects;
CREATE POLICY "Users can read own learning projects"
    ON public.learning_projects FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own learning projects" ON public.learning_projects;
CREATE POLICY "Users can insert own learning projects"
    ON public.learning_projects FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own learning projects" ON public.learning_projects;
CREATE POLICY "Users can update own learning projects"
    ON public.learning_projects FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own learning projects" ON public.learning_projects;
CREATE POLICY "Users can delete own learning projects"
    ON public.learning_projects FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Policy 2: learning_classes (Relational project ownership)
DROP POLICY IF EXISTS "Users can read own learning classes" ON public.learning_classes;
CREATE POLICY "Users can read own learning classes"
    ON public.learning_classes FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_projects p
        WHERE p.id = learning_classes.project_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert own learning classes" ON public.learning_classes;
CREATE POLICY "Users can insert own learning classes"
    ON public.learning_classes FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_projects p
        WHERE p.id = learning_classes.project_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update own learning classes" ON public.learning_classes;
CREATE POLICY "Users can update own learning classes"
    ON public.learning_classes FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_projects p
        WHERE p.id = learning_classes.project_id AND p.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_projects p
        WHERE p.id = learning_classes.project_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete own learning classes" ON public.learning_classes;
CREATE POLICY "Users can delete own learning classes"
    ON public.learning_classes FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_projects p
        WHERE p.id = learning_classes.project_id AND p.user_id = auth.uid()
    ));

-- Policy 3: learning_chapters (Relational class -> project ownership)
DROP POLICY IF EXISTS "Users can read own learning chapters" ON public.learning_chapters;
CREATE POLICY "Users can read own learning chapters"
    ON public.learning_chapters FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_classes c
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE c.id = learning_chapters.class_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert own learning chapters" ON public.learning_chapters;
CREATE POLICY "Users can insert own learning chapters"
    ON public.learning_chapters FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_classes c
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE c.id = learning_chapters.class_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update own learning chapters" ON public.learning_chapters;
CREATE POLICY "Users can update own learning chapters"
    ON public.learning_chapters FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_classes c
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE c.id = learning_chapters.class_id AND p.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_classes c
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE c.id = learning_chapters.class_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete own learning chapters" ON public.learning_chapters;
CREATE POLICY "Users can delete own learning chapters"
    ON public.learning_chapters FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_classes c
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE c.id = learning_chapters.class_id AND p.user_id = auth.uid()
    ));

-- Policy 4: learning_meetings (Relational chapter -> class -> project ownership)
DROP POLICY IF EXISTS "Users can read own learning meetings" ON public.learning_meetings;
CREATE POLICY "Users can read own learning meetings"
    ON public.learning_meetings FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_chapters ch
        JOIN public.learning_classes c ON c.id = ch.class_id
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE ch.id = learning_meetings.chapter_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert own learning meetings" ON public.learning_meetings;
CREATE POLICY "Users can insert own learning meetings"
    ON public.learning_meetings FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_chapters ch
        JOIN public.learning_classes c ON c.id = ch.class_id
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE ch.id = learning_meetings.chapter_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update own learning meetings" ON public.learning_meetings;
CREATE POLICY "Users can update own learning meetings"
    ON public.learning_meetings FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_chapters ch
        JOIN public.learning_classes c ON c.id = ch.class_id
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE ch.id = learning_meetings.chapter_id AND p.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_chapters ch
        JOIN public.learning_classes c ON c.id = ch.class_id
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE ch.id = learning_meetings.chapter_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete own learning meetings" ON public.learning_meetings;
CREATE POLICY "Users can delete own learning meetings"
    ON public.learning_meetings FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_chapters ch
        JOIN public.learning_classes c ON c.id = ch.class_id
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE ch.id = learning_meetings.chapter_id AND p.user_id = auth.uid()
    ));

-- Policy 5: master_learning_data (Relational meeting -> chapter -> class -> project ownership)
DROP POLICY IF EXISTS "Users can read own master learning data" ON public.master_learning_data;
CREATE POLICY "Users can read own master learning data"
    ON public.master_learning_data FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_meetings m
        JOIN public.learning_chapters ch ON ch.id = m.chapter_id
        JOIN public.learning_classes c ON c.id = ch.class_id
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE m.id = master_learning_data.meeting_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert own master learning data" ON public.master_learning_data;
CREATE POLICY "Users can insert own master learning data"
    ON public.master_learning_data FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_meetings m
        JOIN public.learning_chapters ch ON ch.id = m.chapter_id
        JOIN public.learning_classes c ON c.id = ch.class_id
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE m.id = master_learning_data.meeting_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update own master learning data" ON public.master_learning_data;
CREATE POLICY "Users can update own master learning data"
    ON public.master_learning_data FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_meetings m
        JOIN public.learning_chapters ch ON ch.id = m.chapter_id
        JOIN public.learning_classes c ON c.id = ch.class_id
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE m.id = master_learning_data.meeting_id AND p.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_meetings m
        JOIN public.learning_chapters ch ON ch.id = m.chapter_id
        JOIN public.learning_classes c ON c.id = ch.class_id
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE m.id = master_learning_data.meeting_id AND p.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete own master learning data" ON public.master_learning_data;
CREATE POLICY "Users can delete own master learning data"
    ON public.master_learning_data FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.learning_meetings m
        JOIN public.learning_chapters ch ON ch.id = m.chapter_id
        JOIN public.learning_classes c ON c.id = ch.class_id
        JOIN public.learning_projects p ON p.id = c.project_id
        WHERE m.id = master_learning_data.meeting_id AND p.user_id = auth.uid()
    ));

-- Policy 6: stivia_projects (Direct user_id ownership for drafts/legacy projects)
DROP POLICY IF EXISTS "Users can read own stivia projects" ON public.stivia_projects;
CREATE POLICY "Users can read own stivia projects"
    ON public.stivia_projects FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own stivia projects" ON public.stivia_projects;
CREATE POLICY "Users can insert own stivia projects"
    ON public.stivia_projects FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own stivia projects" ON public.stivia_projects;
CREATE POLICY "Users can update own stivia projects"
    ON public.stivia_projects FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own stivia projects" ON public.stivia_projects;
CREATE POLICY "Users can delete own stivia projects"
    ON public.stivia_projects FOR DELETE TO authenticated
    USING (auth.uid() = user_id);
