const { ThreadModel } = require("../models/threadModel");
const { validateThread, validateReply } = require("../validation/threadValidation");



exports.threadCtrl = {

    createThread: async (req, res) => {
        req.body.writer_id = req.tokenData.user_id

        let validBody = validateThread(req.body)
        if (validBody.error) {
            return res.status(400).json("ERROR: invalid thread details " + validBody.error.details[0].message);
        }

        try {
            let thread = new ThreadModel(req.body);
            await thread.save();
            res.status(201).json(thread);
        }

        catch (err) {
            console.log(err);
            res.status(500).json("ERROR")
        }
    },

    createReply: async (req, res) => {
        req.body.replier_id = req.tokenData.user_id
        let thread_id = req.params.thread_id

        let validBody = validateReply(req.body)
        if (validBody.error) {
            return res.status(400).json("ERROR: invalid reply details " + validBody.error.details[0].message);
        }

        try {
            let thread = await ThreadModel.findOne({ _id: thread_id })
            if (!thread) {
                res.status(404).json('ERROR: invalid thread')
            }

            let updatedReplies = [...thread.replies, req.body]
            let updatedThread = await ThreadModel.findOneAndUpdate(
                { _id: thread_id },
                { replies: updatedReplies },
                { new: true }
            )
            res.json(updatedThread)
        }

        catch (err) {
            console.log(err);
            res.status(500).json("ERROR")
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
            res.json(threads)
        }


        catch (err) {
            console.log(err);
            res.status(500).json("ERROR")
        }
    }

    // createComment: async (req, res) => {
    //     req.body.writer_id = req.tokenData.user_id

    //     let validBody = validateComment(req.body)
    //     if (validBody.error) {
    //         return res.status(400).json("ERROR: invalid comment details " + validBody.error.details[0].message);
    //     }

    //     try {
    //         let comment = new CommentModel(req.body);
    //         await comment.save();
    //         res.status(201).json(comment);
    //     }

    //     catch (err) {
    //         console.log(err);
    //         res.status(500).json("ERROR")
    //     }
    // },

    // getProfessionalComments: async (req, res) => {
    //     let professional = req.params.professional_id

    //     try {
    //         let comments = await CommentModel.find({ professional_id: professional }).populate('writer_id')
    //         res.json(comments)
    //     }

    //     catch (err) {
    //         console.log(err);
    //         res.status(500).json("ERROR")
    //     }
    // },

    // getProfessionalRating: async (req, res) => {
    //     let professional = req.params.professional_id

    //     try {
    //         res.json(await this.commentCtrl.getRating(professional, null))
    //     }

    //     catch (err) {
    //         res.status(500).json("ERROR")
    //     }
    // },

    // getProfessionalSpecializationRating: async (req, res) => {
    //     let professional = req.params.professional_id
    //     let specialization = req.params.specialization

    //     let profession = (await ProfessionalModel.findOne({ _id: professional })).profession
    //     if (!isProfession(profession) || !isSpecializationOfProfession(profession, specialization)) {
    //         return res.status(400).json("ERROR: invalid specialization")
    //     }

    //     try {
    //         res.json(await this.commentCtrl.getRating(professional, specialization))
    //     }

    //     catch (err) {
    //         console.log(err);
    //         res.status(500).json("ERROR")
    //     }
    // },

    // getRating: async (professional_id, specialization) => {
    //     let comments = []

    //     if (specialization == null) {
    //         comments = await CommentModel.find({ professional_id })
    //     }
    //     else {
    //         comments = await CommentModel.find({ professional_id, specialization: specialization })
    //     }

    //     let count = 0
    //     let sum = 0

    //     comments.forEach(c => {
    //         if (specialization == null || specialization == c.specialization) {
    //             count++
    //             sum += c.rating
    //         }
    //     })

    //     return (count!=0&&sum / count)||0
    // }
}