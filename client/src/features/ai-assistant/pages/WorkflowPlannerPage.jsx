import React, { useState } from 'react';
import { Layers, Sparkles, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { Card, CardBody, Button, Input, Badge, Textarea } from '../../../components/shared';
import { WorkflowCard } from '../components/AICards';
import { WorkflowTimeline, WorkflowValidationBanner } from '../components/WorkflowComponents';
import { NoWorkflows } from '../components/AIEmptyStates';

/**
 * WorkflowPlannerPage.jsx
 * Workflow Planner - Natural language workflow automation planner for EWMP.
 * Translates natural language instructions into multi-step sequential pipelines with dependency checks and execution simulations.
 * Following Stitch Precision Enterprise Design System.
 */
export const WorkflowPlannerPage = ({ onToast }) => {
  const [nlInput, setNlInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const [activeWorkflow, setActiveWorkflow] = useState({
    title: 'New Hire Onboarding & Hardware Provisioning Pipeline',
    prompt: 'Create an onboarding workflow for 3 new Senior Engineering hires in London: provision MacBook Pro laptops from CMDB, assign Level 5 payroll compensation ledgers, and schedule standard daily shift attendance rules.',
    duration: '45 Seconds',
    modules: ['Recruitment', 'CMDB Assets', 'Payroll', 'Attendance'],
    steps: [
      {
        id: 1,
        title: 'Verify Signed Offer Letters & RBAC Clearance',
        module: 'RECRUITMENT',
        duration: '2s',
        status: 'Completed',
        description: 'Validate signed contract tokens from DocuSign and assign Level 5 Engineering RBAC role tags in Organization Management.',
        validation: '100% Signature Match | SOC2 Verified',
        target: 'EWMP Auth API'
      },
      {
        id: 2,
        title: 'Allocate Workstation Hardware from CMDB Inventory',
        module: 'ASSETS',
        duration: '14s',
        status: 'Completed',
        description: 'Query CMDB inventory for 3 available Apple MacBook Pro M3 Max units in the London distribution center and bind serial tags to new employee profiles.',
        validation: 'Hardware Available | Warranty Bound',
        target: 'IT CMDB Warehouse'
      },
      {
        id: 3,
        title: 'Initialize Payroll Ledger & Tax Withholding Accounts',
        module: 'PAYROLL',
        duration: '18s',
        status: 'Running',
        description: 'Create base salary ledger accounts ($145,000 median band), configure UK HMRC PAYE tax withholding rules, and bind automated direct deposit schedules.',
        validation: 'HMRC Tax Compliant | Within Budget Cap',
        target: 'Payroll Financial Engine'
      },
      {
        id: 4,
        title: 'Configure Standard Attendance Adherence & PTO Quotas',
        module: 'ATTENDANCE',
        duration: '11s',
        status: 'Pending',
        description: 'Assign UK Standard 37.5h weekly shift pattern (Mon-Fri 09:00-17:30) and initialize 25-day annual vacation PTO balance in Leave Management.',
        validation: 'Shift Rules Active | PTO Initialized',
        target: 'Shift Adherence API'
      }
    ]
  });

  const [savedWorkflows, setSavedWorkflows] = useState([
    {
      id: 'wf-1',
      title: 'Monthly Payroll Tax Reconciliation & Direct Deposit Dispatch',
      prompt: 'Verify all employee timesheets for Q3, calculate gross payroll expenditure, apply state withholding taxes, and generate direct deposit dispatch files.',
      stepsCount: 5,
      duration: '1m 15s',
      status: 'Ready'
    },
    {
      id: 'wf-2',
      title: 'Quarterly Performance PIP Review & Coaching Assignment',
      prompt: 'Scan mid-year appraisal scores below 2.5 stars, generate formal Performance Improvement Plan (PIP) documents, and assign bi-weekly manager check-ins.',
      stepsCount: 4,
      duration: '35s',
      status: 'Ready'
    },
    {
      id: 'wf-3',
      title: 'Automated Offboarding & CMDB Hardware Decommissioning',
      prompt: 'When an employee resignation is approved, revoke authentication tokens, schedule laptop return courier from CMDB, and settle remaining PTO payout.',
      stepsCount: 6,
      duration: '50s',
      status: 'Ready'
    }
  ]);

  const handleGenerateFromPrompt = (e) => {
    e.preventDefault();
    if (!nlInput.trim()) return;

    if (onToast) onToast('Synthesizing natural language workflow pipeline...');
    setIsSimulating(false);
    setSimulationComplete(false);

    setTimeout(() => {
      setActiveWorkflow({
        title: `Custom Automated Pipeline: "${nlInput.trim().substring(0, 40)}..."`,
        prompt: nlInput.trim(),
        duration: '30 Seconds',
        modules: ['Attendance', 'Payroll', 'Leave'],
        steps: [
          {
            id: 1,
            title: 'Query Relevant Database Telemetry & RBAC Rules',
            module: 'GENERAL BI',
            duration: '4s',
            status: 'Completed',
            description: 'Extract required historical records and verify caller administrative privileges.',
            validation: 'RBAC Authorized | Data Available',
            target: 'EWMP SQL API'
          },
          {
            id: 2,
            title: 'Execute Policy Validation & Compliance Check',
            module: 'HR COMPLIANCE',
            duration: '12s',
            status: 'Completed',
            description: 'Validate proposed changes against corporate labor policy caps and SOC2 auditing guidelines.',
            validation: '100% Policy Compliant',
            target: 'Policy Rule Engine'
          },
          {
            id: 3,
            title: 'Commit State Changes & Dispatch Notifications',
            module: 'NOTIFICATIONS',
            duration: '14s',
            status: 'Pending',
            description: 'Apply updates to backend tables and send email/SMS notifications to department managers.',
            validation: 'State Committed | Email Queued',
            target: 'Notification Service'
          }
        ]
      });
      setNlInput('');
      if (onToast) onToast('Natural language workflow generated and validated!');
    }, 1200);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    if (onToast) onToast('Initiating autonomous multi-step execution simulation...');

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
      setActiveWorkflow((prev) => ({
        ...prev,
        steps: prev.steps.map((s) => ({ ...s, status: 'Completed' }))
      }));
      if (onToast) onToast('🎉 Simulation completed successfully! All steps executed.');
    }, 3000);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <Card elevation="level1" className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6">
        <CardBody className="p-0">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border-indigo-200">
              NATURAL LANGUAGE AUTOMATION
            </Badge>
            <span className="text-xs font-mono text-[#737686]">Autonomous Orchestration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            AI Workflow Planner &amp; Multi-Step Execution Simulation
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Type your operational requirements in plain English. The Gemini 3.1 Pro Engine translates them into validated, multi-step sequential pipelines across EWMP modules.
          </p>
        </CardBody>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onToast && onToast('Exporting workflow automation definition as YAML config...')}
          leftIcon={<FileText size={15} className="text-[#2563eb]" />}
        >
          Export YAML
        </Button>
      </Card>

      {/* Natural Language Prompt Input Box */}
      <Card elevation="level1" className="bg-gradient-to-r from-blue-900/5 via-indigo-900/5 to-purple-900/5 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border-[#2563eb]/40 p-5">
        <form onSubmit={handleGenerateFromPrompt} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-[#191b23] dark:text-white flex items-center gap-1.5">
              <Sparkles size={15} className="text-[#2563eb]" /> Define New Automation Instruction:
            </label>
            <span className="text-[10px] font-mono text-[#737686]">Supports cross-domain dependencies</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={nlInput}
              onChange={(e) => setNlInput(e.target.value)}
              placeholder="e.g., 'When an employee is promoted to Level 4, increase vacation PTO by 5 days and allocate a Dell Latitude 16 laptop from CMDB...'"
              className="flex-1 bg-white dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#191b23] dark:text-white focus:outline-hidden focus:border-[#2563eb] shadow-inner font-medium"
            />
            <button
              type="submit"
              disabled={!nlInput.trim()}
              className="px-6 py-3 bg-[#2563eb] hover:bg-[#004ac6] disabled:opacity-50 text-white rounded-xl text-xs font-bold font-mono transition-all shadow-xs flex items-center justify-center gap-2 shrink-0"
            >
              <span>Generate Pipeline</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </Card>

      {/* Active Workflow Validation & Simulation Area */}
      <div className="space-y-4 pt-2">
        <WorkflowValidationBanner
          isValid={true}
          estimatedDuration={activeWorkflow.duration}
          targetModules={activeWorkflow.modules}
          onStartSimulation={handleRunSimulation}
        />

        {/* Simulation Complete Success Alert */}
        {simulationComplete && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex items-center justify-between text-xs font-mono font-bold text-emerald-800 dark:text-emerald-200 animate-slide-down">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Autonomous Execution Simulation Complete! All 4 sequential steps committed to database.</span>
            </div>
            <button
              onClick={() => {
                setSimulationComplete(false);
                if (onToast) onToast('Simulation reset.');
              }}
              className="px-3 py-1 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-white hover:bg-emerald-300"
            >
              Reset
            </button>
          </div>
        )}

        <WorkflowTimeline
          steps={activeWorkflow.steps}
          isSimulating={isSimulating}
        />
      </div>

      {/* Pre-Saved Corporate Workflows Grid */}
      <div className="space-y-3 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#191b23] dark:text-white flex items-center gap-2">
            <Layers size={18} className="text-[#2563eb]" /> Pre-Saved Corporate Automation Templates
          </h3>
          <span className="text-xs font-mono text-[#737686]">Click to preview or simulate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savedWorkflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              {...wf}
              onPreview={() => {
                setActiveWorkflow({
                  title: wf.title,
                  prompt: wf.prompt,
                  duration: wf.duration,
                  modules: ['Payroll', 'Attendance', 'CMDB'],
                  steps: [
                    { id: 1, title: 'Extract Target Dataset & Slicers', module: 'GENERAL BI', status: 'Completed', duration: '2s', description: 'Query records matching criteria.' },
                    { id: 2, title: 'Run Policy Compliance Audit Engine', module: 'HR COMPLIANCE', status: 'Completed', duration: '12s', description: 'Validate calculations against policy caps.' },
                    { id: 3, title: 'Commit Ledgers & Dispatch Output', module: 'PAYROLL', status: 'Pending', duration: '15s', description: 'Write final state and generate notifications.' }
                  ]
                });
                if (onToast) onToast(`Loaded template "${wf.title}" into active workspace.`);
              }}
              onExecute={() => {
                handleRunSimulation();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
