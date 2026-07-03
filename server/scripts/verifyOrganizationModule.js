/**
 * verifyOrganizationModule.js — Phase 4A: Organization Management Module Verification
 * Automated verification test suite for ORG-001.
 * Tests endpoints, RBAC rules, Zod validation, and database state synchronization.
 *
 * Authority: DEVELOPMENT_ORDER.md Step 22
 */

const http = require('http');
const mongoose = require('mongoose');
const app = require('../app');
const { connectDB } = require('../config/db');
const Organization = require('../models/Organization');
const SystemSetting = require('../models/SystemSetting');
const AuditLog = require('../models/AuditLog');

const PORT = 0; // Ephemeral port
let server;
let baseUrl;

const runTests = async () => {
  console.log('🚀 Starting Organization Management Module Verification...\n');

  try {
    await connectDB();

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(PORT, resolve));
    const port = server.address().port;
    baseUrl = `http://localhost:${port}/api`;
    console.log(`📡 Test server listening on port ${port}\n`);

    // ─── Step 1: Authenticate SUPER_ADMIN and EMPLOYEE ──────────────────────
    console.log('--- 1. Authenticating SUPER_ADMIN & EMPLOYEE ---');
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@ewmp.local', password: 'Admin@123456' }),
    });
    const adminLoginData = await adminLoginRes.json();
    if (!adminLoginData.success) {
      throw new Error(`SUPER_ADMIN login failed: ${adminLoginData.message}`);
    }
    const adminToken = adminLoginData.data.accessToken;
    console.log('✅ SUPER_ADMIN logged in successfully');

    const empLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'employee@ewmp.local', password: 'Employee@123456' }),
    });
    const empLoginData = await empLoginRes.json();
    if (!empLoginData.success) {
      throw new Error(`EMPLOYEE login failed: ${empLoginData.message}`);
    }
    const empToken = empLoginData.data.accessToken;
    console.log('✅ EMPLOYEE logged in successfully\n');

    // ─── Step 2: Test GET /organizations/current ────────────────────────────
    console.log('--- 2. Testing GET /api/organizations/current ---');
    const getOrgRes = await fetch(`${baseUrl}/organizations/current`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const getOrgData = await getOrgRes.json();
    if (!getOrgData.success || !getOrgData.data.code) {
      throw new Error(`Failed to get current org: ${JSON.stringify(getOrgData)}`);
    }
    console.log(`✅ Retrieved Current Organization: ${getOrgData.data.name} (${getOrgData.data.code})`);
    console.log(`   Timezone: ${getOrgData.data.timezone} | Currency: ${getOrgData.data.currency}\n`);

    // ─── Step 3: Test RBAC Restriction on PUT /organizations/current ────────
    console.log('--- 3. Testing RBAC Restrictions (EMPLOYEE updating org -> 403) ---');
    const rbacPutRes = await fetch(`${baseUrl}/organizations/current`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${empToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Unauthorized Update' }),
    });
    if (rbacPutRes.status !== 403) {
      throw new Error(`Expected status 403 for EMPLOYEE updating org, got ${rbacPutRes.status}`);
    }
    console.log('✅ RBAC correctly blocked EMPLOYEE from updating organization (403 Forbidden)\n');

    // ─── Step 4: Test Zod Validation on PUT /organizations/current ──────────
    console.log('--- 4. Testing Validation Rules (Invalid email & website -> 400) ---');
    const valPutRes = await fetch(`${baseUrl}/organizations/current`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email-format',
        website: 'not-a-valid-url',
      }),
    });
    const valPutData = await valPutRes.json();
    if (valPutRes.status !== 400 || valPutData.success !== false) {
      throw new Error(`Expected status 400 for validation failure, got ${valPutRes.status}`);
    }
    console.log('✅ Zod correctly rejected invalid email and website with structured error fields:');
    console.log(`   Fields: ${JSON.stringify(valPutData.error?.fields || valPutData.error)}\n`);

    // ─── Step 5: Test PUT /organizations/current (Success) ──────────────────
    console.log('--- 5. Testing PUT /api/organizations/current (Success) ---');
    const updateOrgRes = await fetch(`${baseUrl}/organizations/current`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Enterprise Workforce Management Platform Demo',
        phone: '+1-800-555-0199',
        website: 'https://www.ewmp.local',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560100',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
      }),
    });
    const updateOrgData = await updateOrgRes.json();
    if (!updateOrgData.success) {
      throw new Error(`Failed to update org: ${JSON.stringify(updateOrgData)}`);
    }
    console.log('✅ Organization updated successfully by SUPER_ADMIN');
    console.log(`   Updated Address City: ${updateOrgData.data.address?.city} | Postal Code: ${updateOrgData.data.address?.postalCode}\n`);

    // ─── Step 6: Test GET /organizations/settings ───────────────────────────
    console.log('--- 6. Testing GET /api/organizations/settings ---');
    const getSetRes = await fetch(`${baseUrl}/organizations/settings`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const getSetData = await getSetRes.json();
    if (!getSetData.success || !getSetData.data.timezone) {
      throw new Error(`Failed to get settings: ${JSON.stringify(getSetData)}`);
    }
    console.log('✅ Retrieved Organization Settings:');
    console.log(`   Timezone: ${getSetData.data.timezone} | Currency: ${getSetData.data.currency}`);
    console.log(`   Working Days: ${getSetData.data.workingDays?.join(', ')} | Shift: ${getSetData.data.defaultShift}\n`);

    // ─── Step 7: Test PUT /organizations/settings (Success) ─────────────────
    console.log('--- 7. Testing PUT /api/organizations/settings (Success) ---');
    const updateSetRes = await fetch(`${baseUrl}/organizations/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        language: 'en-GB',
        workingDaysPerWeek: 5,
        defaultShift: 'Flexible Day Shift',
        payrollCycle: 'Monthly',
      }),
    });
    const updateSetData = await updateSetRes.json();
    if (!updateSetData.success || updateSetData.data.dateFormat !== 'DD/MM/YYYY') {
      throw new Error(`Failed to update settings: ${JSON.stringify(updateSetData)}`);
    }
    console.log('✅ Settings updated successfully by SUPER_ADMIN');
    console.log(`   New Date Format: ${updateSetData.data.dateFormat} | New Shift: ${updateSetData.data.defaultShift}\n`);

    // ─── Step 8: Test AuditLog Creation ─────────────────────────────────────
    console.log('--- 8. Verifying Audit Logs for Organization & Settings updates ---');
    const logs = await AuditLog.find({ action: { $in: ['ORGANIZATION_UPDATED', 'SETTINGS_UPDATED'] } })
      .sort({ createdAt: -1 })
      .limit(2);
    if (logs.length < 2) {
      throw new Error(`Expected at least 2 audit logs, found ${logs.length}`);
    }
    console.log(`✅ Verified ${logs.length} AuditLog entries created in DB for operational compliance`);
    logs.forEach((log) => console.log(`   🔸 Action: ${log.action} | EntityType: ${log.entityType} | ActorRole: ${log.actorRole}`));

    console.log('\n==========================================================');
    console.log('🎉 ALL ORGANIZATION MANAGEMENT MODULE TESTS PASSED SUCCESSFULLY!');
    console.log('==========================================================\n');

  } catch (err) {
    console.error('\n❌ VERIFICATION TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await mongoose.disconnect();
    console.log('👋 Test server and database connection closed.');
  }
};

runTests();
