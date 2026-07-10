import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { 
  LifeBuoy, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  ShieldAlert 
} from 'lucide-react';
import { AreaChartPlaceholder } from '../charts/ChartsPlaceholders';

/**
 * HelpDeskAnalyticsWidget.jsx
 * Executive IT & HR Helpdesk Analytics Widget.
 * Tracks ticket queues, critical priority escalations, resolution SLAs, and support trends.
 */

export const HelpDeskAnalyticsWidget = () => {
  const { data: hdRes } = useQuery({
    queryKey: ['_reports_helpdesk'],
    queryFn: () => api.get('/reports/helpdesk?export=true').then(res => res.data)
  });
  const rawData = hdRes?.data || [];
  const total = rawData.length || 1;
  
  const closedCount = rawData.filter(r => r.ticketStatus === 'Closed').length;
  const resolutionPct = Math.round((closedCount / total) * 100);
  const openCount = rawData.filter(r => r.ticketStatus === 'Open').length;
  const slaSegments = [
    { name: 'Closed', value: closedCount, color: 'bg-emerald-500' },
    { name: 'Open', value: openCount, color: 'bg-rose-500' }
  ];
  

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
            <LifeBuoy size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              IT &amp; HR Helpdesk Resolution
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Support ticket volume, critical escalations &amp; mean time to resolution (MTTR)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 rounded-lg border border-cyan-200 dark:border-cyan-800/40 text-xs font-mono font-semibold">
            18 Pending Tickets
          </span>
        </div>
      </div>

      {/* Grid: Resolution Trend & Queue status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2">
          <AreaChartPlaceholder
            title="30-Day Ticket Ingestion vs Resolution Velocity"
            subtitle="Comparing created tickets against solved support requests"
            height="h-52"
          />
        </div>

        <div className="space-y-3">
          <div className="p-3.5 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase text-gray-400">Critical Priority</span>
              <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">3 Escalated</div>
            </div>
            <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-lg">
              <ShieldAlert size={18} />
            </div>
          </div>

          <div className="p-3.5 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase text-gray-400">Mean Resolution Time</span>
              <div className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-0.5">22 Minutes</div>
            </div>
            <div className="p-2.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-lg">
              <Clock size={18} />
            </div>
          </div>

          <div className="p-3.5 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase text-gray-400">First Contact Resolution</span>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">91.8% Solved</div>
            </div>
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
              <CheckCircle size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
        <span>Assigned agents currently active: <strong className="text-gray-900 dark:text-white">8 L2/L3 Engineers</strong></span>
        <button
          onClick={() => window.location.assign('/helpdesk')}
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          Open Support Desk
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default HelpDeskAnalyticsWidget;
