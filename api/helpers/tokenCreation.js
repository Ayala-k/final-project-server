const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")

exports.createToken = (user_name,role) => {
    let token = jwt.sign({user_name,role},config.tokenSecret,{expiresIn:"60mins"});
    return token;
  }