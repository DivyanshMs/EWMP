import React, { useState } from 'react';
import { Archive, RefreshCw, Trash2, ArrowLeft, Search, Calendar, ShieldAlert } from 'lucide-react';
import { StatusBadge, DepartmentBadge, EmployeeAvatar } from '../components/EmployeeBadges';
import { EmployeeEmptyState } from '../components/EmployeeEmptyStates';

/**
 * ArchivedEmployeesPage.jsx
 * Page 5: Employee Archive vault for separated, retired, or resigned workforce records.
 * Supports one-click record restoration and permanent deletion with explicit confirmation dialogs.
 * Records immutable exit telemetry: Archive Reason and Archive Date.
 */

export const ArchivedEmployeesPage = ({ onBack, onRestore }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [archivedList, setArchivedList] = useState([
    {
      id: 'EMP-0988',
      name: 'Robert Langdon',
      photoUrl: null,
      department: 'Corporate Finance',
      designation: 'Senior Internal Auditor',
      manager: 'Marcus Brody (CFO)',
      email: 'r.langdon@acme.corp',
      phone: '+1 (415) 555-0102',
      location: 'Silicon Valley HQ (US)',
      archiveDate: '2025-12-31',
      archiveReason: 'Voluntary Resignation — Relocated to Academic Institution',
      status: 'Archived',
    },
    {
      id: 'EMP-0921',
      name: 'Margaret Thatcher-Vance',
      photoUrl: null,
      department: 'Human Resources',
      designation: 'Global Compliance Director',
      manager: 'Sarah Jenkins (HR VP)',
      email: 'm.thatcher@acme.corp',
      phone: '+44 20 7946 0888',
      location: 'London Innovation Hub (UK)',
      archiveDate: '2025-09-15',
      archiveReason: 'Normal Retirement — Reached statutory retirement tenure after 15 years service',
      status: 'Archived',
    },
    {
      id: 'EMP-0844',
      name: 'Kevin Flynn',
      photoUrl: null,
      department: 'Platform Engineering',
      designation: 'Principal Grid Architect',
      manager: 'David Kim (VP Eng)',
      email: 'k.flynn@acme.corp',
      phone: '+1 (408) 555-0199',
      location: 'Austin Engineering Annex (US)',
      archiveDate: '2025-06-30',
      archiveReason: 'Contract Completion — Successfully delivered Phase 1 Grid Architecture',
      status: 'Archived',
    },
  ]);

  const filteredList = archivedList.filter((emp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.archiveReason.toLowerCase().includes(q)
    );
  });

  const handleRestore = (emp) => {
    if (window.confirm(`Restore employee record for ${emp.name} (${emp.id}) back to Active workforce directory?`)) {
      setArchivedList(archivedList.filter((item) => item.id !== emp.id));
      if (onRestore) onRestore(emp);
    }
  };

  const handlePermanentDelete = (emp) => {
    const confirmation = window.prompt(
      `CRITICAL WARNING: Permanent deletion cannot be undone. All historical payroll, attendance, and compliance records will be expunged.\n\nTo confirm permanent deletion of ${emp.name}, please type "${emp.id}" below:`
    );
    if (confirmation === emp.id) {
      setArchivedList(archivedList.filter((item) => item.id !== emp.id));
      alert(`Record ${emp.id} permanently expunged from the EWMP database vault.`);
    } else if (confirmation !== null) {
      alert('Verification code mismatch. Permanent deletion aborted.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* 1. Header & Return Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>EWMP HR Platform</span>
            <span>/</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">Immutable Archive Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Archive className="text-amber-600 dark:text-amber-400 shrink-0" size={30} />
            Archived Workforce Vault
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Inspect separated, retired, or contract-completed workforce records. Records preserved here maintain SOX &amp; ISO-27001 compliance auditing trails.
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-2xs shrink-0"
          >
            <ArrowLeft size={16} />
            <span>Return to Directory</span>
          </button>
        )}
      </div>

      {/* 2. Security Banner */}
      <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 flex items-start gap-3.5 text-xs sm:text-sm font-medium">
        <ShieldAlert size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong>Archival Retention &amp; Permanent Deletion Safeguards:</strong> Restoring an employee will reactivate their SSO login credentials and rejoin their previous reporting hierarchy. Permanent deletion requires explicit ID confirmation and should only occur under GDPR right-to-be-forgotten mandates.
        </div>
      </div>

      {/* 3. Search Filter */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-4 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archive by Name, ID, or Separation Reason..."
            className="w-full pl-11 pr-4 py-2 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
          </input>
        </div>
      </div>

      {/* 4. Archived Roster Table */}
      {filteredList.length === 0 ? (
        <EmployeeEmptyState
          type="archive"
          onAction={onBack}
        />
      ) : (
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#161616] border-b border-gray-200 dark:border-gray-800 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Archived Employee</th>
                  <th className="p-4">Department &amp; Title</th>
                  <th className="p-4">Archive Date</th>
                  <th className="p-4">Separation / Archival Reason</th>
                  <th className="p-4 text-right">Vault Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm">
                {filteredList.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/80 dark:hover:bg-[#181818] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar name={emp.name} size="md" status="Archived" showStatus={false} />
                        <div>
                          <div className="font-extrabold text-gray-900 dark:text-white">{emp.name}</div>
                          <span className="font-mono text-xs text-gray-400 font-bold">{emp.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-xs">{emp.designation}</div>
                      <DepartmentBadge department={emp.department} size="sm" />
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{emp.archiveDate}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="p-2.5 bg-gray-50 dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 font-medium max-w-sm">
                        {emp.archiveReason}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRestore(emp)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold transition-colors"
                        >
                          <RefreshCw size={14} />
                          Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(emp)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold transition-colors"
                        >
                          <Trash2 size={14} />
                          Permanent Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivedEmployeesPage;
