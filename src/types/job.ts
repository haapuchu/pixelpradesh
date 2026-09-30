export type PipelineStage =
  | 'QUEUED'
  | 'ANALYZING'
  | 'SCENE_LOCALIZATION'
  | 'COPY_GENERATION'
  | 'CANVAS_FORMAT'
  | 'TEXT_OVERLAY'
  | 'COMPLIANCE_CHECK'
  | 'INDEXED'
  | 'FAILED';

export type VariantStatus = 'PROCESSING' | 'READY' | 'FLAGGED' | 'FAILED';

export interface ComplianceRuleResult {
  ruleId: 'LOGO_VISIBILITY' | 'TEXT_CLIPPING' | 'PRODUCT_DISTORTION' | 'BRAND_SAFETY';
  ruleName: string;
  passed: boolean;
  score: number; // 0.0 to 1.0
  reason?: string;
}

export interface StepLog {
  stage: PipelineStage;
  stageName: string;
  url: string;
  durationMs: number;
  inputAssetId?: string;
  outputAssetId?: string;
  aiVerdict?: Record<string, unknown>;
  timestamp: string;
}

export interface AdVariant {
  id: string;
  jobId: string;
  localeId: string;
  ratioId: string;
  currentStage: PipelineStage;
  status: VariantStatus;
  masterPublicId: string;
  finalPublicId?: string;
  finalUrl: string;
  stepLogs: StepLog[];
  complianceResults: ComplianceRuleResult[];
  recipeUrl: string; // The pure Cloudinary transformation URL chain
  metadata: {
    locale: string;
    festival: string;
    ratio: string;
    headline: string;
    cta: string;
    accentColor: string;
    script: string;
  };
}

export interface MasterAnalysis {
  dominantColors: string[];
  safeZone: {
    x: number; // percentage or px
    y: number;
    width: number;
    height: number;
  };
  productBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  subjectType: string;
  suggestedPlacements: string[];
}

export interface AdaptrJob {
  id: string;
  productName: string;
  category: string;
  brief: string;
  masterPublicId: string;
  masterUrl: string;
  analysis: MasterAnalysis;
  totalVariants: number;
  completedVariants: number;
  variants: AdVariant[];
  createdAt: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

export type PixelPradeshJob = AdaptrJob;

export interface CreateJobPayload {
  productName: string;
  category: string;
  brief: string;
  masterPublicId: string;
  masterUrl: string;
  selectedLocales?: string[];
  selectedRatios?: string[];
}
