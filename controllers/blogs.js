const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      console.log(blogs);
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      console.log('Successfully sent blog post')
      console.log(result)
      response.status(201).json(result)
    })
})

module.exports = blogsRouter