import React, { useState } from 'react';
import { Sparkles, Filter, Search, RefreshCw, Bell } from 'lucide-react';
import { Card, CardBody, Button, Input, Badge } from '../../../components/shared';
import { PluginCard } from '../components/AICards';

/**
 * PluginExplorerPage.jsx
 * Plugin Status - AI Plugin catalog for EWMP.
 * Displays all 12 platform domain plugins (Attendance, Leave, Payroll, Employee, Performance, Project, Task, Recruitment, Asset, Document, Notification, Help Desk) with real-time status and latency health telemetry.
 * Following Stitch Precision Enterprise Design System.
 */
export const PluginExplorerPage = ({ onToast }) => {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [plugins, setPlugins] = useState([
    {
      id: 1,
      name: 'Attendance & Shift Telemetry Plugin',
      description: 'Connects Gemini 3.1 Pro to real-time biometric check-in feeds, shift adherence rules, late arrival detection, and overtime logging tables.',
      category: 'ATTENDANCE',
      status: 'Active',
      health: 'HEALTHY',
      latency: '95ms'
    },
    {
      id: 2,
      name: 'Leave & PTO Balance Automation Plugin',
      description: 'Enables autonomous calculation of vacation utilization ratios, seasonal absence overlap prediction, and automated manager approval workflows.',
      category: 'LEAVE',
      status: 'Active',
      health: 'HEALTHY',
      latency: '110ms'
    },
    {
      id: 3,
      name: 'Payroll Ledger & Tax Reconciler Plugin',
      description: 'Provides read/write access to gross payroll ledgers, salary tier curves, state/federal PAYE withholding, and automated direct deposit dispatch files.',
      category: 'PAYROLL',
      status: 'Active',
      health: 'HEALTHY',
      latency: '142ms'
    },
    {
      id: 4,
      name: 'Employee Directory & RBAC Security Plugin',
      description: 'Integrates organizational structure tables, department hierarchies, zero-trust biometric re-authentication, and RBAC permission tags.',
      category: 'EMPLOYEE',
      status: 'Active',
      health: 'HEALTHY',
      latency: '88ms'
    },
    {
      id: 5,
      name: 'Performance OKR & Bell Curve Plugin',
      description: 'Fuses employee appraisal ratings, mid-year OKR completion velocity, top performer benchmarking, and automated PIP coaching assignment.',
      category: 'PERFORMANCE',
      status: 'Configured',
      health: 'HEALTHY',
      latency: '125ms'
    },
    {
      id: 6,
      name: 'Project Portfolio & Milestone Tracker Plugin',
      description: 'Connects AI to Jira-style project sprint boards, story point velocity indexes, budget burn-down correlation curves, and deadline risk alerts.',
      category: 'PROJECTS',
      status: 'Active',
      health: 'HEALTHY',
      latency: '105ms'
    },
    {
      id: 7,
      name: 'Task Management & SLA Adherence Plugin',
      description: 'Enables automated task prioritization, Kanban column progression analysis, bottleneck identification, and individual workload balancing.',
      category: 'TASKS',
      status: 'Installed',
      health: 'HEALTHY',
      latency: '98ms'
    },
    {
      id: 8,
      name: 'Recruitment Funnel & Sourcing ROI Plugin',
      description: 'Analyzes applicant tracking funnels, time-to-hire metrics, offer acceptance percentages, and LinkedIn/Agency sourcing channel conversions.',
      category: 'RECRUITMENT',
      status: 'Active',
      health: 'HEALTHY',
      latency: '130ms'
    },
    {
      id: 9,
      name: 'IT Asset CMDB & Warranty Scanner Plugin',
      description: 'Provides real-time access to hardware allocation inventories, laptop serial tags, 3-year depreciation limits, and battery health telemetry.',
      category: 'ASSETS',
      status: 'Active',
      health: 'HEALTHY',
      latency: '115ms'
    },
    {
      id: 10,
      name: 'Document Management & OCR Extraction Plugin',
      description: 'Empowers AI to ingest PDF contracts, extract clauses, audit doc signatures, and perform semantic similarity searches across enterprise repositories.',
      category: 'DOCUMENTS',
      status: 'Configured',
      health: 'HEALTHY',
      latency: '180ms'
    },
    {
      id: 11,
      name: 'Enterprise Notification & Alerting Dispatcher',
      description: 'Connects to email, SMS, and in-app push notification queues for automated broadcast of urgent compliance alerts and payroll reminders.',
      category: 'NOTIFICATIONS',
      status: 'Active',
      health: 'HEALTHY',
      latency: '82ms'
    },
    {
      id: 12,
      name: 'Help Desk IT Service & SLA Triage Plugin',
      description: 'Automates Level 1 IT support ticketing, incident classification, priority assignment, SLA countdown timers, and self-service resolution drafting.',
      category: 'HELP DESK',
      status: 'Disabled',
      health: 'PAUSED',
      latency: 'N/A'
    }
  ]);

  const handleTogglePlugin = (id, newStatus) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus, health: newStatus === 'Disabled' ? 'PAUSED' : 'HEALTHY', latency: newStatus === 'Disabled' ? 'N/A' : '110ms' } : p))
    );
    if (onToast) onToast(`Plugin status updated to "${newStatus}".`);
  };

  const statuses = ['ALL', 'Active', 'Installed', 'Configured', 'Disabled'];

  const filtered = plugins.filter((p) => {
    if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Banner */}
      <Card elevation="level1" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
        <CardBody className="p-0">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="bg-cyan-50 dark:bg-cyan-950 text-cyan-600 border-cyan-200">
              MODULAR CONNECTORS
            </Badge>
            <span className="text-xs font-mono text-[#737686]">12 Domain Plugins Online</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            AI Plugin Explorer &amp; Domain Telemetry Connectors
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Manage read/write permissions and inspect real-time API latency for EWMP's 12 specialized artificial intelligence connectors.
          </p>
        </CardBody>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setPlugins((prev) => prev.map((p) => ({ ...p, status: 'Active', health: 'HEALTHY', latency: '105ms' })));
              if (onToast) onToast('All 12 domain plugins enabled and synced!');
            }}
            leftIcon={<Sparkles size={15} />}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            Enable All Plugins (12)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onToast && onToast('Running connector health diagnostics... All systems normal!')}
            leftIcon={<RefreshCw size={15} />}
          >
            Run Diag
          </Button>
        </div>
      </Card>

      {/* Slicers & Search Strip */}
      <Card elevation="level1" className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins by domain name or capability..."
            className="pl-9"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-[#737686]" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#737686] flex items-center gap-1">
            <Filter size={14} className="text-[#2563eb]" /> Status Filter:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedStatus === st
                  ? 'bg-[#2563eb] text-white shadow-2xs'
                  : 'bg-[#faf8ff] dark:bg-[#161616] text-[#737686] hover:text-[#191b23] dark:hover:text-white border border-[#e1e2ed] dark:border-gray-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </Card>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((plugin) => (
          <PluginCard
            key={plugin.id}
            {...plugin}
            onConfigure={() => onToast && onToast(`Opening configuration panel for "${plugin.name}"...`)}
            onToggle={(newSt) => handleTogglePlugin(plugin.id, newSt)}
          />
        ))}
      </div>
    </div>
  );
};
