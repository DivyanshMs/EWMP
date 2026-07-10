/**
 * attendancePlugin.js — Phase 15: AI Module Plugin Framework
 * Attendance Module AI Plugin exposing standardized AI interface for attendance queries,
 * absenteeism recommendations, overtime insights, and attendance regularization actions.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const BasePlugin = require('./basePlugin');

class AttendancePlugin extends BasePlugin {
  constructor() {
    super({
      moduleName: 'ATTENDANCE',
      version: '1.0.0',
      supportedIntents: [
        'ATTENDANCE_QUERY',
        'ATTENDANCE_RECOMMENDATION',
        'ATTENDANCE_INSIGHT',
        'ATTENDANCE_ACTION',
        'REGULARIZE_ATTENDANCE',
      ],
      availableFeatures: [
        'Attendance Record & Shift Context',
        'Absenteeism Risk Recommendations',
        'Overtime & Late Punch Insights',
        'Attendance Regularization Action Planning',
      ],
    });
  }
}

module.exports = new AttendancePlugin();
