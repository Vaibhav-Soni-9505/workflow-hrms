'use client';

import { useState } from 'react';
import { useRole, type Role } from '../../context/RoleContext';
import { ChevronDown, User, Users, Shield, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const ROLES: { value: Role; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'Employee', label: 'Employee', icon: User, color: 'text-teal-400' },
  { value: 'Manager', label: 'Manager', icon: Users, color: 'text-blue-400' },
  { value: 'HR', label: 'HR', icon: Shield, color: 'text-orange-400' },
  { value: 'Admin', label: 'Admin', icon: Settings, color: 'text-purple-400' },
];

const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  Employee: { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30' },
  Manager: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  HR: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  Admin: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
};

export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);

  const current = ROLES.find((r) => r.value === role)!;
  const colors = ROLE_COLORS[role];
  const Icon = current.icon;

  return (
    <header className="relative z-40 px-4 pt-4 pb-2">
      <div className="flex items-center justify-between">
        {/* App brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center teal-glow">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight">
            Work<span className="text-primary">Flow</span>
          </span>
        </div>

        {/* Role pill button */}
        <button
          id="role-switcher-btn"
          onClick={() => setOpen(!open)}
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200',
            colors.bg,
            colors.text,
            colors.border,
            'hover:shadow-md active:scale-95'
          )}
        >
          <Icon size={14} strokeWidth={2} />
          <span className="text-xs font-semibold">{role}</span>
          <ChevronDown
            size={12}
            strokeWidth={2}
            className={clsx('transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      </div>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full right-4 mt-2 z-40 w-52 rounded-2xl border border-border/60 bg-background-secondary shadow-lg overflow-hidden animate-scale-in">
            <div className="p-2">
              <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider px-2 py-1.5">
                Switch Role
              </p>
              {ROLES.map((r) => {
                const RoleIcon = r.icon;
                const isActive = r.value === role;
                const rColors = ROLE_COLORS[r.value];
                return (
                  <button
                    key={r.value}
                    id={`role-option-${r.value.toLowerCase()}`}
                    onClick={() => {
                      setRole(r.value);
                      setOpen(false);
                    }}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left',
                      isActive
                        ? `${rColors.bg} ${rColors.text}`
                        : 'hover:bg-muted/50 text-foreground-muted hover:text-foreground'
                    )}
                  >
                    <span
                      className={clsx(
                        'w-7 h-7 rounded-lg flex items-center justify-center',
                        isActive ? rColors.bg : 'bg-muted/50'
                      )}
                    >
                      <RoleIcon size={14} strokeWidth={2} />
                    </span>
                    <span className="text-sm font-medium">{r.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </button>
                );
              })}
            </div>
            {/* Bottom hint */}
            <div className="px-4 py-2 border-t border-border/40 bg-muted/30">
              <p className="text-[10px] text-foreground-muted">
                Demo mode — switch to explore different views
              </p>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
