import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly loggerService: LoggerService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const start = Date.now();

    this.loggerService.log(`[${method} ${url}] Guard - checking access`);
    const result = request.headers['x-block-access'] !== 'true';
    
    const duration = Date.now() - start;
    this.loggerService.log(
      `[${method} ${url}] Guard - ${result ? 'allowed' : 'blocked'} (${duration}ms)`,
    );

    return result;
  }
}
