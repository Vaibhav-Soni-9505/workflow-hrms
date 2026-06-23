'use client';

import { useRole } from '../../context/RoleContext';
import BottomNav from '../layout/BottomNav';
import RoleSwitcher from '../layout/RoleSwitcher';
import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { role } = useRole();

  return (
    // Outer: full screen with centered shell
    <div className="min-h-screen bg-slate-950 flex items-start justify-center">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Mobile-constrained app container */}
      <div className="relative w-full max-w-mobile min-h-screen bg-background flex flex-col shadow-2xl overflow-hidden">
        {/* Top role switcher */}
        <RoleSwitcher />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24">
          {children}
        </main>

        {/* Fixed bottom navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
