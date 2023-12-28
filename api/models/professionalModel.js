const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  profession: String,
  specializations: {
    type: [{ specialization_name: String, price_per_hour: Number }],
  },
  information: String
})

exports.ProfessionalModel = mongoose.model("professionals", professionalSchema)