const express= require("express");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/token",auth , (req,res)=> {
  res.json({msg:"Rest api work !"})
})



module.exports = router;