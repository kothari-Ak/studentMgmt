"use strict";
const mongoose = require("mongoose");
//let date=new Date
const studentSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Age: {
        type: String,
        required: true
    },
    Mobile: {
        type: String,
        unique: true,
        required: true
    },
    Email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });
module.exports = mongoose.model("Project_students", studentSchema);
