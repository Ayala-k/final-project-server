const { ProfessionalModel } = require("../models/professionalModel");
const { commentCtrl } = require("./commentControl");

exports.professionalCtrl = {

    createProfessional: async (req, res) => {
        req.body.user_id = req.tokenData.user_id

        let validBody = validateJob(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }

        try {
            let professional = await new ProfessionalModel(req.body)
            professional.save()

            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: req.tokenData.user_id },
                { $set: { role: "professional" } },
                { new: true }
            );

            res.json(professional)
        }
        catch (err) {
            res.status(500).json("error")
        }

    },

    updateProfessional: async (req, res) => {
        req.body.user_id = req.tokenData.user_id

        let validBody = userValidation(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }

        try {
            await ProfessionalModel.updateOne({ user_id: req.tokenData.user_id }, req.body);
            res.status(201).json("changed succesfully");
        }

        catch (err) {
            res.status(500).json({ msg: "err", err })
        }
    },

    searchProfessional: async (req, res) => {
        try {
            const { name, profession, specialization, minimalRating } = req.query;

            const query = {};

            if (name) {
                query['user_id.full_name'] = {
                    $regex: new RegExp(name, 'i'),
                };
            }

            if (profession) {
                query.profession = { $in: profession.split(',') };
            }

            if (specialization) {
                query.specializations = { $in: specialization.split(',') };
            }

            let professionals = await ProfessionalModel.find(query).populate('user_id');

            if (minimalRating) {
                const filteredProfessionals = await Promise.all(
                    professionals.map(async (p) => {
                        const rating = await commentCtrl.getRating(p._id, specialization);
                        return rating >= minimalRating ? p : null;
                    })
                );

                professionals = filteredProfessionals.filter((p) => p !== null);
            }

            res.status(200).json({ professionals });
        }
        catch (error) {
            console.error('Error searching professionals:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}