/**
 * calculateSalary.js
 * Salary Computation Utility
 */

const calculateSalary = (params) => {
  const {
    basicSalary = 0,
    salaryStructure = {},
    totalWorkingDays = 30,
    presentDays = 0,
    leaveDays = 0, // Paid leave
    overtimeHours = 0,
  } = params;

  // Compute absent days (loss of pay)
  const absentDays = Math.max(0, totalWorkingDays - presentDays - leaveDays);

  // Compute Allowances based on structure percentages
  const hra = basicSalary * ((salaryStructure.hraPercent || 0) / 100);
  const da = basicSalary * ((salaryStructure.daPercent || 0) / 100);
  const medicalAllowance = salaryStructure.medicalAllowance || 0;
  const travelAllowance = salaryStructure.travelAllowance || 0;

  // Base Gross without deductions or overtime
  const baseGross = basicSalary + hra + da + medicalAllowance + travelAllowance;
  
  // Per Day/Hour calculations
  const perDaySalary = totalWorkingDays > 0 ? baseGross / totalWorkingDays : 0;
  const perHourSalary = perDaySalary / 8; // Assuming 8-hour workday

  // Overtime Pay (standard 1.5x)
  const overtimePay = overtimeHours * (perHourSalary * 1.5);
  const bonus = 0; // Handled separately if needed

  // Total Gross Salary
  const grossSalary = baseGross + overtimePay + bonus;

  // Deductions
  const pfDeduction = basicSalary * ((salaryStructure.pfPercent || 12) / 100);
  const professionalTax = salaryStructure.professionalTax || 200;
  const incomeTax = 0; // Usually calculated externally or via tax slabs, 0 for basic
  
  // Leave Deduction (Loss of Pay)
  const leaveDayDeduction = absentDays * perDaySalary;
  
  const otherDeductions = 0;

  const totalDeductions = pfDeduction + professionalTax + incomeTax + leaveDayDeduction + otherDeductions;

  // Net Salary
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    basicSalary,
    hra,
    da,
    medicalAllowance,
    travelAllowance,
    overtimePay,
    bonus,
    grossSalary,
    pfDeduction,
    professionalTax,
    incomeTax,
    leaveDayDeduction,
    otherDeductions,
    totalDeductions,
    netSalary,
    workingDays: totalWorkingDays,
    presentDays,
    leaveDays,
    absentDays,
    overtimeHours,
  };
};

module.exports = { calculateSalary };
