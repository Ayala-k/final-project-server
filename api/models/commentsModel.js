const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    writer_id:{ type:mongoose.Schema.Types.ObjectId, ref: "users" },
    professional_id:{ type:mongoose.Schema.Types.ObjectId, ref: "professionals" },
    specialization:String,
    text:String,
    rating:Number,
    date_created: {
      type: Date, default: Date.now()
    }
  })

  exports.CommentModel = mongoose.model("comments", commentSchema)