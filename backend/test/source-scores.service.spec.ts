import { ClaimsService } from '../src/modules/claims/claims.service';
import { SourceScoresService } from '../src/modules/source-scores/source-scores.service';

describe('SourceScoresService', () => {
  it('calculates score from resolved claims', () => {
    const claimsService = new ClaimsService();
    claimsService.create({ sourceId: 's1', claimText: 'a', claimType: 'other', status: 'confirmed', legalSensitivity: 'normal' });
    claimsService.create({ sourceId: 's1', claimText: 'b', claimType: 'other', status: 'partially_confirmed', legalSensitivity: 'normal' });
    claimsService.create({ sourceId: 's1', claimText: 'c', claimType: 'other', status: 'refuted', legalSensitivity: 'normal' });

    const service = new SourceScoresService(claimsService);
    const score = service.getBySource('s1');

    expect(score.resolvedClaimsCount).toBe(3);
    expect(score.score).toBeGreaterThan(0);
    expect(score.score).toBeLessThanOrEqual(1);
  });
});
