const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { urlRegex } = require('../utils/constants');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'Please enter a valid URL.',
    },
  },
  image: {
    type: String,
    required: false,
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: 'Please enter a valid URL.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);