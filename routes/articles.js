const articles = require('express').Router();
const { celebrate } = require('celebrate');
const { doesArticleExist, deleteArticle, getArticles } = require('../controllers/articles');
const { validateCreateArticle, validateObjectId } = require('../middlewares/request-validation');

articles.get('', getArticles);
articles.post('', celebrate(validateCreateArticle), createArticle);
articles.delete('/:id', celebrate(validateObjectId), doesArticleExist, deleteArticle);

module.exports = articles;
