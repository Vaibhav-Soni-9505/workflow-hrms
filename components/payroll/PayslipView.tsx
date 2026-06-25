"use client";

import React from "react";
import { Download, FileText } from "lucide-react";
import { clsx } from "clsx";
import {
  useGlobalStore,
  type PayrollRecord,
  type TaxDocument,
} from "../../store/useGlobalStore";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function PayslipView() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const payrollRecords = useGlobalStore((s) => s.payrollRecords);
  const taxDocuments = useGlobalStore((s) => s.taxDocuments);

  const userPayrolls = payrollRecords.filter((p) => p.userId === activeUserId);
  const userTaxDocs = taxDocuments.filter((t) => t.userId === activeUserId);

  const latestPayroll = [...userPayrolls].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  })[0];

  const totalEarnings = latestPayroll
    ? latestPayroll.earnings.basic +
      latestPayroll.earnings.hra +
      latestPayroll.earnings.specialAllowance
    : 0;

  const totalDeductions = latestPayroll
    ? latestPayroll.deductions.tax +
      latestPayroll.deductions.pf +
      latestPayroll.deductions.esi
    : 0;

  const netPay = totalEarnings - totalDeductions;

  const handleDownloadPayslip = () => {
    alert("Payslip downloaded successfully!");
  };

  const handleDownloadDoc = (doc: TaxDocument) => {
    alert(`${doc.name} downloaded successfully!`);
  };

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText size={20} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">My Payroll</h1>
      </div>

      {/* Payslip Card */}
      {latestPayroll ? (
        <div className="glass-card rounded-2xl p-6 border border-border/50 space-y-6">
          {/* Payslip Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {MONTH_NAMES[latestPayroll.month]} {latestPayroll.year}
              </h3>
              <p className="text-sm text-foreground-muted">
                Pay Period: {MONTH_NAMES[latestPayroll.month]} 1 -{" "}
                {new Date(latestPayroll.year, latestPayroll.month, 0).getDate()}{" "}
                {latestPayroll.year}
              </p>
            </div>
            <span
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-semibold",
                latestPayroll.status === "Paid"
                  ? "bg-success/10 text-success border border-success/20"
                  : latestPayroll.status === "Approved"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : latestPayroll.status === "Processing"
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "bg-muted/50 text-foreground-muted border border-border/30",
              )}
            >
              {latestPayroll.status}
            </span>
          </div>

          {/* Earnings & Deductions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Earnings
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-muted">Basic</span>
                  <span className="text-sm font-medium text-foreground">
                    ₹{latestPayroll.earnings.basic.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-muted">HRA</span>
                  <span className="text-sm font-medium text-foreground">
                    ₹{latestPayroll.earnings.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-muted">
                    Special Allowance
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    ₹{latestPayroll.earnings.specialAllowance.toLocaleString()}
                  </span>
                </div>
                <hr className="border-border/50" />
                <div className="flex justify-between items-center font-bold">
                  <span className="text-sm text-foreground">
                    Total Earnings
                  </span>
                  <span className="text-sm text-foreground">
                    ₹{totalEarnings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Deductions
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-muted">Tax</span>
                  <span className="text-sm font-medium text-foreground">
                    ₹{latestPayroll.deductions.tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-muted">PF</span>
                  <span className="text-sm font-medium text-foreground">
                    ₹{latestPayroll.deductions.pf.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-muted">ESI</span>
                  <span className="text-sm font-medium text-foreground">
                    ₹{latestPayroll.deductions.esi.toLocaleString()}
                  </span>
                </div>
                <hr className="border-border/50" />
                <div className="flex justify-between items-center font-bold">
                  <span className="text-sm text-foreground">
                    Total Deductions
                  </span>
                  <span className="text-sm text-foreground">
                    ₹{totalDeductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="flex items-center justify-between bg-primary/10 p-4 rounded-xl border border-primary/20">
            <div>
              <p className="text-sm font-semibold text-foreground">Net Pay</p>
            </div>
            <span className="text-2xl font-black text-primary">
              ₹{netPay.toLocaleString()}
            </span>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownloadPayslip}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download Payslip
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center border border-border/50">
          <FileText size={32} className="mx-auto text-foreground-muted mb-4" />
          <p className="text-sm font-semibold text-foreground-muted">
            No payslips available
          </p>
        </div>
      )}

      {/* Tax Documents */}
      {userTaxDocs.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-border/50 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Tax Documents</h3>
          <div className="space-y-3">
            {userTaxDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-xl bg-background-tertiary/60 border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {doc.name}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {doc.type} • {doc.year}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadDoc(doc)}
                  className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/80 transition-all"
                >
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
