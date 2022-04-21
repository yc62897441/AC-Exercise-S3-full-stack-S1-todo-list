const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Todo = require('../todo') // 載入 todo model
const User = require('../user')
const db = require('../../config/mongoose') // 先執行 config/mongoose.js 內的程式碼

const SEED_USER = {
  name: 'James',
  email: 'james@example.com',
  password: '12345678'
}

// 確認 SEED_USER 是否已存在於資料庫，如是則不進行創建並退出程式
User.findOne({ email: SEED_USER.email })
  .lean()
  .then(user => {
    if (user) {
      console.log('這個 Email 已經註冊過了。')
      process.exit()  // 不進行創建並退出程式  // process.exit() 指「關閉這段 Node 執行程序」
    }
  })

// 創建 SEED_USER
db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      // Todo.create() 的意義是「呼叫資料庫請求它建立新資料」，注意是呼叫外部服務，而不是直接動作。你用 for 迴圈「連續呼叫了 10 次 MongoDB」，呼叫完 10 次就往下走了，並沒有等待資料庫回應
      // .all 裡面傳入一個陣列，.all 會保證陣列裡的內容全部執行完畢，才會進入 .then
      return Promise.all(Array.from(
        { length: 10 },
        (value, index) => Todo.create({ name: `${user.name}-${index}`, userId })
      ))
    })
    .then(() => {
      console.log('done.')
      process.exit()  // process.exit() 指「關閉這段 Node 執行程序」
    })
})

// 原本的寫法
// 後接續執行以下程式碼
// db.once('open', () => {
//   for (let i = 0; i < 10; i++) {
//     Todo.create({ name: `name-${i}` })
//   }
//   console.log('done')
// })
