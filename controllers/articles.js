const Article = require('../models/article');
const NotFoundError = require('../utils/errors/not-found-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.status(200).send({ data: articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, source, link, image, date,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, source, link, image, owner, date,
  })
    .then((article) => res.status(200).send({ data: article }))
    .catch(next);
};

module.exports.doesArticleExist = (req, res, next) => {
  const { id } = req.params;
  Article.findById({ _id: id })
    .then((article) => {
      if (!article) {
        next(new NotFoundError('No article with matching ID found'));
        return;
      }
      res.locals.targetArticle = article;
      next();
    })
    .catch(next);
};

module.exports.doArticlesExist = (req, res, next) => {
  const { id } = req.params;
  Article.find({ owner: id })
    .then((articles) => {
      if (!articles) {
        next(new NotFoundError('No articles with matching user ID found'));
        return;
      }
      res.locals.targetArticles = articles;
      next();
    })
    .catch(next);
};
module.exports.sendArticles = (req, res) => {
  res.status(200).send({ data: res.locals.targetArticles });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.deleteOne(res.locals.targetArticle)
    .then((result) => {
      res.status(200).send({ message: result });
    })
    .catch(next);
};
