const express = require("express");
const {  authAdmin, authUser } = require("../middlewares/auth");
const { jobCtrl } = require("../controlers/jobControl");

const router = express.Router();


router.post('/create_job',authUser,jobCtrl.createJob)

router.put('/update_job_details',authUser,jobCtrl.updateJobDetails)

router.patch('/delete_job',authUser,jobCtrl.deleteJob)

//router.get('/get_client_jobs',authUser,jobCtrl.getClientJobs)

module.exports = router;