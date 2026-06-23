'use client';

import { getOnboardingProgress } from '../../lib/mock-data/onboarding';
import type { OnboardingEmployee } from '../../types/onboarding';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface OnboardingProgressProps {
  employee: OnboardingEmployee;
}

export default function OnboardingProgress({ employee }: OnboardingProgressProps) {
  const progress = getOnboardingProgress(employee);
  const total = employee.tasks.filter((t) => t.assignee === 'employee').length;
  const completed = employee.tasks.filter(
    (t) => t.assignee === 'employee' && t.status === 'completed'
  ).length;
  const inProgress = employee.tasks.filter(
    (t) => t.assignee === 'employee' && t.status === 'in-progress'
  ).length;
  const overdue = employee.tasks.filter(
    (t) => t.assignee === 'employee' && t.status === 'overdue'
  ).length;

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Onboarding Progress</h2>
          <p className="text-xs text-foreground-muted mt-0.5">First 90 days journey</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black gradient-text">{progress}%</div>
          <div className="text-[10px] text-foreground-muted">Complete</div>
        </div>
      </div>

      {/* Circular progress + stats */}
      <div className="flex items-center gap-5">
        {/* SVG Circle */}
        <div className="relative flex-shrink-0 w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="rgb(var(--color-border) / 0.3)"
              strokeWidth="8"
            />
            {/* Progress arc */}
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(var(--color-primary))" />
                <stop offset="100%" stopColor="rgb(var(--color-accent))" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-foreground">{completed}/{total}</span>
            <span className="text-[9px] text-foreground-muted">tasks</span>
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex-1 flex flex-col gap-2.5">
          <Stat
            icon={<CheckCircle2 size={13} />}
            label="Completed"
            value={completed}
            colorClass="text-success"
            bgClass="bg-success/10"
          />
          <Stat
            icon={<Clock size={13} />}
            label="In Progress"
            value={inProgress}
            colorClass="text-primary"
            bgClass="bg-primary/10"
          />
          <Stat
            icon={<AlertCircle size={13} />}
            label="Overdue"
            value={overdue}
            colorClass="text-destructive"
            bgClass="bg-destructive/10"
          />
        </div>
      </div>

      {/* Linear progress bar */}
      <div className="mt-4">
        <div className="h-1.5 bg-border/30 rounded-full overflow-hidden">
          <div
            className="progress-bar h-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon, label, value, colorClass, bgClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={clsx('w-6 h-6 rounded-lg flex items-center justify-center', bgClass, colorClass)}>
        {icon}
      </span>
      <span className="text-xs text-foreground-muted flex-1">{label}</span>
      <span className={clsx('text-sm font-bold', colorClass)}>{value}</span>
    </div>
  );
}
