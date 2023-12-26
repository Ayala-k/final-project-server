const { JobModel } = require("../models/Job");
const { ProfessionalModel } = require("../models/professionalModel");
const { validateJob } = require("../validation/jobValidation")


exports.jobCtrl = {

    createJob: async (req, res) => {
        req.body.client_id = req.tokenData.user_id;

        let validBody = validateJob(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }

        try {
            let job = await new JobModel(req.body);
            await job.save();

            // let jobOffer = new JobOfferModel({
            //     job_id: job._id,
            //     amount_of_needed: req.body.amount_of_needed,
            //     optional_professionals: req.body.optional_professionals
            // })
            //await jobOffer.save()

            res.status(200).send({ job })
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    updateJobDetails: async (req, res) => {
        req.body.client_id = req.tokenData.user_id;

        let validBody = validateJob(req.body)
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }

        let jobId = req.params.job_id

        try {
            let job = await JobModel.findOneAndUpdate({ _id: jobId, client_id: req.tokenData.user_id }, req.body);
            if (!job) {
                res.status(400).send("no job to update")

            }
            res.status(200).send(job)
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    deleteJob: async (req, res) => {
        let jobId = req.params.job_id

        try {
            const updatedJob = await JobModel.findOneAndUpdate(
                { _id: jobId },
                { $set: { isCanceled: true } },
                { new: true }
            );
            res.json(updatedJob)
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    getClientJobs: async (req, res) => {
        let client_id = req.tokenData.user_id
        try {
            const jobs = await JobModel.find({ client_id });
            res.json(jobs)
        }
        catch (err) {
            res.status(500).json("error")
        }
    },

    getProfessionalOpenJobs: async (req, res) => {
        let user_id = req.tokenData.user_id
        let professional_id=(await ProfessionalModel.findOne({user_id}))._id

        console.log(professional_id);

        try {
            let jobs = []
            const currentDateTime = new Date()

            const allJobs = await JobModel.find({
                time: { $gte: currentDateTime },
                contracted_professional: null
            })

            allJobs.forEach(job => {
                if (job.optional_professionals.includes(professional_id)) {
                    jobs.push(job)
                }
            })

            res.json(jobs)

            // jobOffers.forEach(offer => {
            //     if (offer.contracted_professionals.includes(professional_id)) {
            //         offers.push({ offer, status: "contracted" })
            //     }

            //     else if (offer.optional_professionals.includes(professional_id)) {
            //         if (offer.contracted_professionals.length == offer.amount_of_needed) {
            //             offers.push({ offer, status: "closed" })
            //         }
            //         else {
            //             offers.push({ offer, status: "open" })
            //         }
            //     }
            // })
        }
        catch (err) {
            res.status(500).json(err)
        }
    },

    getProfessionalContractedJobs: async (req, res) => {
        let professional_id = req.tokenData.user_id

        try {
            const currentDateTime = new Date()

            const jobs = await JobModel.find({
                time: { $gte: currentDateTime },
                contracted_professional: professional_id
            })
            res.json(jobs)

        }
        catch (err) {
            res.status(500).json(err)
        }

    },

    removeProfessionalFromJob: async (req, res) => {
        let professional_id = req.tokenData.user_id
        let jobId = req.params.job_id

        const job = await JobModel.findOne({ _id: jobId, contracted_professional: professional_id })

        if (job && job.time) {

            const jobTime = new Date(job.time);
            const currentDateTime = new Date();
            const timeDifference = jobTime.getTime() - currentDateTime.getTime();

            if (timeDifference < 24 * 60 * 60 * 1000) {
                return res.status(400).json('too late to cancel')
            }
            else {
                await JobModel.findOneAndUpdate(
                    { _id: jobId },
                    { contracted_professional: null },
                    { new: true }
                )
                res.json('removed')
            }
        }
        else {
            return res.status(500).json('error')
        }
    },

    addContractedProffessional: async (req, res) => {
        let professionalID = req.tokenData.user_id
        let jobId = req.params.job_id

        try {
            const job = await JobModel.findOneAndUpdate({
                _id: jobId,
                contracted_professional: null,
                isCanceled: false
            },
                { contracted_professional: professionalID })
            res.json(job)
        }
        catch (err) {
            res.status(500).json(err)
        }

    }
}  
