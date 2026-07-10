/**
 * verifyNoSqlInjection.js — High Severity Security Fix Verification
 * Automated verification script for application-wide NoSQL injection protection.
 * Verifies normal operations pass cleanly while NoSQL operator injection payloads are sanitized.
 */

const http = require('http');
const app = require('../app');
const { connectDB } = require('../config/db');
const Department = require('../models/Department');
const Designation = require('../models/Designation');

let server;
let baseUrl;

const runTests = async () => {
  console.log('🚀 Starting NoSQL Injection Protection Verification...');
  await connectDB();

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/api`;
  console.log(`📡 Test server listening on port ${port}`);

  try {
    // 1. Normal Login
    console.log('\n--- 1. Testing Normal Login ---');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hr@ewmp.local', password: 'Hr@123456' }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      throw new Error(`Normal login failed: ${loginData.message || JSON.stringify(loginData)}`);
    }
    console.log('✅ Normal login succeeded.');
    const token = loginData.data.accessToken;

    // 2. Search Endpoint (Normal query parameters)
    console.log('\n--- 2. Testing Search Endpoint (Normal query parameters) ---');
    const searchRes = await fetch(`${baseUrl}/employees?search=admin&page=1&limit=5`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const searchData = await searchRes.json();
    if (!searchData.success) {
      throw new Error(`Search endpoint failed: ${searchData.message || JSON.stringify(searchData)}`);
    }
    const searchCount = searchData.data.items ? searchData.data.items.length : searchData.data.length;
    console.log(`✅ Normal employee search succeeded. Matched: ${searchCount} records.`);

    // 3. Attendance Query (Normal query parameters)
    console.log('\n--- 3. Testing Attendance Query ---');
    const attRes = await fetch(`${baseUrl}/attendance?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const attData = await attRes.json();
    if (!attData.success) {
      throw new Error(`Attendance query failed: ${attData.message || JSON.stringify(attData)}`);
    }
    const attCount = attData.data.items ? attData.data.items.length : attData.data.length;
    console.log(`✅ Normal attendance query succeeded. Records: ${attCount}.`);

    // 4. Employee Creation (Normal request body)
    console.log('\n--- 4. Testing Employee Creation ---');
    const dept = await Department.findOne();
    const desig = await Designation.findOne();
    const newEmp = {
      firstName: 'Sanitize',
      lastName: 'Tester',
      email: `sanitize.test.${Date.now()}@ewmp.local`,
      mobile: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: 'SecurePassword123!',
      role: 'EMPLOYEE',
      departmentId: dept._id.toString(),
      designationId: desig._id.toString(),
      joiningDate: '2026-07-01',
      employmentType: 'Full-Time',
      basicSalary: 60000,
      aadharNumber: '123456789012',
      panNumber: 'ABCDE1234F',
    };
    const createRes = await fetch(`${baseUrl}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEmp),
    });
    const createData = await createRes.json();
    if (!createData.success) {
      throw new Error(`Normal employee creation failed: ${createData.message || JSON.stringify(createData)}`);
    }
    console.log(`✅ Normal employee creation processed successfully (Status: ${createRes.status}).`);

    // 5. Payload containing {"$ne": null}
    console.log('\n--- 5. Testing NoSQL Operator Injection: {"$ne": null} ---');
    const neRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: { $ne: null }, password: { $ne: null } }),
    });
    const neData = await neRes.json();
    console.log(`✅ Request with {"$ne": null} sanitized/rejected (Status: ${neRes.status}). Response:`, neData.message || JSON.stringify(neData));
    if (neRes.status === 200 && neData.success) {
      throw new Error('SECURITY FAILURE: {"$ne": null} allowed authentication bypass!');
    }

    // 6. Payload containing {"$gt": ""}
    console.log('\n--- 6. Testing NoSQL Operator Injection: {"$gt": ""} ---');
    const gtRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: { $gt: '' }, password: { $gt: '' } }),
    });
    const gtData = await gtRes.json();
    console.log(`✅ Request with {"$gt": ""} sanitized/rejected (Status: ${gtRes.status}). Response:`, gtData.message || JSON.stringify(gtData));
    if (gtRes.status === 200 && gtData.success) {
      throw new Error('SECURITY FAILURE: {"$gt": ""} allowed authentication bypass!');
    }

    // 7. Payload containing {"$regex": ".*"}
    console.log('\n--- 7. Testing NoSQL Operator Injection: {"$regex": ".*"} ---');
    const regexRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: { $regex: '.*' }, password: { $regex: '.*' } }),
    });
    const regexData = await regexRes.json();
    console.log(`✅ Request with {"$regex": ".*"} sanitized/rejected (Status: ${regexRes.status}). Response:`, regexData.message || JSON.stringify(regexData));
    if (regexRes.status === 200 && regexData.success) {
      throw new Error('SECURITY FAILURE: {"$regex": ".*"} allowed authentication bypass!');
    }

    console.log('\n==========================================================');
    console.log('🎉 ALL NOSQL INJECTION PROTECTION TESTS PASSED SUCCESSFULLY!');
    console.log('==========================================================\n');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
};

runTests();
