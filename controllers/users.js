const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1 });

  response.json(users);

  // const users = await User.find({});
  // response.json(users);
});

usersRouter.post('/', async (request, response, next) => {
  const body = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  if (body.password.length < 3) {
    return response.status(404).end();
  }

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();

    response.json(savedUser);
  } catch(error) {
    console.log(error);
    response.status(409);
    next(error);
  }

});

module.exports = usersRouter;