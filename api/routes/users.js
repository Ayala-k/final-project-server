const express = require("express");
const { authUser, authAdmin } = require("../middlewares/auth");
const { userCtrl } = require("../controlers/userControl");
const {  sendEmail } = require("../helpers/sendEmail");



const router = express.Router();

router.get('/sendmail',(req,res)=>{
    sendEmail()
})
router.post("/signup", userCtrl.signUp)

router.post("/login", userCtrl.login)

router.get('/logout', authUser, userCtrl.logOut)

router.put('/update', authUser, userCtrl.update)

router.patch('/block', authAdmin, userCtrl.blockUser)

router.patch('/change_password', authUser, userCtrl.changePassword)


module.exports = router;