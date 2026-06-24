'use client';

// ──────────────────────────────────────────────────────────────────────────────
// WorkFlow HRMS — RoleContext
//
// Thin adapter over the Zustand global store.
// All existing consumers of `useRole()` continue to work with ZERO changes —
// they still get `role` (string) and `setRole(role)`.
// Internally this maps to the active user's persona in the store.
// ──────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, ReactNode } from 'react';
import { useGlobalStore, type Role } from '../store/useGlobalStore';

export type { Role };

interface RoleContextType {
  role:    Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { users, activeUserId, setActiveUser } = useGlobalStore();

  // Derive the current role from the active user
  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];
  const role: Role = activeUser.role;

  // Switching role → switch to the first user that has that role
  const setRole = (newRole: Role) => {
    const target = users.find((u) => u.role === newRole);
    if (target) setActiveUser(target.id);
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
