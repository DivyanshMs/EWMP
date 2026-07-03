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

/**
 * Creates a configured Nodemailer transport.
 * @returns {nodemailer.Transporter}
 */
const createTransport = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: parseInt(process.env.EMAIL_PORT, 10) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
  const transporter = createTransport();

  const mailOptions = {
    from: `"EWMP Platform" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
