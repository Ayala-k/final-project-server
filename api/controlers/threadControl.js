const { ThreadModel } = require("../models/threadModel");
const { validateThread, validateReply } = require("../validation/threadValidation");


exports.threadCtrl = {

    createThread: async (req, res) => {
        req.body.writer_id = req.tokenData.user_id

        let validBody = validateThread(req.body)
        if (validBody.error) {
            return res.status(400).json({data:"ERROR: invalid thread details " + validBody.error.details[0].message,code:100});
        }

        try {
            let thread = new ThreadModel(req.body);
            await thread.save();
            res.status(201).json({data:thread,code:0});
        }

        catch (err) {
            console.log(err);
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    createReply: async (req, res) => {
        req.body.replier_id = req.tokenData.user_id
        let thread_id = req.params.thread_id

        let validBody = validateReply(req.body)
        if (validBody.error) {
            return res.status(400).json({data:"ERROR: invalid reply details " + validBody.error.details[0].message,code:100});
        }

        try {
            let thread = await ThreadModel.findOne({ _id: thread_id })
            if (!thread) {
                res.status(404).json({data:'ERROR: invalid thread',code:100})
            }

            let updatedReplies = [...thread.replies, req.body]
            let updatedThread = await ThreadModel.findOneAndUpdate(
                { _id: thread_id },
                { replies: updatedReplies },
                { new: true }
            )
            res.json({data:updatedThread,code:0})
        }

        catch (err) {
            console.log(err);
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getThreads: async (req, res) => {
        try {
            let threads = await ThreadModel.find().populate('writer_id').populate({
                path: 'replies',
                populate: {
                    path: 'replier_id',
                }
            })
            res.json({data:threads,code:0})
        }


        catch (err) {
            console.log(err);
            res.status(500).json({data:"ERROR",code:101})
        }
    }
}