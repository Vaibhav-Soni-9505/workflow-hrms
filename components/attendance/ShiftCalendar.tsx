'use client';

import { Calendar, Clock, Moon, LogIn, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { getWeekShift } from '../../lib/mock-data/attendance';
import type { ShiftDay } from '../../lib/mock-data/attendance';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTime(d: Date): string {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ShiftDay['status'],
  { label: string; bg: string; text: string; border: string }
> = {
  Scheduled: { label: 'Scheduled', bg: 'bg-primary/10',      text: 'text-primary',         border: 'border-primary/20' },
  Present:   { label: 'Present',   bg: 'bg-success/10',      text: 'text-success',          border: 'border-success/20' },
  Late:      { label: 'Late',      bg: 'bg-amber-500/10',    text: 'text-amber-400',        border: 'border-amber-500/20' },
  Absent:    { label: 'Absent',    bg: 'bg-destructive/10',  text: 'text-destructive',      border: 'border-destructive/20' },
  'Half-day':{ label: 'Half Day',  bg: 'bg-blue-500/10',     text: 'text-blue-400',         border: 'border-blue-500/20' },
  'On-leave':{ label: 'Leave',     bg: 'bg-violet-500/10',   text: 'text-violet-400',       border: 'border-violet-500/20' },
  Weekend:   { label: 'Off',       bg: 'bg-muted/30',        text: 'text-foreground-muted', border: 'border-border/20' },
};

// ── Day Card ──────────────────────────────────────────────────────────────────

interface DayCardProps {
  day: ShiftDay;
  index: number;
  checkInTime:  Date | null;
  clockOutTime: Date | null;
}

function DayCard({ day, index, checkInTime, clockOutTime }: DayCardProps) {
  const config  = STATUS_CONFIG[day.status];
  const dateNum = new Date(day.date).getDate();

  // Only show punch data on today's card
  const showPunchIn  = day.isToday && checkInTime;
  const showPunchOut = day.isToday && clockOutTime;

  return (
    <div
      className={clsx(
        // Today's card is wider to fit punch times
        'relative flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 animate-slide-up',
        day.isToday ? 'w-[88px]' : 'w-[72px]',
        day.isToday
          ? 'bg-gradient-to-b from-primary/20 to-primary/5 border-primary/40 shadow-teal'
          : day.isWeekend
          ? 'bg-background-tertiary/30 border-border/20'
          : 'glass-card hover:border-border/60'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* ── "TODAY" floating badge ── sits above card with mb gap */}
      {day.isToday && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black px-2 py-0.5 rounded-full bg-primary text-white shadow-teal animate-scale-in tracking-wide">
          TODAY
        </span>
      )}

      {/* Pulse dot */}
      {day.isToday && (
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      )}

      {/* Day short */}
      <p className={clsx(
        'text-[10px] font-bold uppercase tracking-wider mt-1',
        day.isToday ? 'text-primary' : 'text-foreground-muted'
      )}>
        {day.dayShort}
      </p>

      {/* Date number */}
      <div className={clsx(
        'w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm',
        day.isToday
          ? 'bg-primary text-white shadow-teal'
          : day.isWeekend
          ? 'bg-muted/40 text-foreground-muted'
          : 'bg-background-tertiary/60 text-foreground'
      )}>
        {dateNum}
      </div>

      {/* Scheduled shift or Off */}
      {day.isWeekend ? (
        <div className="flex flex-col items-center gap-0.5">
          <Moon size={12} className="text-foreground-muted/50" />
          <p className="text-[9px] text-foreground-muted/60 font-medium">Off</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-0.5 w-full">
          <p className="text-[8px] text-foreground-muted font-medium text-center leading-tight">
            {day.shiftStart?.replace(' ', '\n')}
          </p>
          <div className="w-3 h-px bg-border/60" />
          <p className="text-[8px] text-foreground-muted font-medium text-center leading-tight">
            {day.shiftEnd?.replace(' ', '\n')}
          </p>
        </div>
      )}

      {/* ── Punch-in / out times (today only) ── */}
      {(showPunchIn || showPunchOut) && (
        <div className="w-full space-y-1 pt-1 border-t border-primary/20">
          {showPunchIn && (
            <div className="flex items-center gap-1">
              <LogIn size={8} className="text-success flex-shrink-0" />
              <p className="text-[8px] font-semibold text-success leading-tight truncate">
                {fmtTime(checkInTime!)}
              </p>
            </div>
          )}
          {showPunchOut && (
            <div className="flex items-center gap-1">
              <LogOut size={8} className="text-accent flex-shrink-0" />
              <p className="text-[8px] font-semibold text-accent leading-tight truncate">
                {fmtTime(clockOutTime!)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Status chip */}
      <span className={clsx(
        'text-[8px] font-bold px-1.5 py-0.5 rounded-full w-full text-center border',
        config.bg, config.text, config.border
      )}>
        {showPunchIn && !showPunchOut ? 'Active' : config.label}
      </span>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ShiftCalendarProps {
  checkInTime:  Date | null;
  clockOutTime: Date | null;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ShiftCalendar({ checkInTime, clockOutTime }: ShiftCalendarProps) {
  const weekDays = getWeekShift();

  const presentCount = weekDays.filter(
    (d) => d.status === 'Present' || d.status === 'Late'
  ).length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Shift Schedule</h3>
        </div>
        <span className="text-[10px] text-foreground-muted font-medium">
          {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Shift info pill */}
      <div className="glass-card rounded-xl px-3.5 py-2.5 flex items-center gap-3 border border-primary/20">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Clock size={14} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-foreground">Regular Shift</p>
          <p className="text-[10px] text-foreground-muted">09:00 AM – 05:00 PM • Mon–Fri</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-foreground">
            {presentCount}<span className="text-foreground-muted font-normal">/5</span>
          </p>
          <p className="text-[9px] text-foreground-muted">days done</p>
        </div>
      </div>

      {/* Week scroll row — overflow-y-visible + pt-5 gives room for the TODAY badge */}
      <div className="flex gap-2 overflow-x-auto overflow-y-visible pb-1 pt-5 -mx-4 px-4 scrollbar-hide">
        {weekDays.map((day, i) => (
          <DayCard
            key={day.date}
            day={day}
            index={i}
            checkInTime={checkInTime}
            clockOutTime={clockOutTime}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 px-1 pt-1">
        {[
          { label: 'Present',  style: 'bg-success/20 text-success' },
          { label: 'Late',     style: 'bg-amber-500/20 text-amber-400' },
          { label: 'Half Day', style: 'bg-blue-500/20 text-blue-400' },
          { label: 'Leave',    style: 'bg-violet-500/20 text-violet-400' },
          { label: 'Off',      style: 'bg-muted/50 text-foreground-muted' },
        ].map(({ label, style }) => (
          <span key={label} className={clsx('text-[9px] font-semibold px-2 py-0.5 rounded-full', style)}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
