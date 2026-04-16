import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { TodoService } from './todo.service';
import { CreateToDoDto, UpdateToDoDto } from './todo.dto';
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAll() {
    return this.todoService.getTodos();
  }

  @Post()
  create(@Body() body: CreateToDoDto) {
    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    if (!title) {
      throw new BadRequestException('Title is required');
    }
    return this.todoService.addTodo(title);
  }

  @Get('search')
  search(@Query() query: any) {
    const parsedQuery: { id?: number; title?: string; completed?: boolean } = {};

    if (query.id !== undefined) {
      const id = Number(query.id);
      if (!Number.isInteger(id) || id < 1) {
        throw new BadRequestException("Query 'id' must be a positive integer");
      }
      parsedQuery.id = id;
    }

    if (query.title !== undefined) {
      if (typeof query.title !== 'string' || query.title.trim() === '') {
        throw new BadRequestException("Query 'title' must be a non-empty string");
      }
      parsedQuery.title = query.title.trim();
    }

    if (query.completed !== undefined) {
      if (query.completed === 'true') {
        parsedQuery.completed = true;
      } else if (query.completed === 'false') {
        parsedQuery.completed = false;
      } else {
        throw new BadRequestException("Query 'completed' must be 'true' or 'false'");
      }
    }

    return this.todoService.search(parsedQuery);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.getTodo(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateToDoDto) {
    const hasTitle = Object.prototype.hasOwnProperty.call(body, 'title');
    const hasCompleted = Object.prototype.hasOwnProperty.call(body, 'completed');

    if (!hasTitle && !hasCompleted) {
      throw new BadRequestException('Provide title or completed to update');
    }

    const updates: UpdateToDoDto = {};

    if (hasTitle) {
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      if (!title) {
        throw new BadRequestException('Title must be a non-empty string');
      }
      updates.title = title;
    }

    if (hasCompleted) {
      if (typeof body.completed !== 'boolean') {
        throw new BadRequestException('Completed must be a boolean');
      }
      updates.completed = body.completed;
    }

    return this.todoService.updateTodo(id, updates);
  }
} 