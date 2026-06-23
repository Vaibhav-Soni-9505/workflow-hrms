'use client';

import { useState } from 'react';
import type { WelcomeMessage } from '../../types/onboarding';
import { Play, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface WelcomeMessagesProps {
  messages: WelcomeMessage[];
}

export default function WelcomeMessages({ messages }: WelcomeMessagesProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground px-1">Welcome Messages</h3>

      <div className="space-y-2">
        {messages.map((msg, i) => (
          <MessageCard
            key={msg.id}
            message={msg}
            index={i}
            isExpanded={expanded === msg.id}
            onToggle={() => setExpanded(expanded === msg.id ? null : msg.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MessageCard({
  message,
  index,
  isExpanded,
  onToggle,
}: {
  message: WelcomeMessage;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const preview = message.message.substring(0, 80) + '...';

  return (
    <div
      className={clsx(
        'rounded-2xl border transition-all duration-200 overflow-hidden',
        isExpanded ? 'border-primary/30 bg-primary/5' : 'border-border/40 bg-background-secondary/50'
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <button
        id={`welcome-msg-${message.id}`}
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-xs font-bold text-white">{message.senderAvatar}</span>
          </div>
          {message.hasVideo && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
              <Play size={8} className="text-white ml-0.5" />
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate">{message.senderName}</span>
            {message.hasVideo && (
              <span className="flex-shrink-0 text-[9px] font-bold bg-accent/15 text-orange-400 px-1.5 py-0.5 rounded-full">
                VIDEO
              </span>
            )}
          </div>
          <p className="text-[11px] text-foreground-muted truncate">{message.senderRole}</p>
        </div>

        <ChevronRight
          size={16}
          className={clsx(
            'text-foreground-muted flex-shrink-0 transition-transform duration-200',
            isExpanded && 'rotate-90'
          )}
        />
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 animate-slide-up">
          {/* Divider */}
          <div className="h-px bg-border/30 mb-3" />

          {/* Video placeholder */}
          {message.hasVideo && (
            <button
              id={`play-video-${message.id}`}
              className="w-full h-28 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-border/40 flex flex-col items-center justify-center gap-2 mb-3 group hover:border-primary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <Play size={18} className="text-accent ml-1" />
              </div>
              <span className="text-xs text-foreground-muted">Play Video Message</span>
            </button>
          )}

          {/* Message text */}
          <p className="text-sm text-foreground/90 leading-relaxed">
            "{message.message}"
          </p>

          {/* Timestamp */}
          <p className="text-[10px] text-foreground-muted mt-2">
            {new Date(message.timestamp).toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      )}
    </div>
  );
}
