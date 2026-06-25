"use client";

import React, { useMemo } from "react";
import { useGlobalStore } from "../../store/useGlobalStore";
import EmployeeAnalytics from "./EmployeeAnalytics";
import HRDashboard from "./HRDashboard";

export default function AnalyticsModule() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);

  const activeUser = useMemo(
    () => users.find((user) => user.id === activeUserId) ?? users[0],
    [users, activeUserId]
  );

  if (activeUser.role === "Employee") {
    return <EmployeeAnalytics />;
  }

  return <HRDashboard />;
}
