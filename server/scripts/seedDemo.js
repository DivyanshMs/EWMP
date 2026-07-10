/**
 * seedDemo.js
 * Demo data seeding is intentionally disabled.
 *
 * This compatibility wrapper preserves old commands while delegating to
 * seedAuth.js, which creates only the default organization and role logins.
 */

const seedAuth = require('./seedAuth');

const seedDemo = () => seedAuth();

if (require.main === module) {
  seedDemo();
}

module.exports = seedDemo;
