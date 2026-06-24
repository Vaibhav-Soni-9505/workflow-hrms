'use client';

import { useState } from 'react';
import { useRole } from '../../../context/RoleContext';
import AttendanceWidget from '../../../components/attendance/AttendanceWidget';
import ShiftCalendar from '../../../components/attendance/ShiftCalendar';
import TeamAttendanceTable from '../../../components/attendance/TeamAttendanceTable';
import { Clock, Shield, Users } from 'lucide-react';
import { clsx } from 'clsx';

export default function AttendancePage() {
  const { role } = useRole();

  // ── Shared session state ─────────────────────────────────────────────────────
  // Owned here so AttendanceWidget and ShiftCalendar stay in sync
  const [checkInTime,  setCheckInTime]  = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);

  function handleClockIn(time: Date) {
    setCheckInTime(time);
    setClockOutTime(null); // clear previous clock-out on a new session
  }
  function handleClockOut(time: Date) {
    setClockOutTime(time);
  }

  // ── Derived ──────────────────────────────────────────────────────────────────
  const isEmployeeView  = role === 'Employee';
  const isManagerHrView = role === 'Manager' || role === 'HR';

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const roleLabel = role === 'Manager' ? 'Manager View' : role === 'HR' ? 'HR View' : '';

  return (
    <div className="px-4 pt-3 pb-24 space-y-5 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-foreground-muted font-medium">{greeting}</p>
          <h1 className="text-2xl font-black text-foreground">Attendance</h1>
          <p className="text-xs text-foreground-muted mt-0.5">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Role badge */}
        <div
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold',
            isEmployeeView
              ? 'bg-primary/10 text-primary border-primary/25'
              : role === 'Manager'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
              : 'bg-orange-500/10 text-orange-400 border-orange-500/25'
          )}
        >
          {isEmployeeView ? <Clock size={12} /> : role === 'Manager' ? <Users size={12} /> : <Shield size={12} />}
          {isEmployeeView ? 'My Attendance' : roleLabel}
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          EMPLOYEE VIEW
          ────────────────────────────────────────── */}
      {isEmployeeView && (
        <>
          {/* AT-01 / AT-02 / AT-04: Clock widget + today summary */}
          <AttendanceWidget
            checkInTime={checkInTime}
            clockOutTime={clockOutTime}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
          />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] text-foreground-muted font-medium uppercase tracking-wider">This Week</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* AT-03: Shift calendar — receives live punch times */}
          <ShiftCalendar
            checkInTime={checkInTime}
            clockOutTime={clockOutTime}
          />
        </>
      )}

      {/* ──────────────────────────────────────────────
          MANAGER / HR VIEW
          ────────────────────────────────────────── */}
      {isManagerHrView && (
        <>
          {/* Context banner */}
          <div className="glass-card rounded-2xl p-4 border border-border/40 flex items-center gap-3">
            <div
              className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                role === 'Manager' ? 'bg-blue-500/15 text-blue-400' : 'bg-orange-500/15 text-orange-400'
              )}
            >
              {role === 'Manager' ? <Users size={18} /> : <Shield size={18} />}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {role === 'Manager' ? 'Team Overview' : 'HR Exceptions Dashboard'}
              </p>
              <p className="text-xs text-foreground-muted">
                {role === 'Manager'
                  ? "Monitor your team's attendance and flag exceptions"
                  : 'Review organisation-wide attendance exceptions'}
              </p>
            </div>
          </div>

          {/* AT-05: Team attendance table */}
          <TeamAttendanceTable />
        </>
      )}

      {/* Admin fallback */}
      {role === 'Admin' && (
        <div className="glass-card rounded-2xl p-6 text-center border border-border/40">
          <p className="text-lg mb-2">⚙️</p>
          <p className="text-sm font-bold text-foreground">Admin View</p>
          <p className="text-xs text-foreground-muted mt-1">
            Switch to Employee, Manager, or HR role to see attendance views.
          </p>
        </div>
      )}
    </div>
  );
}
