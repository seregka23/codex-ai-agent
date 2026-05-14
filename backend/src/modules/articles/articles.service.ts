import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClaimsService } from '../claims/claims.service';
import { Article, SuggestedClaim } from './article.types';

@Injectable()
export class ArticlesService {
  private readonly articles: Article[] = [];
  private readonly suggestedClaims: SuggestedClaim[] = [];

  public constructor(private readonly claimsService: ClaimsService) {}

  public list(): Article[] {
    return this.articles;
  }

  public findOne(id: string): Article {
    const article = this.articles.find((item) => item.id === id);
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  public create(payload: Omit<Article, 'id' | 'importedAt'>): Article {
    const rawText = payload.rawText ?? '';
    const article: Article = {
      id: randomUUID(),
      importedAt: new Date().toISOString(),
      ...payload,
      summary: payload.summary ?? this.autoSummary(rawText),
      entities: payload.entities ?? this.extractEntities(rawText),
    };
    this.articles.push(article);
    return article;
  }

  public extractClaims(articleId: string): SuggestedClaim[] {
    const article = this.findOne(articleId);
    const rawText = article.rawText ?? '';
    const lines = rawText.split(/[\n\.\!\?]/).map((line) => line.trim()).filter(Boolean);

    const created: SuggestedClaim[] = [];
    for (const line of lines) {
      if (!this.looksLikeClaim(line)) continue;
      const suggested: SuggestedClaim = {
        id: randomUUID(),
        articleId,
        claimText: line,
        claimType: this.detectClaimType(line),
        status: 'draft',
        reason: 'Auto-suggested from article text pattern.',
        createdAt: new Date().toISOString(),
      };
      this.suggestedClaims.push(suggested);
      created.push(suggested);
    }

    return created;
  }

  public listSuggestedClaims(articleId: string): SuggestedClaim[] {
    this.findOne(articleId);
    return this.suggestedClaims.filter((item) => item.articleId === articleId);
  }


  public listAllSuggestedClaims(status?: SuggestedClaim['status']): SuggestedClaim[] {
    if (!status) return this.suggestedClaims;
    return this.suggestedClaims.filter((item) => item.status === status);
  }

  public bulkReviewSuggestedClaims(
    ids: string[],
    action: 'approve' | 'reject',
    sourceId?: string,
  ): SuggestedClaim[] {
    return ids.map((id) => {
      if (action === 'approve') {
        if (!sourceId) throw new NotFoundException('sourceId is required for bulk approve');
        return this.approveSuggestedClaim(id, sourceId);
      }
      return this.rejectSuggestedClaim(id);
    });
  }
  public approveSuggestedClaim(id: string, sourceId: string): SuggestedClaim {
    const suggested = this.findSuggestedClaim(id);
    suggested.status = 'approved';

    this.claimsService.create({
      sourceId,
      claimText: suggested.claimText,
      claimType: suggested.claimType,
      status: 'unconfirmed',
      legalSensitivity: suggested.claimType === 'technical_illegality' ? 'high' : 'normal',
    });

    return suggested;
  }

  public rejectSuggestedClaim(id: string): SuggestedClaim {
    const suggested = this.findSuggestedClaim(id);
    suggested.status = 'rejected';
    return suggested;
  }

  private findSuggestedClaim(id: string): SuggestedClaim {
    const suggested = this.suggestedClaims.find((item) => item.id === id);
    if (!suggested) throw new NotFoundException('Suggested claim not found');
    return suggested;
  }

  private autoSummary(rawText: string): string {
    if (!rawText.trim()) return 'No text provided.';
    return rawText.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ').slice(0, 280);
  }

  private extractEntities(rawText: string): Article['entities'] {
    const teams = ['ferrari', 'mercedes', 'red bull', 'mclaren', 'aston martin', 'williams', 'alpine'];
    const drivers = ['max verstappen', 'lewis hamilton', 'charles leclerc', 'lando norris', 'george russell'];

    const lower = rawText.toLowerCase();
    const detectedTeams = teams.filter((team) => lower.includes(team)).map((team) => this.titleCase(team));
    const detectedDrivers = drivers.filter((driver) => lower.includes(driver)).map((driver) => this.titleCase(driver));

    return { teams: detectedTeams, drivers: detectedDrivers, people: [...detectedDrivers] };
  }

  private looksLikeClaim(text: string): boolean {
    const lower = text.toLowerCase();
    return ['will', 'expected', 'rumor', 'claims', 'alleges', 'investigation', 'update'].some((token) =>
      lower.includes(token),
    );
  }

  private detectClaimType(text: string): SuggestedClaim['claimType'] {
    const lower = text.toLowerCase();
    if (lower.includes('driver') || lower.includes('contract') || lower.includes('mercedes')) return 'driver_market';
    if (lower.includes('wing') || lower.includes('floor') || lower.includes('update')) return 'technical_update';
    if (lower.includes('illegal') || lower.includes('investigation') || lower.includes('directive'))
      return 'technical_illegality';
    if (lower.includes('regulation') || lower.includes('fia')) return 'regulation_change';
    if (lower.includes('principal') || lower.includes('politic')) return 'team_politics';
    return 'other';
  }

  private titleCase(value: string): string {
    return value
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
