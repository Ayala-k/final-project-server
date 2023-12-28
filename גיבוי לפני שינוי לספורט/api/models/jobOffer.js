const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "jobs" },
    amount_of_needed: Number,
    optional_professionals: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "professionals" }]
    },
    contracted_professionals: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "professionals" }],
        default: [],
    }
})

exports.JobModel = mongoose.model("job_offers", jobOfferSchema)