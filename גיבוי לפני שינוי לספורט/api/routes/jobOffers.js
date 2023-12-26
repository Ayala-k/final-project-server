const express = require("express");
const { auth, authAdmin, authUser } = require("../middlewares/auth");
const { jobOfferCtrl } = require("../controlers/jobOfferControl");

const router = express.Router();


router.post("/get_client_jobs", authUser, jobOfferCtrl.getClientJobs)

//router.post("/add_final_proffessional", authUser, jobOfferCtrl.addFinalProffessional)

router.put("/remove_professional_from_job", authUser, jobOfferCtrl.removeProfessionalFromJob)

router.get('/get_professional_job_offers',authUser,jobOfferCtrl.getProfessionalJobOffers)

module.exports = router;