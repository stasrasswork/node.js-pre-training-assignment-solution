import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateToDoDto } from './todo.dto';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
}
@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  
  getTodos() {
    return this.todos;
  }

  addTodo(title: string) {
    const newTodo: Todo = {
      id: this.todos.length !== 0 ? Math.max(...this.todos.map(todo => todo.id)) + 1 : 1,
      title: title.trim(),
      completed: false,
    }

    this.todos.push(newTodo);
    return newTodo;
  }

  updateTodo(id: number, update: UpdateToDoDto) {
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    todo.title = update.title ?? todo.title;
    todo.completed = update.completed ?? todo.completed;

    return todo;
  }

  deleteTodo(id: number) {
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    this.todos.splice(this.todos.indexOf(todo), 1);
    return todo;
  }

  getTodo(id: number) {
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  search(query: any) {
    const { id, title, completed } = query;
    return this.todos.filter((todo) => {
      const matchesId = id === undefined || todo.id === id;
      const matchesTitle =
        title === undefined || todo.title.toLowerCase().includes(title.toLowerCase());
      const matchesCompleted = completed === undefined || todo.completed === completed;
      return matchesId && matchesTitle && matchesCompleted;
    });
  }
} 