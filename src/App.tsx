import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  getStoredLegacyProjects,
  saveStoredLegacyProjects,
  getStoredCurrentDraft,
  saveStoredCurrentDraft,
  adaptLegacyProjectToLearningProject,
  syncMeetingToCurrentDraft,
  resolveActiveHierarchy,
  updateMeetingProductState,
  createLearningProjectFromFormData,
  CreateProjectFormInput,
  fetchLearningProjectsFromSupabase,
  saveLearningProjectToSupabase,
  deleteLearningProjectFromSupabase,
  deleteLearningMeetingFromSupabase,
  deleteLearningChapterFromSupabase,
  deleteLearningClassFromSupabase,
  updateMeetingProductStateInSupabase,
  deleteLegacyProjectFromSupabase,
  removeMeetingFromProject,
  removeChapterFromProject,
  syncLearningProjectsOnLogin,
  saveLegacyProjectToSupabase,
  getProjectTableStatus,
  DEFAULT_INITIAL_LEARNING_PROJECT
} from './services/learningProjectService';
import { 
  buildMateriProductContext, 
  buildInfographicProductContext, 
  buildLKPDProductContext,
  buildPresentationProductContext,
  buildAssessmentProductContext 
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

  // Cloud Sync State (Supabase as Source of Truth)
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'local' | 'syncing' | 'error'>('local');
  const currentLoadedUserIdRef = useRef<string | null>(null);
  const lastFocusSyncRef = useRef<number>(0);

  // User projects & active draft state (only user-created/saved projects, strictly isolated per user)
  const [projects, setProjects] = useState<InfographicDraft[]>(() => {
    return [];
  });

  const [currentDraft, setCurrentDraft] = useState<InfographicDraft>(() => {
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

  // STIVIA Tahap 2: Hierarki Proyek Pembelajaran & Active Context (Terisolasi per Akun)
  const [learningProjects, setLearningProjects] = useState<LearningProject[]>(() => {
    return [];
  });

  const [activeLearningContext, setActiveLearningContext] = useState<ActiveLearningContext>(() => {
    return {
      activeProjectId: undefined,
      activeClassSubjectId: undefined,
      activeChapterId: undefined,
      activeMeetingId: undefined,
    };
  });

  // Fungsi memuat data proyek pembelajaran milik user dari Cloud Supabase (Source of Truth)
  const loadUserLearningProjectsFromCloud = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured || !userId) return;
    setIsCloudSyncing(true);
    setCloudSyncStatus('syncing');

    try {
      const syncResult = await syncLearningProjectsOnLogin(userId);

      if (syncResult.learningProjects.length > 0) {
        // Terdapat proyek (baik dari cloud maupun partisi lokal user)
        setLearningProjects(syncResult.learningProjects);
        saveStoredLearningProjects(syncResult.learningProjects, userId);

        // Validasi & restore active learning context terhadap data proyek
        setActiveLearningContext((prevContext) => {
          const validProj =
            syncResult.learningProjects.find((p) => p.id === prevContext.activeProjectId) ||
            syncResult.learningProjects[0];
          const validClass =
            validProj?.classSubjects.find((cs) => cs.id === prevContext.activeClassSubjectId) ||
            validProj?.classSubjects[0];
          const validChapter =
            validClass?.chapters.find((ch) => ch.id === prevContext.activeChapterId) ||
            validClass?.chapters[0];
          const validMeeting =
            validChapter?.meetings.find((m) => m.id === prevContext.activeMeetingId) ||
            validChapter?.meetings[0];

          const newContext: ActiveLearningContext = {
            activeProjectId: validProj?.id,
            activeClassSubjectId: validClass?.id,
            activeChapterId: validChapter?.id,
            activeMeetingId: validMeeting?.id,
          };
          saveStoredActiveContext(newContext, userId);

          // Sinkronkan meeting pertama ke currentDraft
          if (validMeeting && validChapter && validClass && validProj) {
            setCurrentDraft((prevDraft) => {
              const synced = syncMeetingToCurrentDraft(
                validMeeting,
                validChapter,
                validClass,
                validProj,
                prevDraft
              );
              saveStoredCurrentDraft(synced, userId);
              return synced;
            });
          }

          return newContext;
        });

        // Sinkronkan draf legacy jika ada
        if (syncResult.legacyProjects) {
          setProjects(syncResult.legacyProjects);
          saveStoredLegacyProjects(syncResult.legacyProjects, userId);
        }

        // Tetapkan status sinkronisasi yang jujur & akurat serta notifikasi informatif
        if (syncResult.syncStatus === 'supabase_synced') {
          setCloudSyncStatus('synced');
          showToast('☁️ Data pembelajaran berhasil dimuat dari Cloud Supabase.');
        } else if (syncResult.tableStatus === 'forbidden') {
          setCloudSyncStatus('error');
          showToast('⚠️ Akses cloud dibatasi oleh kebijakan keamanan (RLS). Menampilkan data lokal.');
        } else {
          setCloudSyncStatus('local');
          showToast('📂 Menggunakan data pembelajaran dari penyimpanan lokal perangkat.');
        }
      } else {
        // HANYA jika data memang kosong (bukan kegagalan sinkronisasi yang menelan data)
        setLearningProjects([]);
        if (syncResult.dataSource === 'empty') {
          saveStoredLearningProjects([], userId);
        }

        const emptyContext: ActiveLearningContext = {
          activeProjectId: undefined,
          activeClassSubjectId: undefined,
          activeChapterId: undefined,
          activeMeetingId: undefined,
        };
        setActiveLearningContext(emptyContext);
        saveStoredActiveContext(emptyContext, userId);

        if (syncResult.legacyProjects && syncResult.legacyProjects.length > 0) {
          setProjects(syncResult.legacyProjects);
          saveStoredLegacyProjects(syncResult.legacyProjects, userId);
        } else if (syncResult.dataSource === 'empty') {
          setProjects([]);
          saveStoredLegacyProjects([], userId);
        }

        if (syncResult.syncStatus === 'supabase_synced' || syncResult.tableStatus === 'available') {
          setCloudSyncStatus('synced');
        } else if (syncResult.tableStatus === 'forbidden') {
          setCloudSyncStatus('error');
        } else {
          setCloudSyncStatus('local');
        }
      }
    } catch (err) {
      console.warn('[STIVIA] Gagal memuat proyek dari cloud Supabase:', err);
      setCloudSyncStatus('local');
    } finally {
      setIsCloudSyncing(false);
    }
  }, []);

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
          currentLoadedUserIdRef.current = data.session.user.id;
          await fetchUserProfile(
            data.session.user.id,
            data.session.user.user_metadata?.full_name
          );
          await refreshSubscriptionSummary(data.session.user.id);
          await loadUserLearningProjectsFromCloud(data.session.user.id);
        } else {
          currentLoadedUserIdRef.current = null;
          // Tidak ada sesi aktif (tamu / belum login)
          setLearningProjects([]);
          setActiveLearningContext({
            activeProjectId: undefined,
            activeClassSubjectId: undefined,
            activeChapterId: undefined,
            activeMeetingId: undefined,
          });
          setProjects([]);
          setCurrentDraft(INITIAL_SAMPLE_DRAFT);
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

      // Background token refresh tidak memerlukan inisialisasi ulang memori
      if (event === 'TOKEN_REFRESHED') {
        setSession(newSession);
        return;
      }

      if (newSession?.user) {
        setSession(newSession);
        // Cegah eksekusi ganda jika data user ini sudah selesai dimuat oleh initAuth
        if (currentLoadedUserIdRef.current === newSession.user.id) {
          return;
        }
        currentLoadedUserIdRef.current = newSession.user.id;

        // Kosongkan state memori sebelum data user baru selesai dimuat untuk mencegah tumpang tindih data akun lama
        setLearningProjects([]);
        setActiveLearningContext({
          activeProjectId: undefined,
          activeClassSubjectId: undefined,
          activeChapterId: undefined,
          activeMeetingId: undefined,
        });
        setProjects([]);
        await fetchUserProfile(
          newSession.user.id,
          newSession.user.user_metadata?.full_name
        );
        await refreshSubscriptionSummary(newSession.user.id);
        await loadUserLearningProjectsFromCloud(newSession.user.id);
      } else {
        currentLoadedUserIdRef.current = null;
        setSession(null);
        setUserProfile(null);
        setSubscriptionSummary(null);
        setLearningProjects([]);
        setActiveLearningContext({
          activeProjectId: undefined,
          activeClassSubjectId: undefined,
          activeChapterId: undefined,
          activeMeetingId: undefined,
        });
        setProjects([]);
        setCurrentDraft(INITIAL_SAMPLE_DRAFT);
        localStorage.removeItem('stivia_last_user_id');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [refreshSubscriptionSummary, loadUserLearningProjectsFromCloud]);

  // Reverse Sync (TEST 4): Auto-sinkronkan dari cloud saat window kembali aktif/fokus (ter-throttle & aman dari spam)
  useEffect(() => {
    const handleFocus = () => {
      const now = Date.now();
      // Cooldown 45 detik agar tidak memicu query berulang setiap kali berganti tab
      if (now - lastFocusSyncRef.current < 45_000) return;
      // Jangan spam refresh jika tabel Supabase diketahui MISSING
      if (getProjectTableStatus() === 'missing') return;

      if (session?.user?.id && !isCloudSyncing) {
        lastFocusSyncRef.current = now;
        loadUserLearningProjectsFromCloud(session.user.id);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [session?.user?.id, isCloudSyncing, loadUserLearningProjectsFromCloud]);

  // Handler Keluar (Logout)
  const handleLogout = async () => {
    try {
      currentLoadedUserIdRef.current = null;
      invalidateSubscriptionCache();
      await signOutUser();
    } catch (err) {
      console.warn('Gagal memproses signOut:', err);
    } finally {
      invalidateSubscriptionCache();
      setSession(null);
      setUserProfile(null);
      setSubscriptionSummary(null);
      // Reset user-specific state to guarantee strict User Isolation
      setLearningProjects([]);
      const emptyContext: ActiveLearningContext = {
        activeProjectId: undefined,
        activeClassSubjectId: undefined,
        activeChapterId: undefined,
        activeMeetingId: undefined,
      };
      setActiveLearningContext(emptyContext);
      setProjects([]);
      setCurrentDraft(INITIAL_SAMPLE_DRAFT);
      localStorage.removeItem('stivia_last_user_id');
      setCloudSyncStatus('local');
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
    if (session?.user?.id) {
      saveStoredLearningProjects(learningProjects, session.user.id);
    }
  }, [learningProjects, session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      saveStoredActiveContext(activeLearningContext, session.user.id);
    }
  }, [activeLearningContext, session?.user?.id]);

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
    if (session?.user?.id) {
      saveStoredCurrentDraft(syncedDraft, session.user.id);
    }

    // 2. Set active learning context
    const nextContext: ActiveLearningContext = {
      activeProjectId: project.id,
      activeClassSubjectId: classSubject.id,
      activeChapterId: chapter.id,
      activeMeetingId: meeting.id
    };
    setActiveLearningContext(nextContext);
    if (session?.user?.id) {
      saveStoredActiveContext(nextContext, session.user.id);
    }

    // 3. Arahkan pengguna ke studio produk yang dipilih
    setActiveTab(productTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Master Context ${meeting.meetingNumber} dimuat ke Studio ${productTab.toUpperCase()}!`);
  };

  // Handler memilih pertemuan pembelajaran langsung dari selector sumber data di 5 studio produk
  const handleSwitchMeetingContext = (
    project: LearningProject,
    classSubject: ClassSubjectNode,
    chapter: ChapterNode,
    meeting: MeetingSession
  ) => {
    const nextContext: ActiveLearningContext = {
      activeProjectId: project.id,
      activeClassSubjectId: classSubject.id,
      activeChapterId: chapter.id,
      activeMeetingId: meeting.id
    };
    setActiveLearningContext(nextContext);
    if (session?.user?.id) {
      saveStoredActiveContext(nextContext, session.user.id);
    }

    // Sinkronkan ke currentDraft
    const syncedDraft = syncMeetingToCurrentDraft(meeting, chapter, classSubject, project, currentDraft);
    setCurrentDraft(syncedDraft);
    if (session?.user?.id) {
      saveStoredCurrentDraft(syncedDraft, session.user.id);
    }

    showToast(`Data pembelajaran ${meeting.meetingNumber} (${project.name}) dipilih!`);
  };

  // Handler membuat proyek pembelajaran baru dari form Buat Proyek (1 Data -> Banyak Produk)
  const handleCreateLearningProject = async (input: CreateProjectFormInput) => {
    const { project, activeContext } = createLearningProjectFromFormData(input);

    // 1. Tambahkan ke daftar proyek hierarki lokal (terisolasi per user)
    const updated = [project, ...learningProjects];
    setLearningProjects(updated);
    saveStoredLearningProjects(updated, session?.user?.id);

    // 2. Set konteks pembelajaran aktif
    setActiveLearningContext(activeContext);
    saveStoredActiveContext(activeContext, session?.user?.id);

    // 3. Sinkronkan Master Learning Data dari pertemuan pertama ke currentDraft hanya jika terdapat data materi nyata
    const firstClass = project.classSubjects[0];
    const firstChapter = firstClass?.chapters[0];
    const firstMeeting = firstChapter?.meetings[0];
    const hasRealLearningData = Boolean(
      firstMeeting?.masterLearningData?.materiDiajarkan?.trim() ||
      firstMeeting?.masterLearningData?.temaKegiatan?.trim()
    );

    if (firstMeeting && firstChapter && firstClass && hasRealLearningData) {
      const syncedDraft = syncMeetingToCurrentDraft(
        firstMeeting,
        firstChapter,
        firstClass,
        project,
        currentDraft
      );
      setCurrentDraft(syncedDraft);
      saveStoredCurrentDraft(syncedDraft, session?.user?.id);

      // Simpan juga ke daftar user projects legacy untuk kompatibilitas
      setProjects((prev) => {
        const filtered = prev.filter((p) => p.id !== syncedDraft.id);
        const newProjList = [syncedDraft, ...filtered];
        saveStoredLegacyProjects(newProjList, session?.user?.id);
        return newProjList;
      });

      // Simpan draf legacy ke Supabase stivia_projects jika user login
      if (session?.user?.id && isSupabaseConfigured) {
        saveLegacyProjectToSupabase(syncedDraft, session.user.id).catch(console.warn);
      }
    }

    // 4. PERSISTENSI KE SUPABASE CLOUD (SOURCE OF TRUTH)
    if (session?.user?.id && isSupabaseConfigured) {
      setIsCloudSyncing(true);
      setCloudSyncStatus('syncing');
      try {
        const res = await saveLearningProjectToSupabase(project, session.user.id);
        if (res.success) {
          setCloudSyncStatus('synced');
          showToast(`Proyek "${project.name}" berhasil disimpan di Cloud Supabase!`);
        } else {
          if (res.status === 'missing') {
            setCloudSyncStatus('local');
            showToast(`Proyek "${project.name}" tersimpan lokal — sinkronisasi cloud belum tersedia.`);
          } else if (res.status === 'forbidden') {
            setCloudSyncStatus('error');
            showToast(`Cloud tidak dapat diakses — periksa izin/RLS.`);
          } else if (res.status === 'auth_required') {
            setCloudSyncStatus('error');
            showToast(`Cloud tidak dapat diakses — sesi autentikasi kedaluwarsa.`);
          } else {
            setCloudSyncStatus('local');
            showToast(`Proyek tersimpan di perangkat lokal. (${res.error || 'Sinkronisasi tertunda'})`);
          }
        }
      } catch (err: any) {
        console.warn('[STIVIA Supabase] Error simpan proyek ke Supabase:', err);
        setCloudSyncStatus('local');
        showToast('Proyek tersimpan di perangkat lokal.');
      } finally {
        setIsCloudSyncing(false);
      }
    } else {
      showToast(`Proyek "${project.name}" berhasil dibuat! Siap digunakan untuk semua produk.`);
    }

    // 5. Arahkan pengguna ke halaman Proyek Pembelajaran (Proyek Saya)
    setActiveTab('proyek_saya');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler memperbarui proyek pembelajaran (Master data, status, penambahan bab/pertemuan/kelas)
  const handleUpdateLearningProjects = async (
    updated: LearningProject[],
    options?: { targetProjectId?: string }
  ) => {
    setLearningProjects(updated);
    saveStoredLearningProjects(updated, session?.user?.id);

    const targetProjId = options?.targetProjectId || activeLearningContext.activeProjectId;
    const targetProject = updated.find((p) => p.id === targetProjId) || updated[0];

    if (targetProject && session?.user?.id && isSupabaseConfigured) {
      setIsCloudSyncing(true);
      setCloudSyncStatus('syncing');
      try {
        const res = await saveLearningProjectToSupabase(targetProject, session.user.id);
        if (res.success) {
          setCloudSyncStatus('synced');
        } else {
          setCloudSyncStatus(res.status === 'forbidden' ? 'error' : 'local');
          console.warn('[STIVIA Supabase] Gagal sinkronisasi proyek ke cloud:', res.error);
          showToast(`⚠️ Perubahan tersimpan lokal. Sinkronisasi cloud: ${res.error || 'tertunda'}`);
        }
      } catch (err) {
        setCloudSyncStatus('local');
        showToast('⚠️ Perubahan tersimpan di perangkat lokal.');
      } finally {
        setIsCloudSyncing(false);
      }
    }
  };

  // Handler menghapus proyek pembelajaran (Multi-device sync delete & reliable cloud persistence)
  const handleDeleteLearningProject = async (projectId: string) => {
    if (!projectId) return;

    const target = learningProjects.find((p) => p.id === projectId);
    if (!target) return;

    // 1. Sinkronisasi penghapusan ke Supabase terlebih dahulu jika user login dan Supabase aktif
    if (session?.user?.id && isSupabaseConfigured) {
      setIsCloudSyncing(true);
      setCloudSyncStatus('syncing');
      try {
        const deleteRes = await deleteLearningProjectFromSupabase(projectId, session.user.id);
        if (!deleteRes.success && !deleteRes.isSchemaMissing) {
          console.warn('[STIVIA Supabase] Gagal menghapus proyek dari Supabase:', deleteRes.error);
          setCloudSyncStatus('local');
          showToast(`Gagal menghapus proyek: ${deleteRes.error || 'Terjadi kesalahan'}`);
          return;
        }
        if (deleteRes.isSchemaMissing) {
          setCloudSyncStatus('local');
        } else {
          setCloudSyncStatus('synced');
        }
      } catch (err: any) {
        console.warn('[STIVIA Supabase] Exception saat hapus proyek di Supabase:', err);
        setCloudSyncStatus('local');
      } finally {
        setIsCloudSyncing(false);
      }
    }

    // 2. Perbarui state lokal & localStorage (terisolasi per user)
    const updated = learningProjects.filter((p) => p.id !== projectId);
    setLearningProjects(updated);
    saveStoredLearningProjects(updated, session?.user?.id);

    // 3. Normalisasi activeLearningContext
    if (activeLearningContext.activeProjectId === projectId) {
      if (updated.length > 0) {
        const nextProj = updated[0];
        const newContext: ActiveLearningContext = {
          activeProjectId: nextProj.id,
          activeClassSubjectId: nextProj.classSubjects[0]?.id,
          activeChapterId: nextProj.classSubjects[0]?.chapters[0]?.id,
          activeMeetingId: nextProj.classSubjects[0]?.chapters[0]?.meetings[0]?.id,
        };
        setActiveLearningContext(newContext);
        saveStoredActiveContext(newContext, session?.user?.id);
      } else {
        const emptyContext: ActiveLearningContext = {
          activeProjectId: undefined,
          activeClassSubjectId: undefined,
          activeChapterId: undefined,
          activeMeetingId: undefined,
        };
        setActiveLearningContext(emptyContext);
        saveStoredActiveContext(emptyContext, session?.user?.id);
      }
    }

    showToast(`Proyek "${target.name}" berhasil dihapus.`);
  };

  // Handler menghapus sesi pertemuan pembelajaran (Multi-device sync delete & normalisasi nomor pertemuan)
  const handleDeleteLearningMeeting = async (meetingId: string) => {
    const { updatedProjects, deletedMeeting, targetProjectId, nextActiveMeetingId } =
      removeMeetingFromProject(learningProjects, meetingId);

    if (!deletedMeeting) return;

    setLearningProjects(updatedProjects);
    saveStoredLearningProjects(updatedProjects, session?.user?.id);

    if (activeLearningContext.activeMeetingId === meetingId) {
      const newContext: ActiveLearningContext = {
        ...activeLearningContext,
        activeMeetingId: nextActiveMeetingId,
      };
      setActiveLearningContext(newContext);
      saveStoredActiveContext(newContext, session?.user?.id);
    }

    if (session?.user?.id && isSupabaseConfigured) {
      setIsCloudSyncing(true);
      setCloudSyncStatus('syncing');
      try {
        const delRes = await deleteLearningMeetingFromSupabase(meetingId);
        if (!delRes.success && !delRes.isSchemaMissing) {
          showToast(`⚠️ Pertemuan dihapus di lokal. Cloud: ${delRes.error || 'Terjadi kesalahan'}`);
        }
        const targetProj = updatedProjects.find((p) => p.id === targetProjectId);
        if (targetProj) {
          const saveRes = await saveLearningProjectToSupabase(targetProj, session.user.id);
          if (!saveRes.success && !saveRes.isSchemaMissing) {
            console.warn('[STIVIA Supabase] Gagal sinkronisasi proyek pasca hapus pertemuan:', saveRes.error);
          }
        }
        setCloudSyncStatus('synced');
      } catch (err) {
        console.warn('[STIVIA Supabase] Gagal sinkronisasi hapus meeting ke Supabase:', err);
        setCloudSyncStatus('local');
      } finally {
        setIsCloudSyncing(false);
      }
    }

    showToast(`Pertemuan "${deletedMeeting.title}" berhasil dihapus.`);
  };

  // Handler menghapus bab/teks pembelajaran (Multi-device sync delete & reliable cloud persistence)
  const handleDeleteLearningChapter = async (chapterId: string) => {
    const { updatedProjects, deletedChapter, targetProjectId, nextActiveChapterId, nextActiveMeetingId } =
      removeChapterFromProject(learningProjects, chapterId);

    if (!deletedChapter) return;

    setLearningProjects(updatedProjects);
    saveStoredLearningProjects(updatedProjects, session?.user?.id);

    if (activeLearningContext.activeChapterId === chapterId) {
      const newContext: ActiveLearningContext = {
        ...activeLearningContext,
        activeChapterId: nextActiveChapterId,
        activeMeetingId: nextActiveMeetingId,
      };
      setActiveLearningContext(newContext);
      saveStoredActiveContext(newContext, session?.user?.id);
    }

    if (session?.user?.id && isSupabaseConfigured) {
      setIsCloudSyncing(true);
      setCloudSyncStatus('syncing');
      try {
        const res = await deleteLearningChapterFromSupabase(chapterId, session.user.id);
        if (!res.success && !res.isSchemaMissing) {
          console.warn('[STIVIA Supabase] Gagal menghapus bab dari cloud:', res.error);
          showToast(`⚠️ Bab dihapus di lokal. Cloud: ${res.error || 'Terjadi kesalahan'}`);
        }
        const targetProj = updatedProjects.find((p) => p.id === targetProjectId);
        if (targetProj) {
          const saveRes = await saveLearningProjectToSupabase(targetProj, session.user.id);
          if (!saveRes.success && !saveRes.isSchemaMissing) {
            console.warn('[STIVIA Supabase] Gagal sinkronisasi proyek pasca hapus bab:', saveRes.error);
          }
        }
        setCloudSyncStatus('synced');
      } catch (err) {
        console.warn('[STIVIA Supabase] Gagal sinkronisasi hapus bab ke Supabase:', err);
        setCloudSyncStatus('local');
      } finally {
        setIsCloudSyncing(false);
      }
    }

    showToast(`Bab "${deletedChapter.title}" berhasil dihapus.`);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist to localStorage terisolasi per akun
  useEffect(() => {
    if (session?.user?.id) {
      saveStoredLegacyProjects(projects, session.user.id);
    }
  }, [projects, session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      saveStoredCurrentDraft(currentDraft, session.user.id);
    }
  }, [currentDraft, session?.user?.id]);

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
      setLearningProjects((prev) => {
        const updated = updateMeetingProductState(
          prev,
          targetMeetingId,
          productKey,
          'ready'
        );
        saveStoredLearningProjects(updated, session?.user?.id);
        if (session?.user?.id && isSupabaseConfigured) {
          updateMeetingProductStateInSupabase(targetMeetingId, productKey, 'ready').catch((err) => {
            console.warn('[STIVIA Supabase] Gagal update product_states:', err);
          });
        }
        return updated;
      });
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
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      saveStoredLegacyProjects(updated, session?.user?.id);
      return updated;
    });
    if (session?.user?.id && isSupabaseConfigured) {
      deleteLegacyProjectFromSupabase(projectId, session.user.id).catch(console.warn);
    }
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
    setProjects((prev) => {
      const updated = [duplicated, ...prev];
      saveStoredLegacyProjects(updated, session?.user?.id);
      return updated;
    });
    if (session?.user?.id && isSupabaseConfigured) {
      saveLegacyProjectToSupabase(duplicated, session.user.id).catch(console.warn);
    }
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

  // Context Adapter untuk Menu Asesmen (Tahap 3E: Harian & Sumatif)
  const activeAssessmentContext = resolvedHierarchy.meeting
    ? buildAssessmentProductContext(
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
          cloudSyncStatus={cloudSyncStatus}
          isCloudSyncing={isCloudSyncing}
          onRefreshCloud={() => session?.user?.id ? loadUserLearningProjectsFromCloud(session.user.id) : undefined}
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
              isCloudSyncing={isCloudSyncing}
              cloudSyncStatus={cloudSyncStatus}
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
              learningProjects={learningProjects}
              activeLearningContext={activeLearningContext}
              onSelectMeetingContext={handleSwitchMeetingContext}
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
              learningProjects={learningProjects}
              activeLearningContext={activeLearningContext}
              onSelectMeetingContext={handleSwitchMeetingContext}
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
              learningProjects={learningProjects}
              activeLearningContext={activeLearningContext}
              onSelectMeetingContext={handleSwitchMeetingContext}
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
              learningProjects={learningProjects}
              activeLearningContext={activeLearningContext}
              onSelectMeetingContext={handleSwitchMeetingContext}
            />
          )}

          {/* STUDIO KONTEN: ASESMEN HARIAN */}
          {(activeTab === 'asesmen' || activeTab === 'asesmen_harian') && (
            <AsesmenHarianPage
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              assessmentContext={activeAssessmentContext}
              subscriptionSummary={subscriptionSummary}
              onUsageRecorded={() => refreshSubscriptionSummary()}
              userId={session?.user?.id}
              onSaveToast={showToast}
              learningProjects={learningProjects}
              activeLearningContext={activeLearningContext}
              onSelectMeetingContext={handleSwitchMeetingContext}
            />
          )}

          {/* STUDIO KONTEN: ASESMEN SUMATIF */}
          {activeTab === 'asesmen_sumatif' && (
            <AsesmenSumatifPage
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              assessmentContext={activeAssessmentContext}
              subscriptionSummary={subscriptionSummary}
              onUsageRecorded={() => refreshSubscriptionSummary()}
              userId={session?.user?.id}
              onSaveToast={showToast}
              learningProjects={learningProjects}
              activeLearningContext={activeLearningContext}
              onSelectMeetingContext={handleSwitchMeetingContext}
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
              onUpdateLearningProjects={handleUpdateLearningProjects}
              onUpdateActiveContext={setActiveLearningContext}
              onSelectMeetingProduct={handleSelectMeetingProduct}
              onSelectLegacyProject={handleSelectProject}
              onDeleteLegacyProject={handleDeleteProject}
              onDuplicateLegacyProject={handleDuplicateProject}
              onDeleteLearningProject={handleDeleteLearningProject}
              onDeleteLearningMeeting={handleDeleteLearningMeeting}
              onDeleteLearningChapter={handleDeleteLearningChapter}
              onRefreshCloud={() => session?.user?.id ? loadUserLearningProjectsFromCloud(session.user.id) : Promise.resolve()}
              isCloudSyncing={isCloudSyncing}
              cloudSyncStatus={cloudSyncStatus}
              userId={session?.user?.id}
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
