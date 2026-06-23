'use client';

import { useState } from 'react';
import type { OnboardingEmployee, OnboardingTask, TaskPhase } from '../../types/onboarding';
import {
  getTasksByPhase,
  PHASE_LABELS,
  PHASE_DESCRIPTIONS,
} from '../../lib/mock-data/onboarding';
import {
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
  FileText,
  Cpu,
  Users,
  DollarSign,
  ShieldCheck,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { clsx } from 'clsx';

interface TaskChecklistProps {
  employee: OnboardingEmployee;
  onTaskComplete: (taskId: string) => void;
}

const PRIORITY_CONFIG = {
  high: { label: 'High', class: 'bg-destructive/15 text-red-400 border-red-500/20' },
  medium: { label: 'Medium', class: 'bg-warning/15 text-yellow-400 border-yellow-500/20' },
  low: { label: 'Low', class: 'bg-success/15 text-green-400 border-green-500/20' },
};

const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, label: 'Done', class: 'text-success', bg: 'bg-success/10' },
  'in-progress': { icon: Clock, label: 'In Progress', class: 'text-primary', bg: 'bg-primary/10' },
  pending: { icon: Circle, label: 'Pending', class: 'text-foreground-muted', bg: 'bg-muted/50' },
  overdue: { icon: AlertCircle, label: 'Overdue', class: 'text-destructive', bg: 'bg-destructive/10' },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Documents: FileText,
  Finance: DollarSign,
  Compliance: ShieldCheck,
  'IT Setup': Cpu,
  People: Users,
  Orientation: BookOpen,
  Learning: BookOpen,
  Performance: TrendingUp,
};

const ASSIGNEE_COLORS: Record<string, string> = {
  employee: 'bg-teal-500/20 text-teal-400',
  hr: 'bg-orange-500/20 text-orange-400',
  it: 'bg-blue-500/20 text-blue-400',
  manager: 'bg-purple-500/20 text-purple-400',
  buddy: 'bg-pink-500/20 text-pink-400',
};

export default function TaskChecklist({ employee, onTaskComplete }: TaskChecklistProps) {
  const phases = getTasksByPhase(employee);
  const [expandedPhase, setExpandedPhase] = useState<TaskPhase>('pre-joining');

  const getPhaseStats = (tasks: OnboardingTask[]) => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'completed').length;
    return { total, done };
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground px-1">Task Checklist</h3>

      {phases.map(({ phase, tasks }) => {
        const { total, done } = getPhaseStats(tasks);
        const isOpen = expandedPhase === phase;
        const isComplete = total > 0 && done === total;

        return (
          <div
            key={phase}
            className={clsx(
              'rounded-2xl border transition-all duration-200',
              isOpen ? 'border-primary/30 bg-primary/5' : 'border-border/40 bg-background-secondary/50'
            )}
          >
            {/* Phase header */}
            <button
              id={`phase-${phase}`}
              onClick={() => setExpandedPhase(isOpen ? ('' as TaskPhase) : phase)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              {/* Phase completion icon */}
              <span
                className={clsx(
                  'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                  isComplete ? 'bg-success/20' : isOpen ? 'bg-primary/20' : 'bg-muted/50'
                )}
              >
                {isComplete ? (
                  <CheckCircle2 size={16} className="text-success" />
                ) : (
                  <span className={clsx('text-xs font-bold', isOpen ? 'text-primary' : 'text-foreground-muted')}>
                    {done}/{total}
                  </span>
                )}
              </span>

              {/* Phase info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={clsx('text-sm font-semibold', isOpen ? 'text-foreground' : 'text-foreground-muted')}>
                    {PHASE_LABELS[phase]}
                  </span>
                  {isComplete && (
                    <span className="text-[9px] font-semibold bg-success/15 text-green-400 px-1.5 py-0.5 rounded-full">
                      DONE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-foreground-muted truncate mt-0.5">
                  {PHASE_DESCRIPTIONS[phase]}
                </p>
              </div>

              {/* Mini progress + chevron */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-16 h-1 bg-border/30 rounded-full overflow-hidden">
                  <div
                    className="h-full progress-bar"
                    style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
                  />
                </div>
                <ChevronDown
                  size={16}
                  className={clsx(
                    'text-foreground-muted transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              </div>
            </button>

            {/* Task list */}
            {isOpen && (
              <div className="px-4 pb-4 space-y-2 animate-slide-up">
                {tasks.length === 0 ? (
                  <p className="text-xs text-foreground-muted text-center py-4">No tasks for this phase</p>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={onTaskComplete}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({
  task,
  onComplete,
}: {
  task: OnboardingTask;
  onComplete: (id: string) => void;
}) {
  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];
  const StatusIcon = status.icon;
  const CategoryIcon = CATEGORY_ICONS[task.category] || FileText;
  const isEmployeeTask = task.assignee === 'employee';
  const isCompletable = isEmployeeTask && task.status !== 'completed';

  return (
    <div
      className={clsx(
        'rounded-xl p-3.5 border transition-all duration-200',
        task.status === 'completed'
          ? 'border-success/20 bg-success/5 opacity-75'
          : 'border-border/40 bg-background/50 hover:border-border/70'
      )}
    >
      <div className="flex gap-3">
        {/* Status icon / checkbox */}
        <button
          id={`task-${task.id}-toggle`}
          onClick={() => isCompletable && onComplete(task.id)}
          disabled={!isCompletable}
          className={clsx(
            'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
            status.bg,
            isCompletable && 'hover:scale-110 cursor-pointer active:scale-95',
            !isCompletable && 'cursor-default'
          )}
        >
          <StatusIcon size={15} className={status.class} />
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={clsx(
                'text-sm font-medium leading-snug',
                task.status === 'completed'
                  ? 'line-through text-foreground-muted'
                  : 'text-foreground'
              )}
            >
              {task.title}
            </p>
          </div>

          <p className="text-[11px] text-foreground-muted mt-0.5 leading-relaxed">
            {task.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Category */}
            <span className="flex items-center gap-1 text-[10px] text-foreground-muted bg-muted/50 px-2 py-0.5 rounded-full">
              <CategoryIcon size={10} />
              {task.category}
            </span>

            {/* Priority */}
            <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full border', priority.class)}>
              {priority.label}
            </span>

            {/* Assignee */}
            <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', ASSIGNEE_COLORS[task.assignee])}>
              {task.assignee}
            </span>

            {/* Due date */}
            <span className="text-[10px] text-foreground-muted ml-auto">
              Due {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>

          {/* Completed date */}
          {task.completedDate && (
            <p className="text-[10px] text-success mt-1">
              ✓ Completed {new Date(task.completedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
