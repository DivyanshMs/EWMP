// SystemSettings.js — Phase 4A
const mongoose = require('mongoose');
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('SystemSettings', schema);
