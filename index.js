const exp = require("express");
const conn = require("./db");
const port = 8000;

const app =  exp();
conn();

app.use(exp.json());

app.get("/",(req,res)=>{
    res.status(200).send("Hello children");
});

app.use("/api/auth",require("./routes/auth"));
app.use("/api/notes",require("./routes/notes"));

app.listen(port,()=>{
    console.log("Listening to children");
})