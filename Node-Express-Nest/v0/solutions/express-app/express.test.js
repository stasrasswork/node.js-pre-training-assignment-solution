const request = require('supertest');
const app = require('./index');

describe('GET /todos', () => {
  it('responds with a list of todos', async () => {
    
    // TODO: implement test for GET /todos
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

  });
});

describe('POST /todos', () => {
  it('adds a new todo and returns it', async () => {
    // TODO: implement test for POST /todos
    const res = await request(app)
      .post('/todos')
      .send({ title: 'Test todo' });
      
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test todo');
  });
});

describe('Logging Middleware', () => {
  it('logs method and URL', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    await request(app).get('/todos');
    expect(logSpy).toHaveBeenCalledWith('GET /todos');

    await request(app).post('/todos').send({ title: 'Test todo' });
    expect(logSpy).toHaveBeenCalledWith('POST /todos');

    logSpy.mockRestore();
  });
});

describe('GET /todos/:id', () => {
  it('returns todo by id or 404', async () => {
    const res = await request(app).get('/todos/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: 1,
        title: 'Buy milk',
        completed: false,
      })
    );

  });

  it('returns 400 when id is not a number', async () => {
    const res = await request(app).get('/todos/abc');
   
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });
});

describe('Error Handler', () => {
  it('returns error JSON', async () => {
    // TODO: implement test for error handler
    let res = await request(app).get('/todos/99999');
    expect(res.status).toBe(500);
    expect(res.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );

    res = await request(app).post('/todos').send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });
});

describe('Static Files', () => {
  it('serves static files', async () => {
    const res = await request(app).get('/static/index.html');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });
});

describe('GET /todos/search', () => {
  it('filters todos by query params', async () => {
    const res = await request(app).get('/todos/search?completed=true');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          completed: true,
        })
      ])
    );

    res = await request(app).get('/todos/search?completed=false');
   
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          completed: false,
        })
      ])
    );
  });

  it('returns 400 when completed is not a boolean', async () => {
    res = await request(app).get('/todos/search?completed=abc');
    
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });

  it('returns 400 when id is not a number', async () => {
    res = await request(app).get('/todos/search?id=abc');
    
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });
}); 