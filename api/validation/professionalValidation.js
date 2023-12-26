const Joi = require("joi");

exports.validateProfessional = (_reqBody) =>{
    let schemaJoi = Joi.object({
        user_id: Joi.string().min(2).required(),
        profession: Joi.string().min(2).max(100).required(),
        specializations: Joi.array().items(
            Joi.object({
              specialization_name: Joi.string().min(2).max(100).required(),
              price_per_hour: Joi.number().min(0).max(1000).required(),
            })
          ),
        information:Joi.string().min(20).max(100).required()       
    })
    return schemaJoi.validate(_reqBody);
}


