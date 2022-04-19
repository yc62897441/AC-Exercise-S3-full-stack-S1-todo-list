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
  }
})
module.exports = mongoose.model('todo', todoSchema)
