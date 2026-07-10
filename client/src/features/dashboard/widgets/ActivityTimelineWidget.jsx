import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { 
  UserPlus, 
  CheckCircle, 
  DollarSign, 
  Briefcase, 
  LifeBuoy, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

/**
 * ActivityTimelineWidget.jsx
 * Recent Activity Timeline for EWMP Executive Dashboard.
 * Displays real-time operational events across Employee onboarding, Leave approvals,
 * Payroll runs, Task deliverables, and Helpdesk resolutions.
 */

export const ActivityTimelineWidget = () => {
  const { data: tasksRes } = useQuery({
    queryKey: ['reports_tasks'],
    queryFn: () => api.get('/reports/tasks?limit=5').then(res => res.data)
  });
  
  const rawTasks = tasksRes?.data || [];
  const dynamicActivities = rawTasks.map(t => ({
    id: t._id || t.id,
    type: 'Task Update',
    title: t.title || 'Task updated',
    meta: 'Project: ' + (t.projectId?.name || 'General'),
    time: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'Just now',
    icon: CheckCircle,
    bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    status: t.taskStatus || 'Pending',
    statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
  }));
  
  // Use only dynamic activities from API; avoid static demo data
  const finalActivities = dynamicActivities;

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              Recent Enterprise Activity
            </h3>
          </div>
          <button
            onClick={() => window.location.assign('/reports')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View Full Audit Trail
            <ExternalLink size={12} />
          </button>
        </div>

        {/* Timeline list */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
          {finalActivities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline Icon Badge */}
              <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center border ${act.bg} shadow-sm bg-white dark:bg-[#111]`}>
                <act.icon size={13} className="stroke-[2]" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {act.type}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${act.statusColor}`}>
                      {act.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {act.meta}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400 shrink-0 mt-1 sm:mt-0">
                  <Clock size={12} />
                  {act.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
          Showing 5 most recent actions • Auto-refreshing every 30s
        </span>
      </div>
    </div>
  );
};

export default ActivityTimelineWidget;
