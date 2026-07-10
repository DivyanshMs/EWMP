import React, { useState } from 'react';
import { Settings, Building2, Calendar, Clock, DollarSign, Bell, FileText, Sparkles, Save, RefreshCw, ShieldCheck, Sliders } from 'lucide-react';
import { Card, Input, Select, Switch, Checkbox, Button, Badge } from '../../../components/shared';

/**
 * OrganizationSettingsPage.jsx
 * Enterprise system parameters and governance rule configuration.
 * Covers General, Working Days, Attendance, Leave, Payroll, Notifications, Documents,
 * and the Flagship Autonomous AI Governance subsystem settings.
 * Consumes standard shared components.
 */

export const OrganizationSettingsPage = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [settings, setSettings] = useState({
    general: {
      name: 'Acme Enterprise Global Corp.',
      code: 'ACME-GLB-01',
      industry: 'Enterprise Cloud & Autonomous AI SaaS',
      timeZone: '(UTC-08:00) Pacific Time (US & Canada)',
      currency: 'USD ($) - United States Dollar',
      fiscalYearStart: 'January 1st',
    },
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
      saturdayHalfDay: false,
    },
    attendance: {
      geofencingRadius: '150 Meters',
      biometricKioskSync: true,
      defaultGracePeriod: '15 Minutes',
      autoRegularizationSla: '48 Hours',
      requirePhotoCheckIn: false,
    },
    leave: {
      ptoAccrualRate: '1.75 Days / Month (21 Days / Year)',
      maxCarryoverDays: '10 Days',
      unpaidDeductionRule: '1/30th of Monthly Gross per Absent Day',
      allowNegativeBalance: false,
    },
    payroll: {
      monthlyCutoffDate: '25th of Every Month',
      disbursementFormat: 'NACHA Standard Direct Deposit / ISO-20022',
      overtimeMultiplier: '1.5x Hourly Base Rate',
      autoTaxWithholding: true,
    },
    notifications: {
      emailDigest: true,
      slackIntegration: true,
      msTeamsIntegration: false,
      smsEscalations: true,
      criticalAlertThreshold: 'Immediate Broadcast',
    },
    documents: {
      retentionPolicy: '7 Years (SOX & ISO-27001 Compliant)',
      autoGenerateContracts: true,
      enableWatermarking: true,
    },
    ai: {
      enableGeminiEngine: true,
      confidenceThreshold: 85,
      autoApproveRegularizations: true,
      anomalyDetectionAlerts: true,
      naturalLanguageQuerying: true,
      llmModelName: 'Gemini 2.0 Flash Enterprise Core Node',
    },
  });

  const handleToggle = (category, field) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field],
      },
    }));
  };

  const handleChange = (category, field, val) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: val,
      },
    }));
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Enterprise Organization Governance & AI System parameters successfully committed to MongoDB Atlas.');
      if (onSave) onSave(settings);
    }, 800);
  };

  const tabs = [
    { id: 'general', label: 'General Identity', icon: Building2 },
    { id: 'workingDays', label: 'Working Days', icon: Calendar },
    { id: 'attendance', label: 'Attendance Rules', icon: Clock },
    { id: 'leave', label: 'Leave Rules', icon: FileText },
    { id: 'payroll', label: 'Payroll & Tax', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'documents', label: 'Document Policy', icon: FileText },
    { id: 'ai', label: 'AI Governance (Gemini)', icon: Sparkles, badge: 'AI v2' },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] p-6 rounded-xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Settings size={26} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#191b23] dark:text-white tracking-tight">
              Organization System Parameters &amp; Governance Rules
            </h3>
            <p className="text-xs sm:text-sm text-[#434655] dark:text-slate-400">
              Configure global attendance SLAs, compensation compliance, and autonomous AI engine thresholds
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          disabled={isSaving}
          onClick={handleSaveAll}
          leftIcon={isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          className="shrink-0"
        >
          {isSaving ? 'Committing Rules...' : 'Save All Configuration'}
        </Button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left: Settings Navigation Sidebar */}
        <div className="bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 rounded-xl p-3 shadow-sm space-y-1">
          {tabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-md'
                    : 'text-[#434655] dark:text-slate-300 hover:bg-[#f8fafc] dark:hover:bg-[#181818]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <Badge
                    variant={isActive ? 'neutral' : 'primary'}
                    size="sm"
                    className="font-mono font-bold"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Settings Form Area */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6 min-h-[500px]">
          
          {/* 1. GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#e2e8f0] dark:border-slate-800">
                <h4 className="text-lg font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                  <Building2 size={20} className="text-[#2563eb]" />
                  General Corporate Identity Parameters
                </h4>
                <p className="text-xs text-[#434655] dark:text-slate-400 mt-1">Configure legal business name, ISO codes, and currency defaults</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Legal Organization Name"
                  value={settings.general.name}
                  onChange={(e) => handleChange('general', 'name', e.target.value)}
                  className="font-bold"
                />
                <Input
                  label="Global Organization Code"
                  value={settings.general.code}
                  onChange={(e) => handleChange('general', 'code', e.target.value)}
                  className="font-mono font-bold text-[#2563eb] dark:text-blue-400"
                />
                <Input
                  label="Industry / Sector"
                  value={settings.general.industry}
                  onChange={(e) => handleChange('general', 'industry', e.target.value)}
                />
                <Input
                  label="Primary Time Zone"
                  value={settings.general.timeZone}
                  onChange={(e) => handleChange('general', 'timeZone', e.target.value)}
                  className="font-mono"
                />
                <Input
                  label="Base Currency"
                  value={settings.general.currency}
                  onChange={(e) => handleChange('general', 'currency', e.target.value)}
                  className="font-mono"
                />
                <Input
                  label="Fiscal Year Start Date"
                  value={settings.general.fiscalYearStart}
                  onChange={(e) => handleChange('general', 'fiscalYearStart', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 2. WORKING DAYS */}
          {activeTab === 'workingDays' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#e2e8f0] dark:border-slate-800">
                <h4 className="text-lg font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                  <Calendar size={20} className="text-[#2563eb]" />
                  Standard Operating Work Week &amp; Weekend Rules
                </h4>
                <p className="text-xs text-[#434655] dark:text-slate-400 mt-1">Select active corporate working days and weekend half-day exceptions</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-3">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const isChecked = settings.workingDays[day];
                  return (
                    <div
                      key={day}
                      onClick={() => handleToggle('workingDays', day)}
                      className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-blue-50/80 dark:bg-blue-950/30 border-[#2563eb] text-blue-700 dark:text-blue-300 font-bold'
                          : 'bg-[#f8fafc] dark:bg-[#161616] border-[#e2e8f0] dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="capitalize text-sm">{day}</span>
                      <Checkbox
                        checked={isChecked}
                        onChange={() => {}}
                        className="pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-bold text-[#191b23] dark:text-white">Enable Saturday Half-Day Exception</h5>
                  <p className="text-xs text-[#434655] dark:text-slate-400">Treats alternate Saturdays as 4-hour working half-days for operational departments</p>
                </div>
                <Switch
                  checked={settings.workingDays.saturdayHalfDay}
                  onChange={() => handleToggle('workingDays', 'saturdayHalfDay')}
                />
              </div>
            </div>
          )}

          {/* 3. ATTENDANCE RULES */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#e2e8f0] dark:border-slate-800">
                <h4 className="text-lg font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                  <Clock size={20} className="text-[#2563eb]" />
                  Attendance Geofencing &amp; Biometric Rules
                </h4>
                <p className="text-xs text-[#434655] dark:text-slate-400 mt-1">Set mobile geofence check-in radii and automated regularization SLAs</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Geofencing Radius Threshold"
                  value={settings.attendance.geofencingRadius}
                  onChange={(e) => handleChange('attendance', 'geofencingRadius', e.target.value)}
                  className="font-mono font-bold"
                />
                <Input
                  label="Default Late Grace Period"
                  value={settings.attendance.defaultGracePeriod}
                  onChange={(e) => handleChange('attendance', 'defaultGracePeriod', e.target.value)}
                  className="font-mono font-bold"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-[#191b23] dark:text-white">Hardware Biometric Kiosk Sync</h5>
                    <p className="text-xs text-[#434655] dark:text-slate-400">Synchronize finger/facial recognition terminals with MongoDB Atlas attendance nodes</p>
                  </div>
                  <Switch
                    checked={settings.attendance.biometricKioskSync}
                    onChange={() => handleToggle('attendance', 'biometricKioskSync')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. LEAVE RULES */}
          {activeTab === 'leave' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#e2e8f0] dark:border-slate-800">
                <h4 className="text-lg font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                  <FileText size={20} className="text-[#2563eb]" />
                  Leave Accrual &amp; Carryover Policies
                </h4>
                <p className="text-xs text-[#434655] dark:text-slate-400 mt-1">Configure automated monthly PTO accrual rates and fiscal year carryover limits</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Standard PTO Accrual Rate"
                  value={settings.leave.ptoAccrualRate}
                  onChange={(e) => handleChange('leave', 'ptoAccrualRate', e.target.value)}
                  className="font-mono font-bold text-emerald-600 dark:text-emerald-400"
                />
                <Input
                  label="Max Carryover to Next Year"
                  value={settings.leave.maxCarryoverDays}
                  onChange={(e) => handleChange('leave', 'maxCarryoverDays', e.target.value)}
                  className="font-mono font-bold"
                />
              </div>
            </div>
          )}

          {/* 5. PAYROLL SETTINGS */}
          {activeTab === 'payroll' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#e2e8f0] dark:border-slate-800">
                <h4 className="text-lg font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                  <DollarSign size={20} className="text-emerald-600" />
                  Payroll Disbursement &amp; Tax Withholding Mode
                </h4>
                <p className="text-xs text-[#434655] dark:text-slate-400 mt-1">Manage monthly cycle cut-off dates and NACHA direct deposit formatting</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Monthly Payroll Cut-off Date"
                  value={settings.payroll.monthlyCutoffDate}
                  onChange={(e) => handleChange('payroll', 'monthlyCutoffDate', e.target.value)}
                  className="font-mono font-bold"
                />
                <Input
                  label="Bank Disbursement Format"
                  value={settings.payroll.disbursementFormat}
                  onChange={(e) => handleChange('payroll', 'disbursementFormat', e.target.value)}
                  className="font-mono font-bold"
                />
              </div>
            </div>
          )}

          {/* 6. NOTIFICATIONS & 7. DOCUMENTS */}
          {(activeTab === 'notifications' || activeTab === 'documents') && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#e2e8f0] dark:border-slate-800">
                <h4 className="text-lg font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                  <Bell size={20} className="text-[#2563eb]" />
                  Enterprise Notification &amp; Document Retention Policies
                </h4>
                <p className="text-xs text-[#434655] dark:text-slate-400 mt-1">Configure automated email digests, Slack webhooks, and 7-year SOX compliance archives</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-[#191b23] dark:text-white">Automated Slack / MS Teams Webhook Broadcasts</h5>
                    <p className="text-xs text-[#434655] dark:text-slate-400">Post system announcements and critical payroll run summaries to corporate channels</p>
                  </div>
                  <Switch
                    checked={settings.notifications.slackIntegration}
                    onChange={() => handleToggle('notifications', 'slackIntegration')}
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-[#191b23] dark:text-white">7-Year Document Retention Archive (SOX &amp; ISO-27001)</h5>
                    <p className="text-xs text-[#434655] dark:text-slate-400">Automatically preserve audit logs and signed employment contracts in encrypted S3 buckets</p>
                  </div>
                  <Switch
                    checked={settings.documents.autoGenerateContracts}
                    onChange={() => handleToggle('documents', 'autoGenerateContracts')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 8. FLAGSHIP AI GOVERNANCE SETTINGS (GEMINI 2.0 FLASH) */}
          {activeTab === 'ai' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <Badge variant="primary" size="sm" className="bg-indigo-500/20 border-indigo-400/30 text-indigo-300 mb-1">
                      <Sparkles size={13} className="mr-1.5 animate-pulse inline" /> Flagship Autonomous Subsystem
                    </Badge>
                    <h4 className="text-xl font-extrabold text-white">Gemini 2.0 Flash Enterprise Engine</h4>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                      Configuring autonomous anomaly detection, natural language database synthesis, and automated attendance regularization confidence sliders.
                    </p>
                  </div>

                  <div className="hidden sm:block p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                    <ShieldCheck size={32} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* AI Governance Toggles */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-[#191b23] dark:text-white">Enable Autonomous Regularization Approvals</h5>
                    <p className="text-xs text-[#434655] dark:text-slate-400">Allow Gemini 2.0 Flash to automatically approve attendance regularizations meeting SLA thresholds</p>
                  </div>
                  <Switch
                    checked={settings.ai.autoApproveRegularizations}
                    onChange={() => handleToggle('ai', 'autoApproveRegularizations')}
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-[#191b23] dark:text-white">Predictive Risk &amp; Anomaly Alerts</h5>
                    <p className="text-xs text-[#434655] dark:text-slate-400">Scan payroll burn rates and holiday PTO overlap to forecast operational bottlenecks</p>
                  </div>
                  <Switch
                    checked={settings.ai.anomalyDetectionAlerts}
                    onChange={() => handleToggle('ai', 'anomalyDetectionAlerts')}
                  />
                </div>

                {/* Confidence Threshold Slider */}
                <div className="p-5 rounded-xl bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                        <Sliders size={16} className="text-indigo-600 dark:text-indigo-400" />
                        AI Decision Confidence Threshold
                      </h5>
                      <p className="text-xs text-[#434655] dark:text-slate-400">Minimum confidence score required for autonomous administrative execution</p>
                    </div>
                    <Badge variant="primary" size="md" className="font-mono text-base bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                      {settings.ai.confidenceThreshold}%
                    </Badge>
                  </div>

                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={settings.ai.confidenceThreshold}
                    onChange={(e) => handleChange('ai', 'confidenceThreshold', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>50% (Permissive / Suggestion Only)</span>
                    <span>85% (Recommended Enterprise Default)</span>
                    <span>99% (Strict SLA Verification)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrganizationSettingsPage;
