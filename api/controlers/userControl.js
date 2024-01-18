const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { userValidation, loginValidation } = require("../validation/userValidation");
const { createToken, createResetToken } = require("../helpers/tokenCreation");
const { sendEmail } = require("../helpers/sendEmail");


exports.userCtrl = {

  login: async (req, res) => {

    let validBody = loginValidation(req.body);
    if (validBody.error) {
      return res.status(400).json({data:"ERROR: invalid comment details " + validBody.error.details[0].message,code:100});
    }

    try {
      let user = await UserModel.findOne({ user_name: req.body.user_name })

      if (!user) {
        return res.status(401).json({data:"ERROR: wrong user name or password",code:108})
      }

      if (user.is_blocked) {
        return res.status(401).json({data:"YOU ARE BLOCKED",code:109})
      }

      let authPassword = await bcrypt.compare(req.body.password, user.password);
      if (!authPassword) {
        return res.status(401).json({data:"ERROR: wrong user name or password",code:108});
      }

      let token = createToken(user._id, user.role)
      res.header('Authorization', `Bearer ${token}`).json({data:{ token: `Bearer ${token}`, user },code:110});
    }

    catch (err) {
      res.status(500).json({data:"ERROR",code:101})
    }
  },

  signUp: async (req, res) => {

    let validBody = userValidation(req.body);
    if (validBody.error) {
      return res.status(400).json({data:"ERROR: invalid comment details " + validBody.error.details[0].message,code:100});
    }

    try {
      let user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      user.phone = user.phone.toString()
      await user.save();
      user.password = "********";

      let token = createToken(user._id, user.role);
      //delete the header here???
      res.header('Authorization', `Bearer ${token}`).json({data:{ token: `Bearer ${token}`, user },code:111});
    }

    catch (err) {
      if (err.code == 11000) {
        return res.status(500).json({data:"ERROR: user name or email already in system, try log in",code:112})
      }
      res.status(500).json({data:"ERROR",code:101})
    }
  },

  update: async (req, res) => {
    let validBody = userValidation(req.body);
    if (validBody.error) {
      return res.status(400).json({data:"ERROR: invalid comment details " + validBody.error.details[0].message,code:100});
    }

    req.body.user_id = req.tokenData.user_id

    try {
      let user = await UserModel.findOne({ _id: req.tokenData.user_id })

      let samePasswords = await bcrypt.compare(req.body.password, user.password);
      if (!samePasswords && req.body.password != user.password && req.body.password != "********") {
        return res.status(400).json({data:"ERROR: can not change password",code:113})
      }

      req.body.phone =  req.body.phone.toString()
      req.body.password = user.password
      let updatetdUser = await UserModel.updateOne(
        { _id: req.body.user_id },
        req.body,
        { new: true })

      if (!updatetdUser) {
        return res.status(400).json({data:"ERROR: invalid user",code:102})
      }

      res.status(200).json({data:updatetdUser,code:0});
    }

    catch (err) {
      res.status(500).json({data:"ERROR",code:101})
    }
  },

  blockUser: async (req, res) => {
    const user_id = req.body.user_id

    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: user_id,is_blocked:false },
        { $set: { is_blocked: true } },
        { new: true }
      ) 

      if (!updatedUser) {
        return res.status(400).json({data:"ERROR: invalid unblocked user",code:102})
      }

      res.json({data:"Blocked successfully",code:114})
    }

    catch (err) {
      res.status(500).json({data:"ERROR",code:101})
    }
  },

  changePassword: async (req, res) => {
    let user_id = req.tokenData.user_id

    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: user_id },
        { $set: { password: await bcrypt.hash(req.body.password, 10) } },
        { new: true }
      )

      if (!updatedUser) {
        return res.status(400).json({data:"ERROR: invalid user",code:102})
      }

      res.json({data:updatedUser,code:0})
    }

    catch (err) {
      res.status(500).json({data:"ERROR",code:101})
    }
  },

  resetPassword: async (req, res) => {
    const resetToken = req.params.reset_token
    const newPassword = req.body.new_password
    const confirmNewPassword = req.body.confirm_new_password

    if (newPassword != confirmNewPassword) {
      return res.status(400).json({data:'ERROR: different passwords',code:115})
    }

    let encryptedPasssword = await bcrypt.hash(newPassword, 10)

    try {
      const user = await UserModel.findOneAndUpdate({
        password_reset_token: resetToken,
        password_reset_expires: { $gt: Date.now() }
      },
        {
          password: encryptedPasssword,
          password_reset_token: null,
          password_reset_expires: null
        },
        { new: true })

      if (!user) {
        return res.status(400).json({data:'ERROR: token is expired or wrong',code:116});
      }

      user.password = "********";
      let token = createToken(user._id, user.role)
      //delete the header here???
      res.header('Authorization', `Bearer ${token}`).json({data:{  token: `Bearer ${token}`, user },code:110});
    }

    catch (err) {
      res.status(500).json({data:"ERROR",code:101})
    }
  },

  forgotPassword: async (req, res) => {
    const email = req.body.email
    const { passwordResetToken, passwordResetExpires } = createResetToken()

    try {
      const user = await UserModel.findOneAndUpdate({ email },
        {
          password_reset_token: passwordResetToken,
          password_reset_expires: passwordResetExpires
        },
        { new: true })

      if (user) {
        try {
          sendEmail(email, 'קיבלנו את בקשתך לאיפוס סיסמה', `http://localhost:5173/reset_password/` + passwordResetToken,
          `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
     <h3 style="color: darkblue; font-size: 20px;">קיבלנו את בקשתך לאיפוס סיסמה</h3>
     <p style="color: #343a40; font-size: 16px; line-height: 1.6;">תוכל לאפס את הסיסמה באמצעות הקישור המצורף. <br/>שים לב, הקישור תקף ל10 דקות בלבד.</p>
     <span style="color: black; font-size: 14px;"> לאיפוס הסיסמה <a href="https://taupe-kleicha-da607e.netlify.app/reset_password/${passwordResetToken}" style="color: darkblue; text-decoration: none;">לחץ כאן</a></span>
     </div>`)
        }
        catch (err) {
          return res.status(400).json({data:"ERROR: Failure while sending reset password url",code:104});
        }
      }
      else {
        return res.status(400).json({data:"ERROR: invalid user",code:102})
      }

      res.status(200).json({data:"reset token sent",code:117})
    }

    catch (err) {
      res.status(500).json({data:"ERROR",code:101})
    }
  }
}



