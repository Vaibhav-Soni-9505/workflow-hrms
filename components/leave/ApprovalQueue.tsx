"use client";

// ──────────────────────────────────────────────────────────────────────────────
// WorkFlow HRMS — ApprovalQueue
//
// Self-contained component. Reads from the Zustand global store.
//
// Filtering logic (relational):
//   Manager → show requests from users whose managerId === activeUserId
//   HR / Admin → show ALL pending requests company-wide
//
// Action buttons call updateLeaveStatus(id, status) directly on the store.
// No props required.
// ──────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import {
  useGlobalStore,
  type LeaveRequest,
  type LeaveStatus,
  type LeaveType,
} from "../../store/useGlobalStore";

// ── Config ────────────────────────────────────────────────────────────────────

const TYPE_COLOR: Record<
  LeaveType,
  { bg: string; text: string; border: string }
> = {
  Casual: {
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    border: "border-teal-500/20",
  },
  Sick: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
  },
  Privilege: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
  },
  "Comp-off": {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
};

const AVATAR_COLORS = [
  "bg-teal-500/20 text-teal-300",
  "bg-violet-500/20 text-violet-300",
  "bg-rose-500/20 text-rose-300",
  "bg-amber-500/20 text-amber-300",
  "bg-blue-500/20 text-blue-300",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

// ── Approval Card ─────────────────────────────────────────────────────────────

interface CardProps {
  req: LeaveRequest;
  userName: string;
  userDesig: string;
  userAvatar: string;
  idx: number;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function ApprovalCard({
  req,
  userName,
  userDesig,
  userAvatar,
  idx,
  onApprove,
  onReject,
}: CardProps) {
  const tc = TYPE_COLOR[req.leaveType];
  const avc = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const isPending = req.status === "Pending";
  const isApproved = req.status === "Approved";

  return (
    <div
      className={clsx(
        "glass-card rounded-2xl p-4 space-y-3 animate-slide-up transition-all duration-300 border",
        isApproved
          ? "border-success/30 bg-success/5"
          : req.status === "Rejected"
            ? "border-destructive/20 opacity-60"
            : "border-border/30",
      )}
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {/* Employee info row */}
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0",
            avc,
          )}
        >
          {userAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">
            {userName}
          </p>
          <p className="text-[10px] text-foreground-muted truncate">
            {userDesig}
          </p>
        </div>
        <span
          className={clsx(
            "text-[9px] font-bold px-2 py-1 rounded-xl border",
            tc.bg,
            tc.text,
            tc.border,
          )}
        >
          {req.leaveType}
        </span>
      </div>

      {/* Date + days */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-background-tertiary/60 rounded-xl px-2.5 py-1.5 border border-border/30">
          <Clock size={11} className="text-foreground-muted" />
          <span className="text-[11px] font-semibold text-foreground">
            {fmtDate(req.startDate)}
            {req.startDate !== req.endDate && ` – ${fmtDate(req.endDate)}`}
          </span>
        </div>
        <span className="text-[10px] font-black text-foreground-muted bg-background-tertiary/40 px-2 py-1 rounded-lg border border-border/20">
          {req.totalDays}d
        </span>
        <span className="text-[9px] text-foreground-muted/60 ml-auto">
          Applied {fmtDate(req.appliedOn)}
        </span>
      </div>

      {/* Reason */}
      <p className="text-[11px] text-foreground-muted leading-relaxed line-clamp-2 px-0.5">
        "{req.reason}"
      </p>

      {/* Approved by badge */}
      {isApproved && req.approvedBy && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success/10 border border-success/20 text-xs font-semibold text-success">
          <CheckCircle2 size={11} /> Approved by {req.approvedBy}
        </div>
      )}

      {/* Action row */}
      {isPending ? (
        <div className="flex gap-2">
          <button
            id={`approve-${req.id}`}
            onClick={() => onApprove(req.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-success/15 border border-success/30 text-success text-xs font-bold hover:bg-success/25 active:scale-95 transition-all"
          >
            <Check size={13} /> Approve
          </button>
          <button
            id={`reject-${req.id}`}
            onClick={() => onReject(req.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive/20 active:scale-95 transition-all"
          >
            <X size={13} /> Reject
          </button>
        </div>
      ) : (
        <div
          className={clsx(
            "flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold",
            isApproved
              ? "bg-success/10 border-success/20 text-success"
              : "bg-destructive/10 border-destructive/20 text-destructive",
          )}
        >
          {isApproved ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
          {isApproved ? "Approved" : "Rejected"}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ApprovalQueue() {
  const { users, activeUserId, leaveRequests, updateLeaveStatus } =
    useGlobalStore();

  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];
  const isHROrAdmin = activeUser.role === "HR" || activeUser.role === "Admin";

  // ── Relational filter ──────────────────────────────────────────────────────
  // Manager: requests from users whose managerId === activeUserId
  // HR/Admin: all requests (company-wide visibility)
  const visibleRequests = leaveRequests.filter((req) => {
    const requester = users.find((u) => u.id === req.userId);
    if (!requester) return false;
    if (isHROrAdmin) return true; // HR/Admin: see all
    return requester.managerId === activeUserId; // Manager: see direct reports
  });

  const pending = visibleRequests.filter((r) => r.status === "Pending").length;
  const approved = visibleRequests.filter(
    (r) => r.status === "Approved",
  ).length;
  const rejected = visibleRequests.filter(
    (r) => r.status === "Rejected",
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Approval Queue</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {pending > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle size={9} /> {pending} pending
            </span>
          )}
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-2">
        {[
          {
            label: "Pending",
            val: pending,
            style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          },
          {
            label: "Approved",
            val: approved,
            style: "bg-success/10 text-success border-success/20",
          },
          {
            label: "Rejected",
            val: rejected,
            style: "bg-destructive/10 text-destructive border-destructive/20",
          },
        ].map(({ label, val, style }) => (
          <div
            key={label}
            className={clsx(
              "flex-1 flex flex-col items-center py-2 rounded-xl border text-center",
              style,
            )}
          >
            <span className="text-base font-black">{val}</span>
            <span className="text-[9px] font-semibold opacity-70">{label}</span>
          </div>
        ))}
      </div>

      {/* Card list */}
      {visibleRequests.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center border border-border/30">
          <CheckCircle2 size={28} className="text-success/50 mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground-muted">
            All caught up!
          </p>
          <p className="text-xs text-foreground-muted/60 mt-1">
            No leave requests to review right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleRequests.map((req, i) => {
            const requester = users.find((u) => u.id === req.userId);
            return (
              <ApprovalCard
                key={req.id}
                req={req}
                idx={i}
                userName={requester?.name ?? "Unknown"}
                userDesig={requester?.designation ?? ""}
                userAvatar={requester?.avatar ?? "??"}
                onApprove={(id) =>
                  updateLeaveStatus(id, "Approved", activeUser.name)
                }
                onReject={(id) => updateLeaveStatus(id, "Rejected")}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
