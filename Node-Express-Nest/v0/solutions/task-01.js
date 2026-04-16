// Express.js app with GET /todos endpoint
const express = require('express');
const app = express();

// TODO: implement todos storage and GET /todos logic

const todos = [
    {id: 1, title: 'Buy milk', completed: false},
    {id: 2, title: 'Buy bread', completed: false},
    {id: 3, title: 'Buy eggs', completed: false},
]
app.get('/todos', (req, res) => {
    res.json(todos);
})
module.exports = app; 