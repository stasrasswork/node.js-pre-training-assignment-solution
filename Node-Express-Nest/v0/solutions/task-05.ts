// NestJS Controller for /todos
import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { TodosService } from './task-06';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}
  @Get()
  getTodos() {
    return this.todosService.getTodos();
  }
  @Post()
  addTodo(@Body('title') title: string) {
    return this.todosService.addTodo(title);
  }
  @Put(':id')
  markCompleted(@Param('id') id: number) {
    return this.todosService.markCompleted(id);
  }
} 