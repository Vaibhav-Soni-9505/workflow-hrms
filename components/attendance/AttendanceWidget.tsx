"use client";

import { useState, useEffect, useRef } from "react";
import {
  Clock,
  MapPin,
  Shield,
  Camera,
  CheckCircle2,
  LogIn,
  LogOut,
  Zap,
  Coffee,
  TrendingUp,
  Timer,
  X,
  Loader2,
  Wifi,
} from "lucide-react";
import { clsx } from "clsx";
import type { AttendanceRecord } from "../../store/useGlobalStore";

interface ModalStep {
  step: "camera" | "verifying" | "verified";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay?: number;
}) {
  return (
    <div
      className="glass-card rounded-2xl p-3.5 flex flex-col gap-2 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={clsx(
          "w-8 h-8 rounded-xl flex items-center justify-center",
          color,
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-lg font-black text-foreground leading-none">
          {value}
        </p>
        <p className="text-[10px] text-foreground-muted mt-0.5 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
}

function VerificationBadge({
  icon,
  label,
  verified,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  verified: boolean;
  delay?: number;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-500 animate-scale-in",
        verified
          ? "bg-success/10 border-success/30 text-success"
          : "bg-muted/50 border-border/40 text-foreground-muted",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
      {verified ? (
        <CheckCircle2 size={14} className="ml-auto text-success" />
      ) : (
        <Loader2 size={14} className="ml-auto animate-spin opacity-60" />
      )}
    </div>
  );
}

// ── Clock-In Modal ────────────────────────────────────────────────────────────

function ClockInModal({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [modalStep, setModalStep] = useState<ModalStep["step"]>("camera");
  const [locationOk, setLocationOk] = useState(false);
  const [ipOk, setIpOk] = useState(false);

  // Simulate verification sequence
  useEffect(() => {
    if (modalStep !== "verifying") return;
    const t1 = setTimeout(() => setLocationOk(true), 900);
    const t2 = setTimeout(() => setIpOk(true), 1600);
    const t3 = setTimeout(() => setModalStep("verified"), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [modalStep]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Sheet — constrained height with flex-col so footer never overflows */}
      <div className="relative w-full max-w-mobile bg-background-secondary rounded-t-3xl border-t border-border/50 animate-slide-up shadow-lg flex flex-col max-h-[85vh] mb-[68px]">
        {/* ── Fixed header (handle + title) ── */}
        <div className="flex-shrink-0 px-5 pt-5">
          {/* Handle bar */}
          <div className="w-10 h-1 rounded-full bg-border/60 mx-auto mb-3" />

          {/* Close */}
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
          >
            <X size={15} />
          </button>

          <h2 className="text-base font-black text-foreground mb-1">
            Clock In
          </h2>
          <p className="text-xs text-foreground-muted mb-2">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* ── Non-scrolling content area — everything must fit ── */}
        <div className="flex-1 overflow-hidden flex flex-col justify-center px-5">
          {/* ── Camera Step ── */}
          {modalStep === "camera" && (
            <div className="animate-fade-in flex flex-col items-center gap-3">
              {/* Selfie viewfinder — compact size */}
              <div className="relative mx-auto w-36 h-36">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-spin-slow" />
                {/* Inner circle */}
                <div className="absolute inset-2 rounded-full bg-background-tertiary/60 overflow-hidden flex items-center justify-center">
                  {/* Scan line */}
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div
                      className="absolute w-full h-0.5 bg-primary/60 blur-[1px]"
                      style={{ animation: "scanline 2s ease-in-out infinite" }}
                    />
                  </div>
                  <Camera size={30} className="text-foreground-muted/40" />
                </div>
                {/* Corner bracket decorations */}
                {[
                  "top-0.5 left-0.5 border-t-2 border-l-2",
                  "top-0.5 right-0.5 border-t-2 border-r-2",
                  "bottom-0.5 left-0.5 border-b-2 border-l-2",
                  "bottom-0.5 right-0.5 border-b-2 border-r-2",
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "absolute w-4 h-4 rounded-sm border-primary",
                      cls,
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-foreground-muted">
                Position your face within the frame
              </p>
            </div>
          )}

          {/* ── Verifying / Verified Step ── */}
          {(modalStep === "verifying" || modalStep === "verified") && (
            <div className="animate-fade-in flex flex-col items-center gap-4 w-full">
              {/* Status icon + ring */}
              <div className="relative flex items-center justify-center">
                {/* Animated outer ring */}
                <div
                  className={clsx(
                    "w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                    modalStep === "verified"
                      ? "border-success bg-success/10"
                      : "border-primary/50 bg-primary/10 animate-pulse",
                  )}
                >
                  {modalStep === "verified" ? (
                    <CheckCircle2
                      size={32}
                      className="text-success animate-scale-in"
                    />
                  ) : (
                    <Loader2 size={28} className="text-primary animate-spin" />
                  )}
                </div>
                {/* Glow */}
                <div
                  className={clsx(
                    "absolute inset-0 rounded-full blur-md opacity-30 transition-colors duration-500",
                    modalStep === "verified" ? "bg-success" : "bg-primary",
                  )}
                />
              </div>

              {/* Status label */}
              <div className="text-center">
                <p
                  className={clsx(
                    "text-sm font-bold transition-colors duration-300",
                    modalStep === "verified"
                      ? "text-success"
                      : "text-foreground",
                  )}
                >
                  {modalStep === "verified"
                    ? "All Checks Passed ✓"
                    : "Running Verification…"}
                </p>
                <p className="text-[11px] text-foreground-muted mt-0.5">
                  {modalStep === "verified"
                    ? "You're good to clock in"
                    : "Please hold on a moment"}
                </p>
              </div>

              {/* Verification checklist */}
              <div className="w-full space-y-2">
                {/* Location row */}
                <div
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-400",
                    locationOk
                      ? "bg-success/10 border-success/30"
                      : "bg-muted/40 border-border/30",
                  )}
                >
                  <div
                    className={clsx(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                      locationOk
                        ? "bg-success/20 text-success"
                        : "bg-muted/60 text-foreground-muted",
                    )}
                  >
                    <MapPin size={14} />
                  </div>
                  <div className="flex-1">
                    <p
                      className={clsx(
                        "text-xs font-semibold transition-colors duration-300",
                        locationOk ? "text-success" : "text-foreground-muted",
                      )}
                    >
                      Location
                    </p>
                    <p className="text-[10px] text-foreground-muted/70">
                      {locationOk
                        ? "Office premises confirmed"
                        : "Checking GPS…"}
                    </p>
                  </div>
                  {locationOk ? (
                    <CheckCircle2
                      size={16}
                      className="text-success animate-scale-in flex-shrink-0"
                    />
                  ) : (
                    <Loader2
                      size={14}
                      className="animate-spin text-foreground-muted flex-shrink-0"
                    />
                  )}
                </div>

                {/* IP row */}
                <div
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-400",
                    ipOk
                      ? "bg-success/10 border-success/30"
                      : "bg-muted/40 border-border/30",
                  )}
                >
                  <div
                    className={clsx(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                      ipOk
                        ? "bg-success/20 text-success"
                        : "bg-muted/60 text-foreground-muted",
                    )}
                  >
                    <Wifi size={14} />
                  </div>
                  <div className="flex-1">
                    <p
                      className={clsx(
                        "text-xs font-semibold transition-colors duration-300",
                        ipOk ? "text-success" : "text-foreground-muted",
                      )}
                    >
                      Network / IP
                    </p>
                    <p className="text-[10px] text-foreground-muted/70">
                      {ipOk
                        ? "Corporate network verified"
                        : "Validating IP address…"}
                    </p>
                  </div>
                  {ipOk ? (
                    <CheckCircle2
                      size={16}
                      className="text-success animate-scale-in flex-shrink-0"
                    />
                  ) : (
                    <Loader2
                      size={14}
                      className="animate-spin text-foreground-muted flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer / Action Button — always visible, never scrolls away ── */}
        <div className="flex-shrink-0 bg-background-secondary px-5 pb-8 pt-4 border-t border-border/50">
          {modalStep === "camera" ? (
            <button
              id="clock-in-capture-btn"
              onClick={() => setModalStep("verifying")}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-bold text-sm flex items-center justify-center gap-2 teal-glow hover:opacity-90 active:scale-95 transition-all"
            >
              <Camera size={16} />
              Capture & Verify
            </button>
          ) : (
            <button
              id="clock-in-confirm-btn"
              disabled={modalStep !== "verified"}
              onClick={onConfirm}
              className={clsx(
                "w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                modalStep === "verified"
                  ? "bg-gradient-to-r from-primary-dark to-primary text-white teal-glow hover:opacity-90 active:scale-95"
                  : "bg-muted/50 text-foreground-muted cursor-not-allowed",
              )}
            >
              {modalStep === "verified" ? (
                <>
                  <LogIn size={16} />
                  Confirm Clock In
                </>
              ) : (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Please wait…
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Scanline animation */}
      <style jsx>{`
        @keyframes scanline {
          0% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// ── Props ────────────────────────────────────────────────────────────────────

export interface AttendanceWidgetProps {
  isClockedIn: boolean;
  checkInTime: Date | null;
  clockOutTime: Date | null;
  todayRecord: AttendanceRecord | null;
  onClockIn: () => void;
  onClockOut: () => void;
}

// ── Main Widget ──────────────────────────────────────────────────────────────────

export default function AttendanceWidget({
  isClockedIn,
  checkInTime,
  clockOutTime,
  todayRecord,
  onClockIn,
  onClockOut,
}: AttendanceWidgetProps) {
  const [showModal, setShowModal] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Live elapsed ticker ────────────────────────────────────────────────────
  useEffect(() => {
    if (isClockedIn && checkInTime) {
      setElapsedSeconds(
        Math.floor((Date.now() - checkInTime.getTime()) / 1000),
      );
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(
          Math.floor((Date.now() - checkInTime.getTime()) / 1000),
        );
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsedSeconds(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isClockedIn, checkInTime]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleClockIn() {
    onClockIn();
    setShowModal(false);
  }

  function handleClockOut() {
    onClockOut();
  }

  function formatElapsed(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function formatHours(h: number) {
    if (h === 0) return "—";
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  }

  const totalHours = isClockedIn
    ? parseFloat((elapsedSeconds / 3600).toFixed(2))
    : (todayRecord?.totalHours ?? 0);
  const productiveHours = parseFloat((totalHours * 0.9).toFixed(2));
  const breakHours = parseFloat((totalHours * 0.1).toFixed(2));
  const overtimeHours = Math.max(0, parseFloat((totalHours - 8).toFixed(2)));

  return (
    <>
      {/* ── Hero Clock-In / Working State Card ── */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Background gradient */}
        <div
          className={clsx(
            "absolute inset-0 transition-all duration-700",
            isClockedIn
              ? "bg-gradient-to-br from-emerald-900/80 via-teal-900/60 to-background-secondary"
              : "bg-gradient-to-br from-primary-dark/80 via-primary/40 to-background-secondary",
          )}
        />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative p-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-white/60 font-medium">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <h2 className="text-lg font-black text-white">
                {isClockedIn ? "🟢 You're Clocked In" : "👋 Good Morning"}
              </h2>
            </div>
            <div
              className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center border",
                isClockedIn
                  ? "bg-success/20 border-success/40 text-success"
                  : "bg-white/10 border-white/20 text-white",
              )}
            >
              <Clock size={18} strokeWidth={2} />
            </div>
          </div>

          {/* ── Idle: Clock In button ── */}
          {!isClockedIn && (
            <div className="text-center py-4 animate-fade-in">
              <p className="text-xs text-white/60 mb-5">
                Mark your attendance for today
              </p>
              <button
                id="clock-in-btn"
                onClick={() => setShowModal(true)}
                className="relative mx-auto flex flex-col items-center gap-1 group"
              >
                {/* Outer pulse ring */}
                <div className="absolute -inset-4 rounded-full border border-primary/30 animate-ping opacity-40" />
                <div className="absolute -inset-2 rounded-full border border-primary/20" />
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-teal-400 flex flex-col items-center justify-center shadow-teal group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                  <LogIn size={28} className="text-white mb-0.5" />
                  <span className="text-[10px] font-bold text-white/90">
                    CLOCK IN
                  </span>
                </div>
              </button>
              <p className="text-[11px] text-white/40 mt-6">
                Tap to start your shift
              </p>
            </div>
          )}

          {/* ── Active: Working state ── */}
          {isClockedIn && (
            <div className="animate-fade-in">
              {/* Elapsed time */}
              <div className="text-center mb-4">
                <p className="text-[11px] text-white/50 mb-1 font-medium uppercase tracking-wider">
                  Session Time
                </p>
                <p className="text-4xl font-black text-white font-mono tracking-tight tabular-nums">
                  {formatElapsed(elapsedSeconds)}
                </p>
                <p className="text-[11px] text-success/80 mt-1">
                  Clocked in at{" "}
                  {checkInTime?.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Verification pills */}
              <div className="flex gap-2 justify-center mb-4">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-success bg-success/15 border border-success/30 px-2.5 py-1 rounded-full">
                  <MapPin size={10} /> Location ✓
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-success bg-success/15 border border-success/30 px-2.5 py-1 rounded-full">
                  <Shield size={10} /> IP ✓
                </span>
              </div>

              {/* Clock out button */}
              <button
                id="clock-out-btn"
                onClick={handleClockOut}
                className="w-full py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20 active:scale-95 transition-all"
              >
                <LogOut size={16} />
                Clock Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Today's Summary Cards ── */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Timer size={14} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Today's Summary</h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            icon={<Clock size={14} className="text-primary" />}
            label="Total Hours"
            value={
              isClockedIn
                ? formatElapsed(elapsedSeconds).slice(0, 5)
                : formatHours(totalHours)
            }
            color="bg-primary/15"
            delay={0}
          />
          <StatCard
            icon={<Zap size={14} className="text-accent" />}
            label="Productive"
            value={formatHours(productiveHours)}
            color="bg-accent/15"
            delay={60}
          />
          <StatCard
            icon={<Coffee size={14} className="text-amber-400" />}
            label="Break Time"
            value={formatHours(breakHours)}
            color="bg-amber-500/15"
            delay={120}
          />
          <StatCard
            icon={<TrendingUp size={14} className="text-violet-400" />}
            label="Overtime"
            value={formatHours(overtimeHours)}
            color="bg-violet-500/15"
            delay={180}
          />
        </div>
      </div>

      {/* ── Clock-In Modal ── */}
      {showModal && (
        <ClockInModal
          onConfirm={handleClockIn}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
