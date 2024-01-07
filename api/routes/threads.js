const express = require("express");
const { authUser, authAdmin } = require("../middlewares/auth");
const { threadCtrl } = require("../controlers/threadControl");

const router = express.Router();

router.post("/create_thread", authUser, threadCtrl.createThread)

router.put("/create_reply/:thread_id", authUser, threadCtrl.createReply)

router.get('/get_threads',authUser,threadCtrl.getThreads)


module.exports = router;