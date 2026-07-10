import React from 'react';
import { 
  UserPlus, 
  CalendarCheck, 
  DollarSign, 
  FolderPlus, 
  CheckSquare, 
  UploadCloud, 
  Megaphone, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

/**
 * QuickActionsWidget.jsx
 * Responsive Quick Actions grid for EWMP Executive Dashboard.
 * Allows executives to trigger critical workflows directly from the central hub.
 */

const QuickActionCard = ({ action }) => {
  return (
    <button
      onClick={action.onClick}
      className="group flex flex-col items-start justify-between p-4 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 text-left w-full min-h-32 overflow-hidden"
    >
      <div className="flex items-center justify-between w-full">
        <div className={`p-2.5 rounded-lg ${action.bg} ${action.color} transition-transform duration-200 group-hover:scale-110`}>
          <action.icon size={20} className="stroke-[1.75]" />
        </div>
        <ArrowUpRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {action.label}
        </h4>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 break-words mt-0.5 leading-snug">
          {action.description}
        </p>
      </div>
    </button>
  );
};

export const QuickActionsWidget = ({ onActionTrigger }) => {
  const actions = [
    {
      id: 'create_employee',
      label: 'Create Employee',
      description: 'Onboard new hire profile',
      icon: UserPlus,
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      color: 'text-blue-600 dark:text-blue-400',
      onClick: () => onActionTrigger?.('Create Employee') || alert('Opening Create Employee Dialog...'),
    },
    {
      id: 'approve_leave',
      label: 'Approve Leave',
      description: '14 pending PTO requests',
      icon: CalendarCheck,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      color: 'text-emerald-600 dark:text-emerald-400',
      onClick: () => onActionTrigger?.('Approve Leave') || alert('Navigating to Leave Approvals...'),
    },
    {
      id: 'run_payroll',
      label: 'Run Payroll',
      description: 'Execute July disbursement',
      icon: DollarSign,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      color: 'text-indigo-600 dark:text-indigo-400',
      onClick: () => onActionTrigger?.('Run Payroll') || alert('Launching Payroll Simulation Engine...'),
    },
    {
      id: 'add_project',
      label: 'Add Project',
      description: 'Initialize new client workspace',
      icon: FolderPlus,
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      color: 'text-purple-600 dark:text-purple-400',
      onClick: () => onActionTrigger?.('Add Project') || alert('Opening Project Creation Modal...'),
    },
    {
      id: 'create_task',
      label: 'Create Task',
      description: 'Assign agile deliverables',
      icon: CheckSquare,
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      color: 'text-sky-600 dark:text-sky-400',
      onClick: () => onActionTrigger?.('Create Task') || alert('Opening Task Assignment Modal...'),
    },
    {
      id: 'upload_doc',
      label: 'Upload Document',
      description: 'Secure Cloudinary storage',
      icon: UploadCloud,
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      color: 'text-amber-600 dark:text-amber-400',
      onClick: () => onActionTrigger?.('Upload Document') || alert('Opening Document Upload Modal...'),
    },
    {
      id: 'create_announcement',
      label: 'Announcement',
      description: 'Broadcast company broadcast',
      icon: Megaphone,
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      color: 'text-rose-600 dark:text-rose-400',
      onClick: () => onActionTrigger?.('Create Announcement') || alert('Opening Broadcast Modal...'),
    },
    {
      id: 'open_ai',
      label: 'AI Assistant',
      description: 'Autonomous chat workspace',
      icon: Sparkles,
      bg: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-900/40 dark:to-purple-900/40',
      color: 'text-indigo-600 dark:text-indigo-400',
      onClick: () => onActionTrigger?.('Open AI Assistant') || alert('Opening Full AI Assistant Workspace...'),
    },
  ];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Executive Quick Actions
        </h3>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
          One-click operational triggers
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
        {actions.map((act) => (
          <QuickActionCard key={act.id} action={act} />
        ))}
      </div>
    </section>
  );
};

export default QuickActionsWidget;
