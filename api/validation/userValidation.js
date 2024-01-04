const Joi = require("joi");

exports.userValidation = (_reqBody) => {
  let joiSchema = Joi.object({
    full_name: {
      first_name: Joi.string().min(2).max(50).required(),
      last_name: Joi.string().min(2).max(50).required(),
    },
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(200).required(),
    user_name: Joi.string().min(2).max(15).required(),
    phone: Joi.string().min(9).max(10).required(),
  })

  return joiSchema.validate(_reqBody);
}


exports.loginValidation = (_reqBody) => {

  let joiSchema = Joi.object({
    user_name: Joi.string().min(2).max(15).required(),
    password: Joi.string().min(3).max(99).required()
  })

  return joiSchema.validate(_reqBody);
}