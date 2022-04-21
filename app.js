// 外部套件
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
// const { render } = require("express/lib/response")
const methodOverride = require('method-override')
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

// 定義伺服器參數
const app = express()
const PORT = process.env.PORT

// 內部自定義套件
// 對 app.js 而言，Mongoose 連線設定只需要「被執行」，不需要接到任何回傳參數繼續利用，所以這裡不需要再設定變數
require('./config/mongoose')
// const Todo = require("./models/todo")
const routes = require('./routes/index')

// view engine 設定
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 使用 app.use() 註冊套件，並使用 session(option) 來設定相關選項
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// use 路由前處理
// 在路由清單前設定 app.use，讓每一筆路由都會進行前置處理
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

app.use(flash())

// 設定本地變數 res.locals
// 放在 res.locals 裡的資料，所有的 view 都可以存取
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  // req.user 是在反序列化的時候，取出的 user 資訊，之後會放在 req.user 裡以供後續使用
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning_msg 訊息
  next()
})

// 聯繫總路由
app.use(routes)

// 開啟與監聽伺服器
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`)
})
