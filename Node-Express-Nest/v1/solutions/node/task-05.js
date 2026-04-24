/**
 * task-05.js
 * Extend your Task 04 server by adding EventEmitter functionality,
 * logging, analytics, and new endpoints.
 *
 * Implement all TODOs below.
 */

const http = require("http");
const { EventEmitter } = require("events");

// ---------- Utilities ----------

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(data);
}

function parseIdFromPath(pathname) {
  const m = pathname.match(/^\/todos\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function nowISO() {
  return new Date().toISOString();
}

// ---------- Analytics ----------

class AnalyticsTracker {
  constructor() {
    this.stats = {
      totalCreated: 0,
      totalUpdated: 0,
      totalDeleted: 0,
      totalViews: 0,
      errors: 0,
      dailyStats: {},
    };
  }
  _bumpDaily(field) {
    const date = new Date().toISOString().split("T")[0];
    if (!this.stats.dailyStats[date]) {
      this.stats.dailyStats[date] = {
        created: 0,
        updated: 0,
        deleted: 0,
        views: 0,
        errors: 0,
      };
    }
    this.stats.dailyStats[date][field]++;
  }
  trackCreated() {
    this.stats.totalCreated++;
    this._bumpDaily("created");
  }
  trackUpdated() {
    this.stats.totalUpdated++;
    this._bumpDaily("updated");
  }
  trackDeleted() {
    this.stats.totalDeleted++;
    this._bumpDaily("deleted");
  }
  trackViewed() {
    this.stats.totalViews++;
    this._bumpDaily("views");
  }
  trackError() {
    this.stats.errors++;
    this._bumpDaily("errors");
  }
  getStats() {
    return this.stats;
  }
}

// ---------- Console Logger ----------
class ConsoleLogger {
  todoCreated(data) {
    console.log(
      `📝 [${data.timestamp}] Created "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }
  todoUpdated(data) {
    console.log(
      `✏️  [${data.timestamp}] Updated ID ${
        data.newTodo.id
      }; changed: ${data.changes.join(", ")}`
    );
  }
  todoDeleted(data) {
    console.log(
      `🗑️  [${data.timestamp}] Deleted "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }
  todoViewed(data) {
    console.log(`👁️  [${data.timestamp}] Viewed ID ${data.todo.id}`);
  }
  todosListed(data) {
    console.log(`📃 [${data.timestamp}] Listed todos count=${data.count}`);
  }
  todoNotFound(data) {
    console.warn(
      `⚠️  [${data.timestamp}] Not found: id=${data.todoId} op=${data.operation}`
    );
  }
  validationError(data) {
    console.error(
      `❌ [${data.timestamp}] Validation error: ${data.errors.join(", ")}`
    );
  }
  serverError(data) {
    console.error(
      `💥 [${data.timestamp}] Server error in ${data.operation}: ${
        data.error && data.error.message
      }`
    );
  }
}

// ---------- Validation ----------
function validateTodoPayload(payload, isCreate = false) {
  const errors = [];
  const out = {};

  const hasTitle = Object.prototype.hasOwnProperty.call(payload, "title");
  const hasDescription = Object.prototype.hasOwnProperty.call(payload, "description");
  const hasCompleted = Object.prototype.hasOwnProperty.call(payload, "completed");

  if (isCreate && !hasTitle) {
    errors.push("Title is required");
  }

  if (hasTitle) {
    if (typeof payload.title !== "string" || payload.title.trim() === "") {
      errors.push("Title must be a non-empty string");
    }
  }
  if (hasDescription) {
    if (typeof payload.description !== "string" || payload.description.length > 500) {
      errors.push("Description must be a string and less than 500 characters");
    }
  }

  if (hasCompleted && typeof payload.completed !== "boolean") {
    errors.push("Completed must be a boolean");
  }

  if (errors.length > 0) return { errors, values: out };

  if (hasTitle) out.title = payload.title.trim();
  if (hasDescription) out.description = payload.description.trim();
  if (hasCompleted) out.completed = payload.completed;

  if (isCreate && !hasCompleted) {
    out.completed = false;
  }

  return { errors, values: out };
}

class TodoServer extends EventEmitter {
  constructor(port = 3000) {
    super();
    this.port = port;
    this.todos = [];
    this.nextId = 1;

    this.analytics = new AnalyticsTracker();
    this.logger = new ConsoleLogger();
    this.recentEvents = [];
    
    this.server = null;

    this._wireDefaultListeners();
  }

  _wireDefaultListeners() {
    const remember = (eventType) => (data) => {
      this.recentEvents.push({ eventType, timestamp: nowISO(), data });
      if (this.recentEvents.length > 100) this.recentEvents.shift();
    };
    // Remember all key events for /events
    [
      "todoCreated",
      "todoUpdated",
      "todoDeleted",
      "todoViewed",
      "todosListed",
      "todoNotFound",
      "validationError",
      "serverError",
    ].forEach((evt) => this.on(evt, remember(evt)));

    // Logging
    this.on("todoCreated", (d) => this.logger.todoCreated(d));
    this.on("todoUpdated", (d) => this.logger.todoUpdated(d));
    this.on("todoDeleted", (d) => this.logger.todoDeleted(d));
    this.on("todoViewed", (d) => this.logger.todoViewed(d));
    this.on("todosListed", (d) => this.logger.todosListed(d));
    this.on("todoNotFound", (d) => this.logger.todoNotFound(d));
    this.on("validationError", (d) => this.logger.validationError(d));
    this.on("serverError", (d) => this.logger.serverError(d));

    // Analytics
    this.on("todoCreated", () => this.analytics.trackCreated());
    this.on("todoUpdated", () => this.analytics.trackUpdated());
    this.on("todoDeleted", () => this.analytics.trackDeleted());
    this.on("todoViewed", () => this.analytics.trackViewed());
    this.on("validationError", () => this.analytics.trackError());
    this.on("serverError", () => this.analytics.trackError());
  }

  /**
   * Start the server
   */
  async start() {
    if (this.server) return;

    this.server = http.createServer((req, res) => {
      this._handleRequest(req, res);
    });

    this.server.on("error", (error) => {
      console.error("Server error:", error);
    });

    await new Promise((resolve, reject) => {
      this.server.listen(this.port, () => {
        const actualPort = this.server.address()?.port ?? this.port;
        console.log(`Server is running on port ${actualPort}`);
        resolve();
      });
      this.server.once("error", reject);
    });
  }

  /**
   * Stop the server
   */
  async stop() {
    if (!this.server) return;

    const server = this.server;
    this.server = null;

    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  /**
   * Handle incoming requests
   */
  async _handleRequest(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const requestInfo = {
      method,
      url: req.url,
      userAgent: req.headers["user-agent"] || "",
      ip: req.socket?.remoteAddress || "",
    };

    if (method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      return res.end();
    }

    try {
      if (method === "GET" && pathname === "/analytics") {
        return sendJson(res, 200, { success: true, data: this.analytics.getStats() });
      }

      if (method === "GET" && pathname === "/events") {
        const rawLast = parsedUrl.searchParams.get("last");
        const last = rawLast === null ? 10 : Number(rawLast);
        if (!Number.isFinite(last) || last < 1) {
          this.emit("validationError", {
            errors: ["Query param 'last' must be a positive number"],
            data: { last: rawLast },
            timestamp: nowISO(),
            requestInfo,
          });
          return sendJson(res, 400, {
            success: false,
            error: "Query param 'last' must be a positive number",
          });
        }
        return sendJson(res, 200, {
          success: true,
          data: this.recentEvents.slice(-Math.min(last, 100)),
        });
      }

      if (method === "GET" && pathname === "/todos") {
        let list = [...this.todos];
        const completedFilter = parsedUrl.searchParams.get("completed");
        if (completedFilter !== null) {
          if (completedFilter !== "true" && completedFilter !== "false") {
            this.emit("validationError", {
              errors: ["Query param 'completed' must be true or false"],
              data: { completed: completedFilter },
              timestamp: nowISO(),
              requestInfo,
            });
            return sendJson(res, 400, {
              success: false,
              error: "Query param 'completed' must be true or false",
            });
          }
          list = list.filter((todo) => todo.completed === (completedFilter === "true"));
        }
        this.emit("todosListed", {
          todos: list,
          count: list.length,
          filters: { completed: completedFilter },
          timestamp: nowISO(),
          requestInfo,
        });
        return sendJson(res, 200, { success: true, data: list, count: list.length });
      }

      const todoPathMatch = pathname.match(/^\/todos\/(.+)$/);
      if (todoPathMatch && parseIdFromPath(pathname) === null) {
        const rawTodoId = todoPathMatch[1];
        this.emit("todoNotFound", {
          todoId: rawTodoId,
          operation: `${method} /todos/:id`,
          timestamp: nowISO(),
          requestInfo,
        });
        return sendJson(res, 404, { success: false, error: "Todo not found" });
      }

      const todoId = parseIdFromPath(pathname);

      if (method === "GET" && todoId !== null) {
        const todo = this.todos.find((item) => item.id === todoId);
        if (!todo) {
          this.emit("todoNotFound", {
            todoId,
            operation: "GET /todos/:id",
            timestamp: nowISO(),
            requestInfo,
          });
          return sendJson(res, 404, { success: false, error: "Todo not found" });
        }
        this.emit("todoViewed", { todo, timestamp: nowISO(), requestInfo });
        return sendJson(res, 200, { success: true, data: todo });
      }

      if (method === "POST" && pathname === "/todos") {
        let payload;
        try {
          payload = await parseBody(req);
        } catch (err) {
          this.emit("validationError", {
            errors: [err.message],
            data: null,
            timestamp: nowISO(),
            requestInfo,
          });
          return sendJson(res, 400, { success: false, error: err.message });
        }

        const { errors, values } = validateTodoPayload(payload, true);
        if (errors.length > 0) {
          this.emit("validationError", {
            errors,
            data: payload,
            timestamp: nowISO(),
            requestInfo,
          });
          return sendJson(res, 400, { success: false, error: errors.join(", ") });
        }

        const now = nowISO();
        const todo = {
          id: this.nextId++,
          title: values.title,
          description: values.description || "",
          completed: values.completed,
          createdAt: now,
          updatedAt: now,
        };
        this.todos.push(todo);
        this.emit("todoCreated", { todo, timestamp: nowISO(), requestInfo });
        return sendJson(res, 201, { success: true, data: todo });
      }

      if (method === "PUT" && todoId !== null) {
        const idx = this.todos.findIndex((item) => item.id === todoId);
        if (idx === -1) {
          this.emit("todoNotFound", {
            todoId,
            operation: "PUT /todos/:id",
            timestamp: nowISO(),
            requestInfo,
          });
          return sendJson(res, 404, { success: false, error: "Todo not found" });
        }

        let payload;
        try {
          payload = await parseBody(req);
        } catch (err) {
          this.emit("validationError", {
            errors: [err.message],
            data: null,
            timestamp: nowISO(),
            requestInfo,
          });
          return sendJson(res, 400, { success: false, error: err.message });
        }

        const { errors, values } = validateTodoPayload(payload, false);
        if (errors.length > 0) {
          this.emit("validationError", {
            errors,
            data: payload,
            timestamp: nowISO(),
            requestInfo,
          });
          return sendJson(res, 400, { success: false, error: errors.join(", ") });
        }

        const oldTodo = { ...this.todos[idx] };
        const newTodo = {
          ...oldTodo,
          ...values,
          updatedAt: nowISO(),
        };
        const changes = Object.keys(values).filter((key) => oldTodo[key] !== newTodo[key]);

        this.todos[idx] = newTodo;
        this.emit("todoUpdated", { oldTodo, newTodo, changes, timestamp: nowISO(), requestInfo });
        return sendJson(res, 200, { success: true, data: newTodo });
      }

      if (method === "DELETE" && todoId !== null) {
        const idx = this.todos.findIndex((item) => item.id === todoId);
        if (idx === -1) {
          this.emit("todoNotFound", {
            todoId,
            operation: "DELETE /todos/:id",
            timestamp: nowISO(),
            requestInfo,
          });
          return sendJson(res, 404, { success: false, error: "Todo not found" });
        }
        const [todo] = this.todos.splice(idx, 1);
        this.emit("todoDeleted", { todo, timestamp: nowISO(), requestInfo });
        return sendJson(res, 200, { success: true, data: todo });
      }

      return sendJson(res, 404, { success: false, error: "Route not found" });
    } catch (error) {
      this.emit("serverError", {
        error,
        operation: `${method} ${pathname}`,
        timestamp: nowISO(),
        requestInfo,
      });
      return sendJson(res, 500, { success: false, error: "Internal server error" });
    }
  }
}

module.exports = { TodoServer };

if (require.main === module) {
  const server = new TodoServer(3000);
  server.start();
}
