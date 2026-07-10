import React, { useState } from 'react';
import { Building2, FolderTree, Award, MapPin, Clock, Calendar, Settings, Layers, ChevronRight, Sparkles } from 'lucide-react';

// Import all sub-pages
import { OrganizationOverviewPage } from './pages/OrganizationOverviewPage';
import { DepartmentManagementPage } from './pages/DepartmentManagementPage';
import { DesignationManagementPage } from './pages/DesignationManagementPage';
import { LocationManagementPage } from './pages/LocationManagementPage';
import { ShiftManagementPage } from './pages/ShiftManagementPage';
import { HolidayManagementPage } from './pages/HolidayManagementPage';
import { OrganizationSettingsPage } from './pages/OrganizationSettingsPage';

// Import Quick Actions and Shared Components
import { OrganizationQuickActions } from './components/OrganizationQuickActions';
import { Button, Badge } from '../../components/shared';

/**
 * OrganizationModule.jsx
 * Master Enterprise Organization Management Hub for EWMP.
 * Acts as the centralized administrative workspace for Organization Admins and Super Admins
 * to configure structural hierarchy, regional branches, work shifts, holidays, and AI governance rules.
 * Consumes standard shared components and Precision Enterprise design tokens.
 */

export const OrganizationModule = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);

  const navTabs = [
    { id: 'overview', label: 'Organization Overview', icon: Building2, count: null },
    { id: 'departments', label: 'Departments', icon: FolderTree, count: 7 },
    { id: 'designations', label: 'Job Designations', icon: Award, count: 7 },
    { id: 'locations', label: 'Office Locations', icon: MapPin, count: 5 },
    { id: 'shifts', label: 'Work Shifts', icon: Clock, count: 5 },
    { id: 'holidays', label: 'Holiday Calendars', icon: Calendar, count: 10 },
    { id: 'settings', label: 'Org Settings & AI', icon: Settings, badge: 'AI v2' },
  ];

  const handleQuickActionTrigger = (actionId) => {
    switch (actionId) {
      case 'create-department':
        setActiveTab('departments');
        break;
      case 'create-designation':
        setActiveTab('designations');
        break;
      case 'create-location':
        setActiveTab('locations');
        break;
      case 'create-shift':
        setActiveTab('shifts');
        break;
      case 'add-holiday':
        setActiveTab('holidays');
        break;
      case 'update-org':
        setActiveTab('settings');
        break;
      default:
        setActiveTab('overview');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in font-sans">
      {/* 1. Administrative Breadcrumb & Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0] dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#434655] dark:text-slate-400">
            <span>EWMP Enterprise Workspace</span>
            <ChevronRight size={12} />
            <span className="text-[#2563eb] dark:text-blue-400 font-bold">Structural Governance Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191b23] dark:text-white tracking-tight flex items-center gap-2.5">
              <Layers className="text-[#2563eb] dark:text-blue-400 shrink-0" size={30} />
              Organization Management &amp; Hierarchy
            </h1>
            <div className="hidden sm:inline-flex">
              <Badge variant="primary" size="md" dot>
                RBAC: Super Admin Workspace
              </Badge>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#434655] dark:text-slate-400 max-w-3xl leading-relaxed">
            Configure enterprise operating divisions, regional office locations, reporting hierarchy ladders, shift rosters, and Gemini autonomous governance parameters for thousands of employees.
          </p>
        </div>

        {/* Quick Trigger Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant={showQuickActions ? 'primary' : 'secondary'}
            size="md"
            onClick={() => setShowQuickActions(!showQuickActions)}
            leftIcon={<Sparkles size={15} className="text-amber-500" />}
          >
            {showQuickActions ? 'Hide Quick Actions' : 'Admin Quick Actions'}
          </Button>
        </div>
      </div>

      {/* 2. Optional Quick Actions Bar */}
      {showQuickActions && (
        <div className="animate-slide-down">
          <OrganizationQuickActions
            onTriggerAction={handleQuickActionTrigger}
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
            searchPlaceholder="Global structural entity search across all departments and locations..."
          />
        </div>
      )}

      {/* 3. Horizontal Navigation Tabs */}
      <div className="border-b border-[#e2e8f0] dark:border-slate-800 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-2 min-w-max pb-3">
          {navTabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                    : 'text-[#434655] dark:text-slate-400 hover:text-[#191b23] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161616]'
                }`}
              >
                <IconComp size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <Badge
                    variant={isActive ? 'neutral' : 'secondary'}
                    size="sm"
                    className={isActive ? 'bg-white/20 text-white border-transparent' : ''}
                  >
                    {tab.count}
                  </Badge>
                )}
                {tab.badge && (
                  <Badge variant="warning" size="sm">
                    {tab.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. Active Page Container */}
      <main className="pt-2 min-h-[580px]">
        {activeTab === 'overview' && (
          <OrganizationOverviewPage onNavigateTab={(tabId) => setActiveTab(tabId)} />
        )}
        {activeTab === 'departments' && <DepartmentManagementPage />}
        {activeTab === 'designations' && <DesignationManagementPage />}
        {activeTab === 'locations' && <LocationManagementPage />}
        {activeTab === 'shifts' && <ShiftManagementPage />}
        {activeTab === 'holidays' && <HolidayManagementPage />}
        {activeTab === 'settings' && <OrganizationSettingsPage />}
      </main>
    </div>
  );
};

export default OrganizationModule;

