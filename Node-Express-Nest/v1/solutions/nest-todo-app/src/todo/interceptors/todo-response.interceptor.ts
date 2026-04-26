import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { TodoResponseDto } from '../dto/todo-response.dto';

@Injectable()
export class TodoResponseInterceptor
  implements NestInterceptor<unknown, TodoResponseDto | TodoResponseDto[]>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<TodoResponseDto | TodoResponseDto[]> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return plainToInstance(TodoResponseDto, data, {
            excludeExtraneousValues: true,
          });
        }

        if (data && typeof data === 'object') {
          return plainToInstance(TodoResponseDto, data, {
            excludeExtraneousValues: true,
          });
        }

        return data as TodoResponseDto;
      }),
    );
  }
}