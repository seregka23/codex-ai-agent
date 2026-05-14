export interface RagFilters {
  teams?: string[];
  drivers?: string[];
  claimTypes?: string[];
  season?: number;
}

export interface RagSearchRequest {
  query: string;
  filters?: RagFilters;
  limit?: number;
}

export interface RagSearchItem {
  claimId: string;
  claimText: string;
  claimType: string;
  status: string;
  sourceId: string;
  score: number;
}

export interface RagContext {
  question: string;
  summary: string;
  evidenceChecklist: string[];
  claims: RagSearchItem[];
}

export interface RagAskResponse {
  answer: string;
  confidence: 'low' | 'medium' | 'high';
  context: RagContext;
}
