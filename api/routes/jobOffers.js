const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { jobOfferCtrl } = require("../controlers/jobOfferControl");

const router = express.Router();


//router.post("/signup", auth, jobOfferCtrl.signUp)


module.exports = router;