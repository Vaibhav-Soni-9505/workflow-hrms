"use client";

import React, { useMemo } from "react";
import { Target, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import {
  useGlobalStore,
  type Goal,
  type User,
} from "../../store/useGlobalStore";

function TeamGoalCard({ goal, user }: { goal: Goal; user: User }) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "on-track":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "at-risk":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "in-progress":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500";
      case "on-track":
        return "bg-emerald-500";
      case "at-risk":
        return "bg-amber-500";
      case "in-progress":
        return "bg-blue-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 border border-border/50 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-primary" />
            <h4 className="text-sm font-semibold text-foreground">
              {goal.title}
            </h4>
          </div>
          <p className="text-xs text-foreground-muted">
            {user.name} • {goal.dueDate}
          </p>
        </div>
        <span
          className={clsx(
            "flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold",
            getStatusBadgeClass(goal.status),
          )}
        >
          {goal.status === "at-risk" && <AlertTriangle size={12} />}
          {goal.status === "completed" && <CheckCircle2 size={12} />}
          {goal.status
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground-muted">Progress</span>
          <span className="font-bold text-foreground">{goal.progress}%</span>
        </div>
        <div className="h-3 bg-secondary/80 rounded-full overflow-hidden border border-border/30">
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-500 ease-in-out",
              getProgressBarColor(goal.status),
            )}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {goal.keyResults.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/30">
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            Key Results
          </p>
          {goal.keyResults.map((kr) => (
            <div
              key={kr.id}
              className="flex items-start justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2">
                {kr.completed ? (
                  <CheckCircle2 size={14} className="text-success" />
                ) : (
                  <AlertTriangle size={14} className="text-amber-500" />
                )}
                <span className="text-foreground">{kr.title}</span>
              </div>
              <span className="text-foreground-muted font-medium">
                {kr.current}/{kr.target}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamPerformance() {
  const users = useGlobalStore((s) => s.users);
  const goals = useGlobalStore((s) => s.goals);
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const activeUser = useGlobalStore((s) => s.getActiveUser());

  const teamGoals = useMemo(() => {
    if (activeUser.role === "Admin" || activeUser.role === "HR") {
      return goals;
    }

    return goals.filter((g) => {
      const user = users.find((u) => u.id === g.userId);
      return user?.managerId === activeUserId;
    });
  }, [goals, users, activeUserId, activeUser.role]);

  const groupedGoals = useMemo(() => {
    const grouped: Record<string, Goal[]> = {};
    teamGoals.forEach((goal) => {
      const user = users.find((u) => u.id === goal.userId);
      const key = user?.name || "Unknown";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(goal);
    });
    return grouped;
  }, [teamGoals, users]);

  return (
    <div className="space-y-6">
      {Object.keys(groupedGoals).length > 0 ? (
        Object.entries(groupedGoals).map(([userName, userGoals]) => {
          const user = users.find((u) => u.name === userName);
          return (
            <section key={userName}>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Users size={16} />
                {userName}
              </h3>
              <div className="space-y-3">
                {userGoals.map((goal) => (
                  <TeamGoalCard
                    key={goal.id}
                    goal={goal}
                    user={user || users[0]}
                  />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="glass-card rounded-xl p-6 text-center border border-border/50">
          <Target size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-semibold text-foreground-muted">
            No team goals to review
          </p>
        </div>
      )}
    </div>
  );
}
