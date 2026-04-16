const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());

const todos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Learn Express', completed: true },
  { id: 3, title: 'Read docs', completed: true },
];

function loggingMiddleware(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}
app.use(loggingMiddleware);

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  if (!req.body.title.trim() === '') {
    return res.status(400).json({
      message: "Title is required",
    });
  }
  
  const newTodo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.get('/todos/:id', (req, res) => {
  const parsedId = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === parsedId);

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found",
    });
  }

  res.json(todo);
});

app.put('/todos/:id', (req, res) => {
  const parsedId = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === parsedId);

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found",
    });
  }

  todo.title = req.body.title;
  todo.completed = req.body.completed;

  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const parsedId = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === parsedId);

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found",
    });
  }

  todos.splice(todos.indexOf(todo), 1);
  res.json({ message: "Todo deleted successfully" });
});

app.get('/todos/search', (req, res) => {
  const { id, title, completed } = req.query;

  if (id !== undefined) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId < 1) {
      return res.status(400).json({
        message: "Parameter 'id' must be a positive integer",
      });
    }
}

    if (title !== undefined && String(title).trim() === '') {
        return res.status(400).json({
            message: "Parameter 'title' must be not empty",
        });
        }

        if (completed !== undefined && completed !== 'true' && completed !== 'false') {
        return res.status(400).json({
            message: "Parameter 'completed' must be boolean",
        });
    }

    let filteredTodos = [...todos];

    if (id !== undefined) {
      const parsedId = Number(id);
      filteredTodos = filteredTodos.filter(todo => todo.id === parsedId);
    }

    if (completed !== undefined) {
      const parsedCompleted = completed === 'true';
      filteredTodos = filteredTodos.filter(todo => todo.completed === parsedCompleted);
    }

    if (title !== undefined) {
      const parsedTitle = String(title).toLowerCase().trim();
      filteredTodos = filteredTodos.filter(
        todo => todo.title.toLowerCase().includes(parsedTitle));
    }

  res.json(filteredTodos);

});



function errorHandler(err, req, res, next) {
  res.status(500).json({ error: err.message });
}
app.use(errorHandler);

app.use('/static', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
}); 


module.exports = app;