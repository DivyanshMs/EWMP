// Payroll.js — Phase 4C
const mongoose = require('mongoose');
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('Payroll', schema);

