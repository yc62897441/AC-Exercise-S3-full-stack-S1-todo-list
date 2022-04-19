const Todo = require('../todo') // 載入 todo model
const db = require('../../config/mongoose') // 先執行 config/mongoose.js 內的程式碼

// 後接續執行以下程式碼
db.once('open', () => {
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: `name-${i}` })
  }
  console.log('done')
})
