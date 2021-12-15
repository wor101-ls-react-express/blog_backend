const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7);
//   }
//   return null;
// };


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;
  const token = request.token   // getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);

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