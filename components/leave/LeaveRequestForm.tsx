'use client';

// ──────────────────────────────────────────────────────────────────────────────
// WorkFlow HRMS — LeaveRequestForm
//
// Bottom-sheet modal for submitting a leave request.
// On submit, calls addLeaveRequest() on the Zustand global store —
// no prop drilling needed for the data write.
// The `onClose` prop is kept so the parent can close the sheet.
// ──────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useMemo } from 'react';
import { X, CalendarDays, AlertCircle, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useGlobalStore, type LeaveType } from '../../store/useGlobalStore';
import { mockLeaveBalances, calcWorkingDays } from '../../lib/mock-data/leave';

// ── Constants ─────────────────────────────────────────────────────────────────

const LEAVE_TYPES: LeaveType[] = ['Casual', 'Sick', 'Privilege', 'Comp-off'];

function today() {
  return new Date().toISOString().split('T')[0];
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export default function LeaveRequestForm({ onClose }: Props) {
  const addLeaveRequest = useGlobalStore((s) => s.addLeaveRequest);

  const [leaveType,  setLeaveType]  = useState<LeaveType>('Casual');
  const [startDate,  setStartDate]  = useState('');
  const [endDate,    setEndDate]    = useState('');
  const [reason,     setReason]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const totalDays = useMemo(
    () => (startDate && endDate ? calcWorkingDays(startDate, endDate) : 0),
    [startDate, endDate]
  );

  const balance   = mockLeaveBalances.find((b) => b.leaveType === leaveType);
  const available = balance?.available ?? 0;
  const exceeds   = totalDays > 0 && totalDays > available;
  const canSubmit = !exceeds && totalDays > 0 && reason.trim().length >= 10;

  // ── Submit ───────────────────────────────────────────────────────────────────
  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);

    setTimeout(() => {
      addLeaveRequest({ leaveType, startDate, endDate, totalDays, reason });
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(onClose, 1400);
    }, 800);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />

      {/* Sheet */}
      <div
        className="relative w-full max-w-mobile rounded-t-3xl border-t border-border/50 animate-slide-up shadow-xl flex flex-col max-h-[88vh] mb-[68px]"
        style={{ background: 'var(--background-secondary)' }}
      >
        {/* Handle */}
        <div className="flex-shrink-0 px-5 pt-4 pb-0">
          <div className="w-10 h-1 rounded-full bg-border/60 mx-auto mb-4" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-5 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
          >
            <X size={15} />
          </button>

          <h2 className="text-base font-black text-foreground mb-0.5">Apply for Leave</h2>
          <p className="text-xs text-foreground-muted">Fill in the details below</p>
        </div>

        {/* ── Scrollable form body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Leave Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Leave Type</label>
            <div className="relative">
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full appearance-none rounded-xl border border-border/50 px-3.5 py-2.5 text-sm font-medium text-foreground pr-9 focus:outline-none focus:border-primary/60 transition-colors"
                style={{ background: 'var(--background-tertiary)' }}
              >
                {LEAVE_TYPES.map((t) => {
                  const bal = mockLeaveBalances.find((b) => b.leaveType === t);
                  return (
                    <option key={t} value={t}>
                      {t} ({bal?.available ?? 0} days left)
                    </option>
                  );
                })}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
            </div>
          </div>

          {/* Dates row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Start Date</label>
              <input
                type="date"
                value={startDate}
                min={today()}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value > endDate) setEndDate('');
                }}
                className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                style={{ background: 'var(--background-tertiary)' }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate || today()}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                style={{ background: 'var(--background-tertiary)' }}
              />
            </div>
          </div>

          {/* Day count + validation */}
          {totalDays > 0 && (
            <div className={clsx(
              'flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs transition-all duration-200',
              exceeds
                ? 'bg-destructive/10 border-destructive/30 text-destructive'
                : 'bg-success/10 border-success/30 text-success'
            )}>
              {exceeds
                ? <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                : <CalendarDays size={14} className="flex-shrink-0 mt-0.5" />
              }
              <div>
                <p className="font-semibold">
                  {totalDays} working day{totalDays !== 1 ? 's' : ''}
                </p>
                {exceeds && (
                  <p className="text-[10px] mt-0.5 opacity-80">
                    Exceeds available balance of {available} day{available !== 1 ? 's' : ''}. Reduce the date range.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              Reason <span className="normal-case font-normal">(min. 10 characters)</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              placeholder="Briefly describe your reason for leave…"
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-border/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 resize-none focus:outline-none focus:border-primary/60 transition-colors leading-relaxed"
              style={{ background: 'var(--background-tertiary)' }}
            />
            <p className={clsx(
              'text-right text-[10px] transition-colors',
              reason.length < 10 ? 'text-foreground-muted' : 'text-success'
            )}>
              {reason.length} / 10+
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 px-5 pt-3 pb-6 border-t border-border/50 space-y-2" style={{ background: 'var(--background-secondary)' }}>
          {submitted ? (
            <div className="w-full py-3.5 rounded-2xl bg-success/15 border border-success/30 text-success font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              Request Submitted!
            </div>
          ) : (
            <button
              id="leave-submit-btn"
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
              className={clsx(
                'w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all',
                canSubmit && !submitting
                  ? 'bg-gradient-to-r from-primary-dark to-primary text-white teal-glow hover:opacity-90 active:scale-95'
                  : 'bg-muted/50 text-foreground-muted cursor-not-allowed'
              )}
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting…</>
              ) : (
                'Submit Leave Request'
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl text-sm text-foreground-muted font-medium hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
