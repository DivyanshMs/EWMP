import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Users, Clock, CalendarDays, 
  CircleDollarSign, TrendingUp, UserPlus, FolderKanban, 
  CheckSquare, Laptop, FileText, Bell, HelpCircle, 
  BarChart3, Sparkles, Settings, LogOut, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Sidebar.jsx
 * Phase C3.1 — Stitch UI Implementation (Sidebar Navigation)
 * 
 * Pixel-perfect match to Stitch Enterprise Design System.
 * Consumes standardized layout tokens and preserves full 16-module RBAC navigation.
 */
const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Full module navigation based on API_DOCUMENTATION & RBAC matrix
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE', 'FINANCE', 'IT_ADMIN', 'AUDITOR'] },
    { name: 'Organization', path: '/organization', icon: <Building2 size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN'] },
    { name: 'Employees', path: '/employees', icon: <Users size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'FINANCE', 'AUDITOR'] },
    { name: 'Attendance', path: '/attendance', icon: <Clock size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE', 'FINANCE', 'AUDITOR'] },
    { name: 'Leave', path: '/leave', icon: <CalendarDays size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Payroll', path: '/payroll', icon: <CircleDollarSign size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'FINANCE', 'AUDITOR', 'EMPLOYEE'] },
    { name: 'Performance', path: '/performance', icon: <TrendingUp size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Recruitment', path: '/recruitment', icon: <UserPlus size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'TEAM_LEAD', 'EMPLOYEE'] },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'TEAM_LEAD', 'EMPLOYEE'] },
    { name: 'Assets', path: '/assets', icon: <Laptop size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'IT_ADMIN', 'EMPLOYEE'] },
    { name: 'Documents', path: '/documents', icon: <FileText size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'IT_ADMIN', 'EMPLOYEE'] },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE', 'FINANCE', 'IT_ADMIN', 'AUDITOR'] },
    { name: 'Help Desk', path: '/helpdesk', icon: <HelpCircle size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE', 'FINANCE', 'IT_ADMIN', 'AUDITOR'] },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={18} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'FINANCE', 'MANAGER', 'AUDITOR'] },
    { name: 'AI Assistant', path: '/ai-assistant', icon: <Sparkles size={18} className="text-[#2563eb] dark:text-blue-400 animate-pulse" />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE', 'FINANCE', 'IT_ADMIN', 'AUDITOR'] },
  ];

  const allowedNav = navItems.filter(item => item.roles.includes(user?.role || 'EMPLOYEE'));

  const sidebarContent = (
    <>
      {/* Top Branding Section */}
      <div className="h-16 flex items-center px-4 border-b border-[#e2e8f0] dark:border-slate-800 justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 px-2 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              E
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#191b23] dark:text-white block leading-none">
                EWMP<span className="text-[#2563eb]">.</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mt-0.5">
                {user?.role || 'Enterprise'}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 bg-[#2563eb] rounded-lg flex items-center justify-center mx-auto text-white font-bold text-sm shadow-sm">
            E
          </div>
        )}

        {/* Collapse Toggle */}
        <button 
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 bg-white dark:bg-[#191b23] border border-[#e2e8f0] dark:border-slate-700 rounded-full p-1 text-slate-500 hover:text-[#191b23] dark:text-slate-400 dark:hover:text-white shadow-md z-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {!isCollapsed && (
          <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Main Navigation
          </p>
        )}
        
        {allowedNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? 'justify-center px-0' : 'px-3.5'
              } py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 group relative ${
                isActive
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-400 border-l-2 border-[#2563eb] dark:border-blue-400 shadow-sm'
                  : 'text-[#434655] dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-[#191b23] dark:hover:text-white border-l-2 border-transparent'
              }`
            }
          >
            <div className={`${isCollapsed ? 'mx-auto' : 'mr-3'} shrink-0`}>
              {item.icon}
            </div>
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}

        {/* Bottom Section Divider */}
        <div className="mt-6 border-t border-[#e2e8f0]/80 dark:border-slate-800/80 pt-4 space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              System
            </p>
          )}
          <NavLink
            to="/settings"
            title={isCollapsed ? 'Settings' : undefined}
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? 'justify-center px-0' : 'px-3.5'
              } py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-[#191b23] dark:text-white'
                  : 'text-[#434655] dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-[#191b23] dark:hover:text-white'
              }`
            }
          >
            <div className={`${isCollapsed ? 'mx-auto' : 'mr-3'} shrink-0`}>
              <Settings size={18} />
            </div>
            {!isCollapsed && <span>Settings</span>}
          </NavLink>

          <button
            type="button"
            onClick={() => logout()}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-0' : 'px-3.5'
            } py-2.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-150`}
          >
            <div className={`${isCollapsed ? 'mx-auto' : 'mr-3'} shrink-0`}>
              <LogOut size={18} className="text-rose-500" />
            </div>
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </nav>

      {/* Footer User Info Panel (When Expanded) */}
      {!isCollapsed && (
        <div className="p-3 m-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-[#e2e8f0] dark:border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center text-[#2563eb] font-bold text-xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#191b23] dark:text-white truncate">
              {user?.name || 'Enterprise User'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user?.email || 'admin@ewmp.enterprise'}
            </p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        aria-label="Enterprise Main Sidebar"
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-white dark:bg-[#111111] border-r border-[#e2e8f0] dark:border-slate-800 flex-col hidden md:flex transition-all duration-300 relative z-40 select-none shrink-0`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex flex-col w-64 max-w-[calc(100vw-3rem)] h-full bg-white dark:bg-[#111111] shadow-2xl">
            {/* Mobile Close Button */}
            <button
              type="button"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
            {/* Re-render content with isCollapsed strictly false on mobile */}
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
