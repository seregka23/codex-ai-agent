import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClaimReview } from '../claim-reviews/claim-review.types';
import { Evidence } from '../evidences/evidence.types';
import { Claim, ClaimStatus, ClaimTimelineEvent, ClaimValidationIssue } from './claim.types';

@Injectable()
export class ClaimsService {
  private readonly claims: Claim[] = [];
  private readonly evidences: Evidence[] = [];
  private readonly reviews: ClaimReview[] = [];
  private readonly timeline: ClaimTimelineEvent[] = [];

  public findAll(): Claim[] {
    return this.claims;
  }

  public findBySource(sourceId: string): Claim[] {
    return this.claims.filter((claim) => claim.sourceId === sourceId);
  }

  public findOne(id: string): Claim {
    const claim = this.claims.find((item) => item.id === id);
    if (!claim) throw new NotFoundException('Claim not found');
    return claim;
  }

  public create(payload: Omit<Claim, 'id'>): Claim {
    const issues = this.validateClaimPayload(payload);
    if (issues.length > 0) {
      throw new BadRequestException({ message: 'Claim payload validation failed', issues });
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

    if (claim.legalSensitivity === 'high' && status === 'confirmed') {
      const hasConfirmingEvidence = this.evidences.some(
        (evidence) => evidence.claimId === id && evidence.stance === 'confirms',
      );
      if (!hasConfirmingEvidence) {
        throw new BadRequestException(
          'High sensitivity claim cannot be marked as confirmed without confirming evidence.',
        );
      }
    }

    claim.status = status;
    claim.resolvedAt = new Date().toISOString();
    this.addTimeline(claim.id, 'status_changed', `Claim resolved as ${status}`);
    return claim;
  }

  public scheduleReview(claimId: string, reviewAt: string, notes?: string): ClaimReview {
    const claim = this.findOne(claimId);
    const reviewDate = new Date(reviewAt);
    if (Number.isNaN(reviewDate.getTime())) {
      throw new BadRequestException('reviewAt must be a valid ISO date');
    }

    if (claim.publishedAt && reviewDate <= new Date(claim.publishedAt)) {
      throw new BadRequestException('reviewAt must be later than publishedAt');
    }

    const review: ClaimReview = {
      id: randomUUID(),
      claimId,
      reviewAt,
      status: 'scheduled',
      notes,
    };
    this.reviews.push(review);

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

  private validateClaimPayload(payload: Omit<Claim, 'id'>): ClaimValidationIssue[] {
    const issues: ClaimValidationIssue[] = [];

    if (!payload.claimText.trim()) {
      issues.push({ field: 'claimText', message: 'claimText is required' });
    }

    this.validateScore(issues, 'confidenceInitial', payload.confidenceInitial);
    this.validateScore(issues, 'confidenceCurrent', payload.confidenceCurrent);
    this.validateScore(issues, 'specificityScore', payload.specificityScore);
    this.validateScore(issues, 'originalityScore', payload.originalityScore);

    if (payload.expectedResolveAt && payload.publishedAt) {
      if (new Date(payload.expectedResolveAt) <= new Date(payload.publishedAt)) {
        issues.push({ field: 'expectedResolveAt', message: 'must be later than publishedAt' });
      }
    }

    if (payload.nextReviewAt && payload.publishedAt) {
      if (new Date(payload.nextReviewAt) <= new Date(payload.publishedAt)) {
        issues.push({ field: 'nextReviewAt', message: 'must be later than publishedAt' });
      }
    }

    return issues;
  }

  private validateScore(issues: ClaimValidationIssue[], field: string, value?: number): void {
    if (value === undefined) return;
    if (value < 0 || value > 1) {
      issues.push({ field, message: `${field} must be between 0 and 1` });
    }
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
