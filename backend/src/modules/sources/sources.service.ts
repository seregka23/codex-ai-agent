import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Source } from './source.types';

@Injectable()
export class SourcesService {
  public constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<Source[]> {
    return this.prisma.source.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        baseReliability: true,
      },
    });
  }

  public async findOne(id: string): Promise<Source> {
    const source = await this.prisma.source.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        baseReliability: true,
      },
    });

    if (!source) {
      throw new NotFoundException('Source not found');
    }

    return source;
  }

  public async create(payload: Omit<Source, 'id'>): Promise<Source> {
    return this.prisma.source.create({
      data: {
        name: payload.name,
        type: payload.type,
        description: payload.description,
        baseReliability: payload.baseReliability,
      },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        baseReliability: true,
      },
    });
  }
}
