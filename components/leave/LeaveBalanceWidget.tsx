"use client";

import React from "react";
import { Umbrella, HeartPulse, Star, Repeat } from "lucide-react";
import { clsx } from "clsx";
import {
  useGlobalStore,
  type LeaveBalance,
  type LeaveType,
} from "../../store/useGlobalStore";

// ── Leave type metadata ───────────────────────────────────────────────────────

const TYPE_META: Record<
  LeaveType,
  {
    icon: React.ElementType;
    gradient: string;
    iconColor: string;
    ringColor: string;
  }
> = {
  Casual: {
    icon: Umbrella,
    gradient: "from-teal-500/20 to-teal-500/5",
    iconColor: "text-teal-400",
    ringColor: "border-teal-500/30",
  },
  Sick: {
    icon: HeartPulse,
    gradient: "from-rose-500/20 to-rose-500/5",
    iconColor: "text-rose-400",
    ringColor: "border-rose-500/30",
  },
  Privilege: {
    icon: Star,
    gradient: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
    ringColor: "border-violet-500/30",
  },
  "Comp-off": {
    icon: Repeat,
    gradient: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
    ringColor: "border-amber-500/30",
  },
};

// ── Balance Card ──────────────────────────────────────────────────────────────

function BalanceCard({
  balance,
  delay,
}: {
  balance: LeaveBalance;
  delay: number;
}) {
  const meta = TYPE_META[balance.leaveType];
  const Icon = meta.icon;
  const usedPct = balance.total > 0 ? (balance.used / balance.total) * 100 : 0;

  return (
    <div
      className={clsx(
        "relative rounded-2xl border p-4 flex flex-col gap-3 animate-slide-up overflow-hidden",
        meta.ringColor,
        `bg-gradient-to-br ${meta.gradient}`,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          className={clsx(
            "w-8 h-8 rounded-xl border flex items-center justify-center",
            meta.ringColor,
            "bg-background-secondary/60",
          )}
        >
          <Icon size={15} className={meta.iconColor} />
        </div>
        {/* Available badge */}
        <span
          className={clsx(
            "text-[10px] font-black px-2 py-0.5 rounded-full border",
            meta.iconColor,
            meta.ringColor,
            "bg-background-secondary/40",
          )}
        >
          {balance.available} left
        </span>
      </div>

      {/* Leave type name */}
      <div>
        <p className="text-sm font-black text-foreground">
          {balance.leaveType}
        </p>
        <p className="text-[10px] text-foreground-muted">
          {balance.total} days total
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-background-secondary/60 rounded-full overflow-hidden">
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-700",
              meta.iconColor.replace("text-", "bg-"),
            )}
            style={{ width: `${Math.min(usedPct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-foreground-muted">
          <span>{balance.used} used</span>
          {balance.pending > 0 && (
            <span className="text-amber-400">{balance.pending} pending</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LeaveBalanceWidget() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const leaveBalances = useGlobalStore((s) => s.leaveBalances);
  const activeUserBalances = leaveBalances.filter(
    (b) => b.userId === activeUserId,
  );

  const totalAvailable = activeUserBalances.reduce(
    (s, b) => s + b.available,
    0,
  );
  const totalPending = activeUserBalances.reduce((s, b) => s + b.pending, 0);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Umbrella size={14} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Leave Balances</h3>
        </div>
        <div className="flex items-center gap-2">
          {totalPending > 0 && (
            <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              {totalPending} pending
            </span>
          )}
          <span className="text-[10px] text-foreground-muted font-medium">
            {totalAvailable} days available
          </span>
        </div>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {activeUserBalances.map((b, i) => (
          <BalanceCard key={b.id} balance={b} delay={i * 60} />
        ))}
      </div>
    </div>
  );
}
