const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")
const crypto = require("crypto");


exports.createToken = (user_id, role) => {
  let token = jwt.sign({ user_id, role }, config.tokenSecret, { expiresIn: "60mins" });
  return token;
}

exports.createResetToken = () => {
  const resetToken = crypto
    .randomBytes(32) 
    .toString("hex"); 

  passwordResetToken = crypto //saving the encrypted reset token into db
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  passwordResetExpires = Date.now() + 10 * 1000 * 60; //milliseconds 10 min

  return {passwordResetToken,passwordResetExpires};
}