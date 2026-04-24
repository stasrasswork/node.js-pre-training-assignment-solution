const http = require("http");
const url = require("url");

/**
 * Todo REST API Server
 * Built with Node.js built-in HTTP module
 * Supports full CRUD operations with in-memory storage
 */

/**
 * Parse JSON request body from HTTP request
 * @param {IncomingMessage} req - HTTP request object
 * @returns {Promise<Object>} Parsed JSON data
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });
    
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        const json = JSON.parse(body);
        resolve(json);
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

/**
 * Extract path parameters from URL pattern
 * @param {string} pattern - URL pattern like '/todos/:id'
 * @param {string} path - Actual path like '/todos/123'
 * @returns {Object} Extracted parameters like { id: "123" }
 */
function parsePathParams(pattern, path) {
  const params = {};

  const patternParts = pattern.split("/");
  const pathParts = path.split("/");
  
  if (patternParts.length !== pathParts.length) return null;
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    }
  }
  if (Object.keys(params).length === 0) return null;

  return params;
}

/**
 * Send consistent JSON response
 * @param {ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 */
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  if (statusCode === 204) {
    return res.end();
  }

  return res.end(JSON.stringify(data));
}

/**
 * Validate todo data according to business rules
 * @param {Object} todoData - Todo data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} Validation result with errors array
 */
function validateTodo(todoData, isUpdate = false) {
  const errors = [];

  const hasTitle = Object.prototype.hasOwnProperty.call(todoData, "title");
  const hasDescription = Object.prototype.hasOwnProperty.call(todoData, "description");
  const hasCompleted = Object.prototype.hasOwnProperty.call(todoData, "completed");

  if (!isUpdate && !hasTitle) {
    errors.push("Title is required");
  }

  if (hasTitle) {
    if (typeof todoData.title !== "string" || todoData.title.trim() === "") {
      errors.push("Title must be a non-empty string");
    } else if (todoData.title.length < 1 || todoData.title.length > 100) {
      errors.push("Title must be between 1 and 100 characters");
    }
  }

  if (hasDescription) {
    if (typeof todoData.description !== "string" || todoData.description.length > 500) {
      errors.push("Description must be a string and less than 500 characters");
    }
  }

  if (hasCompleted && typeof todoData.completed !== "boolean") {
    errors.push("Completed must be a boolean");
  }

  return { isValid: errors.length === 0, errors};
}

/**
 * TodoServer Class - Main HTTP server for Todo API
 */
class TodoServer {
  constructor(port = 3000) {
    this.port = port;
    this.todos = [];
    this.nextId = 1;

    // Sample todos for testing
    this.initializeSampleData();
    this.nextId = this.generateNextId();
  }

  /**
   * Initialize server with sample todo data
   */
  initializeSampleData() {
    const sampleTodos = [
      {id: 1, title: "Buy milk", description: "Buy 1 liter of milk", completed: false, createdAt: new Date(), updatedAt: new Date()},
      {id: 2, title: "Buy bread", description: "Buy 2 loaves of bread", completed: false, createdAt: new Date(), updatedAt: new Date()},
      {id: 3, title: "Buy eggs", description: "Buy 12 eggs", completed: false, createdAt: new Date(), updatedAt: new Date()},
    ];
    
    this.todos = sampleTodos;
  }

  /**
   * Start the HTTP server
   */
  start() {
    const server = http.createServer((req, res) => {
      loggerMiddleware(req, res, () => {
        this.handleRequest.bind(this)(req, res);
      });
    });
    
    server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
    
    server.on("error", (error) => {
      console.error("Server error:", error);
    });
  }

  /**
   * Main request handler - routes requests to appropriate methods
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async handleRequest(req, res) {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const pathname = parsedUrl.pathname;
      const query = Object.fromEntries(parsedUrl.searchParams.entries());
      const method = req.method;

      if (method === "OPTIONS") {
        this.handleCORS(req, res);
        return;
      }
      switch (method) {
        case "GET":
          if (pathname === "/todos") {
            return this.getAllTodos(req, res, query);
          } else if (pathname.startsWith("/todos/")) {
            return this.getTodoById(req, res, pathname.split("/").pop());
          } else {
            return sendResponse(res, 404, { success: false, error: "Not found" });
          }
        case "POST":
          return this.createTodo(req, res);
        case "PUT":
          return this.updateTodo(req, res, pathname.split("/").pop());
        case "DELETE":
          return this.deleteTodo(req, res, pathname.split("/").pop());
        default:
          return sendResponse(res, 404, { success: false, error: "Unknown route" });
      }
    } catch (error) {
      console.error("Request handling error:", error);
      sendResponse(res, 500, {
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * Handle GET /todos - Get all todos with optional filtering
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} query - URL query parameters
   */
  async getAllTodos(req, res, query) {
    let filteredTodos = [...this.todos];

    if (query && Object.prototype.hasOwnProperty.call(query, "completed")) {
      if (query.completed !== "true" && query.completed !== "false") {
        return sendResponse(res, 400, {
          success: false,
          error: "Invalid completed query parameter. Use true or false",
        });
      }

      const completedValue = query.completed === "true";
      filteredTodos = filteredTodos.filter((todo) => todo.completed === completedValue);
    }

    return sendResponse(res, 200, {
      success: true,
      data: filteredTodos,
      count: filteredTodos.length,
    });
  }

  /**
   * Handle GET /todos/:id - Get specific todo by ID
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async getTodoById(req, res, params) {
    const id = this.parseId(params);
    if (id === -1) {
      return sendResponse(res, 400, {
        success: false,
        error: "Invalid ID format. Must be a number",
      });
    }

    const todo = this.findTodoById(id);
    if (!todo) {
      return sendResponse(res, 404, {
        success: false,
        error: "Todo not found",
      });
    }

    return sendResponse(res, 200, {
      success: true,
      data: todo,
    });
  }

  /**
   * Handle POST /todos - Create new todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async createTodo(req, res) {
    const todoData = await parseBody(req);
    const validationResult = validateTodo(todoData);
    if (!validationResult.isValid) {
      return sendResponse(res, 400, {
        success: false,
        error: validationResult.errors.join(", "),
      });
    }

    const newTodo = {
      id: this.generateNextId(),
      title: todoData.title.trim(),
      description: todoData.description?.trim() ?? "",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.todos.push(newTodo);
    
    sendResponse(res, 201, {
      success: true,
      data: newTodo,
    });
  }

  /**
   * Handle PUT /todos/:id - Update existing todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async updateTodo(req, res, params) {
    const id = this.parseId(params);
    if (id === -1) {
      return sendResponse(res, 400, {
        success: false,
        error: "Invalid ID format. Must be a number",
      });
    }

    const todoIndex = this.findTodoIndexById(id);
    if (todoIndex === -1) {
      return sendResponse(res, 404, {
        success: false,
        error: "Todo not found",
      });
    }

    const todo = this.todos[todoIndex];

    const todoData = await parseBody(req);
    const validationResult = validateTodo(todoData, true);
    if (!validationResult.isValid) {
      return sendResponse(res, 400, {
        success: false,
        error: validationResult.errors.join(", "),
      });
    }

    const updatedTodo = {
      ...todo,
      ...todoData,
      updatedAt: new Date(),
    };
    this.todos[todoIndex] = updatedTodo;

    sendResponse(res, 200, {
      success: true,
      data: updatedTodo,
    });
  }

  /**
   * Handle DELETE /todos/:id - Delete todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async deleteTodo(req, res, params) {
    const id = this.parseId(params);
    if (id === -1) {
      return sendResponse(res, 400, {
        success: false,
        error: "Invalid ID format. Must be a number",
      });
    }

    const todoIndex = this.findTodoIndexById(id);
    if (todoIndex === -1) {
      return sendResponse(res, 404, {
        success: false,
        error: "Todo not found",
      });
    }

    this.todos.splice(todoIndex, 1);

    sendResponse(res, 200, {
      success: true,
      message: "Todo deleted successfully",
    });
  }

  /**
   * Handle CORS preflight requests
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  handleCORS(req, res) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
  }

  /**
   * Find todo by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {Object|null} Found todo or null
   */
  findTodoById(id) {
    const numId = this.parseId(id);
    if (numId === -1) {
      return null;
    }

    return this.todos.find((todo) => todo.id === numId);
  }

  /**
   * Find todo index by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {number} Todo index or -1 if not found
   */
  findTodoIndexById(id) {
    const numId = this.parseId(id);
    if (numId === -1) {
      return -1;
    }

    return this.todos.findIndex((todo) => todo.id === numId);
  }

  /**
   * Parse ID from request parameters
   * @param {number|string|object} id - Todo ID or object with id property
   * @returns {number} Parsed ID or -1 if invalid
   */
  parseId(id) {
    const rawId = typeof id === "object" && id !== null ? id.id : id;
    const numId = parseInt(rawId, 10);
    if (isNaN(numId)) {
      return -1;
    }
    return numId;
  }

  /**
   * Generate next available ID
   * @returns {number} Next ID
   */
  generateNextId() {
    return this.nextId === 0 ? 1 : Math.max(...this.todos.map(todo => todo.id)) + 1;
  }
}

// Export the TodoServer class
module.exports = TodoServer;

// Example usage (for testing):
const isReadyToTest = false;

if (isReadyToTest) {
  // Start server for testing
  const server = new TodoServer(3000);
  server.start();

  console.log("🚀 Todo Server starting...");
  console.log("📝 Replace TODO comments with implementation");
  console.log("🧪 Run task-04-test.js to verify functionality");
}

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

// If this file is run directly, start the server
if (require.main === module) {
  const server = new TodoServer(3000);
  server.start();
}
