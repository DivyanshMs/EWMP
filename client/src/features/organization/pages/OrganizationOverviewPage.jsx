import React from 'react';
import { Building2, Globe, Clock, DollarSign, Phone, Mail, MapPin, Users, FolderTree, Calendar, Activity, ShieldCheck, Briefcase } from 'lucide-react';
import { Card, StatCard, Button, Badge } from '../../../components/shared';

/**
 * OrganizationOverviewPage.jsx
 * Comprehensive administrative overview displaying organization identity, global parameters,
 * statistical counters, and recent structural audit logs. Consumes standard shared components.
 */

export const OrganizationOverviewPage = ({ onNavigateTab, orgData }) => {
  const defaultOrg = {
    name: 'Acme Enterprise Global Corp.',
    code: 'ACME-GLB-01',
    industry: 'Enterprise Cloud & Autonomous AI SaaS',
    type: 'Publicly Traded Corporation (NASDAQ: ACME)',
    timeZone: '(UTC-08:00) Pacific Time (US & Canada)',
    currency: 'USD ($) - United States Dollar',
    businessHours: '08:00 AM - 06:00 PM (Monday - Friday)',
    primaryContact: {
      name: 'David Vance',
      title: 'Global Chief Operating Officer',
      email: 'dvance@acme-enterprise.com',
      phone: '+1 (415) 890-2311',
      address: '1000 Innovation Parkway, Suite 500, Silicon Valley, CA 94043',
    },
    status: 'Active & Compliance Verified',
    stats: {
      employees: '2,845',
      departments: '14',
      locations: '8',
      shifts: '6',
      holidays: '12',
      designations: '42',
    },
  };

  const data = orgData || defaultOrg;

  const recentActivities = [
    {
      id: 1,
      action: 'Department Reorganization',
      details: 'Merged "Cloud Infrastructure" and "DevOps Automation" into "Platform Engineering".',
      user: 'Super Admin (System)',
      time: '2 hours ago',
      icon: FolderTree,
      color: 'text-[#2563eb] bg-blue-50 dark:bg-blue-950/40',
    },
    {
      id: 2,
      action: 'Shift Roster Created',
      details: 'Added new "APAC Evening Support Roster (14:00 - 23:00 UTC)" with 45 mins break.',
      user: 'Sarah Jenkins (HR Director)',
      time: '5 hours ago',
      icon: Clock,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      id: 3,
      action: 'Holiday Schedule Updated',
      details: 'Added "Labor Day (US)" and "Mid-Autumn Festival (APAC)" to 2026 Calendar.',
      user: 'David Vance (COO)',
      time: '1 day ago',
      icon: Calendar,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
    },
    {
      id: 4,
      action: 'New Office Location Registered',
      details: 'Registered "London Innovation Hub (UK-LON-02)" with 250 seat capacity.',
      user: 'Super Admin (System)',
      time: '2 days ago',
      icon: MapPin,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    },
  ];

  const quickStats = [
    { label: 'Total Workforce', value: data.stats.employees, sub: 'Across 8 offices', icon: Users, tab: 'overview' },
    { label: 'Departments', value: data.stats.departments, sub: '100% active units', icon: FolderTree, tab: 'departments' },
    { label: 'Job Designations', value: data.stats.designations, sub: '6 salary grades', icon: Briefcase, tab: 'designations' },
    { label: 'Office Locations', value: data.stats.locations, sub: '3 global regions', icon: MapPin, tab: 'locations' },
    { label: 'Shift Rosters', value: data.stats.shifts, sub: '2 flexible schedules', icon: Clock, tab: 'shifts' },
    { label: 'Holiday Calendars', value: data.stats.holidays, sub: '2026 observed days', icon: Calendar, tab: 'holidays' },
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* 1. Organization Identity Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-[#2563eb] flex items-center justify-center font-extrabold text-2xl shadow-md border border-white/20 shrink-0">
              {data.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="sm" className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
                  {data.code}
                </Badge>
                <Badge variant="success" size="sm" dot className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                  {data.status}
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{data.name}</h2>
              <p className="text-xs sm:text-sm text-slate-300">{data.industry} • {data.type}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:self-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigateTab && onNavigateTab('settings')}
              leftIcon={<ShieldCheck size={15} className="text-indigo-300" />}
              className="bg-white/10 hover:bg-white/20 border-white/15 text-white backdrop-blur-md"
            >
              Configure Org Settings
            </Button>
          </div>
        </div>

        {/* Global Parameters Footer inside header card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-indigo-400 shrink-0" />
            <span className="truncate">Zone: {data.timeZone}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={15} className="text-indigo-400 shrink-0" />
            <span className="truncate">Base: {data.currency}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-indigo-400 shrink-0" />
            <span className="truncate">Hours: {data.businessHours}</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Statistics Cards (Clickable to jump to modules) */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#434655] dark:text-slate-400">
          Organization Structural Telemetry
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {quickStats.map((st) => {
            const IconComp = st.icon;
            return (
              <StatCard
                key={st.label}
                title={st.label}
                value={st.value}
                subtitle={st.sub}
                icon={<IconComp size={18} />}
                onClick={() => st.tab !== 'overview' && onNavigateTab && onNavigateTab(st.tab)}
                className={st.tab !== 'overview' ? 'cursor-pointer hover:border-[#2563eb]/50 transition-all duration-200' : ''}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Primary Contact & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Primary Contact & Corporate Headquarters */}
        <Card className="space-y-0">
          <Card.Header
            title={
              <span className="flex items-center gap-2">
                <Building2 size={18} className="text-[#2563eb] dark:text-blue-400" />
                Primary Executive Contact
              </span>
            }
            action={<Badge variant="primary" size="sm">Authorized Sponsor</Badge>}
          />
          <Card.Body className="space-y-5">
            <div className="p-4 bg-[#f8fafc] dark:bg-[#161616] rounded-md border border-[#e2e8f0] dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white font-bold flex items-center justify-center text-lg shadow-xs">
                  DV
                </div>
                <div>
                  <h4 className="font-bold text-[#191b23] dark:text-white">{data.primaryContact.name}</h4>
                  <p className="text-xs text-[#434655] dark:text-slate-400">{data.primaryContact.title}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#e2e8f0] dark:border-slate-800 text-xs text-[#434655] dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">{data.primaryContact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <span>{data.primaryContact.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#434655] dark:text-slate-400 font-bold">Registered Headquarters</span>
              <div className="p-3.5 bg-[#f8fafc] dark:bg-[#161616] rounded-md border border-[#e2e8f0] dark:border-slate-800 flex items-start gap-2.5 text-xs text-[#434655] dark:text-slate-300">
                <MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{data.primaryContact.address}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Right: Recent Administrative Activity Feed */}
        <Card className="lg:col-span-2 space-y-0">
          <Card.Header
            title={
              <span className="flex items-center gap-2">
                <Activity size={18} className="text-indigo-600 dark:text-indigo-400" />
                Recent Organizational Audit Log
              </span>
            }
            subtitle="Real-time structural hierarchy and configuration modifications"
            action={<Badge variant="neutral" size="sm">Live Immutable Feed</Badge>}
          />
          <Card.Body className="space-y-4">
            {recentActivities.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-md bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800 flex items-start gap-3.5 transition-colors hover:bg-slate-100 dark:hover:bg-[#1c1c1c]"
                >
                  <div className={`p-2.5 rounded-md shrink-0 ${item.color}`}>
                    <IconComp size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-[#191b23] dark:text-white truncate">{item.action}</h4>
                      <span className="text-[11px] font-mono text-[#434655] dark:text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-[#434655] dark:text-slate-300 mt-1 leading-relaxed">{item.details}</p>
                    <span className="text-[10px] font-mono text-[#434655] dark:text-slate-400 mt-1.5 inline-block bg-white dark:bg-[#111] px-2 py-0.5 rounded border border-[#e2e8f0] dark:border-slate-800">
                      Modified by: {item.user}
                    </span>
                  </div>
                </div>
              );
            })}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationOverviewPage;

