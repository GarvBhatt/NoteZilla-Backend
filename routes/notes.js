const exp = require("express");

const router = exp.Router();

router.get("/", (req,res)=>{
    obj = {
        a:"notes",
        number:38
    }

    res.json(obj);
});

module.exports = router;