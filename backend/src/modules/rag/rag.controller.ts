import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { RagAskResponse, RagContext, RagSearchItem, RagSearchRequest } from './rag.types';
import { RagService } from './rag.service';

interface RagAskRequest {
  question: string;
  filters?: RagSearchRequest['filters'];
}

@Public()
@Controller('rag')
export class RagController {
  public constructor(private readonly ragService: RagService) {}

  @Post('search')
  public search(@Body() request: RagSearchRequest): RagSearchItem[] {
    return this.ragService.search(request);
  }

  @Post('build-context')
  public buildContext(@Body() request: RagAskRequest): RagContext {
    return this.ragService.buildContext(request.question, request.filters);
  }

  @Post('ask')
  public ask(@Body() request: RagAskRequest): RagAskResponse {
    return this.ragService.ask(request.question, request.filters);
  }
}
