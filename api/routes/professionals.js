const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { professionalCtrl } = require("../controlers/professionalControl");

const router = express.Router();


//router.post("/signup", auth, professionalCtrl.signUp)


module.exports = router;