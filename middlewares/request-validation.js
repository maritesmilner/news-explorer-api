const { Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

module.exports.validateCreateUser = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().required(),
  }),
};
module.exports.validateCreateArticle = {
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().uri(),
    image: Joi.string().uri(),
  }),
};
module.exports.validateObjectId = {
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }),
};
