'use client';

// ──────────────────────────────────────────────────────────────────────────────
// WorkFlow HRMS — Leave Page
//
// Pure layout shell. All data and state live in the Zustand global store and
// are consumed directly by each self-contained component.
// This page only handles:
//   • Reading the active role for structural rendering decisions
//   • Managing the "show form" modal toggle (pure UI state, stays local)
// ──────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Plus, Umbrella, Shield, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { useRole } from '../../../context/RoleContext';
import { useGlobalStore } from '../../../store/useGlobalStore';
import LeaveBalanceWidget from '../../../components/leave/LeaveBalanceWidget';
import LeaveRequestForm   from '../../../components/leave/LeaveRequestForm';
import MyLeaveHistory     from '../../../components/leave/MyLeaveHistory';
import ApprovalQueue      from '../../../components/leave/ApprovalQueue';
import { mockLeaveBalances } from '../../../lib/mock-data/leave';

export default function LeavePage() {
  const { role } = useRole();
  const activeUser = useGlobalStore((s) => s.getActiveUser());

  const isEmployee    = role === 'Employee';
  const isManagerOrHR = role === 'Manager' || role === 'HR';

  // Modal visibility is pure local UI state — not global
  const [showForm, setShowForm] = useState(false);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const roleLabel = role === 'Manager' ? 'Manager View' : role === 'HR' ? 'HR View' : '';

  return (
    <div className="px-4 pt-3 pb-28 space-y-5 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-foreground-muted font-medium">{greeting}, {activeUser.name}</p>
          <h1 className="text-2xl font-black text-foreground">Leave</h1>
          <p className="text-xs text-foreground-muted mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Role badge */}
        <div className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold',
          isEmployee
            ? 'bg-primary/10 text-primary border-primary/25'
            : role === 'Manager'
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
            : 'bg-orange-500/10 text-orange-400 border-orange-500/25'
        )}>
          {isEmployee ? <Umbrella size={12} /> : role === 'Manager' ? <Users size={12} /> : <Shield size={12} />}
          {isEmployee ? 'My Leave' : roleLabel}
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          EMPLOYEE VIEW
          ────────────────────────────────────────── */}
      {isEmployee && (
        <>
          {/* LV-01: Balance cards — static balances (future: per-user) */}
          <LeaveBalanceWidget balances={mockLeaveBalances} />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] text-foreground-muted font-medium uppercase tracking-wider">My Requests</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Apply for Leave CTA */}
          <button
            id="apply-leave-btn"
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-bold text-sm teal-glow hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus size={16} />
            Apply for Leave
          </button>

          {/* LV-04: My leave history — self-contained store consumer */}
          <MyLeaveHistory />

          {/* LV-02: Request form modal — writes directly to store */}
          {showForm && <LeaveRequestForm onClose={() => setShowForm(false)} />}
        </>
      )}

      {/* ──────────────────────────────────────────────
          MANAGER / HR VIEW
          ────────────────────────────────────────── */}
      {isManagerOrHR && (
        <>
          {/* Context banner */}
          <div className="glass-card rounded-2xl p-4 border border-border/40 flex items-center gap-3">
            <div className={clsx(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              role === 'Manager' ? 'bg-blue-500/15 text-blue-400' : 'bg-orange-500/15 text-orange-400'
            )}>
              {role === 'Manager' ? <Users size={18} /> : <Shield size={18} />}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {role === 'Manager' ? 'Team Leave Approvals' : 'HR Leave Dashboard'}
              </p>
              <p className="text-xs text-foreground-muted">
                {role === 'Manager'
                  ? "Review and action your team's leave requests"
                  : 'Organisation-wide leave request management'}
              </p>
            </div>
          </div>

          {/* Manager's own leave balances */}
          <LeaveBalanceWidget balances={mockLeaveBalances} />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] text-foreground-muted font-medium uppercase tracking-wider">Team Requests</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* LV-03: Approval queue — self-contained store consumer */}
          <ApprovalQueue />
        </>
      )}

      {/* ── Admin fallback ── */}
      {role === 'Admin' && (
        <div className="glass-card rounded-2xl p-6 text-center border border-border/40">
          <p className="text-lg mb-2">⚙️</p>
          <p className="text-sm font-bold text-foreground">Admin View</p>
          <p className="text-xs text-foreground-muted mt-1">
            Switch to Employee, Manager, or HR role to access leave management.
          </p>
        </div>
      )}
    </div>
  );
}
