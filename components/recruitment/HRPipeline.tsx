"use client";

import React, { useState, useMemo } from "react";
import { X, Star, Calendar as CalendarIcon } from "lucide-react";
import { clsx } from "clsx";
import {
  useGlobalStore,
  type Candidate,
  type JobPosting,
} from "../../store/useGlobalStore";

export default function HRPipeline() {
  const jobPostings = useGlobalStore((s) => s.jobPostings);
  const candidates = useGlobalStore((s) => s.candidates);
  const updateCandidateStatus = useGlobalStore(
    (s) => s.updateCandidateStatus
  );
  const scheduleInterview = useGlobalStore((s) => s.scheduleInterview);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  const jobMap = useMemo(
    () =>
      jobPostings.reduce((acc, job) => {
        acc[job.id] = job;
        return acc;
      }, {} as Record<string, JobPosting>),
    [jobPostings]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Recruitment Pipeline</h3>
      {candidates.length === 0 ? (
        <div className="glass-card rounded-xl p-6 text-center border border-border/50">
          <p className="text-sm font-semibold text-foreground-muted">
            No candidates in the pipeline right now!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className="glass-card rounded-xl p-4 border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {candidate.name}
                  </h4>
                  <p className="text-xs text-foreground-muted">
                    {jobMap[candidate.jobId]?.title || "Unknown Role"}
                  </p>
                </div>
                <span
                  className={clsx(
                    "px-2 py-1 rounded-full text-[10px] font-semibold border",
                    candidate.status === "hired"
                      ? "bg-green-500/10 text-green-500 border-green-500/25"
                      : candidate.status === "rejected"
                      ? "bg-red-500/10 text-red-500 border-red-500/25"
                      : "bg-accent/10 text-accent border-accent/25"
                  )}
                >
                  {candidate.status.split("-").join(" ")}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground-muted">{candidate.email}</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={clsx(
                        i < candidate.rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setSelectedCandidate(null)}
          />
          <div className="relative w-full max-w-mobile rounded-t-3xl border-t border-border/50 animate-slide-up shadow-2xl flex flex-col max-h-[88vh] mb-[68px] bg-background">
            <div className="flex-shrink-0 px-5 pt-4 pb-0">
              <div className="w-10 h-1 rounded-full bg-border/60 mx-auto mb-4" />
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-4 right-5 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
              <h2 className="text-base font-black text-foreground mb-0.5">
                {selectedCandidate.name}
              </h2>
              <p className="text-xs text-foreground-muted">
                {selectedCandidate.email}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                    Application Status
                  </label>
                  <select
                    value={selectedCandidate.status}
                    onChange={(e) =>
                      updateCandidateStatus(
                        selectedCandidate.id,
                        e.target.value as Candidate["status"]
                      )
                    }
                    className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                    style={{ background: "var(--background-tertiary)" }}
                  >
                    {[
                      "new",
                      "screening",
                      "shortlisted",
                      "interview-scheduled",
                      "interviewed",
                      "offer-extended",
                      "hired",
                      "rejected",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status.split("-").join(" ")}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCandidate.status === "interview-scheduled" &&
                  selectedCandidate.interviewDate && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                      <div className="flex items-center gap-2 text-xs">
                        <CalendarIcon size={12} className="text-amber-500" />
                        <span className="text-amber-600">
                          Interview Scheduled: {selectedCandidate.interviewDate}
                        </span>
                      </div>
                    </div>
                  )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedCandidate.interviewDate}
                    onChange={(e) =>
                      scheduleInterview(selectedCandidate.id, e.target.value)
                    }
                    className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                    style={{ background: "var(--background-tertiary)" }}
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-border/30">
                  <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                    Candidate Details
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-foreground-muted">
                        Role:{" "}
                        <span className="font-medium text-foreground">
                          {jobMap[selectedCandidate.jobId]?.title || "N/A"}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground-muted">
                        Experience:{" "}
                        <span className="font-medium text-foreground">
                          {selectedCandidate.experience}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground-muted">
                        Expected Salary:{" "}
                        <span className="font-medium text-foreground">
                          {selectedCandidate.expectedSalary}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground-muted">
                        Notice Period:{" "}
                        <span className="font-medium text-foreground">
                          {selectedCandidate.noticePeriod}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/30">
                  <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full text-[10px] font-semibold bg-muted/10 text-foreground-muted border border-border/25"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/30">
                  <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                    Notes
                  </p>
                  <p className="text-xs text-foreground">
                    {selectedCandidate.notes}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="flex-shrink-0 px-5 pt-3 pb-6 border-t border-border/50 space-y-2"
              style={{ background: "var(--background-secondary)" }}
            >
              <button
                onClick={() => setSelectedCandidate(null)}
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
