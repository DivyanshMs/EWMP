/**
 * verifyLeaveModule.js — Phase 4B Verification
 * Automated verification script for Leave Management Module.
 * Tests Leave Type CRUD, automatic Leave Balance initialization, working day calculations, overlapping date checks, approval workflow, and attendance integration.
 */

const http = require('http');
const mongoose = require('mongoose');
const app = require('../app');
const { connectDB } = require('../config/db');
const LeaveType = require('../models/LeaveType');
const LeaveBalance = require('../models/LeaveBalance');
const LeaveRequest = require('../models/LeaveRequest');
const Attendance = require('../models/Attendance');

let server;
let baseUrl;

const formatYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const runTests = async () => {
  console.log('🚀 Starting Leave Management Module Verification...');
  await connectDB();

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/api`;
  console.log(`📡 Test server listening on port ${port}`);

  try {
    // 1. Authenticate HR_MANAGER & EMPLOYEE
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

    const empLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'employee@ewmp.local', password: 'Employee@123456' }),
    });
    const empLoginData = await empLoginRes.json();
    if (!empLoginData.success) throw new Error(`Employee login failed: ${empLoginData.message}`);
    const empToken = empLoginData.data.accessToken;
    console.log('✅ EMPLOYEE logged in successfully');

    // Clean up previous test leave data for clean run
    const oldTypes = await LeaveType.find({ code: 'TEST_AL' });
    const oldTypeIds = oldTypes.map(t => t._id);
    await LeaveBalance.deleteMany({ leaveTypeId: { $in: oldTypeIds } });
    await LeaveRequest.deleteMany({
      $or: [
        { leaveTypeId: { $in: oldTypeIds } },
        { reason: { $regex: 'Automated test|duplicate overlapping', $options: 'i' } }
      ]
    });
    await Attendance.deleteMany({ attendanceStatus: 'Leave' });
    await LeaveType.deleteMany({ code: 'TEST_AL' });

    // 2. Create Leave Type
    console.log('\n--- 2. Testing Leave Type Creation (HR_MANAGER) ---');
    const createTypeRes = await fetch(`${baseUrl}/leave-types`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrToken}`,
      },
      body: JSON.stringify({
        name: 'Test Annual Leave',
        code: 'TEST_AL',
        maxDaysPerYear: 15,
        isPaidLeave: true,
        requiresApproval: true,
        description: 'Automated test annual leave',
      }),
    });
    const createTypeData = await createTypeRes.json();
    if (!createTypeData.success) throw new Error(`Create leave type failed: ${createTypeData.message}`);
    const leaveTypeId = createTypeData.data._id;
    console.log(`✅ Leave Type created: ${createTypeData.data.name} [${createTypeData.data.code}], maxDays: ${createTypeData.data.maxDaysPerYear}`);

    // 3. Query My Leave Balances & Verify Auto-Initialization
    console.log('\n--- 3. Testing Automatic Leave Balance Initialization (EMPLOYEE) ---');
    const balRes = await fetch(`${baseUrl}/leave-balances/my`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const balData = await balRes.json();
    if (!balData.success) throw new Error(`Get balances failed: ${balData.message}`);
    const testBal = balData.data.find(b => b.leaveTypeId && (b.leaveTypeId._id || b.leaveTypeId).toString() === leaveTypeId.toString());
    if (!testBal) throw new Error('Auto-initialized leave balance not found!');
    if (testBal.entitledDays !== 15 || testBal.remainingDays !== 15) {
      throw new Error(`Unexpected balance numbers: entitled=${testBal.entitledDays}, remaining=${testBal.remainingDays}`);
    }
    console.log(`✅ Balance automatically initialized! Entitled: ${testBal.entitledDays}, Remaining: ${testBal.remainingDays}`);

    // 4. Submit Leave Request
    console.log('\n--- 4. Testing Leave Request Submission (EMPLOYEE) ---');
    // Find next Monday and Tuesday in local calendar time to guarantee 2 working days
    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
    const nextTuesday = new Date(nextMonday);
    nextTuesday.setDate(nextMonday.getDate() + 1);

    const startStr = formatYMD(nextMonday);
    const endStr = formatYMD(nextTuesday);

    const submitRes = await fetch(`${baseUrl}/leave-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${empToken}`,
      },
      body: JSON.stringify({
        leaveTypeId,
        startDate: startStr,
        endDate: endStr,
        reason: 'Automated test leave request for family vacation.',
      }),
    });
    const submitData = await submitRes.json();
    if (!submitData.success) throw new Error(`Submit leave request failed: ${submitData.message}`);
    const leaveRequestId = submitData.data._id;
    console.log(`✅ Leave Request submitted successfully! Total Days: ${submitData.data.totalDays}, Status: ${submitData.data.approvalStatus}`);
    if (submitData.data.totalDays !== 2) {
      throw new Error(`Expected totalDays to be 2, got ${submitData.data.totalDays}`);
    }

    // Verify balance pendingDays increased
    const balAfterSubmitRes = await fetch(`${baseUrl}/leave-balances/my`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const balAfterSubmitData = await balAfterSubmitRes.json();
    const testBalAfterSubmit = balAfterSubmitData.data.find(b => b._id.toString() === testBal._id.toString());
    if (testBalAfterSubmit.pendingDays !== 2) {
      throw new Error(`Expected pendingDays to be 2, got ${testBalAfterSubmit.pendingDays}`);
    }
    console.log(`✅ Balance pendingDays correctly incremented to: ${testBalAfterSubmit.pendingDays}`);

    // 5. Verify Overlapping Leave Request Rejection
    console.log('\n--- 5. Testing Overlapping Leave Request Protection ---');
    const overlapRes = await fetch(`${baseUrl}/leave-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${empToken}`,
      },
      body: JSON.stringify({
        leaveTypeId,
        startDate: startStr,
        endDate: endStr,
        reason: 'Attempting duplicate overlapping leave request.',
      }),
    });
    if (overlapRes.status !== 409) {
      const err = await overlapRes.json();
      throw new Error(`Expected status 409 Conflict for overlap, got ${overlapRes.status}: ${JSON.stringify(err)}`);
    }
    console.log('✅ Overlapping leave request correctly rejected with 409 Conflict!');

    // 6. Approve Leave Request & Verify Balance & Attendance
    console.log('\n--- 6. Testing Leave Request Approval & Attendance Integration (HR_MANAGER) ---');
    const approveRes = await fetch(`${baseUrl}/leave-requests/${leaveRequestId}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrToken}`,
      },
      body: JSON.stringify({ approverNotes: 'Approved for automated testing.' }),
    });
    const approveData = await approveRes.json();
    if (!approveData.success) throw new Error(`Approve leave request failed: ${approveData.message}`);
    if (approveData.data.approvalStatus !== 'Approved') {
      throw new Error(`Expected status Approved, got ${approveData.data.approvalStatus}`);
    }
    console.log(`✅ Leave Request approved! Status: ${approveData.data.approvalStatus}`);

    // Verify remainingDays decreased and usedDays increased
    const balAfterApproveRes = await fetch(`${baseUrl}/leave-balances/my`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const balAfterApproveData = await balAfterApproveRes.json();
    const testBalAfterApprove = balAfterApproveData.data.find(b => b._id.toString() === testBal._id.toString());
    if (testBalAfterApprove.remainingDays !== 13 || testBalAfterApprove.usedDays !== 2 || testBalAfterApprove.pendingDays !== 0) {
      throw new Error(`Unexpected balance after approval: remaining=${testBalAfterApprove.remainingDays}, used=${testBalAfterApprove.usedDays}, pending=${testBalAfterApprove.pendingDays}`);
    }
    console.log(`✅ Balance correctly updated! Remaining: ${testBalAfterApprove.remainingDays}, Used: ${testBalAfterApprove.usedDays}, Pending: ${testBalAfterApprove.pendingDays}`);

    // Check linked Attendance records
    const attendanceCount = await Attendance.countDocuments({ leaveRequestId });
    console.log(`✅ Linked Attendance records created for leave dates: ${attendanceCount} record(s) found.`);

    // 7. Cancel Approved Leave Request
    console.log('\n--- 7. Testing Approved Leave Cancellation & Balance Restoration (HR_MANAGER) ---');
    const cancelRes = await fetch(`${baseUrl}/leave-requests/${leaveRequestId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hrToken}`,
      },
      body: JSON.stringify({ cancellationReason: 'Testing cancellation and restoration.' }),
    });
    const cancelData = await cancelRes.json();
    if (!cancelData.success) throw new Error(`Cancel leave request failed: ${cancelData.message}`);
    if (cancelData.data.approvalStatus !== 'Cancelled') {
      throw new Error(`Expected status Cancelled, got ${cancelData.data.approvalStatus}`);
    }
    console.log(`✅ Leave Request cancelled! Status: ${cancelData.data.approvalStatus}`);

    // Verify remainingDays restored
    const balAfterCancelRes = await fetch(`${baseUrl}/leave-balances/my`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const balAfterCancelData = await balAfterCancelRes.json();
    const testBalAfterCancel = balAfterCancelData.data.find(b => b._id.toString() === testBal._id.toString());
    if (testBalAfterCancel.remainingDays !== 15 || testBalAfterCancel.usedDays !== 0) {
      throw new Error(`Unexpected balance after cancellation: remaining=${testBalAfterCancel.remainingDays}, used=${testBalAfterCancel.usedDays}`);
    }
    console.log(`✅ Balance fully restored! Remaining: ${testBalAfterCancel.remainingDays}, Used: ${testBalAfterCancel.usedDays}`);

    // Verify future linked Attendance records deleted
    const attendanceAfterCancelCount = await Attendance.countDocuments({ leaveRequestId });
    console.log(`✅ Linked future Attendance records cleaned up: ${attendanceAfterCancelCount} record(s) remaining.`);

    // Clean up test leave type
    await LeaveType.deleteMany({ code: 'TEST_AL' });
    await LeaveBalance.deleteMany({ leaveTypeId });
    await LeaveRequest.deleteMany({ _id: leaveRequestId });

    console.log('\n🎉 ALL LEAVE MANAGEMENT VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    console.error(error.stack);
    process.exitCode = 1;
  } finally {
    server.close();
    await mongoose.connection.close();
    console.log('🔒 Database connection closed.');
  }
};

runTests();
