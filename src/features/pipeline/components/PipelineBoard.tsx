"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { ScoreBadge } from "@/components/shared/Badges";
import { cn } from "@/lib/utils";
import { DndContext, DragOverlay, useDroppable, useDraggable } from "@dnd-kit/core";

import { useUpdateApplicationStatus } from "@/lib/lemma/queries";

const STAGES = ["Saved", "Applied", "Online Assessment", "Technical Interview", "HR Interview", "Offer", "Rejected"];

export function PipelineBoard({ applications = [], onSelectApp }: { applications?: any[], onSelectApp: (app: any) => void }) {
  const updateStatus = useUpdateApplicationStatus();
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
    
    // Find the app to check if stage actually changed
    const app = applications.find((a: any) => a.id === id);
    const currentStage = app?.status || app?.stage || 'Saved';
    
    if (app && currentStage !== newStage) {
      await updateStatus.mutateAsync({ id, status: newStage as string });
    }
  };

  const activeApp = activeId ? applications.find((a: any) => a.id === activeId) : null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-[600px] snap-x">
        {STAGES.map((stage) => {
          const stageApps = applications.filter(a => (a.status || a.stage || 'Saved') === stage);
          return (
            <DroppableColumn key={stage} stage={stage} apps={stageApps} onSelectApp={onSelectApp} />
          );
        })}
      </div>
      <DragOverlay>
        {activeApp ? <AppCard app={activeApp} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function DroppableColumn({ stage, apps, onSelectApp }: { stage: string, apps: any[], onSelectApp: (app: any) => void }) {
  const { isOver, setNodeRef } = useDroppable({ id: stage });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-80 rounded-xl border flex flex-col transition-colors duration-300 snap-center",
        isOver ? "bg-indigo-500/10 border-indigo-500/30" : "bg-muted/10 border-border"
      )}
    >
      <div className="p-4 flex justify-between items-center border-b border-border/50">
        <h3 className="font-semibold text-sm text-foreground">{stage}</h3>
        <span className="bg-background border border-border text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm">{apps.length}</span>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        <AnimatePresence>
          {apps.map(app => (
            <DraggableCard key={app.id} app={app} onSelectApp={onSelectApp} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DraggableCard({ app, onSelectApp }: { app: any, onSelectApp: (app: any) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
    data: { app }
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="h-32 bg-indigo-500/10 border-2 border-indigo-500/30 border-dashed rounded-xl" />;
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <AppCard app={app} onClick={() => onSelectApp(app)} />
    </div>
  );
}

function AppCard({ app, onClick, isOverlay = false }: { app: any, onClick?: () => void, isOverlay?: boolean }) {
  return (
    <motion.div
      layout={!isOverlay}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "bg-background p-4 rounded-xl border border-border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-300 relative overflow-hidden min-w-0 max-w-full",
        isOverlay && "rotate-2 shadow-xl border-indigo-500/50 cursor-grabbing",
        app.priority === "high" ? "border-l-4 border-l-destructive" :
        app.priority === "medium" ? "border-l-4 border-l-amber-500" :
        "border-l-4 border-l-muted-foreground/30"
      )}
    >
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm text-foreground truncate w-full">{app.company}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">{app.position}</p>
        </div>
        <ScoreBadge score={app.matchScore} className="text-[10px] px-2 py-1 shadow-sm shrink-0" />
      </div>
      
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground mt-4 font-medium min-w-0">
        <span className="flex items-center bg-muted/50 px-2 py-1 rounded-md min-w-0 truncate"><Calendar className="h-3 w-3 mr-1.5 opacity-70 shrink-0" /> <span className="truncate">{app.applied_date || app.date || "Just now"}</span></span>
        <span className="flex items-center bg-muted/50 px-2 py-1 rounded-md min-w-0 truncate"><Clock className="h-3 w-3 mr-1.5 opacity-70 shrink-0" /> <span className="truncate">{app.resumeVersion || "v1"}</span></span>
      </div>
      {(app.status || app.stage) === "Technical Interview" && (
        <div className="mt-3 text-[10px] uppercase tracking-wider font-bold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-md inline-flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" /> Prep needed
        </div>
      )}
    </motion.div>
  );
}
