require("dotenv").config()

exports.config = {
  userDb:process.env.USER_DB,
  passDb:process.env.PASS_DB,
  tokenSecret:process.env.TOKEN_SECRET,
  mailTrapUser:process.env.MAIL_TRAP_USER,
  mailTrapPass:process.env.MAIL_TRAP_PASS,
  emailAddress:process.env.EMAIL_ADDRESS
}