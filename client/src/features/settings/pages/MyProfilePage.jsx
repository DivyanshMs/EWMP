import React, { useState } from 'react';
import { User, Mail, Phone, Building2, MapPin, Calendar, Briefcase, Shield, CheckCircle2, Upload, Save } from 'lucide-react';
import { ProfileCard, SettingsCard, StatusBadge } from '../components/AdminComponents';

/**
 * MyProfilePage.jsx
 * Personal employee identity and contact parameter governance.
 */

export const MyProfilePage = ({ user, onSaveProfile }) => {
  const [formData, setFormData] = useState({
    firstName: user?.name || 'Alexander',
    lastName: user?.lastName || 'Thornton',
    email: user?.email || 'a.thornton@ewmp-enterprise.com',
    phone: user?.phone || '+1 (415) 890-4321',
    alternatePhone: '+1 (415) 555-0199',
    designation: user?.designation || 'Chief Information Security Officer (CISO)',
    department: user?.department || 'Global Executive HQ',
    employeeId: 'EMP-001042',
    dateOfJoining: '2021-03-15',
    reportingManager: 'Victoria Sterling (CEO)',
    workLocation: 'San Francisco HQ (Floor 18)',
    emergencyContactName: 'Dr. Evelyn Thornton',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+1 (415) 555-0122',
    bio: 'Overseeing global cybersecurity infrastructure, identity governance, zero-trust network architectures, and cryptographic compliance across 14 enterprise subsidiaries.'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      if (onSaveProfile) onSaveProfile(formData);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 800);
  };

  const handleAvatarUpload = () => {
    alert('Avatar Upload Simulation: Please select a JPG or PNG image under 5MB.');
  };

  return (
    <div className="space-y-6">
      {/* Top Profile Card */}
      <ProfileCard 
        user={{
          name: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          designation: formData.designation,
          role: 'SUPER_ADMIN',
          completion: 92
        }}
        onEditProfile={() => document.getElementById('personal-info-form')?.scrollIntoView({ behavior: 'smooth' })}
        onUploadAvatar={handleAvatarUpload}
      />

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Your profile information and emergency contact parameters have been successfully synchronized to the master personnel registry.</span>
        </div>
      )}

      <form id="personal-info-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal & Contact Information */}
        <SettingsCard 
          title="Personal & Contact Identification" 
          subtitle="Primary legal identity and verified communication channels"
          icon={User}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name (Legal)</label>
              <input 
                type="text" 
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name (Legal)</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed pl-9"
                />
                <Mail size={14} className="absolute left-3 top-2.5 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Enterprise domain addresses cannot be modified directly. Contact IT Admin.</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Mobile Number (MFA Verified)</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 pl-9"
                  required
                />
                <Phone size={14} className="absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Biography / Specialty Scope</label>
              <textarea 
                rows="3"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
              ></textarea>
            </div>
          </div>
        </SettingsCard>

        {/* Section 2: Employment & Organizational Assignment */}
        <SettingsCard 
          title="Employment & Organizational Assignment" 
          subtitle="Official HR placement parameters (Read-only for employee self-service)"
          icon={Briefcase}
          badge={{ status: 'compliant', label: 'VERIFIED HR RECORD' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Employee ID</label>
              <div className="p-2.5 bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {formData.employeeId}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Department / Division</label>
              <div className="p-2.5 bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 size={14} className="text-blue-500" /> {formData.department}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Official Designation</label>
              <div className="p-2.5 bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300">
                {formData.designation}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Reporting Manager</label>
              <div className="p-2.5 bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User size={14} className="text-purple-500" /> {formData.reportingManager}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Assigned Work Location</label>
              <div className="p-2.5 bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin size={14} className="text-rose-500" /> {formData.workLocation}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Date of Joining</label>
              <div className="p-2.5 bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-500" /> {formData.dateOfJoining}
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Section 3: Emergency Contact Registry */}
        <SettingsCard 
          title="Emergency Contact Registry" 
          subtitle="Designated individual for urgent health or security notifications"
          icon={Shield}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Name</label>
              <input 
                type="text" 
                value={formData.emergencyContactName}
                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Relationship</label>
              <input 
                type="text" 
                value={formData.emergencyContactRelation}
                onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Emergency Telephone</label>
              <input 
                type="tel" 
                value={formData.emergencyContactPhone}
                onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
          </div>
        </SettingsCard>

        {/* Footer Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setFormData({
              ...formData,
              firstName: user?.name || 'Alexander',
              lastName: user?.lastName || 'Thornton',
              phone: '+1 (415) 890-4321'
            })}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Reset Changes
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving Profile...
              </>
            ) : (
              <>
                <Save size={14} />
                Save Profile Parameters
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
