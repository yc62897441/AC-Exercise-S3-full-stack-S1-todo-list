const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) { return done(null, false, { message: 'That email is not registered!' }) }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, {
                message: 'Email or Password incorrect.'
              })
            }
            return done(null, user)
          })
      })
      .catch(error => done(error, false))
  }))

  // 設定 Facebook 登入策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName'] // profileFields 設定是和 Facebook 要求開放的資料，我們要了兩種資料
  }, (accessToken, refreshToken, profile, done) => {
    // profile 獲得的臉書資訊
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) { return done(null, user) }

        const randomPassword = Math.random().toString(36).slice(-8)

        bcrypt.genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
          .then(salt => bcrypt.hash(randomPassword, salt)) // 為使用者密碼「加鹽」，產生雜湊值
          .then(hash => {
            // 第一種寫法(存入資料庫)
            User.create({
              name: name,
              email: email,
              password: hash // 用雜湊值取代原本的使用者密碼
            })
              .then(user => done(null, user))
              .catch(error => done(error, false))
          })
      })
      .catch(error => done(error, false))
  }
  ))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => done(error, null))
  })
}
