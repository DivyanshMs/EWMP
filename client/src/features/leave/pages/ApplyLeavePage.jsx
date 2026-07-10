import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Calendar, Clock, CheckCircle2, FileText, Upload, ChevronRight, ChevronLeft, Send, ShieldCheck } from 'lucide-react';
import { LeaveTypeBadge, LeaveDurationBadge } from '../components/LeaveBadges';
import { ValidationErrorBanner } from '../components/LeaveErrorStates';

/**
 * ApplyLeavePage.jsx
 * Multi-step wizard form for submitting leave requests in EWMP Leave Management.
 * Steps: 1. Type & Dates | 2. Reason & Attachments | 3. Review & Submit | Validation
 */

export const ApplyLeavePage = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'ANNUAL',
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    isHalfDay: false,
    halfDayType: 'MORNING', // MORNING | AFTERNOON
    reason: '',
    emergencyContact: '+91 98765 43210',
    attachmentName: null,
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate days difference
  const calculateDays = () => {
    if (formData.isHalfDay) return 0.5;
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRequested = calculateDays();

  const queryClient = useQueryClient();
  const { data: typesData, isLoading: typesLoading } = useQuery({
    queryKey: ['leave-types'],
    queryFn: () => api.get('/leave-types').then(res => res.data)
  });

  const applyMutation = useMutation({
    mutationFn: (payload) => api.post('/leave-requests', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['leave-requests-my']);
      queryClient.invalidateQueries(['leave-balances-my']);
      if (onSuccess) onSuccess(formData);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to submit leave request');
      setIsSubmitting(false);
    }
  });

  const leaveTypes = typesData?.data?.items || typesData?.data || [
    { id: 'ANNUAL', code: 'ANNUAL', name: 'Annual Leave' },
    { id: 'SICK', code: 'SICK', name: 'Sick Leave' },
    { id: 'CASUAL', code: 'CASUAL', name: 'Casual Leave' }
  ];


  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      if (!formData.startDate || !formData.endDate) {
        setError('Please select both Start Date and End Date.');
        return;
      }
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        setError('End Date cannot be earlier than Start Date.');
        return;
      }
      if (daysRequested > 20) {
        setError('Maximum continuous annual leave allowed without executive review is 20 days.');
        return;
      }
    } else if (step === 2) {
      if (!formData.reason || formData.reason.trim().length < 10) {
        setError('Please provide a detailed reason (at least 10 characters) for your leave.');
        return;
      }
      if (formData.type === 'SICK' && daysRequested > 2 && !formData.attachmentName) {
        setError('Medical certificate attachment is mandatory for sick leave exceeding 2 days.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const selectedType = leaveTypes.find(t => t.code === formData.type || t.id === formData.type || t._id === formData.type);
    applyMutation.mutate({
      leaveTypeId: selectedType?.id || selectedType?._id || formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isHalfDay: formData.isHalfDay,
      halfDaySession: formData.halfDayType === 'MORNING' ? 'First Half' : 'Second Half',
      reason: formData.reason
    });
  };


  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, attachmentName: file.name });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Wizard Header & Progress Bar */}
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#191b23] dark:text-white flex items-center gap-2">
              <Calendar size={20} className="text-[#2563eb]" />
              APPLY FOR LEAVE — MULTI-STEP WIZARD
            </h1>
            <p className="text-xs text-[#737686] dark:text-gray-400 mt-0.5">
              Complete the form below to submit a formal time-off request for managerial and HR authorization.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-[#ededf9] dark:bg-gray-800 text-[#2563eb] px-3 py-1 rounded">
            Step {step} of 3
          </span>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#e1e2ed] dark:border-gray-800">
          {[
            { id: 1, label: '1. Policy & Dates' },
            { id: 2, label: '2. Reason & Attachments' },
            { id: 3, label: '3. Review & Authorization' },
          ].map((item) => (
            <div
              key={item.id}
              className={`py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                step === item.id
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : step > item.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-[#faf8ff] dark:bg-gray-900 text-[#737686] border border-[#e1e2ed] dark:border-gray-800'
              }`}
            >
              {step > item.id ? <CheckCircle2 size={14} /> : <span className="font-mono">{item.id}.</span>}
              <span className="truncate">{item.label.split('. ')[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <ValidationErrorBanner message={error} onClose={() => setError(null)} />

      {/* Step 1: Leave Type & Dates */}
      {step === 1 && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800">
            STEP 1: SELECT LEAVE POLICY & SCHEDULE
          </h2>

          {/* Leave Type Selector Grid */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#434655] dark:text-gray-300 block mb-2.5">
              Select Leave Policy Allocation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { type: 'ANNUAL', name: 'Annual Leave', balance: '15 Days Available', desc: 'Paid vacation and paid time off' },
                { type: 'SICK', name: 'Sick Leave', balance: '8 Days Available', desc: 'Medical and health emergencies' },
                { type: 'CASUAL', name: 'Casual Leave', balance: '5 Days Available', desc: 'Short personal appointments' },
                { type: 'COMPENSATORY', name: 'Compensatory Leave', balance: '4 Days Available', desc: 'Earned overtime compensation' },
              ].map((policy) => {
                const isSelected = formData.type === policy.type;
                return (
                  <div
                    key={policy.type}
                    onClick={() => setFormData({ ...formData, type: policy.type })}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#2563eb]/5 dark:bg-blue-900/20 border-[#2563eb] ring-2 ring-[#2563eb]/20 shadow-xs'
                        : 'bg-[#faf8ff] dark:bg-gray-900/40 border-[#e1e2ed] dark:border-gray-800 hover:border-[#c3c6d7]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#191b23] dark:text-white">{policy.name}</span>
                        {isSelected && <CheckCircle2 size={14} className="text-[#2563eb]" />}
                      </div>
                      <p className="text-[11px] text-[#737686] leading-tight">{policy.desc}</p>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#2563eb] mt-2 block pt-2 border-t border-[#e1e2ed]/40 dark:border-gray-800/40">
                      {policy.balance}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Half Day Checkbox & Selector */}
          <div className="p-4 bg-[#faf8ff] dark:bg-gray-900/50 rounded-lg border border-[#e1e2ed] dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isHalfDay}
                onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
                className="w-4 h-4 text-[#2563eb] rounded border-gray-300 focus:ring-[#2563eb]"
              />
              <span className="text-xs font-bold text-[#191b23] dark:text-white">Apply for Half Day Leave (0.5 Day)</span>
            </label>

            {formData.isHalfDay && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#737686]">Session:</span>
                <select
                  value={formData.halfDayType}
                  onChange={(e) => setFormData({ ...formData, halfDayType: e.target.value })}
                  className="text-xs bg-white dark:bg-[#111] border border-[#c3c6d7] dark:border-gray-800 rounded px-2.5 py-1 font-semibold"
                >
                  <option value="MORNING">Morning Session (First Half)</option>
                  <option value="AFTERNOON">Afternoon Session (Second Half)</option>
                </select>
              </div>
            )}
          </div>

          {/* Date Range Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#434655] dark:text-gray-300 block mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#434655] dark:text-gray-300 block mb-1.5">
                End Date {formData.isHalfDay && <span className="text-[11px] font-normal text-[#737686]">(Same as Start Date for Half Day)</span>}
              </label>
              <input
                type="date"
                value={formData.isHalfDay ? formData.startDate : formData.endDate}
                disabled={formData.isHalfDay}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full font-mono disabled:opacity-60"
              />
            </div>
          </div>

          {/* Duration Calculation Banner */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg flex items-center justify-between text-xs text-[#2563eb] dark:text-blue-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Clock size={16} /> Total Leave Duration Calculated:
            </span>
            <span className="text-sm font-mono font-extrabold bg-white dark:bg-[#111] px-3 py-1 rounded border border-blue-200 dark:border-blue-800">
              {daysRequested} {daysRequested === 1 ? 'Day' : 'Days'} {formData.isHalfDay ? `(${formData.halfDayType})` : ''}
            </span>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-6 rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              Proceed to Step 2 <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Reason & Attachments */}
      {step === 2 && (
        <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
            <span>STEP 2: JUSTIFICATION & SUPPORTING DOCUMENTS</span>
            <LeaveTypeBadge type={formData.type} />
          </h2>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#434655] dark:text-gray-300 block mb-1.5">
              Reason for Leave (Required)
            </label>
            <textarea
              rows="4"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Provide clear details regarding your absence, handover arrangements, and availability for emergencies..."
              className="w-full"
            />
            <span className="text-[11px] text-[#737686] mt-1 block">Minimum 10 characters required for managerial review.</span>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#434655] dark:text-gray-300 block mb-1.5">
              Emergency Contact Number during Leave
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full font-mono max-w-sm"
            />
          </div>

          {/* Attachment Upload Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#434655] dark:text-gray-300 flex items-center justify-between">
              <span>Supporting Document Attachment (Optional / Medical Certificate)</span>
              {formData.type === 'SICK' && daysRequested > 2 && (
                <span className="text-rose-600 font-bold">* Mandatory for Sick Leave &gt; 2 Days</span>
              )}
            </label>

            <div className="border-2 border-dashed border-[#c3c6d7] dark:border-gray-800 hover:border-[#2563eb] rounded-lg p-6 text-center transition-all bg-[#faf8ff] dark:bg-gray-900/30">
              {formData.attachmentName ? (
                <div className="flex items-center justify-center gap-3 bg-white dark:bg-[#161616] p-3 rounded border border-[#e1e2ed] dark:border-gray-800 max-w-sm mx-auto">
                  <FileText size={20} className="text-[#2563eb] shrink-0" />
                  <span className="text-xs font-mono font-bold truncate text-[#191b23] dark:text-white">{formData.attachmentName}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attachmentName: null })}
                    className="text-rose-600 hover:text-rose-800 font-bold ml-auto"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <Upload size={24} className="text-[#737686]" />
                  <span className="text-xs font-bold text-[#191b23] dark:text-white">Click to upload document or drag and drop</span>
                  <span className="text-[11px] text-[#737686]">PDF, PNG, JPG up to 10MB (Medical prescription, invitation card, etc.)</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={handlePrevStep}
              className="bg-white dark:bg-[#161616] hover:bg-[#faf8ff] border border-[#c3c6d7] dark:border-gray-700 text-[#191b23] dark:text-white text-xs font-semibold py-2.5 px-5 rounded inline-flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft size={15} /> Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-6 rounded inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              Proceed to Step 3 <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-lg p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-[#191b23] dark:text-white pb-3 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              STEP 3: REVIEW & SUBMIT LEAVE APPLICATION
            </span>
            <span className="text-xs font-mono text-[#737686]">Final Authorization Check</span>
          </h2>

          <div className="bg-[#faf8ff] dark:bg-gray-900/50 rounded-lg border border-[#e1e2ed] dark:border-gray-800 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-[#e1e2ed]/60 dark:border-gray-800/60">
              <div>
                <span className="text-[11px] text-[#737686] block">Applicant</span>
                <strong className="text-xs font-bold text-[#191b23] dark:text-white">Sarah SDE-II (EMP-0142)</strong>
              </div>
              <div>
                <span className="text-[11px] text-[#737686] block">Department</span>
                <strong className="text-xs font-bold text-[#191b23] dark:text-white">Engineering • Frontend Team</strong>
              </div>
              <div>
                <span className="text-[11px] text-[#737686] block">Approving Manager</span>
                <strong className="text-xs font-bold text-[#2563eb]">Michael Tech Lead</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-[#e1e2ed]/60 dark:border-gray-800/60">
              <div>
                <span className="text-[11px] text-[#737686] block">Leave Policy Type</span>
                <div className="mt-0.5"><LeaveTypeBadge type={formData.type} /></div>
              </div>
              <div>
                <span className="text-[11px] text-[#737686] block">Total Duration</span>
                <div className="mt-0.5"><LeaveDurationBadge days={daysRequested} isHalfDay={formData.isHalfDay} /></div>
              </div>
              <div>
                <span className="text-[11px] text-[#737686] block">Date Range</span>
                <strong className="text-xs font-mono font-bold text-[#191b23] dark:text-white block mt-1">
                  {formData.startDate} — {formData.isHalfDay ? formData.startDate : formData.endDate}
                </strong>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#737686] block">Employee Justification / Handover Note</span>
              <p className="text-xs text-[#191b23] dark:text-gray-200 italic bg-white dark:bg-[#161616] p-3 rounded border border-[#e1e2ed]/60 dark:border-gray-800/60">
                "{formData.reason}"
              </p>
            </div>

            {formData.attachmentName && (
              <div className="flex items-center gap-2 pt-2 text-xs text-[#2563eb]">
                <FileText size={14} />
                <span>Attached Supporting Document: <strong className="font-mono">{formData.attachmentName}</strong></span>
              </div>
            )}
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">Policy Compliance Verified</strong>
              <span>Your request conforms to EWMP Annual Leave rules. Upon submission, an email and push notification will be dispatched to your reporting manager for authorization.</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={isSubmitting}
              className="bg-white dark:bg-[#161616] hover:bg-[#faf8ff] border border-[#c3c6d7] dark:border-gray-700 text-[#191b23] dark:text-white text-xs font-semibold py-2.5 px-5 rounded inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={15} /> Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold py-2.5 px-8 rounded inline-flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send size={15} /> Submit Leave Request
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
