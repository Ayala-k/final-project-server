const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")

exports.authUser = (req,res,next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader.slice(7);
  if(!token){
    return res.status(401).json({data:"You need to send token to this endpoint url",code:118})
  }

  try{
    let decodeToken = jwt.verify(token,config.tokenSecret);
    req.tokenData = decodeToken;
    next();
  }

  catch(err){
    console.log(err);
    return res.status(401).json({data:"Token invalid or expired, log in again",code:119})
  }
}


exports.authAdmin = (req,res,next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader.slice(7);
  if(!token){
    return res.status(401).json({data:"You need to send token to this endpoint url",code:118})
  }

  try{
    let decodeToken = jwt.verify(token,config.tokenSecret);
    if(decodeToken.role != "admin"){
      return res.status(401).json({data:"Admin token required",code:120})
    }

    req.tokenData = decodeToken;
    next();
  }
  
  catch(err){
    console.log(err);
    return res.status(401).json({data:"Token invalid or expired, log in again ",code:119})
  }
}