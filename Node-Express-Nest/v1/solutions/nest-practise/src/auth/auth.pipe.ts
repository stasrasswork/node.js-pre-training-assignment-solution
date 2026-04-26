import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthPipe implements PipeTransform {
  constructor(private readonly loggerService: LoggerService) {}

  transform(value: any) {
    const start = Date.now();
    this.loggerService.log('AuthPipe - starting transformation');
    if (!value) {
      throw new BadRequestException('Input is required');
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('Input must be a string');
    }
    if (value.length < 3) {
      throw new BadRequestException('Input must be at least 3 characters long');
    }
    const normalizedValue = value.toLowerCase().trim();
    const duration = Date.now() - start;

    this.loggerService.log(
      `AuthPipe - normalized input "${normalizedValue}" (${duration}ms)`,
    );
    return normalizedValue;
  }
}
