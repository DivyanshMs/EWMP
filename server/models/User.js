// User.js — Phase 3
// Schema: DATABASE_DESIGN.md Collection: users
const mongoose = require('mongoose');
// TODO: Implement full schema in Phase 3
const userSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);

