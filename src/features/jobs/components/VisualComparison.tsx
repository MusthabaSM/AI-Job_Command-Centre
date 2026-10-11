import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, X, Minus, SplitSquareVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function VisualComparison({ matchData }: { matchData?: any }) {
  const missing = matchData?.missing_skills || [];
  const matched = matchData?.matched_skills || [];
  
  let comparisonItems = [];
  if (missing.length === 0 && matched.length === 0) {
    comparisonItems = [{ label: "All Skills", resume: "Match", jd: "Match", match: "full" }];
  } else {
    const matchedItems = matched.map((skill: string) => ({ label: skill, resume: "Match", jd: "Required", match: "full" }));
    const missingItems = missing.map((skill: string) => ({ label: skill, resume: "None", jd: "Required", match: "none" }));
    comparisonItems = [...matchedItems, ...missingItems];
  }

  return (
    <Card className="border border-border shadow-xs flex flex-col h-full">
      <CardHeader className="pb-2.5 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
          <SplitSquareVertical className="h-4 w-4 text-indigo-500" /> Skill Comparison
        </CardTitle>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {comparisonItems.length} Skills
        </span>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-muted/40 border-y border-border px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-6">Skill Category</div>
          <div className="col-span-3 text-center">Your Resume</div>
          <div className="col-span-3 text-right">Job Description</div>
        </div>
        
        {/* Scrollable Table Rows */}
        <div className="divide-y divide-border/50 max-h-[250px] overflow-y-auto pr-0.5">
          {comparisonItems.map((item: any, i: number) => (
            <div key={i} className={cn(
              "grid grid-cols-12 items-center px-3 py-2 text-xs transition-colors",
              item.match === "full" ? "bg-emerald-500/5 hover:bg-emerald-500/10" : 
              item.match === "partial" ? "bg-amber-500/5 hover:bg-amber-500/10" : 
              "bg-destructive/5 hover:bg-destructive/10"
            )}>
              <div className="col-span-6 flex items-center gap-1.5 font-medium text-foreground truncate pr-1" title={item.label}>
                {item.match === "full" && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                {item.match === "partial" && <Minus className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />}
                {item.match === "none" && <X className="h-3.5 w-3.5 text-destructive shrink-0" />}
                <span className="truncate">{item.label}</span>
              </div>
              <div className="col-span-3 text-center">
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded",
                  item.resume === "Match" 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                    : "bg-destructive/10 text-destructive"
                )}>
                  {item.resume}
                </span>
              </div>
              <div className="col-span-3 text-right text-muted-foreground font-medium text-[11px]">
                {item.jd}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
