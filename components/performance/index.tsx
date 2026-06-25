"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { useGlobalStore } from "../../store/useGlobalStore";
import MyPerformance from "./MyPerformance";
import TeamPerformance from "./TeamPerformance";

export default function PerformanceModule() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);
  const [activeTab, setActiveTab] = useState<"my-performance" | "team-performance">("my-performance");

  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];
  const isManagerHRorAdmin = ["Manager", "HR", "Admin"].includes(activeUser.role);

  if (!isManagerHRorAdmin) {
    return <MyPerformance />;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl bg-muted/30">
        <button
          onClick={() => setActiveTab("my-performance")}
          className={clsx(
            "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
            activeTab === "my-performance"
              ? "bg-background text-primary shadow-sm"
              : "text-foreground-muted hover:text-foreground"
          )}
        >
          My Performance
        </button>
        <button
          onClick={() => setActiveTab("team-performance")}
          className={clsx(
            "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
            activeTab === "team-performance"
              ? "bg-background text-primary shadow-sm"
              : "text-foreground-muted hover:text-foreground"
          )}
        >
          Team Performance
        </button>
      </div>

      {activeTab === "my-performance" ? (
        <MyPerformance />
      ) : (
        <TeamPerformance />
      )}
    </div>
  );
}
