const Article = require('../models/article');
const NotFoundError = require('../utils/errors/not-found-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({ keyword, title, text, source, link, image, owner })
    .then((article) => res.send({ data: article }))
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

module.exports.deleteArticle = (req, res, next) => {
  Article.deleteOne(res.locals.targetArticle)
    .then((result) => {
      res.status(200).send({ message: result });
    })
    .catch(next);
};