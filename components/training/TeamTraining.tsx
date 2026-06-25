"use client";

import React, { useMemo } from "react";
import { Users } from "lucide-react";
import { clsx } from "clsx";
import { useGlobalStore, type TrainingModule } from "../../store/useGlobalStore";

export default function TeamTraining() {
  const users = useGlobalStore((s) => s.users);
  const trainingModules = useGlobalStore((s) => s.trainingModules);
  const activeUserId = useGlobalStore((s) => s.activeUserId);

  // Find active user's full object
  const activeUser = useMemo(
    () => users.find((u) => u.id === activeUserId) || users[0],
    [users, activeUserId]
  );

  // Determine visible users
  const visibleUsers = useMemo(() => {
    if (activeUser.role === "HR" || activeUser.role === "Admin") {
      return users.filter((u) => u.id !== activeUserId);
    }
    if (activeUser.role === "Manager") {
      return users.filter((u) => u.managerId === activeUserId);
    }
    return [];
  }, [users, activeUserId, activeUser.role]);

  // Helper functions
  const getUserTraining = (userId: string) => {
    return trainingModules.filter((m) => m.userId === userId);
  };

  const getUserProgress = (modules: TrainingModule[]) => {
    if (modules.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const totalProgress = modules.reduce((sum, m) => sum + m.progress, 0);
    const average = Math.round(totalProgress / modules.length);
    const completed = modules.filter((m) => m.status === "completed").length;
    return { completed, total: modules.length, percentage: average };
  };

  return (
    <div className="space-y-4">
      {visibleUsers.length > 0 ? (
        visibleUsers.map((user) => {
          const userModules = getUserTraining(user.id);
          const { completed, total, percentage } = getUserProgress(userModules);

          return (
            <div
              key={user.id}
              className="glass-card rounded-xl p-4 border border-border/50"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {user.name}
                    </h4>
                    <p className="text-xs text-foreground-muted">{user.role}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-foreground-muted">
                  {completed}/{total} Completed
                </span>
              </div>

              {total > 0 && (
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground-muted">
                      Average Progress
                    </span>
                    <span className="font-bold text-foreground">
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-secondary/80 rounded-full overflow-hidden border border-border/30">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-in-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {userModules.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-border/30">
                  {userModules.map((module) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/20 text-xs"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {module.title}
                        </p>
                        <p className="text-foreground-muted">
                          Due {module.dueDate}
                        </p>
                      </div>
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-full text-[10px] font-semibold",
                          module.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : module.status === "in-progress"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-muted/20 text-foreground-muted"
                        )}
                      >
                        {module.progress}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-foreground-muted pt-2 border-t border-border/30">
                  No training assigned
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="glass-card rounded-xl p-6 text-center border border-border/50">
          <Users size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-semibold text-foreground-muted">
            No team members found
          </p>
        </div>
      )}
    </div>
  );
}
