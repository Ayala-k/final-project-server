const { JobModel } = require("../models/Job");
const { ProfessionalModel } = require("../models/professionalModel");
const { validateJob } = require("../validation/jobValidation")
const { sendEmail } = require('../helpers/sendEmail')


exports.jobCtrl = {

    createJob: async (req, res) => {
        req.body.client_id = req.tokenData.user_id;

        let validBody = validateJob(req.body);
        if (validBody.error || req.body.optional_professionals.length < 1) {
            return res.status(400).json({"ERROR: invalid job details": validBody.error.details});
        }

        let job

        try {
            job = await new JobModel(req.body);
            await job.save();
        }
        catch (err) {
            return res.status(500).json({"ERROR: ": err});
        }

        try {
            job.optional_professionals.forEach(async (p) => {
                let email = (await ProfessionalModel.findOne({ _id: p }).populate('user_id')).user_id.email
                sendEmail(email, 'new job is waiting for you!', JSON.stringify(job))
            });
            res.status(201).send({ job })
        }
        catch (err) {
            return res.status(201).json({"ERROR: Failure while notifying optional professionals": job});
        }
    },

    updateJobDetails: async (req, res) => {
        req.body.client_id = req.tokenData.user_id;

        let validBody = validateJob(req.body)
        if (validBody.error || req.body.optional_professionals.length < 1) {
            return res.status(400).json({"ERROR: invalid job details": validBody.error.details});
        }

        let jobId = req.params.job_id

        try {
            let job = await JobModel.findOneAndUpdate(
                { _id: jobId, client_id: req.tokenData.user_id },
                req.body,
                { new: true }
            )

            if (!job) {
                return res.status(400).send("ERROR: invalid job")
            }

            if (job.contracted_professional) {
                try {
                    let email = (await ProfessionalModel.findOne({ _id: job.contracted_professional }).populate('user_id')).user_id.email
                    sendEmail(email, 'job has changed', JSON.stringify(job))
                }
                catch (err) {
                    return res.status(201).json({"ERROR: Failure while notifying contracted professional": job});
                }
            }

            res.json(job)
        }
        catch (err) {
            return res.status(500).json({"ERROR: ": err});
        }
    },

    cancelJob: async (req, res) => {
        let jobId = req.params.job_id

        try {
            const updatedJob = await JobModel.findOneAndUpdate(
                { _id: jobId },
                { $set: { is_canceled: true } },
                { new: true }
            )

            if (!updatedJob) {
                return res.status(400).send("ERROR: invalid job")
            }

            if (updatedJob.contracted_professional) {
                try {
                    let email = (await ProfessionalModel.findOne({ _id: updatedJob.contracted_professional }).populate('user_id')).user_id.email
                    sendEmail(email, 'job has deleted', JSON.stringify(updatedJob))
                }
                catch (err) {
                    return res.status(201).json({"ERROR: Failure while notifying contracted professional": updatedJob});
                }
            }

            res.json(updatedJob)
        }

        catch (err) {
            return res.status(500).json({"ERROR: ": err});
        }
    },

    getClientJobs: async (req, res) => {
        let client_id = req.tokenData.user_id

        try {
            const jobs = await JobModel.find({ client_id }).populate('client_id')
            res.json(jobs)
        }
        catch (err) {
            res.status(500).json({"ERROR: ": err})
        }
    },

    getProfessionalOpenJobs: async (req, res) => {
        let user_id = req.tokenData.user_id
        let professional_id = (await ProfessionalModel.findOne({ user_id }))._id

        if (!professional_id) {
            return res.status(400).send("ERROR: invalid professional")
        }

        try {
            let jobs = []
            const currentDateTime = new Date()

            const allJobs = await JobModel.find({
                time: { $gte: currentDateTime },
                contracted_professional: null,
                is_canceled: false
            }).populate('client_id')

            allJobs.forEach(j => {
                if (j.optional_professionals.includes(professional_id)) {
                    jobs.push(j)
                }
            })

            res.json(jobs)
        }
        catch (err) {
            res.status(500).json({"ERROR: ": err})
        }
    },

    getProfessionalContractedJobs: async (req, res) => {
        let user_id = req.tokenData.user_id
        let professional_id = (await ProfessionalModel.findOne({ user_id }))._id

        if (!professional_id) {
            return res.status(400).send("ERROR: invalid professional")
        }

        try {
            const currentDateTime = new Date()

            const jobs = await JobModel.find({
                time: { $gte: currentDateTime },
                contracted_professional: professional_id,
                is_canceled: false
            }).populate('client_id')

            res.json(jobs)

        }
        catch (err) {
            res.status(500).json({"ERROR: ": err})
        }

    },

    removeProfessionalFromJob: async (req, res) => {
        let jobId = req.params.job_id

        let user_id = req.tokenData.user_id
        let professional_id = (await ProfessionalModel.findOne({ user_id }))._id

        if (!professional_id) {
            return res.status(400).send("ERROR: invalid professional")
        }

        const job = await JobModel.findOne({ _id: jobId, contracted_professional: professional_id })

        if (!job) {
            return res.status(400).send("ERROR: invalid job")
        }

        if (job.time) {

            const jobTime = new Date(job.time);
            const currentDateTime = new Date();
            const timeDifference = jobTime.getTime() - currentDateTime.getTime();

            if (timeDifference < 24 * 60 * 60 * 1000) {
                return res.status(400).json('ERROR: too late to cancel')
            }
            else {
                let updatedJob = await JobModel.findOneAndUpdate(
                    { _id: jobId, contracted_professional: professional_id },
                    { contracted_professional: null },
                    { new: true }
                )

                try {
                    let email = (await JobModel.findOne({ _id: jobId }).populate('client_id')).client_id.email
                    sendEmail(email, 'the professional leaved yor job):', JSON.stringify(updatedJob))
                }
                catch (err) {
                    return res.status(201).json({"ERROR: Failure while notifying client": updatedJob});
                }

                res.json(updatedJob)
            }
        }
        else {
            return res.status(500).json({"ERROR: ": err})
        }
    },

    addContractedProffessional: async (req, res) => {
        let user_id = req.tokenData.user_id
        let professional_id = (await ProfessionalModel.findOne({ user_id }))._id

        if (!professional_id) {
            return res.status(400).send("ERROR: invalid professional")
        }

        let jobId = req.params.job_id

        try {
            const currentDateTime = new Date()

            const updatedJob = await JobModel.findOneAndUpdate({
                _id: jobId,
                contracted_professional: null,
                time: { $gte: currentDateTime },
                is_canceled: false
            },
                { contracted_professional: professional_id }
            )

            if (!updatedJob) {
                return res.status(400).send("ERROR: invalid job")
            }

            if (updatedJob) {
                try{
                let email = (await JobModel.findOne({ _id: jobId }).populate('client_id')).client_id.email
                sendEmail(email, 'a professional joined your job ):', JSON.stringify(updatedJob))
                }
                catch(err){
                    return res.status(201).json({"ERROR: Failure while notifying client": updatedJob});
                }
            }

            res.json(updatedJob)
        }
        catch (err) {
            res.status(500).json({"ERROR: ": err})
        }
    }
}  
