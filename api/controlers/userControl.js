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
      return res.status(400).json({"ERROR: invalid details": validBody.error.details});
    }

    try {
      let user = await UserModel.findOne({ user_name: req.body.user_name })

      if (!user) {
        return res.status(401).json("ERROR: wrong user name or password")
      }

      if (user.is_blocked) {
        return res.status(401).json("YOU ARE BLOCKED")
      }

      let authPassword = await bcrypt.compare(req.body.password, user.password);
      if (!authPassword) {
        return res.status(401).json("ERROR: wrong user name or password");
      }

      let token = createToken(user._id, user.role)
      //delete the header here???
      res.header('Authorization', `Bearer ${token}`).json({msg:"LOG IN SUCCESSFULY", token});
    }

    catch (err) {
      res.status(500).json({"ERROR: ": err})
    }
  },

  signUp: async (req, res) => {

    let validBody = userValidation(req.body);
    if (validBody.error) {
      return res.status(400).json({"ERROR: invalid details":validBody.error.details});
    }

    try {
      let user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "********";

      let token = createToken(user._id, user.role);
      //delete the header here???
      res.header('Authorization', `Bearer ${token}`).json({msg:"SIGN UP SUCCESSFULY", token});
    }

    catch (err) {
      if (err.code == 11000) {
        return res.status(500).json("ERROR: user name already in system, try log in")
      }
      res.status(500).json({"ERROR: ": err})
    }
  },

  logOut: async (req, res) => {
    //changeee
    // if (req.cookies.access_token != null) {
    //   res.clearCookie('access_token');
    //   return res.json('Cookie cleared');
    // }

    // res.status(400).json("log out failed no cookies")
  },

  update: async (req, res) => {
    req.body.user_id = req.tokenData.user_id

    let validBody = userValidation(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }

    try {
      let user = await UserModel.findOne({ _id: req.tokenData.user_id })

      let samePasswords = await bcrypt.compare(req.body.password, user.password);
      if (!samePasswords && req.body.password != user.password) {
        return res.status(400).json("ERROR: can not change password")
      }

      req.body.password = user.password
      let updatetdUser = await UserModel.updateOne(
        { _id: req.body.user_id },
        req.body,
        { new: true })

      if (!updatetdUser) {
        return res.status(400).json("ERROR: invalid user")
      }

      res.status(200).json(updatetdUser);
    }

    catch (err) {
      res.status(500).json({"ERROR: ": err})
    }
  },

  blockUser: async (req, res) => {
    const user_id = req.body.user_id

    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: user_id },
        { $set: { is_blocked: true } },
        { new: true }
      )

      if (!updatedUser) {
        return res.status(400).json("ERROR: invalid user")
      }

      res.json(updatedUser)
    }

    catch (err) {
      res.status(500).json({"ERROR: ": err})
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
        return res.status(400).json("ERROR: invalid user")
      }

      res.json(updatedUser)
    }

    catch (err) {
      res.status(500).json({"ERROR: ": err})
    }
  },

  resetPassword: async (req, res) => {
    const resetToken = req.params.reset_token
    const newPassword = req.body.new_password
    const confirmNewPassword = req.body.confirm_new_password

    if (newPassword != confirmNewPassword) {
      res.status(400).json('ERROR: different passwords')
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
        res.status(400).json('ERROR: token is expired or wrong');
      }

      user.password = "********";
      res.json(user)
    }

    catch (err) {
      res.status(500).json({"ERROR: ": err})
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
          sendEmail(email, 'reset password', passwordResetToken)
        }
        catch (err) {
          return res.status(400).json({"ERROR: Failure while sending reset password url": updatedJob});
        }
      }
      else {
        return res.status(400).json("ERROR: invalid user")
      }

      res.status(200).json("reset token sent")
    }

    catch (err) {
      res.status(500).json({"ERROR: ": err})
    }

  }
}



