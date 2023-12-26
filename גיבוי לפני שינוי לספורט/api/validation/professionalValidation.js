const Joi = require("joi");

exports.validateProfessional = (_reqBody) =>{
    let schemaJoi = Joi.object({
        user_name: Joi.string().min(2).max(15).required(),
        profession: Joi.string().min(2).max(100).required(),
        specializations: Joi.array().items(Joi.string()).default([]),
        information:Joi.string().min(20).max(100).required()       
    })
    return schemaJoi.validate(_reqBody);
}


