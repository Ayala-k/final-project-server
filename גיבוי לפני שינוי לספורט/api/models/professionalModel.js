const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  profession: String,
  specializations: {
    type: [String],
    default: [],
  },
  information: String
})

exports.ProfessionalModel = mongoose.model("professionals", professionalSchema)