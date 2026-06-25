"use client";

import React from "react";
import { useGlobalStore } from "../../store/useGlobalStore";
import EmployeeDocuments from "./EmployeeDocuments";
import HRDocumentVerification from "./HRDocumentVerification";

export default function DocumentsModule() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);

  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];
  const isHROrAdmin = activeUser.role === "HR" || activeUser.role === "Admin";

  return isHROrAdmin ? <HRDocumentVerification /> : <EmployeeDocuments />;
}
