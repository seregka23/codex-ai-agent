import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Dataset, DatasetExample, DatasetExampleStatus } from './dataset.types';

@Injectable()
export class DatasetsService {
  private readonly datasets: Dataset[] = [];
  private readonly examples: DatasetExample[] = [];

  public findAll(): Dataset[] {
    return this.datasets;
  }

  public findOne(id: string): Dataset {
    const dataset = this.datasets.find((item) => item.id === id);
    if (!dataset) throw new NotFoundException('Dataset not found');
    return dataset;
  }

  public create(payload: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>): Dataset {
    const now = new Date().toISOString();
    const dataset: Dataset = { id: randomUUID(), createdAt: now, updatedAt: now, ...payload };
    this.datasets.push(dataset);
    return dataset;
  }

  public update(id: string, payload: Partial<Omit<Dataset, 'id' | 'createdAt'>>): Dataset {
    const dataset = this.findOne(id);
    Object.assign(dataset, payload, { updatedAt: new Date().toISOString() });
    return dataset;
  }

  public remove(id: string): Dataset {
    const dataset = this.findOne(id);
    const index = this.datasets.findIndex((item) => item.id === id);
    this.datasets.splice(index, 1);
    for (let i = this.examples.length - 1; i >= 0; i -= 1) {
      if (this.examples[i].datasetId === id) this.examples.splice(i, 1);
    }
    return dataset;
  }

  public addExample(
    datasetId: string,
    payload: Omit<DatasetExample, 'id' | 'datasetId' | 'createdAt' | 'updatedAt'>,
  ): DatasetExample {
    this.findOne(datasetId);
    const now = new Date().toISOString();
    const example: DatasetExample = {
      id: randomUUID(),
      datasetId,
      createdAt: now,
      updatedAt: now,
      ...payload,
    };
    this.examples.push(example);
    return example;
  }

  public updateExample(
    id: string,
    payload: Partial<Omit<DatasetExample, 'id' | 'datasetId' | 'createdAt'>>,
  ): DatasetExample {
    const example = this.findExample(id);
    Object.assign(example, payload, { updatedAt: new Date().toISOString() });
    return example;
  }

  public removeExample(id: string): DatasetExample {
    const example = this.findExample(id);
    const index = this.examples.findIndex((item) => item.id === id);
    this.examples.splice(index, 1);
    return example;
  }

  public listExamples(datasetId: string): DatasetExample[] {
    this.findOne(datasetId);
    return this.examples.filter((item) => item.datasetId === datasetId);
  }

  public exportDataset(datasetId: string, format: 'json' | 'jsonl' | 'csv'): { format: string; content: string } {
    const dataset = this.findOne(datasetId);
    const rows = this.listExamples(datasetId);

    if (format === 'json') {
      return { format, content: JSON.stringify({ dataset, examples: rows }, null, 2) };
    }

    if (format === 'jsonl') {
      const content = rows
        .map((row) =>
          JSON.stringify({
            input: row.input,
            output: row.output ?? {},
            metadata: { datasetType: dataset.type, status: row.status, ...row.metadata },
          }),
        )
        .join('\n');
      return { format, content };
    }

    const header = 'id,status,input,output';
    const lines = rows.map((row) => {
      const input = JSON.stringify(row.input).replaceAll('"', '""');
      const output = JSON.stringify(row.output ?? {}).replaceAll('"', '""');
      return `${row.id},${row.status},"${input}","${output}"`;
    });
    return { format, content: [header, ...lines].join('\n') };
  }

  public markExported(datasetId: string): DatasetExample[] {
    const rows = this.listExamples(datasetId);
    rows.forEach((row) => {
      row.status = 'exported';
      row.updatedAt = new Date().toISOString();
    });
    return rows;
  }

  private findExample(id: string): DatasetExample {
    const example = this.examples.find((item) => item.id === id);
    if (!example) throw new NotFoundException('Dataset example not found');
    return example;
  }
}
