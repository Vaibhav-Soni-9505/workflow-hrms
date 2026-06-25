"use client";

import React from "react";
import { BarChart2, Shield, Users } from "lucide-react";
import { clsx } from "clsx";
import { useRole } from "../../../context/RoleContext";
import { useGlobalStore } from "../../../store/useGlobalStore";
import AnalyticsModule from "../../../components/analytics";

export default function AnalyticsPage() {
  const { role } = useRole();
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);

  const activeUser = users.find((user) => user.id === activeUserId) ?? users[0];

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  const roleLabel =
    role === "Employee"
      ? "My Analytics"
      : role === "Manager"
      ? "Team Analytics"
      : role === "HR"
      ? "HR Dashboard"
      : "Admin Dashboard";

  return (
    <div className="animate-fade-in space-y-5 px-4 pt-3 pb-28">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-foreground-muted">
            {greeting}, {activeUser.name}
          </p>
          <h1 className="text-2xl font-black text-foreground">Analytics</h1>
          <p className="mt-0.5 text-xs text-foreground-muted">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div
          className={clsx(
            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
            role === "Employee"
              ? "border-primary/25 bg-primary/10 text-primary"
              : role === "Manager"
              ? "border-blue-500/25 bg-blue-500/10 text-blue-400"
              : "border-orange-500/25 bg-orange-500/10 text-orange-400"
          )}
        >
          {role === "Employee" ? (
            <BarChart2 size={12} />
          ) : role === "Manager" ? (
            <Users size={12} />
          ) : (
            <Shield size={12} />
          )}
          {roleLabel}
        </div>
      </div>

      <AnalyticsModule />
    </div>
  );
}
