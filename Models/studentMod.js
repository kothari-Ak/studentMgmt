const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    Name:{
        type :String,
        required:true,
        trim:true
        },
        Age:{
            type:Number,
            required:true
        },
        Mobile:{
            type:String,
            unique:true,
            required:true,
            trim:true
        },
        Email:{
            type:String,
            unique:true,
            required:true,
            trim:true
        },
        isDeleted:{
            type:Boolean,
            default:false
        }
    },
        {timestamps:true});
    
    module.exports = mongoose.model("Project_students", studentSchema);
    