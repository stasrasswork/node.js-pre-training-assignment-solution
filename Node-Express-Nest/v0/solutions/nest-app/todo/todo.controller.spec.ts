import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const service = new TodoService();
    controller = new TodoController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return todos from controller', () => {
    expect(Array.isArray(controller.getAll())).toBe(true);
  });

  it('should return todo by id or 404', () => {
    const created = controller.create({ title: 'Buy milk' });
    const found = controller.getById(created.id);
  
    expect(found).toEqual(
      expect.objectContaining({
        id: created.id,
        title: 'Buy milk',
        completed: false,
      })
    );
  });

  it('should filter todos by query params', () => {
    const first = controller.create({ title: 'Buy milk' });
    controller.update(first.id, { completed: true });
    controller.create({ title: 'Buy bread' });
    controller.create({ title: 'Buy eggs' });

    const completedTrue = controller.search({ completed: 'true' });
    expect(Array.isArray(completedTrue)).toBe(true);
    expect(completedTrue).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          completed: true,
        }),
      ])
    );

    const byTitle = controller.search({ title: 'Buy milk' });
    expect(byTitle).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Buy milk',
          completed: true,
        }),
      ])
    );
  });

  it('should update todo', () => {
    const created = controller.create({ title: 'Buy milk' });
    const updated = controller.update(created.id, { title: 'Buy bread', completed: true });
    expect(updated).toEqual(
      expect.objectContaining({
        id: created.id,
        title: 'Buy bread',
        completed: true,
      })
    );
  });
}); 