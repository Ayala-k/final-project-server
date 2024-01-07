const Joi = require("joi");

exports.validateThread = (_reqBody) =>{
    let schemaJoi = Joi.object({
        writer_id: Joi.string().min(2).required(),
        thread_text:Joi.string().min(10).max(100),
    })
    return schemaJoi.validate(_reqBody);
}

exports.validateReply = (_reqBody) =>{
    let schemaJoi = Joi.object({
        replier_id: Joi.string().min(2).required(),
        reply_text:Joi.string().min(10).max(100),
    })
    return schemaJoi.validate(_reqBody);
}

