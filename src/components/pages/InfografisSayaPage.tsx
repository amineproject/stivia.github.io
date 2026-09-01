import React, { useState } from 'react';
import { 
  FolderKanban, 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Copy, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Sparkles,
  CheckCircle2,
  Clock,
  Lock
} from 'lucide-react';
import { InfographicDraft, NavigationTab } from '../../types';

interface InfografisSayaPageProps {
  projects: InfographicDraft[];
  onSelectProject: (project: InfographicDraft, targetTab: 'rancangan' | 'hasil' | 'preview') => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (project: InfographicDraft) => void;
  onNavigate: (tab: NavigationTab) => void;
  onSaveToast: (msg: string) => void;
}

export const InfografisSayaPage: React.FC<InfografisSayaPageProps> = ({
  projects,
  onSelectProject,
  onDeleteProject,
  onDuplicateProject,
  onNavigate,
  onSaveToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'completed'>('all');

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = 
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.theme.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ? true : proj.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Infografis Saya
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola seluruh rancangan materi dan infografis pembelajaran yang telah Anda susun.
          </p>
        </div>

        <button
          onClick={() => onNavigate('buat')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#4f46e5] hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Infografis Baru</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau mata pelajaran..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'draft', label: 'Rancangan' },
            { id: 'completed', label: 'Selesai' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === tab.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              Tidak ada infografis yang ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba gunakan kata kunci pencarian lain atau mulai buat rancangan infografis baru.
            </p>
          </div>
          <button
            onClick={() => onNavigate('buat')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
          >
            Mulai Buat Infografis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Visual Thumbnail Header */}
                <div className={`h-28 bg-gradient-to-br ${project.thumbnailColor || 'from-indigo-600 to-indigo-800'} p-4 text-white flex flex-col justify-between relative overflow-hidden`}>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-md">
                      {project.subject}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {(project.isLocked || project.finalOutput?.status === 'LOCKED') && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-emerald-300 backdrop-blur-xs flex items-center gap-1 border border-emerald-400/30">
                          <Lock className="w-2.5 h-2.5" />
                          <span>LOCKED</span>
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        project.status === 'completed' 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-amber-400 text-amber-950'
                      }`}>
                        {project.status === 'completed' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Selesai</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Rancangan</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <span className="text-[10px] text-white/80 font-medium">
                      {project.educationLevel} • {project.grade}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {project.learningObjective || project.theme}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{project.updatedAt || project.createdAt}</span>
                    </span>
                    <span className="font-semibold text-slate-600">
                      {project.blocks.length} Blok Materi
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {/* Duplicate action */}
                  <button
                    onClick={() => onDuplicateProject(project)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                    title="Duplikasi Proyek"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete action */}
                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus Proyek"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status-based primary button: Lanjutkan (Draft) or Preview (Final/Terkunci) */}
                <div className="flex items-center gap-1.5">
                  {project.status === 'draft' && !project.isLocked ? (
                    <button
                      onClick={() => onSelectProject(project, 'rancangan')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Lanjutkan</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const targetTab = (project.isLocked || project.finalOutput?.status === 'LOCKED') ? 'preview' : 'hasil';
                        onSelectProject(project, targetTab);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
