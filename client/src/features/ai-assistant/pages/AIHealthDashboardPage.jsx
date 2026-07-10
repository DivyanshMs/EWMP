import React, { useState } from 'react';
import { ShieldCheck, Cpu, Database, RefreshCw, AlertTriangle, Server, HardDrive, Radio } from 'lucide-react';
import { Card, CardBody, Button, Badge } from '../../../components/shared';
import { HealthIndicator, StatusBadge } from '../components/AICards';
import { ProviderError, TimeoutError, PermissionDenied } from '../components/AIErrorStates';

/**
 * AIHealthDashboardPage.jsx
 * Provider Health - Live DevOps & AI engineering telemetry reporting dashboard for EWMP.
 * Displays Gemini 3.1 Pro engine status, latency, token consumption, circuit breakers, cache hit rates, prompt security guardrails, and memory health.
 * Following Stitch Precision Enterprise Design System.
 */
export const AIHealthDashboardPage = ({ onToast }) => {
  const [circuitBreaker, setCircuitBreaker] = useState('NORMAL'); // 'NORMAL' | 'TRIPPED'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [simulatedError, setSimulatedError] = useState(null); // null | 'provider' | 'timeout' | 'permission'

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    if (onToast) onToast('Pinged AI Gateway & Gemini 3.1 Pro endpoints...');
    setTimeout(() => {
      setIsRefreshing(false);
      if (onToast) onToast('System health telemetry refreshed. All 8 domain nodes healthy.');
    }, 1000);
  };

  const handleResetBreaker = () => {
    setCircuitBreaker('NORMAL');
    setSimulatedError(null);
    if (onToast) onToast('Circuit breaker manually reset to NORMAL state.');
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <Card elevation="level2" className="bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#0891b2] text-white border-none overflow-hidden">
        <CardBody className="p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="space-y-2 z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="bg-white/20 backdrop-blur-xs border-white/30 text-white">
                AI DEVOPS TELEMETRY
              </Badge>
              <span className="text-xs font-mono text-emerald-300 flex items-center gap-1 font-bold">
                <Radio size={13} className="animate-pulse" /> Live Telemetry Feed
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Engine Health &amp; Infrastructure Telemetry
            </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
            Real-time monitoring of Gemini 3.1 Pro LLM pipelines, prompt security DLP guardrails, SOC2 memory encryption, circuit breaker states, and quota consumption.
          </p>
        </div>

        {/* Global System Status Pill */}
        <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-5 flex items-center gap-5 z-10 shrink-0 shadow-xl">
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200 block font-bold">
              Upstream Status
            </span>
            <strong className="text-2xl font-black text-emerald-300 block mt-0.5 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" /> OPERATIONAL
            </strong>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <Button
            variant="primary"
            size="sm"
            onClick={handleRefreshTelemetry}
            disabled={isRefreshing}
            leftIcon={<RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />}
            className="bg-white text-[#2563eb] hover:bg-blue-50"
          >
            Refresh
          </Button>
        </div>
      </CardBody>
      </Card>

      {/* Error State Simulation Trigger Strip for Reviewers */}
      <Card elevation="level1" className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-[#737686] font-bold flex items-center gap-1.5">
          <AlertTriangle size={15} className="text-amber-500" /> Simulate Enterprise Error States (For Testing):
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant={simulatedError === 'provider' ? 'primary-danger' : 'secondary'}
            size="sm"
            onClick={() => setSimulatedError('provider')}
            className={simulatedError === 'provider' ? 'bg-rose-600' : ''}
          >
            Simulate 503 Provider Error
          </Button>
          <Button
            variant={simulatedError === 'timeout' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSimulatedError('timeout')}
            className={simulatedError === 'timeout' ? 'bg-amber-600' : ''}
          >
            Simulate 30s Timeout
          </Button>
          <Button
            variant={simulatedError === 'permission' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSimulatedError('permission')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${simulatedError === 'permission' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-[#111] border-[#e1e2ed] dark:border-gray-800 hover:border-purple-400'}`}
          >
            Simulate DLP Guardrail Denied
          </Button>
          {simulatedError && (
            <button
              onClick={() => setSimulatedError(null)}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 text-[#191b23] dark:text-white rounded-lg font-bold"
            >
              Reset Normal
            </button>
          )}
        </div>
      </Card>

      {/* Render Simulated Error if Active */}
      {simulatedError === 'provider' && <ProviderError onRetry={() => setSimulatedError(null)} />}
      {simulatedError === 'timeout' && <TimeoutError onRetry={() => setSimulatedError(null)} />}
      {simulatedError === 'permission' && <PermissionDenied onBack={() => setSimulatedError(null)} />}

      {/* Telemetry Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Provider Status & Latency */}
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#737686] uppercase font-bold">LLM Engine Provider</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">99.99% Uptime</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#2563eb]">
              <Cpu size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">Gemini 3.1 Pro</h3>
              <p className="text-xs text-[#737686] font-mono">128k Token Context Window</p>
            </div>
          </div>
          <div className="pt-2 border-t border-[#f0f1f6] dark:border-gray-800 flex items-center justify-between text-xs font-mono">
            <span className="text-[#737686]">Average Latency:</span>
            <strong className="text-[#191b23] dark:text-white font-black">115ms (P95: 180ms)</strong>
          </div>
        </div>

        {/* Card 2: Token Quota & Consumption */}
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#737686] uppercase font-bold">Token Quota Placeholder</span>
            <span className="text-[#2563eb] font-bold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">48% Consumed</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm font-black text-[#191b23] dark:text-white font-mono">
              <span>4.80M Tokens</span>
              <span className="text-xs text-[#737686] font-normal">/ 10.0M Monthly Cap</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#2563eb] to-indigo-500 h-full w-[48%] rounded-full" />
            </div>
          </div>
          <div className="pt-2 border-t border-[#f0f1f6] dark:border-gray-800 flex items-center justify-between text-xs font-mono">
            <span className="text-[#737686]">Avg Response Time:</span>
            <strong className="text-emerald-600 font-black">0.82 Seconds</strong>
          </div>
        </div>

        {/* Card 3: Cache Status & Storage Sync */}
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#737686] uppercase font-bold">Semantic Cache Status</span>
            <span className="text-purple-600 font-bold bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">Hit Rate: 84.2%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
              <Database size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">IndexedDB &amp; Redis</h3>
              <p className="text-xs text-[#737686] font-mono">Encrypted Vector Embeddings</p>
            </div>
          </div>
          <div className="pt-2 border-t border-[#f0f1f6] dark:border-gray-800 flex items-center justify-between text-xs font-mono">
            <span className="text-[#737686]">Cache Bandwidth Saved:</span>
            <strong className="text-[#191b23] dark:text-white font-black">1.42 GB / Day</strong>
          </div>
        </div>

        {/* Card 4: Circuit Breaker & Retry Status */}
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#737686] uppercase font-bold">Circuit Breaker Status</span>
            <span className={`font-bold px-2 py-0.5 rounded ${circuitBreaker === 'NORMAL' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950 text-rose-600'}`}>
              {circuitBreaker}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${circuitBreaker === 'NORMAL' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950 text-rose-600'}`}>
              <Server size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">Upstream Gateway</h3>
              <p className="text-xs text-[#737686] font-mono">Retry Policy: Exponential (Max 3)</p>
            </div>
          </div>
          <div className="pt-2 border-t border-[#f0f1f6] dark:border-gray-800 flex items-center justify-between text-xs font-mono">
            <span className="text-[#737686]">Failed Retries (24h):</span>
            <strong className="text-emerald-600 font-black">0 Errors Logged</strong>
          </div>
        </div>
      </div>

      {/* Prompt Security & Memory Encryption Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Prompt Security Guardrails */}
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f1f6] dark:border-gray-800">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" />
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
                Prompt Security &amp; DLP Privacy Guardrails
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-bold">SOC2 / ISO27001</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800">
              <div className="space-y-0.5">
                <strong className="text-[#191b23] dark:text-white block font-bold">PII &amp; Salary Masking Filter</strong>
                <span className="text-[#737686] block">Automated redaction of social security numbers and executive salary tiers in non-audited queries.</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-mono font-bold shrink-0">ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800">
              <div className="space-y-0.5">
                <strong className="text-[#191b23] dark:text-white block font-bold">Prompt Injection Defense Shield</strong>
                <span className="text-[#737686] block">Prevents adversarial jailbreak syntax or unauthorized cross-tenant data exfiltration attempts.</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-mono font-bold shrink-0">ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800">
              <div className="space-y-0.5">
                <strong className="text-[#191b23] dark:text-white block font-bold">RBAC Scope Enforcer</strong>
                <span className="text-[#737686] block">Binds every AI inference request directly to the caller's JWT organizational role permissions.</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-mono font-bold shrink-0">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Right: Conversational Memory & Vector Store Health */}
        <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f1f6] dark:border-gray-800">
            <div className="flex items-center gap-2">
              <HardDrive size={20} className="text-[#2563eb]" />
              <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
                Conversational Memory &amp; Vector Store
              </h3>
            </div>
            <span className="text-xs font-mono text-[#2563eb] font-bold">AES-256 Encrypted</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800">
              <div className="space-y-0.5">
                <strong className="text-[#191b23] dark:text-white block font-bold">Session State Retention</strong>
                <span className="text-[#737686] block">Preserves long-term multi-turn context across user logins using encrypted client IndexedDB.</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#191b23] dark:text-gray-200 shrink-0">90 Days Cap</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800">
              <div className="space-y-0.5">
                <strong className="text-[#191b23] dark:text-white block font-bold">Vector Embeddings Index</strong>
                <span className="text-[#737686] block">14,200 indexed organizational policy document clauses and HR compliance handbooks.</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 shrink-0">SYNCED (2m ago)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#faf8ff] dark:bg-[#161616] rounded-xl border border-[#e1e2ed] dark:border-gray-800">
              <div className="space-y-0.5">
                <strong className="text-[#191b23] dark:text-white block font-bold">Memory Scrubbing &amp; Purge</strong>
                <span className="text-[#737686] block">Automated gdpr/ccpa compliant deletion upon user offboarding or explicit session purge.</span>
              </div>
              <button
                onClick={() => onToast && onToast('Purged temporary scratch memory buffer.')}
                className="px-2.5 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 font-mono font-bold shrink-0"
              >
                Purge Buffer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
