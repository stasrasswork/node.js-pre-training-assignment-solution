import { InMemoryRepository } from './repository';
import { Todo, NewTodo, TodoStatus } from './types';

export class TodoApi {
  private repo = new InMemoryRepository<Todo>();
  
  private delay = () => new Promise(r => setTimeout(r, 300 + Math.random() * 300));

  async getAll(): Promise<Todo[]> {
    await this.delay();
    const data = this.repo.findAll();
    return data;
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    await this.delay();
    
    const existingTodos = this.repo.findAll();
    const nextId = existingTodos.length > 0 ? Math.max(...existingTodos.map((t) => t.id)) + 1 : 1;

    const todo: Todo = {
      id: nextId,
      title: newTodo.title,
      description: newTodo.description,
      status: newTodo.status || TodoStatus.PENDING,
      createdAt: new Date(),
    }
    return this.repo.add(todo);
  }

  async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    await this.delay();
    const todo = this.repo.findById(id);
    if (!todo) {
      throw new TodoNotFoundError(id);
    }
    return this.repo.update(id, { ...todo, ...update });
  }

  async remove(id: number): Promise<void> {
    await this.delay();
    const todo = this.repo.findById(id);
    if (!todo) {
      throw new TodoNotFoundError(id);
    }
    this.repo.remove(id);
  }
}

class TodoNotFoundError extends Error {
  constructor(id: number) {
    super(`Todo with id ${id} not found`);  // добавь сообщение
    this.name = "TodoNotFoundError";
  }
}