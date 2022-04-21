const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')

const router = express.Router()

const User = require('../../models/user')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 處理登入資訊
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 處理註冊資訊
router.post('/register', (req, res) => {
  // 結構賦值
  const { name, email, password, confirmPassword } = req.body
  // 等同於逐一個宣告變數並賦值
  // const name = req.body.name
  // const email = req.body.email

  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', { name, email, password, confirmPassword, errors })
  }

  // User.findOne({ name: 'jason', password: '123' }) 就算有多筆資料符合條件(即使有 n 個 jason 並且密碼都是 123，也只會回傳一筆資料)，需要多筆資料可用 .find()
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
        return res.render('register', { name, email, password, confirmPassword, errors })
      }

      bcrypt.genSalt(10)  // 產生「鹽」，並設定複雜度係數為 10
        .then(salt => bcrypt.hash(password, salt))  // 為使用者密碼「加鹽」，產生雜湊值
        .then(hast => {
          // 第一種寫法(存入資料庫)
          User.create({
            name: name,
            email: email,
            password: hast  // 用雜湊值取代原本的使用者密碼
          }).then(() => {
            res.redirect('/')
          })
            .catch(error => console.log(error))
        })

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
    })
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router
