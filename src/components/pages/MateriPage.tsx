import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Sparkles,
  Printer,
  FileDown,
  Copy,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  ListPlus,
  Check,
  Table as TableIcon,
  HelpCircle,
  Bookmark,
  Edit3,
  Eye,
  Sliders,
  School,
  User,
  Clock,
  Layers,
  Info,
  Maximize2
} from 'lucide-react';
import {
  EducationLevel,
  InfographicDraft,
  NavigationTab,
  SubscriptionSummary
} from '../../types';
import {
  MateriDocument,
  MateriSection,
  SupportingItem,
  DEFAULT_SAMPLE_MATERI,
  SUGGESTED_SECTION_PRESETS,
  synthesizeSummaryFromSections,
  generateUnderstandingQuestionsFromSections,
  estimateA4PageCount,
  exportMateriToDocx
} from '../../services/materiDocumentEngine';
import { suggestLearningObjectives } from '../../services/stiviaThinkingFramework';

interface MateriPageProps {
  onNavigate?: (tab: NavigationTab) => void;
  currentDraft?: InfographicDraft;
  userId?: string;
  subscriptionSummary?: SubscriptionSummary | null;
  onUsageRecorded?: () => void;
  onSubmitForm?: (draft: InfographicDraft) => void;
}

export const MateriPage: React.FC<MateriPageProps> = ({
  onNavigate,
  currentDraft,
  userId,
  subscriptionSummary,
  onUsageRecorded,
  onSubmitForm
}) => {
  // Mode Tampilan: 'form' (Perancangan) atau 'preview' (Dokumen A4 Siap Cetak)
  const [viewMode, setViewMode] = useState<'form' | 'preview'>('form');

  // ============================================================================
  // FORM STATE: DOKUMEN MATERI
  // ============================================================================
  const [subject, setSubject] = useState<string>(currentDraft?.subject || 'Bahasa Indonesia');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [isCustomSubject, setIsCustomSubject] = useState<boolean>(false);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(currentDraft?.educationLevel || 'SMP');
  const [grade, setGrade] = useState<string>(currentDraft?.grade || 'Kelas VIII');
  const [bab, setBab] = useState<string>(currentDraft?.bab || 'Bab 2: Menemukan Pola Pesan dalam Iklan');
  const [pertemuan, setPertemuan] = useState<string>(currentDraft?.pertemuan || 'Pertemuan 1');
  const [title, setTitle] = useState<string>(currentDraft?.rawTopic || 'Konsep Dasar, Ciri, dan Unsur-Unsur Teks Iklan');
  const [institutionName, setInstitutionName] = useState<string>('SMP NEGERI 2 JETIS KABUPATEN MOJOKERTO');
  const [teacherName, setTeacherName] = useState<string>('Amin Wahyudi, S.Pd.');

  // Tujuan Pembelajaran
  const [learningObjectives, setLearningObjectives] = useState<string[]>(
    currentDraft?.learningObjectivesList && currentDraft.learningObjectivesList.length > 0
      ? currentDraft.learningObjectivesList
      : [
          'Peserta didik mampu mengidentifikasi pengertian dan fungsi sosial teks iklan dengan tepat.',
          'Peserta didik mampu membedakan ciri bahasa persuasif pada berbagai jenis iklan di media massa.',
          'Peserta didik mampu menganalisis 4 unsur utama pembentuk iklan yang efektif dan menarik.'
        ]
  );
  const [newObjectiveInput, setNewObjectiveInput] = useState<string>('');
  const [isSuggestingObjectives, setIsSuggestingObjectives] = useState<boolean>(false);

  // Bagian-Bagian Materi Pembelajaran (Dinamis)
  const [sections, setSections] = useState<MateriSection[]>(DEFAULT_SAMPLE_MATERI.sections);

  // Materi Pendukung (Opsional)
  const [supportingItems, setSupportingItems] = useState<SupportingItem[]>(
    DEFAULT_SAMPLE_MATERI.supportingItems || []
  );
  const [showSupportingSection, setShowSupportingSection] = useState<boolean>(true);

  // Rangkuman (Opsional)
  const [includeSummary, setIncludeSummary] = useState<boolean>(true);
  const [summary, setSummary] = useState<string>(DEFAULT_SAMPLE_MATERI.summary || '');
  const [isSynthesizingSummary, setIsSynthesizingSummary] = useState<boolean>(false);

  // Cek Pemahaman (Opsional)
  const [includeUnderstandingCheck, setIncludeUnderstandingCheck] = useState<boolean>(true);
  const [understandingQuestions, setUnderstandingQuestions] = useState<string[]>(
    DEFAULT_SAMPLE_MATERI.understandingCheck || []
  );
  const [newQuestionInput, setNewQuestionInput] = useState<string>('');

  // Catatan Guru (Opsional)
  const [teacherNotes, setTeacherNotes] = useState<string>(
    currentDraft?.userNotes || 'Berikan penekanan pada perbedaan kalimat persuasif iklan komersial dan ajakan sosial iklan layanan masyarakat.'
  );
  const [includeTeacherNotesInDoc, setIncludeTeacherNotesInDoc] = useState<boolean>(false);
  const [includeStudentNotesSheet, setIncludeStudentNotesSheet] = useState<boolean>(false);

  // Konfigurasi Pratinjau Dokumen
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [showKopFormal, setShowKopFormal] = useState<boolean>(true);

  // Status feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);

  const documentPrintRef = useRef<HTMLDivElement>(null);

  // Sinkronisasi dengan currentDraft bila ada perubahan eksternal
  useEffect(() => {
    if (currentDraft) {
      if (currentDraft.subject) setSubject(currentDraft.subject);
      if (currentDraft.educationLevel) setEducationLevel(currentDraft.educationLevel);
      if (currentDraft.grade) setGrade(currentDraft.grade);
      if (currentDraft.rawTopic) setTitle(currentDraft.rawTopic);
      if (currentDraft.bab) setBab(currentDraft.bab);
      if (currentDraft.pertemuan) setPertemuan(currentDraft.pertemuan);
      if (currentDraft.userNotes) setTeacherNotes(currentDraft.userNotes);
    }
  }, [currentDraft]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ============================================================================
  // HANDLERS: TUJUAN PEMBELAJARAN
  // ============================================================================
  const handleAddObjective = () => {
    const trimmed = newObjectiveInput.trim();
    if (!trimmed) return;
    setLearningObjectives(prev => [...prev, trimmed]);
    setNewObjectiveInput('');
  };

  const handleRemoveObjective = (index: number) => {
    if (learningObjectives.length <= 1) {
      showToast('Minimal cantumkan 1 tujuan pembelajaran.');
      return;
    }
    setLearningObjectives(prev => prev.filter((_, i) => i !== index));
  };

  const handleSuggestObjectivesAI = () => {
    setIsSuggestingObjectives(true);
    setTimeout(() => {
      const activeSubj = isCustomSubject ? customSubject : subject;
      const suggestions = suggestLearningObjectives(activeSubj, title, bab || title);
      if (suggestions && suggestions.length > 0) {
        setLearningObjectives(suggestions);
        showToast('✨ 3 Tujuan Pembelajaran berhasil diselaraskan otomatis!');
      }
      setIsSuggestingObjectives(false);
    }, 400);
  };

  // ============================================================================
  // HANDLERS: BAGIAN-BAGIAN MATERI (DINAMIS)
  // ============================================================================
  const handleAddSection = (presetTitle?: string) => {
    const nextIndex = sections.length + 1;
    const letter = String.fromCharCode(64 + nextIndex); // A, B, C, D...
    const newSection: MateriSection = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: presetTitle ? `${letter}. ${presetTitle}` : `${letter}. Bagian Materi Baru`,
      content: ''
    };
    setSections(prev => [...prev, newSection]);
    showToast(`+ Bagian materi "${newSection.title}" ditambahkan.`);
  };

  const handleUpdateSectionTitle = (id: string, newTitle: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleUpdateSectionContent = (id: string, newContent: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s));
  };

  const handleToggleSectionTable = (id: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== id) return s;
      const isCurrentlyTable = !!s.isTable;
      if (!isCurrentlyTable) {
        return {
          ...s,
          isTable: true,
          tableData: {
            headers: ['Aspek / Kategori', 'Penjelasan 1', 'Penjelasan 2'],
            rows: [
              ['Aspek Pertama', 'Uraian detail kolom 1', 'Uraian detail kolom 2'],
              ['Aspek Kedua', 'Uraian detail kolom 1', 'Uraian detail kolom 2']
            ]
          }
        };
      } else {
        return {
          ...s,
          isTable: false
        };
      }
    }));
  };

  const handleDeleteSection = (id: string) => {
    if (sections.length <= 1) {
      showToast('Minimal harus ada 1 bagian materi pembelajaran.');
      return;
    }
    setSections(prev => prev.filter(s => s.id !== id));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    setSections(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIdx];
      copy[newIdx] = temp;
      return copy;
    });
  };

  // ============================================================================
  // HANDLERS: RANGKUMAN & CEK PEMAHAMAN
  // ============================================================================
  const handleSynthesizeSummary = () => {
    setIsSynthesizingSummary(true);
    setTimeout(() => {
      const syn = synthesizeSummaryFromSections(sections, title);
      setSummary(syn);
      setIsSynthesizingSummary(false);
      showToast('⚡ Rangkuman berhasil disintesis murni dari materi Anda!');
    }, 450);
  };

  const handleGenerateQuestions = () => {
    const q = generateUnderstandingQuestionsFromSections(sections, title);
    setUnderstandingQuestions(q);
    showToast('✨ Pertanyaan pemahaman berhasil dirumuskan berdasarkan materi!');
  };

  const handleAddQuestion = () => {
    const trimmed = newQuestionInput.trim();
    if (!trimmed) return;
    setUnderstandingQuestions(prev => [...prev, trimmed]);
    setNewQuestionInput('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setUnderstandingQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  // ============================================================================
  // MUAT CONTOH SAMPEL MATERI
  // ============================================================================
  const handleLoadSampleIklan = () => {
    setSubject(DEFAULT_SAMPLE_MATERI.subject);
    setEducationLevel(DEFAULT_SAMPLE_MATERI.educationLevel);
    setGrade(DEFAULT_SAMPLE_MATERI.grade);
    setBab(DEFAULT_SAMPLE_MATERI.bab);
    setPertemuan(DEFAULT_SAMPLE_MATERI.pertemuan);
    setTitle(DEFAULT_SAMPLE_MATERI.title);
    setTeacherNotes(DEFAULT_SAMPLE_MATERI.teacherNotes || '');
    setLearningObjectives([...DEFAULT_SAMPLE_MATERI.learningObjectives]);
    setSections(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_MATERI.sections)));
    setSupportingItems(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_MATERI.supportingItems || [])));
    setSummary(DEFAULT_SAMPLE_MATERI.summary || '');
    setUnderstandingQuestions([...(DEFAULT_SAMPLE_MATERI.understandingCheck || [])]);
    setIncludeSummary(true);
    setIncludeUnderstandingCheck(true);
    showToast('📄 Contoh Materi Ajar Bahasa Indonesia (Teks Iklan) berhasil dimuat!');
  };

  const handleLoadSampleInformatika = () => {
    setSubject('Informatika');
    setEducationLevel('SMA');
    setGrade('Kelas X');
    setBab('Bab 2: Struktur Data dan Algoritma Graf');
    setPertemuan('Pertemuan 1');
    setTitle('Pemodelan Relasi Informasi Menggunakan Struktur Data Graph');
    setTeacherNotes('Gunakan ilustrasi rute perjalanan Google Maps untuk memudahkan analogi vertex dan edge.');
    setLearningObjectives([
      'Peserta didik mampu memahami definisi vertex dan edge pada struktur graf secara komprehensif.',
      'Peserta didik mampu membedakan graf berarah (directed) dan tidak berarah (undirected) melalui studi kasus.',
      'Peserta didik mampu menganalisis efisiensi representasi graf menggunakan adjacency list dan matrix.'
    ]);
    setSections([
      {
        id: 'inf-1',
        title: 'A. Konsep Dasar Struktur Data Graph',
        content: 'Graph adalah struktur data non-linear yang terdiri atas kumpulan simpul (vertices atau nodes) dan garis penghubung yang merepresentasikan relasi antarsimpul tersebut (edges). Berbeda dengan pohon (tree) yang memiliki struktur hierarkis ketat dengan simpul akar tunggal, graf memungkinkan adanya siklus dan keterhubungan bebas antarsimpul. Karakteristik ini menjadikan graf sebagai instrumen pemodelan paling representatif untuk persoalan jaringan di dunia nyata.'
      },
      {
        id: 'inf-2',
        title: 'B. Terminologi dan Komponen Utama Graf',
        content: 'Dalam membedah arsitektur graf, terdapat beberapa istilah fundamental yang wajib dikuasai:\n1. Vertex (V): Simpul entitas diskret, misalnya nama kota, pengguna media sosial, atau server jaringan.\n2. Edge (E): Garis keterhubungan antara dua simpul. Edge dapat memiliki arah (directed) atau tanpa arah (undirected).\n3. Degree (Derajat): Jumlah sisi yang terhubung ke suatu simpul. Pada graf berarah, degree dibagi menjadi in-degree dan out-degree.\n4. Weight (Bobot): Nilai numerik yang diasosiasikan pada sisi untuk merepresentasikan jarak tempuh, biaya, atau latensi waktu.'
      },
      {
        id: 'inf-3',
        title: 'C. Tabel Perbandingan Struktur Data Pohon vs Graf',
        content: 'Analisis perbedaan karakteristik arsitektural antara pohon (tree) dan graf (graph):',
        isTable: true,
        tableData: {
          headers: ['Aspek Karakteristik', 'Struktur Data Pohon (Tree)', 'Struktur Data Graf (Graph)'],
          rows: [
            ['Bentuk Struktur', 'Hierarkis dengan satu simpul akar (root).', 'Non-hierarkis berbentuk jaringan interkoneksi.'],
            ['Keberadaan Siklus', 'Tidak memiliki siklus tertutup (acyclic).', 'Dapat membentuk siklus (cyclic) maupun tanpa siklus.'],
            ['Arah Hubungan', 'Umumnya terarah dari induk ke anak (parent-child).', 'Dapat berarah (directed) maupun bolak-balik.'],
            ['Penerapan Nyata', 'Struktur folder komputer, skema silsilah keluarga.', 'Peta rute GPS, algoritma rekomendasi pertemanan.']
          ]
        }
      }
    ]);
    setSummary('Graf adalah struktur data non-linear berbasis simpul (vertex) dan relasi penghubung (edge) yang sangat fleksibel untuk memodelkan keterhubungan kompleks dunia nyata, mulai dari rute navigasi terpendek hingga jejaring sosial digital.');
    setUnderstandingQuestions([
      'Jelaskan perbedaan mendasar antara directed graph dan undirected graph menggunakan analogi rute jalan raya satu arah dan dua arah!',
      'Mengapa struktur data graf lebih dipilih dibandingkan array biasa saat memodelkan relasi jaringan internet?'
    ]);
    setIncludeSummary(true);
    setIncludeUnderstandingCheck(true);
    showToast('💻 Contoh Materi Ajar Informatika (Graph) berhasil dimuat!');
  };

  // ============================================================================
  // VALIDASI & GENERATE DOKUMEN MATERI
  // ============================================================================
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const activeSubj = isCustomSubject ? customSubject : subject;

    if (!activeSubj.trim()) errors.subject = 'Mata pelajaran wajib diisi.';
    if (!title.trim()) errors.title = 'Judul materi pembelajaran wajib diisi.';
    if (learningObjectives.length === 0) errors.objectives = 'Minimal cantumkan 1 tujuan pembelajaran.';
    
    // Periksa bahwa minimal ada 1 bagian materi yang memiliki judul dan isi
    const validSections = sections.filter(s => s.title.trim().length > 0 && s.content.trim().length > 0);
    if (validSections.length === 0) {
      errors.sections = 'Minimal 1 bagian materi pembelajaran harus memiliki judul dan isi teks.';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      showToast(`⚠️ Mohon lengkapi: ${errors[firstKey]}`);
      return false;
    }
    return true;
  };

  const handleGenerateDocument = () => {
    if (!validateForm()) return;
    setViewMode('preview');
    showToast('📄 Dokumen Materi Ajar A4 siap cetak berhasil disusun!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================================================
  // AKSI OUTPUT: CETAK, EKSPOR WORD, SALIN TEKS
  // ============================================================================
  const activeSubj = isCustomSubject ? customSubject : subject;
  const currentMateriDoc: MateriDocument = {
    id: `doc-${Date.now()}`,
    subject: activeSubj,
    educationLevel,
    grade,
    bab,
    pertemuan,
    title,
    teacherNotes,
    includeTeacherNotesInDoc,
    learningObjectives,
    sections,
    supportingItems,
    summary,
    includeSummary,
    understandingCheck: understandingQuestions,
    includeUnderstandingCheck,
    includeStudentNotesSheet,
    institutionName,
    teacherName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const estimatedPages = estimateA4PageCount(currentMateriDoc);

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    const res = await exportMateriToDocx(currentMateriDoc);
    setIsExportingDocx(false);
    if (res.success) {
      showToast(`📥 Dokumen Word (${res.filename}) berhasil diunduh!`);
    } else {
      showToast(`⚠️ ${res.error || 'Gagal mengekspor dokumen Word'}`);
    }
  };

  const handleCopyText = () => {
    let fullText = `${currentMateriDoc.title.toUpperCase()}\n`;
    fullText += `Mata Pelajaran: ${currentMateriDoc.subject} | ${currentMateriDoc.educationLevel} (${currentMateriDoc.grade})\n`;
    if (currentMateriDoc.bab) fullText += `Bab/Topik: ${currentMateriDoc.bab}\n`;
    if (currentMateriDoc.pertemuan) fullText += `Pertemuan: ${currentMateriDoc.pertemuan}\n\n`;

    fullText += `TUJUAN PEMBELAJARAN:\n`;
    currentMateriDoc.learningObjectives.forEach((obj, i) => {
      fullText += `${i + 1}. ${obj}\n`;
    });
    fullText += `\n`;

    currentMateriDoc.sections.forEach(sec => {
      fullText += `=== ${sec.title.toUpperCase()} ===\n`;
      fullText += `${sec.content}\n\n`;
      if (sec.isTable && sec.tableData) {
        fullText += `Tabel: ${sec.tableData.headers.join(' | ')}\n`;
        sec.tableData.rows.forEach(r => {
          fullText += `${r.join(' | ')}\n`;
        });
        fullText += `\n`;
      }
    });

    if (currentMateriDoc.includeSummary && currentMateriDoc.summary) {
      fullText += `RANGKUMAN:\n${currentMateriDoc.summary}\n\n`;
    }

    if (currentMateriDoc.includeUnderstandingCheck && currentMateriDoc.understandingCheck) {
      fullText += `CEK PEMAHAMAN:\n`;
      currentMateriDoc.understandingCheck.forEach((q, i) => {
        fullText += `${i + 1}. ${q}\n`;
      });
    }

    navigator.clipboard.writeText(fullText);
    showToast('📋 Seluruh teks materi ajar berhasil disalin ke clipboard!');
  };

  const handleSaveToProjects = () => {
    if (!onSubmitForm) return;
    const draft: InfographicDraft = {
      ...(currentDraft || {
        id: `proj-materi-${Date.now()}`,
        title: title,
        rawTopic: title,
        topic: title,
        subject: activeSubj,
        educationLevel,
        grade,
        bab,
        pertemuan,
        scope: sections.map(s => `${s.title}: ${s.content}`).join('\n\n'),
        userNotes: teacherNotes,
        visualStyle: 'Modern Edukatif',
        visualLevel: 'seimbang',
        format: 'portrait',
        context: 'sehari_hari',
        densityLevel: 'sedang',
        layoutArchetype: 'balanced_grid',
        blocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
      title: title,
      rawTopic: title,
      subject: activeSubj,
      educationLevel,
      grade,
      bab,
      pertemuan,
      userNotes: teacherNotes,
      learningObjectivesList: learningObjectives
    };
    onSubmitForm(draft);
    showToast('💾 Dokumen materi ajar berhasil disimpan ke Proyek STIVIA!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* ====================================================================== */}
      {/* 1. HEADER BANNER UTAMA MENU MATERI */}
      {/* ====================================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Studio Konten • Dokumen Materi Ajar
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>Standar A4 Portrait</span>
                <span>•</span>
                <span>Calibri Light 10pt</span>
                <span>•</span>
                <span>Justify</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Dokumen Materi Pembelajaran Siap Cetak
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl mt-0.5 leading-relaxed">
              Anda memegang kendali penuh atas substansi materi. STIVIA membantu menata, memformat, dan menyusunnya menjadi dokumen akademik A4 yang rapi, profesional, dan siap dicetak.
            </p>
          </div>
        </div>

        {/* Action Button Navigation & Sample Loaders */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {viewMode === 'preview' ? (
            <button
              type="button"
              onClick={() => setViewMode('form')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Kembali ke Editor Form</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleLoadSampleIklan}
                className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
                title="Muat contoh materi teks iklan Bahasa Indonesia"
              >
                <span>Contoh Iklan</span>
              </button>
              <button
                type="button"
                onClick={handleLoadSampleInformatika}
                className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
                title="Muat contoh materi struktur graf Informatika"
              >
                <span>Contoh Graph</span>
              </button>
              <button
                type="button"
                onClick={handleGenerateDocument}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat Dokumen A4</span>
              </button>
            </>
          )}

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 2. MODE FORM INPUT MATERI (FLEKSIBEL & DINAMIS) */}
      {/* ====================================================================== */}
      {viewMode === 'form' && (
        <div className="space-y-6">
          {/* TAB 1: IDENTITAS MATERI AJAR */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                  Identitas Materi Pembelajaran
                </h2>
                <p className="text-[11px] text-slate-500">
                  Data pengenal kurikulum dan judul materi ajar yang akan tercantum pada kop dokumen.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mata Pelajaran */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Mata Pelajaran:</label>
                {!isCustomSubject ? (
                  <div className="space-y-1">
                    <select
                      value={subject}
                      onChange={(e) => {
                        if (e.target.value === 'Lainnya') {
                          setIsCustomSubject(true);
                          setCustomSubject('');
                        } else {
                          setSubject(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                    >
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                      <option value="Matematika">Matematika</option>
                      <option value="IPA (Ilmu Pengetahuan Alam)">IPA (Ilmu Pengetahuan Alam)</option>
                      <option value="IPS (Ilmu Pengetahuan Sosial)">IPS (Ilmu Pengetahuan Sosial)</option>
                      <option value="Informatika">Informatika</option>
                      <option value="Bahasa Inggris">Bahasa Inggris</option>
                      <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                      <option value="Fisika">Fisika</option>
                      <option value="Biologi">Biologi</option>
                      <option value="Kimia">Kimia</option>
                      <option value="Lainnya">+ Tulis Mapel Lainnya...</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Masukkan nama mata pelajaran..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomSubject(false)}
                      className="px-2.5 py-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
                    >
                      Daftar
                    </button>
                  </div>
                )}
                {formErrors.subject && <p className="text-[10px] text-rose-500 font-bold">{formErrors.subject}</p>}
              </div>

              {/* Jenjang & Kelas */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Jenjang:</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                  >
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="SMK">SMK</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Kelas:</label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="misal: Kelas VIII"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Bab / Topik & Pertemuan */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Bab / Topik:</label>
                  <input
                    type="text"
                    value={bab}
                    onChange={(e) => setBab(e.target.value)}
                    placeholder="misal: Bab 2"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Pertemuan:</label>
                  <input
                    type="text"
                    value={pertemuan}
                    onChange={(e) => setPertemuan(e.target.value)}
                    placeholder="misal: Pertemuan 1"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Judul Materi Pembelajaran (Wajib) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Judul Materi Pembelajaran <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">Judul utama pada dokumen cetak</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Konsep Dasar, Ciri, dan Unsur-Unsur Teks Iklan"
                className="w-full px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
              />
              {formErrors.title && <p className="text-[10px] text-rose-500 font-bold">{formErrors.title}</p>}
            </div>

            {/* Nama Sekolah & Pendidik (Untuk Kop Cetak) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600 flex items-center gap-1">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nama Sekolah / Instansi (Kop Dokumen):</span>
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Contoh: SMP NEGERI 2 JETIS KABUPATEN MOJOKERTO"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nama Pendidik / Penyusun:</span>
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Contoh: Amin Wahyudi, S.Pd."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* TAB 2: TUJUAN PEMBELAJARAN (DINAMIS) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Tujuan Pembelajaran / Capaian Kompetensi
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Target capaian yang dicantumkan di bagian awal dokumen materi ajar.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSuggestObjectivesAI}
                disabled={isSuggestingObjectives}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isSuggestingObjectives ? 'Menyelaraskan...' : '✨ Selaraskan dengan AI'}</span>
              </button>
            </div>

            {/* List Tujuan Pembelajaran */}
            <div className="space-y-2">
              {learningObjectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="flex-1 text-xs text-slate-800 leading-relaxed font-sans">
                    {obj}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Hapus tujuan ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input Tambah Tujuan Manual */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newObjectiveInput}
                onChange={(e) => setNewObjectiveInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddObjective();
                  }
                }}
                placeholder="Ketik tujuan pembelajaran baru lalu tekan Tambah..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-4 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
            {formErrors.objectives && <p className="text-[10px] text-rose-500 font-bold">{formErrors.objectives}</p>}
          </div>

          {/* TAB 3: ISI MATERI PEMBELAJARAN (DINAMIS — FITUR UTAMA) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                  C
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Isi Materi Pembelajaran (Bagian Dinamis)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Tidak ada template kaku. Anda bebas menambah, menyusun urutan, mengedit, atau menghapus bagian materi sesuai rancangan Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                  {sections.length} Bagian Materi
                </span>
              </div>
            </div>

            {/* Chip Rekomendasi Judul Bagian Cepat */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <span>+ Rekomendasi Judul Bagian Cepat (Klik untuk menambahkan langsung):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SECTION_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddSection(preset.title)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/60 text-slate-700 hover:text-indigo-800 text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3 text-indigo-600" />
                    <span>{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daftar Bagian Materi (Urutan Dinamis) */}
            <div className="space-y-4">
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 transition-all hover:border-indigo-300"
                >
                  {/* Header Bar Bagian */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                        placeholder="Contoh: A. Pengertian & Hakikat Materi"
                        className="flex-1 font-bold text-xs sm:text-sm text-slate-900 border-b border-dashed border-slate-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5 bg-transparent"
                      />
                    </div>

                    {/* Tombol Urutan (Naik/Turun) & Hapus */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleSectionTable(section.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                          section.isTable 
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-300' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Ubah format bagian ini menjadi tabel terstruktur"
                      >
                        <TableIcon className="w-3 h-3" />
                        <span>{section.isTable ? 'Tabel Aktif' : '+ Tabel'}</span>
                      </button>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, 'up')}
                        className={`p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors ${
                          idx === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        title="Pindah ke atas"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sections.length - 1}
                        onClick={() => handleMoveSection(idx, 'down')}
                        className={`p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors ${
                          idx === sections.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        title="Pindah ke bawah"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus bagian ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Isi Bagian (Textarea / Paragraf) */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">
                      Uraian Materi Bagian Ini (Dapat memuat beberapa paragraf atau poin list):
                    </label>
                    <textarea
                      rows={4}
                      value={section.content}
                      onChange={(e) => handleUpdateSectionContent(section.id, e.target.value)}
                      placeholder="Tuliskan uraian penjelasan materi bagian ini secara lengkap dan jelas..."
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 leading-relaxed font-sans"
                    />
                  </div>

                  {/* Jika bagian ini ditandai sebagai tabel */}
                  {section.isTable && section.tableData && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <TableIcon className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Tabel Materi Pendukung (Menyesuaikan Lebar A4):</span>
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-[11px] border-collapse border border-slate-300 bg-white">
                          <thead>
                            <tr className="bg-slate-100">
                              {section.tableData.headers.map((h, hIdx) => (
                                <th key={hIdx} className="border border-slate-300 p-1.5 text-left font-bold text-slate-800">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.tableData.rows.map((r, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                {r.map((cell, cIdx) => (
                                  <td key={cIdx} className="border border-slate-300 p-1.5 text-slate-700">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tombol Tambah Bagian Kustom Baru */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleAddSection()}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-600 hover:bg-indigo-50/50 text-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Bagian Materi Baru</span>
              </button>
            </div>
            {formErrors.sections && <p className="text-[10px] text-rose-500 font-bold">{formErrors.sections}</p>}
          </div>

          {/* TAB 4: RANGKUMAN & MATERI PENDUKUNG (OPSIONAL) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rangkuman Materi */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                    D
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                    Rangkuman Materi
                  </h3>
                </div>

                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSummary}
                    onChange={(e) => setIncludeSummary(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Sertakan di Dokumen</span>
                </label>
              </div>

              {includeSummary && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Tulis rangkuman sendiri atau sintesis otomatis dari materi Anda:
                    </span>
                    <button
                      type="button"
                      onClick={handleSynthesizeSummary}
                      disabled={isSynthesizingSummary}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isSynthesizingSummary ? 'Menyintesis...' : 'Sintesis dari Materi'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Tulis intisari materi terpenting yang wajib diingat siswa..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 leading-relaxed font-sans"
                  />
                </div>
              )}
            </div>

            {/* Cek Pemahaman & Pertanyaan Diskusi */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                    E
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                    Cek Pemahaman Siswa
                  </h3>
                </div>

                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUnderstandingCheck}
                    onChange={(e) => setIncludeUnderstandingCheck(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Sertakan di Dokumen</span>
                </label>
              </div>

              {includeUnderstandingCheck && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Pertanyaan konseptual berbasis materi yang Anda masukkan:
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateQuestions}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Buat dari Materi</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {understandingQuestions.map((q, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-50 text-[11px] text-slate-800">
                        <span className="font-bold text-indigo-600 shrink-0">{idx + 1}.</span>
                        <span className="flex-1">{q}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newQuestionInput}
                      onChange={(e) => setNewQuestionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddQuestion();
                        }
                      }}
                      placeholder="Tambah pertanyaan manual..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-xs font-bold rounded-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TAB 5: CATATAN GURU & PENGATURAN CETAK */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                F
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Catatan Guru & Opsi Dokumen Cetak
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Catatan Pendidik (Opsional):</label>
                <textarea
                  rows={3}
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="Catatan strategi mengajar, petunjuk bagi siswa, atau catatan internal..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 leading-relaxed font-sans"
                />
              </div>

              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTeacherNotesInDoc}
                    onChange={(e) => setIncludeTeacherNotesInDoc(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Tampilkan Catatan Guru di dalam dokumen materi</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeStudentNotesSheet}
                    onChange={(e) => setIncludeStudentNotesSheet(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Sertakan halaman "Lembar Catatan & Refleksi Siswa" (Garis Kosong)</span>
                </label>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Estimasi panjang cetak: <strong>~{estimatedPages} Halaman A4</strong> (Calibri Light 10pt)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TOMBOL GENERATE DOKUMEN MATERI UTAMA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerateDocument}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all cursor-pointer shadow-lg flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-500/20 active:scale-[0.99]"
            >
              <Eye className="w-5 h-5" />
              <span>SUSUN & TAMPILKAN DOKUMEN MATERI AJAR A4 (SIAP CETAK)</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              ✨ Output berupa dokumen materi ajar profesional siap cetak A4 • Bukan prompt AI
            </p>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 3. MODE PREVIEW DOKUMEN A4 SIAP CETAK (STANDAR AKADEMIK PROFESIONAL) */}
      {/* ====================================================================== */}
      {viewMode === 'preview' && (
        <div className="space-y-6">
          {/* Action Deck Bar Atas */}
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Dokumen Materi Ajar A4 • Siap Digunakan & Siap Cetak</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {title.toUpperCase()}
              </h2>
              <p className="text-xs text-slate-300">
                Format: A4 Portrait • Tipografi: Calibri Light 10pt • Rata Justify • Estimasi: ~{estimatedPages} Halaman
              </p>
            </div>

            {/* Aksi Deck: Cetak, Word, Salin, Edit */}
            <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                title="Buka dialog cetak browser atau simpan sebagai PDF A4"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                <span>Cetak / PDF A4</span>
              </button>

              <button
                type="button"
                onClick={handleExportDocx}
                disabled={isExportingDocx}
                className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                title="Unduh dokumen dalam format Microsoft Word (.docx)"
              >
                <FileDown className="w-4 h-4" />
                <span>{isExportingDocx ? 'Mengekspor...' : 'Unduh Word (.docx)'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                title="Salin seluruh isi teks materi ke clipboard"
              >
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Salin Teks</span>
              </button>

              {onSubmitForm && (
                <button
                  type="button"
                  onClick={handleSaveToProjects}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                  title="Simpan dokumen ke daftar proyek STIVIA"
                >
                  <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Simpan</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setViewMode('form')}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Form</span>
              </button>
            </div>
          </div>

          {/* Pengaturan Tampilan Pratinjau Dokumen */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700">Opsi Pratinjau:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showKopFormal}
                  onChange={(e) => setShowKopFormal(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Tampilkan Kop Lembaga</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Skala Lembar:</span>
              <button
                type="button"
                onClick={() => setZoomScale(75)}
                className={`px-2 py-1 rounded text-[11px] font-bold ${zoomScale === 75 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'}`}
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(100)}
                className={`px-2 py-1 rounded text-[11px] font-bold ${zoomScale === 100 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'}`}
              >
                100% (A4 Nyata)
              </button>
            </div>
          </div>

          {/* ================================================================== */}
          {/* KANVAS LEMBAR DOKUMEN CETAK A4 NYATA (CALIBRI LIGHT, BODY 10PT, JUSTIFY) */}
          {/* ================================================================== */}
          <div className="flex justify-center overflow-x-auto py-4 bg-slate-200/60 rounded-3xl p-3 sm:p-6">
            <div
              id="materi-document-print-area"
              ref={documentPrintRef}
              style={{
                fontFamily: "'Calibri Light', Calibri, 'Segoe UI Light', sans-serif",
                transform: zoomScale === 75 ? 'scale(0.75)' : 'none',
                transformOrigin: 'top center'
              }}
              className="materi-a4-sheet bg-white text-slate-900 shadow-2xl border border-slate-300 w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 space-y-6 leading-relaxed text-justify transition-transform"
            >
              {/* KOP RESMI DOKUMEN PEMBELAJARAN */}
              {showKopFormal && (
                <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
                  <h3 className="text-base sm:text-lg font-black tracking-wide text-slate-900 uppercase">
                    {institutionName || 'INSTITUSI PEMBELAJARAN'}
                  </h3>
                  <p className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                    MODUL & MATERI AJAR KURIKULUM BERKELANJUTAN
                  </p>
                  <p className="text-[10pt] text-slate-500">
                    Tahun Ajaran Aktif • Dokumen Sumber Belajar Terstruktur Pendidik
                  </p>
                  <div className="w-full h-0.5 bg-slate-900 mt-2" />
                  <div className="w-full h-[1px] bg-slate-900 -mt-1" />
                </div>
              )}

              {/* JUDUL MATERI AJAR */}
              <div className="text-center space-y-1 pt-1">
                <span className="text-[10pt] font-extrabold tracking-widest text-slate-600 uppercase">
                  DOKUMEN MATERI PEMBELAJARAN
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {title.toUpperCase()}
                </h1>
              </div>

              {/* TABEL IDENTITAS META (MAPEL, KELAS, BAB, PERTEMUAN) */}
              <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/70 text-[10pt] space-y-1.5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-800">Mata Pelajaran:</span> {activeSubj}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Bab / Topik:</span> {bab || '-'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-800">Jenjang / Kelas:</span> {educationLevel} ({grade})
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Alokasi Pertemuan:</span> {pertemuan || '1 Pertemuan'}
                  </div>
                </div>
                {teacherName && (
                  <div className="pt-1 border-t border-slate-200 text-slate-600">
                    <span className="font-bold text-slate-800">Pendidik Pengampu:</span> {teacherName}
                  </div>
                )}
              </div>

              {/* TUJUAN PEMBELAJARAN (CAPAIAN KOMPETENSI) */}
              {learningObjectives && learningObjectives.length > 0 && (
                <div className="space-y-2 border-l-4 border-slate-800 pl-4 py-1">
                  <h2 className="text-[11pt] font-black text-slate-900 uppercase tracking-wide">
                    I. TUJUAN PEMBELAJARAN (CAPAIAN KOMPETENSI)
                  </h2>
                  <ol className="list-decimal list-inside space-y-1 text-[10pt] text-slate-800 leading-relaxed">
                    {learningObjectives.map((obj, i) => (
                      <li key={i} className="pl-1">
                        {obj.replace(/^[-*•\d\.\)]+\s*/, '')}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* BAGIAN-BAGIAN MATERI UTAMA (DINAMIS DARI INPUT GURU) */}
              <div className="space-y-6 pt-2">
                {sections.map((section, idx) => (
                  <div key={section.id} className="space-y-2.5 break-inside-avoid">
                    {/* Judul Bagian */}
                    <h2 className="text-[11pt] font-black text-slate-900 tracking-tight pb-1 border-b border-slate-200">
                      {section.title}
                    </h2>

                    {/* Paragraf Isi Bagian (Calibri Light 10pt Justify) */}
                    <div className="space-y-2 text-[10pt] text-slate-900 text-justify leading-[1.6]">
                      {section.content.split('\n').map((paragraph, pIdx) => {
                        const trimmed = paragraph.trim();
                        if (!trimmed) return null;
                        return (
                          <p key={pIdx}>
                            {trimmed}
                          </p>
                        );
                      })}
                    </div>

                    {/* Jika Bagian Berupa Tabel */}
                    {section.isTable && section.tableData && (
                      <div className="pt-1 overflow-x-auto">
                        <table className="w-full text-[10pt] border-collapse border border-slate-400 my-2">
                          <thead>
                            <tr className="bg-slate-100">
                              {section.tableData.headers.map((h, hIdx) => (
                                <th key={hIdx} className="border border-slate-400 p-2 font-black text-slate-900 text-left">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="border border-slate-400 p-2 text-slate-800 align-top">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* MATERI PENDUKUNG (OPSIONAL) */}
              {supportingItems && supportingItems.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-200 break-inside-avoid">
                  <h2 className="text-[11pt] font-black text-slate-900 uppercase tracking-wide">
                    MATERI PENDUKUNG & INFORMASI PENGAYAAN
                  </h2>
                  <div className="grid grid-cols-1 gap-2.5">
                    {supportingItems.map((item) => (
                      <div key={item.id} className="p-3 rounded-lg border border-slate-300 bg-slate-50/60 text-[10pt] space-y-1">
                        <span className="font-bold text-slate-900 block">{item.title}</span>
                        <p className="text-slate-800 leading-relaxed">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RANGKUMAN MATERI (OPSIONAL) */}
              {includeSummary && summary && (
                <div className="p-4 rounded-xl border border-slate-400 bg-slate-50/80 space-y-2 break-inside-avoid">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-slate-700" />
                    <h3 className="text-[11pt] font-black text-slate-900 uppercase tracking-wide">
                      RANGKUMAN MATERI (INTISARI KUNCI)
                    </h3>
                  </div>
                  <p className="text-[10pt] text-slate-900 italic leading-relaxed text-justify">
                    "{summary}"
                  </p>
                </div>
              )}

              {/* CEK PEMAHAMAN & PERTANYAAN DISKUSI (OPSIONAL) */}
              {includeUnderstandingCheck && understandingQuestions && understandingQuestions.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-300 break-inside-avoid">
                  <h3 className="text-[11pt] font-black text-slate-900 uppercase tracking-wide">
                    CEK PEMAHAMAN & LATIHAN SISWA
                  </h3>
                  <div className="space-y-3 text-[10pt]">
                    {understandingQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-1.5">
                        <p className="font-bold text-slate-900">
                          {qIdx + 1}. {q}
                        </p>
                        {/* Ruang jawaban siswa */}
                        <div className="space-y-2 pt-1 pb-2">
                          <div className="w-full border-b border-dashed border-slate-300 h-4" />
                          <div className="w-full border-b border-dashed border-slate-300 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CATATAN PENDIDIK (JIKA DISETUJUI TAMPIL) */}
              {includeTeacherNotesInDoc && teacherNotes && (
                <div className="p-3 rounded-lg border border-slate-300 bg-slate-50 text-[9.5pt] text-slate-700 italic break-inside-avoid">
                  <strong className="not-italic text-slate-900">Catatan Pendidik:</strong> {teacherNotes}
                </div>
              )}

              {/* LEMBAR CATATAN SISWA (JIKA DIPILIH) */}
              {includeStudentNotesSheet && (
                <div className="pt-8 border-t-2 border-slate-800 space-y-3 break-before-page">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-300">
                    <h3 className="text-[11pt] font-black text-slate-900 uppercase tracking-wide">
                      LEMBAR CATATAN REFLEKSI SISWA
                    </h3>
                    <span className="text-[9pt] text-slate-500">Nama Siswa: ______________________</span>
                  </div>
                  <div className="space-y-4 pt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(line => (
                      <div key={line} className="w-full border-b border-dashed border-slate-300 h-5" />
                    ))}
                  </div>
                </div>
              )}

              {/* RUNNING FOOTER DOKUMEN CETAK */}
              <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-[9pt] text-slate-500">
                <span>STIVIA Academic Document • Materi Pembelajaran Siap Cetak</span>
                <span>Halaman 1 dari {estimatedPages}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 4. TOAST NOTIFIKASI */}
      {/* ====================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
