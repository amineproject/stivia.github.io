export type EducationLevel = 'SD' | 'SMP' | 'SMA' | 'SMK';

export type InfographicFormat = 'portrait' | 'square' | 'landscape';

export type VisualLevel = 'sederhana' | 'seimbang' | 'visual_dominan';

export type ExampleContext = 
  | 'otomatis'
  | 'sehari_hari'
  | 'sekolah'
  | 'rumah'
  | 'teknologi'
  | 'lokal'
  | 'akademik'
  | 'abstrak'
  | 'kustom';

export type VisualElementType = 
  | 'diagram_konsep'
  | 'komponen'
  | 'flowchart'
  | 'grafik'
  | 'tabel_perbandingan'
  | 'timeline'
  | 'callout'
  | 'ilustrasi_jaringan'
  | 'studi_kasus'
  | 'mindmap'
  | 'ringkasan_kotak'
  | 'benang_merah';

// ==========================================
// TAHAP 2: OTOMATISASI VISUAL & STRUKTUR LAYOUT
// ==========================================

export type InformationType = 
  | 'definition'          // Pengertian / Definisi / Konsep Dasar
  | 'goals'               // Tujuan
  | 'functions'           // Fungsi / Manfaat
  | 'characteristics'     // Ciri-Ciri / Karakteristik / Sifat
  | 'components'          // Unsur / Komponen / Struktur / Bagian
  | 'process'             // Proses / Langkah / Tahap
  | 'timeline'            // Urutan Waktu / Kronologis
  | 'comparison'          // Perbandingan / Jenis / Varian
  | 'relationship'        // Hubungan Antar Konsep / Jaringan
  | 'numeric_data'        // Data Numerik / Grafik
  | 'example'             // Contoh / Skenario Kasus
  | 'real_life_context'   // Peran dalam Kehidupan Sehari-hari
  | 'summary';            // Rangkuman Kunci

export type VisualType = 
  | 'concept_card'
  | 'hero_definition'
  | 'split_definition'
  | 'goal_cards'
  | 'target_layout'
  | 'numbered_goal_blocks'
  | 'function_cards'
  | 'icon_list'
  | 'feature_grid'
  | 'checklist'
  | 'feature_cards'
  | 'icon_checklist'
  | 'component_cards'
  | 'parts_diagram'
  | 'hub_and_spoke'
  | 'flow_diagram'
  | 'step_by_step'
  | 'process_cards'
  | 'vertical_flow'
  | 'horizontal_flow'
  | 'timeline'
  | 'comparison_layout'
  | 'comparison_table'
  | 'side_by_side'
  | 'relationship_diagram'
  | 'connection_diagram'
  | 'bar_chart'
  | 'example_card'
  | 'scenario_layout'
  | 'context_cards'
  | 'daily_life_pillars'
  | 'summary_card'
  | 'key_takeaways';

export type LayoutType = 
  | 'hero'
  | 'single-column'
  | 'two-column'
  | 'three-column'
  | 'feature-grid'
  | 'checklist'
  | 'comparison'
  | 'timeline'
  | 'flow-horizontal'
  | 'flow-vertical'
  | 'diagram'
  | 'mixed';

export interface ContentPriority {
  primary: string;
  secondary?: string[];
  supporting?: string[];
}

export interface LayoutConfig {
  columns?: number;
  direction?: 'horizontal' | 'vertical';
  spanFullWidth?: boolean;
}

// ==========================================
// TAHAP 2A, 2B, 2C: STIVIA CONTENT ENGINE
// ==========================================

export type ContentWeight = 'TINGGI' | 'SEDANG' | 'RENDAH' | 'UTAMA' | 'RINGAN';

export type ContentDepth = 'RINGKAS' | 'SEDANG' | 'MENDALAM';

export type VisualPriority = 'UTAMA' | 'SEKUNDER' | 'PENDUKUNG' | 'HIGH' | 'MEDIUM' | 'LOW';

export type PresentationType = 
  | 'Definisi + penjelasan'
  | 'Bullet point'
  | 'Checklist'
  | 'Numbered list'
  | 'Perbandingan'
  | 'Konsep + contoh'
  | 'Paragraf singkat'
  | 'Timeline'
  | 'Diagram hubungan';

export interface ContentSnapshotSection {
  order: number;
  letterIndex: string;
  title: string;
  coreIdea: string;               // Inti setiap bagian materi
  explanation: string;            // Penjelasan setiap bagian
  keyPoints: string[];            // Poin-poin penting
  example?: string;               // Contoh / konteks kehidupan sehari-hari (jika relevan)
  exampleTitle?: string;
  weight: ContentWeight;          // TINGGI | SEDANG | RENDAH
  depth: ContentDepth;            // RINGKAS | SEDANG | MENDALAM
  visualPriority: VisualPriority; // UTAMA | SEKUNDER | PENDUKUNG
  presentationType: string;       // Jenis penyajian visual / teks
  sourceCoverage: string;         // Cakupan sumber yang diwakili
}

export interface ContentSnapshot {
  identity: {
    educationLevel: string;
    grade: string;
    subject: string;
    theme: string;
    topic: string;
    scope: string;
    learningObjective?: string;
  };
  title: string;
  overview: string;                // Gambaran Umum / Pengantar (1-3 kalimat)
  sections: ContentSnapshotSection[];
  keySummary: string[];            // Rangkuman Kunci (2-4 poin utama)
  createdAt: string;
  version?: string;
}

export interface ScopeStructureItem {
  id: string;
  order: number;
  rawText: string;
  cleanTitle: string;
  sourceCoverage: string;
  isIntro?: boolean;
  isSummary?: boolean;
}

export interface ContentValidationChecklistItem {
  scopeItem: string;
  covered: boolean;
  sectionTitle: string;
  weight: ContentWeight;
  depth: ContentDepth;
  visualPriority: VisualPriority;
}

export interface ContentValidationResult {
  isValid: boolean;
  allScopeCovered: boolean;
  noMissingSections: boolean;
  noSubjectCrossPollution: boolean;
  orderValid: boolean;
  allWeightsAssigned: boolean;
  allDepthsAssigned: boolean;
  contentMatchesDepth: boolean;
  errors: string[];
  warnings: string[];
  checklist: ContentValidationChecklistItem[];
}

// ==========================================
// TAHAP 3: SISTEM GAYA VISUAL DINAMIS (DESIGN TOKENS)
// ==========================================

export interface ColorPaletteTokens {
  background: string;
  surface: string;
  surfaceBorder: string;
  primary: string;
  primaryBg: string;
  primaryText: string;
  primaryLight: string;
  primaryBorder: string;
  secondary: string;
  secondaryBg: string;
  secondaryText: string;
  secondaryLight: string;
  secondaryBorder: string;
  accent: string;
  accentBg: string;
  accentText: string;
  accentLight: string;
  accentBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  headerGradient: string;
  headerText: string;
  headerSubtext: string;
  headerBadgeBg: string;
  footerBg: string;
  footerText: string;
  footerAccent: string;
  summaryBorder: string;
  summaryBadge: string;
}

export interface TypographyTokens {
  fontFamily: string;
  headingFont: string;
  headingWeight: string;
  headingTracking: string;
  bodyStyle: string;
  bodyWeight: string;
  headingScale: string;
  lineHeight: string;
}

export interface CardTokens {
  borderRadius: string;
  innerRadius: string;
  borderStyle: string;
  shadowStyle: string;
  padding: string;
  density: 'compact' | 'balanced' | 'spacious';
  cardBg: string;
  highlightBorder: string;
}

export interface IconTokens {
  style: 'outline' | 'filled' | 'tinted' | 'rounded-box' | 'geometric';
  size: string;
  containerShape: string;
  containerBg: string;
}

export interface DecorationTokens {
  level: 'none' | 'minimal' | 'moderate' | 'expressive';
  shapes: 'geometric' | 'organic' | 'technical' | 'playful' | 'minimal';
  pattern: 'dots' | 'grid' | 'waves' | 'lines' | 'none';
  backgroundTreatment: string;
  badgeStyle: string;
  showAccentBar: boolean;
}

export interface CompositionTokens {
  density: 'compact' | 'balanced' | 'spacious';
  whitespace: 'compact' | 'balanced' | 'generous';
  alignment: 'left' | 'center' | 'balanced';
  visualEmphasis: 'text_first' | 'balanced' | 'visual_first';
  gridGap: string;
}

export interface StyleConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  colorPalette: ColorPaletteTokens;
  typography: TypographyTokens;
  cards: CardTokens;
  icons: IconTokens;
  decoration: DecorationTokens;
  composition: CompositionTokens;
}

export interface ActiveProjectContext {
  jenjang: EducationLevel;
  kelas: string;
  mataPelajaran: string;
  tema: string;
  materi: string;
  cakupanMateri: string;
  gayaVisual?: string;
  customVisualStyle?: string;
  format?: InfographicFormat;
  tingkatVisual?: VisualLevel;
  konteksContoh?: ExampleContext;
  customExampleContext?: string;
  styleConfig?: StyleConfig;
}

export interface ComparisonRow {
  attribute: string;
  itemA: string;
  itemB: string;
  itemC?: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  iconType?: string;
  badgeText?: string;
}

export interface CaseStudyData {
  title?: string;
  subTitle?: string;
  problem: string;
  dataConcept: string;
  analysis: string;
  visualizationNote: string;
  conclusion: string;
  solutionHighlight?: string;
}

export interface ConceptDiagramData {
  itemAName: string;
  itemARole: string;
  connectorLabel: string;
  connectorSub: string;
  itemBName: string;
  itemBRole: string;
}

export interface ComponentItem {
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  features: string[];
}

export interface ApplicationPillar {
  title: string;
  subtitle: string;
  iconName?: string;
  colorScheme?: string;
}

export interface MaterialBlock {
  id: string;
  order: number;
  letterIndex?: string; // 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'
  tag: string; // e.g. 'PENGANTAR', 'KOMPONEN', 'VARIASI KONSEP', 'PENERAPAN', 'RINGKASAN'
  title: string;
  subTitle?: string;
  coreIdea?: string; // Inti materi: Apa hal terpenting yang harus dipahami siswa dari bagian ini?
  content: string;
  explanation?: string; // Penjelasan materi proporsional
  keyPoints?: string[]; // Poin-poin penting terstruktur
  subPoints?: string[]; // Nested sub-points for deep pedagogical breakdowns
  example?: string;
  exampleTitle?: string;
  visualRecommendation: string;
  visualElementType: VisualElementType;
  accentColor?: string; // e.g. 'indigo', 'teal', 'amber', 'emerald', 'sky', 'rose', 'violet', 'blue'

  // STIVIA Content Engine: Tahap 2A, 2B, 2C
  sourceCoverage?: string; // Point of user's Cakupan Materi represented
  weight?: ContentWeight; // 'TINGGI' | 'SEDANG' | 'RENDAH' | 'UTAMA' | 'RINGAN'
  depth?: ContentDepth; // 'RINGKAS' | 'SEDANG' | 'MENDALAM'
  visualPriority?: VisualPriority; // 'UTAMA' | 'SEKUNDER' | 'PENDUKUNG'
  presentationType?: string; // Jenis penyajian (e.g. 'Definisi + penjelasan', 'Bullet point', dll)

  // Tahap 2 Automated Visual & Layout Architecture
  informationType?: InformationType;
  visualType?: VisualType;
  layoutType?: LayoutType;
  contentPriority?: ContentPriority;
  layoutConfig?: LayoutConfig;
  visualData?: Record<string, any>;
  
  // Rich block variations data
  conceptDiagram?: ConceptDiagramData;
  componentsList?: ComponentItem[];
  applicationPillars?: ApplicationPillar[];
  comparisonData?: {
    headerA: string;
    headerB: string;
    rows: ComparisonRow[];
  };
  processSteps?: ProcessStep[];
  caseStudy?: CaseStudyData;
  statMetrics?: {
    label: string;
    value: string;
    percentage?: number;
    description: string;
  }[];
  networkNodes?: {
    id: string;
    label: string;
    role: string;
    connections: string[];
    weight?: string;
  }[];
}

export interface SynthesisStep {
  step: number;
  title: string;
  desc: string;
}

export interface InfographicDraft {
  id: string;
  title: string;
  subTitle?: string;
  tagline?: string;
  learningObjective: string;
  educationLevel: EducationLevel;
  grade: string;
  subject: string;
  theme: string;
  rawTopic: string;
  scope: string;
  visualStyle: string;
  customVisualStyle?: string;
  styleConfig?: StyleConfig;
  format: InfographicFormat;
  visualLevel: VisualLevel;
  exampleContext: ExampleContext;
  customExampleContext?: string;
  requiredTopics?: string[];
  coverageChecklist?: { topic: string; covered: boolean; blockTitle: string }[];
  contentValidation?: ContentValidationResult;
  blocks: MaterialBlock[];
  overview?: string; // Gambaran Umum / Pengantar (1-3 kalimat)
  contentSnapshot?: ContentSnapshot; // Canonical Single Source of Truth Snapshot
  caseStudyBlock?: CaseStudyData;
  synthesisSteps?: SynthesisStep[];
  conceptHighlights?: string[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed';
  thumbnailColor?: string;
  authorName?: string;
  authorRole?: string;
  finalOutput?: FinalOutputState | null;
  isLocked?: boolean;
}

export type NavigationTab = 
  | 'dashboard'
  | 'beranda'
  | 'buat'
  | 'prompt_studio'
  | 'rancangan'
  | 'visual'
  | 'hasil'
  | 'preview'
  | 'proyek_saya'
  | 'infografis_saya'
  | 'panduan'
  | 'pengaturan';

export type ResponsiveViewMode = 'auto' | 'mobile' | 'desktop';

export interface UserSettings {
  defaultLevel: EducationLevel;
  defaultGrade: string;
  defaultSubject: string;
  defaultVisualStyle: string;
  defaultFormat: InfographicFormat;
  defaultVisualLevel: VisualLevel;
  defaultContext: ExampleContext;
  authorName: string;
  authorRole: string;
  authorBio: string;
  authorContact: string;
}

// ==========================================
// TAHAP 4: STATE MANAGEMENT PREVIEW & PENYEMPURNAAN
// ==========================================

export interface ProjectVersion {
  id: string;
  timestamp: string;
  actionName: string;
  draft: InfographicDraft;
}

export interface FinalDraft {
  activeProjectContext: ActiveProjectContext;
  requiredTopics: string[];
  materialStructure: MaterialBlock[];
  visualStructure: {
    format: InfographicFormat;
    visualLevel: VisualLevel;
    visualStyle: string;
  };
  styleConfig: StyleConfig;
  generatedAt: string;
}

// ==========================================
// TAHAP 4A: LOCK FINAL OUTPUT STATE STRUCTURE
// ==========================================

export type LockStatus = 'LOCKED' | 'UNLOCKED' | 'OUTPUT_BELUM_SIAP';

export interface FinalOutputValidationChecklist {
  subjectValid: boolean;          // 1. Mata pelajaran tersedia
  topicValid: boolean;            // 2. Topik tersedia
  scopeValid: boolean;            // 3. Cakupan materi tersedia
  contentValid: boolean;          // 4. generatedContent / materi tersedia
  sectionsValid: boolean;         // 5. materialSections tersedia
  orderValid: boolean;            // 6. Urutan bagian tersedia
  noEmptyBlocks: boolean;         // 7. Tidak ada bagian utama yang kosong
  infographicDataValid: boolean;  // 8. Data infografis terstruktur tersedia
  layoutValid: boolean;           // 9. Layout final tersedia
  visualStyleValid: boolean;      // 10. Gaya visual final tersedia
  isReadyToLock: boolean;         // Semua 10 kriteria lulus
  validationErrors: string[];     // Daftar alasan jika belum siap
}

export interface FinalOutputState {
  projectId: string;
  projectTitle: string;
  subject: string;
  gradeOrPhase: string;
  topic: string;
  scope: string;
  learningObjectives: string;
  generatedContent: string;
  materialSections: MaterialBlock[];
  materialOrder: string[];
  selectedVisualStyle: string;
  visualTheme: StyleConfig;
  typographySettings: TypographyTokens;
  colorSettings: ColorPaletteTokens;
  layoutConfiguration: {
    format: InfographicFormat;
    visualLevel: VisualLevel;
    cardDensity?: string;
    layoutTypes: Record<string, LayoutType | undefined>;
    columnsCount?: number;
  };
  infographicData: {
    conceptHighlights?: string[];
    synthesisSteps?: SynthesisStep[];
    caseStudyBlock?: CaseStudyData;
    authorName?: string;
    authorRole?: string;
    tagline?: string;
    subTitle?: string;
    requiredTopics?: string[];
  };
  finalRenderedContent: string;
  createdAt: string;
  updatedAt: string;
  lockedAt?: string;
  status: LockStatus;
  validationChecklist?: FinalOutputValidationChecklist;
}

export interface ProjectState {
  activeProjectContext: ActiveProjectContext;
  requiredTopics: string[];
  materialStructure: MaterialBlock[];
  visualStructure: {
    format: InfographicFormat;
    visualLevel: VisualLevel;
    visualStyle: string;
  };
  styleConfig: StyleConfig;
  currentVersion: InfographicDraft;
  previousVersion: InfographicDraft | null;
  previewStatus: 'ready' | 'processing' | 'error';
  loadingMessage?: string;
  errorMessage?: string | null;
  finalDraft?: FinalDraft | null;
  finalOutput?: FinalOutputState | null;
}

