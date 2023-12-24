const express = require("express");
const { authUser, authAdmin } = require("../middlewares/auth");
const { userCtrl } = require("../controlers/userControl");

const router = express.Router();


router.post("/signup", userCtrl.signUp)

router.post("/login", userCtrl.login)

router.get('./logout', authUser, userCtrl.logOut)

router.put('update/:user_name', authUser, userCtrl.update)

router.put('/block/:user_name', authAdmin, userCtrl.blockUser)


module.exports = router;