"use client";

import React from "react";
import { SectionCard } from "@/components/shared/Cards";
import { Timeline, TimelineItem } from "@/components/shared/Timeline";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Mail, PenTool, CheckCircle, ShieldAlert, Trash2, Sparkles, Building2 } from "lucide-react";
import { SkillBadge, ScoreBadge } from "@/components/shared/Badges";
import { Link } from "@tanstack/react-router";
import { useDeleteApplication } from "@/lib/firebase/queries";
import { toast } from "sonner";

export function PipelineSidebar({ selectedApp }: { selectedApp: any }) {
  const deleteApp = useDeleteApplication();

  const handleDelete = async () => {
    if (!selectedApp?.id) return;
    try {
      await deleteApp.mutateAsync(selectedApp.id);
      toast.success("Application removed from pipeline.");
    } catch (e: any) {
      toast.error("Failed to remove application: " + e.message);
    }
  };

  if (!selectedApp) {
    return (
      <div className="w-full flex items-center justify-between p-6 rounded-2xl border border-dashed border-border/80 bg-muted/10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <BrainCircuit className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">AI Career Insights</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Click any job card on the board to view targeted AI interview preparation and skill gap recommendations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SectionCard 
      title={`AI Insights: ${selectedApp.company}`} 
      description={`Tailored preparation strategy and skill gap analysis for ${selectedApp.position || 'Software Engineer'}`} 
      className="w-full shadow-2xs"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2 items-stretch">
        
        {/* Column 1: AI Recommended Action */}
        <div className="lg:col-span-4 p-4 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-muted/20 rounded-xl border border-indigo-500/20 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-indigo-500/15">
              <h4 className="text-[11px] uppercase tracking-wider font-bold flex items-center text-indigo-600 dark:text-indigo-400">
                <BrainCircuit className="h-3.5 w-3.5 mr-1.5" /> Recommended Action
              </h4>
              <ScoreBadge score={selectedApp.matchScore ?? selectedApp.match_score} className="text-[10px] px-2 py-0.5 shadow-2xs font-bold" />
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              {(selectedApp.status || selectedApp.stage) === "Technical Interview" 
                ? "Start a Mock Interview covering System Design, algorithms, and distributed systems requirements."
                : "Review your resume bullets and alignment with the target job requisition using the AI Career Coach."}
            </p>
          </div>
          <Link to="/workspace" className="mt-4">
            <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs font-semibold cursor-pointer">
              {(selectedApp.status || selectedApp.stage) === "Technical Interview" ? "Start Mock Interview" : "Open Mission Control"}
            </Button>
          </Link>
        </div>

        {/* Column 2: Missing Skills & Alignment */}
        <div className="lg:col-span-4 p-4 bg-card rounded-xl border border-border/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-bold mb-3 flex items-center text-muted-foreground pb-2 border-b border-border/50">
              <ShieldAlert className="h-3.5 w-3.5 mr-1.5 text-amber-500" /> Critical Skills Alignment
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedApp.missing_skills?.length > 0 ? (
                selectedApp.missing_skills.map((skill: string, i: number) => (
                  <SkillBadge key={i} skill={skill} className="bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-2xs text-xs" />
                ))
              ) : (
                <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">
                  ✓ All core skills aligned with candidate profile
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 pt-2 border-t border-border/40">
            Priority: <b className="capitalize text-foreground">{selectedApp.priority || "Normal"}</b> | Resume Version: <b className="text-foreground">{selectedApp.resumeVersion || "v1"}</b>
          </p>
        </div>

        {/* Column 3: Timeline & Actions */}
        <div className="lg:col-span-4 p-4 bg-card rounded-xl border border-border/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-bold mb-3 text-muted-foreground pb-2 border-b border-border/50">
              Timeline History
            </h4>
            <div className="pl-1">
              <Timeline>
                {(selectedApp.status || selectedApp.stage) === "Technical Interview" && (
                  <TimelineItem 
                    title="Interview Scheduled" 
                    time="Upcoming" 
                    description="Technical round via Zoom."
                    icon={<CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                  />
                )}
                <TimelineItem 
                  title="Assessment Completed" 
                  time="2 days ago" 
                  description="Passed challenge (Score: 92%)."
                  icon={<PenTool className="h-3.5 w-3.5 text-blue-500" />}
                />
                <TimelineItem 
                  title="Application Submitted" 
                  time="1w ago" 
                  description={`Resume ${selectedApp.resumeVersion || 'v1'}.`}
                  icon={<Mail className="h-3.5 w-3.5 text-indigo-500" />}
                  isLast
                />
              </Timeline>
            </div>
          </div>

          {selectedApp.id && (
            <div className="pt-3 border-t border-border/50 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                disabled={deleteApp.isPending}
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 text-xs cursor-pointer"
              >
                <Trash2 className="h-3 w-3 mr-1.5" /> 
                {deleteApp.isPending ? "Removing..." : "Remove Application"}
              </Button>
            </div>
          )}
        </div>

      </div>
    </SectionCard>
  );
}
