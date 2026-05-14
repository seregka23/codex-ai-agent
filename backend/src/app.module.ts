import { Module } from '@nestjs/common';
import { ArticlesController } from './modules/articles/articles.controller';
import { ArticlesService } from './modules/articles/articles.service';
import { ClaimReviewsController } from './modules/claim-reviews/claim-reviews.controller';
import { ClaimsController } from './modules/claims/claims.controller';
import { ClaimsService } from './modules/claims/claims.service';
import { DatasetsController } from './modules/datasets/datasets.controller';
import { DatasetsService } from './modules/datasets/datasets.service';
import { ImportsController } from './modules/imports/imports.controller';
import { RagController } from './modules/rag/rag.controller';
import { RagService } from './modules/rag/rag.service';
import { SourceScoresController } from './modules/source-scores/source-scores.controller';
import { SourceScoresService } from './modules/source-scores/source-scores.service';
import { SourcesController } from './modules/sources/sources.controller';
import { SourcesService } from './modules/sources/sources.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    SourcesController,
    ClaimsController,
    ArticlesController,
    ClaimReviewsController,
    SourceScoresController,
    DatasetsController,
    RagController,
    ImportsController,
  ],
  providers: [SourcesService, ClaimsService, ArticlesService, SourceScoresService, DatasetsService, RagService],
})
export class AppModule {}
