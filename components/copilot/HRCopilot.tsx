"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { useGlobalStore } from "../../store/useGlobalStore";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface Position {
  x: number;
  y: number;
}

const BUTTON_SIZE = 48;
const VIEWPORT_OFFSET = 18;
const INITIAL_BOTTOM_CLEARANCE = 94;
const DRAG_THRESHOLD = 5;

export default function HRCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi there! I'm your HR Copilot! I can help you check your leave balance, training progress, or profile details. What do you need?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    movedDistance: 0,
  });

  const activeUserId = useGlobalStore((s) => s.activeUserId);
  const users = useGlobalStore((s) => s.users);
  const leaveRequests = useGlobalStore((s) => s.leaveRequests);
  const trainingModules = useGlobalStore((s) => s.trainingModules);

  const activeUser = users.find((u) => u.id === activeUserId) || users[0];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clampPosition = (nextX: number, nextY: number) => ({
      x: Math.max(0, Math.min(nextX, window.innerWidth - BUTTON_SIZE)),
      y: Math.max(0, Math.min(nextY, window.innerHeight - BUTTON_SIZE)),
    });

    const frameId = window.requestAnimationFrame(() => {
      setPosition((current) => {
        if (current) {
          return clampPosition(current.x, current.y);
        }

        return clampPosition(
          window.innerWidth - BUTTON_SIZE - VIEWPORT_OFFSET,
          window.innerHeight - BUTTON_SIZE - INITIAL_BOTTOM_CLEARANCE,
        );
      });
    });

    const handleResize = () => {
      setPosition((current) => {
        if (!current) return current;
        return clampPosition(current.x, current.y);
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - dragRef.current.startX;
      const deltaY = event.clientY - dragRef.current.startY;

      dragRef.current.movedDistance = Math.max(
        dragRef.current.movedDistance,
        Math.abs(deltaX),
        Math.abs(deltaY),
      );

      const nextX = dragRef.current.originX + deltaX;
      const nextY = dragRef.current.originY + deltaY;

      setPosition({
        x: Math.max(0, Math.min(nextX, window.innerWidth - BUTTON_SIZE)),
        y: Math.max(0, Math.min(nextY, window.innerHeight - BUTTON_SIZE)),
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Leave check
    if (input.includes("leave") || input.includes("time off")) {
      const userLeaveRequests = leaveRequests.filter(
        (r) => r.userId === activeUserId && r.status === "Pending",
      );
      return `Looking at your records, you currently have ${userLeaveRequests.length} days of leave pending approval.`;
    }

    // Training check
    if (input.includes("training") || input.includes("course")) {
      const userTraining = trainingModules.filter(
        (m) => m.userId === activeUserId && m.status !== "completed",
      );
      return `You have ${userTraining.length} training modules left to complete.`;
    }

    // Role/Profile check
    if (input.includes("who am i") || input.includes("my role")) {
      return `You are logged in as ${activeUser.name}, and your role is ${activeUser.role}.`;
    }

    // Default
    return "I am your HR Copilot! I can help you check your leave balance, training progress, or profile details. What do you need?";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", text: inputText.trim() };
    setMessages((prev) => [...prev, userMessage]);

    // Generate assistant response
    const assistantResponse = generateResponse(inputText);
    const assistantMessage: Message = {
      role: "assistant",
      text: assistantResponse,
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInputText("");
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!position) return;

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      movedDistance: 0,
    };

    setIsDragging(true);
  };

  const handleToggleClick = () => {
    if (dragRef.current.movedDistance >= DRAG_THRESHOLD) {
      dragRef.current.movedDistance = 0;
      return;
    }

    setIsOpen((current) => !current);
    dragRef.current.movedDistance = 0;
  };

  if (!position) {
    return null;
  }

  return (
    <div className="z-[9999]">
      {/* Chat Modal */}
      <div
        className={clsx(
          "fixed bottom-24 right-6 z-[9999] flex h-[500px] w-80 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all duration-300 origin-bottom-right md:w-96",
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-0 opacity-0",
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-card">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <span className="font-bold text-foreground">HR Copilot</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X size={18} className="text-foreground-muted" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={clsx(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={clsx(
                  "max-w-[80%] p-3 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-none"
                    : "bg-card text-card-foreground border rounded-2xl rounded-bl-none shadow-sm",
                )}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t bg-card flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask HR Copilot..."
            className="flex-1 rounded-xl border border-border/50 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition-colors"
            style={{ background: "var(--background-tertiary)" }}
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Floating Toggle Button */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onClick={handleToggleClick}
        style={{ left: position.x, top: position.y }}
        className={clsx(
          "fixed z-[9999] touch-none select-none flex items-center justify-center h-12 w-12 rounded-full border border-primary/30 bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground shadow-[0_10px_24px_rgba(20,184,166,0.22)] ring-1 ring-background/60 cursor-pointer transition-all duration-300 ease-out",
          isDragging
            ? "cursor-grabbing scale-105 shadow-[0_14px_30px_rgba(20,184,166,0.28)]"
            : "cursor-grab hover:-translate-y-0.5 hover:scale-105 hover:border-primary/50 hover:shadow-[0_14px_30px_rgba(20,184,166,0.32)]",
        )}
      >
        <Bot size={20} strokeWidth={2.2} />
      </button>
    </div>
  );
}
