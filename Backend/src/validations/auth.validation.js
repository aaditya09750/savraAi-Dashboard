const Joi = require("joi");

const login = {
  body: Joi.object({
    username: Joi.string().trim().min(3).max(50).required(),
    password: Joi.string().min(8).max(128).required(),
  }),
};

module.exports = {
  login,
};

