import React, { useState, useEffect } from 'react';
import { Settings, User, Shield, Key, Building2, Bell, Sliders, Sparkles, FileText, Search, LayoutDashboard, ChevronRight, Lock, Menu, X, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Import all 10 module pages
import { AdministrationDashboardPage } from './pages/AdministrationDashboardPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { OrganizationSettingsPage } from './pages/OrganizationSettingsPage';
import { RolePermissionCenterPage } from './pages/RolePermissionCenterPage';
import { SecurityCenterPage } from './pages/SecurityCenterPage';
import { NotificationPreferencesPage } from './pages/NotificationPreferencesPage';
import { SystemPreferencesPage } from './pages/SystemPreferencesPage';
import { AISettingsPage } from './pages/AISettingsPage';
import { AuditActivityPage } from './pages/AuditActivityPage';

// Import shared badge
import { StatusBadge } from './components/AdminComponents';

/**
 * SettingsModule.jsx
 * Master Orchestrator for EWMP Administration, Identity & System Governance.
 */

export const SettingsModule = ({ initialTab = 'dashboard', user = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map subpaths from URL if applicable
  const getTabFromPath = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/change-password')) return 'account';
    if (path.includes('/account')) return 'account';
    if (path.includes('/org') || path.includes('/organization')) return 'org';
    if (path.includes('/roles') || path.includes('/permission')) return 'roles';
    if (path.includes('/security')) return 'security';
    if (path.includes('/notification')) return 'notifications';
    if (path.includes('/system') || path.includes('/preference')) return 'system';
    if (path.includes('/ai')) return 'ai';
    if (path.includes('/audit') || path.includes('/activity')) return 'audit';
    if (path === '/admin' || path === '/settings') return 'dashboard';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tabFromUrl = getTabFromPath();
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [location.pathname]);

  const navItems = [
    { id: 'dashboard', label: 'Admin Command Center', icon: LayoutDashboard, category: 'GOVERNANCE' },
    { id: 'profile', label: 'My Personal Profile', icon: User, category: 'PERSONAL' },
    { id: 'account', label: 'Account & Credentials', icon: Lock, category: 'PERSONAL' },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell, category: 'PERSONAL' },
    { id: 'system', label: 'System Preferences', icon: Sliders, category: 'PERSONAL' },
    { id: 'org', label: 'Organization & Locations', icon: Building2, category: 'ENTERPRISE ADMIN' },
    { id: 'roles', label: 'RBAC Roles & Access', icon: Key, category: 'ENTERPRISE ADMIN' },
    { id: 'security', label: 'Security & Password Rules', icon: Shield, category: 'ENTERPRISE ADMIN' },
    { id: 'ai', label: 'AI Subsystem Governance', icon: Sparkles, category: 'ENTERPRISE ADMIN' },
    { id: 'audit', label: 'Audit Log Registry', icon: FileText, category: 'ENTERPRISE ADMIN' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    // Always update the URL to the canonical /settings/* path on tab change.
    // This ensures that /profile and /change-password shortcut routes also update
    // their URL to the settings hub path after the first navigation.
    const targetPath = tabId === 'dashboard' ? '/settings' : `/settings/${tabId}`;
    navigate(targetPath, { replace: true });
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdministrationDashboardPage onNavigateTab={handleTabChange} searchQuery={searchQuery} />;
      case 'profile':
        return <MyProfilePage user={user} />;
      case 'account':
        return <AccountSettingsPage />;
      case 'org':
        return <OrganizationSettingsPage />;
      case 'roles':
        return <RolePermissionCenterPage />;
      case 'security':
        return <SecurityCenterPage />;
      case 'notifications':
        return <NotificationPreferencesPage />;
      case 'system':
        return <SystemPreferencesPage />;
      case 'ai':
        return <AISettingsPage />;
      case 'audit':
        return <AuditActivityPage />;
      default:
        return <AdministrationDashboardPage onNavigateTab={handleTabChange} searchQuery={searchQuery} />;
    }
  };

  const activeNav = navItems.find(i => i.id === activeTab) || navItems[0];
  const ActiveIcon = activeNav.icon;

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navigation Header for Settings Hub */}
      <header className="bg-white dark:bg-[#111111] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
              <Settings size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">EWMP Administration Hub</h1>
                <StatusBadge status="admin" label="ENTERPRISE GOVERNANCE" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Centralized control plane for identity, security guardrails, and platform customization
              </p>
            </div>
          </div>
        </div>

        {/* Global Module Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
          <div className="relative w-full">
            <input 
              type="text"
              placeholder="Search settings, roles, policies, audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs">
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar & Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#111111] border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          pt-16 lg:pt-4
        `}>
          <div className="space-y-6 overflow-y-auto pr-1">
            {/* Group 1: Personal Settings */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Personal Preferences</div>
              {navItems.filter(i => i.category === 'PERSONAL').map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={active ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight size={14} />}
                  </button>
                );
              })}
            </div>

            {/* Group 2: Enterprise Admin & Governance */}
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-3 mb-2 flex items-center justify-between">
                <span>Enterprise Administration</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              </div>
              {navItems.filter(i => i.category === 'GOVERNANCE' || i.category === 'ENTERPRISE ADMIN').map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={active ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer Info */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 text-[11px] text-slate-400">
            <div className="flex items-center justify-between mb-1">
              <span>EWMP Version</span>
              <strong className="text-slate-600 dark:text-slate-300 font-mono">v4.2-PROD</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Security Guardrail</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1"><Shield size={10} /> Active</span>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile drawer */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 lg:hidden"
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* Breadcrumb / Active Header */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                <ActiveIcon size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>Settings & Administration</span>
                  <ChevronRight size={12} />
                  <span className="text-blue-600 dark:text-blue-400 uppercase">{activeNav.category}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{activeNav.label}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className="px-3.5 py-1.5 bg-white dark:bg-[#161616] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back to Dashboard
              </button>
            </div>
          </div>

          {/* Render Current Active Page View */}
          <div className="animate-fadeIn">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
};
