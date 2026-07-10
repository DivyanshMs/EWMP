const attendanceService = require('../services/attendanceService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

const clockIn = async (req, res, next) => {
  try {
    const data = await attendanceService.clockIn(req.validatedBody, req.user);
    sendSuccess(res, 201, 'Clock-in successful', data);
  } catch (error) { next(error); }
};

const clockOut = async (req, res, next) => {
  try {
    const data = await attendanceService.clockOut(req.validatedBody, req.user);
    sendSuccess(res, 200, 'Clock-out successful', data);
  } catch (error) { next(error); }
};

const getAttendance = async (req, res, next) => {
  try {
    const data = await attendanceService.getAttendance(req.query, req.user);
    sendPaginatedSuccess(res, 200, 'Attendance records retrieved', data);
  } catch (error) { next(error); }
};

const getMyAttendance = async (req, res, next) => {
  try {
    const data = await attendanceService.getMyAttendance(req.query, req.user);
    sendPaginatedSuccess(res, 200, 'My attendance retrieved', data);
  } catch (error) { next(error); }
};

const getAttendanceById = async (req, res, next) => {
  try {
    const data = await attendanceService.getAttendanceById(req.params.id, req.user);
    sendSuccess(res, 200, 'Attendance record retrieved', data);
  } catch (error) { next(error); }
};

const requestCorrection = async (req, res, next) => {
  try {
    const data = await attendanceService.requestCorrection(req.params.id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Correction requested successfully', data);
  } catch (error) { next(error); }
};

const approveCorrection = async (req, res, next) => {
  try {
    const data = await attendanceService.approveCorrection(req.params.id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Correction processed successfully', data);
  } catch (error) { next(error); }
};

module.exports = {
  clockIn,
  clockOut,
  getAttendance,
  getMyAttendance,
  getAttendanceById,
  requestCorrection,
  approveCorrection
};
