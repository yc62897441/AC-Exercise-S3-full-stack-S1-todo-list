const express = require('express')
const router = express.Router()

const User = require('../../models/user')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 處理登入資訊
router.post('/login', (req, res) => {
  res.render('login')
})

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // 結構賦值
  const { name, email, password, confirmPassword } = req.body
  // 等同於逐一個宣告變數並賦值
  // const name = req.body.name
  // const email = req.body.email

  // User.findOne({ name: 'jason', password: '123' }) 就算有多筆資料符合條件(即使有 n 個 jason 並且密碼都是 123，也只會回傳一筆資料)，需要多筆資料可用 .find()
  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('User already existed.')
        res.render('register', { name, email, password, confirmPassword })
      } else {
        // 第一種寫法 (另外，有沒有放 return，好像都沒有影響)
        return User.create({
          name: name,
          email: email,
          password: password
        }).then(() => {
          res.redirect('/')
        })
          .catch(error => console.log(error))

        // 第二種寫法
        // const newUser = new User({
        //   name: name,
        //   email: email,
        //   password: password
        // })
        // newUser.save()
        //   .then(() => {
        //     res.redirect('/')
        //   })
        //   .catch(error => console.log(error))
      }
    })
})

module.exports = router