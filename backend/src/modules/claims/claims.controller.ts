import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClaimReview } from '../claim-reviews/claim-review.types';
import { Evidence } from '../evidences/evidence.types';
import { Claim, ClaimStatus, ClaimTimelineEvent } from './claim.types';
import { ClaimsService } from './claims.service';

interface ResolveClaimDto {
  status: ClaimStatus;
}

interface ScheduleReviewDto {
  reviewAt: string;
  notes?: string;
}

@Controller('claims')
export class ClaimsController {
  public constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  public findAll(): Claim[] {
    return this.claimsService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Claim {
    return this.claimsService.findOne(id);
  }

  @Post()
  public create(@Body() payload: Omit<Claim, 'id'>): Claim {
    return this.claimsService.create(payload);
  }

  @Post(':id/resolve')
  public resolve(@Param('id') id: string, @Body() dto: ResolveClaimDto): Claim {
    return this.claimsService.resolveClaim(id, dto.status);
  }

  @Post(':id/schedule-review')
  public scheduleReview(@Param('id') id: string, @Body() dto: ScheduleReviewDto): ClaimReview {
    return this.claimsService.scheduleReview(id, dto.reviewAt, dto.notes);
  }

  @Get(':id/timeline')
  public timeline(@Param('id') id: string): ClaimTimelineEvent[] {
    return this.claimsService.getTimeline(id);
  }

  @Get(':id/evidences')
  public evidences(@Param('id') id: string): Evidence[] {
    return this.claimsService.getEvidences(id);
  }

  @Post(':id/evidences')
  public addEvidence(
    @Param('id') id: string,
    @Body() payload: Omit<Evidence, 'id' | 'createdAt' | 'claimId'>,
  ): Evidence {
    return this.claimsService.addEvidence({ ...payload, claimId: id });
  }

  @Get('due-for-review/list')
  public dueForReview(): ClaimReview[] {
    return this.claimsService.getDueReviews();
  }
}
