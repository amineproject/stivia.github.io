import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './components/pages/DashboardPage';
import { BuatProyekPage } from './components/pages/BuatProyekPage';
import { BuatInfografisPage } from './components/pages/BuatInfografisPage';
import { PosterLkpdPage } from './components/pages/PosterLkpdPage';
import { MateriPage } from './components/pages/MateriPage';
import { PresentasiPage } from './components/pages/PresentasiPage';
import { AsesmenHarianPage } from './components/pages/AsesmenHarianPage';
import { AsesmenSumatifPage } from './components/pages/AsesmenSumatifPage';
import { RancanganVisualPage } from './components/pages/RancanganVisualPage';
import { HasilInfografisPage } from './components/pages/HasilInfografisPage';
import { PreviewInfografisPage } from './components/pages/PreviewInfografisPage';
import { InfografisSayaPage } from './components/pages/InfografisSayaPage';
import { ProyekPembelajaranPage } from './components/pages/ProyekPembelajaranPage';
import { PanduanPage } from './components/pages/PanduanPage';
import { PengaturanPage } from './components/pages/PengaturanPage';
import { ProfilSayaPage } from './components/pages/ProfilSayaPage';
import { NotificationToast } from './components/NotificationToast';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { AuthPage } from './components/auth/AuthPage';
import { getUserProfile, signOutUser } from './services/authService';
import { getSubscriptionSummary, invalidateSubscriptionCache } from './services/subscriptionService';
import { 
  getStoredLearningProjects, 
  saveStoredLearningProjects, 
  getStoredActiveContext, 
  saveStoredActiveContext,
  adaptLegacyProjectToLearningProject,
  syncMeetingToCurrentDraft,
  resolveActiveHierarchy,
  updateMeetingProductState,
  createLearningProjectFromFormData,
  CreateProjectFormInput
} from './services/learningProjectService';
import { 
  buildMateriProductContext, 
  buildInfographicProductContext, 
  buildLKPDProductContext,
  buildPresentationProductContext 
} from './services/productContextAdapter';
import { 
  InfographicDraft, 
  NavigationTab, 
  UserSettings,
  ResponsiveViewMode,
  SupabaseUserProfile,
  SubscriptionSummary,
  LearningProject,
  ActiveLearningContext,
  MeetingSession,
  ChapterNode,
  ClassSubjectNode
} from './types';
import { 
  INITIAL_SAMPLE_DRAFT, 
  INITIAL_PROJECTS, 
  DEFAULT_USER_SETTINGS,
} from './data/mockData';
import { createDraftFromContext, validateAndSanitizeDraft } from './data/materialGenerator';

export default function App() {
  // Authentication & Session State
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      return hash.includes('type=recovery') || search.includes('type=recovery');
    }
    return false;
  });
  const [userProfile, setUserProfile] = useState<SupabaseUserProfile | null>(null);
  const [subscriptionSummary, setSubscriptionSummary] = useState<SubscriptionSummary | null>(null);

  // Navigation active tab (default to dashboard)
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Otomatis arahkan ke buat jika tab rancangan atau prompt_studio lama diakses
  useEffect(() => {
    if ((activeTab as string) === 'rancangan' || (activeTab as string) === 'prompt_studio') {
      setActiveTab('buat');
    }
  }, [activeTab]);

  // Inisialisasi dan listener session Supabase Auth
  const refreshSubscriptionSummary = useCallback(async (userIdOverride?: string) => {
    const targetUserId = userIdOverride || session?.user?.id;
    if (!targetUserId) {
      setSubscriptionSummary(null);
      return;
    }
    try {
      const summary = await getSubscriptionSummary(targetUserId);
      setSubscriptionSummary(summary);
    } catch (err) {
      console.warn('Gagal memuat ringkasan paket:', err);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async (userId: string, metadataName?: string) => {
      try {
        const profile = await getUserProfile(userId);
        if (!isMounted) return;
        if (profile) {
          setUserProfile(profile);
        } else {
          setUserProfile({
            id: userId,
            full_name: metadataName || 'Pendidik STIVIA',
          });
        }
      } catch (err) {
        if (!isMounted) return;
        setUserProfile({
          id: userId,
          full_name: metadataName || 'Pendidik STIVIA',
        });
      }
    };

    const initAuth = async () => {
      try {
        const hash = typeof window !== 'undefined' ? window.location.hash : '';
        const search = typeof window !== 'undefined' ? window.location.search : '';
        const isRecovery = hash.includes('type=recovery') || search.includes('type=recovery');
        if (isRecovery) {
          setIsPasswordRecovery(true);
        }

        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(data.session);
        if (data.session?.user && !isRecovery) {
          await fetchUserProfile(
            data.session.user.id,
            data.session.user.user_metadata?.full_name
          );
          await refreshSubscriptionSummary(data.session.user.id);
        }
      } catch (err) {
        console.warn('Gagal memuat sesi Supabase:', err);
      } finally {
        if (isMounted) {
          setIsAuthChecking(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
        setSession(newSession);
        return;
      }

      setSession(newSession);
      if (newSession?.user) {
        await fetchUserProfile(
          newSession.user.id,
          newSession.user.user_metadata?.full_name
        );
        await refreshSubscriptionSummary(newSession.user.id);
      } else {
        setUserProfile(null);
        setSubscriptionSummary(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [refreshSubscriptionSummary]);

  // Handler Keluar (Logout)
  const handleLogout = async () => {
    try {
      invalidateSubscriptionCache();
      await signOutUser();
    } catch (err) {
      console.warn('Gagal memproses signOut:', err);
    } finally {
      invalidateSubscriptionCache();
      setSession(null);
      setUserProfile(null);
      setSubscriptionSummary(null);
      showToast('Berhasil keluar dari akun STIVIA.');
    }
  };

  // Handler Mode Demo (Fallback jika environment Supabase belum diisi)
  const handleDemoLogin = () => {
    const mockSession = {
      user: {
        id: 'demo-pendidik-001',
        email: 'pendidik@stivia.id',
        user_metadata: { full_name: 'Guru Penggerak STIVIA' },
      },
    } as unknown as Session;

    setSession(mockSession);
    setUserProfile({
      id: 'demo-pendidik-001',
      full_name: 'Guru Penggerak STIVIA',
      title: 'Pendidik Kreatif & Inovator',
      school_name: 'Sekolah Penggerak STIVIA',
      plan: 'free',
      subscription_status: 'active',
      role: 'user',
    });
    refreshSubscriptionSummary('demo-pendidik-001');
    showToast('Masuk dalam Mode Demo STIVIA.');
  };

  // Responsive View Mode ('auto' | 'mobile' | 'desktop')
  const [viewMode, setViewMode] = useState<ResponsiveViewMode>(() => {
    const saved = localStorage.getItem('stivia_view_mode');
    if (saved === 'auto' || saved === 'mobile' || saved === 'desktop') {
      return saved as ResponsiveViewMode;
    }
    return 'auto';
  });

  // Dynamic window width detection for auto breakpoint
  const [windowWidth, setWindowWidth] = useState<number>(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persist view mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('stivia_view_mode', viewMode);
  }, [viewMode]);

  // Compute effective presentation mode
  const effectiveMode: 'mobile' | 'desktop' = 
    viewMode === 'auto' ? (windowWidth < 1024 ? 'mobile' : 'desktop') : viewMode;

  // User projects & active draft state (only user-created/saved projects)
  const [projects, setProjects] = useState<InfographicDraft[]>(() => {
    const saved = localStorage.getItem('stivia_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove default mock sample projects so only real user projects exist
          return parsed.filter(
            (p) => !['proj-002', 'proj-003', 'proj-004', 'sample-draft-001'].includes(p.id)
          );
        }
        return [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [currentDraft, setCurrentDraft] = useState<InfographicDraft>(() => {
    const savedDraft = localStorage.getItem('stivia_current_draft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        return INITIAL_SAMPLE_DRAFT;
      }
    }
    return INITIAL_SAMPLE_DRAFT;
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem('stivia_settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        return DEFAULT_USER_SETTINGS;
      }
    }
    return DEFAULT_USER_SETTINGS;
  });

  // STIVIA Tahap 2: Hierarki Proyek Pembelajaran & Active Context
  const [learningProjects, setLearningProjects] = useState<LearningProject[]>(() => {
    const stored = getStoredLearningProjects();
    return stored;
  });

  const [activeLearningContext, setActiveLearningContext] = useState<ActiveLearningContext>(() => {
    return getStoredActiveContext();
  });

  // Auto-adapt legacy projects non-destructively so all user drafts appear in project hierarchy
  useEffect(() => {
    if (projects.length === 0) return;
    setLearningProjects(prev => {
      let modified = false;
      const existingIds = new Set(prev.map(p => p.id));
      const adaptedList = [...prev];

      for (const draft of projects) {
        const adaptedId = `lp-adapted-${draft.id}`;
        if (!existingIds.has(adaptedId)) {
          const adapted = adaptLegacyProjectToLearningProject(draft);
          adaptedList.push(adapted);
          existingIds.add(adaptedId);
          modified = true;
        }
      }

      return modified ? adaptedList : prev;
    });
  }, [projects]);

  useEffect(() => {
    saveStoredLearningProjects(learningProjects);
  }, [learningProjects]);

  useEffect(() => {
    saveStoredActiveContext(activeLearningContext);
  }, [activeLearningContext]);

  // Handler memilih produk dari sebuah pertemuan aktif
  const handleSelectMeetingProduct = (
    productTab: NavigationTab,
    meeting: MeetingSession,
    chapter: ChapterNode,
    classSubject: ClassSubjectNode,
    project: LearningProject
  ) => {
    // 1. Sinkronkan Master Learning Data dari Pertemuan ke currentDraft
    const syncedDraft = syncMeetingToCurrentDraft(meeting, chapter, classSubject, project, currentDraft);
    setCurrentDraft(syncedDraft);

    // 2. Set active learning context
    setActiveLearningContext({
      activeProjectId: project.id,
      activeClassSubjectId: classSubject.id,
      activeChapterId: chapter.id,
      activeMeetingId: meeting.id
    });

    // 3. Arahkan pengguna ke studio produk yang dipilih
    setActiveTab(productTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Master Context ${meeting.meetingNumber} dimuat ke Studio ${productTab.toUpperCase()}!`);
  };

  // Handler membuat proyek pembelajaran baru dari form Buat Proyek (1 Data -> Banyak Produk)
  const handleCreateLearningProject = (input: CreateProjectFormInput) => {
    const { project, activeContext } = createLearningProjectFromFormData(input);

    // 1. Tambahkan ke daftar proyek hierarki
    setLearningProjects((prev) => [project, ...prev]);

    // 2. Set konteks pembelajaran aktif
    setActiveLearningContext(activeContext);

    // 3. Sinkronkan Master Learning Data dari pertemuan pertama ke currentDraft
    const firstClass = project.classSubjects[0];
    const firstChapter = firstClass?.chapters[0];
    const firstMeeting = firstChapter?.meetings[0];
    if (firstMeeting && firstChapter && firstClass) {
      const syncedDraft = syncMeetingToCurrentDraft(
        firstMeeting,
        firstChapter,
        firstClass,
        project,
        currentDraft
      );
      setCurrentDraft(syncedDraft);

      // Simpan juga ke daftar user projects legacy untuk kompatibilitas
      setProjects((prev) => {
        const filtered = prev.filter((p) => p.id !== syncedDraft.id);
        return [syncedDraft, ...filtered];
      });
    }

    // 4. Arahkan pengguna ke halaman Proyek Pembelajaran (Proyek Saya)
    setActiveTab('proyek_saya');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Proyek "${project.name}" berhasil dibuat! Siap digunakan untuk semua produk.`);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('stivia_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('stivia_current_draft', JSON.stringify(currentDraft));
  }, [currentDraft]);

  useEffect(() => {
    localStorage.setItem('stivia_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Handlers for Buat Infografis
  const handleFormSubmit = (formData: Partial<InfographicDraft>, options?: { navigateToStudio?: boolean }) => {
    const subject = formData.subject || currentDraft.subject;
    const theme = formData.theme || currentDraft.theme;
    const bab = formData.bab !== undefined ? formData.bab : (currentDraft.bab || '');
    const rawTopic = formData.rawTopic || currentDraft.rawTopic;
    const pertemuan = formData.pertemuan || currentDraft.pertemuan || 'Pertemuan 1';
    const scope = formData.scope || currentDraft.scope;
    const userNotes = formData.userNotes !== undefined ? formData.userNotes : currentDraft.userNotes;
    const level = formData.educationLevel || currentDraft.educationLevel;
    const grade = formData.grade || currentDraft.grade;
    const style = formData.visualStyle || currentDraft.visualStyle;
    const format = formData.format || currentDraft.format;
    const visualLevel = formData.visualLevel || currentDraft.visualLevel;
    const context = formData.exampleContext || currentDraft.exampleContext;
    const customContext = formData.customExampleContext || currentDraft.customExampleContext;

    // Create fresh consistent draft from active context
    const fullDraft = createDraftFromContext({
      jenjang: level,
      kelas: grade,
      mataPelajaran: subject,
      tema: theme,
      bab,
      materi: rawTopic,
      pertemuan,
      cakupanMateri: scope,
      userNotes,
      gayaVisual: style,
      format,
      tingkatVisual: visualLevel,
      konteksContoh: context,
      customExampleContext: customContext,
      styleProfile: formData.styleProfile,
      customTitleFont: formData.customTitleFont,
      customBodyFont: formData.customBodyFont,
      typographyMode: formData.typographyMode,
    });

    const sanitizedDraft = validateAndSanitizeDraft(fullDraft);

    const finalDraft: InfographicDraft = {
      ...sanitizedDraft,
      ...(formData.id ? { id: formData.id } : {}),
      ...(formData.title ? { title: formData.title } : {}),
      ...(formData.stiviaPrompt ? { stiviaPrompt: formData.stiviaPrompt } : {}),
      sourceMeetingId: formData.sourceMeetingId || currentDraft.sourceMeetingId,
      sourceMasterVersion: formData.sourceMasterVersion || currentDraft.sourceMasterVersion,
      learningObjectivesList: formData.learningObjectivesList || currentDraft.learningObjectivesList
    };

    setCurrentDraft(finalDraft);
    
    // Also sync to projects list
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== finalDraft.id);
      return [finalDraft, ...filtered];
    });

    // Perbarui status lifecycle produk pertemuan jika terhubung dengan master context
    const targetMeetingId = formData.sourceMeetingId || activeLearningContext.activeMeetingId;
    if (targetMeetingId) {
      const productKey = activeTab === 'materi' 
        ? 'material' 
        : activeTab === 'lkpd' 
        ? 'lkpd' 
        : activeTab === 'presentasi'
        ? 'presentation'
        : 'infographic';
      setLearningProjects((prev) => updateMeetingProductState(
        prev,
        targetMeetingId,
        productKey,
        'ready'
      ));
    }

    if (options?.navigateToStudio) {
      setActiveTab('buat');
      showToast('Data materi berhasil disimpan!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const successMessage = activeTab === 'presentasi'
        ? 'Prompt Presentasi Gamma AI berhasil disimpan!'
        : activeTab === 'lkpd'
        ? 'Poster LKPD berhasil disimpan!'
        : activeTab === 'materi'
        ? 'Dokumen Materi A4 berhasil disimpan!'
        : 'Prompt Infografis STIVIA berhasil dibuat dan tersimpan!';
      showToast(successMessage);
    }
  };

  // Load sample data button handler
  const handleLoadSample = () => {
    setCurrentDraft(INITIAL_SAMPLE_DRAFT);
    showToast('Memuat contoh data awal: Struktur Data Graph.');
  };

  const handleUpdateDraft = (updated: Partial<InfographicDraft>) => {
    setCurrentDraft((prev) => {
      const merged = { ...prev, ...updated, updatedAt: new Date().toISOString().split('T')[0] };
      // Sync into projects
      setProjects((projList) => 
        projList.map((p) => (p.id === merged.id ? merged : p))
      );
      return merged;
    });
  };

  // Project management handlers
  const handleSelectProject = (project: InfographicDraft, targetTab: 'buat' | 'hasil' | 'preview') => {
    setCurrentDraft(project);
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    showToast('Proyek infografis berhasil dihapus.');
  };

  const handleDuplicateProject = (project: InfographicDraft) => {
    const duplicated: InfographicDraft = {
      ...project,
      id: `proj-${Date.now()}`,
      title: `${project.title} (Salinan)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
    };
    setProjects((prev) => [duplicated, ...prev]);
    showToast('Proyek berhasil diduplikasi.');
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
  };

  // Informasi Pengguna Terautentikasi
  const rawUserName = 
    userProfile?.full_name || 
    session?.user?.user_metadata?.full_name || 
    (session?.user?.email ? session.user.email.split('@')[0] : 'Pendidik STIVIA');
  const currentUserName = userProfile?.title 
    ? `${rawUserName}, ${userProfile.title}` 
    : rawUserName;
  const currentUserRole = userProfile?.title || 'Pendidik & Inovator';
  const currentUserSchool = userProfile?.school_name || 'Instansi belum diatur';
  const currentUserEmail = session?.user?.email || '';

  // Handler pembaruan profil yang sinkron ke seluruh aplikasi
  const handleProfileUpdated = (updatedProfile: SupabaseUserProfile) => {
    setUserProfile(updatedProfile);
    if (updatedProfile.full_name) {
      setUserSettings((prev) => ({
        ...prev,
        authorName: updatedProfile.title 
          ? `${updatedProfile.full_name}, ${updatedProfile.title}` 
          : updatedProfile.full_name,
        authorRole: updatedProfile.title || prev.authorRole,
      }));
    }
  };

  // Resolusi hierarki aktif untuk breadcrumbs konteks pembelajaran
  const resolvedHierarchy = resolveActiveHierarchy(learningProjects, activeLearningContext);
  const activeBreadcrumbInfo = resolvedHierarchy.meeting ? {
    projectName: resolvedHierarchy.project?.name,
    classSubjectName: resolvedHierarchy.classSubject ? `${resolvedHierarchy.classSubject.grade} • ${resolvedHierarchy.classSubject.subject}` : undefined,
    chapterName: resolvedHierarchy.chapter?.chapterNumber || resolvedHierarchy.chapter?.title,
    meetingName: resolvedHierarchy.meeting?.meetingNumber,
  } : undefined;

  // Context Adapter untuk Menu Materi Dokumen A4 (Tahap 3A)
  const activeMateriContext = resolvedHierarchy.meeting
    ? buildMateriProductContext(
        resolvedHierarchy.meeting,
        resolvedHierarchy.chapter,
        resolvedHierarchy.classSubject,
        resolvedHierarchy.project
      )
    : null;

  // Context Adapter untuk Menu Infografis (Tahap 3B)
  const activeInfographicContext = resolvedHierarchy.meeting
    ? buildInfographicProductContext(
        resolvedHierarchy.meeting,
        resolvedHierarchy.chapter,
        resolvedHierarchy.classSubject,
        resolvedHierarchy.project
      )
    : null;

  // Context Adapter untuk Menu LKPD (Tahap 3C)
  const activeLkpdContext = resolvedHierarchy.meeting
    ? buildLKPDProductContext(
        resolvedHierarchy.meeting,
        resolvedHierarchy.chapter,
        resolvedHierarchy.classSubject,
        resolvedHierarchy.project
      )
    : null;

  // Context Adapter untuk Menu Presentasi (Tahap 3D)
  const activePresentationContext = resolvedHierarchy.meeting
    ? buildPresentationProductContext(
        resolvedHierarchy.meeting,
        resolvedHierarchy.chapter,
        resolvedHierarchy.classSubject,
        resolvedHierarchy.project
      )
    : null;

  // Layar Loading Pengecekan Sesi
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#3b49df] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/30 animate-pulse">
            S
          </div>
          <span className="text-sm font-bold text-slate-700">Memeriksa Sesi STIVIA...</span>
        </div>
      </div>
    );
  }

  // Layar Autentikasi / Pemulihan Kata Sandi
  if (!session || isPasswordRecovery) {
    return (
      <>
        <AuthPage
          initialView={isPasswordRecovery ? 'reset_password' : 'login'}
          onAuthSuccess={() => {
            showToast('Selamat datang di STIVIA!');
          }}
          onPasswordResetComplete={() => {
            setIsPasswordRecovery(false);
            setSession(null);
            showToast('Password berhasil diperbarui. Silakan login kembali.');
          }}
          onDemoLogin={!isSupabaseConfigured ? handleDemoLogin : undefined}
        />
        <NotificationToast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800 flex">
      {/* Fixed/Responsive Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        effectiveMode={effectiveMode}
        userName={currentUserName}
        userRole={currentUserRole}
        userSchool={currentUserSchool}
        userAvatar={userProfile?.avatar_url}
        userPlan={subscriptionSummary?.plan || userProfile?.plan || 'free'}
        isAdmin={Boolean(subscriptionSummary?.isAdmin || userProfile?.role === 'admin')}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          effectiveMode === 'mobile' ? 'pl-0' : 'lg:pl-64 pl-0'
        }`}
      >
        {/* Top Header Breadcrumb & Actions */}
        <Header
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          currentDraftTitle={currentDraft.title}
          viewMode={viewMode}
          onSetViewMode={setViewMode}
          effectiveMode={effectiveMode}
          activeMeetingBreadcrumb={activeBreadcrumbInfo}
        />

        {/* Dynamic Page Views with Responsive Spacing */}
        <main 
          className={`flex-1 w-full mx-auto transition-all ${
            effectiveMode === 'mobile' 
              ? 'p-3 sm:p-4 max-w-3xl' 
              : 'p-4 sm:p-8 max-w-7xl'
          }`}
        >
          {(activeTab === 'dashboard' || activeTab === 'beranda') && (
            <DashboardPage
              projects={projects}
              learningProjects={learningProjects}
              activeContext={activeLearningContext}
              onSelectProject={handleSelectProject}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLoadSample={handleLoadSample}
              subscriptionSummary={subscriptionSummary}
            />
          )}

          {/* ALUR UTAMA: BUAT PROYEK PEMBELAJARAN (1 DATA -> BANYAK PRODUK) */}
          {activeTab === 'buat_proyek' && (
            <BuatProyekPage
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCreateProject={handleCreateLearningProject}
              authorName={currentUserName}
              authorSchool={currentUserSchool}
            />
          )}

          {/* STUDIO KONTEN: MATERI */}
          {activeTab === 'materi' && (
            <MateriPage
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              currentDraft={currentDraft}
              userId={session?.user?.id}
              subscriptionSummary={subscriptionSummary}
              onUsageRecorded={() => refreshSubscriptionSummary()}
              onSubmitForm={handleFormSubmit}
              materiContext={activeMateriContext}
            />
          )}

          {/* STUDIO KONTEN: INFOGRAFIS (dan backward-compat 'buat') */}
          {(activeTab === 'buat' || activeTab === 'infografis') && (
            <BuatInfografisPage
              projects={projects}
              currentDraft={currentDraft}
              onSelectProject={setCurrentDraft}
              onSubmitForm={handleFormSubmit}
              onLoadSampleData={handleLoadSample}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              userId={session?.user?.id}
              subscriptionSummary={subscriptionSummary}
              onUsageRecorded={() => refreshSubscriptionSummary()}
              initialPromptType="infografis"
              infographicContext={activeInfographicContext}
            />
          )}

          {/* STUDIO KONTEN: LKPD (POSTER LKPD) */}
          {activeTab === 'lkpd' && (
            <PosterLkpdPage
              projects={projects}
              currentDraft={currentDraft}
              onSelectProject={setCurrentDraft}
              onSubmitForm={handleFormSubmit}
              onLoadSampleData={handleLoadSample}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              userId={session?.user?.id}
              subscriptionSummary={subscriptionSummary}
              onUsageRecorded={() => refreshSubscriptionSummary()}
              lkpdContext={activeLkpdContext}
            />
          )}

          {/* STUDIO KONTEN: PRESENTASI (GAMMA AI 10 SLIDE) */}
          {activeTab === 'presentasi' && (
            <PresentasiPage
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              currentDraft={currentDraft}
              userId={session?.user?.id}
              subscriptionSummary={subscriptionSummary}
              onUsageRecorded={() => refreshSubscriptionSummary()}
              onSubmitForm={handleFormSubmit}
              presentationContext={activePresentationContext}
            />
          )}

          {/* STUDIO KONTEN: ASESMEN HARIAN */}
          {(activeTab === 'asesmen' || activeTab === 'asesmen_harian') && (
            <AsesmenHarianPage
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* STUDIO KONTEN: ASESMEN SUMATIF */}
          {activeTab === 'asesmen_sumatif' && (
            <AsesmenSumatifPage
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'visual' && (
            <RancanganVisualPage
              draft={currentDraft}
              onUpdateDraft={handleUpdateDraft}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSaveToast={showToast}
            />
          )}

          {activeTab === 'hasil' && (
            <HasilInfografisPage
              draft={currentDraft}
              onUpdateDraft={handleUpdateDraft}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSaveToast={showToast}
            />
          )}

          {activeTab === 'preview' && (
            <PreviewInfografisPage
              draft={currentDraft}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSaveToast={showToast}
            />
          )}

          {(activeTab === 'infografis_saya' || activeTab === 'proyek_saya') && (
            <ProyekPembelajaranPage
              projects={projects}
              learningProjects={learningProjects}
              activeContext={activeLearningContext}
              onUpdateLearningProjects={setLearningProjects}
              onUpdateActiveContext={setActiveLearningContext}
              onSelectMeetingProduct={handleSelectMeetingProduct}
              onSelectLegacyProject={handleSelectProject}
              onDeleteLegacyProject={handleDeleteProject}
              onDuplicateLegacyProject={handleDuplicateProject}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSaveToast={showToast}
            />
          )}

          {activeTab === 'panduan' && (
            <PanduanPage
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'profil_saya' && (
            <ProfilSayaPage
              userProfile={userProfile}
              session={session}
              onProfileUpdated={handleProfileUpdated}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              showToast={showToast}
              effectiveMode={effectiveMode}
              subscriptionSummary={subscriptionSummary}
              onRefreshSubscription={() => refreshSubscriptionSummary()}
            />
          )}

          {activeTab === 'pengaturan' && (
            <PengaturanPage
              settings={userSettings}
              onUpdateSettings={handleUpdateSettings}
              onSaveToast={showToast}
              viewMode={viewMode}
              onSetViewMode={setViewMode}
              effectiveMode={effectiveMode}
              userEmail={currentUserEmail}
              onLogout={handleLogout}
              profileName={currentUserName}
              profileSchool={userProfile?.school_name}
              userProfile={userProfile}
              userId={session?.user?.id}
              onProfileUpdated={handleProfileUpdated}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </main>
      </div>

      {/* Global Toast Feedback */}
      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
