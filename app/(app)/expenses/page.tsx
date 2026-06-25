"use client";

import React from "react";
import { CreditCard, Shield, Users } from "lucide-react";
import { clsx } from "clsx";
import { useRole } from "../../../context/RoleContext";
import { useGlobalStore } from "../../../store/useGlobalStore";
import ExpensesModule from "../../../components/expenses";

export default function ExpensesPage() {
  const { role } = useRole();
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);

  const activeUser = users.find((u) => u.id === activeUserId) || users[0];
  const isEmployee = role === "Employee";

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  const roleLabel =
    role === "Manager" ? "Manager View" : role === "HR" ? "HR View" : "";

  return (
    <div className="px-4 pt-3 pb-28 space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-foreground-muted font-medium">
            {greeting}, {activeUser.name}
          </p>
          <h1 className="text-2xl font-black text-foreground">Expenses</h1>
          <p className="text-xs text-foreground-muted mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Role badge */}
        <div
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold",
            isEmployee
              ? "bg-primary/10 text-primary border-primary/25"
              : role === "Manager"
                ? "bg-blue-500/10 text-blue-400 border-blue-500/25"
                : "bg-orange-500/10 text-orange-400 border-orange-500/25",
          )}
        >
          {isEmployee ? (
            <CreditCard size={12} />
          ) : role === "Manager" ? (
            <Users size={12} />
          ) : (
            <Shield size={12} />
          )}
          {isEmployee ? "My Expenses" : roleLabel}
        </div>
      </div>

      {/* Admin fallback */}
      {role === "Admin" ? (
        <div className="glass-card rounded-2xl p-6 text-center border border-border/40">
          <p className="text-lg mb-2">⚙️</p>
          <p className="text-sm font-bold text-foreground">Admin View</p>
          <p className="text-xs text-foreground-muted mt-1">
            Switch to Employee, Manager, or HR role to access expenses.
          </p>
        </div>
      ) : (
        <ExpensesModule />
      )}
    </div>
  );
}
