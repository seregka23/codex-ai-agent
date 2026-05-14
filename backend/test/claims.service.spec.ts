import { BadRequestException } from '@nestjs/common';
import { ClaimsService } from '../src/modules/claims/claims.service';

describe('ClaimsService', () => {
  let service: ClaimsService;

  beforeEach(() => {
    service = new ClaimsService();
  });

  it('creates claim with legalSensitivity high for technical_illegality', () => {
    const claim = service.create({
      sourceId: 'source-1',
      claimText: 'Team A uses illegal wing',
      claimType: 'technical_illegality',
      status: 'unconfirmed',
      legalSensitivity: 'normal',
      confidenceInitial: 0.3,
      confidenceCurrent: 0.3,
      specificityScore: 0.8,
      originalityScore: 0.6,
    });

    expect(claim.legalSensitivity).toBe('high');
  });

  it('rejects claim when score is outside [0..1]', () => {
    expect(() =>
      service.create({
        sourceId: 'source-1',
        claimText: 'Invalid score claim',
        claimType: 'other',
        status: 'unconfirmed',
        legalSensitivity: 'normal',
        confidenceInitial: 1.4,
      }),
    ).toThrow(BadRequestException);
  });

  it('does not allow high-sensitivity claim confirmation without confirming evidence', () => {
    const claim = service.create({
      sourceId: 'source-1',
      claimText: 'Team A illegal wing',
      claimType: 'technical_illegality',
      status: 'watching',
      legalSensitivity: 'high',
    });

    expect(() => service.resolveClaim(claim.id, 'confirmed')).toThrow(BadRequestException);
  });

  it('allows high-sensitivity claim confirmation with confirms evidence', () => {
    const claim = service.create({
      sourceId: 'source-1',
      claimText: 'Team A illegal wing',
      claimType: 'technical_illegality',
      status: 'watching',
      legalSensitivity: 'high',
    });

    service.addEvidence({
      claimId: claim.id,
      stance: 'confirms',
      title: 'FIA result',
    });

    const resolved = service.resolveClaim(claim.id, 'confirmed');
    expect(resolved.status).toBe('confirmed');
    expect(resolved.resolvedAt).toBeDefined();
  });
});
