import React from 'react';
import { 
  Home, 
  Palette,
  Sparkles, 
  FolderKanban, 
  ArrowDownUp, 
  Settings, 
  User,
  X
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  effectiveMode?: 'mobile' | 'desktop';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  effectiveMode = 'desktop',
}) => {
  // Helper to determine if a sub-flow tab belongs to active section
  const isTabActive = (tabId: NavigationTab) => {
    if (activeTab === tabId) return true;
    if (tabId === 'dashboard' && activeTab === 'beranda') return true;
    if (tabId === 'beranda' && activeTab === 'dashboard') return true;
    if (tabId === 'proyek_saya' && activeTab === 'infografis_saya') return true;
    if (tabId === 'infografis_saya' && activeTab === 'proyek_saya') return true;
    if (tabId === 'buat' && (activeTab === 'rancangan' || activeTab === 'visual' || activeTab === 'hasil' || activeTab === 'preview')) {
      return true;
    }
    return false;
  };

  const handleNavClick = (tabId: NavigationTab) => {
    onSelectTab(tabId);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  const renderNavButton = (id: NavigationTab, label: string, icon: React.ReactNode) => {
    const active = isTabActive(id);
    return (
      <button
        key={id}
        id={`nav-btn-${id}`}
        onClick={() => handleNavClick(id)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
          active
            ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20 font-semibold'
            : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/60'
        }`}
      >
        <span className={active ? 'text-white' : 'text-slate-500'}>
          {icon}
        </span>
        <span>{label}</span>
      </button>
    );
  };

  const isMobileLayout = effectiveMode === 'mobile';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className={`fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-xs transition-opacity ${
            isMobileLayout ? 'block' : 'lg:hidden'
          }`}
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="stivia-main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#f8fafc] border-r border-slate-200/80 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out ${
          isMobileLayout
            ? isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
            : isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand */}
        <div>
          <div className="flex items-center justify-between px-2 mb-6">
            <button 
              onClick={() => handleNavClick('dashboard')}
              className="text-left focus:outline-hidden group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-indigo-700 font-sans group-hover:text-indigo-800 transition-colors">
                  STIVIA
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] leading-tight text-slate-500 font-normal mt-1 max-w-[190px]">
                Belajar Lebih Visual, Mengajar Lebih Mudah
              </p>
            </button>

            {/* Mobile close button */}
            <button 
              onClick={onCloseMobile} 
              className={`p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer ${
                isMobileLayout ? 'block' : 'lg:hidden'
              }`}
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu with structured sections */}
          <nav className="space-y-1" aria-label="Menu Utama">
            {/* 1. Dashboard */}
            {renderNavButton('dashboard', 'Dashboard', <Home className="w-5 h-5" />)}

            <div className="my-2.5 border-t border-slate-200/70" />

            {/* 2. Buat Infografis & Prompt Studio */}
            {renderNavButton('buat', 'Buat Infografis', <Palette className="w-5 h-5" />)}
            {renderNavButton('prompt_studio', 'Prompt Studio', <Sparkles className="w-5 h-5" />)}

            <div className="my-2.5 border-t border-slate-200/70" />

            {/* 3. Proyek Saya & Ekspor / Impor */}
            {renderNavButton('infografis_saya', 'Proyek Saya', <FolderKanban className="w-5 h-5" />)}
            {renderNavButton('ekspor_impor', 'Ekspor / Impor', <ArrowDownUp className="w-5 h-5" />)}

            <div className="my-2.5 border-t border-slate-200/70" />

            {/* 4. Pengaturan */}
            {renderNavButton('pengaturan', 'Pengaturan', <Settings className="w-5 h-5" />)}
          </nav>
        </div>

        {/* Bottom Profile Pill */}
        <div className="pt-4 border-t border-slate-200/60">
          <button
            onClick={() => handleNavClick('pengaturan')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-950 transition-colors text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-indigo-950 truncate">
                Pengguna STIVIA
              </p>
              <p className="text-[10px] text-indigo-600 truncate">
                Pendidik & Kreator
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
