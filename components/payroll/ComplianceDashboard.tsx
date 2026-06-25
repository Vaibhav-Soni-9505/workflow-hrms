'use client';

import React from 'react';
import { Shield, FileCheck, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useGlobalStore } from '../../store/useGlobalStore';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

interface StatutoryFiling {
  id: string;
  name: string;
  region: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  dueDate: string;
}

const DUMMY_STATUTORY_FILINGS: StatutoryFiling[] = [
  {
    id: 'filing-001',
    name: 'India PF Return',
    region: 'India',
    status: 'Pending',
    dueDate: '2026-06-25'
  },
  {
    id: 'filing-002',
    name: 'US Federal Tax Deposit',
    region: 'United States',
    status: 'Completed',
    dueDate: '2026-06-15'
  },
  {
    id: 'filing-003',
    name: 'India ESI Return',
    region: 'India',
    status: 'Overdue',
    dueDate: '2026-06-20'
  },
  {
    id: 'filing-004',
    name: 'Singapore CPF Contribution',
    region: 'Singapore',
    status: 'Pending',
    dueDate: '2026-06-30'
  }
];

export default function ComplianceDashboard() {
  const payrollRecords = useGlobalStore((s) => s.payrollRecords);

  // Get current month/year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter current month payroll
  const currentMonthPayroll = payrollRecords.filter(
    p => p.month === currentMonth + 1 && p.year === currentYear
  );

  // Calculate totals
  const totalPayrollCost = currentMonthPayroll.reduce((sum, p) => {
    const earnings = p.earnings.basic + p.earnings.hra + p.earnings.specialAllowance;
    return sum + earnings;
  }, 0);
  const totalPFDeducted = currentMonthPayroll.reduce((sum, p) => sum + p.deductions.pf, 0);
  const totalTaxDeducted = currentMonthPayroll.reduce((sum, p) => sum + p.deductions.tax, 0);

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Payroll & Compliance</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Payroll Cost */}
        <div className="glass-card rounded-2xl p-5 border border-border/50">
          <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">
            Total Payroll Cost
          </h4>
          <p className="text-2xl font-black text-foreground">
            ₹{totalPayrollCost.toLocaleString()}
          </p>
          <p className="text-xs text-foreground-muted mt-1">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </p>
        </div>

        {/* Total PF Deducted */}
        <div className="glass-card rounded-2xl p-5 border border-border/50">
          <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">
            Total PF Deducted
          </h4>
          <p className="text-2xl font-black text-foreground">
            ₹{totalPFDeducted.toLocaleString()}
          </p>
          <p className="text-xs text-foreground-muted mt-1">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </p>
        </div>

        {/* Total Tax Deducted */}
        <div className="glass-card rounded-2xl p-5 border border-border/50">
          <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">
            Total Tax Deducted
          </h4>
          <p className="text-2xl font-black text-foreground">
            ₹{totalTaxDeducted.toLocaleString()}
          </p>
          <p className="text-xs text-foreground-muted mt-1">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </p>
        </div>
      </div>

      {/* Statutory Filings */}
      <div className="glass-card rounded-2xl p-6 border border-border/50 space-y-4">
        <h3 className="text-lg font-bold text-foreground">Statutory Filings</h3>
        <div className="space-y-3">
          {DUMMY_STATUTORY_FILINGS.map((filing) => (
            <div
              key={filing.id}
              className="flex items-center justify-between p-4 rounded-xl bg-background-tertiary/60 border border-border/30"
            >
              <div className="flex items-center gap-4">
                {filing.status === 'Completed' ? (
                  <FileCheck size={20} className="text-success" />
                ) : filing.status === 'Overdue' ? (
                  <AlertCircle size={20} className="text-destructive" />
                ) : (
                  <Shield size={20} className="text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {filing.name} - {MONTH_NAMES[currentMonth]} {currentYear}
                  </p>
                  <p className="text-xs text-foreground-muted">{filing.region}</p>
                </div>
              </div>
              <span className={clsx(
                'px-3 py-1 rounded-full text-xs font-semibold',
                filing.status === 'Completed' ? 'bg-success/10 text-success border border-success/20' :
                filing.status === 'Overdue' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              )}>
                {filing.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
