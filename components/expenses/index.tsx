"use client";

import React, { useState } from "react";
import { useGlobalStore } from "../../store/useGlobalStore";
import MyExpenses from "./MyExpenses";
import ExpenseApprovals from "./ExpenseApprovals";
import { clsx } from "clsx";

export default function ExpensesModule() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);
  const [activeTab, setActiveTab] = useState<"my-expenses" | "approvals">("my-expenses");

  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];
  const isHROrAdminOrManager = ["HR", "Admin", "Manager"].includes(activeUser.role);

  if (!isHROrAdminOrManager) {
    return <MyExpenses />;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl bg-muted/30">
        <button
          onClick={() => setActiveTab("my-expenses")}
          className={clsx(
            "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
            activeTab === "my-expenses"
              ? "bg-background text-primary shadow-sm"
              : "text-foreground-muted hover:text-foreground"
          )}
        >
          My Expenses
        </button>
        <button
          onClick={() => setActiveTab("approvals")}
          className={clsx(
            "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
            activeTab === "approvals"
              ? "bg-background text-primary shadow-sm"
              : "text-foreground-muted hover:text-foreground"
          )}
        >
          Team Approvals
        </button>
      </div>

      {activeTab === "my-expenses" ? <MyExpenses /> : <ExpenseApprovals />}
    </div>
  );
}
