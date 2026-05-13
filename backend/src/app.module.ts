import { Module } from '@nestjs/common';
import { ClaimReviewsController } from './modules/claim-reviews/claim-reviews.controller';
import { ClaimsController } from './modules/claims/claims.controller';
import { ClaimsService } from './modules/claims/claims.service';
import { SourcesController } from './modules/sources/sources.controller';
import { SourcesService } from './modules/sources/sources.service';

@Module({
  controllers: [SourcesController, ClaimsController, ClaimReviewsController],
  providers: [SourcesService, ClaimsService],
})
export class AppModule {}
