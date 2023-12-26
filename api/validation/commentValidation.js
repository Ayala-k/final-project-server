const Joi = require("joi");

exports.validateComment = (_reqBody) =>{
    let schemaJoi = Joi.object({
        writer_id: Joi.string().min(2).max(15).required(),
        professional_id: Joi.string().min(2).max(15).required(),
        specialization:Joi.string().min(2).max(15).required(),
        text:Joi.string().min(10).max(100),
        rating:Joi.number().min(0).max(5).required()
    })
    return schemaJoi.validate(_reqBody);
}