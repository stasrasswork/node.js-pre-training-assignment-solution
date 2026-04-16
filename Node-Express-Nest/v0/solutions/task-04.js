// Express.js app with GET /todos/:id endpoint
const express = require('express');
const app = express();

const todos = [
    {id: 1, title: 'Buy milk', completed: false},
    {id: 2, title: 'Buy bread', completed: false},
    {id: 3, title: 'Buy eggs', completed: false},
]

app.get('/todos/:id', (req,res) => {
    const todo = todos.find(todo => todo.id === parseInt(req.params.id));
    if(todo) {
        res.json(todo);
    } else {
        res.status(404).json({ error: 'Todo not found' })
    }
});
module.exports = app; 