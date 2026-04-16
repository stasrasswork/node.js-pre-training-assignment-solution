// NestJS Service for ToDos
import { Injectable } from '@nestjs/common';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
}
@Injectable()
export class TodosService {
  private todos = [
    { id: 1, title: 'Buy milk', completed: false },
    { id: 2, title: 'Buy bread', completed: true },
    { id: 3, title: 'Buy chicken', completed: false }
  ]
  getTodos(): Todo[]{
    return this.todos;
  }
  addTodo(title: string): Todo {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      title: title,
      completed: false
    }
    this.todos.push(newTodo);
    return newTodo;
  }
  markCompleted(id: number): Todo{
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.completed = true;
    return todo;
  }
  // TODO: implement todos storage and methods (getTodos, addTodo, markCompleted)
} 