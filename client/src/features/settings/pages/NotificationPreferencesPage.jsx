import React, { useState } from 'react';
import { Bell, Mail, Smartphone, CheckCircle2, Save, Check, X } from 'lucide-react';
import { SettingsCard, StatusBadge } from '../components/AdminComponents';

/**
 * NotificationPreferencesPage.jsx
 * Granular matrix for Email vs. In-App Notifications across platform domains.
 */

export const NotificationPreferencesPage = () => {
  const [channels, setChannels] = useState([
    { id: 'pay_slip', category: 'Payroll & Tax Ledgers', event: 'New Monthly Salary Paystub Published', email: true, inApp: true, mobilePush: true, mandatory: false },
    { id: 'pay_tax', category: 'Payroll & Tax Ledgers', event: 'Annual W-2 / Tax Form Ready for Download', email: true, inApp: true, mobilePush: false, mandatory: true },
    { id: 'att_check', category: 'Attendance & Biometrics', event: 'Daily Check-in / Check-out Geofence Confirmation', email: false, inApp: true, mobilePush: true, mandatory: false },
    { id: 'att_anom', category: 'Attendance & Biometrics', event: 'Attendance Regularization Request Status Change', email: true, inApp: true, mobilePush: true, mandatory: false },
    { id: 'lve_appr', category: 'Leave & PTO Management', event: 'Leave Request Approved or Rejected by Manager', email: true, inApp: true, mobilePush: true, mandatory: false },
    { id: 'tsk_assgn', category: 'Task Board & Kanban', event: 'New Project Task or Slink Assigned to You', email: true, inApp: true, mobilePush: false, mandatory: false },
    { id: 'tsk_sla', category: 'Task Board & Kanban', event: 'Task Deadline approaching within 24 Hours', email: false, inApp: true, mobilePush: true, mandatory: false },
    { id: 'ai_recs', category: 'AI Assistant Workspace', event: 'Gemini 3.1 Pro Published Actionable Intelligence Recommendation', email: false, inApp: true, mobilePush: false, mandatory: false },
    { id: 'ai_exec', category: 'AI Assistant Workspace', event: 'Autonomous Workflow Simulation Complete', email: true, inApp: true, mobilePush: true, mandatory: false },
    { id: 'ann_global', category: 'Organization Announcements', event: 'Global Executive Broadcast or Emergency Policy Change', email: true, inApp: true, mobilePush: true, mandatory: true }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (id, channelType) => {
    setChannels(channels.map(item => {
      if (item.id === id) {
        if (item.mandatory && channelType === 'email') {
          alert('Notice: Critical executive announcements and tax compliance notifications require email delivery.');
          return item;
        }
        return { ...item, [channelType]: !item[channelType] };
      }
      return item;
    }));
  };

  const handleToggleAll = (channelType, value) => {
    setChannels(channels.map(item => {
      if (item.mandatory && !value && channelType === 'email') return item;
      return { ...item, [channelType]: value };
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Your notification preferences across email, in-app notifications, and mobile push endpoints have been saved.</span>
        </div>
      )}

      <SettingsCard 
        title="Multi-Channel Notification Matrix" 
        subtitle="Configure real-time event routing for email digests, in-app bell notifications, and mobile push alerts"
        icon={Bell}
        badge={{ status: 'active', label: 'REAL-TIME ROUTING' }}
      >
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#161616] rounded-lg border border-slate-200 dark:border-slate-800 text-xs mb-4">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Channel Toggles (All Events):</span>
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => handleToggleAll('email', true)} 
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
            >
              <Mail size={12} /> Enable All Emails
            </button>
            <button 
              type="button"
              onClick={() => handleToggleAll('inApp', true)} 
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
            >
              <Bell size={12} /> Enable All In-App
            </button>
            <button 
              type="button"
              onClick={() => handleToggleAll('mobilePush', true)} 
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
            >
              <Smartphone size={12} /> Enable All Push
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141414]">
                <th className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Event Trigger / Category</th>
                <th className="py-3 px-4 font-semibold text-center text-slate-700 dark:text-slate-300 w-28">
                  <div className="flex items-center justify-center gap-1"><Mail size={14} /> Email</div>
                </th>
                <th className="py-3 px-4 font-semibold text-center text-slate-700 dark:text-slate-300 w-28">
                  <div className="flex items-center justify-center gap-1"><Bell size={14} /> In-App</div>
                </th>
                <th className="py-3 px-4 font-semibold text-center text-slate-700 dark:text-slate-300 w-28">
                  <div className="flex items-center justify-center gap-1"><Smartphone size={14} /> Mobile Push</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {channels.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-[#161616]/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{row.event}</span>
                      {row.mandatory && (
                        <span className="px-1.5 py-0.2 bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 text-[9px] font-bold rounded uppercase">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{row.category}</span>
                  </td>
                  {['email', 'inApp', 'mobilePush'].map((chan) => (
                    <td key={chan} className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(row.id, chan)}
                        className={`inline-flex items-center justify-center w-6 h-6 rounded transition-all cursor-pointer ${
                          row[chan] 
                            ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {row[chan] ? <Check size={14} strokeWidth={3} /> : <X size={12} />}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      {/* Footer Submit */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving Channels...
            </>
          ) : (
            <>
              <Save size={14} />
              Save Notification Preferences
            </>
          )}
        </button>
      </div>
    </form>
  );
};
