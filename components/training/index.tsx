"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { useGlobalStore } from "../../store/useGlobalStore";
import MyTraining from "./MyTraining";
import TeamTraining from "./TeamTraining";

export default function TrainingModule() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);
  const [activeTab, setActiveTab] = useState<"my-learning" | "team-progress">("my-learning");

  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];
  const isManagerHRorAdmin = ["Manager", "HR", "Admin"].includes(activeUser.role);

  if (!isManagerHRorAdmin) {
    return <MyTraining />;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl bg-muted/30">
        <button
          onClick={() => setActiveTab("my-learning")}
          className={clsx(
            "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
            activeTab === "my-learning"
              ? "bg-background text-primary shadow-sm"
              : "text-foreground-muted hover:text-foreground"
          )}
        >
          My Learning
        </button>
        <button
          onClick={() => setActiveTab("team-progress")}
          className={clsx(
            "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
            activeTab === "team-progress"
              ? "bg-background text-primary shadow-sm"
              : "text-foreground-muted hover:text-foreground"
          )}
        >
          Team Progress
        </button>
      </div>

      {activeTab === "my-learning" ? (
        <MyTraining />
      ) : (
        <TeamTraining />
      )}
    </div>
  );
}
