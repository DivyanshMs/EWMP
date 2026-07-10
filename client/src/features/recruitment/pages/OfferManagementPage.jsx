import React, { useState } from 'react';
import { DollarSign, PlusCircle, Search, Filter, ShieldCheck, RefreshCw } from 'lucide-react';
import { OfferStatusBadge } from '../components/RecruitmentBadges';
import { OfferCard } from '../components/RecruitmentCards';
import { OfferTimeline } from '../components/RecruitmentTimelines';
import { GenerateOfferModal } from '../components/RecruitmentDrawers';
import { NoOffers } from '../components/RecruitmentEmptyStates';

/**
 * OfferManagementPage.jsx
 * Formal employment offer letters, compensation packages, joining dates, and governance workflows for EWMP Recruitment.
 */

export default function OfferManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedOfferForTimeline, setSelectedOfferForTimeline] = useState(null);

  const [offers, setOffers] = useState([
    { id: 'OFF-2026-089', candidateName: 'Alex Turner', role: 'Senior Backend Systems Engineer (SDE-II)', department: 'Engineering', salary: '$145,000 / annum', bonus: '15% Bonus + 2,500 RSUs (4-year vest)', joiningDate: 'August 16, 2026', status: 'PENDING', dispatchedDate: 'July 12, 2026' },
    { id: 'OFF-2026-090', candidateName: 'Elena Rostova', role: 'Enterprise Cloud Security Architect', department: 'Engineering', salary: '$165,000 / annum', bonus: '20% Bonus + 4,000 RSUs', joiningDate: 'August 24, 2026', status: 'PENDING', dispatchedDate: 'July 12, 2026' },
    { id: 'OFF-2026-091', candidateName: 'Liam O’Connor', role: 'Principal Frontend Architect', department: 'Engineering', salary: '$170,000 / annum', bonus: '20% Bonus + 3,500 RSUs', joiningDate: 'September 1, 2026', status: 'ACCEPTED', dispatchedDate: 'July 5, 2026' },
    { id: 'OFF-2026-092', candidateName: 'Priya Sharma', role: 'Senior HR Recruiter & Specialist', department: 'HR & Ops', salary: '$110,000 / annum', bonus: '10% Bonus + Executive Healthcare', joiningDate: 'July 20, 2026', status: 'ACCEPTED', dispatchedDate: 'June 28, 2026' },
    { id: 'OFF-2026-093', candidateName: 'Marcus Brody', role: 'Product Marketing Manager', department: 'Sales', salary: '$125,000 / annum', bonus: '15% Commission Target', joiningDate: 'August 1, 2026', status: 'REJECTED', dispatchedDate: 'July 2, 2026' },
    { id: 'OFF-2026-094', candidateName: 'James Wilson', role: 'Staff Financial Analyst (FP&A)', department: 'Finance', salary: '$130,000 / annum', bonus: '12% Bonus', joiningDate: 'August 15, 2026', status: 'WITHDRAWN', dispatchedDate: 'July 1, 2026' },
  ]);

  const filteredOffers = offers.filter(o => {
    const matchesSearch = o.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (offerId, newStatus) => {
    setOffers(offers.map(o => o.id === offerId ? { ...o, status: newStatus } : o));
    alert(`Offer letter ${offerId} marked as ${newStatus}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#191b23] dark:text-white tracking-tight flex items-center gap-2">
            <DollarSign size={24} className="text-emerald-600" /> Formal Employment Offer Letters & Compensation
          </h1>
          <p className="text-xs text-[#737686] dark:text-gray-400 mt-1">
            Generate formal job offers, calibrate compensation packages against approved department budgets, track e-signature status, and manage withdrawals.
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle size={15} /> Generate Offer Letter
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl shadow-xs">
          <span className="text-xs text-[#737686] uppercase block">Active Pending Offers</span>
          <strong className="text-2xl font-extrabold text-amber-600 block mt-1">{offers.filter(o => o.status === 'PENDING').length} Letters</strong>
          <span className="text-[11px] text-[#737686]">Awaiting candidate acceptance</span>
        </div>
        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl shadow-xs">
          <span className="text-xs text-[#737686] uppercase block">Accepted This Cycle</span>
          <strong className="text-2xl font-extrabold text-emerald-600 block mt-1">{offers.filter(o => o.status === 'ACCEPTED').length} Letters</strong>
          <span className="text-[11px] text-emerald-600 font-bold">100% Onboarding workflow ready</span>
        </div>
        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl shadow-xs">
          <span className="text-xs text-[#737686] uppercase block">Declined / Rejected</span>
          <strong className="text-2xl font-extrabold text-rose-600 block mt-1">{offers.filter(o => o.status === 'REJECTED').length} Letters</strong>
          <span className="text-[11px] text-[#737686]">7.6% rejection rate</span>
        </div>
        <div className="p-4 bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl shadow-xs">
          <span className="text-xs text-[#737686] uppercase block">Withdrawn Offers</span>
          <strong className="text-2xl font-extrabold text-gray-500 block mt-1">{offers.filter(o => o.status === 'WITHDRAWN').length} Letters</strong>
          <span className="text-[11px] text-[#737686]">Budget reconfiguration</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Candidate Name, Role, or Offer Reference ID (e.g. OFF-2026-089)..."
            className="w-full pl-9 pr-4 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-hidden focus:border-[#2563eb]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded-lg font-semibold"
          >
            <option value="ALL">All Offer Statuses ({offers.length})</option>
            <option value="PENDING">⏳ Awaiting Acceptance</option>
            <option value="ACCEPTED">✓ Accepted</option>
            <option value="REJECTED">✕ Declined</option>
            <option value="WITHDRAWN">⛔ Withdrawn</option>
          </select>

          {(searchTerm || statusFilter !== 'ALL') && (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
              className="p-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white rounded-lg transition-colors"
              title="Reset Filters"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Offers List & Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredOffers.length === 0 ? (
            <NoOffers onGenerate={() => setShowGenerateModal(true)} />
          ) : (
            filteredOffers.map((offer) => (
              <div key={offer.id} onClick={() => setSelectedOfferForTimeline(offer)} className="cursor-pointer">
                <OfferCard
                  offer={offer}
                  onAccept={() => handleUpdateStatus(offer.id, 'ACCEPTED')}
                  onReject={() => handleUpdateStatus(offer.id, 'REJECTED')}
                  onWithdraw={() => handleUpdateStatus(offer.id, 'WITHDRAWN')}
                />
              </div>
            ))
          )}
        </div>

        {/* Right Column: Offer Governance Timeline */}
        <div className="space-y-6">
          <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#2563eb]" /> Offer Governance Audit
            </h3>
            <p className="text-xs text-[#737686] mb-4">
              {selectedOfferForTimeline ? `Viewing audit trail for letter ${selectedOfferForTimeline.id} (${selectedOfferForTimeline.candidateName}).` : 'Click any offer card on the left to inspect its complete governance and e-signing timeline.'}
            </p>
            <OfferTimeline />
          </div>
        </div>
      </div>

      {/* Modal */}
      <GenerateOfferModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onConfirm={(newOffer) => {
          setOffers([newOffer, ...offers]);
          alert(`Offer letter ${newOffer.id} generated and dispatched to ${newOffer.candidateName}!`);
        }}
      />
    </div>
  );
}
