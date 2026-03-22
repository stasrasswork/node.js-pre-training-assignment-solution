import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { Todo } from './types';
import { InMemoryRepository } from './repository';

export class ToDoManager {
  private repository: InMemoryRepository<Todo>;
  private api: TodoApi;
  private service: TodoService;

  constructor() {
    this.repository = new InMemoryRepository<Todo>();
    this.api = new TodoApi();
    this.service = new TodoService(this.api);
  }

  async init(): Promise<void> {
    await this.add('Welcome Task', 'Try adding more tasks!');
    await this.add('Complete me', 'Click the done command');
  }

  async add(title: string, description = ''): Promise<void> {
    await this.service.create(title, description);
  }

  async complete(id: number): Promise<void> {
    await this.service.toggleStatus(id);
  }

  async list(): Promise<Todo[]> {
    return await this.api.getAll();
  }
}

/*
Задание 10: Создание фасада ToDoManager

Описание:
Создайте единый класс, который соединяет все слои приложения
воедино и служит публичным API для вашей библиотеки или CLI-приложения.

Требования:
1. Реализуйте файл solutions/todo-manager.ts, экспортирующий класс ToDoManager.
2. Внутри класса инициализируйте (создайте экземпляры) InMemoryRepository, TodoApi и TodoService.
3. Предоставьте минимальный интерфейс (методы класса):
  - init(): Promise<void> — инициализация (загрузка начальных демо-данных через API в репозиторий).
  - add(title: string, description?: string): Promise<void> — добавление новой задачи.
  - complete(id: number): Promise<void> — отметка задачи как выполненной по её ID.
  - list(): Promise<Todo[]> — получение списка всех задач.
4. Создайте небольшой Node.js CLI (в файле solutions/index.ts), 
который использует process.argv (или другой легковесный способ) 
для приема команд из терминала и вызова соответствующих методов менеджера.
5. Запустите все тесты и убедитесь, что они выполняются успешно («горят зеленым»).
*/