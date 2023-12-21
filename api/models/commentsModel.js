const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    writer_name:{ type:mongoose.Schema.Types.user_name, ref: "users" },
    profession_name:{ type:mongoose.Schema.Types.user_name, ref: "professions" },
    specialization:String,
    text:String,
    rating:Number
  })

  exports.CommentModel = mongoose.model("professions", commentSchema);

