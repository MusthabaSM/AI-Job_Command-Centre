import { Bot, FileText, Briefcase, Mic, Bell, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const AGENTS = [
  { id: "career_planner", name: "Career Planner", icon: Target, status: "Active", lastAction: "Updated Roadmap", color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  { id: "resume_analyzer", name: "Resume Analyzer", icon: FileText, status: "Idle", lastAction: "Extracted v3 skills", color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  { id: "ats_optimizer", name: "ATS Optimizer", icon: Bot, status: "Idle", lastAction: "Improved TechCorp match", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { id: "job_matcher", name: "Job Matcher", icon: Briefcase, status: "Thinking...", lastAction: "Evaluating MegaCorp JD", color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  { id: "interview_coach", name: "Interview Coach", icon: Mic, status: "Idle", lastAction: "Generated SD mock", color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  { id: "notification_manager", name: "Notification Manager", icon: Bell, status: "Idle", lastAction: "Sent follow-up alert", color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30" },
];

export function SpecialistList({ activeAgentId, onSelect }: { activeAgentId: string, onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-sm">AI Specialists</h3>
        <p className="text-xs text-muted-foreground mt-1">Select an agent to collaborate</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {AGENTS.map(agent => (
          <div 
            key={agent.id}
            onClick={() => onSelect(agent.id)}
            className={cn(
              "p-3 rounded-xl border cursor-pointer transition-all duration-300",
              activeAgentId === agent.id 
                ? "bg-card border-indigo-500/50 shadow-md ring-1 ring-indigo-500/10 -translate-y-[1px]" 
                : "bg-transparent border-transparent hover:bg-muted/50 hover:shadow-sm"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-sm", agent.bg, agent.color)}>
                <agent.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium truncate text-foreground">{agent.name}</h4>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm",
                    agent.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                    agent.status === "Thinking..." ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse" :
                    "bg-muted text-muted-foreground border border-border"
                  )}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">{agent.lastAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
