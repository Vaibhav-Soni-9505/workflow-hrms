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
import { Calendar, Clock3, Timer } from "lucide-react";
import { useGlobalStore } from "../../store/useGlobalStore";

const PIE_COLORS = ["#14b8a6", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

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

export default function EmployeeAnalytics() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const attendance = useGlobalStore((s) => s.attendance);
  const leaveRequests = useGlobalStore((s) => s.leaveRequests);
  const leaveBalances = useGlobalStore((s) => s.leaveBalances);

  const myAttendance = useMemo(
    () =>
      attendance
        .filter((record) => record.userId === activeUserId)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [attendance, activeUserId]
  );

  const myLeaveRequests = useMemo(
    () => leaveRequests.filter((request) => request.userId === activeUserId),
    [leaveRequests, activeUserId]
  );

  const leaveBalance = useMemo(
    () =>
      leaveBalances
        .filter((balance) => balance.userId === activeUserId)
        .reduce((sum, balance) => sum + balance.available, 0),
    [leaveBalances, activeUserId]
  );

  const totalDaysPresent = myAttendance.filter(
    (record) =>
      record.status === "Present" ||
      record.status === "Late" ||
      record.status === "Half-day"
  ).length;

  const totalLeaveTaken = myLeaveRequests
    .filter((request) => request.status === "Approved")
    .reduce((sum, request) => sum + request.totalDays, 0);

  const workedDays = myAttendance.filter((record) => record.totalHours > 0);
  const averageWorkingHours =
    workedDays.length > 0
      ? workedDays.reduce((sum, record) => sum + record.totalHours, 0) /
        workedDays.length
      : 0;

  const recentHoursData = myAttendance.slice(-7).map((record) => ({
    date: formatChartDate(record.date),
    hours: Number(record.totalHours.toFixed(1)),
  }));

  const statusDistribution = Object.entries(
    myAttendance.reduce<Record<string, number>>((acc, record) => {
      acc[record.status] = (acc[record.status] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard
          label="Total Days Present"
          value={String(totalDaysPresent)}
          sublabel="This week"
          icon={<Calendar size={16} />}
        />
        <StatCard
          label="Leave Balance"
          value={`${leaveBalance}d`}
          sublabel={`${totalLeaveTaken} days taken`}
          icon={<Clock3 size={16} />}
        />
        <StatCard
          label="Avg Hours/Day"
          value={averageWorkingHours.toFixed(1)}
          sublabel="Across worked days"
          icon={<Timer size={16} />}
        />
      </div>

      <div className="glass-card rounded-2xl border border-border/40 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Hours Worked</h3>
          <p className="text-xs text-foreground-muted">
            Last {recentHoursData.length} attendance records
          </p>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recentHoursData}>
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
                cursor={{ fill: "rgba(20, 184, 166, 0.08)" }}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  background: "var(--background-secondary)",
                }}
              />
              <Bar dataKey="hours" radius={[10, 10, 0, 0]} fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-border/40 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">
            Attendance Status Mix
          </h3>
          <p className="text-xs text-foreground-muted">
            Present, leave, and exception breakdown
          </p>
        </div>

        <div className="grid grid-cols-[1.2fr_0.8fr] items-center gap-3">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={74}
                  paddingAngle={3}
                >
                  {statusDistribution.map((entry, index) => (
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
            {statusDistribution.map((item, index) => (
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
                  {item.value} record{item.value === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
