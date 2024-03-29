const express = require("express");
const {  authAdmin, authUser } = require("../middlewares/auth");
const { jobCtrl } = require("../controlers/jobControl");

const router = express.Router();

router.post('/create_job',authUser,jobCtrl.createJob)

router.put('/update_job/:job_id',authUser,jobCtrl.updateJobDetails)

router.patch('/cancel_job/:job_id',authUser,jobCtrl.cancelJob)

router.get('/get_client_jobs',authUser,jobCtrl.getClientJobs)

router.get('/get_client_open_jobs',authUser,jobCtrl.getClientOpenJobs)

router.get('/get_client_contracted_jobs',authUser,jobCtrl.getClientContractedJobs)

router.get('/get_client_previous_jobs',authUser,jobCtrl.getClientPreviousJobs)

router.get('/get_professional_open_jobs',authUser,jobCtrl.getProfessionalOpenJobs)

router.get('/get_professional_contracted_jobs',authUser,jobCtrl.getProfessionalContractedJobs)

router.get('/get_professional_previous_jobs',authUser,jobCtrl.getProfessionalPreviousJobs)

router.patch('/remove_professional_from_job/:job_id',authUser,jobCtrl.removeProfessionalFromJob)

router.put('/add_contracted_professional/:job_id',authUser,jobCtrl.addContractedProffessional)

router.get('/get_job/:job_id',authUser,jobCtrl.getJob)


module.exports = router;