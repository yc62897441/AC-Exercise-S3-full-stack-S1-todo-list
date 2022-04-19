const express = require('express')
const router = express.Router()

const Todo = require('../../models/todo')

router.get('/', (req, res) => {
  Todo.find()
    .lean()
    .sort({ _id: 'asc' }) // "desc"
    .then(todos => res.render('index', { todos: todos }))
    .catch(error => console.log(error))
})

module.exports = router
