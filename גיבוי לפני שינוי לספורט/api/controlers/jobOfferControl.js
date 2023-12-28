const { JobOfferModel } = require('../models/jobOffer')

exports.jobOfferCtrl = {
    getClientJobs: async (req, res) => {
        let client_id = req.tokenData.user_id
        try {
            const jobOffers = await JobOfferModel.find({ client_id }).populate('job_id');
            res.json(jobOffers)
        }
        catch (err) {
            res.status(500).json("error")
        }
    },

    // addFinalProffessional:async(req,res)=>{
    //     let professionalID = req.tokenData.user_id

    //     let validBody = validateJobOffer(req.body);
    //     if (validBody.error) {
    //         return res.status(400).json(validBody.error.details);
    //     }
    //     let jobOffer=await JobOfferModel.find({_id: req.body.job_id})
    //     if(jobOffer.contracted_professionals.length==jobOffer.amount_of_needed){
    //         return res.status(400).json("there is no more place in this job")
    //     }
    //     let allJobs=await this.jobOfferCtrl.find().populate('job_id');
    //     let currentJob=await this.currentJobOfferCtrl.find({_id:req.body.job_id}).populate('job_id');
    //     allJobs.forEach(element => {
    //         if(element._id==req.body.job_id){
    //             element.contracted_professionals.forEach(professionalId => {
    //                 if(professionalId==professionalID){
    //                     if(element.job_id.time==currentJob.job_id.time){
    //                         return res.status(400).json("You are already registered for work at this time")
    //                     }
    //                 }
    //             })

    //         })
    //     })        
    //     try{
    //         jobOffer = await JobOfferModel.findOneAndUpdate(
    //             { _id: req.body._id },
    //             { $set: { contracted_professionals: [...req.tokenData.user_id ]} },
    //             { new: true }
    //         );
    //         res.json(jobOffer)

    //     }
    //     catch (err) {
    //         res.status(500).json(err)
    //     }



    // },

    getProfessionalJobOffers: async (req, res) => {
        let professional_id = req.tokenData.user_id

        try {
            let offers = []
            const jobOffers = await JobOfferModel.find().populate({
                path: 'job_id',
                match: { time: { $gt: new Date() } }
            });

            jobOffers.forEach(offer => {
                if (offer.contracted_professionals.includes(professional_id)) {
                    offers.push({ offer, status: "contracted" })
                }

                else if (offer.optional_professionals.includes(professional_id)) {
                    if (offer.contracted_professionals.length == offer.amount_of_needed) {
                        offers.push({ offer, status: "closed" })
                    }
                    else {
                        offers.push({ offer, status: "open" })
                    }
                }
            })
        } catch (err) {
            res.status(500).json(err)
        }
    },

    removeProfessionalFromJob: async (req, res) => {
        let professional_id = req.tokenData.user_id
        let jobOfferId = req.body.jobOfferId

        const jobOffer = await JobOfferModel.findOne({ _id: jobOfferId }).populate('job_id')

        if (jobOffer && jobOffer.job_id && jobOffer.job_id.time) {

            const jobTime = new Date(jobOffer.job_id.time);
            const currentDateTime = new Date();
            const timeDifference = jobTime.getTime() - currentDateTime.getTime();

            if (timeDifference < 24 * 60 * 60 * 1000) {
                return res.status(400).json('too late to cancel')
            }
            else {
                await JobOfferModel.findOneAndUpdate(
                    { _id: jobOfferId },
                    { $pull: { contracted_professionals: professional_id } },
                    { new: true }
                )
                res.json('removed')
            }
        }
        else {
            return res.status(500).json('error')
        }
    }
}