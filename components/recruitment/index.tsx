"use client";

import React from "react";
import { useGlobalStore } from "../../store/useGlobalStore";
import InternalJobBoard from "./InternalJobBoard";
import HRPipeline from "./HRPipeline";

export default function RecruitmentModule() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);
  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];

  if (activeUser.role === "HR" || activeUser.role === "Admin") {
    return <HRPipeline />;
  }
  return <InternalJobBoard />;
}
