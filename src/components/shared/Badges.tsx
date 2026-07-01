import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ScoreBadge({ score, className }: { score: number, className?: string }) {
  let colorClass = "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
  if (score >= 80) colorClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
  else if (score >= 60) colorClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
  else if (score > 0) colorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

  return (
    <div className={cn("inline-flex items-center justify-center font-bold rounded-full px-3 py-1", colorClass, className)}>
      {score}%
    </div>
  );
}

export function StatusChip({ status, className }: { status: string, className?: string }) {
  const statusColors: Record<string, string> = {
    applied: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-400",
    interview: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-900/20 dark:text-purple-400",
    offer: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400",
    rejected: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400",
  };

  const color = statusColors[status.toLowerCase()] || "border-slate-200 bg-muted/10 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400";

  return (
    <Badge variant="outline" className={cn("uppercase text-xs tracking-wider", color, className)}>
      {status}
    </Badge>
  );
}

export function SkillBadge({ skill, className }: { skill: string, className?: string }) {
  return (
    <Badge variant="secondary" className={cn("px-2 py-0.5 font-medium", className)}>
      {skill}
    </Badge>
  );
}
