
const mongoose = require("mongoose");
const loginSchema = new mongoose.Schema({
    userName:{
        type :String,
        required:true,
        trim:true,
        unique: true
        },
        password:{
            type:String,
            required:true
        },})

        module.exports = mongoose.model("login_students", loginSchema);