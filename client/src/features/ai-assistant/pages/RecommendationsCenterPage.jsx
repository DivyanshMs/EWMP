import React, { useState } from 'react';
import { Filter, Sparkles, Search, Download } from 'lucide-react';
import { Card, CardBody, Button, Input, Badge } from '../../../components/shared';
import { RecommendationCard } from '../components/AICards';
import { NoRecommendations } from '../components/AIEmptyStates';

/**
 * RecommendationsCenterPage.jsx
 * AI Recommendations - Actionable AI recommendations feed across all 8 EWMP enterprise domains.
 * Features multi-factor priority/status slicing and automated backend application simulation.
 * Following Stitch Precision Enterprise Design System.
 */
export const RecommendationsCenterPage = ({ onToast }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      title: 'Authorize Temporary DevOps Contractors for PRJ-101',
      description: 'Overtime hours in Engineering R&D increased by 4.2% over the last 30 days while cloud migration sprint burn-down accelerated. Authorizing 2 temporary DevOps contractors will prevent employee burnout and maintain the Aug 15 release date.',
      category: 'PROJECTS',
      priority: 'CRITICAL',
      status: 'New',
      impact: '+$35,000 Productivity Protection | Zero Delay'
    },
    {
      id: 2,
      title: 'Automate Summer Vacation Shift Backfilling in Customer Ops',
      description: 'Leave utilization models predict a 28% overlap in scheduled PTO during the first two weeks of August for Customer Support representatives. Recommend activating automated cross-shift coverage.',
      category: 'LEAVE',
      priority: 'HIGH',
      status: 'New',
      impact: '100% SLA Adherence Maintained'
    },
    {
      id: 3,
      title: 'Rebalance Salary Band Allocations for Mid-Level Data Scientists',
      description: 'Payroll compensation benchmarking indicates EWMP base salary bands for Level 3 Data Scientists are currently 4.8% below the regional tech sector median. Recommend adjusting FY26/Q4 merit budgets.',
      category: 'PAYROLL',
      priority: 'HIGH',
      status: 'In Review',
      impact: '+12% Projected 2-Year Retention Rate'
    },
    {
      id: 4,
      title: 'Implement Targeted Coaching PIPs for 2 Account Executives',
      description: 'Mid-year performance reviews and Q2 quota attainment logs flag two individuals in Enterprise Sales below the 70% threshold. Recommend assigning automated bi-weekly coaching modules.',
      category: 'PERFORMANCE',
      priority: 'MEDIUM',
      status: 'New',
      impact: '+18% Quota Recovery Velocity'
    },
    {
      id: 5,
      title: 'Refresh 14 MacBook Pro Laptops Reaching 3-Year Depreciated Limit',
      description: 'CMDB hardware inventory scans identify 14 Apple laptops assigned to senior developers with expiring warranties and degrading battery health (<80%). Recommend initiating bulk procurement order.',
      category: 'ASSETS',
      priority: 'MEDIUM',
      status: 'Applied',
      impact: '-45 mins Monthly Technical Downtime / Dev'
    },
    {
      id: 6,
      title: 'Adjust Shift Grace Period for Warehouse Distribution Teams',
      description: 'Attendance telemetry detects a recurring 5-minute late arrival pattern among early morning warehouse shifts due to local transit schedule changes. Recommend shifting official start time from 06:00 to 06:15.',
      category: 'ATTENDANCE',
      priority: 'LOW',
      status: 'New',
      impact: '-92% False Punctuality Infractions'
    },
    {
      id: 7,
      title: 'Optimize LinkedIn Agency Referrals for Senior Cloud Architects',
      description: 'Recruitment funnel conversion analytics show candidate sourcing ROI via external agencies yields a 3x higher offer acceptance rate for Level 5 engineering requisitions compared to direct job boards.',
      category: 'RECRUITMENT',
      priority: 'MEDIUM',
      status: 'Dismissed',
      impact: '-14 Days Average Time-to-Hire'
    },
    {
      id: 8,
      title: 'Enforce Automated Multi-Factor Biometric Re-Authentication',
      description: 'Security audit logs indicate 6 employees accessing payroll tax withholding ledgers from remote IPs without biometric token refresh in >12 hours. Recommend enforcing immediate re-auth.',
      category: 'EMPLOYEE',
      priority: 'CRITICAL',
      status: 'In Review',
      impact: '100% Zero-Trust SOC2 Adherence'
    }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: newStatus } : rec))
    );
    if (onToast) onToast(`Recommendation marked as "${newStatus}".`);
  };

  const handleApplyAllCritical = () => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.priority === 'CRITICAL' && rec.status !== 'Applied' ? { ...rec, status: 'Applied' } : rec))
    );
    if (onToast) onToast('All critical AI recommendations successfully applied to backend.');
  };

  const categories = ['ALL', 'ATTENDANCE', 'LEAVE', 'PAYROLL', 'EMPLOYEE', 'PROJECTS', 'PERFORMANCE', 'RECRUITMENT', 'ASSETS'];
  const priorities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const statuses = ['ALL', 'New', 'In Review', 'Applied', 'Dismissed'];

  const filtered = recommendations.filter((rec) => {
    if (selectedCategory !== 'ALL' && rec.category !== selectedCategory) return false;
    if (selectedPriority !== 'ALL' && rec.priority !== selectedPriority) return false;
    if (selectedStatus !== 'ALL' && rec.status !== selectedStatus) return false;
    if (searchQuery && !rec.title.toLowerCase().includes(searchQuery.toLowerCase()) && !rec.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Banner */}
      <Card elevation="level1" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
        <CardBody className="p-0">
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-200">
              ACTIONABLE INTELLIGENCE
            </Badge>
            <span className="text-xs font-mono text-[#737686]">Autonomous Policy Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white mt-1">
            AI Recommendations &amp; Anomaly Optimization Center
          </h2>
          <p className="text-xs text-[#737686] mt-0.5">
            Real-time proactive suggestions synthesized across all 8 EWMP domains to improve productivity, reduce expenditure, and enforce SOC2 compliance.
          </p>
        </CardBody>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary-danger"
            size="sm"
            onClick={handleApplyAllCritical}
            leftIcon={<Sparkles size={15} />}
            className="bg-rose-600 hover:bg-rose-700"
          >
            Apply All Critical (2)
          </Button>
          <Button
            onClick={() => onToast && onToast('Exporting recommendations list to Excel (.xlsx)...')}
            className="p-2.5 bg-[#faf8ff] dark:bg-[#161616] hover:bg-gray-100 border border-[#e1e2ed] dark:border-gray-800 rounded-xl text-[#191b23] dark:text-white transition-colors text-xs font-bold flex items-center gap-1"
          >
            <Download size={15} /> Export
          </Button>
        </div>
      </Card>

      {/* Multi-Factor Filter & Search Strip */}
      <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recommendations by keyword or impact..."
              className="w-full bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-[#191b23] dark:text-white focus:outline-hidden focus:border-[#2563eb]"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-[#737686]" />
          </div>

          {/* Slicer Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="text-[#737686]">Domain:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#191b23] dark:text-white focus:outline-hidden"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="text-[#737686]">Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#191b23] dark:text-white focus:outline-hidden"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="text-[#737686]">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#191b23] dark:text-white focus:outline-hidden"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Feed Grid */}
      {filtered.length === 0 ? (
        <NoRecommendations
          onResetFilter={() => {
            setSelectedCategory('ALL');
            setSelectedPriority('ALL');
            setSelectedStatus('ALL');
            setSearchQuery('');
          }}
          onGenerate={() => onToast && onToast('Running deep anomaly scan... 3 new insights found!')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((rec) => (
            <RecommendationCard
              key={rec.id}
              {...rec}
              onApply={() => handleStatusChange(rec.id, 'Applied')}
              onReview={() => handleStatusChange(rec.id, 'In Review')}
              onDismiss={() => handleStatusChange(rec.id, 'Dismissed')}
            />
          ))}
        </div>
      )}
    </div>
  );
};
