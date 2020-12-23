const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateCreateUser } = require('../middlewares/request-validation');
const { celebrate } = require('celebrate');
const NotFoundError = require('../utils/errors/not-found-err');

router.post('/signup', celebrate(validateCreateUser), createUser);
router.post('/signin', login);
router.use('/users', auth, users);
router.use('/articles', auth, articles);

module.exports = router;