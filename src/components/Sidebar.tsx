import React from 'react';
import { 
  Home, 
  Palette, 
  Sparkles, 
  FolderKanban, 
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
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left cursor-pointer ${
          active
            ? 'bg-[#3b49df] text-white shadow-md shadow-indigo-600/25 font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
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
          className={`fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-xs transition-opacity ${
            isMobileLayout ? 'block' : 'lg:hidden'
          }`}
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="stivia-main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col justify-between py-6 px-4 transition-transform duration-200 ease-in-out ${
          isMobileLayout
            ? isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
            : isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand */}
        <div>
          <div className="flex items-center justify-between px-2 mb-7">
            <button 
              onClick={() => handleNavClick('dashboard')}
              className="text-left focus:outline-hidden group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#3b49df] font-sans group-hover:text-indigo-800 transition-colors">
                  STIVIA
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e0e7ff] text-[#3b49df] tracking-wide">
                  V2.2a
                </span>
              </div>
              <p className="text-[11px] leading-tight text-slate-500 font-normal mt-1.5 max-w-[200px]">
                Belajar Lebih Visual, Mengajar Lebih Mudah
              </p>
            </button>

            {/* Mobile close button */}
            <button 
              onClick={onCloseMobile} 
              className={`p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer ${
                isMobileLayout ? 'block' : 'lg:hidden'
              }`}
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu with clean layout */}
          <nav className="space-y-1.5" aria-label="Menu Utama">
            {/* 1. Dashboard */}
            {renderNavButton('dashboard', 'Dashboard', <Home className="w-5 h-5" />)}

            {/* 2. Buat Infografis & Prompt Studio */}
            {renderNavButton('buat', 'Buat Infografis', <Palette className="w-5 h-5" />)}
            {renderNavButton('prompt_studio', 'Prompt Studio', <Sparkles className="w-5 h-5" />)}

            {/* 3. Proyek Saya */}
            {renderNavButton('infografis_saya', 'Proyek Saya', <FolderKanban className="w-5 h-5" />)}
          </nav>
        </div>

        {/* Bottom Section: Pengaturan & Profile Pill */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <button
            id="nav-btn-pengaturan"
            onClick={() => handleNavClick('pengaturan')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all text-left cursor-pointer ${
              activeTab === 'pengaturan'
                ? 'bg-[#3b49df] text-white shadow-md shadow-indigo-600/25 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Settings className={`w-5 h-5 ${activeTab === 'pengaturan' ? 'text-white' : 'text-slate-500'}`} />
            <span>Pengaturan</span>
          </button>

          <button
            onClick={() => handleNavClick('pengaturan')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#edf2fe] hover:bg-[#e4ebfc] text-slate-900 transition-colors text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#3b49df] flex items-center justify-center text-white shrink-0 shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                Pengguna STIVIA
              </p>
              <p className="text-[10px] font-semibold text-[#3b49df] truncate">
                Pendidik & Kreator
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
