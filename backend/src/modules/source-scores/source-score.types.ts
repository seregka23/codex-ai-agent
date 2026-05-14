export type SourceScoreTopic =
  | 'overall'
  | 'driver_market'
  | 'technical_updates'
  | 'technical_illegality'
  | 'team_politics'
  | 'regulations'
  | 'race_strategy';

export interface SourceScore {
  id: string;
  sourceId: string;
  topic: SourceScoreTopic;
  score: number;
  resolvedClaimsCount: number;
  confirmedCount: number;
  partialCount: number;
  refutedCount: number;
  expiredCount: number;
  lastCalculatedAt: string;
}
