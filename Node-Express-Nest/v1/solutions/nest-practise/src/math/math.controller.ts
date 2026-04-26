import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { MathService } from './math.service';

@Controller('math')
export class MathController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly mathService: MathService,
  ) {}

  @Get('add')
  add(
    @Query('a', ParseIntPipe) a: number,
    @Query('b', ParseIntPipe) b: number,
  ) {
    return this.mathService.add(a, b);
  }
}
