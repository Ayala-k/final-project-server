const Joi = require("joi");

exports.validateJob = (_reqBody) => {
    let schemaJoi = Joi.object({
        client_id: Joi.string().min(2).max(15).required(),
        location: {
            lat: Joi.number().required(),
            lng: Joi.number().required()
        },
        time: Joi.date().required(),
        duration_in_hours: Joi.number().min(0.5).max(3).required(),
        description: Joi.string().min(20).max(100).required(),
        optional_professionals: Joi.array().items(Joi.string()),
        //payment:Joi.number().min(0).required()
    })
    return schemaJoi.validate(_reqBody);
}

/**
    optional_professionals: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "professionals" }]
    },
    contracted_professionals:{ type: mongoose.Schema.Types.ObjectId, ref: "professionals" },
    isCanceled: {
        type: Boolean,
        default: false,
      } */