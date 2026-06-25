"use client";

import React, { useState, useMemo } from "react";
import { Shield, CheckCircle, XCircle, X } from "lucide-react";
import { clsx } from "clsx";
import { useGlobalStore, type UserDocument } from "../../store/useGlobalStore";

const CATEGORY_LABELS: Record<string, string> = {
  identity: "Identity",
  employment: "Employment",
  "work-auth": "Work Authorization",
  tax: "Tax",
  education: "Education",
  other: "Other",
};

export default function HRDocumentVerification() {
  const documents = useGlobalStore((s) => s.documents);
  const users = useGlobalStore((s) => s.users);
  const updateDocumentStatus = useGlobalStore((s) => s.updateDocumentStatus);

  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingDocuments = useMemo(() => documents.filter((d) => d.status === "uploaded"), [documents]);

  const getEmployeeName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown";
  };

  const handleVerify = (docId: string) => {
    updateDocumentStatus(docId, "verified");
  };

  const handleReject = (docId: string) => {
    if (!rejectionReason.trim()) return;
    updateDocumentStatus(docId, "rejected", { rejectionReason });
    setShowRejectModal(null);
    setRejectionReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield size={20} className="text-primary" />
        <h2 className="text-lg font-bold text-foreground">Document Verification Queue</h2>
      </div>

      {/* Pending Documents List */}
      {pendingDocuments.length > 0 ? (
        <div className="space-y-3">
          {pendingDocuments.map((doc) => (
            <div
              key={doc.id}
              className="glass-card rounded-xl p-4 border border-border/50 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{doc.fileName}</p>
                  <div className="flex items-center gap-2 text-xs text-foreground-muted flex-wrap">
                    <span>{getEmployeeName(doc.userId)}</span>
                    <span>•</span>
                    <span>{CATEGORY_LABELS[doc.category]}</span>
                    <span>•</span>
                    <span>Uploaded: {doc.uploadedAt}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVerify(doc.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-success/10 text-success border border-success/30 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                >
                  <CheckCircle size={16} />
                  Verify
                </button>
                <button
                  onClick={() => setShowRejectModal(doc.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center border border-border/50">
          <CheckCircle size={32} className="mx-auto text-success/80 mb-4" />
          <p className="text-sm font-semibold text-foreground-muted">No pending documents to verify!</p>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowRejectModal(null)} />
          <div className="relative w-full max-w-sm mx-4 rounded-2xl border border-border/50 animate-fade-in shadow-2xl bg-background">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Reject Document</h3>
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Why are you rejecting this document?"
                  className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  style={{ background: "var(--background-tertiary)" }}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm text-foreground-muted font-medium hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(showRejectModal)}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
