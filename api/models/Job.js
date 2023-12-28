const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    location: {
        lat: Number,
        lng: Number
    },
    time: Date,
    duration_in_hours: Number,
    description: String,
    //payment: Number,
    optional_professionals: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "professionals" }]
    },
    contracted_professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "professionals",
        default: null
    },
    isCanceled: {
        type: Boolean,
        default: false,
    }
})

exports.JobModel = mongoose.model("jobs", jobSchema)