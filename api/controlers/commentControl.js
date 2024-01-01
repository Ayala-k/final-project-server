const { validateComment } = require('../validation/commentValidation')
const { CommentModel } = require('../models/commentsModel')
const { ProfessionalModel } = require('../models/professionalModel')
const { isProfession, isSpecializationOfProfession } = require('../helpers/validateProfessionAndSpecialization')


exports.commentCtrl = {

    createComment: async (req, res) => {
        req.body.writer_id = req.tokenData.user_id

        let validBody = validateComment(req.body)
        if (validBody.error) {
            return res.status(400).json({"ERROR: invalid comment details":validBody.error.details});
        }

        try {
            let comment = new CommentModel(req.body);
            await comment.save();
            res.status(201).json(comment);
        }

        catch (err) {
            console.log(err);
            res.status(500).json({"ERROR: ": err})
        }
    },

    getProfessionalComments: async (req, res) => {
        let professional = req.params.professional_id

        try {
            let comments = await CommentModel.find({ professional_id: professional }).populate('writer_id')
            res.json(comments)
        }

        catch (err) {
            console.log(err);
            res.status(500).json({"ERROR: ": err})
        }
    },

    getProfessionalRating: async (req, res) => {
        let professional = req.params.professional_id

        try {
            res.json(await this.commentCtrl.getRating(professional, null))
        }

        catch (err) {
            console.log(err);
            res.status(500).json({"ERROR: ": err})
        }
    },

    getProfessionalSpecializationRating: async (req, res) => {
        let professional = req.params.professional_id
        let specialization = req.params.specialization

        let profession=(await ProfessionalModel.findOne({_id:professional})).profession
        if(!isProfession(profession)||!isSpecializationOfProfession(profession,specialization)){
            return res.status(400).json("ERROR: invalid specialization")
        }

        try {
            res.json(await this.commentCtrl.getRating(professional, specialization))
        }

        catch (err) {
            console.log(err);
            res.status(500).json({"ERROR: ": err})
        }
    },

    getRating: async (professional_id, specialization) => {
        let comments = []

        if (specialization == null) {
            comments = await CommentModel.find({ professional_id })
        }
        else {
            comments = await CommentModel.find({ professional_id, specialization: specialization })
        }

        let count = 0
        let sum = 0

        comments.forEach(c => {
            if (specialization == null || specialization == c.specialization) {
                count++
                sum += c.rating
            }
        })

        return sum / count
    }
}