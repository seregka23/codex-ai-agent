import { Body, Controller, Get, Post } from '@nestjs/common';
import { Claim } from './claim.types';
import { ClaimsService } from './claims.service';

@Controller('claims')
export class ClaimsController {
  public constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  public findAll(): Claim[] {
    return this.claimsService.findAll();
  }

  @Post()
  public create(@Body() payload: Omit<Claim, 'id'>): Claim {
    return this.claimsService.create(payload);
  }
}
