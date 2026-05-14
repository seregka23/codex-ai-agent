import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Dataset, DatasetExample, DatasetExampleStatus } from './dataset.types';
import { DatasetsService } from './datasets.service';

interface CreateDatasetDto {
  name: string;
  type: Dataset['type'];
  description?: string;
  metadata?: Record<string, unknown>;
}

interface CreateDatasetExampleDto {
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  status: DatasetExampleStatus;
}

@Controller('datasets')
export class DatasetsController {
  public constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  public list(): Dataset[] {
    return this.datasetsService.findAll();
  }

  @Get(':id')
  public getById(@Param('id') id: string): Dataset {
    return this.datasetsService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateDatasetDto): Dataset {
    return this.datasetsService.create(dto);
  }

  @Patch(':id')
  public update(@Param('id') id: string, @Body() dto: Partial<CreateDatasetDto>): Dataset {
    return this.datasetsService.update(id, dto);
  }

  @Delete(':id')
  public remove(@Param('id') id: string): Dataset {
    return this.datasetsService.remove(id);
  }

  @Get(':id/examples')
  public listExamples(@Param('id') id: string): DatasetExample[] {
    return this.datasetsService.listExamples(id);
  }

  @Post(':id/examples')
  public addExample(@Param('id') id: string, @Body() dto: CreateDatasetExampleDto): DatasetExample {
    return this.datasetsService.addExample(id, dto);
  }

  @Patch('examples/:exampleId')
  public updateExample(
    @Param('exampleId') exampleId: string,
    @Body() dto: Partial<CreateDatasetExampleDto>,
  ): DatasetExample {
    return this.datasetsService.updateExample(exampleId, dto);
  }

  @Delete('examples/:exampleId')
  public deleteExample(@Param('exampleId') exampleId: string): DatasetExample {
    return this.datasetsService.removeExample(exampleId);
  }

  @Post(':id/export')
  public export(
    @Param('id') id: string,
    @Query('format') format: 'json' | 'jsonl' | 'csv' = 'jsonl',
  ): { format: string; content: string } {
    const exported = this.datasetsService.exportDataset(id, format);
    this.datasetsService.markExported(id);
    return exported;
  }
}
