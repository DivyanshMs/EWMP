/**
 * env.js
 * Environment Variable Validation
 * Delegates to central config validator to enforce environment and secret rules.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 */

const config = require('./config');

const validateEnv = () => {
  return config.validateConfig();
};

module.exports = { validateEnv };
