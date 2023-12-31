const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    client_id:{ type:mongoose.Schema.Types.ObjectId, ref: "users" },
    location:{
        lat:Number,
        lng:Number
    },
    time:Date,
    description:String,
    rehearsal_details:String,
    payment: Number,
    is_canceled: {
        type: Boolean,
        default: false,
      }
  })

  exports.JobModel = mongoose.model("jobs", jobSchema)