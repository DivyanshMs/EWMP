// Employee.js — Phase 4A
// Schema: DATABASE_DESIGN.md Collection: employees (CENTRAL ENTITY)
const mongoose = require('mongoose');
const schema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('Employee', schema);
