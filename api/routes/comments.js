const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { commentCtrl } = require("../controlers/commentControl");

const router = express.Router();


//router.post("/signup", auth, commentCtrl.signUp)


module.exports = router;