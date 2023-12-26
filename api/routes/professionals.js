const express = require("express");
const { auth, authAdmin, authUser } = require("../middlewares/auth");
const { professionalCtrl } = require("../controlers/professionalControl");

const router = express.Router();


router.post("/create_professional", authUser, professionalCtrl.createProfessional)

router.put('/update_professional',authUser,professionalCtrl.updateProfessional)

router.get('/search_professional',authUser,professionalCtrl.searchProfessional)

module.exports = router;