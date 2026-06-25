"use client";

import React from "react";
import { Users, Shield, Briefcase } from "lucide-react";
import { clsx } from "clsx";
import { useRole } from "../../../context/RoleContext";
import { useGlobalStore } from "../../../store/useGlobalStore";
import RecruitmentModule from "../../../components/recruitment";

export default function RecruitmentPage() {
  const { role } = useRole();
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);

  const activeUser = users.find((u) => u.id === activeUserId) || users[0];

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  const roleLabel =
    role === "HR" ? "HR View" : role === "Admin" ? "Admin View" : "";

  return (
    <div className="px-4 pt-3 pb-28 space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-foreground-muted font-medium">
            {greeting}, {activeUser.name}
          </p>
          <h1 className="text-2xl font-black text-foreground">Recruitment</h1>
          <p className="text-xs text-foreground-muted mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Role badge */}
        <div
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold",
            role === "Employee" || role === "Manager"
              ? "bg-primary/10 text-primary border-primary/25"
              : role === "HR"
              ? "bg-orange-500/10 text-orange-500 border-orange-500/25"
              : "bg-blue-500/10 text-blue-500 border-blue-500/25"
          )}
        >
          {role === "Employee" || role === "Manager" ? (
            <Briefcase size={12} />
          ) : role === "HR" ? (
            <Users size={12} />
          ) : (
            <Shield size={12} />
          )}
          {role === "Employee" || role === "Manager"
            ? "Job Board"
            : roleLabel}
        </div>
      </div>

      <RecruitmentModule />
    </div>
  );
}
