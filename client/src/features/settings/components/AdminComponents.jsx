import React, { useState } from 'react';
import { User, Mail, Phone, Building2, Shield, Key, Clock, CheckCircle2, ChevronRight, Lock, MapPin, Smartphone, Monitor, Trash2, Edit3, Check, X, ArrowUpRight, Sparkles } from 'lucide-react';

/**
 * AdminComponents.jsx
 * Enterprise UI components for the Settings & Administration Module.
 * Precision Enterprise Design System (#2563eb primary, Inter font, rounded-lg, slate neutrals).
 */

export const StatusBadge = ({ status = 'active', label, className = '' }) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/50',
    compliant: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/50',
    operational: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-800/50',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800/50',
    suspended: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800/50',
    error: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800/50',
    pending: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    admin: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-800/50'
  };

  const normalized = status.toLowerCase();
  const appliedStyle = styles[normalized] || styles.pending;
  const displayLabel = label || status.replace('_', ' ').toUpperCase();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${appliedStyle} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {displayLabel}
    </span>
  );
};

export const ProfileCard = ({ user, onEditProfile, onUploadAvatar }) => {
  const completionPercent = user?.completion || 85;

  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar with completion ring */}
        <div className="relative group cursor-pointer" onClick={onUploadAvatar}>
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md">
            <div className="w-full h-full rounded-full bg-white dark:bg-[#111111] p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.charAt(0) || 'A'}{user?.lastName?.charAt(0) || 'D'}</span>
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
            Change
          </div>
          <span className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-[#111111] shadow-sm" title="Online">
            <CheckCircle2 size={12} />
          </span>
        </div>

        {/* User metadata */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                {user?.name || 'Alexander Vance'} {user?.lastName || 'Thornton'}
                <StatusBadge status="admin" label={user?.role?.replace('_', ' ') || 'SUPER ADMIN'} />
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user?.designation || 'Chief Information Security Officer (CISO)'}</p>
            </div>
            <button 
              onClick={onEditProfile}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-medium text-xs rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
            >
              <Edit3 size={14} />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Mail size={14} className="text-slate-400" />
              <span className="truncate">{user?.email || 'a.vance@ewmp-enterprise.com'}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Building2 size={14} className="text-slate-400" />
              <span>{user?.department || 'Global Executive HQ'}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Phone size={14} className="text-slate-400" />
              <span>{user?.phone || '+1 (415) 890-4321'}</span>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Profile Completion Status</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{completionPercent}% Complete</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsCard = ({ title, subtitle, icon: Icon, badge, children, footerAction, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex flex-col overflow-hidden ${className}`}>
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {Icon && (
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">
              <Icon size={20} />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
              {badge && <StatusBadge status={badge.status || 'active'} label={badge.label} />}
            </div>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-5 flex-1 space-y-4">
        {children}
      </div>
      {footerAction && (
        <div className="px-5 py-3 bg-slate-50 dark:bg-[#161616] border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          {footerAction}
        </div>
      )}
    </div>
  );
};

export const RoleCard = ({ role, onSelectRole, onAssignUser }) => {
  const userCount = role?.userCount || 0;
  const isProtected = role?.isProtected || false;

  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Shield size={18} className={role?.code === 'SUPER_ADMIN' ? 'text-purple-600' : 'text-blue-600'} />
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">{role?.name || 'Organization Administrator'}</h4>
          </div>
          {isProtected ? (
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded uppercase flex items-center gap-1">
              <Lock size={10} /> System
            </span>
          ) : (
            <StatusBadge status="active" label="CUSTOM" />
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{role?.description || 'Full supervisory access to organization policies, employees, payroll ledgers, and attendance geofences.'}</p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
          <User size={14} className="text-slate-400" />
          <span>{userCount} {userCount === 1 ? 'User Assigned' : 'Users Assigned'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onAssignUser && onAssignUser(role)}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            + Assign
          </button>
          <button 
            onClick={() => onSelectRole && onSelectRole(role)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
          >
            Permissions <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const PermissionMatrix = ({ modules = [], roleName = 'SUPER_ADMIN', onTogglePermission, isReadOnly = false }) => {
  const defaultModules = [
    { id: 'auth', name: 'Authentication & Shell', read: true, write: true, delete: true, admin: true },
    { id: 'org', name: 'Organization Management', read: true, write: true, delete: true, admin: true },
    { id: 'emp', name: 'Employee Directory & Profiles', read: true, write: true, delete: false, admin: true },
    { id: 'att', name: 'Attendance & Biometrics', read: true, write: true, delete: true, admin: true },
    { id: 'lve', name: 'Leave & PTO Policies', read: true, write: true, delete: false, admin: true },
    { id: 'pay', name: 'Payroll & Tax Ledgers', read: true, write: false, delete: false, admin: false },
    { id: 'prf', name: 'Performance & OKRs', read: true, write: true, delete: false, admin: false },
    { id: 'rec', name: 'Recruitment & ATS Pipeline', read: true, write: true, delete: true, admin: false },
    { id: 'prj', name: 'Projects & Resource Alloc', read: true, write: true, delete: true, admin: true },
    { id: 'tsk', name: 'Task Board & Kanban', read: true, write: true, delete: true, admin: false },
    { id: 'ast', name: 'Asset Registry & CMDB', read: true, write: true, delete: false, admin: false },
    { id: 'doc', name: 'Document Vault & Verify', read: true, write: true, delete: true, admin: true },
    { id: 'not', name: 'Notifications & Broadcasts', read: true, write: true, delete: false, admin: true },
    { id: 'hlp', name: 'Help Desk & Service Triage', read: true, write: true, delete: false, admin: false },
    { id: 'rpt', name: 'Reports & BI Analytics', read: true, write: false, delete: false, admin: true },
    { id: 'ai', name: 'AI Assistant Workspace (Gemini)', read: true, write: true, delete: false, admin: true }
  ];

  const data = modules.length > 0 ? modules : defaultModules;

  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-50 dark:bg-[#161616] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">RBAC Scope Matrix</span>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">Configuring Access for: <span className="text-blue-600 dark:text-blue-400 font-bold">{roleName}</span></h4>
        </div>
        {!isReadOnly && (
          <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#111] px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
            Click toggles to modify permissions
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#141414]">
              <th className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Platform Module / Domain</th>
              <th className="py-3 px-4 font-semibold text-center text-slate-700 dark:text-slate-300 w-24">Read (View)</th>
              <th className="py-3 px-4 font-semibold text-center text-slate-700 dark:text-slate-300 w-24">Write (Edit)</th>
              <th className="py-3 px-4 font-semibold text-center text-slate-700 dark:text-slate-300 w-24">Delete (Purge)</th>
              <th className="py-3 px-4 font-semibold text-center text-slate-700 dark:text-slate-300 w-24">Admin / Config</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((mod) => (
              <tr key={mod.id} className="hover:bg-slate-50/80 dark:hover:bg-[#161616]/80 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  {mod.name}
                </td>
                {['read', 'write', 'delete', 'admin'].map((permType) => (
                  <td key={permType} className="py-3 px-4 text-center">
                    <button
                      disabled={isReadOnly}
                      onClick={() => onTogglePermission && onTogglePermission(mod.id, permType)}
                      className={`inline-flex items-center justify-center w-6 h-6 rounded transition-all ${
                        mod[permType] 
                          ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                      } ${isReadOnly ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                    >
                      {mod[permType] ? <Check size={14} strokeWidth={3} /> : <X size={12} />}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ActivityTimeline = ({ activities = [] }) => {
  const defaultActivities = [
    { id: 1, type: 'SECURITY', action: 'Updated Global MFA Policy', actor: 'Alexander Vance (SUPER_ADMIN)', timestamp: '10 mins ago', ip: '192.168.1.104', icon: <Shield size={16} /> },
    { id: 2, type: 'ROLE', action: 'Assigned FINANCE role to Sarah Jenkins', actor: 'Alexander Vance (SUPER_ADMIN)', timestamp: '2 hours ago', ip: '192.168.1.104', icon: <Key size={16} /> },
    { id: 3, type: 'ORG', action: 'Modified UK Subsidiary Working Hours Grid', actor: 'Marcus Sterling (ORG_ADMIN)', timestamp: '5 hours ago', ip: '10.0.4.88', icon: <Building2 size={16} /> },
    { id: 4, type: 'PROFILE', action: 'Updated Emergency Contact & Tax ID', actor: 'Elena Rostova (EMPLOYEE)', timestamp: 'Yesterday at 4:15 PM', ip: '172.16.0.42', icon: <User size={16} /> },
    { id: 5, type: 'AI', action: 'Refreshed Gemini 3.1 Pro Vector Cache Buffer', actor: 'System Daemon (CRON)', timestamp: 'Yesterday at 12:00 AM', ip: 'localhost', icon: <Sparkles size={16} /> }
  ];

  const items = activities.length > 0 ? activities : defaultActivities;

  const typeColors = {
    SECURITY: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200',
    ROLE: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200',
    ORG: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200',
    PROFILE: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200',
    AI: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200'
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {items.map((item) => (
        <div key={item.id} className="relative flex items-start gap-4">
          <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#111111] shadow-sm ${typeColors[item.type] || typeColors.ORG}`}>
            {item.icon || <Clock size={12} />}
          </div>
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex-1 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.action}</span>
              <span className="text-[11px] font-medium text-slate-400 shrink-0">{item.timestamp}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
              <span>Actor: <strong className="text-slate-700 dark:text-slate-300">{item.actor}</strong></span>
              <span className="font-mono bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">IP: {item.ip}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SessionCard = ({ session, onRevoke }) => {
  const isCurrent = session?.isCurrent || false;

  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex items-center justify-between gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
          {session?.deviceType === 'mobile' ? <Smartphone size={20} /> : <Monitor size={20} />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{session?.browser || 'Chrome 122.0 (Windows 11)'}</h4>
            {isCurrent && (
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-full uppercase">
                Current Session
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="flex items-center gap-1"><MapPin size={12} /> {session?.location || 'San Francisco, CA (US)'}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {session?.lastActive || 'Active Now'}</span>
            <span className="font-mono bg-slate-50 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[10px]">{session?.ip || '192.168.1.104'}</span>
          </div>
        </div>
      </div>
      {!isCurrent && (
        <button 
          onClick={() => onRevoke && onRevoke(session?.id)}
          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 font-medium text-xs rounded-lg border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1.5"
        >
          <Trash2 size={14} /> Revoke
        </button>
      )}
    </div>
  );
};

export const SecurityCard = ({ title, description, status = 'compliant', icon: Icon, actionLabel, onAction }) => {
  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 shrink-0">
            {Icon ? <Icon size={20} /> : <Shield size={20} />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
      {actionLabel && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
          <button 
            onClick={onAction}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
          >
            {actionLabel} <ArrowUpRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export const PreferenceCard = ({ title, description, checked, onChange, type = 'toggle', options = [], value, onSelectChange }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
      <div className="pr-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
      </div>
      {type === 'toggle' ? (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange && onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
            checked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      ) : (
        <select
          value={value}
          onChange={(e) => onSelectChange && onSelectChange(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
    </div>
  );
};
