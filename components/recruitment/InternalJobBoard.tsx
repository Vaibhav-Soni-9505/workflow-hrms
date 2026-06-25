"use client";

import React from "react";
import { useGlobalStore } from "../../store/useGlobalStore";

export default function InternalJobBoard() {
  const jobPostings = useGlobalStore((s) => s.jobPostings);
  const activeJobs = jobPostings.filter((job) => job.status === "active");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Internal Job Board</h3>
      {activeJobs.length === 0 ? (
        <div className="glass-card rounded-xl p-6 text-center border border-border/50">
          <p className="text-sm font-semibold text-foreground-muted">
            No open positions right now!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="glass-card rounded-xl p-4 border border-border/50 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {job.title}
                  </h4>
                  <p className="text-xs text-foreground-muted">
                    {job.department} • {job.location}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-500 border border-green-500/25">
                  {job.employmentType}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-foreground-muted">
                  <span className="font-medium text-foreground">
                    Experience:
                  </span>{" "}
                  {job.experience}
                </p>
                <p className="text-foreground-muted">
                  <span className="font-medium text-foreground">
                    Salary:
                  </span>{" "}
                  {job.salaryRange}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Requirements
                </p>
                <ul className="text-xs text-foreground-muted list-disc list-inside">
                  {job.requirements.slice(0, 3).map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  alert("Successfully applied! HR will reach out soon.");
                }}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
