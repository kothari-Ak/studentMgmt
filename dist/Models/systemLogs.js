"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const systemLogSchema = new mongoose.Schema({
    StudentId: {
        type: String,
        trim: true,
    },
    Event: {
        type: String,
        trim: true,
    },
    TimeStamps: {
        type: Date
    },
    Description: {
        type: String,
        trim: true,
    }
});
module.exports = mongoose.model("system_logs", systemLogSchema);
