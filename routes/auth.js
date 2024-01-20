const exp = require("express");
// here we have imported user module
const User = require("../models/User");
const {body, validationResult} = require("express-validator");
const router = exp.Router();
const bcrypt = require("bcryptjs");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const jwt_secret = process.env.JWT_SECRET;

router.post("/register",
// here we have performed the validation of the entered user detailed, if any error occured then validationResult will return the errors, then we will check if the results is empty then there are no error and we can further process data else we will send error array in responce
  [
    body("fname","First Name must be at least 3 characters").isLength({ min: 3 }),
    body("lname","Last Name must be at least 3 characters").isLength({ min: 3 }),
    body("fname","First Name must only contain alphabets and numbers").isAlphanumeric(),
    body("lname","Last Name must only contain alphabets and numbers").isAlphanumeric(),
    body("email","Email Must be an email - captain obvious").isEmail(),
    body("password","Password must be at least 8 characters man").isLength({ min: 8 }),
    body("confirmPassword","Password must be at least 8 characters man").isLength({ min: 8 }),
  ],
  // here is the asyncronous(because there are funtions inside this callback funtion which require waiting till they fetch/save/delete/process the data) callback funtion which will handle the registration post
  async (req, res) => {
      // here we have surrounded it in a try catch block such that the exp.application won't crash insted it will keep running and we will get an error thrown in the console/in form of responce 
      try {
        const result = validationResult(req);
        const userexistcheck = await User.findOne({email:req.body.email});
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,21}$/;
        
        // checking if user exist
        if(userexistcheck)
        {
          return res.status(400).json({ error: "Email already in use" });
        }
        // checking if password and confirmPassword matches
        if(req.body.password!==req.body.confirmPassword)
        {
          return res.status(400).json({ error: "Passwords do not match" });
        }
        // validation error check
        if (!result.isEmpty())
        {
          return res.status(400).json({ error: result.array()});
        }
        // password regex check
        if (!passwordRegex.test(req.body.password))
        {
          return res.status(400).json({error: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and be at least 8 characters long."});
        }

        // generateing salt to stuff it at the end of the password therefore password + salt
        const salt = await bcrypt.genSalt(10);
        
        // stuffing salt at the end of the password therefore password + salt, and hasing it and assigning it to the req.body.password
        req.body.password = await bcrypt.hash(req.body.password,salt);
        
        // createing a temporary user obj to save in db
        const user = await User({
          fname:req.body.fname,
          lname:req.body.lname,
          email:req.body.email,
          password:req.body.password,
        });
        
        // saving the user object in db
        user.save()
        .then(() => {
            // signing the jwt token with the secret key
            const jwtToken = jwt.sign({ id : user._id }, jwt_secret);
            res.status(200).json({ jwtToken });
            console.log(req.body.email + " saved");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
        }
        catch (error)
        {
          res.status(500).send(error.message);
        }
});

router.post("/login", [
  body("email","Email Must be an email - captain obvious").isEmail(),
  body("password","Password must not be blank").exists(),
],
async (req,res)=>{
  try {
    const result = validationResult(req);
    if (!result.isEmpty())
    {
      return res.status(400).send({ error: result.array()});
    }

    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(!user || !await bcrypt.compare(password,user.password))
    {
      return res.status(404).json({error:"invalid login credentials"});
    }
      
    const jwtToken = jwt.sign({ id : user._id }, jwt_secret, { expiresIn: "1m" });
    res.status(200).json({ jwtToken });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({error:error.message});
  }
});

router.post("/getUser",fetchUser,async(req,res)=>{
  try
  {
    const userId  = req.user.id;
    console.log(userId);
    const userdetails = await User.findById(userId).select("-password");
    res.status(200).send(userdetails);
  }
  catch (error){
    console.error(error);
    res.status(500).json({error:error.message});
  }
});

router.post("/tokenChecker", async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.jwtToken, jwt_secret);
    const isTokenExpired = decoded.exp < Date.now() / 1000;

    if(isTokenExpired)
    {
      return res.status(200).json({error:"Session expired, Please login again"});
    }
    return res.status(200).json({message:true});
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(200).json({error:"Session expired, Please login again"});
  }
});

module.exports = router;