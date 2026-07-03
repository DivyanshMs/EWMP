// LeaveRequest.js — Phase 4B
const mongoose = require('mongoose');
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('LeaveRequest', schema);
