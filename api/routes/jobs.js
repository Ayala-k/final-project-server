const express = require("express");
const { auth, authAdmin, authUser } = require("../middlewares/auth");
const { jobCtrl } = require("../controlers/jobControl");

const router = express.Router();


router.post('/add',authUser,jobCtrl.add)

router.put('/update:job_id',authUser,jobCtrl.update)

router.delete('/delete:job_id',authUser,jobCtrl.delete)

module.exports = router;