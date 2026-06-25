"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle, XCircle, X, Shield, Users } from "lucide-react";
import { clsx } from "clsx";
import {
  useGlobalStore,
  type Reimbursement,
  type ReimbursementCategory,
} from "../../store/useGlobalStore";

const CATEGORY_LABELS: Record<ReimbursementCategory, string> = {
  travel: "Travel",
  food: "Food",
  accommodation: "Accommodation",
  communication: "Communication",
  medical: "Medical",
  "office-supplies": "Office Supplies",
  other: "Other",
};

export default function ExpenseApprovals() {
  const reimbursements = useGlobalStore((s) => s.reimbursements);
  const users = useGlobalStore((s) => s.users);
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const activeUser = useGlobalStore((s) => s.getActiveUser());
  const updateExpenseStatus = useGlobalStore((s) => s.updateExpenseStatus);

  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingExpenses = useMemo(() => {
    const pending = reimbursements.filter(
      (r) => r.status === "pending-approval"
    );

    if (activeUser.role === "Employee" || activeUser.role === "Manager") {
      return pending.filter((exp) => {
        const user = users.find((u) => u.id === exp.userId);
        return user?.managerId === activeUserId;
      });
    }

    return pending;
  }, [reimbursements, users, activeUserId, activeUser.role]);

  const getEmployeeName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown";
  };

  const handleApprove = (expenseId: string) => {
    updateExpenseStatus(expenseId, "approved");
  };

  const handleReject = (expenseId: string) => {
    if (!rejectionReason.trim()) return;
    updateExpenseStatus(expenseId, "rejected", rejectionReason);
    setShowRejectModal(null);
    setRejectionReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-primary" />
        <h2 className="text-lg font-bold text-foreground">Expense Approvals</h2>
      </div>

      {/* Pending Expenses List */}
      {pendingExpenses.length > 0 ? (
        <div className="space-y-3">
          {pendingExpenses.map((expense) => (
          <div
            key={expense.id}
            className="glass-card rounded-xl p-4 border border-border/50 space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {CATEGORY_LABELS[expense.category]}
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground-muted flex-wrap">
                  <Users size={14} />
                  <span>{getEmployeeName(expense.userId)}</span>
                  <span>•</span>
                  <span>
                    {expense.currency} {expense.amount.toFixed(2)}
                  </span>
                  <span>•</span>
                  <span>{expense.date}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-foreground-muted">{expense.description}</p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleApprove(expense.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-success/10 text-success border border-success/30 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                <CheckCircle size={16} />
                Approve
              </button>
              <button
                onClick={() => setShowRejectModal(expense.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
              >
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center border border-border/50">
          <CheckCircle size={32} className="mx-auto text-success/80 mb-4" />
          <p className="text-sm font-semibold text-foreground-muted">
            No pending expenses to approve!
          </p>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setShowRejectModal(null)}
          />
          <div className="relative w-full max-w-sm mx-4 rounded-2xl border border-border/50 animate-fade-in shadow-2xl bg-background">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">
                  Reject Expense
                </h3>
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Why are you rejecting this expense?"
                  className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  style={{ background: "var(--background-tertiary)" }}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm text-foreground-muted font-medium hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(showRejectModal)}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
