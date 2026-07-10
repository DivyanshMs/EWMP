const fs = require('fs');
const path = require('path');

const brunoDir = path.join(__dirname, 'bruno');
const envDir = path.join(brunoDir, 'environments');

// Ensure directories exist
const folders = [
  '',
  'environments',
  'Authentication',
  'Organization',
  'Employee',
  'Attendance',
  'Leave',
  'Payroll',
  'Projects',
  'Tasks',
  'Assets',
  'Documents',
  'Notifications',
  'Help Desk',
  'Reports',
  'Performance',
  'Recruitment',
  'AI'
];

// Clean existing bruno directory entirely except for node_modules/.git if they exist (they don't usually)
if (fs.existsSync(brunoDir)) {
  fs.rmSync(brunoDir, { recursive: true, force: true });
}

folders.forEach(dir => {
  fs.mkdirSync(path.join(brunoDir, dir), { recursive: true });
});

// bruno.json
fs.writeFileSync(path.join(brunoDir, 'bruno.json'), JSON.stringify({
  version: "1",
  name: "EWMP API",
  type: "collection",
  ignore: ["node_modules", ".git"],
  environments: ["Local"]
}, null, 2));

// environments/Local.bru
const envContent = `vars {
  baseUrl: http://localhost:5000/api
  token: ""
  refreshToken: ""
  organizationId: ""
  employeeId: ""
  userId: ""
  role: ""
  departmentId: ""
  designationId: ""
  locationId: ""
  shiftId: ""
  holidayId: ""
  leaveId: ""
  attendanceId: ""
  payrollId: ""
  projectId: ""
  taskId: ""
  assetId: ""
  documentId: ""
  notificationId: ""
  ticketId: ""
  performanceReviewId: ""
  candidateId: ""
  jobId: ""
  conversationId: ""
  aiHistoryId: ""
}`;
fs.writeFileSync(path.join(envDir, 'Local.bru'), envContent);

let totalRequests = 0;

function createBru(folder, name, method, url, bodyObj = null, isAuth = true, queryParams = null, script = null) {
  let content = `meta {\n  name: ${name}\n  type: http\n  seq: ${totalRequests + 1}\n}\n\n`;
  
  let finalUrl = url;
  if (queryParams) {
    finalUrl += queryParams;
  }
  
  content += `${method.toLowerCase()} {\n  url: ${finalUrl}\n  body: ${bodyObj ? 'json' : 'none'}\n  auth: ${isAuth ? 'bearer' : 'none'}\n}\n\n`;
  
  if (queryParams) {
    content += `query {\n`;
    const params = new URLSearchParams(queryParams.replace('?', ''));
    for (const [key, value] of params.entries()) {
      content += `  ${key}: ${value}\n`;
    }
    content += `}\n\n`;
  }

  if (isAuth) {
    content += `auth:bearer {\n  token: {{token}}\n}\n\n`;
  }
  
  if (bodyObj) {
    content += `body:json {\n  ${JSON.stringify(bodyObj, null, 2).replace(/\n/g, '\n  ')}\n}\n\n`;
  }

  if (script) {
    content += `script:post-response {\n${script.split('\\n').map(line => '  ' + line).join('\\n')}\n}\n\n`;
  }
  
  // Safe filename
  const safeName = name.replace(/[/\\?%*:|"<>]/g, '-');
  fs.writeFileSync(path.join(brunoDir, folder, `${safeName}.bru`), content);
  totalRequests++;
}

// Helper Scripts
const loginScript = `if(res.body && res.body.data && res.body.data.accessToken) {
  bru.setEnvVar("token", res.body.data.accessToken);
}
if(res.body && res.body.data && res.body.data.refreshToken) {
  bru.setEnvVar("refreshToken", res.body.data.refreshToken);
}
if(res.body && res.body.data && res.body.data.user) {
  bru.setEnvVar("userId", res.body.data.user._id);
  bru.setEnvVar("role", res.body.data.user.role);
  if (res.body.data.user.employee) {
    bru.setEnvVar("employeeId", res.body.data.user.employee);
  }
  if (res.body.data.user.organization) {
    bru.setEnvVar("organizationId", res.body.data.user.organization);
  }
}`;

const getSetIdScript = (varName) => `if(res.body && res.body.data && res.body.data._id) {
  bru.setEnvVar("${varName}", res.body.data._id);
}`;

// ---------------------------------------------------------
// 1. Authentication
// ---------------------------------------------------------
createBru('Authentication', '01 Login', 'POST', '{{baseUrl}}/auth/login', { email: "admin@ewmp.local", password: "Admin@123456" }, false, null, loginScript);
createBru('Authentication', '02 Refresh Token', 'POST', '{{baseUrl}}/auth/refresh', { refreshToken: "{{refreshToken}}" }, false, null, loginScript);
createBru('Authentication', '03 Profile', 'GET', '{{baseUrl}}/auth/me');
createBru('Authentication', '04 Change Password', 'PUT', '{{baseUrl}}/auth/change-password', { currentPassword: "OldPassword123!", newPassword: "NewPassword123!" });
createBru('Authentication', '05 Logout', 'POST', '{{baseUrl}}/auth/logout');
// Negative Test
createBru('Authentication', '06 Login - Invalid Credentials (401)', 'POST', '{{baseUrl}}/auth/login', { email: "admin@ewmp.local", password: "WrongPassword" }, false);


// ---------------------------------------------------------
// 2. Organization
// ---------------------------------------------------------
createBru('Organization', '01 Get Current Organization', 'GET', '{{baseUrl}}/organizations/current');
createBru('Organization', '02 Update Current Organization', 'PUT', '{{baseUrl}}/organizations/current', { name: "EWMP Corp", email: "contact@ewmp.local", phone: "+1-800-555-0199" });

createBru('Organization', '03 Create Department', 'POST', '{{baseUrl}}/departments', { name: "Engineering", code: "ENG", description: "Software Engineering" }, true, null, getSetIdScript('departmentId'));
createBru('Organization', '04 Get Departments', 'GET', '{{baseUrl}}/departments');
createBru('Organization', '05 Create Designation', 'POST', '{{baseUrl}}/designations', { title: "Software Engineer", level: "L1", departmentId: "{{departmentId}}" }, true, null, getSetIdScript('designationId'));
createBru('Organization', '06 Get Designations', 'GET', '{{baseUrl}}/designations');
createBru('Organization', '07 Create Location', 'POST', '{{baseUrl}}/locations', { name: "Headquarters", address: { city: "Bengaluru", country: "India" }, timezone: "Asia/Kolkata" }, true, null, getSetIdScript('locationId'));
createBru('Organization', '08 Get Locations', 'GET', '{{baseUrl}}/locations');
createBru('Organization', '09 Create Shift', 'POST', '{{baseUrl}}/shifts', { name: "Day Shift", startTime: "09:00", endTime: "18:00", workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }, true, null, getSetIdScript('shiftId'));
createBru('Organization', '10 Get Shifts', 'GET', '{{baseUrl}}/shifts');
createBru('Organization', '11 Create Holiday', 'POST', '{{baseUrl}}/holidays', { name: "New Year", date: "2027-01-01", type: "Public" }, true, null, getSetIdScript('holidayId'));
createBru('Organization', '12 Get Holidays', 'GET', '{{baseUrl}}/holidays');
// Negative Tests
createBru('Organization', '13 Create Department - Validation Error (422)', 'POST', '{{baseUrl}}/departments', { description: "Missing name and code" }, true);


// ---------------------------------------------------------
// 3. Employee
// ---------------------------------------------------------
createBru('Employee', '01 Create Employee', 'POST', '{{baseUrl}}/employees', {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@ewmp.local",
  password: "Password@123",
  gender: "Female",
  dateOfBirth: "1992-05-15",
  dateOfJoining: "2023-01-01",
  role: "EMPLOYEE",
  department: "{{departmentId}}",
  designation: "{{designationId}}",
  workLocation: "{{locationId}}",
  shift: "{{shiftId}}",
  employmentStatus: "Active",
  employmentType: "Full-Time",
  contactNumber: "+1-202-555-0144",
  basicSalary: 65000
}, true, null, getSetIdScript('employeeId'));
createBru('Employee', '02 Get Employees', 'GET', '{{baseUrl}}/employees', null, true, "?page=1&limit=10");
createBru('Employee', '03 Get Employee By Id', 'GET', '{{baseUrl}}/employees/{{employeeId}}');
createBru('Employee', '04 Update Employee', 'PUT', '{{baseUrl}}/employees/{{employeeId}}', { basicSalary: 70000 });
// Negative Tests
createBru('Employee', '05 Get Employee - Not Found (404)', 'GET', '{{baseUrl}}/employees/000000000000000000000000');


// ---------------------------------------------------------
// 4. Attendance
// ---------------------------------------------------------
createBru('Attendance', '01 Clock In', 'POST', '{{baseUrl}}/attendance/clock-in', { clockInLocation: { type: "Point", coordinates: [77.5946, 12.9716] }, deviceId: "mobile", ipAddress: "192.168.1.1" }, true, null, getSetIdScript('attendanceId'));
createBru('Attendance', '02 Clock Out', 'PATCH', '{{baseUrl}}/attendance/clock-out', { clockOutLocation: { type: "Point", coordinates: [77.5946, 12.9716] } });
createBru('Attendance', '03 Get My Attendance', 'GET', '{{baseUrl}}/attendance/my');
createBru('Attendance', '04 Get All Attendance', 'GET', '{{baseUrl}}/attendance');
createBru('Attendance', '05 Correction Request', 'POST', '{{baseUrl}}/attendance/{{attendanceId}}/correction', { type: "ClockIn", suggestedTime: "2026-07-04T09:00:00Z", reason: "Forgot" });
createBru('Attendance', '06 Approve Correction', 'PATCH', '{{baseUrl}}/attendance/{{attendanceId}}/correction/approve', { status: "Approved", adminRemarks: "Approved" });


// ---------------------------------------------------------
// 5. Leave
// ---------------------------------------------------------
createBru('Leave', '01 Create Leave Type', 'POST', '{{baseUrl}}/leave-types', { name: "Sick Leave", code: "SL", description: "For illness", daysPerYear: 10, isPaid: true }, true, null, getSetIdScript('leaveId')); // saving as leaveId to reuse variable name if needed, but lets just use it for request 
createBru('Leave', '02 Get Leave Types', 'GET', '{{baseUrl}}/leave-types');
createBru('Leave', '03 Apply For Leave', 'POST', '{{baseUrl}}/leave-requests', { leaveType: "{{leaveId}}", startDate: "2026-08-01", endDate: "2026-08-02", reason: "Fever" }, true, null, getSetIdScript('leaveId')); // overwriting leaveId with requestId for ease
createBru('Leave', '04 Get Leave Requests', 'GET', '{{baseUrl}}/leave-requests');
createBru('Leave', '05 Approve Leave', 'PATCH', '{{baseUrl}}/leave-requests/{{leaveId}}/approve', { status: "Approved", adminRemarks: "Okay" });
createBru('Leave', '06 Get Leave Balances', 'GET', '{{baseUrl}}/leave-balances');


// ---------------------------------------------------------
// 6. Payroll
// ---------------------------------------------------------
createBru('Payroll', '01 Run Payroll', 'POST', '{{baseUrl}}/payroll', { month: 7, year: 2026, type: "Regular" }, true, null, getSetIdScript('payrollId'));
createBru('Payroll', '02 Get Payrolls', 'GET', '{{baseUrl}}/payroll');
createBru('Payroll', '03 Process Payroll', 'PATCH', '{{baseUrl}}/payroll/{{payrollId}}/process', { status: "Processed" });
createBru('Payroll', '04 Generate Payslip', 'POST', '{{baseUrl}}/payslips', { employee: "{{employeeId}}", month: 7, year: 2026, basicSalary: 65000, allowances: [], deductions: [], netSalary: 65000, payroll: "{{payrollId}}" }, true);
createBru('Payroll', '05 Get Payslips', 'GET', '{{baseUrl}}/payslips');


// ---------------------------------------------------------
// 7. Projects
// ---------------------------------------------------------
createBru('Projects', '01 Create Project', 'POST', '{{baseUrl}}/projects', { name: "EWMP Implementation", description: "Rollout of new HRMS", clientName: "Internal", startDate: "2026-07-01", status: "Planning", priority: "High", budget: 100000, teamMembers: ["{{employeeId}}"] }, true, null, getSetIdScript('projectId'));
createBru('Projects', '02 Get Projects', 'GET', '{{baseUrl}}/projects');
createBru('Projects', '03 Get Project By Id', 'GET', '{{baseUrl}}/projects/{{projectId}}');
createBru('Projects', '04 Update Project', 'PUT', '{{baseUrl}}/projects/{{projectId}}', { status: "Active" });


// ---------------------------------------------------------
// 8. Tasks
// ---------------------------------------------------------
createBru('Tasks', '01 Create Task', 'POST', '{{baseUrl}}/tasks', { title: "Setup Database", description: "Install and config MongoDB", project: "{{projectId}}", assignee: "{{employeeId}}", priority: "High", status: "Todo", dueDate: "2026-07-15" }, true, null, getSetIdScript('taskId'));
createBru('Tasks', '02 Get Tasks', 'GET', '{{baseUrl}}/tasks');
createBru('Tasks', '03 Update Task Status', 'PATCH', '{{baseUrl}}/tasks/{{taskId}}/status', { status: "InProgress" });


// ---------------------------------------------------------
// 9. Assets
// ---------------------------------------------------------
createBru('Assets', '01 Create Asset', 'POST', '{{baseUrl}}/assets', { name: "MacBook Pro", type: "Laptop", serialNumber: "MBP12345", purchaseDate: "2026-01-10", cost: 2000, status: "Available" }, true, null, getSetIdScript('assetId'));
createBru('Assets', '02 Get Assets', 'GET', '{{baseUrl}}/assets');
createBru('Assets', '03 Allocate Asset', 'POST', '{{baseUrl}}/asset-allocations', { asset: "{{assetId}}", employee: "{{employeeId}}", allocationDate: "2026-07-06", condition: "New" }, true);


// ---------------------------------------------------------
// 10. Documents
// ---------------------------------------------------------
createBru('Documents', '01 Upload Document', 'POST', '{{baseUrl}}/documents', { title: "Company Policy", documentType: "Policy", employee: "{{employeeId}}", fileUrl: "https://example.com/policy.pdf" }, true, null, getSetIdScript('documentId'));
createBru('Documents', '02 Get Documents', 'GET', '{{baseUrl}}/documents');
createBru('Documents', '03 Delete Document', 'DELETE', '{{baseUrl}}/documents/{{documentId}}');


// ---------------------------------------------------------
// 11. Notifications
// ---------------------------------------------------------
createBru('Notifications', '01 Create Announcement', 'POST', '{{baseUrl}}/announcements', { title: "Welcome to EWMP", content: "We are live!", priority: "High" }, true);
createBru('Notifications', '02 Get Notifications', 'GET', '{{baseUrl}}/notifications');
createBru('Notifications', '03 Mark As Read', 'PATCH', '{{baseUrl}}/notifications/mark-read', { notificationIds: [] });


// ---------------------------------------------------------
// 12. Help Desk
// ---------------------------------------------------------
createBru('Help Desk', '01 Create Ticket', 'POST', '{{baseUrl}}/tickets', { title: "Laptop not starting", description: "Screen is blank", category: "IT", priority: "High" }, true, null, getSetIdScript('ticketId'));
createBru('Help Desk', '02 Get Tickets', 'GET', '{{baseUrl}}/tickets');
createBru('Help Desk', '03 Update Ticket Status', 'PATCH', '{{baseUrl}}/tickets/{{ticketId}}/status', { status: "InProgress" });


// ---------------------------------------------------------
// 13. Reports
// ---------------------------------------------------------
createBru('Reports', '01 Get Dashboard Data', 'GET', '{{baseUrl}}/dashboard');
createBru('Reports', '02 Generate Attendance Report', 'POST', '{{baseUrl}}/reports/attendance', { startDate: "2026-07-01", endDate: "2026-07-31" });


// ---------------------------------------------------------
// 14. Performance
// ---------------------------------------------------------
createBru('Performance', '01 Create Review', 'POST', '{{baseUrl}}/performance', { employee: "{{employeeId}}", reviewer: "{{employeeId}}", reviewPeriod: "Q2 2026", goals: [{ title: "Ship V1", weightage: 100 }], status: "Draft" }, true, null, getSetIdScript('performanceReviewId'));
createBru('Performance', '02 Get Reviews', 'GET', '{{baseUrl}}/performance');


// ---------------------------------------------------------
// 15. Recruitment
// ---------------------------------------------------------
createBru('Recruitment', '01 Create Job', 'POST', '{{baseUrl}}/recruitment/jobs', { title: "Frontend Developer", department: "{{departmentId}}", location: "{{locationId}}", type: "Full-Time", experience: "2-4 years", requirements: "React, Vue" }, true, null, getSetIdScript('jobId'));
createBru('Recruitment', '02 Apply for Job', 'POST', '{{baseUrl}}/recruitment/candidates', { job: "{{jobId}}", firstName: "Alice", lastName: "Wonder", email: "alice@example.com", phone: "1234567890", resumeUrl: "https://example.com/resume.pdf" }, true, null, getSetIdScript('candidateId'));


// ---------------------------------------------------------
// 16. AI
// ---------------------------------------------------------
createBru('AI', '01 Health Check', 'GET', '{{baseUrl}}/ai/health');
createBru('AI', '02 Chat', 'POST', '{{baseUrl}}/ai/chat', { message: "What is my leave balance?" }, true, null, `if(res.body && res.body.data && res.body.data.conversationId) { bru.setEnvVar("conversationId", res.body.data.conversationId); }`);
createBru('AI', '03 Summarize', 'POST', '{{baseUrl}}/ai/summarize', { text: "Long text here..." }, true);
createBru('AI', '04 Insights', 'POST', '{{baseUrl}}/ai/insights', { context: "Attendance data..." }, true);
createBru('AI', '05 Recommendations', 'POST', '{{baseUrl}}/ai/recommendations', { context: "Employee performance..." }, true);
createBru('AI', '06 Get History', 'GET', '{{baseUrl}}/ai/history');
createBru('AI', '07 Get History By Id', 'GET', '{{baseUrl}}/ai/history/{{aiHistoryId}}');
createBru('AI', '08 Delete History By Id', 'DELETE', '{{baseUrl}}/ai/history/{{aiHistoryId}}');
// Negative Test
createBru('AI', '09 Chat - Unauthorized (401)', 'POST', '{{baseUrl}}/ai/chat', { message: "Hello" }, false); // auth is false, so it will fail 401

console.log('Successfully generated full Bruno API collection with all modules, chaining, and negative tests.');
