const express = require("express");
const { authUser, authAdmin } = require("../middlewares/auth");
const { commentCtrl } = require("../controlers/commentControl");

const router = express.Router();

router.post("/createComment", authUser, commentCtrl.createComment)

router.get("/getProfessionalComments/:user_id", authUser, commentCtrl.getProfessionalComments)

router.get("/getProfessionalRating/:user_id", authUser, commentCtrl.getProfessionalRating)

router.get("/getProfessionalSpecializationRating/:user_id/:specialization",
authUser, commentCtrl.getProfessionalSpecializationRating)


module.exports = router;