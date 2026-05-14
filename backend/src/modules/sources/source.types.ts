export type SourceType =
  | 'official_fia'
  | 'official_f1'
  | 'official_team'
  | 'team_principal'
  | 'driver'
  | 'engineer'
  | 'journalist'
  | 'reputable_media'
  | 'insider'
  | 'social_media'
  | 'forum'
  | 'fan_theory'
  | 'unknown';

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  description?: string;
  baseReliability?: number;
}
