"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Clock,
  TrendingUp,
  BookOpen,
  Users,
  Calendar,
  BarChart2,
  Megaphone,
  UserCheck,
} from "lucide-react";
import { useRole, type Role } from "../../context/RoleContext";
import { clsx } from "clsx";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_CONFIG: Record<Role, NavItem[]> = {
  Employee: [
    { label: "Home", href: "/home", icon: Home },
    { label: "Attendance", href: "/attendance", icon: Clock },
    { label: "Leave", href: "/leave", icon: Calendar },
    { label: "Performance", href: "/performance", icon: TrendingUp },
    { label: "Training", href: "/training", icon: BookOpen },
  ],
  Manager: [
    { label: "Home", href: "/home", icon: Home },
    { label: "Team", href: "/team", icon: Users },
    { label: "Leave", href: "/leave", icon: Calendar },
    { label: "Performance", href: "/performance", icon: TrendingUp },
    { label: "Training", href: "/training", icon: BookOpen },
  ],
  HR: [
    { label: "Home", href: "/home", icon: Home },
    { label: "Recruitment", href: "/recruitment", icon: UserCheck },
    { label: "Leave", href: "/leave", icon: Calendar },
    { label: "Analytics", href: "/analytics", icon: BarChart2 },
    { label: "Announcements", href: "/announcements", icon: Megaphone },
  ],
  Admin: [
    { label: "Home", href: "/home", icon: Home },
    { label: "Analytics", href: "/analytics", icon: BarChart2 },
    { label: "Team", href: "/team", icon: Users },
    { label: "Training", href: "/training", icon: BookOpen },
    { label: "Announcements", href: "/announcements", icon: Megaphone },
  ],
};

export default function BottomNav() {
  const { role } = useRole();
  const pathname = usePathname();
  const navItems = NAV_CONFIG[role];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50">
      {/* Blur + gradient backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/50" />

      <div className="relative flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/home" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 group"
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary animate-scale-in" />
              )}

              {/* Icon container */}
              <span
                className={clsx(
                  "relative flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-foreground-muted group-hover:text-foreground group-hover:bg-muted/50",
                )}
              >
                <Icon
                  size={isActive ? 20 : 19}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-transform duration-200 group-hover:scale-110"
                />

                {/* Active glow */}
                {isActive && (
                  <span className="absolute inset-0 rounded-xl bg-primary/10 blur-sm" />
                )}
              </span>

              {/* Label */}
              <span
                className={clsx(
                  "text-[10px] font-medium transition-colors duration-200 leading-none",
                  isActive
                    ? "text-primary"
                    : "text-foreground-muted group-hover:text-foreground",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
