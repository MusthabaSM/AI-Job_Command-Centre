import { SectionCard } from "@/components/shared/Cards";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Clock, AlertCircle, Target } from "lucide-react";

const RoadmapItem = ({ title, priority, difficulty, impact, time }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 border border-border rounded-xl bg-background shadow-sm hover:border-indigo-500/30 hover:shadow-md hover:bg-muted/20 transition-all duration-300">
    <div className="mb-4 sm:mb-0">
      <div className="flex items-start sm:items-center gap-2 mb-1 min-w-0">
        <h4 className="font-semibold text-sm text-foreground truncate min-w-0">{title}</h4>
        {priority === "High" && <AlertCircle className="h-3.5 w-3.5 text-destructive animate-pulse shrink-0" />}
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-muted-foreground mt-2 font-medium">
        <span className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 whitespace-nowrap"><ArrowUpRight className="h-3 w-3 mr-1 shrink-0" /> +{impact}% Impact</span>
        <span className="flex items-center whitespace-nowrap"><Clock className="h-3 w-3 mr-1 opacity-70 shrink-0" /> {time}</span>
        <span className="flex items-center opacity-80 whitespace-nowrap">Diff: {difficulty}</span>
      </div>
    </div>
    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-sm shadow-indigo-500/20 rounded-lg">Execute Task</Button>
  </div>
);

export function PlannerRoadmap({ tasks = [] }: { tasks?: any[] }) {
  if (!tasks || tasks.length === 0) {
    return (
      <SectionCard title="AI Strategic Roadmap" description="Your personalized path to maximum hireability." className="col-span-full xl:col-span-2 h-full">
        <div className="flex flex-col items-center justify-center h-[calc(100%-60px)] min-h-[300px] border border-dashed border-border bg-muted/5 rounded-xl p-12 text-center mt-4">
          <Target className="h-10 w-10 mb-4 text-slate-400 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">No Career Tasks Generated</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">Upload a resume and analyze jobs to let AI generate a strategic roadmap of actionable tasks.</p>
        </div>
      </SectionCard>
    );
  }

  const immediate = tasks.filter(t => t.priority?.toLowerCase() === "critical" || t.priority?.toLowerCase() === "high");
  const thisWeek = tasks.filter(t => t.priority?.toLowerCase() === "medium");
  const longTerm = tasks.filter(t => t.priority?.toLowerCase() === "low");

  return (
    <SectionCard title="AI Strategic Roadmap" description="Your personalized path to maximum hireability." className="col-span-full xl:col-span-2">
      <div className="space-y-6 mt-4">
        
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 ml-1">Immediate (Today)</h3>
          <div className="space-y-3">
            {immediate.length > 0 ? immediate.map(t => (
              <RoadmapItem key={t.id} title={t.title} priority={t.priority} impact="5" time="45 mins" difficulty="Hard" />
            )) : <p className="text-sm text-muted-foreground pl-1">No immediate tasks.</p>}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 ml-1">This Week</h3>
          <div className="space-y-3">
            {thisWeek.length > 0 ? thisWeek.map(t => (
              <RoadmapItem key={t.id} title={t.title} priority={t.priority} impact="12" time="4 hours" difficulty="Medium" />
            )) : <p className="text-sm text-muted-foreground pl-1">No tasks for this week.</p>}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 ml-1">Long Term</h3>
          <div className="space-y-3 opacity-70">
            {longTerm.length > 0 ? longTerm.map(t => (
              <RoadmapItem key={t.id} title={t.title} priority={t.priority} impact="8" time="2 weeks" difficulty="Hard" />
            )) : <p className="text-sm text-muted-foreground pl-1">No long-term tasks.</p>}
          </div>
        </div>

      </div>
    </SectionCard>
  );
}
