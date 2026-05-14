import { Controller, Get, Param, Post } from '@nestjs/common';
import { SourceScore } from './source-score.types';
import { SourceScoresService } from './source-scores.service';

@Controller('source-scores')
export class SourceScoresController {
  public constructor(private readonly sourceScoresService: SourceScoresService) {}

  @Get()
  public getAll(): SourceScore[] {
    return this.sourceScoresService.getAll();
  }

  @Get(':sourceId')
  public getBySource(@Param('sourceId') sourceId: string): SourceScore {
    return this.sourceScoresService.getBySource(sourceId);
  }

  @Post('recalculate')
  public recalculateAll(): SourceScore[] {
    return this.sourceScoresService.getAll();
  }

  @Post('recalculate/:sourceId')
  public recalculateSource(@Param('sourceId') sourceId: string): SourceScore {
    return this.sourceScoresService.getBySource(sourceId);
  }
}
