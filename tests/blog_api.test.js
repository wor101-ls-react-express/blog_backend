const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('../utils/list_helpers');
const Blog = require('../models/blogs');

const api = supertest(app);
const userLogin = { username: "wor101", password: "password"};

let token;

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }

  // login a user to get authentication key
  let result = await api
    .post('/api/login')
    .send(userLogin)
    .expect(200);

  token = result.body.token

});

test('retrieve users in JSON', async () => {
  let result = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('login a user', async () => {
  await api
    .post('/api/login')
    .send(userLogin)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('blgs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('total number of blogs', async () => {
  const response = await api
                          .get('/api/blogs')
                          .set('Authorization', `Bearer ${token}`);

  expect(response.body).toHaveLength(6);    
});

test('post request', async () => {
  const newBlog = {
    title: "A new blog post",
    author: "supertest",
    url: "wwww.supertest.com",
    likes: 4,
  };
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const finalBlogs = await helper.blogsInDb();
  expect(finalBlogs).toHaveLength(helper.initialBlogs.length + 1);

  const titles = finalBlogs.map(b => b.title);
  expect(titles).toContain(
    'A new blog post'
  );
}, 50000);

test('Missing likes value defaults to 0', async () => {
  const newBlog = {
    title: "A blog post without likes value",
    author: "supertest",
    url: "wwww.supertest.com",
  };
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const finalBlogs = await helper.blogsInDb();
  expect(finalBlogs).toHaveLength(helper.initialBlogs.length + 1);

  const dbBlog = finalBlogs.find(b => b.title === 'A blog post without likes value');
  expect(dbBlog.likes).toBe(0);

}, 50000);

test('Missing title or url', async () => {
  const newBlog = {
    title: "A blog post without likes value",
    author: "supertest",
  };
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400);

}, 50000)

afterAll(() => {
  mongoose.connection.close();
})