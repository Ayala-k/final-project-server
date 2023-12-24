const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  full_name: {
    first_name: String,
    last_name: String
  },
  user_name: String,
  email: String,
  phone: Number,
  password: String,
  role: {
    type: String, default: "client", enum: ["admin", "professional", "client"]
  },
  date_created: {
    type: Date, default: Date.now()
  },
  isBlocked: {
    type: Boolean,
    default: false,
  }
})

exports.UserModel = mongoose.model("users", userSchema);