import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function VisualComparison({ matchData }: { matchData?: any }) {
  const missing = matchData?.missing_skills || [];
  
  const comparisonItems = missing.length > 0 
    ? missing.map((skill: string) => ({ label: skill, resume: "None", jd: "Required", match: "none" }))
    : [{ label: "All Skills", resume: "Match", jd: "Match", match: "full" }];

  return (
    <div className="border border-border rounded-xl overflow-hidden mt-6 shadow-sm">
      <div className="grid grid-cols-12 bg-muted/40 border-b border-border">
        <div className="col-span-4 p-3 font-semibold text-xs tracking-wider uppercase text-muted-foreground">Skill Category</div>
        <div className="col-span-4 p-3 font-semibold text-xs tracking-wider uppercase text-muted-foreground border-l border-r border-border text-center">Your Resume</div>
        <div className="col-span-4 p-3 font-semibold text-xs tracking-wider uppercase text-muted-foreground text-center">Job Description</div>
      </div>
      
      <div className="divide-y divide-border/50">
        {comparisonItems.map((item: any, i: number) => (
          <div key={i} className={cn(
            "grid grid-cols-12 text-sm transition-colors",
            item.match === "full" ? "bg-emerald-500/5 hover:bg-emerald-500/10" : 
            item.match === "partial" ? "bg-amber-500/5 hover:bg-amber-500/10" : 
            "bg-destructive/5 hover:bg-destructive/10"
          )}>
            <div className="col-span-4 p-3 flex items-center gap-2 font-medium text-foreground">
              {item.match === "full" && <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              {item.match === "partial" && <Minus className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
              {item.match === "none" && <X className="h-4 w-4 text-destructive" />}
              {item.label}
            </div>
            <div className="col-span-4 p-3 border-l border-r border-border/50 flex items-center justify-center text-center text-muted-foreground">
              {item.resume}
            </div>
            <div className="col-span-4 p-3 flex items-center justify-center text-center text-muted-foreground">
              {item.jd}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
