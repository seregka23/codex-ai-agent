import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Article, SuggestedClaim } from './article.types';
import { ArticlesService } from './articles.service';

interface ApproveClaimDto {
  sourceId: string;
}

interface BulkReviewDto {
  ids: string[];
  action: 'approve' | 'reject';
  sourceId?: string;
}

@Controller('articles')
export class ArticlesController {
  public constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  public list(): Article[] {
    return this.articlesService.list();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Article {
    return this.articlesService.findOne(id);
  }

  @Post()
  public create(@Body() payload: Omit<Article, 'id' | 'importedAt'>): Article {
    return this.articlesService.create(payload);
  }

  @Post('import')
  public import(@Body() payload: Omit<Article, 'id' | 'importedAt'>): Article {
    return this.articlesService.create(payload);
  }

  @Post(':id/extract-claims')
  public extractClaims(@Param('id') id: string): SuggestedClaim[] {
    return this.articlesService.extractClaims(id);
  }

  @Get(':id/suggested-claims')
  public listSuggested(@Param('id') id: string): SuggestedClaim[] {
    return this.articlesService.listSuggestedClaims(id);
  }

  @Get('suggested-claims/queue/list')
  public queue(@Query('status') status?: SuggestedClaim['status']): SuggestedClaim[] {
    return this.articlesService.listAllSuggestedClaims(status);
  }

  @Patch('suggested-claims/review/bulk')
  public bulkReview(@Body() dto: BulkReviewDto): SuggestedClaim[] {
    return this.articlesService.bulkReviewSuggestedClaims(dto.ids, dto.action, dto.sourceId);
  }

  @Patch('suggested-claims/:id/approve')
  public approve(@Param('id') id: string, @Body() dto: ApproveClaimDto): SuggestedClaim {
    return this.articlesService.approveSuggestedClaim(id, dto.sourceId);
  }

  @Patch('suggested-claims/:id/reject')
  public reject(@Param('id') id: string): SuggestedClaim {
    return this.articlesService.rejectSuggestedClaim(id);
  }
}
