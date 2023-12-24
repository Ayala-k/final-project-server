const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const { userValidation, loginValidation } = require("../validation/userValidation");
const { createToken } = require("../helpers/tokenCreation");

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

      let authPassword = await bcrypt.compare(req.body.password, user.password);
      if (!authPassword) {
        return res.status(401).json({ msg: "Password or user name is worng ,code:2" });
      }

      let token = createToken(user.user_name, user.role);
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
      res.json('Cookie cleared');
    }

    res.status(400).json("log out failed no cookies")
  }
}