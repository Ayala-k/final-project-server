const express = require("express");
const { authUser, authAdmin } = require("../middlewares/auth");
const { userCtrl } = require("../controlers/userControl");
const { sendEmail } = require("../helpers/sendEmail");



const router = express.Router();

// router.get('/email', async (req, res) => {
//     sendEmail('kluftayala@gmail.com', 'הצעת עבודה חדשה מחכה לך באתר!', 'texttt',
//     `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
//     <h3 style="color: darkblue; font-size: 20px;">!הצעת עבודה חדשה מחכה לך באתר</h3>
//     <p style="color: #343a40; font-size: 16px; line-height: 1.6;">.תוכל לצפות בפרטי ההצעה ולאשר את קבלת ההצעה באתר <br/>שים לב, ביטול ההצעה יתאפשר עד 24 שעות לפני האימון בלבד.</p>
//     <span style="color: black; font-size: 14px;"> לצפייה בפרטי האימון ואישור <a href="http://localhost:5173" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
//     </div>`
//     )
//     res.json('sent')
// })

router.post("/signup", userCtrl.signUp)

router.post("/login", userCtrl.login)

router.get('/logout', authUser, userCtrl.logOut)

router.put('/update', authUser, userCtrl.update)

router.patch('/block', authAdmin, userCtrl.blockUser)

router.patch('/change_password', authUser, userCtrl.changePassword)

router.put('/forgot_password', userCtrl.forgotPassword)

router.put('/reset_password/:reset_token', userCtrl.resetPassword)


module.exports = router;