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
      return res.status(400).json(validBody.error.details);
    }

    try {
      let user = await UserModel.findOne({ user_name: req.body.user_name })
      if (!user) {
        return res.status(401).json({ msg: "Password or user name is worng ,code:1" })
      }
      if (user.isBlocked) {
        return res.status(401).json({ msg: "you are blocked:]" })
      }

      let authPassword = await bcrypt.compare(req.body.password, user.password);
      if (!authPassword) {
        return res.status(401).json({ msg: "Password or user name is worng ,code:2" });
      }

      let token = createToken(user._id, user.role);
      res.cookie('access_token', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
      })
      res.json("sent token in cookie")
    }

    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  signUp: async (req, res) => {

    let validBody = userValidation(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }

    try {
      let user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "********";

      let token = createToken(user._id, user.role);
      res.cookie('access_token', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
      })
      res.status(201).json(user);
    }

    catch (err) {
      if (err.code == 11000) {
        return res.status(500).json({ msg: "User name already in system, try log in", code: 11000 })
      }

      console.log(err);
      res.status(500).json({ msg: "err", err })
    }
  },

  logOut: async (req, res) => {

    if (req.cookies.access_token != null) {
      res.clearCookie('access_token');
      return res.json('Cookie cleared');
    }

    res.status(400).json("log out failed no cookies")
  },

  update: async (req, res) => {
    let validBody = userValidation(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }

    try {
      let user = await UserModel.findOne({ _id: req.tokenData.user_id })
      let samePasswords = await bcrypt.compare(req.body.password, user.password);
      if (!samePasswords && req.body.password != user.password) {
        return res.status(400).json("can not change password")
      }
      req.body.password = user.password
      await UserModel.updateOne({ _id: req.tokenData.user_id }, req.body);
      res.status(201).json("changed succesfully");
    }

    catch (err) {
      res.status(500).json({ msg: "err", err })
    }
  },

  blockUser: async (req, res) => {
    const { user_id } = req.body;

    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: user_id },
        { $set: { isBlocked: true } },
        { new: true }
      );
      res.json(updatedUser)
    }

    catch (err) {
      res.status(500).json({ msg: "err", err })
    }
  },

  changePassword: async (req, res) => {
    let user_id = req.tokenData.user_id
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: user_id },
        { $set: { password: await bcrypt.hash(req.body.password, 10) } },
        { new: true }
      );
      res.json(updatedUser)
    }

    catch (err) {
      res.status(500).json({ msg: "err", err })
    }
  },

  resetPassword: async (req, res) => {
    const resetToken = req.params.reset_token
    // const encryptedResetToken = crypto
    //   .createHash("sha256")
    //   .update(resetToken)
    //   .digest("hex");
    const newPassword = req.body.new_password;
    const confirmNewPassword = req.body.confirm_new_password;
    if (newPassword != confirmNewPassword) {
      res.status(400).json('different passswords')
    }
    let encryptedPasssword = await bcrypt.hash(newPassword, 10);
    //let encryptedPasssword =newPassword;
    try {
      console.log(resetToken);
      //  console.log(encryptedResetToken);
      //     console.log(resetToken);
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
        res.status(400).json('Token is expired or wrong');
      }

      user.password = "********";
      res.json(user)
    }

    catch (err) {
      res.status(500).json(err)
    }
  },

  forgotPassword: async (req, res) => {
    const email = req.body.email
    const { passwordResetToken, passwordResetExpires } = createResetToken()
    console.log(passwordResetToken);
    try {
      const user = await UserModel.findOneAndUpdate({ email },
        {
          password_reset_token: passwordResetToken,
          password_reset_expires: passwordResetExpires
        },
        { new: true })
      if (user) {
        sendEmail(email, 'reset password', passwordResetToken)//send url
      }
      res.status(200).json(user)
    }
    catch (err) {
      res.status(500).json(err)
    }

  }
}



