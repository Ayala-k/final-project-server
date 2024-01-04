const express = require("express");
const { auth, authAdmin, authUser } = require("../middlewares/auth");
const { professionalCtrl } = require("../controlers/professionalControl");

const router = express.Router();


router.post("/create_professional", authUser, professionalCtrl.createProfessional)

router.put('/update_professional',authUser,professionalCtrl.updateProfessional)

router.get('/search_professional',authUser,professionalCtrl.searchProfessional)

router.get('/get_specializations_by_profession/:profession',professionalCtrl.getSpecializationsByprofession)

router.get('/get_email/:professional_id',professionalCtrl.getProfessionalEmail)

module.exports = router;