import { Injectable } from '@nestjs/common';
import { ClaimsService } from '../claims/claims.service';
import { Claim } from '../claims/claim.types';
import { RagAskResponse, RagContext, RagSearchItem, RagSearchRequest } from './rag.types';

@Injectable()
export class RagService {
  public constructor(private readonly claimsService: ClaimsService) {}

  public search(request: RagSearchRequest): RagSearchItem[] {
    const q = request.query.toLowerCase().trim();
    const limit = request.limit ?? 10;

    const candidates = this.claimsService
      .findAll()
      .filter((claim) => this.matchesFilters(claim, request.filters))
      .map((claim) => ({ claim, score: this.relevanceScore(claim, q) }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return candidates.map(({ claim, score }) => ({
      claimId: claim.id,
      claimText: claim.claimText,
      claimType: claim.claimType,
      status: claim.status,
      sourceId: claim.sourceId,
      score,
    }));
  }

  public buildContext(question: string, filters?: RagSearchRequest['filters']): RagContext {
    const claims = this.search({ query: question, filters, limit: 5 });

    const unresolvedCount = claims.filter((c) => ['watching', 'unconfirmed', 'disputed'].includes(c.status)).length;
    const resolvedCount = claims.length - unresolvedCount;

    const summary =
      claims.length === 0
        ? 'No relevant claims found in local MVP memory.'
        : `Found ${claims.length} relevant claims (${resolvedCount} resolved, ${unresolvedCount} unresolved).`;

    const evidenceChecklist = [
      'Check claim status before stating certainty.',
      'Treat technical illegality claims as allegations unless officially confirmed.',
      'Highlight unresolved claims as pending/watching when appropriate.',
    ];

    return { question, summary, evidenceChecklist, claims };
  }

  public ask(question: string, filters?: RagSearchRequest['filters']): RagAskResponse {
    const context = this.buildContext(question, filters);
    const strong = context.claims.filter((c) => c.status === 'confirmed').length;
    const weak = context.claims.filter((c) => ['unconfirmed', 'watching', 'disputed'].includes(c.status)).length;

    const confidence: RagAskResponse['confidence'] =
      context.claims.length === 0 ? 'low' : strong > weak ? 'medium' : 'low';

    const answer = this.composeAnswer(context, confidence);

    return { answer, confidence, context };
  }

  private composeAnswer(context: RagContext, confidence: RagAskResponse['confidence']): string {
    if (context.claims.length === 0) {
      return 'Недостаточно данных в текущей базе claims. Добавьте источники, claims и evidence для более точного вывода.';
    }

    const top = context.claims[0];
    return `Текущий лучший матч: "${top.claimText}" (status: ${top.status}, type: ${top.claimType}). Уверенность: ${confidence}. Если статус не confirmed, трактуйте это как неподтверждённое утверждение.`;
  }

  private relevanceScore(claim: Claim, query: string): number {
    if (!query) return 0;
    const text = claim.claimText.toLowerCase();
    if (text.includes(query)) return 1;

    const tokens = query.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return 0;

    const hits = tokens.filter((token) => text.includes(token)).length;
    return hits / tokens.length;
  }

  private matchesFilters(claim: Claim, filters?: RagSearchRequest['filters']): boolean {
    if (!filters) return true;

    if (filters.claimTypes && filters.claimTypes.length > 0 && !filters.claimTypes.includes(claim.claimType)) {
      return false;
    }

    return true;
  }
}
