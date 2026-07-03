/**
 * sendEmail.js
 * Transactional Email Utility
 * Uses Nodemailer with SMTP configuration for all outbound emails.
 * Called by authService (password reset, welcome email) and notificationService.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 *            DEVELOPMENT_ORDER.md Section 10 (Step 9 — sendEmail.js)
 */

const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

/**
 * Creates a configured Nodemailer transport.
 * @returns {nodemailer.Transporter}
 */
const createTransport = () => {
  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
};

/**
 * Send a transactional email.
 * @param {object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {string} [options.text] - Plain text fallback
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransport();

    const mailOptions = {
      from: `"EWMP Platform" <${config.email.from}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    };

    if (config.env === 'test' || !config.email.host) {
      logger.info(`[Email Stub] To: ${to} | Subject: ${subject}`);
      return;
    }

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`, { error });
    // Do not crash transaction if email fails in dev/test, but log error
    if (config.env === 'production') {
      throw error;
    }
  }
};

module.exports = sendEmail;
