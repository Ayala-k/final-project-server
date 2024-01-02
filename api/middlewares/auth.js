const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")

exports.authUser = (req,res,next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader.slice(7);
  if(!token){
    return res.status(401).json("You need to send token to this endpoint url")
  }

  try{
    let decodeToken = jwt.verify(token,config.tokenSecret);
    req.tokenData = decodeToken;
    next();
  }

  catch(err){
    console.log(err);
    return res.status(401).json("Token invalid or expired, log in again")
  }
}


exports.authAdmin = (req,res,next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader.slice(7);
  if(!token){
    return res.status(401).json("You need to send token to this endpoint url")
  }

  try{
    let decodeToken = jwt.verify(token,config.tokenSecret);
    if(decodeToken.role != "admin"){
      return res.status(401).json("Admin token required")
    }

    req.tokenData = decodeToken;
    next();
  }
  
  catch(err){
    console.log(err);
    return res.status(401).json("Token invalid or expired, log in again ")
  }
}