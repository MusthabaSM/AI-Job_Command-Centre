"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, AlertCircle, Layers, ListFilter, Sparkles, Building2, Compass, LayoutGrid } from "lucide-react";
import { ScoreBadge } from "@/components/shared/Badges";
import { cn } from "@/lib/utils";
import { DndContext, DragOverlay, useDroppable, useDraggable } from "@dnd-kit/core";
import { useUpdateApplicationStatus, useInterviews } from "@/lib/firebase/queries";
import { StageCardDeck, STAGES, getApplicationDeadlineInfo, sortApplicationsByLeastDeadline } from "./StageCardDeck";
import { PipelineCircularGallery } from "./PipelineCircularGallery";

export function PipelineBoard({ 
  applications = [], 
  onSelectApp 
}: { 
  applications?: any[], 
  onSelectApp: (app: any) => void 
}) {
  const updateStatus = useUpdateApplicationStatus();
  const { data: interviews = [] } = useInterviews();
  // Default to 3D Circular Orbit as requested!
  const [boardLayout, setBoardLayout] = useState<"circular" | "kanban">("circular");
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    
    const id = active.id;
    const newStage = over.id;
    
    const app = applications.find((a: any) => a.id === id);
    const currentStage = app?.status || app?.stage || 'Saved';
    
    if (app && currentStage !== newStage) {
      await updateStatus.mutateAsync({ id, status: newStage as string });
    }
  };

  const activeApp = activeId ? applications.find((a: any) => a.id === activeId) : null;

  return (
    <div className="space-y-4">
      {/* Top Layout Mode Switcher */}
      <div className="flex items-center justify-between bg-card/60 backdrop-blur-xs p-2 rounded-xl border border-border/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Pipeline Layout:
          </span>
        </div>

        <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => setBoardLayout("circular")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
              boardLayout === "circular"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Compass className="h-3.5 w-3.5" /> 3D Circular Orbit
          </button>
          <button
            type="button"
            onClick={() => setBoardLayout("kanban")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
              boardLayout === "kanban"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Classic Columns
          </button>
        </div>
      </div>

      {/* Render 3D Circular Orbit or Classic Columns */}
      {boardLayout === "circular" ? (
        <PipelineCircularGallery 
          applications={applications}
          interviews={interviews}
          onSelectApp={onSelectApp}
        />
      ) : (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[380px] snap-x">
            {STAGES.map((stage) => {
              const stageApps = applications.filter(a => (a.status || a.stage || 'Saved') === stage);
              return (
                <DroppableColumn 
                  key={stage} 
                  stage={stage} 
                  apps={stageApps} 
                  interviews={interviews}
                  onSelectApp={onSelectApp} 
                />
              );
            })}
          </div>
          <DragOverlay>
            {activeApp ? <AppCard app={activeApp} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

function DroppableColumn({ 
  stage, 
  apps, 
  interviews = [],
  onSelectApp 
}: { 
  stage: string, 
  apps: any[], 
  interviews?: any[],
  onSelectApp: (app: any) => void 
}) {
  const { isOver, setNodeRef } = useDroppable({ id: stage });
  const [viewMode, setViewMode] = useState<"deck" | "list">("deck");

  const sortedApps = React.useMemo(() => {
    return sortApplicationsByLeastDeadline(apps, interviews);
  }, [apps, interviews]);

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-72 md:w-[280px] rounded-2xl border flex flex-col transition-colors duration-300 snap-center shadow-xs",
        isOver ? "bg-indigo-500/10 border-indigo-500/40" : "bg-card/60 backdrop-blur-xs border-border/80"
      )}
    >
      {/* Column Header */}
      <div className="p-3.5 flex justify-between items-center border-b border-border/60 bg-muted/20 rounded-t-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-bold text-sm text-foreground truncate">{stage}</h3>
          <span className="bg-background border border-border text-[11px] px-2 py-0.5 rounded-full font-bold shadow-2xs">
            {apps.length}
          </span>
        </div>

        {apps.length > 1 && (
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/50">
            <button
              type="button"
              onClick={() => setViewMode("deck")}
              className={cn(
                "p-1 rounded-md transition-colors cursor-pointer text-xs",
                viewMode === "deck" 
                  ? "bg-background text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Stacked Card Deck View"
            >
              <Layers className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1 rounded-md transition-colors cursor-pointer text-xs",
                viewMode === "list" 
                  ? "bg-background text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Expanded List View"
            >
              <ListFilter className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      
      {/* Column Content */}
      <div className="flex-1 p-3 overflow-y-auto">
        {viewMode === "deck" ? (
          <StageCardDeck 
            stage={stage} 
            apps={apps} 
            interviews={interviews}
            onSelectApp={onSelectApp} 
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {sortedApps.map(app => (
                <DraggableCard 
                  key={app.id} 
                  app={app} 
                  interviews={interviews} 
                  onSelectApp={onSelectApp} 
                  disabled={apps.length <= 1}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function DraggableCard({ 
  app, 
  interviews = [],
  onSelectApp,
  disabled = false
}: { 
  app: any, 
  interviews?: any[],
  onSelectApp: (app: any) => void,
  disabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
    data: { app },
    disabled
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="h-32 bg-indigo-500/10 border-2 border-indigo-500/30 border-dashed rounded-xl" 
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...(!disabled ? listeners : {})} {...(!disabled ? attributes : {})}>
      <AppCard 
        app={app} 
        interviews={interviews} 
        onClick={() => onSelectApp(app)} 
        isMovable={!disabled}
      />
    </div>
  );
}

function AppCard({ 
  app, 
  interviews = [],
  onClick, 
  isOverlay = false,
  isMovable = true
}: { 
  app: any, 
  interviews?: any[],
  onClick?: () => void, 
  isOverlay?: boolean,
  isMovable?: boolean
}) {
  const deadlineInfo = getApplicationDeadlineInfo(app, interviews);

  return (
    <motion.div
      layout={!isOverlay}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "bg-background p-3.5 rounded-xl border border-border shadow-2xs transition-all duration-300 relative overflow-hidden min-w-0 max-w-full",
        isMovable ? "cursor-grab active:cursor-grabbing hover:shadow-md" : "cursor-pointer hover:shadow-md",
        isOverlay && "rotate-2 shadow-xl border-indigo-500/50 cursor-grabbing",
        app.priority === "high" ? "border-l-4 border-l-destructive" :
        app.priority === "medium" ? "border-l-4 border-l-amber-500" :
        "border-l-4 border-l-muted-foreground/30"
      )}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm text-foreground truncate w-full">{app.company}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">{app.position}</p>
        </div>
        <ScoreBadge score={app.matchScore ?? app.match_score} className="text-[10px] px-2 py-0.5 shadow-2xs shrink-0 font-bold" />
      </div>

      {/* Deadline Info */}
      <div className={cn(
        "p-1.5 rounded-md border text-[11px] flex items-center justify-between gap-1 mb-2",
        deadlineInfo.isInterview 
          ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold"
          : "bg-muted/40 border-border/50 text-muted-foreground"
      )}>
        <span className="flex items-center gap-1 truncate">
          <Calendar className="h-3 w-3 shrink-0" /> {deadlineInfo.label}
        </span>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground font-medium min-w-0">
        <span className="flex items-center bg-muted/50 px-2 py-0.5 rounded-md min-w-0 truncate">
          <Clock className="h-3 w-3 mr-1 opacity-70 shrink-0" /> <span className="truncate">{app.resumeVersion || "v1"}</span>
        </span>
        <span className="capitalize px-2 py-0.5 rounded-md bg-muted/50">
          {app.priority || "Normal"}
        </span>
      </div>

      {(app.status || app.stage) === "Technical Interview" && (
        <div className="mt-2 text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md inline-flex items-center">
          <Sparkles className="h-3 w-3 mr-1" /> Prep needed
        </div>
      )}
    </motion.div>
  );
}
