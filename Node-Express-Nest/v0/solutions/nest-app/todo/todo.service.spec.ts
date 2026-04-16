import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should manage todos in service', () => {
    const created = service.addTodo('Test Todo');
    expect(created).toEqual(
      expect.objectContaining({
        id: 1,
        title: 'Test Todo',
        completed: false,
      })
    );
    expect(service.getTodos()).toHaveLength(1);

    const updated = service.updateTodo(created.id, {
      title: 'Updated Todo',
      completed: true,
    });
    expect(updated).toEqual(
      expect.objectContaining({
        id: created.id,
        title: 'Updated Todo',
        completed: true,
      })
    );

    const byId = service.getTodo(created.id);
    expect(byId).toEqual(
      expect.objectContaining({
        id: created.id,
        title: 'Updated Todo',
        completed: true,
      })
    );

    const searched = service.search({
      id: created.id,
      title: 'Updated',
      completed: true,
    });
    expect(searched).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: created.id,
          title: 'Updated Todo',
          completed: true,
        }),
      ])
    );

    const removed = service.deleteTodo(created.id);
    expect(removed).toEqual(
      expect.objectContaining({
        id: created.id,
      })
    );
    expect(service.getTodos()).toHaveLength(0);
    expect(() => service.getTodo(created.id)).toThrow('Todo not found');
  });
}); 