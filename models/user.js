

const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:'This is required',
        index: {unique: true}
    },
    password:{
        type:String,
        required:'This is required'
    },
    phone:{
        type:Number,
        required:'This is required',
        index: {unique: true}
    },
  
}) ;


module.exports = mongoose.model("User",UserSchema);



