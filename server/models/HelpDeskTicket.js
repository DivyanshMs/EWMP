// HelpDeskTicket.js — Phase 5B
const mongoose = require('mongoose');
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('HelpDeskTicket', schema);

