"use client";

import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BookOpenCheck, Clock3, Users } from "lucide-react";
import { useGlobalStore } from "../../store/useGlobalStore";

const PIE_COLORS = ["#14b8a6", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

function StatCard({
  label,
  value,
  sublabel,
  icon,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-2xl border border-border/40 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
        {icon}
      </div>
      <p className="text-xl font-black text-foreground">{value}</p>
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="text-[10px] text-foreground-muted">{sublabel}</p>
    </div>
  );
}

function formatChartDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function HRDashboard() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);
  const attendanceRecords = useGlobalStore((s) => s.attendanceRecords);
  const leaveRequests = useGlobalStore((s) => s.leaveRequests);
  const trainingModules = useGlobalStore((s) => s.trainingModules);

  const activeUser = useMemo(
    () => users.find((user) => user.id === activeUserId) ?? users[0],
    [users, activeUserId]
  );

  const visibleUsers = useMemo(() => {
    if (activeUser.role === "Manager") {
      return users.filter((user) => user.managerId === activeUserId);
    }

    if (activeUser.role === "HR" || activeUser.role === "Admin") {
      return users;
    }

    return [];
  }, [users, activeUser.role, activeUserId]);

  const visibleUserIds = useMemo(
    () => new Set(visibleUsers.map((user) => user.id)),
    [visibleUsers]
  );

  const teamAttendance = useMemo(
    () => attendanceRecords.filter((record) => visibleUserIds.has(record.userId)),
    [attendanceRecords, visibleUserIds]
  );

  const teamLeaveRequests = useMemo(
    () => leaveRequests.filter((request) => visibleUserIds.has(request.userId)),
    [leaveRequests, visibleUserIds]
  );

  const teamTraining = useMemo(
    () => trainingModules.filter((module) => visibleUserIds.has(module.userId)),
    [trainingModules, visibleUserIds]
  );

  const pendingApprovals = teamLeaveRequests.filter(
    (request) => request.status === "Pending"
  ).length;

  const completedTrainingCount = teamTraining.filter(
    (module) => module.status === "completed"
  ).length;

  const trainingCompletionRate =
    teamTraining.length > 0
      ? Math.round((completedTrainingCount / teamTraining.length) * 100)
      : 0;

  const roleDistribution = Object.entries(
    visibleUsers.reduce<Record<string, number>>((acc, user) => {
      acc[user.role] = (acc[user.role] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const attendanceTrend = Object.entries(
    teamAttendance.reduce<
      Record<string, { totalHours: number; count: number }>
    >((acc, record) => {
      const entry = acc[record.date] ?? { totalHours: 0, count: 0 };
      entry.totalHours += record.totalHours;
      entry.count += 1;
      acc[record.date] = entry;
      return acc;
    }, {})
  )
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-7)
    .map(([date, value]) => ({
      date: formatChartDate(date),
      avgHours:
        value.count > 0 ? Number((value.totalHours / value.count).toFixed(1)) : 0,
    }));

  const trainingBreakdown = [
    { name: "Completed", value: completedTrainingCount },
    { name: "Pending", value: Math.max(teamTraining.length - completedTrainingCount, 0) },
  ];

  if (visibleUsers.length === 0) {
    return (
      <div className="glass-card rounded-2xl border border-border/40 p-6 text-center">
        <p className="text-sm font-semibold text-foreground">
          No analytics data available
        </p>
        <p className="mt-1 text-xs text-foreground-muted">
          Team data will appear here once users and activity records are available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard
          label="Total Headcount"
          value={String(visibleUsers.length)}
          sublabel={
            activeUser.role === "Manager" ? "Direct reports" : "Visible workforce"
          }
          icon={<Users size={16} />}
        />
        <StatCard
          label="Pending Approvals"
          value={String(pendingApprovals)}
          sublabel="Leave requests awaiting action"
          icon={<Clock3 size={16} />}
        />
        <StatCard
          label="Training Completion"
          value={`${trainingCompletionRate}%`}
          sublabel={`${completedTrainingCount}/${teamTraining.length} modules done`}
          icon={<BookOpenCheck size={16} />}
        />
      </div>

      <div className="glass-card rounded-2xl border border-border/40 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Headcount Mix</h3>
          <p className="text-xs text-foreground-muted">
            Employee distribution by role
          </p>
        </div>

        <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-3">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={74}
                  paddingAngle={3}
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "var(--background-secondary)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {roleDistribution.map((item, index) => (
              <div
                key={item.name}
                className="rounded-xl border border-border/30 bg-background-secondary/40 p-3"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <p className="text-xs font-semibold text-foreground">
                    {item.name}
                  </p>
                </div>
                <p className="text-[11px] text-foreground-muted">
                  {item.value} member{item.value === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-border/40 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Attendance Trend</h3>
          <p className="text-xs text-foreground-muted">
            Average hours across the team
          </p>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceTrend}>
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--foreground-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--foreground-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  background: "var(--background-secondary)",
                }}
              />
              <Bar dataKey="avgHours" radius={[10, 10, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-border/40 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Training Completion
            </h3>
            <p className="text-xs text-foreground-muted">
              Completed vs pending learning modules
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-foreground">
              {trainingCompletionRate}%
            </p>
            <p className="text-[10px] text-foreground-muted">Completion rate</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
          <div>
            <div className="mb-3 h-3 overflow-hidden rounded-full bg-secondary/80">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-in-out"
                style={{ width: `${trainingCompletionRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-foreground-muted">
              <span>{completedTrainingCount} completed</span>
              <span>{Math.max(teamTraining.length - completedTrainingCount, 0)} pending</span>
            </div>
          </div>

          <div className="h-28 w-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trainingBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={28}
                  outerRadius={42}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "var(--background-secondary)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
