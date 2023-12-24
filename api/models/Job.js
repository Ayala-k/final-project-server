const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    client_name:{ type:mongoose.Schema.Types.ObjectId, ref: "users" },
    location:{
        lat:Number,
        lng:Number
    },
    time:Date,
    description:String,
    rehearsal_details:String,
    payment: Number
  })

  exports.JobModel = mongoose.model("jobs", jobSchema)