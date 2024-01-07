const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    writer_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    thread_text: String,
    date_created: {
        type: Date, default: Date.now()
    },
    replies: {
        type: [{
            replier_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
            reply_text: String,
            date_created: {
                type: Date, default: Date.now()
            }
        }],
        default: []
    }
})

exports.ThreadModel = mongoose.model("threads", threadSchema)