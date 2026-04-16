// Express.js app with POST /todos endpoint
const express = require('express');
const app = express();
app.use(express.json());

// TODO: implement todos storage and POST /todos logic

const todos = [
    {id: 1, title: 'Buy milk', completed: false},
    {id: 2, title: 'Buy bread', completed: false},
    {id: 3, title: 'Buy eggs', completed: false},
]

app.post('/todos', (req, res) => {
    const createdTodo = {
        id: todos.length + 1,
        title: req.body.title,
        completed: false
    };
    todos.push(createdTodo);
    res.status(201).json(createdTodo);
})

module.exports = app; 