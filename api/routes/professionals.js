const express = require("express");
const { auth, authAdmin, authUser } = require("../middlewares/auth");
const { professionalCtrl } = require("../controlers/professionalControl");

const router = express.Router();


router.post("/create_professional", authUser, professionalCtrl.createProfessional)

router.put('/update_professional',authUser,professionalCtrl.updateProfessional)

router.get('/search_professional',authUser,professionalCtrl.searchProfessional)

router.get('/get_specializations_by_profession/:profession',professionalCtrl.getSpecializationsByprofession)

router.get('/get_email/:professional_id',authUser,professionalCtrl.getProfessionalEmail)

router.get('/get_phone/:professional_id',authUser,professionalCtrl.getProfessionalPhone)

router.get('/get_user_name/:professional_id',authUser,professionalCtrl.getProfessionalUserName)

router.get('/get_professional_by_user',authUser,professionalCtrl.getProfessionalByUser)

module.exports = router;