import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Source } from './source.types';

@Injectable()
export class SourcesService {
  private readonly sources: Source[] = [];

  public findAll(): Source[] {
    return this.sources;
  }

  public create(payload: Omit<Source, 'id'>): Source {
    const source: Source = { id: randomUUID(), ...payload };
    this.sources.push(source);
    return source;
  }
}
