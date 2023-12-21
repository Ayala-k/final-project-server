const mongoose = require('mongoose');

const professionSchema = new mongoose.Schema({
    user_name:{ type:mongoose.Schema.Types.user_name, ref: "users" },
    profession:String,
    specializations:{
        type: [String],
        default: [],
      },
  })

  exports.ProfessionModel = mongoose.model("professions", professionSchema);

