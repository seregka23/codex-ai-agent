import { Module } from '@nestjs/common';
import { ClaimReviewsController } from './modules/claim-reviews/claim-reviews.controller';
import { ClaimsController } from './modules/claims/claims.controller';
import { ClaimsService } from './modules/claims/claims.service';
import { SourceScoresController } from './modules/source-scores/source-scores.controller';
import { SourceScoresService } from './modules/source-scores/source-scores.service';
import { SourcesController } from './modules/sources/sources.controller';
import { SourcesService } from './modules/sources/sources.service';

@Module({
  controllers: [
    SourcesController,
    ClaimsController,
    ClaimReviewsController,
    SourceScoresController,
  ],
  providers: [SourcesService, ClaimsService, SourceScoresService],
})
export class AppModule {}
