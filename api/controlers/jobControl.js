const { JobModel } = require("../models/Job");
const { ProfessionalModel } = require("../models/professionalModel");
const { validateJob } = require("../validation/jobValidation")
const { sendEmail } = require('../helpers/sendEmail')

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
            job.optional_professionals.forEach(async (p) => {
                let email = (await ProfessionalModel.findOne({ _id: p }).populate('user_id')).user_id.email
                console.log(email);
                sendEmail(email, 'new job is waiting for you!', JSON.stringify(job))
            });

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
            let job = await JobModel.findOneAndUpdate({ _id: jobId, client_id: req.tokenData.user_id },
                req.body,
                { new: true });
            if (!job) {
                res.status(400).send("no job to update")
            }
            if (job.contracted_professional) {
                let email = (await ProfessionalModel.findOne({ _id: job.contracted_professional }).populate('user_id')).user_id.email
                sendEmail(email, 'job has changed', JSON.stringify(job))
            }
            res.status(200).send(job)
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    cancelJob: async (req, res) => {
        let jobId = req.params.job_id

        try {
            const updatedJob = await JobModel.findOneAndUpdate(
                { _id: jobId },
                { $set: { isCanceled: true } },
                { new: true }
            );
            if (updatedJob.contracted_professional) {
                let email = (await ProfessionalModel.findOne({ _id: updatedJob.contracted_professional }).populate('user_id')).user_id.email
                sendEmail(email, 'job has deleted', JSON.stringify(updatedJob))
            }
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
        let professional_id = (await ProfessionalModel.findOne({ user_id }))._id

        try {
            let jobs = []
            const currentDateTime = new Date()

            const allJobs = await JobModel.find({
                time: { $gte: currentDateTime },
                contracted_professional: null
            })

            allJobs.forEach(j => {
                if (j.optional_professionals.includes(professional_id)) {
                    jobs.push(j)
                }
            })

            res.json(jobs)
        }
        catch (err) {
            res.status(500).json({ "error": err })
        }
    },

    getProfessionalContractedJobs: async (req, res) => {
        let user_id = req.tokenData.user_id
        let professional_id = (await ProfessionalModel.findOne({ user_id }))._id

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
        let user_id = req.tokenData.user_id
        let jobId = req.params.job_id
        let professional_id = (await ProfessionalModel.findOne({ user_id }))._id

        const job = await JobModel.findOne({ _id: jobId, contracted_professional: professional_id })

        if (job && job.time) {

            const jobTime = new Date(job.time);
            const currentDateTime = new Date();
            const timeDifference = jobTime.getTime() - currentDateTime.getTime();

            if (timeDifference < 24 * 60 * 60 * 1000) {
                return res.status(400).json('too late to cancel')
            }
            else {
                let updatedJob = await JobModel.findOneAndUpdate(
                    { _id: jobId, contracted_professional: professional_id },
                    { contracted_professional: null },
                    { new: true }
                )
                let email = (await JobModel.findOne({ _id: jobId }).populate('client_id')).client_id.email
                sendEmail(email, 'the professional leaved yor job):', JSON.stringify(updatedJob))
                res.json('removed')
            }
        }
        else {
            return res.status(500).json('error')
        }
    },

    addContractedProffessional: async (req, res) => {
        let user_id = req.tokenData.user_id
        let jobId = req.params.job_id
        let professional_id = (await ProfessionalModel.findOne({ user_id }))._id

        try {
            const updatedJob = await JobModel.findOneAndUpdate({
                _id: jobId,
                contracted_professional: null,
                isCanceled: false
            },
                { contracted_professional: professional_id })
            if (updatedJob) {
                let email = (await JobModel.findOne({ _id: jobId }).populate('client_id')).client_id.email
                sendEmail(email, 'a professional joined your job ):', JSON.stringify(updatedJob))
            }

            res.json(updatedJob)
        }
        catch (err) {
            res.status(500).json({ error: err })
        }
    }
}  
