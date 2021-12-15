const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  });

  try {
    const savedBlog = await blog.save();
    console.log('Successfully sent blog post');
    console.log(savedBlog);
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save();
    response.status(201).json(savedBlog);
  } catch(error) {
    response.status(400).json({ error: 'something went wrong!' })
    next(error);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id);

  // confirm user.id is equal to blog.user.id
  if (user.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    return response.status(401).json({ error: 'Blog post can only be deleted by user' });
  }
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