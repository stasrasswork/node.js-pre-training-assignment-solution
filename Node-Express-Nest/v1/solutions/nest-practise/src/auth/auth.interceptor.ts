import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const start = Date.now();

    this.loggerService.log(`[${method} ${url}] Interceptor - before handler`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.loggerService.log(
          `[${method} ${url}] Interceptor - after handler (${duration}ms)`,
        );
      }),
    );
  }
}
