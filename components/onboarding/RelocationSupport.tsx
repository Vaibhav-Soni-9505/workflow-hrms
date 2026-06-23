'use client';

import type { RelocationSupport } from '../../types/onboarding';
import {
  Plane,
  Home,
  CreditCard,
  FileCheck,
  User,
  Phone,
  Mail,
  Ticket,
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
} from 'lucide-react';
import { clsx } from 'clsx';

interface RelocationSupportProps {
  support: RelocationSupport;
}

type StatusType = 'pending' | 'processing' | 'approved' | 'not-required' | 'searching' | 'confirmed' | 'booked' | 'completed' | 'disbursed';

const STATUS_DISPLAY: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  'not-required': { label: 'Not Required', class: 'text-foreground-muted', icon: Circle },
  pending: { label: 'Pending', class: 'text-warning', icon: Clock },
  processing: { label: 'Processing', class: 'text-primary', icon: Clock },
  approved: { label: 'Approved', class: 'text-success', icon: CheckCircle2 },
  disbursed: { label: 'Disbursed', class: 'text-success', icon: CheckCircle2 },
  searching: { label: 'Searching', class: 'text-warning', icon: Clock },
  confirmed: { label: 'Confirmed', class: 'text-success', icon: CheckCircle2 },
  booked: { label: 'Booked', class: 'text-success', icon: CheckCircle2 },
  completed: { label: 'Completed', class: 'text-success', icon: CheckCircle2 },
};

const TICKET_STATUS_CONFIG = {
  open: { label: 'Open', class: 'bg-warning/15 text-yellow-400' },
  'in-progress': { label: 'In Progress', class: 'bg-primary/15 text-teal-400' },
  resolved: { label: 'Resolved', class: 'bg-success/15 text-green-400' },
};

export default function RelocationSupportView({ support }: RelocationSupportProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground px-1">Relocation Support</h3>

      {/* Status cards */}
      <div className="grid grid-cols-2 gap-2">
        <StatusCard
          icon={<FileCheck size={16} />}
          label="Visa Status"
          status={support.visaStatus as StatusType}
          iconBg="bg-blue-500/15"
          iconColor="text-blue-400"
        />
        <StatusCard
          icon={<Home size={16} />}
          label="Accommodation"
          status={support.accommodationStatus as StatusType}
          iconBg="bg-green-500/15"
          iconColor="text-green-400"
        />
        <StatusCard
          icon={<Plane size={16} />}
          label="Travel"
          status={support.travelStatus as StatusType}
          iconBg="bg-orange-500/15"
          iconColor="text-orange-400"
        />
        <StatusCard
          icon={<CreditCard size={16} />}
          label="Allowance"
          status={support.allowanceStatus as StatusType}
          iconBg="bg-teal-500/15"
          iconColor="text-teal-400"
        />
      </div>

      {/* Local Buddy */}
      <div className="glass-card rounded-2xl p-4 border border-border/40">
        <div className="flex items-center gap-2 mb-3">
          <User size={14} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Local Buddy</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {support.localBuddy.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{support.localBuddy.name}</p>
            <div className="flex flex-col gap-0.5 mt-1">
              <a href={`tel:${support.localBuddy.phone}`} className="flex items-center gap-1.5 text-[11px] text-foreground-muted hover:text-primary transition-colors">
                <Phone size={10} />
                {support.localBuddy.phone}
              </a>
              <a href={`mailto:${support.localBuddy.email}`} className="flex items-center gap-1.5 text-[11px] text-foreground-muted hover:text-primary transition-colors truncate">
                <Mail size={10} />
                {support.localBuddy.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="glass-card rounded-2xl p-4 border border-border/40">
        <div className="flex items-center gap-2 mb-3">
          <Ticket size={14} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Support Tickets</span>
          <span className="ml-auto text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold">
            {support.tickets.filter((t) => t.status !== 'resolved').length} open
          </span>
        </div>
        <div className="space-y-2">
          {support.tickets.map((ticket) => {
            const config = TICKET_STATUS_CONFIG[ticket.status];
            return (
              <div
                key={ticket.id}
                className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground flex-1 leading-snug">{ticket.title}</p>
                <span className={clsx('text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0', config.class)}>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  label,
  status,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  label: string;
  status: StatusType;
  iconBg: string;
  iconColor: string;
}) {
  const display = STATUS_DISPLAY[status] ?? STATUS_DISPLAY['pending'];
  const DisplayIcon = display.icon;

  return (
    <div className="glass-card rounded-xl p-3 border border-border/40">
      <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center mb-2', iconBg, iconColor)}>
        {icon}
      </div>
      <p className="text-[11px] text-foreground-muted">{label}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <DisplayIcon size={11} className={display.class} />
        <p className={clsx('text-xs font-semibold', display.class)}>{display.label}</p>
      </div>
    </div>
  );
}
