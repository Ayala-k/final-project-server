const express= require("express");
const {auth, authAdmin} = require("../middlewares/auth");
const { authCtrl } = require("../controllers/authControll");
const { userCtrl } = require("../controllers/userControll");
const router = express.Router();

// router.get("/myInfo",auth,userCtrl.myInfo)

// router.get("/usersList", authAdmin ,userCtrl.userList)

// router.post("/",authCtrl.signUp)

// router.post("/login", authCtrl.login)

// router.put("/:idEdit",auth,userCtrl.editUser);

// router.delete("/:idDel" ,auth, userCtrl.deleteAccount);





module.exports = router;
