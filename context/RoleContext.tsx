'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role = 'Employee' | 'Manager' | 'HR' | 'Admin';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'workflow_hrms_role';

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>('Employee');

  useEffect(() => {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY) as Role | null;
    if (stored && ['Employee', 'Manager', 'HR', 'Admin'].includes(stored)) {
      setRoleState(stored);
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem(ROLE_STORAGE_KEY, newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
