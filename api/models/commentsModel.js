const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    writer_name:{ type:mongoose.Schema.Types.user_name, ref: "users" },
    professional_name:{ type:mongoose.Schema.Types.user_name, ref: "professionals" },
    specialization:String,
    text:String,
    rating:Number,
    date_created: {
      type: Date, default: Date.now()
    }
  })

  exports.CommentModel = mongoose.model("comments", commentSchema)