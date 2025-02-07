const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const createItemsValidator = () => {
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
    }),
  });
};

const createUserValidator = () => {
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  });
};

const createloginValidator = () => {
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  });
};

const validateId = celebrate({
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
});

module.exports = createItemsValidator;
module.exports = createUserValidator;
module.exports = createloginValidator;
module.exports = validateId;
