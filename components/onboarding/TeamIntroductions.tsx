'use client';

import { useState } from 'react';
import type { TeamMember } from '../../types/onboarding';
import { ChevronRight, Linkedin, Star, CheckCircle2, Circle } from 'lucide-react';
import { clsx } from 'clsx';

interface TeamIntroductionsProps {
  members: TeamMember[];
}

const INTRO_STATUS = {
  pending: { label: 'Introduce Yourself', icon: Circle, class: 'text-foreground-muted' },
  introduced: { label: 'Introduced', icon: CheckCircle2, class: 'text-primary' },
  connected: { label: 'Connected', icon: Star, class: 'text-accent' },
};

export default function TeamIntroductions({ members }: TeamIntroductionsProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-foreground">Meet Your Team</h3>
        <span className="text-[11px] text-foreground-muted">{members.length} members</span>
      </div>

      <div className="space-y-2">
        {members.map((member, i) => (
          <MemberCard
            key={member.id}
            member={member}
            index={i}
            isSelected={selected === member.id}
            onToggle={() => setSelected(selected === member.id ? null : member.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MemberCard({
  member,
  index,
  isSelected,
  onToggle,
}: {
  member: TeamMember;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const status = INTRO_STATUS[member.introductionStatus];
  const StatusIcon = status.icon;

  return (
    <div
      className={clsx(
        'rounded-2xl border transition-all duration-200 overflow-hidden',
        isSelected ? 'border-primary/30 bg-primary/5' : 'border-border/40 bg-background-secondary/50'
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        id={`team-member-${member.id}`}
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3.5 text-left"
      >
        {/* Avatar */}
        <div
          className={clsx(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold',
            member.avatarColor
          )}
        >
          {member.avatarInitials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
          <p className="text-[11px] text-foreground-muted truncate">{member.role} · {member.department}</p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusIcon size={13} className={status.class} />
          <ChevronRight
            size={14}
            className={clsx('text-foreground-muted transition-transform duration-200', isSelected && 'rotate-90')}
          />
        </div>
      </button>

      {/* Expanded bio */}
      {isSelected && (
        <div className="px-4 pb-4 animate-slide-up">
          <div className="h-px bg-border/30 mb-3" />

          {/* Bio */}
          <p className="text-xs text-foreground/80 leading-relaxed mb-3">{member.bio}</p>

          {/* Expertise tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {member.expertise.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium bg-primary/10 text-primary-light px-2.5 py-1 rounded-full border border-primary/20"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Fun fact */}
          <div className="flex items-start gap-2 bg-accent/10 border border-accent/20 rounded-xl p-3">
            <span className="text-base flex-shrink-0">✨</span>
            <div>
              <p className="text-[10px] font-semibold text-accent mb-0.5">Fun Fact</p>
              <p className="text-xs text-foreground/80 leading-relaxed">{member.funFact}</p>
            </div>
          </div>

          {/* Status / action */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5">
              <StatusIcon size={13} className={status.class} />
              <span className={clsx('text-xs font-medium', status.class)}>{status.label}</span>
            </div>
            {member.introductionStatus === 'pending' && (
              <button
                id={`intro-${member.id}`}
                className="text-xs font-semibold text-primary border border-primary/30 bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors active:scale-95"
              >
                Say Hello 👋
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
