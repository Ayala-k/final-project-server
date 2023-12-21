const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
    user_name:{ type:mongoose.Schema.Types.user_name, ref: "users" },
    profession:String,
    specializations:{
        type: [String],
        default: [],
      }
  })

  exports.ProfessionalModel = mongoose.model("professionals", professionalSchema);

