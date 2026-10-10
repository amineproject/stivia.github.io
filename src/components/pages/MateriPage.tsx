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
  Maximize2,
  Coins,
  MessageCircle,
  Loader2
} from 'lucide-react';
import {
  EducationLevel,
  InfographicDraft,
  NavigationTab,
  SubscriptionSummary,
  PROMPT_PACKAGES,
  MateriProductContext
} from '../../types';
import {
  MateriDocument,
  MateriSection,
  SupportingItem,
  ReadingModelText,
  ConceptMisconception,
  GlossaryEntry,
  DEFAULT_SAMPLE_MATERI,
  DEFAULT_SAMPLE_INFORMATIKA,
  SUGGESTED_SECTION_PRESETS,
  generateDeepAcademicMaterial,
  synthesizeSummaryFromSections,
  generateUnderstandingQuestionsFromSections,
  estimateA4PageCount,
  exportMateriToDocx
} from '../../services/materiDocumentEngine';
import { suggestLearningObjectives } from '../../services/stiviaThinkingFramework';
import { checkCanGenerate, recordGenerateUsage } from '../../services/subscriptionService';
import { getWhatsAppTopUpUrl } from '../../lib/whatsapp';
import {
  generateSectionsFromCakupan,
  synthesizeDeepMateriDocumentFromContext,
  isMateriContextOutdated
} from '../../services/productContextAdapter';
import {
  ProductDataSourceSelector,
  ProductDataSourceMode
} from '../ProductDataSourceSelector';
import {
  LearningProject,
  ActiveLearningContext,
  ClassSubjectNode,
  ChapterNode,
  MeetingSession
} from '../../types';

interface MateriPageProps {
  onNavigate?: (tab: NavigationTab) => void;
  currentDraft?: InfographicDraft;
  userId?: string;
  subscriptionSummary?: SubscriptionSummary | null;
  onUsageRecorded?: () => void;
  onSubmitForm?: (draft: InfographicDraft) => void;
  materiContext?: MateriProductContext | null;
  onRefreshFromMasterContext?: () => void;
  learningProjects?: LearningProject[];
  activeLearningContext?: ActiveLearningContext;
  onSelectMeetingContext?: (
    project: LearningProject,
    classSubject: ClassSubjectNode,
    chapter: ChapterNode,
    meeting: MeetingSession
  ) => void;
}

export const MateriPage: React.FC<MateriPageProps> = ({
  onNavigate,
  currentDraft,
  userId,
  subscriptionSummary,
  onUsageRecorded,
  onSubmitForm,
  materiContext,
  onRefreshFromMasterContext,
  learningProjects = [],
  activeLearningContext,
  onSelectMeetingContext
}) => {
  // Pilihan Sumber Data: 'project' (Gunakan Proyek Saya) atau 'manual' (Buat Secara Manual)
  const [sourceMode, setSourceMode] = useState<ProductDataSourceMode>(() => {
    return materiContext ? 'project' : (learningProjects.length > 0 ? 'project' : 'manual');
  });

  // Mode Tampilan: 'form' (Perancangan) atau 'preview' (Dokumen A4 Siap Cetak)
  const [viewMode, setViewMode] = useState<'form' | 'preview'>('form');

  // Tracking Provenance Master Context
  const [docMasterVersion, setDocMasterVersion] = useState<number>(() => materiContext?.sourceMasterVersion || 1);
  const [docMeetingId, setDocMeetingId] = useState<string>(() => materiContext?.sourceMeetingId || '');

  // ============================================================================
  // FORM STATE: DOKUMEN MATERI (PRE-FILLED DARI MASTER CONTEXT JIKA TERSEDIA)
  // ============================================================================
  const [subject, setSubject] = useState<string>(
    materiContext?.subject || currentDraft?.subject || 'Bahasa Indonesia'
  );
  const [customSubject, setCustomSubject] = useState<string>('');
  const [isCustomSubject, setIsCustomSubject] = useState<boolean>(false);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    materiContext?.educationLevel || currentDraft?.educationLevel || 'SMP'
  );
  const [grade, setGrade] = useState<string>(
    materiContext?.grade || currentDraft?.grade || 'Kelas VIII'
  );
  const [bab, setBab] = useState<string>(
    materiContext?.bab || currentDraft?.bab || 'Bab 2: Menemukan Pola Pesan dalam Iklan'
  );
  const [pertemuan, setPertemuan] = useState<string>(
    materiContext?.pertemuan || currentDraft?.pertemuan || 'Pertemuan 1'
  );
  const [title, setTitle] = useState<string>(
    materiContext?.materiDiajarkan || currentDraft?.rawTopic || 'Konsep Dasar, Ciri, dan Unsur-Unsur Teks Iklan'
  );
  const [institutionName, setInstitutionName] = useState<string>(
    materiContext?.schoolName || 'SMP NEGERI 2 JETIS KABUPATEN MOJOKERTO'
  );
  const [teacherName, setTeacherName] = useState<string>(
    materiContext?.teacherName || 'Amin Wahyudi, S.Pd.'
  );

  // Tujuan Pembelajaran
  const [learningObjectives, setLearningObjectives] = useState<string[]>(() => {
    if (materiContext?.learningObjectives && materiContext.learningObjectives.length > 0) {
      return materiContext.learningObjectives;
    }
    if (currentDraft?.learningObjectivesList && currentDraft.learningObjectivesList.length > 0) {
      return currentDraft.learningObjectivesList;
    }
    return [
      'Peserta didik mampu mengidentifikasi pengertian dan fungsi sosial teks iklan dengan tepat.',
      'Peserta didik mampu membedakan ciri bahasa persuasif pada berbagai jenis iklan di media massa.',
      'Peserta didik mampu menganalisis 4 unsur utama pembentuk iklan yang efektif dan menarik.'
    ];
  });
  const [newObjectiveInput, setNewObjectiveInput] = useState<string>('');
  const [isSuggestingObjectives, setIsSuggestingObjectives] = useState<boolean>(false);

  // Apersepsi & Pertanyaan Pemantik Kontekstual
  const [apersepsi, setApersepsi] = useState<string>(() => DEFAULT_SAMPLE_MATERI.apersepsi || '');
  const [includeApersepsi, setIncludeApersepsi] = useState<boolean>(true);

  // Bagian-Bagian Materi Pembelajaran (Dinamis dari Cakupan Materi jika ada)
  const [sections, setSections] = useState<MateriSection[]>(() => {
    if (materiContext?.cakupanMateri) {
      return generateSectionsFromCakupan(materiContext.cakupanMateri, materiContext.materiDiajarkan, materiContext.subject);
    }
    return DEFAULT_SAMPLE_MATERI.sections;
  });

  // Model Teks Wacana Bacaan Pendukung Lengkap
  const [supportingReadingText, setSupportingReadingText] = useState<ReadingModelText>(
    () => DEFAULT_SAMPLE_MATERI.supportingReadingText || {
      title: 'Model Wacana Telaah',
      category: 'Wacana Otentik',
      content: '',
      analysisNotes: ''
    }
  );
  const [includeSupportingReadingText, setIncludeSupportingReadingText] = useState<boolean>(true);

  // Antisipasi Miskonsepsi Siswa & Fakta Ilmiah
  const [misconceptions, setMisconceptions] = useState<ConceptMisconception[]>(
    () => DEFAULT_SAMPLE_MATERI.misconceptions || []
  );
  const [includeMisconceptions, setIncludeMisconceptions] = useState<boolean>(true);
  const [newMisconceptionInput, setNewMisconceptionInput] = useState<string>('');
  const [newClarificationInput, setNewClarificationInput] = useState<string>('');

  // Glosarium Istilah Kunci
  const [glosarium, setGlosarium] = useState<GlossaryEntry[]>(
    () => DEFAULT_SAMPLE_MATERI.glosarium || []
  );
  const [includeGlosarium, setIncludeGlosarium] = useState<boolean>(true);
  const [newTermInput, setNewTermInput] = useState<string>('');
  const [newDefInput, setNewDefInput] = useState<string>('');

  // Materi Pendukung (Opsional)
  const [supportingItems, setSupportingItems] = useState<SupportingItem[]>(
    DEFAULT_SAMPLE_MATERI.supportingItems || []
  );
  const [showSupportingSection, setShowSupportingSection] = useState<boolean>(false);

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

  // Referensi & Sumber Rujukan Resmi
  const [references, setReferences] = useState<string[]>(
    () => DEFAULT_SAMPLE_MATERI.references || []
  );
  const [includeReferences, setIncludeReferences] = useState<boolean>(true);
  const [newReferenceInput, setNewReferenceInput] = useState<string>('');

  // Catatan Guru (Opsional)
  const [teacherNotes, setTeacherNotes] = useState<string>(
    materiContext?.userNotes ||
    currentDraft?.userNotes ||
    'Berikan penekanan pada perbedaan kalimat persuasif iklan komersial dan ajakan sosial iklan layanan masyarakat.'
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

  // Status Eksekusi Saldo & Limit Koin STIVIA
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [limitReason, setLimitReason] = useState<string>('');

  const documentPrintRef = useRef<HTMLDivElement>(null);

  // Sinkronisasi data ketika materiContext berubah (misal berpindah pertemuan atau master context diupdate)
  useEffect(() => {
    if (materiContext) {
      setSubject(materiContext.subject);
      setEducationLevel(materiContext.educationLevel);
      setGrade(materiContext.grade);
      setBab(materiContext.bab);
      setPertemuan(materiContext.pertemuan);
      setTitle(materiContext.materiDiajarkan);
      if (materiContext.schoolName) setInstitutionName(materiContext.schoolName);
      if (materiContext.teacherName) setTeacherName(materiContext.teacherName);
      if (materiContext.learningObjectives && materiContext.learningObjectives.length > 0) {
        setLearningObjectives(materiContext.learningObjectives);
      }
      if (materiContext.userNotes) {
        setTeacherNotes(materiContext.userNotes);
      }

      // Jika pertemuan berganti secara eksplisit, susun materi mendalam otomatis
      if (materiContext.sourceMeetingId !== docMeetingId) {
        setDocMeetingId(materiContext.sourceMeetingId);
        setDocMasterVersion(materiContext.sourceMasterVersion);
        const autoDoc = synthesizeDeepMateriDocumentFromContext(materiContext);
        setApersepsi(autoDoc.apersepsi || '');
        setSections(autoDoc.sections);
        if (autoDoc.supportingReadingText) setSupportingReadingText(autoDoc.supportingReadingText);
        if (autoDoc.misconceptions && autoDoc.misconceptions.length > 0) setMisconceptions(autoDoc.misconceptions);
        if (autoDoc.glosarium && autoDoc.glosarium.length > 0) setGlosarium(autoDoc.glosarium);
        if (autoDoc.summary) setSummary(autoDoc.summary);
        if (autoDoc.understandingCheck && autoDoc.understandingCheck.length > 0) setUnderstandingQuestions(autoDoc.understandingCheck);
        if (autoDoc.references && autoDoc.references.length > 0) setReferences(autoDoc.references);
      }
    } else if (currentDraft) {
      // Fallback Legacy Mode (jika tidak ada active meeting context)
      if (currentDraft.subject) setSubject(currentDraft.subject);
      if (currentDraft.educationLevel) setEducationLevel(currentDraft.educationLevel);
      if (currentDraft.grade) setGrade(currentDraft.grade);
      if (currentDraft.rawTopic) setTitle(currentDraft.rawTopic);
      if (currentDraft.bab) setBab(currentDraft.bab);
      if (currentDraft.pertemuan) setPertemuan(currentDraft.pertemuan);
      if (currentDraft.userNotes) setTeacherNotes(currentDraft.userNotes);
    }
  }, [
    materiContext?.sourceMeetingId, 
    materiContext?.sourceMasterVersion,
    materiContext?.materiDiajarkan,
    materiContext?.cakupanMateri,
    currentDraft
  ]);

  // Handler sinkronisasi ulang eksplisit dari Master Context terbaru (Deep Learning Engine)
  const handleSyncToLatestMasterContext = () => {
    if (!materiContext) return;
    setTitle(materiContext.materiDiajarkan);
    setBab(materiContext.bab);
    setSubject(materiContext.subject);
    setGrade(materiContext.grade);
    setEducationLevel(materiContext.educationLevel);
    setPertemuan(materiContext.pertemuan);
    if (materiContext.schoolName) setInstitutionName(materiContext.schoolName);
    if (materiContext.teacherName) setTeacherName(materiContext.teacherName);
    if (materiContext.learningObjectives && materiContext.learningObjectives.length > 0) {
      setLearningObjectives(materiContext.learningObjectives);
    }
    if (materiContext.userNotes) {
      setTeacherNotes(materiContext.userNotes);
    }

    const autoDoc = synthesizeDeepMateriDocumentFromContext(materiContext);
    setApersepsi(autoDoc.apersepsi || '');
    setSections(autoDoc.sections);
    if (autoDoc.supportingReadingText) setSupportingReadingText(autoDoc.supportingReadingText);
    if (autoDoc.misconceptions && autoDoc.misconceptions.length > 0) setMisconceptions(autoDoc.misconceptions);
    if (autoDoc.glosarium && autoDoc.glosarium.length > 0) setGlosarium(autoDoc.glosarium);
    if (autoDoc.summary) setSummary(autoDoc.summary);
    if (autoDoc.understandingCheck && autoDoc.understandingCheck.length > 0) setUnderstandingQuestions(autoDoc.understandingCheck);
    if (autoDoc.references && autoDoc.references.length > 0) setReferences(autoDoc.references);

    setDocMasterVersion(materiContext.sourceMasterVersion);
    setDocMeetingId(materiContext.sourceMeetingId);
    showToast(`Dokumen materi telah diselaraskan & disusun mendalam dari Master Context v${materiContext.sourceMasterVersion}!`);
  };

  const isOutdated = Boolean(
    materiContext && isMateriContextOutdated(docMasterVersion, materiContext.sourceMasterVersion)
  );

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
  // HANDLERS KHUSUS DEEP LEARNING MATERIAL ENGINE
  // ============================================================================
  const handleSynthesizeDeepMaterial = () => {
    const activeSubj = isCustomSubject ? customSubject : subject;
    const doc = generateDeepAcademicMaterial({
      subject: activeSubj,
      topic: title.trim(),
      educationLevel,
      grade,
      bab,
      pertemuan,
      cakupanMateri: materiContext?.cakupanMateri || '',
      learningObjectives,
      userNotes: teacherNotes,
      schoolName: institutionName,
      teacherName: teacherName,
      sourceMeetingId: materiContext?.sourceMeetingId || docMeetingId,
      sourceMasterVersion: materiContext?.sourceMasterVersion || docMasterVersion
    });

    setApersepsi(doc.apersepsi || '');
    setIncludeApersepsi(true);
    setSections(doc.sections);
    if (doc.supportingReadingText) {
      setSupportingReadingText(doc.supportingReadingText);
      setIncludeSupportingReadingText(true);
    }
    if (doc.misconceptions && doc.misconceptions.length > 0) {
      setMisconceptions(doc.misconceptions);
      setIncludeMisconceptions(true);
    }
    if (doc.glosarium && doc.glosarium.length > 0) {
      setGlosarium(doc.glosarium);
      setIncludeGlosarium(true);
    }
    if (doc.summary) {
      setSummary(doc.summary);
      setIncludeSummary(true);
    }
    if (doc.understandingCheck && doc.understandingCheck.length > 0) {
      setUnderstandingQuestions(doc.understandingCheck);
      setIncludeUnderstandingCheck(true);
    }
    if (doc.references && doc.references.length > 0) {
      setReferences(doc.references);
      setIncludeReferences(true);
    }

    showToast('✨ Dokumen bahan ajar mendalam, model wacana, miskonsepsi, & referensi berhasil disusun!');
  };

  // Handlers CRUD Miskonsepsi
  const handleAddMisconception = () => {
    if (!newMisconceptionInput.trim() || !newClarificationInput.trim()) {
      showToast('⚠️ Mohon isi kekeliruan siswa dan klarifikasi fakta ilmiah.');
      return;
    }
    setMisconceptions(prev => [
      ...prev,
      {
        misconception: newMisconceptionInput.trim(),
        clarification: newClarificationInput.trim()
      }
    ]);
    setNewMisconceptionInput('');
    setNewClarificationInput('');
    showToast('Miskonsepsi baru berhasil ditambahkan.');
  };

  const handleRemoveMisconception = (idx: number) => {
    setMisconceptions(prev => prev.filter((_, i) => i !== idx));
  };

  // Handlers CRUD Glosarium
  const handleAddGlossary = () => {
    if (!newTermInput.trim() || !newDefInput.trim()) {
      showToast('⚠️ Mohon isi nama istilah dan definisinya.');
      return;
    }
    setGlosarium(prev => [
      ...prev,
      {
        term: newTermInput.trim(),
        definition: newDefInput.trim()
      }
    ]);
    setNewTermInput('');
    setNewDefInput('');
    showToast('Istilah glosarium baru berhasil ditambahkan.');
  };

  const handleRemoveGlossary = (idx: number) => {
    setGlosarium(prev => prev.filter((_, i) => i !== idx));
  };

  // Handlers CRUD Referensi
  const handleAddReference = () => {
    if (!newReferenceInput.trim()) return;
    setReferences(prev => [...prev, newReferenceInput.trim()]);
    setNewReferenceInput('');
    showToast('Referensi baru berhasil ditambahkan.');
  };

  const handleRemoveReference = (idx: number) => {
    setReferences(prev => prev.filter((_, i) => i !== idx));
  };

  // ============================================================================
  // MUAT CONTOH SAMPEL MATERI LENGKAP & MENDALAM
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
    setApersepsi(DEFAULT_SAMPLE_MATERI.apersepsi || '');
    setIncludeApersepsi(true);
    setSections(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_MATERI.sections)));
    if (DEFAULT_SAMPLE_MATERI.supportingReadingText) {
      setSupportingReadingText(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_MATERI.supportingReadingText)));
      setIncludeSupportingReadingText(true);
    }
    if (DEFAULT_SAMPLE_MATERI.misconceptions) {
      setMisconceptions(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_MATERI.misconceptions)));
      setIncludeMisconceptions(true);
    }
    if (DEFAULT_SAMPLE_MATERI.glosarium) {
      setGlosarium(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_MATERI.glosarium)));
      setIncludeGlosarium(true);
    }
    setSummary(DEFAULT_SAMPLE_MATERI.summary || '');
    setUnderstandingQuestions([...(DEFAULT_SAMPLE_MATERI.understandingCheck || [])]);
    if (DEFAULT_SAMPLE_MATERI.references) {
      setReferences([...DEFAULT_SAMPLE_MATERI.references]);
      setIncludeReferences(true);
    }
    setIncludeSummary(true);
    setIncludeUnderstandingCheck(true);
    showToast('📄 Contoh Bahan Ajar Bahasa Indonesia (Teks Iklan) berhasil dimuat!');
  };

  const handleLoadSampleInformatika = () => {
    setSubject(DEFAULT_SAMPLE_INFORMATIKA.subject);
    setEducationLevel(DEFAULT_SAMPLE_INFORMATIKA.educationLevel);
    setGrade(DEFAULT_SAMPLE_INFORMATIKA.grade);
    setBab(DEFAULT_SAMPLE_INFORMATIKA.bab);
    setPertemuan(DEFAULT_SAMPLE_INFORMATIKA.pertemuan);
    setTitle(DEFAULT_SAMPLE_INFORMATIKA.title);
    setTeacherNotes(DEFAULT_SAMPLE_INFORMATIKA.teacherNotes || '');
    setLearningObjectives([...DEFAULT_SAMPLE_INFORMATIKA.learningObjectives]);
    setApersepsi(DEFAULT_SAMPLE_INFORMATIKA.apersepsi || '');
    setIncludeApersepsi(true);
    setSections(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_INFORMATIKA.sections)));
    if (DEFAULT_SAMPLE_INFORMATIKA.supportingReadingText) {
      setSupportingReadingText(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_INFORMATIKA.supportingReadingText)));
      setIncludeSupportingReadingText(true);
    }
    if (DEFAULT_SAMPLE_INFORMATIKA.misconceptions) {
      setMisconceptions(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_INFORMATIKA.misconceptions)));
      setIncludeMisconceptions(true);
    }
    if (DEFAULT_SAMPLE_INFORMATIKA.glosarium) {
      setGlosarium(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_INFORMATIKA.glosarium)));
      setIncludeGlosarium(true);
    }
    setSummary(DEFAULT_SAMPLE_INFORMATIKA.summary || '');
    setUnderstandingQuestions([...(DEFAULT_SAMPLE_INFORMATIKA.understandingCheck || [])]);
    if (DEFAULT_SAMPLE_INFORMATIKA.references) {
      setReferences([...DEFAULT_SAMPLE_INFORMATIKA.references]);
      setIncludeReferences(true);
    }
    setIncludeSummary(true);
    setIncludeUnderstandingCheck(true);
    showToast('💻 Contoh Bahan Ajar Informatika (Graph) berhasil dimuat!');
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

  const handleGenerateDocument = async () => {
    if (isGenerating) return;
    if (!validateForm()) return;

    // 1. Pengecekan limit & saldo STIVIA via subscriptionService (Biaya: 2 Saldo Prompt untuk Materi)
    if (userId) {
      const check = await checkCanGenerate(userId, 'material', 2);
      if (!check.allowed) {
        setLimitReason(
          check.reason ||
          'Saldo kuota koin/prompt akun Anda tidak mencukupi untuk menyusun dokumen materi pembelajaran (Kebutuhan: 2 Saldo Prompt).'
        );
        setShowLimitModal(true);
        return;
      }
    }

    setIsGenerating(true);

    try {
      const activeSubj = isCustomSubject ? customSubject : subject;

      // Jika bagian materi masih berupa placeholder 1 baris atau belum diperkaya, perkaya secara otomatis dengan Deep Engine
      const isSkeletal = sections.some(s => s.content.includes('Pendidik dapat menjabarkan penjelasan konseptual') || s.content.length < 80);
      if (isSkeletal || !apersepsi || !supportingReadingText.content) {
        const enriched = generateDeepAcademicMaterial({
          subject: activeSubj,
          topic: title.trim(),
          educationLevel,
          grade,
          bab: bab.trim(),
          pertemuan: pertemuan.trim(),
          cakupanMateri: materiContext?.cakupanMateri || '',
          learningObjectives,
          userNotes: teacherNotes,
          schoolName: institutionName,
          teacherName: teacherName,
          sourceMeetingId: materiContext?.sourceMeetingId || docMeetingId,
          sourceMasterVersion: materiContext?.sourceMasterVersion || docMasterVersion
        });
        if (isSkeletal) setSections(enriched.sections);
        if (!apersepsi && enriched.apersepsi) setApersepsi(enriched.apersepsi);
        if (!supportingReadingText.content && enriched.supportingReadingText) setSupportingReadingText(enriched.supportingReadingText);
        if (misconceptions.length === 0 && enriched.misconceptions) setMisconceptions(enriched.misconceptions);
        if (glosarium.length === 0 && enriched.glosarium) setGlosarium(enriched.glosarium);
        if (!summary && enriched.summary) setSummary(enriched.summary);
        if (references.length === 0 && enriched.references) setReferences(enriched.references);
      }

      // 2. Konsumsi saldo (Biaya: 2 Saldo Prompt) secara atomik di Supabase (Admin otomatis bypass unlimited)
      if (userId) {
        const usageSuccess = await recordGenerateUsage(userId, 'material', 2);
        if (!usageSuccess) {
          throw new Error('Gagal memverifikasi pemotongan saldo generate materi.');
        }
        if (onUsageRecorded) {
          onUsageRecorded();
        }
      }

      setHasGenerated(true);
      setViewMode('preview');
      showToast('📄 Dokumen Bahan Ajar Mendalam Siap Cetak berhasil disusun!');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Sinkronkan ke parent jika ada onSubmitForm
      if (onSubmitForm) {
        onSubmitForm({
          ...currentDraft,
          educationLevel,
          grade,
          subject: activeSubj,
          title: title.trim(),
          rawTopic: title.trim(),
          bab: bab.trim(),
          pertemuan: pertemuan.trim(),
          userNotes: teacherNotes.trim(),
          learningObjectivesList: learningObjectives,
          updatedAt: new Date().toISOString().split('T')[0],
        });
      }
    } catch (err: any) {
      console.error('[Menu Materi Generate Error]', err);
      setLimitReason(
        err?.message ||
        'Gagal memproses kuota saldo prompt di server. Dokumen materi ajar belum dapat ditampilkan.'
      );
      setShowLimitModal(true);
    } finally {
      setIsGenerating(false);
    }
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
    apersepsi,
    includeApersepsi,
    teacherNotes,
    includeTeacherNotesInDoc,
    learningObjectives,
    sections,
    supportingReadingText,
    includeSupportingReadingText,
    misconceptions,
    includeMisconceptions,
    glosarium,
    includeGlosarium,
    supportingItems,
    summary,
    includeSummary,
    understandingCheck: understandingQuestions,
    includeUnderstandingCheck,
    includeStudentNotesSheet,
    references,
    includeReferences,
    institutionName,
    teacherName,
    sourceMeetingId: materiContext?.sourceMeetingId || docMeetingId,
    sourceMasterVersion: materiContext?.sourceMasterVersion || docMasterVersion,
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

    if (currentMateriDoc.includeApersepsi && currentMateriDoc.apersepsi) {
      fullText += `APERSEPSI & PERTANYAAN PEMANTIK:\n"${currentMateriDoc.apersepsi}"\n\n`;
    }

    fullText += `TUJUAN PEMBELAJARAN (CAPAIAN KOMPETENSI):\n`;
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

    if (currentMateriDoc.includeSupportingReadingText && currentMateriDoc.supportingReadingText?.content) {
      fullText += `=== MODEL WACANA TELAAH: ${currentMateriDoc.supportingReadingText.title.toUpperCase()} ===\n`;
      fullText += `${currentMateriDoc.supportingReadingText.content}\n\n`;
      if (currentMateriDoc.supportingReadingText.analysisNotes) {
        fullText += `Catatan Analisis Pendidik: ${currentMateriDoc.supportingReadingText.analysisNotes}\n\n`;
      }
    }

    if (currentMateriDoc.includeMisconceptions && currentMateriDoc.misconceptions && currentMateriDoc.misconceptions.length > 0) {
      fullText += `=== ANTISIPASI MISKONSEPSI SISWA & FAKTA ILMIAH ===\n`;
      currentMateriDoc.misconceptions.forEach((m, i) => {
        fullText += `${i + 1}. Kekeliruan: ${m.misconception}\n   Fakta Benar: ${m.clarification}\n`;
      });
      fullText += `\n`;
    }

    if (currentMateriDoc.includeGlosarium && currentMateriDoc.glosarium && currentMateriDoc.glosarium.length > 0) {
      fullText += `=== GLOSARIUM ISTILAH KUNCI ===\n`;
      currentMateriDoc.glosarium.forEach(g => {
        fullText += `• ${g.term}: ${g.definition}\n`;
      });
      fullText += `\n`;
    }

    if (currentMateriDoc.includeSummary && currentMateriDoc.summary) {
      fullText += `RANGKUMAN MATERI:\n${currentMateriDoc.summary}\n\n`;
    }

    if (currentMateriDoc.includeUnderstandingCheck && currentMateriDoc.understandingCheck) {
      fullText += `CEK PEMAHAMAN & LATIHAN SISWA (HOTS):\n`;
      currentMateriDoc.understandingCheck.forEach((q, i) => {
        fullText += `${i + 1}. ${q}\n`;
      });
      fullText += `\n`;
    }

    if (currentMateriDoc.includeReferences && currentMateriDoc.references && currentMateriDoc.references.length > 0) {
      fullText += `REFERENSI & SUMBER RUJUKAN RESMI:\n`;
      currentMateriDoc.references.forEach((ref, i) => {
        fullText += `[${i + 1}] ${ref}\n`;
      });
      fullText += `\n`;
    }

    if (currentMateriDoc.includeTeacherNotesInDoc && currentMateriDoc.teacherNotes) {
      fullText += `CATATAN PENDIDIK:\n${currentMateriDoc.teacherNotes}\n\n`;
    }

    navigator.clipboard.writeText(fullText);
    showToast('📋 Seluruh teks dokumen bahan ajar berhasil disalin ke clipboard!');
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
                onClick={handleSynthesizeDeepMaterial}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Susun dokumen bahan ajar mendalam secara otomatis (lengkap dengan wacana otentik, miskonsepsi, glosarium, dan rujukan)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Susun Materi Mendalam</span>
              </button>
              {hasGenerated ? (
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('preview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Dokumen A4</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateDocument}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 cursor-wait"
                >
                  {isGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  <span>Lihat Dokumen A4</span>
                </button>
              )}
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
      {/* 1B. PILIHAN SUMBER DATA: PROYEK SAYA ATAU MANUAL                        */}
      {/* ====================================================================== */}
      {viewMode === 'form' && (
        <ProductDataSourceSelector
          currentMode={sourceMode}
          onModeChange={setSourceMode}
          productTitle="Materi Dokumen A4"
          learningProjects={learningProjects}
          activeContext={activeLearningContext}
          onSelectMeetingContext={onSelectMeetingContext}
          onNavigate={onNavigate}
        />
      )}

      {/* ====================================================================== */}
      {/* 1C. BANNER KONEKSI MASTER LEARNING DATA (SINGLE SOURCE OF TRUTH)        */}
      {/* ====================================================================== */}
      {sourceMode === 'project' && materiContext && (
        <div className={`rounded-3xl p-5 sm:p-6 border transition-all ${
          isOutdated 
            ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs' 
            : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                isOutdated 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : 'bg-indigo-50 text-[#3b49df] border border-indigo-100'
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#3b49df] border border-indigo-200">
                    📌 Terhubung dengan Master Learning Data
                  </span>
                  <span className="text-[11px] font-bold text-slate-600">
                    {materiContext.pertemuan} • {materiContext.grade} ({materiContext.subject})
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    isOutdated 
                      ? 'bg-amber-200 text-amber-900 border-amber-300 font-extrabold'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    Versi Master: v{materiContext.sourceMasterVersion} {isOutdated ? `(Dokumen saat ini: v${docMasterVersion})` : ''}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">
                  {isOutdated ? (
                    <span className="text-amber-900 font-semibold">
                      ⚠️ <strong>Master Context telah diperbarui:</strong> Cakupan atau materi pertemuan ini telah diubah ke versi <strong>v{materiContext.sourceMasterVersion}</strong>. Dokumen versi sebelumnya tetap aman dan tidak diubah otomatis.
                    </span>
                  ) : (
                    <span className="text-slate-600">
                      Fokus Tema: <strong className="text-slate-900">{materiContext.temaKegiatan}</strong> — Bab: <strong className="text-slate-900">{materiContext.bab}</strong>. Seluruh identitas & cakupan materi otomatis dialirkan tanpa perlu input ulang.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={handleSyncToLatestMasterContext}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                  isOutdated
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
                title="Terapkan cakupan materi terbaru dari Master Context ke bagian-bagian materi"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isOutdated ? `Selaraskan ke Master v${materiContext.sourceMasterVersion}` : 'Sinkronkan Ulang Master'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

          {/* TAB B2: APERSEPSI & PERTANYAAN PEMANTIK KONTEKSTUAL */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                  B2
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Apersepsi & Pertanyaan Pemantik Kontekstual
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Jembatan penghubung antara pengalaman nyata siswa dengan konsep inti yang akan dipelajari.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={includeApersepsi}
                  onChange={(e) => setIncludeApersepsi(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-bold">Sertakan di Dokumen</span>
              </label>
            </div>

            {includeApersepsi && (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={apersepsi}
                  onChange={(e) => setApersepsi(e.target.value)}
                  placeholder="Cerita pengantar kontekstual, analogi kehidupan sehari-hari, dan pertanyaan pemantik yang merangsang nalar kritis siswa..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 leading-relaxed font-sans"
                />
                <p className="text-[10px] text-slate-400">
                  💡 Tips: Apersepsi memancing keterlibatan emosi dan rasa ingin tahu peserta didik sebelum masuk ke substansi teori formal.
                </p>
              </div>
            )}
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

          {/* TAB D: MODEL TEKS WACANA BACAAN PENDUKUNG LENGKAP */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                  D
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Model Teks Wacana / Studi Kasus Pendukung Lengkap
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Menghadirkan contoh teks utuh beranotasi atau studi kasus nyata yang dibedah bersama siswa.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={includeSupportingReadingText}
                  onChange={(e) => setIncludeSupportingReadingText(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-bold">Sertakan di Dokumen</span>
              </label>
            </div>

            {includeSupportingReadingText && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Judul Model Wacana / Teks:
                    </label>
                    <input
                      type="text"
                      value={supportingReadingText.title}
                      onChange={(e) => setSupportingReadingText(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Contoh: Model Teks Iklan Otentik"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Kategori / Sumber:
                    </label>
                    <input
                      type="text"
                      value={supportingReadingText.category}
                      onChange={(e) => setSupportingReadingText(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Contoh: Wacana Otentik Analisis"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Isi Teks Model Wacana / Studi Kasus Lengkap:
                  </label>
                  <textarea
                    rows={5}
                    value={supportingReadingText.content}
                    onChange={(e) => setSupportingReadingText(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Tuliskan atau tempel wacana bacaan lengkap yang menjadi objek kajian..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 leading-relaxed font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Catatan Telaah / Analisis Pendidik (Untuk Panduan Siswa):
                  </label>
                  <textarea
                    rows={2}
                    value={supportingReadingText.analysisNotes || ''}
                    onChange={(e) => setSupportingReadingText(prev => ({ ...prev, analysisNotes: e.target.value }))}
                    placeholder="Catatan telaah struktur kalimat, fungsi persuasif, atau prinsip yang terkandung dalam wacana..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 leading-relaxed font-sans"
                  />
                </div>
              </div>
            )}
          </div>

          {/* TAB E: ANTISIPASI MISKONSEPSI SISWA & FAKTA ILMIAH */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                  E
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Antisipasi Miskonsepsi Siswa & Klarifikasi Konsep
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Mencegah kekeliruan pemahaman konsep yang sering dialami peserta didik melalui klarifikasi ilmiah.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={includeMisconceptions}
                  onChange={(e) => setIncludeMisconceptions(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-bold">Sertakan di Dokumen</span>
              </label>
            </div>

            {includeMisconceptions && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {misconceptions.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 relative">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Miskonsepsi {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMisconception(idx)}
                          className="text-slate-400 hover:text-rose-600"
                          title="Hapus miskonsepsi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-900 font-medium">❌ {m.misconception}</p>
                      <p className="text-xs text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                        ✅ <strong>Klarifikasi:</strong> {m.clarification}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Form Tambah Miskonsepsi */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">+ Tambah Miskonsepsi & Klarifikasi Baru:</span>
                  <input
                    type="text"
                    value={newMisconceptionInput}
                    onChange={(e) => setNewMisconceptionInput(e.target.value)}
                    placeholder="Kekeliruan / salah paham yang sering terjadi pada siswa..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={newClarificationInput}
                    onChange={(e) => setNewClarificationInput(e.target.value)}
                    placeholder="Penjelasan / fakta ilmiah yang meluruskan kekeliruan tersebut..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddMisconception}
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambahkan ke Tabel</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TAB F: GLOSARIUM ISTILAH KUNCI */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                  F
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-tight">
                    Glosarium Istilah Kunci
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Daftar kosakata ilmiah, istilah khusus, atau terminologi penting beserta definisinya.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={includeGlosarium}
                  onChange={(e) => setIncludeGlosarium(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-bold">Sertakan di Dokumen</span>
              </label>
            </div>

            {includeGlosarium && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {glosarium.map((g, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 text-xs block">{g.term}</span>
                        <p className="text-[11px] text-slate-600 leading-snug">{g.definition}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveGlossary(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Hapus istilah"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Form Tambah Glosarium */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTermInput}
                    onChange={(e) => setNewTermInput(e.target.value)}
                    placeholder="Nama istilah baru..."
                    className="w-full sm:w-1/3 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={newDefInput}
                    onChange={(e) => setNewDefInput(e.target.value)}
                    placeholder="Definisi ringkas dan jelas..."
                    className="w-full sm:flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddGlossary}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TAB G: RANGKUMAN & CEK PEMAHAMAN (OPSIONAL) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rangkuman Materi */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                    G1
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
              disabled={isGenerating}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-3 ${
                isGenerating
                  ? 'bg-indigo-700/80 text-white cursor-wait'
                  : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-500/20 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sedang Memproses & Menyusun Dokumen Materi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>
                    {hasGenerated
                      ? 'GENERATE ULANG DOKUMEN MATERI AJAR A4 (2 KOIN)'
                      : 'SUSUN & GENERATE DOKUMEN MATERI AJAR A4 (2 KOIN)'}
                  </span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              ✨ Biaya Generate: 2 Saldo Prompt • Menghasilkan dokumen materi pembelajaran profesional siap cetak A4
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

      {/* ====================================================================== */}
      {/* 5. MODAL LIMIT SALDO / TOP UP WHATSAPP */}
      {/* ====================================================================== */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Coins className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Batas Penggunaan Koin Tercapai
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {limitReason || 'Saldo koin akun Anda telah habis untuk periode saat ini.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block">Pilihan Paket Koin Pendidik:</span>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                {PROMPT_PACKAGES.map((pkg) => (
                  <li key={pkg.id} className="flex items-center justify-between">
                    <span>{pkg.name} ({pkg.prompts} Koin)</span>
                    <span className="font-bold text-amber-700">{pkg.priceLabel}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <a
                href={getWhatsAppTopUpUrl({
                  planName: 'Paket Pendidik Materi Ajar',
                  prompts: 50,
                  priceLabel: 'Top Up Koin STIVIA'
                })}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Top Up WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
