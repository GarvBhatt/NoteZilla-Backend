const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    priorityLevel:{
        type:String,
        default:"Low"
    },
    expectedDate:{
        type:String,
    },
    Date:{
        type:Date,
        default:Date.now
    }
});

module.exports = new mongoose.model("Notes",noteSchema);