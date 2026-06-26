"use client";

import { useRole } from "../../../context/RoleContext";
import { useGlobalStore } from "../../../store/useGlobalStore";
import Link from "next/link";
import {
  Bell,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  Calendar,
  Users,
  Zap,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Target,
  Briefcase,
} from "lucide-react";
import { clsx } from "clsx";
import {
  mockOnboardingEmployee,
  getOnboardingProgress,
} from "../../../lib/mock-data/onboarding";

export default function HomePage() {
  const { role } = useRole();

  return (
    <div className="px-4 pt-2 pb-6 space-y-5 animate-fade-in">
      {/* ── Greeting Header ──────────────────────────── */}
      <GreetingHeader role={role} />

      {/* ── Quick Stats ──────────────────────────────── */}
      <QuickStats role={role} />

      {/* ── Onboarding Banner (Employee only) ────────── */}
      {role === "Employee" && <OnboardingBanner />}

      {/* ── Recent Activity ─────────────────────────── */}
      <RecentActivity role={role} />

      {/* ── Quick Links ─────────────────────────────── */}
      <QuickLinks role={role} />
    </div>
  );
}

function GreetingHeader({ role }: { role: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const ROLE_NAMES: Record<string, string> = {
    Employee: "Alex",
    Manager: "Priya",
    HR: "Meera",
    Admin: "Admin",
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-foreground-muted">{greeting} 👋</p>
        <h1 className="text-xl font-black text-foreground mt-0.5">
          {ROLE_NAMES[role] ?? role}
        </h1>
        <p className="text-xs text-foreground-muted mt-0.5">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>
      <button
        id="notifications-btn"
        className="relative w-10 h-10 rounded-full bg-background-secondary border border-border/40 flex items-center justify-center hover:border-primary/40 transition-colors"
      >
        <Bell size={18} className="text-foreground-muted" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent border border-background" />
      </button>
    </div>
  );
}

function QuickStats({ role }: { role: string }) {
  const STATS: Record<
    string,
    {
      label: string;
      value: string;
      sub: string;
      icon: React.ElementType;
      color: string;
    }[]
  > = {
    Employee: [
      {
        label: "Attendance",
        value: "96%",
        sub: "This month",
        icon: Clock,
        color: "text-primary bg-primary/15",
      },
      {
        label: "Leave Balance",
        value: "12",
        sub: "Days left",
        icon: Calendar,
        color: "text-accent bg-accent/15",
      },
      {
        label: "Goals",
        value: "4/6",
        sub: "On track",
        icon: TrendingUp,
        color: "text-success bg-success/15",
      },
      {
        label: "Training",
        value: "2",
        sub: "Pending",
        icon: FileText,
        color: "text-warning bg-warning/15",
      },
    ],
    Manager: [
      {
        label: "Team Size",
        value: "8",
        sub: "Direct reports",
        icon: Users,
        color: "text-primary bg-primary/15",
      },
      {
        label: "Pending Leaves",
        value: "3",
        sub: "Awaiting approval",
        icon: Calendar,
        color: "text-warning bg-warning/15",
      },
      {
        label: "Team Attendance",
        value: "94%",
        sub: "Today",
        icon: Clock,
        color: "text-success bg-success/15",
      },
      {
        label: "Reviews Due",
        value: "2",
        sub: "This week",
        icon: TrendingUp,
        color: "text-accent bg-accent/15",
      },
    ],
    HR: [
      {
        label: "Open Positions",
        value: "5",
        sub: "Hiring now",
        icon: Users,
        color: "text-primary bg-primary/15",
      },
      {
        label: "New Joiners",
        value: "3",
        sub: "This month",
        icon: Sparkles,
        color: "text-accent bg-accent/15",
      },
      {
        label: "Pending Docs",
        value: "7",
        sub: "To verify",
        icon: FileText,
        color: "text-warning bg-warning/15",
      },
      {
        label: "Payroll",
        value: "Due",
        sub: "In 5 days",
        icon: Calendar,
        color: "text-success bg-success/15",
      },
    ],
    Admin: [
      {
        label: "Employees",
        value: "142",
        sub: "Active users",
        icon: Users,
        color: "text-primary bg-primary/15",
      },
      {
        label: "Departments",
        value: "9",
        sub: "Teams",
        icon: Zap,
        color: "text-accent bg-accent/15",
      },
      {
        label: "System",
        value: "99.9%",
        sub: "Uptime",
        icon: TrendingUp,
        color: "text-success bg-success/15",
      },
      {
        label: "Audits",
        value: "2",
        sub: "Pending",
        icon: AlertCircle,
        color: "text-warning bg-warning/15",
      },
    ],
  };

  const stats = STATS[role] ?? STATS["Employee"];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const [iconColor, bgColor] = stat.color.split(" ");
        return (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-4 border border-border/40 animate-slide-up"
          >
            <div
              className={clsx(
                "w-8 h-8 rounded-xl flex items-center justify-center mb-2.5",
                bgColor,
              )}
            >
              <Icon size={16} className={iconColor} />
            </div>
            <div className="text-2xl font-black text-foreground leading-none">
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-foreground mt-0.5">
              {stat.label}
            </div>
            <div className="text-[10px] text-foreground-muted mt-0.5">
              {stat.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OnboardingBanner() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const onboardingProfiles = useGlobalStore((s) => s.onboardingProfiles);

  const onboardingProfile = onboardingProfiles.find(
    (profile) => profile.userId === activeUserId,
  );

  const totalTasks =
    onboardingProfile?.tasks.length ??
    mockOnboardingEmployee.tasks.filter((t) => t.assignee === "employee")
      .length;
  const completedTasks =
    onboardingProfile?.tasks.filter((task) => task.isCompleted).length ??
    mockOnboardingEmployee.tasks.filter(
      (t) => t.assignee === "employee" && t.status === "completed",
    ).length;
  const progress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : getOnboardingProgress(mockOnboardingEmployee);
  const pending = Math.max(totalTasks - completedTasks, 0);

  return (
    <Link href="/onboarding" id="onboarding-banner">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-primary-dark to-primary border border-primary/30 p-4 flex items-center gap-4 group hover:shadow-teal transition-shadow">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={13} className="text-white/80" />
            <span className="text-[11px] font-semibold text-white/80">
              Onboarding Journey
            </span>
          </div>
          <p className="text-sm font-bold text-white">
            {pending > 0 ? `${pending} tasks remaining` : "All done! 🎉"}
          </p>
          {/* Mini progress */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-white font-bold">
              {progress}%
            </span>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="text-white/80 flex-shrink-0 group-hover:translate-x-1 transition-transform"
        />
      </div>
    </Link>
  );
}

function RecentActivity({ role }: { role: string }) {
  const ACTIVITIES: Record<
    string,
    { icon: React.ElementType; text: string; time: string; color: string }[]
  > = {
    Employee: [
      {
        icon: CheckCircle2,
        text: "Offer letter signed",
        time: "2 days ago",
        color: "text-success",
      },
      {
        icon: FileText,
        text: "KYC documents submitted",
        time: "1 day ago",
        color: "text-primary",
      },
      {
        icon: Clock,
        text: "Bank details: in progress",
        time: "Today",
        color: "text-warning",
      },
    ],
    Manager: [
      {
        icon: Calendar,
        text: "Rahul's leave request pending",
        time: "1h ago",
        color: "text-warning",
      },
      {
        icon: TrendingUp,
        text: "Q2 reviews due this week",
        time: "3h ago",
        color: "text-accent",
      },
      {
        icon: Users,
        text: "Team standup at 10:30 AM",
        time: "Today",
        color: "text-primary",
      },
    ],
    HR: [
      {
        icon: Users,
        text: "New applicant: React Dev role",
        time: "2h ago",
        color: "text-primary",
      },
      {
        icon: FileText,
        text: "Alex KYC submitted — verify",
        time: "1h ago",
        color: "text-warning",
      },
      {
        icon: Bell,
        text: "Payroll processing due Friday",
        time: "Today",
        color: "text-accent",
      },
    ],
    Admin: [
      {
        icon: AlertCircle,
        text: "System backup completed",
        time: "6h ago",
        color: "text-success",
      },
      {
        icon: Users,
        text: "2 new employees onboarded",
        time: "Today",
        color: "text-primary",
      },
      {
        icon: TrendingUp,
        text: "Monthly report generated",
        time: "Yesterday",
        color: "text-accent",
      },
    ],
  };

  const activities = ACTIVITIES[role] ?? ACTIVITIES["Employee"];

  return (
    <div>
      <h2 className="text-sm font-bold text-foreground mb-3">
        Recent Activity
      </h2>
      <div className="glass-card rounded-2xl border border-border/40 overflow-hidden">
        {activities.map((activity, i) => {
          const Icon = activity.icon;
          return (
            <div
              key={i}
              className={clsx(
                "flex items-center gap-3 px-4 py-3",
                i < activities.length - 1 && "border-b border-border/30",
              )}
            >
              <Icon size={15} className={activity.color} />
              <span className="text-xs text-foreground flex-1">
                {activity.text}
              </span>
              <span className="text-[10px] text-foreground-muted">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickLinks({ role }: { role: string }) {
  const LINKS: Record<
    string,
    { label: string; href: string; icon: React.ElementType; color: string }[]
  > = {
    Employee: [
      {
        label: "My Payslip",
        href: "/payroll",
        icon: FileText,
        color: "text-green-400 bg-green-500/15",
      },
      {
        label: "Apply Leave",
        href: "/leave",
        icon: Calendar,
        color: "text-blue-400 bg-blue-500/15",
      },
      {
        label: "Documents",
        href: "/documents",
        icon: FileText,
        color: "text-accent bg-accent/15",
      },
      {
        label: "Submit Expense",
        href: "/expenses",
        icon: CreditCard,
        color: "text-purple-400 bg-purple-500/15",
      },
      {
        label: "My Analytics",
        href: "/analytics",
        icon: BarChart3,
        color: "text-cyan-400 bg-cyan-500/15",
      },
      {
        label: "Internal Jobs",
        href: "/recruitment",
        icon: Briefcase,
        color: "text-orange-400 bg-orange-500/15",
      },
    ],
    Manager: [
      {
        label: "Approve Leave",
        href: "/leave",
        icon: Calendar,
        color: "text-blue-400 bg-blue-500/15",
      },
      {
        label: "Team Analytics",
        href: "/analytics",
        icon: BarChart3,
        color: "text-cyan-400 bg-cyan-500/15",
      },
      {
        label: "Documents",
        href: "/documents",
        icon: FileText,
        color: "text-green-400 bg-green-500/15",
      },
      {
        label: "Manage Expenses",
        href: "/expenses",
        icon: CreditCard,
        color: "text-purple-400 bg-purple-500/15",
      },
      {
        label: "Internal Jobs",
        href: "/recruitment",
        icon: Briefcase,
        color: "text-orange-400 bg-orange-500/15",
      },
    ],
    HR: [
      {
        label: "Post Job",
        href: "/recruitment",
        icon: Users,
        color: "text-primary bg-primary/15",
      },
      {
        label: "Verify Docs",
        href: "/documents",
        icon: FileText,
        color: "text-blue-400 bg-blue-500/15",
      },
      {
        label: "Review Expenses",
        href: "/expenses",
        icon: CreditCard,
        color: "text-purple-400 bg-purple-500/15",
      },
    ],
    Admin: [
      {
        label: "Team Mgmt",
        href: "/team",
        icon: Users,
        color: "text-primary bg-primary/15",
      },
      {
        label: "Documents",
        href: "/documents",
        icon: FileText,
        color: "text-green-400 bg-green-500/15",
      },
      {
        label: "Manage Expenses",
        href: "/expenses",
        icon: CreditCard,
        color: "text-purple-400 bg-purple-500/15",
      },
    ],
  };

  const links = LINKS[role] ?? LINKS["Employee"];

  return (
    <div>
      <h2 className="text-sm font-bold text-foreground mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const [color, bg] = link.color.split(" ");
          return (
            <Link
              key={link.href}
              href={link.href}
              id={`quick-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              className="glass-card rounded-2xl p-4 border border-border/40 flex flex-col items-center justify-center gap-2 min-h-[100px] hover:border-primary/40 transition-colors active:scale-95 group"
            >
              <span
                className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                  bg,
                )}
              >
                <Icon size={16} className={color} />
              </span>
              <span className="text-[10px] font-semibold text-foreground-muted text-center leading-tight">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
