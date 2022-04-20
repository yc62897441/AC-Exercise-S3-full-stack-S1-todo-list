const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  // 通常變數名稱用 is，暗示著這個變數的型別為布林值
  isDone: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectID,  // 定義 userId 這個項目是一個 ObjectId，也就是它會連向另一個資料物件
    ref: 'User',  // 定義參考對象是 User model
    index: true,
    required: true
  }
})
module.exports = mongoose.model('Todo', todoSchema)
