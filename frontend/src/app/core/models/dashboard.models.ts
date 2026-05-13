export interface DashboardMetric {
  readonly label: string;
  readonly value: string;
  readonly hint: string;
}

export interface ClaimItem {
  readonly text: string;
  readonly type: string;
  readonly status: 'watching' | 'confirmed' | 'refuted' | 'partially_confirmed';
  readonly source: string;
  readonly nextReviewAt: string;
}

export interface SourceRow {
  readonly name: string;
  readonly category: string;
  readonly overallScore: number;
  readonly technicalIllegalityScore: number;
}
