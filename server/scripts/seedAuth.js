/**
 * seedAuth.js — Phase 3 Deliverable
 * Seed Script: Default Organization + SUPER_ADMIN User
 *
 * Authority: DEVELOPMENT_ORDER.md Section 10 (Step 11 — Deliverables)
 * Usage: node scripts/seedAuth.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Organization = require('../models/Organization');
const User = require('../models/User');
const { ROLES } = require('../config/constants');
const config = require('../config/config');

const seedAuth = async () => {
  try {
    if (!config.db.uri) {
      console.error('Error: MONGODB_URI is not defined in environment variables.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(config.db.uri, config.db.options);
    console.log('Connected.');

    // 1. Seed Default Organization
    let org = await Organization.findOne({ code: 'EWMP' });
    if (!org) {
      org = await Organization.create({
        name: 'Enterprise Workforce Management Platform Demo',
        code: 'EWMP',
        industry: 'Information Technology',
        email: 'admin@ewmp.local',
        phone: '+1-800-555-0199',
        status: 'active',
      });
      console.log(`Created default organization: ${org.name} (${org._id})`);
    } else {
      console.log(`Default organization already exists: ${org.name} (${org._id})`);
    }

    // 2. Seed SUPER_ADMIN User
    const superAdminEmail = 'admin@ewmp.local';
    let adminUser = await User.findOne({ email: superAdminEmail });
    if (!adminUser) {
      const passwordHash = await bcrypt.hash('Admin@123456', 12);
      adminUser = await User.create({
        email: superAdminEmail,
        passwordHash,
        role: ROLES.SUPER_ADMIN,
        organizationId: org._id,
        isActive: true,
        status: 'active',
      });
      console.log(`Created SUPER_ADMIN user: ${adminUser.email} (${adminUser._id})`);
    } else {
      console.log(`SUPER_ADMIN user already exists: ${adminUser.email} (${adminUser._id})`);
    }

    console.log('\n--- Seed Complete ---');
    console.log('Login Credentials:');
    console.log(`Email:    admin@ewmp.local`);
    console.log(`Password: Admin@123456`);
    console.log(`Role:     SUPER_ADMIN`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

if (require.main === module) {
  seedAuth();
}

module.exports = seedAuth;
