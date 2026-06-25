"use client";

import React, { useState, useMemo } from "react";
import { X, Plus, FileText, CreditCard, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";
import {
  useGlobalStore,
  type Reimbursement,
  type ReimbursementCategory,
  type ReimbursementStatus,
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

const STATUS_LABELS: Record<ReimbursementStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  "pending-approval": "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Paid",
};

const STATUS_BADGE_CLASSES: Record<ReimbursementStatus, string> = {
  draft: "bg-muted/10 text-muted-foreground border-muted/20",
  submitted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "pending-approval": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  paid: "bg-green-600/10 text-green-600 border-green-600/20",
};

export default function MyExpenses() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const reimbursements = useGlobalStore((s) => s.reimbursements);
  const submitExpense = useGlobalStore((s) => s.submitExpense);

  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<ReimbursementCategory>("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isTaxable, setIsTaxable] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [mileageDistance, setMileageDistance] = useState("");
  const [mileageRate, setMileageRate] = useState("1.5");

  const userExpenses = useMemo(
    () => reimbursements.filter((r) => r.userId === activeUserId),
    [reimbursements, activeUserId]
  );

  const calculateAmount = () => {
    if (category === "travel" && mileageDistance && mileageRate) {
      const dist = parseFloat(mileageDistance);
      const rate = parseFloat(mileageRate);
      return (dist * rate).toString();
    }
    return amount;
  };

  const handleSubmit = () => {
    const finalAmount = parseFloat(calculateAmount());
    if (!finalAmount || !description) return;

    submitExpense({
      category,
      amount: finalAmount,
      currency,
      date,
      description,
      isTaxable,
      receiptUrl: receiptUrl || undefined,
      mileage:
        category === "travel" && mileageDistance && mileageRate
          ? {
              distance: parseFloat(mileageDistance),
              rate: parseFloat(mileageRate),
            }
          : undefined,
    });

    setShowModal(false);
    setCategory("food");
    setDate(new Date().toISOString().split("T")[0]);
    setCurrency("USD");
    setAmount("");
    setDescription("");
    setIsTaxable(false);
    setReceiptUrl("");
    setMileageDistance("");
    setMileageRate("1.5");
  };

  const showPolicyWarning = parseFloat(calculateAmount()) > 500;

  return (
    <div className="space-y-6">
      {/* Header and Upload Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-primary" />
          <h2 className="text-lg font-bold text-foreground">My Expenses</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-dark to-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Submit Expense
        </button>
      </div>

      {/* Expenses List */}
      {userExpenses.length === 0 ? (
        <div className="glass-card rounded-xl p-6 border border-border/50 text-center">
          <FileText size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-semibold text-foreground">No expenses yet</p>
          <p className="text-xs text-foreground-muted mt-1">
            Submit your first expense to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {userExpenses.map((expense) => (
            <div
              key={expense.id}
              className="glass-card rounded-xl p-4 border border-border/50 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {CATEGORY_LABELS[expense.category]}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-foreground-muted">
                      <span>{expense.date}</span>
                      <span>•</span>
                      <span>{expense.currency} {expense.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={clsx(
                    "flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold",
                    STATUS_BADGE_CLASSES[expense.status]
                  )}
                >
                  {STATUS_LABELS[expense.status]}
                </span>
              </div>
              <p className="text-xs text-foreground-muted">{expense.description}</p>
              {expense.managerComment && (
                <div className="text-xs text-amber-600 font-medium">
                  Manager note: {expense.managerComment}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-mobile rounded-t-3xl border-t border-border/50 animate-slide-up shadow-2xl flex flex-col max-h-[88vh] mb-[68px] bg-background">
            <div className="flex-shrink-0 px-5 pt-4 pb-0">
              <div className="w-10 h-1 rounded-full bg-border/60 mx-auto mb-4" />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-5 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
              <h2 className="text-base font-black text-foreground mb-0.5">
                Submit Expense
              </h2>
              <p className="text-xs text-foreground-muted">
                Fill in the details below
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ReimbursementCategory)
                  }
                  className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  style={{ background: "var(--background-tertiary)" }}
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {category === "travel" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                      Distance (km/miles)
                    </label>
                    <input
                      type="number"
                      value={mileageDistance}
                      onChange={(e) => setMileageDistance(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                      style={{ background: "var(--background-tertiary)" }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                      Rate per km/mile
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={mileageRate}
                      onChange={(e) => setMileageRate(e.target.value)}
                      placeholder="e.g. 1.5"
                      className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                      style={{ background: "var(--background-tertiary)" }}
                    />
                  </div>
                </>
              )}

              {category !== "travel" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 45.00"
                    className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                    style={{ background: "var(--background-tertiary)" }}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  style={{ background: "var(--background-tertiary)" }}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  style={{ background: "var(--background-tertiary)" }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the expense..."
                  rows={3}
                  className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  style={{ background: "var(--background-tertiary)" }}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="taxable"
                  checked={isTaxable}
                  onChange={(e) => setIsTaxable(e.target.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label
                  htmlFor="taxable"
                  className="text-xs font-medium text-foreground"
                >
                  This expense is taxable
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Receipt (optional)
                </label>
                <input
                  type="text"
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                  placeholder="e.g. /receipts/receipt.pdf"
                  className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  style={{ background: "var(--background-tertiary)" }}
                />
              </div>

              {showPolicyWarning && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle size={16} className="text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-600 font-medium">
                    Policy Alert: Expenses over $500 require receipt attachment and additional managerial review.
                  </p>
                </div>
              )}
            </div>
            <div
              className="flex-shrink-0 px-5 pt-3 pb-6 border-t border-border/50 space-y-2"
              style={{ background: "var(--background-secondary)" }}
            >
              <button
                onClick={handleSubmit}
                disabled={
                  !calculateAmount() ||
                  !description ||
                  (category === "travel" &&
                    (!mileageDistance || !mileageRate))
                }
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
              >
                Submit Expense
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 rounded-2xl text-sm text-foreground-muted font-medium hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
