import React, { useEffect, useState } from 'react';
import { Menu, Building2, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SearchInput, ProfileMenu, NotificationMenu } from '../../components/shared';

/**
 * Topbar.jsx
 * Phase C3.1 — Stitch UI Implementation (Top Navigation & User Menu & Notification Dropdown & Search Bar)
 * 
 * Standardized to Stitch Enterprise Design System.
 * Consumes exclusively shared UI components (SearchInput, ProfileMenu, NotificationMenu).
 */
const Topbar = ({ onMobileMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;
    return window.document.documentElement.classList.contains('dark');
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const root = window.document.documentElement;
    const storedTheme = window.localStorage.getItem('theme');

    if (storedTheme === 'dark') {
      root.classList.add('dark');
      setIsDarkMode(true);
      return;
    }

    if (storedTheme === 'light') {
      root.classList.remove('dark');
      setIsDarkMode(false);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== 'theme') return;

      const root = window.document.documentElement;
      const nextIsDark = event.newValue === 'dark';
      root.classList.toggle('dark', nextIsDark);
      setIsDarkMode(nextIsDark);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.toggle('dark');
    const newDarkState = root.classList.contains('dark');
    setIsDarkMode(newDarkState);
    localStorage.setItem('theme', newDarkState ? 'dark' : 'light');
    document.body.style.colorScheme = newDarkState ? 'dark' : 'light';
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="h-16 bg-white dark:bg-[#111111] border-b border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-30 shrink-0 select-none shadow-sm dark:shadow-none">
      
      {/* Left Side: Mobile Menu & Global Search Bar */}
      <div className="flex items-center flex-1 gap-4">
        <button 
          type="button"
          onClick={onMobileMenuClick}
          aria-label="Open mobile navigation"
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-[#191b23] dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        {/* Mobile Title */}
        <span className="font-bold text-lg text-[#191b23] dark:text-white md:hidden">
          EWMP<span className="text-[#2563eb]">.</span>
        </span>

        {/* Global Search Bar (Consuming Shared SearchInput) */}
        <div className="max-w-md w-full hidden sm:block">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={() => setSearchQuery('')}
            placeholder="Search employees, reports, or ask AI..."
            className="w-full"
          />
        </div>
      </div>

      {/* Right Side: Enterprise Tools, Theme Toggle, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Organization Switcher Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/80 border border-[#e2e8f0] dark:border-slate-800 rounded-lg text-xs font-semibold text-[#434655] dark:text-slate-300">
          <Building2 size={15} className="text-[#2563eb] dark:text-blue-400" />
          <span className="max-w-[140px] truncate">{user?.organization?.name || 'Acme Enterprise Global'}</span>
        </div>

        <div className="h-6 w-px bg-[#e2e8f0] dark:bg-slate-800 hidden sm:block mx-1"></div>

        {/* Theme Toggle Button */}
        <button 
          type="button"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={isDarkMode}
          className="p-2 text-slate-500 hover:text-[#191b23] dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Notification Menu (Consuming Shared NotificationMenu) */}
        <NotificationMenu
          unreadCount={2}
          onNavigate={(path) => navigate(path)}
        />

        {/* Profile Menu (Consuming Shared ProfileMenu) */}
        <div className="ml-1">
          <ProfileMenu
            user={user || { name: 'Divyansh Mishra', email: 'admin@ewmp.enterprise', role: 'Enterprise Administrator' }}
            onLogout={logout}
            onNavigate={(path) => navigate(path)}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
