const { JobModel } = require("../models/Job");
const { ProfessionalModel } = require("../models/professionalModel");
const { validateJob } = require("../validation/jobValidation")
const { sendEmail } = require('../helpers/sendEmail');
const { UserModel } = require("../models/userModel");


exports.jobCtrl = {

    createJob: async (req, res) => {
        req.body.client_id = req.tokenData.user_id;

        let validBody = validateJob(req.body);
        if (validBody.error || req.body.optional_professionals.length < 1) {
            return res.status(400).json({ data: "ERROR: invalid comment details " + validBody.error.details[0].message, code: 100 });
        }

        let job

        try {
            job = await new JobModel(req.body);
            await job.save();
        }
        catch (err) {
            res.status(500).json({ data: "ERROR", code: 101 })
        }

        try {
            job.optional_professionals.forEach(async (p) => {
                let email = (await ProfessionalModel.findOne({ _id: p }).populate('user_id')).user_id.email
                sendEmail(email, '!הצעת עבודה חדשה מחכה לך באתר', JSON.stringify(job),
                    `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h3 style="color: darkblue; font-size: 20px;">!הצעת עבודה חדשה מחכה לך באתר</h3>
                <p style="color: #343a40; font-size: 16px; line-height: 1.6;">.תוכל לצפות בפרטי ההצעה ולאשר את קבלת ההצעה באתר <br/>שים לב, ביטול ההצעה יתאפשר עד 24 שעות לפני האימון בלבד.</p>
                <span style="color: black; font-size: 14px;"> לצפייה בפרטי האימון ואישור <a href="https://taupe-kleicha-da607e.netlify.app/" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
                </div>`)
            });
            res.status(201).send({ data: job, code: 0 })
        }
        catch (err) {
            return res.status(201).json({ data: "ERROR: Failure while notifying optional professionals", code: 104 });
        }
    },

    updateJobDetails: async (req, res) => {
        req.body.client_id = req.tokenData.user_id;

        let validBody = validateJob(req.body)
        if (validBody.error || req.body.optional_professionals.length < 1) {
            return res.status(400).json({ data: "ERROR: invalid comment details " + validBody.error.details[0].message, code: 100 });
        }

        let jobId = req.params.job_id

        try {
            let job = await JobModel.findOneAndUpdate(
                { _id: jobId, client_id: req.tokenData.user_id, contracted_professional: null },
                req.body,
                { new: true }
            )

            if (!job) {
                return res.status(400).send({ data: "ERROR: invalid job", code: 105 })
            }

            if (job.contracted_professional) {
                try {
                    let email = (await ProfessionalModel.findOne({ _id: job.contracted_professional }).populate('user_id')).user_id.email
                    sendEmail(email, 'בוצע שינוי בפרטי האימון שלך', JSON.stringify(job),
                        `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h3 style="color: darkblue; font-size: 20px;">בוצע שינוי בפרטי האימון שלך</h3>
    <p style="color: #343a40; font-size: 16px; line-height: 1.6;">.תוכל לצפות בפרטי ההצעה ולבטל את קבלת ההצעה באתר <br/>שים לב, ביטול ההצעה יתאפשר עד 24 שעות לפני האימון בלבד.</p>
    <span style="color: black; font-size: 14px;"> לצפייה בפרטי האימון המעודכנים <a href="https://taupe-kleicha-da607e.netlify.app/" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
    </div>`)
                }
                catch (err) {
                    return res.status(201).json({ data: "ERROR: Failure while notifying contracted professional", code: 104 });
                }
            }

            res.json({ data: job, code: 0 })
        }
        catch (err) {
            res.status(500).json({ data: "ERROR", code: 101 })
        }
    },

    cancelJob: async (req, res) => {
        let jobId = req.params.job_id
        let user_id = req.tokenData.user_id;

        try {
            const updatedJob = await JobModel.findOneAndUpdate(
                { _id: jobId, client_id: user_id },
                { $set: { is_canceled: true } },
                { new: true }
            )

            if (!updatedJob) {
                return res.status(400).send({data:"ERROR: invalid job",code:105})
            }

            if (updatedJob.contracted_professional) {
                try {
                    let email = (await ProfessionalModel.findOne({ _id: updatedJob.contracted_professional }).populate('user_id')).user_id.email
                    sendEmail(email, 'האימון שלך בוטל על ידי הלקוח', JSON.stringify(updatedJob),
                        `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h3 style="color: darkblue; font-size: 20px;">האימון שלך בוטל על ידי הלקוח</h3>
    <p style="color: #343a40; font-size: 16px; line-height: 1.6;">.תוכל לצפות בהצעות עבודה נוספות באתר <br/></p>
    <span style="color: black; font-size: 14px;"> לצפייה בהצעות שלך <a href="https://taupe-kleicha-da607e.netlify.app/" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
    </div>`)
                }
                catch (err) {
                    return res.status(201).json({data:"ERROR: Failure while notifying contracted professional",code:104});
                }
            }

            res.json({data:updatedJob,code:0})
        }

        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getClientJobs: async (req, res) => {
        let client_id = req.tokenData.user_id

        try {
            const jobs = await JobModel.find({ client_id, is_canceled: false }).populate('client_id').populate('contracted_professional')
            res.json({data:jobs,code:0})
        }
        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getClientOpenJobs: async (req, res) => {
        let client_id = req.tokenData.user_id

        try {
            const jobs = await JobModel.find(
                { client_id, is_canceled: false, contracted_professional: null }).populate('client_id')
            res.json({data:jobs,code:0})
        }
        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getClientContractedJobs: async (req, res) => {
        let client_id = req.tokenData.user_id

        try {
            const currentDateTime = new Date()

            const jobs = await JobModel.find(
                {
                    client_id,
                    is_canceled: false,
                    contracted_professional: { $ne: null },
                    time: { $gte: currentDateTime },
                }
            ).populate('client_id').populate('contracted_professional');

            res.json({data:jobs,code:0})
        }
        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getClientPreviousJobs: async (req, res) => {
        let client_id = req.tokenData.user_id

        try {
            const currentDateTime = new Date()

            const jobs = await JobModel.find(
                {
                    client_id,
                    is_canceled: false,
                    contracted_professional: { $ne: null },
                    time: { $lt: currentDateTime },
                }
            ).populate('client_id').populate('contracted_professional');

            res.json({data:jobs,code:0})
        }
        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getProfessionalOpenJobs: async (req, res) => {
        let user_id = req.tokenData.user_id
        let professional_id = null
        try {
            professional_id = (await ProfessionalModel.findOne({ user_id }))._id
        }
        catch (err) {
            return res.status(400).json({data:"ERROR: invalid professional",code:106})
        }
        if (!professional_id) {
            return res.status(400).json({data:"ERROR: invalid professional",code:106})
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

            res.json({data:jobs,code:0})
        }
        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getProfessionalContractedJobs: async (req, res) => {
        let user_id = req.tokenData.user_id
        let professional_id = null
        try {
            professional_id = (await ProfessionalModel.findOne({ user_id }))._id
        }
        catch (err) {
            return res.status(400).json({data:"ERROR: invalid professional",code:106})
        }
        if (!professional_id) {
            return res.status(400).json({data:"ERROR: invalid professional",code:106})
        }

        try {
            const currentDateTime = new Date()

            const jobs = await JobModel.find({
                time: { $gte: currentDateTime },
                contracted_professional: professional_id,
                is_canceled: false
            }).populate('client_id').populate('contracted_professional')

            res.json({data:jobs,code:0})

        }
        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }

    },

    getProfessionalPreviousJobs: async (req, res) => {
        let user_id = req.tokenData.user_id
        let professional_id = null
        try {
            professional_id = (await ProfessionalModel.findOne({ user_id }))._id
        }
        catch (err) {
            return res.status(400).json({data:"ERROR: invalid professional",code:106})
        }
        if (!professional_id) {
            return res.status(400).json({data:"ERROR: invalid professional",code:106})
        }

        try {
            const currentDateTime = new Date()

            const jobs = await JobModel.find({
                time: { $lt: currentDateTime },
                contracted_professional: professional_id,
                is_canceled: false
            }).populate('client_id').populate('contracted_professional')

            res.json({data:jobs,code:0})

        }
        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }

    },

    removeProfessionalFromJob: async (req, res) => {
        let jobId = req.params.job_id

        let user_id = req.tokenData.user_id
        let professional_id = (await ProfessionalModel.findOne({ user_id }))._id

        if (!professional_id) {
            return res.status(400).send({data:"ERROR: invalid professional",code:106})
        }

        const job = await JobModel.findOne({ _id: jobId, contracted_professional: professional_id })

        if (!job) {
            return res.status(400).send({data:"ERROR: invalid job",code:105})
        }

        if (job.time) {

            const jobTime = new Date(job.time);
            const currentDateTime = new Date();
            const timeDifference = jobTime.getTime() - currentDateTime.getTime();

            if (timeDifference < 24 * 60 * 60 * 1000) {
                return res.status(400).json({data:'ERROR: too late to cancel',code:107})
            }
            else {
                let updatedJob = await JobModel.findOneAndUpdate(
                    { _id: jobId, contracted_professional: professional_id },
                    { contracted_professional: null },
                    { new: true }
                )

                try {
                    let email = (await JobModel.findOne({ _id: jobId }).populate('client_id')).client_id.email
                    sendEmail(email, 'המאמן שלך ביטל את השתתפותו', JSON.stringify(updatedJob),
                        `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h3 style="color: darkblue; font-size: 20px;">המאמן שלך ביטל את השתתפותו</h3>
                    <p style="color: #343a40; font-size: 16px; line-height: 1.6;">.תוכל לקבל מאמן אחר או להזמין אימון חדש באתר <br/></p>
                    <span style="color: black; font-size: 14px;">לצפייה באימונים שלך  <a href="https://taupe-kleicha-da607e.netlify.app/" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
                    </div>`)
                }
                catch (err) {
                    return res.status(201).json({data:"ERROR: Failure while notifying client",code:104});
                }

                res.json({data:updatedJob,code:0})
            }
        }
        else {
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    addContractedProffessional: async (req, res) => {
        let user_id = req.tokenData.user_id
        let professional_id = (await ProfessionalModel.findOne({ user_id }))._id

        if (!professional_id) {
            return res.status(400).send({data:"ERROR: invalid professional",code:106})
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
                { contracted_professional: professional_id },
                { new: true }
            )

            if (!updatedJob) {
                return res.status(400).json({data:"ERROR: invalid job",code:105})
            }

            if (updatedJob) {
                // let price = await this.jobCtrl.calculatePrice(updatedJob)
                // let professional_email = (await UserModel.findOne({ _id: user_id })).email
                try {
                    let email = (await JobModel.findOne({ _id: jobId }).populate('client_id')).client_id.email
                    sendEmail(email, 'מצאנו לך מאמן ):', JSON.stringify(updatedJob) + `   http://localhost:5173/paypal/${jobId}`,
                        `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h3 style="color: darkblue; font-size: 20px;">מצאנו לך מאמן</h3>
                    <p style="color: #343a40; font-size: 16px; line-height: 1.6;">.תוכל לצפות בפרטים באתר <br/></p>
                    <span style="color: black; font-size: 14px;"> לתשלום בפייפאל עבור האימון <a href="https://taupe-kleicha-da607e.netlify.app/paypal/${jobId}" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
                    </div>`)
                }
                catch (err) {
                    return res.status(201).json({data:"ERROR: Failure while notifying client",code:104});
                }
            }

            res.json({data:updatedJob,code:0})
        }
        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    getJob: async (req, res) => {
        let jobId = req.params.job_id
        try {
            const job = await JobModel.findOne({ _id: jobId })
                .populate('client_id').populate('contracted_professional')
            console.log(job);
            if (!job) {
                return res.status(400).json({data:"ERROR: invalid job",code:105})
            }
            res.json({data:job,code:0})
        }
        catch (err) {
            res.status(500).json({data:"ERROR",code:101})
        }
    },

    calculatePrice: async (job) => {
        let price = 0
        try {
            let professional = await ProfessionalModel.findOne({ _id: job.contracted_professional })
            professional.specializations.forEach(s => {
                if (s.specialization_name == job.specialization) {
                    price = s.price_per_hour * job.duration_in_hours
                }
            })
            return price
        }
        catch (err) {
            return 0
        }

    }
}  
