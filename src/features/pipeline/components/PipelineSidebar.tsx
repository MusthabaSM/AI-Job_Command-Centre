import { SectionCard } from "@/components/shared/Cards";
import { Timeline, TimelineItem } from "@/components/shared/Timeline";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Mail, PenTool, CheckCircle, ShieldAlert } from "lucide-react";
import { SkillBadge } from "@/components/shared/Badges";
import { Link } from "@tanstack/react-router";

export function PipelineSidebar({ selectedApp }: { selectedApp: any }) {
  if (!selectedApp) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-border border-dashed rounded-xl bg-transparent">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 ring-4 ring-background">
          <BrainCircuit className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Select an Application</p>
        <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Click any card on the board to view AI Insights and History.</p>
      </div>
    );
  }

  return (
    <SectionCard title="AI Assistant" description={`Insights for ${selectedApp.company}`} className="h-full flex flex-col">
      <div className="flex-1 space-y-6 mt-4">
        
        <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <BrainCircuit className="h-16 w-16 text-indigo-500" />
          </div>
          <h4 className="text-[10px] uppercase tracking-wider font-bold flex items-center text-indigo-600 dark:text-indigo-400 mb-2 relative z-10">
            <BrainCircuit className="h-3 w-3 mr-1.5" /> Recommended Action
          </h4>
          <p className="text-sm text-foreground/90 leading-relaxed relative z-10 font-medium">
            {(selectedApp.status || selectedApp.stage) === "Technical Interview" 
              ? "Start a Mock Interview covering System Design and specific requirements."
              : "Review your application strategy with the Career Planner."}
          </p>
          <Link to="/workspace">
            <Button size="sm" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 relative z-10">
              {(selectedApp.status || selectedApp.stage) === "Technical Interview" ? "Start Mock Interview" : "Open Mission Control"}
            </Button>
          </Link>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold mb-3 flex items-center text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 mr-2 text-amber-500" /> Missing Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedApp.missing_skills?.length > 0 ? (
              selectedApp.missing_skills.map((skill: string, i: number) => (
                <SkillBadge key={i} skill={skill} className="bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-sm" />
              ))
            ) : (
              <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border">None identified</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold mb-4 text-muted-foreground">Timeline History</h4>
          <div className="pl-2">
            <Timeline>
              {(selectedApp.status || selectedApp.stage) === "Technical Interview" && (
                <TimelineItem 
                  title="Interview Scheduled" 
                  time="Today" 
                  description="Technical round via Zoom."
                  icon={<CheckCircle className="h-4 w-4 text-emerald-500" />}
                />
              )}
              <TimelineItem 
                title="Assessment Completed" 
                time="2 days ago" 
                description="Passed HackerRank challenge (Score: 92%)."
                icon={<PenTool className="h-4 w-4 text-blue-500" />}
              />
              <TimelineItem 
                title="Application Submitted" 
                time="1w ago" 
                description={`Sent optimized Resume ${selectedApp.resumeVersion || 'v1'}.`}
                icon={<Mail className="h-4 w-4 text-indigo-500" />}
                isLast
              />
            </Timeline>
          </div>
        </div>

      </div>
    </SectionCard>
  );
}
