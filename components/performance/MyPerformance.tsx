"use client";

import React, { useMemo } from "react";
import { CheckCircle2, AlertTriangle, Star, Target } from "lucide-react";
import { clsx } from "clsx";
import {
  useGlobalStore,
  type Goal,
  type PerformanceReview,
} from "../../store/useGlobalStore";

function GoalCard({ goal }: { goal: Goal }) {
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
            <Target size={16} className="text-primary" />
            <h4 className="text-sm font-semibold text-foreground">
              {goal.title}
            </h4>
          </div>
          <p className="text-xs text-foreground-muted">{goal.description}</p>
        </div>
        <span
          className={clsx(
            "flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold",
            getStatusBadgeClass(goal.status),
          )}
        >
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

function ReviewCard({ review }: { review: PerformanceReview }) {
  const reviewer = useGlobalStore((s) =>
    s.users.find((u) => u.id === review.reviewerId),
  );

  return (
    <div className="glass-card rounded-xl p-4 border border-border/50 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star size={16} className="text-amber-500" />
            <h4 className="text-sm font-semibold text-foreground">
              {review.type.charAt(0).toUpperCase() + review.type.slice(1)}{" "}
              Review
            </h4>
          </div>
          <p className="text-xs text-foreground-muted">
            By {reviewer?.name || "Unknown"} • {review.date}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.floor(review.overallRating)
                  ? "text-amber-500 fill-amber-500"
                  : "text-muted"
              }
            />
          ))}
          <span className="text-sm font-bold text-foreground ml-1">
            {review.overallRating}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1">
            Strengths
          </p>
          <div className="flex flex-wrap gap-2">
            {review.strengths.map((strength, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-lg bg-success/10 text-success text-xs font-medium"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1">
            Improvements
          </p>
          <div className="flex flex-wrap gap-2">
            {review.improvements.map((improvement, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-medium"
              >
                {improvement}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1">
            Recommendations
          </p>
          <p className="text-xs text-foreground">{review.recommendations}</p>
        </div>
      </div>
    </div>
  );
}

export default function MyPerformance() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const goals = useGlobalStore((s) => s.goals);
  const reviews = useGlobalStore((s) => s.performanceReviews);

  const myGoals = useMemo(
    () => goals.filter((g) => g.userId === activeUserId),
    [goals, activeUserId],
  );

  const myReviews = useMemo(
    () => reviews.filter((r) => r.userId === activeUserId),
    [reviews, activeUserId],
  );

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Target size={16} />
          My Goals
        </h3>
        {myGoals.length > 0 ? (
          <div className="space-y-3">
            {myGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-6 text-center border border-border/50">
            <p className="text-sm font-semibold text-foreground-muted">
              No goals yet
            </p>
          </div>
        )}
      </section>

      {myReviews.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Star size={16} />
            Reviews
          </h3>
          <div className="space-y-3">
            {myReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
