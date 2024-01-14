const express = require("express");
const { authUser, authAdmin } = require("../middlewares/auth");
const { commentCtrl } = require("../controlers/commentControl");

const router = express.Router();

router.post("/create_comment", authUser, commentCtrl.createComment)

router.put("/report", authUser, commentCtrl.report)

router.get("/get_professional_comments/:professional_id", authUser, commentCtrl.getProfessionalComments)

router.get("/get_professional_rating/:professional_id", authUser, commentCtrl.getProfessionalRating)

router.get("/get_professional_specialization_rating/:professional_id/:specialization",
authUser, commentCtrl.getProfessionalSpecializationRating)

module.exports = router;