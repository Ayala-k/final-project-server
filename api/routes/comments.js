const express = require("express");
const { authUser, authAdmin } = require("../middlewares/auth");
const { commentCtrl } = require("../controlers/commentControl");

const router = express.Router();

router.post("/createComment", authUser, commentCtrl.createComment)

router.get("/getProfessionalComments/:user_name", authUser, commentCtrl.getProfessionalComments)

router.get("/getProfessionalRating/:user_name", authUser, commentCtrl.getProfessionalRating)

router.get("/getProfessionalSpecializationRating/:user_name/:specialization",
authUser, commentCtrl.getProfessionalSpecializationRating)


module.exports = router;