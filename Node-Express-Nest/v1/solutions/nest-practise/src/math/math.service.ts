import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MathService {
  constructor(private readonly loggerService: LoggerService) {}

  add(a: number, b: number): number {
    this.loggerService.log(`MathService.add called with ${a} and ${b}`);
    return a + b;
  }
}
