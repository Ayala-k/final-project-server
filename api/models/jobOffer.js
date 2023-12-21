const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
    job_id:{ type:mongoose.Schema.Types.ObjectId, ref: "jobs" },
    profession:String,
    specialization:String,
    amount_of_needed:Number,
    minimal_rate:Number,
    payment:Number,
    contracted_professionals:{
        type: [String],
        default: [],
      }
  })

  exports.JobModel = mongoose.model("job_offers", jobOfferSchema)