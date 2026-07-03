/**
 * seedDemo.js — Phase 9 / F-003 Deliverable
 * Complete Demo Data & Initial Seeding Script
 * Seeds Default Organization, 9 User Accounts, Employees, Departments, Designations,
 * Locations, Shifts, Leave Types, and Salary Structures with full relationship linking.
 *
 * Authority: DEVELOPMENT_ORDER.md Section 10 (Step 11 & Phase 9)
 * Usage: node scripts/seedDemo.js or npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');
const { logInfo, logError, logWarn } = require('../utils/loggerHelper');
const { ROLES } = require('../config/constants');
const authService = require('../services/authService');

const Organization = require('../models/Organization');
const User = require('../models/User');
const Department = require('../models/Department');
const Designation = require('../models/Designation');
const Location = require('../models/Location');
const Shift = require('../models/Shift');
const LeaveType = require('../models/LeaveType');
const SalaryStructure = require('../models/SalaryStructure');
const Employee = require('../models/Employee');

const seedDemo = async () => {
  try {
    logInfo('🚀 Starting Demo Database Seeding (Phase 9)...');
    await connectDB();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. Seed Default Organization
    // ──────────────────────────────────────────────────────────────────────────
    let org = await Organization.findOne({ code: 'EWMP' });
    if (!org) {
      org = await Organization.create({
        name: 'Enterprise Workforce Management Platform Demo',
        code: 'EWMP',
        industry: 'Information Technology',
        email: 'admin@ewmp.local',
        phone: '+1-800-555-0199',
        website: 'https://www.ewmp.local',
        status: 'active',
        address: {
          street: '100 Enterprise Way, Tech District',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          pincode: '560100',
        },
      });
      logInfo(`✅ Created Default Organization: ${org.name} (${org.code})`);
    } else {
      logInfo(`⚡ Organization already exists: ${org.name} (${org.code})`);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. Seed Initial Super Admin User (needed for createdBy references)
    // ──────────────────────────────────────────────────────────────────────────
    const superAdminEmail = 'admin@ewmp.local';
    let superAdminUser = await User.findOne({ email: superAdminEmail });
    if (!superAdminUser) {
      const passwordHash = await bcrypt.hash('Admin@123456', 12);
      superAdminUser = await User.create({
        email: superAdminEmail,
        passwordHash,
        role: ROLES.SUPER_ADMIN,
        organizationId: org._id,
        isActive: true,
        status: 'active',
      });
      logInfo(`✅ Created Initial SUPER_ADMIN User: ${superAdminUser.email}`);
    } else {
      logInfo(`⚡ SUPER_ADMIN User already exists: ${superAdminUser.email}`);
    }

    const creatorId = superAdminUser._id;

    // ──────────────────────────────────────────────────────────────────────────
    // 3. Seed Locations
    // ──────────────────────────────────────────────────────────────────────────
    const locationSeedData = [
      {
        name: 'Headquarters - Bengaluru',
        code: 'BLR-HQ',
        address: {
          street: '123 Electronic City Phase 1',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          pincode: '560100',
        },
        isRemote: false,
        gpsCoordinates: { lat: 12.8452, lng: 77.6602 },
      },
      {
        name: 'Branch Office - Mumbai',
        code: 'MUM-BR',
        address: {
          street: '456 Bandra Kurla Complex',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400051',
        },
        isRemote: false,
        gpsCoordinates: { lat: 19.0657, lng: 72.8682 },
      },
      {
        name: 'Remote Work Hub',
        code: 'REMOTE',
        address: {
          street: 'Virtual Office',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          pincode: '560001',
        },
        isRemote: true,
        gpsCoordinates: null,
      },
    ];

    const locationsMap = {};
    for (const locData of locationSeedData) {
      let loc = await Location.findOne({ organizationId: org._id, code: locData.code });
      if (!loc) {
        loc = await Location.create({ ...locData, organizationId: org._id, createdBy: creatorId });
        logInfo(`✅ Created Location: ${loc.name} (${loc.code})`);
      }
      locationsMap[locData.code] = loc;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. Seed Shifts
    // ──────────────────────────────────────────────────────────────────────────
    const shiftSeedData = [
      {
        name: 'General Day Shift',
        code: 'GEN-DAY',
        startTime: '09:00',
        endTime: '18:00',
        workingHours: 8,
        overtimeThreshold: 8,
        weeklyOffDays: ['Saturday', 'Sunday'],
        gracePeriodMinutes: 15,
      },
      {
        name: 'Morning Shift',
        code: 'MORN-01',
        startTime: '06:00',
        endTime: '15:00',
        workingHours: 8,
        overtimeThreshold: 8,
        weeklyOffDays: ['Saturday', 'Sunday'],
        gracePeriodMinutes: 15,
      },
      {
        name: 'Evening Shift',
        code: 'EVE-01',
        startTime: '14:00',
        endTime: '23:00',
        workingHours: 8,
        overtimeThreshold: 8,
        weeklyOffDays: ['Saturday', 'Sunday'],
        gracePeriodMinutes: 15,
      },
    ];

    const shiftsMap = {};
    for (const shData of shiftSeedData) {
      let sh = await Shift.findOne({ organizationId: org._id, code: shData.code });
      if (!sh) {
        sh = await Shift.create({ ...shData, organizationId: org._id, createdBy: creatorId });
        logInfo(`✅ Created Shift: ${sh.name} (${sh.code})`);
      }
      shiftsMap[shData.code] = sh;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 5. Seed Departments
    // ──────────────────────────────────────────────────────────────────────────
    const deptSeedData = [
      { name: 'Executive Management', code: 'EXEC', description: 'Executive leadership and strategic planning' },
      { name: 'Human Resources', code: 'HR', description: 'Talent acquisition, employee relations, and HR operations' },
      { name: 'Engineering', code: 'ENG', description: 'Software engineering, architecture, and product development' },
      { name: 'Finance & Accounting', code: 'FIN', description: 'Financial planning, accounting, and payroll administration' },
      { name: 'IT & Security', code: 'IT', description: 'Information technology infrastructure and cybersecurity' },
      { name: 'Compliance & Audit', code: 'COMP', description: 'Internal audit, governance, and regulatory compliance' },
    ];

    const deptsMap = {};
    for (const dData of deptSeedData) {
      let dept = await Department.findOne({ organizationId: org._id, code: dData.code });
      if (!dept) {
        dept = await Department.create({ ...dData, organizationId: org._id, createdBy: creatorId });
        logInfo(`✅ Created Department: ${dept.name} (${dept.code})`);
      }
      deptsMap[dData.code] = dept;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 6. Seed Designations
    // ──────────────────────────────────────────────────────────────────────────
    const desigSeedData = [
      { title: 'Chief Executive Officer', code: 'CEO', grade: 'EX-01', deptCode: 'EXEC', description: 'Chief Executive Officer' },
      { title: 'Operations Director', code: 'DIR-OPS', grade: 'EX-02', deptCode: 'EXEC', description: 'Director of Operations' },
      { title: 'Human Resources Manager', code: 'HR-MGR', grade: 'M-01', deptCode: 'HR', description: 'HR Department Head' },
      { title: 'HR Specialist', code: 'HR-SPC', grade: 'E-02', deptCode: 'HR', description: 'Specialist in talent acquisition and relations' },
      { title: 'Engineering Manager', code: 'ENG-MGR', grade: 'M-01', deptCode: 'ENG', description: 'Manager of software engineering teams' },
      { title: 'Technical Lead', code: 'TL-ENG', grade: 'L-01', deptCode: 'ENG', description: 'Lead software architect and engineering lead' },
      { title: 'Senior Software Engineer', code: 'SSE', grade: 'E-03', deptCode: 'ENG', description: 'Senior full-stack software engineer' },
      { title: 'Finance Manager', code: 'FIN-MGR', grade: 'M-01', deptCode: 'FIN', description: 'Head of finance and accounting' },
      { title: 'Senior IT Administrator', code: 'IT-ADM', grade: 'E-03', deptCode: 'IT', description: 'Lead IT systems and infrastructure admin' },
      { title: 'Compliance Auditor', code: 'AUDITOR', grade: 'E-03', deptCode: 'COMP', description: 'Internal governance and compliance auditor' },
    ];

    const desigsMap = {};
    for (const dsData of desigSeedData) {
      let desig = await Designation.findOne({ organizationId: org._id, code: dsData.code });
      if (!desig) {
        desig = await Designation.create({
          title: dsData.title,
          code: dsData.code,
          grade: dsData.grade,
          departmentId: deptsMap[dsData.deptCode]?._id || null,
          description: dsData.description,
          organizationId: org._id,
          createdBy: creatorId,
        });
        logInfo(`✅ Created Designation: ${desig.title} (${desig.code})`);
      }
      desigsMap[dsData.code] = desig;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 7. Seed Leave Types
    // ──────────────────────────────────────────────────────────────────────────
    const leaveTypeSeedData = [
      { name: 'Casual Leave', code: 'CL', description: 'For urgent or personal matters', maxDaysPerYear: 12, isCarryForward: false, maxCarryForwardDays: 0, isPaidLeave: true, requiresApproval: true, minAdvanceNoticeDays: 1, applicableGender: 'All' },
      { name: 'Sick Leave', code: 'SL', description: 'For medical reasons and illness', maxDaysPerYear: 12, isCarryForward: true, maxCarryForwardDays: 6, isPaidLeave: true, requiresApproval: false, minAdvanceNoticeDays: 0, applicableGender: 'All' },
      { name: 'Earned Leave', code: 'EL', description: 'Privilege leave earned through continuous service', maxDaysPerYear: 18, isCarryForward: true, maxCarryForwardDays: 30, isPaidLeave: true, requiresApproval: true, minAdvanceNoticeDays: 7, applicableGender: 'All' },
      { name: 'Maternity Leave', code: 'ML', description: 'Statutory maternity leave for female employees', maxDaysPerYear: 180, isCarryForward: false, maxCarryForwardDays: 0, isPaidLeave: true, requiresApproval: true, minAdvanceNoticeDays: 30, applicableGender: 'Female' },
    ];

    const leaveTypesMap = {};
    for (const ltData of leaveTypeSeedData) {
      let lt = await LeaveType.findOne({ organizationId: org._id, code: ltData.code });
      if (!lt) {
        lt = await LeaveType.create({ ...ltData, organizationId: org._id, createdBy: creatorId });
        logInfo(`✅ Created Leave Type: ${lt.name} (${lt.code})`);
      }
      leaveTypesMap[ltData.code] = lt;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 8. Seed Salary Structures
    // ──────────────────────────────────────────────────────────────────────────
    const salaryStructureSeedData = [
      { name: 'Executive Leadership Structure', code: 'SAL-EXEC', hraPercent: 40, daPercent: 10, pfPercent: 12, professionalTax: 200, medicalAllowance: 5000, travelAllowance: 10000, description: 'Compensation structure for executive leadership' },
      { name: 'Management Grade Structure', code: 'SAL-MGR', hraPercent: 40, daPercent: 10, pfPercent: 12, professionalTax: 200, medicalAllowance: 3000, travelAllowance: 5000, description: 'Compensation structure for department managers' },
      { name: 'Engineering Grade Structure', code: 'SAL-ENG', hraPercent: 40, daPercent: 5, pfPercent: 12, professionalTax: 200, medicalAllowance: 2000, travelAllowance: 3000, description: 'Compensation structure for technical engineering staff' },
      { name: 'Operations & Support Structure', code: 'SAL-OPS', hraPercent: 35, daPercent: 5, pfPercent: 12, professionalTax: 200, medicalAllowance: 1500, travelAllowance: 2000, description: 'Compensation structure for operations and administrative staff' },
    ];

    const salaryStructuresMap = {};
    for (const ssData of salaryStructureSeedData) {
      let ss = await SalaryStructure.findOne({ organizationId: org._id, code: ssData.code });
      if (!ss) {
        ss = await SalaryStructure.create({ ...ssData, organizationId: org._id, createdBy: creatorId });
        logInfo(`✅ Created Salary Structure: ${ss.name} (${ss.code})`);
      }
      salaryStructuresMap[ssData.code] = ss;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 9. Seed 9 Demo Users and Linked Employee Profiles
    // ──────────────────────────────────────────────────────────────────────────
    const demoAccountsData = [
      {
        employeeId: 'EMP0001',
        email: 'admin@ewmp.local',
        password: 'Admin@123456',
        role: ROLES.SUPER_ADMIN,
        firstName: 'Vikram',
        lastName: 'Singhania',
        mobile: '9876543201',
        deptCode: 'EXEC',
        desigCode: 'CEO',
        locCode: 'BLR-HQ',
        shiftCode: 'GEN-DAY',
        salaryCode: 'SAL-EXEC',
        basicSalary: 300000,
        joiningDate: '2023-01-01',
        managerEmpId: null,
      },
      {
        employeeId: 'EMP0002',
        email: 'hr@ewmp.local',
        password: 'Hr@123456',
        role: ROLES.HR_MANAGER,
        firstName: 'Ananya',
        lastName: 'Sharma',
        mobile: '9876543202',
        deptCode: 'HR',
        desigCode: 'HR-MGR',
        locCode: 'BLR-HQ',
        shiftCode: 'GEN-DAY',
        salaryCode: 'SAL-MGR',
        basicSalary: 160000,
        joiningDate: '2023-02-01',
        managerEmpId: 'EMP0001',
      },
      {
        employeeId: 'EMP0003',
        email: 'manager@ewmp.local',
        password: 'Manager@123456',
        role: ROLES.MANAGER,
        firstName: 'Rajesh',
        lastName: 'Verma',
        mobile: '9876543203',
        deptCode: 'ENG',
        desigCode: 'ENG-MGR',
        locCode: 'BLR-HQ',
        shiftCode: 'GEN-DAY',
        salaryCode: 'SAL-MGR',
        basicSalary: 200000,
        joiningDate: '2023-02-15',
        managerEmpId: 'EMP0001',
      },
      {
        employeeId: 'EMP0004',
        email: 'orgadmin@ewmp.local',
        password: 'OrgAdmin@123456',
        role: ROLES.ORG_ADMIN,
        firstName: 'Siddharth',
        lastName: 'Mehta',
        mobile: '9876543204',
        deptCode: 'EXEC',
        desigCode: 'DIR-OPS',
        locCode: 'MUM-BR',
        shiftCode: 'GEN-DAY',
        salaryCode: 'SAL-EXEC',
        basicSalary: 220000,
        joiningDate: '2023-03-01',
        managerEmpId: 'EMP0001',
      },
      {
        employeeId: 'EMP0005',
        email: 'finance@ewmp.local',
        password: 'Finance@123456',
        role: ROLES.FINANCE,
        firstName: 'Priya',
        lastName: 'Nair',
        mobile: '9876543205',
        deptCode: 'FIN',
        desigCode: 'FIN-MGR',
        locCode: 'BLR-HQ',
        shiftCode: 'GEN-DAY',
        salaryCode: 'SAL-MGR',
        basicSalary: 170000,
        joiningDate: '2023-03-15',
        managerEmpId: 'EMP0001',
      },
      {
        employeeId: 'EMP0006',
        email: 'teamlead@ewmp.local',
        password: 'TeamLead@123456',
        role: ROLES.TEAM_LEAD,
        firstName: 'Amit',
        lastName: 'Patel',
        mobile: '9876543206',
        deptCode: 'ENG',
        desigCode: 'TL-ENG',
        locCode: 'BLR-HQ',
        shiftCode: 'GEN-DAY',
        salaryCode: 'SAL-ENG',
        basicSalary: 140000,
        joiningDate: '2023-04-01',
        managerEmpId: 'EMP0003',
      },
      {
        employeeId: 'EMP0007',
        email: 'employee@ewmp.local',
        password: 'Employee@123456',
        role: ROLES.EMPLOYEE,
        firstName: 'Sneha',
        lastName: 'Gupta',
        mobile: '9876543207',
        deptCode: 'ENG',
        desigCode: 'SSE',
        locCode: 'BLR-HQ',
        shiftCode: 'MORN-01',
        salaryCode: 'SAL-ENG',
        basicSalary: 100000,
        joiningDate: '2023-05-01',
        managerEmpId: 'EMP0006',
      },
      {
        employeeId: 'EMP0008',
        email: 'itadmin@ewmp.local',
        password: 'ItAdmin@123456',
        role: ROLES.IT_ADMIN,
        firstName: 'Rohan',
        lastName: 'Joshi',
        mobile: '9876543208',
        deptCode: 'IT',
        desigCode: 'IT-ADM',
        locCode: 'BLR-HQ',
        shiftCode: 'GEN-DAY',
        salaryCode: 'SAL-OPS',
        basicSalary: 110000,
        joiningDate: '2023-05-15',
        managerEmpId: 'EMP0004',
      },
      {
        employeeId: 'EMP0009',
        email: 'auditor@ewmp.local',
        password: 'Auditor@123456',
        role: ROLES.AUDITOR,
        firstName: 'Kavita',
        lastName: 'Reddy',
        mobile: '9876543209',
        deptCode: 'COMP',
        desigCode: 'AUDITOR',
        locCode: 'MUM-BR',
        shiftCode: 'GEN-DAY',
        salaryCode: 'SAL-OPS',
        basicSalary: 120000,
        joiningDate: '2023-06-01',
        managerEmpId: 'EMP0001',
      },
    ];

    const employeesMap = {};
    for (const accData of demoAccountsData) {
      // 9a. Ensure User exists
      let user = await User.findOne({ email: accData.email });
      if (!user) {
        const passHash = await bcrypt.hash(accData.password, 12);
        user = await User.create({
          email: accData.email,
          passwordHash: passHash,
          role: accData.role,
          organizationId: org._id,
          isActive: true,
          status: 'active',
        });
        logInfo(`✅ Created User: ${user.email} (${accData.role})`);
      }

      // 9b. Lookup Manager if applicable
      let managerId = null;
      if (accData.managerEmpId && employeesMap[accData.managerEmpId]) {
        managerId = employeesMap[accData.managerEmpId]._id;
      } else if (accData.managerEmpId) {
        const mgrEmp = await Employee.findOne({ employeeId: accData.managerEmpId });
        if (mgrEmp) managerId = mgrEmp._id;
      }

      // 9c. Ensure Employee exists
      let emp = await Employee.findOne({ employeeId: accData.employeeId });
      if (!emp) {
        emp = await Employee.create({
          employeeId: accData.employeeId,
          userId: user._id,
          organizationId: org._id,
          departmentId: deptsMap[accData.deptCode]?._id,
          designationId: desigsMap[accData.desigCode]?._id,
          locationId: locationsMap[accData.locCode]?._id,
          shiftId: shiftsMap[accData.shiftCode]?._id,
          managerId: managerId,
          firstName: accData.firstName,
          lastName: accData.lastName,
          email: accData.email,
          mobile: accData.mobile,
          joiningDate: new Date(accData.joiningDate),
          employmentType: 'Full-Time',
          employmentStatus: 'Permanent',
          salaryStructureId: salaryStructuresMap[accData.salaryCode]?._id,
          basicSalary: accData.basicSalary,
          createdBy: creatorId,
          status: 'active',
        });
        logInfo(`✅ Created Employee: ${emp.firstName} ${emp.lastName} (${emp.employeeId})`);
      }
      employeesMap[accData.employeeId] = emp;

      // 9d. Ensure bidirectional 1:1 user <-> employee link
      if (!user.employeeId || user.employeeId.toString() !== emp._id.toString()) {
        user.employeeId = emp._id;
        await user.save();
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 10. Update Department Managers
    // ──────────────────────────────────────────────────────────────────────────
    const deptManagerLinks = [
      { deptCode: 'EXEC', mgrEmpId: 'EMP0001' },
      { deptCode: 'HR', mgrEmpId: 'EMP0002' },
      { deptCode: 'ENG', mgrEmpId: 'EMP0003' },
      { deptCode: 'FIN', mgrEmpId: 'EMP0005' },
      { deptCode: 'IT', mgrEmpId: 'EMP0008' },
      { deptCode: 'COMP', mgrEmpId: 'EMP0009' },
    ];

    for (const link of deptManagerLinks) {
      if (deptsMap[link.deptCode] && employeesMap[link.mgrEmpId]) {
        deptsMap[link.deptCode].managerId = employeesMap[link.mgrEmpId]._id;
        await deptsMap[link.deptCode].save();
      }
    }
    logInfo('✅ Department manager references synchronized successfully');

    // ──────────────────────────────────────────────────────────────────────────
    // 11. Verification: Test Authentication Login with Seeded Accounts
    // ──────────────────────────────────────────────────────────────────────────
    logInfo('\n🔍 Verifying Authentication Login with Seeded Credentials...');
    const testAccounts = [
      { email: 'admin@ewmp.local', password: 'Admin@123456', role: 'SUPER_ADMIN' },
      { email: 'hr@ewmp.local', password: 'Hr@123456', role: 'HR_MANAGER' },
      { email: 'manager@ewmp.local', password: 'Manager@123456', role: 'MANAGER' },
    ];

    for (const acc of testAccounts) {
      const loginRes = await authService.login({ email: acc.email, password: acc.password });
      if (loginRes && loginRes.accessToken && loginRes.user.role === acc.role) {
        logInfo(`🎉 Auth Verification Success: [${acc.role}] ${acc.email} can log in securely and receive valid JWT.`);
      } else {
        logWarn(`⚠️ Auth Verification failed for ${acc.email}`);
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 12. Summary Table & Default Credentials Output
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n==========================================================');
    console.log('                 DEMO SEEDING COMPLETE                    ');
    console.log('==========================================================');
    console.log(`Organization:     ${org.name} (${org.code})`);
    console.log(`Departments:      ${Object.keys(deptsMap).length} seeded`);
    console.log(`Designations:     ${Object.keys(desigsMap).length} seeded`);
    console.log(`Locations:        ${Object.keys(locationsMap).length} seeded`);
    console.log(`Shifts:           ${Object.keys(shiftsMap).length} seeded`);
    console.log(`Leave Types:      ${Object.keys(leaveTypesMap).length} seeded`);
    console.log(`Salary Structures:${Object.keys(salaryStructuresMap).length} seeded`);
    console.log(`Users & Employees:${Object.keys(employeesMap).length} seeded across 9 roles`);
    console.log('==========================================================');
    console.log('                  DEFAULT LOGIN CREDENTIALS               ');
    console.log('==========================================================');
    console.log('1. SUPER_ADMIN      | admin@ewmp.local      | Admin@123456');
    console.log('2. HR_MANAGER       | hr@ewmp.local         | Hr@123456');
    console.log('3. MANAGER          | manager@ewmp.local    | Manager@123456');
    console.log('4. ORG_ADMIN        | orgadmin@ewmp.local   | OrgAdmin@123456');
    console.log('5. FINANCE          | finance@ewmp.local    | Finance@123456');
    console.log('6. TEAM_LEAD        | teamlead@ewmp.local   | TeamLead@123456');
    console.log('7. EMPLOYEE         | employee@ewmp.local   | Employee@123456');
    console.log('8. IT_ADMIN         | itadmin@ewmp.local    | ItAdmin@123456');
    console.log('9. AUDITOR          | auditor@ewmp.local    | Auditor@123456');
    console.log('==========================================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logError(`❌ Seeding failed: ${error.message}`, { stack: error.stack });
    await disconnectDB();
    process.exit(1);
  }
};

if (require.main === module) {
  seedDemo();
}

module.exports = seedDemo;
