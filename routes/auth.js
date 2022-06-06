const router = require("express").Router();
const { check, validationResult } = require('express-validator');
//const { users } = require("../../db");
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
//const Users = require("../models/Users");

router.post('/signup', [
check('email', "Please provide a valid email").isEmail(),
check("password", "Password should be more than 6").isLength({
    min: 6
})
], async (req, res) => {
    const { password, email } = req.body;
    // VALIDATED INPUT
    const inputErrors = validationResult(req)    
    if(!inputErrors.isEmpty()){    
    const { errors } = inputErrors
    const error = errors.map((err) => err.msg)
        return res.status(400).json(error)
    }
    // CHECK IF USER EXIST
    const oldUser = await User.findOne({ username: req.body.username })
    if(oldUser){
        res.status(500).json({
          error: "user already exists"
        })
        return;
    }
   // HASH THE PASSWORD
    let hashedPassword = await bcrypt.hash(password, 10)
  // SAVE TO DATA DATABASE
     const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });
    const user = await newUser.save()
    res.status(200).json(user);
    //CREAT A JWT TOKEN

    const token = await JWT.sign({
        email
    }, "osojs2r2r2oowowoosfwjoejwowq4242" , {
        expiresIn: 36000
    })

   res.send("You have successfully resgistered to our platform")
    //res.send(token)
})


// GET ALL USERS
router.get("/all", async (req, res) => {
    try{
        const users = await User.find();
         res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err)
    }
})


// LOGIN USER ROUTE
router.post('/login', async (req, res) => {
    try{
     const { password, email } = req.body;
      const user = await User.findOne({ email: email })
      !user && res.status(400).json("invalid credentials")
    // COMPARING PASSWORDS
   const validated = await bcrypt.compare(password, user.password)
   !validated && res.status(400).json("wrong credentials")

    const token = await JWT.sign({
        email
    }, "osojs2r2r2oowowoosfwjoejwowq4242" , {
        expiresIn: 36000
    })
 // res.send(token)
 res.send("Login successful")
} catch(err){
res.status(500).json(err)
}
})


module.exports = router;