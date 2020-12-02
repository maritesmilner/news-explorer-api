require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { validateCreateUser } = require('./middlewares/request-validation');
const users = require('./routes/users');
const articles = require('./routes/articles');
const { createUser, login, logout } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
mongoose.set('returnOriginal', false);

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// enable the request logger before all route handlers
app.use(requestLogger);

// enable cors
app.use(cors({
  origin: ['http://localhost:3000', 'https://wizardry.students.nomoreparties.site', 'https://www.wizardry.students.nomoreparties.site'],
  credentials: true,
}));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signup', celebrate(validateCreateUser), createUser);
app.post('/signin', login);
app.use('/users', auth, users);
app.use('/articles', auth, articles);

// enable error logger after route handlers
// and before error handlers
app.use(errorLogger);

// error handlers
app.use(errors()); // celebrate error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => { // 4 arguments so it's recognized as an error handling middleware
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // check the status and display a message based on it
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
  // do not call next() here at it triggers error -
  // 'Cannot set headers after they are sent to the client...'
});
app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => { });
