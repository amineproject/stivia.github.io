import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Info,
  X,
  Sparkle,
  Cloud,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { NavigationTab, ResponsiveViewMode } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenMobileMenu: () => void;
  currentDraftTitle?: string;
  viewMode?: ResponsiveViewMode;
  onSetViewMode?: (mode: ResponsiveViewMode) => void;
  effectiveMode?: 'mobile' | 'desktop';
  activeMeetingBreadcrumb?: {
    projectName?: string;
    classSubjectName?: string;
    chapterName?: string;
    meetingName?: string;
  };
  cloudSyncStatus?: 'synced' | 'local' | 'syncing' | 'error';
  isCloudSyncing?: boolean;
  onRefreshCloud?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenMobileMenu,
  currentDraftTitle,
  activeMeetingBreadcrumb,
  cloudSyncStatus = 'local',
  isCloudSyncing = false,
  onRefreshCloud,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Breadcrumb generation based on active tab & active meeting context
  const getBreadcrumbs = () => {
    // Jika ada konteks pertemuan aktif dan tab adalah studio produk atau proyek
    const isProductStudio = [
      'materi',
      'infografis',
      'buat',
      'lkpd',
      'presentasi',
      'asesmen',
      'asesmen_harian',
      'asesmen_sumatif',
      'proyek_saya',
      'infografis_saya'
    ].includes(activeTab);

    if (isProductStudio && activeMeetingBreadcrumb?.meetingName) {
      const crumbs = [
        { label: 'Proyek', tab: 'infografis_saya' as NavigationTab },
        { label: activeMeetingBreadcrumb.projectName || 'Proyek Pembelajaran', tab: 'infografis_saya' as NavigationTab },
      ];

      if (activeMeetingBreadcrumb.classSubjectName) {
        crumbs.push({ label: activeMeetingBreadcrumb.classSubjectName, tab: 'infografis_saya' as NavigationTab });
      }
      if (activeMeetingBreadcrumb.chapterName) {
        crumbs.push({ label: activeMeetingBreadcrumb.chapterName, tab: 'infografis_saya' as NavigationTab });
      }
      if (activeMeetingBreadcrumb.meetingName) {
        crumbs.push({ label: activeMeetingBreadcrumb.meetingName, tab: 'infografis_saya' as NavigationTab });
      }

      // Label produk akhir jika sedang di menu produk
      const productLabels: Record<string, string> = {
        materi: 'Materi A4',
        infografis: 'Infografis',
        buat: 'Infografis',
        lkpd: 'LKPD',
        presentasi: 'Presentasi',
        asesmen: 'Asesmen',
        asesmen_harian: 'Asesmen Harian',
        asesmen_sumatif: 'Asesmen Sumatif',
      };

      if (productLabels[activeTab]) {
        crumbs.push({ label: productLabels[activeTab], tab: activeTab });
      }

      return crumbs;
    }

    switch (activeTab) {
      case 'dashboard':
      case 'beranda':
        return [
          { label: 'STIVIA', tab: 'dashboard' as NavigationTab },
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
        ];
      case 'buat_proyek':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Buat Proyek Pembelajaran', tab: 'buat_proyek' as NavigationTab },
        ];
      case 'buat':
      case 'infografis':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Studio Konten', tab: 'infografis' as NavigationTab },
          { label: 'Infografis', tab: 'infografis' as NavigationTab },
        ];
      case 'materi':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Studio Konten', tab: 'materi' as NavigationTab },
          { label: 'Materi', tab: 'materi' as NavigationTab },
        ];
      case 'lkpd':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Studio Konten', tab: 'lkpd' as NavigationTab },
          { label: 'LKPD', tab: 'lkpd' as NavigationTab },
        ];
      case 'presentasi':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Studio Konten', tab: 'presentasi' as NavigationTab },
          { label: 'Presentasi', tab: 'presentasi' as NavigationTab },
        ];
      case 'asesmen':
      case 'asesmen_harian':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Studio Konten', tab: 'asesmen_harian' as NavigationTab },
          { label: 'Asesmen Harian', tab: 'asesmen_harian' as NavigationTab },
        ];
      case 'asesmen_sumatif':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Studio Konten', tab: 'asesmen_sumatif' as NavigationTab },
          { label: 'Asesmen Sumatif', tab: 'asesmen_sumatif' as NavigationTab },
        ];
      case 'rancangan':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Buat Prompt', tab: 'buat' as NavigationTab },
        ];
      case 'visual':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Buat Prompt', tab: 'buat' as NavigationTab },
          { label: 'Rancangan Visual', tab: 'visual' as NavigationTab },
        ];
      case 'hasil':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Alur Infografis', tab: 'buat' as NavigationTab },
          { label: 'Hasil Infografis', tab: 'hasil' as NavigationTab },
        ];
      case 'preview':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Hasil Infografis', tab: 'hasil' as NavigationTab },
          { label: 'Preview Final Read-Only', tab: 'preview' as NavigationTab },
        ];
      case 'proyek_saya':
      case 'infografis_saya':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Proyek Saya', tab: 'infografis_saya' as NavigationTab },
        ];
      case 'panduan':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Panduan Penggunaan', tab: 'panduan' as NavigationTab },
        ];
      case 'pengaturan':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Pengaturan', tab: 'pengaturan' as NavigationTab },
        ];
      case 'profil_saya':
        return [
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
          { label: 'Profil Saya', tab: 'profil_saya' as NavigationTab },
        ];
      default:
        return [
          { label: 'STIVIA', tab: 'dashboard' as NavigationTab },
          { label: 'Dashboard', tab: 'dashboard' as NavigationTab },
        ];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  const notifications = [
    {
      id: 1,
      title: 'Rancangan Graph Siap',
      desc: 'Rancangan materi Struktur Data Graph berhasil disusun dan siap divisualisasikan.',
      time: 'Baru saja',
      unread: true,
    },
    {
      id: 2,
      title: 'Tips STIVIA',
      desc: 'Gunakan variasi visualisasi diagram alur untuk materi bertahap.',
      time: '2 jam yang lalu',
      unread: false,
    },
  ];

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-[#3b49df] rounded-xl hover:bg-slate-100 cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb matching exact screenshot reference */}
        <nav className="flex items-center text-xs font-semibold text-slate-500 overflow-x-auto max-w-[calc(100vw-140px)] sm:max-w-none py-1 scrollbar-none">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="mx-2 text-slate-300 font-normal shrink-0">›</span>}
                {isLast ? (
                  <span className="font-bold text-slate-900 shrink-0">
                    {crumb.label}
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectTab(crumb.tab)}
                    className="hover:text-[#3b49df] transition-colors cursor-pointer shrink-0"
                  >
                    {crumb.label}
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Cloud Sync, Search Action & Notification Icons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Subtle Cloud Sync Status Indicator */}
        <button
          type="button"
          onClick={onRefreshCloud}
          disabled={isCloudSyncing || !onRefreshCloud}
          title={
            cloudSyncStatus === 'synced'
              ? 'Tersinkron dengan Cloud Supabase (Klik untuk perbarui)'
              : cloudSyncStatus === 'syncing'
              ? 'Sedang menyinkronkan data...'
              : cloudSyncStatus === 'error'
              ? 'Sinkronisasi tertunda (Klik untuk coba lagi)'
              : 'Penyimpanan lokal (Klik untuk sinkronkan)'
          }
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer disabled:cursor-default"
        >
          {cloudSyncStatus === 'synced' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="hidden md:inline text-[11px] text-slate-600">Tersinkron</span>
            </>
          ) : cloudSyncStatus === 'syncing' ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span className="hidden md:inline text-[11px] text-indigo-600">Sinkronisasi</span>
            </>
          ) : cloudSyncStatus === 'error' ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline text-[11px] text-amber-700">Tertunda</span>
            </>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline text-[11px] text-slate-500">Lokal</span>
            </>
          )}
        </button>

        {/* Search trigger */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors relative cursor-pointer"
          title="Cari Materi atau Proyek"
          aria-label="Cari Materi atau Proyek"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Notifikasi"
            aria-label="Notifikasi Pembelajaran"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifikasi Pembelajaran
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                    aria-label="Tutup notifikasi"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 mt-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 flex gap-2.5 items-start">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-50 flex items-start justify-center pt-24 px-4 backdrop-blur-xs"
          onClick={() => setShowSearchModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg p-5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-700">
                <Search className="w-4 h-4 text-[#3b49df]" />
                <span className="text-sm font-semibold">Cari Materi & Proyek</span>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Tutup pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik topik, mata pelajaran, atau kata kunci..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm"
                autoFocus
              />
            </div>
            <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider px-1">
                Pencarian Cepat
              </p>
              <button
                onClick={() => {
                  onSelectTab('buat');
                  setShowSearchModal(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-xs text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>Memahami Struktur Data Graph</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Informatika</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('infografis_saya');
                  setShowSearchModal(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-xs text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>Sistem Peredaran Darah Manusia</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">IPA</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('infografis_saya');
                  setShowSearchModal(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-xs text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>Hukum Newton dan Penerapannya</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Fisika</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
