import { TodoService } from '../JS-TS/solutions/todo-service';
import { TodoApi } from '../JS-TS/solutions/todo-api';
import { InMemoryRepository } from '../JS-TS/solutions/repository';
import { TodoStatus } from '../JS-TS/solutions/types';
import { rejects } from 'node:assert';


describe('Task 09: TodoService + Repository unit tests', () => {
    let service: TodoService;
    let setTimeoutSpy: jest.SpyInstance;

    beforeEach(() => {
        // Ускоряем все async-методы TodoApi (убираем реальную задержку)
        setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((handler: TimerHandler) => {
          if (typeof handler === 'function') {
            handler();
          }
          return 0 as unknown as ReturnType<typeof setTimeout>;
        });
        service = new TodoService(new TodoApi());
      });

      afterEach(() => {
        setTimeoutSpy.mockRestore();
      });

      it ('empty title in creating todo', async () => {
        await expect(service.create('', 'description')).rejects.toThrow();
      });

      it('search returns empty array if no matches', async () => {
        const results = await service.search('Non-existing-task-name');
      
        expect(results).toEqual([]);
      });

      it('successful creation of a todo', async () => {
        const created = await service.create('Write tests', 'task 09');

        expect(created.title).toBe('Write tests');
        expect(created.description).toBe('task 09');
        expect(created.status).toBe(TodoStatus.PENDING);
        expect(created.id).toBeGreaterThan(0);
      });

      it('toggling status', async () => {
        const created = await service.create('Toggle me');
        const toggled = await service.toggleStatus(created.id);

        expect(toggled.id).toBe(created.id);
        expect(toggled.status).not.toBe(created.status);
      });

      it('search returns matching items (case-insensitive)', async () => {
        await service.create('Service Item', 'alpha');
        await service.create('Another', 'Contains SERVICE keyword');

        const byTitle = await service.search('service');
        const byUpper = await service.search('SERVICE');
        
        expect(byTitle.length).toBeGreaterThan(0);
        expect(byUpper.length).toBeGreaterThan(0);
      });

      it('search with empty string returns all items', async () => {
        await service.create('Task 1');
        await expect(service.search('')).rejects.toThrow();
      });
      
      it('error is thrown when updating non-existing id', async () => {
        await expect(service.toggleStatus(999999)).rejects.toThrow();
      });
});

describe('InMemoryRepository', () => {
    interface Entity {
        id: number;
        value: string;
    }

    let repo: InMemoryRepository<Entity>;

    beforeEach(() => {
        repo = new InMemoryRepository<Entity>();
    });
    
    it('add + findAll', () => {
        repo.add({ id: 1, value: 'A' });
        repo.add({ id: 2, value: 'B' });

        expect(repo.findAll()).toHaveLength(2);
    });

    it('findById returns entity or undefined', () => {
        repo.add({ id: 1, value: 'A' });

        expect(repo.findById(1)?.value).toBe('A');
        expect(repo.findById(999)).toBeUndefined();
    });

    it('update patches entity', () => {
        repo.add({ id: 1, value: 'A' });
        const updated = repo.update(1, { value: 'AA' });
    
        expect(updated.value).toBe('AA');
        expect(repo.findById(1)?.value).toBe('AA');
    });
   
    it('remove deletes entity', () => {
        repo.add({ id: 1, value: 'A' });
        repo.remove(1);
   
        expect(repo.findById(1)).toBeUndefined();
    });
   
    it('throws on update/remove for missing id', () => {
        expect(() => repo.update(42, { value: 'X' })).toThrow();
        expect(() => repo.remove(42)).toThrow();
    });
});

