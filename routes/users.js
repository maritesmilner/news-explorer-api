const users = require('express').Router();
const { doesUserExist, sendUser } = require('../controllers/users');

users.get('/me', doesUserExist, sendUser);

module.exports = users;
