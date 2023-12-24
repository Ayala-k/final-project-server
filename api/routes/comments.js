const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { commentCtrl } = require("../controlers/commentControl");

const router = express.Router();


router.post("/createComment", auth, commentCtrl.createComment)

router.get("/getProfessionalComments/:user_name", auth, commentCtrl.getProfessionalComments)

router.get("/getProfessionalRating/:user_name", auth, commentCtrl.getProfessionalRating)

router.get("/getProfessionalSpecializationRating/:user_name/:specialization",
    auth, commentCtrl.getProfessionalSpecializationRating)


module.exports = router;