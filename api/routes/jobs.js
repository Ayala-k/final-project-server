const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { jobCtrl } = require("../controlers/jobControl");

const router = express.Router();


//router.post("/signup", auth, jobCtrl.signUp)


module.exports = router;