const fs = require('fs');
const path = require('path');

const root = __dirname;
const report = {
  missingFolders: [],
  missingFiles: [],
  presentFiles: []
};

// Phase 1: Expected Folders
const expectedFolders = [
  'client/src', 'client/src/components', 'client/src/pages', 'client/src/layouts',
  'client/src/hooks', 'client/src/services', 'client/src/store', 'client/src/routes', 'client/src/assets',
  'server/config', 'server/controllers', 'server/models', 'server/routes',
  'server/middleware', 'server/validators', 'server/services', 'server/repositories',
  'server/utils', 'server/scripts', 'server/seeds', 'server/uploads', 'server/logs', 'docs'
];

expectedFolders.forEach(folder => {
  const fullPath = path.join(root, folder);
  if (!fs.existsSync(fullPath)) {
    report.missingFolders.push(folder);
  }
});

// Phase 2: Expected Files
const expectedFiles = [
  'server/server.js',
  'server/app.js',
  'server/config/config.js',
  'server/config/db.js',
  'server/utils/loggerHelper.js',
  'server/middleware/errorHandler.js',
  'server/utils/formatResponse.js',
  'server/middleware/rbacMiddleware.js',
  'server/middleware/authMiddleware.js',
  'server/middleware/validationMiddleware.js',
  // Essential Auth module
  'server/controllers/authController.js',
  'server/services/authService.js',
  'server/validators/authValidator.js',
  'server/routes/authRoutes.js',
  // Essential Employee module
  'server/models/Employee.js',
  'server/controllers/employeeController.js',
  'server/services/employeeService.js',
  'server/validators/employeeValidator.js',
  'server/routes/employeeRoutes.js',
  // Essential Organization module
  'server/models/Organization.js',
  'server/controllers/organizationController.js',
  'server/services/organizationService.js',
  'server/validators/organizationValidator.js',
  'server/routes/organizationRoutes.js',
  // Scripts and Seeds
  'server/scripts/seedDemo.js',
  'server/scripts/seedAuth.js',
  'server/scripts/verifyEmployeeModule.js',
  'server/scripts/verifyOrganizationModule.js',
  // Docs
  'README.md',
  'API_SPECIFICATION.md',
  'ARCHITECTURE_REVISION.md',
  'DATABASE_DESIGN.md',
  'DEVELOPMENT_ORDER.md',
  'PROJECT_MASTER.md'
];

expectedFiles.forEach(file => {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    report.missingFiles.push(file);
  } else {
    report.presentFiles.push(file);
  }
});

fs.writeFileSync(path.join(root, 'audit_report.json'), JSON.stringify(report, null, 2));
console.log('Audit generated at audit_report.json');
