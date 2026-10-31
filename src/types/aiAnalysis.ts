import type { ScanSource } from './scan';

export type InsightStatus = 'normal' | 'watch' | 'attention';
export type InsightCategory = 'soil' | 'slope' | 'ground';

export interface AiInsight {
  id: InsightCategory;
  title: string;
  finding: string;
  recommendation: string;
  status: InsightStatus;
}

export interface AiAnalysisResult {
  summary: string;
  insights: AiInsight[];
  analyzedAt: Date;
  scannedAt: Date;
  source: ScanSource;
}