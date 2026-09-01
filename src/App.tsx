import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './components/pages/DashboardPage';
import { BuatInfografisPage } from './components/pages/BuatInfografisPage';
import { PromptStudioPage } from './components/pages/PromptStudioPage';
import { RancanganMateriPage } from './components/pages/RancanganMateriPage';
import { RancanganVisualPage } from './components/pages/RancanganVisualPage';
import { HasilInfografisPage } from './components/pages/HasilInfografisPage';
import { PreviewInfografisPage } from './components/pages/PreviewInfografisPage';
import { InfografisSayaPage } from './components/pages/InfografisSayaPage';
import { EksporImporPage } from './components/pages/EksporImporPage';
import { PanduanPage } from './components/pages/PanduanPage';
import { PengaturanPage } from './components/pages/PengaturanPage';
import { NotificationToast } from './components/NotificationToast';
import { 
  InfographicDraft, 
  NavigationTab, 
  UserSettings,
  ResponsiveViewMode 
} from './types';
import { 
  INITIAL_SAMPLE_DRAFT, 
  INITIAL_PROJECTS, 
  DEFAULT_USER_SETTINGS,
} from './data/mockData';
import { createDraftFromContext, validateAndSanitizeDraft } from './data/materialGenerator';

export default function App() {
  // Navigation active tab (default to dashboard)
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // User projects & active draft state
  const [projects, setProjects] = useState<InfographicDraft[]>(() => {
    const saved = localStorage.getItem('stivia_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PROJECTS;
      }
    }
    return INITIAL_PROJECTS;
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
  const handleFormSubmit = (formData: Partial<InfographicDraft>) => {
    const subject = formData.subject || currentDraft.subject;
    const theme = formData.theme || currentDraft.theme;
    const rawTopic = formData.rawTopic || currentDraft.rawTopic;
    const scope = formData.scope || currentDraft.scope;
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
      materi: rawTopic,
      cakupanMateri: scope,
      gayaVisual: style,
      format,
      tingkatVisual: visualLevel,
      konteksContoh: context,
      customExampleContext: customContext,
    });

    const sanitizedDraft = validateAndSanitizeDraft(fullDraft);

    setCurrentDraft(sanitizedDraft);
    
    // Also sync to projects list
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== sanitizedDraft.id);
      return [sanitizedDraft, ...filtered];
    });

    setActiveTab('rancangan');
    showToast('Rancangan materi berhasil disusun secara konsisten!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load sample data button handler
  const handleLoadSample = () => {
    setCurrentDraft(INITIAL_SAMPLE_DRAFT);
    setActiveTab('rancangan');
    showToast('Memuat contoh rancangan materi: Struktur Data Graph.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const handleSelectProject = (project: InfographicDraft, targetTab: 'rancangan' | 'hasil' | 'preview') => {
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

  const handleImportProjects = (imported: InfographicDraft[]) => {
    setProjects((prev) => {
      const importedIds = new Set(imported.map((p) => p.id));
      const retained = prev.filter((p) => !importedIds.has(p.id));
      return [...imported, ...retained];
    });
    if (imported.length > 0) {
      setCurrentDraft(imported[0]);
    }
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800 flex">
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
              onSelectProject={handleSelectProject}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLoadSample={handleLoadSample}
            />
          )}

          {activeTab === 'buat' && (
            <BuatInfografisPage
              currentDraft={currentDraft}
              onSubmitForm={handleFormSubmit}
              onLoadSampleData={handleLoadSample}
            />
          )}

          {activeTab === 'prompt_studio' && (
            <PromptStudioPage
              projects={projects}
              currentDraft={currentDraft}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSaveToast={showToast}
            />
          )}

          {activeTab === 'rancangan' && (
            <RancanganMateriPage
              draft={currentDraft}
              onUpdateDraft={handleUpdateDraft}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSaveToast={showToast}
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
            <InfografisSayaPage
              projects={projects}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
              onDuplicateProject={handleDuplicateProject}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSaveToast={showToast}
            />
          )}

          {activeTab === 'ekspor_impor' && (
            <EksporImporPage
              projects={projects}
              currentDraft={currentDraft}
              onImportProjects={handleImportProjects}
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

          {activeTab === 'pengaturan' && (
            <PengaturanPage
              settings={userSettings}
              onUpdateSettings={handleUpdateSettings}
              onSaveToast={showToast}
              viewMode={viewMode}
              onSetViewMode={setViewMode}
              effectiveMode={effectiveMode}
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
