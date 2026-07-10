/**
 * seedAuth.js
 * Seed Script: Default Organization + one login account for each EWMP role.
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
        name: 'Enterprise Workforce Management Platform',
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

    // 2. Seed login accounts only. No departments, employees, payrolls,
    // tickets, leave records, reports, or other demo business data are created.
    const loginAccounts = [
      { email: 'admin@ewmp.local', password: 'Admin@123456', role: ROLES.SUPER_ADMIN },
      { email: 'orgadmin@ewmp.local', password: 'OrgAdmin@123456', role: ROLES.ORG_ADMIN },
      { email: 'hr@ewmp.local', password: 'Hr@123456', role: ROLES.HR_MANAGER },
      { email: 'finance@ewmp.local', password: 'Finance@123456', role: ROLES.FINANCE },
      { email: 'manager@ewmp.local', password: 'Manager@123456', role: ROLES.MANAGER },
      { email: 'teamlead@ewmp.local', password: 'TeamLead@123456', role: ROLES.TEAM_LEAD },
      { email: 'employee@ewmp.local', password: 'Employee@123456', role: ROLES.EMPLOYEE },
      { email: 'itadmin@ewmp.local', password: 'ItAdmin@123456', role: ROLES.IT_ADMIN },
      { email: 'auditor@ewmp.local', password: 'Auditor@123456', role: ROLES.AUDITOR },
    ];

    for (const account of loginAccounts) {
      let user = await User.findOne({ email: account.email });
      if (!user) {
        const passwordHash = await bcrypt.hash(account.password, 12);
        user = await User.create({
          email: account.email,
          passwordHash,
          role: account.role,
          organizationId: org._id,
          isActive: true,
          status: 'active',
        });
        console.log(`Created ${account.role} login: ${user.email} (${user._id})`);
      } else {
        user.role = account.role;
        user.organizationId = org._id;
        user.isActive = true;
        user.status = 'active';
        await user.save();
        console.log(`${account.role} login already exists: ${user.email} (${user._id})`);
      }
    }

    console.log('\n--- Seed Complete ---');
    console.table(loginAccounts.map(({ email, password, role }) => ({ email, password, role })));

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
