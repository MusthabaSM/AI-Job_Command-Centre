"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Sparkles, 
  Layers, 
  RotateCcw,
  GripVertical,
  CheckCircle2
} from "lucide-react";
import { ScoreBadge } from "@/components/shared/Badges";
import { cn } from "@/lib/utils";
import { useUpdateApplicationStatus } from "@/lib/firebase/queries";
import { toast } from "sonner";

export const STAGES = [
  "Saved",
  "Applied",
  "Online Assessment",
  "Technical Interview",
  "HR Interview",
  "Offer",
  "Rejected"
];

// #region Helper Math & Logic for Card Deck
export function wrap(i: number, n: number): number {
  return n ? ((i % n) + n) % n : 0;
}

/** Resting pose of a card `depth` places down the pile. Top 4 show. */
export function deckPose(depth: number, tilt: number, reduce = false) {
  const d = Math.min(depth, 3);
  return {
    y: d ? -d * 14 : 0,
    scale: 1 - d * 0.045,
    rot: depth === 0 || reduce ? 0 : tilt,
    opacity: depth > 3 ? 0 : 1,
    shade: 1 - d * 0.08,
  };
}

/** A stable pseudo-random tilt per card in [-max, max] degrees */
export function tiltFor(i: number, max: number): number {
  const u = (((i + 1) * 2654435761) >>> 0) / 4294967296;
  return (u * 2 - 1) * max;
}

/** Check if swipe ended as a throw */
export function isThrow(dx: number, vx: number, w: number): boolean {
  return Math.abs(dx) > w * 0.25 || (Math.abs(vx) > 0.45 && Math.abs(dx) > 20);
}

export function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

// Parse natural or ISO deadlines into comparable millisecond timestamps
export function parseDeadlineTimestamp(dateStr?: string | null): number {
  if (!dateStr) return Infinity;
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return parsed;

  const lower = dateStr.toLowerCase().trim();
  const now = Date.now();
  if (lower.includes("today")) return now;
  if (lower.includes("tomorrow")) return now + 24 * 60 * 60 * 1000;
  if (lower.startsWith("in ")) {
    const match = lower.match(/\d+/);
    if (match) return now + parseInt(match[0], 10) * 24 * 60 * 60 * 1000;
  }
  if (lower.includes("thu") || lower.includes("thursday")) return now + 3 * 24 * 60 * 60 * 1000;
  if (lower.includes("fri") || lower.includes("friday")) return now + 4 * 24 * 60 * 60 * 1000;
  if (lower.includes("mon") || lower.includes("monday")) return now + 7 * 24 * 60 * 60 * 1000;
  return Infinity;
}

export function getApplicationDeadlineInfo(app: any, interviews: any[] = []): { 
  timestamp: number; 
  label: string; 
  isInterview: boolean;
  type?: string;
} {
  // 1. Look for matching interview
  const interview = interviews.find((i: any) => 
    (i.application_id && (i.application_id === app.id || i.application_id === app.job_id)) ||
    (i.company && app.company && i.company.toLowerCase() === app.company.toLowerCase())
  );

  if (interview) {
    const rawDate = interview.scheduled_at || interview.date;
    const ts = parseDeadlineTimestamp(rawDate);
    return {
      timestamp: ts,
      label: interview.date || (ts !== Infinity ? new Date(ts).toLocaleDateString() : "Interview Scheduled"),
      isInterview: true,
      type: interview.type || "Interview"
    };
  }

  // 2. Check direct application interview date
  if (app.interview_date || app.scheduled_at) {
    const raw = app.interview_date || app.scheduled_at;
    const ts = parseDeadlineTimestamp(raw);
    return {
      timestamp: ts,
      label: raw,
      isInterview: true,
      type: "Interview"
    };
  }

  // 3. Check application deadline
  if (app.deadline || app.deadline_date) {
    const raw = app.deadline || app.deadline_date;
    const ts = parseDeadlineTimestamp(raw);
    return {
      timestamp: ts,
      label: `Deadline: ${raw}`,
      isInterview: false
    };
  }

  // 4. Fallback to applied date
  if (app.applied_date || app.date) {
    const raw = app.applied_date || app.date;
    const ts = parseDeadlineTimestamp(raw);
    return {
      timestamp: ts !== Infinity ? ts : Infinity,
      label: `Applied: ${raw}`,
      isInterview: false
    };
  }

  return {
    timestamp: Infinity,
    label: "No deadline specified",
    isInterview: false
  };
}

/** Sort applications so the one with the LEAST (earliest/soonest) deadline comes FIRST */
export function sortApplicationsByLeastDeadline(apps: any[], interviews: any[] = []): any[] {
  return [...apps].sort((a, b) => {
    const infoA = getApplicationDeadlineInfo(a, interviews);
    const infoB = getApplicationDeadlineInfo(b, interviews);

    // Interviews take priority over non-interviews
    if (infoA.isInterview && !infoB.isInterview) return -1;
    if (!infoA.isInterview && infoB.isInterview) return 1;

    // Least / earliest deadline comes first
    if (infoA.timestamp !== infoB.timestamp) {
      return infoA.timestamp - infoB.timestamp;
    }

    // Secondary priority sort
    const pWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const pA = pWeight[a.priority?.toLowerCase()] || 0;
    const pB = pWeight[b.priority?.toLowerCase()] || 0;
    if (pA !== pB) return pB - pA;

    return 0;
  });
}
// #endregion

type Override = { i: number; x: number; y: number; r: number; mode: "drag" | "fly" | "snap" };

export interface StageCardDeckProps {
  stage: string;
  apps: any[];
  interviews?: any[];
  onSelectApp: (app: any) => void;
  scatter?: number;
}

export function StageCardDeck({
  stage,
  apps = [],
  interviews = [],
  onSelectApp,
  scatter = 5
}: StageCardDeckProps) {
  const updateStatus = useUpdateApplicationStatus();
  const storageKey = `career_pipeline_top_card_${stage}`;

  // 1. Sort apps so the least deadline comes first
  const sortedApps = useMemo(() => {
    return sortApplicationsByLeastDeadline(apps, interviews);
  }, [apps, interviews]);

  const n = sortedApps.length;

  // 2. Active top card index
  const [top, setTop] = useState(0);
  const [over, setOver] = useState<Override | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const busy = useRef(false);
  const topRef = useRef(0);
  topRef.current = top;

  const reduce = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Restore user's last updated card from localStorage, otherwise default to least deadline (index 0)
  useEffect(() => {
    if (n === 0) return;
    try {
      const savedCardId = localStorage.getItem(storageKey);
      if (savedCardId) {
        const foundIdx = sortedApps.findIndex(a => a.id === savedCardId);
        if (foundIdx !== -1) {
          setTop(foundIdx);
          return;
        }
      }
    } catch (e) {
      // localStorage may fail in restricted mode
    }
    setTop(0);
  }, [sortedApps, storageKey, n]);

  const later = (fn: () => void, ms: number) => window.setTimeout(fn, ms);

  // Throw the top card off toward direction and tuck it under the deck
  const throwTop = useCallback(
    (dirX: number, fromX = 0, fromY = 0, dirY = 0) => {
      const w = deckRef.current?.offsetWidth || 280;
      if (busy.current || n < 2) return;
      busy.current = true;
      const i = topRef.current;
      const sx = dirX >= 0 ? 1 : -1;
      setOver({ i, x: fromX + sx * w * 1.15, y: fromY + dirY * 0.3 - 25, r: sx * 14, mode: "fly" });
      
      later(() => {
        setOver(null);
        const next = wrap(topRef.current + 1, n);
        setTop(next);
        // Persist newly active top card
        const nextApp = sortedApps[next];
        if (nextApp?.id) {
          try {
            localStorage.setItem(storageKey, nextApp.id);
          } catch (e) {}
        }
        busy.current = false;
      }, reduce ? 180 : 380);
    },
    [n, reduce, sortedApps, storageKey]
  );

  // Pull the bottom card back on top from the opposite side
  const pullBack = useCallback(() => {
    const w = deckRef.current?.offsetWidth || 280;
    if (busy.current || n < 2) return;
    busy.current = true;
    const i = wrap(topRef.current - 1, n);
    setOver({ i, x: -w * 1.15, y: -25, r: -14, mode: "snap" });
    
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setOver({ i, x: 0, y: 0, r: 0, mode: "fly" });
        later(() => {
          setOver(null);
          setTop(i);
          // Persist newly active top card
          const nextApp = sortedApps[i];
          if (nextApp?.id) {
            try {
              localStorage.setItem(storageKey, nextApp.id);
            } catch (e) {}
          }
          busy.current = false;
        }, reduce ? 180 : 400);
      })
    );
  }, [n, reduce, sortedApps, storageKey]);

  // Pointer drag tracking
  const drag = useRef<null | { x: number; y: number; lx: number; lt: number; vx: number; isDrag: boolean }>(null);
  const staticClickRef = useRef<{ x: number; y: number } | null>(null);

  const onDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    // Don't drag-throw if clicking interactive buttons or select controls
    if (target.closest("button") || target.closest("select") || target.closest("a") || target.closest("[data-no-throw='1']")) {
      return;
    }
    if (busy.current || n <= 1 || (e.pointerType === "mouse" && e.button !== 0)) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, lx: e.clientX, lt: e.timeStamp, vx: 0, isDrag: false };
  };

  const onMove = (e: React.PointerEvent) => {
    e.stopPropagation();
    const d = drag.current;
    if (!d) return;
    const dt = Math.max(1, e.timeStamp - d.lt);
    d.vx = 0.8 * ((e.clientX - d.lx) / dt) + 0.2 * d.vx;
    d.lx = e.clientX;
    d.lt = e.timeStamp;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      d.isDrag = true;
    }

    setOver({ i: topRef.current, x: dx, y: dy, r: reduce ? 0 : dx * 0.04, mode: "drag" });
  };

  const onUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const w = deckRef.current?.offsetWidth || 260;

    if (isThrow(dx, d.vx, w)) {
      throwTop(dx, dx, dy, dy);
    } else {
      setOver(null);
      // If it was just a click and not a drag, open the card details
      if (!d.isDrag) {
        const currentApp = sortedApps[top];
        if (currentApp) onSelectApp(currentApp);
      }
    }
  };

  // Static card click handler (when n === 1 and card is NOT movable)
  const onStaticDown = (e: React.PointerEvent) => {
    staticClickRef.current = { x: e.clientX, y: e.clientY };
  };

  const onStaticUp = (e: React.PointerEvent, app: any) => {
    if (!staticClickRef.current) return;
    const dx = Math.abs(e.clientX - staticClickRef.current.x);
    const dy = Math.abs(e.clientY - staticClickRef.current.y);
    staticClickRef.current = null;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("select") || target.closest("a") || target.closest("[data-no-throw='1']")) {
      return;
    }
    // Only open app details if it was a clean stationary click
    if (dx < 6 && dy < 6) {
      onSelectApp(app);
    }
  };

  const handleStageChange = async (appId: string, newStage: string) => {
    try {
      await updateStatus.mutateAsync({ id: appId, status: newStage });
      toast.success(`Application moved to ${newStage}`);
    } catch (err: any) {
      toast.error("Failed to move application: " + err.message);
    }
  };

  const handleResetToLeastDeadline = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}
    setTop(0);
    toast.info("Reset to least upcoming deadline on top.");
  };

  if (n === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-36 border border-dashed border-border/60 rounded-xl text-center bg-muted/5 p-3">
        <Layers className="h-5 w-5 text-muted-foreground/40 mb-1.5" />
        <p className="text-xs text-muted-foreground font-medium">No applications in this stage</p>
        <span className="text-[10px] text-muted-foreground/60 mt-0.5">Drop a card here or add new</span>
      </div>
    );
  }

  const currentApp = sortedApps[top] || sortedApps[0];
  const isLeastDeadlineActive = top === 0;

  return (
    <div data-card-deck="1" className="flex flex-col h-full min-h-[230px] justify-between select-none">
      {/* 3D Stacked Deck Pile */}
      <div 
        ref={deckRef}
        className="relative w-full h-[190px] touch-pan-y"
      >
        {sortedApps.map((app, i) => {
          const depth = wrap(i - top, n);
          const p = deckPose(depth, tiltFor(i, scatter), reduce);
          const o = over && over.i === i ? over : null;
          const isTopCard = depth === 0;
          const isMovable = n > 1; // Not movable if there is only 1 card in this section!
          const isDraggable = isTopCard && isMovable;
          const deadlineInfo = getApplicationDeadlineInfo(app, interviews);

          const transform = o
            ? `translate3d(${o.x}px, ${o.y}px, 0) rotate(${o.r}deg)`
            : `translateY(${p.y}px) scale(${p.scale}) rotate(${p.rot.toFixed(2)}deg)`;

          return (
            <div
              key={app.id || i}
              data-top={isTopCard ? "1" : "0"}
              data-card-movable={isDraggable ? "1" : "0"}
              className={cn(
                "absolute inset-0 rounded-xl border bg-card p-3 flex flex-col justify-between transition-all duration-300 overflow-hidden",
                isDraggable 
                  ? "cursor-grab active:cursor-grabbing shadow-lg touch-none" 
                  : isTopCard 
                    ? "cursor-pointer shadow-lg hover:shadow-xl hover:border-indigo-500/40 transition-shadow" 
                    : "pointer-events-none shadow-md",
                o?.mode === "drag" && "cursor-grabbing shadow-2xl transition-none",
                o?.mode === "fly" && "transition-transform duration-400 ease-out opacity-40",
                app.priority === "high" ? "border-l-4 border-l-destructive border-border/80" :
                app.priority === "medium" ? "border-l-4 border-l-amber-500 border-border/80" :
                "border-l-4 border-l-indigo-500/40 border-border/80"
              )}
              style={{
                transform,
                zIndex: o ? n + 2 : n - depth,
                opacity: o ? 1 : p.opacity,
                filter: o || isTopCard ? "none" : `brightness(${p.shade})`,
                willChange: isMovable ? "transform" : "auto",
              }}
              onPointerDown={isDraggable ? onDown : (isTopCard ? onStaticDown : undefined)}
              onPointerMove={isDraggable ? onMove : undefined}
              onPointerUp={isDraggable ? onUp : (isTopCard ? (e) => onStaticUp(e, app) : undefined)}
              onPointerCancel={isDraggable ? onUp : undefined}
            >
              {/* Card Header & Content */}
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <div className="h-6 w-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <Building2 className="h-3 w-3 text-indigo-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-foreground truncate block leading-snug" title={app.company}>
                        {app.company}
                      </h4>
                      <p className="text-[10px] text-muted-foreground truncate block leading-tight mt-0.5" title={app.position}>
                        {app.position}
                      </p>
                    </div>
                  </div>
                  <ScoreBadge score={app.matchScore ?? app.match_score} className="text-[9px] px-1.5 py-0.5 shrink-0 shadow-2xs font-bold" />
                </div>

                {/* Deadline & Urgency Banner */}
                <div className={cn(
                  "p-1 rounded-md border text-[10px] flex items-center justify-between gap-1",
                  deadlineInfo.isInterview 
                    ? "bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-400"
                    : "bg-muted/40 border-border/60 text-muted-foreground"
                )}>
                  <div className="flex items-center gap-1 min-w-0">
                    <Calendar className="h-2.5 w-2.5 shrink-0" />
                    <span className="truncate font-semibold text-[10px]">
                      {deadlineInfo.label}
                    </span>
                  </div>
                  {i === 0 && (
                    <span className="text-[8px] font-extrabold uppercase tracking-wider px-1 py-0.2 rounded bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-300 shrink-0">
                      Least
                    </span>
                  )}
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-1 text-[9px] text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/40 font-medium flex items-center gap-0.5">
                    <Clock className="h-2 w-2 opacity-60" /> {app.resumeVersion || "v1"}
                  </span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded font-semibold capitalize",
                    app.priority === "high" ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" :
                    app.priority === "medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" :
                    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  )}>
                    {app.priority || "Normal"}
                  </span>
                  {(app.status || app.stage) === "Technical Interview" && (
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold flex items-center gap-0.5">
                      <Sparkles className="h-2 w-2" /> Prep Needed
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Quick Move Stage & Details Link */}
              <div className="pt-1 border-t border-border/50 flex items-center justify-between gap-1 mt-1" data-no-throw="1">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-[8px] font-semibold text-muted-foreground uppercase">Move:</span>
                  <select
                    value={app.status || app.stage || stage}
                    onChange={(e) => handleStageChange(app.id, e.target.value)}
                    className="text-[9px] font-medium bg-muted/50 border border-border rounded px-1 py-0.5 text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[95px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectApp(app);
                  }}
                  className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer shrink-0"
                >
                  Insights →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deck Navigation Controls */}
      {n > 1 && (
        <div className="flex items-center justify-between pt-1 border-t border-border/40 mt-1 px-1">
          <button
            type="button"
            onClick={pullBack}
            className="h-5 w-5 rounded border border-border/60 bg-muted/30 hover:bg-muted text-foreground flex items-center justify-center cursor-pointer transition-colors"
            title="Previous Card"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>

          <div className="flex items-center gap-1 text-[10px] font-mono">
            <span className="text-foreground font-bold">{pad2(top + 1)}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{pad2(n)}</span>
            {!isLeastDeadlineActive && (
              <button
                type="button"
                onClick={handleResetToLeastDeadline}
                className="text-[9px] text-muted-foreground hover:text-indigo-500 ml-1 transition-colors cursor-pointer"
                title="Reset to Least Deadline on Front"
              >
                <RotateCcw className="h-2 w-2 inline" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => throwTop(1)}
            className="h-5 w-5 rounded border border-border/60 bg-muted/30 hover:bg-muted text-foreground flex items-center justify-center cursor-pointer transition-colors"
            title="Next Card (Swipe)"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
