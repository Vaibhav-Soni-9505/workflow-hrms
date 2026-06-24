'use client';

// ──────────────────────────────────────────────────────────────────────────────
// WorkFlow HRMS — MyLeaveHistory
//
// Self-contained component. Reads leaveRequests + activeUserId from the
// Zustand global store and filters to show only the active user's own requests.
// No props required.
// ──────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { ClipboardList } from 'lucide-react';
import { clsx } from 'clsx';
import { useGlobalStore, type LeaveRequest, type LeaveStatus, type LeaveType } from '../../store/useGlobalStore';

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeaveStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  Pending:  { label: 'Pending',  bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20',   dot: 'bg-amber-400'  },
  Approved: { label: 'Approved', bg: 'bg-success/10',     text: 'text-success',     border: 'border-success/20',     dot: 'bg-success'    },
  Rejected: { label: 'Rejected', bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20', dot: 'bg-destructive' },
};

const TYPE_COLOR: Record<LeaveType, string> = {
  Casual:    'text-teal-400',
  Sick:      'text-rose-400',
  Privilege: 'text-violet-400',
  'Comp-off':'text-amber-400',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

// ── Row ───────────────────────────────────────────────────────────────────────

function RequestRow({ req, delay }: { req: LeaveRequest; delay: number }) {
  const st = STATUS_CONFIG[req.status];

  return (
    <div
      className="glass-card rounded-2xl p-3.5 flex items-center gap-3 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Leave type icon block */}
      <div className="w-9 h-9 rounded-xl bg-background-tertiary/60 flex items-center justify-center flex-shrink-0 border border-border/30">
        <span className={clsx('text-[10px] font-black', TYPE_COLOR[req.leaveType])}>
          {req.leaveType.slice(0, 2).toUpperCase()}
        </span>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className={clsx('text-xs font-bold', TYPE_COLOR[req.leaveType])}>{req.leaveType}</p>
          <span className="text-foreground-muted/40 text-[10px]">·</span>
          <p className="text-[10px] text-foreground-muted">{req.totalDays} day{req.totalDays !== 1 ? 's' : ''}</p>
        </div>
        <p className="text-[11px] text-foreground font-medium truncate">
          {fmtDate(req.startDate)}
          {req.startDate !== req.endDate && ` → ${fmtDate(req.endDate)}`}
        </p>
        <p className="text-[9px] text-foreground-muted/60 mt-0.5 truncate">{req.reason}</p>
      </div>

      {/* Status badge */}
      <span className={clsx(
        'flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-xl border flex-shrink-0',
        st.bg, st.text, st.border
      )}>
        <span className={clsx('w-1.5 h-1.5 rounded-full', st.dot)} />
        {st.label}
      </span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MyLeaveHistory() {
  const { leaveRequests, activeUserId } = useGlobalStore();

  // Relational filter: only show this user's own requests
  const myRequests = leaveRequests.filter((r) => r.userId === activeUserId);

  if (myRequests.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center border border-border/30">
        <ClipboardList size={28} className="text-foreground-muted/40 mx-auto mb-3" />
        <p className="text-sm font-semibold text-foreground-muted">No leave requests yet</p>
        <p className="text-xs text-foreground-muted/60 mt-1">Your submitted requests will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <ClipboardList size={14} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">My Requests</h3>
        </div>
        <span className="text-[10px] text-foreground-muted">{myRequests.length} total</span>
      </div>

      {/* List */}
      <div className="space-y-2">
        {myRequests.map((r, i) => (
          <RequestRow key={r.id} req={r} delay={i * 50} />
        ))}
      </div>
    </div>
  );
}
