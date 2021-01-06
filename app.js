require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const limiter = require('./utils/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { devDB } = require('./utils/constants');
const { handleError } = require('./utils/error-handler');
const NotFoundError = require('./utils/errors/not-found-err');

const { PORT = 3000, NODE_ENV = 'dev', PROD_DB } = process.env;
const dbName = NODE_ENV === 'production' ? PROD_DB : devDB;
mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
mongoose.set('returnOriginal', false);

const app = express();
app.use(express.json());

app.use(helmet());

app.use(limiter);

// enable the request logger before all route handlers
app.use(requestLogger);

// enable cors
app.use(cors({
  origin: ['http://localhost:3000', 'https://newspin.students.nomoreparties.site', 'https://www.newspin.students.nomoreparties.site'],
  credentials: true,
}));

app.use('/api', router);
app.all('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

// enable error logger after route handlers
// and before error handlers
app.use(errorLogger);

app.use(errors()); // celebrate error handler

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => { // 4 arguments so it's recognized as an error handling middleware
  handleError(err, res);
  // do not call next() here at it will trigger error -
  // 'Cannot set headers after they are sent to the client...'
});

app.listen(PORT, () => { });
