const { validateComment } = require('../validation/commentValidation')
const { CommentModel } = require('../models/commentsModel')
const { ProfessionalModel } = require('../models/professionalModel')
const { isProfession, isSpecializationOfProfession } = require('../helpers/validateProfessionAndSpecialization')
const { UserModel } = require('../models/userModel')
const { sendEmail } = require('../helpers/sendEmail')


exports.commentCtrl = {

    createComment: async (req, res) => {
        req.body.writer_id = req.tokenData.user_id

        let validBody = validateComment(req.body)
        if (validBody.error) {
            return res.status(400).json({ data: "ERROR: invalid comment details " + validBody.error.details[0].message, code: 100 });
        }

        try {
            let comment = new CommentModel(req.body);
            await comment.save();
            res.status(201).json({data:comment,code:0});
        }

        catch (err) {
            console.log(err);
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    report: async (req, res) => {
        try {
            let admins = await UserModel.find({ role: "admin" })

            let reported_user = await UserModel.findOne({ user_name: req.body.user_name })
            if (!reported_user) {
                res.status(404).json({data:'ERROR: invalid user',code:102})
            }

            let url = 'https://taupe-kleicha-da607e.netlify.app/block/' + reported_user._id

            admins.forEach(a => {
                sendEmail(a.email, 'דווח על שימוש לרעה במערכת', url,
                    `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h3 style="color: darkblue; font-size: 20px;">דווח כי ${reported_user.user_name} השתמש לרעה במערכת, באפשרותך לחסום את אותו.</h3>
                    <p style="color: #343a40; font-size: 16px; line-height: 1.6;">${req.body.text}<br/></p>
                    <span style="color: black; font-size: 14px;"> לחסימת המשתמש<a href="${url}" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
                    </div>`);
            })
            res.json({data:'report sent successfully',code:103})
        }
        catch (err) {
            console.log(err);
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getProfessionalComments: async (req, res) => {
        let professional = req.params.professional_id

        try {
            let comments = await CommentModel.find({ professional_id: professional }).populate('writer_id')
            res.json({data:comments,code:0})
        }

        catch (err) {
            console.log(err);
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getProfessionalRating: async (req, res) => {
        let professional = req.params.professional_id

        try {
            res.json({data:(await this.commentCtrl.getRating(professional, null)),code:0})
        }

        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getProfessionalSpecializationRating: async (req, res) => {
        let professional = req.params.professional_id
        let specialization = req.params.specialization

        let profession = (await ProfessionalModel.findOne({ _id: professional })).profession
        if (!isProfession(profession) || !isSpecializationOfProfession(profession, specialization)) {
            return res.status(400).json({data:"ERROR: invalid specialization",code:100})
        }

        try {
            res.json({data:(await this.commentCtrl.getRating(professional, specialization)),code:0})
        }

        catch (err) {
            console.log(err);
            res.status(500).json({data:"ERROR",code:101})
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

        return (count != 0 && sum / count) || 0
    }
}