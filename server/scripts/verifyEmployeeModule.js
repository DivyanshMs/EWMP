/**
 * verifyEmployeeModule.js — Phase 4A Verification
 * Automated verification script for Employee Management Module.
 * Tests CRUD, pagination, filtering, search, RBAC restrictions, PII protection, and atomic transactions.
 */

const http = require('http');
const mongoose = require('mongoose');
const app = require('../app');
const { connectDB } = require('../config/db');
const Department = require('../models/Department');
const Designation = require('../models/Designation');
const Employee = require('../models/Employee');
const User = require('../models/User');
const LeaveBalance = require('../models/LeaveBalance');

let server;
let baseUrl;

const runTests = async () => {
  console.log('🚀 Starting Employee Management Module Verification...');
  await connectDB();

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/api`;
  console.log(`📡 Test server listening on port ${port}`);

  try {
    // 1. Authenticate HR_MANAGER
    console.log('\n--- 1. Authenticating HR_MANAGER & EMPLOYEE ---');
    const hrLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hr@ewmp.local', password: 'Hr@123456' }),
    });
    const hrLoginData = await hrLoginRes.json();
    if (!hrLoginData.success) throw new Error(`HR login failed: ${hrLoginData.message}`);
    const hrToken = hrLoginData.data.accessToken;
    console.log('✅ HR_MANAGER logged in successfully');

    // Authenticate EMPLOYEE
    const empLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'employee@ewmp.local', password: 'Employee@123456' }),
    });
    const empLoginData = await empLoginRes.json();
    if (!empLoginData.success) throw new Error(`Employee login failed: ${empLoginData.message}`);
    const empToken = empLoginData.data.accessToken;
    console.log('✅ EMPLOYEE logged in successfully');

    // Authenticate AUDITOR
    const audLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'auditor@ewmp.local', password: 'Auditor@123456' }),
    });
    const audLoginData = await audLoginRes.json();
    const audToken = audLoginData.data.accessToken;
    console.log('✅ AUDITOR logged in successfully');

    // Authenticate SUPER_ADMIN
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@ewmp.local', password: 'Admin@123456' }),
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.data.accessToken;
    console.log('✅ SUPER_ADMIN logged in successfully');

    // 2. Test GET /api/employees (Pagination & List)
    console.log('\n--- 2. Testing GET /api/employees (Pagination & List) ---');
    const listRes = await fetch(`${baseUrl}/employees?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${hrToken}` },
    });
    const listData = await listRes.json();
    if (!listData.success || !Array.isArray(listData.data.items)) {
      throw new Error('Failed to retrieve paginated employee list');
    }
    console.log(`✅ Retrieved ${listData.data.items.length} employees (Total: ${listData.data.total}, TotalPages: ${listData.data.totalPages})`);

    // 3. Test Search Filtering
    console.log('\n--- 3. Testing Employee Search ---');
    const searchRes = await fetch(`${baseUrl}/employees?search=admin`, {
      headers: { Authorization: `Bearer ${hrToken}` },
    });
    const searchData = await searchRes.json();
    console.log(`✅ Search for 'admin' matched ${searchData.data.items.length} employees`);

    // 4. Test RBAC Restrictions (EMPLOYEE creating employee -> 403)
    console.log('\n--- 4. Testing RBAC Restrictions (EMPLOYEE creating employee -> 403) ---');
    const rbacRes = await fetch(`${baseUrl}/employees`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${empToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: 'Hacker', lastName: 'User' }),
    });
    if (rbacRes.status !== 403) {
      throw new Error(`Expected status 403 for unauthorized employee creation, got ${rbacRes.status}`);
    }
    console.log('✅ RBAC correctly blocked EMPLOYEE from creating a new employee profile (403 Forbidden)');

    // 5. Test Employee Creation (Atomic Transaction)
    console.log('\n--- 5. Testing Employee Creation (Atomic Transaction) ---');
    const dept = await Department.findOne({ code: 'ENG' });
    const desig = await Designation.findOne({ code: 'SSE' });
    const testEmail = `test.sde.${Date.now()}@ewmp.local`;
    const testMobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

    const createPayload = {
      firstName: 'Verification',
      lastName: 'Engineer',
      email: testEmail,
      mobile: testMobile,
      password: 'SecurePassword123!',
      role: 'EMPLOYEE',
      departmentId: dept._id.toString(),
      designationId: desig._id.toString(),
      joiningDate: '2026-07-01',
      employmentType: 'Full-Time',
      basicSalary: 85000,
      aadharNumber: '123456789012',
      panNumber: 'ABCDE1234F',
    };

    const createRes = await fetch(`${baseUrl}/employees`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hrToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createPayload),
    });
    const createData = await createRes.json();
    if (!createData.success) {
      throw new Error(`Employee creation failed: ${createData.message} ${JSON.stringify(createData.error || {})}`);
    }
    const newEmp = createData.data;
    console.log(`✅ Employee created successfully: ${newEmp.firstName} ${newEmp.lastName} (${newEmp.employeeId})`);

    // Verify User account & Leave balances created
    const createdUser = await User.findOne({ email: testEmail });
    const createdLeaveBalances = await LeaveBalance.find({ employeeId: newEmp._id });
    if (!createdUser) throw new Error('User account was not atomically created!');
    if (createdLeaveBalances.length === 0) throw new Error('Leave balances were not initialized!');
    console.log(`✅ Atomic Verification: User account (${createdUser._id}) and ${createdLeaveBalances.length} leave balances verified in DB`);

    // 6. Test PII Scoping (GET /api/employees/:id)
    console.log('\n--- 6. Testing Role-Scoped PII Access ---');
    const hrGetRes = await fetch(`${baseUrl}/employees/${newEmp._id}`, {
      headers: { Authorization: `Bearer ${hrToken}` },
    });
    const hrGetData = await hrGetRes.json();
    if (!hrGetData.data.panNumber || !hrGetData.data.aadharNumber) {
      throw new Error('HR_MANAGER failed to receive restricted PII fields!');
    }
    console.log(`✅ HR_MANAGER received PII: PAN (${hrGetData.data.panNumber}), Aadhar (${hrGetData.data.aadharNumber})`);

    const audGetRes = await fetch(`${baseUrl}/employees/${newEmp._id}`, {
      headers: { Authorization: `Bearer ${audToken}` },
    });
    const audGetData = await audGetRes.json();
    if (audGetData.data.panNumber || audGetData.data.aadharNumber) {
      throw new Error('AUDITOR improperly received restricted PII fields!');
    }
    console.log('✅ AUDITOR properly restricted from viewing PII fields');

    // 7. Test Profile Update (PUT)
    console.log('\n--- 7. Testing Profile Update (PUT) ---');
    const updateRes = await fetch(`${baseUrl}/employees/${newEmp._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${hrToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ basicSalary: 95000, gender: 'Prefer Not to Say' }),
    });
    const updateData = await updateRes.json();
    if (!updateData.success || updateData.data.basicSalary !== 95000) {
      throw new Error('Failed to update employee profile');
    }
    console.log(`✅ Updated employee basicSalary to ${updateData.data.basicSalary}`);

    // 8. Test Status Transition (PATCH /status)
    console.log('\n--- 8. Testing Employment Status Transition ---');
    const statusRes = await fetch(`${baseUrl}/employees/${newEmp._id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${hrToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employmentStatus: 'Notice Period', exitReason: 'Personal career growth' }),
    });
    const statusData = await statusRes.json();
    if (!statusData.success || statusData.data.employmentStatus !== 'Notice Period') {
      throw new Error('Failed to update employment status');
    }
    console.log(`✅ Employment status updated to '${statusData.data.employmentStatus}'`);

    // 9. Test Soft Deletion / Archive (DELETE)
    console.log('\n--- 9. Testing Soft Deletion / Archive ---');
    const hrDelRes = await fetch(`${baseUrl}/employees/${newEmp._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${hrToken}` },
    });
    if (hrDelRes.status !== 403) {
      throw new Error(`Expected 403 for HR_MANAGER archiving employee, got ${hrDelRes.status}`);
    }
    console.log('✅ RBAC correctly blocked HR_MANAGER from archiving employee (403 Forbidden)');

    const delRes = await fetch(`${baseUrl}/employees/${newEmp._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const delData = await delRes.json();
    if (!delData.success) throw new Error(`Archive failed: ${delData.message}`);

    const archivedEmp = await Employee.findById(newEmp._id);
    const archivedUser = await User.findById(createdUser._id);
    if (archivedEmp.status !== 'archived') throw new Error('Employee status was not set to archived!');
    if (archivedUser.isActive !== false || archivedUser.status !== 'archived') {
      throw new Error('Associated User account was not deactivated!');
    }
    console.log(`✅ Employee and User account successfully archived and deactivated (${delData.message})`);

    // 10. Test Timeline Audit Logs
    console.log('\n--- 10. Testing Employee Timeline (Audit Logs) ---');
    const timelineRes = await fetch(`${baseUrl}/employees/${newEmp._id}/timeline`, {
      headers: { Authorization: `Bearer ${hrToken}` },
    });
    const timelineData = await timelineRes.json();
    if (!timelineData.success || !Array.isArray(timelineData.data) || timelineData.data.length < 3) {
      throw new Error('Failed to retrieve employee timeline logs');
    }
    console.log(`✅ Retrieved ${timelineData.data.length} audit logs in employee timeline`);
    timelineData.data.forEach((log) => {
      console.log(`   🔸 [${log.createdAt}] Action: ${log.action} (${log.outcome})`);
    });

    console.log('\n==========================================================');
    console.log('🎉 ALL EMPLOYEE MANAGEMENT MODULE TESTS PASSED SUCCESSFULLY!');
    console.log('==========================================================\n');
  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
    console.log('👋 Test server and database connection closed.');
  }
};

runTests();
