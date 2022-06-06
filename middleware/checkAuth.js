const JWT = require("jsonwebtoken")
module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(400).json("no token found")
    }

    try{
  let user = await JWT.verify(token, "osojs2r2r2oowowoosfwjoejwowq4242")
   req.user = user.email;
   next()   
}catch(err){
   return res.status(400).json("invalid user")
    }
}