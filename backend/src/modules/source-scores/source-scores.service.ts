import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Claim } from '../claims/claim.types';
import { ClaimsService } from '../claims/claims.service';
import { SourceScore } from './source-score.types';

@Injectable()
export class SourceScoresService {
  private readonly priorScore = 0.5;
  private readonly priorWeight = 5;

  public constructor(private readonly claimsService: ClaimsService) {}

  public getAll(): SourceScore[] {
    const grouped = new Map<string, Claim[]>();
    for (const claim of this.claimsService.findAll()) {
      const claims = grouped.get(claim.sourceId) ?? [];
      claims.push(claim);
      grouped.set(claim.sourceId, claims);
    }

    return [...grouped.entries()].map(([sourceId, claims]) => this.calculateSourceScore(sourceId, claims));
  }

  public getBySource(sourceId: string): SourceScore {
    const claims = this.claimsService.findBySource(sourceId);
    return this.calculateSourceScore(sourceId, claims);
  }

  private calculateSourceScore(sourceId: string, claims: Claim[]): SourceScore {
    const resolved = claims.filter((c) =>
      ['confirmed', 'partially_confirmed', 'refuted', 'expired'].includes(c.status),
    );

    const confirmedCount = resolved.filter((c) => c.status === 'confirmed').length;
    const partialCount = resolved.filter((c) => c.status === 'partially_confirmed').length;
    const refutedCount = resolved.filter((c) => c.status === 'refuted').length;
    const expiredCount = resolved.filter((c) => c.status === 'expired').length;

    const confirmedWeight = confirmedCount * 1;
    const partialWeight = partialCount * 0.5;
    const expiredWeight = expiredCount * 0.2;
    const resolvedWeight = confirmedCount + partialCount + refutedCount + expiredCount;

    const score =
      resolvedWeight === 0
        ? this.priorScore
        : (confirmedWeight + partialWeight + expiredWeight + this.priorScore * this.priorWeight) /
          (resolvedWeight + this.priorWeight);

    return {
      id: randomUUID(),
      sourceId,
      topic: 'overall',
      score: Number(score.toFixed(4)),
      resolvedClaimsCount: resolved.length,
      confirmedCount,
      partialCount,
      refutedCount,
      expiredCount,
      lastCalculatedAt: new Date().toISOString(),
    };
  }
}
