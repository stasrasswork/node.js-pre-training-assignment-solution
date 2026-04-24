const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validateTodoBody");
const todoService = require("../services/todoService");

router.get("/todos", (req, res) => {
  const todos = todoService.getTodos(req.query);
  return res.json(todos);
});

router.get("/todos/:id", (req, res) => {
  const todo = todoService.getTodoById(req.params.id);
  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }
  return res.json(todo);
});

router.post("/todos", validate, (req, res) => {
  const todo = todoService.createTodo(req.body);
  return res.status(201).json(todo);
});

router.put("/todos/:id", validate, (req, res) => {
  const todo = todoService.updateTodo(req.params.id, req.body);
  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }
  return res.json(todo);
});

router.delete("/todos/:id", (req, res) => {
  const todo = todoService.deleteTodo(req.params.id);
  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }
  return res.json(todo);
});

module.exports = router;