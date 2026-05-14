export type EvidenceStance = 'supports' | 'confirms' | 'refutes' | 'neutral_update' | 'contradicts';

export interface Evidence {
  id: string;
  claimId: string;
  stance: EvidenceStance;
  sourceType?: string;
  sourceName?: string;
  title: string;
  url?: string;
  summary?: string;
  publishedAt?: string;
  reliabilityWeight?: number;
  createdAt: string;
}
