class TodoService {
  constructor() {
    this.todos = [];
    this.nextId = 1;
    this.initializeSampleData();
  }

  initializeSampleData() {
    const now = new Date().toISOString();
    this.todos = [
      {
        id: 1,
        title: "Buy milk",
        description: "Buy 1 liter of milk",
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        title: "Buy bread",
        description: "Buy 2 loaves of bread",
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        title: "Buy eggs",
        description: "Buy 12 eggs",
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
    ];
    this.nextId = 4;
  }

  getTodos(query = {}) {
    let list = [...this.todos];
    if (Object.prototype.hasOwnProperty.call(query, "completed")) {
      const completed = query.completed;
      if (completed !== "true" && completed !== "false") {
        const err = new Error("Invalid completed query parameter. Use true or false");
        err.status = 400;
        throw err;
      }
      list = list.filter((todo) => todo.completed === (completed === "true"));
    }
    return list;
  }

  getTodoById(id) {
    return this.todos.find((todo) => todo.id === Number(id)) || null;
  }

  createTodo(payload) {
    const title = payload?.title;
    if (typeof title !== "string" || title.trim() === "") {
      const err = new Error("Title must be a non-empty string");
      err.status = 400;
      throw err;
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, "description") &&
      typeof payload.description !== "string"
    ) {
      const err = new Error("Description must be a string and less than 500 characters");
      err.status = 400;
      throw err;
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, "completed") &&
      typeof payload.completed !== "boolean"
    ) {
      const err = new Error("Completed must be a boolean");
      err.status = 400;
      throw err;
    }

    const now = new Date().toISOString();
    const todo = {
      id: this.nextId++,
      title: title.trim(),
      description: typeof payload.description === "string" ? payload.description.trim() : "",
      completed: typeof payload.completed === "boolean" ? payload.completed : false,
      createdAt: now,
      updatedAt: now,
    };
    this.todos.push(todo);
    return todo;
  }

  updateTodo(id, payload) {
    const todo = this.getTodoById(id);
    if (!todo) return null;

    if (
      Object.prototype.hasOwnProperty.call(payload, "title") &&
      (typeof payload.title !== "string" || payload.title.trim() === "")
    ) {
      const err = new Error("Title must be a non-empty string");
      err.status = 400;
      throw err;
    }
    if (
      Object.prototype.hasOwnProperty.call(payload, "description") &&
      typeof payload.description !== "string"
    ) {
      const err = new Error("Description must be a string and less than 500 characters");
      err.status = 400;
      throw err;
    }
    if (
      Object.prototype.hasOwnProperty.call(payload, "completed") &&
      typeof payload.completed !== "boolean"
    ) {
      const err = new Error("Completed must be a boolean");
      err.status = 400;
      throw err;
    }

    if (Object.prototype.hasOwnProperty.call(payload, "title")) {
      todo.title = payload.title.trim();
    }
    if (Object.prototype.hasOwnProperty.call(payload, "description")) {
      todo.description = payload.description.trim();
    }
    if (Object.prototype.hasOwnProperty.call(payload, "completed")) {
      todo.completed = payload.completed;
    }
    todo.updatedAt = new Date().toISOString();
    return todo;
  }

  deleteTodo(id) {
    const idx = this.todos.findIndex((todo) => todo.id === Number(id));
    if (idx === -1) return null;
    const [deleted] = this.todos.splice(idx, 1);
    return deleted;
  }
}

module.exports = TodoService;
