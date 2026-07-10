import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  DollarSign, 
  FileText, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  CalendarDays, 
  TrendingUp, 
  History, 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

import { EmployeeProfileHeader } from '../components/EmployeeProfileHeader';
import { EmployeeDocumentCard } from '../components/EmployeeDocumentCard';
import { EmployeeTimelineComponent } from '../components/EmployeeTimelineComponent';
import { StatusBadge, EmploymentBadge, DepartmentBadge } from '../components/EmployeeBadges';

/**
 * EmployeeProfilePage.jsx
 * Page 3: Full 360-degree Employee Profile dashboard in EWMP.
 * Features 9 tabbed inspection views: Overview, Employment, Salary, Documents, Projects, Tasks,
 * Attendance Summary, Leave Summary, Performance Summary, and Activity Timeline.
 */

export const EmployeeProfilePage = ({
  employee: propEmployee = null,
  onBack,
  onEdit,
  onArchive,
  onNavigateModule,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Realistic fallback employee profile if none passed via props
  const employee = propEmployee || {
    id: 'EMP-1042',
    name: 'David Vance',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    department: 'Platform Engineering',
    designation: 'Principal Systems Architect',
    manager: 'David Kim (VP Eng)',
    employmentType: 'Full-Time',
    status: 'Active',
    email: 'd.vance@acme.corp',
    phone: '+1 (415) 555-0199',
    location: 'Silicon Valley HQ (US-SV-01)',
    shift: 'Standard Morning Roster (08:00 - 17:00)',
    joiningDate: '2023-01-15',
    emergencyContact: {
      name: 'Clara Vance (Spouse)',
      phone: '+1 (415) 555-0188',
      address: '450 Spear Street, San Francisco, CA 94105',
    },
    salaryInfo: {
      base: '$245,000 / yr',
      bonusTarget: '15% Annual ($36,750)',
      payFrequency: 'Bi-Weekly Direct Deposit',
      bankName: 'Silicon Valley Commercial Bank',
      accountNumber: '**** **** **** 8842',
      routingNumber: '021000021',
      taxStatus: 'W-4 Standard Withholding (Single - 0 Allowances)',
    },
    documents: [
      {
        id: 'doc-1',
        title: 'Signed Employment Agreement & NDA',
        type: 'Legal Contract',
        fileSize: '3.2 MB',
        uploadDate: '2023-01-14',
        uploadedBy: 'HR Onboarding Portal',
        status: 'Verified',
      },
      {
        id: 'doc-2',
        title: 'Government Passport / I-9 Proof',
        type: 'ID Proof',
        fileSize: '1.8 MB',
        uploadDate: '2023-01-15',
        uploadedBy: 'David Vance',
        status: 'Verified',
      },
      {
        id: 'doc-3',
        title: 'Form W-4 Employee Withholding Certificate',
        type: 'Tax Document',
        fileSize: '840 KB',
        uploadDate: '2023-01-15',
        uploadedBy: 'David Vance',
        status: 'Verified',
      },
    ],
    projects: [
      { id: 'prj-1', name: 'EWMP AI Governance Node v2.0', role: 'Lead Architect', status: 'In Progress', completion: 85 },
      { id: 'prj-2', name: 'Global MongoDB Atlas Sharding Migration', role: 'Principal SRE', status: 'Completed', completion: 100 },
      { id: 'prj-3', name: 'Zero-Trust Biometric Kiosk Integration', role: 'Technical Advisor', status: 'In Progress', completion: 40 },
    ],
    tasks: [
      { id: 'tsk-1', title: 'Calibrate Gemini 2.0 Flash confidence thresholds for attendance regularization', priority: 'High', status: 'In Review', dueDate: '2026-07-10' },
      { id: 'tsk-2', title: 'Review RBAC permissions matrix for Q3 SOC2 compliance audit', priority: 'Urgent', status: 'In Progress', dueDate: '2026-07-08' },
      { id: 'tsk-3', title: 'Sign off on architecture schema revisions for Leave Accrual calculations', priority: 'Medium', status: 'Done', dueDate: '2026-07-02' },
    ],
    attendanceSummary: {
      presentDays: 132,
      lateArrivals: 3,
      remoteDays: 45,
      avgWorkingHours: '8.4 hrs/day',
      complianceScore: '98.5%',
    },
    leaveSummary: {
      annualPTOAccrued: '21.0 Days',
      takenYTD: '6.5 Days',
      availableBalance: '14.5 Days',
      sickLeaveBalance: '8.0 Days',
    },
    performanceSummary: {
      lastAppraisalRating: '4.8 / 5.0 (Exceeds Expectations)',
      kpiCompletion: '96%',
      reviewCycle: 'H1 2026 Enterprise Review',
      nextReviewDate: '2026-12-15',
      managerFeedback: 'David consistently drives stellar architectural breakthroughs across our distributed AI nodes and platform infrastructure.',
    },
    timelineEvents: [
      {
        type: 'promotion',
        title: 'Promoted to Principal Systems Architect',
        date: '2025-01-01',
        description: 'Elevated from Senior Cloud Architect following successful delivery of the multi-region Kubernetes cluster.',
        author: 'David Kim (VP Eng)',
        metadata: { grade: 'L6 Principal', salaryIncrease: '+18%' },
      },
      {
        type: 'salary',
        title: 'Annual Compensation Revision',
        date: '2024-03-15',
        description: 'Merit-based compensation adjustment aligned with market benchmark calibration.',
        author: 'Marcus Brody (COO)',
        metadata: { previousBase: '$210,000', newBase: '$245,000' },
      },
      {
        type: 'department',
        title: 'Transfer to Platform Engineering Core Hub',
        date: '2023-06-01',
        description: 'Transferred from Cloud Infrastructure team to lead enterprise core platform architecture.',
        author: 'Sarah Jenkins (HR VP)',
      },
      {
        type: 'joined',
        title: 'Onboarded to ACME Enterprise Global Corp.',
        date: '2023-01-15',
        description: 'Joined as Senior Cloud Architect at Silicon Valley Headquarters.',
        author: 'HR Onboarding Portal',
        metadata: { employeeId: 'EMP-1042', location: 'Silicon Valley HQ' },
      },
    ],
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Contacts', icon: User, count: null },
    { id: 'employment', label: 'Employment Details', icon: Briefcase, count: null },
    { id: 'salary', label: 'Salary & Compensation', icon: DollarSign, count: null },
    { id: 'documents', label: 'Digital Vault', icon: FileText, count: employee.documents?.length || 3 },
    { id: 'projects', label: 'Assigned Projects', icon: FolderKanban, count: employee.projects?.length || 3 },
    { id: 'tasks', label: 'Task Backlog', icon: CheckSquare, count: employee.tasks?.length || 3 },
    { id: 'attendance', label: 'Attendance Telemetry', icon: Clock, count: null },
    { id: 'leave', label: 'Leave Summary', icon: CalendarDays, count: null },
    { id: 'performance', label: '360 Performance', icon: TrendingUp, count: null },
    { id: 'timeline', label: 'Activity Timeline', icon: History, count: employee.timelineEvents?.length || 4 },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* 1. Back Navigation Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-2xs"
        >
          <ArrowLeft size={16} />
          <span>Return to Employee Directory</span>
        </button>
      )}

      {/* 2. Full Profile Header Banner */}
      <EmployeeProfileHeader
        employee={employee}
        onEdit={onEdit}
        onArchive={onArchive}
        onAssignManager={() => alert(`Reassigning manager for ${employee.name}...`)}
        onUploadDoc={() => alert(`Opening Document Upload dialog for ${employee.name}...`)}
        onNavigateModule={onNavigateModule}
      />

      {/* 3. Horizontal Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-2 min-w-max pb-3">
          {tabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#161616]'
                }`}
              >
                <IconComp size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. Tab Panels Body */}
      <div className="pt-2">
        {/* TAB 1: OVERVIEW & CONTACTS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left Column: Demographics & Emergency */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <User size={18} className="text-blue-600" />
                  Personal Demographics
                </h4>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between"><span className="text-gray-400 font-medium">Full Legal Name:</span><strong className="text-gray-800 dark:text-gray-200">{employee.name}</strong></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-medium">Employee ID:</span><strong className="font-mono text-blue-600">{employee.id}</strong></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-medium">Gender Identity:</span><strong className="text-gray-800 dark:text-gray-200">Male</strong></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-medium">Date of Birth:</span><strong className="font-mono text-gray-800 dark:text-gray-200">1988-11-04 (37 yrs)</strong></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-medium">Marital Status:</span><strong className="text-gray-800 dark:text-gray-200">Married</strong></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-medium">Nationality:</span><strong className="text-gray-800 dark:text-gray-200">United States (Citizen)</strong></div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <ShieldCheck size={18} className="text-amber-500" />
                  Emergency Contact Record
                </h4>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between"><span className="text-gray-400 font-medium">Contact Name:</span><strong className="text-gray-800 dark:text-gray-200">{employee.emergencyContact?.name}</strong></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-medium">Relationship:</span><strong className="text-gray-800 dark:text-gray-200">Primary Spouse</strong></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-medium">Phone / Mobile:</span><strong className="font-mono text-emerald-600 font-bold">{employee.emergencyContact?.phone}</strong></div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 leading-relaxed">
                    <strong>Registered Address:</strong> {employee.emergencyContact?.address}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2 Columns: Official Contact Info & Bio */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <h4 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
                  Official Communication Channels &amp; Residential Telemetry
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-xs font-mono text-gray-400 uppercase font-bold">Work Email Address</span>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 font-mono truncate">{employee.email}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-xs font-mono text-gray-400 uppercase font-bold">Mobile / SMS Escalate Phone</span>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 font-mono">{employee.phone}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-xs font-mono text-gray-400 uppercase font-bold">Assigned Office Location</span>
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{employee.location}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-xs font-mono text-gray-400 uppercase font-bold">Slack / MS Teams Handle</span>
                    <div className="font-semibold text-blue-600 dark:text-blue-400 font-mono">@david.vance.acme</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">Executive Profile Summary &amp; Bio</h5>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    David Vance serves as Principal Systems Architect for the EWMP Platform Engineering division. With over 12 years of experience designing high-throughput distributed architectures, Kubernetes service meshes, and Gemini AI autonomous orchestration pipelines, he oversees global technical standards across Silicon Valley, London, and Singapore innovation hubs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EMPLOYMENT DETAILS */}
        {activeTab === 'employment' && (
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <Briefcase size={20} className="text-indigo-600" />
              Structural Hierarchy &amp; Contract Terms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Job Designation / Title</span>
                <div className="font-extrabold text-base text-gray-900 dark:text-white">{employee.designation}</div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Assigned Department</span>
                <div className="font-extrabold text-base text-gray-900 dark:text-white">{employee.department}</div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Reporting Manager</span>
                <div className="font-extrabold text-base text-blue-600 dark:text-blue-400">{employee.manager}</div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Employment Type</span>
                <div className="font-extrabold text-base text-gray-900 dark:text-white">{employee.employmentType} Regular</div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Contract Status</span>
                <div className="pt-1"><StatusBadge status={employee.status} /></div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Assigned Shift Roster</span>
                <div className="font-extrabold text-base text-gray-900 dark:text-white">{employee.shift}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SALARY & COMPENSATION */}
        {activeTab === 'salary' && (
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-600" />
              Compensation Structure &amp; Disbursement Telemetry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono uppercase font-bold">Annual Base Salary</span>
                <div className="font-extrabold text-2xl font-mono text-emerald-600">{employee.salaryInfo?.base}</div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Target Variable Bonus</span>
                <div className="font-extrabold text-lg text-gray-900 dark:text-white">{employee.salaryInfo?.bonusTarget}</div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Disbursement Frequency</span>
                <div className="font-extrabold text-lg text-gray-900 dark:text-white">{employee.salaryInfo?.payFrequency}</div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Registered Bank Name</span>
                <div className="font-extrabold text-base text-gray-900 dark:text-white">{employee.salaryInfo?.bankName}</div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Bank Account Number</span>
                <div className="font-extrabold text-base font-mono text-gray-900 dark:text-white">{employee.salaryInfo?.accountNumber}</div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 font-mono uppercase font-bold">Tax Withholding Status</span>
                <div className="font-bold text-sm text-gray-900 dark:text-white">{employee.salaryInfo?.taxStatus}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIGITAL VAULT DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-purple-600" />
                Attached Digital Vault Documents ({employee.documents?.length || 0})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employee.documents?.map((doc) => (
                <EmployeeDocumentCard
                  key={doc.id}
                  document={doc}
                  onPreview={(d) => alert(`Previewing document: ${d.title}`)}
                  onDownload={(d) => alert(`Downloading verified file: ${d.title}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <FolderKanban size={20} className="text-blue-600" />
              Assigned Enterprise Projects &amp; Initiatives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {employee.projects?.map((prj) => (
                <div key={prj.id} className="p-5 bg-gray-50 dark:bg-[#161616] rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-extrabold text-gray-900 dark:text-white text-base">{prj.name}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0">
                      {prj.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">Assigned Role: <strong className="text-gray-800 dark:text-gray-200">{prj.role}</strong></div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Milestone Progress</span>
                      <strong>{prj.completion}%</strong>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${prj.completion}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: TASKS BACKLOG */}
        {activeTab === 'tasks' && (
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <CheckSquare size={20} className="text-indigo-600" />
              Active Sprint Task Assignments ({employee.tasks?.length || 0})
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {employee.tasks?.map((tsk) => (
                <div key={tsk.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h5 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{tsk.title}</h5>
                    <span className="text-xs font-mono text-gray-400">Due Date: {tsk.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      tsk.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {tsk.priority} Priority
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold font-mono">
                      {tsk.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: ATTENDANCE SUMMARY */}
        {activeTab === 'attendance' && (
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Attendance &amp; Geofencing Compliance Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 rounded-3xl border border-blue-200 dark:border-blue-800/40 text-center">
                <span className="text-xs font-mono text-blue-600 uppercase font-bold">Present Days YTD</span>
                <div className="text-3xl font-extrabold font-mono text-blue-700 dark:text-blue-300 mt-2">{employee.attendanceSummary?.presentDays} Days</div>
              </div>
              <div className="p-5 bg-amber-50/50 dark:bg-amber-950/20 rounded-3xl border border-amber-200 dark:border-amber-800/40 text-center">
                <span className="text-xs font-mono text-amber-600 uppercase font-bold">Late Arrivals</span>
                <div className="text-3xl font-extrabold font-mono text-amber-700 dark:text-amber-300 mt-2">{employee.attendanceSummary?.lateArrivals} Incidents</div>
              </div>
              <div className="p-5 bg-purple-50/50 dark:bg-purple-950/20 rounded-3xl border border-purple-200 dark:border-purple-800/40 text-center">
                <span className="text-xs font-mono text-purple-600 uppercase font-bold">Remote Work Days</span>
                <div className="text-3xl font-extrabold font-mono text-purple-700 dark:text-purple-300 mt-2">{employee.attendanceSummary?.remoteDays} Days</div>
              </div>
              <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-200 dark:border-emerald-800/40 text-center">
                <span className="text-xs font-mono text-emerald-600 uppercase font-bold">SLA Compliance Score</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300 mt-2">{employee.attendanceSummary?.complianceScore}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: LEAVE SUMMARY */}
        {activeTab === 'leave' && (
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <CalendarDays size={20} className="text-purple-600" />
              Paid Time Off (PTO) &amp; Leave Accrual Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                <span className="text-xs font-mono text-gray-400 uppercase font-bold">Annual PTO Accrued</span>
                <div className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white mt-2">{employee.leaveSummary?.annualPTOAccrued}</div>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                <span className="text-xs font-mono text-gray-400 uppercase font-bold">Taken YTD</span>
                <div className="text-3xl font-extrabold font-mono text-rose-600 mt-2">{employee.leaveSummary?.takenYTD}</div>
              </div>
              <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-200 dark:border-emerald-800/40 text-center">
                <span className="text-xs font-mono text-emerald-600 uppercase font-bold">Available PTO Balance</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300 mt-2">{employee.leaveSummary?.availableBalance}</div>
              </div>
              <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-200 dark:border-indigo-800/40 text-center">
                <span className="text-xs font-mono text-indigo-600 uppercase font-bold">Sick Leave Balance</span>
                <div className="text-3xl font-extrabold font-mono text-indigo-700 dark:text-indigo-300 mt-2">{employee.leaveSummary?.sickLeaveBalance}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: PERFORMANCE SUMMARY */}
        {activeTab === 'performance' && (
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-teal-600" />
              360 Performance Appraisal &amp; KPI Calibration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-teal-50/40 dark:bg-teal-950/20 rounded-3xl border border-teal-200 dark:border-teal-800/40 space-y-3">
                <span className="text-xs font-mono text-teal-700 dark:text-teal-400 uppercase font-bold">Last Review Rating ({employee.performanceSummary?.reviewCycle})</span>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">{employee.performanceSummary?.lastAppraisalRating}</div>
                <div className="text-xs text-gray-500 font-mono">Next Appraisal Target: {employee.performanceSummary?.nextReviewDate}</div>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-[#161616] rounded-3xl border border-gray-100 dark:border-gray-800 space-y-2">
                <span className="text-xs font-mono text-gray-400 uppercase font-bold">Reporting Manager Appraisal Feedback</span>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "{employee.performanceSummary?.managerFeedback}"
                </p>
                <div className="text-[11px] text-blue-600 font-mono font-bold">— Signed by {employee.manager}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: ACTIVITY TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <History size={20} className="text-blue-600" />
              Complete Lifecycle Audit Trail ({employee.timelineEvents?.length || 0} milestones recorded)
            </h3>
            <EmployeeTimelineComponent events={employee.timelineEvents} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
