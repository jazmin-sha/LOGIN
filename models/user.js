

const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:'This is required'
    },
    password:{
        type:String
    },
    phone:{
        type:Number
    },
  
}) ;


module.exports = mongoose.model("User",UserSchema);


