'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  mockOnboardingEmployee,
  getOnboardingProgress,
} from '../../lib/mock-data/onboarding';
import type { OnboardingEmployee } from '../../types/onboarding';
import { useGlobalStore } from '../../store/useGlobalStore';
import OnboardingProgress from './OnboardingProgress';
import TaskChecklist from './TaskChecklist';
import WelcomeMessages from './WelcomeMessages';
import RelocationSupportView from './RelocationSupport';
import TeamIntroductions from './TeamIntroductions';
import {
  MapPin,
  Calendar,
  User,
  Users,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { clsx } from 'clsx';

type Tab = 'tasks' | 'welcome' | 'relocation' | 'team' | 'milestones';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'tasks', label: 'Tasks', emoji: '✅' },
  { id: 'welcome', label: 'Welcome', emoji: '👋' },
  { id: 'relocation', label: 'Relocation', emoji: '✈️' },
  { id: 'team', label: 'Team', emoji: '👥' },
  { id: 'milestones', label: 'Milestones', emoji: '🏆' },
];

export default function OnboardingDashboard() {
  const router = useRouter();
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const onboardingProfiles = useGlobalStore((s) => s.onboardingProfiles);
  const updateOnboardingStep = useGlobalStore((s) => s.updateOnboardingStep);
  const toggleOnboardingTask = useGlobalStore((s) => s.toggleOnboardingTask);

  const onboardingProfile =
    onboardingProfiles.find((profile) => profile.userId === activeUserId) ?? null;

  const completionDate = new Date().toISOString().split('T')[0];
  const profileTaskMap = useMemo(
    () => new Map(onboardingProfile?.tasks.map((task) => [task.id, task.isCompleted]) ?? []),
    [onboardingProfile]
  );

  const employee = useMemo<OnboardingEmployee>(
    () => ({
      ...mockOnboardingEmployee,
      onboardingCompleted: onboardingProfile?.isCompleted ?? mockOnboardingEmployee.onboardingCompleted,
      tasks: mockOnboardingEmployee.tasks.map((task) => {
        const isCompleted = profileTaskMap.get(task.id);

        if (typeof isCompleted !== 'boolean') {
          return task;
        }

        return {
          ...task,
          status: isCompleted
            ? 'completed'
            : task.status === 'completed'
            ? 'pending'
            : task.status,
          completedDate: isCompleted ? task.completedDate ?? completionDate : undefined,
        };
      }),
    }),
    [completionDate, onboardingProfile?.isCompleted, profileTaskMap]
  );

  const activeTab = TABS[Math.min(onboardingProfile?.currentStep ?? 0, TABS.length - 1)]?.id ?? 'tasks';

  const progress = getOnboardingProgress(employee);

  // ON-02: Mark task as complete
  const handleTaskComplete = useCallback((taskId: string) => {
    toggleOnboardingTask(activeUserId, taskId);
  }, [activeUserId, toggleOnboardingTask]);

  // ON-06: Complete onboarding
  const handleCompleteOnboarding = () => {
    setEmployee((prev) => ({ ...prev, onboardingCompleted: true }));
    router.push('/home');
  };

  const joiningDate = new Date(employee.joiningDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="px-4 pt-2 pb-6 space-y-5 animate-fade-in">
      {/* ── Hero Card (ON-01) ────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-teal-500 opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.04%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%2215%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

        <div className="relative p-5">
          {/* Welcome header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-accent-light" />
                <span className="text-xs font-semibold text-white/70">Welcome to WorkFlow</span>
              </div>
              <h1 className="text-xl font-black text-white leading-tight">
                Hey {employee.firstName}! 👋
              </h1>
              <p className="text-sm text-white/80 mt-0.5">{employee.designation}</p>
            </div>

            {/* Progress ring mini */}
            <div className="text-right">
              <div className="text-2xl font-black text-white">{progress}%</div>
              <div className="text-[10px] text-white/70">complete</div>
            </div>
          </div>

          {/* Info pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <InfoPill icon={<MapPin size={10} />} text={employee.location} />
            <InfoPill icon={<Calendar size={10} />} text={`Joining: ${joiningDate}`} />
            <InfoPill icon={<User size={10} />} text={`Manager: ${employee.manager.name}`} />
            <InfoPill icon={<Users size={10} />} text={`Buddy: ${employee.buddy.name}`} />
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-white/70">Onboarding Progress</span>
              <span className="text-[11px] font-bold text-white">{progress}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Employee ID */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-white/60">
              Employee ID: <span className="font-mono font-semibold text-white/80">{employee.employeeId}</span>
            </span>
            <span className="text-[10px] text-white/60">{employee.department}</span>
          </div>
        </div>
      </div>

      {/* ── Progress Widget ──────────────────────────────── */}
      <OnboardingProgress employee={employee} />

      {/* ── Tab Navigation ────────────────────────────────  */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
        {TABS.map((tab) => {
          // Hide relocation tab if not relocating
          if (tab.id === 'relocation' && !employee.isRelocating) return null;
          return (
            <button
              key={tab.id}
              id={`onboarding-tab-${tab.id}`}
              onClick={() => updateOnboardingStep(activeUserId, TABS.findIndex((item) => item.id === tab.id))}
              className={clsx(
                'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-teal'
                  : 'bg-background-secondary text-foreground-muted hover:text-foreground hover:bg-muted/50 border border-border/40'
              )}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ─────────────────────────────────── */}
      <div className="animate-fade-in" key={activeTab}>
        {activeTab === 'tasks' && (
          <TaskChecklist employee={employee} onTaskComplete={handleTaskComplete} />
        )}
        {activeTab === 'welcome' && (
          <WelcomeMessages messages={employee.welcomeMessages} />
        )}
        {activeTab === 'relocation' && employee.relocationSupport && (
          <RelocationSupportView support={employee.relocationSupport} />
        )}
        {activeTab === 'team' && (
          <TeamIntroductions members={employee.teamMembers} />
        )}
        {activeTab === 'milestones' && (
          <MilestonesView milestones={employee.milestones} />
        )}
      </div>

      {/* ── Complete Onboarding CTA (ON-06) ─────────────── */}
      {progress >= 100 && (
        <div className="glass-card rounded-2xl p-4 border border-success/30 bg-success/5 animate-scale-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">All Tasks Complete! 🎉</p>
              <p className="text-xs text-foreground-muted">Ready to transition to full employee access</p>
            </div>
          </div>
          <button
            id="complete-onboarding-btn"
            onClick={handleCompleteOnboarding}
            className="w-full py-3 rounded-xl bg-success text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            Complete Onboarding
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Demo: Complete button for testing ON-06 even if not 100% */}
      {progress < 100 && (
        <div className="text-center">
          <button
            id="demo-complete-onboarding"
            onClick={handleCompleteOnboarding}
            className="text-xs text-foreground-muted underline underline-offset-2 hover:text-foreground transition-colors"
          >
            [Demo] Skip to main dashboard →
          </button>
        </div>
      )}
    </div>
  );
}

function InfoPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1 text-[10px] text-white/80 bg-white/15 px-2.5 py-1 rounded-full">
      {icon}
      {text}
    </span>
  );
}

function MilestonesView({
  milestones,
}: {
  milestones: OnboardingEmployee['milestones'];
}) {
  const TYPE_CONFIG = {
    'check-in': { emoji: '📋', bg: 'bg-blue-500/15', border: 'border-blue-500/20' },
    review: { emoji: '⭐', bg: 'bg-orange-500/15', border: 'border-orange-500/20' },
    celebration: { emoji: '🎉', bg: 'bg-primary/15', border: 'border-primary/20' },
  };

  const STATUS_CONFIG = {
    upcoming: { label: 'Upcoming', class: 'text-foreground-muted bg-muted/50' },
    completed: { label: 'Done', class: 'text-success bg-success/15' },
    missed: { label: 'Missed', class: 'text-destructive bg-destructive/15' },
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Trophy size={14} className="text-accent" />
        <h3 className="text-sm font-bold text-foreground">Onboarding Milestones</h3>
      </div>

      {/* Timeline */}
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-primary/40 to-border/30" />

        <div className="space-y-4">
          {milestones.map((ms, i) => {
            const typeConf = TYPE_CONFIG[ms.type];
            const statusConf = STATUS_CONFIG[ms.status];
            return (
              <div key={ms.id} className="relative flex gap-3 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                {/* Timeline dot */}
                <div className="absolute -left-6 top-3 w-4 h-4 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>

                <div className={clsx('flex-1 rounded-xl p-3.5 border', typeConf.bg, typeConf.border)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{typeConf.emoji}</span>
                      <p className="text-sm font-semibold text-foreground">{ms.title}</p>
                    </div>
                    <span className={clsx('text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0', statusConf.class)}>
                      {statusConf.label}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-muted mt-1">{ms.description}</p>
                  <p className="text-[10px] text-foreground-muted mt-2">
                    📅 {new Date(ms.scheduledDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
