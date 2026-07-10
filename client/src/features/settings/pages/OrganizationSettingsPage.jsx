import React, { useState } from 'react';
import { Building2, MapPin, Clock, Calendar, Upload, CheckCircle2, Save, Plus, Trash2, ExternalLink } from 'lucide-react';
import { SettingsCard, StatusBadge } from '../components/AdminComponents';

/**
 * OrganizationSettingsPage.jsx
 * Enterprise organization parameters, branding, working hours grid, and subsidiary location management.
 */

export const OrganizationSettingsPage = () => {
  const [orgData, setOrgData] = useState({
    name: 'EWMP Enterprise Global Corp.',
    legalName: 'Enterprise Workforce Management Platform Holdings LLC',
    taxId: 'US-94-2849104',
    industry: 'Enterprise Cloud & Autonomous AI SaaS',
    website: 'https://www.ewmp-enterprise.com',
    supportEmail: 'support@ewmp-enterprise.com',
    currency: 'USD ($) - United States Dollar',
    fiscalYearStart: 'January 1st',
    logoUrl: null
  });

  const [workingDays, setWorkingDays] = useState({
    monday: { active: true, start: '08:30', end: '17:30' },
    tuesday: { active: true, start: '08:30', end: '17:30' },
    wednesday: { active: true, start: '08:30', end: '17:30' },
    thursday: { active: true, start: '08:30', end: '17:30' },
    friday: { active: true, start: '08:30', end: '17:00' },
    saturday: { active: false, start: '09:00', end: '13:00' },
    sunday: { active: false, start: '00:00', end: '00:00' }
  });

  const [locations, setLocations] = useState([
    { id: 'loc-1', name: 'Global Executive HQ', address: '100 Market St, Floor 18, San Francisco, CA 94105', country: 'United States', timezone: 'PST (UTC-8)', headCount: 480, isPrimary: true },
    { id: 'loc-2', name: 'EMEA Engineering Hub', address: '40 Bank St, Canary Wharf, London E14 5NR', country: 'United Kingdom', timezone: 'GMT (UTC+0)', headCount: 320, isPrimary: false },
    { id: 'loc-3', name: 'APAC Operations Center', address: 'Marunouchi Trust Tower, Chiyoda-ku, Tokyo', country: 'Japan', timezone: 'JST (UTC+9)', headCount: 215, isPrimary: false }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOrgChange = (field, val) => {
    setOrgData(prev => ({ ...prev, [field]: val }));
  };

  const handleWorkingDayToggle = (day) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active }
    }));
  };

  const handleTimeChange = (day, type, val) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: val }
    }));
  };

  const handleAddLocation = () => {
    const name = prompt('Enter new subsidiary location name:');
    if (!name) return;
    const newLoc = {
      id: `loc-${Date.now()}`,
      name,
      address: '750 Lexington Ave, New York, NY 10022',
      country: 'United States',
      timezone: 'EST (UTC-5)',
      headCount: 0,
      isPrimary: false
    };
    setLocations([...locations, newLoc]);
  };

  const handleDeleteLocation = (id) => {
    if (locations.length <= 1) {
      alert('Error: You cannot remove the last remaining organization location.');
      return;
    }
    setLocations(locations.filter(l => l.id !== id));
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
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Organization profile parameters, working hours schedules, and subsidiary location ledgers have been committed to the database.</span>
        </div>
      )}

      {/* Section 1: Enterprise Branding & Business Identity */}
      <SettingsCard 
        title="Enterprise Branding & Legal Identity" 
        subtitle="Primary organization profile, taxpayer identification, and corporate logo assets"
        icon={Building2}
        badge={{ status: 'compliant', label: 'VERIFIED CORP' }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-24 h-24 rounded-lg bg-slate-100 dark:bg-[#1a1a1a] border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-2 text-center text-slate-500 dark:text-slate-400 cursor-pointer hover:border-blue-500 transition-colors shrink-0" onClick={() => alert('Logo Upload Placeholder: Select SVG or PNG banner logo.')}>
            <Upload size={20} className="mb-1 text-blue-500" />
            <span className="text-[10px] font-bold uppercase">Upload Logo</span>
          </div>
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Corporate Brand Mark & Navigation Header Logo</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recommended dimensions: 400x120px transparent PNG or vector SVG. This logo appears on executive report exports, paystub headers, and employee portal login interfaces.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Display Organization Name</label>
            <input 
              type="text" 
              value={orgData.name}
              onChange={(e) => handleOrgChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Registered Legal Entity Name</label>
            <input 
              type="text" 
              value={orgData.legalName}
              onChange={(e) => handleOrgChange('legalName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Taxpayer ID / EIN / VAT Registration Number</label>
            <input 
              type="text" 
              value={orgData.taxId}
              onChange={(e) => handleOrgChange('taxId', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry / Sector Classification</label>
            <input 
              type="text" 
              value={orgData.industry}
              onChange={(e) => handleOrgChange('industry', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Web Domain</label>
            <input 
              type="url" 
              value={orgData.website}
              onChange={(e) => handleOrgChange('website', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">HR & Help Desk Contact Email</label>
            <input 
              type="email" 
              value={orgData.supportEmail}
              onChange={(e) => handleOrgChange('supportEmail', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </SettingsCard>

      {/* Section 2: Subsidiary Locations & Geofence Registry */}
      <SettingsCard 
        title="Subsidiary Locations & Geofence Hub Registry" 
        subtitle="Manage physical offices, headcounts, and time zone alignments for biometric kiosk synchronization"
        icon={MapPin}
        footerAction={
          <button 
            type="button"
            onClick={handleAddLocation}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 font-semibold text-xs rounded-lg border border-blue-200 dark:border-blue-800 transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} /> Register Subsidiary Location
          </button>
        }
      >
        <div className="space-y-3">
          {locations.map((loc) => (
            <div key={loc.id} className="p-4 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-[#111111] rounded border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 mt-0.5">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{loc.name}</h4>
                    {loc.isPrimary && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 text-[10px] font-bold rounded uppercase">
                        Global HQ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{loc.address}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>Country: <strong className="text-slate-600 dark:text-slate-300">{loc.country}</strong></span>
                    <span>Timezone: <strong className="text-slate-600 dark:text-slate-300">{loc.timezone}</strong></span>
                    <span>Staff Assigned: <strong className="text-blue-600 dark:text-blue-400 font-bold">{loc.headCount} Employees</strong></span>
                  </div>
                </div>
              </div>
              {!loc.isPrimary && (
                <button
                  type="button"
                  onClick={() => handleDeleteLocation(loc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors self-end sm:self-center"
                  title="Remove Subsidiary Location"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Section 3: Standard Working Days & Attendance Schedule Grid */}
      <SettingsCard 
        title="Standard Working Days Grid & Holiday Calendar" 
        subtitle="Configure default operating schedules for attendance regularization and overtime SLA calculation"
        icon={Clock}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800 rounded-lg text-xs">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-medium">
              <Calendar size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Looking to manage annual holidays or regional public closures?</span>
            </div>
            <button 
              type="button"
              onClick={() => alert('Holiday Calendar Shortcut: Navigating to Enterprise Holiday Master Grid...')}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              Open Holiday Calendar <ExternalLink size={12} />
            </button>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141414]">
                  <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">Day of Week</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300 w-32">Operating Status</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">Shift Start (HH:MM)</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">Shift End (HH:MM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {Object.keys(workingDays).map((day) => {
                  const item = workingDays[day];
                  const label = day.charAt(0).toUpperCase() + day.slice(1);
                  return (
                    <tr key={day} className="hover:bg-slate-50/50 dark:hover:bg-[#161616]/50">
                      <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">{label}</td>
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={() => handleWorkingDayToggle(day)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            item.active
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {item.active ? 'Working Day' : 'Weekend / Off'}
                        </button>
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="time"
                          disabled={!item.active}
                          value={item.start}
                          onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                          className="px-2 py-1 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded font-mono text-xs text-slate-900 dark:text-white disabled:opacity-40"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="time"
                          disabled={!item.active}
                          value={item.end}
                          onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                          className="px-2 py-1 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded font-mono text-xs text-slate-900 dark:text-white disabled:opacity-40"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
              Committing Org Parameters...
            </>
          ) : (
            <>
              <Save size={14} />
              Save Organization Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
};
