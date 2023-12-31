const mongoose = require("mongoose");

const conn = async ()=>{
    await mongoose.connect("mongodb://0.0.0.0:27017/NoteZilla").then(()=>{
    console.log("Connected to childern");
}).catch((err)=>{
    console.log(err);
})};

module.exports = conn;