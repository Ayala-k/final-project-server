const Joi = require("joi");

exports.validateJob = (_reqBody) =>{
    let schemaJoi = Joi.object({
        client_name: Joi.string().min(2).max(15).required(),
        location:{
            lat:Joi.number().required(),
            lng:Joi.number().required()
        },
        time:Joi.date().required(),
        description:Joi.string().min(20).max(100).required(),    
        rehearsal_details:Joi.string().min(20).max(100),
        payment:Joi.number().min(0).required()
    })
    return schemaJoi.validate(_reqBody);
}