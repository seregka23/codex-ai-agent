export interface Article {
  id: string;
  sourceId?: string;
  title: string;
  url?: string;
  language?: string;
  publishedAt?: string;
  summary?: string;
  rawText?: string;
  entities?: {
    teams: string[];
    drivers: string[];
    people: string[];
  };
  importedAt: string;
}

export interface SuggestedClaim {
  id: string;
  articleId: string;
  claimText: string;
  claimType:
    | 'driver_market'
    | 'technical_update'
    | 'technical_illegality'
    | 'regulation_change'
    | 'team_politics'
    | 'other';
  status: 'draft' | 'approved' | 'rejected';
  reason: string;
  createdAt: string;
}
