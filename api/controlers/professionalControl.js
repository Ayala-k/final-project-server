const { isProfession, isSpecializationOfProfession } = require("../helpers/validateProfessionAndSpecialization");
const { ProfessionalModel } = require("../models/professionalModel");
const { UserModel } = require("../models/userModel");
const { validateProfessional } = require("../validation/professionalValidation");
const { commentCtrl } = require("./commentControl");
const profession_list = require('../data/professions.json');
const { min } = require("lodash");


exports.professionalCtrl = {

    createProfessional: async (req, res) => {
        req.body.user_id = req.tokenData.user_id

        let validBody = validateProfessional(req.body);
        if (validBody.error) {
            return res.status(400).json("ERROR: invalid comment details " + validBody.error.details[0].message);
        }
        if (!isProfession(req.body.profession)) {
            return res.status(400).json("ERROR: invalid profession");
        }
        let flag = false
        req.body.specializations.forEach(s => {
            console.log(req.body.profession, s.specialization_name);
            if (!isSpecializationOfProfession(req.body.profession, s.specialization_name)) {
                flag = true
            }
        })
        if (flag == true) {
            return res.status(400).json("ERROR: invalid specialization");
        }

        try {
            let professional = await new ProfessionalModel(req.body)
            professional.save()

            await UserModel.findOneAndUpdate(
                { _id: req.tokenData.user_id },
                { role: "professional" },
            );

            res.json(professional)
        }
        catch (err) {
            res.status(500).json("ERROR")
        }

    },

    updateProfessional: async (req, res) => {
        req.body.user_id = req.tokenData.user_id

        let validBody = validateProfessional(req.body);
        if (validBody.error) {
            return res.status(400).json("ERROR: invalid comment details " + validBody.error.details[0].message);
        }

        try {
            let updatedprofessional = await ProfessionalModel.updateOne(
                { user_id: req.tokenData.user_id },
                req.body,
                { new: true })

            if (!updatedprofessional) {
                return res.status(400).json("ERROR: invalid professional")
            }

            res.json(updatedprofessional);
        }

        catch (err) {
            res.status(500).json("ERROR")
        }
    },

    searchProfessional: async (req, res) => {
        try {
            const { name, profession, specialization, minimalRating, maximalPricePerHour, gender } = req.query;

            const query = {};

            if (profession) {
                query.profession = { $in: profession.split(',') }
            }

            let professionals = await ProfessionalModel.find(query).populate('user_id');

            if (minimalRating) {
                const filteredProfessionals = await Promise.all(
                    professionals.map(async (p) => {
                        const rating = await commentCtrl.getRating(p._id, specialization || null) || 0;
                        return rating >= minimalRating ? p : null;
                    })
                );
                professionals = filteredProfessionals.filter((p) => p !== null);
            }

            if (specialization) {
                let splittedArray = specialization.split(',')
                professionals = professionals.filter(p => {
                    let flag = false
                    p.specializations.forEach(s => {
                        if (splittedArray.includes(s.specialization_name) &&
                            (!maximalPricePerHour || s.price_per_hour <= maximalPricePerHour)) {
                            flag = true
                        }
                    })
                    return flag
                })

            }

            if (name) {
                professionals = professionals.filter(p => {
                    if (p.user_id.full_name.first_name.includes(name)) {
                        return true
                    }
                    else if (p.user_id.full_name.last_name.includes(name)) {
                        return true
                    }
                    else if (p.user_id.user_name.includes(name)) {
                        return true
                    }
                    else {
                        return false
                    }
                })
            }

            if(gender){
                professionals=professionals.filter(p=>{
                    if(p.user_id.gender==gender){
                        return true
                    }
                    else{
                        return false
                    }
                })
            }

            const updatedProfessionals = await Promise.all(
                professionals.map(async (professional) => {
                    rating = (await commentCtrl.getRating(professional._id, specialization || null)) || 0;
                    return { professional, rating };
                })
            );

            res.status(200).json({ professionals: updatedProfessionals });
        }
        catch (err) {
            res.status(500).json("ERROR");
        }
    },

    getSpecializationsByprofession: async (req, res) => {
        try {
            let profession = req.params.profession;
            let specializations = [];

            profession_list.forEach(p => {
                if (p.profession === profession) {
                    specializations = p.specializations;
                }
            });

            res.json(specializations);
        }
        catch (error) {
            res.status(500).json("ERROR");
        }
    },

    getProfessionalEmail: async (req, res) => {
        let professional_id = req.params.professional_id
        try {
            let professional = await ProfessionalModel.findOne({ _id: professional_id }).populate('user_id')
            let email = professional.user_id.email
            res.json(email)
        }
        catch (err) {
            res.status(500).json("ERROR")
        }
    },

    getProfessionalPhone: async (req, res) => {
        let professional_id = req.params.professional_id
        try {
            let professional = await ProfessionalModel.findOne({ _id: professional_id }).populate('user_id')
            let phone = professional.user_id.phone
            res.json(phone)
        }
        catch (err) {
            res.status(500).json("ERROR")
        }
    },

    getProfessionalUserName: async (req, res) => {
        let professional_id = req.params.professional_id
        try {
            let professional = await ProfessionalModel.findOne({ _id: professional_id }).populate('user_id')
            let user_name = professional.user_id.user_name
            res.json(user_name)
        }
        catch (err) {
            res.status(500).json("ERROR")
        }
    },

    getProfessionalByUser: async (req, res) => {
        let user_id = req.tokenData.user_id
        try {
            let professional = await ProfessionalModel.findOne({ user_id })
            res.json(professional)
        }
        catch (err) {
            res.status(500).json("ERROR")
        }
    }
}