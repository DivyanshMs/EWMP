const fs = require('fs');
const path = require('path');

const brunoDir = path.join(__dirname, 'bruno');
const envDir = path.join(brunoDir, 'environments');

// Ensure directories exist
['', 'environments', 'Authentication', 'Employee', 'Organization', 'Organization/Department', 'Organization/Designation', 'Organization/Location', 'Organization/Shift', 'Organization/Holiday', 'Attendance'].forEach(dir => {
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
  attendanceId: ""
  employeeId: ""
  departmentId: ""
  designationId: ""
  locationId: ""
  shiftId: ""
  holidayId: ""
  organizationId: ""
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
  
  fs.writeFileSync(path.join(brunoDir, folder, `${name}.bru`), content);
  totalRequests++;
}

const loginScript = `if(res.body && res.body.data && res.body.data.accessToken) {
  bru.setEnvVar("token", res.body.data.accessToken);
}`;

// Authentication
createBru('Authentication', 'Login', 'POST', '{{baseUrl}}/auth/login', { email: "admin@ewmp.local", password: "Admin@123456" }, false, null, loginScript);
createBru('Authentication', 'Refresh Token', 'POST', '{{baseUrl}}/auth/refresh', null, false);
createBru('Authentication', 'Logout', 'POST', '{{baseUrl}}/auth/logout');
createBru('Authentication', 'Profile', 'GET', '{{baseUrl}}/auth/me');
createBru('Authentication', 'Change Password', 'PUT', '{{baseUrl}}/auth/change-password', { currentPassword: "OldPassword123!", newPassword: "NewPassword123!" });
createBru('Authentication', 'Forgot Password', 'POST', '{{baseUrl}}/auth/forgot-password', { email: "admin@ewmp.local" }, false);
createBru('Authentication', 'Reset Password', 'POST', '{{baseUrl}}/auth/reset-password/sometoken', { newPassword: "NewPassword123!" }, false);

// Employee
createBru('Employee', 'Create Employee', 'POST', '{{baseUrl}}/employees', {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@ewmp.local",
  password: "Password@123",
  gender: "Male",
  dateOfBirth: "1990-01-01",
  dateOfJoining: "2023-01-01",
  role: "EMPLOYEE",
  employmentStatus: "Active",
  employmentType: "Full-Time",
  contactNumber: "+1-202-555-0143",
  address: { street: "123 Main St", city: "Metropolis", state: "NY", country: "USA", postalCode: "10001" },
  basicSalary: 60000
}, true, null, `if(res.body && res.body.data && res.body.data._id) { bru.setEnvVar("employeeId", res.body.data._id); }`);
createBru('Employee', 'Get Employees', 'GET', '{{baseUrl}}/employees', null, true, "?page=1&limit=10&search=&sortBy=createdAt&sortOrder=desc");
createBru('Employee', 'Get Employee By Id', 'GET', '{{baseUrl}}/employees/{{employeeId}}');
createBru('Employee', 'Update Employee', 'PUT', '{{baseUrl}}/employees/{{employeeId}}', { basicSalary: 65000 });
createBru('Employee', 'Delete Employee', 'DELETE', '{{baseUrl}}/employees/{{employeeId}}');
createBru('Employee', 'Restore Employee', 'POST', '{{baseUrl}}/employees/{{employeeId}}/restore'); // User requested this endpoint implicitly although it was missing in our check

// Organization
createBru('Organization', 'Get Current Organization', 'GET', '{{baseUrl}}/organizations/current');
createBru('Organization', 'Update Current Organization', 'PUT', '{{baseUrl}}/organizations/current', {
  name: "EWMP Corp",
  email: "contact@ewmp.local",
  phone: "+1-800-555-0199",
  website: "https://www.ewmp.local",
  address: { street: "123 Biz Blvd", city: "Bengaluru", state: "Karnataka", country: "India", postalCode: "560100" },
  timezone: "Asia/Kolkata",
  currency: "INR"
});
createBru('Organization', 'Get Settings', 'GET', '{{baseUrl}}/organizations/settings');
createBru('Organization', 'Update Settings', 'PUT', '{{baseUrl}}/organizations/settings', {
  timezone: "Asia/Kolkata",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  language: "en-GB",
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  defaultShift: "General Shift",
  payrollCycle: "Monthly"
});

// Organization Sub-Modules
createBru('Organization/Department', 'Create Department', 'POST', '{{baseUrl}}/departments', { name: "Engineering", code: "ENG", description: "Software Eng Dept" }, true, null, `if(res.body && res.body.data && res.body.data._id) { bru.setEnvVar("departmentId", res.body.data._id); }`);
createBru('Organization/Department', 'Get Departments', 'GET', '{{baseUrl}}/departments', null, true, "?page=1&limit=10&search=&sortBy=&sortOrder=");
createBru('Organization/Department', 'Get Department By Id', 'GET', '{{baseUrl}}/departments/{{departmentId}}');
createBru('Organization/Department', 'Update Department', 'PUT', '{{baseUrl}}/departments/{{departmentId}}', { description: "Updated Engineering Dept" });
createBru('Organization/Department', 'Delete Department', 'DELETE', '{{baseUrl}}/departments/{{departmentId}}');

createBru('Organization/Designation', 'Create Designation', 'POST', '{{baseUrl}}/designations', { title: "Software Engineer", level: "L1", departmentId: "{{departmentId}}" }, true, null, `if(res.body && res.body.data && res.body.data._id) { bru.setEnvVar("designationId", res.body.data._id); }`);
createBru('Organization/Designation', 'Get Designations', 'GET', '{{baseUrl}}/designations', null, true, "?page=1&limit=10&search=&sortBy=&sortOrder=");
createBru('Organization/Designation', 'Get Designation By Id', 'GET', '{{baseUrl}}/designations/{{designationId}}');
createBru('Organization/Designation', 'Update Designation', 'PUT', '{{baseUrl}}/designations/{{designationId}}', { level: "L2" });
createBru('Organization/Designation', 'Delete Designation', 'DELETE', '{{baseUrl}}/designations/{{designationId}}');

createBru('Organization/Location', 'Create Location', 'POST', '{{baseUrl}}/locations', { name: "HQ", address: { city: "Bengaluru", country: "India" }, timezone: "Asia/Kolkata" }, true, null, `if(res.body && res.body.data && res.body.data._id) { bru.setEnvVar("locationId", res.body.data._id); }`);
createBru('Organization/Location', 'Get Locations', 'GET', '{{baseUrl}}/locations', null, true, "?page=1&limit=10&search=&sortBy=&sortOrder=");
createBru('Organization/Location', 'Get Location By Id', 'GET', '{{baseUrl}}/locations/{{locationId}}');
createBru('Organization/Location', 'Update Location', 'PUT', '{{baseUrl}}/locations/{{locationId}}', { name: "Main HQ" });
createBru('Organization/Location', 'Delete Location', 'DELETE', '{{baseUrl}}/locations/{{locationId}}');

createBru('Organization/Shift', 'Create Shift', 'POST', '{{baseUrl}}/shifts', { name: "Day Shift", startTime: "09:00", endTime: "18:00", workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }, true, null, `if(res.body && res.body.data && res.body.data._id) { bru.setEnvVar("shiftId", res.body.data._id); }`);
createBru('Organization/Shift', 'Get Shifts', 'GET', '{{baseUrl}}/shifts', null, true, "?page=1&limit=10&search=&sortBy=&sortOrder=");
createBru('Organization/Shift', 'Get Shift By Id', 'GET', '{{baseUrl}}/shifts/{{shiftId}}');
createBru('Organization/Shift', 'Update Shift', 'PUT', '{{baseUrl}}/shifts/{{shiftId}}', { name: "General Day Shift" });
createBru('Organization/Shift', 'Delete Shift', 'DELETE', '{{baseUrl}}/shifts/{{shiftId}}');

createBru('Organization/Holiday', 'Create Holiday', 'POST', '{{baseUrl}}/holidays', { name: "New Year", date: "2027-01-01", type: "Public" }, true, null, `if(res.body && res.body.data && res.body.data._id) { bru.setEnvVar("holidayId", res.body.data._id); }`);
createBru('Organization/Holiday', 'Get Holidays', 'GET', '{{baseUrl}}/holidays', null, true, "?page=1&limit=10&search=&sortBy=&sortOrder=");
createBru('Organization/Holiday', 'Get Holiday By Id', 'GET', '{{baseUrl}}/holidays/{{holidayId}}');
createBru('Organization/Holiday', 'Update Holiday', 'PUT', '{{baseUrl}}/holidays/{{holidayId}}', { name: "New Year's Day" });
createBru('Organization/Holiday', 'Delete Holiday', 'DELETE', '{{baseUrl}}/holidays/{{holidayId}}');

// Attendance
createBru('Attendance', 'Clock In', 'POST', '{{baseUrl}}/attendance/clock-in', { clockInLocation: { type: "Point", coordinates: [77.5946, 12.9716] }, deviceId: "mobile-app-1", ipAddress: "192.168.1.1" }, true, null, `if(res.body && res.body.data && res.body.data._id) { bru.setEnvVar("attendanceId", res.body.data._id); }`);
createBru('Attendance', 'Clock Out', 'PATCH', '{{baseUrl}}/attendance/clock-out', { clockOutLocation: { type: "Point", coordinates: [77.5946, 12.9716] } });
createBru('Attendance', 'Get My Attendance', 'GET', '{{baseUrl}}/attendance/my', null, true, "?page=1&limit=10&startDate=2026-07-01&endDate=2026-07-31");
createBru('Attendance', 'Get Attendance', 'GET', '{{baseUrl}}/attendance', null, true, "?page=1&limit=10&search=&sortBy=&sortOrder=");
createBru('Attendance', 'Get Attendance By Id', 'GET', '{{baseUrl}}/attendance/{{attendanceId}}');
createBru('Attendance', 'Correction Request', 'POST', '{{baseUrl}}/attendance/{{attendanceId}}/correction', { type: "ClockIn", suggestedTime: "2026-07-04T09:00:00Z", reason: "Forgot to clock in" });
createBru('Attendance', 'Approve Correction', 'PATCH', '{{baseUrl}}/attendance/{{attendanceId}}/correction/approve', { status: "Approved", adminRemarks: "Approved correction" });

console.log('Collection created successfully.');
