"use client";

import React, { useState, useMemo } from "react";
import { X, Plus, FileText, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { useGlobalStore, type UserDocument, type DocumentCategory } from "../../store/useGlobalStore";

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  identity: "Identity",
  employment: "Employment",
  "work-auth": "Work Authorization",
  tax: "Tax",
  education: "Education",
  other: "Other",
};

const today = new Date().toISOString().split("T")[0];
const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

export default function EmployeeDocuments() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const documents = useGlobalStore((s) => s.documents);
  const uploadDocument = useGlobalStore((s) => s.uploadDocument);

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("identity");
  const [fileName, setFileName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const userDocuments = useMemo(() => documents.filter((d) => d.userId === activeUserId), [documents, activeUserId]);

  const groupedDocuments = useMemo(() => {
    const grouped: Record<DocumentCategory, UserDocument[]> = {
      identity: [],
      employment: [],
      "work-auth": [],
      tax: [],
      education: [],
      other: [],
    };
    userDocuments.forEach((doc) => {
      if (grouped[doc.category]) {
        grouped[doc.category].push(doc);
      }
    });
    return grouped;
  }, [userDocuments]);

  const handleSubmit = () => {
    if (!fileName) return;

    uploadDocument({
      category: selectedCategory,
      fileName,
      fileType: fileName.split(".").pop()?.toUpperCase() || "PDF",
      fileSize: "1.2 MB",
      expiryDate: expiryDate || undefined,
    });

    setShowModal(false);
    setSelectedCategory("identity");
    setFileName("");
    setExpiryDate("");
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-success/10 text-success border-success/20";
      case "uploaded":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getExpiryColor = (expiry?: string) => {
    if (!expiry) return "text-foreground-muted";
    if (expiry < today) return "text-destructive";
    if (expiry < thirtyDaysFromNow) return "text-amber-500";
    return "text-foreground-muted";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle size={16} />;
      case "uploaded":
        return <Clock size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Upload Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          <h2 className="text-lg font-bold text-foreground">My Documents</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-dark to-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Upload Document
        </button>
      </div>

      {/* Documents Grid */}
      {Object.entries(groupedDocuments).map(([category, docs]) => {
        if (docs.length === 0) return null;
        return (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
              {CATEGORY_LABELS[category as DocumentCategory]}
            </h3>
            <div className="space-y-3">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card rounded-xl p-4 border border-border/50 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {doc.fileName}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-foreground-muted">
                          <span>{doc.fileType}</span>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                          <span>•</span>
                          <span>Uploaded: {doc.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={clsx(
                        "flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold",
                        getStatusBadgeClass(doc.status)
                      )}
                    >
                      {getStatusIcon(doc.status)}
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </div>

                  {doc.expiryDate && (
                    <div
                      className={clsx(
                        "flex items-center gap-2 text-xs font-medium",
                        getExpiryColor(doc.expiryDate)
                      )}
                    >
                      {doc.expiryDate < today || doc.expiryDate < thirtyDaysFromNow ? (
                        <AlertTriangle size={14} />
                      ) : null}
                      <span>Expires: {doc.expiryDate}</span>
                    </div>
                  )}

                  {doc.status === "rejected" && doc.rejectionReason && (
                    <div className="text-xs text-destructive font-medium">
                      Rejection reason: {doc.rejectionReason}
                    </div>
                  )}

                  {doc.verificationDate && (
                    <div className="text-xs text-success font-medium">
                      Verified on: {doc.verificationDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-mobile rounded-t-3xl border-t border-border/50 animate-slide-up shadow-2xl flex flex-col max-h-[88vh] mb-[68px] bg-background">
            <div className="flex-shrink-0 px-5 pt-4 pb-0">
              <div className="w-10 h-1 rounded-full bg-border/60 mx-auto mb-4" />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-5 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
              <h2 className="text-base font-black text-foreground mb-0.5">Upload Document</h2>
              <p className="text-xs text-foreground-muted">Fill in the details below</p>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory)}
                  className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  style={{ background: "var(--background-tertiary)" }}
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  File Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Passport_Scan.pdf"
                  className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  style={{ background: "var(--background-tertiary)" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Expiry Date (optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  min={today}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  style={{ background: "var(--background-tertiary)" }}
                />
              </div>
            </div>
            <div className="flex-shrink-0 px-5 pt-3 pb-6 border-t border-border/50 space-y-2" style={{ background: "var(--background-secondary)" }}>
              <button
                onClick={handleSubmit}
                disabled={!fileName}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
              >
                Upload
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 rounded-2xl text-sm text-foreground-muted font-medium hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
