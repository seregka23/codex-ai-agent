import { Module } from '@nestjs/common';
import { ClaimsController } from './modules/claims/claims.controller';
import { ClaimsService } from './modules/claims/claims.service';
import { SourcesController } from './modules/sources/sources.controller';
import { SourcesService } from './modules/sources/sources.service';

@Module({
  controllers: [SourcesController, ClaimsController],
  providers: [SourcesService, ClaimsService],
})
export class AppModule {}
