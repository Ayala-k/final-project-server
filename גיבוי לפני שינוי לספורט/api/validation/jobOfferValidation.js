const Joi = require("joi");

exports.validateJobOffer = (_reqBody) =>{
    let schemaJoi = Joi.object({
        job_id:Joi.string().required(),
        amount_of_needed:Joi.number().min(1).required(),
        optional_professionals: Joi.array().items(Joi.string()),
        contracted_professionals: Joi.array().items(Joi.string()).default([])
    })
    return schemaJoi.validate(_reqBody);
}