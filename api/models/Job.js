const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    client_name:{ type:mongoose.Schema.Types.user_name, ref: "users" },
    location:{
        lat:Number,
        lng:Number
    },
    time:Date
  })

  exports.JobModel = mongoose.model("jobs", jobSchema)