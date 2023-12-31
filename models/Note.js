const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    discription:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:"General"
    },
    Date:{
        type:Date,
        default:Date.now
    }
});

module.exports = new mongoose.Schema("noteObj",noteSchema);