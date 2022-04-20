// 外部套件
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
// const { render } = require("express/lib/response")
const methodOverride = require('method-override')

// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

// 定義伺服器參數
const app = express()
const PORT = process.env.PORT || 3000

// 內部自定義套件
// 對 app.js 而言，Mongoose 連線設定只需要「被執行」，不需要接到任何回傳參數繼續利用，所以這裡不需要再設定變數
require('./config/mongoose')
// const Todo = require("./models/todo")
const routes = require('./routes/index')

// view engine 設定
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'ThisIsMySecret',
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

// 聯繫總路由
app.use(routes)

// 開啟與監聽伺服器
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`)
})
