// Contains validation from the usermodule
const Joi = require("joi");

exports.validUser = (_reqBody) => {

  let joiSchema = Joi.object({
    full_name: {
      first_name: Joi.string().min(2).max(50).required(),
      last_name: Joi.string().min(2).max(50).required(),
    },
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(15).required(),
    user_name: Joi.string().min(2).max(15).required(),
    phone: Joi.number().min(9).max(10).required()
  })

  return joiSchema.validate(_reqBody);
}

exports.validLogin = (_reqBody) => {

  let joiSchema = Joi.object({
    userName: Joi.string().min(2).max(15).required(),
    password: Joi.string().min(3).max(99).required()
  })

  return joiSchema.validate(_reqBody);
}