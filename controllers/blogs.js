const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  console.log(blogs);
  response.json(blogs);
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  try {
    const result = await blog.save();
    console.log('Successfully sent blog post');
    console.log(result);
    response.status(201).json(result);
  } catch(error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
        response.json(updatedBlog);
      })
    .catch(error => next(error));  
});

module.exports = blogsRouter