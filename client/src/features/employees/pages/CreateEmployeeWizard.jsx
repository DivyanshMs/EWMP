import React, { useState } from 'react';
import { User, Briefcase, DollarSign, FileText, CheckCircle2, ChevronRight, ChevronLeft, Upload, Phone, Sparkles } from 'lucide-react';

import { EmployeeDocumentCard } from '../components/EmployeeDocumentCard';
import { EmployeeValidationError } from '../components/EmployeeErrorStates';
import { StatusBadge, EmploymentBadge, DepartmentBadge } from '../components/EmployeeBadges';

/**
 * CreateEmployeeWizard.jsx
 * Page 2 & 4: Multi-step enterprise onboarding wizard for EWMP.
 * Guides HR Managers through 5 sequential stages:
 * Step 1: Personal Info | Step 2: Employment Info | Step 3: Salary Info | Step 4: Documents | Step 5: Review & Submit.
 * Supports Change Tracking Badges when used in Edit Mode (isEditing = true).
 */

export const CreateEmployeeWizard = ({
  initialData = null,
  isEditing = false,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState([]);

  // Form State initialized with realistic defaults or edit props
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    name: initialData?.name || 'Alexander Wright',
    dob: initialData?.dob || '1992-05-18',
    gender: initialData?.gender || 'Male',
    phone: initialData?.phone || '+1 (415) 555-0188',
    email: initialData?.email || 'a.wright@acme.corp',
    address: initialData?.address || '450 Spear Street, Apt 1204, San Francisco, CA 94105',
    emergencyContactName: initialData?.emergencyContact?.name || 'Sophia Wright (Spouse)',
    emergencyContactPhone: initialData?.emergencyContact?.phone || '+1 (415) 555-0189',

    // Step 2: Employment Info
    employeeId: initialData?.id || 'EMP-1050',
    department: initialData?.department || 'Platform Engineering',
    designation: initialData?.designation || 'Senior Cloud Infrastructure Architect',
    manager: initialData?.manager || 'David Kim (VP Eng)',
    joiningDate: initialData?.joiningDate || '2026-07-15',
    employmentType: initialData?.employmentType || 'Full-Time',
    status: initialData?.status || 'Probation',
    location: initialData?.location || 'Silicon Valley HQ (US)',
    shift: initialData?.shift || 'Standard Morning Roster',

    // Step 3: Salary Info
    salaryBase: initialData?.salaryBase || '$210,000',
    salaryBonus: initialData?.salaryBonus || '15% Annual Target',
    payFrequency: initialData?.payFrequency || 'Bi-Weekly Direct Deposit',
    bankName: initialData?.bankName || 'Silicon Valley Commercial Bank',
    accountNumber: initialData?.accountNumber || '**** **** **** 8842',
    routingNumber: initialData?.routingNumber || '021000021',
    taxId: initialData?.taxId || 'XXX-XX-4421',
    taxStatus: initialData?.taxStatus || 'W-4 Standard Withholding (Single)',

    // Step 4: Documents
    documents: initialData?.documents || [
      {
        id: 'doc-1',
        title: 'Signed Employment Agreement & NDA',
        type: 'Legal Contract',
        fileSize: '3.2 MB',
        uploadDate: '2026-07-01',
        uploadedBy: 'HR Onboarding Portal',
        status: 'Verified',
      },
      {
        id: 'doc-2',
        title: 'Government Passport / Form I-9 Verification',
        type: 'ID Proof',
        fileSize: '1.8 MB',
        uploadDate: '2026-07-02',
        uploadedBy: 'Alexander Wright',
        status: 'Verified',
      },
      {
        id: 'doc-3',
        title: 'Form W-4 Employee Withholding Certificate',
        type: 'Tax Document',
        fileSize: '840 KB',
        uploadDate: '2026-07-03',
        uploadedBy: 'Alexander Wright',
        status: 'Pending',
      },
    ],
  });

  const steps = [
    { id: 1, label: 'Personal Information', icon: User, desc: 'Identity, demographics & contacts' },
    { id: 2, label: 'Employment Details', icon: Briefcase, desc: 'Hierarchy, department & shift' },
    { id: 3, label: 'Salary & Compensation', icon: DollarSign, desc: 'Structure, bank & tax data' },
    { id: 4, label: 'Legal Documents', icon: FileText, desc: 'Contracts, IDs & certificates' },
    { id: 5, label: 'Review & Submit', icon: CheckCircle2, desc: 'Final verification audit' },
  ];

  const handleNext = () => {
    // Step validation simulation
    const errs = [];
    if (currentStep === 1) {
      if (!formData.name.trim()) errs.push('Full legal name is required.');
      if (!formData.email.trim()) errs.push('Official email address is required.');
    } else if (currentStep === 2) {
      if (!formData.employeeId.trim()) errs.push('Unique Employee ID is mandatory.');
    }

    if (errs.length > 0) {
      setValidationErrors(errs);
      return;
    }

    setValidationErrors([]);
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setValidationErrors([]);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileUploadSim = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: 'Background Check Verification Certificate',
      type: 'Compliance Certificate',
      fileSize: '1.4 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'HR Compliance Officer',
      status: 'Verified',
    };
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in font-sans pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>EWMP HR Platform</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {isEditing ? 'Employee Record Modification' : 'Workforce Onboarding Wizard'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            {isEditing ? <Sparkles className="text-amber-500" size={28} /> : <User className="text-blue-600" size={28} />}
            {isEditing ? `Edit Profile: ${formData.name}` : 'Onboard New Employee'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {isEditing
              ? 'Modify existing lifecycle records, update salary ladders, or reassign reporting hierarchy with immutable change tracking.'
              : 'Complete the 5-step enterprise onboarding procedure to provision credentials, assign rosters, and configure payroll withholdings.'}
          </p>
        </div>

        {isEditing && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold shrink-0">
            <Sparkles size={14} />
            Change Tracking Enabled
          </span>
        )}
      </div>

      {/* 2. Step Progress Indicator Bar */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-4 sm:p-6 shadow-2xs overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[700px]">
          {steps.map((st, idx) => {
            const IconComp = st.icon;
            const isCompleted = currentStep > st.id;
            const isCurrent = currentStep === st.id;

            return (
              <React.Fragment key={st.id}>
                <div
                  onClick={() => st.id < currentStep && setCurrentStep(st.id)}
                  className={`flex items-center gap-3 cursor-pointer group transition-all ${
                    isCurrent ? 'opacity-100 scale-105' : isCompleted ? 'opacity-90' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : <IconComp size={20} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-gray-400 block">
                      Step 0{st.id}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm block">
                      {st.label}
                    </span>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-blue-600 transition-all duration-300 ${
                        isCompleted ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. Validation Error Alert */}
      <EmployeeValidationError errors={validationErrors} onDismiss={() => setValidationErrors([])} />

      {/* 4. Wizard Step Bodies */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Step 1: Personal Demographics &amp; Contact Telemetry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Full Legal Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
                />
                {isEditing && <span className="text-[10px] font-mono text-amber-600">Original: David Vance</span>}
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Gender Identity</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Official Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Mobile Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Permanent Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Emergency Contact Person</label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: EMPLOYMENT INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <Briefcase size={20} className="text-indigo-600" />
              Step 2: Structural Hierarchy &amp; Employment Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Employee ID Code *</label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-mono font-bold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Assigned Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Platform Engineering">Platform Engineering</option>
                  <option value="Global Enterprise Sales">Global Enterprise Sales</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Corporate Finance">Corporate Finance</option>
                  <option value="Global Operations">Global Operations</option>
                  <option value="Product Design">Product Design</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Job Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Reporting Manager</label>
                <select
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="David Kim (VP Eng)">David Kim (VP Eng)</option>
                  <option value="Marcus Brody (COO)">Marcus Brody (COO)</option>
                  <option value="Sarah Jenkins (HR VP)">Sarah Jenkins (HR VP)</option>
                  <option value="David Vance (Principal)">David Vance (Principal)</option>
                  <option value="Board of Directors">Board of Directors</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Joining Date</label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Full-Time">Full-Time Regular</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contractor">Independent Contractor</option>
                  <option value="Intern">Intern / Trainee</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Contract Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Probation">Probation (Onboarding)</option>
                  <option value="Active">Active Regular</option>
                  <option value="Notice">Notice Period</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Base Office Location</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Silicon Valley HQ (US)">Silicon Valley HQ (US)</option>
                  <option value="London Innovation Hub (UK)">London Innovation Hub (UK)</option>
                  <option value="Singapore APAC Tower (SG)">Singapore APAC Tower (SG)</option>
                  <option value="Austin Engineering Annex (US)">Austin Engineering Annex (US)</option>
                  <option value="Tokyo R&D Satellite (JP)">Tokyo R&D Satellite (JP)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Assigned Shift Roster</label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard Morning Roster">Standard Morning Roster</option>
                  <option value="Executive Flexible Core Hours">Executive Flexible Core Hours</option>
                  <option value="APAC Evening Support Roster">APAC Evening Support Roster</option>
                  <option value="Global Night SRE Roster">Global Night SRE Roster</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SALARY & COMPENSATION */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-600" />
              Step 3: Salary Structures, Banking &amp; Tax Withholding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Annual Base Salary / Rate</label>
                <input
                  type="text"
                  value={formData.salaryBase}
                  onChange={(e) => setFormData({ ...formData, salaryBase: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-mono font-bold text-emerald-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Target Bonus / Variable Pay</label>
                <input
                  type="text"
                  value={formData.salaryBonus}
                  onChange={(e) => setFormData({ ...formData, salaryBonus: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Pay Frequency</label>
                <select
                  value={formData.payFrequency}
                  onChange={(e) => setFormData({ ...formData, payFrequency: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bi-Weekly Direct Deposit">Bi-Weekly Direct Deposit</option>
                  <option value="Monthly Direct Deposit">Monthly Direct Deposit</option>
                  <option value="Weekly Contractor Disbursement">Weekly Contractor Disbursement</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Disbursement Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Bank Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Routing / ABA Number</label>
                <input
                  type="text"
                  value={formData.routingNumber}
                  onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Social Security / Tax ID</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block font-bold text-gray-700 dark:text-gray-300">Withholding Status &amp; Allowances</label>
                <input
                  type="text"
                  value={formData.taxStatus}
                  onChange={(e) => setFormData({ ...formData, taxStatus: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: LEGAL DOCUMENTS & VERIFICATION */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-purple-600" />
                Step 4: Digital Contract Vault &amp; Verification Audit
              </h3>
              <button
                onClick={handleFileUploadSim}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Upload size={14} />
                <span>Simulate Document Upload</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.documents.map((doc) => (
                <EmployeeDocumentCard
                  key={doc.id}
                  document={doc}
                  onPreview={(d) => alert(`Previewing document: ${d.title}`)}
                  onDownload={(d) => alert(`Downloading verified file: ${d.title}`)}
                  onDelete={(d) => {
                    if (window.confirm(`Remove attached document: ${d.title}?`)) {
                      setFormData({
                        ...formData,
                        documents: formData.documents.filter((x) => x.id !== d.id),
                      });
                    }
                  }}
                  onVerify={(d) => {
                    setFormData({
                      ...formData,
                      documents: formData.documents.map((x) =>
                        x.id === d.id ? { ...x, status: 'Verified' } : x
                      ),
                    });
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & SUBMIT */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-base">Ready for Enterprise Lifecycle Provisioning</h4>
                <p className="text-xs sm:text-sm opacity-90">
                  All personal demographics, salary withholding structures, and contract verifications have passed pre-onboarding compliance checks.
                </p>
              </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-3xl border border-gray-100 dark:border-gray-800 space-y-3">
                <h5 className="font-extrabold text-blue-600 uppercase text-xs tracking-wider flex items-center gap-1.5">
                  <User size={15} />
                  1. Personal Demographics
                </h5>
                <div className="space-y-1.5 text-gray-700 dark:text-gray-300 font-medium">
                  <div><strong>Name:</strong> {formData.name}</div>
                  <div><strong>Email:</strong> <span className="font-mono">{formData.email}</span></div>
                  <div><strong>Phone:</strong> <span className="font-mono">{formData.phone}</span></div>
                  <div><strong>Address:</strong> {formData.address}</div>
                  <div><strong>Emergency:</strong> {formData.emergencyContactName} ({formData.emergencyContactPhone})</div>
                </div>
              </div>

              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-3xl border border-gray-100 dark:border-gray-800 space-y-3">
                <h5 className="font-extrabold text-indigo-600 uppercase text-xs tracking-wider flex items-center gap-1.5">
                  <Briefcase size={15} />
                  2. Employment &amp; Hierarchy
                </h5>
                <div className="space-y-1.5 text-gray-700 dark:text-gray-300 font-medium">
                  <div><strong>ID Code:</strong> <span className="font-mono font-bold text-blue-600">{formData.employeeId}</span></div>
                  <div><strong>Department:</strong> {formData.department}</div>
                  <div><strong>Title:</strong> {formData.designation}</div>
                  <div><strong>Reports To:</strong> {formData.manager}</div>
                  <div><strong>Location:</strong> {formData.location}</div>
                  <div><strong>Shift Roster:</strong> {formData.shift}</div>
                </div>
              </div>

              <div className="p-5 bg-gray-50 dark:bg-[#161616] rounded-3xl border border-gray-100 dark:border-gray-800 space-y-3">
                <h5 className="font-extrabold text-emerald-600 uppercase text-xs tracking-wider flex items-center gap-1.5">
                  <DollarSign size={15} />
                  3. Salary &amp; Tax Structure
                </h5>
                <div className="space-y-1.5 text-gray-700 dark:text-gray-300 font-medium">
                  <div><strong>Base Pay:</strong> <span className="font-mono font-bold text-emerald-600">{formData.salaryBase}</span></div>
                  <div><strong>Bonus:</strong> {formData.salaryBonus}</div>
                  <div><strong>Bank Name:</strong> {formData.bankName}</div>
                  <div><strong>Account:</strong> <span className="font-mono">{formData.accountNumber}</span></div>
                  <div><strong>Withholding:</strong> {formData.taxStatus}</div>
                  <div><strong>Documents:</strong> {formData.documents.length} verified file(s) attached</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
          <button
            onClick={currentStep === 1 ? onCancel : handlePrev}
            className="px-6 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            <span>{currentStep === 1 ? 'Cancel & Exit' : 'Previous Step'}</span>
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <span>Proceed to Step 0{currentStep + 1}</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => {
                  alert(isEditing ? 'Employee profile revisions committed successfully!' : 'New employee onboarded & provisioned successfully!');
                  if (onComplete) onComplete(formData);
                }}
                className="px-10 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 size={18} />
                <span>{isEditing ? 'Commit Changes & Re-Audit' : 'Submit & Provision Record'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeWizard;
