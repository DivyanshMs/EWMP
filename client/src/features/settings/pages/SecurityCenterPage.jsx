import React, { useState } from 'react';
import { Shield, Lock, Key, MapPin, Smartphone, Monitor, RefreshCw, FileText, Download, ArrowUpRight } from 'lucide-react';
import { SettingsCard, PreferenceCard, SecurityCard, StatusBadge } from '../components/AdminComponents';

/**
 * SecurityCenterPage.jsx
 * Enterprise security governance, login history auditing, password policy rules, and device registries.
 */

export const SecurityCenterPage = () => {
  const [policies, setPolicies] = useState({
    minPasswordLength: '12',
    requireSpecialChar: true,
    requireNumeric: true,
    requireUppercase: true,
    passwordExpiryDays: '90',
    maxConcurrentSessions: '3',
    sessionTimeoutMinutes: '30',
    enforceGlobalMfa: true,
    enforceGeofencing: true,
    notifyOnNewDevice: true
  });

  const [loginHistory] = useState([
    { id: 1, user: 'Alexander Vance (SUPER_ADMIN)', timestamp: '2026-07-08 01:42:10', ip: '192.168.1.104', location: 'San Francisco, CA (US)', device: 'Chrome 122 / Windows 11', status: 'SUCCESS', mfa: 'TOTP Verified' },
    { id: 2, user: 'Victoria Sterling (ORG_ADMIN)', timestamp: '2026-07-08 00:15:44', ip: '10.0.4.88', location: 'London (UK)', device: 'Safari 17 / macOS Sonoma', status: 'SUCCESS', mfa: 'Biometric FaceID' },
    { id: 3, user: 'Marcus Vance (FINANCE)', timestamp: '2026-07-07 22:30:12', ip: '172.16.0.42', location: 'Tokyo (JP)', device: 'Firefox 123 / Windows 10', status: 'SUCCESS', mfa: 'TOTP Verified' },
    { id: 4, user: 'Unknown IP Endpoint', timestamp: '2026-07-07 19:04:05', ip: '185.220.101.5', location: 'Frankfurt (DE)', device: 'Curl / Linux x86_64', status: 'BLOCKED', mfa: 'Failed MFA Challenge' },
    { id: 5, user: 'Elena Rostova (EMPLOYEE)', timestamp: '2026-07-07 16:20:00', ip: '192.168.1.210', location: 'San Francisco, CA (US)', device: 'EWMP iOS App v4.2', status: 'SUCCESS', mfa: 'Biometric TouchID' }
  ]);

  const [recommendations, setRecommendations] = useState([
    { id: 'rec-1', title: 'Enforce Hardware Security Keys for Super Administrators', description: 'Mandate FIDO2/WebAuthn hardware tokens (e.g., YubiKey) for all accounts possessing SUPER_ADMIN privileges to prevent phishing.', status: 'compliant', actionLabel: 'Inspect FIDO2 Policy', done: true },
    { id: 'rec-2', title: 'Reduce Session Inactivity Timeout to 15 Minutes', description: 'Tighten idle session termination thresholds for financial ledgers and payroll data access.', status: 'warning', actionLabel: 'Apply 15m Rule', done: false },
    { id: 'rec-3', title: 'Enable Biometric Geofence Anomaly Detection', description: 'Automatically flag attendance check-ins originating more than 500 meters outside registered subsidiary offices.', status: 'compliant', actionLabel: 'View Geofence Logs', done: true }
  ]);

  const handlePolicyChange = (field, val) => {
    setPolicies(prev => ({ ...prev, [field]: val }));
  };

  const handleApplyRec = (id) => {
    setRecommendations(recommendations.map(r => r.id === id ? { ...r, status: 'compliant', done: true } : r));
    alert('Security policy recommendation successfully enforced across all active organization pods.');
  };

  return (
    <div className="space-y-6">
      {/* Security Health Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Shield size={14} className="text-emerald-400" />
            Security Posture: Enterprise Hardened (A+)
          </div>
          <h2 className="text-xl font-bold tracking-tight">Zero-Trust Identity & Cryptographic Governance</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            EWMP enforces AES-256 encryption at rest, TLS 1.3 in transit, automated TOTP MFA challenges, and immutable audit logging. Modify organization-wide security thresholds below.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={() => alert('Exporting Immutable Security Audit Ledger (CSV)...')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10"
          >
            <Download size={14} /> Export Audit Ledger
          </button>
          <button 
            onClick={() => alert('Running penetration scan simulation. Zero vulnerabilities detected.')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} /> Run Security Audit
          </button>
        </div>
      </div>

      {/* Recommendations Scorecard */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          Active Security Recommendations & Compliance Scorecard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <SecurityCard
              key={rec.id}
              title={rec.title}
              description={rec.description}
              status={rec.status}
              actionLabel={rec.done ? 'Policy Enforced' : rec.actionLabel}
              onAction={() => !rec.done && handleApplyRec(rec.id)}
            />
          ))}
        </div>
      </div>

      {/* Grid: Password Policy & Session Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Policy */}
        <SettingsCard 
          title="Global Password Complexity Policies" 
          subtitle="Enforced for all employee accounts during registration and reset workflows"
          icon={Lock}
          badge={{ status: 'compliant', label: 'NIST SP 800-63B COMPLIANT' }}
        >
          <div className="space-y-3">
            <PreferenceCard 
              title="Minimum Passphrase Length" 
              description="Minimum character length enforced for all user passwords."
              type="select"
              value={policies.minPasswordLength}
              onSelectChange={(val) => handlePolicyChange('minPasswordLength', val)}
              options={[
                { value: '10', label: '10 Characters' },
                { value: '12', label: '12 Characters (Recommended)' },
                { value: '14', label: '14 Characters (High Security)' },
                { value: '16', label: '16 Characters (Gov Standard)' }
              ]}
            />
            <PreferenceCard 
              title="Require Special Characters & Symbols" 
              description="Mandate at least one symbol (@, #, $, %, ^, &, *, !, etc.)."
              checked={policies.requireSpecialChar}
              onChange={(val) => handlePolicyChange('requireSpecialChar', val)}
            />
            <PreferenceCard 
              title="Require Numeric Characters" 
              description="Mandate at least one numerical digit (0-9)."
              checked={policies.requireNumeric}
              onChange={(val) => handlePolicyChange('requireNumeric', val)}
            />
            <PreferenceCard 
              title="Require Uppercase Characters" 
              description="Mandate at least one uppercase alphabetical character."
              checked={policies.requireUppercase}
              onChange={(val) => handlePolicyChange('requireUppercase', val)}
            />
            <PreferenceCard 
              title="Mandatory Password Expiration Cycle" 
              description="Force employees to renew passwords periodically."
              type="select"
              value={policies.passwordExpiryDays}
              onSelectChange={(val) => handlePolicyChange('passwordExpiryDays', val)}
              options={[
                { value: '30', label: 'Every 30 Days' },
                { value: '60', label: 'Every 60 Days' },
                { value: '90', label: 'Every 90 Days (Enterprise Standard)' },
                { value: '0', label: 'Never Expire (Rely on MFA)' }
              ]}
            />
          </div>
        </SettingsCard>

        {/* Session & MFA Policies */}
        <SettingsCard 
          title="Session Concurrency & MFA Policies" 
          subtitle="Configure multi-factor authentication requirements and session limits"
          icon={Key}
          badge={{ status: 'active', label: 'ENFORCED GLOBALLY' }}
        >
          <div className="space-y-3">
            <PreferenceCard 
              title="Enforce Global TOTP Multi-Factor Authentication" 
              description="Require authenticator verification for all organization members upon login."
              checked={policies.enforceGlobalMfa}
              onChange={(val) => handlePolicyChange('enforceGlobalMfa', val)}
            />
            <PreferenceCard 
              title="Maximum Concurrent Sessions Per User" 
              description="Limit the number of simultaneous active login tokens allowed per employee."
              type="select"
              value={policies.maxConcurrentSessions}
              onSelectChange={(val) => handlePolicyChange('maxConcurrentSessions', val)}
              options={[
                { value: '1', label: '1 Session Only (Terminate Oldest)' },
                { value: '3', label: '3 Simultaneous Devices (Default)' },
                { value: '5', label: '5 Simultaneous Devices' },
                { value: '10', label: '10 Simultaneous Devices' }
              ]}
            />
            <PreferenceCard 
              title="Biometric Geofencing Verification" 
              description="Require GPS location validation when checking in from mobile attendance endpoints."
              checked={policies.enforceGeofencing}
              onChange={(val) => handlePolicyChange('enforceGeofencing', val)}
            />
            <PreferenceCard 
              title="Alert on Unrecognized Device Login" 
              description="Send immediate automated email alerts when a user authenticates from a new IP/browser."
              checked={policies.notifyOnNewDevice}
              onChange={(val) => handlePolicyChange('notifyOnNewDevice', val)}
            />
          </div>
        </SettingsCard>
      </div>

      {/* Login History Table */}
      <SettingsCard 
        title="Enterprise Login History & Authentication Audit Registry" 
        subtitle="Real-time log of authentication attempts, IP geo-tracking, and MFA verification outcomes"
        icon={FileText}
        footerAction={
          <button 
            onClick={() => alert('Navigating to full audit log explorer...')}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
          >
            View Complete Audit Log Vault <ArrowUpRight size={14} />
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141414]">
                <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">User Identity</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">Timestamp (UTC)</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">IP Address & Geo Location</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">Client Endpoint / Device</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">MFA Challenge</th>
                <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loginHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-[#161616]/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">{row.user}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{row.timestamp}</td>
                  <td className="py-3 px-3">
                    <div className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">{row.ip}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin size={10} /> {row.location}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-2">
                    {row.device.includes('iOS') || row.device.includes('Mobile') ? <Smartphone size={14} /> : <Monitor size={14} />}
                    <span>{row.device}</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{row.mfa}</td>
                  <td className="py-3 px-3">
                    <StatusBadge 
                      status={row.status === 'SUCCESS' ? 'compliant' : 'error'} 
                      label={row.status} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </div>
  );
};
