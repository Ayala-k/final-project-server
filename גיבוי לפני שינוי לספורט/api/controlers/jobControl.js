const { JobModel } = require("../models/Job");
const { validateJob } = require("../validation/jobValidation")
const { JobOfferModel } = require('../models/jobOffer')

exports.jobCtrl = {

    createJob: async (req, res) => {
        job.client_id = req.tokenData.user_id;

        let validBody = validateJob(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }

        try {
            let job = await new JobModel(req.body);
            await job.save();

            let jobOffer = new JobOfferModel({
                job_id: job._id,
                amount_of_needed: req.body.amount_of_needed,
                optional_professionals: req.body.optional_professionals
            })
            await jobOffer.save()

            res.status(200).send({ job, jobOffer })
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    updateJobDetails: async (req, res) => {
        let validBody = validateJob(req.body)
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }

        let jobId = req.body.job_id

        try {
            let job = await JobModel.updateOne({ _id: jobId, client_id: req.tokenData.user_id }, req.body);
            res.status(200).send(job)
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    deleteJob: async (req, res) => {
        let jobId = req.body.job_id

        try {
            const updatedJob = await JobModel.findOneAndUpdate(
                { _id: jobId },
                { $set: { is_canceled: true } },
                { new: true }
            );
            res.json(updatedJob)
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // getClientJobs: async (req, res) => {
    //     let client_id = req.tokenData.user_id
    //     try {
    //         let jobs = await JobModel.find({ client_id })
    //         res.json(jobs)
    //     }
    //     catch (err) {
    //         res.status(500).json("error")
    //     }

    // }
}