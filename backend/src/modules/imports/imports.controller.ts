import { Body, Controller, Post } from '@nestjs/common';
import { Article } from '../articles/article.types';
import { ArticlesService } from '../articles/articles.service';

interface JsonImportDto {
  articles: Array<Omit<Article, 'id' | 'importedAt'>>;
}

@Controller('imports')
export class ImportsController {
  public constructor(private readonly articlesService: ArticlesService) {}

  @Post('manual')
  public manualImport(@Body() payload: Omit<Article, 'id' | 'importedAt'>): Article {
    return this.articlesService.create(payload);
  }

  @Post('json')
  public jsonImport(@Body() payload: JsonImportDto): Article[] {
    return payload.articles.map((article) => this.articlesService.create(article));
  }
}
