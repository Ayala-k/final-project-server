const Joi = require("joi");

exports.validateJobOffer = (_reqBody) =>{
    let schemaJoi = Joi.object({
        job_id:Joi.string().required(),
        profession:Joi.string.required(),    
        specialization:Joi.string.required(),
        amount_of_needed:Joi.number().min(1).required(),
        minimal_rate:Joi.number().min(0).required(),
        payment:Joi.number().min(0).required(),
        contracted_professionals: Joi.array().items(Joi.string()).default([])
    })
    return schemaJoi.validate(_reqBody);
}