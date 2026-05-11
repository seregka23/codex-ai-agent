import { Body, Controller, Get, Post } from '@nestjs/common';
import { Source } from './source.types';
import { SourcesService } from './sources.service';

@Controller('sources')
export class SourcesController {
  public constructor(private readonly sourcesService: SourcesService) {}

  @Get()
  public findAll(): Source[] {
    return this.sourcesService.findAll();
  }

  @Post()
  public create(@Body() payload: Omit<Source, 'id'>): Source {
    return this.sourcesService.create(payload);
  }
}
