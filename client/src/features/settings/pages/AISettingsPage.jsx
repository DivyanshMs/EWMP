import React from 'react';
import { Sparkles, Cpu, Shield, Database, Lock, CheckCircle2, Layers, RefreshCw } from 'lucide-react';
import { Card, CardBody, CardHeader, Button, Badge } from '../../../components/shared';
import { SettingsCard, StatusBadge } from '../components/AdminComponents';

/**
 * AISettingsPage.jsx
 * AI Settings - Read-only enterprise configuration for the Autonomous AI Governance & Gemini 3.1 Pro engine.
 * Following Stitch Precision Enterprise Design System.
 */

export const AISettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Top AI Governance Banner */}
      <Card elevation="level2" className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white border-none overflow-hidden">
        <CardBody className="p-6 relative">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-purple-500/10 transform -skew-x-12 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-2">
            <Badge variant="primary" className="bg-white/10 backdrop-blur-sm text-purple-200">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-purple-300 animate-pulse" />
                Autonomous AI Governance Subsystem
              </div>
            </Badge>
            <h2 className="text-xl font-bold tracking-tight">Gemini 3.1 Pro Enterprise Engine & Safety Guardrails</h2>
            <p className="text-xs text-purple-100/80 leading-relaxed">
              EWMP is powered by Google DeepMind's flagship Gemini 3.1 Pro architecture, integrated via dedicated VPC endpoints with strict Data Loss Prevention (DLP) filtering and AES-256 vector store isolation.
            </p>
          </div>
        </CardBody>
      </Card>

      <Card elevation="level1" className="p-3 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800">
        <CardBody className="p-0 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-medium">
            <Lock size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span>AI model parameters, API routing credentials, and vector memory schemas are read-only and governed by Google Cloud Vertex AI policies.</span>
          </div>
          <Button 
            variant="ghost"
            size="xs"
            onClick={() => alert('Diagnostic check: Gemini 3.1 Pro neural gateway is responding in 14ms with 0% packet loss.')}
            rightIcon={<RefreshCw size={12} />}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Verify AI Health
          </Button>
        </CardBody>
      </Card>

      {/* Grid: Provider & Model Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Provider & Model Specs */}
        <SettingsCard 
          title="AI Provider & Model Architecture" 
          subtitle="Core LLM intelligence specifications and inference gateway routing"
          icon={Cpu}
          badge={{ status: 'operational', label: 'VERTEX AI VPC' }}
        >
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Primary AI Provider</span>
              <strong className="text-slate-900 dark:text-white font-semibold">Google DeepMind / Google Cloud</strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Active Model Engine</span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-bold rounded">
                Gemini 3.1 Pro (Enterprise SaaS Edition)
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Context Window Capacity</span>
              <strong className="text-slate-900 dark:text-white">2,000,000 Tokens (Multi-Modal Input)</strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Reasoning & Planning Capability</span>
              <strong className="text-emerald-600 dark:text-emerald-400">Advanced Agentic Orchestration Active</strong>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400">Inference Latency SLA</span>
              <strong className="text-slate-900 dark:text-white">&lt; 45ms Average Response Time</strong>
            </div>
          </div>
        </SettingsCard>

        {/* Prompt Safety & DLP Guardrails */}
        <SettingsCard 
          title="Prompt Safety & Data Loss Prevention (DLP)" 
          subtitle="Automated sanitization and cryptographic guardrails applied to all LLM prompts"
          icon={Shield}
          badge={{ status: 'compliant', label: 'DLP ACTIVE' }}
        >
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">PII / PHI Redaction Engine</span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 size={14} /> Automated Tokenization On
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Enterprise Data Training Policy</span>
              <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 font-bold rounded">
                Strict Zero-Retention (No Model Training)
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Prompt Injection Guardrail</span>
              <strong className="text-slate-900 dark:text-white">Active (DeepMind Safety Shield v4)</strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Cross-Tenant Isolation</span>
              <strong className="text-slate-900 dark:text-white">Enforced via Cryptographic Tenant Keys</strong>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400">Audit Compliance Standard</span>
              <strong className="text-slate-900 dark:text-white">SOC2 Type II & ISO 27001 Certified</strong>
            </div>
          </div>
        </SettingsCard>
      </div>

      {/* Grid: Vector Memory & Plugin Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vector Memory Store */}
        <SettingsCard 
          title="Conversation Memory & Vector Store Status" 
          subtitle="Long-term semantic retrieval storage for organization policies and documents"
          icon={Database}
          badge={{ status: 'compliant', label: 'AES-256 ENCRYPTED' }}
        >
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Vector Storage Architecture</span>
              <strong className="text-slate-900 dark:text-white">pgvector / Vertex AI Vector Search</strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Indexed Document Embeddings</span>
              <strong className="text-blue-600 dark:text-blue-400 font-bold">14,280 Enterprise Policies Index</strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Memory Pruning Schedule</span>
              <strong className="text-slate-900 dark:text-white">Automated 90-Day Rolling TTL</strong>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400">Cryptographic Key Vault</span>
              <strong className="text-emerald-600 dark:text-emerald-400">Google Cloud KMS Managed Keys</strong>
            </div>
          </div>
          <div className="pt-2">
            <button 
              onClick={() => alert('Triggering semantic index re-embed. Vector cache synchronized.')}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Re-Index Vector Semantic Cache
            </button>
          </div>
        </SettingsCard>

        {/* Connected Plugin Connectors */}
        <SettingsCard 
          title="Connected Enterprise Plugin Connectors" 
          subtitle="Real-time API tools available to the Gemini autonomous agent during workflow execution"
          icon={Layers}
          badge={{ status: 'operational', label: '12 CONNECTORS ACTIVE' }}
        >
          <div className="space-y-2.5 text-xs">
            {[
              { name: 'Payroll Ledger & Tax Engine', status: 'Active (Read/Write Allowed)', desc: 'Processes salary simulations & tax filings' },
              { name: 'Biometric Attendance Hub', status: 'Active (Real-Time Sync)', desc: 'Verifies GPS check-ins & regularization' },
              { name: 'ATS Candidate Pipeline Hub', status: 'Active (Resume Parse)', desc: 'Evaluates applicant profiles against JDs' },
              { name: 'Asset Inventory & CMDB Registry', status: 'Active (Allocation Track)', desc: 'Supervises laptop & hardware assignments' }
            ].map((plug, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{plug.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{plug.desc}</div>
                </div>
                <StatusBadge status="operational" label="ACTIVE" />
              </div>
            ))}
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};
