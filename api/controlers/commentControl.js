const { validateComment } = require('../validation/commentValidation')
const { CommentModel } = require('../models/commentsModel')

exports.commentCtrl = {

    createComment: async (req, res) => {
        let validBody = validateComment(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }

        try {
            let comment = new CommentModel(req.body);
            await user.save();
            res.status(201).json(user);
        }

        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err })
        }
    },

    getProfessionalComments: async (req, res) => {
        let professional = req.params.professional_id

        try {
            let comments = await CommentModel.find({ professional_id: professional })
            res.json(comments)
        }

        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err })
        }
    },

    getProfessionalRating: async (req, res) => {
        let professional = req.params.professional_id
        let count = 0
        let sum = 0

        try {
            let comments = await CommentModel.find({ professional_id: professional })
            comments.foreach(c => {
                count++
                sum += c.rating
            })
            res.json({ rating: sum / count })
        }

        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err })
        }
    },

    getProfessionalSpecializationRating: async (req, res) => {
        let professional = req.params.professional_id
        let specialization = req.params.specialization
        let count = 0
        let sum = 0

        try {
            let comments = await CommentModel.find({ professional_id: professional,specialization:specialization })
            comments.foreach(c => {
                    count++
                    sum += c.rating
            })
            res.json({ rating: sum / count })
        }

        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err })
        }
    }
}