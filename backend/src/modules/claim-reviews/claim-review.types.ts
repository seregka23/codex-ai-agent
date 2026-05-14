export type ClaimReviewStatus = 'scheduled' | 'completed' | 'skipped' | 'overdue';

export interface ClaimReview {
  id: string;
  claimId: string;
  reviewAt: string;
  status: ClaimReviewStatus;
  notes?: string;
  completedAt?: string;
  skipReason?: string;
}
