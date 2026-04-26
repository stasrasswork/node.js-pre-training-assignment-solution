import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoResponseInterceptor } from './interceptors/todo-response.interceptor';

@UseInterceptors(TodoResponseInterceptor)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getTodos(){
    return this.todoService.getAll();
  }

  @Get(':id')
  getTodo(@Param('id', ParseIntPipe) id: number){
    return this.todoService.getOne(id);
  }

  @Post()
  addTodo(@Body() createTodoDto: CreateTodoDto){
    return this.todoService.create(createTodoDto);
  }

  @Put(':id')
  updateTodo(@Param('id', ParseIntPipe) id: number, @Body() updateTodoDto: UpdateTodoDto){
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  deleteTodo(@Param('id', ParseIntPipe) id: number){
    return this.todoService.delete(id);
  }
}
