const exp = require("express");
const User = require("../models/User");
const {body, validationResult} = require("express-validator");
const router = exp.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post(
  "/createUser",
  [
    body("fname","First Name must be at least 3 characters").isLength({ min: 3 }),
    body("lname","Last Name must be at least 3 characters").isLength({ min: 3 }),
    body("fname","First Name must only contain alphabets and numbers").isAlphanumeric(),
    body("lname","Last Name must only contain alphabets and numbers").isAlphanumeric(),
    body("email","Email Must be an email - captain obvious").isEmail(),
    body("password","Password must be at least 8 characters man").isLength({ min: 8 }),
    body("confirmPassword","Password must be at least 8 characters man").isLength({ min: 8 }),
  ],
    async (req, res) => {
      try {
        const result = validationResult(req);
        const jwt_secret="allMenMustDie";
        const userexist = await User.findOne({email:req.body.email});
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,21}$/;
  
        if(userexist)
        {
          return res.status(400).json({"error":"email no no 2 2"});
        }
        if(req.body.password!==req.body.confirmPassword)
        {
          return res.status(400).json({"error":"both password should match"});
        }
        if (!result.isEmpty())
        {
          return res.status(400).send({ errors: result.array()});
        }
        if (!passwordRegex.test(req.body.password))
        {
          return res.status(400).send({ errors: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and be at least 8 characters long."});
        }

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password,salt);

        const user = await User({
          fname:req.body.fname,
          lname:req.body.lname,
          email:req.body.email,
          password:req.body.password,
        });
        const jwtToken = jwt.sign({ id : user._id }, jwt_secret);

        user.save().then(()=>{res.status(200).json({jwtToken});console.log(req.body.email+" saved")}).catch((err)=>{console.log(err);res.send(err+" email no no")});
  }
  catch (error)
  {
    res.status(500).send(error.message);
  }
});

module.exports = router;