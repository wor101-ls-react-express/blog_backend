const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 2
  },
  author: String,
  url: {
    type: String,
    required: true,
    minLength: 2
  },
  likes: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Blog', blogSchema)