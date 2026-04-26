import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entity/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async getAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async getOne(id: number): Promise<Todo> {
    const result = await this.todoRepository.findOneBy({ id });
    if (!result) {
      throw new NotFoundException('Todo not found');
    }
    return result;
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const result = await this.todoRepository.create(createTodoDto);
    return this.todoRepository.save(result);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const result = await this.todoRepository.update(id, updateTodoDto);
    if (result.affected === 0) {
      throw new NotFoundException('Todo not found');
    }
    return this.getOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Todo not found');
    }
  }
}
