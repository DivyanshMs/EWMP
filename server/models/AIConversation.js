// AIConversation.js — Phase 6A
const mongoose = require('mongoose');
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('AIConversation', schema);

