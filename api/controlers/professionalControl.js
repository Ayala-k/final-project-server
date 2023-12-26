const { ProfessionalModel } = require("../models/professionalModel");
const { UserModel } = require("../models/userModel");
const { validateProfessional } = require("../validation/professionalValidation");
const { commentCtrl } = require("./commentControl");


exports.professionalCtrl = {

    createProfessional: async (req, res) => {
        req.body.user_id = req.tokenData.user_id

        let validBody = validateProfessional(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
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
            res.status(500).json({ "error": err })
        }

    },

    updateProfessional: async (req, res) => {

        req.body.user_id = req.tokenData.user_id
        let validBody = validateProfessional(req.body);
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

    searchProfessional: async (req, res) => {//add price!!!
        try {
            const { name, profession, specialization, minimalRating, minimalPricePerHour, maximalPricePerHour } = req.query;

            const query = {};

            if (profession) {
                query.profession = { $in: profession.split(',') }
            }

            let professionals = await ProfessionalModel.find(query).populate('user_id');

            // if (minimalRating) {
            //     const filteredProfessionals = await Promise.all(
            //         professionals.map(async (p) => {
            //             const rating = await commentCtrl.getRating(p._id, specialization);
            //             return rating >= minimalRating ? p : null;
            //         })
            //     );

            //     professionals = filteredProfessionals.filter((p) => p !== null);
            // }

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

                // if(maximalPriceRating){
                //     professionals = professionals.filter(p => {
                //         let flag = false
                //          p.specializations.forEach(s => {
                //             if (splittedArray.includes(s.specialization_name)) {
                //                 flag = true
                //             }
                //          })
                //          return flag
                //     })
                // }
            }

            if (name) {
                professionals = professionals.filter(p => {
                    console.log(p.user_id.full_name.first_name, name);
                    if (p.user_id.full_name.first_name.includes(name)) {
                        console.log("added");
                        return true
                    }
                    else if (p.user_id.full_name.last_name.includes(name)) {
                        console.log("added");
                        return true
                    }
                    else if (p.user_id.user_name.includes(name)) {
                        console.log("added");
                        return true
                    }
                    else {
                        return false
                    }
                })
            }

            res.status(200).json({ professionals });
        }
        catch (error) {
            console.error('Error searching professionals:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}