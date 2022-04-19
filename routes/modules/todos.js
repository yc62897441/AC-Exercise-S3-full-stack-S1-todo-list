const express = require('express')
const router = express.Router()

const Todo = require('../../models/todo')

router.get('/new', (req, res) => {
  res.render('new')
})

// 新增單筆資料
router.post('/', (req, res) => {
  const name = req.body.name

  // 另一種寫法，從Todo在伺服器建立實例，如有修改需求可修改完後再傳送給資料庫
  // const todo = new Todo({ name: name })
  // todo.name = todo.name + '1234'  // 例如修改 todo.name
  // todo.save()
  //   .then(() => res.redirect('/'))  // 新增完成後導回首頁
  //   .catch(error => console.log(error))

  // 逕自於資料庫建立資料
  Todo.create({ name: name })
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// 編輯單筆資料
router.put('/:id', (req, res) => {
  const id = req.params.id
  // 「解構賦值 (destructuring assignment)」的語法
  // key的順序與數量可以跟換，但變數名稱要等於key的名稱
  const { name, isDone } = req.body
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      // JavaScript 裡邏輯運算子也會比普通的 = 優先執行
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

// 刪除單筆資料
router.delete('/:id', (req, res) => {
  const id = req.params.id
  Todo.findById(id)
    .then(todo => {
      todo.remove()
      res.redirect('/')
    })
    .catch(error => console.log(error))
})

// 各筆資料的詳細頁 detail
router.get('/:id', (req, res) => {
  const id = req.params.id
  Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo: todo }))
    .catch(error => console.log(error))
})

// 各筆資料的編輯頁 edit
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo: todo }))
    .catch(error => console.log(error))
})

module.exports = router
