'use client';

// ──────────────────────────────────────────────────────────────────────────────
// WorkFlow HRMS — RoleSwitcher
//
// Consumes the Zustand global store directly.
// Each dropdown option shows the persona name + role label (e.g. "Alex · Employee").
// Selecting a persona calls setActiveUser(user.id) on the store.
// ──────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { ChevronDown, User, Users, Shield, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { useGlobalStore, type Role } from '../../store/useGlobalStore';

// ── Per-role visual config ────────────────────────────────────────────────────

const ROLE_META: Record<Role, {
  icon:   React.ElementType;
  bg:     string;
  text:   string;
  border: string;
}> = {
  Employee: { icon: User,     bg: 'bg-teal-500/15',   text: 'text-teal-400',   border: 'border-teal-500/30'   },
  Manager:  { icon: Users,    bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/30'   },
  HR:       { icon: Shield,   bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  Admin:    { icon: Settings, bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function RoleSwitcher() {
  const { users, activeUserId, setActiveUser } = useGlobalStore();
  const [open, setOpen] = useState(false);

  const activeUser = users.find((u) => u.id === activeUserId) ?? users[0];
  const meta = ROLE_META[activeUser.role];
  const ActiveIcon = meta.icon;

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

        {/* Active persona pill */}
        <button
          id="role-switcher-btn"
          onClick={() => setOpen(!open)}
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200',
            meta.bg, meta.text, meta.border,
            'hover:shadow-md active:scale-95'
          )}
        >
          <ActiveIcon size={13} strokeWidth={2} />
          <span className="text-xs font-semibold">{activeUser.name}</span>
          <span className="text-[10px] font-medium opacity-60">· {activeUser.role}</span>
          <ChevronDown
            size={11}
            strokeWidth={2}
            className={clsx('transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      </div>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div
            className="absolute top-full right-4 mt-2 z-50 w-60 rounded-2xl border border-border/60 shadow-xl overflow-hidden animate-scale-in"
            style={{ background: 'var(--background-secondary)' }}
          >
            <div className="p-2">
              <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider px-2 py-1.5">
                Switch Persona
              </p>

              {users.map((user, idx) => {
                const m      = ROLE_META[user.role];
                const Icon   = m.icon;
                const active = user.id === activeUserId;

                return (
                  <button
                    key={user.id}
                    id={`role-option-${user.role.toLowerCase()}`}
                    onClick={() => { setActiveUser(user.id); setOpen(false); }}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left',
                      active
                        ? `${m.bg} ${m.text}`
                        : 'hover:bg-background-tertiary text-foreground-muted hover:text-foreground'
                    )}
                  >
                    {/* Avatar */}
                    <span
                      className={clsx(
                        'w-8 h-8 rounded-xl flex items-center justify-center font-black text-[11px] flex-shrink-0',
                        active ? m.bg : 'bg-muted/50'
                      )}
                    >
                      {user.avatar}
                    </span>

                    {/* Name + role */}
                    <span className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold leading-tight">{user.name}</span>
                      <span className="text-[10px] opacity-60 leading-tight">{user.role} · {user.designation}</span>
                    </span>

                    {/* Active dot */}
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-border/40" style={{ background: 'var(--background-tertiary)' }}>
              <p className="text-[10px] text-foreground-muted">
                Demo mode — switch persona to explore role-specific views
              </p>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
