const express = require("express");
const { authUser, authAdmin } = require("../middlewares/auth");
const { userCtrl } = require("../controlers/userControl");

const router = express.Router();


router.post("/signup", userCtrl.signUp)

router.post("/login", userCtrl.login)

router.put('/update', authUser, userCtrl.update)

router.patch('/block', authAdmin, userCtrl.blockUser)

router.patch('/change_password', authUser, userCtrl.changePassword)

router.put('/forgot_password', userCtrl.forgotPassword)

router.put('/reset_password/:reset_token', userCtrl.resetPassword)


module.exports = router;