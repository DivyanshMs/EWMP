import React, { useState } from 'react';
import { History, ArrowLeft, Search, Filter, UserPlus, FolderTree, Award, DollarSign, CalendarDays, Clock, TrendingUp, FileText, Download } from 'lucide-react';
import { EmployeeTimelineComponent } from '../components/EmployeeTimelineComponent';

/**
 * EmployeeTimelinePage.jsx
 * Page 6: Dedicated global lifecycle audit timeline page for EWMP.
 * Allows HR Managers and Auditors to inspect chronological events across:
 * Joined, Department Changes, Promotions, Salary Updates, Leave History,
 * Attendance Events, Performance Reviews, and Document Uploads.
 */

export const EmployeeTimelinePage = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', label: 'All Audit Events', icon: History },
    { id: 'joined', label: 'Onboarding / Joined', icon: UserPlus },
    { id: 'department', label: 'Department Changes', icon: FolderTree },
    { id: 'promotion', label: 'Promotions & Titles', icon: Award },
    { id: 'salary', label: 'Salary & Compensation', icon: DollarSign },
    { id: 'leave', label: 'Leave History', icon: CalendarDays },
    { id: 'attendance', label: 'Attendance Events', icon: Clock },
    { id: 'performance', label: 'Performance Reviews', icon: TrendingUp },
    { id: 'document', label: 'Documents Uploaded', icon: FileText },
  ];

  // Global enterprise audit timeline dataset
  const [globalEvents, setGlobalEvents] = useState([
    {
      type: 'promotion',
      title: 'Promoted David Vance to Principal Systems Architect',
      date: '2026-06-15',
      description: 'Elevated from Senior Cloud Architect following successful delivery of the multi-region Kubernetes cluster and AI governance node.',
      author: 'David Kim (VP Eng)',
      docRef: 'HR-PROM-2026-88',
      metadata: { employee: 'David Vance (EMP-1042)', grade: 'L6 Principal', salaryIncrease: '+18%' },
    },
    {
      type: 'document',
      title: 'Verified Form I-9 & Passport for Elena Rostova',
      date: '2026-04-12',
      description: 'Completed mandatory statutory work authorization verification for UK London Innovation Hub.',
      author: 'HR Compliance Officer',
      docRef: 'UK-ID-2026-09',
      metadata: { employee: 'Elena Rostova (EMP-1045)', status: 'Verified & Compliant' },
    },
    {
      type: 'joined',
      title: 'Onboarded Elena Rostova as Director of Global Ops',
      date: '2026-04-12',
      description: 'Provisioned enterprise credentials, assigned London morning roster, and initiated executive onboarding sequence.',
      author: 'HR Onboarding Portal',
      metadata: { employee: 'Elena Rostova (EMP-1045)', department: 'Global Operations' },
    },
    {
      type: 'salary',
      title: 'Annual Compensation Calibration for Sarah Jenkins',
      date: '2026-03-01',
      description: 'Executive compensation committee revision aligned with SaaS industry benchmark calibration.',
      author: 'Marcus Brody (COO)',
      docRef: 'COMP-REV-2026-04',
      metadata: { employee: 'Sarah Jenkins (EMP-1043)', previousBase: '$255,000', newBase: '$280,000' },
    },
    {
      type: 'performance',
      title: 'Completed H1 Enterprise Review for Alex Chen',
      date: '2026-02-15',
      description: 'Received rating of 4.9/5.0 for outstanding UX leadership on the EWMP Design System redesign.',
      author: 'David Kim (VP Eng)',
      metadata: { employee: 'Alex Chen (EMP-1046)', kpiCompletion: '98%', rating: 'Exceeds Expectations' },
    },
    {
      type: 'attendance',
      title: 'Autonomous Regularization Approved by Gemini 2.0 AI',
      date: '2026-02-10',
      description: 'AI Governance node verified biometric kiosk sync delay for Tokyo satellite branch and approved attendance log.',
      author: 'Gemini 2.0 Flash AI Node',
      docRef: 'AI-REG-88421',
      metadata: { employee: 'James Wilson (EMP-1049)', confidenceScore: '94.8%' },
    },
    {
      type: 'leave',
      title: 'Approved 10-Day Annual Vacation PTO for Marcus Brody',
      date: '2025-11-20',
      description: 'Annual scheduled leave approved by Board of Directors with automatic delegation of financial approval authority.',
      author: 'Board of Directors',
      metadata: { employee: 'Marcus Brody (EMP-1047)', leaveType: 'Annual PTO', duration: '10 Business Days' },
    },
    {
      type: 'department',
      title: 'Transferred David Vance to Platform Engineering Core Hub',
      date: '2023-06-01',
      description: 'Transferred from Cloud Infrastructure team to lead enterprise core platform architecture.',
      author: 'Sarah Jenkins (HR VP)',
      metadata: { employee: 'David Vance (EMP-1042)', previousDept: 'Cloud Infrastructure' },
    },
  ]);

  const filteredEvents = globalEvents.filter((ev) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.title.toLowerCase().includes(q);
      const matchDesc = ev.description.toLowerCase().includes(q);
      const matchEmp = ev.metadata?.employee?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchEmp) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* 1. Header & Return Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>EWMP HR Platform</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Global Lifecycle Audit Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <History className="text-blue-600 dark:text-blue-400 shrink-0" size={30} />
            Enterprise Workforce Timeline
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Chronological audit trail of onboarding events, salary revisions, department transfers, performance appraisals, and compliance document uploads across the organization.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => alert('Exporting full audit trail ledger to PDF / CSV...')}
            className="px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <Download size={15} />
            <span>Export Audit Ledger</span>
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-2xs"
            >
              <ArrowLeft size={16} />
              <span>Return to Directory</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-2 min-w-max pb-3">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#161616]'
                }`}
              >
                <IconComp size={15} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Search Bar */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-4 shadow-2xs">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by Employee Name, ID, Event Title, or Ref Code..."
            className="w-full pl-11 pr-4 py-2 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 hover:text-gray-600 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 4. Timeline Events Body */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <EmployeeTimelineComponent
          events={filteredEvents}
          filterCategory={selectedCategory}
        />
      </div>
    </div>
  );
};

export default EmployeeTimelinePage;
