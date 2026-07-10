import React from 'react';
import { CreateEmployeeWizard } from './CreateEmployeeWizard';

/**
 * EditEmployeePage.jsx
 * Page 4: Employee record modification engine.
 * Wraps CreateEmployeeWizard with pre-filled telemetry data and active Change Tracking Badges.
 */

export const EditEmployeePage = ({ employee, onComplete, onCancel }) => {
  // Use passed employee or default David Vance
  const targetEmployee = employee || {
    id: 'EMP-1042',
    name: 'David Vance',
    dob: '1988-11-04',
    gender: 'Male',
    phone: '+1 (415) 555-0199',
    email: 'd.vance@acme.corp',
    address: '450 Spear Street, San Francisco, CA 94105',
    emergencyContact: {
      name: 'Clara Vance (Spouse)',
      phone: '+1 (415) 555-0188',
    },
    department: 'Platform Engineering',
    designation: 'Principal Systems Architect',
    manager: 'David Kim (VP Eng)',
    joiningDate: '2023-01-15',
    employmentType: 'Full-Time',
    status: 'Active',
    location: 'Silicon Valley HQ (US)',
    shift: 'Standard Morning Roster',
    salaryBase: '$245,000 / yr',
    salaryBonus: '15% Annual Target',
    payFrequency: 'Bi-Weekly Direct Deposit',
    bankName: 'Silicon Valley Commercial Bank',
    accountNumber: '**** **** **** 8842',
    routingNumber: '021000021',
    taxId: 'XXX-XX-4421',
    taxStatus: 'W-4 Standard Withholding (Single)',
    documents: [
      {
        id: 'doc-1',
        title: 'Signed Employment Agreement & NDA',
        type: 'Legal Contract',
        fileSize: '3.2 MB',
        uploadDate: '2023-01-14',
        uploadedBy: 'HR Onboarding Portal',
        status: 'Verified',
      },
    ],
  };

  return (
    <CreateEmployeeWizard
      initialData={targetEmployee}
      isEditing={true}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
};

export default EditEmployeePage;
