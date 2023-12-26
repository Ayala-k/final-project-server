const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")

exports.createToken = (user_id,role) => {
    let token = jwt.sign({user_id,role},config.tokenSecret,{expiresIn:"60mins"});
    return token;
  }