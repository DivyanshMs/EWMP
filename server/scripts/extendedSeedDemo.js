require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const { logInfo, logError } = require('../utils/loggerHelper');

// Import all required models
const Organization = require('../models/Organization');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Department = require('../models/Department');

const Announcement = require('../models/Announcement');
const Asset = require('../models/Asset');
const AssetAllocation = require('../models/AssetAllocation');
const Attendance = require('../models/Attendance');
const AttendanceLogs = require('../models/AttendanceLogs');
const LeaveRequest = require('../models/LeaveRequest');
const Candidate = require('../models/Candidate');
const JobPosition = require('../models/JobPosition');
const InterviewSchedule = require('../models/InterviewSchedule');
const Document = require('../models/Document');
const EmployeeDocument = require('../models/EmployeeDocument');
const HelpDeskTicket = require('../models/HelpDeskTicket');
const Holiday = require('../models/Holiday');
const Project = require('../models/Project');
const Task = require('../models/Task');
const PerformanceReview = require('../models/PerformanceReview');
const Goal = require('../models/Goal');
const Payroll = require('../models/Payroll');
const Payslip = require('../models/Payslip');

const seedExtended = async () => {
  try {
    logInfo('🚀 Starting Extended Demo Seeding (19 Missing Collections)...');
    await connectDB();

    const org = await Organization.findOne({ code: 'EWMP' });
    const superAdmin = await User.findOne({ email: 'admin@ewmp.local' });
    const employees = await Employee.find({ organizationId: org._id }).limit(3);
    const department = await Department.findOne({ organizationId: org._id });

    if (!org || !superAdmin || employees.length === 0) {
      throw new Error('Base seed data missing. Run seedDemo.js first.');
    }

    const employee = employees[0];
    const employee2 = employees[1] || employees[0];

    // 1. Announcements
    if ((await Announcement.countDocuments()) === 0) {
      await Announcement.create({
        organizationId: org._id,
        title: 'Welcome to EWMP',
        content: 'This is a test announcement to ensure the dashboard is populated.',
        announcementType: 'General',
        status: 'active',
        publishedAt: new Date(),
        createdBy: superAdmin._id
      });
      logInfo('✅ Announcements seeded');
    }

    // 2. Assets & Allocations
    if ((await Asset.countDocuments()) === 0) {
      const asset = await Asset.create({
        organizationId: org._id,
        name: 'MacBook Pro M2',
        assetTag: 'AST-MAC-001',
        assetType: 'Laptop',
        assetStatus: 'Allocated',
        purchaseDate: new Date(),
        createdBy: superAdmin._id
      });
      
      await AssetAllocation.create({
        organizationId: org._id,
        assetId: asset._id,
        employeeId: employee._id,
        allocationDate: new Date(),
        issuedBy: superAdmin._id,
        conditionOnIssue: 'Good',
        status: 'active',
        createdBy: superAdmin._id
      });
      logInfo('✅ Assets & Allocations seeded');
    }

    // 3. Attendances & Logs
    if ((await Attendance.countDocuments()) === 0) {
      const attDate = new Date();
      attDate.setDate(attDate.getDate() - 1); // Yesterday
      attDate.setHours(0,0,0,0);
      
      const attendance = await Attendance.create({
        organizationId: org._id,
        employeeId: employee._id,
        date: attDate,
        clockInTime: new Date(attDate.getTime() + 9 * 60 * 60 * 1000), // 9 AM
        clockOutTime: new Date(attDate.getTime() + 17 * 60 * 60 * 1000), // 5 PM
        workingHours: 8,
        attendanceStatus: 'Present',
        createdBy: superAdmin._id
      });
      
      await AttendanceLogs.create({
        attendanceId: attendance._id,
        organizationId: org._id,
        employeeId: employee._id,
        eventType: 'Clock-In',
        eventTime: attendance.clockInTime,
        processedBy: superAdmin._id
      });
      logInfo('✅ Attendances & Logs seeded');
    }

    // 4. LeaveRequests
    if ((await LeaveRequest.countDocuments()) === 0) {
      const LeaveType = require('../models/LeaveType');
      const LeaveBalance = require('../models/LeaveBalance');
      const lt = await LeaveType.findOne({ organizationId: org._id });
      if (lt) {
        let lb = await LeaveBalance.findOne({ employeeId: employee._id, leaveTypeId: lt._id });
        if (!lb) {
           lb = await LeaveBalance.create({ organizationId: org._id, employeeId: employee._id, leaveTypeId: lt._id, totalAccrued: 10, used: 0, balance: 10, createdBy: superAdmin._id });
        }
        await LeaveRequest.create({
          organizationId: org._id,
          employeeId: employee._id,
          leaveTypeId: lt._id,
          leaveBalanceId: lb._id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000), // tomorrow
          totalDays: 2,
          reason: 'Personal leave',
          approvalStatus: 'Pending',
          status: 'active',
          createdBy: superAdmin._id
        });
        logInfo('✅ LeaveRequests seeded');
      }
    }

    // 5. JobPositions, Candidates, InterviewSchedules
    if ((await JobPosition.countDocuments()) === 0) {
      const job = await JobPosition.create({
        organizationId: org._id,
        title: 'Senior Frontend Engineer',
        code: 'JOB-SFE-01',
        departmentId: department._id,
        hiringManagerId: employee._id,
        description: 'We are looking for a Senior Frontend Engineer.',
        employmentType: 'Full-Time',
        jobStatus: 'Open',
        status: 'active',
        totalVacancies: 2,
        createdBy: superAdmin._id
      });
      
      const candidate = await Candidate.create({
        organizationId: org._id,
        jobPositionId: job._id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        mobile: '+1-555-0100',
        candidateStatus: 'Interviewing',
        status: 'active',
        resumeUrl: 'https://example.com/resume.pdf',
        createdBy: superAdmin._id
      });
      
      await InterviewSchedule.create({
        organizationId: org._id,
        candidateId: candidate._id,
        jobPositionId: job._id,
        interviewerId: employee._id,
        round: 'Technical',
        scheduledAt: new Date(Date.now() + 86400000),
        scheduleStatus: 'Scheduled',
        status: 'active',
        createdBy: superAdmin._id
      });
      logInfo('✅ Recruitment (Jobs, Candidates, Interviews) seeded');
    }

    // 6. Documents & EmployeeDocuments
    if ((await Document.countDocuments()) === 0) {
      const doc = await Document.create({
        organizationId: org._id,
        title: 'Employee Handbook 2026',
        category: 'Policy',
        filename: 'handbook2026',
        originalName: 'Employee Handbook 2026.pdf',
        mimeType: 'application/pdf',
        size: 1024000,
        cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
        cloudinaryPublicId: 'sample_pdf',
        uploadedBy: superAdmin._id,
        status: 'active',
        createdBy: superAdmin._id
      });
      
      await EmployeeDocument.create({
        organizationId: org._id,
        employeeId: employee._id,
        documentType: 'Aadhaar',
        documentName: 'Aadhaar Card',
        documentUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
        publicId: 'sample_pdf',
        fileSizeBytes: 1024000,
        mimeType: 'application/pdf',
        verificationStatus: 'Verified',
        uploadedBy: superAdmin._id,
        status: 'active',
        createdBy: superAdmin._id
      });
      logInfo('✅ Documents seeded');
    }

    // 7. HelpDeskTickets
    if ((await HelpDeskTicket.countDocuments()) === 0) {
      await HelpDeskTicket.create({
        organizationId: org._id,
        ticketNumber: 'TKT-000001',
        raisedById: employee._id,
        assignedToId: employee2._id,
        subject: 'Laptop Screen Flickering',
        description: 'My screen flickers when on battery power.',
        category: 'Hardware',
        priority: 'High',
        ticketStatus: 'Open',
        status: 'active',
        createdBy: superAdmin._id
      });
      logInfo('✅ HelpDeskTickets seeded');
    }

    // 8. Holidays
    if ((await Holiday.countDocuments()) === 0) {
      await Holiday.create({
        organizationId: org._id,
        name: 'New Year Day',
        date: new Date(new Date().getFullYear(), 0, 1),
        year: new Date().getFullYear(),
        type: 'Public',
        status: 'active',
        createdBy: superAdmin._id
      });
      logInfo('✅ Holidays seeded');
    }

    // 9. Projects & Tasks
    if ((await Project.countDocuments()) === 0) {
      const proj = await Project.create({
        organizationId: org._id,
        name: 'Website Redesign',
        code: 'PRJ-WEB-01',
        projectManagerId: employee._id,
        teamMemberIds: [employee._id, employee2._id],
        startDate: new Date(),
        projectStatus: 'Active',
        status: 'active',
        priority: 'High',
        createdBy: superAdmin._id
      });
      
      await Task.create({
        organizationId: org._id,
        projectId: proj._id,
        title: 'Design Homepage Mockups',
        reportedById: employee._id,
        assignedTo: employee._id,
        taskStatus: 'In Progress',
        status: 'active',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 3),
        createdBy: superAdmin._id
      });
      logInfo('✅ Projects & Tasks seeded');
    }

    // 10. PerformanceReviews & Goals
    if ((await PerformanceReview.countDocuments()) === 0) {
      const review = await PerformanceReview.create({
        organizationId: org._id,
        employeeId: employee._id,
        reviewerId: employee2._id,
        quarter: 'Q1',
        year: new Date().getFullYear(),
        reviewStatus: 'Draft',
        status: 'active',
        createdBy: superAdmin._id
      });
      
      await Goal.create({
        organizationId: org._id,
        employeeId: employee._id,
        title: 'Improve Page Load Speed',
        category: 'Performance',
        progress: 20,
        goalStatus: 'In Progress',
        status: 'active',
        startDate: new Date(),
        targetDate: new Date(Date.now() + 86400000 * 30),
        quarter: 'Q1',
        year: new Date().getFullYear(),
        setByManagerId: employee2._id,
        createdBy: superAdmin._id
      });
      logInfo('✅ PerformanceReviews & Goals seeded');
    }

    // 11. Payrolls & Payslips
    if ((await Payroll.countDocuments()) === 0) {
      const pr = await Payroll.create({
        organizationId: org._id,
        employeeId: employee._id,
        payPeriodMonth: new Date().getMonth() + 1,
        payPeriodYear: new Date().getFullYear(),
        processedBy: superAdmin._id,
        payrollStatus: 'Draft',
        status: 'active',
        basicSalary: 3000,
        grossSalary: 5000,
        netSalary: 4500,
        totalDeductions: 500,
        workingDays: 22,
        presentDays: 20,
        createdBy: superAdmin._id
      });
      
      await Payslip.create({
        organizationId: org._id,
        payrollId: pr._id,
        employeeId: employee._id,
        payPeriodMonth: new Date().getMonth() + 1,
        payPeriodYear: new Date().getFullYear(),
        payslipStatus: 'Draft',
        status: 'active',
        basicSalary: 3000,
        grossPay: 5000,
        netPay: 4500,
        totalDeductions: 500,
        workingDays: 22,
        presentDays: 20,
        generatedAt: new Date(),
        generatedBy: superAdmin._id,
        createdBy: superAdmin._id
      });
      logInfo('✅ Payrolls & Payslips seeded');
    }

    logInfo('🎉 Extended Seeding Complete!');
    await disconnectDB();
  } catch (error) {
    logError('Extended seeding failed:', error);
    process.exit(1);
  }
};

seedExtended();
