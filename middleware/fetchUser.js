const jwt = require("jsonwebtoken");

const fetchUser = async (req,res,next)=>{
    try
    {
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = req.header("auth-token");

        if(!token)
        {
            res.status(401).json({error:"please enter valid info."});
        }

        const data = jwt.verify(token,JWT_SECRET);
        req.user = data;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error:error.message});
    }
}

module.exports = fetchUser;