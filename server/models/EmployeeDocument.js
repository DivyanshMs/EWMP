// EmployeeDocument.js — Phase 5C
const mongoose = require('mongoose');
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('EmployeeDocument', schema);
