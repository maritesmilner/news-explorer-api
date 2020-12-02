const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/not-found-err');
const UnauthorizedError = require('../utils/errors/unauthorized-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const { devSecretKey } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

exports.createUser = (req, res, next) => {
  // hashing the password
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash, // adding the hash to the database
      name: req.body.name,
    }))
    .then((user) => {
      res.status(201).send({ _id: user._id, email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        next(new BadRequestError('Email address is already in use'));
      } else {
        next(new BadRequestError(err.message));
      }
    });
};

module.exports.doesUserExist = (req, res, next) => {
  const { userId = req.user._id } = req.params;
  User.findById({ _id: userId })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('No user with matching ID found'));
        return;
      }
      res.locals.targetUser = user;
      next();
    })
    .catch(next);
};

module.exports.sendUser = (req, res) => {
  res.send(res.locals.targetUser);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      // create and return a token
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devSecretKey,
        { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      // authentication error
      next(new UnauthorizedError(err.message));
    });
};