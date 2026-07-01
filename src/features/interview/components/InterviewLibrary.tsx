import { Calendar, Code2, Users, Layout, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

export function InterviewLibrary({ interviews = [], activeId, onSelect }: { interviews?: any[], activeId: string, onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
        <div>
          <h3 className="font-semibold text-sm">Upcoming Interviews</h3>
          <p className="text-xs text-muted-foreground mt-1">Select a session to prepare</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {interviews.map(item => (
          <div 
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all duration-300",
              activeId === item.id 
                ? "bg-card border-indigo-500/50 shadow-md ring-1 ring-indigo-500/10 -translate-y-[1px]" 
                : "bg-transparent border-transparent hover:bg-muted/50 hover:shadow-sm"
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-sm text-foreground">{item.company || "Company"}</h4>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">Match: {item.matchScore || item.match_score || 0}%</span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">{item.role || item.position || "Role"}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("p-1.5 rounded-lg shadow-sm", item.type === 'System Design' ? 'text-violet-600 bg-violet-500/10 dark:text-violet-400 border border-violet-500/20' : 'text-cyan-600 bg-cyan-500/10 dark:text-cyan-400 border border-cyan-500/20')}>
                <Layout className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-medium text-foreground">{item.type || item.interview_type || 'Interview'}</span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2 border-t border-border/50 pt-3">
              <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {item.date}</span>
              <span className={cn(
                "px-2 py-0.5 rounded-sm font-medium shadow-sm border",
                item.difficulty === "Hard" ? "text-destructive bg-destructive/10 border-destructive/20" : "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
              )}>{item.difficulty}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border bg-muted/20 text-center text-xs text-muted-foreground">
        <div className="inline-flex p-2 bg-indigo-500/10 rounded-full mb-2">
          <BrainCircuit className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <p>AI dynamically adjusts difficulty based on Job Description requirements.</p>
      </div>
    </div>
  );
}
