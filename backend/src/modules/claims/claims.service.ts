import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Evidence } from '../evidences/evidence.types';
import { ClaimReview } from '../claim-reviews/claim-review.types';
import { Claim, ClaimStatus, ClaimTimelineEvent } from './claim.types';

@Injectable()
export class ClaimsService {
  private readonly claims: Claim[] = [];
  private readonly evidences: Evidence[] = [];
  private readonly reviews: ClaimReview[] = [];
  private readonly timeline: ClaimTimelineEvent[] = [];

  public findAll(): Claim[] {
    return this.claims;
  }

  public findOne(id: string): Claim {
    const claim = this.claims.find((item) => item.id === id);
    if (!claim) throw new NotFoundException('Claim not found');
    return claim;
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
    this.addTimeline(claim.id, 'created', `Claim created with status ${claim.status}`);
    return claim;
  }

  public resolveClaim(id: string, status: ClaimStatus): Claim {
    const claim = this.findOne(id);
    claim.status = status;
    claim.resolvedAt = new Date().toISOString();
    this.addTimeline(claim.id, 'status_changed', `Claim resolved as ${status}`);
    return claim;
  }

  public scheduleReview(claimId: string, reviewAt: string, notes?: string): ClaimReview {
    this.findOne(claimId);
    const review: ClaimReview = {
      id: randomUUID(),
      claimId,
      reviewAt,
      status: 'scheduled',
      notes,
    };
    this.reviews.push(review);

    const claim = this.findOne(claimId);
    claim.nextReviewAt = reviewAt;

    this.addTimeline(claimId, 'review_scheduled', `Review scheduled at ${reviewAt}`);
    return review;
  }

  public addEvidence(payload: Omit<Evidence, 'id' | 'createdAt'>): Evidence {
    this.findOne(payload.claimId);
    const evidence: Evidence = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...payload,
    };
    this.evidences.push(evidence);
    this.addTimeline(payload.claimId, 'evidence_added', `Evidence added: ${payload.stance}`);
    return evidence;
  }

  public completeReview(reviewId: string, notes?: string): ClaimReview {
    const review = this.reviews.find((item) => item.id === reviewId);
    if (!review) throw new NotFoundException('Review not found');
    review.status = 'completed';
    review.completedAt = new Date().toISOString();
    review.notes = notes ?? review.notes;
    this.addTimeline(review.claimId, 'review_completed', 'Review completed');
    return review;
  }

  public skipReview(reviewId: string, reason: string): ClaimReview {
    const review = this.reviews.find((item) => item.id === reviewId);
    if (!review) throw new NotFoundException('Review not found');
    review.status = 'skipped';
    review.skipReason = reason;
    return review;
  }

  public getTimeline(claimId: string): ClaimTimelineEvent[] {
    this.findOne(claimId);
    return this.timeline.filter((item) => item.claimId === claimId);
  }

  public getDueReviews(nowIso: string = new Date().toISOString()): ClaimReview[] {
    return this.reviews.filter((review) => review.status === 'scheduled' && review.reviewAt <= nowIso);
  }

  public getEvidences(claimId: string): Evidence[] {
    this.findOne(claimId);
    return this.evidences.filter((item) => item.claimId === claimId);
  }

  private addTimeline(claimId: string, type: ClaimTimelineEvent['type'], description: string): void {
    this.timeline.push({
      id: randomUUID(),
      claimId,
      type,
      description,
      createdAt: new Date().toISOString(),
    });
  }
}
