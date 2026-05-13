import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SourceScore } from '../source-scores/source-score.types';
import { SourceScoresService } from '../source-scores/source-scores.service';
import { Source } from './source.types';
import { SourcesService } from './sources.service';

@Controller('sources')
export class SourcesController {
  public constructor(
    private readonly sourcesService: SourcesService,
    private readonly sourceScoresService: SourceScoresService,
  ) {}

  @Get()
  public findAll(): Source[] {
    return this.sourcesService.findAll();
  }

  @Post()
  public create(@Body() payload: Omit<Source, 'id'>): Source {
    return this.sourcesService.create(payload);
  }

  @Get(':id/scores')
  public getScores(@Param('id') id: string): SourceScore {
    return this.sourceScoresService.getBySource(id);
  }
}
