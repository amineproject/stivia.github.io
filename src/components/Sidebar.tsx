import React, { useState } from 'react';
import { 
  Home, 
  Palette, 
  FolderKanban, 
  Settings, 
  User,
  LogOut,
  X,
  BookOpen,
  FileText,
  Presentation,
  GraduationCap,
  Calendar,
  Award,
  ChevronDown,
  FolderPlus
} from 'lucide-react';
import { NavigationTab } from '../types';
import { APP_CURRENT_VERSION } from '../data/versionHistoryData';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  effectiveMode?: 'mobile' | 'desktop';
  userName?: string;
  userRole?: string;
  userSchool?: string;
  userAvatar?: string | null;
  userPlan?: 'free' | 'pro';
  isAdmin?: boolean;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  effectiveMode = 'desktop',
  userName = 'Pengguna STIVIA',
  userRole = 'Pendidik & Kreator',
  userSchool,
  userAvatar,
  userPlan = 'free',
  isAdmin = false,
  onLogout,
}) => {
  const [asesmenOpen, setAsesmenOpen] = useState(true);

  const isAsesmenActive = 
    activeTab === 'asesmen' || 
    activeTab === 'asesmen_harian' || 
    activeTab === 'asesmen_sumatif';

  // Helper to determine if a sub-flow tab belongs to active section
  const isTabActive = (tabId: NavigationTab) => {
    if (activeTab === tabId) return true;
    if (tabId === 'dashboard' && activeTab === 'beranda') return true;
    if (tabId === 'beranda' && activeTab === 'dashboard') return true;
    if (tabId === 'proyek_saya' && activeTab === 'infografis_saya') return true;
    if (tabId === 'infografis_saya' && activeTab === 'proyek_saya') return true;
    if (tabId === 'buat_proyek' && activeTab === 'buat_proyek') return true;
    if (tabId === 'infografis' && (activeTab === 'buat' || activeTab === 'visual' || activeTab === 'hasil' || activeTab === 'preview')) {
      return true;
    }
    if (tabId === 'buat' && (activeTab === 'infografis' || activeTab === 'visual' || activeTab === 'hasil' || activeTab === 'preview')) {
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

  const renderNavButton = (id: NavigationTab, label: string, icon: React.ReactNode, badge?: string) => {
    const active = isTabActive(id);
    return (
      <button
        key={id}
        id={`nav-btn-${id}`}
        type="button"
        onClick={() => handleNavClick(id)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all text-left cursor-pointer ${
          active
            ? 'bg-[#3b49df] text-white shadow-md shadow-indigo-600/25 font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={active ? 'text-white' : 'text-slate-500'}>
            {icon}
          </span>
          <span className="truncate">{label}</span>
        </div>
        {badge && (
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
            active
              ? 'bg-white/20 text-white'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}>
            {badge}
          </span>
        )}
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col justify-between py-5 px-4 transition-transform duration-200 ease-in-out ${
          isMobileLayout
            ? isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
            : isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand & Scrollable Navigation */}
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-2 mb-5 shrink-0">
            <button 
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className="text-left focus:outline-hidden group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#3b49df] font-sans group-hover:text-indigo-800 transition-colors">
                  STIVIA
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e0e7ff] text-[#3b49df] tracking-wide">
                  V{APP_CURRENT_VERSION}
                </span>
              </div>
              <p className="text-[11px] leading-tight text-slate-500 font-normal mt-1.5 max-w-[200px]">
                Belajar Lebih Visual, Mengajar Lebih Mudah
              </p>
            </button>

            {/* Mobile close button */}
            <button 
              type="button"
              onClick={onCloseMobile} 
              className={`p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer ${
                isMobileLayout ? 'block' : 'lg:hidden'
              }`}
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1" aria-label="Menu Utama">
            {/* 1. Dashboard */}
            {renderNavButton('dashboard', 'Dashboard', <Home className="w-4.5 h-4.5" />)}

            {/* SECTION: RUANG BELAJAR */}
            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Ruang Belajar
              </span>
            </div>
            {renderNavButton('infografis_saya', 'Proyek Saya', <FolderKanban className="w-4.5 h-4.5" />)}
            {renderNavButton('buat_proyek', 'Buat Proyek Baru', <FolderPlus className="w-4.5 h-4.5" />)}

            {/* SECTION: STUDIO PRODUK */}
            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Studio Perangkat Ajar
              </span>
            </div>
            {renderNavButton('materi', 'Bahan Ajar A4', <BookOpen className="w-4.5 h-4.5" />)}
            {renderNavButton('infografis', 'Infografis Visual', <Palette className="w-4.5 h-4.5" />)}
            {renderNavButton('lkpd', 'Lembar LKPD', <FileText className="w-4.5 h-4.5" />)}
            {renderNavButton('presentasi', 'Slide Presentasi', <Presentation className="w-4.5 h-4.5" />)}
            {renderNavButton('asesmen_harian', 'Asesmen Harian', <Calendar className="w-4.5 h-4.5" />)}
            {renderNavButton('asesmen_sumatif', 'Asesmen Sumatif', <Award className="w-4.5 h-4.5" />)}
          </nav>
        </div>

        {/* Bottom Section: Profil Saya, Pengaturan & Logout */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100 shrink-0">
          {/* Tombol Akses Profil Saya */}
          <button
            type="button"
            id="nav-btn-profil-saya"
            onClick={() => handleNavClick('profil_saya')}
            className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left group cursor-pointer ${
              activeTab === 'profil_saya'
                ? 'bg-indigo-50 text-slate-900 font-bold'
                : 'hover:bg-slate-100/70 text-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#3b49df] flex items-center justify-center text-white shrink-0 overflow-hidden text-xs">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {userName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {userSchool || userRole}
              </p>
            </div>
          </button>

          {/* Tombol Pengaturan */}
          <button
            type="button"
            id="nav-btn-pengaturan"
            onClick={() => handleNavClick('pengaturan')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
              activeTab === 'pengaturan'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan</span>
          </button>

          {onLogout && (
            <button
              type="button"
              id="btn-sidebar-logout"
              onClick={onLogout}
              title="Keluar dari akun STIVIA"
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
