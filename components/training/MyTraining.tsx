"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Play,
  FileQuestion,
  Terminal,
  Award,
  CheckCircle,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import { clsx } from "clsx";
import {
  useGlobalStore,
  type TrainingModule,
  type TrainingContent,
} from "../../store/useGlobalStore";

const getContentIcon = (type: TrainingContent["type"]) => {
  switch (type) {
    case "video":
      return Play;
    case "document":
      return FileText;
    case "quiz":
      return FileQuestion;
    case "interactive":
      return Terminal;
  }
};

const getStatusColor = (status: TrainingModule["status"]) => {
  switch (status) {
    case "completed":
      return "bg-emerald-500";
    case "in-progress":
      return "bg-blue-500";
    default:
      return "bg-muted";
  }
};

const getCategoryLabel = (category: TrainingModule["category"]) => {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function MyTraining() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const trainingModules = useGlobalStore((s) => s.trainingModules);
  const markTrainingContentCompleted = useGlobalStore(
    (s) => s.markTrainingContentCompleted
  );

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    null
  );

  const myTrainingModules = useMemo(
    () => trainingModules.filter((m) => m.userId === activeUserId),
    [trainingModules, activeUserId]
  );

  const selectedModule = useMemo(
    () => trainingModules.find((m) => m.id === selectedModuleId) || null,
    [trainingModules, selectedModuleId]
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {myTrainingModules.map((module) => (
          <div
            key={module.id}
            onClick={() => setSelectedModuleId(module.id)}
            className="glass-card rounded-xl p-4 border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {module.title}
                </h4>
                <p className="text-xs text-foreground-muted">
                  {module.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {module.isMandatory ? (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/25">
                  Mandatory
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-500 border border-green-500/25">
                  Optional
                </span>
              )}

              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-muted/15 text-foreground-muted border border-border/30">
                {getCategoryLabel(module.category)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-foreground-muted mb-3">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Due {module.dueDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {module.totalDuration}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground-muted">Progress</span>
                <span className="font-bold text-foreground">
                  {module.progress}%
                </span>
              </div>
              <div className="h-3 bg-secondary/80 rounded-full overflow-hidden border border-border/30">
                <div
                  className={clsx(
                    "h-full rounded-full transition-all duration-500 ease-in-out",
                    getStatusColor(module.status)
                  )}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setSelectedModuleId(null)}
          />
          <div className="relative w-full max-w-mobile rounded-t-3xl border-t border-border/50 animate-slide-up shadow-2xl flex flex-col max-h-[88vh] mb-[68px] bg-background">
            <div className="flex-shrink-0 px-5 pt-4 pb-0">
              <div className="w-10 h-1 rounded-full bg-border/60 mx-auto mb-4" />
              <button
                onClick={() => setSelectedModuleId(null)}
                className="absolute top-4 right-5 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
              <h2 className="text-base font-black text-foreground mb-0.5">
                {selectedModule.title}
              </h2>
              <p className="text-xs text-foreground-muted">
                {selectedModule.description}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {selectedModule.status === "completed" &&
                selectedModule.certificateEligible && (
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 font-semibold">
                    <Award size={18} />
                    Download Certificate
                  </button>
                )}

              <div className="space-y-3">
                {selectedModule.content.map((content) => {
                  const Icon = getContentIcon(content.type);
                  return (
                    <div
                      key={content.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={clsx(
                            "flex items-center justify-center p-2 rounded-full",
                            content.isCompleted
                              ? "bg-emerald-500/15 text-emerald-500"
                              : "bg-muted/20 text-foreground-muted"
                          )}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {content.title}
                          </p>
                          <p className="text-xs text-foreground-muted">
                            {content.duration}
                          </p>
                        </div>
                      </div>
                      {content.isCompleted ? (
                        <CheckCircle size={18} className="text-emerald-500" />
                      ) : (
                        <button
                          onClick={() =>
                            markTrainingContentCompleted(
                              selectedModule.id,
                              content.id
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/25 text-xs font-semibold"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className="flex-shrink-0 px-5 pt-3 pb-6 border-t border-border/50 space-y-2"
              style={{ background: "var(--background-secondary)" }}
            >
              <button
                onClick={() => setSelectedModuleId(null)}
                className="w-full py-2.5 rounded-2xl text-sm text-foreground-muted font-medium hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
