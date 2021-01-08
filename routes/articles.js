const articles = require('express').Router();
const { celebrate } = require('celebrate');
const {
  doesArticleExist, deleteArticle, getArticles, createArticle, doArticlesExist, sendArticles,
} = require('../controllers/articles');
const { validateCreateArticle, validateObjectId } = require('../middlewares/request-validation');

articles.get('', getArticles);
articles.get('/:id', celebrate(validateObjectId), doArticlesExist, sendArticles);
articles.post('', celebrate(validateCreateArticle), createArticle);
articles.delete('/:id', celebrate(validateObjectId), doesArticleExist, deleteArticle);

module.exports = articles;
