export type ClaimStatus =
  | 'unconfirmed'
  | 'watching'
  | 'confirmed'
  | 'refuted'
  | 'partially_confirmed'
  | 'disputed'
  | 'outdated'
  | 'expired'
  | 'unverifiable';

export type ClaimType =
  | 'driver_market'
  | 'technical_update'
  | 'technical_illegality'
  | 'regulation_change'
  | 'team_politics'
  | 'contract_extension'
  | 'sponsor_deal'
  | 'car_performance'
  | 'race_strategy'
  | 'management_change'
  | 'fia_investigation'
  | 'other';

export type LegalSensitivity = 'normal' | 'medium' | 'high';

export interface Claim {
  id: string;
  sourceId: string;
  claimText: string;
  claimType: ClaimType;
  status: ClaimStatus;
  publishedAt?: string;
  expectedResolveAt?: string;
  nextReviewAt?: string;
  resolvedAt?: string;
  legalSensitivity: LegalSensitivity;
  confidenceInitial?: number;
  confidenceCurrent?: number;
  specificityScore?: number;
  originalityScore?: number;
}

export interface ClaimValidationIssue {
  field: string;
  message: string;
}

export interface ClaimTimelineEvent {
  id: string;
  claimId: string;
  type: 'created' | 'evidence_added' | 'review_scheduled' | 'status_changed' | 'review_completed';
  description: string;
  createdAt: string;
}
