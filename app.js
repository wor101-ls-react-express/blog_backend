const config = require('./utils/config')
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const Blog = require('./models/blogs')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(() => console.log('Error: could not connect to MongoDB'));

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app