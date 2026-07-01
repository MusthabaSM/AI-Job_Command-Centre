import { Database, Code, CheckCircle, Activity, Settings2, Clock, ArrowRight } from "lucide-react";
import { Timeline, TimelineItem } from "@/components/shared/Timeline";

export function ExecutionInspector() {
  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div>
          <h3 className="font-semibold text-sm">Execution Inspector</h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            System Online — 5 agents active
          </p>
        </div>
        <Settings2 className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Active Workflow</h4>
          <div className="card-elevation rounded-xl p-3 text-sm">
            <p className="font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Activity className="size-3" />
              career_planner_generation
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Generating tasks based on TechCorp interview schedule</p>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2">
              <span className="flex items-center gap-1"><Clock className="size-3" /> Elapsed</span>
              <span className="font-mono text-foreground font-medium">1.2s</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Live Trace</h4>
          <Timeline>
            <TimelineItem 
              title="Career Planner Agent" 
              description="Initiated task generation based on new interview schedule."
              icon={<Settings2 className="h-4 w-4 text-indigo-500" />}
            />
            <TimelineItem 
              title="Reading Database" 
              description="Queried interviews (3 rows), career_scores (1 row), resumes (1 row)."
              icon={<Database className="h-4 w-4 text-cyan-500" />}
            />
            <TimelineItem 
              title="Delegated to Job Matcher" 
              description="Requested skill diff for TechCorp Senior Frontend Engineer JD."
              icon={<Activity className="h-4 w-4 text-violet-500" />}
            />
            <TimelineItem 
              title="Function Executed" 
              description="calculate_job_match(resume_id=res-1, job_id=job-1) → 92%"
              icon={<Code className="h-4 w-4 text-fuchsia-500" />}
            />
            <TimelineItem 
              title="Updating Records" 
              description="Wrote 4 new tasks to career_tasks table."
              icon={<Database className="h-4 w-4 text-emerald-500" />}
            />
            <TimelineItem 
              title="Workflow Complete" 
              time="Status: OK · 1.2s"
              description="Generated 4 prioritized career tasks successfully."
              icon={<CheckCircle className="h-4 w-4 text-emerald-500" />}
              isLast
            />
          </Timeline>
        </div>

        {/* Backend Resources Summary */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Backend Resources</h4>
          <div className="space-y-2">
            {[
              { name: 'resumes', rows: 2, status: 'healthy' },
              { name: 'jobs', rows: 3, status: 'healthy' },
              { name: 'applications', rows: 3, status: 'healthy' },
              { name: 'interviews', rows: 3, status: 'healthy' },
              { name: 'career_tasks', rows: 4, status: 'healthy' },
              { name: 'career_scores', rows: 1, status: 'healthy' },
            ].map((table) => (
              <div key={table.name} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-muted/30 transition-colors">
                <span className="flex items-center gap-1.5 font-mono text-foreground">
                  <Database className="size-3 text-cyan-500" />
                  {table.name}
                </span>
                <span className="text-muted-foreground">{table.rows} rows</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
