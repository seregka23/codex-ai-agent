import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClaimReview } from './claim-review.types';
import { ClaimsService } from '../claims/claims.service';

interface CompleteReviewDto {
  notes?: string;
}

interface SkipReviewDto {
  reason: string;
}

@Controller('claim-reviews')
export class ClaimReviewsController {
  public constructor(private readonly claimsService: ClaimsService) {}

  @Get('due')
  public due(): ClaimReview[] {
    return this.claimsService.getDueReviews();
  }

  @Post(':id/complete')
  public complete(@Param('id') id: string, @Body() dto: CompleteReviewDto): ClaimReview {
    return this.claimsService.completeReview(id, dto.notes);
  }

  @Post(':id/skip')
  public skip(@Param('id') id: string, @Body() dto: SkipReviewDto): ClaimReview {
    return this.claimsService.skipReview(id, dto.reason);
  }
}
