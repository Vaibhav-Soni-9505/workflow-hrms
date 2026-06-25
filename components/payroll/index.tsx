'use client';

import React from 'react';
import { useGlobalStore } from '../../store/useGlobalStore';
import PayslipView from './PayslipView';
import ComplianceDashboard from './ComplianceDashboard';

export default function PayrollModule() {
  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);

  const activeUser = users.find(u => u.id === activeUserId) ?? users[0];
  const isHROrAdmin = activeUser.role === 'HR' || activeUser.role === 'Admin';

  return isHROrAdmin ? <ComplianceDashboard /> : <PayslipView />;
}
