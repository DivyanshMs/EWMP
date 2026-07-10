import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Download } from 'lucide-react';
import api from '../../../lib/axios';
import { LeaveCalendar } from '../components/LeaveCalendar';

/**
 * LeaveCalendarPage.jsx
 * Comprehensive organizational leave roster and company holiday schedule for EWMP.
 * Wraps the interactive multi-view calendar component.
 */

export const LeaveCalendarPage = () => {
  const { data: requestsRes } = useQuery({
    queryKey: ['leave-calendar-requests'],
    queryFn: () => api.get('/leave-requests', { params: { limit: 100 } }).then((res) => res.data),
  });

  const { data: holidaysRes } = useQuery({
    queryKey: ['leave-calendar-holidays'],
    queryFn: () => api.get('/holidays', { params: { limit: 100 } }).then((res) => res.data),
  });

  const requests = requestsRes?.data?.items || requestsRes?.data || [];
  const holidays = holidaysRes?.data?.items || holidaysRes?.data || [];
  const events = requests.map((request) => {
    const start = request.startDate ? new Date(request.startDate) : null;
    const employee = request.employeeId;
    return {
      day: start && !Number.isNaN(start.getTime()) ? start.getDate() : null,
      employee: [employee?.firstName, employee?.lastName].filter(Boolean).join(' ') || employee?.employeeCode || 'Employee',
      dept: employee?.departmentId?.name || 'Unassigned',
      type: request.leaveType?.code || request.leaveType?.name || 'LEAVE',
      dates: `${request.startDate ? new Date(request.startDate).toLocaleDateString() : '-'} - ${request.endDate ? new Date(request.endDate).toLocaleDateString() : '-'}`,
      days: `${request.totalDays || 0} Days`,
      status: (request.approvalStatus || 'PENDING').toUpperCase(),
      avatar: ([employee?.firstName?.[0], employee?.lastName?.[0]].filter(Boolean).join('') || 'E').toUpperCase(),
    };
  }).filter((event) => event.day);

  const holidayEvents = holidays.map((holiday) => {
    const date = holiday.date ? new Date(holiday.date) : null;
    return {
      day: date && !Number.isNaN(date.getTime()) ? date.getDate() : null,
      name: holiday.name,
      type: holiday.type || 'Holiday',
    };
  }).filter((holiday) => holiday.day);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <Calendar size={20} className="text-[#2563eb]" />
            ORGANIZATIONAL LEAVE ROSTER & HOLIDAY CALENDAR
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
            Visualize monthly and weekly staff availability, departmental absences, and corporate holidays.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting calendar schedule to iCal / PDF...')}
            className="px-3.5 py-2.5 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} /> Export Schedule
          </button>
        </div>
      </div>

      {/* Interactive Calendar Component */}
      <LeaveCalendar events={events} holidays={holidayEvents} />
    </div>
  );
};
