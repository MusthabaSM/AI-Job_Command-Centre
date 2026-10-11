"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Compass, 
  Bookmark, 
  Send, 
  FileCode2, 
  BrainCircuit, 
  Users, 
  Trophy, 
  XCircle,
  Calendar,
  Building2,
  Clock,
  Layers,
  ArrowRight
} from "lucide-react";
import { ScoreBadge } from "@/components/shared/Badges";
import { cn } from "@/lib/utils";
import { useUpdateApplicationStatus } from "@/lib/firebase/queries";
import { STAGES, getApplicationDeadlineInfo, sortApplicationsByLeastDeadline, StageCardDeck } from "./StageCardDeck";
import { toast } from "sonner";

export interface PipelineCircularGalleryProps {
  applications?: any[];
  interviews?: any[];
  onSelectApp: (app: any) => void;
  radius?: number;
  autoRotateSpeed?: number;
}

const STAGE_THEMES: Record<string, { icon: any; color: string; bg: string; border: string; text: string }> = {
  "Saved": {
    icon: Bookmark,
    color: "from-indigo-500/20 to-blue-500/10",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400"
  },
  "Applied": {
    icon: Send,
    color: "from-blue-500/20 to-cyan-500/10",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-600 dark:text-blue-400"
  },
  "Online Assessment": {
    icon: FileCode2,
    color: "from-cyan-500/20 to-teal-500/10",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-600 dark:text-cyan-400"
  },
  "Technical Interview": {
    icon: BrainCircuit,
    color: "from-amber-500/20 to-orange-500/10",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400"
  },
  "HR Interview": {
    icon: Users,
    color: "from-purple-500/20 to-pink-500/10",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-600 dark:text-purple-400"
  },
  "Offer": {
    icon: Trophy,
    color: "from-emerald-500/20 to-teal-500/10",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400"
  },
  "Rejected": {
    icon: XCircle,
    color: "from-rose-500/20 to-slate-500/10",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-600 dark:text-rose-400"
  }
};

export function PipelineCircularGallery({
  applications = [],
  interviews = [],
  onSelectApp,
  radius = 410,
  autoRotateSpeed = 0.08
}: PipelineCircularGalleryProps) {
  const [rotation, setRotation] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ x: number; startRotation: number; lastX: number; lastTime: number; vx: number } | null>(null);
  const hasDraggedRef = useRef(false);

  const n = STAGES.length;
  const anglePerItem = 360 / n;

  // Track closest stage in front as rotation changes
  useEffect(() => {
    // Stage at 0deg is the one closest to -rotation % 360
    const normalizedRot = ((-rotation % 360) + 360) % 360;
    const closestIdx = Math.round(normalizedRot / anglePerItem) % n;
    setActiveStageIndex(closestIdx);
  }, [rotation, anglePerItem, n]);

  // Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;

    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      setRotation((prev) => prev - autoRotateSpeed * (dt / 16));
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating, isDragging, autoRotateSpeed]);

  // Pointer drag to spin the 3D gallery
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Gesture Isolation: If user is interacting with a movable card or controls, don't drag 3D orbit
    if (
      target.closest("button") || 
      target.closest("select") || 
      target.closest("a") || 
      target.closest("[data-card-movable='1']") ||
      target.closest("[data-no-orbit='1']")
    ) {
      return;
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      startRotation: rotation,
      lastX: e.clientX,
      lastTime: e.timeStamp,
      vx: 0
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const d = dragStartRef.current;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 6) {
      hasDraggedRef.current = true;
    }
    const dt = Math.max(1, e.timeStamp - d.lastTime);
    d.vx = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastTime = e.timeStamp;

    // Convert pixel delta into angular rotation (0.28 deg per px)
    setRotation(d.startRotation + dx * 0.28);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const d = dragStartRef.current;
    dragStartRef.current = null;
    setIsDragging(false);

    // If flicked with velocity, apply small momentum snap
    if (Math.abs(d.vx) > 0.4) {
      const extraAngle = d.vx * 30;
      snapToNearest(rotation + extraAngle);
    } else {
      snapToNearest(rotation);
    }
  };

  // Snap to the nearest stage angle
  const snapToNearest = (currentAngle: number) => {
    const rawTarget = Math.round(currentAngle / anglePerItem) * anglePerItem;
    setRotation(rawTarget);
  };

  // Rotate smoothly to specific stage
  const rotateToStage = (index: number) => {
    const targetAngle = -index * anglePerItem;
    // Find closest rotation equivalent to avoid full spinning
    const currentNorm = (rotation % 360 + 360) % 360;
    const targetNorm = (targetAngle % 360 + 360) % 360;
    let diff = targetNorm - currentNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    setRotation((prev) => prev + diff);
  };

  const handlePrevStage = () => {
    const nextIdx = (activeStageIndex - 1 + n) % n;
    rotateToStage(nextIdx);
  };

  const handleNextStage = () => {
    const nextIdx = (activeStageIndex + 1) % n;
    rotateToStage(nextIdx);
  };

  return (
    <div className="relative w-full rounded-2xl border border-border/80 bg-gradient-to-b from-card/80 via-card/40 to-background/90 p-4 overflow-hidden shadow-sm flex flex-col justify-between min-h-[560px]">
      {/* 3D Orbit Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50 z-20 relative">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Compass className="h-4 w-4 text-indigo-500 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              Circular 3D Pipeline
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                {STAGES[activeStageIndex]} in focus
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Revolving 3D progress ring. Drag horizontally or click any stage to rotate.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto rotate toggle */}
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer",
              isAutoRotating 
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs" 
                : "bg-muted/40 hover:bg-muted text-foreground border-border/60"
            )}
          >
            {isAutoRotating ? (
              <>
                <Pause className="h-3 w-3" /> Orbiting
              </>
            ) : (
              <>
                <Play className="h-3 w-3" /> Auto Orbit
              </>
            )}
          </button>

          {/* Quick prev / next buttons */}
          <div className="flex items-center bg-muted/40 p-0.5 rounded-lg border border-border/50">
            <button
              type="button"
              onClick={handlePrevStage}
              className="h-7 w-7 rounded-md hover:bg-muted text-foreground flex items-center justify-center transition-colors cursor-pointer"
              title="Previous Stage"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextStage}
              className="h-7 w-7 rounded-md hover:bg-muted text-foreground flex items-center justify-center transition-colors cursor-pointer"
              title="Next Stage"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stage Fast-Pills Dock */}
      <div className="flex items-center justify-center gap-1.5 py-2 overflow-x-auto z-20 relative">
        {STAGES.map((stage, idx) => {
          const isActive = idx === activeStageIndex;
          const theme = STAGE_THEMES[stage] || STAGE_THEMES["Saved"];
          const Icon = theme.icon;
          const count = applications.filter((a) => (a.status || a.stage || "Saved") === stage).length;

          return (
            <button
              key={stage}
              type="button"
              onClick={() => rotateToStage(idx)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105"
                  : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-3 w-3" />
              <span>{stage}</span>
              <span className={cn(
                "text-[9px] px-1 py-0.2 rounded-full font-bold",
                isActive ? "bg-white/20 text-white" : "bg-muted text-foreground"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3D Perspective Gallery Viewport */}
      <div
        ref={containerRef}
        role="region"
        aria-label="3D Circular Pipeline Gallery"
        className="relative w-full h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: "1800px" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-radial from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

        {/* 3D Rotating Cylinder */}
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
            transition: isDragging ? "none" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {STAGES.map((stage, i) => {
            const itemAngle = i * anglePerItem;
            // Angle relative to front camera (0deg is facing directly toward user)
            const totalRotation = ((rotation % 360) + 360) % 360;
            const relativeAngle = ((itemAngle + totalRotation) % 360 + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);

            // Opacity: high in front, fades as it turns around the back of the cylinder
            const opacity = Math.max(0.2, 1 - (normalizedAngle / 160));
            const isFacingFront = normalizedAngle < 35;
            const theme = STAGE_THEMES[stage] || STAGE_THEMES["Saved"];
            const Icon = theme.icon;

            const stageApps = applications.filter((a) => (a.status || a.stage || "Saved") === stage);

            return (
              <div
                key={stage}
                role="group"
                aria-label={stage}
                className="absolute w-[270px] h-[295px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-135px",
                  marginTop: "-147px",
                  opacity: opacity,
                  transition: isDragging ? "opacity 0.15s linear" : "opacity 0.4s ease, transform 0.6s ease",
                  zIndex: Math.round(100 - normalizedAngle),
                  pointerEvents: "auto"
                }}
              >
                {/* Stage Card in 3D Space */}
                <div 
                  className={cn(
                    "relative w-full h-full rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-300",
                    isFacingFront 
                      ? "bg-card/95 backdrop-blur-md shadow-2xl border-indigo-500/40 ring-1 ring-indigo-500/20" 
                      : "bg-card/60 backdrop-blur-xs shadow-md border-border/80 cursor-pointer hover:border-indigo-500/40 hover:scale-[1.02]"
                  )}
                  onClick={(e) => {
                    if (!isFacingFront && !hasDraggedRef.current) {
                      e.stopPropagation();
                      rotateToStage(i);
                    }
                  }}
                >
                  {/* Stage Card Header */}
                  <div 
                    className={cn(
                      "p-2.5 border-b flex items-center justify-between bg-gradient-to-r select-none",
                      theme.color,
                      theme.border,
                      isFacingFront && "cursor-grab active:cursor-grabbing"
                    )}
                    title={isFacingFront ? "Drag header to rotate pipeline" : "Click to bring to front"}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn("h-6 w-6 rounded-md flex items-center justify-center shrink-0 border", theme.bg, theme.border)}>
                        <Icon className={cn("h-3 w-3", theme.text)} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-foreground truncate">{stage}</h4>
                        <span className="text-[9px] text-muted-foreground font-medium block">
                          Stage {i + 1} of {n}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-background/80 border border-border shadow-2xs">
                        {stageApps.length} {stageApps.length === 1 ? "Job" : "Jobs"}
                      </span>
                    </div>
                  </div>

                  {/* Stage Card Body with Stacked Card Deck */}
                  <div 
                    className={cn(
                      "flex-1 p-2 overflow-hidden flex flex-col justify-between bg-card/40",
                      !isFacingFront && "pointer-events-none opacity-85"
                    )}
                  >
                    <StageCardDeck 
                      stage={stage} 
                      apps={stageApps} 
                      interviews={interviews}
                      onSelectApp={onSelectApp}
                      scatter={4}
                    />
                  </div>

                  {/* Stage Bottom Footer */}
                  <div 
                    className={cn(
                      "p-2 border-t border-border/40 bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground select-none",
                      isFacingFront && "cursor-grab active:cursor-grabbing"
                    )}
                    title={isFacingFront ? "Drag footer to rotate pipeline" : "Click to bring to front"}
                  >
                    <span className="font-medium">
                      {isFacingFront ? "Active Stage (Swipe cards below)" : "Click stage to focus"}
                    </span>
                    {!isFacingFront && (
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1">
                        Focus <ArrowRight className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Side Navigation Chevrons */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevStage();
          }}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 h-9 w-9 rounded-full bg-card/85 hover:bg-card border border-border/80 hover:border-indigo-500/50 backdrop-blur-md shadow-md flex items-center justify-center text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer hover:scale-110 active:scale-95"
          title="Previous Stage"
          aria-label="Previous Stage"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNextStage();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 h-9 w-9 rounded-full bg-card/85 hover:bg-card border border-border/80 hover:border-indigo-500/50 backdrop-blur-md shadow-md flex items-center justify-center text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer hover:scale-110 active:scale-95"
          title="Next Stage"
          aria-label="Next Stage"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Orbit Footer Info */}
      <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2 z-20 relative">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          Jobs in each stage are ordered with the <b>least interview deadline</b> first.
        </span>
        <span className="text-[11px] opacity-80 hidden sm:inline">
          Tip: Swipe left/right on any card to flip through that stage's job deck.
        </span>
      </div>
    </div>
  );
}
