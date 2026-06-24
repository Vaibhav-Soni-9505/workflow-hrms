'use client';

import { useState } from 'react';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockTeamAttendance } from '../../lib/mock-data/attendance';
import type { TeamMemberAttendance, AttendanceStatus } from '../../lib/mock-data/attendance';

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; bg: string; text: string; border: string; dot: string; emoji: string }
> = {
  Present:   { label: 'Present',   bg: 'bg-success/10',       text: 'text-success',      border: 'border-success/25',       dot: 'bg-success',        emoji: '✅' },
  Late:      { label: 'Late',      bg: 'bg-amber-500/10',     text: 'text-amber-400',    border: 'border-amber-500/25',     dot: 'bg-amber-400',      emoji: '⚠️' },
  Absent:    { label: 'Absent',    bg: 'bg-destructive/10',   text: 'text-destructive',  border: 'border-destructive/25',   dot: 'bg-destructive',    emoji: '🔴' },
  'Half-day':{ label: 'Half Day',  bg: 'bg-blue-500/10',      text: 'text-blue-400',     border: 'border-blue-500/25',      dot: 'bg-blue-400',       emoji: '🔵' },
  'On-leave':{ label: 'On Leave',  bg: 'bg-violet-500/10',    text: 'text-violet-400',   border: 'border-violet-500/25',    dot: 'bg-violet-400',     emoji: '🟣' },
};

// ── Filter tabs ───────────────────────────────────────────────────────────────

type FilterType = 'All' | AttendanceStatus;

const FILTERS: FilterType[] = ['All', 'Present', 'Late', 'Absent', 'Half-day', 'On-leave'];

// ── Summary Card ──────────────────────────────────────────────────────────────

function SummaryCard({
  count,
  label,
  colorClass,
  icon,
}: {
  count: number;
  label: string;
  colorClass: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={clsx('flex flex-col items-center gap-1 flex-1 py-3 rounded-2xl border', colorClass)}>
      <div className="text-lg font-black leading-none">{count}</div>
      <div className="flex items-center gap-1">{icon}<span className="text-[9px] font-semibold">{label}</span></div>
    </div>
  );
}

// ── Member Row ────────────────────────────────────────────────────────────────

function MemberRow({ member, index }: { member: TeamMemberAttendance; index: number }) {
  const config = STATUS_CONFIG[member.status];

  return (
    <div
      className="glass-card rounded-2xl p-3.5 flex items-center gap-3 animate-slide-up border border-border/30 hover:border-border/60 transition-all"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0',
          member.avatarColor
        )}
      >
        {member.avatarInitials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-foreground truncate">{member.name}</p>
          {/* Exception highlight */}
          {(member.status === 'Absent' || member.status === 'Late') && (
            <AlertTriangle
              size={12}
              className={member.status === 'Absent' ? 'text-destructive flex-shrink-0' : 'text-amber-400 flex-shrink-0'}
            />
          )}
        </div>
        <p className="text-[10px] text-foreground-muted truncate">{member.designation}</p>

        {/* Check-in info + verification pills */}
        <div className="flex items-center gap-2 mt-1.5">
          {member.checkInTime ? (
            <span className="flex items-center gap-0.5 text-[9px] text-foreground-muted">
              <Clock size={9} /> {member.checkInTime}
            </span>
          ) : (
            <span className="text-[9px] text-foreground-muted/60 italic">Not clocked in</span>
          )}

          {member.locationVerified && (
            <span className="text-[8px] font-semibold text-success/80 flex items-center gap-0.5">
              <MapPin size={8} />Loc
            </span>
          )}
          {member.ipValidated && (
            <span className="text-[8px] font-semibold text-success/80 flex items-center gap-0.5">
              <Shield size={8} />IP
            </span>
          )}
        </div>
      </div>

      {/* Status badge */}
      <span
        className={clsx(
          'flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-xl border flex-shrink-0',
          config.bg,
          config.text,
          config.border
        )}
      >
        <span className={clsx('w-1.5 h-1.5 rounded-full', config.dot)} />
        {config.label}
      </span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TeamAttendanceTable() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const allMembers = mockTeamAttendance;
  const filtered = activeFilter === 'All'
    ? allMembers
    : allMembers.filter((m) => m.status === activeFilter);

  // Summary counts
  const total     = allMembers.length;
  const present   = allMembers.filter((m) => m.status === 'Present').length;
  const late      = allMembers.filter((m) => m.status === 'Late').length;
  const absent    = allMembers.filter((m) => m.status === 'Absent').length;
  const onLeave   = allMembers.filter((m) => m.status === 'On-leave').length;
  const exceptions = late + absent;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Team Attendance</h3>
        </div>
        <span className="text-[10px] text-foreground-muted">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Exception alert banner */}
      {exceptions > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={14} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-400">
              {exceptions} exception{exceptions > 1 ? 's' : ''} flagged today
            </p>
            <p className="text-[10px] text-foreground-muted">
              {absent > 0 && `${absent} absent`}
              {absent > 0 && late > 0 && ' · '}
              {late > 0 && `${late} late`}
            </p>
          </div>
        </div>
      )}

      {/* Summary row */}
      <div className="flex gap-2">
        <SummaryCard
          count={present}
          label="Present"
          colorClass="bg-success/5 border-success/20 text-success"
          icon={<CheckCircle2 size={9} />}
        />
        <SummaryCard
          count={late}
          label="Late"
          colorClass="bg-amber-500/5 border-amber-500/20 text-amber-400"
          icon={<Clock size={9} />}
        />
        <SummaryCard
          count={absent}
          label="Absent"
          colorClass="bg-destructive/5 border-destructive/20 text-destructive"
          icon={<AlertTriangle size={9} />}
        />
        <SummaryCard
          count={onLeave}
          label="On Leave"
          colorClass="bg-violet-500/5 border-violet-500/20 text-violet-400"
          icon={<CheckCircle2 size={9} />}
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-4 px-4 scrollbar-hide">
        {FILTERS.map((f) => {
          const count = f === 'All' ? total : allMembers.filter((m) => m.status === f).length;
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              id={`team-filter-${f.toLowerCase().replace('-', '')}`}
              onClick={() => setActiveFilter(f)}
              className={clsx(
                'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap border',
                isActive
                  ? 'bg-teal-600 text-white border-teal-600 shadow-teal scale-[1.03]'
                  : 'bg-background-tertiary/60 text-foreground-muted border-border/40 hover:bg-background-tertiary hover:text-foreground hover:border-border/60 hover:scale-[1.02]'
              )}
            >
              {f}
              <span
                className={clsx(
                  'text-[9px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center transition-colors duration-200',
                  isActive ? 'bg-white/25 text-white' : 'bg-muted/80 text-foreground-muted'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Member list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-foreground-muted text-xs">
            No team members in this category
          </div>
        ) : (
          filtered.map((member, i) => (
            <MemberRow key={member.employeeId} member={member} index={i} />
          ))
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-foreground-muted">
        Showing {filtered.length} of {total} team members
      </p>
    </div>
  );
}
