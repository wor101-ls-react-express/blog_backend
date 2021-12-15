const jwt = require('jsonwebtoken');
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (request, response, next) => {
  let token;
  let decodedToken;
  try {
    token = request.token ;
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch(error) {
    return response.status(401).json({ error: 'invalid token' });
  }
  
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  request.user = await User.findById(decodedToken.id);
  next()
}

module.exports = { tokenExtractor, userExtractor };