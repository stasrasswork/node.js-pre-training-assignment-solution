import { ToDoDto, CreateToDoDto, UpdateToDoDto } from './todo.dto';

describe('ToDoDto', () => {
  it('should match todo shape', () => {
    const dto: ToDoDto = {
      id: 1,
      title: 'Buy milk',
      completed: false,
    };
    expect(dto.id).toBe(1);
    expect(dto.title).toBe('Buy milk');
    expect(dto.completed).toBe(false);
  });
});

describe('CreateToDoDto', () => {
  it('should accept title field', () => {
    const createDto: CreateToDoDto = { title: 'Read docs' };
    expect(createDto.title).toBe('Read docs');
  });
});

describe('UpdateToDoDto', () => {
  it('should accept partial update fields', () => {
    const updateDto: UpdateToDoDto = { title: 'Updated title', completed: true };
    expect(updateDto.title).toBe('Updated title');
    expect(updateDto.completed).toBe(true);
  });
});