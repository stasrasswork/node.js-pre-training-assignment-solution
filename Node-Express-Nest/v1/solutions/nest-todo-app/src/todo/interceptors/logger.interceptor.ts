import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    const startTime = Date.now();
    
    return next.handle().pipe(
      tap((response) => {
        const responseTime = Date.now() - startTime;

        console.log({
          method: request.method,
          url: request.url,
          statusCode: response?.statusCode,
          responseTime: `${responseTime}ms`,
          data: response?.data,
        });
      }),
    );
  }
}