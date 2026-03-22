import { TodoApi } from './todo-api';
import { Todo, TodoStatus } from './types';

export class TodoService {
  constructor(private readonly api: TodoApi) {}

  async create(title: string, description = ''): Promise<Todo> {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      throw new Error("Title is required");
    }

    return this.api.add({
      title: normalizedTitle,
      description: description.trim(),
    });
  }

  async toggleStatus(id: number): Promise<Todo> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid todo id');
    }
    const todos = await this.api.getAll();
    const todo = todos.find(item => item.id === id); 
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    const nextStatus = 
      todo.status == TodoStatus.COMPLETED
      ? TodoStatus.PENDING
      : TodoStatus.COMPLETED;

    return this.api.update(id, {status: nextStatus});
  }

  async search(keyword: string): Promise<Todo[]> {
    const query = keyword.trim().toLowerCase();
    if (!query) {
      throw new Error("Keyword is required");
    }
    const todos = await this.api.getAll();

    return todos.filter(todo => {
      const titleMatch = todo.title.toLowerCase().includes(query);
      const descriptionMatch = (todo.description ?? "").toLowerCase().includes(query);

      return titleMatch || descriptionMatch;
    });
  }
}
