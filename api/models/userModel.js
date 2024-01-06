const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  full_name: {
    first_name: String,
    last_name: String
  },
  user_name: String,
  email: String,
  phone: String,
  image_url:String,
  password: String,
  
  role: {
    type: String, default: "client", enum: ["admin", "professional", "client"]
  },
  gender:{
    type:String,enum:["male","female"]
  },
  date_created: {
    type: Date, default: Date.now()
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },

  password_reset_token:{
    type: String,
    default: null,
  },
  password_reset_expires:{
    type: Date,
    default: null,
  }
})

exports.UserModel = mongoose.model("users", userSchema);