const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauthorized-err');
const { devSecretKey } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw (new UnauthorizedError({ message: 'Authorization Required' }));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devSecretKey);
  } catch (err) {
    next(new UnauthorizedError({ message: 'Authorization Required' })); // don't use err.message as jwt.verify may throw a jwt malformed error.
  }

  req.user = payload; // assigning the payload the the request object

  next(); // sending the request to the next middleware
};
