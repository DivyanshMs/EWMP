import React, { useState } from 'react';
import { Globe, Calendar, Key, ShieldCheck, Laptop, CheckCircle2, Save } from 'lucide-react';
import { SettingsCard, PreferenceCard, SessionCard, StatusBadge } from '../components/AdminComponents';
import { NoSessions } from '../components/AdminEmptyStates';

/**
 * AccountSettingsPage.jsx
 * Account authentication credentials, localization preferences, 2FA, and active session governance.
 */

export const AccountSettingsPage = () => {
  const [preferences, setPreferences] = useState({
    username: 'alexander.vance',
    email: 'a.vance@ewmp-enterprise.com',
    language: 'en-US',
    timeZone: 'America/Los_Angeles',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    twoFactorEnabled: true,
    autoLogoutTimeout: '30'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 'sess-01', browser: 'Chrome 122.0 (Windows 11 Enterprise)', ip: '192.168.1.104', location: 'San Francisco, CA (US)', lastActive: 'Active Now', isCurrent: true, deviceType: 'desktop' },
    { id: 'sess-02', browser: 'Safari 17.2 (macOS Sonoma 14.3)', ip: '172.16.0.88', location: 'Palo Alto, CA (US)', lastActive: '2 hours ago', isCurrent: false, deviceType: 'desktop' },
    { id: 'sess-03', browser: 'EWMP Mobile App (iOS 17.3)', ip: '10.0.4.12', location: 'San Francisco, CA (US)', lastActive: 'Yesterday at 8:40 PM', isCurrent: false, deviceType: 'mobile' }
  ]);

  const handlePrefChange = (field, val) => {
    setPreferences(prev => ({ ...prev, [field]: val }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Error: New password and confirmation password do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 10) {
      alert('Error: Enterprise security policy requires passwords to be at least 10 characters.');
      return;
    }
    setPasswordSuccess(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const handleRevokeSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Localization & Display Parameters */}
      <SettingsCard 
        title="Account Preferences & Localization" 
        subtitle="Language, timezone, and calendar date format settings"
        icon={Globe}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">System Language</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePrefChange('language', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="en-US">English (United States) - Default</option>
              <option value="en-GB">English (United Kingdom)</option>
              <option value="es-ES">Español (España)</option>
              <option value="fr-FR">Français (France)</option>
              <option value="de-DE">Deutsch (Deutschland)</option>
              <option value="ja-JP">日本語 (Japan)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Operating Time Zone</label>
            <select
              value={preferences.timeZone}
              onChange={(e) => handlePrefChange('timeZone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="America/Los_Angeles">(UTC-08:00) Pacific Time - Los Angeles</option>
              <option value="America/New_York">(UTC-05:00) Eastern Time - New York</option>
              <option value="Europe/London">(UTC+00:00) Greenwich Mean Time - London</option>
              <option value="Europe/Berlin">(UTC+01:00) Central European Time - Berlin</option>
              <option value="Asia/Tokyo">(UTC+09:00) Japan Standard Time - Tokyo</option>
              <option value="Australia/Sydney">(UTC+10:00) Australian Eastern Time - Sydney</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Calendar Date Format</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => handlePrefChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g., 2026-07-08)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g., 07/08/2026)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g., 08/07/2026)</option>
              <option value="DD MMM YYYY">DD MMM YYYY (e.g., 08 Jul 2026)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Notation Standard</label>
            <select
              value={preferences.timeFormat}
              onChange={(e) => handlePrefChange('timeFormat', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="24h">24-Hour Military Notation (14:30)</option>
              <option value="12h">12-Hour AM/PM Notation (2:30 PM)</option>
            </select>
          </div>
        </div>
      </SettingsCard>

      {/* Section 2: Cryptographic Security & Password Update */}
      <SettingsCard 
        title="Cryptographic Credentials & Password Modification" 
        subtitle="Update your primary authentication passphrase (minimum 10 characters enforced)"
        icon={Key}
        badge={{ status: 'compliant', label: 'AES-256 ENCRYPTED' }}
      >
        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Your authentication password has been updated. All non-current sessions remain active unless explicitly revoked below.</span>
          </div>
        )}
        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
            <input 
              type="password"
              placeholder="••••••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
            <input 
              type="password"
              placeholder="Min 10 characters"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
            <input 
              type="password"
              placeholder="Re-type new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Save size={14} /> Update Cryptographic Passphrase
            </button>
          </div>
        </form>
      </SettingsCard>

      {/* Section 3: Two-Factor Authentication (2FA) & Timeout */}
      <SettingsCard 
        title="Multi-Factor Authentication & Inactivity Safeguards" 
        subtitle="Manage hardware token verification and idle session termination"
        icon={ShieldCheck}
      >
        <div className="space-y-3">
          <PreferenceCard 
            title="Two-Factor Authentication (2FA) Enforcement" 
            description="Require TOTP authenticator app verification upon every authentication attempt from an unrecognized IP address."
            checked={preferences.twoFactorEnabled}
            onChange={(val) => handlePrefChange('twoFactorEnabled', val)}
          />
          <PreferenceCard 
            title="Idle Session Auto-Termination Threshold" 
            description="Automatically terminate remote sessions after a period of user inactivity to prevent unauthorized terminal access."
            type="select"
            value={preferences.autoLogoutTimeout}
            onSelectChange={(val) => handlePrefChange('autoLogoutTimeout', val)}
            options={[
              { value: '15', label: '15 Minutes Inactivity' },
              { value: '30', label: '30 Minutes Inactivity (Default)' },
              { value: '60', label: '1 Hour Inactivity' },
              { value: '240', label: '4 Hours Inactivity' }
            ]}
          />
        </div>
      </SettingsCard>

      {/* Section 4: Active Remote Session Registry */}
      <SettingsCard 
        title="Active Remote Session Registry" 
        subtitle="Inspect logged-in devices across web and mobile endpoints. Revoke suspicious sessions immediately."
        icon={Laptop}
        footerAction={
          <button 
            onClick={() => setSessions(sessions.filter(s => s.isCurrent))}
            className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
          >
            Revoke All Other Sessions
          </button>
        }
      >
        {sessions.length > 0 ? (
          <div className="space-y-3 pt-1">
            {sessions.map(s => (
              <SessionCard key={s.id} session={s} onRevoke={handleRevokeSession} />
            ))}
          </div>
        ) : (
          <NoSessions onRefresh={() => alert('Session registry refreshed.')} />
        )}
      </SettingsCard>
    </div>
  );
};
