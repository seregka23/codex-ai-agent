import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Claim } from './claim.types';

@Injectable()
export class ClaimsService {
  private readonly claims: Claim[] = [];

  public findAll(): Claim[] {
    return this.claims;
  }

  public create(payload: Omit<Claim, 'id'>): Claim {
    if (!payload.claimText.trim()) {
      throw new BadRequestException('claimText is required');
    }

    const claim: Claim = {
      id: randomUUID(),
      ...payload,
      legalSensitivity:
        payload.claimType === 'technical_illegality' ? 'high' : payload.legalSensitivity,
    };
    this.claims.push(claim);
    return claim;
  }
}
