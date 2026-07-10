import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, Users, Calendar, Clock, PlusCircle, ShieldCheck, CreditCard, FileText, ChevronRight, Send } from 'lucide-react';
import { PayrollRunCard, PayslipMiniCard, PayrollAnalyticsCard } from '../components/PayrollCards';
import { PayrollStatusBadge } from '../components/PayrollBadges';
import { AuditTimeline } from '../components/PayrollTimelines';
import { RunPayrollModal, MarkPaidModal } from '../components/PayrollDrawers';
import api from '../../../lib/axios';

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

/**
 * PayrollDashboardPage.jsx
 * Executive financial & HR dashboard for EWMP Payroll Management.
 * Displays Current Period, Status, Total Cost, Employees Processed, Pending Approvals, 
 * Pending Payments, Recent Payslips, Audit Timeline, and Quick Actions.
 */

export const PayrollDashboardPage = ({ onNavigate }) => {
  const queryClient = useQueryClient();
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const [selectedRunForPaid, setSelectedRunForPaid] = useState(null);

  const { data: payrollData, isLoading } = useQuery({
    queryKey: ['payroll-list'],
    queryFn: () => api.get('/payroll').then(r => r.data)
  });

  const { data: myPayrollData } = useQuery({
    queryKey: ['my-payroll'],
    queryFn: () => api.get('/payroll/my').then(r => r.data)
  });

  const processMutation = useMutation({
    mutationFn: (payload) => api.post('/payroll/process', payload),
    onSuccess: () => { queryClient.invalidateQueries(['payroll-list']); onNavigate('runs'); }
  });

  const markPaidMutation = useMutation({
    mutationFn: (id) => api.patch(`/payroll/${id}/mark-paid`),
    onSuccess: () => { queryClient.invalidateQueries(['payroll-list']); onNavigate('tracking'); }
  });

  const rawList = toArray(payrollData);
  const rawMyList = toArray(myPayrollData);

  // Most recent run for display
  const currentRun = rawList[0] ? {
    id: rawList[0]._id || rawList[0].id,
    month: new Date(rawList[0].payPeriodYear, rawList[0].payPeriodMonth - 1).toLocaleString('default', { month: 'long' }),
    year: String(rawList[0].payPeriodYear),
    status: rawList[0].status || 'PENDING_APPROVAL',
    totalCost: rawList[0].totalNetPay || rawList[0].totalNet || 0,
    empCount: rawList[0].employeeCount || rawList[0].empCount || 0,
    generatedBy: rawList[0].processedBy?.fullName || rawList[0].processedBy || 'System',
    generatedDate: rawList[0].processedAt ? new Date(rawList[0].processedAt).toLocaleDateString() : '',
    tds: rawList[0].totalTax || rawList[0].tds || 0
  } : { id: '—', month: '—', year: '—', status: 'PENDING_APPROVAL', totalCost: 0, empCount: 0, generatedBy: '—', generatedDate: '—', tds: 0 };

  const recentPayslips = rawMyList.slice(0, 4).map(p => ({
    id: p._id || p.id,
    employeeName: p.employee?.fullName || p.employee?.firstName + ' ' + p.employee?.lastName || 'Employee',
    period: new Date(p.payPeriodYear, p.payPeriodMonth - 1).toLocaleString('default', { month: 'long' }) + ' ' + p.payPeriodYear,
    net: p.totalNetPay || p.netPay || 0,
    month: new Date(p.payPeriodYear, p.payPeriodMonth - 1).toLocaleString('default', { month: 'short' }).toUpperCase()
  }));

  // Derived KPI counts
  const pendingApprovals = rawList.filter(r => r.status === 'PENDING_APPROVAL').length;
  const pendingPayments = rawList.filter(r => r.status === 'APPROVED').length;
  const totalNetPending = rawList.filter(r => r.status === 'APPROVED').reduce((s, r) => s + (r.totalNetPay || 0), 0);

  const handleRunConfirm = (runData) => {
    processMutation.mutate({
      payPeriodMonth: runData.month ? new Date(runData.month + ' 1').getMonth() + 1 : new Date().getMonth() + 1,
      payPeriodYear: runData.year ? parseInt(runData.year) : new Date().getFullYear()
    });
  };

  const handleMarkPaidConfirm = (data) => {
    markPaidMutation.mutate(data.id || currentRun.id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Run Payroll & Mark Paid Modals */}
      <RunPayrollModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        onConfirm={handleRunConfirm}
      />
      <MarkPaidModal
        isOpen={isPaidModalOpen}
        onClose={() => setIsPaidModalOpen(false)}
        onConfirm={handleMarkPaidConfirm}
        payroll={selectedRunForPaid || currentRun}
      />

      {/* Hero Welcome & Quick Actions Bar */}
      <div className="bg-gradient-to-r from-[#191b23] to-[#2e3039] rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#2563eb] text-white text-[11px] font-bold uppercase tracking-wider font-mono">
              Finance & HR Hub
            </span>
            <span className="text-xs text-gray-400 font-mono">Current Period: July 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Payroll Disbursal & Salary Administration</h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
            Execute statutory salary runs, verify attendance LOP deductions, manage PF/ESI withholdings, and disburse bank transfers.
          </p>
        </div>

        {/* Quick Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsRunModalOpen(true)}
            className="flex-1 md:flex-none bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-4 rounded-lg inline-flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <PlusCircle size={15} /> Run Payroll
          </button>
          <button
            onClick={() => onNavigate('approval')}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all"
          >
            <ShieldCheck size={15} /> Approve Payroll
          </button>
          <button
            onClick={() => { setSelectedRunForPaid(currentRun); setIsPaidModalOpen(true); }}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all"
          >
            <CreditCard size={15} /> Mark Paid
          </button>
          <button
            onClick={() => onNavigate('payslip-viewer')}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all"
          >
            <FileText size={15} /> Generate Payslip
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PayrollAnalyticsCard
          title="Total Monthly Payroll Cost"
          value={isLoading ? '…' : `₹${(currentRun.totalCost / 100000).toFixed(2)}L`}
          subtitle={`${currentRun.month} ${currentRun.year} gross commitment`}
          icon={DollarSign}
          change="Live"
          trend="up"
        />
        <PayrollAnalyticsCard
          title="Employees Processed"
          value={isLoading ? '…' : `${currentRun.empCount} Staff`}
          subtitle="Active headcount covered"
          icon={Users}
          change="0 exceptions"
          trend="up"
        />
        <PayrollAnalyticsCard
          title="Pending Approvals"
          value={isLoading ? '…' : `${pendingApprovals} Run${pendingApprovals !== 1 ? 's' : ''}`}
          subtitle="Awaiting executive review"
          icon={Clock}
        />
        <PayrollAnalyticsCard
          title="Pending Bank Payments"
          value={isLoading ? '…' : `₹${(totalNetPending / 100000).toFixed(2)}L`}
          subtitle="Awaiting NACH batch clearing"
          icon={CreditCard}
        />
      </div>

      {/* Current Payroll Period Banner & Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Payroll Run Card & Quick Action Triggers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
            <h2 className="text-base font-bold text-[#191b23] dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-[#2563eb]" />
              CURRENT PAYROLL PERIOD STATUS (JULY 2026)
            </h2>
            <button
              onClick={() => onNavigate('runs')}
              className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
            >
              View All Runs History <ChevronRight size={14} />
            </button>
          </div>

          <PayrollRunCard
            run={currentRun}
            onSelect={() => onNavigate('details')}
            onApprove={() => onNavigate('approval')}
            onMarkPaid={() => { setSelectedRunForPaid(currentRun); setIsPaidModalOpen(true); }}
          />

          {/* Quick Action Hub Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Run New Payroll', icon: PlusCircle, action: () => setIsRunModalOpen(true), desc: 'Calculate salary' },
              { label: 'Approve Queue', icon: ShieldCheck, action: () => onNavigate('approval'), desc: '1 Run waiting' },
              { label: 'Payment Tracking', icon: CreditCard, action: () => onNavigate('tracking'), desc: 'Settlement UTRs' },
              { label: 'Salary Structures', icon: FileText, action: () => onNavigate('structures'), desc: 'CTC components' },
            ].map((btn, idx) => {
              const IconComp = btn.icon;
              return (
                <div
                  key={idx}
                  onClick={btn.action}
                  className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-4 cursor-pointer hover:border-[#2563eb] transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <IconComp size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors">{btn.label}</h4>
                    <span className="text-[11px] text-[#737686] block mt-0.5">{btn.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Recently Generated Payslips */}
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
              <h3 className="text-sm font-bold text-[#191b23] dark:text-white flex items-center gap-2">
                <FileText size={16} className="text-purple-600" />
                RECENTLY GENERATED PAYSLIPS
              </h3>
              <button
                onClick={() => onNavigate('payslip-viewer')}
                className="text-xs font-semibold text-[#2563eb] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentPayslips.map((ps, idx) => (
                <PayslipMiniCard
                  key={idx}
                  payslip={ps}
                  onView={() => onNavigate('payslip-viewer')}
                  onDownload={(item) => alert(`Downloading PDF Payslip for ${item.employeeName} (${item.period})...`)}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e1e2ed] dark:border-gray-800 text-center">
            <button
              onClick={() => alert('Dispatching bulk email notifications with encrypted payslip PDFs to all 342 staff members...')}
              className="w-full py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <Send size={13} /> Email All July Payslips to Staff
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Audit Timeline & Settlement Status */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e1e2ed] dark:border-gray-800">
          <h2 className="text-base font-bold text-[#191b23] dark:text-white flex items-center gap-2">
            <Clock size={18} className="text-[#2563eb]" />
            CURRENT RUN AUDIT TIMELINE & APPROVAL STATUS
          </h2>
          <span className="text-xs font-mono text-[#737686]">Run ID: {currentRun.id}</span>
        </div>

        <AuditTimeline />
      </div>
    </div>
  );
};
